import { GOOGLE_API_KEY } from '../constants.js';
import { newElement } from '../utils.js';
import { useState } from 'react';


const GOOGLE_SCRIPT_ID = 'data-google-api-script';


function customizeGoogleObjects() {
    // Attach custom props to Google objects.
    google.maps.Marker.prototype.companyData = null;
}

function isScriptAlreadyAdded() {
    return Boolean(document.querySelectorAll(`[${GOOGLE_SCRIPT_ID}]`)[0]);
}

function isApiAlreadyLoaded() {
    return Boolean(window.google);
}


// This needs to follow the singleton pattern. Meaning that loadApi can be called multiple times,
// but the google api script injection will happen only once.
export const useGoogleMaps = () => {
    const [isScriptAdded, setIsScriptAdded] = useState(() => isScriptAlreadyAdded());
    const [isApiLoaded, setIsApiLoaded] = useState(() => isApiAlreadyLoaded());

    const loadApi = () => {
        if (isScriptAdded || isApiLoaded) {
            return;
        }

        setIsScriptAdded(true);
        injectScript();
    }

    const injectScript = () => {
        const apiUrl = 'https://maps.googleapis.com/maps/api/js';
        const apiKey = GOOGLE_API_KEY;
        const language = 'bg';
        const region = 'BG';

        window.handleApiLoadedCallback = function callback() {
            setIsApiLoaded(true);
            customizeGoogleObjects();
        };

        const args =
            'callback=handleApiLoadedCallback' +
            `&language=${language}&region=${region}&key=${apiKey}`;

        const script = newElement('script', {
            src: `${apiUrl}?${args}`,
            [GOOGLE_SCRIPT_ID]: true,
        });
        window.document.body.appendChild(script);
    }

    return {isApiLoaded, loadApi};
}
