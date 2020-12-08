import styled from 'styled-components';
import { _darkGray_, _white_, calculateRem } from './styledUtils.js';
import { COMPANY_SCALE } from '../../constants.js';

export const _StyledCompanyScaleLegendContainer_ = styled.div`
    width: 100%;
    height: ${calculateRem(60)};
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    
    span {
        display: inline-block;
        padding: ${calculateRem(5)} ${calculateRem(15)};        
        border-radius: 10px;
        margin-right: 10px;
        color: ${_white_};
    }
    
    span.legend {
        color: ${_darkGray_};
        font-weight: 700;
        margin: 0;
    }
    
    span.startup {
        background-color: ${COMPANY_SCALE.Startup.color};
    }
        
    span.small {
        background-color: ${COMPANY_SCALE.Small.color};
    }
        
    span.medium {
        background-color: ${COMPANY_SCALE.Medium.color};
    }
        
    span.big {
        background-color: ${COMPANY_SCALE.Big.color};
    }
        
    span.large {
        background-color: ${COMPANY_SCALE.Large.color};
    }
`
