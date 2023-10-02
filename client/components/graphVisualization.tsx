import React, { useEffect } from 'react';
import cytoscape from 'cytoscape';
import _ from 'lodash';

// CytoscapeComponent for visualizing graph data
const CytoscapeComponent = ({ elements, isChatVisible, newData }) => {
  useEffect(() => {
    
    // Initialize cytoscape with configuration
    const cy = cytoscape({
      container: document.getElementById('cy'),
      elements: elements,
      style: [
        // Node style
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
            'padding': '24',
            'background-color': 'data(color)',
          } as any
        },
        // Edge style
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
            'text-background-padding': '2', 
          }
        }
      ],
      userZoomingEnabled: true, 
      userPanningEnabled: true,
    });

    // Filter elements to focus on
    const focusElements = cy.filter(ele => 
      newData.some(focusEle => (
        (ele.isNode() && focusEle.group === 'nodes' && ele.id() === focusEle.data.id) ||
        (ele.isEdge() && focusEle.group === 'edges' && ele.source().id() === focusEle.data.source && ele.target().id() === focusEle.data.target)
      ))
    );    

    // Layout
    const layout = cy.elements().layout({
      name: 'cose',
      idealEdgeLength: (edge) => 50,
      nodeOverlap: 20,
      animate: true,
      nodeRepulsion: (node) => 4500000, 
      edgeElasticity: (edge) => 100, 
      nestingFactor: 1.2, 
      gravity: 1, 
      numIter: 1000, 
    });

    // On layout stop, fit and center focus elements
    layout.on('layoutstop', () => {
      cy.fit(focusElements);
      cy.center(focusElements);
    });

    layout.run()


  }, [elements, newData]);

  return <div id="cy" className={isChatVisible ? "w-1/2 h-screen float-left fixed border" : "w-full h-screen float-left fixed border"} />;
};

export default CytoscapeComponent;
