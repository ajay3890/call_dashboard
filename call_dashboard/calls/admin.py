from django.contrib import admin
from .models import CallRecord

@admin.register(CallRecord)
class CallRecordAdmin(admin.ModelAdmin):
    list_display = ('customer_name', 'caller_name', 'number', 'email', 'time', 'date', 'status', 'duration')
    search_fields = ('customer_name', 'caller_name', 'number')
