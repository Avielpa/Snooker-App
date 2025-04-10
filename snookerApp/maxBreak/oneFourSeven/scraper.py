from datetime import datetime
import requests
from .models import Event, Player, Ranking, UpcomingMatch, MatchesOfAnEvent
from .serializers import EventSerializer, MatchesOfAnEventSerializer, RankingSerializer, UpcomingMatchSerializer

API_BASE_URL = "https://api.snooker.org/"
HEADERS = {"X-Requested-By": "FahimaApp128"}

def fetch_from_api(url):
    """Fetches data from the API with error handling."""
    try:
        response = requests.get(url, headers=HEADERS)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data from {url}: {e}")
        return None

def get_current_season():
    """Fetches the current season number from the API (t=20)."""
    url = f"{API_BASE_URL}?t=20"
    season_data = fetch_from_api(url)
    if season_data and season_data[0]:
        return season_data[0]['CurrentSeason']
    return None

def save_events(events_data):
    for event_data in events_data:
        serializer = EventSerializer(data=event_data)
        if serializer.is_valid():
            Event.objects.update_or_create(
                ID=event_data.get('ID'),
                defaults=serializer.validated_data
            )

def save_upcoming_events(events_data):
    for event_data in events_data:
        serializer = UpcomingMatchSerializer(data=event_data)
        if serializer.is_valid():
            Event.objects.update_or_create(
                ID=event_data.get('ID'),
                defaults=serializer.validated_data
            )

def save_matches_of_an_event(events_data):
    for event_data in events_data:
        serializer = UpcomingMatchSerializer(data=event_data)
        if serializer.is_valid():
            Event.objects.update_or_create(
                ID=event_data.get('ID'),
                defaults=serializer.validated_data
            )

def save_players(players_data):
    fields = [f.name for f in Player._meta.get_fields()]
    for player_data in players_data:
        filtered_data = {k: v for k, v in player_data.items() if k in fields and v is not None}
        
        born_value = filtered_data.get('Born')
        if born_value == "":
            filtered_data['Born'] = None
        elif born_value:
            try:
                from datetime import datetime
                filtered_data['Born'] = datetime.strptime(born_value, '%Y-%m-%d').date()
            except ValueError:
                filtered_data['Born'] = None
        
        Player.objects.update_or_create(
            ID=player_data.get('ID'),
            defaults=filtered_data
        )

def save_rankings(rankings_data):
    for ranking_data in rankings_data:
        serializer = RankingSerializer(data=ranking_data)
        if serializer.is_valid():
            Ranking.objects.update_or_create(
                ID=ranking_data.get('ID'),
                defaults=serializer.validated_data
            )



def get_season_events():
    current_season = get_current_season()
    if current_season is None:
        return None
    url = f"{API_BASE_URL}?t=5&s={current_season}&tr=main"
    events_data = fetch_from_api(url)
    if events_data:
        filtered_events_data = [
            event for event in events_data
            if event['Tour'] in ['Ranking', 'ranking', 'Qualifying', 'Invitational']
            and 'Championship League Stage' not in event['Name']
        ]
        save_events(filtered_events_data)
        # Sort events by start date
        return Event.objects.filter(Season=current_season).order_by('StartDate')
    return None

def get_players_m():
    current_season = get_current_season()
    if current_season is None:
        return None
    url = f"{API_BASE_URL}?t=10&st=p&s={current_season}&se=m"
    players_data = fetch_from_api(url)
    if players_data:
        save_players(players_data)
        return Player.objects.filter(Sex='m')
    return None

def get_players_w():
    current_season = get_current_season()
    if current_season is None:
        return None
    url = f"{API_BASE_URL}?t=10&st=p&s={current_season}&se=f"
    players_data = fetch_from_api(url)
    if players_data:
        save_players(players_data)
        return Player.objects.filter(Sex='f')
    return None

def get_a_players_m():
    current_season = get_current_season()
    url = f"{API_BASE_URL}?t=10&st=a&s={current_season}&se=m"
    players_data = fetch_from_api(url)
    if players_data:
        save_players(players_data)
        return Player.objects.filter(Sex='m')
    return None


def get_ranking():
    current_season = get_current_season()
    if current_season is None:
        return None
    url = f"{API_BASE_URL}?t=11&rt=MoneyRankings&s={current_season}"
    rankings_data = fetch_from_api(url)
    if rankings_data:
        save_rankings(rankings_data)
        return Ranking.objects.filter(Season=current_season)
    return None

def get_player_by_id(player_id):
    """Fetches player details by ID (t=4) and saves/updates."""
    url = f"{API_BASE_URL}?p={player_id}"
    return fetch_from_api(url)

def get_upcoming_matches():
    """Fetches upcoming matches (t=14) for the main tour and replaces the existing table with new data from the API."""
    url = f"{API_BASE_URL}?t=14&tr=main"
    matches_data = fetch_from_api(url)
    if matches_data:
        # Delete all existing records
        UpcomingMatch.objects.all().delete()
        print("Existing matches deleted.")

        # Insert new records from API
        for match_data in matches_data:
            serializer = UpcomingMatchSerializer(data=match_data)
            if serializer.is_valid():
                serializer.save()
                print(f"Match {match_data.get('ID')} created.")
            else:
                print(f"Invalid data for match {match_data.get('ID')}: {serializer.errors}")
        return UpcomingMatch.objects.all()
    else:
        print("No matches data fetched from API.")
        return None
    

def get_current_event():
    """
    מחזירה את ה-ID של הטורניר הפעיל, או None אם לא נמצא טורניר פעיל.
    """
    now = datetime.now()  # קבלת התאריך והשעה הנוכחיים

    try:
        # שאילתת דאטה בייס לקבלת טורניר פעיל
        active_event = Event.objects.filter(
            StartDate__lte=now,
            EndDate__gte=now
        ).first()

        if active_event:
            return active_event.ID  # החזרת ה-ID של הטורניר הפעיל
        else:
            return None  # החזרת None אם לא נמצא טורניר פעיל

    except Event.DoesNotExist:
        return None  # החזרת None אם לא נמצא טורניר פעיל
    

def matches_of_an_event():
    event_id = get_current_event()
    """fetch matches of an event"""
    url = f"https://api.snooker.org/?t=6&e={event_id}"
    matches = fetch_from_api(url)
    if matches:
        MatchesOfAnEvent.objects.all().delete()
        for match in matches:
            serializer = MatchesOfAnEventSerializer(data= match)
            if serializer.is_valid():
                serializer.save()
            else:
                print("Invalid serializer")
        return MatchesOfAnEvent.objects.all()
    else:
        print("No matches")
        return None
    
def get_tour_details(event_id):
    """Fetches tour details by event ID (t=3)."""
    url = f"{API_BASE_URL}?e={event_id}"
    return fetch_from_api(url)
