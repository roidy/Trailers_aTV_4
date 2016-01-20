// Global Just Added JSON data
var justAddedJSON;

// Main App Entry Point
App.onLaunch = function(options) {
    log("Launching....");
    // Load and evaluate JavaScript files
    var jsFiles = [`${options.BASEURL}/js/JustAdded.js`,
                   `${options.BASEURL}/js/VideoPlayer.js`,
                   `${options.BASEURL}/js/HTMLScraper.js`,
                   `${options.BASEURL}/js/TrailerDetailPage.js`];
    
    evaluateScripts(jsFiles, function(success) {
                    if (success) {
                        console.log(options);
                        loadJSONData(); // Load JSON data and get the ball rolling
                    }
                });
    
}

// Open and parse Apples Just Added JSON trailer feed
function loadJSONData() {
    
    var req = new XMLHttpRequest();
    var jsonURL = "http://movietrailers.apple.com/trailers/home/feeds/just_added.json"
   
    var loadingDoc = makeSpinnerPage("Loading Just Added...");
    navigationDocument.pushDocument(loadingDoc);
    
    req.onreadystatechange = function() {
        if (req.readyState == 4) {
            justAddedJSON = JSON.parse(req.responseText);
            var justAdded = mainPage(); // Create Main page
            navigationDocument.replaceDocument(justAdded, loadingDoc);
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
    this.event = event;
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
