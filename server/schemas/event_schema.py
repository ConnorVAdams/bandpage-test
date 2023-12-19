from marshmallow import fields, validate
from models.event import Event
from schemas.like_schema import LikeSchema

from app_setup import ma

class EventSchema(ma.SQLAlchemySchema):
    # attendees = fields.List(fields.Nested(FanSchema(only=('id', 'name', 'location'))))
    likes = fields.List(fields.Nested(LikeSchema(only=(
                        'id', 
                        'likeable_type', 
                        'likeable_id',
                        'liker_type', 
                        'artist_id', 
                        'fan_id'
                        ))))
    class Meta():
        model: Event
        load_instance = True
        fields = [
                    'id', 
                    'date_time',
                    'venue',
                    'artist_id',
                    'artist_name',
                    'attending',
                    'likes'
                    # 'attendees'
                    ]
