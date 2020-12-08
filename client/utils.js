import { BULGARIA_BOUNDS, SOFIA_CENTER_LOCATION } from './constants.js';


export function noop() {
}

export function debounce() {
    let timer;

    return (callback, ms) => {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
}

export function newElement(type, attrs = {}) {
    const el = document.createElement(type);

    for (let attr in attrs) {
        const value = attrs[attr];
        if (attr == 'innerText') el.innerText = value;
        else el.setAttribute(attr, value);
    }

    return el;
}

// Custom error class that extends the default Error object and saves
// the errors returned from the server, inside the custom Error.responseJSON property.
export class APIError extends Error {
    constructor(errors) {
        super();
        this.responseJSON = errors;
    }
}

export const showHandledErrors = (errorsObj, showError) => {
    for (const key of Object.keys(errorsObj)) {
        showError(errorsObj[key]);
    }
}

export const createGoogleMap =
    ({
         element,
         center = SOFIA_CENTER_LOCATION,
         bounds = BULGARIA_BOUNDS,
         zoom = 12,
         scrollwheel = true,
     }) => {
        return new google.maps.Map(element, {
            zoom,
            center: googleLatLng(center),
            scrollwheel,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            draggableCursor: 'default',
            restriction: {
                latLngBounds: bounds,
                strictBounds: true,
            },
        });
    };

export const createGoogleMarker =
    ({
         map,
         position,
         iconOptions,
     }) => {
        return new google.maps.Marker({
            map,
            position,
            icon: iconOptions,
        });
    }

export const googleGeocoder = () => new google.maps.Geocoder();

export const googleLatLng = pos => new google.maps.LatLng(pos);

export const googleBounds = () => new google.maps.LatLngBounds();
