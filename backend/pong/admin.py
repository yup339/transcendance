from django.contrib import admin
from .models import User, PongStats, UpStats

# Register your models here.
admin.site.register(User)
admin.site.register(PongStats)
admin.site.register(UpStats)
