/* eslint-disable */


const startDatePicker = document.querySelector('.start-date-picker');
const endDatePicker = document.querySelector('.end-date-picker');
const postCodeInput = document.querySelector('.postcode-input');
const radiusInput = document.getElementById('radius');
const errorDisplay = document.querySelector('.error-display');
const searchByPostcode = document.getElementById('postcode-btn');
const searchByLocation = document.getElementById('location-btn');
const mapDisplay = document.querySelector('.map-display');
const eventDisplay = document.querySelector('.event-display');
const inputForm = document.getElementById('input-form');

searchByLocation.addEventListener('click', function(){
  try {
    locationSearch();
    errorDisplay.textContent = 'loading...';
  }
  catch (error) {
    errorDisplay.textContent = error;
  }
});

inputForm.addEventListener('submit', function(event){
  event.preventDefault();
  console.log("submitted");
    try {
      postCodeSearch();
      errorDisplay.textContent = 'loading...';
    }
    catch (error){
      errorDisplay.textContent = error;
    }
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
        errorDisplay.textContent = "Sorry, can't find your location";
      }
    });
  } else {
   throw new Error('Browser incompatible');
  }
}


function submitPostcode(response){
    if (response.status === 404){
      errorDisplay.textContent = 'Not a valid postcode';
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
  request('http://api.postcodes.io/postcodes/' + validPostcode, submitPostcode);
}

function updateEvents(response) {
  drawEventList(response);
  console.log(response[0]);
}

function drawEventList(response) {
  clearElement(eventDisplay);
  response.forEach(function(event) {
    var eventContainer = document.createElement('div');
    eventContainer.className = "event-container";
    var title = document.createElement('h3');
    var link = document.createElement('a');
    link.setAttribute('href', event.url);
    link.setAttribute('target','_blank');
    var titleText = document.createTextNode(event.name);
    link.appendChild(titleText);
    title.appendChild(link);
    eventContainer.appendChild(title);
    var venue = document.createElement('p');
    var venueText = document.createTextNode(event.venue);
    venue.appendChild(venueText);
    eventContainer.appendChild(venue);
    var date = document.createElement('p');
    var dateText = document.createTextNode(event.date+"  "+(event.time ? event.time : ""));
    date.appendChild(dateText);
    eventContainer.appendChild(date);
    eventDisplay.appendChild(eventContainer);
  });
}

function initMap() {
  var script = document.createElement('script');
  script.src = "//maps.googleapis.com/maps/api/js?sensor=false&callback=initialize";
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
  var markers = [
      ['London Eye, London', 51.503454,-0.119562],
      ['Palace of Westminster, London', 51.499633,-0.124755]
  ];
                      
  // Info Window Content
  var infoWindowContent = [
      ['<div class="info_content">' +
      '<h3>London Eye</h3>' +
      '<p>The London Eye is a giant Ferris wheel situated on the banks of the River Thames. The entire structure is 135 metres (443 ft) tall and the wheel has a diameter of 120 metres (394 ft).</p>' +        '</div>'],
      ['<div class="info_content">' +
      '<h3>Palace of Westminster</h3>' +
      '<p>The Palace of Westminster is the meeting place of the House of Commons and the House of Lords, the two houses of the Parliament of the United Kingdom. Commonly known as the Houses of Parliament after its tenants.</p>' +
      '</div>']
  ];
      
  // Display multiple markers on a map
  var infoWindow = new google.maps.InfoWindow(), marker, i;
  
  // Loop through our array of markers & place each one on the map  
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
      this.setZoom(14);
      google.maps.event.removeListener(boundsListener);
  });
  
}

initMap();



// function showEvents(response, cb){
//   response.forEach(response){
//     eventName.textContent = response.event.name;
//     eventDisplay.appendChild(eventList).
//   }
// }

// function initMap(){
//   var map = new  google.maps.Map(mapDisplay, {
//     center: {lat: "51.509865", long: "-0.118092"},
//     zoom: 10
//   });
// }

// function drawMap(response){
//   var map = new  google.maps.Map(mapDisplay, {
//     center: {lat: response.lat, long: response.long},
//     zoom: 10
//   })
//   response.forEach( event => {
//     addMarker(map, event);
//   })
//  }

//  function addMarker(map, event){
//     var marker = new google.maps.Marker({
//       position: new google.maps.LatLng(event.lat, event.long),
//       map: map
//     });
//     marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
//  }

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
  while (element.firstChild) {
      element.removeChild(element.firstChild);
  }
}