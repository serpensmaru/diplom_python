import logging

from django.contrib.auth import authenticate, login, logout

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.authtoken.models import Token

from .serializers import UserLoginSerializer, UserSerializer, UserRegisterSerializer, TokenSerializer


logger = logging.getLogger(__name__)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
@authentication_classes([TokenAuthentication])
def signup_view(request):
    serializer = UserRegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        if user:
            token = Token.objects.create(user=user)
            response_message = f"User '{user.username}' was successfully created."
            logger.info(response_message)
            return Response({
                'detail': response_message,
                "user": {
                    "id": user.id,
                    'username': user.username,
                    'token': TokenSerializer(token).data['key']
                },
            }, status=status.HTTP_201_CREATED)
    response_message = f"User '{user.username}' was not created. Error: {serializer.errors}."
    logger.error(response_message)
    return Response(response_message, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        authenticated_user = authenticate(**serializer.validated_data)
        try:
            token = Token.objects.get(user=authenticated_user)
        except Token.DoesNotExist:
            token = Token.objects.create(user=authenticated_user)
        response_message = f"User '{authenticated_user.username}' was successfully logged in."
        logger.info(response_message)
        return Response({
            'detail': response_message,
            "user": {
                        "id": authenticated_user.id,
                        'username': authenticated_user.username,
                        'token': TokenSerializer(token).data['key']
                        }
        }, status=200)
    logger.warning(f'Login failed. Error: {serializer.errors}.')
    return Response(serializer.errors, status=400)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
@authentication_classes([TokenAuthentication])
def logout_view(request):
    user = request.user
    try:
        logout(request)
        response_message = f"User '{user.username}' was successfully logged out."
        logger.info(response_message)
        return Response({'detail': response_message, "user": user.username}, status=status.HTTP_200_OK)
    except Exception as e:
        response_message = f"Logout failed. Error: {e}."
        logger.error(response_message)
        return Response({'detail': response_message}, status=status.HTTP_400_BAD_REQUEST)
