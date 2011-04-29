
importScripts("swfobject.js", "FABridge.js", "web_socket.js");


// Set URL of your WebSocketMain.swf here
WebSocket.__swfLocation = "WebSocketMain.swf";

// reference to the Web Socket
var socket;

// Replace this with Server-Side setting
// a semi-unique random ID for this session
var myId = Math.floor(100000*Math.random());

// number of rows of data presently displayed
var rowCount = 0;

function updateSocketStatus(message, loc) {
    if (!loc) {
        postMessage({"type": "socket",
                    "update": message,
                    "loc": loc,
                    "id": myId
                    });
}

function updateGeolocationStatus(message) {
    postMessage({"type": "geo",
                 "update": message,
                });
}

function handleLocationError(error) {
    switch(error.code)
    {
    case 0:
      updateGeolocationStatus("There was an error while retrieving your location: " + error.message);
      break;
    case 1:
      updateGeolocationStatus("The user prevented this page from retrieving a location.");
      break;
    case 2:
      updateGeolocationStatus("The browser was unable to determine your location: " + error.message);
      break;
    case 3:
      updateGeolocationStatus("The browser timed out before retrieving the location.");
      break;
    }
}

function startLocService() {
    // test to make sure that Web Sockets are supported...
    // Note: We no longer need to check since the flash failover does it automatically
    //if (window.WebSocket) {

        // the location of our broadcast WebSocket server
        url = "ws://localhost:8888";
        socket = new WebSocket(url);
        socket.onopen = function() {
            updateSocketStatus("Connected to WebSocket tracker server");
        }
        socket.onmessage = function(e) {
            updateSocketStatus("Updated location from " + dataReturned(e.data));
        }
    //}

    var geolocation;
    if(navigator.geolocation) {
        geolocation = navigator.geolocation;
        updateGeolocationStatus("HTML5 Geolocation is supported in your browser.");
    }

    // register for position updates using the Geolocation API
    geolocation.watchPosition(updateLocation,
                              handleLocationError,
                              {maximumAge:20000});
}

function updateLocation(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var timestamp = position.timestamp;

    updateGeolocationStatus("Location updated at " + timestamp);

    // Send my location via WebSocket
    var toSend = JSON.stringify([myId, latitude, longitude]);
    sendMyLocation(toSend);
}

function sendMyLocation(newLocation) {
    if (socket) {
        socket.send(newLocation);
    }
}

startLocService();

