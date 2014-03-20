///<reference path="../References.ts" />
///<reference path="parseUrl.ts" />

module PowerViz {

	export class ClientConfig {

		static _houseId:number=1; //Default houseId is 1. 
		static _logInteractions:boolean=false;

		//Reads the configuration from the Url. 
		public static readFromUrl() {
			var params:any = parseURL(document.URL).params;
			console.log(params);
			if(params.houseId!=null && params.houseId!=undefined) {
				this._houseId = parseInt(params.houseId);
			}

			if(params.logInteractions!=null && params.logInteractions!=undefined) {
				this._logInteractions = params.logInteractions=="true" ? true : false;
			}
			console.log("" + this._houseId + " - " + this._logInteractions);
		}

		public static getHouseId() : number {
			return this._houseId;
		}

		public static getInteractionLogging() : boolean {
			return this._logInteractions;
		}

	}

}