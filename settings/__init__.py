# -*- coding: utf-8 -*-
# from trash import *

# вот так можно добавлять template helpers
# INSTALLED_APPS.append('your_helpers')

# для выкладки стенда на какой-то сервер необходимо сделать там файл host_settings.py согласно hosts.py


"""
Django settings for testadmin project.

For more information on this file, see
https://docs.djangoproject.com/en/1.7/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.7/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))


STAGE = 1

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.7/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'pf82f^)manyxyu(6^5muk0$ubom0dssdsm5k!u_$856fl#-y%7g-27i^ucx%)'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

TEMPLATE_DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'social.apps.django_app.default',
    'utils',
    'game',
    'comments',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'social.apps.django_app.middleware.SocialAuthExceptionMiddleware',
)

AUTHENTICATION_BACKENDS = (
    'social.backends.facebook.FacebookOAuth2',
)
TEMPLATE_CONTEXT_PROCESSORS = (
    'django.contrib.messages.context_processors.messages',
    'django.contrib.auth.context_processors.auth',
    'social.apps.django_app.context_processors.backends',
    'social.apps.django_app.context_processors.login_redirect',
)

ROOT_URLCONF = 'urls'

AUTH_USER_MODEL = 'comments.User'

SOCIAL_AUTH_STRATEGY = 'social.strategies.django_strategy.DjangoStrategy'
SOCIAL_AUTH_STORAGE  = 'social.apps.django_app.default.models.DjangoStorage'
SOCIAL_AUTH_FACEBOOK_KEY    = '1527228494217085'
SOCIAL_AUTH_FACEBOOK_SECRET = 'ae5aa6f6f6901b540d2875d69275b4a7'
SOCIAL_AUTH_FACEBOOK_SCOPE  = ['public_profile', 'email']
SOCIAL_AUTH_FACEBOOK_AUTH_EXTRA_ARGUMENTS = dict(display="popup")

# WSGI_APPLICATION = 'zento.wsgi.application'
SOCIAL_AUTH_PIPELINE = (
    'social.pipeline.social_auth.social_details',
    'social.pipeline.social_auth.social_uid',
    'social.pipeline.social_auth.auth_allowed',
    'social.pipeline.social_auth.social_user',
    'social.pipeline.user.get_username',
    'social.pipeline.user.create_user',
    'social.pipeline.social_auth.associate_user',
    'social.pipeline.social_auth.load_extra_data',
    'social.pipeline.user.user_details',
    'comments.models.store_user_email',  # <--- mine
)

# Database
# https://docs.djangoproject.com/en/1.7/ref/settings/#databases
try:
    from db_settings import DATABASES
    TEMPLATE_DEBUG = False
except:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
        }
    }

# Internationalization
# https://docs.djangoproject.com/en/1.7/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.7/howto/static-files/

STATIC_URL = '/static/'
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, "static"),
    '/var/www/static/',
)


# ---- host description
HOSTS = dict(
    localhost = dict( 
        PATH ='.',
        LOG_FILE = None,
        STATIC_ROOT = './static/',
        SECRET = 'wlqejorudsteoifgsdhjoruytorweiuo',
        URL = "http://127.0.0.1:8000/" 
	),
)
    
# ---- host detection (insert lines here if needed)
# result -- HOST = corresponding host data
HOSTNAME = "localhost"
HOST = HOSTS[HOSTNAME]
URL = HOST["URL"]
LOG_FILE = HOST["LOG_FILE"]
FORCE_SCRIPT_NAME = ""

# now for IS_LOCALHOST etc. parts
for hostname in HOSTS:
    globals()["IS_%s" % hostname.upper()] = HOSTNAME==hostname
