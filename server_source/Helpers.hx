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

	//Normalizes the array, so that the largest element is scaled to 1,0
	public static function normalize(array:Array<Float>, ?_max:Float, ?_zeroIsLowest:Bool) : Array<Float> {
		var max:Float = 0;
		var result = new Array<Float>();
		if(_max==null) { //Calculate the max.
			for(a in array) {
				if(a > max)
					max = a;
			}

			if(max==0) {
				max = 1;
			}
		}
		else{ //Use our own max thing. 
			max = _max;
		}
		
		var elm:Float=0;
		for(b in array) {
			elm = b / max;
			elm = elm > 1.0 ? 1.0 : elm; //Limit to 1.0.
			result.push(elm);
		}
		return result;
	}

	//Normalizes the array, so that the smallest element is 0 and the largest 1.0. 
	public static function superNormalize(array:Array<Float>) {
		var max:Float = 0;
		for(a in array){
			if(a>max)
				max = a;
		}

		var min:Float = max;
		for(b in array) {
			if(b < min) 
				min = b;
		}

		var result = new Array<Float>();
		for(c in array) {
			result.push((c - min) / (max-min));
		}
		return result;
	}


	public static function normalizeInRange(array:Array<Float>, range:{min:Float, max:Float}) : Array<Float> {
		var result = new Array<Float>();
		var temp:Float=0;
		for(c in array) {
			temp = (c - range.min) / (range.max-range.min);
			temp = temp<0 ? 0 : temp; //Limit to the 0-1 range.
			temp = temp>1 ? 1 : temp;
			result.push(temp);
		}
		return result;
	}

	//Returns the minimum and the maximum value of an array. 
	//Returns null if the array is empty. 
	public static function getMinMax(array:Array<Float>) : {min:Float, max:Float} {
		if(array.length==0)
			return null; 
		var max:Float = array[0];
		for(v in array) {
			if(v>max)
				max = v;
		}
		var min:Float = max;
		for(x in array) {
			if(x < min)
				min = x;
		}
		return {min:min, max:max};
	}

	public static function limitDigits(value:Float, n:Int=2) : Float {
		if(n<1)
			throw "n should be >= 1 in Helpers.limitDigits()";

		var sv = Math.pow(10, n); //Shifting value. 

		return (Std.int(value * sv) / sv);
	}

	//Converts the array into only using n digits. 
	//Modifies the array in place. 
	public static function limitArrayDigits(array:Array<Float>, n:Int=2) {
		for(i in 0...array.length) {
			array[i] = limitDigits(array[i], n);
		}
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

	//Calculates the quarter index (0-95) based on the specified date. 
	public static function dateToIndex(date:Date) : Int {
		return (date.getHours()*4) + Std.int(Math.floor(date.getMinutes()/15));
	}


}