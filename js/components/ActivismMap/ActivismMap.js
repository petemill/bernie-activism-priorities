import './ActivismMap.scss'

import React from 'react';
import Datamap from 'datamaps';
import $ from 'jquery';
import AddDays from './addDays';
import GetMapPopupHtml from './MapPopup';

const dateLimitPrimaryPast = new Date();
const dateLimitPrimarySoon = AddDays(new Date(), 7);

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
    return false;
		//nextProps.chosenState != this.props.chosenState;
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
			mapStateData.fillKey = this.props.chosenState === state ? 'chosen' : mapStateData.PrimaryDate && mapStateData.PrimaryDate < dateLimitPrimaryPast ? 'primaryPassed' : mapStateData.PrimaryDate && mapStateData.PrimaryDate < dateLimitPrimarySoon ? 'primarySoon' : 'default';
			console.log('fillkey', state, mapStateData.fillKey);
			//add to map data map
			mapData[state] = mapStateData;
		}
		return mapData;
	},

	drawMap() {

    console.debug('rendering map');
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
        chosen: '#0000FF',
				primaryPast: '#A6A4A4',
				primarySoon: '#FF0000'
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

		return GetMapPopupHtml(geo, this.props.stateData);
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