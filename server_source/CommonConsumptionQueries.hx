package ;

import sys.db.ResultSet;
import haxe.ds.StringMap;


using DateTools;
using Std;

typedef CommonConsumption = {
	var weekday:Int;
	var time:Date;
	var load:Float;
};

class CommonConsumptionQueries {

	//WARNING: This function is a bit hacky, as it mimics another function using a crappy data format. 
	public static function getCommonConsumption(?hoursBeforeNow:Int, ?hoursAfterNow:Int) : Dynamic {

		var multiply:Float = 10; //Value multiplied with to achieve the proper scale. 

		var now = Date.now();
		now = now.delta(DateTools.hours(2)); //Fucking sommertid!!!!!
		
		var yesterday:Date = null;
		var tomorrow:Date = null;

		if(hoursBeforeNow!=null && hoursAfterNow!=null) {
			yesterday = now.delta(DateTools.hours(-hoursBeforeNow));
			tomorrow = now.delta(DateTools.hours(hoursAfterNow));			
		}
		else {
			yesterday = now.delta(DateTools.hours(-12));
			tomorrow = now.delta(DateTools.hours(12));	
		}

		var dayYesterday = yesterday.getDay();
		var dayTomorrow = tomorrow.getDay();

		yesterday = new Date(2000, 1,1,yesterday.getHours(), yesterday.getMinutes(), yesterday.getSeconds());
		tomorrow = new Date(2000, 1,1,tomorrow.getHours(), tomorrow.getMinutes(), tomorrow.getSeconds());


			var query = 'SELECT * 
			FROM 
			(
				(SELECT * FROM CommonConsumption 
				WHERE weekDay=${dayYesterday} AND 
				time>="${yesterday.toString()}" AND time<="2000-2-1 23:45:00" 
				ORDER BY time ASC)

				UNION

				(SELECT * FROM CommonConsumption 
				WHERE weekDay=${dayTomorrow} AND 
				time>="2000-2-1 00:00:00" AND time<="${tomorrow.toString()}" 
				ORDER BY time ASC )
			) AS today;' ;


		var result = {slots:new Array<{from:String, to:String, dk1:Float, dk2:Float }>()};

		var cnx = DbConnect.connect();
		var qresult = cnx.request(query);
		for(row in qresult) {
			result.slots.push({from:"", to:"", dk1:row.load*multiply, dk2:row.load*multiply});
		}

		return result;

	}

	public static function getCommonConsumptionSimpleArray(?hoursBeforeNow:Int, ?hoursAfterNow:Int) : Array<Float> {

		var data:{slots:Array<{from:String, to:String, dk1:Float, dk2:Float }>} = getCommonConsumption(hoursBeforeNow, hoursAfterNow);

		var result = new Array<Float>();
		for(entry in data.slots) {
			result.push(entry.dk1 + entry.dk2);
		}
		result = Helpers.normalize(result);

		return result;
	}

	//Calculates the common consumption and puts it into the CommonConsumption table.
	public static function calculateCommonConsumption(args:StringMap<String>) : Dynamic {

		var weeks = args.get("weeks").parseInt();
		var filter = args.get("filter").parseInt();

		if(weeks==null || weeks==0)
			throw "Weeks argument should be > 3";

		if(filter==null || filter%2 != 1)
			throw "Filter argument should be an odd number > 1";

		for(i in 0...7) {
			getConsumptionOnWeekday([1,2,3], i, weeks);
		}

		filterCommonConsumption(filter);

		return null;
	}

