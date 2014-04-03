///<reference path="../References.ts" />

module PowerViz {

    //Class that defines a Price_TopView, that is
    //a view that is to be placed in the topbar of the view
    export class Point_TopView extends TopView{

        _name:string = "point_TopView";
        _id:string = "#point_TopView";
        _refToView:string = "pointView";
        _textFieldText:string = "Flexpoint";
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
 * Created by floop on 03/04/14.
 */
