# models.py
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

# Custom user manager
class MyUserManager(BaseUserManager):
    def create_user(self, username, password=None):
        if not username:
            raise ValueError('Users must have a username')
        user = self.model(username=username)
        user.hashed_password = password
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None):
        user = self.create_user(username=username, password=password)
        user.is_admin = True
        user.save(using=self._db)
        return user

# Custom user model
class User(AbstractBaseUser):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=25, unique=True)
    hashed_password = models.TextField()

    objects = MyUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.username
    
    def set_password(self, password):
        self.hashed_password = password

    def check_password(self, password):
        return self.hashed_password == password
    
    class Meta:
        db_table = 'users'
        managed = False

class PongStats(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    games_won = models.IntegerField(default=0)
    games_lost = models.IntegerField(default=0)
    paddle_hits = models.IntegerField(default=0)
    ball_travel_distance = models.IntegerField(default=0)
    online_game_played = models.IntegerField(default=0)
    offline_game_played = models.IntegerField(default=0)

    def __str__(self):
        return f'Pong Stats for {self.user.username}'

    class Meta:
        db_table = 'pong_stats'
        managed = False

class UpStats(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    games_won = models.IntegerField(default=0)
    games_lost = models.IntegerField(default=0)
    games_drawn = models.IntegerField(default=0)
    jump_count = models.IntegerField(default=0)
    travelled_distance = models.IntegerField(default=0)
    online_game_played = models.IntegerField(default=0)
    offline_game_played = models.IntegerField(default=0)

    def __str__(self):
        return f'Up Stats for {self.user.username}'

    class Meta:
        db_table = 'up_stats'
        managed = False
