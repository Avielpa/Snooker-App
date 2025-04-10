from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework import serializers
from .models import Event, MatchesOfAnEvent, Ranking, Player, UpcomingMatch



class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirmPassword = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'confirmPassword')

    def validate(self, data):
        if data['password'] != data['confirmPassword']:
            raise serializers.ValidationError("Passwords must match.")
        return data

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'], password=validated_data['password'])
        Token.objects.create(user=user)
        return user




class EventSerializer(serializers.ModelSerializer):
    active = serializers.BooleanField(read_only=True)  # Add active field
    past = serializers.BooleanField(read_only=True)    # Add past field

    class Meta:
        model = Event
        fields = '__all__'


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = '__all__'

class RankingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ranking
        fields = '__all__'

class UpcomingMatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = UpcomingMatch
        fields = '__all__'

class MatchesOfAnEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = MatchesOfAnEvent
        fields = '__all__'

