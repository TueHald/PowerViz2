package ;

import haxe.htmlparser.HtmlDocument;
import haxe.htmlparser.HtmlNodeElement;

import haxe.ds.StringMap;


//Datatypes, designed for easy conversion to JSON.
typedef Slot = {
	var from:String; //Date.
	var to:String; //Date.
	var dk1:Float;
	var dk2:Float;
}

class PowerPrice {
	public var date:String;
	public var slots:Array<Slot>;

	public function new() {
		date = Date.now().toString();
		slots = new Array<Slot>();
	}

}

class PriceQueries {

	private static inline var MINUTES_BETWEEN_DOWNLOADS = 15;
	private static inline var EXCHANGE_RATE = 7.4623; //Exchange rate for going from euros to dkk. 


	//Returns price data as an array of simple PriceInfo structures. 
	public static function getPriceData(args:StringMap<String>) : PowerPrice {

		var from:Date;
		var to:Date;

		if(args.get("from")!=null || args.get("to")!=null) {
			from = Helpers.JsDateToDate(args.get("from"));
			to = Helpers.JsDateToDate(args.get("to"));
		}
		else {
			var now = DateTools.delta(Date.now(), DateTools.hours(2));
			from = DateTools.delta(now, DateTools.hours(-12));
			to = DateTools.delta(now, DateTools.hours(12));
		}

		downloadIfNoRecentData(); //Ensure that there is recent data in the database. 

		var cnx = DbConnect.connect();

		//Get price data for the specified time interval.
		var queryData = 'SELECT * FROM PowerPrices WHERE fromTime >= "${from.toString()}" AND toTime <= "${to.toString()}";';
		var dataResult = cnx.request(queryData);
		var result = new PowerPrice();
		for(row in dataResult) {
			result.slots.push({from:row.fromTime.toString(), to:row.toTime.toString(), dk1:((row.dk1 / 1000)*EXCHANGE_RATE), dk2:((row.dk2 / 1000)*EXCHANGE_RATE)});
		}
		result.slots = splitSlots(result.slots);
		result.slots = fillEmptyDataFront(result.slots, from, to);
		return result;
	}

	public static function getPriceDataSimpleArray(args:StringMap<String>) : Array<Float> {

		var price:PowerPrice = getPriceData(args);
		var result = new Array<Float>();
		for(entry in price.slots) {
			result.push(entry.dk1);
		}
		return result;
	}

	private static function splitSlots(slots:Array<Slot>) : Array<Slot> {

		var result = new Array<Slot>();
		for(i in 0...slots.length) {
			if(i<slots.length-1) {
				result = result.concat(splitSlot(slots[i], slots[i+1], 4));
			} else {
				result = result.concat(splitSlot(slots[i], slots[i], 4));
			}
		}
		return result;
	} 

	private static function splitSlot(slot:Slot, next:Slot, parts:Int) : Array<Slot> {

		var result = new Array<Slot>();
		var from = Date.fromString(slot.from).getTime();
		var to = Date.fromString(slot.to).getTime();

		var timeStep = (to-from) / parts;
		var valueStep1 = (next.dk1 - slot.dk1) / parts;
		var valueStep2 = (next.dk2 - slot.dk2) / parts;

		var newDk1:Float=0;
		var newDk2:Float=0;
		var newFrom:Date;
		var newTo:Date;
		for(i in 0...parts) {
			newFrom = Date.fromTime(from + (i * timeStep));
			newTo = Date.fromTime(newFrom.getTime() + timeStep);
			newDk1 = slot.dk1 + (valueStep1 * i);
			newDk2 = slot.dk2 + (valueStep2 * i);
			result.push({from:newFrom.toString(), to:newTo.toString(), dk1:newDk1, dk2:newDk2});
		}

		return result;

	}

