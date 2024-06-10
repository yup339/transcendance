import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from pong.routing import websocket_urlpatterns  # Import WebSocket routing from the game app

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Define the ASGI application
application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": URLRouter(websocket_urlpatterns),  # Route WebSocket URLs using the game app's routing configuration
})