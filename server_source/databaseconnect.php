<?php

require 'serverlogon.php';


ini_set('display_errors', 1); //Show errors.


//testQuery(false);

//NOTE:
//There are no username and password in this file.
//Write the two functions in serverlogon.php: database_userName() and database_passWord() and make them return strings.


function connectToDatabase($production) {

	if($production==true) {
		//$connection = mysqli_connect("localhost", "www", "DennisMichaelTue", "PowerVizProduction");
		//AS A SAFETYPRECAUTION, NO ACCESS TO THE PRODUCTION DB YET!!
	}
	else
		$connection = mysqli_connect("localhost", database_userName(), database_passWord(), "PowerVizDevelopment");

	// Check connection
	if (mysqli_connect_errno()) {
		echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}

	return $connection;

}

function testQuery($production) {
	$con = connectToDatabase($production);
	$query = "SELECT * FROM HouseOutlets WHERE houseId=1;";
	$result = mysqli_query($con, $query);
	while($row = mysqli_fetch_array($result)) {

		echo "houseId: {$row['houseId']}, outletId: {$row['outletId']}, color: {$row['color']}";
		echo "<br>";
	}
}

?>