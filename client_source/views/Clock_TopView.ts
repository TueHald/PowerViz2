///<reference path="../References.ts" />

module PowerViz {

    //Class that defines a Price_TopView, that is
    //a view that is to be placed in the topbar of the view
    export class Clock_TopView extends TopView{

        _name:string = "clock_TopView";
        _id:string = "#clock_TopView";
        //reference to the view, essentially the same as the view name
        _refToView:string = "clockView";
        _textFieldText:string = "Ur";
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

}/**
 * Created by floop on 20/04/14.
 */
