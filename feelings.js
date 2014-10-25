// GLOBAL VARIABLES
bySentiment = false;

reviews = [
    {
      "business_id": "vcNAWiLM4dR7D2nwwJ7nCA",
      "full_address": "4840 E Indian School Rd\nSte 101\nPhoenix, AZ 85018",
      "categories": [
        "Doctors",
        "Health & Medical"
      ],
       "snippets": [
        "asdkfljasd;lf asdf",
        "asdfasdf  asdf"
      ],
      "name": "Eric Goldberg, MD",
      "stars": 3,
      "sentiment": 5
    },
    {
      "business_id": "vcNAWiLM4dR7D2nwwJ7nC2",
      "full_address": "4840 E Indian School Rd\nSte 101\nPhoenix, AZ 85018",
      "categories": [
        "Doctors",
        "Health & Medical"
      ],
       "snippets": [
        "asdkfljasd lf asdf2",
        "asdfasdf  asdf2"
      ],
      "name": "Other Goldberg, MD",
      "stars": 5,
      "sentiment": 4
    }
]


window.onload = setup(document);

function setup(document)
{
	// start
}

function search(){
    var reviewsDiv = document.getElementById('resultsArea');
    while (reviewsDiv.firstChild){
        reviewsDiv.removeChild(reviewsDiv.firstChild);
    }
    if (document.getElementById('phoenixRadio').checked)
        console.log("User chose Phoenix");
    else //default to Vegas
        console.log("User chose Vegas");
    bySentiment = document.getElementById('feelRadio').checked;
    //make call to server
    //reviews = serverCall
    populate(reviews);
}


function populate(bizs){
    var bizDiv = document.getElementById('resultsArea');
    for (i in bizs){
        curBiz = bizs[i];
        var bDiv = document.createElement('div');
        
        var name = document.createElement('h1');
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
        for (j in curBiz.categories){
            inner += curBiz.categories[j] + ", ";
        }
        inner = inner.substring(0, inner.length - 2);
        cats.innerHTML = inner;

        bDiv.appendChild(name);
        bDiv.appendChild(starsDiv);
        bDiv.appendChild(address);
        bDiv.appendChild(cats);

        bDiv.style.border = "1px solid black";
        bDiv.style.marginBottom = "4px";

        bizDiv.appendChild(bDiv);
    }
}


function makeStars(biz){
    var starDiv = document.createElement('div');
    var sentStars = document.createElement('img');
    var rateStars = document.createElement('img');

    var sentImg = getStarImg(biz.sentiment);
    sentStars.setAttribute('src',sentImg);
    var rateImg = getStarImg(biz.stars);
    rateStars.setAttribute('src',rateImg);    
    
    if (bySentiment){
        var title = document.createElement('h3');
        title.innerHTML = "Feels:";
        title.style.display = 'inline';
        title.style.fontWeight = 'normal';
        starDiv.appendChild(title);
        
        sentStars.style.width = '200px';
        starDiv.appendChild(sentStars);
        
        var title2 = document.createElement('h3');
        title2.innerHTML = "Ratings:"
        title2.style.fontWeight = 'normal';
        title2.style.display = 'inline';
        starDiv.appendChild(title2);
        
        rateStars.style.opacity = 0.5;
        rateStars.style.width = '150px';
        starDiv.appendChild(rateStars);
    }
    else{
        var title2 = document.createElement('h3');
        title2.innerHTML = "Ratings:"
        title2.style.fontWeight = 'normal';
        title2.style.display = 'inline';
        starDiv.appendChild(title2);
        
        rateStars.style.width = '200px';
        starDiv.appendChild(rateStars);
        
        var title = document.createElement('h3');
        title.innerHTML = "Feels:";
        title.style.display = 'inline';
        title.style.fontWeight = 'normal';
        starDiv.appendChild(title);
        
        sentStars.style.width = '150px';
        sentStars.style.opacity = 0.5;
        starDiv.appendChild(sentStars);
    }
    
    return starDiv; 
}

function getStarImg(numStar){
    switch (String(numStar)){
        case '5':
            return 'img/5stars.png';
        case '4.5':
            return 'img/45stars.png';
        case '4':
            return 'img/4stars.png';
        case '3.5':
            return 'img/35stars.png';
        case '3':
            return 'img/3stars.png';
        case '2.5':
            return 'img/25stars.png';
        case '2':
            return 'img/2stars.png';
        case '1.5':
            return 'img/15stars.png';
        case '1':
            return 'img/1stars.png';
        default:
            return 'img/1stars.png';
    }
}
