///<reference path="../References.ts" />

module PowerViz {

	export class DataFormat {

		//Forms consumption data and prognosis data into {"x":[number], "y":[number]} format. 
		public static formConsumptionAndPrognosisData=(consumptionData:any, prognosisData:any) : any => {

			var consDataArray:any = [];
			var max:number = 1000;

			//If there is no data, then fill the first element with empty data.
			if(consumptionData.consumption.length==0) 
				consDataArray[0] = {"x":0, "y":0};

			for(var j=0; j<consumptionData.consumption.length; j++) {
				consDataArray[j] = {"x":j, "y":(consumptionData.consumption[j].load/max)*100};
			}

			//Make sure that there is at least 48 elements in the first part of the array:
			while(consDataArray.length<48) {
				consDataArray[consDataArray.length] = consDataArray[consDataArray.length-1];
			}

			//Add the prognosis data:
			for(var k=0; k<prognosisData.consumption.length; k++) {
				consDataArray[k+48] = {"x":k+48, "y":(prognosisData.consumption[k].load/max)*100};
			}

			//Make sure that there always is the correct number of entries:
			while(consDataArray.length<96) {
				consDataArray[consDataArray.length] = consDataArray[consDataArray.length-1];
			}

			return consDataArray;
		}

	}

}