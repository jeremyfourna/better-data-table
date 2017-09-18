const defaultData = generateDefaultData(200);
const defaultSort = {
  field: "age",
  asc: true
};
const defaultShow = 10;
const defaultPagination = 1;

// generateDefaultData :: number -> [object]
function generateDefaultData(howMany) {
  const list = R.range(0, howMany);
  return R.map((cur) => {
    if (R.gt(Math.random(), 0.49)) {
      return {
        _id: cur,
        lastName: "Doe",
        firstName: "John",
        age: Math.ceil(Math.random() * 20),
        hair: "Brown",
        city: "Berlin",
        status: "single"
      };
    } else {
      return {
        _id: cur,
        lastName: "Simpson",
        firstName: "Bart",
        age: Math.ceil(Math.random() * 15),
        hair: "Yellow",
        city: "Springfield",
        status: "single"
      };
    }
  }, list);
}



function renderRows(show, currentPage, sorting, rows) {
  function wayToSort(sorting, rows) {
    if (R.equals(R.prop('asc', sorting), true)) {
      return R.sort(R.ascend(R.prop(R.prop('field', sorting))), rows);
    } else {
      return R.sort(R.descend(R.prop(R.prop('field', sorting))), rows);
    }
  }

  $('table tbody > tr').remove();

  const whereToStart = R.multiply(show, R.dec(currentPage));
  const whereToEnd = R.add(whereToStart, show);
  const rowsToRender = R.slice(whereToStart, whereToEnd, wayToSort(sorting, rows));

  $('table > tbody').append(R.map((cur) => {
    const rowValues = R.values(cur);
    return `<tr>
					${R.map((cur) => {
						return `<td>${cur}</td>`;
					}, rowValues)}
				</tr>`;
  }, rowsToRender));
}


function renderHeader(sorting, headers) {
  function sortedColumns(way, cur) {
    if (R.equals(way, true)) {
      return `<th data-field="${cur}">${cur} <button id="chevronToSort" type="button">V</button></th>`;
    } else {
      return `<th data-field="${cur}">${cur} <button id="chevronToSort" type="button">&#581;</button></th>`;
    }
  }

  $('table > thead > th').remove();

  setSortingState(sorting);

  $('table > thead').append(
    `</tr>${R.map((cur) => {
			if (R.equals(R.prop('field', sorting), cur)) {
				return sortedColumns(R.prop('asc', sorting), cur);
			} else {
				return ` < th data - field = "${cur}" > $ { cur } < /th>`;
  }
}, headers)
} < /tr>`);
}


function setSortingState(sorting) {
  $('table > thead').attr('data-sorted-column', R.prop('field', sorting));
  $('table > thead').attr('data-sorted-way', R.prop('asc', sorting));

  return sorting;
}


function getSortingState() {
  const asc = $('table > thead').attr('data-sorted-way') === "true" ? true : false;
  return {
    asc,
    field: $('table > thead').attr('data-sorted-column')
  };
}


function getShowState() {
  return Number($('.show').val());
}

function setDensityState(densityState) {
  $('.controls-density').attr('data-density-state', densityState);

  return densityState;
}


function getDensityState() {
  return Number($('.controls-density').attr('data-density-state'));
}


function renderShow(show, list, nbRows) {
  $('.show > option').remove();
  $('.controls-show > .nbRows').remove();

  $('.show').append(
    R.map((cur) => {
      if (R.equals(show, cur)) {
        return `<option selected="selected" value="${cur}">${cur}</option>`;
      } else {
        return `<option value="${cur}">${cur}</option>`;
      }
    }, list));

  $('.controls-show').append(`<span class="nbRows"> rows out of ${nbRows}. </span>`);
}


function renderPagination(show, current, rows) {
  $('.pagination > option').remove();
  $('.controls-pagination > .nbPages').remove();

  const nbRows = R.length(rows);
  const nbPages = R.range(1, R.inc(R.divide(nbRows, show)));

  $('.pagination').append(
    R.map((cur) => {
      if (R.equals(current, cur)) {
        return `<option selected="selected" value="${cur}">${cur}</option>`;
      } else {
        return `<option value="${cur}">${cur}</option>`;
      }
    }, nbPages));

  $('.controls-pagination').append(`<span class="nbPages"> of ${R.last(nbPages)}</span>`);
}


