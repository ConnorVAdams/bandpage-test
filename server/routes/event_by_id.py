from flask import request, abort
from flask_restful import Resource
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError
# from flask_jwt_extended import jwt_required
from app_setup import db
from models.event import Event
from schemas.event_schema import EventSchema

events_schema = EventSchema(many=True, session=db.session)
event_schema = EventSchema(session=db.session)

class EventById(Resource):
    def get(self, id):
        event = Event.query.get_or_404(
            id, description=f'Could not find event with ID: {id}'
        )
        try:
            serialized_data = event_schema.dump(event)
            return serialized_data, 200
        except Exception as e:
            abort(400, str(e))

    # @jwt_required()
    # def patch(self, id):
    #     event = Event.query.get_or_404(
    #         id, description=f"Could not find event with ID: {id}"
    #     )
    #     try:
    #         data = request.get_json()
    #         event_schema.validate(data)
    #         updated_event = event_schema.load(
    #             data, instance=event, partial=True, session=db.session
    #         )
    #         db.session.commit()
    #         return event_schema.dump(updated_event), 200
    #     except (ValueError, ValidationError, IntegrityError) as e:
    #         db.session.rollback()
    #         abort(400, str(e))

    # @jwt_required()
    # def delete(self, id):
    #     prod = Event.query.get_or_404(
    #         id, description=f"Could not find production with id: {id}"
    #     )
    #     try:
    #         db.session.delete(prod)
    #         db.session.commit()
    #         return None, 204
    #     except Exception as e:
    #         db.session.rollback()
    #         abort(400, str(e))