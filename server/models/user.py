from app_setup import db
from sqlalchemy import and_
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from datetime import datetime

from app_setup import bcrypt


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True)
    _password_hash = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    artist = db.relationship('Artist', back_populates='account', uselist=False, cascade='all, delete-orphan')
    fan = db.relationship('Fan', back_populates='account', uselist=False, cascade='all, delete-orphan')

    # *******************
    # * SECURITY & AUTH *
    # *******************

    @hybrid_property
    def password_hash(self):
        raise AttributeError('Passwords cannot be revealed.')

    @password_hash.setter
    def password_hash(self, new_password):
        hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
        self._password_hash = hashed_password

    def authenticate(self, password_to_check):
        return bcrypt.check_password_hash(self._password_hash, password_to_check)
    
# TODO Do I need validations on username and password at model level?