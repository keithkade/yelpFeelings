__author__ = 'jtgoen'

from nltk.classify import NaiveBayesClassifier
from nltk.corpus import movie_reviews
from utility import TextProcess
import json

def word_features(words):
    return dict([(word, True) for word in words])

negative_ids = movie_reviews.fileids('neg')
positive_ids = movie_reviews.fileids('pos')


negReviews = []
for line in open('negReviews.json'):
    wordsDict = {}
    for word in json.loads(line)['text'].split():
        wordsDict[word] = True
    negReviews.append((wordsDict,'neg'))

posReviews = []
for line in open('posReviews.json'):
    wordsDict = {}
    for word in json.loads(line)['text'].split():
        wordsDict[word] = True
    posReviews.append((wordsDict,'pos'))

#negative_features = [(word_features(movie_reviews.words(fileids=[f])), 'neg') for f in negative_ids]
#positive_features = [(word_features(movie_reviews.words(fileids=[f])), 'pos') for f in positive_ids]

#train_features = negative_features + positive_features
train_features = negReviews + posReviews

print len(train_features)

print "start training"
classifier = NaiveBayesClassifier.train(train_features)

reviewList = []
reviewContent = {}
print "starting sentiment"
for line in open('../../data/yelp_academic_dataset_review.json', 'r'):
    review_json = TextProcess.read_line(line)
    review_id = review_json['review_id']
    reviewContent[review_id] = review_json['text']

    #print "==="
    #print review_json['text']
    #print "Review %s pos score: %s" % (review_id, classifier.posScore(word_features(TextProcess.tokenize(review_json))))
    #print "Review %s neg score: %s" % (review_id, classifier.negScore(word_features(TextProcess.tokenize(review_json))))
    #print "==="
    reviewList.append((review_id, classifier.posScore(word_features(TextProcess.tokenize(review_json)))))

print "done with sentiment"
reviewList = sorted(reviewList, key=lambda count: count[1])


#1 110772, 2 102737, 3 163761, 4 342143, 5 406045

sentDict = {}
for i in range(0, len(reviewList)):
    cur = reviewList[i]
    val = 0
    if i <= 110772:
        val = 1
    elif i <= 102737+110772:
        val = 2
    elif i <= 102737+110772+163761:
        val = 3
    elif i <= 102737+110772+163761+342143:
        val = 4
    else:
        val = 5
    sentDict[cur[0]] = val

f=open('reviewSentimentStars.json', 'w+')
print >>f, json.dumps(sentDict)
#print reviewContent[str(result[0][0][0])]
