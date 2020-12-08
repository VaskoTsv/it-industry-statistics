import React, { useEffect, useRef, useState } from 'react';
import { useSelect } from '../../hooks/select.hook.js';
import {
    BASE_URL_DEV,
    COMPANIES_COMPARE_TYPE,
    MAIN_CITIES,
    TRANSLATED_CITIES,
} from '../../constants.js';
import Filters from '../Filters.jsx';
import Chart from 'chart.js';
import { useHttp } from '../../hooks/htpp.hook.js';
import Loader from '../Loader.jsx';
import { useMessage } from '../../hooks/message.hook.js';
import { _cyan_, _green_, _lightRed_, _orange_, _purple_ } from '../styled-components/styledUtils.js';
import { showHandledErrors } from '../../utils.js';


const INITIAL_STATISTICS = {
    comparer: null,
    compared: null,
    compareType: null,
};


export default function ComparerPage() {
    const comparerChartRef = useRef();
    const comparedChartRef = useRef();
    const barChartRef = useRef();

    const {isLoading, request} = useHttp();
    const {showError} = useMessage();

    const [statistics, setStatistics] = useState(INITIAL_STATISTICS);
    const [comparerChart, setComparerChart] = useState(() => null);
    const [comparedChart, setComparedChart] = useState(() => null);
    const [barChart, setBarChart] = useState(() => null);

    // Init filter helpers.
    const [comparerCityFilter, renderComparerCityFilter] = useSelect({
        items: MAIN_CITIES,
        title: 'By city',
        defaultOption: MAIN_CITIES[0],
        filterableBy: 'title',
    });
    const [comparedCityFilter, renderComparedCityFilter] = useSelect({
        items: MAIN_CITIES,
        title: 'By city',
        defaultOption: MAIN_CITIES[1],
        filterableBy: 'title',
    });
    const [compareTypeFilter, renderCompareTypeFilter] = useSelect({
        items: COMPANIES_COMPARE_TYPE,
        defaultOption: COMPANIES_COMPARE_TYPE[0],
    });

    useEffect(() => {
        handleStatisticsChange();
    }, [comparerCityFilter, comparedCityFilter, compareTypeFilter]);

    useEffect(() => {
        destroyOldCharts();
        initBarChart();
        initDoughnutChart({
            element: comparerChartRef.current,
            dataName: 'comparer',
            data: statistics.comparer,
            setData: setComparerChart,
            city: comparerCityFilter,
        });
        initDoughnutChart({
            element: comparedChartRef.current,
            dataName: 'compared',
            data: statistics.compared,
            setData: setComparedChart,
            city: comparedCityFilter,
        });
    }, [statistics]);

    const handleStatisticsChange = async () => {
        const statistics = await getStatistics();
        setStatistics(statistics);
    }

    const getStatistics = async () => {
        try {
            return await request(
                BASE_URL_DEV + '/api/company/list/statistics',
                'POST',
                {...getParams()},
            );
        } catch (e) {
            if (!e.responseJSON) return;
            showHandledErrors(e.responseJSON, showError);
        }
    }

    const getParams = () => {
        return {
            comparerCityFilter,
            comparedCityFilter,
            compareTypeFilter,
        }
    }

    const destroyOldCharts = () => {
        if (barChart) barChart.destroy();
        if (comparerChart) comparerChart.destroy();
        if (comparedChart) comparedChart.destroy();
    }

    const initBarChart = () => {
        const element = barChartRef.current;

        if (!element || !statistics.comparer || !statistics.compared) return;

        const chartData = getBarChartData();

        setBarChart(
            new Chart(element, {
                type: 'horizontalBar',
                data: {
                    labels: [...chartData.labels],
                    datasets: [{
                        label: 'Quantity comparison',
                        data: [...chartData.data],
                        backgroundColor: [...chartData.colors],
                        borderColor: [...chartData.colors],
                        borderWidth: 1
                    }],
                },
                options: {responsive: true},
            })
        );
    }

    const getBarChartData = () => {
        const formattedData = {
            labels: [],
            data: [],
            colors: [
                _lightRed_, _lightRed_, _orange_, _orange_,
                _purple_, _purple_, _cyan_, _cyan_, _green_, _green_
            ],
        };

        for (const [key, value] of Object.entries(statistics.comparer.stats)) {
            const comparerLabel = `${key} ${TRANSLATED_CITIES[comparerCityFilter]}`;
            const comparerData = value;

            const comparedLabel = `${key} ${TRANSLATED_CITIES[comparedCityFilter]}`;
            const comparedData = statistics.compared.stats[key];

            formattedData.labels.push(comparerLabel);
            formattedData.data.push(comparerData);

            formattedData.labels.push(comparedLabel);
            formattedData.data.push(comparedData);
        }

        return formattedData;
    }

    const initDoughnutChart = ({element, dataName, data, setData, city}) => {
        if (!element || !data) return;

        const chartData = getDoughnutChartData(dataName);

        setData(
            new Chart(element, {
                type: 'doughnut',
                data: {
                    labels: [...chartData.labels],
                    datasets: [
                        {
                            fill: true,
                            backgroundColor: [...chartData.colors],
                            data: [...chartData.data],
                            borderColor: ['gray', 'gray', 'gray'],
                            borderWidth: [1, 1, 1]
                        }
                    ]
                },
                options: getDoughnutChartOptions(city),
            })
        );
    }

    const getDoughnutChartData = (comparerName) => {
        const formattedData = {
            labels: [],
            data: [],
            colors: [_lightRed_, _orange_, _purple_, _cyan_, _green_],
        };

        for (const [key, value] of Object.entries(statistics[comparerName].stats)) {
            formattedData.labels.push(key);
            formattedData.data.push(value);
        }

        return formattedData;
    }

    const getDoughnutChartOptions = (city) => {
        return {
            title: {
                display: true,
                text: `${TRANSLATED_CITIES[city]} industry overview`,
                position: 'top'
            }
        }
    }

    return (
        <React.Fragment>
            <Filters title="City comparer" hideClearButton={true}>
                <Filters.Item label="Compare">{renderComparerCityFilter()}</Filters.Item>
                <Filters.Item label="with">{renderComparedCityFilter()}</Filters.Item>
                <Filters.Item label="by">{renderCompareTypeFilter()}</Filters.Item>
            </Filters>
            <canvas ref={barChartRef} />
            <canvas ref={comparerChartRef} />
            <canvas ref={comparedChartRef} />
            <Loader isLoading={isLoading} />
        </React.Fragment>
    );
}
