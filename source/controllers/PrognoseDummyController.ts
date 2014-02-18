///<reference path="PrognoseController.ts" />

module PowerViz {

	//Use this controller as a dummy during dev, to skip using the model.
	export class PrognoseDummyController extends PrognoseController {

		_fakeTimer:any;

		constructor() {
			super();
		}

		onTime=()=> {
			console.log("Getting prognose data, sending it off to the view.");
			this._fakeTimer = setInterval(this.onFakeTime, 1000);
			this._view.beginLoading();
		}

		private onFakeTime=()=> {
			clearInterval(this._fakeTimer);
			this._view.endLoading();
		}

	}

}