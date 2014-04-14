/**
 * Created by floop on 07/03/14.
 */

///<reference path="../References.ts" />

module PowerViz {

    export class DrawUtils {

        //sets the graph interprolation function parameter
        //interprolation type
        static _interprolation = "bundle";
        //sets number of points on the x axis
        static _numPointsX = 96;
        //the thickness of the graph
        static _graphthickness = 6;
        //the width of the graph frame
        static _framewidt = 1227;
        //Distance from bottom - all elements
        static _distancefromBottom = "12%";
        //the interval between time elements. eg. every 4 hours
        static _timeDistance = 3;

        // estimate the movement of the arm
        // x0: start
        // x1: end
        // t: step from 0 to 1
        static handDrawMovement(x0, x1, t){
        return x0 + (x0-x1)*(
            15*Math.pow(t, 4) -
                6*Math.pow(t, 5) -
                10*Math.pow(t,3)
            )
    }

        //returns a random path to a file
        static choose():string{

        var filename = "Images/timelineelement_0.svg";

        var random = Math.random();

        if(random <0.10)
        {
            return "Images/timelineelement_0.svg";
        }
        else if(random < 0.2 && random > 0.1 ){

            return "Images/timelineelement_1.svg";
        }
        else if(random < 0.3 && random > 0.2 ){

            return "Images/timelineelement_2.svg";
        }
        else if(random < 0.4 && random > 0.3 ){

            return "Images/timelineelement_3.svg";
        }else if(random < 0.5 && random > 0.4 ){

            return "Images/timelineelement_4.svg";
        }else if(random < 0.6 && random > 0.5 ){

            return "Images/timelineelement_5.svg";
        }else if(random < 0.7 && random > 0.6 ){

            return "Images/timelineelement_6.svg";
        }else if(random < 0.8 && random > 0.7 ){

            return "Images/timelineelement_7.svg";
        }else if(random < 0.9 && random > 0.8 ){

            return "Images/timelineelement_8.svg";
        }else if(random < 1.0 && random > 0.9 ){

            return "Images/timelineelement_9.svg";
        }
        else if(random == 1.0  ){

            return "Images/timelineelement_10.svg";
        }


        return filename;


    }

        //creates an array of hour numbers to go into the timeline
        static createTimeLine():any{


        var currentdate = new Date();
        var dateArray = [];

        var hour = currentdate.getHours() + 1;

        if(currentdate.getMinutes() <= 15){

            hour = currentdate.getHours();
        }

        for(i=12;i>0;i--){//get date 12 hours back in time

            if(hour == 0){
                hour = 23;
            }
            else{
                hour = hour-1;

            }

        }


        dateArray.push(hour);
        for(var i = 0; i<23;i++){//calc the next 24 hours

            if(hour == 23)
            {hour = -1;}
            dateArray.push(hour+1);
            hour = hour + 1;

        }
        return dateArray;
    }

        static calcTime():number{


        var currentdate = new Date();



        if(currentdate.getMinutes() < 15){

            return 0;
        }
        else if(currentdate.getMinutes() < 30 && currentdate.getMinutes() >= 15){

            return 3;
        }
        else if(currentdate.getMinutes() < 45 && currentdate.getMinutes() >= 30){
            return 2;
        }
        else if(currentdate.getMinutes() < 60 && currentdate.getMinutes() >= 45){
            return 1;
        }
        else{

            return 0;
        }

    }

