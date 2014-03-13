///<reference path="../References.ts" />

module PowerViz {

    //Class that defines a Price_TopView, that is
    //a view that is to be placed in the topbar of the view
    export class Env_TopView extends TopView{

        _name:string = "env_TopView";
        _id:string = "#env_TopView";
        //reference to the view, essentially the same as the view name
        _refToView:string = "envView";
        _textFieldText:string = "Miljø";
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