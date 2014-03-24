///<reference path="../References.ts" />

module PowerViz {

	export class PriceController extends ControllerBase {

		_view:Price_View = null;

		_priceData:string;
		_priceDataObtainer:DataObtainer;
		_priceDataObtained:boolean = false;

		_consumptionComponent:ConsumptionComponent;

		constructor() {
			super();
			this._consumptionComponent = new ConsumptionComponent();
		}

		public connectView=(view:Price_View)=> {
			this._view = view;
			this._view.controller = this;
		}

		public onTime=()=> {

			this._consumptionComponent.onDataObtained = this.onConsumptionDataObtained;
			this._consumptionComponent.requestData();

			var url="../server/query/?query=getPowerPrices"; 
			this._priceDataObtainer = new DataObtainer(url);	
			this._priceDataObtainer.onDataObtained = this.onPriceDataObtained;
			this._priceDataObtainer.obtain();
		}

		private onConsumptionDataObtained=()=> {

			this.sendDataToView();

		}

		private onPriceDataObtained=(data:string)=> {
			if(data!="") {
				this._priceData = data;
				this._priceDataObtained = true;
				this.sendDataToView();
			}
		}

		private formPriceData=(data:any) : any => {

			var max = 0.5;
			
			var result:any = [];
			for(var i=0; i<data.slots.length; i++) {
				result[i] = {"x":i, "y":(data.slots[i].dk1 / max) * 100 };
			}

			if(data.slots.length==0) {
				result[0] = {"x":0, "y":0};
			}

			while(result.length<96) {
				result[result.length] = result[result.length-1];
			}
			return result;
		}

		private sendDataToView=()=> {

			if(this._priceDataObtained==true && this._consumptionComponent.allObtained==true) {

				//Form price data etc.
				var priceJson = jQuery.parseJSON(this._priceData);
				var priceArray = this.formPriceData(priceJson);

				console.log(priceArray);

				if(this._view != null)
					this._view.update(this._consumptionComponent.consumptionData, priceArray);

				this._priceDataObtained = false;
				this._consumptionComponent.allObtained = false;
			}

		}

		public static test() {
			var ctrl = new PriceController();
			ctrl.enable();
		}


	}

}