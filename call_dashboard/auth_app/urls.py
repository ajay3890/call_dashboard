# auth_app/urls.py
from django.urls import path
from .views import signup, Login,active_users_list

urlpatterns = [
    path('signup/', signup, name='signup'),  # Only POST allowed here
    path('login/', Login.as_view(), name='login'),
    path('active_users/', active_users_list, name='active_users_list')
]
