from django.urls import path, include
from django.contrib import admin
urlpatterns = [
     path('admin/', admin.site.urls),
    path('', include('calls.urls')),
    path('api/auth/', include('auth_app.urls')),

]
