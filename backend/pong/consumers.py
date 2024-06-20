import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer

logger = logging.getLogger(__name__)


class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        logger.info("sometime tries to connect here :):):)")
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        # Process incoming messages
        pass