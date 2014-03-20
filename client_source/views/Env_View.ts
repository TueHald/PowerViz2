///<reference path="../References.ts" />


module PowerViz {

    export class Env_View implements View {

        _name:string = "envView";
        _id:string = "#envView";
        _iconPath1:string = "Images/icon_windmill.svg";
        _iconPath2:string = "Images/icon_house.svg";
        _controller:EnvController;

        //Required by View interface.
        setup=()=> {

            //Set the size of the div:
            ViewUtils.setElementToViewHeight(this._id);

            DrawUtils.drawContentFrame(this._name,"100","100");

            DrawUtils.createGraphCanvas(this._name, this._iconPath1,this._iconPath2);


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



            //this.update(lineData,lineData2);


        }

        //Not required, but makes linking the controller to the view sligtly easier.
        //Should only be used by the controller.
        set controller(c:EnvController) {
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
        //The update function is used to update the entire view
        //the redrawcontentfram shifts the timeline
        //the redrawgraph draws a new graph based on inputdata
        update=(houseArray:any,envArray:any)=>{


            DrawUtils.redrawContentFrame(this._name);


            //create some data 2
            var lineData1 = houseArray;
            var lineData2 = envArray;


            var yCoord1 = DrawUtils.drawGraph(lineData1,this._name, this._name+"houseConsump","blue");
            var yCoord2 = DrawUtils.drawGraph(lineData2,this._name, this._name+"envConsump","green");

            if(yCoord1 != 0 && yCoord2 != 0){//move icons

                DrawUtils.placeIcons(this._name,yCoord1,yCoord2);

            }

        }


        //--------------------
        //Specific for this view.
        setHeadline=(txt:string)=> {
            $(this._id).text(txt);
        }


    }

}