import React from 'react';
import { _StyledLoaderContainer_ } from './styled-components/StyledLoader.js';
import { Intent, Spinner } from '@blueprintjs/core';


export default function Loader({isLoading}) {
    if (!isLoading) {
        return null;
    }

    return (
        <_StyledLoaderContainer_>
            <Spinner intent={Intent.WARNING} size={Spinner.SIZE_LARGE} />
        </_StyledLoaderContainer_>
    );
}
