from __future__ import division

__author__ = 'jtgoen'

from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
import urlparse
from utility import TextProcess
import json


PORT = 4001


class Handler(BaseHTTPRequestHandler):

    def do_GET(self):
        query_dict = urlparse.parse_qs(urlparse.urlparse(self.path).query)
        city = query_dict['city'][0]
        print query_dict['bySentiment'][0]

        by_sentiment = False
        if query_dict['bySentiment'][0] == "True":
            by_sentiment = True

        print "Got a GET request!!!!!!"
        print city

        business_sentiment_json = json.loads(open('business_sentiment.json').read())

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        if by_sentiment:
            print "BY SENTIMENT"
            self.wfile.write(
                json.dumps(
                    sorted(business_sentiment_json,
                           key=lambda businesses: businesses[1]['sentiment'], reverse=True)[:10]))
        else:
            print "BY STARS"
            self.wfile.write(
                json.dumps(
                    sorted(business_sentiment_json,
                           key=lambda businesses: businesses[1]['stars'], reverse=True)[:10]))

        return

if __name__ == '__main__':
    business_dict = dict()
    review_dict = dict()
    sentiment_dict = dict()

    for line in open('yelp_academic_dataset_business.json', 'r'):
        business_json = TextProcess.read_line(line)
        business_dict[business_json['business_id']] = business_json

    for line in open('reviews_subset.json', 'r'):
        review_json = TextProcess.read_line(line)
        review_dict[review_json['review_id']] = review_json

    sentiment_dict = json.loads(open('reviewSentimentStars.json').read())

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