import React, { useEffect } from 'react';
import cytoscape from 'cytoscape';
import _ from 'lodash';

const CytoscapeComponent = ({ elements, isChatVisible, newData }) => {
  useEffect(() => {

    const filteredElements = elements.filter(
      element => !newData.some(newElement => {
        if(element.group === 'nodes' && newElement.group === 'nodes') {
          return element.data.id === newElement.data.id;
        } else if(element.group === 'edges' && newElement.group === 'edges') {
          return element.data.source === newElement.data.source &&
                 element.data.target === newElement.data.target;
        }
        return false; 
      })
    );

    console.log('Original Elements:', elements);
    console.log('New Data:', newData);
    console.log('Filtered Elements:', filteredElements);
    
    const cy = cytoscape({
      container: document.getElementById('cy'),
      elements: filteredElements,
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
            'padding': '24',
            'background-color': 'data(color)',
          } as any
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
            'text-background-padding': '2', 
          }
        }
      ],
      userZoomingEnabled: true, 
      userPanningEnabled: true,
    });

    const newElements = cy.add(newData);

    const layout = cy.elements().layout({
      name: 'cose',
      idealEdgeLength: (edge) => 100,
      nodeOverlap: 20,
      animate: true,
      nodeRepulsion: (node) => 4500000, 
      edgeElasticity: (edge) => 100, 
      nestingFactor: 1.2, 
      gravity: 1, 
      numIter: 1000, 
    });

    layout.on('layoutstop', () => {
      cy.fit(newElements);
      cy.center(newElements);
    });

    layout.run()


  }, [elements, newData]);

  return <div id="cy" className={isChatVisible ? "w-1/2 h-screen float-left fixed border" : "w-full h-screen float-left fixed border"} />;
};

export default CytoscapeComponent;
