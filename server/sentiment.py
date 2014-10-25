__author__ = 'jtgoen'

from nltk.classify import NaiveBayesClassifier
from nltk.corpus import movie_reviews
from utility import TextProcess
import json


def word_features(words):
    return dict([(word, True) for word in words])

negative_ids = movie_reviews.fileids('neg')
positive_ids = movie_reviews.fileids('pos')

negative_features = [(word_features(movie_reviews.words(fileids=[f])), 'neg') for f in negative_ids]
positive_features = [(word_features(movie_reviews.words(fileids=[f])), 'pos') for f in positive_ids]

train_features = negative_features + positive_features

classifier = NaiveBayesClassifier.train(train_features)

reviewList = []
for line in open('review_KcSJUq1kwO8awZRMS6Q49g', 'r'):
    review_json = TextProcess.read_line(line)
    review_id = review_json['review_id']

    #print "Review %s score: %s" % (review_id, classifier.posScore(word_features(TextProcess.tokenize(review_json))))
    reviewList.append((review_id, classifier.posScore(word_features(TextProcess.tokenize(review_json)))))

reviewList = sorted(reviewList, key=lambda count: count[1], reverse=True)
#print review_json[str(reviewList[0][0])]['text']
