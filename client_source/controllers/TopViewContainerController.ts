/**
 * Created by floop on 03/03/14.
 */
///<reference path="../References.ts" />


module PowerViz{

    //defines a controller that controls the TopviewContainer
    export class TopViewContainerController{

        //Should have a container for the topview
        controllerContainer:TopViewContainer;


        //constructor takes a container
        constructor(container:TopViewContainer) {
            this.controllerContainer = container;
        }

        //this method should be called when view have changed
        viewHasChanged=(newView:string)=>{

            this.controllerContainer.setActiveView(newView);

        }


    }


}