package;

import haxe.ds.StringMap;

import DbConnect;


class WeatherEntry {
	public var from:String;
	public var to:String;
	public var windSpeed:Float; //Wind speed in mps.
	public var weatherIcon:String; //openWeatherMap icon ID for the current weather.
	public function new() {

	}

	public function toString() : String {
		return 'from = ${from}, to=${to}, windSpeed=${windSpeed}, weatherIcon=${weatherIcon}';
	}
}

class WeatherData {
	public var forecast:Array<WeatherEntry>;
	public function new() {
		forecast = new Array<WeatherEntry>();
	}
}




class WeatherQueries {


	/*Returns an object like this:*/
	public static function getWindData(args:StringMap<String>) : Dynamic {

		var houseId:Int = Std.parseInt(args.get("houseId"));
		var from:Date = args.get("from")==null ? null : Helpers.JsDateToDate(args.get("from"));
		var to:Date = args.get("to")==null ? null : Helpers.JsDateToDate(args.get("to"));

		if(args.get("timespanFrom")!=null && args.get("timespanTo")!=null && args.get("now")!=null) {
			var timespanFrom = Std.parseInt(args.get("timespanFrom"));
			var timespanTo = Std.parseInt(args.get("timespanTo"));
			var now = Helpers.JsDateToDate(args.get("now"));
			from = DateTools.delta(now, -DateTools.hours(timespanFrom));
			to = DateTools.delta(now, DateTools.hours(timespanTo));
		}


		try {

			//Check if there is recent weather data in the database:
			var lastDownload:Date = lastDataDownload(houseId);
			if(lastDownload==null || (Date.now().getTime() - lastDownload.getTime() ) > DateTools.minutes(10) ) {
				var cityId = getCityId(houseId);
				downloadWeatherData(cityId); //Download data, since no recent weather data in DB.
			} 

			var cityIdSelect = '(SELECT cityId FROM House WHERE houseId=${houseId})';
			var query = 'SELECT * FROM WeatherData WHERE cityId IN ${cityIdSelect} AND toTime>="${from.toString()}" AND fromTime<="${to.toString()}" ORDER BY fromTime ASC;';

			var cnx = DbConnect.connect();
			var dataResult = cnx.request(query);

			var result = new WeatherData();
			var entry:WeatherEntry;
			for(row in dataResult) {
				entry = new WeatherEntry();
				entry.from = Helpers.dateToJSFormat(row.fromTime);
				entry.to = Helpers.dateToJSFormat(row.toTime);
				entry.windSpeed = row.windSpeed;
				entry.weatherIcon = row.weatherIcon;
				result.forecast.push(entry);
			}

			//If we are running with a 15 minutes granularity, disect the data into 15 minute intervals.
			if(args.get("granularity")!=null && args.get("granularity")=="15m") {
				var ddata = limitEntriesToRange(from, to, disectData(result));
				result.forecast = ddata; 
			}

			return result;
		}
		catch(err:String) {
			return {error : err};
		}

		return null;

	}


	//Downloads new weather data from the Open Weather Map service and enters it into the database table WeatherData.
	public static function downloadWeatherData(cityId:Int) {

		var url:String = 'http://api.openweathermap.org/data/2.5/forecast?id=${cityId}&mode=json&units=metrics';
		var result:String = untyped  __call__("file_get_contents", url); //Call a PHP function directly.

		if(result==null || result=="" )
			throw 'Error downloading weather data for city ${cityId}';

		var json = haxe.Json.parse(result);

		var cnx = DbConnect.connect();

		var query:String="";

		var windSpeed:Float;
		var fromTime:Date;
		var toTime:Date;
		var weatherIcon:String;

		var dataAcquired:Date = Date.now();

		var list:Array<Dynamic> = json.list;
		for(entry in list) {
			windSpeed = Std.parseFloat(entry.wind.speed);
			fromTime = Date.fromString(entry.dt_txt);
			toTime = DateTools.delta(fromTime, DateTools.hours(3)); //Weather data are in 3 hour intervals.
			weatherIcon = entry.weather[0].icon;

			query = 'REPLACE INTO WeatherData (cityId, fromTime, toTime, windSpeed, weatherIcon, acquired) VALUES (${cityId}, "${fromTime}", "${toTime}", ${windSpeed}, "${weatherIcon}", "${dataAcquired}");';
			cnx.request(query);
		}
		
	}

