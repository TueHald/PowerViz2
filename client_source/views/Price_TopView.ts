///<reference path="../References.ts" />

module PowerViz {

	//Class that defines a Price_TopView, that is
	//a view that is to be placed in the topbar of the view
	export class Price_TopView implements TopView{

		_name:string = "TestTopView";
		_id:string = "#TestTopView";
		_controller:TestTopController;

		//Required by View interface.
		setup=()=> {

			//Set the size of the div:
			//ViewUtils.setElementToViewWidth(this._id);
			//$(this._id).css("background-color", "green");
			

		}

		//Required by the View interface.
		enable=()=> {
			this._controller.enable();
		}

		//Required by the View interface.
		disable=()=> {
			this._controller.disable();
		}

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