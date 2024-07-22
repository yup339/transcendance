import asyncio
import json
import logging
import uuid
import time
import threading
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from django.contrib.auth.hashers import make_password, check_password
from asgiref.sync import sync_to_async
from django.contrib.auth.tokens import default_token_generator

logged_in_users = {}
pong_queue = []
active_matches = {}
queue_lock = threading.Lock()
pending_tokens = {}

logger = logging.getLogger(__name__)

class UserConsumer(AsyncWebsocketConsumer):

        user_token = None
        username = None

        async def connect(self):
            await self.accept()
            print("connection to the user server")
    
        async def disconnect(self, close_code):
            if self.user_token:
                pending_tokens[self.user_token] = True
                await asyncio.sleep(5)
                if self.user_token in pending_tokens:
                    del logged_in_users[self.user_token]
                    del pending_tokens[self.user_token]
                    print(f"User disconnected: {self.channel_name}")
    
        async def receive(self, text_data):
            logger.info(f"Received message: {text_data}")
            try:
                data = json.loads(text_data)
                data_type = data.get('type')
    
                if data_type == 'register':
                    await self.register_user(data)
                elif data_type == 'login':
                    await self.login_user(data)
                elif data_type == 'token_login':
                    await self.token_login(data)
                elif data_type == 'logout':
                    await self.logout_user(data)
                else:
                    print(f"Unknown message type: {data_type}")
            except json.JSONDecodeError as e:
                print(f"JSON decoding error: {str(e)}")
            

        async def token_login(self, data):
            token = data.get('token')
            if token in pending_tokens:
                self.user_token = token
                self.username = logged_in_users[token].username
                logged_in_users[token] = self
                del pending_tokens[token]
                await self.send(text_data=json.dumps({
                    'type': 'login_success',
                    'username': logged_in_users[token].username,
                    'token': token
                }))
                print(f"User logged in with token: {token}")
            else:
                await self.send(text_data=json.dumps({
                    'type': 'login_error',
                    'message': 'Invalid token'
                }))

        async def register_user(self, data):
            from pong.models import User
            username = data.get('username')
            userbase = User.objects.all()
            try:
                user = await sync_to_async(userbase.get)(username=username)
            except User.DoesNotExist:
                user = None
            if user:
                await self.send(text_data=json.dumps({
                    'type': 'registration_error',
                    'message': 'Username already taken'
                }))
            elif not data.get('password'):
                await self.send(text_data=json.dumps({
                    'type': 'registration_error',
                    'message': 'Password cannot be empty'
                }))
            else:
                user = await sync_to_async(userbase.create)(username=username)
                password = data.get('password')
                hashed_password = make_password(password)
                user.password = hashed_password
                self.username = username
                self.user_token = default_token_generator.make_token(user)
                logged_in_users[self.user_token] = self
                await self.send(text_data=json.dumps({
                    'type': 'registration_success',
                    'username': username,
                    'token': self.user_token
                }))
                print(f"User registered: {username}")
                await sync_to_async(user.save)()
        
        async def login_user(self, data):
            from pong.models import User
            username = data.get('username')
            password = data.get('password')
            userbase = User.objects.all()
            try:
                user = await sync_to_async(userbase.get)(username=username)
            except User.DoesNotExist:
                user = None
            if user:
                if await sync_to_async(check_password)(password, user.password):
                    self.username = username
                    self.user_token = default_token_generator.make_token(user)
                    logged_in_users[self.user_token] = self
                    await self.send(text_data=json.dumps({
                        'type': 'login_success',
                        'username': username,
                        'token': self.user_token
                    }))
                    print(f"User logged in: {username}")
                else:
                    await self.send(text_data=json.dumps({
                        'type': 'login_error',
                        'message': 'Invalid password' #TODO: change to 'Invalid username or password' Keeping it for debugging purposes
                    }))
            else:
                await self.send(text_data=json.dumps({
                    'type': 'login_error',
                    'message': 'User not found' #TODO: change to 'Invalid username or password'
                }))
        
        async def logout_user(self, data):
            if self.user_token:
                del logged_in_users[self.user_token]
                await self.send(text_data=json.dumps({
                    'type': 'logout_success',
                    'username': self.username
                }))
                print(f"User logged out: {self.username}")
            else:
                await self.send(text_data=json.dumps({
                    'type': 'logout_error',
                    'message': 'User not logged in'
                }))
                    
class PongConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        await self.accept()
        self.side = 'no side yet'
        pong_queue.append(self)
        print("connection to the pong server")
        if len(pong_queue) >= 2:
            player1 = pong_queue.pop(0)
            player2 = pong_queue.pop(0)
            self.match_group_name = generate_match_group_name()            
            await self.create_match(player1, player2, self.match_group_name)

    async def disconnect(self, close_code):
        if hasattr(self, 'match_group_name'):
            players = active_matches.get(self.match_group_name, [])
            if self in players:
                players.remove(self)
                if not players:
                    del active_matches[self.match_group_name]
                await self.channel_layer.group_discard(
                    self.match_group_name,
                    self.channel_name
                )
                print(f"Player disconnected: {self.channel_name}")
        else:
            queue_lock.acquire()
            pong_queue.remove(self)
            queue_lock.release()
            print(f"Player disconnected from queue: {self.channel_name}")

    async def receive(self, text_data):
        print("receiving data")
        try:
            data = json.loads(text_data)
            
            if data['type'] == 'ballPosition':
               await self.channel_layer.group_send(
                data['group'],
                {
                    'type': 'ballPositionSync',
                    'x': data['x'],
                    'y': data['y'],
                    'dx': data['dx'],
                    'dy': data['dy']
                }
        )

            elif data['type'] == 'paddlePosition':
               await self.channel_layer.group_send(
                data['group'],
                {
                    'type': 'paddlePositionSync',
                    'x': data['x'],
                    'y': data['y'],
                    'up': data['up'],
                    'down': data['down'],
                    'side': data['side']
                }
        )

            else : 
                print("unknown datatype")
                

        except json.JSONDecodeError as e:
            print(f"JSON decoding error: {str(e)}")
        except KeyError as e:
            print(f"KeyError: Missing key {str(e)} in received data.")

    async def create_match(self, player1, player2, group_name):
        player1.match_group_name = group_name
        player2.match_group_name = group_name
        active_matches[group_name] = [player1, player2]

        await self.channel_layer.group_add(
            group_name,
            player1.channel_name
        )
        await self.channel_layer.group_add(
            group_name,
            player2.channel_name
        )

        await player1.send(text_data=json.dumps({
            'type': 'matchFound',
            'group': group_name,
            'side': 'right'
        }))
        await player2.send(text_data=json.dumps({
            'type': 'matchFound',
            'group': group_name,
            'side': 'left'
        }))
        player2.side = 'left'
        player1.side = 'right'
        print(f"Match created: {group_name} with players {player1.channel_name} and {player2.channel_name}")

    async def ballPositionSync(self, data):
        print("sending ball position")
        await self.send(text_data=json.dumps({
                'type': 'ballPositionSync',
                'x': data['x'],
                'y': data['y'],
                'dx': data['dx'],
                'dy': data['dy']
            }
        ))

    async def paddlePositionSync(self, data):
        if (data['side'] != self.side):  #dont send to ourself
            await self.send(text_data=json.dumps({
                    'type': 'paddlePositionSync',
                    'x': data['x'],
                    'y': data['y'],
                    'up': data['up'],
                    'down': data['down']
                }
            ))
def generate_match_group_name(prefix='pong_match'):
        # Generate a unique suffix using current timestamp and a random component
        unique_suffix = uuid.uuid4().hex[:8]  # Using part of a UUID for uniqueness
        timestamp_suffix = str(int(time.time()))[-6:]  # Last 6 digits of current timestamp

        # Combine prefix, timestamp, and random suffix to form the group name
        group_name = f"{prefix}_{timestamp_suffix}_{unique_suffix}"

        return group_name