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
            var lineData = [ { "x": 0,   "y": 0},  { "x": 1,  "y": 0},
                { "x": 2,  "y": 0}, { "x": 3,  "y": 50},
                { "x": 4,  "y": 60},  { "x": 5, "y": 80},
                { "x": 2,  "y": 60}, { "x": 3,  "y": 50},
                { "x": 4,  "y": 40},  { "x": 5, "y": 30},
                { "x": 2,  "y": 20}, { "x": 3,  "y": 20},
                { "x": 4,  "y": 0},  { "x": 5, "y": 0}];

            //create some data 2
            var lineData2 = [ { "x": 0,   "y": 20},  { "x": 1,  "y": 0},
                { "x": 2,  "y": 0}, { "x": 3,  "y": 50},
                { "x": 4,  "y": 40},  { "x": 5, "y": 100},
                { "x": 2,  "y": 20}, { "x": 3,  "y": 30},
                { "x": 4,  "y": 70},  { "x": 5, "y": 10},
                { "x": 2,  "y": 0}, { "x": 3,  "y": 20},
                { "x": 4,  "y": 20},  { "x": 5, "y": 57}];

            DrawUtils.drawGraph(lineData,this._name, "test1","blue");

            DrawUtils.drawGraph(lineData2,this._name, "test2","red");


            this.update();


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

        update=()=>{


            DrawUtils.redrawContentFrame(this._name);


            //create some data 2
            var lineData3 = [ { "x": 0,   "y": 100},  { "x": 1,  "y": 0},
                { "x": 2,  "y": 0}, { "x": 3,  "y": 50},
                { "x": 4,  "y": 60},  { "x": 5, "y": 100},
                { "x": 2,  "y": 20}, { "x": 3,  "y": 100},
                { "x": 4,  "y": 70},  { "x": 5, "y": 90},
                { "x": 2,  "y": 0}, { "x": 3,  "y": 80},
                { "x": 4,  "y": 20},  { "x": 5, "y": 57}];


            DrawUtils.redrawGraph(lineData3,this._name, "test1","blue");
            //DrawUtils.testRedraw(this._name,"100%","100%");

           // DrawUtils.drawContentFrame(this._name,"100%","100%");

            //DrawUtils.createGraphCanvas(this._name);
            //DrawUtils.drawGraph(lineData2,this._name, "test2","red");

        }


        //--------------------
        //Specific for this view.
        setHeadline=(txt:string)=> {
            $(this._id).text(txt);
        }


    }

}