package;

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

	public static function getFirstWeekMonday(year:Int) : Date {
		var first = new Date(year, 1, 1, 0,0,0);
		if(weekDay(first)<=3) { //This is week 1. 
			
		}
		else {

		}
		return null;
	}

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

}