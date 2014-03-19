module PowerViz {

	export class DataObtainer {

		_url:any;

		constructor(url:String) {
			this._url = url;
		}

		public obtain=()=> {
			var request = new XMLHttpRequest();
			var that = this;
			request.onreadystatechange = function() {
				if(request.readyState == 4) {
					that.onDataObtained(request.responseText); 
				}
			}
			request.open("GET", this._url);
			request.send();
		}

		public onDataObtained(data:String) {

		}

	}

}