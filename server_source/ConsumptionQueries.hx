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

typedef ConsumptionResult = {
	@:optional var error:String; 
	@:optional var data:ConsumptionDataset;
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
	public static function getTotalConsumption(args:StringMap<String>) : ConsumptionResult {

		var granularity = args.get("granularity");
		var houseId:Int = Std.parseInt(args.get("houseId"));
		var from:String = args.get("from");
		var to:String = args.get("to");

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
			for(row in result) {
				entry = {from : row.time, to : row.time, load : row.load, weekNumber : row.week};
				data.consumption.push(entry);
			}

			return {data:data};
		}
		catch(err:String) {
			return {error:'Exception caught: ${err}'};
		}

		return {error: "Unexpected end to getTotalConsumption()."};
	}

	public static function getOutletConsumption(args:StringMap<String>) : ConsumptionResult {
		var granularity = args.get("granularity");
		var houseId:Int = Std.parseInt(args.get("houseId"));
		var from:String = args.get("from");
		var to:String = args.get("to");

		return null; 
	}


	public static function getActivityConsumption(args:StringMap<String>) : Dynamic {
		return {error:"getActivityConsumption not yet implemented."};
	}


}