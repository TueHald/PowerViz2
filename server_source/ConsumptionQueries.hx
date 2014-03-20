package ;

import haxe.ds.StringMap;

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

			//Connect and query:
			var cnx = DbConnect.connect();

			var query = 'SELECT * FROM TotalConsumption${granularity} WHERE houseId=${houseId} AND time>="${from}" AND time<="${to}";';

			var result = cnx.request(query);

			if(result==null)
				throw 'Error getting total consumtion data with granularity: ${granularity}.';

			//Format data:
			var data:ConsumptionDataset = {houseId : houseId, granularity : granularity, consumption : new Array<ConsumptionEntry>()};
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

	public static function getConsumptionPrognosis(args:StringMap<String>) : Dynamic {

		var houseId:Int = args.get("houseId").parseInt();

		var now = Date.now().delta( DateTools.hours(1));
		var froms = new Array<Date>();
		var tos = new Array<Date>();
		for(i in 0...3) {
			froms[i] = now.delta(-DateTools.days(7+(i*7)));
			tos[i] = froms[i].delta(DateTools.hours(12));
		}

		var query = 'SELECT TotalConsumption.time AS "time", 
						SUM(TotalConsumption.load) as "load" 
						FROM TotalConsumption WHERE 
						houseId = ${houseId} AND (
						(time >= "${froms[0].toString()}" AND time < "${tos[0].toString()}") OR 
						(time >= "${froms[1].toString()}" AND time < "${tos[1].toString()}") OR
						(time >= "${froms[2].toString()}" AND time < "${tos[2].toString()}") )
						GROUP BY TotalConsumption.houseId, HOUR(time), MINUTE(time)
						ORDER BY YEAR(time), MONTH(TIME), DAY(time), HOUR(time), MINUTE(time) ASC;'; 

		try {

			var cnx = DbConnect.connect();
			var reqresult = cnx.request(query);

			var result = new Array<ConsumptionEntry>();
			var from:Date;
			var to:Date;
			for(res in reqresult) {
				from = res.time;
				to = DateTools.delta(from, DateTools.minutes(15));
				result.push({	from : from.toString(), 
								to : to.toString(),
								load : res.load/3});
			}

			var rtn:ConsumptionDataset = {houseId:1, granularity:"", consumption:result};
			return rtn;

		}
		catch(err:String) {
			return {error:'${err}'};
		}

		return {error:"Unexpected function end"};
		
	}


}