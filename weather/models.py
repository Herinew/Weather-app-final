from django.db import models

# Create your models here.
class City(models.Model):
    name = models.CharField(max_length=100)
    lat = models.FloatField(max_length=12)
    lon = models.FloatField(max_length=12)
    user = models.IntegerField("user-id")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "lat": self.lat,
            "lon": self.lon,
            "user": self.user
        }