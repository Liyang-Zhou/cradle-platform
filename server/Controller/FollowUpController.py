import logging
import json

from flask import request
from flask_restful import Resource, abort

# Project modules
from Manager.FollowUpManager import FollowUpManager

followUpManager = FollowUpManager()

# URI: /followup
class FollowUp(Resource):

    @staticmethod
    def _get_request_body():
        raw_req_body = request.get_json(force=True)
        print('Request body: ' + json.dumps(raw_req_body, indent=2, sort_keys=True))
        return raw_req_body

    # Get all followups
    # Get all followups with an ID
    # Get all followups, for a specific referral
    @staticmethod
    def get(id=None):      
        args = request.args  
        if id:
            logging.debug('Received request: GET /follow_up/<id>')
            follow_up = followUpManager.read("id", id)
            if follow_up is None: 
                abort(400, message=f'No FollowUp exists with id "{id}"')
            return follow_up
        elif args:
            logging.debug('Received request: GET /follow_up')
            print("args: " + json.dumps(args, indent=2, sort_keys=True))
            follow_ups = followUpManager.search(args)
            if not follow_ups:
                abort(400, message="No FollowUps found with given query params.")
            return follow_ups
        else:
            logging.debug('Received request: GET /follow_up')
            follow_ups = followUpManager.read_all()
            if not follow_ups:
                abort(404, message="No FollowUps currently exist.")
            return follow_ups

    # Create a new patient
    @staticmethod
    def post():
        logging.debug('Received request: POST /follow_up')
        hf_data = FollowUp._get_request_body()
        response_body = followUpManager.create(hf_data)
        return response_body, 201

    @staticmethod
    def put(id=None):
        logging.debug('Received request: PUT /follow_up/<id>')
        # validate inputs
        if not id:
            abort(400, message="id is required")
    
        new_follow_up = FollowUp._get_request_body()
        update_res = followUpManager.update("id", id, new_follow_up)

        if not update_res:
            abort(400, message=f'No FollowUp exists with id "{id}"')
        else:
            return update_res

    @staticmethod
    def delete(id=None):
        # validate inputs
        if id:
            logging.debug('Received request: DELETE /follow_up/<id>')
            del_res = followUpManager.delete("id", id)
            if not del_res:
                abort(400, message=f'No FollowUp exists with id "{id}"')
        else:
            logging.debug('Received request: DELETE /follow_up')
            followUpManager.delete_all()
        return {}

    