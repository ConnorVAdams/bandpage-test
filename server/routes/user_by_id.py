from flask import request, abort
from flask_restful import Resource
from marshmallow import ValidationError
from flask_jwt_extended import jwt_required
from app_setup import db, app
from models.user import User
from schemas.user_schema import UserSchema


user_schema = UserSchema(session=db.session)

class UserById(Resource):
    def get(self, id):
        user = User.query.get_or_404(
            id, description=f'Could not find user with ID: {id}'
        )
        try:
            serialized_data = user_schema.dump(user)
            return serialized_data, 200
        except Exception as e:
            abort(400, str(e))

    # @jwt_required()
    # def patch(self, id):
    #     user = User.query.get_or_404(
    #         id, description=f"Could not find user with ID: {id}"
    #     )
    #     try:
    #         data = request.get_json()
    #         user_schema.validate(data)
    #         updated_user = user_schema.load(
    #             data, instance=user, partial=True, session=db.session
    #         )
    #         db.session.commit()
    #         return user_schema.dump(updated_user), 200
    #     except Exception as e:
    #         db.session.rollback()
    #         abort(400, str(e))

    @jwt_required()
    def delete(self, id):
        user = User.query.get_or_404(
            id, description=f"Could not find user with id: {id}"
        )
        
        try:
            db.session.delete(user)
            db.session.commit()
            return None, 204
        except Exception as e:
            db.session.rollback()
            app.logger.error(f"Error deleting user with id {id}: {str(e)}")
            abort(400, str(e))