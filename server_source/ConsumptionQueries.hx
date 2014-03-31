package ;

import haxe.ds.StringMap;
import sys.db.ResultSet;

using Std;
using DateTools;
using Lambda;

//Return types for consumption data:
typedef ConsumptionEntry = {
	@:optional var outletId:Int;
	@:optional var activityId:Int;
	var from:String; 
	var to:String;
	var load:Float;
	@:optional var weekNumber:Int;
}

typedef ConsumptionDataset = {
	var houseId:Int; 
	var granularity:String;
	var maxLoad:Int;
	var consumption:Array<ConsumptionEntry>;
}


class ConsumptionQueries {
	
	public static function getTotalConsumption(args:StringMap<String>) : Dynamic {

		var granularity = args.get("granularity");
		var houseId:Int = Std.parseInt(args.get("houseId"));
		var from:String = args.get("from");
		var to:String = args.get("to");
		var timespan:Int = args.get("timespan").parseInt(); //Timespan in hours. 

		var now:Date = Date.now().delta(DateTools.hours(1)); 

		if(args.get("timespan") != null) {
			if(timespan<0) {
				to = now.toString();
				from = now.delta(DateTools.hours(timespan)).toString(); //DateTools.delta(now, DateTools.hours(timespan)).toString();
			}
		}

		if(granularity==null)
			granularity="";

		try {

			//Check arguments:
			if(granularity==null || houseId==null || from==null || to==null) {
				throw 'Error handling query. Arguments required are houseId, from, to and granularity.';
			}

			if(["", "1H", "1D", "1W", "1M"].has(granularity)==false)
				throw 'Error handling query. Invalid granularity ${granularity}';

			var max:Int = getLoadMax(houseId);

			//Connect and query:
			var cnx = DbConnect.connect();

			var query = 'SELECT * FROM TotalConsumption${granularity} WHERE houseId=${houseId} AND time>="${from}" AND time<="${to}";';

			var result = cnx.request(query);

			if(result==null)
				throw 'Error getting total consumtion data with granularity: ${granularity}.';

			//Format data:
			var data:ConsumptionDataset = {houseId : houseId, granularity : granularity, maxLoad:max, consumption : new Array<ConsumptionEntry>()};
			var entry:ConsumptionEntry;
			var interval:{from:Date, to:Date} = null;
			for(row in result) {
				interval = granularityToTimespan(row.time, granularity);
				entry = {from : Helpers.dateToJSFormat(interval.from), to : Helpers.dateToJSFormat(interval.to), load : row.load, weekNumber : row.week};
				data.consumption.push(entry);
			}

			return data;
		}
		catch(err:String) {
			return {error:'Exception caught: ${err}'};
		}

		return {error: "Unexpected end to getTotalConsumption()."};
	}

	public static function getOutletConsumption(args:StringMap<String>) : Dynamic {
		var granularity = args.get("granularity");
		var houseId:Int = args.get("houseId").parseInt();
		var from:String = args.get("from");
		var to:String = args.get("to");

		return {error : "getOutletConsumption not yet implemented."}; 
	}

	public static function getLoadMax(houseId:Int) : Int {
		var cnx = DbConnect.connect();
		var query = 'SELECT loadMax FROM House WHERE houseId = ${houseId};';
		var result = cnx.request(query);
		var r:Int=0;
		for(row in result) {
			r = row.loadMax;
		}
		return r;
	}


	public static function getActivityConsumption(args:StringMap<String>) : Dynamic {
		return {error:"getActivityConsumption not yet implemented."};
	}

	//Returns the "to" element of a timespan, based on the granularity passed. 
	public static function granularityToTimespan(from:Date, granularity:String) : {from:Date, to:Date} {

		var fd:Date=null;

		switch(granularity) {
			case "":
				fd =  from.delta(-DateTools.minutes(15)); 
				return {from:fd, to:fd.delta(DateTools.minutes(15))};
			case "1H":
				fd = from;
				return {from:fd, to:fd.delta(DateTools.hours(1))};
			case "1D":
				fd = new Date(from.getFullYear(), from.getMonth(), from.getDate(), 0,0,0);
				return {from:fd, to:fd.delta(DateTools.hours(24))};
			case "1W":
				fd = getFirstDayOfWeek(from);
				return {from:fd, to:fd.delta(DateTools.days(7))};
			case "1M":
				fd = new Date(from.getFullYear(), from.getMonth(), 1, 0,0,0);
				return {from:fd, to:fd.delta(DateTools.days(DateTools.getMonthDays(fd)))};
		}

		return null; 
	}

