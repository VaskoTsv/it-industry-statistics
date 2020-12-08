import styled from 'styled-components';
import { calculateRem } from './styledUtils.js';

export const _StyledFormWrapper_ = styled.div`
    width: ${calculateRem(800)};
    margin: 0 auto;
    
    .bp3-input-group.bp3-large .bp3-input {
        margin-bottom: ${calculateRem(20)};
    }
    
    .bp3-button-group .bp3-button:not(:first-child) {
        margin-left: ${calculateRem(20)};
    }
`
