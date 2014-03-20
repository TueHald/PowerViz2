package ;

import haxe.ds.StringMap;

using DateTools;
using Lambda;
using Std;

class InteractionLog {

	public static function logInteraction(args:StringMap<String>) : Dynamic {

		try {

			var houseId:Int = args.get("houseId").parseInt();
			var time:Date = Date.now().delta(DateTools.hours(1));
			var screen:String = args.get("screen");
			var data1:String = args.get("data1")!=null ? args.get("data1") : "";
			var data2:String = args.get("data2")!=null ? args.get("data2") : "";

			var query = 'INSERT INTO DisplayLog2 	
						(houseId, time, screen, data1, data2) VALUES 
						(${houseId}, "${time.toString()}", "${screen}", "${data1}", "${data2}");';

			var cnx = DbConnect.connect();
			cnx.request(query);

		}
		catch(err:String) {
			return {error:err};
		}

		return null;

	}

}