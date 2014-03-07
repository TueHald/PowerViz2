/**
 * Created by floop on 07/03/14.
 */

///<reference path="../References.ts" />

module PowerViz {

    export class DrawUtils {

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

// inspired by this paper
// http://iwi.eldoc.ub.rug.nl/FILES/root/2008/ProcCAGVIMeraj/2008ProcCAGVIMeraj.pdf
        static handDrawLine(ctx, x0, y0, x1, y1){

        console.log("logged");
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
            console.log("outer");
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
            ctx.bezierCurveTo(this.fuzz(x0, f), this.fuzz(y0, f), x1, y1);

            ctx.moveTo(x1, y1);
            //ctx.stroke();
        }
        var lineData =[];

        for (var i = 0; i < coords.length; i++)
        {
            var x = coords[i].x;
            var y = coords[i].y;
            lineData.push({"x":x,"y":y});
            console.log("x="+ x.toString()+"y="+ y.toString());
        }



   }


        static fuzz(x, f){
        return x + Math.random()*f - f/2;
    }


        static storeCoordinate(xVal, yVal, array) {
        array.push({x: xVal, y: yVal});
    }


        static lineFunction = d3.svg.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; })
        .interpolate("cardinal");


    }

}