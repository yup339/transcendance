from django.urls import path
from up import consumers

urlpatterns = [
	path("ws/up", consumers.upConsumer.as_asgi()),

]

