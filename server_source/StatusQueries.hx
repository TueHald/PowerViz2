package ;

import php.Lib;

import DbConnect;

class StatusQueries {

	public static function getStatus() : Dynamic {

		getCurrentConsumption();
		getBoxLog();

		return null;

	}

	public static function getCurrentConsumption() {

		Sys.println("<br><br><h3>CurrentLoad</h3><br><br>");
		var query = 'SELECT * FROM CurrentLoad ORDER BY `time` DESC LIMIT 50;';
		var qresult = DbConnect.connect().request(query);
		for(row in qresult) {
			Sys.println('${row.houseId} - ${row.outletId} - ${row.time} - ${row.load} <br>');
		}

	}

	public static function getBoxLog() {

		Sys.println("<br><br><h3>BoxLog</h3><br><br>");

		var query = 'SELECT * FROM BoxLog ORDER BY `time` DESC LIMIT 50;';
		var qresult = DbConnect.connect().request(query);
		for(row in qresult) {
			Sys.println('${row.houseId} - ${row.time} - ${row.msg} <br>');
		}
	}

}