        //creates a canvas which the graphs can be drawn
        //view is the calling views name
        static createGraphCanvas(view:string,iconPath1:string, iconPath2:string, iconName1:string, iconName2:string, appendIcons:boolean){


            //create a container for the vertical line
            var graphCanvas = document.createElement('div');
            graphCanvas.id = view +'_graphcanvas';

            var hor_lineContainer = document.getElementById(view +'_horizontallinecontainer');
            var ver_lineContainer = document.getElementById(view +'_verticallinecontainer');


            graphCanvas.style.width = hor_lineContainer.offsetWidth.toString()+"px";
            graphCanvas.style.height = "547px";//bug, cannot get the height so we set it manually.. stupid js


            graphCanvas.style.position = "absolute";
            graphCanvas.style.left = "50%";

            //get the contentframe and position it
            var contentframe = document.getElementById(view +'_contentframe');
            contentframe.appendChild(graphCanvas);

            graphCanvas.style.bottom =  ""+(ViewUtils.getTotalHeight()-ver_lineContainer.getBoundingClientRect().top).toString()+"px";
            graphCanvas.style.marginLeft = "-"+(hor_lineContainer.offsetWidth/2).toString()+"px";


            //create a container for the icons
            var IconContainer = document.createElement('div');
            IconContainer.id = view +'_Iconcontainer';

            IconContainer.style.width = "60px";
            IconContainer.style.height = "547px";
            IconContainer.style.bottom =""+(ViewUtils.getTotalHeight()-ver_lineContainer.getBoundingClientRect().top).toString()+"px";
            IconContainer.style.position = "absolute";
            IconContainer.style.left = "50%";
            IconContainer.style.marginLeft = "-"+((hor_lineContainer.offsetWidth/2)+80).toString()+"px";

            contentframe.appendChild(IconContainer);


            if(appendIcons){
            //append icons
            DrawUtils.appendIcons(view,iconPath1,iconPath2,iconName1,iconName2);
            }


        }

        static drawLegend(viewName:string, legendpath:string){


            //get canvas
            var graphCanvas = document.getElementById(viewName +'_Iconcontainer');
            //place 1st icon
            var iconContainer1 = document.createElement('div');
            iconContainer1.id = viewName +'_icon_legend';
            iconContainer1.style.width = "60px";
            iconContainer1.style.height = "547px";
            iconContainer1.style.position = "absolute";
            iconContainer1.style.top = "-350px";
            iconContainer1.style.marginLeft = "0%";
            iconContainer1.style.zIndex = "100";
            //append icon to the container
            graphCanvas.appendChild(iconContainer1);





            //IMPORT VERTICAL LINE SVG FILE
            d3.xml(legendpath, "image/svg+xml", function(xml) {
                var importedNode = document.importNode(xml.documentElement, true);

                var svg = d3.select("#"+viewName +'_icon_legend').node().appendChild(importedNode);

                //console.log(d3.select("#"+id +'_verticallinecontainer').node().attributes.getNamedItem("id").value.toString());


                var element = document.getElementById(viewName + "_icon_legend");

                //the <any> tag is a cast and should be used for the typescript compiler
                //else it will throw an exception
                //var child = <any>element.firstChild;

                //console.log(child.offsetHeight.toString());

                //child.className = "foo";
                //child.style.width = "10px";



                d3.select("#"+viewName +'_icon_legend').selectAll("svg")
                    .attr("viewBox", "0 0 150 150")
                    .attr("width", "80px")
                    .attr("height", "1000px")
                    .attr("preserveAspectRatio", "xMidYMid meet");



            });


        }

