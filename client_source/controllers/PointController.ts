///<reference path="../References.ts" />


module PowerViz {

    export class PointController implements Controller {

        private _view:Point_View;

        private _timer:any;
        private _counter:number;

        private _updateInterval = 15; //Number of minutes between updates. 

        private _dataObtainer:DataObtainer; 

        //Required by the Controller interface.
        enable=()=> {
            this._timer = setInterval(this.onTime, 60*1000*this._updateInterval); //Start the timer.
            this._counter = 0; //A counter, just for fun.
            this.onTime(); //Run the "updating" procedure once when the view is enabled.
        }

        //Required by the Controller interface.
        disable=()=> {
            if(this._timer!=null) //If the timer is running, stop it.
                clearInterval(this._timer);
            this._timer = null;
        }

        //Connects a view to this. Should be the only method used for connecting a view to a controller.
        connectView=(v:Point_View)=> {
            this._view = v;
            this._view.controller = this; //Connect the view to this controller.
        }

        //Internal timer function, runs every X seconds.
        private onTime=()=> {

            this._dataObtainer = new DataObtainer("../server/query/?query=getFlexPoints&houseId=" + ClientConfig.getHouseId());
            this._dataObtainer.onDataObtained = this.onDataObtained;
            this._dataObtainer.obtain();

            //should be called to update ball layout
            //this._view.updatePoints((Math.random()*1000),(Math.random()*1000),(Math.random()*1000));




        }

        private onDataObtained=(data:string)=> {
            if(data!=""){
                console.log(data);
                var pointsJson:any = jQuery.parseJSON(data);
                this._view.updatePoints(pointsJson.loadPoints, pointsJson.windPoints, pointsJson.pricePoints);
            }
            else {
                this._view.updatePoints(0,0,0);
            }
        }

    }

}

