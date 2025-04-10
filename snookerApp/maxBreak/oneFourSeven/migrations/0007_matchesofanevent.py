# Generated by Django 5.1.7 on 2025-04-08 06:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('oneFourSeven', '0006_upcomingmatch_framescores_upcomingmatch_onbreak_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='MatchesOfAnEvent',
            fields=[
                ('ID', models.IntegerField(primary_key=True, serialize=False)),
                ('EventID', models.IntegerField(blank=True, null=True)),
                ('Round', models.IntegerField(blank=True, null=True)),
                ('Number', models.IntegerField(blank=True, null=True)),
                ('Player1ID', models.IntegerField(blank=True, null=True)),
                ('Score1', models.IntegerField(blank=True, null=True)),
                ('Player2ID', models.IntegerField(blank=True, null=True)),
                ('Score2', models.IntegerField(blank=True, null=True)),
                ('ScheduledDate', models.DateTimeField(blank=True, null=True)),
                ('FrameScores', models.CharField(blank=True, max_length=1000, null=True)),
                ('OnBreak', models.BooleanField(blank=True, null=True)),
                ('LiveUrl', models.URLField(blank=True, null=True)),
                ('DetailsUrl', models.URLField(blank=True, null=True)),
            ],
        ),
    ]
