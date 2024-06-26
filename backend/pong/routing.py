from django.urls import path
from pong import consumers

urlpatterns = [
    path("ws/pong", consumers.PongConsumer.as_asgi()),
]

