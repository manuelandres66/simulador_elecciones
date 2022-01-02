am4core.useTheme(am4themes_animated);

var chart = am4core.create("semiCircle", am4charts.PieChart);
chart.hiddenState.properties.opacity = 0; // this creates initial fade-in


fetch('/escanos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-CSRFToken' : document.querySelector('[name=csrfmiddlewaretoken]').value},
    body : JSON.stringify({'xd' : 'xd'})
})
.then(r => r.json())
.then(data => {
    data = data.r;
    let newData = [];
    for (let i = 0; i < data.length; i++) {
        if (data[i].value > 0) {
            newData.push(data[i]);
        }
    };
    chart.data = newData;
    chart.radius = am4core.percent(80);
    chart.innerRadius = am4core.percent(50);
    chart.startAngle = 180;
    chart.endAngle = 360;  
    

    let series = chart.series.push(new am4charts.PieSeries());
    series.dataFields.value = "value";
    series.dataFields.category = "id";

    series.slices.template.cornerRadius = 4;
    series.slices.template.innerCornerRadius = 2;
    series.slices.template.draggable = true;
    series.slices.template.inert = true;

    series.hiddenState.properties.startAngle = 90;
    series.hiddenState.properties.endAngle = 90;

    chart.legend = new am4charts.Legend();
    chart.legend.valueLabels.template.textAlign = "start";

    series.slices.template.propertyFields.fill = "color";
    series.legendSettings.labelText = "{id}";
})