        //appends icons to the contentframe
        static appendIcons(viewName:string,iconPath1:string, iconPath2:string, iconName1:string, iconName2:string){


            //get canvas
            var graphCanvas = document.getElementById(viewName +'_Iconcontainer');
            //place 1st icon
            var iconContainer1 = document.createElement('div');
            iconContainer1.id = viewName +'_icon_icon1';
            iconContainer1.style.width = "80px";
            iconContainer1.style.height = "105px";
            iconContainer1.style.position = "absolute";
            iconContainer1.style.bottom = "15%";
            iconContainer1.style.marginLeft = "0%";
            iconContainer1.style.zIndex = "100";
            //append icon to the container
            graphCanvas.appendChild(iconContainer1);





            //IMPORT VERTICAL LINE SVG FILE
            d3.xml(iconPath1, "image/svg+xml", function(xml) {
                var importedNode = document.importNode(xml.documentElement, true);

                var svg = d3.select("#"+viewName +'_icon_icon1').node().appendChild(importedNode);

                //console.log(d3.select("#"+id +'_verticallinecontainer').node().attributes.getNamedItem("id").value.toString());


                var element = document.getElementById(viewName + "_icon_icon1");

                //the <any> tag is a cast and should be used for the typescript compiler
                //else it will throw an exception
                //var child = <any>element.firstChild;

                //console.log(child.offsetHeight.toString());

                //child.className = "foo";
                //child.style.width = "10px";



                d3.select("#"+viewName +'_icon_icon1').selectAll("svg")
                    .attr("viewBox", "0 0 150 150")
                    .attr("width", "80")
                    .attr("height", "70")
                    .attr("preserveAspectRatio", "xMidYMid meet");

                //child.setAttribute = ("viewBox", "0,0,50,50");
                //child.style.position = "absolute";
                //child.viewBox = "0 0 50 50";


            });

            //make textbox under svg
            var textcontainer1 = document.createElement('div');
            textcontainer1.id = viewName +'_icon_text1';
            textcontainer1.className = "text-element";
            textcontainer1.style.position = "absolute";
            textcontainer1.style.top = "80px";
            textcontainer1.style.marginLeft = "0%";
            textcontainer1.style.zIndex = "100";
            textcontainer1.innerHTML = "<center>"+iconName1+"<\center>";
            textcontainer1.style.fontSize = "1.2em";
            iconContainer1.appendChild(textcontainer1);

            //place 2nd icon
            var iconContainer2 = document.createElement('div');
            iconContainer2.id = viewName +'_icon_icon2';
            iconContainer2.style.width = "80px";
            iconContainer2.style.height = "95px";
            iconContainer2.style.position = "absolute";
            iconContainer2.style.bottom = "40%";
            iconContainer2.style.marginLeft = "0%";
            iconContainer2.style.zIndex = "100";
            //append icon to the container
            graphCanvas.appendChild(iconContainer2);


            //IMPORT VERTICAL LINE SVG FILE
            d3.xml(iconPath2, "image/svg+xml", function(xml) {
                var importedNode = document.importNode(xml.documentElement, true);

                var svg = d3.select("#"+viewName +'_icon_icon2').node().appendChild(importedNode);

                //console.log(d3.select("#"+id +'_verticallinecontainer').node().attributes.getNamedItem("id").value.toString());


                d3.select("#"+viewName +'_icon_icon2').selectAll("svg")
                    .attr("viewBox", "0 0 150 150")
                    .attr("width", "80")
                    .attr("height", "70")
                    .attr("preserveAspectRatio", "xMidYMid meet");

            });

            var textcontainer2 = document.createElement('div');
            textcontainer2.id = viewName +'_icon_text2';
            textcontainer2.className = "text-element";
            textcontainer2.style.position = "absolute";
            textcontainer2.style.bottom = "0%";
            textcontainer2.style.marginLeft = "0%";
            textcontainer2.style.zIndex = "100";
            textcontainer2.style.fontSize = "1.2em";
            textcontainer2.innerHTML = "<center>"+iconName2+"<\center>";

            iconContainer2.appendChild(textcontainer2);



        }

        //draws a square in the frame
        //**NOT USED**
        static drawSquare(id:string, width:number, height:number, color:string){


            var canvas = d3.select(id)
                .append("svg:svg")
                .attr("width", "100%")//canvasWidth)
                .attr("height", "100%")
                .style("position","absolute")
                .style("margin-right","auto")
                .style("margin-left","auto");



            var rectangle = canvas.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("fill",color);


        }

