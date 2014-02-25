///<reference path="../References.ts" />


module PowerViz{

	//class that defines a container for topviews so we can 
	//manipulate them
	export class TopViewContainer{

			_container: TopView[];


			constructor(){

				this._container = new Array<TopView>();

			}

			setup=()=> {

				var con = this._container;

				for (var i in con) {
 					console.log("meeeeh");
				}
				

			}

			addItem=(view:TopView)=>{
				this._container.push(view);

			}



	}



}