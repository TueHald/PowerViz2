///<reference path="../References.ts" />


module PowerViz{

	//class that defines a container for topviews so we can 
	//manipulate them
	export class TopViewContainer{

        private static _instance : TopViewContainer = null;
        public static get instance():TopViewContainer {
            if(TopViewContainer._instance==null)
                TopViewContainer._instance = new TopViewContainer();
            return TopViewContainer._instance;
        }

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

                    var element = document.getElementById(this._container[i]._name +"_container");
                    //-2 --> taking note of the border, else the element will not fit
                    element.style.width = "20%";
                    element.style.height = "100%";
                    element.style.cssFloat = "left";


                    ViewUtils.setElementTopBarHeight(this._container[i]._id);

                }


			}

			addItem=(view:TopView)=>{
				this._container.push(view);

			}

            //sets the active view
            setActiveView=(viewNumber:string)=>{
        console.log(viewNumber.toString());

                for (var i in this._container) {

                    if(this._container[i]._refToView == viewNumber){

                        this._container[i].enable();

                    }
                    else{

                        this._container[i].disable();

                    }

                }

            }



	}



}