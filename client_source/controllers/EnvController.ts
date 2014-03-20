///<reference path="../References.ts" />

module PowerViz {

	export class EnvController extends ControllerBase {

		_view:Env_View;

		_windData:string;

		_windDataObtained:boolean = false;

		_windObtainer:DataObtainer;

		_consumptionComponent:ConsumptionComponent;

		constructor() {
			super();
			this._consumptionComponent = new ConsumptionComponent();
		}


		public connectView=(view:Env_View)=> {
			this._view = view;
			this._view.controller = this;
		}

		public onTime=()=> {
			//Get data from the server and send it to the view.
			//Simple as that. Now, go implement it. 

			this._consumptionComponent.onDataObtained = this.onConsumptionDataObtained;
			this._consumptionComponent.requestData();
			this.requestWindData();
		}

		private onConsumptionDataObtained=()=> {
			this.sendDataToView();
		}

		private requestWindData=()=> {

			var now = new Date();
			var url = "../server/query/?query=getWind&houseId=" + ClientConfig.getHouseId() + "&timespanFrom=12&timespanTo=12&granularity=15m&now="+DateHelper.dateToJsString(now);

			this._windObtainer = new DataObtainer(url);
			this._windObtainer.onDataObtained = this.onWindDataObtained;
			this._windObtainer.obtain();

		}

		private onWindDataObtained=(data:string)=> {

			if(data!="") {
				this._windData = data;
				this._windDataObtained = true;
				this.sendDataToView();
			}
		}

		private formWindData=(windData:any) : any => {

			//Find out the first point in time for the first forecast element. 

			var windArray:any = [];
			for(var i=0; i<96; i++) {
				windArray[i] = {"x":i, "y":(windData.forecast[i].windSpeed/28)*100};
			}

			return windArray;
		}


		//This is very much a work in progress. 
		private sendDataToView=()=> {
			if(this._consumptionComponent.allObtained==true && this._windDataObtained==true) {
				//Handle the data and make it into some useful form. 

				var windData:any = jQuery.parseJSON(this._windData);

				if(windData.error!=null ) {
					console.log("Error!");
				}

				var windArray = this.formWindData(windData);

				this._windDataObtained = false;
				this._consumptionComponent.allObtained = false;

				this._view.update(this._consumptionComponent.consumptionData, windArray);
				
			}
			
		}

		public static test() {
			var ctrl = new EnvController();
			ctrl.enable();
		}


	}

}