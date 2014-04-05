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

	public static function getCommonConsumption() : Dynamic {

		var now = Date.now();
		now = now.delta(DateTools.hours(2)); //Fucking sommertid!!!!!
		
		var yesterday = now.delta(DateTools.hours(-12));
		var tomorrow = now.delta(DateTools.hours(12));

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

		//trace(query);

		var result = {slots:new Array<{from:String, to:String, dk1:Float, dk2:Float }>()};

		var cnx = DbConnect.connect();
		var qresult = cnx.request(query);
		for(row in qresult) {
			result.slots.push({from:"", to:"", dk1:row.load*11, dk2:row.load*11});
		}

		return result;

	}

	//Calculates the common consumption and puts it into the CommonConsumption table.
	public static function calculateCommonConsumption(args:StringMap<String>) : Dynamic {

		var weeks = args.get("weeks").parseInt();

		for(i in 0...7) {
			getConsumptionOnWeekday([1,2,3], i, weeks);
		}

		return null;
	}

	//Returns the consumption on a specific weekday weeks back in time for a specific houseId.
	//
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


	//Returns the consumption from three previous weeks in the 12 hour window.
	//Returns a query result. 
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


		var whereString = "(";
		for(i in 0...ids.length) {
			whereString += '( houseId = ${ids[i]} AND $intervalsString )';
			if(i<ids.length-1)
				whereString += " OR ";
		}
		whereString += ")";

		var query = 'SELECT TotalConsumption.time AS "time", 
						SUM(TotalConsumption.load)/COUNT(TotalConsumption.load) as "load" 
						FROM TotalConsumption WHERE ${whereString}
						GROUP BY HOUR(time), MINUTE(time)
						ORDER BY DAY(time), HOUR(time), MINUTE(time) ASC;';



		var cnx = DbConnect.connect();
		var reqresult:ResultSet = cnx.request(query);
		return reqresult;
	}



}


