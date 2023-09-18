import React, { useEffect } from 'react';
import cytoscape from 'cytoscape';

const CytoscapeComponent = ({ elements }) => {
  useEffect(() => {
    const cy = cytoscape({
      container: document.getElementById('cy'),
      elements,
      style: [ // style information for nodes and edges
        // ...
      ],
      layout: {
        name: 'grid'
      }
    });
  }, [elements]);

  return <div id="cy" />;
};

export default CytoscapeComponent;
