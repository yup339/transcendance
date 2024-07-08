import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

from pong.routing import urlpatterns  # Import WebSocket routing from the game app


pong_asgi = get_asgi_application()
# Define the ASGI application
application = ProtocolTypeRouter({
    "http": pong_asgi,
    "websocket": URLRouter(urlpatterns),  # Route WebSocket URLs using the game app's routing configuration
})