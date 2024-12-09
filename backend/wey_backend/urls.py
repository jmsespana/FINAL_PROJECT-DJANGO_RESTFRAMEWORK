from django.contrib import admin  # Import the admin module
from django.urls import path, include

urlpatterns = [
    path('api/', include('account.urls')),
    path('admin/', admin.site.urls),  # Admin panel
    path('chat/', include('chat.urls')),
]
