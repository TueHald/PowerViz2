///<reference path="../References.ts" />

module PowerViz {

	//The top view is slightly different from the other views, 
	//in that it is not part of the view container.... yet.
	export class TopView implements View {

		_name:string;
		_id:string;
		_controller:TestTopController;

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

	}

}