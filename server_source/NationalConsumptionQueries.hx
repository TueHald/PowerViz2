package;

import haxe.htmlparser.HtmlDocument;
import haxe.htmlparser.HtmlNodeElement;

using Lambda;
using DateTools;
using Std;
using StringTools;


/*
http://www.nordpoolspot.com/Market-data1/Power-system-data/Consumption1/Consumption-prognosis/DK/Hourly/
*/

typedef NCPSlot = { //National Consumption Prognosis timeslot.
	var from:String;
	var to:String;
	var dk1:Float; //Consumption measured in mwh
	var dk2:Float; // --||--
}

class NationalConsumptionPrognosis {
	public var slots : Array<NCPSlot>;
	public function new() {
		slots = new Array<NCPSlot>();
	}
}

class NationalConsumptionQueries {

	private static var MINUTES_BETWEEN_DOWNLOADS = 15;


	public static function getConsumptionPrognosis(from:Date, to:Date) : Dynamic {

		try {

			downloadIfNoRecentData(); //Check that data is recent. 

			var now = Date.now().delta(DateTools.hours(1));
			var from = now.delta(DateTools.hours(-12));
			var to = now.delta(DateTools.hours(12));

			var query = 'SELECT * FROM NationalConsumption WHERE toTime >= "${from.toString()}" AND fromTime <= "${to.toString()}";';

			var cnx = DbConnect.connect();
			var result = cnx.request(query);
			var rtn = new NationalConsumptionPrognosis();
			for(r in result) {
				rtn.slots.push({from:r.fromTime.toString(), to:r.toTime.toString(), dk1:r.dk1, dk2:r.dk2});
			}
			rtn.slots = filterSlots( splitSlots(rtn.slots), from, to);
			return rtn;

		}
		catch(err:String) {
			php.Lib.println(err);
			return {error:err};
		}
		return {error:"Unexpected end of function!"};
	}


	private static function splitSlots(slots:Array<NCPSlot>) : Array<NCPSlot> {
		var result = new Array<NCPSlot>();
		for(i in 0...slots.length) {
			if(i<slots.length-1) {
				result = result.concat(splitSlot(slots[i], slots[i+1], 4));
			}
			else {
				result = result.concat(splitSlot(slots[i], slots[i], 4));
			}
		}
		return result;
	}


	private static function splitSlot(slot:NCPSlot, next:NCPSlot, parts:Int) : Array<NCPSlot> {

		var result = new Array<NCPSlot>();

		var from = Helpers.JsDateToDate(slot.from);
		var to = Helpers.JsDateToDate(slot.to);
		var timeStep = (to.getTime() - from.getTime()) / parts;
		var valueStep1 = (next.dk1 - slot.dk1) / parts;
		var valueStep2 = (next.dk2 - slot.dk2) / parts;

		var newFrom:Date = null;
		var newTo:Date = null;
		var newDk1:Float=0;
		var newDk2:Float=0;
		for(i in 0...parts) {
			newFrom = from.delta(timeStep * i); 
			newTo = newFrom.delta(timeStep); 
			newDk1 = slot.dk1 + (valueStep1 * i);
			newDk2 = slot.dk2 + (valueStep2 * i);
			result.push({from:newFrom.toString(), to:newTo.toString(), dk1:newDk1, dk2:newDk2});
		}
		return result;
	}

	//Filters out the slots that does not fit within the timeslot specified.
	private static function filterSlots(slots:Array<NCPSlot>, from:Date, to:Date) : Array<NCPSlot> {

		var filtFunc = function(slot:NCPSlot) {
			
			var f:Date = Helpers.JsDateToDate(slot.from);
			var t:Date = Helpers.JsDateToDate(slot.to);
			if(f.getTime()<from.getTime() && t.getTime()<from.getTime())
				return false;
			if(f.getTime()>to.getTime())
				return false;
			return true; 
			
		};

		return slots.filter(filtFunc).array();

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
		var dk1 = tds[2].innerHTML.replace(" ", "").parseInt();
		var dk2 = tds[3].innerHTML.replace(" ", "").parseInt();

		dk1 = dk1 == null ? 0 : dk1;
		dk2 = dk2 == null ? 0 : dk2;

		var from:Date = new Date(day.getFullYear(), day.getMonth(), day.getDate(), count, 0,0);
		var to:Date = from.delta(DateTools.hours(1));

		return {from:from.toString(), to:to.toString(), dk1:dk1, dk2:dk2};
	}

}

