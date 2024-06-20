from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import backend.websocket_routing

application = ProtocolTypeRouter({
    "websocket": AuthMiddlewareStack(
        URLRouter(
            backend.websocket_routing.websocket_urlpatterns
        )
    ),
})