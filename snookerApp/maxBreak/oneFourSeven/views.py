from django.contrib.auth.models import User
from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from django.core.paginator import Paginator
from datetime import datetime
    


from .models import MatchesOfAnEvent, Player, Ranking, Event, UpcomingMatch
from .serializers import EventSerializer, MatchesOfAnEventSerializer, PlayerSerializer, RankingSerializer, UpcomingMatchSerializer, UserSerializer

from .scraper import (
    get_tour_details,
)

@permission_classes([AllowAny])
class EventList(generics.ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

@permission_classes([AllowAny])
class UpcomingMatchList(generics.ListAPIView):
    queryset = UpcomingMatch.objects.all()
    serializer_class = UpcomingMatchSerializer

@permission_classes([AllowAny])
class matches_of_an_event(generics.ListAPIView):
    queryset = MatchesOfAnEvent.objects.all()
    serializer_class = MatchesOfAnEventSerializer

@permission_classes([AllowAny])
class PlayerList(generics.ListAPIView):
    serializer_class = PlayerSerializer
    def get_queryset(self):
        sex = self.kwargs['sex']
        return Player.objects.filter(Sex=sex)

@permission_classes([AllowAny])
class RankingList(generics.ListAPIView):
    queryset = Ranking.objects.all()
    serializer_class = RankingSerializer


@api_view(['GET'])
@permission_classes([AllowAny])
def season_events_view(request):
    """API endpoint for season events with active, past flag and chronological order."""
    events = Event.objects.all().order_by('StartDate') # order by start date
    today = datetime.date.today()
    serialized_events = []
    for event in events:
        serializer = EventSerializer(event)
        event_data = serializer.data
        start_date = event.StartDate
        end_date = event.EndDate
        event_data['active'] = start_date <= today <= end_date if start_date and end_date else False
        event_data['past'] = end_date < today if end_date else False
        serialized_events.append(event_data)
    return Response(serialized_events)



@api_view(['GET'])
@permission_classes([AllowAny])
def upcoming_matches_view(request):
    """API endpoint for upcoming matches, in the order they were added to the database, limited to 10."""
    matches = UpcomingMatch.objects.all()  
    paginator = Paginator(matches, 10)
    page = request.GET.get('page')
    matches_page = paginator.get_page(page)
    serializer = UpcomingMatchSerializer(matches_page, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def matches_of_an_event_view(request):
    """
    API endpoint for upcoming matches, sorted by ScheduledDate, limited to 20.
    """
    matches = MatchesOfAnEvent.objects.all().order_by('ScheduledDate')  # מיון לפי ScheduledDate
    paginator = Paginator(matches, 20)  
    page = request.GET.get('page')
    matches_page = paginator.get_page(page)
    serializer = MatchesOfAnEventSerializer(matches_page, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def players_m_view(request):
    """API endpoint for men players' details."""
    players = Player.objects.filter(Sex='M')
    serializer = PlayerSerializer(players, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def players_w_view(request):
    """API endpoint for women players' details."""
    players = Player.objects.filter(Sex='F')
    serializer = PlayerSerializer(players, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def ranking_view(request):
    """API endpoint for ranking."""
    ranking = Ranking.objects.all()
    serializer = RankingSerializer(ranking, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def player_by_id_view(request, player_id):
    """API endpoint for player details by ID."""
    try:
        player = Player.objects.get(ID=player_id)
        serializer = PlayerSerializer(player)
        return Response(serializer.data)
    except Player.DoesNotExist:
        return Response({"error": f"Player with ID {player_id} not found in database."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error fetching player details from database: {e}")
        return Response({"error": "Failed to get player details from database."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def tour_details_view(request, event_id):
    """API endpoint for tour details by event ID."""
    tour_details = get_tour_details(event_id) # Still fetches from API
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

