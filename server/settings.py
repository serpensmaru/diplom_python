import os
import socket
from pathlib import Path
from datetime import date

from dotenv import load_dotenv
import colorlog


load_dotenv()

DEBUG = True

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY')

BASE_HOST = '127.0.0.1'
BASE_URL = 'http://127.0.0.1:8000'

ALLOWED_HOSTS = ['*']

CSRF_TRUSTED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:8000',
    'http://0.0.0.0:3000',
    'https://localhost:3000',
    os.getenv('REACT_APP_API_URL')
]

CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:8000',
    'http://0.0.0.0:3000',
    'https://localhost:3000',
    os.getenv('REACT_APP_API_URL')
]

CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_CREDENTIALS = True

LOGIN_URL = '/login/'
LOGIN_REDIRECT_URL = '/'

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'accounts',
    'storage',
    'rest_framework.authtoken',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'server.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'server.wsgi.application'


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': os.getenv('POSTGRES_DB'),
        'USER': os.getenv('POSTGRES_USER'),
        'PASSWORD': os.getenv('POSTGRES_PASSWORD'),
        'HOST': os.getenv('POSTGRES_HOST'),
        'PORT': os.getenv('POSTGRES_PORT'),
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')

MEDIA_URL = "/files/"
MEDIA_ROOT = os.path.join(BASE_DIR, 'files')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

AUTH_USER_MODEL = 'accounts.User'


LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'colored_verbose': {
            '()': 'colorlog.ColoredFormatter',
            'format': "%(blue)s%(asctime)-5s %(log_color)s%(levelname)-5s %(red)s%(name)-5s %(reset)s %(blue)s%(message)s"
        },
        'file_verbose': {
            'format': "%(asctime)s %(levelname)s %(name)s %(message)s"
        },
    },
    'handlers': {
        'colored_console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'colored_verbose',
        },
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'formatter': 'file_verbose',
            'filename': os.path.join(f'{BASE_DIR}/logs', '{0}.log'.format(date.today().strftime('%d-%m-%Y'))),
        }
    },
    'loggers': {
        'root': {
            'level': 'INFO',
            'handlers': ['colored_console'],
            'propagate': False,
        },
        'django': {
            'level': 'INFO',
            'handlers': ['file'],
            'propagate': True,
        },
        'django.utils.autoreload': {
            'handlers': ['file'],
            'level': 'INFO',
            'propagate': False,
        }
    }
}
