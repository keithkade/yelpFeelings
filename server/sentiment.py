__author__ = 'kade'

from nltk.classify import NaiveBayesClassifier
from nltk.corpus import movie_reviews
from utility import TextProcess
import json

def sanitizeWord(word):
    puncSet = set(['.',',','(',')','?','!',':'])
    for punc in puncSet:
        word = word.replace(punc, "")
    word = word.lower()
    return word

def word_features(words):
    return dict([(word, True) for word in words])

negative_ids = movie_reviews.fileids('neg')
positive_ids = movie_reviews.fileids('pos')

negReviews = []
for line in open('negReviews.json'):
    wordsDict = {}
    for word in json.loads(line)['text'].split():
        wordsDict[sanitizeWord(word)] = True
    negReviews.append((wordsDict,'neg'))

posReviews = []
for line in open('posReviews.json'):
    wordsDict = {}
    for word in json.loads(line)['text'].split():
        wordsDict[sanitizeWord(word)] = True
    posReviews.append((wordsDict,'pos'))

#negative_features = [(word_features(movie_reviews.words(fileids=[f])), 'neg') for f in negative_ids]
#positive_features = [(word_features(movie_reviews.words(fileids=[f])), 'pos') for f in positive_ids]

#train_features = negative_features + positive_features
train_features = negReviews + posReviews

print len(train_features)

print "start training"
classifier = NaiveBayesClassifier.train(train_features)

reviewList = []
confList = []
reviewContent = {}
print "starting sentiment"

cutoff = 0
for line in open('../../data/yelp_academic_dataset_review.json', 'r'):

    #cutoff+=1
    #if cutoff > 50:
    #    break

    review_json = TextProcess.read_line(line)
    review_id = review_json['review_id']
    reviewContent[review_id] = review_json['text']

    #if "Loved my haircut" in review_json['text']:
    #print "==="
    #print review_json
    #print "Review %s pos score: %s" % (review_id, classifier.posScore(word_features(TextProcess.tokenize(review_json))))
    #print "Review %s neg score: %s" % (review_id, classifier.negScore(word_features(TextProcess.tokenize(review_json))))
    #print "==="
    posScore = classifier.posScore(word_features(TextProcess.tokenize(review_json)))
    negScore = classifier.negScore(word_features(TextProcess.tokenize(review_json)))

    reviewList.append((review_id,posScore))
    confList.append((review_id, abs(posScore-negScore)))

print "done with sentiment"
classifier.show_most_informative_features(200)

#for pair in classifier.most_informative_features(200):
#    print "\"" + pair[0] + "\"" + ','

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

confList = sorted(confList, key=lambda count: count[1], reverse=True)

# source: http://stackoverflow.com/questions/24483182/python-split-list-into-n-chunks
n = 95
num = float(len(confList))/n
l = [ confList [i:i + int(num)] for i in range(0, (n-1)*int(num), int(num))]
l.append(confList[(n-1)*int(num):])

confDict = {}
percent = 100
for list in l:
    for review in list:
            confDict[review[0]] = percent
    percent -= 1

f=open('reviewConfidence.json', 'w+')
print >>f, json.dumps(confDict)

f=open('reviewSentimentStars.json', 'w+')
print >>f, json.dumps(sentDict)
#print reviewContent[str(result[0][0][0])]