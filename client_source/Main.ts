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

            ClientConfig.readFromUrl();


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



            //////////////////////ADD VIEWS/////////////////////////////////

            var overView = new Over_View();
            ViewContainer.instance.registerView("overView", overView);
            overView.setup();

            var priceView = new Price_View();
            ViewContainer.instance.registerView("priceView", priceView);
            priceView.setup();

            var flexView = new Flex_View();
            ViewContainer.instance.registerView("belastningView", flexView);
            flexView.setup();

            var envView = new Env_View();
            ViewContainer.instance.registerView("envView", envView);
            envView.setup();


            var pointView = new Point_View();
            ViewContainer.instance.registerView("pointView", pointView);
            pointView.setup();





            //////////////////////ADD CONTROLLERS/////////////////////////////////


            var overController = new OverViewController();
            overController.connectView(overView);

            var envController = new EnvController();
            envController.connectView(envView);

            var priceController = new PriceController();
            priceController.connectView(priceView);

            var flexController = new FlexController();
            flexController.connectView(flexView);

            var pointController = new PointController();
            pointController.connectView(pointView);


            //ViewContainer.instance.registerView("TestView", testView);


            //////////////////////ADD TOPVIEWS/////////////////////////////////
            var overTopView = new Over_TopView();
            overTopView._refToView = "overView";
            overTopView.setup();

			var priceTopView = new Price_TopView();
            priceTopView._refToView = "priceView";
            priceTopView.setup();

            var flexTopView = new Flex_TopView();
            flexTopView._refToView = "belastningView";
            flexTopView.setup();

            var envTopView = new Env_TopView();
            envTopView._refToView = "envView";
            envTopView.setup();

            var pointTopView = new Point_TopView();
            pointTopView._refToView = "pointView";
            pointTopView.setup();






            //////////////////////ADD TOPVIEWS TO CONTAINER/////////////////////////////////


            TopViewContainer.instance.addItem(overTopView);
			TopViewContainer.instance.addItem(priceTopView);
            TopViewContainer.instance.addItem(flexTopView);
            TopViewContainer.instance.addItem(envTopView);
            TopViewContainer.instance.addItem(pointTopView);
            //flexTopView.enable();

            TopViewContainer.instance.setupViews();

            //end test topview


			//Now that all views are created, set them up. 
			//ViewContainer.instance.setupViews();
			ViewContainer.instance.setActiveView("overView");



			ViewUtils.hideLoader();


            var screendim = new ScreenDimming();

		}



		positionSketch(sketchId:string, sketchContainer:string) {
			ViewUtils.setElementToViewHeight(sketchContainer);
			$(sketchId).width($(sketchContainer).width());
			$(sketchId).height($(sketchContainer).height());
			var left:number = ($(sketchContainer).width() - $(sketchId).width())/2;
			$(sketchId).css("left", "" + left + "px");
		}

	}










}

