import React from 'react';
import { _StyledCompanyScaleLegendContainer_ } from './styled-components/StyledCompanyScaleLegend.js';


export default function CompanyScaleLegend(props) {
    return (
        <_StyledCompanyScaleLegendContainer_>
            <span className='legend'>{props.title || 'Legend'}: </span>
            <span className='startup'>Startup</span>
            <span className='small'>Small</span>
            <span className='medium'>Medium</span>
            <span className='big'>Big</span>
            <span className='large'>Large</span>
        </_StyledCompanyScaleLegendContainer_>
    );
}
