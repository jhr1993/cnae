var activeInfoWindow; 
var map;

/**
 * Google map initializtion 
 */
function initMap() {

    // Init google map options
    var options = {
        zoom : 13,
        center : { lat:35.2285, lng:128.8894 },
        //styles: mapStyle
    }

    // Get google maps api
    map = new google.maps.Map(document.getElementById('map'),options);


    /* Map function customise */
    // Create to current location button
    // Create the DIV to hold the control and call the CenterControl()
    // constructor passing in this DIV.
    var centerControlDiv = document.createElement('div');
    var centerControl = new curLocBut(centerControlDiv, map);

    centerControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(centerControlDiv);


    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.BOTTOM].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });
    
    var searchMarkers=[];
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        searchMarkers.forEach(function(searchMarkers) {
          searchMarkers.setMap(null);
        });
        searchMarkers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            searchMarkers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });


    /* geolocation */
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {

            // Current position
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            // Add marker on current position
            addMarker({
                lat:pos.lat, 
                lng:pos.lng, // cuurent position
                icon:{
                    url: 'img/CurLocMap.png', // url
                    scaledSize: new google.maps.Size(30, 30), // scaled size
                    origin: new google.maps.Point(0,0), // origin
                    anchor: new google.maps.Point(15,15) // anchor
                }
            },map,true)

            geoMark = true; // If geolocation wroks goes true not to create current location marker repeatly

            map.setCenter(pos);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }


    /* Initialise map markers and clusterer*/
    fetch('/db/get_event', {method : 'get'}).then((res)=>{
        return res.json();
    }).then((locations)=>{
        var clusterStyles = [// Clustermarker styles
            {
                textColor: 'white',
                url: 'img/cluster1.png',
                height: 30,
                width: 30,
                iconAnchor:15
            },
            {
                textColor: 'white',
                url: 'img/cluster2.png',
                height: 30,
                width: 30,
                iconAnchor:[15,15]
            },
            {
                textColor: 'white',
                url: 'img/cluster3.png',
                height: 30,
                width: 30,
                iconAnchor:[15,15]
            }
        ];
        
        // Cluster option
        var mcOptions = {
            gridSize: 50,
            styles: clusterStyles,
            maxZoom: 15
        };
        
        // Add a marker clusterer to manage the markers.
        var clusterMarkers = locations.map(function(location){
            let lat = parseFloat(location.lat.$numberDecimal);
            let lng = parseFloat(location.lng.$numberDecimal);
            // Add marker id
            let content = `<div class="map-marker" id="${location._id}">
                            <div class="map-marker-img"><img src="${location.title_img}"></div>
                            <div class="map-marker-title">${location.title}</div>
                            <div class="map-marker-user">${location.user}</div>
                        </div>`;
            const pos = {lat:lat,lng:lng};
            var marker = new google.maps.Marker({
                position: pos,
                title:"test"
            });

            // Check for custom image
            if(location.icon){
                marker.setIcon(location.icon);
            }

            // Check content
            if(content){
                var infoWindow = new google.maps.InfoWindow({
                    content:content
                });

                // CLick marker to display infowindow
                marker.addListener('click',function(){
                    if (activeInfoWindow) { activeInfoWindow.close();}
                    infoWindow.open(map, marker);
                    activeInfoWindow = infoWindow;
                    map.panTo(pos);
                    map.setZoom(13);
                });
            }

            return marker;

        });
        var markerCluster = new MarkerClusterer(map, clusterMarkers,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
    });
}

/**
 * curLocBut - Button to current location using geolocation
 * @param {*} controlDiv - New div that created
 * @param {*} map - Current displayed map
 */
