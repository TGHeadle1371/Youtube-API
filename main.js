// Options
var CLIENT_ID =
    "86054638228-5ub3b4elfct0pg4bouua516va49g7eht.apps.googleusercontent.com";
// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"
];
// Authorization scopes required by the API. If using multiple scopes,
// separated them with spaces.
var SCOPES = "https://www.googleapis.com/auth/youtube.readonly";
var authorizeButton = document.getElementById("authorize-button");
var signoutButton = document.getElementById("signout-button");

var content = document.getElementById("content");
var channelForm = document.getElementById("channel-form");
var channelInput = document.getElementById("channel-input");
var videoContainer = document.getElementById("video-container");

var defaultChannel = "techguyweb";

//Load auth2 Library
function handleClientLoad() {
    gapi.load("client:auth2", initClient);
}

//Init API client library and set up sign in listeneres
function initClient() {
    gapi.client
        .init({
            discoveryDocs: DISCOVERY_DOCS,
            clientId: CLIENT_ID,
            scope: SCOPES
        })
        .then(() => {
            //Listen for sign in state changes
            gapi.auth2.getAuthInstance().isSignedIn.listen(updatedSigninStatus);
            // Handle initial sign in state
            updatedSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
            authorizeButton.onclick = handleAuthClick;
            signoutButton.onclick = handleSignoutClick;
        });
}

// Update UI sign in state changes
function updatedSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = "none";
        signoutButton.style.display = "block";
        content.style.display = "block";
        videoContainer.style.display = "block";
        getChannel(defaultChannel);
    } else {
        authorizeButton.style.display = "block";
        signoutButton.style.display = "none";
        content.style.display = "none";
        videoContainer.style.display = "none";
    }
}

//Handle Login
function handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn();
}
//Handle Log out
function handleSignoutClick() {
    gapi.auth2.getAuthInstance().signOut();
}

// Get channel from API

function getChannel(channel) {
    console.log(channel);
}
