// Configuration object
const configuration = {
  defaultOptions: {
    density: 1,
    showNbResults: 10,
    pagination: 1,
    sorting: {
      field: 'age',
      asc: true
    },
    primaryKey: '_id',
    tableStyle: 'width: 100%; margin-bottom: 5px; margin-top: 5px; border-spacing: 5px;'
  },
  allowedOptions: {
    density: [{ label: 'L', value: 1 }, { label: 'M', value: 0.5 }, { label: 'S', value: 0.25 }],
    showNbResults: [10, 20, 50, 100, 500],
    columnsOrder: [{
      field: '_id',
      type: 'number'
    }, {
      field: 'lastName',
      type: 'string'
    }, {
      field: 'firstName',
      type: 'string'
    }, {
      field: 'age',
      type: 'number'
    }, {
      field: 'hair',
      type: 'string'
    }, {
      field: 'city',
      type: 'string'
    }, {
      field: 'status',
      type: 'string'
    }]
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
  function renderShow(show, list, nbRows) {
    return `Display ${selectOptions('bdt-show-select', show, list)}<span> rows out of ${nbRows}</span>`;
  }

  function selectOptions(selectId, selectedOption, listOfOptions) {
    function optionSelected(current) {
      if (R.equals(selectedOption, current)) {
        return `<option selected="selected" value="${current}">${current}</option>`;
      } else {
        return `<option value="${current}">${current}</option>`;
      }
    }
    return `<select id="${selectId}">
                ${R.join('',R.map(optionSelected, listOfOptions))}
            </select>`;
  }

  function renderDensity(density, list) {
    function allDensityButtons(allOptions) {
      return R.map(cur => `<button type='button' data-density='${R.prop('value', cur)}'>${R.prop('label', cur)}</button>`, allOptions);
    }

    return `Row density: ${R.join('',allDensityButtons(list))}`;
  }

  function renderPagination(nbRowsToShow, currentPage, nbRows) {
    const nbPages = R.range(1, R.inc(R.divide(nbRows, nbRowsToShow)));

    return `Show page ${selectOptions('bdt-pagination-select', currentPage, nbPages)}<span> out of ${R.last(nbPages)}</span>`
  }

  function cleanHTML(element) {
    document.getElementById(element).innerHTML = '';
    return element;
  }

  function renderTableHead(listOfColumns) {
    return `<tr>${R.join('', R.map(cur => `<th>${cur}</th>`, listOfColumns))}</tr>`
  }

  function renderTableBody(primKey, nbRowsToRender, page, howToSort, orderForColumns, listOfRows) {
    function wayToSort(sorting, data) {
      if (R.equals(R.prop('asc', sorting), true)) {
        return R.sort(
          R.ascend(R.prop(R.prop('field', sorting))),
          data
        );
      } else {
        return R.sort(
          R.descend(R.prop(R.prop('field', sorting))),
          data
        );
      }
    }

    function renderAllRows(keyForRow, columnsOrder, rows) {
      function renderFullRow(row) {

        function renderColumnsInOrder(element) {
          if (R.equals(R.prop('type', element), 'number')) {
            return `<td style='text-align:right;'>${R.prop(R.prop('field', element), row)}</td>`;
          } else {
            return `<td>${R.prop(R.prop('field', element), row)}</td>`;
          }
        }

        return `<tr data-primary-key='${R.prop(keyForRow, row)}'>
                ${R.join('', R.map(renderColumnsInOrder, columnsOrder))}
              </tr>`;
      }

      return R.map(renderFullRow, rows);
    }


    const whereToStart = R.multiply(nbRowsToRender, R.dec(page));
    const whereToEnd = R.add(whereToStart, nbRowsToRender);
    const rowsToRender = R.slice(whereToStart, whereToEnd, wayToSort(howToSort, listOfRows));

    return R.join('', renderAllRows(primKey, orderForColumns, rowsToRender));
  }

  function changeShowNbRow(element) {
    $('body').on('change', 'select.show', function(event) {
      const valueLens = R.lensPath(['target', 'value']);
      const newNbRowsToDisplay = Number(R.view(valueLens, event));

      renderDataTable(newNbRowsToDisplay, defaultPagination, getSortingState(), defaultData);
    });
  }

  function registerAllEvents(domElem) {
    changeShowNbRow()
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
            <table style="${R.path(['defaultOptions', 'tableStyle'], config)}">
              <thead>
                ${renderTableHead(R.keys(R.head(rows)))}
              </thead>
              <tbody>
                ${renderTableBody(
                  R.path(['defaultOptions', 'primaryKey'], config),
                  R.path(['defaultOptions', 'showNbResults'], config),
                  R.path(['defaultOptions', 'pagination'], config),
                  R.path(['defaultOptions', 'sorting'], config),
                  R.path(['allowedOptions', 'columnsOrder'], config),
                  rows
                )}
              </tbody>
            </table>`;
  }

  cleanHTML(domElem);
  document.getElementById(domElem).innerHTML = frame();
  registerAllEvents(domElem);

  return document.getElementById(domElem);
}
