//
//  App.js
//  Trailers
//
//  Created by Robert Parnell on 15/01/2016.
//  Copyright © 2016 Robert Parnell. All rights reserved.
//  See Licence.txt for more details
//

var justAddedJSON; // Global Just Added JSON data

//
// Main App Entry Point
//
App.onLaunch = function(options) {
    // Load and evaluate JavaScript files
    var jsFiles = [`${options.BASEURL}js/JustAdded.js`,
                   `${options.BASEURL}js/TrailerDetailPage.js`,
                   `${options.BASEURL}js/Search.js`];
    
    evaluateScripts(jsFiles, function(success) {
                    if (success) {
                        mainMenuBar(); // Build and display main menu bar
                    }
                });
}

//
// On app resume reload the app
// so we pull in new JSON data
//

App.onResume = function(options) {
    App.reload();
}

//
// Main menu bar
//
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

//
// Menu bar section loader
//
function loadMenuSection(event) {
    var menuItem = event.target;
    var id = menuItem.getAttribute("id");
    var feature = menuItem.parentNode.getFeature("MenuBarDocument");
    if (feature) {
        if (id == "JustAdded") {loadJSONData(menuItem, feature); }
        if (id == "Search") {loadSearchPage(menuItem, feature); }
    }
}

//
// Open and parse Apples Just Added JSON trailer feed
//
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
            var justAdded = buildJustAddedPage(justAddedJSON); // Create Main page
            feature.setDocument(justAdded, menuItem);
        }
    }
    req.open("GET", jsonURL, true);
    req.send();
}


//
// Helper Functions
//

// Simple Video Player
function videoPlay(url) {
    var mediaItem = new MediaItem("video", url);
    var player = new Player();
    var playlist = new Playlist();
    
    player.playlist = playlist;
    player.playlist.push(mediaItem);
    player.present();
}

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
    var elem = event.target;
    
    if (elem) {
        var onSelect = elem.getAttribute("onSelect");
        eval(onSelect);
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

// string.replaceAll
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};