document.addEventListener('DOMContentLoaded', function () {
    console.log(mapToken)
    mapboxgl.accessToken = mapToken;
    console.log(cGround)
    const camp = cGround
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v12', // style URL
        center: camp.geometry.coordinates, // starting position [lng, lat]
        zoom: 9, // starting zoom
    });

    new mapboxgl.Marker()
        .setLngLat(camp.geometry.coordinates)
        .setPopup(
            new mapboxgl.Popup({ offset: 25 })
                .setHTML(`<h3>${camp.title}</h3>`)
        )
        .addTo(map)
});


