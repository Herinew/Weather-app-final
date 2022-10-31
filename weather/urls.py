from django.urls import path
from django.urls.resolvers import URLPattern
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('cities', views.cities, name='cities'),
    path('cities/<int:id>', views.cities_user, name='cities_user'),
    path('cities/<int:id>/<str:name>/del', views.cities_user_del, name='cities_user_del')
]