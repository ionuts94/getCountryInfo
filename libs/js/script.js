$('document').ready(() => {
	//reset results display function-----------------------------------------------------------------------
	function resetResultsDisplay() {
		$('#header3').html(``);
		$('#header4').html(``);
		$('#header5').html(``);
		$('#header6').html(``);
	}

	//Build an object with all possible values for display purpose-----------------------------------------
	const values = {
		'RO': {name: "Romania", icao: "LRBS", coordinates: ["44.26", "26.06"]},
		'FR': {name: "France", icao: "LFPB", coordinates: ["48.51", "2.21"]},
		'PL': {name: "Poland", icao: "EPWA", coordinates: ["52.14", "21.00"]},
		'IT': {name: "Italy", icao: "LIRG", coordinates: ["41.54", "12.29"]},
		'ES': {name: "Spain", icao: "LEMD", coordinates: ["40.25", "-3.42"]}
	}

	//Check neighbours btn event----------------------------------------------------------------------------
    $('#neighboursBtn').on('click', () => {
		resetResultsDisplay(); //reset results if previously displayed
        const countryName = $('#countryName').val();
        $.ajax({
			url: "libs/php/getCountryNeighbours.php",
			type: 'POST',
			dataType: 'json',
			data: {
				country: countryName
			},
			success: (result) => {
				let numRows = result['data'].length;

				if (result.status.name == "ok") {
					let neighbourString = "";
					for(let i = 0; i < numRows; i++) {
						if(i === numRows - 1) {
							neighbourString += " and " + result['data'][i]['asciiName'] +".";
						} else if(i === numRows -2) {
							neighbourString += result['data'][i]['asciiName'];
						} else {
							neighbourString += result['data'][i]['asciiName'] + ", ";
						}
					}
					$('#header3').html(`${values[countryName]['name']} has ${result['data'].length} neighbours: `);
					$('#header4').html(neighbourString);
				}
			
			},
			error: (jqXHR, textStatus, errorThrown) => {
				alert("Something went wrong!! Please try again");
			}
        });
	});
	
	//check weather btn event---------------------------------------------------------------------------------
	$('#weatherBtn').on('click', () => {
		resetResultsDisplay(); //reset results if previously displayed
		const icaoVal = values[$('#countryName').val()]['icao'];
		const countryName = values[$('#countryName').val()]['name'];
        $.ajax({
			url: "libs/php/getCountryWeather.php",
			type: 'POST',
			dataType: 'json',
			data: {
				country: countryName,
				icao: icaoVal
			},
			success: (result) => {
				$('#header3').html(`Welcome to ${result['data']['weatherObservation']['stationName']}, ${countryName}`);
				$('#header4').html(`Date: ${result['data']['weatherObservation']['datetime']}`);
				$('#header5').html(`Temperature: ${result['data']['weatherObservation']['temperature']}°C`);
				$('#header6').html(`Humidity: ${result['data']['weatherObservation']['humidity']}%`);
			},
			error: (jqXHR, textStatus, errorThrown) => {
				alert("Something went wrong!! Please try again");
			}
        });
	});
	
	//Check timezone btn-------------------------------------------------------------------------------
	$('#timezoneBtn').on('click', () => {
		resetResultsDisplay(); //reset results if previously displayed
		const lat = values[$('#countryName').val()]['coordinates'][0];
		const lng = values[$('#countryName').val()]['coordinates'][1];
		const countryName = values[$('#countryName').val()]['name'];
        $.ajax({
			url: "libs/php/getCountryTimezone.php",
			type: 'POST',
			dataType: 'json',
			data: {
				country: countryName,
				latValue: lat,
				lngValue: lng
			},
			success: (result) => {
				$('#header3').html(`Country name: ${countryName}`);
				$('#header4').html(`Time zone: ${result['data']['timezoneId']}`);
				$('#header5').html(`Current time: ${result['data']['time']}`);
				$('#header6').html(`Sun usually ries at ${result['data']['sunrise']}`);
			},
			error: (jqXHR, textStatus, errorThrown) => {
				alert("Something went wrong!! Please try again");
			}
        });
    });

});