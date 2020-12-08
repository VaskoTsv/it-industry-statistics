import styled from 'styled-components';
import { calculateRem } from './styledUtils.js';

export const _StyledContentWrapper_ = styled.div`
     width: ${calculateRem(960)};
     margin: 0 auto;
     padding: ${calculateRem(20)};
`
