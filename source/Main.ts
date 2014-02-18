///<reference path="References.ts"/>
module PowerViz {

	//PowerViz 2 main application point.
	export class Main {

		_controllerContainer:ControllerContainer;

		get controllerContainer():ControllerContainer { 
			return this._controllerContainer; 
		}

		constructor() {

			$(document).ready(this.ready);

		}

		//Called when the document is loaded and ready to be presented.
		ready=()=> {
			this.setupViews();
		}

		//Sets up the different views and connects them to the right controllers.
		setupViews=()=> {

			//Setup the swiper:
			ViewContainer.instance.createSwiper();
			
			//Prognose view and controller:
			var prognoseView = new PrognoseView();
			var prognoseController = new PrognoseDummyController(); //new PrognoseController();
			prognoseController.connectToView(prognoseView);
			ViewContainer.instance.registerView("PrognoseView", prognoseView);

			//this._controllerContainer = new ControllerContainer();

			//Now that all views are created, set them up. 
			ViewContainer.instance.setupViews();
			ViewContainer.instance.setActiveView("PrognoseView");

			ViewUtils.hideLoader(); 
		}

	}

}
