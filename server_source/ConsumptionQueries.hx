package;

import haxe.ds.StringMap;

//Return types for consumption data:
typedef ConsumptionEntry = {
	@:optional var outletId:Int;
	@:optional var activityId:Int;
	var from:Date; 
	var to:Date;
	var load:Int;
	@:optional var weekNumber:Int;
}

typedef ConsumptionDataset = {
	var houseId:Int; 
	var granularity:String;
	var consumption:Array<ConsumptionEntry>;
}



class ConsumptionQueries {
	
		/*
	//Returns a dynamic object of the form:
	{
		"houseId" : number,
		"granularity" : string,
		"consumption" : [ 
			{
				"from" : datetime,
				"to" : datetime,
				"load" : number,
				"weekNumber" : number //optional.
			}
		]
	}
	*/
	public static function getTotalConsumption(args:StringMap<String>) : Dynamic {

		var granularity = args.get("granularity");
		var houseId:Int = Std.parseInt(args.get("houseId"));
		var from:String = args.get("from");
		var to:String = args.get("to");
		var timespan:Int = Std.parseInt(args.get("timespan")); //Timespan in hours. 

		if(args.get("timespan") != null) {
			if(timespan<0) {
				to = Date.now().toString();
				from = DateTools.delta(Date.now(), DateTools.hours(timespan)).toString();
			}
		}

		if(granularity==null)
			granularity="";

		try {

			//Check arguments:
			if(granularity==null || houseId==null || from==null || to==null) {
				throw 'Error handling query. Arguments required are houseId, from, to and granularity.';
			}

			if(Lambda.has(["", "1H", "1D", "1W", "1M"], granularity)==false)
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
				entry = {from : interval.from, to : interval.to, load : row.load, weekNumber : row.week};
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
		var houseId:Int = Std.parseInt(args.get("houseId"));
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
				fd = DateTools.delta(from, -DateTools.minutes(15));
				return {from:fd, to:DateTools.delta(fd, DateTools.minutes(15))};
			case "1H":
				fd = from;
				return {from:fd, to:DateTools.delta(fd, DateTools.hours(1))};
			case "1D":
				fd = new Date(from.getFullYear(), from.getMonth(), from.getDate(), 0,0,0);
				return {from:fd, to:DateTools.delta(fd, DateTools.hours(24))};
			case "1W":
				fd = getFirstDayOfWeek(from);
				return {from:fd, to:DateTools.delta(fd, DateTools.days(7))};
			case "1M":
				fd = new Date(from.getFullYear(), from.getMonth(), 1, 0,0,0);
				return {from:fd, to:DateTools.delta(fd, DateTools.days(DateTools.getMonthDays(fd)))};
		}

		return null; 
	}

	public static function getFirstDayOfWeek(day:Date) : Date {
		var d = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0,0,0);
		var weekday = d.getDay() + 6; //Weekday, starting on sunday.
		while(weekday>=7) //We want to start on a monday. 
			weekday -= 7;
		return DateTools.delta(d, -DateTools.days(weekday));
	}

	public function getConsumptionPrognosis(args:StringMap<String>) {
		//Make a SQL query that selects and groups consumption 


		var query = 'SELECT * FROM TotalConsumption WHERE '; 
		
		
	}


}