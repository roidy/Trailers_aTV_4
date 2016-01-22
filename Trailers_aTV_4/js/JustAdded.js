// Build Main Page

function mainPage() {
    var docString = `<?xml version="1.0" encoding="UTF-8" ?>
        <document>
        <head>
        <style>
        .showAndScrollTextOnHighlight {
            tv-text-highlight-style: marquee-and-show-on-highlight;}
        </style>
        </head>
        <stackTemplate>
        <banner>
        <title>Just Added</title>
        </banner>
        <collectionList>
        <grid>
        <section>`;
    
    for (a=0; a<justAddedJSON.length; a++) {
        docString += `<lockup onSelect="trailerDetailPage('` + a.toString() + `')"><img src="`;
        docString += justAddedJSON[a].poster.replace("poster", "poster-xlarge");
        docString += `" width="250" height="375" />
        <title class="showAndScrollTextOnHighlight">` + cData(justAddedJSON[a].title) + `</title>
        </lockup>`;
    }
    
    docString += `
        </section>
        </grid>
        </collectionList>
        </stackTemplate>
        </document>`;
    
    var parser = new DOMParser();
    var mainDoc = parser.parseFromString(docString, "application/xml");
    mainDoc.addEventListener("select", onSelect.bind());
    
    return mainDoc;
}

