from flask import request, abort, jsonify
from flask_restful import Resource
from marshmallow import ValidationError
from flask_jwt_extended import jwt_required
from app_setup import db
from models.user import User
from schemas.user_schema import UserSchema

users_schema = UserSchema(many=True, session=db.session)
user_schema = UserSchema(session=db.session)

class Users(Resource):
    def get(self):
        users = users_schema.dump(User.query)
        return users, 200

    @jwt_required()
    def post(self):
        try:
            data = request.json
            user_schema.validate(data)
            user = user_schema.load(data)
            db.session.add(user)
            db.session.commit()
            serialized_user = user_schema.dump(user)
            print(serialized_user)
            return serialized_user, 201
        except (ValidationError, ValueError) as e:
            db.session.rollback()
            abort(400, str(e))