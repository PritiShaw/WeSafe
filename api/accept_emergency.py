from ._utils.handler import RequestHandler
from bson.objectid import ObjectId

import json


class handler(RequestHandler):

    def do_POST(self):
        response_body = {}
        try:
            json_data = self._get_json_data()

            self._db_connection()
            emergency_collection = self.mongo_database["emergencies"]

            if "emergency_id" in json_data and "gps" in json_data:
                emergency_id = json_data["emergency_id"]
                gps_lat = json_data["gps"].get("latitude", None)
                gps_long = json_data["gps"].get("longitude", None)
                if gps_lat and gps_long:
                    gps_cord = [gps_lat, gps_long]

                    filter = {
                        "_id": ObjectId(emergency_id)
                    }

                    update_res = emergency_collection.update_one(filter, {
                        '$push': {
                            'nearby_devices': gps_cord
                        }
                    })

                    if update_res and update_res.matched_count == 1:
                        query_res = emergency_collection.find_one(
                            filter, {"tracking_id": 1})
                        response_body = {
                            "status": 200,
                            "tracking_id": query_res["tracking_id"]
                        }
                    else:
                        response_body = {
                            "status": 404,
                            "message": "Emergency ID not found"
                        }
                else:
                    response_body = {
                        "status": 400,
                        "message": "GPS not provided"
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
