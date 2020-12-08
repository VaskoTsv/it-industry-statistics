const {Router} = require('express');
const request = require('request');
const Company = require('../models/Company.js');
const {
    getFormattedErrors,
    getFilterMinMaxValues,
} = require('../utils.js');
const {
    BG_INDUSTRY_ENDPOINT,
    MAX_RESPONSE_SIZE,
    COMPANY_SIZE_OPTIONS,
    COMPANY_PROFIT_OPTIONS,
    SERVER_ERROR,
    SERVER_LIMIT_ERROR,
} = require('../constants.js');


const router = Router();


// api/company/list - Get all companies that match the applied filters.
router.post('/list', async (req, res) => {
    const {nameFilter, cityFilter, sizeFilter, profitFilter} = req.body;

    const appliedFilters = {
        name: {'$regex': nameFilter, '$options': 'i'},
        city: {'$regex': cityFilter, '$options': 'i'},
    }

    if (sizeFilter) {
        const {min, max} = getFilterMinMaxValues(sizeFilter);
        appliedFilters['employees_count'] = {$gte: min, $lte: max};
    }

    if (profitFilter) {
        const {min, max} = getFilterMinMaxValues(profitFilter);
        appliedFilters['profit'] = {$gte: min, $lte: max};
    }

    const companies = await Company.find(appliedFilters).exec();

    if (companies.length > MAX_RESPONSE_SIZE) {
        return res.status(413).json({
            errors: getFormattedErrors([SERVER_LIMIT_ERROR]),
        });
    }

    res.status(200).json({companies});
});


// api/company/list/statistics - Get statistics for all companies in comparer and compared cities.
router.post('/list/statistics', async (req, res) => {
    let response = null;

    const {comparerCityFilter, comparedCityFilter, compareTypeFilter} = req.body;

    const comparerFilters = {city: {'$regex': comparerCityFilter, '$options': 'i'}};
    const comparedFilters = {city: {'$regex': comparedCityFilter, '$options': 'i'}};

    const comparer = {city: '', stats: null};
    const compared = {city: '', stats: null};

    const getFilteredStats = async (filters, fieldName, initialStats, filterOptions) => {
        const stats = {...initialStats};

        for (const [key, value] of Object.entries(filterOptions)) {
            const {min, max} = getFilterMinMaxValues(filterOptions[key]);
            filters[fieldName] = {$gte: min, $lte: max};

            const results = await Company.find(filters);
            stats[key] = results.length;
        }

        return stats;
    }

    if (compareTypeFilter === 'size') {
        try {
            comparer.city = comparerCityFilter;
            comparer.stats = await getFilteredStats(
                comparerFilters,
                'employees_count',
                {Startup: null, Small: null, Medium: null, Big: null, Large: null},
                COMPANY_SIZE_OPTIONS,
            );

            compared.city = comparedCityFilter;
            compared.stats = await getFilteredStats(
                comparedFilters,
                'employees_count',
                {Startup: null, Small: null, Medium: null, Big: null, Large: null},
                COMPANY_SIZE_OPTIONS,
            );

            response = {comparer, compared, compareType: 'size'};
        } catch (e) {
            res.status(500).json({
                errors: getFormattedErrors([SERVER_ERROR]),
            });
        }
    }

    if (compareTypeFilter === 'profit') {
        try {
            comparer.city = comparerCityFilter;
            comparer.stats = await getFilteredStats(
                comparerFilters,
                'profit',
                {Broke: null, Poor: null, Normal: null, Rich: null, 'Very Rich': null},
                COMPANY_PROFIT_OPTIONS,
            );

            compared.city = comparedCityFilter;
            compared.stats = await getFilteredStats(
                comparedFilters,
                'profit',
                {Broke: null, Poor: null, Normal: null, Rich: null, 'Very Rich': null},
                COMPANY_PROFIT_OPTIONS,
            );

            response = {comparer, compared, compareType: 'profit'};
        } catch (e) {
            res.status(500).json({
                errors: getFormattedErrors([SERVER_ERROR]),
            });
        }
    }

    if (!response) {
        res.status(500).json({
            errors: getFormattedErrors([SERVER_ERROR]),
        });
    }

    res.status(200).json(response);
});


module.exports = router;
