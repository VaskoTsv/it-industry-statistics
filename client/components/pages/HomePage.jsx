import React, { useEffect, useState } from 'react';
import { useHttp } from '../../hooks/htpp.hook.js';
import { InputGroup } from '@blueprintjs/core';
import { BASE_URL_DEV, COMPANY_SIZE, MAIN_CITIES, PROFIT_SIZE } from '../../constants.js';
import Loader from '../Loader.jsx';
import GoogleMapsApiLoader from '../GoogleMapsApiLoader.jsx';
import GoogleMap from '../GoogleMap.jsx';
import Filters from '../Filters.jsx';
import { useSelect } from '../../hooks/select.hook.js';
import CompanyScaleLegend from '../CompanyScaleLegend.jsx';
import { debounce, showHandledErrors } from '../../utils.js';
import { useMessage } from '../../hooks/message.hook.js';


const debouncedFetch = debounce();


export default function HomePage() {
    const {isLoading, request} = useHttp();
    const {showError} = useMessage();

    const [companies, setCompanies] = useState([]);

    // Init filter helpers.
    const [nameFilter, setNameFilter] = useState('');
    const [cityFilter, renderCityFilter] = useSelect({
        items: MAIN_CITIES,
        title: 'By city',
        defaultOption: MAIN_CITIES[1],
        filterableBy: 'title',
    });
    const [sizeFilter, renderSizeFilter, clearSizeFilter] = useSelect({
        items: COMPANY_SIZE,
        title: 'By size',
    });
    const [profitFilter, renderProfitFilter, clearProfitFilter] = useSelect({
        items: PROFIT_SIZE,
        title: 'By profit',
    });

    useEffect(() => {
        debouncedFetch(() => updateCompanies(), 300);
    }, [nameFilter, cityFilter, sizeFilter, profitFilter]);

    const getParams = () => {
        return {
            nameFilter,
            cityFilter,
            sizeFilter,
            profitFilter,
        }
    };

    const updateCompanies = async () => {
        try {
            const response = await request(
                BASE_URL_DEV + '/api/company/list',
                'POST',
                {...getParams()},
            );
            setCompanies(response.companies);
        } catch (e) {
            setCompanies([]);
            if (!e.responseJSON) return;
            showHandledErrors(e.responseJSON, showError);
        }
    };

    const handleClearFilters = () => {
        clearSizeFilter();
        clearProfitFilter();
        setNameFilter('');
    };

    return (
        <React.Fragment>
            <GoogleMapsApiLoader>
                <Filters onClear={handleClearFilters}>
                    <Filters.Item>{renderCityFilter()}</Filters.Item>
                    <Filters.Item>{renderSizeFilter()}</Filters.Item>
                    <Filters.Item>{renderProfitFilter()}</Filters.Item>
                    <Filters.Item>
                        <InputGroup
                            type="search"
                            large={false}
                            placeholder="Search by name..."
                            onChange={e => setNameFilter(e.target.value)}
                            value={nameFilter} />
                    </Filters.Item>
                </Filters>
                <CompanyScaleLegend title="Map Legend" />
                <GoogleMap city={cityFilter} companies={companies} />
            </GoogleMapsApiLoader>
            <Loader isLoading={isLoading} />
        </React.Fragment>
    );
}
