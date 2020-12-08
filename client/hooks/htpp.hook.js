import { useCallback, useState } from 'react';
import { APIError } from '../utils.js';


export const useHttp = () => {
    const [isLoading, setIsLoading] = useState(false);

    const request = useCallback(async (url, method = 'GET', body = null) => {
        setIsLoading(true);

        try {
            let options = {
                headers: {'Content-Type': 'application/json'}, method
            };

            if (body) {
                options = {...options, body: JSON.stringify(body)};
            }

            const response = await fetch(url, options);
            const data = await response.json();

            if (!response.ok) {
                throw new APIError(data.errors);
            }

            setIsLoading(false);

            return data;
        } catch (e) {
            setIsLoading(false);
            throw e;
        }
    }, []);

    return {isLoading, request};
}
