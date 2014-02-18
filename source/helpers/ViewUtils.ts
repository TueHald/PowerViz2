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
	}
}