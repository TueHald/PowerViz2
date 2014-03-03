///<reference path="../References.ts" />


module PowerViz{

	//class that defines a container for topviews so we can 
	//manipulate them
	export class TopViewContainer{

			_container: TopView[];
            _viewWidth: number;


			constructor(){

				this._container = new Array<TopView>();
                this._viewWidth = ViewUtils.getTopBarWidth();

			}

			setup=()=> {

				


                this._viewWidth = this._viewWidth/this._container.length;

                console.log("width is:" + this._viewWidth);

                for (var i in this._container) {

                    var element = document.getElementById(this._container[i]._name);

                    element.style.width = this._viewWidth.toString()+"px";
                    element.style.cssFloat = "left";


                    ViewUtils.setElementTopBarHeight(this._container[i]._id);

                }



			}

			addItem=(view:TopView)=>{
				this._container.push(view);

			}



	}



}