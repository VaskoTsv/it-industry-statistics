import React, { useState } from 'react';
import { Button, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';


const EMPTY_OPTION = {
    id: null,
    title: null,
    value: null,
};


export const useSelect = ({ items, title = 'Filter by', defaultOption = EMPTY_OPTION, filterableBy = null }) => {
    const [data, setData] = useState({
        selected: defaultOption,
        query: '',
    });
    const isFilterable = Boolean(filterableBy);

    const handleClick = (item) => {
        setData({ ...data, query: '', selected: { ...item } });
    }

    const handleClear = () => {
        setData({ selected: EMPTY_OPTION, query: '' });
    }

    const renderItemRenderer = (item, { handleClick, query }) => {
        if (isFilterable && !item[filterableBy].toLowerCase().includes(query.toLowerCase())) {
            return null;
        }

        return (
            <MenuItem
                key={item.id}
                label={item.title}
                active={item.id === data.selected.id}
                onClick={handleClick}
                shouldDismissPopover={true}
            />
        );
    }

    const renderSelect = () => {
        return (
            <Select
                items={items}
                filterable={isFilterable}
                query={data.query}
                itemRenderer={renderItemRenderer}
                onItemSelect={handleClick}
                noResults={<MenuItem disabled={true} text="No results." />}
            >
                <Button text={data.selected.title || title}
                    rightIcon="double-caret-vertical" />
            </Select>
        );
    }

    // Return the selected option, render function and clear filter functions.
    return [data.selected.value, renderSelect, handleClear];
}
