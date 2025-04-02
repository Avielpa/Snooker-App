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

    path('player_by_id/<int:player_id>/', player_by_id_view, name='player_details'),

    path('events/', EventList.as_view(), name='season_events'),
    path('players/<str:sex>/', PlayerList.as_view(), name='players'),
    path('ranking/', RankingList.as_view(), name='ranking'),
    path('matches/upcoming/', upcoming_matches_view, name='upcoming_matches'),
    path('tours/<int:event_id>/', tour_details_view, name='tour_details'),
]