# import requests

# API_BASE_URL = "https://api.snooker.org/"
# HEADERS = {"X-Requested-By": "FahimaApp128"}

# def fetch_from_api(url):
#     """Fetches data from the API with error handling."""
#     try:
#         response = requests.get(url, headers=HEADERS)
#         response.raise_for_status()
#         return response.json()
#     except requests.exceptions.RequestException as e:
#         print(f"Error fetching data from {url}: {e}")
#         return None

# def get_current_season():
#     """Fetches the current season number from the API (t=20)."""
#     url = f"{API_BASE_URL}?t=20"
#     season_data = fetch_from_api(url)
#     if season_data and season_data[0]:
#         return season_data[0]['CurrentSeason']
#     return None

# def get_season_events():
#     """Fetches events for the current season (t=5) for Tour=main."""
#     current_season = get_current_season()
#     if current_season is None:
#         return None
#     url = f"{API_BASE_URL}?t=5&s={current_season}&tr=main"
#     return fetch_from_api(url)

# def get_players_m():
#     """Fetches men players' details (t=10, se=m) for the current season."""
#     current_season = get_current_season()
#     if current_season is None:
#         return None
#     url = f"{API_BASE_URL}?t=10&st=p&s={current_season}&se=m"
#     return fetch_from_api(url)

# def get_players_w():
#     """Fetches women players' details (t=10, se=w) for the current season."""
#     current_season = get_current_season()
#     if current_season is None:
#         return None
#     url = f"{API_BASE_URL}?t=10&st=p&s={current_season}&se=w"
#     return fetch_from_api(url)

# def get_ranking():
#     """Fetches ranking (t=11, rt=MoneyRankings) for the current season."""
#     current_season = get_current_season()
#     if current_season is None:
#         return None
#     url = f"{API_BASE_URL}?t=11&rt=MoneyRankings&s={current_season}"
#     return fetch_from_api(url)

# def get_player_by_id(player_id):
#     """Fetches player details by ID (t=4)."""
#     url = f"{API_BASE_URL}?p={player_id}"
#     return fetch_from_api(url)

# def get_upcoming_matches():
#     """Fetches upcoming matches (t=14) for the main tour."""
#     url = f"{API_BASE_URL}?t=14&tr=main"
#     return fetch_from_api(url)

# def get_tour_details(event_id):
#     """Fetches tour details by event ID (t=3)."""
#     url = f"{API_BASE_URL}?e={event_id}"
#     return fetch_from_api(url)


import requests
from .models import Event, Player, Ranking
from .serializers import EventSerializer, PlayerSerializer, RankingSerializer

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
            serializer.save()

def save_players(players_data):
    for player_data in players_data:
        serializer = PlayerSerializer(data=player_data)
        if serializer.is_valid():
            serializer.save()

def save_rankings(rankings_data):
    for ranking_data in rankings_data:
        serializer = RankingSerializer(data=ranking_data)
        if serializer.is_valid():
            serializer.save()

def get_season_events():
    current_season = get_current_season()
    if current_season is None:
        return None
    url = f"{API_BASE_URL}?t=5&s={current_season}&tr=main"
    events_data = fetch_from_api(url)
    if events_data:
        save_events(events_data)
        return Event.objects.filter(Season=current_season)
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
    url = f"{API_BASE_URL}?t=10&st=p&s={current_season}&se=w"
    players_data = fetch_from_api(url)
    if players_data:
        save_players(players_data)
        return Player.objects.filter(Sex='w')
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
    """Fetches player details by ID (t=4)."""
    url = f"{API_BASE_URL}?p={player_id}"
    return fetch_from_api(url)

def get_upcoming_matches():
    """Fetches upcoming matches (t=14) for the main tour."""
    url = f"{API_BASE_URL}?t=14&tr=main"
    return fetch_from_api(url)

def get_tour_details(event_id):
    """Fetches tour details by event ID (t=3)."""
    url = f"{API_BASE_URL}?e={event_id}"
    return fetch_from_api(url)