#!/usr/bin/env python3
from flask import jsonify, abort, current_app, request, session, redirect, url_for, make_response
from flask_restful import Resource
from flask_cors import cross_origin
import logging
import time
import re
from urllib.parse import urlencode
import requests
import base64

from werkzeug.exceptions import NotFound
from app_setup import app, db, api, jwt
from models.artist import Artist
from models.fan import Fan
from models.user import User
from models.track import Track
from models.like import Like
from models.event import Event
from routes.artists import Artists
from routes.artist_by_id import ArtistById
from routes.events import Events
from routes.event_by_id import EventById
from routes.fans import Fans
from routes.fan_by_id import FanById
from routes.tracks import Tracks
from routes.track_by_id import TrackById
from routes.auth.me import Me
from routes.users import Users
from routes.user_by_id import UserById
from routes.auth.login import Login
from routes.auth.signup import Signup
from routes.auth.refresh import Refresh
from routes.auth.check_token import CheckToken
from routes.like_by_id import LikeById
from routes.likes import Likes
# from routes.spotify.get_spotify_token import GetSpotifyToken
from flask import render_template

api.add_resource(Artists, "/artists")

api.add_resource(ArtistById, "/artists/<int:id>")

api.add_resource(Events, "/events")

api.add_resource(EventById, "/events/<int:id>")

api.add_resource(Fans, "/fans")

api.add_resource(FanById, "/fans/<int:id>")

api.add_resource(Tracks, "/tracks")

api.add_resource(TrackById, "/tracks/<int:id>")

api.add_resource(Me, "/me")

api.add_resource(Users, "/users")

api.add_resource(UserById, "/users/<int:id>")

api.add_resource(Likes, "/likes")

api.add_resource(LikeById, "/likes/<int:id>")

api.add_resource(Login, "/login")

api.add_resource(Signup, '/signup')

api.add_resource(Refresh, "/refresh")
# #! GET Check Token
api.add_resource(CheckToken, "/check")
# #! No need for a logout route in this configuration!
# api.add_resource(GetSpotifyToken, '/get_spotify_token')

# TODO Further Restrict CORS after OAuth achieved

# @app.route('/')
# def index():
#     response = redirect('http://localhost:4000/landing')
#     # response.headers.add("Access-Control-Allow-Origin", "*")
#     return response

@app.route('/spotify_api')
def spotify_api():
    response = redirect('http://localhost:4000/landing')
    # response.headers.add("Access-Control-Allow-Origin", "*")

@app.route('/authorize')
def authorize():

    import secrets

    client_id = app.config['SPOTIFY_CLIENT_ID']
    redirect_uri = 'http://localhost:4000/callback'
    scope = 'user-read-private user-read-email'

    # # Generate a random state value and store it in the session
    state = secrets.token_urlsafe(16)
    session['state'] = state

    # # Redirect user to Spotify authorization page with the state parameter
    params = {
        "response_type": "code",
        "client_id": client_id,
        "scope": scope,
        "redirect_uri": redirect_uri,
        "state": state
    }

    authorization_url = 'https://accounts.spotify.com/authorize?' + urlencode(params)
        
    response = redirect(authorization_url)
    # response.headers.add("Access-Control-Allow-Origin", "*")
    # import ipdb; ipdb.set_trace()

    return response, 200

@app.route('/get_spotify_token', methods=['POST'])
def get_spotify_token():
    client_id = app.config['SPOTIFY_CLIENT_ID']
    client_secret= app.config['SPOTIFY_CLIENT_SECRET']
    token_url = 'https://accounts.spotify.com/api/token'
    redirect_uri = 'http://localhost:4000/callback'

    data = request.get_json()
    code = data.get('code')
    refresh_token = data.get('refresh_token')

    headers = {
            'Authorization': 'Basic ' + base64.b64encode(f"{client_id}:{client_secret}".encode()).decode('utf-8'),
            'Content-Type': 'application/x-www-form-urlencoded'
            }
    body = {}

    if code:
        body = {
            'code': code,
            'redirect_uri': redirect_uri,
            'grant_type': 'authorization_code'
        }

    elif refresh_token:

        body = {
                "grant_type": "refresh_token",
                "refresh_token": refresh_token,
                "client_id": client_id
            }

    post_response = requests.post(token_url,headers=headers,data=body)
        

    if post_response.status_code == 200:
        pr = post_response.json()
        if pr.get('refresh_token'):
            response_data = {
                'access_token': pr['access_token'],
                'refresh_token': pr['refresh_token'],
                'expires_in': pr['expires_in']
            }
        else:
            response_data = {
                'access_token': pr['access_token'],
                'refresh_token': refresh_token,
                'expires_in': pr['expires_in']
            }
    
        # import ipdb; ipdb.set_trace()

        return jsonify(response_data)
    else:
        return jsonify({'error': 'Failed to obtain access token.'}), 500    





# # Register a callback function that loads a user from your database whenever
# # a protected route is accessed. This should return any python object on a
# # successful lookup, or None if the lookup failed for any reason (for example
# # if the user has been deleted from the database).
@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return db.session.get(User, identity)


# #! Global Error Handling
@app.errorhandler(NotFound)  #! 404
def handle_404(error):
    response = {"message": error.description}
    return response, error.code

# @app.route("/")
# @app.route("/production-detail/<int:id>")
# @app.route("/edit-production/<int:id>")
# @app.route("/new-production")
# def index(id=0):
#     return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True, port=5555)