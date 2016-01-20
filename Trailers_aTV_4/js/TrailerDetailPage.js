var loadingDoc; // Global loadingDoc

// Display Spinner and start scraping
function trailerDetailPage(num) {
    
    loadingDoc = makeSpinnerPage("Loading Details...");
    navigationDocument.pushDocument(loadingDoc);
    
    item = parseInt(num)
    loadHTML(justAddedJSON[item].location, num);
}

// Build the Detail page
var buildTrailerDetailPage = function(trailers, num) {
    var docString = `<?xml version="1.0" encoding="UTF-8" ?>
        <document><head><style>
        .showTextOnHighlight {
            tv-text-highlight-style: show-on-highlight;
        }
        .whiteBadge {
            tv-tint-color: rgb(255, 255, 255);
        }
        </style></head>
        <productTemplate theme="dark">
        <banner><heroImg src="` + justAddedJSON[num].poster.replace("poster", "poster-xlarge") + `" />
        <infoList><info>
        <header><title>DIRECTOR</title></header>`
    
    var directors = justAddedJSON[num].directors.split(", ");
    for (a=0; a<directors.length; a++) {
        docString += `<text><![CDATA[` + directors[a] + `]]></text>`;
    }
    
    docString += `
        </info>
        <info>
        <header><title>STARRING</title></header>`
    
    var actors = justAddedJSON[num].actors;
    for (a=0; a<actors.length; a++) {
        docString += `<text><![CDATA[` + actors[a] + `]]></text>`;
    }
    
    docString += `
        </info>
        </infoList>
        <stack>
        <title>` + justAddedJSON[num].title + `</title>
        <row>
        <text>` + justAddedJSON[num].studio + ` • ` + justAddedJSON[num].genre[0]
    
    if (justAddedJSON[num].releasedate) {
        docString += ` • ` + justAddedJSON[num].releasedate.split(",")[1].split("00:")[0].trim()
    }
    
    docString += `
        </text>
        </row>
        <description allowsZooming="true" style="tv-text-max-lines: 5">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</description>
        
        </stack>
        </banner>
        <shelf style="padding: 45 60 0 60">
        <section>`
        
    for(a=0; a<trailers.length; a++) {
        docString += `<lockup onSelect="videoPlayer.play('` + trailers[a].url + `')">
            <img src="` + trailers[a].image + `" width="320" height="180" />
            <title>` + trailers[a].title + ` (` + trailers[a].runtime + `)</title>
            </lockup>`
        }
    
    docString += `</section>
        </shelf>
        </productTemplate>
    </document>`;
    
    var parser = new DOMParser();
    var detailDoc = parser.parseFromString(docString, "application/xml");
    detailDoc.addEventListener("select", onSelect.bind());
    navigationDocument.replaceDocument(detailDoc, loadingDoc);
}