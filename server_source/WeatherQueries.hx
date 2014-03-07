package;

import DbConnect;


typedef WeatherEntry = {
	var from:Date;
	var to:Date;
	var windspeed:Float; //Wind speed in mps.
	var weatherIcon:String; //openWeatherMap icon ID for the current weather.
}

typedef WeatherDataset = {
	var forecast:Array<WeatherEntry>;
}

typedef WeatherResult = {
	@:optional var error:String;
	@:optional var data:WeatherDataset;
}


class WeatherQueries {


	/*Returns an object like this:*/
	public static function getWindData(houseId:Int) {

		//Check if there is recent weather data in the database:
		var lastDownload:Date = lastDataDownload(houseId);
		if(lastDownload==null || (Date.now().getTime() - lastDownload.getTime() ) > DateTools.minutes(10) ) {
			var cityId = getCityId(houseId);
			downloadWeatherData(cityId); //Download data, since no recent weather data in DB.
		} 

		var cityIdSelect = '(SELECT cityId FROM House WHERE houseId=${houseId})';
		var query = 'SELECT * FROM WeatherData WHERE cityId IN ${cityIdSelect} ORDER BY fromTime ASC;';
		//php.Lib.println(query);

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




