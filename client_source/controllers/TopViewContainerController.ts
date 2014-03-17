/**
 * Created by floop on 03/03/14.
 */
///<reference path="../References.ts" />


module PowerViz{

    //defines a controller that controls the TopviewContainer
    export class TopViewContainerController{



        //this method should be called when view have changed
        viewHasChanged=(newView:string)=>{


            TopViewContainer.instance.setActiveView(newView);

        }




    }


}