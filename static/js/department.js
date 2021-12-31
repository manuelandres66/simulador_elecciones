const rep = sentence => sentence.replace(/\B(?=(\d{3})+(?!\d))/g, ',');


// PIE CHART
let pie = am4core.create("pieChart", am4charts.PieChart);
let usuales = parseInt(document.querySelector('#guardados').innerHTML);
let aptos = parseInt(document.querySelector('#aptos').innerHTML);

pie.data = [{
    "categoria": "Votantes",
    "cantidad": usuales,
  }, {
    "categoria": "No votantes",
    "cantidad": aptos-usuales
}]

let pieSeries = pie.series.push(new am4charts.PieSeries());
pieSeries.dataFields.value = "cantidad";
pieSeries.dataFields.category = "categoria";
pieSeries.labels.template.disabled = true;
pie.innerRadius = am4core.percent(40);



//Puntos de miles
let vUsualesMostrado = document.querySelector('#votantesUsuales');
vUsualesMostrado.innerHTML = rep(vUsualesMostrado.innerHTML) + ` (${(usuales / aptos * 100).toFixed(2)}%)`;
let votantesAptos = document.querySelector('#votantesAptos');
votantesAptos.innerHTML = rep(votantesAptos.innerHTML);
let votantesUsuales = document.querySelector('#votantesUsualesUsuales');
votantesUsuales.innerHTML = rep(votantesUsuales.innerHTML);

//Variables y constantes
let votosActuales = usuales;
const partidosRange = document.querySelectorAll('.partidoRange');
const departmentCode = document.querySelector('#departmentCode').innerHTML;
const partidosCodes = ['CDM', 'CMR', 'CON', 'LIB', 'DLU', 'ALV', 'PLO', 'DEC', 'MRA', 'JSL', 'OPC', 'SMS', 'TSC', 'FRC', 'FRT', 'SSP'];

// MAPA DEL DEPARTAMENTO
let map = am4core.create("mapChart", am4maps.MapChart);
map.geodata = am4geodata_colombiaHigh;
map.projection = new am4maps.projections.Mercator ();
map.maxZoomLevel = 1;

let mapSeries = map.series.push(new am4maps.MapPolygonSeries());
mapSeries.useGeodata = true;
mapSeries.include = [departmentCode];

let mapTemplate = mapSeries.mapPolygons.template;
mapTemplate.propertyFields.fill = "fill";
mapTemplate.tooltipText = "{nombre}: {votos}";


//Cambiando Color
const colorMap = () => {
	// Get Partido mas votado
	let maximun;
	let votesMaximun = 0;
	partidosCodes.forEach(code => {
		const ranger = document.querySelector(`#range${code}`);
		const value = parseInt(ranger.getAttribute('data-val'));
		if (value >= votesMaximun) {
			maximun = ranger;
			votesMaximun = value;
		}
	});

	mapSeries.data = [{
		"id": departmentCode,
		"fill": am4core.color(maximun.getAttribute('data-color')),
		"nombre": maximun.getAttribute('data-nombre'),
		"votos" : rep(maximun.getAttribute('data-val'))
	}];

}

colorMap();


//Cambiando todo con el input
document.querySelector('#rangeVotos').addEventListener('input', e => {
    let votosT = e.target.value;
    vUsualesMostrado.innerHTML = rep(votosT) + ` (${(parseInt(votosT) / aptos * 100).toFixed(2)}%)`;

    pie.data = [{
        "categoria": "Votantes",
        "cantidad": votosT,
      }, {
        "categoria": "No votantes",
        "cantidad": aptos-votosT
    }]

	votosT = parseInt(votosT);
	//Change absolute votes of each one
	partidosCodes.forEach(code => {
		const partyRange = document.querySelector(`#${code} .numeroVotosPartido`);
		const percentOfTotal = parseFloat(partyRange.innerHTML.slice(partyRange.innerHTML.indexOf('(') + 1,partyRange.innerHTML.indexOf(')') - 1)) / 100;
		const newQuantity = Math.floor(percentOfTotal * votosT).toString();
		partyRange.innerHTML = rep(newQuantity) + ` (${((parseInt(newQuantity) / votosT) * 100).toFixed(2)}%)`;
		document.querySelector(`#range${code}`).setAttribute('data-val', parseInt(newQuantity));
	});

	votosActuales = parseInt(votosT);
	changeOthersMax();
});

