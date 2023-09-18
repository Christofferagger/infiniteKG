import React, { useEffect, useState } from 'react';
import CytoscapeComponent from '../components/graphVisualization';

const GraphViewPage = () => {
    const [elements, setElements] = useState(null);

    useEffect(() => {
        /*fetch(
            fetch all data
        );*/
        
    }, []);

    return elements ? <CytoscapeComponent {elements} /> : null;
}
