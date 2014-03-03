///<reference path="../References.ts" />

module PowerViz {

	//The top view is slightly different from the other views, 
	//in that it is not part of the view container.... yet.
	export class TopView implements View {

		_name:string;
		_id:string;
		_controller:TestTopController;

		setup=()=> {

            var element = document.createElement("div");
            element.id = this._name;
            element.appendChild(document.createTextNode(this._name));
            document.getElementById('top-bar').appendChild(element);
            //element.style.width = "0px";
            //element.style.height = "0px";
			

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