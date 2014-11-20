yelpFeelings
============

Welcome to our project, Eat Your Feelings. 

Our app revolves around sentiment analysis, the core of which is done in sentiment.py. We use a modified version of the NLTK NaiveBayesClassifier class to calculate positivity scores to each review.

The file that has been modified within NLTK is 'nltk-develop/nltk/classify/naivebayes.py'. Originally, it only returned 'positive' or 'negative' for each piece of text. The relevant addition we made is the posScore function, which returns the positivity score of the text being analyzed. We use this to assign discrete values (the likelihood that a review is positive) to each review. We then sort based on those scores and put reviews into 5 buckets, 1 for each possible star rating, whose sizes are proportional to the numbers of occurences of each rating in our data set. 

To see our analysis in action, clone the entire repo and install our custom NLTK. Then your can run sentiment.py to see our analysis in action. It will probably take 15 minutes to an hour. 
