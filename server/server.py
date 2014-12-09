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
        sort = query_dict['sort'][0]

        print "Got a GET request!!!!!!"
        print city
        print sort

        business_sentiment = json.loads(open('business_sentiment.json').read())

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

        city_businesses = filter(lambda business: city in business['full_address'], business_sentiment)

        city_temp = []
        for business in city_businesses:
            bad_business = False
            for category in city_businesses[business]['categories']:
                if "Auto" in category or "Services" in category:
                    bad_business = True
            if not bad_business:
                city_temp.append(business)

        city_businesses = city_temp

        if sort == "Highest Sentiment":
            print "Highest Sentiment"
            self.wfile.write(
                json.dumps(
                    sorted(city_businesses, key=lambda business: business['sentiment'], reverse=True)[:10]))
        elif sort == "Lowest Sentiment":
            print "Lowest Sentiment"
            self.wfile.write(
                json.dumps(
                    sorted(city_businesses, key=lambda business: business['sentiment'])[:10]))
        elif sort == "Highest Rating":
            print "Highest Rating"
            self.wfile.write(
                json.dumps(
                    sorted(city_businesses, key=lambda business: business['stars'], reverse=True)[:10]))
        elif sort == "Lowest Rating":
            print "Lowest Rating"
            self.wfile.write(
                json.dumps(
                    sorted(city_businesses, key=lambda business: business['stars'])[:10]))
        elif sort == "Most Controversial":
            print "Most Controversial"
            self.wfile.write(
                json.dumps(
                    sorted(city_businesses,
                           key=lambda business: abs(business['stars'] - business['sentiment']), reverse=True)[:10]))

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