///<reference path="../References.ts" />


module PowerViz {

	export class TestTopController implements Controller {

		private _view:TopView;

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

		//Connects a view to this. Should be the only method used for connecting a view to a controller.
		connectView=(v:TopView)=> {
			this._view = v; 
			//this._view.controller = this; //Connect the view to this controller.
		}

		//Internal timer function, runs every X seconds.
		private onTime=()=> {
			console.log("time..." + this._counter);
			this._counter += 1;

			//Tell the view to set the headline:
			//this._view.setHeadline("This is the new headline - " + this._counter); //Call a function on the view.
			//Notice, when looking at the TestView code, that the View does not call functions inside the controller,
			//besides the mandatory enable() and disable(). 

		}

	}

}