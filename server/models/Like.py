from app_setup import db
from sqlalchemy.schema import UniqueConstraint
from sqlalchemy.orm import validates


class Like(db.Model):
    __tablename__ = 'likes'

    id = db.Column(db.Integer, primary_key=True)

    likeable_type = db.Column(db.Enum('artist', 'track', 'event', name='likeable_types'), nullable=False)
    likeable_id = db.Column(db.Integer, nullable=False)
    
    liker_type = db.Column(db.Enum('artist', 'fan', name='liker_types'), nullable=False)
    artist_id = db.Column(db.Integer, db.ForeignKey('artists.id'))
    fan_id = db.Column(db.Integer, db.ForeignKey('fans.id'))

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    # __table_args__ = (
    #     UniqueConstraint('likeable_type', 'likeable_id', 'liker_type', 'artist_id', 'fan_id', name='unique_likes'),
    # )

    @property
    def likeable(self):
        from models.artist import Artist
        from models.event import Event
        from models.track import Track


        if self.likeable_type == 'artist':
            return Artist.query.get(self.likeable_id)
        elif self.likeable_type == 'event':
            return Event.query.get(self.likeable_id)
        elif self.likeable_type == 'track':
            return Track.query.get(self.likeable_id)
        else:
            return None 
        
    @property
    def liker(self):
        from models.artist import Artist
        from models.fan import Fan
        
        if self.liker_type == 'artist':
            return Artist.query.get(self.artist_id)
        elif self.liker_type == 'fan':
            return Fan.query.get(self.fan_id)
        else:
            return None

    # TODO Why does this validation break on the seed file?
    # @validates('likeable_type')
    # def validate_likeable_type(self, _, likeable_type):
    #     if likeable_type not in ['artist', 'fan']:
    #         raise ValueError('Invalid likeable_type')
    #     return likeable_type
    
    # @validates('liker_type')
    # def validate_liker_type(self, _, liker_type):
    #     if liker_type not in ['artist', 'track', 'event']:
    #         raise ValueError('Invalid liker_type')
    #     return liker_type