yelpFeelings
============

Welcome to our project, Eat Your Feelings. 

Our app revolves around sentiment analysis, the core of which is done in sentiment.py. We use a modified version of the NLTK NaiveBayesClassifier class to calculate positivity scores to each review.

The file that has been modified within NLTK is 'nltk-develop/nltk/classify/naivebayes.py'. Originally, it only returned 'positive' or 'negative' for each piece of text. The relevant addition we made is the posScore function, which returns the positivity score of the text being analyzed. We use this to assign discrete values (the likelihood that a review is positive) to each review. We then sort based on those scores and put reviews into 5 buckets, 1 for each possible star rating, whose sizes are proportional to the numbers of occurences of each rating in our data set. 

To see our analysis in action, clone the entire repo and install our custom NLTK. Then your can run sentiment.py to see our analysis in action. It will probably take 15 minutes to an hour. 

After the sentiment values are calculated, we then execute some pre-computation of the object representations of each business, including data such as their location, the name of the business and their ratings based on stars or sentiment that is calculated using the average of all of the star reviews and computed sentiment scores respectively. This allows for very little heavy computation to be done while the server is running in order to reduce waiting times for the user.

When running the server itself, the server waits for specific requests from the client about city and sorting types, then is able to efficiently return the top 10 businesses based on these categories.
