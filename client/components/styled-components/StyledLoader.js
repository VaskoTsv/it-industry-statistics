import styled from 'styled-components';
import { _lightGray_ } from './styledUtils.js';

export const _StyledLoaderContainer_ = styled.div`
    .bp3-spinner {
        width: 100%;
        height: 100%;
        min-height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background-color: ${_lightGray_};
        z-index: 100;
    }
`
