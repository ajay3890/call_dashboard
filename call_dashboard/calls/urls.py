from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CallRecordViewSet
from .views import CallDataAPI, CallStatsAPI
from .views import NotificationViewSet, create_call, update_call, delete_call

router = DefaultRouter()
router.register('calls', CallRecordViewSet)
router.register(r'notifications', NotificationViewSet)


urlpatterns = [
    path('api/', include(router.urls)),
     path('api/call-stats/', CallStatsAPI.as_view(), name='call-stats'),

]
