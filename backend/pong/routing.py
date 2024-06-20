from django.urls import path
from pong import consumers

urlpatterns = [
    path("ws/pong", consumers.GameConsumer.as_asgi()),
]

