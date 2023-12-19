from marshmallow import fields, validate
from models.track import Track
from app_setup import ma
from schemas.like_schema import LikeSchema

class TrackSchema(ma.SQLAlchemySchema):
    likes = fields.List(fields.Nested(LikeSchema(only=(
                    'id', 
                    'likeable_type', 
                    'likeable_id',
                    'liker_type', 
                    'artist_id', 
                    'fan_id'
                    ))))
    class Meta():
        model: Track
        load_instance = True
        fields = [
                    'id', 
                    'name',
                    'audio',
                    'artist_id',
                    'artist_name',
                    'likes'
                    # 'fans'
                    ]
        
        
