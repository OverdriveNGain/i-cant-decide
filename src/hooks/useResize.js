import { useState, useEffect } from "react";

const useResize = (callback) => {
    const [dimensions, setDimensions] = useState({
        height: window.innerHeight,
        width: window.innerWidth
    })

    const breakpointSelector = (xs, sm, md, lg, xl, xxl) => {
        let toReturn = xs;
        let width = dimensions.width;
        if (sm != null && width >= 576)
            toReturn = sm;
        if (md != null && width >= 768)
            toReturn = md;
        if (lg != null && width >= 992)
            toReturn = lg;
        if (xl != null && width >= 1200)
            toReturn = xl;
        if (xxl != null && width >= 1400)
            toReturn = xxl;
        return toReturn;
    }

    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                height: window.innerHeight,
                width: window.innerWidth
            });
            if (callback != null)
                callback();
        }

        let timer;
        const debounce = (func) => {
            return () => {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    func();
                }, 300);
            };
        }

        const debouncedHandleResize = debounce(handleResize);
        window.addEventListener('resize', debouncedHandleResize)


        return () => {
            window.removeEventListener('resize', debouncedHandleResize);
        }
    }, [dimensions, callback]);

    return { dimensions, breakpointSelector };
};

export default useResize;