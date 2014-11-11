/*global console, document, XMLHttpRequest*/
// GLOBAL VARIABLES
var bySentiment = false;
var globalSnips = {};
var globalBizs = {};
var xmlHttp = null;    

function search(){
    var reviewsDiv = document.getElementById('resultsArea');
    while (reviewsDiv.firstChild){
        reviewsDiv.removeChild(reviewsDiv.firstChild);
    }

    var city = document.getElementById("city");
    var cityStr = city.options[city.selectedIndex].innerHTML;
    var sort = document.getElementById("sort");
    var sortStr = sort.options[sort.selectedIndex].innerHTML;
    
    var theUrl = "http://104.131.175.100:4001?city="+cityStr+"&sort="+sortStr;
    console.log(theUrl);
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, true);
    xmlHttp.onreadystatechange = function (){
        if (xmlHttp.readyState==4) {
            while(reviewsDiv.firstChild){ 
                reviewsDiv.removeChild(reviewsDiv.firstChild);
            }
            var reviews = JSON.parse(xmlHttp.responseText);
            console.log(xmlHttp.responseText);
            populate(reviews);
        }
    };
    xmlHttp.send(null);
    var loadingP = document.createElement('p');
    loadingP.innerHTML = "Loading Businesses.. (It can take about a minute)";
    reviewsDiv.appendChild(loadingP);
}

function onSpanMouseOver(businessID){
    if (document.getElementById(businessID) !== null){
        var elem = document.getElementById(businessID).childNodes;
        elem[0].style.display = "none";
        elem[1].style.display = "inline";
    }
}

function onSpanMouseOut(businessID){
    if (document.getElementById(businessID) !== null){
        var elem = document.getElementById(businessID).childNodes;
        elem[0].style.display = "inline";
        elem[1].style.display = "none";
    }
}

function populate(bizs){
    globalBizs = bizs;
    var bigBizDiv = document.getElementById('resultsArea');
    for (var i in bizs){
        var curBiz = bizs[i];
        var singleBizDiv = document.createElement('div');
        singleBizDiv.style.width = "900px";
        
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
        for (j in curBiz.snippets){
            var reviewSnipSpan = document.createElement('span');
            reviewSnipSpan.id = curBiz.business_id;
            var reviewSnipfull = document.createElement('span');
            reviewSnipfull.style.display = "none";
            var reviewSniptrim = document.createElement('span');

            reviewSnipfull.innerHTML = "\"" + curBiz.snippets[j] + "<br>";
            reviewSniptrim.innerHTML = "\"" + curBiz.snippets[j].substring(0,50) + "...\"" + "<br>";

            reviewSnipSpan.onmouseover = onSpanMouseOver(curBiz.business_id); 
            reviewSnipSpan.onmouseout = onSpanMouseOut(curBiz.business_id); 

            reviewSnipSpan.appendChild(reviewSniptrim);
            reviewSnipSpan.appendChild(reviewSnipfull);

            reviewSnips.appendChild(reviewSnipSpan);
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
    
    var title, title2 = "";
    if (bySentiment){
        title = document.createElement('h3');
        title.innerHTML = "Feels:";
        title.style.display = 'inline';
        title.style.fontWeight = 'normal';
        starDiv.appendChild(title);
        
        sentimentStars.style.width = '200px';
        starDiv.appendChild(sentimentStars);
        
        title2 = document.createElement('h3');
        title2.innerHTML = "Ratings:";
        title2.style.fontWeight = 'normal';
        title2.style.display = 'inline';
        starDiv.appendChild(title2);
        
        rateStars.style.opacity = 0.5;
        rateStars.style.width = '150px';
        starDiv.appendChild(rateStars);
    }
    else{
        title = document.createElement('h3');
        title.innerHTML = "Ratings:";
        title.style.fontWeight = 'normal';
        title.style.display = 'inline';
        starDiv.appendChild(title);
        
        rateStars.style.width = '200px';
        starDiv.appendChild(rateStars);
        
        title2 = document.createElement('h3');
        title2.innerHTML = "Feels:";
        title2.style.display = 'inline';
        title2.style.fontWeight = 'normal';
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
