import './ActivismMap.scss'

import React from 'react';
import Datamap from 'datamaps';
import $ from 'jquery';

export default React.createClass({

	displayName: 'Datamap',

	propTypes: {
    chooseStateById: React.PropTypes.func.isRequired,
		stateData: React.PropTypes.object.isRequired,
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

	getMapDataFromState() {

		//convert state to map data (remember state should be immutable)
		const mapData = {};
		for (const state of Object.keys(this.props.stateData)) {
			//copy
			const mapStateData = { ...this.props.stateData[state] };
			//asign fillKey based on state's ...er... ...'state'.
			mapStateData.fillKey = this.props.chosenState === state ? 'chosen' : 'default';
			console.log('fillkey', state, mapStateData.fillKey);
			//add to map data map
			mapData[state] = mapStateData;
		}
		return mapData;
	},

	drawMap() {

    console.debug('rendering map')
    //build mapdata, including selected states for ...states...
		const mapData = this.getMapDataFromState();
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

  getMapPopup(geo) {

		//get data for the hovered state
		const data = this.props.stateData[geo.id];
		//delegate info html
		const htmlDelegatesWon = data.delegateTotal ?
			`<div class="delegate-info">Delegates: <span class="delegate-count-bernie">${data.delegatesWon || 0}</span> / <span class="delegate-count-total">${data.delegateTotal}</span></div>`
			: null;
		//actions html
		const htmlActions = data.ActionData ? getMapPopupActionData(data.ActionData) : null;
		//compile all html
		return `<div class="activism-map-popup">
              <h3 class="state-name">${data.Name}</h3>
							<div class="Primary Date">${data.PrimaryDate}</div>
							${htmlDelegatesWon}
            </div>`;
  },

	getMapPopupActionData(actions) {

		const summaryHtml = actionData.Summary ?
			`<div class="action-summary">${actionData.Summary}</div>`
			: null;
		const actionsHtml = `<ul class="action-list">`;

		return ``;
	},

  handleResize() {

    this.map.resize();
  },

	render() {

		return <div className="map-activism" ref="container"></div>;
	}

});
