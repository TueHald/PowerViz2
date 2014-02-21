<?php


class QueryParser {

	private $functions = array();
	public function addFunction($name, $func) {
		$this->functions[$name] = $func;
	}

	public function run($query) {
		if($this->functions[$query]!=null) {
			//Run the actual function here.
		}
	}
}

$parser = new QueryParser();
$parser->addFunction("getLoadHistory", function() {echo "Getting load history."; });


if(isset($_GET["query"]))
	$parser->run($_GET["query"]);


?>