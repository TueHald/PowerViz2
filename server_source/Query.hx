package;

import haxe.ds.StringMap;

import Helpers;
import WeatherQueries;

import ConsumptionQueries;

class Query {
	
	public static function main() {

		var r = handleQuery(php.Web.getParams());
		//Make the result into a JSON string:

		if(r!=null) {
			php.Lib.print(haxe.Json.stringify(r));
		}
	}

	public static function handleQuery(args:StringMap<String>) : Dynamic {

		switch(args.get("query")) {

			case "getTotalConsumption":
				return ConsumptionQueries.getTotalConsumption(args);

			case "getWind":
				return getWind(args);

			case "setPowerPrices":
				return setPowerPrices(args);

			default:
				return {error:'Error handling query. Unidentified query ${args.get("query")}'};

		}

		return null;

	}




	//Returns a list of weindspeeds at specified intervals. 
	static function getWind(args:StringMap<String>) : Dynamic {

		try {
			WeatherQueries.getWindData(3);
			//WeatherQueries.downloadWeatherData(2624886);			
		}
		catch(err:String) {
			return {error:err};
		}

		//Check that there is current weather data in the database. 
		//If not, get recent weather data for the specified weather ID (OWM city ID).

		return null; 

	}

	//Returns a list of weather icon links... 
	static function getWeatherIcon(args:StringMap<String>) : Dynamic {
		return null; 
	}

	static function setPowerPrices(args:StringMap<String>) : Dynamic {
		//This is a function that should be called using a POST, so get the post data:

		var data = sys.io.File.getContent("php://input");
		
		if(data=="") {
			return {error:"No data received! This should be used as a POST."};
		}

		try {

			var cnx = DbConnect.connect();

			var query="";
			var json = haxe.Json.parse(data);
			var slots:Array<Dynamic> = json.slots;
			for(slot in slots) {
				query = 'REPLACE INTO PowerPrices (fromTime, toTime, dk1, dk2) 
						VALUES ("${slot.from}", "${slot.to}", ${slot.dk1}, ${slot.dk2});';
				cnx.request(query);
			}

		}
		catch(err:String) {
			return {error:err};
		}

		return null;
	}

}