	//Calculates the consumption on a specific weekday weeks back in time for a specific houseId,
	//then stores it in the CommonConsumption table. 
	public static function getConsumptionOnWeekday(ids:Array<Int>, weekday:Int, weeks:Int) {

		var first = Helpers.getLastWeekday(Date.now(), weekday);
		first = new Date(first.getFullYear(), first.getMonth(), first.getDate(), 0,0,0);
		
		var consumptionArray : Array<CommonConsumption>;
		var resultArray = new Array<CommonConsumption>();

		var resultSet = requestConsumptionWeeksBack(ids, weekday, weeks);

		var cnx = DbConnect.connect();
		var query="";
		var tempDate:Date;
		for(row in resultSet) {
			tempDate = row.time;
			tempDate = new Date(2000, 1, 1, tempDate.getHours(), tempDate.getMinutes(), 0); //Use same date, different hours/minutes.
			query = 'REPLACE INTO CommonConsumption (`weekDay`, `time`, `load`) VALUES ($weekday, "${tempDate.toString()}", ${row.load});';
			cnx.request(query);
		}

	}


	//Returns the consumption on weekday from numWeeks previous weeks.
	//Returns a query ResultSet.
	private static function requestConsumptionWeeksBack(houseIds:Array<Int>, weekday:Int, numWeeks:Int) : ResultSet {

		var numElements = numWeeks;
		var ids = houseIds;
		var houseId = ids[0];

		var now = Helpers.getLastWeekday(Date.now(), weekday);
		now = now.delta(DateTools.minutes(15));

		var intervalsString="(";
		var froms = new Array<Date>();
		var tos = new Array<Date>();
		for(i in 0...numElements) {
			froms[i] = now.delta(-DateTools.days((i*7)));
			tos[i] = froms[i].delta(DateTools.hours(24));
			intervalsString += '(time >= "${froms[i].toString()}" AND time < "${tos[i].toString()}")';
			if(i<numElements-1)
				intervalsString += " OR ";
		}
		intervalsString += ")";
	
		//trace(intervalsString);

		var whereString = "(";
		for(i in 0...ids.length) {
			whereString += '( houseId = ${ids[i]} AND $intervalsString )';
			if(i<ids.length-1)
				whereString += " OR ";
		}
		whereString += ")";

		//trace(whereString);

		var query = 'SELECT TotalConsumption.time AS "time", 
						SUM(TotalConsumption.load)/COUNT(TotalConsumption.load) as "load" 
						FROM TotalConsumption WHERE ${whereString}
						GROUP BY HOUR(time), MINUTE(time)
						ORDER BY DAY(time), HOUR(time), MINUTE(time) ASC;';

		//trace(query);

		var cnx = DbConnect.connect();
		var reqresult:ResultSet = cnx.request(query);
		return reqresult;
	}

	private static function filterCommonConsumption(filterWidth:Int) {

		var query:String;
		var qresult:ResultSet;
		var oldArray:Array<CommonConsumption>;
		var newArray:Array<CommonConsumption>;

		query = 'SELECT * FROM CommonConsumption ORDER BY `weekDay`, `time` ASC;';

		qresult = DbConnect.connect().request(query);

		oldArray = new Array<CommonConsumption>();
		for(row in qresult) {
			oldArray.push({weekday:row.weekDay, time:row.time, load:row.load});
		}

		newArray = calcMovingAverage(oldArray, filterWidth);

		for(elm in newArray) {
			query = 'REPLACE INTO CommonConsumption (`weekDay`, `time`, `load`) 
						VALUES (${elm.weekday}, "${elm.time.toString()}", ${elm.load});';
			DbConnect.connect().request(query);
		}	

	}

	//Does a moving average smoothing of the entered array. 
	//Returns the result in a new array. 
	//Filter width should be an odd number. 
	private static function calcMovingAverage(array:Array<CommonConsumption>, filterWidth:Int) : Array<CommonConsumption> {

		var result = new Array<CommonConsumption>();
		var window = new List<CommonConsumption>();
		for(cc in array) {
			window.add(cc);
			while(window.length > filterWidth) {
				window.pop();
			}
			result.push(calcAverage(window));
		}
		return result;
	}

	//Calculates the average load of the list and returns it.
	//The last element in the list will be used for weekday and time fields.
	private static function calcAverage(list:List<CommonConsumption>) : CommonConsumption {
		var last:CommonConsumption;
		var load:Float=0;
		for(cc in list) {
			load += cc.load;
			last = cc;
		}
		return {weekday:last.weekday, time:last.time, load:load/list.length};
	}

}


