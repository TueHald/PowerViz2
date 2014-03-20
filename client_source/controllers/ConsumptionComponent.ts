///<reference path="../References.ts" />

module PowerViz {
	
	//Component of all controllers, obtaining consumption data.
	export class ConsumptionComponent {

		_consumptionData:string;
		_prognosisData:string;

		_consumptionDataObtained:boolean = false;
		_prognosisDataObtained:boolean = false;

		_consumptionObtainer:DataObtainer;
		_prognosisObtainer:DataObtainer;

		public consumptionData:any;

		public allObtained:boolean = false;

		//Override this to get notification
		public onDataObtained() {}

		public requestData() {

			var url = "../server/query/?query=getTotalConsumption&timespan=-12&houseId="+ClientConfig.getHouseId();
			this._consumptionObtainer = new DataObtainer(url);
			this._consumptionObtainer.onDataObtained = this.onConsumptionDataObtained;
			this._consumptionObtainer.obtain();

			var urlProg = "../server/query/?query=getConsumptionPrognosis&houseId="+ClientConfig.getHouseId();

			this._prognosisObtainer = new DataObtainer(urlProg);
			this._prognosisObtainer.onDataObtained = this.onPrognosisDataObtained;
			this._prognosisObtainer.obtain();

		}

		private onConsumptionDataObtained=(data:string)=> {

			if(data != "") {
				this._consumptionData = data;
				this._consumptionDataObtained=true;
				this.prepareData();
			}
		}

		private onPrognosisDataObtained=(data:string)=> {

			if(data != "") {
				this._prognosisData = data;
				this._prognosisDataObtained = true;
				this.prepareData();
			}
		}

		private prepareData=()=> {

			if(this._consumptionDataObtained==true && this._prognosisDataObtained==true) {
				
				this._prognosisDataObtained = false;
				this._consumptionDataObtained = false;

				var consumptionData:any = jQuery.parseJSON(this._consumptionData);
				var prognosisData:any = jQuery.parseJSON(this._prognosisData);

				this.consumptionData = DataFormat.formConsumptionAndPrognosisData(consumptionData, prognosisData);

				this.allObtained=true;
				this.onDataObtained();

			}
		}


	}

}