///<reference path="../References.ts" />

module PowerViz {

	export class EnvController implements Controller {

		_timer:any = null;
		_frequency:number = 15*60	; //seconds between updates. 
		_enabled:boolean = false;

		_consumptionData:string;
		_windData:string; 

		_consumptionDataObtained:boolean = false;
		_windDataObtained:boolean = false; 

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

			this.requestConsumptionData();
			this.requestWindData();

		}

		private requestConsumptionData=()=> {

			var request = new XMLHttpRequest();
			var that = this;
			request.onreadystatechange = function() {
				console.log(request.responseText);
				that.onConsumptionDataObtained(request.responseText);
			}
			var to = new Date();
			var from = new Date();
			from.setHours(to.getHours()-12);

			var froms = DateHelper.dateToJsString(from);
			var tos = DateHelper.dateToJsString(to);
			var url = "../server/query/?query=getTotalConsumption&houseId=1&from="+froms+"&to="+tos;
			console.log("Getting data from " + url);
			request.open("GET", url);
			request.send();
		}

		private onConsumptionDataObtained=(data:string)=> {
			//Form the data into something that the view can present on screen.

			if(data != "") {
				this._consumptionData = data;
				this._consumptionDataObtained=true;
				this.sendDataToView();
			}

		}

		private requestWindData=()=> {

			var request = new XMLHttpRequest();
			var that = this;
			request.onreadystatechange = function() {
				console.log(request.responseText);
				that.onWindDataObtained(request.responseText);
			}
			var to = new Date();
			var from = new Date();
			from.setHours(to.getHours()-12);
			to.setHours(from.getHours()+24);

			var froms = DateHelper.dateToJsString(from);
			var tos = DateHelper.dateToJsString(to);
			var url = "../server/query/?query=getWind&houseId=1&from="+froms+"&to="+tos;
			console.log("Getting data from " + url);
			request.open("GET", url);
			request.send();
		}

		private onWindDataObtained=(data:string)=> {

			if(data!="") {
				this._windData = data;
				this._windDataObtained = true;
				this.sendDataToView();
			}
		}

		private sendDataToView=()=> {
			if(this._consumptionDataObtained && this._windDataObtained) {
				//Handle the data and make it into some useful form. 

				console.log("Both pieces of data was obtained");
				console.log(this._windData);
				console.log(this._consumptionData);
				console.log("----");

			}
			this._windDataObtained = false;
			this._consumptionDataObtained = false;
		}

		public static test() {
			var ctrl = new EnvController();
			ctrl.enable();
		}


	}

}