        //draws a horissontal line between two x coordinates, fuzzyness
        //is the randomness of the line, eg. how sketchy it looks.
        static drawHorisontalLine(from:number,to:number,fuzzyness:number){

            var svg = d3.select("body").append("svg")
                .attr("width", "100%")
                .attr("height", "100%")
                .style("top","50%")
                .style("position","absolute");


            var lineData = d3.range(from,to,fuzzyness).map(function(x) {
                return {x: x, y: 10 + Math.floor(Math.random()*6)-3}
            });

            var lineFunction = d3.svg.line()
                .x(function(d) { return d.x; })
                .y(function(d) { return d.y; })
                .interpolate("basis");

            function draw(points) {

                var lineGraph = svg.append("path")
                    .attr("stroke", "blue")
                    .attr("stroke-width", 1)
                    .attr("fill", "none")
                    .attr("d", lineFunction(points));

                if (points.length < lineData.length)

                    draw(lineData);

            }

            draw([]);
        }

        //draws a horissontal line between two x coordinates, fuzzyness
        //is the randomness of the line, eg. how sketchy it looks.
        //roughly based on: http://stackoverflow.com/questions/20695723/d3-smoothly-animate-a-hand-drawn-line
        static drawVerticalLine(from:number,to:number,fuzzyness:number){

            var svg = d3.select("body").append("svg")
                .attr("width", "100%")
                .attr("height", "100%")
                .style("top","50%")
                .style("position","absolute");




            var lineData = d3.range(from,to,fuzzyness).map(function(y) {
                return {y: y, x: 10 + Math.floor(Math.random()*6)-3}
            });

            var lineFunction = d3.svg.line()
                .x(function(d) { return d.x; })
                .y(function(d) { return d.y; })
                .interpolate("cardinal");

            function draw(points) {

                var lineGraph = svg.append("path")
                    .attr("stroke", "blue")
                    .attr("stroke-width", 1)
                    .attr("fill", "none")
                    .attr("d", lineFunction(points));

                if (points.length < lineData.length)

                    draw(lineData);

            }

            draw([]);
        }

        static redrawContentFrame(id:string){


            var framewidt = 1227;
            var distancefromBottom = "12%";
            var timeDistance = 4;

            var hor_linecontainer = document.getElementById(id +'_horizontallinecontainer');

            //remove the timeelements
            d3.select("#"+id+"_horizontallinecontainer").selectAll("#"+id +"_horizontalTimecontainer").remove();



            var len = hor_linecontainer.offsetWidth;
            var x_coord = 0;
            var y_coord = hor_linecontainer.getBoundingClientRect().top;



            var time_line_marks_len = len/96;
            var len_array = [];


            //get offset
            var offset = DrawUtils.calcTime();

            var timeLineArray = DrawUtils.createTimeLine();

            var count = x_coord + (time_line_marks_len*offset);

            len_array.push(count)

            for(var i = 0; i<23;i++){
                len_array.push(count + (time_line_marks_len*4));
                count = count + (time_line_marks_len*4);

            }

            //create vertical timelineelements
            for(var j = 0; j<len_array.length;j++){


                //move the element to the new position
                var temp_timeline = document.getElementById(id +'_horizontallinecontainer'+ j.toString());
                temp_timeline.style.left = len_array[j].toString()+"px";
                temp_timeline.className =  "time_container";
                //temp_timeline.style.bottom = distancefromBottom;



               if(timeLineArray[j]%DrawUtils._timeDistance == 0){

                    var temp_timebox = document.createElement('div');
                    temp_timebox.id = id +'_horizontalTimecontainer';
                    temp_timebox.style.width = "5px";
                    temp_timebox.style.height = "20px";
                    temp_timebox.style.position = "absolute";
                    temp_timebox.style.left = (len_array[j]-15).toString()+"px";
                    temp_timebox.style.top = "40%";
                    temp_timebox.className = "time-element";

                    temp_timebox.innerHTML = "<h2>"+timeLineArray[j].toString()+":00"+"<\h2>";

                    hor_linecontainer.appendChild(temp_timebox);

                }
            }

        }

