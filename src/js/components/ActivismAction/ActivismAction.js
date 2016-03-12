//import './ActivismAction.scss';

import React, { Component, PropTypes } from 'react';
import { mapValues } from 'lodash';


export default class ActivismAction extends Component {

  static propTypes = {
    summary: PropTypes.string,
    links: PropTypes.array.isRequired
  };


  renderLinks() {

    return this.props.links.map((actionLink) =>
      (
        <a className="activism-action-link" href={actionLink.Url}>
          {actionLink.Title}
        </a>
      )
    );
  }


  renderSummary() {

    return this.props.summary ? <p class="activism-action-summary">{this.props.summary}</p> : null;
  }


  render () {

    return (
      <li class="activism-action">
        {this.renderSummary()}
        <ul className="activism-action-links">
          {this.renderLinks()}
        </ul>
      </li>
    );
  }
}