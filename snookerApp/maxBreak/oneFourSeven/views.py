# from asyncio import Event
# from django.contrib.auth.models import User

# from rest_framework import viewsets, status, generics
# from rest_framework.response import Response
# from rest_framework.permissions import IsAuthenticated, AllowAny
# from rest_framework_simplejwt.tokens import RefreshToken
# from rest_framework.decorators import api_view, permission_classes


# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.response import Response
# from rest_framework.permissions import AllowAny

# from maxBreak.oneFourSeven.models import Player, Ranking

# from .serializers import EventSerializer, PlayerSerializer, RankingSerializer, UserSerializer

# from .scraper import (
#     get_season_events,
#     get_players_m,
#     get_players_w,
#     get_ranking,
#     get_player_by_id,
#     get_tour_details,
#     get_upcoming_matches
# )

# class EventList(generics.ListAPIView):
#     queryset = Event.objects.all()
#     serializer_class = EventSerializer

# class PlayerList(generics.ListAPIView):
#     queryset = Player.objects.all()
#     serializer_class = PlayerSerializer

# class RankingList(generics.ListAPIView):
#     queryset = Ranking.objects.all()
#     serializer_class = RankingSerializer

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def season_events_view(request):
#     """API endpoint for season events."""
#     events = get_season_events()
#     if events:
#         return Response(events)
#     return Response({"error": "Failed to retrieve season events."}, status=500)

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def players_m_view(request):
#     """API endpoint for men players' details."""
#     players = get_players_m()
#     if players:
#         return Response(players)
#     return Response({"error": "Failed to retrieve men players' details."}, status=500)

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def players_w_view(request):
#     """API endpoint for women players' details."""
#     players = get_players_w()
#     if players:
#         return Response(players)
#     return Response({"error": "Failed to retrieve women players' details."}, status=500)

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def ranking_view(request):
#     """API endpoint for ranking."""
#     ranking = get_ranking()
#     if ranking:
#         return Response(ranking)
#     return Response({"error": "Failed to retrieve ranking."}, status=500)

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def player_by_id_view(request, player_id):
#     """API endpoint for player details by ID."""
#     player = get_player_by_id(player_id)
#     if player:
#         return Response(player)
#     return Response({"error": "Failed to retrieve player details."}, status=500)

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def upcoming_matches_view(request):
#     """API endpoint for upcoming matches."""
#     matches = get_upcoming_matches()
#     if matches:
#         return Response(matches)
#     return Response({"error": "Failed to retrieve upcoming matches."}, status=500)

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def tour_details_view(request, event_id):
#     """API endpoint for tour details by event ID."""
#     tour_details = get_tour_details(event_id)
#     if tour_details:
#         return Response(tour_details)
#     return Response({"error": "Failed to retrieve tour details."}, status=500)



# # התחברות - החזרת טוקן
# @api_view(['POST'])
# @permission_classes([AllowAny]) 
# def login(request):
#     username = request.data.get('username')
#     password = request.data.get('password')

#     user = User.objects.filter(username=username).first()
#     if user and user.check_password(password):
#         refresh = RefreshToken.for_user(user)
#         return Response({'access': str(refresh.access_token), 'refresh': str(refresh)}, status=status.HTTP_200_OK)
    
#     return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

# # התנתקות - מחיקת הטוקן
# @api_view(['POST'])
# def logout(request):
#     request.user.auth_token.delete()  # מחיקת הטוקן של המשתמש הנוכחי
#     return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)

# class UserViewSet(viewsets.ModelViewSet):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer
#     permission_classes = (AllowAny,)  


from django.contrib.auth.models import User
from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes

from .models import Player, Ranking, Event
from .serializers import EventSerializer, PlayerSerializer, RankingSerializer, UserSerializer

from .scraper import (
    get_season_events,
    get_players_m,
    get_players_w,
    get_ranking,
    get_player_by_id,
    get_tour_details,
    get_upcoming_matches
)

class EventList(generics.ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

class PlayerList(generics.ListAPIView):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer

class RankingList(generics.ListAPIView):
    queryset = Ranking.objects.all()
    serializer_class = RankingSerializer

@api_view(['GET'])
@permission_classes([AllowAny])
def season_events_view(request):
    """API endpoint for season events."""
    events = get_season_events()
    if events:
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)
    return Response({"error": "Failed to retrieve season events."}, status=500)

@api_view(['GET'])
@permission_classes([AllowAny])
def players_m_view(request):
    """API endpoint for men players' details."""
    players = get_players_m()
    if players:
        serializer = PlayerSerializer(players, many=True)
        return Response(serializer.data)
    return Response({"error": "Failed to retrieve men players' details."}, status=500)

@api_view(['GET'])
@permission_classes([AllowAny])
def players_w_view(request):
    """API endpoint for women players' details."""
    players = get_players_w()
    if players:
        serializer = PlayerSerializer(players, many=True)
        return Response(serializer.data)
    return Response({"error": "Failed to retrieve women players' details."}, status=500)

@api_view(['GET'])
@permission_classes([AllowAny])
def ranking_view(request):
    """API endpoint for ranking."""
    ranking = get_ranking()
    if ranking:
        serializer = RankingSerializer(ranking, many=True)
        return Response(serializer.data)
    return Response({"error": "Failed to retrieve ranking."}, status=500)

@api_view(['GET'])
@permission_classes([AllowAny])
def player_by_id_view(request, player_id):
    """API endpoint for player details by ID."""
    player = get_player_by_id(player_id)
    if player:
        return Response(player)
    return Response({"error": "Failed to retrieve player details."}, status=500)

@api_view(['GET'])
@permission_classes([AllowAny])
def upcoming_matches_view(request):
    """API endpoint for upcoming matches."""
    matches = get_upcoming_matches()
    if matches:
        return Response(matches)
    return Response({"error": "Failed to retrieve upcoming matches."}, status=500)

@api_view(['GET'])
@permission_classes([AllowAny])
def tour_details_view(request, event_id):
    """API endpoint for tour details by event ID."""
    tour_details = get_tour_details(event_id)
    if tour_details:
        return Response(tour_details)
    return Response({"error": "Failed to retrieve tour details."}, status=500)

# התחברות - החזרת טוקן
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = User.objects.filter(username=username).first()
    if user and user.check_password(password):
        refresh = RefreshToken.for_user(user)
        return Response({'access': str(refresh.access_token), 'refresh': str(refresh)}, status=status.HTTP_200_OK)
    
    return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

# התנתקות - מחיקת הטוקן
@api_view(['POST'])
def logout(request):
    request.user.auth_token.delete()  # מחיקת הטוקן של המשתמש הנוכחי
    return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (AllowAny,)