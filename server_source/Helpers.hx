package;

class Helpers {

	public static function dateToJSFormat(d:Date) : String {
		return DateTools.format(d, "%Y-%m-%dT%H:%M:%S");
	}

}