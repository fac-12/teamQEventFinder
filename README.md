# TeamQ Event Finder
Team members: Fatimat, Lucy, Shannon and Mohamed
Project link: https://teamq-event-finder2.herokuapp.com/

## User stories

User story 1: I want to be able to visit the website and see events occurring on a specific date, or between 2 dates.

User story 2: I want to be able to filter these events to ones happening in the location I choose.

The website returns a list of events that fit the specified criteria - the location and (optionally) the date. These events are then plotted on an adjacent map.

## About the API call to Ticketmaster

We used the request module to make a call to Ticketmaster. We were able to specify the dates between which we wanted the events, but were not able to use a postcode directly in the url. Instead, we made a separate call to postcode.io which converts the postcode to a latitude and longitude. We then used this to build the url for the api request. The response object was then filtered so as not to include events of the same name, cut to 10 events and unnecessary data was stripped.

## About the API call to Google Maps
We made a xhr request from the front end to the google maps API. We created the map based on a default longtitude and latitude of London. Which means when initiialised the map would be of London. We also created markers using the api. Which would be placed on the map indicating where events are. These were based on the longtitude and latitude of each event. We encountered several problems when calling the api using a script tag predefined in the html. In order to solve this we created a script element in script.js and then appended to the page after the body tag. What we realised was the problem was that before the api call was completed the callback function was being run. 
 
## Known Issues

- Searching for events today will show events that have already passed (e.g. they were at 1pm and it's now 5pm)
- There is no front-end testing


## If we had more time

- Give the user more choices to filter their search by (e.g. location radius, time of day, number of events)
- Automatically load events happening today in the location found by the geolocater.

## Things we learnt

- It's easy for the request module to get confused with the request object - need to use different names!
- 
