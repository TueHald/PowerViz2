///<reference path="../References.ts" />


module PowerViz {

    export class Point_View implements View {

        _name:string = "pointView";
        _id:string = "#pointView";
        //_iconPath1:string = "Images/icon_kr.svg";
        //_iconPath2:string = "Images/icon_house.svg";
        _controller:PointController;

        _boxScale:number = 196;
        _lineScale:number = 248;
        _pointScale:number = 100;

        //Required by View interface.
        setup=()=> {

            //Set the size of the div:
            ViewUtils.setElementToViewHeight(this._id);
            //$(this._id).css("background-color", "yellow");

            this.drawframe(this._name,"85","100");

            this.updatePoints(234,123,433);

            this.updateBallLayout(this._name, 3,4,2);



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
            boxcontainer.style.top = "15%";
            boxcontainer.style.left = "50%";
            boxcontainer.style.zIndex = "100";
            boxcontainer.style.marginLeft = "-"+(frame.offsetWidth/2).toString()+"px";

            //get the contentframe
            var contentframe = document.getElementById(id +'_contentframe');
            contentframe.appendChild(boxcontainer);


            //create a container for the vertical line
            var iconcontainer = document.createElement('div');
            iconcontainer.id = id +'_iconcontainer';
            iconcontainer.style.width = frame.offsetWidth.toString()+"px";
            iconcontainer.style.height = "50px"
            iconcontainer.style.position = "absolute";
            iconcontainer.style.top = "5%";
            iconcontainer.style.left = "50%";
            iconcontainer.style.zIndex = "100";
            iconcontainer.style.marginLeft = "-"+(frame.offsetWidth/2).toString()+"px";

            contentframe.appendChild(iconcontainer);



            //ADD THE FRONT BOXES

            var env_box = document.createElement('div');
            env_box.id = id +'_env_boxcontainer';
            env_box.style.width = "250px";
            env_box.style.height = "100px"
            env_box.style.position = "absolute";
            env_box.style.top = "0%";
            env_box.style.left = "0%";
            env_box.style.zIndex = "100";

            var flex_box = document.createElement('div');
            flex_box.id = id +'_flex_boxcontainer';
            flex_box.style.width = "250px";
            flex_box.style.height = "100px"
            flex_box.style.position = "absolute";
            flex_box.style.top = "0%";
            flex_box.style.left = "50%";
            flex_box.style.zIndex = "100";

            var price_box = document.createElement('div');
            price_box.id = id +'_price_boxcontainer';
            price_box.style.width = "250px";
            price_box.style.height = "100px"
            price_box.style.position = "absolute";
            price_box.style.top = "0%";
            price_box.style.right = "0%";
            price_box.style.zIndex = "100";

            //ADD THE BACKGROUND BOXES

            var env_background_box = document.createElement('div');
            env_background_box.id = id +'_env_background_boxcontainer';
            env_background_box.style.width = "250px";
            env_background_box.style.height = "97px"
            env_background_box.style.position = "absolute";
            env_background_box.style.top = "2px";
            env_background_box.style.left = "2px";
            env_background_box.style.zIndex = "50";
            //boxcontainer.style.marginLeft = "-"+(frame.offsetWidth/2).toString()+"px";


            var flex_background_box = document.createElement('div');
            flex_background_box.id = id +'_flex_background_boxcontainer';
            flex_background_box.style.width = "250px";
            flex_background_box.style.height = "97px"
            flex_background_box.style.position = "absolute";
            flex_background_box.style.top = "2px";
            flex_background_box.style.left = "50%";
            flex_background_box.style.zIndex = "50";


            var price_background_box = document.createElement('div');
            price_background_box.id = id +'_price_background_boxcontainer';
            price_background_box.style.width = "250px";
            price_background_box.style.height = "97px"
            price_background_box.style.position = "absolute";
            price_background_box.style.top = "2px";
            price_background_box.style.right = "-2px";
            price_background_box.style.zIndex = "50";


            //ADD ICONS

            var env_icon_box = document.createElement('div');
            env_icon_box.id = id +'_env_icon_boxcontainer';
            env_icon_box.style.width = "50px";
            env_icon_box.style.height = "50px"
            env_icon_box.style.position = "absolute";
            env_icon_box.style.top = "0%";
            env_icon_box.style.left = "0%";
            env_icon_box.style.zIndex = "100";


            var flex_icon_box = document.createElement('div');
            flex_icon_box.id = id +'_flex_icon_boxcontainer';
            flex_icon_box.style.width = "50px";
            flex_icon_box.style.height = "50px"
            flex_icon_box.style.position = "absolute";
            flex_icon_box.style.top = "0%";
            flex_icon_box.style.left = "50%";
            flex_icon_box.style.zIndex = "100";

            var price_icon_box = document.createElement('div');
            price_icon_box.id = id +'_price_icon_boxcontainer';
            price_icon_box.style.width = "50px";
            price_icon_box.style.height = "50px"
            price_icon_box.style.position = "absolute";
            price_icon_box.style.top = "0%";
            price_icon_box.style.right = "0%";
            price_icon_box.style.zIndex = "100";




            iconcontainer.appendChild(env_icon_box);
            iconcontainer.appendChild(flex_icon_box);
            iconcontainer.appendChild(price_icon_box);
            boxcontainer.appendChild(env_box);
            boxcontainer.appendChild(flex_box);
            boxcontainer.appendChild(price_box);
            boxcontainer.appendChild(env_background_box);
            boxcontainer.appendChild(flex_background_box);
            boxcontainer.appendChild(price_background_box);

            env_icon_box.style.marginLeft = ((env_background_box.offsetWidth/2)-25).toString()+"px";
            price_icon_box.style.marginRight = ((price_background_box.offsetWidth/2)-25).toString()+"px";
            flex_icon_box.style.marginLeft = "-"+(flex_icon_box.offsetWidth/2).toString()+"px";

            flex_box.style.marginLeft = "-"+(flex_box.offsetWidth/2).toString()+"px";
            flex_background_box.style.marginLeft = "-"+((flex_box.offsetWidth/2)-2).toString()+"px";



            d3.xml("Images/icon_dk.svg", "image/svg+xml", function(xml) {
                var importedNode = document.importNode(xml.documentElement, true);

                var svg = d3.select("#"+id +'_flex_icon_boxcontainer').node().appendChild(importedNode);

                //console.log(d3.select("#"+id +'_verticallinecontainer').node().attributes.getNamedItem("id").value.toString());


                d3.select("#"+id +'_flex_icon_boxcontainer').selectAll("svg")
                    .attr("viewBox", "0 0 150 150")
                    .attr("width", "80")
                    .attr("height", "70")
                    .attr("preserveAspectRatio", "xMidYMid meet");

            });

            d3.xml("Images/icon_kr.svg", "image/svg+xml", function(xml) {
                var importedNode = document.importNode(xml.documentElement, true);

                var svg = d3.select("#"+id +'_price_icon_boxcontainer').node().appendChild(importedNode);

                //console.log(d3.select("#"+id +'_verticallinecontainer').node().attributes.getNamedItem("id").value.toString());


                d3.select("#"+id +'_price_icon_boxcontainer').selectAll("svg")
                    .attr("viewBox", "0 0 150 150")
                    .attr("width", "80")
                    .attr("height", "70")
                    .attr("preserveAspectRatio", "xMidYMid meet");

            });

            d3.xml("Images/icon_windmill.svg", "image/svg+xml", function(xml) {
                var importedNode = document.importNode(xml.documentElement, true);

                var svg = d3.select("#"+id +'_env_icon_boxcontainer').node().appendChild(importedNode);

                //console.log(d3.select("#"+id +'_verticallinecontainer').node().attributes.getNamedItem("id").value.toString());


                d3.select("#"+id +'_env_icon_boxcontainer').selectAll("svg")
                    .attr("viewBox", "0 0 150 150")
                    .attr("width", "80")
                    .attr("height", "70")
                    .attr("preserveAspectRatio", "xMidYMid meet");

            });

            //IMPORT ENVBOX LINE SVG FILE
            d3.xml("Images/point_Box1.svg", "image/svg+xml", function(xml) {
                var importedNode = document.importNode(xml.documentElement, true);

                var svg = d3.select("#"+id +'_env_boxcontainer').node().appendChild(importedNode);

                var element = document.getElementById(id + "_env_boxcontainer");

                //the <any> tag is a cast and should be used for the typescript compiler
                //else it will throw an exception
                //var child = <any>element.firstChild;

                //console.log(child.offsetHeight.toString());

                //child.className = "foo";
                //child.style.width = "10px";



                d3.select("#"+id +'_env_boxcontainer').selectAll("svg")
                    .attr("viewBox", "0 0 1360 620")
                    //.attr("width", "100%")
                    //.attr("height", "100%")
                    .attr("preserveAspectRatio", "none");





             });

            //IMPORT PRICEBOX LINE SVG FILE
            d3.xml("Images/point_Box1.svg", "image/svg+xml", function(xml) {
                var importedNode = document.importNode(xml.documentElement, true);

                var svg = d3.select("#"+id +'_price_boxcontainer').node().appendChild(importedNode);

                var element = document.getElementById(id + "_price_boxcontainer");

                //the <any> tag is a cast and should be used for the typescript compiler
                //else it will throw an exception
                //var child = <any>element.firstChild;

                //console.log(child.offsetHeight.toString());

                //child.className = "foo";
                //child.style.width = "10px";



                d3.select("#"+id +'_price_boxcontainer').selectAll("svg")
                    .attr("viewBox", "0 0 1360 620")
                    //.attr("width", "100%")
                    //.attr("height", "100%")
                    .attr("preserveAspectRatio", "none");


            });

            //IMPORT FLEXBOX SVG FILE
            d3.xml("Images/point_Box1.svg", "image/svg+xml", function(xml) {
                var importedNode = document.importNode(xml.documentElement, true);

                var svg = d3.select("#"+id +'_flex_boxcontainer').node().appendChild(importedNode);

                var element = document.getElementById(id + "_flex_boxcontainer");

                //the <any> tag is a cast and should be used for the typescript compiler
                //else it will throw an exception
                //var child = <any>element.firstChild;

                //console.log(child.offsetHeight.toString());

                //child.className = "foo";
                //child.style.width = "10px";



                d3.select("#"+id +'_flex_boxcontainer').selectAll("svg")
                    .attr("viewBox", "0 0 1360 620")
                    //.attr("width", "100%")
                    //.attr("height", "100%")
                    .attr("preserveAspectRatio", "none");


            });




            var lineFunction = d3.svg.line()
                .x(function(d) { return d.x; })
                .y(function(d) { return d.y; })
                .interpolate("linear");

            //The SVG Container
            var pricesvgContainer = d3.select("#"+this._name+"_price_background_boxcontainer").append("svg")
                .attr("width", this._lineScale)
                .attr("height", 100);
            var envsvgContainer = d3.select("#"+this._name+"_env_background_boxcontainer").append("svg")
                .attr("width", this._lineScale)
                .attr("height", 100);
            var flexsvgContainer = d3.select("#"+this._name+"_flex_background_boxcontainer").append("svg")
                .attr("width", this._lineScale)
                .attr("height", 100);

            //The line SVG Path we draw
            var lineGraph = pricesvgContainer.append("path")
                .attr("d", lineFunction(this.calcBoxPoints(0)))
                .attr("stroke", "brown")
                .attr("stroke-width", this._boxScale)
                .attr("fill", "none");

            var lineGraph = envsvgContainer.append("path")
                .attr("d", lineFunction(this.calcBoxPoints(0)))
                .attr("stroke", "green")
                .attr("stroke-width", this._boxScale)
                .attr("fill", "none");


            //flex_box.style.marginLeft = "-"+(flex_box.offsetWidth/2).toString()+"px";

            var lineGraph = flexsvgContainer.append("path")
                .attr("d", lineFunction(this.calcBoxPoints(0)))
                .attr("stroke", "orange")
                .attr("stroke-width", this._boxScale)
                .attr("fill", "none");


            this.createBallLayout(id);

        }

