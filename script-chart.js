function pieChartForTable(element, field, data) {
	const svg = d3.select(element);
	const width = +svg.attr("width");
	const height = +svg.attr("height");
	const radius = Math.min(width, height) / 2;
	const g = svg.append("g")
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
	const color = d3.scaleOrdinal(d3.schemeCategory20b);

	const formattedData = R.reduce((prev, cur) => {
		const indexFieldInPrev = R.findIndex(R.propEq(field, R.prop(field, cur)), prev);
		if (R.gte(indexFieldInPrev, 0)) {
			const transformations = {
				count: R.inc
			};
			transformations[field] = R.always(R.prop(field, cur));
			return R.adjust(R.evolve(transformations), indexFieldInPrev, prev);
		} else {
			const newEntry = {
				count: 1
			};
			newEntry[field] = R.prop(field, cur);
			return R.append(newEntry, prev);
		}
	}, [], data);

	svg.append("svg:text")
		.attr("class", "title")
		.attr("x", -30)
		.attr("y", 20)
		.text(`Distribution of ${field}`);

	const pie = d3.pie()
		.value((d) => {
			return d.count;
		})
		.sortValues((a, b) => {
			return b - a;
		});

	const path = d3.arc()
		.outerRadius(radius - 10)
		.innerRadius(0);

	const label = d3.arc()
		.outerRadius(radius + 6)
		.innerRadius(radius + 6);


	const arc = g.selectAll(".arc")
		.data(pie(formattedData))
		.enter().append("g")
		.attr("class", "arc");

	arc.append("path")
		.attr("d", path)
		.attr("fill", (d) => {
			return color(d.data[field]);
		});

	arc.append("text")
		.attr("transform", (d) => {
			return "translate(" + label.centroid(d) + ")";
		})
		.attr("dy", "0.35em")
		.text((d) => {
			return d.data[field];
		});

	// add legend   
	const legend = svg.append("g")
		.attr("class", "legend")
		//.attr("x", w - 65)
		//.attr("y", 50)
		.attr("height", 100)
		.attr("width", 100)
		.attr('transform', 'translate(30, 10)')



	legend.selectAll('rect')
		.data(formattedData)
		.enter()
		.append("rect")
		.attr("x", width - 65)
		.attr("y", (d, i) => {
			return i * 20;
		})
		.attr("width", 10)
		.attr("height", 10)
		.style("fill", (d) => {
			return color(d[field]);
		})

	legend.selectAll('text')
		.data(formattedData)
		.enter()
		.append("text")
		.attr("x", width - 52)
		.attr("y", (d, i) => {
			return i * 20 + 9;
		})
		.text((d) => {
			return d[field];
		});
}

pieChartForTable(".pie-chart", "firstName", defaultData);
