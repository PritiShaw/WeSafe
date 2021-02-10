from http.server import BaseHTTPRequestHandler
import json
import logging
import os
import urllib.parse
import pymongo


class RequestHandler(BaseHTTPRequestHandler):
    collection = None

    def _db_connection(self, collection):
        if self.collection is None:
            mongo_srv = os.environ.get(
                "MONGO_SRV", "mongodb://localhost:27017/")
            db_client = pymongo.MongoClient(mongo_srv)
            self.collection = db_client["weSafe"][collection]

    def _set_response(self, code=200, content_type='application/json'):
        self.send_response(code)
        self.send_header('Content-type', content_type)
        self.end_headers()

    def _get_json_data(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        return json.loads(post_data)

    def _get_parameters(self):
        path = self.path
        if '?' in path:
            path, param = path.split('?', 1)
            return urllib.parse.parse_qs(param)
        return {}

    def _send_response(self, response_body):
        self._set_response(response_body["status"])
        self.wfile.write(json.dumps(response_body).encode('utf-8'))
