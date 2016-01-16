// re-route console.log() to XCode debug window
var console = {
    log: function() {
        var message = '';
        for(var i = 0; i < arguments.length; i++) {
            message += arguments[i] + ' ';
        };
        swiftInterface.log(console.log.displayName + " " + message);
    }
};


App.onLaunch = function(options) {
    console.log("Launching....");
    // Load and evaluate JavaScript files
    var jsFiles = [
                   `${options.BASEURL}/js/JustAdded.xml.js`];
    
    evaluateScripts(jsFiles, function(success) {
                    if (success) {
                        console.log(options);
                        var justAdded = mainPage();
                        navigationDocument.presentModal(justAdded);
                    }
                });
    
}



