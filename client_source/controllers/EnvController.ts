///<reference path="../References.ts" />

module PowerViz {

	export class EnvController implements Controller {

		_timer:any = null;
		_frequency:number = 15; //seconds between updates. 
		_enabled:boolean = false;

		constructor() {

		}

		public enable=()=> {

			//Start timer.
			if(this._timer==null) { //Only start the timer if it is not already running.
				this._timer = setInterval(this.onTime, this._frequency*1000);
			}
			this._enabled = true;
			this.onTime();
		
		}


		public disable=()=> {

			//Stop timer.
			if(this._timer!=null) {
				clearInterval(this._timer);
				this._timer=null;
			}
			this._enabled = false;

		}


		public onTime=()=> {
			//Get data from the server and send it to the view.
			//Simple as that. Now, go implement it. 

			var request = new XMLHttpRequest();
			request.onreadystatechange = function() {

			}
			var to = new Date();
			var from = new Date();
			from.setHours(to.getHours()-12);

			var froms = DateHelper.dateToJsString(from);
			var tos = DateHelper.dateToJsString(to);
			var url = "../server/query/?query=getTotalConsumption&houseId=1&from="+froms+"&to="+tos;
			console.log("Getting data from " + url);
			request.open("GET", url);

		}

		public static test() {
			var ctrl = new EnvController();
			ctrl.enable();
		}


	}

}