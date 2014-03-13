module PowerViz {

	export class DateHelper {

		public static dateToJsString(date:Date) : String  {

			var years = date.getFullYear();
			var months = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth()+1) : "" + (date.getMonth()+1);
			var days = date.getDate()<10 ? "0"+date.getDate() : ""+date.getDate();

			var hours = date.getHours()<10 ? "0"+date.getHours() : ""+date.getHours();
			var minutes = date.getMinutes()<10 ? "0"+date.getMinutes() : ""+date.getMinutes();
			var seconds = date.getSeconds()<10 ? "0"+date.getSeconds() : ""+date.getSeconds();

			return ""+years+"-"+months+"-"+days+"T"+hours+":"+minutes+":"+seconds;
		}

	}


}