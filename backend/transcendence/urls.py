from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, re_path
from transcendence import views
urlpatterns = [
	path('', views.home, name='home'),
	re_path(r'^.*$', views.home, name='home'),
]
