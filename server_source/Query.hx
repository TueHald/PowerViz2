package;

import haxe.ds.StringMap;

import Helpers;
import WeatherQueries;
import ConsumptionQueries;
import PriceQueries;
import NationalConsumptionQueries;
import InteractionLog;
import CommonConsumptionQueries;

class Query {
	
	public static function main() {

		//php.Lib.println( haxe.Json.stringify(PriceQueries.getPriceData(Date.fromString("2014-03-08 00:00:00"), Date.now())));

		var r = handleQuery(php.Web.getParams());

		if(r!=null) {
			php.Lib.print(haxe.Json.stringify(r));
		} else {
			php.Lib.print(haxe.Json.stringify({error:"Query returned NULL."}));
		}
	}

	public static function handleQuery(args:StringMap<String>) : Dynamic {

		switch(args.get("query")) {

			case "getTotalConsumption":
				return ConsumptionQueries.getTotalConsumption(args);

			case "getConsumptionPrognosis":
				//return ConsumptionQueries.getConsumptionPrognosisAverage(args);
				return ConsumptionQueries.getConsumptionPrognosisMedian(args);


			case "getWind":
				return getWind(args);

			case "getPowerPrices":
				return getPowerPrices(args);

			case "getNationalConsumptionPrognosis":
				//return getNationalConsumptionPrognosis(args);
				return CommonConsumptionQueries.getCommonConsumption();

			case "sendLogData":
				return InteractionLog.logInteraction(args);

			case "calculateCommonConsumption":
				return CommonConsumptionQueries.calculateCommonConsumption(args);

			case "getCommonConsumption":
				return CommonConsumptionQueries.getCommonConsumption();

			default:
				return {error:'Error handling query. Unidentified query ${args.get("query")}'};

		}

		return null;

	}



	//Returns a list of windspeeds in the specified time interval. 
	//Returned as a JSON-stringify-able Dynamic object. 
	static function getWind(args:StringMap<String>) : Dynamic {
		return WeatherQueries.getWindData(args);	
	}


	static function getPowerPrices(args:StringMap<String>) : Dynamic {
		return PriceQueries.getPriceData(args);
	}


	static function getNationalConsumptionPrognosis(args) : Dynamic {
		return NationalConsumptionQueries.getConsumptionPrognosis(Helpers.JsDateToDate(args.get("from")), Helpers.JsDateToDate(args.get("to")));
	}

}

