from flask import request
from flask_jwt_extended import jwt_required
from flask_restful import Resource, abort

import api.util as util
import data
import data.crud as crud
import data.marshal as marshal
import service.assoc as assoc
import service.invariant as invariant
import service.view as view
from Manager.PatientStatsManager import PatientStatsManager
from models import Patient
from utils import get_current_time
from Validation import patients


# /api/patients
class Root(Resource):
    @staticmethod
    @jwt_required
    def get():
        user = util.current_user()
        patients = view.patient_view_for_user(user)
        if util.query_param_bool(request, name="simplified"):
            # TODO: Compute simplified view for each patient
            return []
        else:
            return [marshal.marshal(p) for p in patients]

    @staticmethod
    @jwt_required
    def post():
        json = request.get_json(force=True)
        error_message = patients.validate(json)
        if error_message is not None:
            abort(400, message=error_message)
        patient = marshal.unmarshal(Patient, json)

        if crud.read(Patient, patientId=patient.patientId):
            abort(409, message=f"A patient already exists with id: {patient.patientId}")

        # Resolve invariants and set the creation timestamp for the patient ensuring
        # that both the created and lastEdited fields have the exact same value.
        invariant.resolve_reading_invariants(patient)
        creation_time = get_current_time()
        patient.created = creation_time
        patient.lastEdited = creation_time

        crud.create(patient, refresh=True)

        # Associate the patient with the user who created them
        user = util.current_user()
        assoc.associate_by_user_role(patient, user)

        # If the patient has any readings, and those readings have referrals, we
        # associate the patient with the facilities they were referred to
        for reading in patient.readings:
            referral = reading.referral
            if referral and not assoc.has_association(patient, referral.healthFacility):
                assoc.associate(patient, facility=referral.healthFacility)
                # The associate function performs a database commit, since this will
                # wipe out the patient we want to return we must refresh it.
                data.db_session.refresh(patient)
        return marshal.marshal(patient), 201


# /api/patients/<string:patient_id>
class SinglePatient(Resource):
    @staticmethod
    @jwt_required
    def get(patient_id: str):
        patient = crud.read(Patient, patientId=patient_id)
        if not patient:
            abort(404, message=f"No patient with id {patient_id}")
        return marshal.marshal(patient)


# /api/patients/<string:patient_id>/info
class PatientInfo(Resource):
    @staticmethod
    @jwt_required
    def get(patient_id: str):
        patient = crud.read(Patient, patientId=patient_id)
        if not patient:
            abort(404, message=f"No patient with id {patient_id}")
        return marshal.marshal(patient, shallow=True)

    @staticmethod
    @jwt_required
    def put(patient_id: str):
        json = request.get_json(force=True)
        # TODO: validate. How?

        # If the inbound JSON contains a `base` field then we need to check if it is the
        # same as the `lastEdited` field of the existing patient. If it is then that
        # means that the patient has not been edited on the server since this inbound
        # patient was last synced and we can apply the changes. If they are not equal,
        # then that means the patient has been edited on the server after it was last
        # synced with the client. In these cases, we reject the changes for the client.
        #
        # You can think of this like aborting a git merge due to conflicts.
        base = json.get("base")
        if base:
            last_edited = crud.read(Patient, patientId=patient_id).lastEdited
            if base != last_edited:
                abort(409, message="Unable to merge changes, conflict detected")

            # Delete the `base` field once we are done with it as to not confuse the
            # ORM as there is no "base" column in the database for patients.
            del json["base"]

        crud.update(Patient, json, patientId=patient_id)
        patient = crud.read(Patient, patientId=patient_id)

        # Update the patient's lastEdited timestamp only if there was no `base` field
        # in the request JSON. If there was then that means that this edit happened some
        # time in the past and is just being synced. In this case we want to keep the
        # `lastEdited` value which is present in the request.
        if not base:
            patient.lastEdited = get_current_time()
            data.db_session.commit()
            data.db_session.refresh(patient)  # Need to refresh the patient after commit

        return marshal.marshal(patient)


# /api/patients/<string:patient_id>/stats
class PatientStats(Resource):
    @staticmethod
    @jwt_required
    def get(patient_id: str):
        return PatientStatsManager().put_data_together(patient_id)


# /api/patients/<string:patient_id>/readings
class PatientReadings(Resource):
    @staticmethod
    @jwt_required
    def get(patient_id: str):
        patient = crud.read(Patient, patientId=patient_id)
        return [marshal.marshal(r) for r in patient.readings]
