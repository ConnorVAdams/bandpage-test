from marshmallow import fields, validate
from models.user import User
from schemas.artist_schema import ArtistSchema
from schemas.fan_schema import FanSchema
from app_setup import ma

class UserSchema(ma.SQLAlchemySchema):
    # TODO is user_type only necessary in the front end?
    # user_type = fields.Function(lambda obj: 'artist' if obj.artist else 'fan')

    class Meta():
        model: User
        load_instance = True

    id = fields.Integer()
    username = fields.String(required=True)
    password_hash = fields.String(validate=validate.Length(min=12, max=24))
    artist = fields.Nested(ArtistSchema(only=(
        'id', 
        'name',
        'genres',
        'bio',
        'location',
        'img',
        'likes',
        'tracks',
        'upcoming_events',
        'fan_followers',
        'artist_followers',
        'followed_artists',
        'favorited_tracks',
        'events_attending',
        # 'user_id',
        'username',
        'created_at'
        )))
    fan = fields.Nested(FanSchema(only=(
        'id', 
        'name',
        'bio',
        'location',
        'img',
        'followed_artists',
        'favorited_tracks',
        'events_attending',
        'username',
        'created_at'
        )))