/*global console, document, XMLHttpRequest, window*/

/*
Elevator Pitch:

In our project, we conducted sentiment analysis on the review text of Yelp reviews. We did this in hopes of finding differences in the way people talk about a businesses and the way people rate them. We used Naive Bayes, which we trained on a set of hand-classified reviews to assign positivity scores. We then seperated the scores into tiers to mirror the standard star ratings. The words you see highlighted are some of the more polarizing words from our training set.

*/

var bySentiment = true;
var globalSnips = {};
var globalBizs = {};
var xmlHttp = null;    
var emoWords = ["happy","alive","good","understanding","great","playful","calm","confident","courageous","peaceful","reliable","joyous","energetic","easy","lucky","liberated","comfortable","amazed","fortunate","optimistic","pleased","delighted","encouraged","sympathetic","overjoyed","clever","gleeful","satisfied","thankful","content","receptive","important","accepting","festive","spirited","certain","kind","ecstatic","thrilled","relaxed","satisfied","wonderful","serene","glad","free","easy ","cheerful","bright","sunny","blessed","merry","reassured ","elated","jubilant","love","interested","positive","loving","eager","considerate","affectionate","fascinated","devoted","inquisitive","inspired","attracted","determined","dynamic","passionate","excited","tenacious","admiration","engrossed","enthusiastic","hardy","warm","curious","bold","secure","touched ","brave","sympathy","close","challenged","loved","optimistic","comforted","confident","hopeful"];

window.onload = function (){
    search();
};

function search(){
    var reviewsDiv = document.getElementById('resultsArea');
    while (reviewsDiv.firstChild){
        reviewsDiv.removeChild(reviewsDiv.firstChild);
    }

    var city = document.getElementById("city");
    var cityStr = city.options[city.selectedIndex].innerHTML;
    var sort = document.getElementById("sort");
    var sortStr = sort.options[sort.selectedIndex].innerHTML;
    if (sortStr == "Highest Rating" || sortStr == "Lowest Rating"){
        bySentiment = false;
    }
    else bySentiment = true;
    
    var theUrl = "http://104.131.175.100:4001?city="+cityStr+"&sort="+sortStr;
    console.log(theUrl);
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, true);
    xmlHttp.onreadystatechange = function (){
        if (xmlHttp.readyState==4) {
            while(reviewsDiv.firstChild){ 
                reviewsDiv.removeChild(reviewsDiv.firstChild);
            }
            console.log(xmlHttp.responseText);
            var reviews = JSON.parse(xmlHttp.responseText);
            populate(reviews);
        }
    };
    xmlHttp.send(null);
    var loadingP = document.createElement('p');
    loadingP.innerHTML = "Loading Businesses.. (It can take a few seconds)";
    reviewsDiv.appendChild(loadingP);
}

function sanitize(word){   
    var puncList = ['.',',','(',')','?','!',':'];
    for (var i in puncList){
        word = word.replace(puncList[i], "");
    }
    return word.toLowerCase();
}

function onSpanMouseOver(reviewID){
    var elem = document.getElementById(reviewID).childNodes;
    elem[0].style.display = "none";
    elem[1].style.display = "inline";
}

function onSpanMouseOut(reviewID){
    var elem = document.getElementById(reviewID).childNodes;
    elem[0].style.display = "inline";
    elem[1].style.display = "none";
}