        updatePoints=(flexPoints:number, envPoints:number, pricePoints:number)=>{



            var lineFunction = d3.svg.line()
                                     .x(function(d) { return d.x; })
                                     .y(function(d) { return d.y; })
                                     .interpolate("linear");

            //The SVG Container
            var pricesvgContainer = d3.select("#"+this._name+"_price_background_boxcontainer").selectAll("svg");
            var envsvgContainer = d3.select("#"+this._name+"_env_background_boxcontainer").selectAll("svg");
            var flexsvgContainer = d3.select("#"+this._name+"_flex_background_boxcontainer").selectAll("svg");

            //The line SVG Path we draw
            var lineGraph = pricesvgContainer.append("path")
                                        .attr("d", lineFunction(this.calcBoxPoints(pricePoints)))
                                        .attr("stroke", "brown")
                                        .attr("stroke-width", this._boxScale)
                                        .attr("fill", "none");

            var lineGraph = envsvgContainer.append("path")
                .attr("d", lineFunction(this.calcBoxPoints(envPoints)))
                .attr("stroke", "green")
                .attr("stroke-width", this._boxScale)
                .attr("fill", "none");


            //flex_box.style.marginLeft = "-"+(flex_box.offsetWidth/2).toString()+"px";

            var lineGraph = flexsvgContainer.append("path")
                .attr("d", lineFunction(this.calcBoxPoints(flexPoints)))
                .attr("stroke", "orange")
                .attr("stroke-width", this._boxScale)
                .attr("fill", "none");



        }

