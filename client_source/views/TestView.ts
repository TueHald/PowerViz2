///<reference path="../References.ts" />


module PowerViz {

	export class TestView implements View {

		_name:string = "TestView";
		_id:string = "#TestView";
		_controller:TestController;

		//Required by View interface.
		setup=()=> {

			//Set the size of the div:
			ViewUtils.setElementToViewHeight(this._id);
			$(this._id).css("background-color", "yellow");

		}

		//Not required, but makes linking the controller to the view sligtly easier.
		//Should only be used by the controller.
		set controller(c:TestController) {
			this._controller = c;
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


		//--------------------
		//Specific for this view. 
		setHeadline=(txt:string)=> {
			$(this._id).text(txt);
		}


	}

}