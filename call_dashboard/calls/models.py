from django.db import models

from django.db import models
from django.utils.timezone import now

class Notification(models.Model):
    message = models.TextField()
    timestamp = models.DateTimeField(default=now)
    is_read = models.BooleanField(default=False)  # Track read/unread status

    def __str__(self):
        return self.message

class CallRecord(models.Model):
    customer_name = models.CharField(max_length=255)
    caller_name = models.CharField(max_length=255)
    number = models.CharField(max_length=15)
    email = models.EmailField()
    address = models.TextField()
    time = models.TimeField()
    date = models.DateField()
    duration = models.DurationField()
    status = models.CharField(max_length=50, choices=[('Completed', 'Completed'), ('Pending', 'Pending')])
    

    def __str__(self):
        return f"{self.customer_name} - {self.caller_name}"

