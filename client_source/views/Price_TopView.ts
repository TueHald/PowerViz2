///<reference path="../References.ts" />

module PowerViz {

	//Class that defines a Price_TopView, that is
	//a view that is to be placed in the topbar of the view
	export class Price_TopView extends TopView{

		_name:string = "price_TopView";
		_id:string = "#price_TopView";
        _refToView:string = "priceView";
        _textFieldText:string = "Pris";
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