//Cambiar el maximo de todos
const changeOthersMax = () => {
	let acumulativeVotes = 0;
	let votesOfEach = [];
	partidosCodes.forEach(code => {
		const voteContainer = document.querySelector(`#${code} .numeroVotosPartido`).innerHTML;
		const indexToSlice = voteContainer.indexOf('(') - 1;
		const votesParty = parseInt(voteContainer.slice(0, indexToSlice).replaceAll(',', ''))
		acumulativeVotes += votesParty;
		votesOfEach.push({"partido" : code, "votos" : votesParty});
	});
	
	const resto = votosActuales - acumulativeVotes;
	partidosCodes.forEach(code => {
		const ranger = document.querySelector(`#range${code}`);
		const dataVal = ranger.getAttribute('data-val');
		const newMax = parseInt(dataVal) + resto;
		ranger.setAttribute('max', newMax);
		ranger.setAttribute('value', dataVal);
		ranger.value = dataVal;

		const percentMax = ((newMax / votosActuales) * 100).toFixed(2);
		ranger.style.width = percentMax > 15 ? `calc(${percentMax}% - 2vw)` : `calc(15% - 2vw)`; //Para que sea manipulable

	});

	document.querySelector('#VTB .numeroVotosPartido').innerHTML = rep(resto.toString()) + ` (${(resto / votosActuales * 100).toFixed(2)}%)`;
	colorMap();
}

//SEND TO SERVER
const toServer = async () => {
	let structure = {
		'code' : departmentCode,
		'departments' : []
	}

	let newCodes = [...partidosCodes];
	newCodes.push('VTB');
	newCodes.forEach(code => {
		const select = document.querySelector(`#${code} .numeroVotosPartido`);
		const number = parseInt(select.innerHTML.slice(0, select.innerHTML.indexOf('(') - 1).replace(',',''));
		structure['departments'].push({'code' : code, 'votes' : number});
	});

	const saving = document.querySelector('#saving');
	saving.style.display = 'block';
	setTimeout(() => saving.style.display = 'none', 4000);

	const for_response = await fetch('/deparamento/save', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', 'X-CSRFToken' : document.querySelector('[name=csrfmiddlewaretoken]').value},
		body : JSON.stringify(structure)
	});
	
	const response = await for_response.json();
	console.log(response);
	if (response.error !== undefined) {
		const error = document.querySelector('#error');
		saving.style.display = 'none'
		error.style.display = 'block';
		setTimeout(() => error.style.display = 'none', 4000);
	} else {
		const saved = document.querySelector('#saved');
		saving.style.display = 'none'
		saved.style.display = 'block';
		setTimeout(() => saved.style.display = 'none', 4000);
	}

}

document.querySelector('#rangeVotos').addEventListener('change', async () => await toServer());


partidosRange.forEach(partido => {
    partido.setAttribute('max', votosActuales);
    const selector = partido.getAttribute('id').replace('range', '');
	const nVotosPartido = document.querySelector(`#${selector} .numeroVotosPartido`);
	const nVotosInt = parseInt(nVotosPartido.innerHTML)
	const nVotosPercent = ((nVotosInt/ votosActuales) * 100).toFixed(2);
	partido.value = nVotosPartido.innerHTML;
    nVotosPartido.innerHTML = rep(nVotosPartido.innerHTML) + ` (${nVotosPercent}%)`;
	changeOthersMax(votosActuales);

    partido.addEventListener('input', e => {
        const codePartido = e.target.getAttribute('id').replace('range', '');
        const textToChange = document.querySelector(`#${codePartido} .numeroVotosPartido`);
        const percent = ((e.target.value / votosActuales) * 100).toFixed(2) + '%';
        textToChange.innerHTML = `${rep(e.target.value)} (${percent})`;
		e.target.setAttribute('data-val', e.target.value);
		changeOthersMax(votosActuales);
    });

	partido.addEventListener('change', async () => await toServer());

});


//Colorear ciruclos
const styles = document.querySelector('#colorThumbs');
partidosCodes.forEach(code => {
	const ranger = document.querySelector(`#range${code}`);
	styles.innerHTML += `
	#range${code}::-webkit-slider-thumb {
		background: ${ranger.getAttribute('data-color')}
	}
	`;
});


