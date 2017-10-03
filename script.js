// Configuration object
const configuration = {
  defaultOptions: {
    density: 1,
    showNbResults: 10,
    pagination: 1,
    sorting: {
      field: 'age',
      asc: true
    }
  },
  allowedOptions: {
    density: [{ label: 'L', value: 1 }, { label: 'M', value: 0.5 }, { label: 'S', value: 0.25 }],
    showNbResults: [10, 20, 50, 100, 500]
  }
};

renderDataTable(
  configuration,
  'better-data-table',
  generateDefaultData(200)
);

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

function renderDataTable(config, domElem, rows) {
  console.log(config, domElem, rows);
  /*
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


    function renderHeader(element, sorting, headers) {
      function sortedColumns(way, cur) {
        function template(text) {
          return `<th data-field="${cur}">${cur} <button id="chevronToSort" type="button">${text}</button></th>`;
        }

        if (R.equals(way, true)) {
          return template('V');
        } else {
          return template('&#581');
        }
      }

      function columnSorted(column) {
        if (R.equals(R.prop('field', sorting), column)) {
          return sortedColumns(R.prop('asc', sorting), column);
        } else {
          return `<th data-field='${column}'>${column}</th>`;
        }
      }

      const el = document.getElementById(element);
      const headersToRemove = el.querySelectorAll('table > thead > th');
      R.forEach(cur => el.removeChild(cur), headersToRemove);

      setSortingState(sorting);

      $('table > thead').append(
        `</tr>${R.map(columnSorted, headers)}</tr>`
      );
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


    function getDensityState(element) {
      const el = document.getElementById(element);
      return Number(el.querySelector('.controls-density').getAttribute('data-density-state'));
    }


    function registerEventListeners(element) {
      const el = document.getElementById(element);
      //////////////////////////////////////////
      // Events for table heading and sorting //
      ////////////////////////////////////////
      el.querySelector('#chevronToSort').addEventListener('click', invertSort);
      R.forEach(cur => cur.addEventListener('click', clickSort), el.querySelectorAll('th'));

      ////////////////////////////////
      // Events for the pagination //
      //////////////////////////////
      R.forEach(cur => cur.addEventListener('change', changePagination), el.querySelectorAll('select.pagination'));

      ////////////////////////////////
      // Events for showing x rows //
      //////////////////////////////
      R.forEach(cur => cur.addEventListener('change', changeShow), el.querySelectorAll('select.show'));

      /////////////////////////////
      // Events for the density //
      ///////////////////////////
      R.forEach(cur => cur.addEventListener('click', changeDensity), el.querySelectorAll('.density'));

      return el;
    }

    function invertSort(event) {
      const currentSortingState = getSortingState();
      const inverse = !R.equals(R.prop('asc', currentSortingState), true);
      const newSort = R.assoc('asc', inverse, currentSortingState);

      setSortingState(newSort);

      renderDataTable(getShowState(), defaultPagination, newSort, defaultData);

      return event.stopPropagation();
    }

    function clickSort(event) {
      const fieldLens = R.lensPath(['target', 'dataset', 'field']);
      const newFieldToSort = R.view(fieldLens, event);
      const currentSortingState = getSortingState();
      console.log('event th', newFieldToSort, currentSortingState);

      if (R.equals(newFieldToSort, R.prop('field', currentSortingState))) {
        return renderDataTable(getShowState(), defaultPagination, R.assoc('asc', !R.prop('asc', currentSortingState), currentSortingState), defaultData);
      } else {
        const transformations = {
          field: R.always(newFieldToSort),
          asc: R.T
        };
        return renderDataTable(getShowState(), defaultPagination, R.evolve(transformations, currentSortingState), defaultData);
      }
    }

    function changePagination(event) {
      const valueLens = R.lensPath(['target', 'value']);
      const newPageToDisplay = Number(R.view(valueLens, event));

      return renderDataTable(getShowState(), newPageToDisplay, getSortingState(), defaultData);
    }

    function changeShow(event) {
      const valueLens = R.lensPath(['target', 'value']);
      const newNbRowsToDisplay = Number(R.view(valueLens, event));

      const newConfig = R.assocPath(['defaultOptions', 'pagination'], newNbRowsToDisplay, config);

      return renderDataTable(newConfig, domElem, rows);
    }

    function removeEventListeners(element) {
      const el = document.getElementById(element);

      if (!R.isNil(el.querySelector('#chevronToSort'))) {
        el.querySelector('#chevronToSort').removeEventListener('click', invertSort);
      }
      if (!R.isNil(el.querySelector('th'))) {
        el.querySelector('th').removeEventListener('click', clickSort);
      }
      if (!R.isNil(el.querySelector('select.pagination'))) {
        el.querySelector('select.pagination').removeEventListener('change', changePagination);
      }
      if (!R.isNil(el.querySelector('select.show'))) {
        el.querySelector('select.show').removeEventListener('change', changeShow);
      }

      return el;
    }

    function setDensity(density) {
      $('td, th').css('padding-top', `${density}rem`);
      $('td, th').css('padding-bottom', `${density}rem`);
      return setDensityState(density);
    }

    const headers = R.keys(R.head(rows));
    const currentDensityState = getDensityState(domElem) || R.path(['defaultOptions', 'density'], config);

    removeEventListeners(domElem);

    renderHeader(
      domElem,
      R.path(['defaultOptions', 'sorting'], config),
      headers
    );

    renderRows(
    R.path(['defaultOptions', 'showNbResults'], config),
    R.path(['defaultOptions', 'pagination'], config),
    R.path(['defaultOptions', 'sorting'], config),
    rows
  );

    setDensity(currentDensityState);

    registerEventListeners(domElem);*/
  function renderShow(show, list, nbRows) {
    function selectOptions() {
      function optionSelected(current) {
        if (R.equals(show, current)) {
          return `<option selected="selected" value="${current}">${current}</option>`;
        } else {
          return `<option value="${current}">${current}</option>`;
        }
      }
      return `<select id="bdt-show-select">
                ${R.join('',R.map(optionSelected, list))}
              </select>`;
    }
    return `Display ${selectOptions()}<span> rows out of ${nbRows}</span>`;
  }

  function renderDensity(density, list) {

    function allDensityButtons(allOptions) {
      return R.map(cur => `<button type='button' data-density='${R.prop('value', cur)}'>${R.prop('label', cur)}</button>`, allOptions);
    }
    return `Row density: ${R.join('',allDensityButtons(list))}`;
  }

  function renderPagination(nbRowsToShow, currentPage, nbRows) {
    function selectOptions(listOfPage) {
      return R.map()
    }

    const nbPages = R.range(1, R.inc(R.divide(nbRows, nbRowsToShow)));


    return `Show page <span> out of ${nbPages}</span>`

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

  function frame() {
    return `<div id="bdt-controls" style="display: flex; flex-direction: row; flex-wrap: wrap; justify-content: space-between; align-items: center;">
              <div id="bdt-controls-show">
                ${renderShow(
                  R.path(['defaultOptions', 'showNbResults'], config),
                  R.path(['allowedOptions', 'showNbResults'], config),
                  R.length(rows)
                )}
              </div>
              <div id="bdt-controls-density">
                ${renderDensity(
                  R.path(['defaultOptions', 'density'], config),
                  R.path(['allowedOptions', 'density'], config)
                )}
              </div>
              <div id="bdt-controls-pagination">
                ${renderPagination(
                  R.path(['defaultOptions', 'showNbResults'], config),
                  R.path(['defaultOptions', 'pagination'], config),
                  R.length(rows)
                )}
              </div>
            </div>
            <table style="width: 100%; margin-bottom: 5px; margin-top: 5px; border-spacing: 0px;">
              <thead>
              </thead>
              <tbody>
              </tbody>
            </table>`;
  }

  function cleanHTML(element) {
    document.getElementById(element).innerHTML = '';
    return element;
  }

  cleanHTML(domElem);
  document.getElementById(domElem).innerHTML = frame();
}
