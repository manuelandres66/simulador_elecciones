let pie = am4core.create("pieChart", am4charts.PieChart);
let partidoVotos = parseInt(document.querySelector('#partidoVotos').innerHTML);
let totalesVotos = parseInt(document.querySelector('#totalesVotos').innerHTML);

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