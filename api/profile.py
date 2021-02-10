from ._utils.handler import RequestHandler
import json


def sanitze(input_arr):
    unq_set = set(input_arr)
    sanitzed_arr = []
    for num in list(unq_set):
        if num and len(num) == 10 and num.isnumeric():
            sanitzed_arr.append(num)

    if len(sanitzed_arr) == 0:
        raise Exception("Invalid mobile number given")

    return sanitzed_arr


class handler(RequestHandler):

    def do_GET(self):

        try:
            parameters = self._get_parameters()
            response_body = {}
            self._db_connection("profiles")

            filter = {
                "_id": parameters["id"][0]
            }
            query_res = self.collection.find_one(filter)

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
        try:
            json_data = self._get_json_data()
            self._db_connection("profiles")

            filter = {
                "_id": json_data["id"]
            }

            insert_res = self.collection.replace_one(filter, {
                "_id": json_data["id"],
                "emergency_contacts": sanitze(json_data["numbers"])
            }, upsert=True)

            response_body = {
                "status": 200,
                "upsert_id": insert_res.upserted_id,
                "modified": insert_res.modified_count
            }

        except Exception as e:
            response_body = {
                "status": 500,
                "message": repr(e)
            }

        finally:
            self._send_response(response_body)
