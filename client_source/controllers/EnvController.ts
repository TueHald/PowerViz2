///<reference path="../References.ts" />

module PowerViz {

	export class EnvController implements Controller {

		_view:Env_View;

		_timer:any = null;
		_frequency:number = 15*60	; //seconds between updates. 
		_enabled:boolean = false;

		_consumptionData:string;
		_windData:string; 

		_consumptionDataObtained:boolean = false;
		_windDataObtained:boolean = false; 


		public connectView=(view:Env_View)=> {
			this._view = view;
			this._view.controller = this;
		}

		public enable=()=> {

			//Start timer.
			if(this._timer==null) { //Only start the timer if it is not already running.
				this._timer = setInterval(this.onTime, this._frequency*1000);
			}
			this._enabled = true;
			this.onTime();
			console.log("EnvController enabled");
		
		}


		public disable=()=> {

			//Stop timer.
			if(this._timer!=null) {
				clearInterval(this._timer);
				this._timer=null;
			}
			this._enabled = false;
			console.log("EnvController disabled");

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
				if(request.readyState == 4) {
					that.onConsumptionDataObtained(request.responseText); 
				}
			}

			var url = "../server/query/?query=getTotalConsumption&houseId=1&timespan=-12";
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
				if(request.readyState == 4) {
					that.onWindDataObtained(request.responseText);
				}
			}

			var url = "../server/query/?query=getWind&houseId=1&timespan=-12";
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

		//This is very much a work in progress. 
		private sendDataToView=()=> {
			if(this._consumptionDataObtained==true && this._windDataObtained==true) {
				//Handle the data and make it into some useful form. 

				var windData:any = jQuery.parseJSON(this._windData);
				var consumptionData:any = jQuery.parseJSON(this._consumptionData);

				if(windData.error!=null || consumptionData.error!=null) {
					console.log("Error!");
				}
				
				//Make array of consumption data (48 points)
				var consDataArray:any = [];
				var max:number = 1200;
				for(var j=0; j<consumptionData.consumption.length; j++) {
					consDataArray[j] = {"x":j, "y":(consumptionData.consumption[j].load/max)*100};
				}
				while(consDataArray.length<48) {
					consDataArray[consDataArray.length] = consDataArray[consDataArray.length-1];
				}	

				//TEMP: Make the array 96 in length. This should be prognosis data.
				while(consDataArray.length<96) {
					consDataArray[consDataArray.length] = consDataArray[consDataArray.length-1];
				}

				//TODO: Add consumption prognosis data to the consDataArray, 
						//so that first 48 is consumed energy, last 48 is expected consumption.

				//Make array of weather data:
				for(var i=0; i<windData.forecast.length; i++) {
					//console.log(windData.forecast[i].windSpeed);
				}

				var windDataArray:any = [];
				for(var k=0; k<96; k++) {
					windDataArray[k] = {"x":k, "y":42};
				}

				this._windDataObtained = false;
				this._consumptionDataObtained = false;

				this._view.update(consDataArray, windDataArray);
			}
			
		}

		public static test() {
			var ctrl = new EnvController();
			ctrl.enable();
		}


	}

}