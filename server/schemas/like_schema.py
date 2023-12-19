from marshmallow import Schema, fields, validate
# from schemas.artist_schema import ArtistSchema
# from schemas.fan_schema import FanSchema
# from schemas.track_schema import TrackSchema
# from schemas.event_schema import EventSchema
from models.like import Like
from app_setup import ma

class LikeSchema(ma.SQLAlchemySchema):
    class Meta():
        model: Like
        load_instance = True
        fields = [
                    'id', 
                    'likeable_type', 
                    'likeable_id',
                    'liker_type', 
                    'artist_id', 
                    'fan_id'
                    ]
        