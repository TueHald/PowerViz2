///<reference path="../References.ts" />

module PowerViz {

    //Class that defines a Price_TopView, that is
    //a view that is to be placed in the topbar of the view
    export class Flex_TopView extends TopView{

        _name:string = "belastning_TopView";
        _id:string = "#belastning_TopView";
        _refToView:string = "belastningView";
        _textFieldText:string = "Belastning";

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