	public static function getFirstDayOfWeek(day:Date) : Date {
		var d = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0,0,0);
		var weekday = d.getDay() + 6; //Weekday, starting on sunday.
		while(weekday>=7) //We want to start on a monday. 
			weekday -= 7;
		return d.delta(-DateTools.days(weekday));
	}

	public static function getConsumptionPrognosisAverage(args:StringMap<String>) : Dynamic {

		var houseId:Int = args.get("houseId").parseInt();

		try {

			var cnx = DbConnect.connect();
			var reqresult = getConsumptionWeeksBack(args, 5);

			var result = new StringMap<Array<ConsumptionEntry>>();
			var from:Date;
			var to:Date;
			var key:String;
			for(res in reqresult) {
				from = res.time;
				to = from.delta(DateTools.minutes(15));

				key = ""+res.time.getHours() + ":" + res.time.getMinutes() + ":" + res.time.getSeconds(); 
				if(result.get(key)==null) {
					result.set(key, new Array<ConsumptionEntry>()); }
				result.get(key).push({ from : from.toString(), to : to.toString(), load : res.load });
				
			}

			var averages = calculateAverages(result);

			var rtn:ConsumptionDataset = {houseId:houseId, granularity:"", maxLoad:0,  consumption:averages};
			return rtn;

		}
		catch(err:String) {
			return {error:'${err}'};
		}

		return {error:"Unexpected function end"};
		
	}

	public static function getConsumptionPrognosisMedian(args:StringMap<String>) : Dynamic {

		var houseId:Int = args.get("houseId").parseInt();

		try {

			var reqresult:ResultSet = getConsumptionWeeksBack(args, 5);

			var result = new StringMap<Array<ConsumptionEntry>>();
			var from:Date;
			var to:Date;
			var key:String;
			for(res in reqresult) {
				from = res.time;
				to = from.delta(DateTools.minutes(15));

				key = ""+res.time.getHours() + ":" + res.time.getMinutes() + ":" + res.time.getSeconds(); 
				if(result.get(key)==null) {
					result.set(key, new Array<ConsumptionEntry>()); }
				result.get(key).push({ from : from.toString(), to : to.toString(), load : res.load });
				
			}

			var medians = calculateMedians(result);

			return {houseId:houseId, granularity:"", maxLoad:0,  consumption:medians};

		}
		catch(err:String) {
			return {error:'${err}'};
		}

		return {error:"Unexpected function end"};

	}

	//Returns the consumption from three previous weeks in the 12 hour window.
	//Returns a query result. 
	private static function getConsumptionWeeksBack(args:StringMap<String>, numWeeks:Int) : ResultSet {

		var houseId:Int = args.get("houseId").parseInt();

		var numElements = numWeeks;

		var now = Date.now().delta( DateTools.hours(1));
		var froms = new Array<Date>();
		var tos = new Array<Date>();
		for(i in 0...numElements) {
			froms[i] = now.delta(-DateTools.days(7+(i*7)));
			tos[i] = froms[i].delta(DateTools.hours(12));
		}
/*
		var query = 'SELECT TotalConsumption.time AS "time", 
						TotalConsumption.load as "load" 
						FROM TotalConsumption WHERE 
						houseId = ${houseId} AND (
						(time >= "${froms[0].toString()}" AND time < "${tos[0].toString()}") OR 
						(time >= "${froms[1].toString()}" AND time < "${tos[1].toString()}") OR
						(time >= "${froms[2].toString()}" AND time < "${tos[2].toString()}") OR 
						(time >= "${froms[3].toString()}" AND time < "${tos[3].toString()}") OR 
						(time >= "${froms[4].toString()}" AND time < "${tos[4].toString()}") )
						ORDER BY YEAR(time), MONTH(TIME), DAY(time), HOUR(time), MINUTE(time) ASC;'; */

		var query = 'SELECT TotalConsumption.time AS "time", 
						TotalConsumption.load as "load" 
						FROM TotalConsumption WHERE 
						houseId = ${houseId} AND (';

		for(j in 0...numElements) {
			query += '(time >= "${froms[j].toString()}" AND time < "${tos[j].toString()}")';
			if(j!=(numElements-1))
				query += "OR";
		}

		query += ') ORDER BY YEAR(time), MONTH(TIME), DAY(time), HOUR(time), MINUTE(time) ASC;';

		var cnx = DbConnect.connect();
		var reqresult:ResultSet = cnx.request(query);
		return reqresult;
	}

	private static function calculateMedians(map:StringMap<Array<ConsumptionEntry>>) : Array<ConsumptionEntry> {

		var result = new Array<ConsumptionEntry>();

		for(elm in map) {
			result.push(calculateMedian(elm));
		}

		return result;

	}

	private static function calculateAverages(map:StringMap<Array<ConsumptionEntry>>) : Array<ConsumptionEntry> {
		var result = new Array<ConsumptionEntry>();
		for(elm in map) {
			result.push(calculateAverage(elm));
		}
		return result;
	}

	private static function calculateMedian(array:Array<ConsumptionEntry>) : ConsumptionEntry {

		haxe.ds.ArraySort.sort(array, function(x:ConsumptionEntry, y:ConsumptionEntry){

			if(x.load == y.load)
				return 0;
			if(x.load < y.load)
				return -1;

			return 1;

			});

		return array[Math.floor(array.length/2)];

	}


	private static function calculateAverage(array:Array<ConsumptionEntry>) : ConsumptionEntry {

		var total:Float = 0;
		for(elm in array) {
			total += elm.load;
		}
		return {from:array[0].from, to:array[0].to, load:total / array.length};
	}


}

