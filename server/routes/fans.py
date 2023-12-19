from flask import request, abort, jsonify
from flask_restful import Resource
from marshmallow import ValidationError
from flask_jwt_extended import jwt_required
from app_setup import db
from models.fan import Fan
from schemas.fan_schema import FanSchema

fans_schema = FanSchema(many=True, session=db.session)
fan_schema = FanSchema(session=db.session)

class Fans(Resource):
    def get(self):
        fans = fans_schema.dump(Fan.query)
        return fans, 200

    @jwt_required()
    def post(self):
        try:
            data = request.get_json()
            # fan_schema.validate(data)
            # fan = artist_schema.load(data)
            # TODO Why is load breaking on my schemas but direct instantiation works fine?
            fan = Fan(
                name=data.get('name'),
                bio=data.get('bio'),
                location=data.get('location'),
                img=data.get('img'),
                user_id=data.get('user_id')
            )
            db.session.add(fan)
            db.session.commit()
            # # * Serialize the data and package your JSON response
            new_fan = fan_schema.dump(fan)
            return new_fan, 201
        except (ValidationError, ValueError) as e:
            db.session.rollback()
            abort(400, str(e))