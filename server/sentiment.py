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

print "start training"
classifier = NaiveBayesClassifier.train(train_features)

reviewList = []
reviewContent = {}
print "starting sentiment"
for line in open('yelp_academic_dataset_review.json', 'r'):
    review_json = TextProcess.read_line(line)
    review_id = review_json['review_id']
    reviewContent[review_id] = review_json['text']

    #print "Review %s score: %s" % (review_id, classifier.posScore(word_features(TextProcess.tokenize(review_json))))
    reviewList.append((review_id, classifier.posScore(word_features(TextProcess.tokenize(review_json)))))

print "done with sentiment"
reviewList = sorted(reviewList, key=lambda count: count[1], reverse=True)

nchunks = 9
chunksize,remainder = divmod(len(reviewList),nchunks)
sizes = [chunksize]*nchunks
if remainder:
    sizes[-remainder:] = [chunksize+1 for x in xrange(remainder)]
idx = 0
result = []
for s in sizes:
    result.append(reviewList[idx:idx+s])
    idx += s

sentDict = {}
for i in range(0, 9):
    curChunk = result[i]
    #for j in curChunk:
    for j in range (0, len(curChunk)):
        jM = list(curChunk[j])
        if i == 0:
            jM[1] = 5
        if i == 1:
            jM[1] = 4.5
        if i == 2:
            jM[1] = 4
        if i == 3:
            jM[1] = 3.5
        if i == 4:
            jM[1] = 3
        if i == 5:
            jM[1] = 2.5
        if i == 6:
            jM[1] = 2
        if i == 7:
            jM[1] = 1.5
        if i == 8:
            jM[1] = 1
        sentDict[jM[0]] = jM[1]

f=open('reviewSentimentStars.json', 'w+')
print >>f, json.dumps(sentDict)
#print reviewContent[str(result[0][0][0])]