        // inspired by this paper
        // http://iwi.eldoc.ub.rug.nl/FILES/root/2008/ProcCAGVIMeraj/2008ProcCAGVIMeraj.pdf
        static handDrawLine(ctx, x0, y0, x1, y1){


        var coords = [];
        ctx.moveTo(x0, y0)

        var d = Math.sqrt((x1-x0)*(x1-x0)+(y1-y0)*(y1-y0))

        var steps = d/40;
        if(steps < 4) {
            steps = 4;
        }


        // fuzzyness
        var f = 10.0;
        for(var i = 1; i <= steps; i++)
        {
            var t1 = i/steps;
            var t0 = t1-1/steps;
            var xt0 = this.handDrawMovement(x0, x1, t0);
            var yt0 = this.handDrawMovement(y0, y1, t0);
            var xt1 = this.handDrawMovement(x0, x1, t1);
            var yt1 = this.handDrawMovement(y0, y1, t1);


            this.storeCoordinate(x1, y1, coords);
            ctx.quadraticCurveTo(this.fuzz(xt0, f), this.fuzz(yt0, f), xt1, yt1);
            ctx.moveTo(xt1, yt1);
            ctx.strokeStyle = 'green';
            ctx.lineWidth = 2;
            ctx.lineCap="round";
            ctx.stroke();
        }

        var lineData =[];

        // for (var i = 0; i < coords.length; i++) {
        //     var x = coords[i].x;
        //     var y = coords[i].y;
        //     lineData.push({"x":x,"y":y});
        //console.log("x="+ x.toString()+"y="+ y.toString());
        // }


        /*//The SVG Container
         var svgContainer = d3.select("body").append("svg")
         .attr("width", 600)
         .attr("height", 600)
         .style("z-index","199")
         .style("top","20%")
         .style("left","20%")
         .style("position","absolute");

         //The line SVG Path we draw
         var lineGraph = svgContainer.append("path")
         .attr("d", lineFunction(lineData))
         .attr("stroke", "black")
         .attr("stroke-width", 2)
         .attr("fill", "none");*/





    }

        static handDrawnGraph(ctx, coords){

        for(var i = 0; i <= coords.length-1; i++)
        {
            if(i == coords.length-1){

                break;
            }

            this.handDrawLine(ctx, coords[i].x, coords[i].y, coords[i+1].x, coords[i+1].y);

        }

    }

        // hand draw a circle
        // ctx: Context2D
        // x, y: Coordinates
        // r: radius
        static handDrawCircle(ctx, x, y, r){
        var steps = Math.ceil(Math.sqrt(r)*3);

        // fuzzyness dependent on radius
        var f = 0.50*r;

        // distortion of the circle
        var xs = 1.0+Math.random()*0.1-0.05;
        var ys = 2.0-xs;
        var coords = [];

        ctx.moveTo(x+r*xs, y);

        for(var i = 1; i <= steps; i++)
        {
            var t0 = (Math.PI*2/steps)*(i-1);
            var t1 = (Math.PI*2/steps)*i;
            var x0 = x+Math.cos(t0)*r*xs;
            var y0 = y+Math.sin(t0)*r*ys;
            var x1 = x+Math.cos(t1)*r*xs;
            var y1 = y+Math.sin(t1)*r*ys;

            this.storeCoordinate(x0, y0, coords);
            ctx.bezierCurveTo(DrawUtils.fuzz(x0, f), DrawUtils.fuzz(y0, f), x1, y1);

            ctx.moveTo(x1, y1);
            //ctx.stroke();
        }
        var lineData =[];

        for (var i = 0; i < coords.length; i++)
        {
            var x = coords[i].x;
            var y = coords[i].y;
            lineData.push({"x":x,"y":y});

        }



   }

        //fuzzyness function
        static fuzz(x, f){
        return x + Math.random()*f - f/2;
        }

        static storeCoordinate(xVal, yVal, array) {
        array.push({x: xVal, y: yVal});
    }

