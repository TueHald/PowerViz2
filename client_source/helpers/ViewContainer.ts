///<reference path="../References.ts" />

module PowerViz {

	declare var Swipe:any;

	//The view container. All views should be contained here.
	//Will handle the swiping carousel, so that no mouse movement
	//in x seconds will make the carousel run on its own.
	//The view container is also responseible for showing/hiding the loading spinner.
	export class ViewContainer {

		private static _instance : ViewContainer = null;
		public static get instance():ViewContainer {
			if(ViewContainer._instance==null)
				ViewContainer._instance = new ViewContainer();
			return ViewContainer._instance;
		}

		_swiper:any = null; //swiper created using swipe.js.

		_autoswipeTime:number = 180; //Number of seconds between different views when autoswiping.
		_inactiveWait:number = 120; //Number of seconds before starting autoswipe.
		_autoswipedId:string = ""; //The id of the screen currently autoswiped to. 

		_inactiveCounter:number = 0; //Counts seconds that the screen is inactive.
		_inactiveTimer:any = null;
		_autoswipeMode:boolean = false;

		_currentView:View=null;
		_views:any={};

		_swipeCounter:number=0; //Counts seconds before automatically moving to the next view.

		_reloadTime:number = 60*60*1; //Seconds between automatic refresh. For refreshing the entire "system".
		_reloadCounter:number=0; //Counts seconds since last reload.


		//Should be called once at app start.
		constructor() {
			$("body").get(0).addEventListener("mousemove", this.mousemove, false); //Listen for all mouse move events.
			$("body").get(0).addEventListener("touchstart", this.mousemove, false); 

			//Start the inactivity timer:
			this._inactiveCounter = 0;
			this._swipeCounter = 0;
			this._inactiveTimer = setInterval(this.ontimer, 1000);

			this._views = {};
		}

		//Creates the swiper and makes subelements of slider-container swipeable.
		createSwiper=()=> {
			
			this._swiper = Swipe(document.getElementById("slider"), {
				continuous: true,
				disableScroll: true,
				callback: this.onSwipeBegin,
				transitionEnd: this.onSwipeEnd
				}); 

		}


		//Called every time the mouse moves on screen. 
		//No mouse move means no interaction.
		private mousemove=()=> {
			//Reset the timer:
			this._inactiveCounter = 0;
			this._swipeCounter = 0;
			this._autoswipeMode = false;
			this._reloadCounter = 0;
		}

		//Invoked once a second.
		private ontimer=()=> {

			this._inactiveCounter += 1;
			if(this._inactiveCounter>this._inactiveWait) { //If there have been no activity for _inactiveWait seconds.
				this._swipeCounter += 1;
				this._autoswipeMode = true;
			}

			if(this._swipeCounter >= this._autoswipeTime) {
				console.log(this._autoswipedId);
				switch(this._autoswipedId) {
					case "overView":
						this.moveTo("clockView");
						break;
					case "clockView":
						this.moveTo("overView");
						break;
					default:
						this.moveTo("overView");
						break;

				}
				//this._swiper.next();
				this._swipeCounter = 0;
			}

			this._reloadCounter+=1;
			if(this._reloadCounter >= this._reloadTime) {
				window.location.reload();
				this._reloadCounter=0;
			}
		}

		onSwipeBegin=(index:number, element:any)=> { //Invoked when the swiper starts moving.
            this.setActiveView(element.id);

            //Log the interaction if the view container is not in autoswipe mode. 
            if(ClientConfig.getInteractionLogging()==true && this._autoswipeMode==false) {
            	var url:string = "../server/query/?query=sendLogData&houseId=" + ClientConfig.getHouseId() + "&screen=" + element.id;
            	var obtainer = new DataObtainer(url);
            	obtainer.obtain();
            }
		}

		private onSwipeEnd=(index:number, element:any)=> { //Invoked when the swiper stops moving.
			/*if(this._views[element.id]==null)
				return;
			if(this._currentView!=null)
				this._currentView.disable();
			this._currentView = this._views[element.id];
			this._currentView.enable();*/
		}

		//Registers a single view under a given name.
		registerView=(name:string, view:View)=> {
			this._views[name] = view;
		}

		//Calls setup() on all registered views.
		setupViews=()=> {
			for(var x in this._views) {
				this._views[x].setup();
			}
		}

		next=()=> {
			if(this._swiper!=null) {
				this._swiper.next();
			}
		}

		prev=()=> {
			if(this._swiper!=null) {
				this._swiper.prev();
			}
		}

		//Moves the slider to the specified selector id.
		moveTo=(id:string)=> {

			var pos:number=-1;
			$(".swipe-box").each(function(index, element){
				var el:any = element; //Hack, because DefTyped file is wrong. So very wrong! FUCK YOU TYPESCRIPT!
				if(el.id == id)
					pos = index;
				});
			console.log(pos);
			if(pos<0)
				return;
			this._swiper.slide(pos,300);
			this._autoswipedId = id;

		}

		//sets the active view, enabling/disabling as needed.
		setActiveView=(id:string)=> {

            var topviewconatainer = new TopViewContainerController();
            topviewconatainer.viewHasChanged(id);
			if(this._currentView != null) {
				this._currentView.disable();
				this._currentView = null;
			}

			if(this._views[id]!=null) {
				this._currentView = this._views[id];
				this._currentView.enable();
			}
		}

		getActiveView=()=> {

		}

	}

}