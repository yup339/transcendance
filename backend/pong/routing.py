from django.urls import path
from pong import consumers

urlpatterns = [
    path("ws/pong", consumers.PongConsumer.as_asgi()),
    path("ws/user", consumers.UserConsumer.as_asgi()),
	path("ws/up", consumers.UpConsumer.as_asgi()),

]

