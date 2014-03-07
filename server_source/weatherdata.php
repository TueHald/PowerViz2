<?php

ini_set('display_errors', 1); //Show errors.

/*
Code for obtaining and handling weather data from OpenWeatherMap.org.
*/

/*
$json = file_get_contents("http://api.openweathermap.org/data/2.5/forecast?id=2624886&mode=json");
$data = json_decode($json, true);

//Parse the weather data:
var_dump($data["city"]["id"]); //The city ID of the query.
var_dump($data["list"][0]["wind"]);
*/

downloadWeatherData(2624886);

//Downloads weather data from OpenWeatherMap, parses the data and 
//puts it into the PowerViz database.
function downloadWeatherData($cityId) {

	$weatherString = file_get_contents("http://api.openweathermap.org/data/2.5/forecast?id={$cityId}&mode=json&units=metrics");
	$jsonWeather = json_decode($weatherString, true);

	echo $weatherString . "<br><br><br>";

	echo $jsonWeather["city"]["name"] . "<br>";

	foreach($jsonWeather["list"] as &$entry) {
		echo "Time: " . $entry["dt_txt"] . " - ";
		echo "Windspeed: " . $entry["wind"]["speed"] . " - ";
		echo "Icon: " . iconToImgLink($entry["weather"][0]["icon"]) . " - ";
		echo "<br>";
	}
}

function iconToImgLink($icon) {
	return "<img src='http://openweathermap.org/img/w/" . $icon . ".png' >";
}


?>

