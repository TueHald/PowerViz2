///<reference path="../References.ts" />

module PowerViz {

	export class PrognoseController implements Controller {

		_view:PrognoseView;
		_enabled:boolean;
		_timer:any = null;
		_frequency:number = 120; //Seconds between updates.

		public connectToView=(view:PrognoseView)=> {
			this._view = view;
			this._view.setController(this);
		}


		public enable=()=> {
			//Start timer.
			if(this._timer==null) { //Only start the timer if it is not already running.
				this._timer = setInterval(this.onTime, this._frequency*1000);
			}
			this._enabled = true;

			//Get data and send it to the view. Use the timer function:
			this.onTime();
		}

		public disable=()=> {
			//Stop timer.
			if(this._timer!=null) {
				clearInterval(this._timer);
				this._timer=null;
			}
			this._enabled = false;
		}

		//Called once on each time interval.
		onTime=()=> {
			//Get data from the model.
			//Send the data to the view.

			//this._view.beginLoading();
			//this._view.endLoading();
		}

		//Called from the view when the time slider moves.
		public onSliderChange=(newPosition:number)=> {
			//change the datagranularity that is sent to the view. 
		}

		private onDataReceived=()=> {
			//All data has ben reeived, so send data to the view.
		}

	}

}

