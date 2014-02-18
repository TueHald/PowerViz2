
/*
Implementation of the Observer Pattern.
*/

module PowerViz {

	export class Observer {

		public onUpdate(val:any) {} //Replace this to run a function on update of the value.

		private _observable:Observable; //Reference to the actual observable.

		constructor(observable:string, updatefunc?:(val:any)=>any) {
			this.bind(observable);
			this.onUpdate = updatefunc || function(val:any){};
		}

		public get value():any {
			return this._observable.value;
		}

		public set value(val:any) {
			this._observable.setValueFromObserver(val, this);
		}

		//Called when the observable has changed its state.
		public update=(val:any)=> {
			if(this.onUpdate != null)
				this.onUpdate(val);
		}

		public bind=(observableName:string)=> {
			//this._bindId = BindingManager.instance.bindObserver(observableName, this);
		}

	}


	export class Observable {

		private _value:any;
		private _observers:Array<Observer>;

		constructor(name:string) {
			this._observers = new Array<Observer>();
		}

		public get value():any {
			return this._value;
		}

		public set value(val:any) {
			//Notify all the observers:
			this._value = val;
			for(var i in this._observers) {
				this._observers[i].update(val);
			}
		}

		public setValueFromObserver=(val:any, obs:Observer)=> {
			this._value = val;
			//Notify all observers other than the one sending.
			for(var i in this._observers) {
				if(this._observers[i]!=obs) {
					this._observers[i].update(val);
				}
			}
		}

		public attach(obs:Observer) {
			this._observers.push(obs);
		}

		public detach=(obs:Observer)=> {
			var pos = this._observers.indexOf(obs);
			if(pos<0)
				return;
			
		}

	}


	export class BindingManager {

		private static _instance:BindingManager = null;
		public static get instance():BindingManager {
			if(BindingManager._instance==null)
				BindingManager._instance = new BindingManager;
			return BindingManager._instance;
		}

		private _observerables:{};

		constructor() {
			this._observerables = {};	
		}

		bindObservable=(name:string, obs:Observable):number=> {
			return -1;
		}

		bindObserver=(name:string, obser:Observer):number=> {
			return -1;
		}

		unbindObserver=(obser:Observer, bindId:number)=> {

		}

		unbindObservable=(obs:Observable, bindId:number)=> {

		}

		notify=(bindId:number, value:any)=> {

		}

	}

}