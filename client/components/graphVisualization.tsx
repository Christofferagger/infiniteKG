import React, { useEffect } from 'react';
import cytoscape from 'cytoscape';

const CytoscapeComponent = ({ elements }) => {
  useEffect(() => {
    console.log(elements)
    console.log('Container:', document.getElementById('cy'));
    const cy = cytoscape({
      container: document.getElementById('cy'),
      elements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#666',
            'label': 'data(id)'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 3,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle'
          }
        }
      ],
      layout: {
        name: 'grid'
      }
    });
  }, [elements]);

  return <div id="cy" style={{ width: '800px', height: '600px' }} />;
};

export default CytoscapeComponent;
