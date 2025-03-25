from django.db import models

from django.db import models

class Event(models.Model):
    ID = models.IntegerField(primary_key=True)
    Season = models.IntegerField()
    Tour = models.CharField(max_length=50)
    Name = models.CharField(max_length=255)
    StartDate = models.DateField(null=True, blank=True)
    EndDate = models.DateField(null=True, blank=True)
    # ... הוסף כאן את שאר השדות הרלוונטיים ...

    def __str__(self):
        return self.Name
    
    from django.db import models

class Player(models.Model):
    ID = models.IntegerField(primary_key=True)
    FirstName = models.CharField(max_length=100, null=True, blank=True)
    MiddleName = models.CharField(max_length=100, null=True, blank=True)
    LastName = models.CharField(max_length=100, null=True, blank=True)
    Sex = models.CharField(max_length=1, null=True, blank=True)
    # ... הוסף כאן את שאר השדות הרלוונטיים ...

    def __str__(self):
        return f"{self.FirstName} {self.LastName}"
    
    from django.db import models

class Ranking(models.Model):
    PlayerID = models.IntegerField()
    RankingPosition = models.IntegerField()
    Points = models.IntegerField()
    Season = models.IntegerField()
    # ... הוסף כאן את שאר השדות הרלוונטיים ...

    def __str__(self):
        return f"Player {self.PlayerID} - Rank {self.RankingPosition}"