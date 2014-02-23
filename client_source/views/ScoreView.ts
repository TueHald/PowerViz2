///<reference path="../References.ts" />

module PowerViz {

	//Class that defines a ScoreTopView, that is
	//a view that is to be placed in the topbar of the view
	export class ScoreTopView implements TopView{

		_name:string = "TestTopView";
		_id:string = "#TestTopView";
		_controller:TestController;

		//Required by View interface.
		setup=()=> {

			//Set the size of the div:
			ViewUtils.setElementToViewWidth(this._id);
			$(this._id).css("background-color", "yellow");

		}

	}

}