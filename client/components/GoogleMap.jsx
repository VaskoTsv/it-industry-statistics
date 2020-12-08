import React, { useEffect, useRef, useState } from 'react';
import {
    createGoogleMap,
    createGoogleMarker,
    googleBounds,
    googleGeocoder,
    googleLatLng, showHandledErrors,
} from '../utils.js';
import { useReactLifecycles } from '../hooks/react.lifecycles.hook.js';
import { _StyledGoogleMapContainer_ } from './styled-components/StyledGoogleMap.js';
import { BASE_URL_DEV, COMPANY_SCALE, SOFIA_CENTER_LOCATION } from '../constants.js';
import { useHttp } from '../hooks/htpp.hook.js';
import { useAuth } from '../hooks/auth.hook.js';
import { useMessage } from '../hooks/message.hook.js';


function getCompanyScaleOptions(company) {
    // Get company scale options, based on the number of employees working for the company.
    let scale;
    const employeesCount = parseInt(company.employees_count);

    switch (true) {
        case employeesCount < 15:
            scale = COMPANY_SCALE.Startup;
            break;
        case employeesCount > 15 && employeesCount <= 50:
            scale = COMPANY_SCALE.Small;
            break;
        case employeesCount > 50 && employeesCount <= 100:
            scale = COMPANY_SCALE.Medium;
            break;
        case employeesCount > 100 && employeesCount <= 300:
            scale = COMPANY_SCALE.Big;
            break;
        case employeesCount > 300:
            scale = COMPANY_SCALE.Large;
            break;
        default:
            scale = COMPANY_SCALE.Startup;
    }

    return scale;
}


export default function GoogleMap(props) {
    const {componentDidMount} = useReactLifecycles()();
    const auth = useAuth();
    const {request} = useHttp();
    const {showSuccess, showError} = useMessage();

    const mapRef = useRef();
    const bounds = googleBounds();

    const [map, setMap] = useState(() => {
        return null;
    });
    const [infoWindow, setInfoWindow] = useState(() => {
        return null;
    })
    const [markers, setMarkers] = useState([]);

    componentDidMount(() => {
        initMap();
        setInfoWindow(new google.maps.InfoWindow());
    });

    useEffect(() => {
        updateMarkers();
    }, [map, props.companies]);

    useEffect(() => {
        updateMapPosition();
    }, [props.city]);

    useEffect(() => {
        addMarkersToMap();
        attachMarkersEventListeners();
    }, [markers]);

    const initMap = async () => {
        const cityCoords = await getCityCoords();

        setMap(createGoogleMap({
            element: mapRef.current,
            center: cityCoords || SOFIA_CENTER_LOCATION,
        }));
    }

    const updateMapPosition = async () => {
        if (!map) return;

        const cityCoords = await getCityCoords();

        map.setCenter({lat: cityCoords.lat, lng: cityCoords.lng})
    }

    const updateMarkers = () => {
        // Clear old markers.
        removeMarkersFromMap();
        clearMarkersEventListeners();
        setMarkers([]);

        if (!props.companies.length) return;

        const updatedMarkers = [];

        props.companies.forEach(company => {
            const scaleOptions = getCompanyScaleOptions(company);
            const latLng = googleLatLng({
                lat: parseFloat(company.lat),
                lng: parseFloat(company.lng),
            });

            const marker = createGoogleMarker({
                map: map,
                position: latLng,
                iconOptions: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: scaleOptions.scale,
                    fillColor: scaleOptions.color,
                    fillOpacity: 0.4,
                    strokeWeight: 0.4
                },
            });
            marker.companyData = {...company};

            bounds.extend(latLng);

            updatedMarkers.push(marker);
        });

        setMarkers(updatedMarkers);
    }

    const getCityCoords = () => {
        if (!props.city) return;

        const geocoder = googleGeocoder();

        return new Promise((resolve => {
            geocoder.geocode({'address': props.city}, function (results, status) {
                if (status !== 'OK') {
                    resolve(null);
                }

                const pos = results[0].geometry.location;

                resolve({
                    lat: pos.lat(),
                    lng: pos.lng()
                });
            });
        }));
    }

    const addMarkersToMap = () => {
        if (!markers.length) return;

        markers.forEach(marker => marker.setMap(map));
    }

    const removeMarkersFromMap = () => {
        markers.forEach(marker => marker.setMap(null));
    }

    const attachMarkersEventListeners = () => {
        markers.forEach(marker => {
            marker.addListener('click', () => {
                infoWindow.setContent(renderCompanyInfo(marker.companyData));
                handleInfoWindowEvents(marker.companyData);
                infoWindow.open(map, marker);
            });
        });
    }

    const clearMarkersEventListeners = () => {
        markers.forEach(marker => google.maps.event.clearInstanceListeners(marker));
    }

    const handleInfoWindowEvents = (company) => {
        const attachEventListeners = () => {
            google.maps.event.addListener(infoWindow, 'domready', () => {
                const button = document.getElementById('addBookmark');

                if (!button) return;

                attachBookmarkButtonListener(button, auth, company);
            });
        };

        const clearEventListeners = () => {
            google.maps.event.addListener(infoWindow, 'closeclick', () => {
                google.maps.event.clearInstanceListeners(infoWindow);
            });
        };

        const attachBookmarkButtonListener = (button, auth, company) => {
            google.maps.event.addDomListener(button, 'click', async () => {
                try {
                    const response = await request(
                        `${BASE_URL_DEV}/api/users/${auth.userId}/bookmarked/${company._id}`,
                        'PUT',
                    );

                    showSuccess(response.message);
                } catch (e) {
                    if (!e.responseJSON) return;
                    showHandledErrors(e.responseJSON, showError);
                }
            });
        }

        clearEventListeners();
        attachEventListeners();
    }

    const renderCompanyInfo = (company) => {
        return `
            <h3>${company.name}</h3>
            <h5>Eik: ${company.eik}</h5>
            <h5>Employees: ${company.employees_count}</h5>
            <h5>Revenue: ${company.revenue_formatted} BGN</h5>
            <h5>Profit: ${company.profit_formatted} BGN</h5>
            <button id="addBookmark">Add to bookmarks</button>
        `;
    }

    return (
        <_StyledGoogleMapContainer_>
            <div ref={mapRef} className="google-map" />
        </_StyledGoogleMapContainer_>
    );
}
