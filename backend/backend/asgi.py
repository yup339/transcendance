import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Import WebSocket routing from each app
from up.routing import urlpatterns as up_websocket_urlpatterns
from pong.routing import urlpatterns as pong_websocket_urlpatterns

# Combine the WebSocket routing patterns
combined_websocket_urlpatterns = up_websocket_urlpatterns + pong_websocket_urlpatterns

# Define the ASGI application
application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": URLRouter(combined_websocket_urlpatterns),  # Route WebSocket URLs using the combined routing configuration
})