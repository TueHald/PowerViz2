///<reference path="References.ts"/>
module PowerViz {

	//PowerViz 2 main application point.
	export class Main {

		_controllerContainer:ControllerContainer;


		get controllerContainer():ControllerContainer { 
			return this._controllerContainer; 
		}

		constructor() {

			$(document).ready(this.ready);

		}

		//Called when the document is loaded and ready to be presented.
		ready=()=> {
			this.setupViews();
		}

		//Sets up the different views and connects them to the right controllers.
		setupViews=()=> {

			//Setup the swiper:
			ViewContainer.instance.createSwiper();



			//Setup the test sketches:
			//1. Set the containing div size.
			//2. Set the image to fit withing the div.
			//this.positionSketch("#sketchFlex", "#PrognoseView");
			//this.positionSketch("#sketchSource", "#viewTwo");
			//this.positionSketch("#sketchPrice", "#viewThree");


			//Test view:
			//var testView = new TestView();
			//var testController = new TestController();
			//testController.connectView(testView);
			//ViewContainer.instance.registerView("TestView", testView);

            var priceView = new Price_View();
            ViewContainer.instance.registerView("priceView", priceView);
            priceView.setup();
            var envView = new Env_View();
            ViewContainer.instance.registerView("envView", envView);
            envView.setup();
            var flexView = new Flex_View();
            ViewContainer.instance.registerView("belastningView", flexView);
            flexView.setup();

            var envController = new EnvController();
            envController.connectView(envView);

            //ViewContainer.instance.registerView("TestView", testView);


			//test topview

			var priceTopView = new Price_TopView();
            priceTopView._refToView = "priceView";
            priceTopView.setup();
            var flexTopView = new Flex_TopView();
            flexTopView._refToView = "belastningView";
            flexTopView.setup();
            var envTopView = new Env_TopView();
            envTopView._refToView = "envView";
            envTopView.setup();

			TopViewContainer.instance.addItem(priceTopView);
            TopViewContainer.instance.addItem(flexTopView);
            TopViewContainer.instance.addItem(envTopView);
            //flexTopView.enable();

            TopViewContainer.instance.setupViews();

            //end test topview


			//Now that all views are created, set them up. 
			//ViewContainer.instance.setupViews();
			ViewContainer.instance.setActiveView("belastningView");

            //////MICHAELS PLAYGROUND!!!!/////////////

            testLine();

            ///////////////////////////////////

			ViewUtils.hideLoader(); 
		}



		positionSketch(sketchId:string, sketchContainer:string) {
			ViewUtils.setElementToViewHeight(sketchContainer);
			$(sketchId).width($(sketchContainer).width());
			$(sketchId).height($(sketchContainer).height());
			var left:number = ($(sketchContainer).width() - $(sketchId).width())/2;
			$(sketchId).css("left", "" + left + "px");
		}

	}

    function testLine() {

        //create some data
        var lineData = [ { "x": 1,   "y": 5},  { "x": 150,  "y": 60},
                            { "x": 240,  "y": 20}, { "x": 280,  "y": 40},
                           { "x": 490,  "y": 5},  { "x": 1400, "y": 60}];

        //create some data 2
        var lineData2 = [ { "x": 1,   "y": 24},  { "x": 75,  "y": 50},
            { "x": 120,  "y": 45}, { "x": 290,  "y": 250},
            { "x": 560,  "y": 0},  { "x": 1400, "y": 300}];

        //var el = d3.select("belastningView").append("svg")
        //    .style("top", "50%")
        //    .style("position","absolute");


        //Draw the Rectangle
        //var el = d3.select("belastningView").selectAll('div').append("svg")







        //Draw the data
        //DrawUtils.drawGraph(lineData,"body", "test1","blue");
        //DrawUtils.drawGraph(lineData2,"body", "test2","red");




    }









}

