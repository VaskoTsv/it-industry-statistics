import styled from 'styled-components';
import { _purple_, _white_, calculateRem } from './styledUtils.js';

export const _StyledNavigationWrapper_ = styled.div`
    background-color: ${_purple_};
    color: ${_white_};
`

export const _StyledNavigationContainer_ = styled.div`
 margin: 0 auto;
 width: ${calculateRem(960)};
`

export const _StyledNavigationGroup_ = styled.div`
    a {
        color: ${_white_};
        text-decoration: none;
    }
    
    button.bp3-button.bp3-minimal {
        color: ${_white_};
        
        a {
            color: ${_white_};
        }
        
        :before {
            color: ${_white_};
        }
        
        :focus {
            outline: none;
        }
    }
    
    .bp3-navbar-divider {
        border-left: 1px solid ${_white_};
        opacity: 0.4;
    }
`

export const _StyledNavigationLogo_ = styled.div`
    height: 40px;
    cursor: pointer;
    
    img {
        height: 100%;
    }
`

export const _StyledNavigationTitle_ = styled.div`
    cursor: pointer;
`
