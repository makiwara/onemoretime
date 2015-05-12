# -*- coding: utf-8 -*-
from utils.decorations import return_json, require_auth
from comments.models import User, Comment, Reply
from markdown import markdown

@return_json
def load(request):
    comments = Comment.objects.filter(
        tag=request.GET.get('tag'),
        active=1,
    )
    return dict(comments = [prepare_comment(x) for x in comments])

def prepare_reply(reply):
    return dict(
        author = dict(
            name = reply.user.get_full_name(),
            userpic = reply.user.get_userpic(),
        ),
        comment_id = reply.comment.pk,
        text = markdown(reply.text),
    )

def prepare_comment(comment):
    return dict(
        id = comment.pk,
        author = dict(
            name = comment.user.get_full_name(),
            userpic = comment.user.get_userpic(),
        ),
        text = markdown(comment.text),
        replies = [prepare_reply(x) for x in comment.reply_set.filter(active=1)],
    )

@require_auth
@return_json
def send_comment(request):
    comment = Comment(
        user=request.user,
        tag=request.POST.get('tag'),
        text=request.POST.get('text'),       
    )
    comment.save()
    return dict(comment = prepare_comment(comment))

@require_auth
@return_json
def send_reply(request):
    reply = Reply(
        user=request.user,
        comment=Comment.objects.get(pk=request.POST.get('comment_id')),
        text=request.POST.get('text'),       
    )
    reply.save()
    return dict(reply = prepare_reply(reply))



