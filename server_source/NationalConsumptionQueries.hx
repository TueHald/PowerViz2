package;

import haxe.htmlparser.HtmlDocument;
import haxe.htmlparser.HtmlNodeElement;


/*
http://www.nordpoolspot.com/Market-data1/Power-system-data/Consumption1/Consumption-prognosis/DK/Hourly/
*/

class NationalConsumptionQueries {

	private static var MINUTES_BETWEEN_DOWNLOADS = 15;


	public static function getConsumptionPrognosis(from:Date, to:Date) : Dynamic {

		try {

			downloadIfNoRecentData(); //Check that data is recent. 

		//Then, get and form the data and return it. 
		}
		catch(err:String) {
			php.Lib.println(err);
		}
		return null;
	}


	private static function downloadIfNoRecentData() {

		var download = true;
		var query = 'SELECT acquired FROM NationalConsumption ORDER BY acquired DESC LIMIT 1;';
		var cnx = DbConnect.connect();
		var result = cnx.request(query);
		var date:Date;
		for( row in result) {
			date = row.acquired;
			if(date.getTime() > (Date.now().getTime() - DateTools.minutes(MINUTES_BETWEEN_DOWNLOADS))) {
				download = false;
			}
		}

		if(download)
			downloadConsumptionPrognosis();

	}


	public static function downloadConsumptionPrognosis() {

		var url = "http://www.nordpoolspot.com/Market-data1/Power-system-data/Consumption1/Consumption-prognosis/DK/Hourly/";
		var result:String = untyped __call__("file_get_contents", url);
		var prog = parsePrognosisHtml(result);

		var cnx = DbConnect.connect();
		var now = Date.now();
		
		var query = "";
		for(slot in prog.slots) {
			query = 'REPLACE INTO NationalConsumption (fromTime, toTime, dk1, dk2, acquired) 
					VALUES ("${slot.from.toString()}", "${slot.to.toString()}", ${slot.dk1}, ${slot.dk2}, "${now.toString()}");';
			cnx.request(query);
		}
	}


	private static function parsePrognosisHtml(s:String) : NationalConsumptionPrognosis {

		var result = new NationalConsumptionPrognosis();

		var doc = new HtmlDocument(s);
		var table = doc.find("#ctl00_FullRegion_npsGridView_trkGrid_ctl00");
		var day = parseDateRow(table[0].find(".rgGroupHeader")[0]); //Head of the table with date.

		for(i in 0...24) {
			result.slots.push(parseDataRow(table[0].find('#ctl00_FullRegion_npsGridView_trkGrid_ctl00__${i}')[0], i, day));
		}

		return result;
	}

	//Parse the row with the date in it.
	private static function parseDateRow(row:HtmlNodeElement) : Date {
		return Helpers.parseNordpoolDate(row.find("td")[1].find("p")[0].innerHTML);
	}

	//Parse the row with the consumption prognosis data in it. 
	private static function parseDataRow(row:HtmlNodeElement, count:Int, day:Date) : NCPSlot {
		var tds = row.find("td");
		var dk1 = Std.parseInt(StringTools.replace(tds[2].innerHTML, " ", ""));
		var dk2 = Std.parseInt(StringTools.replace(tds[3].innerHTML, " ", ""));
		var from:Date = new Date(day.getFullYear(), day.getMonth(), day.getDate(), count, 0,0);
		var to:Date = DateTools.delta(from, DateTools.hours(1));

		return {from:from.toString(), to:to.toString(), dk1:dk1, dk2:dk2};
	}

}

typedef NCPSlot = {
	var from:String;
	var to:String;
	var dk1:Int; //Consumption measured in mwh
	var dk2:Int; // --||--
}

class NationalConsumptionPrognosis {
	public var slots : Array<NCPSlot>;
	public function new() {
		slots = new Array<NCPSlot>();
	}
}