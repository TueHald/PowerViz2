//Base class for all controllers

module PowerViz {

	export interface Controller {

		enable();

		disable();

	}

	//Base class for most common controllers.
	export class ControllerBase {

		_timer:any = null;

		_frequency:number = 15*60; //seconds between updates.
		_enabled:boolean = false; 


		public enable=()=> {

			//Start timer.
            if(this._timer==null) { //Only start the timer if it is not already running.
                this._timer = setInterval(this.onTime, this._frequency*1000);
            }

			this._enabled = true;
			this.onTime();
            this.onEnable();
		
		}

		public disable=()=> {

			//Stop timer.
			if(this._timer!=null) {
				clearInterval(this._timer);
				this._timer=null;
			}


			this._enabled = false;

            this.onDisable();

		}

		//Override this!
		public onTime=()=> {}

        public onEnable=()=>{}

        public onDisable=()=>{}

		
	}

}