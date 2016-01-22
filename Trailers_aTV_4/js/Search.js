function loadSearchPage(menuItem, feature) {
    var docString = `<?mxl version="1.0" encoding="UTF-8" ?>
        <document><searchTemplate>
        <searchField view="Search" />
    
        <collectionList id="results">
        </collectionList>
        </searchTemplate></document>`;
    
    
    var parser = new DOMParser();
    var searchDoc = parser.parseFromString(docString, "application/xml");
    searchDoc.addEventListener("load", initSearch.bind());
    searchDoc.addEventListener("select", onSelect.bind());
    feature.setDocument(searchDoc, menuItem);
}

function initSearch(event) {
    var searchPageDoc = event.target;
    var searchField = searchPageDoc.getElementByTagName("searchField");
    if (!searchField) { return; }
    
    var keyboard = searchField.getFeature("Keyboard");
    keyboard.onTextChange = function () {
        doSearch(keyboard.text, searchPageDoc);
    }
}

function doSearch(query, searchPageDoc) {
    var url = "http://movietrailers.apple.com/trailers/home/scripts/quickfind.php?q=" + query.replace(" ", "+");
    var req = new XMLHttpRequest();
    
    req.onreadystatechange = function() {
        if (req.readyState == 4) {
            resultsJSON = JSON.parse(req.responseText);
            showResults(resultsJSON, searchPageDoc);
        }
    }
    req.open("GET", url, true);
    req.send();
}

function showResults(resultsJSON, searchPageDoc) {
    // Build new xml from results, only use the first 20 results
    
    docString = `<results><grid><section>`;
    
    for(a=0; a<resultsJSON.results.length; a++) {
        docString += `<lockup onSelect="trailerDetailPage('` + encodeURIComponent(JSON.stringify(resultsJSON.results[a])) + `')"><img src="http://movietrailers.apple.com`;
        docString += resultsJSON.results[a].poster.replace("poster", "poster-xlarge");
        docString += `" width="250" height="375" />
            <title>` + cData(resultsJSON.results[a].title) + `</title>
            </lockup>`;
    }

    docString += `</section></grid></results>`;
    
    var doc = navigationDocument.documents[navigationDocument.documents.length-1];
    var searchResults = doc.getElementById("results");
    if (!searchResults) {
        var element = doc.getElementById("Search");
        var feature = element.parentNode.getFeature("MenuBarDocument");
        doc = feature.getDocument(element);
        searchResults = doc.getElementById("results");
    }
    
    var parser = new DOMParser();
    var newResultsDoc = parser.parseFromString(docString, "application/xml");
    var newResults = newResultsDoc.getElementByTagName("results");
    searchResults.innerHTML = newResults.innerHTML;
}