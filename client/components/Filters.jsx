import React from 'react';
import { Button, ControlGroup, Divider, Tooltip, Position } from '@blueprintjs/core';
import {
    _StyledFiltersContainer_,
    _StyledFiltersItem_,
} from './styled-components/StyledFilters.js';


export default function Filters(props) {
    const renderClearFilters = () => {
        return (
            <Tooltip content="Clear all filters" position={Position.RIGHT}>
                <Button icon="eraser" onClick={props.onClear}>
                    Clear
                </Button>
            </Tooltip>
        );
    }

    return (
        <_StyledFiltersContainer_>
            <header>
                <h2 className="bp3-heading">{props.title || 'Filters'}</h2>
                {!props.hideClearButton && renderClearFilters()}
            </header>
            <Divider />
            <main>
                <ControlGroup vertical={false}>{props.children}</ControlGroup>
            </main>
        </_StyledFiltersContainer_>
    );
}

Filters.Item = function FiltersItem(props) {
    return (
        <_StyledFiltersItem_>
            {props.label && <span>{props.label}: </span>}
            {props.children}
        </_StyledFiltersItem_>
    );
}
