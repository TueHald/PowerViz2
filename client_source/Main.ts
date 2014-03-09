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
			this.positionSketch("#sketchFlex", "#PrognoseView");
			this.positionSketch("#sketchSource", "#viewTwo");
			this.positionSketch("#sketchPrice", "#viewThree");


			//Test view:
			var testView = new TestView();
			var testController = new TestController();
			testController.connectView(testView);
			ViewContainer.instance.registerView("TestView", testView);

			//test topview

			var testTopView = new Price_TopView();
			testTopView.setup();
            var testTopView2 = new Flex_TopView();
            testTopView2.setup();
            var testTopView3 = new Env_TopView();
            testTopView3.setup();

			TopViewContainer.instance.addItem(testTopView);
            TopViewContainer.instance.addItem(testTopView2);
            TopViewContainer.instance.addItem(testTopView3);
            testTopView2.enable();

            TopViewContainer.instance.setupViews();

            //end test topview


			//Now that all views are created, set them up. 
			ViewContainer.instance.setupViews();
			ViewContainer.instance.setActiveView("PrognoseView");

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

        var margin = 4;



        //x0,y0,x1,y1,fuzzyness
        //slopedline(0,80,90,150,5);
        var lineData = [ { "x": 1,   "y": 5},  { "x": 150,  "y": 60},
                            { "x": 240,  "y": 20}, { "x": 280,  "y": 40},
                           { "x": 490,  "y": 5},  { "x": 1400, "y": 60}];


        var lineData2 = [ { "x": 1,   "y": 24},  { "x": 75,  "y": 50},
            { "x": 120,  "y": 45}, { "x": 290,  "y": 250},
            { "x": 560,  "y": 0},  { "x": 1400, "y": 300}];

        //var lineData = [ { "x": 1,   "y": 5},  { "x": 600,  "y": 5}];

        DrawUtils.drawGraph(lineData,"body", "test1","blue");
        DrawUtils.drawGraph(lineData2,"body", "test2","red");




    }









}

