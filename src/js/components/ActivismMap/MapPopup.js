function GetMapPopupHtml(geo, stateData) {

  //get data for the hovered state
  const data = stateData[geo.id];
  //delegate info html
  let htmlDelegatesWon = null;
  if (data.delegateTotal && !data.delegatesWon) {
    htmlDelegatesWon = `<div class="delegate-info">Total Delegates up for Grabs: <span class="delegate-count-total">${data.delegateTotal}</span></div>`
  }
  else if (data.delegateTotal) {
    const delegatePercentageWon = Math.ceil(data.delegatesWon / data.delegateTotal * 100);
    htmlDelegatesWon = `<div class="delegate-info">Delegates won: <span class="delegate-count-bernie">${data.delegatesWon || 0}</span> / <span class="delegate-count-total">${data.delegateTotal}</span> (<span class="delegate-percentagewon">${delegatePercentageWon}%</span>)</div>`
  }
  //actions html
  const htmlActions = data.ActionData ? getMapPopupActionData(data.ActionData) : null;
  //primary date html
  let htmlPrimaryDateHtml = null;
  if (data.PrimaryDate) {
    const monthName = data.PrimaryDate.toLocaleString('en-us', {month: 'long'});
    const day = data.PrimaryDate.getDate();
    htmlPrimaryDateHtml = `<div class="primary-date">${monthName} ${day}</div>`;
  }
  //compile all html
  return `<div class="activism-map-popup">
            <h3 class="state-name">${data.Name}</h3>
            ${htmlPrimaryDateHtml}
            ${htmlDelegatesWon}
          </div>`;
}

export default GetMapPopupHtml;
