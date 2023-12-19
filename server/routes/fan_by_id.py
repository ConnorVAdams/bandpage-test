from flask import request, abort
from flask_restful import Resource
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError
# from flask_jwt_extended import jwt_required
from app_setup import db
from models.fan import Fan
from schemas.fan_schema import FanSchema

fans_schema = FanSchema(many=True, session=db.session)
fan_schema = FanSchema(session=db.session)

class FanById(Resource):
    def get(self, id):
        fan = Fan.query.get_or_404(
            id, description=f'Could not find fan with ID: {id}'
        )
        try:
            serialized_data = fan_schema.dump(fan)
            return serialized_data, 200
        except Exception as e:
            abort(400, str(e))

    # @jwt_required()
    # def patch(self, id):
    #     fan = Fan.query.get_or_404(
    #         id, description=f"Could not find fan with ID: {id}"
    #     )
    #     try:
    #         data = request.get_json()
    #         fan_schema.validate(data)
    #         updated_fan = fan_schema.load(
    #             data, instance=fan, partial=True, session=db.session
    #         )
    #         db.session.commit()
    #         return fan_schema.dump(updated_fan), 200
    #     except (ValueError, ValidationError, IntegrityError) as e:
    #         db.session.rollback()
    #         abort(400, str(e))

    # @jwt_required()
    # def delete(self, id):
    #     prod = Fan.query.get_or_404(
    #         id, description=f"Could not find production with id: {id}"
    #     )
    #     try:
    #         db.session.delete(prod)
    #         db.session.commit()
    #         return None, 204
    #     except Exception as e:
    #         db.session.rollback()
    #         abort(400, str(e))