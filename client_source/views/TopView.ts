///<reference path="../References.ts" />

module PowerViz {

	//The top view is slightly different from the other views, 
	//in that it is not part of the view container.... yet.
	export class TopView implements View {

		_name:string;
		_id:string;
        _refToView:string;
        _selected = false;
		_controller:TestTopController;

		setup=()=> {

            var element = document.createElement("div");
            element.id = this._name;
            //element.appendChild(document.createTextNode(this._name));
            document.getElementById('top-bar').appendChild(element);
            element.style.border = "1px solid black";
            //element.style.width = "0px";
            //element.style.height = "0px";
            this._selected = false;
			

		}

		//Required by the View interface.
		enable=()=> {
			//this._controller.enable();
            var element = document.getElementById(this._name);
            element.style.backgroundColor = "blue";

		}

		//Required by the View interface.
		disable=()=> {
			//this._controller.disable();
            var element = document.getElementById(this._name);
            element.style.backgroundColor = "gray";
		}

		//Required by the View interface.
		beginLoading=()=> {

		}

		//Required by the View interface.
		endLoading=()=> {

		}


	}

}