	//If the first part of the data array does not go back to the 'from' time, data
	//is filled in at the front at the array to match. 
	public static function fillEmptyDataFront(data:Array<Slot>, from:Date, to:Date) : Array<Slot> {

		var result = new Array<Slot>();
		for(d in data) {
			result.push(d);
		}

		var sfrom = Helpers.JsDateToDate( result[0].from );
		var newSlot:Slot;
		while(sfrom.getTime() > from.getTime()) {
			newSlot = {from:"", to:"", dk1:result[0].dk1, dk2:result[0].dk2};
			newSlot.to = result[0].from;
			newSlot.from = DateTools.delta(Helpers.JsDateToDate(newSlot.to), DateTools.minutes(-15)).toString();
			result.insert(0, newSlot);
			sfrom = Helpers.JsDateToDate(result[0].from);
		}
		return result;
	}


	//Checks the available data in the database, then downloads if data is not recent.
	public static function downloadIfNoRecentData() {

		var cnx = DbConnect.connect();

		var mustDownload = true; //True if data must be downloaded from Nord Pool Spot. 
		var queryRecent = 'SELECT acquired FROM PowerPrices ORDER BY acquired DESC LIMIT 1;';
		var recentResult = cnx.request(queryRecent); //Do the query.
		var lastAqcuired:Date; //For converting to correct type. 
		for(row in recentResult) {
			lastAqcuired = row.acquired;
			if(lastAqcuired.getTime() > (Date.now().getTime() - DateTools.minutes(MINUTES_BETWEEN_DOWNLOADS))) {
				mustDownload = false; //Data is recent, so no need to download.
			}
		}

		if(mustDownload) //Data must be downloaded.
			downloadPriceData(); //So download it. 
	}


	//Downloads price data from Nord Pool Elspot market and puts it into the database.
	public static function downloadPriceData() {

		try {

			var url = "http://www.nordpoolspot.com/Market-data1/Elspot/Area-Prices/DK/Hourly/";
			var result:String = untyped __call__("file_get_contents", url);
			var price:PowerPrice = parsePriceHtml(result);

			var cnx = DbConnect.connect();

			var query = "";
			var acquired = Date.now();
			for(slot in price.slots) {
				query = 'REPLACE INTO PowerPrices (fromTime, toTime, dk1, dk2, acquired) VALUES 
						("${slot.from}", "${slot.to}", ${slot.dk1}, ${slot.dk2}, "${acquired}");';
				cnx.request(query);
			}

		}
		catch(err:String) {
			//Handle error....
			php.Lib.println("Error: " + err);
		}
	}

	private static var mData:PowerPrice;
	private static var mDate:Date;
	public static function parsePriceHtml(s:String) : PowerPrice {

		mData = new PowerPrice();
		mDate = Date.now();

		var doc = new HtmlDocument(s);
		var r = doc.find("#ctl00_FullRegion_npsGridView_trkGrid_ctl00");
		
		var body = r[0].find("tbody");

		var rowCounter:Int = 0;
		for(elm in body[0].children) {
			parseHtmlRow(elm, rowCounter);
			rowCounter += 1;
		}

		return mData;

	}

	private static function parseHtmlRow(node:HtmlNodeElement, rowNum:Int) {

		if(node.getAttribute("class") == "rgGroupHeader") { //Contains the date.
			mDate = Helpers.parseNordpoolDate(node.find("p")[0].innerHTML);
			mData.date = mDate.toString();
		}
		else {

			if(rowNum>=1 && rowNum<=24) {

				var from = htmlTimeslotToDate(mDate, node.children[1].innerHTML);
				var to = DateTools.delta(from, DateTools.hours(1));
				var dk1 = Std.parseFloat(StringTools.replace(node.children[2].innerHTML,",", "."));
				var dk2 = Std.parseFloat(StringTools.replace(node.children[3].innerHTML, ",", "."));

				mData.slots.push({ from:from.toString(), to:to.toString(), dk1:dk1, dk2:dk2 });

			}
		}

	}

	private static function htmlTimeslotToDate(day:Date, timeslot:String) : Date {
		var first = timeslot.substr(0, 2);
		var d = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0,0,0);
		return DateTools.delta(d, DateTools.hours(Std.parseInt(first)));
	}

}


