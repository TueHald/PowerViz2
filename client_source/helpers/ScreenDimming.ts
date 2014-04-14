/**
 * Created by floop on 03/04/14.
 */


module PowerViz{

    //class that defines a container for topviews so we can
    //manipulate them
    export class ScreenDimming{


        private _timer:any;

        public constructor(){

            this.enable();

        }


        //enable timer
        enable=()=> {
            this._timer = setInterval(this.onTime, 30*1000); //Start the timer.

            this.onTime(); //Run the "updating" procedure once when the view is enabled.
        }

        //disable timer
        disable=()=> {
            if(this._timer!=null) //If the timer is running, stop it.
                clearInterval(this._timer);
            this._timer = null;
        }



        //Internal timer function, runs every X seconds.
        private onTime=()=> {

            var date = new Date;

            if( date.getHours()>= 21 || date.getHours() <= 6){
                $( ".paper" ).css( "opacity", "0.3" );
                console.log("timer running opacity 0,3")

            }else if(date.getHours()>= 20 && date.getHours() <= 21){

                $( ".paper" ).css( "opacity", "0.6" );
                console.log("timer running opacity 0,6")


            }else if(date.getHours()>= 19 && date.getHours() <= 20){

                $( ".paper" ).css( "opacity", "0.8" );
                console.log("timer running opacity 0,8")

            }else if(date.getHours()>= 6 && date.getHours() <= 7){

                $( ".paper" ).css( "opacity", "0.6" );
                console.log("timer running opacity 0,6")

            }else if(date.getHours()>= 7 && date.getHours() <= 8){

                $( ".paper" ).css( "opacity", "0.8" );
                console.log("timer running opacity 0,8")

            }else{

                $( ".paper" ).css( "opacity", "1" );
                console.log("timer running opacity 1")

            }


        }



    }

}