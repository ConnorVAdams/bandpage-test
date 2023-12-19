from marshmallow import fields, validate
from models.artist import Artist
from app_setup import ma

from schemas.event_schema import EventSchema
from schemas.fan_schema import FanSchema
from schemas.track_schema import TrackSchema
from schemas.like_schema import LikeSchema

class ArtistSchema(ma.SQLAlchemySchema):
    # TODO schema level validations
    tracks = fields.List(fields.Nested(TrackSchema(only=('id', 'name', 'audio', 'likes', 'artist_id', 'artist_name'))))
    upcoming_events = fields.List(fields.Nested(EventSchema(only=('id', 'date_time', 'venue', 'artist_id', 'artist_name'))))
    likes = fields.List(fields.Nested(LikeSchema(only=(
                    'id', 
                    'likeable_type', 
                    'likeable_id',
                    'liker_type', 
                    'artist_id', 
                    'fan_id'
                    ))))
    fan_followers = fields.List(fields.Nested(FanSchema(only=('id', 'name', 'location', 'img'))))
    artist_followers = fields.List(fields.Nested('ArtistSchema', only=('id', 'name', 'location', 'img')))
    followed_artists = fields.List(fields.Nested('ArtistSchema', only=('id', 'name', 'location', 'img')))
    favorited_tracks = fields.List(fields.Nested(TrackSchema(only=("id", "name", "audio", 'likes', 'artist_id'))))
    events_attending = fields.List(fields.Nested(EventSchema(only=('id', 'date_time', 'venue', 'likes'))))
    events_attended = fields.List(fields.Nested(EventSchema(only=('id', 'date_time', 'venue'))))
    class Meta():
        model: Artist
        load_instance = True
        fields = [
                    'id', 
                    'name',
                    'genres',
                    'bio',
                    'location',
                    'img',
                    'tracks',
                    'likes',
                    'upcoming_events',
                    'fan_followers',
                    'artist_followers',
                    'followed_artists',
                    'favorited_tracks',
                    'events_attended',
                    'events_attending',
                    'username',
                    'user_id',
                    'created_at'
                    ]
