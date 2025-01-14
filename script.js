const dataUrl =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

d3.json(dataUrl)
  .then((data) => {
    console.log(data);

    const gdpData = data.data;

    console.log(gdpData.slice(0, 5));

    createBarChart(gdpData);
  })
  .catch((error) => {
    console.error("error loading data", error);
  });

function createBarChart(data) {
  const width = 800;
  const height = 400;
  const padding = 50;

  const svg = d3
    .select(".visiHolder")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const yearsDate = data.map((item) => new Date(item[0]));
  const xMax = new Date(d3.max(yearsDate));
  xMax.setMonth(xMax.getMonth() + 3);
  const xScale = d3
    .scaleTime()
    .domain([d3.min(yearsDate), xMax])
    .range([padding, width - padding]);

  const xAxis = d3.axisBottom().scale(xScale);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d[1])])
    .range([height - padding, padding]);

  const barWidth =
    (xScale(new Date(yearsDate[1])) - xScale(new Date(yearsDate[0]))) * 0.8;

  const tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "1px solid gray")
    .style("border-radius", "4px")
    .style("padding", "5px")
    .style("font-size", "12px")
    .style("box-shadow", "0px 2px 5px rgba(0, 0, 0, 0.3)")
    .style("display", "none")
    .style("pointer-events", "none");

  const tooltipselector = d3.select("#tooltip");

  svg
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1])
    .attr("x", (d, i) => xScale(yearsDate[i]))
    .attr("y", (d) => yScale(d[1]))
    .attr("width", barWidth)
    .attr("height", (d) => height - padding - yScale(d[1]))
    .attr("fill", "steelblue")
    .on("mouseover", function (e, d) {
      tooltipselector
        .attr("data-date", d[0])
        .style("display", "block")
        .text(`${d[0].split("-")[0]} - ${d[1]}`);
    })
    .on("mousemove", function (e) {
      tooltipselector
        .style("left", `${e.pageX + 10}px`)
        .style("top", `${e.pageY + 10}px`);
    })
    .on("mouseout", function () {
      tooltipselector.style("display", "none");
    });

  const yAxis = d3.axisLeft(yScale);

  console.log(xAxis);
  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height - padding})`)
    .call(xAxis)
    .attr("class", "tick");

  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, 0)`)
    .call(yAxis)
    .attr("class", "tick");
}
