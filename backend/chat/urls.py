from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MessageViewSet

# Use a router for cleaner route definitions
router = DefaultRouter()
router.register(r'messages', MessageViewSet, basename='messages')

# Define additional API paths explicitly if necessary
urlpatterns = [
    path('', include(router.urls)),  # Base router includes the `/api/messages/` routes automatically
    path(
        'messages-by-sender-receiver/', 
        MessageViewSet.as_view({'get': 'get_messages_by_sender_receiver'}), 
        name='messages_by_sender_receiver'
    ),
    path(
        'messages-by-sender/', 
        MessageViewSet.as_view({'get': 'get_messages_by_sender'}), 
        name='messages_by_sender'
    ),
    path(
        'messages-by-receiver/', 
        MessageViewSet.as_view({'get': 'get_messages_by_receiver'}), 
        name='messages_by_receiver'
    ),
]
