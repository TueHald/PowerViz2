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

			setupViews=()=> {

				


                this._viewWidth = this._viewWidth/this._container.length;

                console.log("width is:" + this._viewWidth);

                for (var i in this._container) {

                    var element = document.getElementById(this._container[i]._name);
                    //-2 --> taking note of the border, else the element will not fit
                    element.style.width = (this._viewWidth - 2).toString()+"px";
                    element.style.cssFloat = "left";


                    ViewUtils.setElementTopBarHeight(this._container[i]._id);

                }



			}

			addItem=(view:TopView)=>{
				this._container.push(view);

			}

            //sets the active view
            setActiveView=(viewNumber:string)=>{


            }



	}



}