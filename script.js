const defaultData = generateDefaultData(20);
const defaultSort = {
	field: "age",
	asc: true
};
const defaultShow = 10;
const defaultPagination = 1;

renderDataTable(defaultShow, defaultPagination, defaultSort, defaultData);


// generateDefaultData :: number -> [object]
function generateDefaultData(howMany) {
	const list = R.range(0, howMany);
	return R.map((cur) => {
		return {
			_id: cur,
			lastName: "Doe",
			firstName: "John",
			age: Math.ceil(Math.random() * 30),
			hair: "Brown",
			city: "Berlin",
			status: "single"
		};
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

	$('#table > tbody > tr').remove();

	const whereToStart = R.multiply(show, R.dec(currentPage));
	const whereToEnd = R.add(whereToStart, show);
	const rowsToRender = R.slice(whereToStart, whereToEnd, wayToSort(sorting, rows));


	return $('#table > tbody').append(R.map((cur) => {
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

	$('#table > thead > th').remove();
	
	setSortingState(sorting);

	return $('#table > thead').append(
		`</tr>${R.map((cur) => {
			if (R.equals(R.prop('field', sorting), cur)) {
				return sortedColumns(R.prop('asc', sorting), cur);
			} else {
				return `<th data-field="${cur}">${cur}</th>`;
			}
		}, headers)}</tr>`);
}

function setSortingState(sorting) {
	$('#table > thead').attr('data-sorted-column', R.prop('field', sorting));
	$('#table > thead').attr('data-sorted-way', R.prop('asc', sorting));

	return sorting;
}

function getSortingState() {
	const asc = $('#table > thead').attr('data-sorted-way') === "true" ? true : false;
	return {
		asc, 
		field: $('#table > thead').attr('data-sorted-column')
	};
}


function renderShow(show, list) {
	$('.show > option').remove();

	return $('.show').append(
		R.map((cur) => {
			if (R.equals(show, cur)) {
				return `<option selected="selected" value="${cur}">${cur}</option>`;
			} else {
				return `<option value="${cur}">${cur}</option>`;
			}
		}, list));
}


function renderPagination(show, current ,rows) {
	$('.pagination > option').remove();

	const nbRows = R.length(rows);
	const nbPages = R.range(1, R.inc(R.divide(nbRows, show)));
	
	return $('.pagination').append(
		R.map((cur) => {
			if (R.equals(current, cur)) {
				return `<option selected="selected" value="${cur}">${cur}</option>`;
			} else {
				return `<option value="${cur}">${cur}</option>`;
			}
		}, nbPages));
}


function registerEventListeners() {
	$('body').on('click', '#chevronToSort', function(event) {
		const currentSortingState = getSortingState();
		const inverse = R.equals(R.prop('asc', currentSortingState), true);
		const newSort = R.assoc('asc', !inverse, currentSortingState);
		setSortingState(newSort);
		renderDataTable(defaultShow, defaultPagination, newSort, defaultData);
		event.stopPropagation();
	});

	$('body').on('click', 'th', function(event) {
		let newSort;
		const fieldLens = R.lensPath(['target', 'dataset','field']);
		const newFieldToSort = R.view(fieldLens, event);
		const currentSortingState = getSortingState();

		if (R.equals(newFieldToSort, R.prop('field', currentSortingState))) {
			newSort = R.assoc('asc', !R.prop('asc', currentSortingState), newSort);
		} else {
			const transformations = {
				field: R.always(newFieldToSort),
				asc: R.T
			};
			newSort = R.evolve(transformations, currentSortingState);
		}

		renderDataTable(defaultShow, defaultPagination, newSort, defaultData);
	});
}

function removeEventListeners() {
	$("body").off('click', 'th');
	$("body").off('click', '#chevronToSort');
}

function renderDataTable(show, currentPage, sorting, rows) {
	const headers = R.keys(R.head(defaultData));

	removeEventListeners();
	registerEventListeners();

	renderHeader(sorting, headers);
	renderRows(show, currentPage, sorting, rows);
	renderShow(show, [10, 20, 50, 100, 500]);
	renderPagination(show, currentPage, defaultData);
}
