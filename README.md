# better-data-table

[![NPM](https://nodei.co/npm/better-data-table.png)](https://www.npmjs.com/package/better-data-table)

## Installation

`npm i better-data-table`

## Usage

```js
const { renderDataTable } = require('better-data-table');

// renderDataTable :: object -> string -> [object] -> Node
renderDataTable(configForTheTable, 'idForDomElement', data);
```

### Configuration object

```js
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

#### Property `defaultOptions`

##### density

Type: `number`

Default value for the `padding` on the `<td>` and `<th>` in `rem`.

##### showNbResults

Type: `number`

Default number of rows to display inside the table.

##### pagination

Type: `number`

Default page to display for the table.

##### sorting

```js
sorting: {
  field: string,
  asc: boolean
}
```

The `field` property must be a `string`. Default colums to sort.
The `asc` property must be a `boolean`. Default way to sort the table.

##### primaryKey

Type: `string`

Must be a property of the objects passed has data. The value of this property will be defined as `data-primary-key` on the `<tr>` element.

##### tableStyle

Type: `string`

List of all properties to style the table if you do not define them via a `css` file.
Eg: `width: 100%; margin-bottom: 5px; margin-top: 5px; border-spacing: 5px;`

#### Property `allowedOptions`

##### density

```js
density: [{
	label: string,
	value: number
}]
```

The `label` property must be a `string`. This will be the button's label allowing the user to change the table density.
The `value` property must be a `number`. This value will change the `padding` of the table if the button is clicked.

##### showNbResults

List of all the possible values to display the number of rows for the table.
Eg: `showNbResults: [10, 20, 50, 100, 500]`

##### columnsOrder

If this array is empty, no column will be rendered inside the table.

```js
columnsOrder: [{
  field: string,
  type: string
}]
```

The `field` property must be a `string`. This is a property of the objects passed as data.
The `type` property must be a `sting`. This value define if the content is left/right aligned.

The allowed values for `type` are:

* 'string'
  * Left aligned
* 'number'
  * Right aligned

## Inspiration

* https://uxdesign.cc/design-better-data-tables-4ecc99d23356

### Done

* Sortable Columns
* Display Density
* Pagination
* Row Style

### To do

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

### Later version

* Fixed Header
* Horizontal scroll
* Resizable columns