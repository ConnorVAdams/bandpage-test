from flask import request, abort, jsonify
from flask_restful import Resource
from marshmallow import ValidationError
from flask_jwt_extended import jwt_required
from app_setup import db
from models.artist import Artist
from schemas.artist_schema import ArtistSchema

artists_schema = ArtistSchema(many=True, session=db.session)
artist_schema = ArtistSchema(session=db.session, partial=True)

class Artists(Resource):
    def get(self):
        artists = artists_schema.dump(Artist.query)
        return artists, 200

    @jwt_required()
    def post(self):
        try:
            data = request.get_json()
            # artist_schema.validate(data)
            # artist = artist_schema.load(data)
            # TODO Why is load breaking on my schemas but direct instantiation works fine?
            artist = Artist(
                name=data.get('name'),
                genres=data.get('genres'),
                bio=data.get('bio'),
                location=data.get('location'),
                img=data.get('img'),
                user_id=data.get('user_id')
            )
            db.session.add(artist)
            db.session.commit()
            new_artist = artist_schema.dump(artist)
            return new_artist, 201
        except (ValidationError, ValueError) as e:
            db.session.rollback()
            abort(400, str(e))