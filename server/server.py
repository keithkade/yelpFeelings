__author__ = 'jtgoen'

from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
import urlparse
from utility import TextProcess
import json


PORT = 4000

class Handler(BaseHTTPRequestHandler):

    def do_GET(self):
        query_dict = urlparse.parse_qs(urlparse.urlparse(self.path).query)
        city = query_dict['city'][0]
        bySentiment = bool(query_dict['bySentiment'][0])
        print "Got a GET request!!!!!!"
        print city

        relev_businesses = []
        for business in business_dict:
            if business_dict[business]['city'] == city:
                relev_businesses.append(business_dict[business]['business_id'])

        relev_reviews = dict()
        for review in review_dict:
            if review_dict[review]['business_id'] in relev_businesses:
                relev_reviews[review_dict[review]['review_id']] = review_dict[review]

        #classify and sort

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(relev_reviews))

        return

if __name__ == '__main__':
    business_dict = dict()
    review_dict = dict()

    for line in open('yelp_academic_dataset_business.json', 'r'):
        business_json = TextProcess.read_line(line)
        business_dict[business_json['business_id']] = business_json

    for line in open('review_KcSJUq1kwO8awZRMS6Q49g', 'r'):
        review_json = TextProcess.read_line(line)
        review_dict[review_json['review_id']] = review_json

try:
    #Create a web server and define the handler to manage the
    #incoming request
    server = HTTPServer(('', PORT), Handler)
    print 'Started httpserver on port ', PORT

    #Wait forever for incoming http requests
    server.serve_forever()

except KeyboardInterrupt:
    print '^C received, shutting down the web server'
    server.socket.close()