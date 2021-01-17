import { useLayoutEffect, useState } from 'react';

// source https://stackoverflow.com/questions/19014250/rerender-view-on-browser-resize-with-react
export default function useWindowResize() {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
        function updateSize() {
            setSize([window.innerWidth, window.innerHeight]);
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
}
