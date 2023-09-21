import React, { useEffect } from 'react';
import cytoscape from 'cytoscape';

const CytoscapeComponent = ({ elements }) => {
  useEffect(() => {
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
            'background-color': 'data(color)',
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 3,
            'line-color': '#CBCBCB',
            'target-arrow-color': '#CBCBCB',
            'target-arrow-shape': 'triangle',
            'arrow-scale': 1.5,
            'curve-style': 'bezier',
            'label': 'data(type)',
            'text-background-color': '#f9f9f9',  
            'text-background-opacity': 1,
            'text-background-shape': 'roundrectangle',
            'text-background-padding': 2, 
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
