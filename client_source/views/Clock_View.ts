///<reference path="../References.ts" />


module PowerViz {

    export class Clock_View implements View {

        _name:string = "clockView";
        _id:string = "#clockView";
        _iconPath1:string = "Images/icon_windmill.svg";
        _iconPath2:string = "Images/icon_house.svg";
        _controller:ClockController;

        //Required by View interface.
        setup=()=> {


            this.drawframe(this._name,"85","100");



        }

        //Not required, but makes linking the controller to the view sligtly easier.
        //Should only be used by the controller.
        set controller(c:ClockController) {
            this._controller = c;
        }

        //Required by the View interface.
        enable=()=> {
            this._controller.enable();
        }

        //Required by the View interface.
        disable=()=> {
            this._controller.disable();
        }

        //Required by the View interface.
        beginLoading=()=> {

        }

        //Required by the View interface.
        endLoading=()=> {

        }
        //The update function is used to update the entire view
        //the redrawcontentfram shifts the timeline
        //the redrawgraph draws a new graph based on inputdata
        update=(clockArray:any, littleArm:number, largeArm:number)=>{

            this.updateClock(this._name,littleArm,largeArm);

            this.updateSlots(this._name,clockArray);


        }

        drawframe=(id:string, width:string, height:string)=>{

            //create the contentframe
            var frame = document.createElement('div');
            frame.id = id +'_contentframe';
            frame.style.width = width + "%";
            frame.style.height = height + "%";
            frame.style.position = "absolute";
            frame.style.left = "50%";

            var div = document.getElementById(id);

            div.appendChild(frame);

            frame.style.marginLeft = "-"+(frame.offsetWidth/2).toString()+"px";



            //create a container for the vertical line
            var boxcontainer = document.createElement('div');
            boxcontainer.id = id +'_clockcontainer';
            boxcontainer.style.width = frame.offsetWidth.toString()+"px";
            boxcontainer.style.height = "600px";
            boxcontainer.style.position = "absolute";
            boxcontainer.style.top = "15%";
            boxcontainer.style.left = "50%";
            boxcontainer.style.zIndex = "100";
            boxcontainer.style.marginLeft = "-"+(frame.offsetWidth/2).toString()+"px";

            //get the contentframe
            var contentframe = document.getElementById(id +'_contentframe');
            frame.appendChild(boxcontainer);

            this.createFields(id);
            this.distributeFields(id);
            this.distributeClockarms(id);
            this.distributeTimeFields(id);


            }


        createFields=(id:string)=>{
        $('.field').remove();
        var container = $('#'+id+'_clockcontainer');
        for(var i = 0; i < +48; i++) {
            $('<div/>', {
                'id': 'field'+ (i+1).toString(),'class': 'clockfield'
            }).appendTo(container);
            }
        }

        distributeFields=(id:string)=> {
        var radius = 250;
        var topOffset = 20;
        var xOffset = 0;
        var rotation = 147;
        var fields = $('.clockfield'),
            container = $('#'+id +'_clockcontainer'),
            width = container.width(),
            height = container.height(),
            angle = 1.1,
            step = (2*Math.PI) / fields.length,
            counter = 1;
        fields.each(function() {
            var x = (Math.round(width/2 + radius * Math.cos(angle) - $(this).width()/2));
            var y = topOffset+(Math.round(height/2 + radius * Math.sin(angle) - $(this).height()/2));

            $(this).css({
                left: xOffset+x + 'px',
                top: y + 'px'
                //transform: 'rotate('+ rotation + 'deg)'
            });

            if(counter == 0){
                angle += step/2;
            }
            else if(counter%4 == 0 )
            {
                angle += step+0.032;
            }
            else{
                angle += step/2+0.055;
            }
            counter++;

            console.log("step is:"+step.toString());

        });

            counter = 1;

            for(var num = 0; num<48;num ++){

                var field = $('#field'+(num+1).toString()).css({transform: 'rotate('+ rotation + 'deg)'});
                field.css('background-image', 'url("' + "Images/watchTest.svg" + '")');

                //field.css({transform: 'rotate('+ rotation + 'deg)'});
                if(counter%4==0){
                rotation += 14;
                }
                else{
                    rotation += 5.5;
                }

                counter++;


            }
    }

