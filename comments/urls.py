# -*- coding: utf-8 -*-

from django.conf.urls import url
import comments.views

urlpatterns = [
    url(r'^load/$', 	    comments.views.load),
    url(r'^send/comment/$', comments.views.send_comment),
    url(r'^send/reply/$',   comments.views.send_reply),
]