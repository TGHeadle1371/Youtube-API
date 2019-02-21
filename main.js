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

// Form submit and change channel
channelForm.addEventListener("submit", e => {
    e.preventDefault();

    var channel = channelInput.value;
    getChannel(channel);
});

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

// Display Channel data
function showChannelData(data) {
    var channelData = document.getElementById("channel-data");
    channelData.innerHTML = data;
}

// Get channel from API

function getChannel(channel) {
    gapi.client.youtube.channels
        .list({
            part: "snippet,contentDetails,statistics",
            forUsername: channel
        })
        .then(response => {
            console.log(response);
            var channel = response.result.items[0];

            var output = `
                <ul class="collection">
                <li class="collection-item"> Title: ${
                    channel.snippet.title
                } </li>
                <li class="collection-item"> ID: ${channel.id} </li>
                <li class="collection-item"> Subscribers: ${numberWithCommas(
                    channel.statistics.subscriberCount
                )} </li>
                <li class="collection-item">Views: ${numberWithCommas(
                    channel.statistics.viewCount
                )}</li>
                <li class="collection-item">Videos: ${numberWithCommas(
                    channel.statistics.videoCount
                )}</li>
                </ul>
                <p>${channel.snippet.description}</p>
                <hr>
                <a class="btn grey darken-2" target="_blank" href="https://youtube.com/${
                    channel.snippet.customUrl
                }"> Visit Channel </a>
            `;
            showChannelData(output);

            var playlistId = channel.contentDetails.relatedPlaylists.uploads;
            requestVideoPlaylist(playlistId);
        })
        .catch(err => alert("No Channel By That Name"));
}

// Add commas to numbers
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function requestVideoPlaylist(playlistId) {
    var requestOptions = {
        playlistId: playlistId,
        part: "snippet",
        maxResults: 10
    };

    var request = gapi.client.youtube.playlistItems.list(requestOptions);

    request.execute(response => {
        console.log(response);
        var playListItems = response.result.items;
        if (playListItems) {
            var output = '<br><h4 class="center-align">Latest Videos </h4>';

            // Loop through videos and append output
            playListItems.forEach(item => {
                var videoId = item.snippet.resourceId.videoId;

                output += `
                <div class="col s3"> 
                <iframe width="100%" height="auto" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>  
                `;
            });

            //Output videos
            videoContainer.innerHTML = output;
        } else {
            videoContainer.innerHTML = "No Uploaded Videos";
        }
    });
}
