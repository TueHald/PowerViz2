///<reference path="../References.ts" />

module PowerViz {

	export class FlexController extends ControllerBase {

		_view:Flex_View;

		_consumptionComponent:ConsumptionComponent;

		_nationalObtainer:DataObtainer;
		_nationalData:string;
		_nationalDataObtained:boolean=false;

		constructor() {
			super();
			this._consumptionComponent = new ConsumptionComponent();
		}

		public connectView=(view:Flex_View)=> {
			this._view = view;
			this._view.controller = this;
		}

		public onTime=()=> {
			this._consumptionComponent.onDataObtained = this.onConsumptionDataObtained;
			this._consumptionComponent.requestData();
			this.requestNationalData();
		}


		public onConsumptionDataObtained=()=> {
			console.log("Data obtained: " + this._consumptionComponent.consumptionData);
		}

		public onPrognosisDataObtained(data:string) {

		}

		public requestNationalData=()=> {

			var url="";

			this._nationalObtainer = new DataObtainer(url);
			this._nationalObtainer.onDataObtained = this.onNationalDataObtained;
			this._nationalObtainer.obtain();

		}

		public onNationalDataObtained=(data:string)=> {

		}

		private sendDataToView=()=> {

			if(this._nationalDataObtained == true && this._consumptionComponent.allObtained==true) {

				//Form data etc.

				//Then send to the view.

			}

		}


		//Simple testing...
		public static test() {

			var ctrl = new FlexController();
			ctrl.enable();

		}

	}

}

