import React, { useEffect } from 'react';
import cytoscape from 'cytoscape';

const CytoscapeComponent = ({ elements, isChatVisible }) => {
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
            'curve-style': 'unbundled-bezier',
            'control-point-distances': [20, -20], 
            'control-point-weights': [0.5, 0.5],
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
        idealEdgeLength: 100,
        nodeOverlap: 20
      },
      userZoomingEnabled: true, 
      userPanningEnabled: true,
    });
  }, [elements]);

  return <div id="cy" className={isChatVisible ? "w-1/2 h-screen float-left fixed border" : "w-full h-screen float-left fixed border"} />;
};

export default CytoscapeComponent;
