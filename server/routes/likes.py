from flask import request, abort, jsonify
from flask_restful import Resource
from marshmallow import ValidationError
from flask_jwt_extended import jwt_required
from app_setup import db
from models.like import Like
from schemas.user_schema import UserSchema


class Likes(Resource):
    @jwt_required()
    def post(self):
        try:
            data = request.get_json()
            # TODO Why is load breaking on my schemas but direct instantiation works fine?
            like = Like(**data)
            db.session.add(like)
            db.session.commit()
            return 201   
        except (ValidationError, ValueError) as e:
            db.session.rollback()
            abort(400, str(e))