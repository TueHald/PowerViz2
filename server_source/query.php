<?php


if(isset($_GET["query"]))
	parseQuery();

//Parses the query:
function parseQuery() {

	switch($_GET["query"]) {
		case "getLoadHistory":
			echo "This is the load history. Period.";
			break;
		default:
			echo "Unrecognized query";
	}

}

call_user_func('func');

?>