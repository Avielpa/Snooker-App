# populate_db.py
import os
import django
import time
from datetime import datetime

# הגדרת משתנה סביבה עבור הגדרות Django (אם לא מוגדר)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'maxBreak.settings')
django.setup()

from oneFourSeven.scraper import get_ranking, get_season_events, get_players_m,get_players_w,get_a_players_m, get_upcoming_matches

# הגדרת מגבלת קצב (10 בקשות בדקה)
REQUESTS_PER_MINUTE = 10
SECONDS_PER_MINUTE = 60
DELAY_BETWEEN_REQUESTS = SECONDS_PER_MINUTE / REQUESTS_PER_MINUTE

last_request_time = None

def make_api_request(api_function, *args, **kwargs):
    global last_request_time
    now = datetime.now()

    if last_request_time:
        time_since_last_request = (now - last_request_time).total_seconds()
        if time_since_last_request < DELAY_BETWEEN_REQUESTS:
            sleep_time = DELAY_BETWEEN_REQUESTS - time_since_last_request
            print(f"Waiting for {sleep_time:.2f} seconds to respect API rate limit.")
            time.sleep(sleep_time)

    last_request_time = now
    return api_function(*args, **kwargs)

if __name__ == "__main__":
    print("Populating database...")

    # # Fetch and save season events
    # print("Fetching and saving season events...")
    # make_api_request(get_season_events)

    # # Fetch and save men players
    # print("Fetching and saving men players...")
    # make_api_request(get_players_m)

    # # Fetch and save women players
    # print("Fetching and saving women players...")
    # make_api_request(get_players_w)

    # # Fetch and save amateur players
    # print("Fetching and saving women players...")
    # make_api_request(get_a_players_m)

    # # Fetch and save rankings
    # print("Fetching and saving rankings...")
    # make_api_request(get_ranking)

    # Fetch and save upcoming matches
    print("Fetching and saving upcoming matches...")
    make_api_request(get_upcoming_matches)

    print("Database population finished.")