function curLocBut(controlDiv, map) {

	// Set CSS for the control border.
	var controlUI = document.createElement('div');
	controlUI.style.backgroundColor = '#fff';
	controlUI.style.border = '2px solid #fff';
	controlUI.style.borderRadius = '3px';
	controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
	controlUI.style.cursor = 'pointer';
	controlUI.style.marginBottom = '22px';
	controlUI.style.textAlign = 'center';
	controlUI.title = 'Click to recenter the map';
	controlDiv.appendChild(controlUI);

	// Set CSS for the control interior.
	var controlText = document.createElement('div');
	controlText.style.padding = '5px';
	controlText.style.paddingBottom = '2px';
	controlText.innerHTML = '<img style="width:20px;height:20px" src="img/CurLoc.png"/>';
	controlUI.appendChild(controlText);

	// Setup the click event listeners: simply set the map to current location.
	controlUI.addEventListener('click', function() {
		if(navigator.geolocation) {
			var pos;
			navigator.geolocation.getCurrentPosition(function(position){
				pos = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				}
				var center = new google.maps.LatLng(pos.lat, pos.lng);
			    // using global variable:
			    map.panTo(center);

			    if(!geoMark){
					addMarker({
						lat:pos.lat, 
						lng:pos.lng, // cuurent position
						id:'curloc',
						icon:{
							url: 'img/CurLocMap.png', // url
						    scaledSize: new google.maps.Size(50, 50), // scaled size
						    origin: new google.maps.Point(0,0), // origin
						    anchor: new google.maps.Point(25,25) // anchor
						}
					},map,true);
				}

				map.setZoom(14);
			});
		}else{
			if(!geoMark)
				geoMark = false;
		}
	});
}

/**
 * addMarker - Easy to add marker 
 * @param props Marker property (lat,lng,content,icon)
 * @param map Current map 
 * @param isOpenInfo If true infowindow will open when page load
 */
function addMarker(props, map, isOpenInfo = false){
    var pos = {lat:props.lat,lng:props.lng}
    var marker = new google.maps.Marker({
        position:pos,
        map:map,
    });

    // Check for custom image
    if(props.icon){
        marker.setIcon(props.icon);
    }

    // Check content
    if(props.content){
        var infoWindow = new google.maps.InfoWindow({
            content:props.content
        });

        if(isOpenInfo)
            infoWindow.open(map, marker);

        marker.addListener('click',function(){
            infoWindow.open(map, marker);
        });
    }

    return marker;

}

let HistoryFloatLeft = true;
/**
 * History initialization
 */
$(document).ready(function(){
    fetch(`/db/get_history`, {method : 'get'}).then((res)=>{
        return res.json();
    }).then((data)=>{

        // Add to history front
        for(let i=0; i<data.length; i++){
            
            $('#map-info-history .map-info-body-ul').append(listContent(HistoryFloatLeft,data[i]));
            if(HistoryFloatLeft)
                HistoryFloatLeft = false;
            else
                HistoryFloatLeft = true;
        }
    });
});

/**
 * Scroll to top button event 
 */
$(document).scroll(function(){
    if($(document).scrollTop() > 20) $("#scroll-up").css('visibility', 'visible');
    else $("#scroll-up").css('visibility', 'hidden');
});

// Animation scroll to top
$(document).on('click','#scroll-up',function(){
    $("html, body").animate({ scrollTop: 0 }, 1000);
});

/**
 * Map infowindow click event
 */
$(document).on('click','.map-marker, .map-info-body-id',function(){
    const id = $(this).attr('id');


    // Get data of marker with id
    fetch(`/db/get_event/${id}`, {method : 'get'}).then((res)=>{
        return res.json();
    }).then((res)=>{
        const data = res.data;
        let addTag = `<div id="${data._id}" class="map-info-event-id">Sub</div>`;
        
        if(!res.login){
            addTag = '<div><a href="/login">Please log in to add</a></div>'
        }
        if(res.include){
            addTag = `<div id="${data._id}" class="map-info-event-id">Un Sub</div>`
        }

        // Display selected data info
        $('#map-info-eventInfo').html(
            `<div class="map-info-title">${data.title}</div>
            <div class="map-info-body-container"><div class="map-info-body">${data.content}</div></div>
            ${addTag}
            <div id="data._eventUserId" class="map-info-event-userId">username</div>`
        );
        // Scroll to bottom
        const scrollTO = $(document).height()-$('.page-footer').height()-$(window).height();
        $("html, body").animate({ scrollTop: $('#map-info-tag').offset().top-$('.header').innerHeight() }, 1000);
        // Tag open close
        $('#map-info-tag').find('.map-info-tag-hider').hide();
        $('#map-info-tag-info').find('.map-info-tag-hider').show();

        $('#map-info').find(`.map-info-content`).hide();
        $('#map-info').find(`#map-info-eventInfo`).show();

        // If history list is full remove last
        if(res.delHis)
            $(`#map-info-history #${res.delHis}`).remove();
        
        // If event is in histroy remove first
        if($(`#map-info-history`).find(`#${data._id}`))
            $(`#map-info-history`).find(`#${data._id}`).parent().parent().remove();

        
        // Add to history front
        $('#map-info-history .map-info-body-ul').prepend(listContent(HistoryFloatLeft,data));
        if(HistoryFloatLeft)
            HistoryFloatLeft = false;
        else
            HistoryFloatLeft = true;
        
    });
});