        //calculate a number of points for the boxes
        calcBoxPoints=(points:number):any=>{


            var rounded_points = points % this._pointScale;


            return [ { "x": 0,   "y": 0},  { "x": (this._lineScale/100)*rounded_points,  "y": 0}];

        }

        //calculate a number of points for the boxes
        createBallLayout=(name:string)=>{


            var contentFrame = document.getElementById(name +'_contentframe');

            //create a container for bowl
            var bowlcontainer = document.createElement('div');
            bowlcontainer.id = name +'_bowlcontainer';
            bowlcontainer.style.width = "600px";
            bowlcontainer.style.height = "453.33px"
            bowlcontainer.style.position = "absolute";
            bowlcontainer.style.top = "35%";
            bowlcontainer.style.left = "50%";
            bowlcontainer.style.zIndex = "100";

            contentFrame.appendChild(bowlcontainer);

            bowlcontainer.style.marginLeft = "-"+(bowlcontainer.offsetWidth/2).toString()+"px";

            //create a container for bowl
            var ballcontainer = document.createElement('div');
            ballcontainer.id = name +'_ballcontainer';
            ballcontainer.style.width = "600px";
            ballcontainer.style.height = "453.33px"
            ballcontainer.style.position = "absolute";
            ballcontainer.style.top = "35%";
            ballcontainer.style.left = "50%";
            ballcontainer.style.zIndex = "100";

            contentFrame.appendChild(ballcontainer);

            ballcontainer.style.marginLeft = "-"+(ballcontainer.offsetWidth/2).toString()+"px";


            //IMPORT BOWL SVG FILE
            d3.xml("Images/point_Bowl1.svg", "image/svg+xml", function(xml) {
                var importedNode = document.importNode(xml.documentElement, true);

                var svg = d3.select("#"+name +'_bowlcontainer').node().appendChild(importedNode);

                var element = document.getElementById(name + "_bowlcontainer");


                d3.select("#"+name +'_bowlcontainer').selectAll("svg")
                    .attr("viewBox", "0 0 400 300")
                    .attr("width", "100%")
                    .attr("height", "100%")
                    .attr("preserveAspectRatio", "none");
            });

            var count = 0;//counter for the position of the balls
            var idCount = 0;//so we can create unique id's
            var y_height = bowlcontainer.offsetHeight/ 4.5;//space between balls on y axis
            var x_middle = (bowlcontainer.offsetWidth/2);//the middle of the bowl

            for(var num_rows=1;num_rows<=4;num_rows++){

                var x_start = (x_middle - (100 * ((num_rows+1)/2)));

                console.log(x_start.toString());

                for(var i=1;i<=num_rows+1;i++){

                     var ball = document.createElement('div');
                    ball.id = name +'_ball_'+ idCount.toString();
                    ball.style.width = "100px";
                    ball.style.height = "100px"
                    ball.style.position = "absolute";
                    ball.style.top = ((bowlcontainer.offsetHeight-y_height)-((num_rows-1)*y_height)).toString()+"px";//controls the height
                    ball.style.left = (x_start+count).toString()+"px";
                    ball.style.zIndex = "100";
                    count = count + 100;
                    //ball.style.backgroundImage = "url(Images/point_Ball_1)";
                    //ball.style.backgroundRepeat = "no-repeat";
                    //ball.style.backgroundSize = "100% 100%";
                    idCount ++;

                    ballcontainer.appendChild(ball);

                }

                count = 0;
            }

        }

