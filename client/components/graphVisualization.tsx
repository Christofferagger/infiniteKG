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
            'shape': 'roundrectangle',
            'text-valign': 'center',
            'text-halign': 'center',
            'label': 'data(label)',
            'font-size': '16px',
            'font-weight': 'bold',
            'width': 'label',
            'height': 'label',
            'border-width': '0.5px',
            'border-color': '#212121',
            'padding': '24px',
            'background-color': '#CCFFDA',
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
        name: 'cose',
        idealEdgeLength: 10,
        nodeOverlap: 5
      }
    });
  }, [elements]);

  return <div id="cy" className="w-1/2 h-screen float-left border" />;
};

export default CytoscapeComponent;
