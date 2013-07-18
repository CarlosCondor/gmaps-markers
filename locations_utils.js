/**
 * Utils to work with Google Maps
 * @author Juan Carlos Delgado <jcdelgado@wtelecom.es>
 */
window.location_utils = (function() {
    /********************/
    // PRIVATE MEMBERS  //
    /********************/

     // Private global variables
    var map = null;
    var marker = new google.maps.Marker({draggable: true});
    var geocoder = null;
    var selected_location;
    var form_input_params;

    var markers = [];

    var configure = {
            map: {
                mode: 'read', // read|write mode
                browser: null, // target input element to browse addresses
                target: null,        // target element(s) to draw map
                center: new google.maps.LatLng(40.46366700000001,-3.7492200000000366), // Spain
                zoom: 5,             // Map zoom. By default: 5
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                toggleControls: false, // Control for filter ESE, CUADRO, TODO..  no finished
            },

         
    };

    function updateZoom() {
        var currentZoom = map.getZoom();
            // document.getElementById('location_map_search').value = currentZoom;

            for (m in markers) {
                if ((currentZoom <= markers[m].visibility.max) && (currentZoom >= markers[m].visibility.min)) {
                    markers[m].marker.setMap(map);
                }
                else {
                    markers[m].marker.setMap(null);
                    markers[m].infoWindow.close();
                }
            }

            if (currentZoom >= 3 && currentZoom <= 4) {
               marker.setMap(map);
            } else if (currentZoom == 12) {
                // Near to street
               marker.setMap(null);
            } else if (currentZoom == 7) {
                // Big cities
               marker.setMap(null);
            } else if (currentZoom == 6) {
                // Provices
               marker.setMap(null);
            } else if (currentZoom == 5) {
                // Autonomous communities
               marker.setMap(null);
            } else {
               marker.setMap(null);
            }
    }

    var maps = (function() { return {
        draw: function() { 

            function HomeControl(controlDiv, map) {

                // Set CSS styles for the DIV containing the control
                // Setting padding to 5 px will offset the control
                // from the edge of the map.
                controlDiv.style.padding = '5px';

                // Set CSS for the control border.
                var controlUI = document.createElement('ul');
                controlUI.style.backgroundColor = 'white';
                controlUI.style.borderStyle = 'solid';
                controlUI.style.borderWidth = '1px';
                controlUI.style.cursor = 'pointer';
                //controlUI.style.textAlign = 'center';
                controlUI.style.padding = "0";
                controlUI.style.margin = "1px";
                controlUI.style.height = "14px";
                controlUI.style['list-style-type'] = "none";
                controlDiv.appendChild(controlUI);

                var toggler_options = [];

                // Set CSS for the control interior.
                var controlText = document.createElement('li');
                controlText.style.float = "left";
                controlText.style['border-right'] = "1px solid";
                controlText.style.fontFamily = 'Arial,sans-serif';
                controlText.style.fontSize = '12px';
                controlText.style.paddingLeft = '5px';
                controlText.style.paddingRight = '5px';
                controlText.innerHTML = 'Todo';
                controlUI.appendChild(controlText);
                toggler_options.push(controlText);

                // Set CSS for the control interior.
                var controlText2 = document.createElement('li');
                controlText2.style.float = "left"
                controlText2.style['border-right'] = "1px solid";
                controlText2.style.fontFamily = 'Arial,sans-serif';
                controlText2.style.fontSize = '12px';
                controlText2.style.paddingLeft = '5px';
                controlText2.style.paddingRight = '5px';
                controlText2.innerHTML = 'ESE';
                controlUI.appendChild(controlText2);
                toggler_options.push(controlText2);


                 // Set CSS for the control interior.
                var controlText3 = document.createElement('li');
                controlText3.style.float = "left"
                controlText3.style.fontFamily = 'Arial,sans-serif';
                controlText3.style.fontSize = '12px';
                controlText3.style.paddingLeft = '5px';
                controlText3.style.paddingRight = '5px';
                controlText3.innerHTML = 'Cuadro';
                controlUI.appendChild(controlText3);
                toggler_options.push(controlText3);

                google.maps.event.addDomListener(controlText, 'click', function(e) {
                    for (n in toggler_options) {
                        toggler_options[n].style.backgroundColor = "white";
                    }
                    e.target.style.backgroundColor = "#1B91E0";

                    console.log(e);
                });

                google.maps.event.addDomListener(controlText2, 'click', function(e) {
                    for (n in toggler_options) {
                        toggler_options[n].style.backgroundColor = "white";
                    }
                    e.target.style.backgroundColor = "#1B91E0";

                    console.log(e);
                });

                google.maps.event.addDomListener(controlText3, 'click', function(e) {
                    for (n in toggler_options) {
                        toggler_options[n].style.backgroundColor = "white";
                    }
                    e.target.style.backgroundColor = "#1B91E0";

                    console.log(e);
                });
            }

            geocoder = new google.maps.Geocoder();

            // Draw map
            map = new google.maps.Map(document.getElementById(configure.map.target), 
                {center: configure.map.center,
                 zoom: configure.map.zoom,
                 mapTypeId: configure.map.mapTypeId,
                 disableDefaultUI: true
                });

            marker.setMap(map);

            if (configure.map.mode.toLowerCase() == "write") {

                google.maps.event.addListener(map, 'click', maps.updateSelectedPosition);
                google.maps.event.addListener(marker,'dragend', maps.updateSelectedPosition);    
            }
            else if (configure.map.mode.toLowerCase() == "read") {

                var homeControlDiv = document.createElement('div');
                var homeControl = new HomeControl(homeControlDiv, map);

                if (configure.map.toggleControls) {
                    homeControlDiv.index = 1;
                    map.controls[google.maps.ControlPosition.TOP_CENTER].push(homeControlDiv);    
                }
                

                // Unch unch unch
                google.maps.event.addListener(map, 'zoom_changed', function () {

                    updateZoom();

                    var currentZoom = map.getZoom();

                    for (m in markers) {
                        if ((currentZoom <= markers[m].visibility.max) && (currentZoom >= markers[m].visibility.min)) {
                            markers[m].marker.setMap(map);
                        }
                        else {
                            markers[m].marker.setMap(null);
                            markers[m].infoWindow.close();
                        }
                    }

                    if (currentZoom >= 3 && currentZoom <= 4) {
                       marker.setMap(map);
                    } else if (currentZoom == 12) {
                        // Near to street
                       marker.setMap(null);
                    } else if (currentZoom == 7) {
                        // Big cities
                       marker.setMap(null);
                    } else if (currentZoom == 6) {
                        // Provices
                       marker.setMap(null);
                    } else if (currentZoom == 5) {
                        // Autonomous communities
                       marker.setMap(null);
                    } else {
                       marker.setMap(null);
                    }
                });
            }
        },

        // browser_init: function() {
        //     console.log("browserInit")
        //     $('#'+configure.map.browser).geocomplete({
        //         geocoder_region: 'Europe',
        //         geocoder_address: true,
        //         select: function(_event, _ui) {
        //             selected_location = _ui.item.location;

        //             if (_ui.item.viewport) map.fitBounds(_ui.item.viewport);
        //             marker.setMap(map);
        //             marker.setPosition(google.maps.LatLng(
        //                         _ui.item.location.lat,
        //                         _ui.item.location.lng
        //                     ));
        //         }
        //     });
        // },

        drawMarkers: function(markerList) {

            for (var n in markerList) {
                var thismarker,
                    thisWindows;

                markerList[n].marker = new google.maps.Marker({
                    position: new google.maps.LatLng(markerList[n].position.lat,markerList[n].position.lng),
                    map: map,
                    title: markerList[n].title
                });
                // Add marker object to dictionary
                //markerList[n].marker = thismarker;

                markerList[n].infoWindow = new google.maps.InfoWindow({
                    content: markerList[n].infoContent,
                });

                // Info window

                var boxText = document.createElement("div");
                boxText.style.cssText = "border: 1px solid black; margin-top: 8px; background: #5EB7FF; padding: 5px;";
                boxText.innerHTML = markerList[n].infoContent;
                        
                var myOptions = {
                         content: boxText
                        ,disableAutoPan: false
                        ,maxWidth: 0
                        ,pixelOffset: new google.maps.Size(-50, -70)
                        ,zIndex: null
                        ,boxStyle: { 
                          // background: "url('/static/img/tipdown.gif') no-repeat"
                          opacity: 0.75
                          ,width: "100px"
                         }
                        ,closeBoxMargin: "10px 2px 2px 2px"
                        ,closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif"
                        ,infoBoxClearance: new google.maps.Size(1, 1)
                        ,isHidden: false
                        ,pane: "floatPane"
                        ,enableEventPropagation: false
                };

                markerList[n].infoWindow = new InfoBox(myOptions);



                addMarkerListener(markerList[n].marker, markerList[n].infoWindow);
            }
            updateZoom();
            function addMarkerListener(marker, infoWindow) {
                google.maps.event.addListener(marker, 'click', function() {
                  infoWindow.open(map, marker);
                });
            }
        },

        updateSelectedPosition: function (event){
            // Create marker
            marker.setPosition(event.latLng);
            
            geocoder.geocode( {'latLng': event.latLng}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    map.setCenter(results[0].geometry.location);
                    
                    marker.setMap(map); 
                    marker.setPosition(results[0].geometry.location);
                    console.log(results[0].geometry.location);
                    // Analisys components of a location
                    _result = results[0];
                    var ownlocation = {};
                    ownlocation.full_address = _result.formatted_address;
                    ownlocation.lat = _result.geometry.location.jb;
                    ownlocation.lng = _result.geometry.location.kb;
                    var components = _result.address_components;
                    for (var i = components.length - 1; i >= 0; i--) {
                        switch(components[i].types[0]) {
                            case ('postal_code'):
                                ownlocation.zip = {};
                                ownlocation.zip.short_name = components[i].short_name;
                                ownlocation.zip.long_name = components[i].long_name;
                                break;
                            case ('country'):
                                ownlocation.country={};
                                ownlocation.country.short_name = components[i].short_name;
                                ownlocation.country.long_name = components[i].long_name;
                                break;
                            case ('administrative_area_level_1'):
                                ownlocation.autonomous_community={};
                                ownlocation.autonomous_community.long_name = components[i].long_name;
                                ownlocation.autonomous_community.short_name = components[i].short_name;
                                break;
                            case ('administrative_area_level_2'):
                                ownlocation.province={};
                                ownlocation.province.long_name = components[i].long_name;
                                ownlocation.province.short_name = components[i].short_name;
                                break;
                            case('political'):
                                ownlocation.political={};
                                ownlocation.political.long_name = components[i].long_name;
                                ownlocation.political.short_name = components[i].short_name;                                   
                                break;
                            case('locality'):
                                ownlocation.locality={};
                                ownlocation.locality.long_name = components[i].long_name;
                                ownlocation.locality.short_name = components[i].short_name;
                                break;
                            case('route'):
                                ownlocation.street={};
                                ownlocation.street.long_name = components[i].long_name;
                                ownlocation.street.short_name = components[i].short_name;
                                break;
                            case('street_number'):
                                ownlocation.street_number={};
                                ownlocation.street_number.long_name = components[i].long_name;
                                ownlocation.street_number.short_name = components[i].short_name;
                                break;
                            default:
                                break;
                        }
                    };
                    selected_location = ownlocation;
                    forms.update();
                }
                else {
                    alert("Geocode was not successful for the following reason: " + status);
                }                
            });
        },
    }})();


 
    function validOptions(options){
        if (!options)
            return false;
        return true;
    }
    
 

    /********************/
    //  PUBLIC MEMBERS  //
    /********************/
    return {

        map: (function() { return {
            init: function(options) {
                if (!validOptions(options)) {
                return null;
                }
                // Update options
                jQuery.extend(configure.map, options)
                // Invoke draw the map
                maps.draw();

                !options.markers || (function() { markers=options.markers;
                    maps.drawMarkers(options.markers); })();

                return;
            },
            center: function(params) {
                // Must be a dict {lat: 00, lng: 00, zoom: 7}
                params.zoom || (params.zoom = 7)
                map.setCenter(new google.maps.LatLng(params.lat,params.lng));
                map.setZoom(params.zoom);
            },
            addMarkers: function(markerList, clean) {
                // Marker must be an array of dicts with this format:
                /* {    position: {
                            lat: 00,
                            lng: 00
                            },
                        visibility: {
                            min: 5,
                            max: 13
                        },
                        title: 'The marker',
                        infoContent: 'PopupText'
                    }
                */

                if (!clean || true) {
                    // If clean, remove all markers from the map
                    for (n in markers)
                        markers[n].marker.setMap(null);
                    markers = [];
                }
                // Asign marker list and draw
                markers = markerList;
                maps.drawMarkers(markers);
            },

        }})(),
        init_map : function(options) {
            if (!validOptions(options)) {
                return null;
            }
            jQuery.extend(configure.map, options);

            maps.draw();
            if (options.browser)
                maps.browser_init();


            return;
        },
        addMarkers: function(markerList, clean) {
            if (!clean || true) {
                
                for (n in markers) {
                    markers[n].marker.setMap(null);
                }
                markers = [];
            }

            markers = markerList;
            maps.drawMarkers(markers);
        },

     
    }

})();

//jQuery.extend(true, {}, options);
