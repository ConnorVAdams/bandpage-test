from flask import request, make_response
from flask_restful import Resource
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
)
from sqlalchemy.exc import IntegrityError
from app_setup import db
from schemas.user_schema import UserSchema
from models.user import User

user_schema = UserSchema(session=db.session)

class Signup(Resource):
    def post(self):
        try:
            username = request.get_json().get('username')
            user_schema.validate(username)
            # user = user_schema.load(data)
            # TODO Fix user_schema, it breaks here when deserializing
            user = User(
                username = username
            )
            user.password_hash = request.get_json().get('password')

            db.session.add(user)
            db.session.commit()
            
            jwt = create_access_token(identity=user.id)
            refresh_token = create_refresh_token(identity=user.id)
            serialized_user = user_schema.dump(user)
            return make_response({"user": serialized_user, "jwt_token": jwt, "refresh_token": refresh_token}, 201)
        except (Exception, IntegrityError) as e:
            db.session.rollback()
            return {"message": str(e)}, 400