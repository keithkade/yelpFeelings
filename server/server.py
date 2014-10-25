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
        bySentiment = False
        if query_dict['bySentiment'][0] == "True":
            bySentiment = True
        print "Got a GET request!!!!!!"
        print city

        relev_businesses = []
        for business in business_dict:
            relev_businesses.append(business_dict[business]['business_id'])
            #if business_dict[business]['city'] == city:
                #relev_businesses.append(business_dict[business]['business_id'])

        relev_reviews = dict()
        for review in review_dict:
            if review_dict[review]['business_id'] in relev_businesses:
                relev_reviews[review_dict[review]['review_id']] = review_dict[review]

        #classify and sort
        relev_sentiments = []
        for business in relev_businesses:
            num_reviews = 0
            star_aggregate = 0
            sentiment_aggregate = 0
            star_average = 0
            sentiment_average = 0
            snippets = []

            for review in relev_reviews:
                if relev_reviews[review]['business_id'] == business:
                    num_reviews += 1
                    star_aggregate += relev_reviews[review]['stars']
                    sentiment_aggregate += sentiment_dict[relev_reviews[review]['review_id']]
                    if num_reviews < 5:
                        snippets.append(relev_reviews[review]['text'][:70]+'...')
            if num_reviews == 0:
                pass
            else:
                star_average = star_aggregate / num_reviews
                sentiment_average = sentiment_aggregate / num_reviews
                relev_sentiments.append(
                    dict(business_id=business,
                         full_address=business_dict[business]['full_address'],
                         categories=business_dict[business]['categories'],
                         snippets=snippets,
                         name=business_dict[business]['name'],
                         stars=star_average,
                         sentiment=sentiment_average)
                )

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        if bySentiment:
            print "BY SENTIMENT"
            self.wfile.write(
                json.dumps(
                    sorted(relev_sentiments, key=lambda company: company['sentiment'], reverse=True)[:10]))
        else:
            print "BY STARS"
            self.wfile.write(
                json.dumps(
                    sorted(relev_sentiments, key=lambda company: company['stars'], reverse=True)[:10]))

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