        distributeClockarms=(id:string)=>{

            var container = $('#'+id+'_clockcontainer');

            $('<div/>', {
               'id': 'big_clockarm','class': 'largeclockarm','background-image': 'Images/viser_stor.svg'
            }).appendTo(container);

            $('<div/>', {
                'id': 'small_clockarm','class': 'smallclockarm','background-image': 'Images/viser_lille.svg'
            }).appendTo(container);


            var bigclockarm = $('#big_clockarm');

            var littleclockarm = $('#small_clockarm');

            var container = $('#'+id +'_clockcontainer'),
                width = container.width(),
                height = container.height();


            bigclockarm.css({
                left: ((width/2)).toString() + 'px',
                top: ((height/2-bigclockarm.height()/2)+25).toString() + 'px',
                transform: 'rotate('+ 358 + 'deg)'
            });

            littleclockarm.css({
                left: (width/2).toString() + 'px',
                top: ((height/2-littleclockarm.height()/2)+25).toString() + 'px',
                transform: 'rotate('+ 358 + 'deg)'
            });


        }

        distributeTimeFields=(id:string)=>{

            var container = $('#'+id+'_clockcontainer');

            $('<div/>', {
                'id': 'clock_timefield_1','class': 'clock_timefield text-element'
            }).html("<h1>3</h1>").appendTo(container);

            $('<div/>', {
                'id': 'clock_timefield_2','class': 'clock_timefield text-element'
            }).html("<h1>6</h1>").appendTo(container);
            $('<div/>', {
                'id': 'clock_timefield_3','class': 'clock_timefield text-element'
            }).html("<h1>9</h1>").appendTo(container);

            $('<div/>', {
                'id': 'clock_timefield_4','class': 'clock_timefield text-element'
            }).html("<h1>12</h1>").appendTo(container);


            var timefield1 = $('#clock_timefield_1');
            var timefield2 = $('#clock_timefield_2');
            var timefield3 = $('#clock_timefield_3');
            var timefield4 = $('#clock_timefield_4');


            var container = $('#'+id +'_clockcontainer'),
                width = container.width(),
                height = container.height();

            timefield1.css({
                left: ((width/2 + 280)).toString() + 'px',
                top: ((height/2)-20).toString() + 'px'
                //transform: 'rotate('+ 358 + 'deg)'
            });

            timefield2.css({
                left: ((width/2 - timefield2.width())+30).toString() + 'px',
                top: ((height/2 + 270)).toString() + 'px'
                //transform: 'rotate('+ 358 + 'deg)'
            });

            timefield3.css({
                left: ((width/2 - 280 - timefield3.width())).toString() + 'px',
                top: ((height/2)-20).toString() + 'px'
                //transform: 'rotate('+ 358 + 'deg)'
            });

            timefield4.css({
                left: ((width/2 - timefield4.width())+20).toString() + 'px',
                top: ((height/2 - 310)).toString() + 'px'
                //transform: 'rotate('+ 358 + 'deg)'
            });




        }

        updateClock=(id:string,smallhand:number,largehand:number)=>{

            var bigclockarm = $('#big_clockarm');

            var littleclockarm = $('#small_clockarm');

            bigclockarm.css({
                transform: 'rotate('+ (largehand-1) + 'deg)'
            });

            littleclockarm.css({
                transform: 'rotate('+ (smallhand-1) + 'deg)'
            });

        }

        updateSlots=(id:string,slotArray:any)=>{


            console.log(slotArray);

            for(var i = 0; i < slotArray.length; i++){
                console.log("slot" + " = " + slotArray[i]);
            }



            var firstarray = slotArray.slice(20,49);
            var second = slotArray.slice(0,20);

            var final = firstarray.concat(second);


            for(var i = 0; i < final.length; i++){
                console.log("slot2" + " = " + final[i]);
            }


            var counter = 1;

            for(var num = 0; num<48;num ++){

                var field = $('#field'+(num+1).toString());
                //field.css('background-image', 'url("' + "Images/watchTest.svg" + '")');

                if(final[num] == 0){

                    field.css('background-image', 'url("Images/watchblank.svg")');

                }else if(final[num] == 1){

                    field.css('background-image', 'url("Images/watchwind.svg")');

                }else if(final[num] == 2){

                    field.css('background-image', 'url("Images/watchflex.svg")');

                }
                else if(final[num] == -1){

                    field.css('background-image', 'url("Images/watchgray.svg")');

                }else{


                    field.css('background-image', 'url("Images/watchprice.svg")');
                }



                counter++;


            }


        }


        //--------------------
        //Specific for this view.
        setHeadline=(txt:string)=> {
            $(this._id).text(txt);
        }


    }

}/**
 * Created by floop on 20/04/14.
 */
