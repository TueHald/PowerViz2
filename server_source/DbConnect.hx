package;

typedef ConnectionStruct = {
	var user:String;
	@:optional var socket:String;
	@:optional var port:Int;
	var pass:String;
	var host:String;
	var database:String;
}

class DbConnect {

	//Connects to the database and returns a DB connection. 
	public static function connect() : sys.db.Connection {
		
		var cnx = sys.db.Mysql.connect(readConnnectionConfig());

		if(cnx==null)
			throw "Error connecting to database";
			
		return cnx;
	}

	//Reads connection data from a JSON file.
	private static function readConnnectionConfig() : ConnectionStruct {
		var data = sys.io.File.getContent("cinf.json"); //cinf means connection info. 
		var json = haxe.Json.parse(data);
		return {user:json.user, pass:json.pass, host:json.host, database:json.database};
	}

}