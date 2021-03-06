//<reference path="../References.ts" />

module PowerViz {

	export class ViewUtils {

		static _topViewHeight:number;

		static setElementToWinHeight(id_string:string, minus?:number) {
			//console.log(id_string);
			//$(id).height($(window).height());
			$(id_string).css("height", ""+($(window).height()-(0||minus))+"px");
		}

		//Sets the element to the available window height minus the topbar height.
		static setElementToViewHeight(id:string) {
			var topHeight:number = $("#top-bar").height();
			ViewUtils.setElementToWinHeight(id, topHeight);
		}

		static getViewHeight() : number {
			var topHeight:number = $("#top-bar").height();
			return $(window).height() - topHeight;
		}


		//Shows the loading spinner.
		static showLoader() {
			$("#loader-spinner").show();
		}

		//Hides the loading spinner.
		static hideLoader() {
			$("#loader-spinner").hide();
		}

		//Sets the element to the available window width 
		static setElementTopBarWidth(id:string) {
			var topWidth:number = $("#top-bar").width();
			$(id).css("width", ""+topWidth+"px");
		}
		//Sets the element to the available Topbar height 
		static setElementTopBarHeight(id:string) {
			var topHeight:number = $("#top-bar").height();
			$(id).css("height", ""+topHeight+"px");
		}

        static getTopBarWidth():number{
            return  $("#top-bar").width();

        }
        static getSliderWidth():number{
            return  $("#slider").width();

        }
        static getTotalHeight():number{
            return  $("#slider").height()+$("#top-bar").height();

        }
		
	}
}