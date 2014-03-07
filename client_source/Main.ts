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

        //var lineData = [ { "x": 1,   "y": 5},  { "x": 600,  "y": 5}];

        drawGraph(lineData,"body", "test1");


    }
    //draws a horissontal line between two x coordinates, fuzzyness
    //is the randomness of the line, eg. how sketchy it looks.
    function drawHorisontalLine(from:number,to:number,fuzzyness:number){

        var svg = d3.select("body").append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .style("top","50%")
            .style("position","absolute");


        var lineData = d3.range(from,to,fuzzyness).map(function(x) {
            return {x: x, y: 10 + Math.floor(Math.random()*6)-3}
        });

        var lineFunction = d3.svg.line()
            .x(function(d) { return d.x; })
            .y(function(d) { return d.y; })
            .interpolate("basis");

        function draw(points) {

            var lineGraph = svg.append("path")
                .attr("stroke", "blue")
                .attr("stroke-width", 1)
                .attr("fill", "none")
                .attr("d", lineFunction(points));

            if (points.length < lineData.length)

                draw(lineData);

        }

        draw([]);
    }

    //draws a horissontal line between two x coordinates, fuzzyness
    //is the randomness of the line, eg. how sketchy it looks.
    //roughly based on: http://stackoverflow.com/questions/20695723/d3-smoothly-animate-a-hand-drawn-line
    function drawVerticalLine(from:number,to:number,fuzzyness:number){

        var svg = d3.select("body").append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .style("top","50%")
            .style("position","absolute");




        var lineData = d3.range(from,to,fuzzyness).map(function(y) {
            return {y: y, x: 10 + Math.floor(Math.random()*6)-3}
        });

        var lineFunction = d3.svg.line()
            .x(function(d) { return d.x; })
            .y(function(d) { return d.y; })
            .interpolate("cardinal");

        function draw(points) {

            var lineGraph = svg.append("path")
                .attr("stroke", "blue")
                .attr("stroke-width", 1)
                .attr("fill", "none")
                .attr("d", lineFunction(points));

            if (points.length < lineData.length)

                draw(lineData);

        }

        draw([]);
    }

    function slopedline(x0, y0, x1, y1, fuzzyness){
        var dx = Math.abs(x1-x0);
        var dy = Math.abs(y1-y0);
        var sx = (x0 < x1) ? 1 : -1;
        var sy = (y0 < y1) ? 1 : -1;
        var err = dx-dy;
        var linedata = [];

        var vectorLength = jitterFunction((x0-x1),(y0,y1));

        console.log((100/vectorLength)+fuzzyness);

        //set the interval of the points
        var interval = Math.floor((100/vectorLength)+fuzzyness);
        var intervalCount = 0;

        while(true){


            if(intervalCount % interval == 0 || ((x0==x1) && (y0==y1))){
                console.log("x-coordinate: " + x0 + " and y-coordinate: " + y0);
                addLineData(x0 + Math.floor(Math.random()*6)-2,y0 + Math.floor(Math.random()*6)-2,linedata);

            }

            intervalCount ++;
            if ((x0==x1) && (y0==y1)) break;
            var e2 = 2*err;
            if (e2 >-dy){ err -= dy; x0  += sx; }
            if (e2 < dx){ err += dx; y0  += sy; }
        }

        /*//This is the accessor function we talked about above
        var lineFunction = d3.svg.line()
                                 .x(function(d) { return d.x; })
                                .y(function(d) { return d.y; })
                                 .interpolate("cardinal");

        //The SVG Container
        var svgContainer = d3.select("body").append("svg")
                                            .attr("width", 200)
                                            .attr("height", 200);

        //The line SVG Path we draw
        var lineGraph = svgContainer.append("path")
                                    .attr("d", lineFunction(linedata))
                                    .attr("stroke", "blue")
                                    .attr("stroke-width", 2)
                                    .attr("fill", "none");*/

        function addLineData(x:number, y: number, array){

            array.push({"x": x,   "y": y})

        }

        return linedata;


    }

    //function to draw a graph
    //takes a name for the svgelement and a id string that defines an element to insert svg into.
    function drawGraph(CoordinateSet, id:string, svgname:string){


        console.log(CoordinateSet.toString());
        var pathdata = [];

        for(var i=0;i<CoordinateSet.length-1;i++){

                var tempdata = slopedline(CoordinateSet[i].x,CoordinateSet[i].y,CoordinateSet[i+1].x,
                    CoordinateSet[i+1].y,14);
            console.log(tempdata.toString());
            pathdata = pathdata.concat(tempdata);

        }



        //This is the accessor function we talked about above
        var lineFunction = d3.svg.line()
            .x(function(d) { return d.x; })
            .y(function(d) { return d.y; })
            .interpolate("basis-open");

        //The SVG Container
        var svgContainer = d3.select(id).append("svg")
            .attr("id",svgname)
            .attr("width", 1400)
            .attr("height", 200)
            .style("top", "50%")
            .style("position","absolute");


        //The line SVG Path we draw
        var lineGraph = svgContainer.append("path")
            .attr("d", lineFunction(pathdata))
            .attr("stroke", "blue")
            .attr("stroke-width", 4)
            .attr("fill", "none")
            .style("stroke-dasharray", ("5, 5, 5, 5, 5, 5, 10, 5, 10, 5, 10, 5"))
            .style("top", "50%")
            .style("position","absolute");


    }
    //function that calculates vector
    //and returns it
   function jitterFunction(x:number,y:number){

        var vectorLength = 0;


       vectorLength = Math.sqrt((x*x) + (y*y));

       return vectorLength;


   }
}

