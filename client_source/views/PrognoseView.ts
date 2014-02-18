
///<reference path="../References.ts" />


module PowerViz {

	declare var Raphael:any;

	export class PrognoseView implements View {

		_name:string="PrognoseView";
		_id:string="#PrognoseView";

		_paper:any; //Raphael paper.

		private _controller:PrognoseController;

		setController(ctrl:PrognoseController) {this._controller = ctrl;}
		getController():PrognoseController {return this._controller; }

		constructor() {
			
		}

		//sets up the DOM elements.
		setup=()=> {
			
			//Set the size of the div:
			ViewUtils.setElementToViewHeight(this._id);

			//Setup Raphael drawing:
			this._paper = Raphael($(this._id).get(0), 300, 300);
			$(this._id+".svg").css("position", "absolute");
			this._paper.safari();
			this.drawCurve([14,22,1,99,30,22,23,40,5], 25);

		}

		clear=()=> {
			$(this._id).html("");
		}

		//Sets the wind data based on granularity etc.
		setWindValues=(data:any, granularity:number)=> {

		}

		//Draws a curve based on an array of values.
		drawCurve=(points:Array<number>, space:number)=> {


			var x:number = 50;
			var y:number = 50;
			var str:string="M"+x+","+y;
			for(var n in points){
				str += "T"+x+","+(y+points[n]);
				x += space;
			}
			console.log(str);
			var curve = this._paper.path(str);
			curve.attr("stroke", "#ff0000");
		}

		enable=()=> {
			this._controller.enable();
		}

		disable=()=> {
			this._controller.disable();
		}

		//Called by controller when loading starts.
		beginLoading=()=> {
			//Display the "active" spinner.
			console.log("BeginLoading");
			ViewUtils.showLoader();
		}

		//Called by controller when loading has finished.
		endLoading=()=> {
			//hide the "active" spinner.
			console.log("EndLoading");
			ViewUtils.hideLoader();
		}

	}

}