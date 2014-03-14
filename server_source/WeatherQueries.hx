package;

import haxe.ds.StringMap;

import DbConnect;


typedef WeatherEntry = {
	var from:String;
	var to:String;
	var windSpeed:Float; //Wind speed in mps.
	var weatherIcon:String; //openWeatherMap icon ID for the current weather.
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

		if(args.get("timespan")!=null) {
			var now = args.get("now")==null ? Date.now() : Helpers.JsDateToDate(args.get("now"));
			var timespan:Int = Std.parseInt(args.get("timespan"));
			if(timespan<0) {
				to = now;
				from = DateTools.delta(to, DateTools.hours(timespan));
			}
			else {
				from = now;
				to = DateTools.delta(from, DateTools.hours(timespan));
			}
		}

		try {

			//Check if there is recent weather data in the database:
			var lastDownload:Date = lastDataDownload(houseId);
			if(lastDownload==null || (Date.now().getTime() - lastDownload.getTime() ) > DateTools.minutes(10) ) {
				var cityId = getCityId(houseId);
				downloadWeatherData(cityId); //Download data, since no recent weather data in DB.
			} 

			var cityIdSelect = '(SELECT cityId FROM House WHERE houseId=${houseId})';
			var query = 'SELECT * FROM WeatherData WHERE cityId IN ${cityIdSelect} AND fromTime>="${from.toString()}" AND toTime<"${to.toString()}" ORDER BY fromTime ASC;';

			var cnx = DbConnect.connect();
			var dataResult = cnx.request(query);

			var result = new WeatherData();
			for(row in dataResult) {
				result.forecast.push({from:row.fromTime.toString(), to:row.toTime.toString(), windSpeed:row.windSpeed, weatherIcon:row.weatherIcon});
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


}




