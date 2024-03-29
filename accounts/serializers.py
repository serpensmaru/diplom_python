import logging

from django.contrib.auth import authenticate

from rest_framework import serializers
from rest_framework.authtoken.models import Token

from .models import User
from storage.models import File


logger = logging.getLogger(__name__)


class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = ['key']


class UserSerializer(serializers.ModelSerializer):
    files = serializers.SerializerMethodField(source=File.objects.all())

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'joined_at',
                  'is_active', 'is_staff', 'files')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        try:
            new_user = User.objects.create_user(**validated_data)
            logger.info(f"User '{new_user}' was successfully created.")
        except Exception as e:
            logger.error(f"User '{new_user}' was not created. Error: {e}.")
        return new_user

    def get_files(self, obj):
        user_files = File.objects.filter(by_user=obj)
        filenames = [file.filename for file in user_files if file.file]
        return filenames
    

class RestrictedUserSerializer(serializers.ModelSerializer):
    files = serializers.SerializerMethodField(source=File.objects.all())
    
    class Meta:
        model = User
        fields = ('id', 'username', 'files')
        
    def get_files(self, obj):
        user_files = File.objects.filter(by_user=obj)
        filenames = [file.filename for file in user_files if file.file]
        return filenames


class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password', 'is_staff')

    def create(self, validated_data):
        
        if 'is_staff' not in validated_data:
            validated_data['is_staff'] = False
            
        user_obj = user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            is_staff=validated_data['is_staff']
        )
        return user_obj


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)

    class Meta:
        model = User
