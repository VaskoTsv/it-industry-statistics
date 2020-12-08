import React from 'react';
import { useGoogleMaps } from '../hooks/google.maps.hook.js';
import { useReactLifecycles } from '../hooks/react.lifecycles.hook.js';


export default function GoogleMapsApiLoader({children}) {
    const {isApiLoaded, loadApi} = useGoogleMaps();
    const {componentDidMount} = useReactLifecycles()();

    componentDidMount(() => {
        loadApi();
    });

    return !isApiLoaded ? <h1>Loading map...</h1> : children;
}
