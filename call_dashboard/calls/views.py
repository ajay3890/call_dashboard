from rest_framework.viewsets import ModelViewSet
from .models import CallRecord
from rest_framework.response import Response
from .serializers import CallRecordSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import CallRecord
from .serializers import CallRecordSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count, DateField
from django.db.models.functions import TruncDay, TruncWeek, TruncMonth, TruncYear
from .models import CallRecord
from rest_framework import viewsets
from .models import Notification
from .serializers import NotificationSerializer
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from .models import CallRecord, Notification
from .serializers import CallRecordSerializer

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all().order_by('-timestamp')
    serializer_class = NotificationSerializer
@api_view(['POST'])
def create_call(request):
    """Handle call record creation and generate notification"""
    serializer = CallRecordSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        Notification.objects.create(message=f"New call record added: {serializer.data['customer_name']}")
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def update_call(request, call_id):
    """Handle call record updates and generate notification"""
    call_record = get_object_or_404(CallRecord, id=call_id)
    serializer = CallRecordSerializer(call_record, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        Notification.objects.create(message=f"Call record updated: {serializer.data['customer_name']}")
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_call(request, call_id):
    """Handle call record deletion and generate notification"""
    call_record = get_object_or_404(CallRecord, id=call_id)
    Notification.objects.create(message=f"Call record deleted: {call_record.customer_name}")
    call_record.delete()
    return Response({"message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
class CallRecordViewSet(ModelViewSet):
    queryset = CallRecord.objects.all().order_by('-date', '-time')
    serializer_class = CallRecordSerializer

# Update (PUT or PATCH)
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    # Delete
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
    
class CallDataAPI(APIView):
    def get(self, request):
        calls = CallRecord.objects.all()
        serializer = CallRecordSerializer(calls, many=True)
        return Response(serializer.data)


class CallStatsAPI(APIView):
    def get(self, request):
        # Daily calls
        daily_calls = (
            CallRecord.objects.annotate(day=TruncDay('call_date'))
            .values('day')
            .annotate(call_count=Count('call_id'))  # Count based on call_id
            .order_by('day')
        )

        # Weekly calls
        weekly_calls = (
            CallRecord.objects.annotate(week=TruncWeek('call_date'))
            .values('week')
            .annotate(call_count=Count('call_id'))  # Count based on call_id
            .order_by('week')
        )

        # Monthly calls
        monthly_calls = (
            CallRecord.objects.annotate(month=TruncMonth('call_date'))
            .values('month')
            .annotate(call_count=Count('call_id'))  # Count based on call_id
            .order_by('month')
        )

        # Yearly calls
        yearly_calls = (
            CallRecord.objects.annotate(year=TruncYear('call_date'))
            .values('year')
            .annotate(call_count=Count('call_id'))  # Count based on call_id
            .order_by('year')
        )

        return Response({
            'daily': list(daily_calls),
            'weekly': list(weekly_calls),
            'monthly': list(monthly_calls),
            'yearly': list(yearly_calls),
        })    