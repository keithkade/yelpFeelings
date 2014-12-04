/*global console, document, XMLHttpRequest, window*/
// GLOBAL VARIABLES
var bySentiment = true;
var globalSnips = {};
var globalBizs = {};
var xmlHttp = null;    
var posWords = ["happy","alive","good","understanding","great","playful","calm","confident","courageous","peaceful","reliable","joyous","energetic","easy","lucky","liberated","comfortable","amazed","fortunate","optimistic","pleased","delighted","encouraged","sympathetic","overjoyed","clever","gleeful","satisfied","thankful","content","receptive","important","accepting","festive","spirited","certain","kind","ecstatic","thrilled","relaxed","satisfied","wonderful","serene","glad","free","easy ","cheerful","bright","sunny","blessed","merry","reassured ","elated","jubilant","love","interested","positive","loving","eager","considerate","affectionate","fascinated","devoted","inquisitive","inspired","attracted","determined","dynamic","passionate","excited","tenacious","admiration","engrossed","enthusiastic","hardy","warm","curious","bold","secure","touched ","brave","sympathy","close","challenged","loved","optimistic","comforted","confident","hopeful"];
var negWords = ["angry","depressed","confused","helpless","irritated","lousy","upset","incapable","enraged","disappointed","doubtful","alone","hostile","discouraged","uncertain","paralyzed","insulting","ashamed","indecisive","fatigued","sore","powerless","perplexed","useless","annoyed","diminished","embarrassed","inferior","upset","guilty","hesitant","vulnerable","hateful","dissatisfied","shy","empty","unpleasant","miserable","stupefied","forced","offensive","detestable","disillusioned","hesitant","bitter","repugnant","unbelieving","despair","aggressive","despicable","skeptical","frustrated","resentful","disgusting","distrustful","distressed","inflamed","abominable","misgiving","woeful","provoked","terrible","lost","pathetic","unsure","tragic","infuriated","sulky","uneasy","cross","bad","pessimistic","dominated","loss","tense","boiling","fuming","indignant","indifferent","afraid","hurt","sad","insensitive","fearful","crushed","tearful","dull","terrified","tormented","sorrowful","nonchalant","suspicious","deprived","pained","neutral","anxious","pained","grief","reserved","alarmed","tortured","anguish","weary","panic","dejected","desolate","bored","nervous","rejected","desperate","preoccupied","scared","injured","pessimistic","cold","worried","offended","unhappy","disinterested","frightened","afflicted","lonely","lifeless","timid","aching","grieved","shaky","victimized","mournful","restless","heartbroken","dismayed","doubtful","agonized","threatened","appalled","cowardly","humiliated","quaking","wronged","menaced","alienated","wary","horrible","worst","scam","bullshit"];


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
            inner += "Categories: ";
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
            for (var wi in wordList){
                curWord = wordList[wi];
                for (var wp in posWords){
                    if (curWord.toLowerCase() == posWords[wp]){
                        index = curBiz.snippets[j].indexOf(curWord);
                        index2 = index+curWord.length+1;
                        choppedStr = curBiz.snippets[j].split("");
                        choppedStr.splice(index, 0, "<span class=\"posWord\">");
                        choppedStr.splice(index2, 0, "</span>");
                        curBiz.snippets[j] = choppedStr.join("");
                    }
                }
                for (var wn in negWords){
                    if (curWord.toLowerCase() == negWords[wn]){
                        index = curBiz.snippets[j].indexOf(curWord);
                        index2 = index+curWord.length+1;
                        choppedStr = curBiz.snippets[j].split("");
                        choppedStr.splice(index, 0, "<span class=\"negWord\">");
                        choppedStr.splice(index2, 0, "</span>");
                        curBiz.snippets[j] = choppedStr.join("");
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
