import styled from 'styled-components';
import { calculateRem } from './styledUtils.js';

export const _StyledFiltersContainer_ = styled.div`
    width: ${calculateRem(800)};
    margin: ${calculateRem(20)} auto;
    
    header {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        padding-bottom: ${calculateRem(15)};
    
        h2 {
            margin: 0 ${calculateRem(10)} 0;
        }
        
        button.bp3-button {
            height: 32px;
        }
    }
    
    main {
        padding: ${calculateRem(15)} 0;
    }
`

export const _StyledFiltersItem_ = styled.div`
    margin-right: ${calculateRem(15)} !important;
`
