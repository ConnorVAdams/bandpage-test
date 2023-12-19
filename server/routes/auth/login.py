from flask import request, jsonify, make_response
from flask_restful import Resource
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
)
from app_setup import db
from models.user import User
from schemas.user_schema import UserSchema

user_schema = UserSchema(session=db.session)

class Login(Resource):
    def post(self):
        try:
            data = request.get_json()
            print(data)
            username = data.get('username')
            user = User.query.filter_by(username=username).first()
            if user and user.authenticate(data.get("password")):
                jwt = create_access_token(identity=user.id)
                refresh_token = create_refresh_token(identity=user.id)
                serialized_user = user_schema.dump(user)
                return make_response({"user": serialized_user, "jwt_token": jwt, "refresh_token": refresh_token}, 200)
            return {"message": "Username or password incorrect."}, 403
        except Exception as e:
            return {"message": "Username or password incorrect."}, 403