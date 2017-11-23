/* eslint-disable */


const startDatePicker = document.querySelector('.start-date-picker');
const endDatePicker = document.querySelector('.end-date-picker');
const postCodeInput = document.querySelector('.postcode-input');
const errorDisplay = document.querySelector('.error-display');
const searchByPostcode = document.getElementById('postcode-btn');
const searchByLocation = document.getElementById('location-btn');

searchByLocation.addEventListener('click', function(){
  try {
    locationSearch();
    errorDisplay.textContent = '';
  }
  catch (error) {
    errorDisplay.textContent = error;
  }
});

searchByPostcode.addEventListener('click', function(){
    try {
      postCodeSearch();
      errorDisplay.textContent = '';
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
      var url = "/search?ll=" + latLong;
      if(startDatePicker.value){
          url += "&sdate=" + startDatePicker.value;
      }
      if(endDatePicker.value){
        url += "&edate=" + endDatePicker.value;
      }
      request(url, drawMap);
    }, function (error) {
      if (error) {
        errorDisplay.textContent = "Cannot get location without user approval";
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
      var url = "/search?ll=" + response.result.latitude + "," + response.result.longitude;
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

function drawMap(response){
  console.log(response);
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