package ;

import haxe.htmlparser.HtmlDocument;
import haxe.htmlparser.HtmlNodeElement;

/*
typedef PriceInfo = {
	var from:String; //Date
	var to:String; //Date
	var price:Float; //Price in kr pr. kwh. 
}

class PriceData {
	public var prices:Array<PriceInfo>;
	public function new() {
		prices = new Array<PriceInfo>();
	}
}
*/

class PriceQueries {

	private static inline var MINUTES_BETWEEN_DOWNLOADS = 15;
	private static inline var EXCHANGE_RATE = 7.4623; //Exchange rate for going from euros to dkk. 


	//Returns price data as an array of simple PriceInfo structures. 
	public static function getPriceData(from:Date, to:Date) : PowerPrice {

		downloadIfNoRecentData(); //Ensure that there is recent data in the database. 

		var cnx = DbConnect.connect();

		//Get price data for the specified time interval.
		var queryData = 'SELECT * FROM PowerPrices WHERE fromTime >= "${from.toString()}" AND toTime <= "${to.toString()}";';
		php.Lib.println(queryData);
		var dataResult = cnx.request(queryData);
		var result = new PowerPrice();
		for(row in dataResult) {
			result.slots.push({from:row.fromTime.toString(), to:row.toTime.toString(), dk1:((row.dk1 / 1000)*EXCHANGE_RATE), dk2:((row.dk2 / 1000)*EXCHANGE_RATE)});
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