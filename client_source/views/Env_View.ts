///<reference path="../References.ts" />


module PowerViz {

    export class Env_View implements View {

        _name:string = "envView";
        _id:string = "#envView";
        _controller:TestController;

        //Required by View interface.
        setup=()=> {

            //Set the size of the div:
            ViewUtils.setElementToViewHeight(this._id);

            DrawUtils.drawContentFrame(this._name,"100%","100%");

            DrawUtils.createGraphCanvas(this._name);


            //create some data
            var lineData = [ { "x": 1,   "y": 5},  { "x": 150,  "y": 60},
                { "x": 240,  "y": 20}, { "x": 280,  "y": 40},
                { "x": 490,  "y": 5},  { "x": 1400, "y": 60}];

            //create some data 2
            var lineData2 = [ { "x": 1,   "y": 24},  { "x": 75,  "y": 50},
                { "x": 120,  "y": 45}, { "x": 290,  "y": 250},
                { "x": 560,  "y": 0},  { "x": 1400, "y": 300}];

            DrawUtils.drawGraph(lineData,this._name, "test1","blue");

            DrawUtils.drawGraph(lineData2,this._name, "test1","red");


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