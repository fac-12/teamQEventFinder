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


## Known Issues

- Searching for events today will show events that have already passed (e.g. they were at 1pm and it's now 5pm)
- There is no front-end testing


## If we had more time

- Give the user more choices to filter their search by (e.g. location radius, time of day, number of events)
- Automatically load events happening today in the location found by the geolocater.
