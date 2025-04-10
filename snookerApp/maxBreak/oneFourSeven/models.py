from django.db import models

class Player(models.Model):
    ID = models.IntegerField(primary_key=True)
    Type = models.IntegerField(null=True, blank=True)
    FirstName = models.CharField(max_length=100, null=True, blank=True)
    MiddleName = models.CharField(max_length=100, null=True, blank=True)
    LastName = models.CharField(max_length=100, null=True, blank=True)
    TeamName = models.CharField(max_length=100, null=True, blank=True)
    TeamNumber = models.IntegerField(null=True, blank=True)
    TeamSeason = models.IntegerField(null=True, blank=True)
    ShortName = models.CharField(max_length=100, null=True, blank=True)
    Nationality = models.CharField(max_length=100, null=True, blank=True)
    Sex = models.CharField(max_length=1, null=True, blank=True)
    Born = models.DateField(null=True, blank=True)
    SurnameFirst = models.BooleanField(null=True, blank=True)
    FirstSeasonAsPro = models.IntegerField(null=True, blank=True)
    LastSeasonAsPro = models.IntegerField(null=True, blank=True)
    NumRankingTitles = models.IntegerField(null= True,blank=True)
    NumMaximums = models.IntegerField(null= True,blank=True)

    def __str__(self):
        return f"{self.FirstName} {self.MiddleName} {self.LastName}"

class Ranking(models.Model):
    ID = models.BigIntegerField(primary_key=True)  # Changed to BigIntegerField
    Position = models.IntegerField(null=True, blank=True)
    PlayerID = models.IntegerField(null=False)
    Season = models.IntegerField(null=True, blank=True)
    Sum = models.IntegerField(null=True, blank=True)
    Type = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return f"Player {self.PlayerID} - Rank {self.Position} ({self.Season})"

class Event(models.Model):
    ID = models.IntegerField(primary_key=True)
    Name = models.CharField(max_length=255, null=True, blank=True)
    StartDate = models.DateField(null=True, blank=True)
    EndDate = models.DateField(null=True, blank=True)
    Sponsor = models.CharField(max_length=255, null=True, blank=True)
    Season = models.IntegerField(null=True, blank=True)
    Type = models.CharField(max_length=50, null=True, blank=True)
    Num = models.IntegerField(null=True, blank=True)
    Venue = models.CharField(max_length=255, null=True, blank=True)
    City = models.CharField(max_length=100, null=True, blank=True)
    Country = models.CharField(max_length=100, null=True, blank=True)
    Discipline = models.CharField(max_length=50, null=True, blank=True)
    Main = models.IntegerField(null=True, blank=True)
    Sex = models.CharField(max_length=10, null=True, blank=True) # Increased max_length
    AgeGroup = models.CharField(max_length=10, null=True, blank=True)
    Url = models.URLField(null=True, blank=True)
    Related = models.CharField(max_length=100, null=True, blank=True)
    Stage = models.CharField(max_length=10, null=True, blank=True)
    ValueType = models.CharField(max_length=10, null=True, blank=True)
    ShortName = models.CharField(max_length=100, null=True, blank=True)
    WorldSnookerId = models.IntegerField(null=True, blank=True)
    RankingType = models.CharField(max_length=50, null=True, blank=True)
    EventPredictionID = models.IntegerField(null=True, blank=True)
    Team = models.BooleanField(default=False)
    Format = models.IntegerField(null=True, blank=True)
    Twitter = models.CharField(max_length=100, null=True, blank=True)
    HashTag = models.CharField(max_length=100, null=True, blank=True)
    ConversionRate = models.FloatField(null=True, blank=True) # Assuming float for rate
    AllRoundsAdded = models.BooleanField(default=False)
    PhotoURLs = models.TextField(null=True, blank=True) # Assuming multiple URLs
    NumCompetitors = models.IntegerField(null=True, blank=True)
    NumUpcoming = models.IntegerField(null=True, blank=True)
    NumActive = models.IntegerField(null=True, blank=True)
    NumResults = models.IntegerField(null=True, blank=True)
    Note = models.TextField(null=True, blank=True)
    CommonNote = models.TextField(null=True, blank=True)
    DefendingChampion = models.IntegerField(null=True, blank=True)
    PreviousEdition = models.IntegerField(null=True, blank=True)
    Tour = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return self.Name
    
    

from django.db import models

class UpcomingMatch(models.Model):
    ID = models.IntegerField(primary_key=True)
    EventID = models.IntegerField(null=True, blank=True)
    Round = models.IntegerField(null=True, blank=True)
    Number = models.IntegerField(null=True, blank=True)
    Player1ID = models.IntegerField(null=True, blank=True)
    Score1 = models.IntegerField(null=True, blank=True)
    Player2ID = models.IntegerField(null=True, blank=True)
    Score2 = models.IntegerField(null=True, blank=True)
    ScheduledDate = models.DateTimeField(null=True, blank=True)
    FrameScores = models.CharField(max_length=1000,null=True,blank=True)
    OnBreak = models.BooleanField(blank=True,null=True)
    LiveUrl = models.URLField(null=True, blank=True)
    DetailsUrl = models.URLField(null=True, blank=True)

    def __str__(self):
        return f"Match {self.ID}"
    

class MatchesOfAnEvent(models.Model):
    ID = models.IntegerField(primary_key=True)
    EventID = models.IntegerField(null=True, blank=True)
    Round = models.IntegerField(null=True, blank=True)
    Number = models.IntegerField(null=True, blank=True)
    Player1ID = models.IntegerField(null=True, blank=True)
    Score1 = models.IntegerField(null=True, blank=True)
    Player2ID = models.IntegerField(null=True, blank=True)
    Score2 = models.IntegerField(null=True, blank=True)
    ScheduledDate = models.DateTimeField(null=True, blank=True)
    FrameScores = models.CharField(max_length=1000,null=True,blank=True)
    OnBreak = models.BooleanField(blank=True,null=True)
    LiveUrl = models.URLField(null=True, blank=True)
    DetailsUrl = models.URLField(null=True, blank=True)

    def __str__(self):
        return f"Match {self.ID}"
    
    