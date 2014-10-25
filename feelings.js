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
        name.style.margin = "2px";
        name.innerHTML = curBiz.name;
        
        var starsDiv = makeStars(curBiz);

        bDiv.appendChild(name);
        bDiv.appendChild(starsDiv);

        bDiv.style.border = "1px solid black";
        bDiv.style.marginBottom = "4px";

        bizDiv.appendChild(bDiv);
    }
}


function makeStars(biz){
    var starDiv = document.createElement('div');
    var sentStars = document.createElement('img');
    var rateStars = document.createElement('img');

    //bad code starts here
    switch (String(biz.sentiment)){
        case '5':
            sentStars.setAttribute('src','img/5stars.png');
            break;
        case '4.5':
            sentStars.setAttribute('src','img/45stars.png');
            break;
        case '4':
            sentStars.setAttribute('src','img/4stars.png');
            break;
        case '3.5':
            sentStars.setAttribute('src','img/35stars.png');
            break;
        case '3':
            sentStars.setAttribute('src','img/3stars.png');
            break;
        case '2.5':
            sentStars.setAttribute('src','img/25stars.png');
            break;
        case '2':
            sentStars.setAttribute('src','img/2stars.png');
            break;    
        case '1.5':
            sentStars.setAttribute('src','img/15stars.png');
            break;
        case '1':
            sentStars.setAttribute('src','img/1stars.png');
            break;                                            
        default:
            sentStars.setAttribute('src','img/1stars.png');
            break;          
    }
    switch (String(biz.stars)){
        case '5':
            rateStars.setAttribute('src','img/5stars.png');
            break;
        case '4.5':
            rateStars.setAttribute('src','img/45stars.png');
            break;
        case '4':
            rateStars.setAttribute('src','img/4stars.png');
            break;
        case '3.5':
            rateStars.setAttribute('src','img/35stars.png');
            break;
        case '3':
            rateStars.setAttribute('src','img/3stars.png');
            break;
        case '2.5':
            rateStars.setAttribute('src','img/25stars.png');
            break;
        case '2':
            rateStars.setAttribute('src','img/2stars.png');
            break;    
        case '1.5':
            rateStars.setAttribute('src','img/15stars.png');
            break;
        case '1':
            rateStars.setAttribute('src','img/1stars.png');
            break;                                            
        default:
            rateStars.setAttribute('src','img/1stars.png');
            break;                                     
    }
    if (bySentiment){
        var title = document.createElement('h3');
        title.innerHTML = "Sentiment:";
        starDiv.appendChild(title);
        starDiv.appendChild(sentStars);
        var title2 = document.createElement('h3');
        title2.innerHTML = "Rating:"
        starDiv.appendChild(title2);
        rateStars.style.opacity = 0.5;
        starDiv.appendChild(rateStars);
    }
    else{
        var title2 = document.createElement('h3');
        title2.innerHTML = "Rating:"
        starDiv.appendChild(title2);
        starDiv.appendChild(rateStars);
        var title = document.createElement('h3');
        title.innerHTML = "Sentiment:";
        starDiv.appendChild(title);
        sentStars.style.opacity = 0.5;
        starDiv.appendChild(sentStars);
    }
    
    return starDiv; 
}