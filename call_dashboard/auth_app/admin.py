from django.contrib import admin

# Register your models here.
from django.contrib import admin

# Register your models here.
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User

# Register User model with custom UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
