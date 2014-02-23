///<reference path="../References.ts" />


module PowerViz {

	export class TestTopController implements Controller {

		private _view:TestTopView;

		private _timer:any;
		private _counter:number;

		//Required by the Controller interface.
		enable=()=> {
			this._timer = setInterval(this.onTime, 2000); //Start the timer.
			this._counter = 0; //A counter, just for fun.
			this.onTime(); //Run the "updating" procedure once when the view is enabled.
		}

		//Required by the Controller interface.
		disable=()=> {
			if(this._timer!=null) //If the timer is running, stop it.
				clearInterval(this._timer);
			this._timer = null; 
		}

		

		

	}

}