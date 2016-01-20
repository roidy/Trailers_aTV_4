//
// HTML Scraper functions
//

// Load an HTML page, Scrape it and call Detail Page Builder
function loadHTML(url, num) {
    url = "http://movietrailers.apple.com" + url + "includes/playlists/itunes.inc"
    var req = new XMLHttpRequest();
    
    req.onreadystatechange = function() {
        if (req.readyState == 4) {
            var myHTML = req.responseText;
            temp = scrapeHTML(myHTML);
            buildTrailerDetailPage(temp, num);
        }
    }
    req.open("GET", url, true);
    req.send();
}

// Simple HTML scraper
// Grab all the trailers from an iTunes.inc
// playlist HTML page
function scrapeHTML(htmlData) {
    var trailers = [];
    var item = 1;
    
    htmlData = htmlData.split("<div class='col left'>");
    
    while(true) {
        var t = extractString('"title":"', '", ', htmlData[item]);
        var i = extractString("<img src='", ".jpg", htmlData[item]) + ".jpg";
        var u = extractString('"url":"', '", ', htmlData[item]).replace("720p", "1080p");
        var r = extractString('"runtime":"', '", ', htmlData[item]);
        
        if (!t || !i || !u) {break;}
        
        trailers.push({title: t, image: i, url: u, runtime: r});
        item += 1;
    }
    return trailers;
    
}

// Very unsafe string extractor
// Looks for (start) and (end) strings
// ans extracts the string inbetween

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
