let map = am4core.create("chartdiv", am4maps.MapChart);
map.geodata = am4geodata_colombiaHigh;
map.projection = new am4maps.projections.Mercator ();
let polygonSeries = map.series.push(new am4maps.MapPolygonSeries());
polygonSeries.useGeodata = true;

// Mostar Nombre Departamentos
let polygonTemplate = polygonSeries.mapPolygons.template;
polygonTemplate.tooltipText = "{name}";

//Pintar cuando hover
let hs = polygonTemplate.states.create("hover");
hs.properties.fill = am4core.color("#F00");

polygonTemplate.propertyFields.fill = "fill";

//Eventos
polygonTemplate.events.on("hit", function(ev) {
    ev.target.series.chart.zoomToMapObject(ev.target);
    let zoneCode = ev.target.dataItem.dataContext.id;
    window.location.href = '/departamento/' + zoneCode;
});


/**
 * ---------------------------------------
 * This demo was created using amCharts 5.
 *
 * For more information visit:
 * https://www.amcharts.com/
 *
 * Documentation is available at:
 * https://www.amcharts.com/docs/v5/
 * ---------------------------------------
 */

// Create root element
// https://www.amcharts.com/docs/v5/getting-started/#Root_element
var root = am5.Root.new("chartdiv");

// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([
  am5themes_Animated.new(root)
]);

// Create chart
// https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
// start and end angle must be set both for chart and series
var chart = root.container.children.push(am5percent.PieChart.new(root, {
  startAngle: 180,
  endAngle: 360,
  layout: root.verticalLayout,
  innerRadius: am5.percent(50)
}));

// Create series
// https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
// start and end angle must be set both for chart and series
// var series = chart.series.push(am5percent.PieSeries.new(root, {
//   startAngle: 180,
//   endAngle: 360,
//   valueField: "value",
//   categoryField: "category",
//   alignLabels: false
// }));

// series.states.create("hidden", {
//   startAngle: 180,
//   endAngle: 180
// });

// series.slices.template.setAll({
//   cornerRadius: 5
// });

// series.ticks.template.setAll({
//   forceHidden: true
// });

// // Set data
// // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
// series.data.setAll([
//   { value: 10, category: "One" },
//   { value: 9, category: "Two" },
//   { value: 6, category: "Three" },
//   { value: 5, category: "Four" },
//   { value: 4, category: "Five" },
//   { value: 3, category: "Six" },
//   { value: 1, category: "Seven" }
// ]);
