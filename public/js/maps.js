// const listing = require("../../models/listing");

 mapboxgl.accessToken = maptoken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style:'mapbox://styles/mapbox/streets-v12',
        // center: [coordinates], // starting position [lng, lat]. Note that lat must be set between -90 and 90
        center: listingg.geometry.coordinates,
        zoom: 9 // starting zoom
    });


    const popup = new mapboxgl.Popup({ offset:25 })
        .setHTML(`<h4>${listingg.location}</h4><p>Exact loaction will be provided after booking</p>`)

    
    const marker = new mapboxgl.Marker({color: 'red '})
        .setLngLat(listingg.geometry.coordinates)
        .setPopup(popup)
        .addTo(map); 

    