	//Returns the time of the last data acquisition for the specified cityId.
	//If no data was ever downloaded, it returns null.
	public static function lastDataDownload(houseId:Int) : Date {

		var cityIdSelect = '(SELECT cityId FROM House WHERE houseId=${houseId})';
		var query = 'SELECT acquired FROM WeatherData WHERE cityId IN ${cityIdSelect} ORDER BY acquired DESC LIMIT 1;';

		try {
			var cnx = DbConnect.connect();	
			var date:Date = null;

			var result = cnx.request(query);
			for(row in result) {
				date = Date.fromString(row.acquired);
			}


			return date; 

		}
		catch(err:String) {
			throw 'Error getting time of last weather download for house $houseId : $err';			
		}
		
		return null; //No date recorded.
	}	

	//Returns the cityId matching the houseId. 
	public static function getCityId(houseId:Int) : Int {
		var query = 'SELECT cityId FROM House WHERE houseId = $houseId LIMIT 1;';
		var cnx = DbConnect.connect();
		var result = cnx.request(query);
		var rtrn:Int = -1;
		for(row in result) {
			rtrn = row.cityId;
		}
		return rtrn;
	}

	//Takes the "pure" 3-hour based data and disects it into data for the 15-minutes granularity.
	private static function disectData(weatherData:WeatherData) : Array<WeatherEntry> {

		var entries = new Array<WeatherEntry>();
		for(i in 0...(weatherData.forecast.length)) {

			if(i<weatherData.forecast.length-1) {
				entries = entries.concat(subdivideEntry( weatherData.forecast[i], weatherData.forecast[i+1], 12 ));
			}
			else {
				entries = entries.concat(subdivideEntry(weatherData.forecast[i], weatherData.forecast[i], 12));
			}
		}

		return entries;

	}

	//Subdivides the data in a single entry.
	private static function subdivideEntry(from:WeatherEntry, to:WeatherEntry, splits:Int) : Array<WeatherEntry> {

		var result = new Array<WeatherEntry>();

		var fromStamp = Helpers.JsDateToDate(from.from).getTime();
		var toStamp = Helpers.JsDateToDate(from.to).getTime();

		var stepSize = (toStamp-fromStamp)/splits; //Timestamp stepsize.
		var stepPct:Float = stepSize / (toStamp-fromStamp); //Each step in percents.

		var windDiff = to.windSpeed - from.windSpeed;

		var newEntry:WeatherEntry;
		for(i in 0...splits) {
			newEntry = new WeatherEntry();
			newEntry.from = Helpers.dateToJSFormat(Date.fromTime(fromStamp + (stepSize*i)));
			newEntry.windSpeed = from.windSpeed + (windDiff*(stepPct*i));
			newEntry.to = Helpers.dateToJSFormat(Date.fromTime(fromStamp + (stepSize*(i+1))));
			newEntry.weatherIcon = from.weatherIcon;
			result.push(newEntry);
		}

		return result;
	}

	//Limit the entries in the weather data range to those that are in the specified from/to timespan. 
	private static function limitEntriesToRange(from:Date, to:Date, entries:Array<WeatherEntry>) : Array<WeatherEntry> {

		var result = new Array<WeatherEntry>();
		var fromStamp = from.getTime();
		var toStamp = to.getTime();

		var t:Float=0;
		for(entry in entries) {
			t = Helpers.JsDateToDate(entry.from).getTime();
			if(t>=fromStamp && t<=toStamp) {
				result.push(entry);
			}
		}

		return result;

	}


}




