from __future__ import division
__author__ = 'jtgoen'

import json
from utility import TextProcess


business_dict = dict()
review_dict = dict()
user_dict = dict(dict())

for line in open('yelp_academic_dataset_business.json', 'r'):
        business_json = TextProcess.read_line(line)
        business_dict[business_json['business_id']] = business_json

for line in open('yelp_academic_dataset_review.json', 'r'):
    review_json = TextProcess.read_line(line)
    review_dict[review_json['review_id']] = review_json

sentiment_dict = json.loads(open('reviewSentimentStars.json').read())
confidence_dict = json.loads(open('reviewConfidence.json').read())

for review in review_dict:
    if review_dict[review]['user_id'] not in user_dict:
        user_id = review_dict[review]['user_id']
        user_dict[user_id] = dict(
            value=abs(review_dict[review]['stars'] - sentiment_dict[review_dict[review]['review_id']]),
            reviews=1.0)
    else:
        user_dict[review_dict[review]['user_id']]['value'] += \
            abs(review_dict[review]['stars'] - sentiment_dict[review_dict[review]['review_id']])
        user_dict[review_dict[review]['user_id']]['reviews'] += 1.0

for user in user_dict:
    user_dict[user]['value'] /= user_dict[user]['reviews']

top_five_percent_count = int(round(.05*len(user_dict)))

bad_users = dict(
    sorted(user_dict.iteritems(), key=lambda users: users[1]['value'], reverse=True)[:top_five_percent_count])

review_dict = {k: v for k, v in review_dict.iteritems() if v['user_id'] not in bad_users}


business_sentiments = []
for business in business_dict:
    num_reviews = 0
    star_aggregate = 0
    sentiment_aggregate = 0
    confidence_aggregate = 0
    star_average = 0
    sentiment_average = 0
    snippets = []

    for review in review_dict:
        if review_dict[review]['business_id'] == business:
            num_reviews += 1
            star_aggregate += review_dict[review]['stars']
            sentiment_aggregate += sentiment_dict[review_dict[review]['review_id']]
            confidence_aggregate += confidence_dict[review_dict[review]['review_id']]
            if num_reviews < 5:
                snippets.append(review_dict[review]['text'][:70]+'...')

    if num_reviews == 0:
        pass
    else:
        star_average = star_aggregate / num_reviews
        sentiment_average = sentiment_aggregate / num_reviews
        confidence_average = confidence_aggregate / num_reviews
        business_sentiments.append(
            dict(business_id=business,
                 full_address=business_dict[business]['full_address'],
                 categories=business_dict[business]['categories'],
                 snippets=snippets,
                 name=business_dict[business]['name'],
                 stars=star_average,
                 sentiment=sentiment_average,
                 confidence=confidence_average)
        )

business_file = open('business_sentiment.json', 'w+')
print >> business_file, json.dumps(business_sentiments)