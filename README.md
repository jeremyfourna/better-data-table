# better-data-table

## Installation

`npm i better-data-table`

## Usage

```js
const { renderDataTable } = require('better-data-table');

// renderDataTable :: object -> string -> [object] -> Node
renderDataTable(configForTheTable, 'idForDomElement', data);
```

### Configuration object

```
{
  defaultOptions: {
    density: number,
    showNbResults: number,
    pagination: number,
    sorting: {
      field: string,
      asc: boolean
    },
    primaryKey: string,
    tableStyle: string
  },
  allowedOptions: {
    density: [{
    	label: string,
    	value: number
	}],
    showNbResults: [number],
    columnsOrder: [{
      field: string,
      type: string
    }]
  }
}
```

## Inspiration

* https://uxdesign.cc/design-better-data-tables-4ecc99d23356

## Done

* Sortable Columns
* Display Density
* Pagination
* Row Style

## To do

* Add Columns
* Basic Filtering
* Customizable Columns
* Expandable Rows
* Filter Columns
* Hover Actions
* Inline Editing
* Modal
* Multi-Modal
* Quick View
* Row to Details
* Searchable Columns
* Visual Table Summary

## Later version

* Fixed Header
* Horizontal scroll
* Resizable columns