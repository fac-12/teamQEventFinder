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
    try {
      postCodeSearch();
      errorDisplay.textContent = 'loading...';
    }
    catch (error){
      errorDisplay.textContent = error;
    }
});


function postCodeSearch(){
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
      request(url, drawMap);
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
      request(url, drawMap);
    }
}

function postCodeConverter(postcode){
  var validPostcode = postcode.split(' ').join('');
  request('http://api.postcodes.io/postcodes/' + validPostcode, submitPostcode);
}


// function showEvents(response, cb){
//   response.forEach(response){
//     eventName.textContent = response.event.name;
//     eventDisplay.appendChild(eventList).
//   }
// }

// function createEventList(){
//   var eventList = document.createElement('ul');
//   var eventItem =  document.createElement('li');

// }
request('https://maps.googleapis.com/maps/api/js?key=AIzaSyAmsmOS1UAZY-Mu3kGMEepDFO16VWvALTg')


function drawMap(response){
  var map = new  google.maps.Map(mapDisplay, {
    center: {lat: response.lat, long: response.long},
    zoom: 10
  })
  response.forEach( event => {
    addMarker(map, event);
  })
 }

 function addMarker(map, event){
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(event.lat, event.long),
      map: map
    });
    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
 }

 function request(url, cb){
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