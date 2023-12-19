from app_setup import db
from sqlalchemy import and_, or_
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from random import sample
from datetime import datetime
import re

from models.like import Like
from models.track import Track
from models.event import Event

class Artist(db.Model):
    __tablename__ = 'artists'

    # **************
    # * ATTRIBUTES *
    # **************

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    name = db.Column(db.String, unique=True)
    # TODO serialize genre dicts w/ dumps and loads
    genres = db.Column(db.String)
    bio = db.Column(db.String)
    location = db.Column(db.String)
    img = db.Column(db.String)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    # *****************
    # * RELATIONSHIPS *
    # *****************

    account = db.relationship('User', back_populates='artist', uselist=False)

    tracks = db.relationship('Track', back_populates='artist', cascade='all, delete-orphan')
    events = db.relationship('Event', back_populates='artist', cascade='all, delete-orphan')

    likes = db.relationship(
        'Like',
        primaryjoin=lambda: Like.artist_id == Artist.id
    )

    # **************
    # * PROPERTIES *
    # **************

    # * USER INFO *

    @property
    def username(self):
        return self.account.username
    
    # TODO How to make this property private? Is it a circular import issue?
    # @property
    # def account(self):
    #     return self._account
    
    # @account.setter
    # def account(self, new_acct):
    #     if not isinstance(new_acct, User):
    #         raise TypeError(
    #             'Account must point to an existing user account.'
    #         )
    #     else:
    #         self._account = new_acct
    
    @property
    def likeables(self):
        return [like.likeable for like in self.likes]

    # * PROFILE INFO *

    @property
    def upcoming_events(self):
        current_time = datetime.now()
        events = [event for event in self.events if event.date_time > current_time]
        return sorted(events, key=lambda event: event.date_time)
    
    @property
    def past_events(self):
        current_time = datetime.now()
        events = [event for event in self.events if event.date_time > current_time]
        return sorted(events, key=lambda event: event.date_time)
    
    # * FOLLOWERS * 

    @property
    def fan_followers(self):
        follows = Like.query.filter(
            Like.likeable_type == 'artist',
            Like.likeable_id == self.id,
            Like.fan_id,
            ).all()
        return [like.liker for like in follows]
    
    @property
    def artist_followers(self):
        follows = Like.query.filter(
            Like.likeable_type == 'artist',
            Like.likeable_id == self.id,
            Like.artist_id,
            ).all()
        return [like.liker for like in follows]
    
    @property
    def followers(self):
        return self.fan_followers + self.artist_followers
    
    @property
    def rand_five_followers(self):
        if len(self.followers) <= 5:
            return self.followers
        else:
            return sample(self.followers, 5)
    
    # * FOLLOWED *
    
    @property
    def followed_artists(self):
        return [likeable for likeable in self.likeables if isinstance(likeable, Artist)]
    
    @property
    def top_five_artists(self):
        return sorted(self.followed_artists, key=lambda artist: len(artist.followers), reverse=True)[:5]

    # * TRACKS *

    @property
    def favorited_tracks(self):
        return [likeable for likeable in self.likeables if isinstance(likeable, Track)]
    
    @property
    def top_five_tracks(self):
        return sorted(self.favorited_tracks, key=lambda track: len(track.fans), reverse=True)[:5]

    # * EVENTS *

    @property
    def rsvped_events(self):
        return [likeable for likeable in self.likeables if isinstance(likeable, Event)]
    
    @property
    def events_attending(self):
        current_time = datetime.now()
        events = [event for event in self.rsvped_events if event.date_time > current_time]
        return sorted(events, key=lambda event: event.date_time)
    
    @property
    def events_attended(self):
        current_time = datetime.now()
        events = [event for event in self.rsvped_events if event.date_time < current_time]
        return sorted(events, key=lambda event: event.date_time)

    # ***************
    # * VALIDATIONS *
    # ***************

    # @validates('name')
    # def validate_name(self, _, name):
    #     if not isinstance(name, str):
    #         raise TypeError(
    #             'Name must be a string.'
    #         )
    #     elif len(name) not in range(40):
    #         raise ValueError(
    #             'Name must be between 1 and 40 characters.'
    #         )
    #     return name
    
    # # TODO Why does this validation break on the seed file?
    # # @validates('genres')
    # # def validate_genres(self, _, genres):
    # #     available_genres = ['Rock', 'Pop', 'Hip-Hop', 'Jazz', 'Electronic', 'Country', 'R&B', 'Classical'],
    # #     if not isinstance(genres, str):
    # #         raise TypeError(
    # #             'Genres must be a string.'
    # #         )
    # #     if genres not in available_genres:
    # #         raise ValueError(
    # #             "Genres must be one of the following: 'Rock', 'Pop', 'Hip-Hop', 'Jazz', 'Electronic', 'Country', 'R&B', 'Classical'."
    # #         )

    # #     return genres
    
    # @validates('bio')
    # def validate_bio(self, _, bio):
    #     if not isinstance(bio, str):
    #         raise TypeError(
    #             'Bio must be a string.'
    #         )
    #     elif len(bio) not in range(400):
    #         raise ValueError(
    #             'Bio must be between 1 and 40 characters.'
    #         )
    #     return bio

    # @validates('location')
    # def validate_location(self, _, location):
    #     if not isinstance(location, str):
    #         raise TypeError(
    #             'Location must be a string.'
    #         )
    #     elif len(location) not in range(30):
    #         raise ValueError(
    #             'Location must be between 1 and 40 characters.'
    #         )
    #     return location
    
    # @validates('img')
    # def validate_img(self, _, img):
    #     if not isinstance(img, str):
    #         raise TypeError('Image URL must be a string.')
        
    #     pattern = re.compile(
    #         r'^(http[s]?:\/\/)?'
    #         r'(?:(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})'
    #         r'(?::\d+)?(?:\/\S*)?$'
    #     )

    #     if not re.match(pattern, img):
    #         raise ValueError('Invalid image URL format.')

    #     return img