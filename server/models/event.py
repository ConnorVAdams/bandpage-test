from app_setup import db
from sqlalchemy import and_
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from datetime import datetime

from models.like import Like

class Event(db.Model):
    __tablename__ = 'events'

    id = db.Column(db.Integer, primary_key=True)
    date_time = db.Column(db.DateTime, nullable=False)
    venue = db.Column(db.String, nullable=False)
    # location = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
    artist_id = db.Column(db.Integer, db.ForeignKey('artists.id'))

    artist = db.relationship('Artist', back_populates='events')

    @property
    def artist_name(self):
        return self.artist.name

    @property
    def likes(self):
        likes = Like.query.filter(
            Like.likeable_type == 'event',
            Like.likeable_id == self.id
            ).all()
        return likes
    
    @property
    def attending(self):
        return len(self.attendees)

    @validates('date_time')
    def validate_date_time(self, _, date_time):
        if not isinstance(date_time, datetime):
            raise TypeError(
                'Date_time must be a valid datetime object.'
            )
        return date_time
    
    @validates('venue')
    def validate_venue(self, _, venue):
        if not isinstance(venue, str):
            raise TypeError(
                'Venue must be a string.'
            )
        elif len(venue) not in range(40):
            raise ValueError(
                'Venue must be between 1 and 40 characters.'
            )
        return venue