function registerEventListeners() {
  //////////////////////////////////////////
  // Events for table heading and sorting //
  ////////////////////////////////////////
  $('body').on('click', '#chevronToSort', function(event) {
    const currentSortingState = getSortingState();
    const inverse = !R.equals(R.prop('asc', currentSortingState), true);
    const newSort = R.assoc('asc', inverse, currentSortingState);

    setSortingState(newSort);

    renderDataTable(getShowState(), defaultPagination, newSort, defaultData);

    event.stopPropagation();
  });

  $('body').on('click', 'th', function(event) {
    let newSort;
    const fieldLens = R.lensPath(['target', 'dataset', 'field']);
    const newFieldToSort = R.view(fieldLens, event);
    const currentSortingState = getSortingState();
    console.log('event th', newFieldToSort, currentSortingState);

    if (R.equals(newFieldToSort, R.prop('field', currentSortingState))) {
      newSort = R.assoc('asc', !R.prop('asc', currentSortingState), currentSortingState);
    } else {
      const transformations = {
        field: R.always(newFieldToSort),
        asc: R.T
      };
      newSort = R.evolve(transformations, currentSortingState);
    }
    console.log(newSort);
    renderDataTable(getShowState(), defaultPagination, newSort, defaultData);
  });

  ////////////////////////////////
  // Events for the pagination //
  //////////////////////////////
  $('body').on('change', 'select.pagination', function(event) {
    const valueLens = R.lensPath(['target', 'value']);
    const newPageToDisplay = Number(R.view(valueLens, event));

    renderDataTable(getShowState(), newPageToDisplay, getSortingState(), defaultData);
  });

  ////////////////////////////////
  // Events for showing x rows //
  //////////////////////////////
  $('body').on('change', 'select.show', function(event) {
    const valueLens = R.lensPath(['target', 'value']);
    const newNbRowsToDisplay = Number(R.view(valueLens, event));

    renderDataTable(newNbRowsToDisplay, defaultPagination, getSortingState(), defaultData);
  });

  /////////////////////////////
  // Events for the density //
  ///////////////////////////
  $('body').on('click', '.density', function(event) {
    const densityLens = R.lensPath(['target', 'dataset', 'density']);
    const classLens = R.lensPath(['target', 'classList']);
    const newDensity = Number(R.view(densityLens, event));
    const buttonClassToDisable = R.join('', R.map((cur) => {
      return `.${cur}`;
    }, R.view(classLens, event)));

    $('.density').attr('disabled', false);
    $(buttonClassToDisable).attr('disabled', true);
    $('td, th').css('padding-top', `${newDensity}rem`);
    $('td, th').css('padding-bottom', `${newDensity}rem`);

    setDensity(newDensity);
  });

  ///////////////////////////////////
  // Events for the editing a row //
  /////////////////////////////////
  $('body').on('dblclick', 'tbody > tr.edit-mode', function(event) {
    const childrenLens = R.lensPath(['currentTarget', 'children']);
    const trChildren = R.view(childrenLens, event);
    const inputLens = R.lensPath(['firstElementChild', 'value']);
    const newTD = R.map((cur) => {
      const inputValue = R.view(inputLens, cur);
      return `<td>${inputValue}</td>`;
    }, trChildren);
    $(R.prop('currentTarget', event)).removeClass('edit-mode');
    $(R.prop('currentTarget', event)).find('td').remove();
    R.map((cur) => {
      $(R.prop('currentTarget', event)).append(cur);
    }, newTD);
  });
  $('body').on('click', 'tbody > tr:not(.edit-mode)', function(event) {
    const childrenLens = R.lensPath(['currentTarget', 'children']);
    const trChildren = R.view(childrenLens, event);
    const newTR = R.map((cur) => {
      return `<td><input type="text" value="${R.prop('innerHTML', cur)}"></td>`;
    }, trChildren);
    $(R.prop('currentTarget', event)).addClass('edit-mode');
    $(R.prop('currentTarget', event)).find('td').remove();
    R.map((cur) => {
      $(R.prop('currentTarget', event)).append(cur);
    }, newTR);
  });
}

function removeEventListeners() {
  $("body").off('click', 'th');
  $("body").off('click', '#chevronToSort');
  $("body").off('change', 'select.pagination');
  $("body").off('change', 'select.show');
  $("body").off('click', 'tbody > tr:not(.edit-mode)');
  $("body").off('dblclick', 'tbody > tr.edit-mode');
}

function renderDataTable(config, domElem, rows) {
  const headers = R.keys(R.head(rows));
  const currentDensityState = getDensityState() || R.path(['defaultOptions', 'density'], config);

  removeEventListeners(domElem);
  registerEventListeners(domElem);

  renderHeader(sorting, headers);
  renderRows(show, currentPage, sorting, rows);
  renderShow(show, [10, 20, 50, 100, 500], R.length(rows));
  renderPagination(show, currentPage, rows);
  setDensity(currentDensityState);
}

function setDensity(density) {
  $('td, th').css('padding-top', `${density}rem`);
  $('td, th').css('padding-bottom', `${density}rem`);
  setDensityState(density);
}


// Configuration object
const configuration = {
  defaultOptions: {
    density: "L",
    showNbResults: 10,
    pagination: 1
  }
  allowedOptions: {
    density: [{ label: "L", value: 1 }, { label: "M", value: 0.5 }, { label: "S", value: 0.25 }],
    showNbResults: [10, 20, 50, 100, 500]
  }
};

renderDataTable({ defaultShow, defaultPagination, defaultSort }, 'better-data-table', defaultData);
