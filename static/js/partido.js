let pie = am4core.create("pieChart", am4charts.PieChart);
const partidoVotos = parseInt(document.querySelector('#partidoVotos').innerHTML);
const totalesVotos = parseInt(document.querySelector('#totalesVotos').innerHTML);

pie.data = [{
    "categoria": document.querySelector('#nombre').innerHTML,
    "cantidad": partidoVotos,
  }, {
    "categoria": "Otros Partidos",
    "cantidad": totalesVotos - partidoVotos
}]

let pieSeries = pie.series.push(new am4charts.PieSeries());
pieSeries.dataFields.value = "cantidad";
pieSeries.dataFields.category = "categoria";
pieSeries.labels.template.disabled = true;
pie.innerRadius = am4core.percent(40);


document.querySelectorAll('.forPoints').forEach(point => point.innerHTML = point.innerHTML.replace(/\B(?=(\d{3})+(?!\d))/g, ','));


// Heat map
let map = am4core.create("mapChart", am4maps.MapChart);
map.geodata = am4geodata_colombiaHigh;
map.projection = new am4maps.projections.Mercator();
let mapSeries = map.series.push(new am4maps.MapPolygonSeries());
const color = document.querySelector('#partidoColor').innerHTML;

mapSeries.heatRules.push({
    property: "fill",
    target: mapSeries.mapPolygons.template,
    min: am4core.color(color).brighten(1),
    max: am4core.color(color).brighten(-0.3),
});
mapSeries.useGeodata = true;


fetch('/party/votos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-CSRFToken' : document.querySelector('[name=csrfmiddlewaretoken]').value},
    body : JSON.stringify({'code' : document.querySelector('#partidoCode').innerHTML})
})
.then(for_response => for_response.json())
.then(response => {
    console.log(response);
    if (response.error !== undefined) {
        console.error(response.error);
        alert(response.error);
    }
    
    let data = [];
    Object.keys(response).forEach(iso => {
        const votos = response[iso].votos;
        const nombre = response[iso].nombre;
        const fill = am4core.color(response[iso].fill);
        const porcentaje = response[iso].porcentaje;
        data.push({'id' : iso, 'value' : porcentaje, 'name' : nombre, 'fill' : fill, 'votos' : votos});
    });
    
    mapSeries.data = data;
    
    // Set heatmap values for each state

    let polygonTemplate = mapSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}: {votos} ({value}%)";
    polygonTemplate.nonScalingStroke = true;
    polygonTemplate.strokeWidth = 0.5;
    
    let hs = polygonTemplate.states.create("hover");
    hs.properties.fill = am4core.color(color);

    polygonTemplate.events.on("hit", function(ev) {
        ev.target.series.chart.zoomToMapObject(ev.target);
    });



    //Segundo Mapa

    let mapSecond = am4core.create("mapSecond", am4maps.MapChart);
    mapSecond.geodata = am4geodata_colombiaHigh;
    mapSecond.projection = new am4maps.projections.Mercator();
    let secondSeries = mapSecond.series.push(new am4maps.MapPolygonSeries());
    secondSeries.useGeodata = true;
    secondSeries.data = data;

    let secondTemplate = secondSeries.mapPolygons.template;
    secondTemplate.tooltipText = "{name}: {votos} ({value}%)";
    secondTemplate.propertyFields.fill = "fill";

    secondTemplate.events.on("hit", function(ev) {
        ev.target.series.chart.zoomToMapObject(ev.target);
    });

});



