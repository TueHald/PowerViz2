///<reference path="../References.ts" />

module PowerViz {

	//Class that defines a Price_TopView, that is
	//a view that is to be placed in the topbar of the view
	export class Price_TopView extends TopView{

		_name:string = "testPrice_TopView";
		_id:string = "#testPrice_TopView";
        _refToView:string = "viewThree";
		_controller:TestTopController;







		//Required by the View interface.
		beginLoading=()=> {

		}

		//Required by the View interface.
		endLoading=()=> {

		}

		set controller(c:TestTopController) {
			this._controller = c;
		}

	}

}