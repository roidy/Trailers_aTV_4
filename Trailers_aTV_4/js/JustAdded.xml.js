// Build Main Page

var mainPage = function() {
    var docString = `<?xml version="1.0" encoding="UTF-8" ?>
    <document>
    <head>
    <style>
    .showTextOnHighlight {
        tv-text-highlight-style: show-on-highlight;}
    .showAndScrollTextOnHighlight {
        tv-text-highlight-style: marquee-and-show-on-highlight;}
    </style>
    </head>
    <stackTemplate>
    <banner>
    <title>Main Test</title>
    </banner>
    <collectionList>
    <grid>
    <section>`;
    var a=0;
    for (a=0; a<30; a++) {
        docString = docString + `                      <lockup onSelect="">
        <img src="http://trailers.apple.com/trailers/ifcfilms/theabandoned/images/poster-xlarge.jpg" width="250" height="375" />
        <title class="showAndScrollTextOnHighlight">Poster Title That Is Very Long And Should Scroll</title>
        <subtitle class="showTextOnHighlight">Poster Subtitle</subtitle>
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
    return mainDoc;
}
