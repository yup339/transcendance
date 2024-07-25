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
                    if self.user_token in logged_in_users:
                        del logged_in_users[self.user_token]
                    del pending_tokens[self.user_token]
                    print(f"User disconnected: {self.channel_name}")
    
        async def receive(self, text_data):
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
                elif data_type == 'update_stats':
                    await self.update_stats(data)
                elif data_type == 'get_stats':
                    await self.get_stats(data)
                else:
                    print(f"Unknown message type: {data_type}")
            except json.JSONDecodeError as e:
                print(f"JSON decoding error: {str(e)}")
            except AttributeError as e:
                print(f"AttributeError: {str(e)}")


        async def validate_stats(self, data):
            if not all(key in data for key in ['pong_won', 'pong_lost', 'paddle_hits', 'ball_travel_distance', 'pong_online_game_played', 'pong_offline_game_played', 'up_won', 'up_lost', 'up_drawn', 'jump_count', 'travelled_distance', 'up_online_game_played', 'up_offline_game_played']):
                await self.send(text_data=json.dumps({
                    'type': 'update_stats_error',
                    'message': 'Missing stats data'
                }))
                return False
            #check for data types except key 'type'
            for key in data:
                if key != 'type' and key != 'ball_travel_distance' and not isinstance(data[key], int):
                    await self.send(text_data=json.dumps({
                        'type': 'update_stats_error',
                        'message': 'Invalid stats data'
                    }))
                    return False
                if key == 'type' and not isinstance(data[key], str):
                    await self.send(text_data=json.dumps({
                        'type': 'update_stats_error',
                        'message': 'Invalid stats data'
                    }))
                    return False
                if key == 'ball_travel_distance' and not isinstance(data[key], float):
                    await self.send(text_data=json.dumps({
                        'type': 'update_stats_error',
                        'message': 'Invalid stats data'
                    }))
            return True

        async def get_stats(self, data):
            from pong.models import User
            from pong.models import PongStats
            from pong.models import UpStats
            if self.user_token:
                user = await sync_to_async(User.objects.get)(username=self.username)
                pong_stats = (await sync_to_async(PongStats.objects.get_or_create)(user=user))[0]
                up_stats = (await sync_to_async(UpStats.objects.get_or_create)(user=user))[0]
                await self.send(text_data=json.dumps({
                    'type': 'update_stats',

                    'pong_won': pong_stats.games_won,
                    'pong_lost': pong_stats.games_lost,
                    'paddle_hits': pong_stats.paddle_hits,
                    'ball_travel_distance': pong_stats.ball_travel_distance,
                    'pong_online_game_played': pong_stats.online_game_played,
                    'pong_offline_game_played': pong_stats.offline_game_played,

                    'up_won': up_stats.games_won,
                    'up_lost': up_stats.games_lost,
                    'up_drawn': up_stats.games_drawn,
                    'jump_count': up_stats.jump_count,
                    'travelled_distance': up_stats.travelled_distance,
                    'up_online_game_played': up_stats.online_game_played,
                    'up_offline_game_played': up_stats.offline_game_played
                }))
                print(f"User stats sent: {self.username}")
            else:
                await self.send(text_data=json.dumps({
                    'type': 'get_stats_error',
                    'message': 'User not logged in'
                }))

        async def update_stats(self, data):
            from pong.models import User
            from pong.models import PongStats
            from pong.models import UpStats
            if self.user_token and await self.validate_stats(data):
                user = await sync_to_async(User.objects.get)(username=self.username)
                #update stats for pong in Pongstats
                pong_stats = (await sync_to_async(PongStats.objects.get_or_create)(user=user))[0]
                pong_stats.games_won += data.get('pong_won', 0)
                pong_stats.games_lost += data.get('pong_lost', 0)
                pong_stats.paddle_hits += data.get('paddle_hits', 0)
                pong_stats.ball_travel_distance += data.get('ball_travel_distance', 0)
                pong_stats.online_game_played += data.get('pong_online_game_played', 0)
                pong_stats.offline_game_played += data.get('pong_offline_game_played', 0)
                await sync_to_async(pong_stats.save)()
                #update stats for up in Upstats
                up_stats = (await sync_to_async(UpStats.objects.get_or_create)(user=user))[0]
                up_stats.games_won += data.get('up_won', 0)
                up_stats.games_lost += data.get('up_lost', 0)
                up_stats.games_drawn += data.get('up_drawn', 0)
                up_stats.jump_count += data.get('jump_count', 0)
                up_stats.travelled_distance += data.get('travelled_distance', 0)
                up_stats.online_game_played += data.get('up_online_game_played', 0)
                up_stats.offline_game_played += data.get('up_offline_game_played', 0)
                await sync_to_async(up_stats.save)()
                await sync_to_async(user.save)()
                print(f"User stats updated: {self.username}")
                await self.get_stats(data)
            else:
                await self.send(text_data=json.dumps({
                    'type': 'update_stats_error',
                    'message': 'User not logged in'
                })) 

        async def token_login(self, data):
            token = data.get('token')
            if token in pending_tokens:
                self.user_token = token
                self.username = logged_in_users[token].username
                logged_in_users[token] = self
                del pending_tokens[token]
                await self.send(text_data=json.dumps({
                    'type': 'token_login_success',
                    'username': logged_in_users[token].username,
                    'token': token
                }))
                await self.get_stats(data)
                print(f"User logged in with token: {token}")
            else:
                await self.send(text_data=json.dumps({
                    'type': 'login_error',
                    'message': 'Invalid token'
                }))

        async def register_user(self, data):
            from pong.models import User
            username = data.get('username')
            if len(username) > 15:
                await self.send(text_data=json.dumps({
                    'type': 'registration_error',
                    'message': 'Username too long'
                }))
                return
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
                if len(password) > 100:
                    await self.send(text_data=json.dumps({
                        'type': 'registration_error',
                        'message': 'Password too long'
                    }))
                    return
                hashed_password = make_password(password)
                user.hashed_password = hashed_password
                self.username = username
                self.user_token = default_token_generator.make_token(user)
                logged_in_users[self.user_token] = self
                await self.send(text_data=json.dumps({
                    'type': 'registration_success',
                    'username': username,
                    'token': self.user_token
                }))
                await self.get_stats(data)
                print(f"User registered: {username}")
                await sync_to_async(user.save)()
        
        async def login_user(self, data):
            from pong.models import User
            username = data.get('username')
            if len(username) > 15:
                await self.send(text_data=json.dumps({
                    'type': 'login_error',
                    'message': 'Username too long'
             }))
                return
            password = data.get('password')
            if len(password) > 100:
                await self.send(text_data=json.dumps({
                    'type': 'login_error',
                    'message': 'Password too long'
                }))
                return
            userbase = User.objects.all()
            try:
                user = await sync_to_async(userbase.get)(username=username)
            except User.DoesNotExist:
                user = None
            if user:
                if await sync_to_async(check_password)(password, user.hashed_password):
                    self.username = username
                    self.user_token = default_token_generator.make_token(user)
                    for user in logged_in_users:
                        if logged_in_users[user].username == username:
                            await self.send(text_data=json.dumps({
                                'type': 'login_error',
                                'message': 'User already logged in'
                            }))
                            return
                    logged_in_users[self.user_token] = self
                    await self.send(text_data=json.dumps({
                        'type': 'login_success',
                        'username': username,
                        'token': self.user_token
                    }))
                    await self.get_stats(data)
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
                self.user_token = ''
                print(f"User logged out: {self.username}")
                self.username = ''
            else:
                await self.send(text_data=json.dumps({
                    'type': 'logout_error',
                    'message': 'User not logged in'
                }))
                    
class PongConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        await self.accept()
        self.side = 'no side yet'
        self.score = 0

    async def disconnect(self, close_code):
        if self in pong_queue :
            print ("removing self from queue")
            pong_queue.remove(self)
        if hasattr(self, 'match_group_name'):
            await self.channel_layer.group_send(
                self.match_group_name,
                {
                    'type': 'leaver',
                    'side':  self.side
                }
            )
            print ("removing self from active match")
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
        print(pong_queue)

    async def leaver(self, data):
        if (data['side'] != self.side): 
            await self.send(text_data=json.dumps({
                    'type': 'leaver',
                }
            ))


    async def receive(self, text_data):
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
                    'dy': data['dy'],
                    'side': self.side
                }
        )

            elif data['type'] == 'userInit':
                self.username = data['username']
                print(f"User {self.username} connected")
                pong_queue.append(self)
                print("connection to the pong server")
                #queue_lock.acquire()
                if len(pong_queue) >= 2:
                    player1 = pong_queue.pop(0)
                    player2 = pong_queue.pop(0)
                    self.match_group_name = generate_match_group_name()            
                    await self.create_match(player1, player2, self.match_group_name)
                #queue_lock.release()

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

            elif data['type'] == 'scorePoint':
                await self.channel_layer.group_send(
                data['group'],
                {
                    'type': 'scorePoint',
                    'side': self.side,
                    'scoringSide': data['side']
                }
            )
            else : 
                print("unknown datatype")
                

        except json.JSONDecodeError as e:
            print(f"JSON decoding error: {str(e)}")
        except KeyError as e:
            print(f"KeyError: Missing key {str(e)} in received data.")

    async def scorePoint(self, data):
        if (data['side'] != self.side):
            self.score += 1
            print("score for {} is {}".format(self.side, self.score))
        await self.send(text_data=json.dumps({
                'type': 'SCCCCOOOORRRREEEEE',
                'side': data['scoringSide']
            }
        ))

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
            'side': 'right',
            'left': player2.username,
            'right': player1.username
        }))
        await player2.send(text_data=json.dumps({
            'type': 'matchFound',
            'group': group_name,
            'side': 'left',
            'left': player2.username,
            'right': player1.username
        }))
        player2.side = 'left'
        player1.side = 'right'
        print(f"Match created: {group_name} with players {player1.channel_name} and {player2.channel_name}")

    async def ballPositionSync(self, data):
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