from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import path
from pong.consumers import GameConsumer
application = ProtocolTypeRouter({
    'websocket': URLRouter([
        path('ws/pong/', GameConsumer.as_asgi()),
    ])
})