///<reference path="../References.ts" />


module PowerViz {

	export class TestTopController implements Controller {

		private _view:TopView;

		private _timer:any;
		private _counter:number;

		//Required by the Controller interface.
		enable=()=> {
		}

		//Required by the Controller interface.
		disable=()=> {
		}

		//Connects a view to this. Should be the only method used for connecting a view to a controller.
		connectView=(v:TopView)=> {
			this._view = v; 
			//this._view.controller = this; //Connect the view to this controller.
		}



		//Internal timer function, runs every X seconds.
		private onTime=()=> {
			console.log("time..." + this._counter);
			this._counter += 1;


		}

	}

}