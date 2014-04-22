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
        update=()=>{




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
        var radius = 280;
        var topOffset = 70;
        var xOffset = 0;
        var rotation = 147;
        var fields = $('.clockfield'),
            container = $('#'+id +'_clockcontainer'),
            width = container.width(),
            height = container.height(),
            angle = 1,
            step = (2*Math.PI) / fields.length,
            counter = 1;
        fields.each(function() {
            var x = (Math.round(width/2 + radius * Math.cos(angle) - $(this).width()/2));
            var y = topOffset+(Math.round(height/2 + radius * Math.sin(angle) - $(this).height()/2));
            if(window.console) {
                console.log($(this).text(), x, y);
            }
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
                angle += step+0.046;
            }
            else{
                angle += step/2+0.05;
            }
            counter++;

            console.log("step is:"+step.toString());

        });

            counter = 1;

            for(var num = 0; num<48;num ++){

                var field = $('#field'+(num+1).toString()).css({transform: 'rotate('+ rotation + 'deg)'});

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

        //--------------------
        //Specific for this view.
        setHeadline=(txt:string)=> {
            $(this._id).text(txt);
        }


    }

}/**
 * Created by floop on 20/04/14.
 */
