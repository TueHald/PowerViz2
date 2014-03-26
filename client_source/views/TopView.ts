///<reference path="../References.ts" />

module PowerViz {

	//The top view is slightly different from the other views, 
	//in that it is not part of the view container.... yet.
	export class TopView implements View {

		_name:string;
		_id:string;
        _refToView:string;
        _selected = false;
        _textFieldText:string;
		_controller:TestTopController;

		setup=()=> {

            var element = document.createElement("div");
            element.id = this._name +"_container";
            //element.appendChild(document.createTextNode(this._name));
            document.getElementById('top-bar').appendChild(element);
            //element.style.border = "1px solid black";
            this._selected = false;

            var topelement = document.getElementById(this._name +"_container");
            topelement.className = "bar-element no-select";
            topelement.style.marginBottom = "auto";
            topelement.style.marginTop = "auto";
            topelement.style.zIndex = "60";
            var div = document.createElement("div");
            div.id = this._refToView;


            topelement.onclick =
                function() { ViewContainer.instance.setActiveView(div.id); ViewContainer.instance.moveTo(div.id); };


            var textfield = document.createElement("div");
            textfield.id = this._name + "_textfield";
            textfield.className = "text-bar-element";
            textfield.innerHTML = this._textFieldText;
            textfield.style.height = "100%";
            textfield.style.position = "relative"
            textfield.style.fontSize = "250%";
            textfield.style.marginLeft = "auto";
            textfield.style.marginRight = "auto";
            textfield.style.bottom = "-20px";//hack så det kommer til at stå ordentligt.. magter ikke
            textfield.style.textAlign = "center";
            textfield.style.zIndex = "100";


            document.getElementById(this._name +"_container").appendChild(textfield);


		}

		//Required by the View interface.
        //specifies what should happend when a topview becomes active
		enable=()=> {
			//this._controller.enable();
            var element = document.getElementById(this._name +"_container");
            element.style.opacity = ("1.0");

		}

		//Required by the View interface.
        //specifies what should happend when a topview becomes disabled
		disable=()=> {
			//this._controller.disable();
            var element = document.getElementById(this._name +"_container");
            element.style.opacity = ("0.4");
		}

		//Required by the View interface.
		beginLoading=()=> {

		}

		//Required by the View interface.
		endLoading=()=> {

		}


	}

}