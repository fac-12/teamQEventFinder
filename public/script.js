/*eslint-disable*/

// Grab necessary DOM elements
var startDatePicker = document.getElementById('start-date-picker');
var endDatePicker = document.getElementById('end-date-picker');
var postCodeInput = document.getElementById('postcode');
var radiusInput = document.getElementById('radius');
var errorDisplay = document.getElementById('error-display');
var searchByPostcode = document.getElementById('postcode-btn');
var searchByLocation = document.getElementById('location-btn');
var mapDisplay = document.querySelector('.map-display');
var eventDisplay = document.querySelector('.event-display');
var inputForm = document.getElementById('input-form');
// Create global variables for initial map load
var markers = [
  ['London Eye, London', 51.503454, -0.119562],
];
var infoWindowContent = [
  ['<div class=\'info_content\'>' +
    '<h3>London</h3>' + '</div>'
  ]
];

// Helper Function: Build URL for API call to server
function buildUrl(lat, long) {
  var url = '/search?ll=' + lat + ',' + long + '&radius=' + radiusInput.value;
  if (startDatePicker.value) {
    url += '&sdate=' + startDatePicker.value;
  }
  if (endDatePicker.value) {
    url += '&edate=' + endDatePicker.value;
  }
  return url;
}

// Helper Function: Clear element except for first child
function clearElement(element) {
  while (element.childElementCount > 1) {
    element.removeChild(element.lastChild);
  }
}

// Helper Function: Display error or loading message
function displayError(message) {
  errorDisplay.className = 'error-display';
  errorDisplay.textContent = message;
  clearElement(eventDisplay);
}

// Helper Function: Generic XHR request function
function request(url, cb) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      var result = JSON.parse(xhr.responseText);
      cb(result);
    }
  };
  xhr.open('GET', url, true);
  xhr.send();
}

// Try to ascertain browser location. If found, use it to make API call to server
function locationSearch() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var url = buildUrl(position.coords.latitude, position.coords.longitude);
      request(url, updateEvents);
    }, function (error) {
      if (error) {
        displayError('Sorry, can\'t find your location');
      }
    });
  } else {
    throw new Error('Browser incompatible');
  }
}

// On button click, trigger search by browser location.
searchByLocation.addEventListener('click', function () {
  try {
    locationSearch();
    displayError('Loading...');
    markers = [];
    infoWindowContent = [];
  } catch (error) {
    displayError(error);
  }
});

// Take lat and long returned by postCodeSearch() and use to make API call to server
function submitPostcode(response) {
  if (response.status === 404) {
    displayError('Not a valid postcode');
  } else {
    var url = buildUrl(response.result.latitude, response.result.longitude);
    request(url, updateEvents);
  }
}

// Convert postcode, if entered, to lat and long coordinates using external API call
function postCodeSearch() {
  if (postCodeInput.value === '') {
    throw new Error('No postcode entered');
  } else {
    var validPostcode = postCodeInput.value.split(' ').join('');
    request('https://api.postcodes.io/postcodes/' + validPostcode, submitPostcode);
  }
}

// When search by postcode, trigger post code validation function
inputForm.addEventListener('submit', function (event) {
  event.preventDefault();
  try {
    postCodeSearch();
    displayError('Loading...');
  } catch (error) {
    displayError(error);
  }
  markers = [];
  infoWindowContent = [];
});

// Draw list of events and append to appropriate div
function drawEventList(response) {
  clearElement(eventDisplay);
  response.forEach(function (event) {
    var eventContainer = document.createElement('div');
    eventContainer.className = 'event-container';
    var textContainer = document.createElement('div');
    var title = document.createElement('h3');
    var link = document.createElement('a');
    link.setAttribute('href', event.url);
    link.setAttribute('target', '_blank');
    var titleText = document.createTextNode(event.name);
    link.appendChild(titleText);
    title.appendChild(link);
    textContainer.appendChild(title);
    var venue = document.createElement('p');
    var venueText = document.createTextNode(event.venue);
    venue.appendChild(venueText);
    textContainer.appendChild(venue);
    var date = document.createElement('p');
    var dateText = document.createTextNode(event.date + '  ' + (event.time ? event.time : ''));
    date.appendChild(dateText);
    textContainer.appendChild(date);
    eventContainer.appendChild(textContainer);
    var image = document.createElement('div');
    image.style.backgroundImage = 'url(\'' + event.imageUrl + '\')';
    image.className = 'thumbnail';
    eventContainer.appendChild(image);
    eventDisplay.appendChild(eventContainer);
  });
}

// create new map markers
function eventsMapMarkers(events) {
  console.log(events);
  events.forEach(function (event) {
    markers.push([event.venue, +event.lat, +event.long]);
    infoWindowContent.push(['<div class=\'info_content\'>' +
      '<h3>' + event.name + '</h3>' +
      '<p> Venue: ' + event.venue + '</p>' +
      '<p> Date: ' + event.date + '</p>' +
      '<p> Time: ' + event.time + '</p>' +
      '</div>'
    ]);
  });
}

// Draw map with appropriate markers
function initialize() {
  var map;
  var bounds = new google.maps.LatLngBounds();
  var mapOptions = {
    mapTypeId: 'roadmap'
  };

  // Display a map on the page
  map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
  map.setTilt(45);

  // Display multiple markers on a map
  var infoWindow = new google.maps.InfoWindow(),
    marker, i;
  for (i = 0; i < markers.length; i++) {
    var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
    bounds.extend(position);
    marker = new google.maps.Marker({
      position: position,
      map: map,
      title: markers[i][0]
    });

    // Allow each marker to have an info window
    google.maps.event.addListener(marker, 'click', (function (marker, i) {
      return function () {
        infoWindow.setContent(infoWindowContent[i][0]);
        infoWindow.open(map, marker);
      }
    })(marker, i));

    // Automatically center the map fitting all markers on the screen
    map.fitBounds(bounds);
  }

  // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
  var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function (event) {
    this.setZoom(12);
    google.maps.event.removeListener(boundsListener);
  });
}

// update the map and events list
function updateEvents(response) {
  if (response.err) {
    displayError(response.err);
    errMapMarker(response.latlong);
    initialize();
  }
  else {
    drawEventList(response);
    errorDisplay.className = 'error-display hidden';
    eventsMapMarkers(response);
    initialize();
  }
}

// Mapmarker function in case there are no events to display

function errMapMarker(ll) {
  var lat = ll.split(",")[0];
  var long = ll.split(",")[1];
  markers = [];
  infoWindowContent = [];
  markers.push(["Search location", +lat, +long]);
  infoWindowContent.push(['<div class=\'info_content\'>' + '<h3>' + postCodeInput.value + '</h3>'])
}
// Load google maps api javascript code, with callback to initialize()
function initMap() {
  var script = document.createElement('script');
  script.src = '//maps.googleapis.com/maps/api/js?key=AIzaSyAzLDDiznYU5GWLAmH7peUc6ERUgdG6iqE&callback=initialize';
  document.body.appendChild(script);
}
initMap();

// Set startDate to today's date upon page load
function todayDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!

  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  today = yyyy + '-' + mm + '-' + dd;
  startDatePicker.value = today;
}
todayDate();
