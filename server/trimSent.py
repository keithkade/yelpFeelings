__author__ = 'kade'

from nltk.classify import NaiveBayesClassifier
from nltk.corpus import movie_reviews
from utility import TextProcess
import json

sentDict = {}
for line in open('rawSentiment.txt'):
    tokens = line.split()
    print '["' + tokens[0] + '","' + tokens[3] + '"],'

