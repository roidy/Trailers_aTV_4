// Global Just Added JSON data
var justAddedJSON;
var searchResultsJSON;


// Main App Entry Point
App.onLaunch = function(options) {
    // Load and evaluate JavaScript files
    var jsFiles = [`${options.BASEURL}js/JustAdded.js`,
                   `${options.BASEURL}js/VideoPlayer.js`,
                   `${options.BASEURL}js/HTMLScraper.js`,
                   `${options.BASEURL}js/TrailerDetailPage.js`,
                   `${options.BASEURL}js/Search.js`];
    
    evaluateScripts(jsFiles, function(success) {
                    if (success) {
                        mainMenuBar(); // Build and display main menu bar
                    }
                });
}

// Main menu bar
function mainMenuBar() {
    var docString = `<?xml version="1.0" encoding="UTF-8" ?>
        <document><menuBarTemplate><menuBar>
        <menuItem id="JustAdded" onSelect="loadMenuSection(event)">
        <title>Just Added</title></menuItem>
    
        <menuItem id="Search" onSelect="loadMenuSection(event)">
        <title>Search</title></menuItem>
        </menuBar></menuBarTemplate></document>`;
    
    var parser = new DOMParser();
    var menuDoc = parser.parseFromString(docString, "application/xml");
    menuDoc.addEventListener("select", onSelect.bind());
    navigationDocument.pushDocument(menuDoc);
}

// Menu bar section loader
function loadMenuSection(event) {
    var menuItem = event.target;
    var id = menuItem.getAttribute("id");
    var feature = menuItem.parentNode.getFeature("MenuBarDocument");
    if (feature) {
        if (id == "JustAdded") {loadJSONData(menuItem, feature); }
        if (id == "Search") {loadSearchPage(menuItem, feature); }
    }
}

// Open and parse Apples Just Added JSON trailer feed
function loadJSONData(menuItem, feature) {
    if (justAddedJSON) {
        return; // JSON already loaded and the page exists, so just return and let aTV handle page display
    }
    
    var req = new XMLHttpRequest();
    var jsonURL = "http://movietrailers.apple.com/trailers/home/feeds/just_added.json"
    var loadingDoc = makeSpinnerPage("Loading Just Added...");
    feature.setDocument(loadingDoc, menuItem);
    
    req.onreadystatechange = function() {
        if (req.readyState == 4) {
            justAddedJSON = JSON.parse(req.responseText);
            var justAdded = mainPage(); // Create Main page
            feature.setDocument(justAdded, menuItem);
        }
    }
    req.open("GET", jsonURL, true);
    req.send();
}


//
// Helper Functions
//

// Create a Loading Spinner Document
function makeSpinnerPage(message) {
    var docString = `<?xml version="1.0" encoding="UTF-8" ?>
        <document><loadingTemplate>
        <activityIndicator><title>${message}</title></activityIndicator>
        </loadingTemplate></document>`;
    
    var parser = new DOMParser();
    var doc = parser.parseFromString(docString, "application/xml");
    
    return doc;
}

// Send log messages back to Swift for display in XCode
function log() {
    var message = '';
    for(var i = 0; i < arguments.length; i++) {
        message += arguments[i] + ' ';
    };
    swiftInterface.log(message);
}

// onSelect event handler
function onSelect(event) {
    //this.event = event;
    var elem = event.target;
    
    if (elem) {
        var id = elem.getAttribute("id");
        var onSelect = elem.getAttribute("onSelect");  // get onSelect=...
        with (event) {
            eval(onSelect);
        }
    }
}

// <![CDATA[]> Helper function
function cData(string) {
    return '<![CDATA[' + string + ']]>';
}

// doc.getElementByTagName()
if (!Document.prototype.getElementByTagName) {
    Document.prototype.getElementByTagName = function(tagName) {
        var elements = this.getElementsByTagName(tagName);
        if ( elements && elements.length > 0 ) {
            return elements.item(0);
        }
        return undefined;
    }
}

// element.getElementByTagName()
if (!Element.prototype.getElementByTagName) {
    Element.prototype.getElementByTagName = function(tagName) {
        var elements = this.getElementsByTagName(tagName);
        if ( elements && elements.length > 0 ) {
            return elements.item(0);
        }
        return undefined;
    }
}

