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
			var topContainer = new TopViewContainer(); 


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

			topContainer.addItem(testTopView);
            topContainer.addItem(testTopView2);
            topContainer.addItem(testTopView3);

			topContainer.setupViews();

            //end test topview


			//Now that all views are created, set them up. 
			ViewContainer.instance.setupViews();
			ViewContainer.instance.setActiveView("PrognoseView");

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

}
