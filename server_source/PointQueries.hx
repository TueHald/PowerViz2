package ;

using DateTools;
using haxe.Json;
using Std;

typedef FlexPoints = {

	var windPoints:Int;
	var loadPoints:Int;
	var pricePoints:Int;
};


class PointQueries {

	public static function getFlexPoints(args:haxe.ds.StringMap<String>) : Dynamic {

		if(args.get("houseId")==null)
			throw "Error getting flex points: no houseId argument";

		var houseId:Int = args.get("houseId").parseInt();

		var consumption = Helpers.normalize(getConsumption(houseId, 24));

		var windPoints = calcWindPoints(houseId, 24, consumption) * (500/95);
		var pricePoints = calcPricePoints(houseId, 24, consumption) * (500/95);
		var loadPoints = calcLoadPoints(houseId, 24, consumption) * (500/95);

		return {windPoints:windPoints.int(), loadPoints:loadPoints.int(), pricePoints:pricePoints.int()};

	}

	private static function intervalBeforeNow(hours:Int) : {from:Date, to:Date} {
		var now = Date.now().delta(DateTools.hours(2));
		var from = now.delta(-DateTools.hours(hours));
		return {from:from, to:now};
	}

	private static function calcLoadPoints(houseId:Int, hours:Int, consumption:Array<Float>) : Float {
		var interval = intervalBeforeNow(hours);
		var loads = CommonConsumptionQueries.getCommonConsumptionSimpleArray(hours, 0);
		while(loads.length>96){
			loads = loads.slice(1);
		}
		loads = Helpers.normalize(loads);

		var len = consumption.length>loads.length ? loads.length : consumption.length;
		var points:Float = 0;
		for(i in 0...len){
			points += Math.abs(consumption[i] - loads[i]);
		}
		return points;
	}

	private static function calcWindPoints(houseId:Int, hours:Int, consumption:Array<Float>) : Float {

		try {

			var interval = intervalBeforeNow(hours);
			//Get data from the weather queries:
			var args = new haxe.ds.StringMap<String>();
			args.set("houseId", '$houseId');
			args.set("now", interval.to.toString());
			args.set("timespanFrom", '$hours');
			args.set("timespanTo", "0");
			args.set("granularity", "15m");
			var weather = WeatherQueries.getWindDataSimpleArray(args); //Get as a simple array.
			
			while(weather.length>96){ //Limit num entries.
				weather = weather.slice(1);
			}
			weather = Helpers.normalize(weather);

			var len = consumption.length>weather.length ? weather.length : consumption.length;
			var points:Float=0;
			for(i in 0...len) { //Calculate points as difference between wind and consumption. 
				points += Math.abs(consumption[i] - weather[i]);
			}
			return len - points; //If there is no difference between wind and consumption, you get full points. 

		}
		catch(err:Dynamic) {
			throw 'Error in calculating wind points: $err';
		}

		return -1; //Return negative on unexpected behaviour. 
	}	

	private static function calcPricePoints(houseId:Int, hours:Int, consumption:Array<Float>) : Float {
		
		try {
			var now = Date.now().delta(DateTools.hours(2));
			var args = new haxe.ds.StringMap<String>();
			args.set("houseId", '$houseId');
			args.set("from", now.delta(DateTools.hours(-hours)).toString());
			args.set("to", now.toString());
			var price = PriceQueries.getPriceDataSimpleArray(args);
			
			price = Helpers.normalize(price);
			var len = price.length>consumption.length ? price.length : consumption.length;
			var points:Float=0;
			for(i in 0...len)  {
				points += Math.abs(consumption[i] - price[i]);
			}
			return points;
		}
		catch(err:Dynamic) {
			throw 'Error calculating price points: $err';
		}
		return -1; //Unexpected behaviour, so return -1.
	}

	private static function getConsumption(houseId:Int, hours:Int) : Dynamic {

		var now = Date.now().delta(DateTools.hours(2));
		var args = new haxe.ds.StringMap<String>();
		args.set("houseId", '$houseId');
		args.set("from", '${now.delta(DateTools.hours(-hours))}');
		args.set("to", '$now');

		var result = ConsumptionQueries.getTotalConsumptionSimpleArray(args);
		while(result.length>96){
			result = result.slice(1);
		}

		return result;
	}

}

