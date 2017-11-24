function cleanData(data) {
  const eventsArray = data._embedded.events;
  let emptyObjForFiltering = {};
  const noRepeat = eventsArray.filter((event) => {
    const key = event.name;
    if (!emptyObjForFiltering[key]) {
      emptyObjForFiltering[key] = true;
      return true;
    }
  });

  const cloneArray = noRepeat.slice(0, 10);
  const newJSON = cloneArray.map((event) => {
    return {
      name: event.name,
      url: event.url,
      imageUrl: event.images[1].url,
      distance: event.distance,
      units: event.units,
      date: event.dates.start.localDate,
      time: event.dates.start.localTime,
      venue: event._embedded.venues[0].name,
      lat: event._embedded.venues[0].location.latitude,
      long: event._embedded.venues[0].location.longitude,
    };
  });
  return newJSON;
}


module.exports = cleanData;
