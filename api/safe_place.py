from ._utils.handler import RequestHandler
from ._utils.dbscan import DBSCAN
from bson.objectid import ObjectId

import json


def find_safe_place(coordinates, gps_cord):
    dbscan = DBSCAN()
    safe_place_gps = dbscan.run(coordinates, gps_cord)
    return safe_place_gps


class handler(RequestHandler):

    def do_POST(self):
        response_body = {}
        try:
            json_data = self._get_json_data()

            self._db_connection()
            emergency_collection = self.mongo_database["emergencies"]

            if "emergency_id" in json_data and "gps" in json_data:
                emergency_id = json_data["emergency_id"]
                gps_latitude = json_data["gps"].get("latitude", None)
                gps_longitude = json_data["gps"].get("longitude", None)

                filter = {
                    "_id": ObjectId(emergency_id),
                    "isActive": True
                }


                query_res = emergency_collection.find_one(
                    filter, {"nearby_devices": 1, "gps_history": 1})
                nearby_devices = query_res["nearby_devices"]

                if not gps_longitude or not gps_longitude:
                    gps_cord = [gps_latitude, gps_longitude]                    
                    emergency_collection.update_one(filter, {
                            '$push': {
                                'gps_history': gps_cord
                            }
                        })
                else:
                    gps_cord = query_res["gps_history"][-1]

                safe_place = None
                if len(nearby_devices) > 5:
                    safe_place = find_safe_place(nearby_devices, gps_cord)

                response_body = {
                    "status": 200,
                    "coordinate": safe_place
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
