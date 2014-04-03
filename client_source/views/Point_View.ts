///<reference path="../References.ts" />


module PowerViz {

    export class Point_View implements View {

        _name:string = "pointView";
        _id:string = "#pointView";
        //_iconPath1:string = "Images/icon_kr.svg";
        //_iconPath2:string = "Images/icon_house.svg";
        _controller:PointController;

        //Required by View interface.
        setup=()=> {

            //Set the size of the div:
            ViewUtils.setElementToViewHeight(this._id);
            //$(this._id).css("background-color", "yellow");

            this.drawframe(this._name,"85","100");



        }

        //Not required, but makes linking the controller to the view sligtly easier.
        //Should only be used by the controller.
        set controller(c:PointController) {
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
        update=(houseArray:any,priceArray:any)=>{

        }


        //--------------------
        //Specific for this view.
        setHeadline=(txt:string)=> {
            $(this._id).text(txt);
        }


        //drawing methods after this!


        // draws the frame which is supposed to be drawn in
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
            boxcontainer.id = id +'_boxcontainer';
            boxcontainer.style.width = frame.offsetWidth.toString()+"px";
            boxcontainer.style.height = "100px"
            boxcontainer.style.position = "absolute";
            boxcontainer.style.top = "20%";
            boxcontainer.style.left = "50%";
            boxcontainer.style.zIndex = "100";
            boxcontainer.style.marginLeft = "-"+(frame.offsetWidth/2).toString()+"px";

            //get the contentframe
            var contentframe = document.getElementById(id +'_contentframe');
            contentframe.appendChild(boxcontainer);


            //IMPORT VERTICAL LINE SVG FILE
            //d3.xml("Images/vertical_line.svg", "image/svg+xml", function(xml) {
            //    var importedNode = document.importNode(xml.documentElement, true);

            //    var svg = d3.select("#"+id +'_verticallinecontainer').node().appendChild(importedNode);

                //console.log(d3.select("#"+id +'_verticallinecontainer').node().attributes.getNamedItem("id").value.toString());


           // });

        }


    }

}/**
 * Created by floop on 03/04/14.
 */
