from ._utils.handler import RequestHandler
from datetime import datetime
from bson.objectid import ObjectId

import uuid
import json


def inform_police(victim_gps, tracking_id):
    # unimplemented
    return


def send_sms(numbers, tracking_id):
    # unimplemented
    return


class handler(RequestHandler):

    def inform_family_police(self, id, gps, tracking_id):
        profiles_collection = self.mongo_database["profiles"]
        filter = {
            "_id": id
        }
        query_res = profiles_collection.find_one(filter)

        emergency_contacts = query_res["emergency_contacts"]

        inform_police(gps, tracking_id)
        send_sms(emergency_contacts, tracking_id)

    def inform_other_devices(self, emergency_id, gps):
        # TODO
        return

    def do_GET(self):
        try:
            parameters = self._get_parameters()
            self._db_connection()
            emergency_collection = self.mongo_database["emergencies"]

            filter = {
                "_id": ObjectId(parameters["id"][0])
            }
            query_res = emergency_collection.find_one(filter)
            if query_res:
                response_body = {
                    "status": 200,
                    "data": query_res
                }
            else:
                response_body = {
                    "status": 404,
                    "data": query_res
                }
        except Exception as e:
            response_body = {
                "status": 500,
                "message": repr(e)
            }
        finally:
            self._send_response(response_body)

    def do_POST(self):
        response_body = {}
        try:
            json_data = self._get_json_data()

            self._db_connection()
            emergency_collection = self.mongo_database["emergencies"]

            if "userid" in json_data and "gps" in json_data:

                victim_id = json_data["userid"]
                gps_lat = json_data["gps"].get("latitude", None)
                gps_long = json_data["gps"].get("longitude", None)
                gps_cord = [gps_lat, gps_long]
                tracking_id = str(uuid.uuid4())

                self.inform_family_police(victim_id, gps_cord, tracking_id)

                insert_res = emergency_collection.insert_one({
                    "victim_id": victim_id,
                    "report_time": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                    "isActive": True,
                    "gps": gps_cord,
                    "gps_history": [
                        gps_cord
                    ],
                    "nearby_devices": [],
                    "tracking_id": tracking_id
                })

                emergency_id = str(insert_res.inserted_id)

                self.inform_other_devices(emergency_id, gps_cord)
                
                response_body = {
                    "status": 200,
                    "id": emergency_id
                }
            else:
                response_body = {
                    "status": 400,
                    "message": "Bad Request"
                }

        except Exception as e:
            response_body = {
                "status": 500,
                "message": repr(e)
            }

        finally:
            self._send_response(response_body)

    def do_PUT(self):
        try:
            parameters = self._get_parameters()
            response_body = {}
            self._db_connection()
            emergency_collection = self.mongo_database["emergencies"]

            filter = {
                "_id": ObjectId(parameters["id"][0])
            }

            query_res = emergency_collection.update_one(filter, {
                "$set": {
                    "isActive": False
                }
            })

            if query_res:
                response_body = {
                    "status": 200,
                    "data": query_res.modified_count
                }
            else:
                response_body = {
                    "status": 404,
                    "data": query_res
                }
        except Exception as e:
            response_body = {
                "status": 500,
                "message": repr(e)
            }
        finally:
            self._send_response(response_body)
