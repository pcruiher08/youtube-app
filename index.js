const API_KEY = "AIzaSyBD7xkEhjy1CBSklsFt21B0-Vkfw1x9Oeo";
const numberOfResults = 10;
var submitButton = document.querySelector('.submitbtn');
var forward = document.querySelector('.forward');
var backward = document.querySelector('.backward');
var pageNumber = 0;
var page = "";
var previousQuery = "";
var next;
var previous;
var resultsAreDisplaying = false;
forward.disabled = true;
backward.disabled = true;

function search(textQuery){
    let url = `https://www.googleapis.com/youtube/v3/search?&part=snippet&key=${API_KEY}&q=${textQuery}&maxResults=${numberOfResults}&type=video&pageToken=${page}`
    let settings = {
        method : 'GET'
    };
    fetch(url, settings)
        .then(response =>{
            if(response.ok){
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            console.log(responseJSON);
            getResults(responseJSON);
            nextPage(responseJSON);
            previousPage(responseJSON);
        })
        .catch(err => {
            console.log(err)
        })
}

function getResults(jsonData){
    let results = document.querySelector('.results');
    results.innerHTML = "";
    page = jsonData.etag;
    write(jsonData,results);
}

function write(jsonData,results){
    console.log("page: " + pageNumber);
    forward.disabled = false;
    backward.disabled = (pageNumber>0?false:true);
    for(let i=0; i<jsonData.items.length; i++){
        let idGoesHere = jsonData.items[i].id.videoId;
        let image = jsonData.items[i].snippet.thumbnails.high.url;
        let date = jsonData.items[i].snippet.publishedAt;
        let description = jsonData.items[i].snippet.description;
        let channel = jsonData.items[i].snippet.channelTitle;
        console.log(description);
        results.innerHTML += `
        <div class="lines">
        <h5>${jsonData.items[i].snippet.title}</h5>
        <a class="videos"href="https://www.youtube.com/watch?v=${idGoesHere}" target="_blank"><img src="${image}" alt="video thumbnail" width="200" height="140" align=left/>${description}</a>
        
        <h4>${channel} - ${"Published on: " + date.substring(0,10)}</h4>
        </div>
        `
    }
}

function nextPage(jsonData) {
    let results = document.querySelector('.results');
    next = jsonData.nextPageToken;
    results.innerHTML = "";
    write(jsonData,results);
}

function previousPage(jsonData) {
    let results = document.querySelector('.results');
    previous = jsonData.prevPageToken;
    results.innerHTML = "";
    write(jsonData,results);
}

submitButton.addEventListener('click', (event) => {
    event.preventDefault();
    page = "";
    search(document.querySelector('#search').value);
    previousQuery = document.querySelector('#search').value;
});

forward.addEventListener('click', (event) => {
    event.preventDefault();
    pageNumber++;
    page = next;
    search(document.querySelector('#search').value);
});

backward.addEventListener('click', (event) => {
    event.preventDefault();
    pageNumber--;
    page = previous;
    search(document.querySelector('#search').value);
});
