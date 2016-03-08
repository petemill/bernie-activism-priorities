import './ActivismMap.scss'

import React from 'react';
import Datamap from 'datamaps';
import $ from 'jquery';

export default React.createClass({

	displayName: 'Datamap',

	propTypes: {
    chooseStateById: React.PropTypes.func.isRequired,
		arc: React.PropTypes.array,
		arcOptions: React.PropTypes.object,
		bubbleOptions: React.PropTypes.object,
		bubbles: React.PropTypes.array,
		graticule: React.PropTypes.bool,
		labels: React.PropTypes.bool
	},

	componentDidMount() {

    this.drawMap();
    $(window).on('resize', this.handleResize);
	},

	componentWillReceiveProps() {

    //this.clear();
	},

	componentDidUpdate() {

    this.drawMap();
	},

	componentWillUnmount() {

    $(window).off('resize', this.handleResize);
    this.clear();
	},

  shouldComponentUpdate(nextProps, nextState) {

    //only re-draw map if certain things change, since map is not virtualdom, so will actually re-paint every time update is called
    console.log(nextState, this.state, nextProps, this.props);
    return nextProps.chosenState != this.props.chosenState;
  },

  componentWillUpdate() {

    $(window).off('resize', this.handleResize);
    this.clear();
  },

	clear() {

    const container = this.refs.container;

		for (const child of Array.from(container.childNodes)) {
			container.removeChild(child);
		}
	},

	drawMap() {

    console.debug('rendering map')
    //build mapdata, including selected states for ...states...
    const mapData = {};
    Object.keys(this.props.stateActions).forEach(stateId => {
      mapData[stateId] = {
        fillKey: this.props.chosenState === stateId ? 'chosen' : 'default'
      };
    });
    //create map with config
		const map = this.map = new Datamap(Object.assign({}, { ...this.props }, {
			element: this.refs.container,
      scope: 'usa',
      responsive: true,
      geographyConfig: {
        popupOnHover: true,
        highlightOnHover: true,
        popupTemplate: (geo, data) => this.getMapPopup(geo, data)
      },
      fills: {
        default: '#ABDDA4',
        chosen: '#FF0000'
      },
      data: mapData,
      done: (datamap) => {
            datamap.svg.selectAll('.datamaps-subunit').on('click', (geography) => {

                  const idChosen = geography.id;
                  this.props.chooseStateById(idChosen);
            });
        }
		}));
    //display labels
    map.labels();
    
		if (this.props.arc) {
			map.arc(this.props.arc, this.props.arcOptions);
		}

		if (this.props.bubbles) {
			map.bubbles(this.props.bubbles, this.props.bubbleOptions);
		}

		if (this.props.graticule) {
			map.graticule();
		}




	},

  getMapPopup(geo, data) {
    return `<div class="activism-map-popup">
              a popup
            </div>`
  },

  handleResize() {

    this.map.resize();
  },

	render() {

		return <div className="map-activism" ref="container"></div>;
	}

});
