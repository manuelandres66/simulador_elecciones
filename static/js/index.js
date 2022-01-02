const rep = sentence => String(sentence).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
am4core.useTheme(am4themes_animated);

var chart = am4core.create("semiCircle", am4charts.PieChart);
chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

const votosTotales = parseInt(document.querySelector("#votosTotales").innerHTML);



//VOTOS NACIONALES
fetch('/post/votos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-CSRFToken' : document.querySelector('[name=csrfmiddlewaretoken]').value},
    body : JSON.stringify({'xd' : 'xd'})
})
.then(r => r.json())
.then(data => {
    data = data.r;
    const dataKey =  Object.keys(data)
    let i = 0;
    dataKey.forEach(code => {
        const partido = document.querySelector(`#${code}`);
        partido.style.order = dataKey.length - i;
        partido.setAttribute('data-order', dataKey.length - i);

        const votosPartido = document.querySelector(`#${code} .votosPartido`);
        const porcentajePartido = document.querySelector(`#${code} .porcentajePartido`);
        const porcentaje = ((data[code] / votosTotales) * 100).toFixed(2) + '%';
        const porcentajeBar = document.querySelector(`#${code} .percent`);

        votosPartido.innerHTML = rep(data[code]) + ' votos';
        porcentajePartido.innerHTML = porcentaje;
        partido.setAttribute('data-percent', porcentaje);
        porcentajeBar.style.width = porcentaje;
        porcentajeBar.style.background = porcentajeBar.getAttribute('data-color');

        i++;
    });
    

    //ESCANOS
    fetch('/post/escanos', {
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
    
        series.hiddenState.properties.startAngle = 90;
        series.hiddenState.properties.endAngle = 90;
    
        series.slices.template.propertyFields.fill = "color";
        series.legendSettings.labelText = "{id}";
    
        //ESCAÑOS BARRAS
        data.forEach(objt => {
            const code = objt.code;
            const partido = document.querySelector(`#${code}Escanos`);
            const oldPartido = document.querySelector(`#${code}`);
            partido.style.order = oldPartido.getAttribute('data-order');

            const escanosPartido = document.querySelector(`#${code}Escanos .escanosPartido`);
            const escanosPercent = document.querySelector(`#${code}Escanos .escanosPorcentajePartido`);
            const percent = document.querySelector(`#${code}Escanos .percent`);
            const realPercent = document.querySelector(`#${code}Escanos .realPercent`);

            escanosPartido.innerHTML = objt.value + ' escaños';
            escanosPercent.innerHTML = objt.value + '%';
            percent.style.width =  objt.value + '%';
            percent.style.background = percent.getAttribute('data-color');
            realPercent.style.width = oldPartido.getAttribute('data-percent');
        });
    });    
});