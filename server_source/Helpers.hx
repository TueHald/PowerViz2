package;

using DateTools;

class Helpers {

	public static function dateToJSFormat(d:Date) : String {
		return DateTools.format(d, "%Y-%m-%dT%H:%M:%S");
	}

	//Takes a JavaScript date format string (yyyy-mm-ddThh-mm-ss) and returns a Date object.
	public static function JsDateToDate(jsdate:String) {
		return Date.fromString( StringTools.replace(jsdate, "T", " ") );
	}

	//Parses a date of the form "dd-mm-yyyy" and returns a date.
	public static function parseNordpoolDate(date:String) : Date {
		var ss = date.split("-");
		return Date.fromString('${ss[2]}-${ss[1]}-${ss[0]}');
	}


	//------------------------
	//Week number functions:

	//Returns the latest date for a certain weekday. 
	//If a tuesday is 'now', the last weekday 1 returns the previous monday. 
	public static function getLastWeekday(now:Date, weekday:Int) : Date {

		var daysBack = 0;
		if(now.getDay() < weekday)
			daysBack = (now.getDay()-7) + (weekday - now.getDay());
		else
			daysBack = weekday - now.getDay();
		
		var day =  now.delta(DateTools.days(daysBack));
		return new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0,0,0);
	}

	public static function compareHoursMinutes(x:Date, y:Date) : Int {
		if(x.getHours() < y.getHours())
			return -1;
		if(x.getHours() > y.getHours())
			return 1;
		if(x.getHours() == y.getHours()) {
			if(x.getMinutes() < y.getMinutes())
				return -1;
			else if(x.getMinutes() > y.getMinutes())
				return 1;
			else
				return 0;
		}
		return 0;
	}


	//TODO:
	public static function getFirstWeekMonday(year:Int) : Date {
		var first = new Date(year, 1, 1, 0,0,0);
		if(weekDay(first)<=3) { //This is week 1. 
			
		}
		else {

		}
		return null;
	}

	//TODO:
	public static function getWeekNumber(day:Date) : Int {
		return -1;
	}

	//Returns the ISO-8601 day of the week, monday bein 0, sunday being 6.
	public static function weekDay(day:Date) : Int {
		var d = day.getDay();
		d += 6;
		while(d>=7)
			d -= 7;
		return d;
	}

	public static function getNearestPreviousQuarter(date:Date) : Date {
		var minutes = date.getMinutes() - (date.getMinutes()%15);
		return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), minutes, 0);
	}

}