function populate(bizs){
    globalBizs = bizs;
    var bigBizDiv = document.getElementById('resultsArea');
    for (var i in bizs){
        var curBiz = bizs[i];
        var singleBizDiv = document.createElement('div');
        singleBizDiv.style.width = "1000px";
        
        var name = document.createElement('h1');
        name.style.width = "500px";
        name.style.margin = "10px";
        name.innerHTML = curBiz.name;
        
        var starsDiv = makeStars(curBiz);

        var address = document.createElement('p');
        address.style.marginTop = "-95px";
        address.style.marginRight = "5px";
        address.style.float = "right";
        var addrStr = curBiz.full_address;
        addrStr = addrStr.replace('\n','<br>');
        address.innerHTML = addrStr;

        var cats = document.createElement('p');
        var inner = "";
        if (curBiz.categories.length > 0)
            inner += "<b>Categories:</b> ";
        for (var j in curBiz.categories){
            inner += curBiz.categories[j] + ", ";
        }
        inner = inner.substring(0, inner.length - 2);
        cats.innerHTML = inner;

        var reviewSnips = document.createElement('p');
        reviewSnips.className = "reviewSnips";
        var uniqueID = 0;
        var curWord, index, index2, choppedStr;
        for (j in curBiz.snippets){
            var wordList = curBiz.snippets[j].split(" ");
            var lastIndex = 0;
            for (var wi in wordList){
                curWord = wordList[wi];
                for (var w in emoWords){
                    if (sanitize(curWord) == emoWords[w]){
                        index = curBiz.snippets[j].indexOf(curWord, lastIndex);
                        index2 = index+curWord.length+1;
                        choppedStr = curBiz.snippets[j].split("");
                        choppedStr.splice(index, 0, "<span class=\"emoWord\">");
                        choppedStr.splice(index2, 0, "</span>");
                        curBiz.snippets[j] = choppedStr.join("");
                        lastIndex = index+1;
                    }
                }              
            }
            
            var reviewSnipDiv = document.createElement('div');
            reviewSnipDiv.id = curBiz.business_id+uniqueID;
            var reviewSnipfull = document.createElement('span');
            reviewSnipfull.style.display = "none";
            var reviewSniptrim = document.createElement('span');

            reviewSnipfull.innerHTML = "\"" + curBiz.snippets[j] + "\"" + "<br>";
            //make sure we don't trim in the middle of a span
            if (curBiz.snippets[j].indexOf("<", 40) != -1 && curBiz.snippets[j].indexOf("<", 40) <= 50){
                reviewSniptrim.innerHTML = "\"" + curBiz.snippets[j].substring(0,curBiz.snippets[j].indexOf("<\/span>", 40)+7) + "...\"" + "<br>";
            }
            //if there is a span encased trim less
            else if (curBiz.snippets[j].indexOf("<") != -1 && curBiz.snippets[j].indexOf("<") < 50){
                //still make sure we dont trim in middle of span
                if (curBiz.snippets[j].indexOf("<", 60) != -1 && curBiz.snippets[j].indexOf("<", 60) <= 70){
                    reviewSniptrim.innerHTML = "\"" + curBiz.snippets[j].substring(0,curBiz.snippets[j].indexOf("<\/span>", 40)+7) + "...\"" + "<br>";
                }
                else {
                    reviewSniptrim.innerHTML = "\"" + curBiz.snippets[j].substring(0,curBiz.snippets[j].indexOf(" ", 70)) + "...\"" + "<br>";
                }
            }
            else {
                reviewSniptrim.innerHTML = "\"" + curBiz.snippets[j].substring(0,curBiz.snippets[j].indexOf(" ", 50)) + "...\"" + "<br>";
            }

            reviewSnipDiv.setAttribute("onmouseover", "onSpanMouseOver(\""+curBiz.business_id+uniqueID+"\")"); 
            reviewSnipDiv.setAttribute("onmouseout", "onSpanMouseOut(\""+curBiz.business_id+uniqueID+"\")"); 

            reviewSnipDiv.appendChild(reviewSniptrim);
            reviewSnipDiv.appendChild(reviewSnipfull);

            reviewSnips.appendChild(reviewSnipDiv);
            uniqueID++;
        }

        singleBizDiv.appendChild(name);
        singleBizDiv.appendChild(starsDiv);
        singleBizDiv.appendChild(address);
        singleBizDiv.appendChild(cats);
        singleBizDiv.appendChild(reviewSnips);

        singleBizDiv.style.border = "1px solid black";
        singleBizDiv.style.marginBottom = "4px";

        bigBizDiv.appendChild(singleBizDiv);
    }
}

function makeStars(biz){
    var starDiv = document.createElement('div');
    var sentimentStars = document.createElement('img');
    var rateStars = document.createElement('img');

    var sentImg = getStarImg(biz.sentiment);
    sentimentStars.setAttribute('src',sentImg);
    var rateImg = getStarImg(biz.stars);
    rateStars.setAttribute('src',rateImg);    
    
    var title = document.createElement('h3');
    title.style.fontWeight = 'normal';
    title.style.display = 'inline';
    
    var title2 = document.createElement('h3');
    title2.style.fontWeight = 'normal';
    title2.style.display = 'inline';
    
    if (bySentiment){
        title.innerHTML = "Feels:";
        starDiv.appendChild(title);
        
        sentimentStars.style.width = '200px';
        starDiv.appendChild(sentimentStars);
        
        title2.innerHTML = "Ratings:";
        
        starDiv.appendChild(title2);
        
        rateStars.style.opacity = 0.5;
        rateStars.style.width = '150px';
        starDiv.appendChild(rateStars);
    }
    else{
        title.innerHTML = "Ratings:";

        starDiv.appendChild(title);
        
        rateStars.style.width = '200px';
        starDiv.appendChild(rateStars);
        
        title2.innerHTML = "Feels:";
        starDiv.appendChild(title2);
        
        sentimentStars.style.width = '150px';
        sentimentStars.style.opacity = 0.5;
        starDiv.appendChild(sentimentStars);
    }

    var confidence = document.createElement('p');
    confidence.className = "confidence";
    biz.confidence = 90;
    confidence.innerHTML = "We are <b>" + biz.confidence + "</b>% confident in the feels score";
    starDiv.appendChild(confidence);
    
    return starDiv; 
}

function getStarImg(numStar){

    if (numStar < 5.1 && numStar >= 4.5)
            return 'img/5stars.png';
    else if (numStar < 4.5 && numStar >= 4)
            return 'img/45stars.png';
    else if (numStar < 4 && numStar >= 3.5)
            return 'img/4stars.png';
    else if (numStar < 3.5 && numStar >= 3)
            return 'img/35stars.png';
    else if (numStar < 3 && numStar >= 2.5)
            return 'img/3stars.png';
    else if (numStar < 2.5 && numStar >= 2)
            return 'img/25stars.png';
    else if (numStar < 2 && numStar >= 1.5)
            return 'img/2stars.png';
    else if (numStar < 1.5 && numStar >= 1)
            return 'img/15stars.png';
    else
            return 'img/1stars.png';
  
}