/**
 * Click tag menu to switch
 */
$(document).on('click','.map-info-tag-content-title',function(){
    
    $(this).parent().parent().find('.map-info-tag-hider').hide();
    $(this).parent().find('.map-info-tag-hider').show();

    $('#map-info').find(`.map-info-content`).hide();
    $('#map-info').find(`#map-info-${$(this).attr('value')}`).show();

});

/**
 * User sub event 
 */
$(document).on('click','.map-info-event-id',function(){
    const id = $(this).attr('id');
    fetch(`/user/add/event/${id}`, {method : 'put'}).then((res)=>{
        return res.json();
    }).then((res)=>{
        // Change sub and unsub button
        if(res.action == "add")
            $('.map-info-event-id').html('Un sub')
        else if(res.action == "delete")
            $('.map-info-event-id').html('Sub')
    })
});

/**
 * Call user subed events
 */
let likeFloatLeft = true;
$(document).on('click','#map-info-like-event-button',function(){
    fetch(`/user/get_event/test`, {method : 'get'}).then((res)=>{
        return res.json();
    }).then((res)=>{
        const data = res.data;
        for(let i=0; i<data.length; i++){
            $('#map-info-like .map-info-body-ul').append(listContent(likeFloatLeft,data[i]));
            if(likeFloatLeft)
                likeFloatLeft = false;
            else
                likeFloatLeft = true;
        }
    })
});

function listContent(float, data){
    const rand1 = Math.floor(Math.random() * 20)-10; 
    const rand2 = Math.floor(Math.random() * 20)-10; 
    let contentLeft = `<li class="map-info-body-li">
        <div class="map-info-body-list-container" style="-ms-transform: rotate${rand1}deg); /* IE 9 */
        -webkit-transform: rotate(${rand1}deg); /* Safari 3-8 */
        transform: rotate(${rand1}deg);">
            <div class="map-info-body-list-pin-container">
                <div class="map-info-body-list-pin" style="-ms-transform: rotate${rand2}deg); /* IE 9 */
                -webkit-transform: rotate(${rand2}deg); /* Safari 3-8 */
                transform: rotate(${rand2}deg);"></div>
            </div>
            <div class="map-info-body-list">
                <div class="map-info-body-list-img map-info-body-list-content"><img src="${data.title_img}"></div>
            </div>
        </div>
        <div class="map-info-body-content-container">
            <div class="map-info-body-content-title">${data.title}</div>
            <div class="map-info-body-content-user">${data.user}</div>
            <div class="map-info-body-content-content-container">
                <div class="map-info-body-content-content">${data.content}</div>
            </div>
            <div id="${data._id}" class="map-info-body-id">More Info</div>
        </div>
        <div class="float-clear-both"></div>
    </li>`;
    let contentRight = `<li class="map-info-body-li">
        <div class="map-info-body-content-container">
            <div class="map-info-body-content-title">${data.title}</div>
            <div class="map-info-body-content-user">${data.user}</div>
            <div class="map-info-body-content-content-container">
                <div class="map-info-body-content-content">${data.content}</div>
            </div>
            <div id="${data._id}" class="map-info-body-id">More Info</div>
        </div>
        <div class="map-info-body-list-container" style="-ms-transform: rotate${rand1}deg); /* IE 9 */
        -webkit-transform: rotate(${rand1}deg); /* Safari 3-8 */
        transform: rotate(${rand1}deg);">
            <div class="map-info-body-list-pin-container">
                <div class="map-info-body-list-pin" style="-ms-transform: rotate${rand2}deg); /* IE 9 */
                -webkit-transform: rotate(${rand2}deg); /* Safari 3-8 */
                transform: rotate(${rand2}deg);"></div>
            </div>
            <div class="map-info-body-list">
                <div class="map-info-body-list-img map-info-body-list-content"><img src="${data.title_img}"></div>
            </div>
        </div>
        <div class="float-clear-both"></div>
    </li>`;
    return (float) ? contentLeft : contentRight;
}