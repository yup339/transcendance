import json
import uuid
import time
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer

pong_queue = []
active_matches = {}

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