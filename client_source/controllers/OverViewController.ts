///<reference path="../References.ts" />


module PowerViz {

    export class OverViewController extends ControllerBase {

        _view:Over_View;


        _windData:string;

        _windDataObtained:boolean = false;

        _windObtainer:DataObtainer;

        _consumptionComponent:ConsumptionComponent;
        _nationalObtainer:DataObtainer;
        _nationalData:string;
        _nationalDataObtained:boolean=false;

        _priceData:string;
        _priceDataObtainer:DataObtainer;
        _priceDataObtained:boolean = false;

        _iconPlacementArray = []; //array that holds the first point of every graph

        constructor() {
            super();
            this._consumptionComponent = new ConsumptionComponent();
        }




        //Connects a view to this. Should be the only method used for connecting a view to a controller.
        connectView=(v:Over_View)=> {
            this._view = v;
            this._view.controller = this; //Connect the view to this controller.
        }

        //Internal timer function, runs every X seconds.
        public onTime=()=> {

            this._consumptionComponent.onDataObtained = this.onConsumptionDataObtained;
            this._consumptionComponent.requestData();
            this._iconPlacementArray = [];
            this.requestWindData();
            this.requestNationalData();
            this.requestPriceData();

        }

        private onConsumptionDataObtained=()=> {
            this.sendWindDataToView();
            this.sendNationalDataToView();
            this.sendPriceDataToView();
        }

        private requestWindData=()=> {

            var now = new Date();
            var url = "../server/query/?query=getWind&houseId=" + ClientConfig.getHouseId() + "&timespanFrom=12&timespanTo=12&granularity=15m&now="+DateHelper.dateToJsString(now);

            this._windObtainer = new DataObtainer(url);
            this._windObtainer.onDataObtained = this.onWindDataObtained;
            this._windObtainer.obtain();

        }

        private onWindDataObtained=(data:string)=> {

            if(data!="") {
                this._windData = data;
                this._windDataObtained = true;
                this.sendWindDataToView();
            }
        }

        private formWindData=(windData:any) : any => {

            //Find out the first point in time for the first forecast element.

            var windArray:any = [];
            for(var i=0; i<96; i++) {
                windArray[i] = {"x":i, "y":(windData.forecast[i].windSpeed/14)*100};
                if(windData.forecast[i].windSpeed>25) {
                    windArray[i] = {"x":i, "y":0};
                }
            }

            return windArray;
        }


        //This is very much a work in progress.
        private sendWindDataToView=()=> {
            if(this._consumptionComponent.allObtained==true && this._windDataObtained==true) {

                var windData:any = jQuery.parseJSON(this._windData);

                if(windData.error!=null ) {
                    console.log("Error!");
                }

                var windArray = this.formWindData(windData);

                this._windDataObtained = false;
                this._consumptionComponent.allObtained = false;

                this._view.updateWind(this._consumptionComponent.consumptionData, windArray);
                this._iconPlacementArray.push({"x":1, "y":this._consumptionComponent.consumptionData[0].y});
                this._iconPlacementArray.push({"x":2, "y":windArray[0].y});
                this._view.updateIconPlacement(this._iconPlacementArray);//send icondata to view

            }

        }


        public requestNationalData=()=> {

            var url="../server/query/?query=getNationalConsumptionPrognosis";

            this._nationalObtainer = new DataObtainer(url);
            this._nationalObtainer.onDataObtained = this.onNationalDataObtained;
            this._nationalObtainer.obtain();
        }

        public onNationalDataObtained=(data:string)=> {
            if(data!="") {
                this._nationalData = data;
                this._nationalDataObtained = true;
                this.sendNationalDataToView();
            }
        }

        private formPrognosisArray=(data:any) : any => {
            var max:number = 4000;
            var result:any = [];
            for(var i=0; i<data.slots.length; i++) {
                result[i] = {"x":i, "y":(data.slots[i].dk1/max)*100};
            }

            if(result.length==0) {
                result[0] = {"x":0, "y":0};
            }

            while(result.length<96) {
                result[result.length] = result[result.length-1];
            }
            return result;
        }

        private sendNationalDataToView=()=> {

            if(this._nationalDataObtained == true) {

                var progJson = jQuery.parseJSON(this._nationalData);
                var progArray = this.formPrognosisArray(progJson);

                this._view.updateFlex(this._consumptionComponent.consumptionData, progArray);
                this._iconPlacementArray.push({"x":3, "y":progArray[0].y});

            }

        }

        private requestPriceData=()=> {

            var url="../server/query/?query=getPowerPrices";
            this._priceDataObtainer = new DataObtainer(url);
            this._priceDataObtainer.onDataObtained = this.onPriceDataObtained;
            this._priceDataObtainer.obtain();

        }


        private onPriceDataObtained=(data:string)=> {
            if(data!="") {
                this._priceData = data;
                this._priceDataObtained = true;
                this.sendPriceDataToView();
            }
        }

        private formPriceData=(data:any) : any => {

            var max = 0.5;

            var result:any = [];
            for(var i=0; i<data.slots.length; i++) {
                result[i] = {"x":i, "y":(data.slots[i].dk1 / max) * 100 };
            }

            if(data.slots.length==0) {
                result[0] = {"x":0, "y":0};
            }

            while(result.length<96) {
                result[result.length] = result[result.length-1];
            }
            return result;
        }

        private sendPriceDataToView=()=> {

            if(this._priceDataObtained==true) {

                //Form price data etc.
                var priceJson = jQuery.parseJSON(this._priceData);
                var priceArray = this.formPriceData(priceJson);

                console.log(priceArray);

                if(this._view != null)
                    this._view.updatePrice(this._consumptionComponent.consumptionData, priceArray);

                this._priceDataObtained = false;
                this._consumptionComponent.allObtained = false;

                this._iconPlacementArray.push({"x":4, "y":priceArray[0].y});
            }

        }

    }

}

/**
 * Created by floop on 03/04/14.
 */
