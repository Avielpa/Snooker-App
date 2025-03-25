# from django.urls import path
# from rest_framework import routers
# from django.conf.urls import include

# from .views import (
#     UserViewSet,
#     login,
#     logout,
#     season_events_view,
#     players_m_view,
#     players_w_view,
#     ranking_view,
#     player_by_id_view,
#     upcoming_matches_view,
#     tour_details_view
# )

# router = routers.DefaultRouter()
# router.register('users', UserViewSet)

# urlpatterns = [
#     path('', include(router.urls)),
#     path('login/', login, name='login'),
#     path('logout/', logout, name='logout'),

#     path('events/', season_events_view, name='season_events'),
#     path('players/men/', players_m_view, name='players_m'),
#     path('players/women/', players_w_view, name='players_w'),
#     path('ranking/', ranking_view, name='ranking'),
#     path('players/<int:player_id>/', player_by_id_view, name='player_details'),
#     path('matches/upcoming/', upcoming_matches_view, name='upcoming_matches'),
#     path('tours/<int:event_id>/', tour_details_view, name='tour_details'),


# ]


from django.urls import path
from rest_framework import routers
from django.conf.urls import include

from .views import (
    UserViewSet,
    login,
    logout,
    EventList,
    PlayerList,
    RankingList,
    player_by_id_view,
    upcoming_matches_view,
    tour_details_view
)

router = routers.DefaultRouter()
router.register('users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', login, name='login'),
    path('logout/', logout, name='logout'),

    path('events/', EventList.as_view(), name='season_events'),
    path('players/men/', PlayerList.as_view(), name='players_m'),
    path('players/women/', PlayerList.as_view(), name='players_w'),
    path('ranking/', RankingList.as_view(), name='ranking'),
    path('players/<int:player_id>/', player_by_id_view, name='player_details'),
    path('matches/upcoming/', upcoming_matches_view, name='upcoming_matches'),
    path('tours/<int:event_id>/', tour_details_view, name='tour_details'),
]