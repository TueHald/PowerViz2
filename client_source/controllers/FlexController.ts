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
			this.sendDataToView();
		}

		public requestNationalData=()=> {

			var url="../server/query/?query=getNationalConsumptionPrognosis";

			this._nationalObtainer = new DataObtainer(url);
			this._nationalObtainer.onDataObtained = this.onNationalDataObtained;
			this._nationalObtainer.obtain();
		}

		public onNationalDataObtained=(data:string)=> {
			if(data!="") {
				this._nationalData = data;
				this._nationalDataObtained = true;
				this.sendDataToView();
			}
		}

		private formPrognosisArray=(data:any) : any => {
			var max:number = 4000;
			var result:any = [];
			for(var i=0; i<data.slots.length; i++) {
				result[i] = {"x":i, "y":(data.slots[i].dk1/max)*100};
			}

			if(result.length==0) {
				result[0] = {"x":0, "y":0};
			}
			
			while(result.length<96) {
				result[result.length] = result[result.length-1];
			}
			return result;
		}

		private sendDataToView=()=> {

			if(this._nationalDataObtained == true && this._consumptionComponent.allObtained==true) {

				var progJson = jQuery.parseJSON(this._nationalData);
				var progArray = this.formPrognosisArray(progJson);
				
				this._view.update(this._consumptionComponent.consumptionData, progArray);

			}

		}


		//Simple testing...
		public static test() {

			var ctrl = new FlexController();
			ctrl.enable();

		}

	}

}