        static lineFunction = d3.svg.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; })
        .interpolate("cardinal").tension(0.50);

        static slopedline(x0, y0, x1, y1, fuzzyness){

            var dx = Math.abs(x1-x0);
            var dy = Math.abs(y1-y0);
            var sx = (x0 < x1) ? 1 : -1;
            var sy = (y0 < y1) ? 1 : -1;
            var err = dx-dy;
            var linedata = [];



            var vectorLength = this.jitterFunction((x0-x1),(y0,y1));


            //set the interval of the points
            var interval = Math.floor((100/vectorLength)+fuzzyness);
            var intervalCount = 0;



            for(var i=0; i<interval;i++){


                addLineData(x0 + Math.floor(Math.random()*6)-2,y0 + Math.floor(Math.random()*6)-2,linedata);



                intervalCount ++;
                if ((x0==x1) && (y0==y1)) break;
                var e2 = 2*err;
                if (e2 >-dy){ err -= dy; x0  += sx; }
                if (e2 < dx){ err += dx; y0  += sy; }
            }


            function addLineData(x:number, y: number, array){

                array.push({"x": x,   "y": y})


            }

            return linedata;


        }

        //function to draw a graph, doesnt actually draw anything but splits data in two
        //takes a name for the svgelement and a id string that defines an element to insert svg into.
        static drawGraph(CoordinateSet, id:string, svgname:string, color:string):number{



            var newCoordinateset1 = CoordinateSet.slice(0,49);
            var newCoordinateset2 = CoordinateSet.slice(48,96);


            //draw normal line
           var ycoord = DrawUtils.redrawGraph(newCoordinateset1,id, svgname+"1",color,false);

            //draw dotted line
            DrawUtils.redrawGraph(newCoordinateset2,id, svgname+"2",color,true);


            return ycoord;

        }

        //function that calculates vector
        //and returns it
        static jitterFunction(x:number,y:number){

        var vectorLength = 0;


        vectorLength = Math.sqrt((x*x) + (y*y));



        return vectorLength;


    }

        //places icons on y axis
        static placeIcons(viewName:string, y1:number, y2:number){

            //get the contentframe
            var container = document.getElementById(viewName    +'_graphcanvas');

            var y_height = container.offsetHeight/100;

            var y = y1*y_height;

            var icon = document.getElementById(viewName +'_icon_icon2');

            icon.style.top = ((container.offsetHeight-30) - y).toString() + "px";

            var icon2 =document.getElementById(viewName +'_icon_icon1');


            //if they are placed in the same area we move it!
            if(y2 < y1-10 || y2 > y1-10 ){



                if(y2 <= y1){


                    y = y2 *y_height - 50;

                    icon2.style.top = ((container.offsetHeight-50) - y).toString() + "px";

                }
                else if(y2 > y1){

                    y = y2 *y_height + 50;

                    icon2.style.top = ((container.offsetHeight-80) - y).toString() + "px";

                }
            }
            else{


                y = y2*y_height;

                icon2.style.top = ((container.offsetHeight+30) - y).toString() + "px";

            }



            if(y2 > 70){


                y = y2*y_height;

                icon2.style.top = ((container.offsetHeight-20) - y).toString() + "px";

            }

        }



        //function to draw a graph
        //takes a name for the svgelement and a id string that defines an element to insert svg into.
        static redrawGraph(CoordinateSet, id:string, svgname:string, color:string, dotted:boolean):number{



            var pathdata = [];

            var container = document.getElementById(id+'_graphcanvas');

            var y_height = container.offsetHeight/100;
            var x_len = container.offsetWidth/DrawUtils._numPointsX;



            if(CoordinateSet.length < 48){

                //write message to user
                container.className = "text-element"; //cartoonish font
                container.innerHTML = "Graf ikke tilgængelig på nuværende tidspunkt!";




            }
            else if(CoordinateSet.length >= 48){
            //ensure that the array is exactly 96 spaces long
            var newCoordinateset = CoordinateSet;



            for(var i=0;i<newCoordinateset.length-1;i++){

                var  tempdata = this.slopedline(((i)*x_len),(newCoordinateset[i].y*y_height),((i+1)*x_len),
                        (newCoordinateset[i+1].y*y_height),4);


                pathdata = pathdata.concat(tempdata);

            }

            //if dotted it means that all xcoordinates should be changed to the right of vertical line
           if(dotted){

               x_len = ((container.offsetWidth/2)/pathdata.length);
            //half length
            var temp_x_len = (0 + (container.offsetWidth/2))-x_len;

            //change x coordinate to half
            for(var t = 0; t<pathdata.length;t++){


                pathdata[t].x = temp_x_len + (t*x_len);

            }

               pathdata[pathdata.length-1].x = (pathdata[pathdata.length-1].x)-(0.5*x_len);

            }else{
               pathdata[pathdata.length-1].x = (pathdata[pathdata.length-1].x)+(0.5*x_len);

           }



            //change all y coordinates from relative height to actual height
            for(var t = 0; t<pathdata.length;t++){

                pathdata[t].y = (container.offsetHeight-20) - pathdata[t].y;

            }




            //function that is used for getting x and y coordinates
            var lineFunction = d3.svg.line()
                .x(function(d) { return d.x; })
                .y(function(d) { return d.y; })
                .interpolate(DrawUtils._interprolation).tension(0.90);

            //The SVG Container
            var svgContainer = d3.select("#"+svgname.toString());

            //if the element was not found, we create it
            if(d3.select("#"+svgname.toString()).empty()){

                svgContainer = d3.select("#"+id+'_graphcanvas').append("svg")
                    .attr("id",svgname)
                    .attr("width", container.offsetWidth.toString()+"px")
                    .attr("height", container.offsetHeight.toString() + "px")
                    //.style("top", "00%")
                    .style("position","absolute");
            }


            //remove path
            svgContainer.select("path").remove();

            //The line SVG Path we draw
            var lineGraph = svgContainer.append("path")
                .attr("d", lineFunction(pathdata))
                .attr("stroke", color)
                .attr("stroke-width", DrawUtils._graphthickness)
                .attr("fill", "none")
                .style("bottom", "0%")
                .style("position","absolute");
            //should the line be dashed?
            if(dotted)
            {
                lineGraph.style("stroke-dasharray", ("5, 5, 5, 5, 5, 5, 10, 5, 10, 5, 10, 5"))
            }

                if(!dotted){

                    return pathdata[0].y;
                }


           }

            return 0;

        }

        //method to draw contentframe inside the main view
        //id should be the id of the sourrounding containter
        //e.g the slider
        static drawContentFrame(id:string, width:string, height:string){


            //variables to be used in parts of the function



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
            var linecontainer = document.createElement('div');
            linecontainer.id = id +'_verticallinecontainer';
            linecontainer.style.width = "10px";
            linecontainer.style.position = "absolute";
            linecontainer.style.bottom = "15%";
            linecontainer.style.left = "50%";
            linecontainer.style.zIndex = "100";
            linecontainer.style.marginLeft = "-"+(0).toString()+"px";

            //get the contentframe
            var contentframe = document.getElementById(id +'_contentframe');
            contentframe.appendChild(linecontainer);

            //linecontainer.style.marginLeft = "-"+((linecontainer.offsetWidth/2)-40).toString()+"px";

            //IMPORT VERTICAL LINE SVG FILE
            d3.xml("Images/vertical_line.svg", "image/svg+xml", function(xml) {
                var importedNode = document.importNode(xml.documentElement, true);

               var svg = d3.select("#"+id +'_verticallinecontainer').node().appendChild(importedNode);

                //console.log(d3.select("#"+id +'_verticallinecontainer').node().attributes.getNamedItem("id").value.toString());


            });




            //create a container for the vertical line
            var hor_linecontainer = document.createElement('div');
            hor_linecontainer.id = id +'_horizontallinecontainer';
            hor_linecontainer.style.width = "100%";
            hor_linecontainer.style.height = "70px"
            hor_linecontainer.style.position = "absolute";
            hor_linecontainer.style.left = "50%";
            hor_linecontainer.style.bottom = "8%";
            hor_linecontainer.style.display = "block";




            contentframe = document.getElementById(id +'_contentframe');

            contentframe.appendChild(hor_linecontainer);

            hor_linecontainer.style.marginLeft = "-"+(hor_linecontainer.offsetWidth/2).toString()+"px";

            //IMPORT HORIZONTAL LINE SVG FILE
            d3.xml("Images/horizontal_line.svg", "image/svg+xml", function(xml) {
                var importedNode = document.importNode(xml.documentElement, true);

                //importedNode.attributes.setNamedItem();

                var svg = d3.select("#"+id +'_horizontallinecontainer').node().appendChild(importedNode);

                var parentElement = document.getElementById(id +'_horizontallinecontainer');


                //the <any> tag is a cast and should be used for the typescript compiler
                //else it will throw an exception
                var child = <any>parentElement.lastChild;

                child.style.width = hor_linecontainer.offsetWidth.toString() + "px";
                child.style.position = "absolute";
                //child.style.marginLeft = "-"+(child.offsetWidth/2).toString()+"px";


            });

            var len = hor_linecontainer.offsetWidth;
            var x_coord = 0;
            var y_coord = hor_linecontainer.getBoundingClientRect().top;



            var time_line_marks_len = len/96;
            var len_array = [];


            //get offset
            var offset = DrawUtils.calcTime();

            var timeLineArray = DrawUtils.createTimeLine();

            var count = x_coord + (time_line_marks_len*offset);

            len_array.push(count)

            for(var i = 0; i<23;i++){
                len_array.push(count + (time_line_marks_len*4));
                count = count + (time_line_marks_len*4);

            }

            //create vertical timelineelements
           for(var j = 0; j<len_array.length;j++){

                var temp_timeline = document.createElement('div');
                temp_timeline.id = id +'_horizontallinecontainer'+ j.toString();
                temp_timeline.style.width = "5px";
                temp_timeline.style.height = "20px";
                temp_timeline.style.position = "absolute";
                temp_timeline.style.left = len_array[j].toString()+"px";
                temp_timeline.className =  "time_container";
                //temp_timeline.style.bottom = distancefromBottom;




                hor_linecontainer.appendChild(temp_timeline);

                var countstring = "#"+id +'_horizontallinecontainer'+ j.toString();

               if(timeLineArray[j]%DrawUtils._timeDistance == 0){

                   var temp_timebox = document.createElement('div');
                   temp_timebox.id = id +'_horizontalTimecontainer';
                   temp_timebox.style.width = "5px";
                   temp_timebox.style.height = "20px";
                   temp_timebox.style.position = "absolute";
                   temp_timebox.style.left = (len_array[j]-15).toString()+"px";
                   temp_timebox.style.top = "40%";
                   temp_timebox.className = "time-element";

                   temp_timebox.innerHTML = "<h2>"+timeLineArray[j].toString()+":00"+"<\h2>";

                   hor_linecontainer.appendChild(temp_timebox);

               }

                v(countstring);

            }

            //create time boxes

            var time_list = [];

            function v (countstring){

                //IMPORT VERTICAL LINE SVG FILE
                d3.xml(DrawUtils.choose(), "image/svg+xml", function(xml) {

                    var importedNode = document.importNode(xml.documentElement, true);

                    var svg = d3.select(countstring).node().appendChild(importedNode);

                    //console.log(d3.select("#"+id +'_verticallinecontainer').node().attributes.getNamedItem("id").value.toString());


                });(countstring)


            }


        }







          /////PLACE METHODS WITHIN THIS BRACKET!
    }





}