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
        return `<option
                  selected="selected"
                  value="${current}"
                >${current}</option>`;
      } else {
        return `<option value="${current}">${current}</option>`;
      }
    }
    return `<select class="${selectId}">
                ${R.join('',R.map(optionSelected, listOfOptions))}
            </select>`;
  }

  function renderDensity(density, list) {
    function allDensityButtons(allOptions) {
      return R.map(cur => {
        if (R.equals(R.prop('value', cur), density)) {
          return `<button
                    type='button'
                    disabled='true'
                    data-density='${R.prop('value', cur)}'
                  >${R.prop('label', cur)}</button>`;
        } else {
          return `<button
                    type='button'
                    data-density='${R.prop('value', cur)}'
                  >${R.prop('label', cur)}</button>`;
        }
      }, allOptions);
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

  function renderTableHead(density, listOfColumns) {
    return `<thead>
              <tr>${R.join('', R.map(cur => `<th style='padding: ${density}rem;'>${R.prop('field', cur)}</th>`, listOfColumns))}</tr>
            </thead>`;
  }

  function renderTableBody(primKey, nbRowsToRender, page, howToSort, density, orderForColumns, listOfRows) {
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
            return `<td style='padding: ${density}rem; text-align:right;'>${R.prop(R.prop('field', element), row)}</td>`;
          } else {
            return `<td style='padding: ${density}rem;'>${R.prop(R.prop('field', element), row)}</td>`;
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

    return `<tbody>
              ${R.join('', renderAllRows(primKey, orderForColumns, rowsToRender))}
            </tbody>`;
  }

  function changeSelectPagination(domElem, selectClass) {
    function whatToDoOnEvent(event) {
      const valueLens = R.lensPath(['target', 'value']);
      const newValue = Number(R.view(valueLens, event));
      const newConfig = R.assocPath(['defaultOptions', 'pagination'], newValue, config);

      return renderDataTable(newConfig, domElem, rows);
    }

    const select = document.querySelector(`#${domElem} .${selectClass}`);
    select.addEventListener('change', whatToDoOnEvent, false);
  }

  function changeSelectNbRows(domElem, selectClass) {
    function whatToDoOnEvent(event) {
      const valueLens = R.lensPath(['target', 'value']);
      const newValue = Number(R.view(valueLens, event));
      const transformations = {
        defaultOptions: {
          showNbResults: R.always(newValue),
          pagination: R.always(1)
        }
      };

      const newConfig = R.evolve(transformations, config);

      return renderDataTable(newConfig, domElem, rows);
    }

    const select = document.querySelector(`#${domElem} .${selectClass}`);
    select.addEventListener('change', whatToDoOnEvent, false);
  }

  function changeDensity(domElem, selectClass, pathToChangeWithNewValue) {
    function whatToDoOnEvent(event) {
      const densityLens = R.lensPath(['target', 'dataset', 'density']);
      const newValue = Number(R.view(densityLens, event));
      const newConfig = R.assocPath(pathToChangeWithNewValue, newValue, config);

      return renderDataTable(newConfig, domElem, rows);
    }

    const buttons = document.querySelectorAll(`#${domElem} .${selectClass} button`);
    R.forEach(cur => cur.addEventListener('click', whatToDoOnEvent, false), buttons);
  }

  function changeSort(domElem) {
    function whatToDoOnEvent(event) {
      const textLens = R.lensPath(['target', 'textContent']);
      const newValue = R.view(textLens, event);

      if (R.equals(R.path(['defaultOptions', 'sorting', 'field'], config), newValue)) {
        const newConfig = R.assocPath(['defaultOptions', 'sorting', 'asc'], !R.path(['defaultOptions', 'sorting', 'asc'], config), config);
        return renderDataTable(newConfig, domElem, rows);
      } else {
        const transformations = {
          defaultOptions: {
            sorting: {
              field: R.always(newValue),
              asc: R.T
            }
          }
        };
        const newConfig = R.evolve(transformations, config);
        return renderDataTable(newConfig, domElem, rows);
      }
    }
    const headers = document.querySelectorAll(`#${domElem} table thead th`);
    R.forEach(cur => cur.addEventListener('click', whatToDoOnEvent, false), headers);
  }

  function registerAllEvents(domElem) {
    changeSelectNbRows(domElem, 'bdt-show-select');
    changeSelectPagination(domElem, 'bdt-pagination-select');
    changeDensity(domElem, 'bdt-controls-density', ['defaultOptions', 'density']);
    changeSort(domElem);
  }

  function frame() {
    return `<div
              class="bdt-controls"
              style="
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                justify-content: space-between;
                align-items: center;"
            >
              <div class="bdt-controls-show">
                ${renderShow(
                  R.path(['defaultOptions', 'showNbResults'], config),
                  R.path(['allowedOptions', 'showNbResults'], config),
                  R.length(rows)
                )}
              </div>
              <div class="bdt-controls-density">
                ${renderDensity(
                  R.path(['defaultOptions', 'density'], config),
                  R.path(['allowedOptions', 'density'], config)
                )}
              </div>
              <div class="bdt-controls-pagination">
                ${renderPagination(
                  R.path(['defaultOptions', 'showNbResults'], config),
                  R.path(['defaultOptions', 'pagination'], config),
                  R.length(rows)
                )}
              </div>
            </div>
            <table style="${R.path(['defaultOptions', 'tableStyle'], config)}">
              ${renderTableHead(
                R.path(['defaultOptions', 'density'], config),
                R.path(['allowedOptions', 'columnsOrder'], config)
              )}
              ${renderTableBody(
                R.path(['defaultOptions', 'primaryKey'], config),
                R.path(['defaultOptions', 'showNbResults'], config),
                R.path(['defaultOptions', 'pagination'], config),
                R.path(['defaultOptions', 'sorting'], config),
                R.path(['defaultOptions', 'density'], config),
                R.path(['allowedOptions', 'columnsOrder'], config),
                rows
              )}
            </table>`;
  }

  cleanHTML(domElem);
  document.getElementById(domElem).innerHTML = frame();
  registerAllEvents(domElem);

  return document.getElementById(domElem);
}
