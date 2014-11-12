from __future__ import division

__author__ = 'jtgoen'

from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
import urlparse
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

        business_sentiment = json.loads(open('business_sentiment.json').read())

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

        if by_sentiment:
            print "BY SENTIMENT"
            self.wfile.write(
                json.dumps(
                    sorted(business_sentiment, key=lambda business: business['sentiment'], reverse=True)[:10]))
        else:
            print "BY STARS"
            self.wfile.write(
                json.dumps(
                    sorted(business_sentiment, key=lambda business: business['stars'], reverse=True)[:10]))

        return

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