        updateBallLayout=(name:string, numberOfEnv:number,numberOfFlex:number,numberOfPrice:number)=>{

            var numBalls = numberOfEnv + numberOfFlex + numberOfPrice;

            var ballArray = [];

            for(var i = 0; i<numberOfEnv; i++ ){//push paths to images,is going to be used for input for the backgrounds

                ballArray.push("Images/point_Ball_1");

            }

            for(var i = 0; i<numberOfFlex; i++ ){//push paths to images,is going to be used for input for the backgrounds

                ballArray.push("Images/point_Ball_2");
            }

            for(var i = 0; i<numberOfPrice; i++ ){//push paths to images,is going to be used for input for the backgrounds

                ballArray.push("Images/point_Ball_1");
            }


            ballArray = this.shuffleArray(ballArray);

            for(var num = 0; num < 15; num++){//clear the balls


                var ball = document.getElementById(name +'_ball_'+ num.toString());

                if(ball==null){

                }else{
                ball.style.backgroundImage = "none";
                //ball.style.backgroundRepeat = "no-repeat";
                //ball.style.backgroundSize = "100% 100%";
                }
            }

            for(var num = 0; num < numBalls; num++){//redraw the balls

                var ball = document.getElementById(name +'_ball_'+ num.toString());

                ball.style.backgroundImage = "url("+ballArray[num]+")";
                ball.style.backgroundRepeat = "no-repeat";
                ball.style.backgroundSize = "100% 100%";

            }



        }

        shuffleArray=(array)=> {
            var currentIndex = array.length
                , temporaryValue
                , randomIndex
                ;

        // While there remain elements to shuffle...
            while (0 !== currentIndex) {

            // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

            // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

           return array;
        }



    }

}/**
 * Created by floop on 03/04/14.
 */
