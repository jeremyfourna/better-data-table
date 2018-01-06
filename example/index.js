const R = require('ramda');
const { renderDataTable } = require('../index');

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


renderDataTable(
  configuration,
  'better-data-table',
  generateDefaultData(200)
);
