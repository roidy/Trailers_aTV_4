//
//  TrailerDetailPage.js
//  Trailers
//
//  Created by Robert Parnell on 15/01/2016.
//  Copyright © 2016 Robert Parnell. All rights reserved.
//  See Licence.txt for more details
//

var loadingDoc; // Global loadingDoc

// Display Spinner and start scraping
function trailerDetailPage(json) {
    loadingDoc = makeSpinnerPage("Loading Details...");
    navigationDocument.pushDocument(loadingDoc);
    
    var itemJSON = JSON.parse(decodeURIComponent(json));

    // Load and scrape trailers HTML page
    url = "http://movietrailers.apple.com" + itemJSON.location + "includes/playlists/itunes.inc"
    var req = new XMLHttpRequest();
    
    req.onreadystatechange = function() {
        if (req.readyState == 4) {
            var trailerHTML = req.responseText;
            allClips = scrapeHTML(trailerHTML);
            buildTrailerDetailPage(json, allClips);
        }
    }
    req.open("GET", url, true);
    req.send();
}

// Simple HTML scraper
// Grab all the trailers from an iTunes.inc
// playlist HTML page
function scrapeHTML(trailerHTML) {
    var trailers = [];
    var item = 1;
    
    trailerHTML = trailerHTML.split("<div class='col left'>");
    
    while(true) {
        var t = extractString('"title":"', '", ', trailerHTML[item]);
        var i = extractString("<img src='", ".jpg", trailerHTML[item]) + ".jpg";
        var u = extractString('"url":"', '", ', trailerHTML[item]).replace("720p", "1080p");
        var r = extractString('"runtime":"', '", ', trailerHTML[item]);
        
        if (!t || !i || !u) {break;}
        
        trailers.push({title: t, image: i, url: u, runtime: r});
        item += 1;
    }
    return trailers;
    
}

// Very unsafe string extractor
// Looks for (start) and (end) strings
// and extracts the string inbetween

function extractString(start, end, string) {
    // Very unsafe :(
    try {
        tempStr = string.split(start);
        endVal = tempStr[1].indexOf(end);
        return tempStr[1].substring(0, endVal);
    }
    catch(err) {
        return "";
    }
}

//
// Build the Detail page
//
function buildTrailerDetailPage(trailerJSON, allClips) {
    
    var trailerJSON = JSON.parse(decodeURIComponent(trailerJSON));
    
    var docString = `<?xml version="1.0" encoding="UTF-8" ?>
        <document><head><style>
        .showTextOnHighlight {
            tv-text-highlight-style: show-on-highlight;
        }
        .whiteBadge {
            tv-tint-color: rgb(255, 255, 255);
        }
        </style></head>
        <productTemplate theme="dark">`;
    
    var poster = trailerJSON.poster.replace("poster", "poster-xlarge");
    if (poster.indexOf("http://")) {
        poster = "http://movietrailers.apple.com" + poster;
    }

    docString +=`<banner><heroImg src="` + poster + `" />
        <infoList>`;
    
    if (trailerJSON.directors) {
        docString += `<info><header><title>DIRECTOR</title></header>`;
    
        var directors = trailerJSON.directors.split(", ");
        for (a=0; a<directors.length; a++) {
            docString += `<text>` + cData(directors[a]) + `</text>`;
        }
    
        docString += `</info>`;
    }
    
    if (trailerJSON.actors) {
        docString += `<info><header><title>STARRING</title></header>`;
        var actors = trailerJSON.actors;
        for (a=0; a<actors.length; a++) {
            docString += `<text>` + cData(actors[a]) + `</text>`;
        }
    
        docString += `</info>`;
    }

    docString += `
        </infoList>
        <stack>
        <title>` + cData(trailerJSON.title) + `</title>
        <row>
        <text>` + cData(trailerJSON.studio) + `  •  ` + trailerJSON.genre[0]
    
    if (trailerJSON.releasedate) {
        docString += `  •  ` + cData(trailerJSON.releasedate.split(",")[1].split("00:")[0].trim());
    }
    
    docString += `
        </text>
        </row>
        <description allowsZooming="true" style="tv-text-max-lines: 7">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</description>
        
        </stack>
        </banner>
        <shelf style="padding: 45 60 0 60">
        <section>`;
        
    for(a=0; a<allClips.length; a++) {
        docString += `<lockup onSelect="videoPlay('` + allClips[a].url + `')">
            <img src="` + allClips[a].image + `" width="320" height="180" />
            <title>` + cData(allClips[a].title) + ` (` + cData(allClips[a].runtime) + `)</title>
            </lockup>`;
        }
    
    docString += `
        </section>
        </shelf>
        </productTemplate>
        </document>`;
    
    var parser = new DOMParser();
    var detailDoc = parser.parseFromString(docString, "application/xml");
    detailDoc.addEventListener("select", onSelect.bind());
    navigationDocument.replaceDocument(detailDoc, loadingDoc);
}