import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext.js';
import { useHttp } from '../../hooks/htpp.hook.js';
import { BASE_URL_DEV } from '../../constants.js';
import { useReactLifecycles } from '../../hooks/react.lifecycles.hook.js';
import Loader from '../Loader.jsx';
import { useMessage } from '../../hooks/message.hook.js';
import { _StyledBookmarksContainer_, _StyledBookmarkInformation_ } from '../styled-components/StyledBookmarksPage.js';
import { Button } from '@blueprintjs/core';
import { showHandledErrors } from '../../utils.js';


export default function BookmarksPage() {
    const {componentDidMount} = useReactLifecycles()();

    const auth = useContext(AuthContext);
    const {request, isLoading} = useHttp();
    const {showSuccess, showError} = useMessage();

    const [user, setUser] = useState(null);

    componentDidMount(() => {
        fetchUserData();
    });

    const fetchUserData = async () => {
        try {
            const userData = await request(
                `${BASE_URL_DEV}/api/users/${auth.userId}`,
                'GET',
            );

            setUser(userData);
        } catch (e) {
            if (!e.responseJSON) return;
            showHandledErrors(e.responseJSON, showError);
        }
    }

    const removeBookmark = async (companyId) => {
        try {
            const response = await request(
                `${BASE_URL_DEV}/api/users/${auth.userId}/bookmarked/${companyId}`,
                'DELETE',
            );

            setUser(response.user);
            showSuccess(response.message);
        } catch (e) {
            if (!e.responseJSON) return;
            showHandledErrors(e.responseJSON, showError);
        }
    }

    const handleRemoveFromBookmarks = async (company) => {
        const confirmation = confirm(
            "Are you sure you want to remove the company from your bookmarks?");

        if (!confirmation) return;

        removeBookmark(company._id);
    }

    const renderCompany = (company) => {
        return (
            <_StyledBookmarkInformation_ key={company._id}>
                <h3>{company.name}</h3>
                <h5>City: {company.city}</h5>
                <h5>EIK: {company.eik}</h5>
                <h5>Employees: {company.employees_count}</h5>
                <h5>Revenue: {company.revenue_formatted} BGN</h5>
                <h5>Profit: {company.profit_formatted} BGN</h5>
                <Button
                    icon="delete"
                    intent="danger"
                    text="Remove from bookmarks"
                    onClick={() => handleRemoveFromBookmarks(company)}
                />
            </_StyledBookmarkInformation_>
        )
    }

    const renderCompaniesList = () => {
        if (!user) return;

        return (
            <_StyledBookmarksContainer_>
                {!user.bookmarked_companies.length ?
                    <h4 className="bp3-heading">There are no saved companies...</h4> : null}
                {user.bookmarked_companies.map(c => renderCompany(c))}
            </_StyledBookmarksContainer_>
        );
    }

    return (
        <React.Fragment>
            <h1>Bookmarked companies</h1>
            {renderCompaniesList()}
            <Loader isLoading={isLoading} />
        </React.Fragment>
    );
}
