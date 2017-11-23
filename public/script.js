/* eslint-disable */


const startDatePicker = document.querySelector('#start-date-picker');
const endDatePicker = document.querySelector('#end-date-picker');
const postCodeInput = document.querySelector('#postcode');
const radiusInput = document.getElementById('radius');
const errorDisplay = document.querySelector('#error-display');
const searchByPostcode = document.getElementById('postcode-btn');
const searchByLocation = document.getElementById('location-btn');
const mapDisplay = document.querySelector('.map-display');
const eventDisplay = document.querySelector('.event-display');
const inputForm = document.getElementById('input-form');
var markers = [
    ['London Eye, London', 51.503454,-0.119562],
];
var infoWindowContent = [
    [

    ]
];

searchByLocation.addEventListener('click', function(){
  try {
    locationSearch();
    errorDisplay.className = "error-display";
    errorDisplay.textContent = 'Loading...';
    clearElement(eventDisplay);
  }
  catch (error) {
    errorDisplay.className = "error-display";
    errorDisplay.textContent = error;
    clearElement(eventDisplay);
  }
});

function todayDate(){
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!

  var yyyy = today.getFullYear();
  if(dd<10){
      dd='0'+dd;
  }
  if(mm<10){
      mm='0'+mm;
  }
  var today = yyyy+"-"+mm+"-"+dd;
  startDatePicker.value = today;
}
todayDate();

inputForm.addEventListener('submit', function(event){
  event.preventDefault();
  console.log("submitted");
    try {
      postCodeSearch();
      errorDisplay.className = "error-display";
      errorDisplay.textContent = 'Loading...';
      clearElement(eventDisplay);
    }
    catch (error){
      errorDisplay.className = "error-display";
      errorDisplay.textContent = error;
      clearElement(eventDisplay);
    }
    markers = [];
});


function postCodeSearch(){
  console.log("postcode search");
  if (postCodeInput.value === ''){
    throw new Error('No postcode entered');
  } else {
    postCodeConverter(postCodeInput.value);
  }
}

function locationSearch(){
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(function (position) {
      latLong = position.coords.latitude+","+position.coords.longitude;
      // markers.push(["current location", position.coords.latitude,position.coords.longitude])
      var url = "/search?ll=" + latLong + "&radius=" + radiusInput.value;
      if(startDatePicker.value){
          url += "&sdate=" + startDatePicker.value;
      }
      if(endDatePicker.value){
        url += "&edate=" + endDatePicker.value;
      }
      request(url, updateEvents);
    }, function (error) {
      if (error) {
        errorDisplay.className = "error-display";
        errorDisplay.textContent = "Sorry, can't find your location";
        clearElement(eventDisplay);
      }
    });
  } else {
   throw new Error('Browser incompatible');
  }
}


function submitPostcode(response){
    if (response.status === 404){
      errorDisplay.className = "error-display";
      errorDisplay.textContent = 'Not a valid postcode';
      clearElement(eventDisplay);
    } else {
      var url = "/search?ll=" + response.result.latitude + "," + response.result.longitude + "&radius=" + radiusInput.value;
      if(startDatePicker.value){
          url += "&sdate=" + startDatePicker.value;
      }
      if(endDatePicker.value){
        url += "&edate=" + endDatePicker.value;
      }
      request(url, updateEvents);
    }
}

function postCodeConverter(postcode){
  var validPostcode = postcode.split(' ').join('');
  request('https://api.postcodes.io/postcodes/' + validPostcode, submitPostcode);
}

function updateEvents(response) {
  drawEventList(response);
  errorDisplay.className = "error-display hidden";
  eventsMapMarkers(response);
  initMap();
}

function drawEventList(response) {
  clearElement(eventDisplay);
  response.forEach(function(event) {
    var eventContainer = document.createElement('div');
    eventContainer.className = "event-container";
    var textContainer = document.createElement('div');
    var title = document.createElement('h3');
    var link = document.createElement('a');
    link.setAttribute('href', event.url);
    link.setAttribute('target','_blank');
    var titleText = document.createTextNode(event.name);
    link.appendChild(titleText);
    title.appendChild(link);
    textContainer.appendChild(title);
    var venue = document.createElement('p');
    var venueText = document.createTextNode(event.venue);
    venue.appendChild(venueText);
    textContainer.appendChild(venue);
    var date = document.createElement('p');
    var dateText = document.createTextNode(event.date+"  "+(event.time ? event.time : ""));
    date.appendChild(dateText);
    textContainer.appendChild(date);
    eventContainer.appendChild(textContainer);
    var image = document.createElement('div');
    image.style.backgroundImage = "url('"+event.imageUrl+"')";
    console.log(image.style.backgroundImage);
    image.className = "thumbnail";
    eventContainer.appendChild(image);
    eventDisplay.appendChild(eventContainer);
  });
}

function initMap() {
  var script = document.createElement('script');
  script.src = "//maps.googleapis.com/maps/api/js?key=AIzaSyAzLDDiznYU5GWLAmH7peUc6ERUgdG6iqE&callback=initialize";
  document.body.appendChild(script);
}


function initialize() {
  var map;
  var bounds = new google.maps.LatLngBounds();
  var mapOptions = {
      mapTypeId: 'roadmap'
  };

  // Display a map on the page
  map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
  map.setTilt(45);

  // Multiple Markers

  // Info Window Content
  // Display multiple markers on a map
  var infoWindow = new google.maps.InfoWindow(), marker, i;
  for( i = 0; i < markers.length; i++ ) {
      var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
      bounds.extend(position);
      marker = new google.maps.Marker({
          position: position,
          map: map,
          title: markers[i][0]
      });

      // Allow each marker to have an info window
      google.maps.event.addListener(marker, 'click', (function(marker, i) {
          return function() {
              infoWindow.setContent(infoWindowContent[i][0]);
              infoWindow.open(map, marker);
          }
      })(marker, i));

      // Automatically center the map fitting all markers on the screen
      map.fitBounds(bounds);
  }

  // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
  var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
      this.setZoom(12);
      google.maps.event.removeListener(boundsListener);
  });

}

initMap();

function eventsMapMarkers(events){
  events.forEach(function(event){
    markers.push([event.venue, +event.lat, +event.long]);
    infoWindowContent.push(['<div class="info_content">' +
    '<h3>' + event.name + '</h3>' +
    '<p> Venue: ' + event.venue + '</p>' +
    '<p> Date: '+ event.date + '</p>' +
    '<p> Time: '+ event.time + '</p>' +
    '</div>'])
  })
  console.log(markers)
}
 function request(url, cb){
  //var proxy = 'https://cors-anywhere.herokuapp.com/';
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4){
      var result = JSON.parse(xhr.responseText);
      cb(result);
    }
  }
  xhr.open("GET", url, true);
  xhr.send();
}

function clearElement(element){
  while (element.childElementCount > 1) {
      element.removeChild(element.lastChild);
  }
}
