import json
import logging
import uuid
import time
import threading
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer

up_queue = []
active_matches = {}

logger = logging.getLogger(__name__)

class upConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        await self.accept()
        self.side = 'no side yet'
        up_queue.append(self)
        print("connection to the up server")
        if len(up_queue) >= 2:
            player1 = up_queue.pop(0)
            player2 = up_queue.pop(0)
            self.match_group_name = generate_match_group_name()            
            await self.create_match(player1, player2, self.match_group_name)

    async def disconnect(self, close_code):
        if self in up_queue :
            print ("removing self from queue")
            up_queue.remove(self)
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

    async def leaver(self, data):
        if (data['side'] != self.side): 
            await self.send(text_data=json.dumps({
                    'type': 'leaver',
                }
            ))

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            
            if isinstance(data, list):
                platform_positions = []
                for object in data:
                    platform_positions.append(object)

                await self.channel_layer.group_send(
                    self.match_group_name,
                    {
                        'type': 'platformSetUp',
                        'pos': platform_positions,
                        'side': self.side
                    })


            elif data['type'] == 'playerPosition':
                await self.channel_layer.group_send(
                    self.match_group_name,
                    {
                        'type': 'playerPosition',
                        'side' : self.side,
                        'x': data['x'],
                        'y': data['y'],
                    })
            elif data['type'] == 'gameReady':
                await self.channel_layer.group_send(
                    self.match_group_name,
                    {
                        'type': 'startosgamos',
                    })
            else : 
                print("unknown datatype")
                

        except json.JSONDecodeError as e:
            print(f"JSON decoding error: {str(e)}")
        except KeyError as e:
            print(f"KeyError: Missing key {str(e)} in received data.")

    async def platformSetUp(self, data):
        if (data['side'] != self.side):
            await self.send(text_data=json.dumps({
                    'type': 'platformSetUp',
                    'pos': data['pos'],
                }
            ))

    async def playerPosition(self, data):
        if (data['side'] != self.side):
            await self.send(text_data=json.dumps({
                    'type': 'playerPosition',
                    'side': data['side'],
                    'x': data['x'],
                    'y': data['y'],
                }
            ))

    async def startosgamos(self, data):
        await self.send(text_data=json.dumps({
                'type': 'startosgamos',
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

def generate_match_group_name(prefix='up_match'):
        # Generate a unique suffix using current timestamp and a random component
        unique_suffix = uuid.uuid4().hex[:8]  # Using part of a UUID for uniqueness
        timestamp_suffix = str(int(time.time()))[-6:]  # Last 6 digits of current timestamp

        # Combine prefix, timestamp, and random suffix to form the group name
        group_name = f"{prefix}_{timestamp_suffix}_{unique_suffix}"

        return group_name