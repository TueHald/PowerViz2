package ;

using DateTools;
using Std;


typedef WatchHour = {
	var wind:Float;
	var load:Float;
	var price:Float;
};

enum UsePower {
	Wind; //Use power because of wind.
	Load; //Use poser because of load. 
	Price; //Use power because of price. 
	None;  //Don't use power!
}

/**
TODO: Make the datastructure that the data should be returned in. 
Make sure that the datastructure fits the data that the view/controller works with. 
**/

class FlexWatchQueries {

	/**Returns the flexWatch states as an array of 12 entries. 
	The entries fits the clock in relation to the current time, so that
	index 0 always will be at 12 o'clock, 1 at 1 o'clock and 6 at 6 o'clock.
	**/ 
	public static function getFlexWatchState(args:haxe.ds.StringMap<String>) : Dynamic {

		var houseId = args.get("houseId").parseInt();

		var now = Date.now().delta(DateTools.hours(2)); //GMT+1 summertime (GMT+2). 
		var to = now.delta(DateTools.hours(12));

		//Use the thresholds and ranges below for configuration:

		//Thresholds:
		var windThreshold = 8.0; //Everything above this number of meters per second is good. 
		var priceThreshold = 0.20; //Everything below this amount of øre pr kwh is good.
		var loadThreshold = 120; //Everything below this load is good. 

		//Ranges:
		var windRange = {min:3.0, max:14.0}; //Range of the wind data.
		var priceRange = {min:0.10, max:0.40};
		var loadRange = {min:10.0, max:300.0};

		var windPctThreshold:Float = thresholdToPctThreshold(windRange, windThreshold);
		var pricePctThreshold:Float = thresholdToPctThreshold(priceRange, priceThreshold);
		var loadPctThreshold:Float = thresholdToPctThreshold(loadRange, loadThreshold);

		var windData = Helpers.normalizeInRange(getWindFlexData(houseId, now), windRange);
		Helpers.limitArrayDigits(windData, 2);

		var priceData = Helpers.normalizeInRange(getPriceFlexData(now, to), priceRange);
		Helpers.limitArrayDigits(priceData, 4);

		var loadData = Helpers.normalizeInRange(getLoadFlexData(now, to), loadRange);
		Helpers.limitArrayDigits(loadData, 2);

		var preResult = new Array<UsePower>(); //Preliminary result. 
		for(i in 0...48) { //Loop through the 48 entries, representing 12 hours. 
			preResult.push(valuesToUsePower(windData[i], windPctThreshold, 
				loadData[i], loadPctThreshold, priceData[i], pricePctThreshold));
		}


		var nowIndex = Helpers.dateToIndex(now); //Get the index of the current time. 
		var noon:Int = 0;
		if(nowIndex>=48)
			noon = 48;

		rotateArray(preResult, nowIndex-noon); //Rotate the result, so that the index at timeIndex 0 or 48 is actually the first. 

		var result = new Array<Int>();
		for(p in preResult) {
			result.push(switch(p){
				case Wind: 1;
				case Load: 2;
				case Price: 3;
				case None: 0;
				default: 0;
				});
		}

		return {flexQuarters:result};

	}

	//Rotates the array in place a number of steps.
	private static function rotateArray(array:Array<UsePower>, steps:Int) {
		for(i in 0...steps) {
			array.insert(0, array.pop());
		}
	}

	//Returns the "WatchValue", that is, the time in 48-quarters spectrum, that matches the specified date/time. 
	private static function dateToWatchValue(date:Date) : Int {
		return date.getHours() <= 11 ? date.getHours() : date.getHours()-12;
	}

	private static function getWindFlexData(houseId:Int, now:Date) : Array<Float> {

		var args = new haxe.ds.StringMap<String>();
		args.set("houseId", '$houseId');
		args.set("now", now.toString());
		args.set("timespanFrom", '0');
		args.set("timespanTo", '12');
		args.set("granularity", "15m");

		var rv = WeatherQueries.getWindDataSimpleArray(args);
		if(rv.length>3) {
			while(rv.length<48) { //While the array is too small;
				rv.push(rv[rv.length-1]); //Duplicate last element. 
			}
		}
		return rv;
	} 

	private static function getPriceFlexData(from:Date, to:Date) : Array<Float> {
		var args = new haxe.ds.StringMap<String>();
		args.set("from", from.toString());
		args.set("to", to.toString());
		var rv = PriceQueries.getPriceDataSimpleArray(args);
		if(rv.length>3) {
			while(rv.length<48){ //While the array is too small:
				rv.push(rv[rv.length-1]); //Push/dupliate the last element. 
			}
		}
		return rv;
	}

	private static function getLoadFlexData(from:Date, to:Date) : Array<Float> {

		var v:Dynamic = CommonConsumptionQueries.getCommonConsumption(0, 12);

		var result = new Array<Float>();
		var slots:Array<Dynamic> = v.slots;
		for(value in slots) {
			result.push(value.dk1/10);
		}
		if(result.length>3){
			while(result.length<48) {
				result.push(result[result.length-1]);
			}
		}

		return result;
	}

	private static function thresholdToPctThreshold(range:{min:Float, max:Float}, threshold:Float) : Float {
		return (threshold - range.min) / (range.max - range.min);
	}

	//This is where the different values and thresholds are used to calculate a final "recomendation". 
	//To tweak the system, work with this function. 
	private static function valuesToUsePower(wind:Float, windThres:Float, load:Float, loadThres:Float, price:Float, priceThres:Float) : UsePower {

		//Calculate the weight of each element, based on the thresholds. 
		var windVal = 0.0;
		if(wind > windThres) {
			windVal = wind / (1.0-windThres);
		}
		
		var loadVal = 0.0;
		if(load<loadThres) {
			loadVal = 1.0 - (load / (1.0-loadThres));
		}

		var priceVal = 0.0;
		if(price<priceThres) {
			priceVal = 1.0 - (price / (1.0 - priceThres));
		}

		//Then return the "winning" value. 
		if(windVal>0 && windVal >= loadVal && windVal >= priceVal)
			return Wind;

		if(priceVal>0 && priceVal >= windVal && priceVal >= loadVal)
			return Price;

		if(loadVal>0 && loadVal>=priceVal && loadVal >= windVal)
			return Load; 

		return None; //Or return None if there is no need for use power at this time. 

	}


}