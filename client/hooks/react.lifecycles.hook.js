import { useEffect } from 'react';


// Custom react lifecycles hook, helping to make handling of logic on component mount/unmount
// easier and more intuitive, similar to React class based components.
export const useReactLifecycles = () => {
    let executed = false;

    const componentDidMount = (mountHandler) => {
        return useEffect(mountHandler, []);
    }

    const componentWillUnmount = (unmountHandler) => {
        return useEffect(() => {
            return unmountHandler;
        }, []);
    }

    return () => {
        if (!executed) {
            executed = true;
            return {componentDidMount, componentWillUnmount};
        }
    };
}
