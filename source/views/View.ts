///<reference path="../References.ts" />

module PowerViz {

	//Base class for all PowerViz 2 views.
	export interface View {

		_name:string;

		setup(); //Called once when the view is added to the view container.

		enable(); //Called when the view is enabled/moved into view.

		disable(); //Called when the view is disabled/moved out of view.

		beginLoading(); //Called when the controller starts loading data into the view.
		endLoading(); //Called when the controller has finished loading data into the view. 

	}

}