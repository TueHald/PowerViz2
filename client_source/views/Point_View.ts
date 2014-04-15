///<reference path="../References.ts" />


module PowerViz {

    export class Point_View implements View {

        _name:string = "pointView";
        _id:string = "#pointView";
        //_iconPath1:string = "Images/icon_kr.svg";
        //_iconPath2:string = "Images/icon_house.svg";
        _controller:PointController;

        _boxScale:number = 196;//defines the boxes
        _lineScale:number = 248;//defines how wide the line in the boxes should be
        _pointScale:number = 100;//defines how many points make a ball

        //Required by View interface.
        setup=()=> {

            //Set the size of the div:
            ViewUtils.setElementToViewHeight(this._id);
            //$(this._id).css("background-color", "yellow");

            this.drawframe(this._name,"85","100");

            //this.updatePoints( 234,123,433);





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
            iconcontainer.style.top = "2%";
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


            // APPEND THEM TO CONTAINERS
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
            pricesvgContainer.append("path")
                .attr("d", lineFunction(this.calcBoxPoints(0)))
                .attr("stroke", "brown")
                .attr("stroke-width", this._boxScale)
                .attr("fill", "none");

            envsvgContainer.append("path")
                .attr("d", lineFunction(this.calcBoxPoints(0)))
                .attr("stroke", "green")
                .attr("stroke-width", this._boxScale)
                .attr("fill", "none");


            //flex_box.style.marginLeft = "-"+(flex_box.offsetWidth/2).toString()+"px";

            flexsvgContainer.append("path")
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
            pricesvgContainer.select("path").remove();


            //The line SVG Path we draw
            pricesvgContainer.append("path")
                                        .attr("d", lineFunction(this.calcBoxPoints(pricePoints)))
                                        .attr("stroke", "brown")
                                        .attr("stroke-width", this._boxScale)
                                        .attr("fill", "none");

            var envsvgContainer = d3.select("#"+this._name+"_env_background_boxcontainer").selectAll("svg");

            envsvgContainer.append("path")
                .attr("d", lineFunction(this.calcBoxPoints(envPoints)))
                .attr("stroke", "green")
                .attr("stroke-width", this._boxScale)
                .attr("fill", "none");
            envsvgContainer.select("path").remove();

            //flex_box.style.marginLeft = "-"+(flex_box.offsetWidth/2).toString()+"px";


            var flexsvgContainer = d3.select("#"+this._name+"_flex_background_boxcontainer").selectAll("svg");
            flexsvgContainer.append("path")
                .attr("d", lineFunction(this.calcBoxPoints(flexPoints)))
                .attr("stroke", "orange")
                .attr("stroke-width", this._boxScale)
                .attr("fill", "none");
            flexsvgContainer.select("path").remove();

            this.updateBallLayout(this._name, this.calcBalls(envPoints),this.calcBalls(flexPoints),this.calcBalls(pricePoints));


        }

        //calculate a number of points for the boxes
        calcBoxPoints=(points:number):any=>{


            var rounded_points = points % this._pointScale;

            console.log(rounded_points.toString());
            return [ { "x": 0,   "y": 0},  { "x": (this._lineScale/100)*rounded_points,  "y": 0}];

        }

        calcBalls=(points:number):any=>{


            return Math.floor(points / this._pointScale);



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
            bowlcontainer.style.top = "27%";
            bowlcontainer.style.left = "50%";
            bowlcontainer.style.zIndex = "9999";
            bowlcontainer.style.backgroundImage = "url(Images/point_Bowl2.svg)"
            bowlcontainer.style.backgroundRepeat = "no-repeat";
            bowlcontainer.className = "multibackground";
            bowlcontainer.style.backgroundPosition = "center";





            //create a container for bowl
            var ballcontainer = document.createElement('div');
            ballcontainer.id = name +'_ballcontainer';
            ballcontainer.style.width = "600px";
            ballcontainer.style.height = "453.33px"
            ballcontainer.style.position = "absolute";
            ballcontainer.style.top = "27%";
            ballcontainer.style.left = "50%";
            ballcontainer.style.zIndex = "50";

            contentFrame.appendChild(ballcontainer);

            ballcontainer.style.marginLeft = "-"+(ballcontainer.offsetWidth/2).toString()+"px";

            contentFrame.appendChild(bowlcontainer);

            bowlcontainer.style.marginLeft = "-"+(bowlcontainer.offsetWidth/2).toString()+"px";


            var count = 0;//counter for the position of the balls
            var idCount = 0;//so we can create unique id's
            var x_middle = (bowlcontainer.offsetWidth/2);//the middle of the bowl

            for(var num_rows=1;num_rows<=4;num_rows++){

                var x_start = (x_middle - (100 * ((num_rows+1)/2)));

                console.log(x_start.toString());

                var y_height = 0;

                if(num_rows == 1){
                    y_height = (0+100);

                }else
                {
                    y_height = bowlcontainer.offsetHeight/ 5;//space between balls on y axis

                }



                for(var i=1;i<=num_rows+1;i++){




                }

                count = 0;
            }

            this.createDemBalls(ballcontainer,x_middle);//create balls

        }

        updateBallLayout=(name:string, numberOfEnv:number,numberOfFlex:number,numberOfPrice:number)=>{


            if(numberOfEnv > 5){

                numberOfEnv = 5;
            }
            if(numberOfFlex > 5){

                numberOfFlex = 5;
            }
            if(numberOfPrice > 5){

                numberOfPrice = 5;
            }

            var numBalls = numberOfEnv + numberOfFlex + numberOfPrice;

            var ballArray = [];

            for(var i = 0; i<numberOfEnv; i++ ){//push paths to images,is going to be used for input for the backgrounds

                ballArray.push("Images/point_Wind_Ball_1.svg");

            }

            for(var i = 0; i<numberOfFlex; i++ ){//push paths to images,is going to be used for input for the backgrounds

                ballArray.push("Images/point_Belastning_Ball_2.svg");
            }

            for(var i = 0; i<numberOfPrice; i++ ){//push paths to images,is going to be used for input for the backgrounds

                ballArray.push("Images/point_Pris_Ball_1.svg");
            }


            //ballArray = this.shuffleArray(ballArray);

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


        //Shuffles the array so that the balls will be placed randomly
        shuffleArray=(array)=> {
            var currentIndex = array.length
                , temporaryValue
                , randomIndex
                ;

        // While there remain elements to shuffle... OKAY, DONT SHUFFLE!
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


        createDemBalls=(ballcontainer:any, x_start:number )=>{

            var y_start = ballcontainer.offsetHeight+34;

            var ball = document.createElement('div');
            ball.id = this._name +'_ball_0';
            ball.style.width = "100px";
            ball.style.height = "100px"
            ball.style.position = "absolute";
            ball.style.top = (y_start-140).toString()+"px";//controls the height
            ball.style.left = (x_start-100).toString()+"px";
            ball.style.zIndex = "50";
            //ball.style.backgroundImage = "url(Images/point_Ball_1)";
            //ball.style.backgroundRepeat = "no-repeat";
            //ball.style.backgroundSize = "100% 100%";

            ballcontainer.appendChild(ball);


            var ball2 = document.createElement('div');
            ball2.id = this._name +'_ball_1';
            ball2.style.width = "100px";
            ball2.style.height = "100px"
            ball2.style.position = "absolute";
            ball2.style.top = (y_start-156).toString()+"px";//controls the height
            ball2.style.left = (x_start).toString()+"px";
            ball2.style.zIndex = "50";

            ballcontainer.appendChild(ball2);

            var ball3 = document.createElement('div');
            ball3.id = this._name +'_ball_2';
            ball3.style.width = "100px";
            ball3.style.height = "100px"
            ball3.style.position = "absolute";
            ball3.style.top = (y_start-180).toString()+"px";//controls the height
            ball3.style.left = (x_start-190).toString()+"px";
            ball3.style.zIndex = "50";

            ballcontainer.appendChild(ball3);


            var ball4 = document.createElement('div');
            ball4.id = this._name +'_ball_3';
            ball4.style.width = "100px";
            ball4.style.height = "100px"
            ball4.style.position = "absolute";
            ball4.style.top = (y_start-200).toString()+"px";//controls the height
            ball4.style.left = (x_start+95).toString()+"px";
            ball4.style.zIndex = "50";

            ballcontainer.appendChild(ball4);


            var ball5 = document.createElement('div');
            ball5.id = this._name +'_ball_4';
            ball5.style.width = "100px";
            ball5.style.height = "100px"
            ball5.style.position = "absolute";
            ball5.style.top = (y_start-230).toString()+"px";//controls the height
            ball5.style.left = (x_start-60).toString()+"px";
            ball5.style.zIndex = "50";

            ballcontainer.appendChild(ball5);

            var ball6 = document.createElement('div');
            ball6.id = this._name +'_ball_5';
            ball6.style.width = "100px";
            ball6.style.height = "100px"
            ball6.style.position = "absolute";
            ball6.style.top = (y_start-252).toString()+"px";//controls the height
            ball6.style.left = (x_start-250).toString()+"px";
            ball6.style.zIndex = "50";

            ballcontainer.appendChild(ball6);

            var ball7 = document.createElement('div');
            ball7.id = this._name +'_ball_6';
            ball7.style.width = "100px";
            ball7.style.height = "100px"
            ball7.style.position = "absolute";
            ball7.style.top = (y_start-270).toString()+"px";//controls the height
            ball7.style.left = (x_start+30).toString()+"px";
            ball7.style.zIndex = "50";

            ballcontainer.appendChild(ball7);

            var ball8 = document.createElement('div');
            ball8.id = this._name +'_ball_7';
            ball8.style.width = "100px";
            ball8.style.height = "100px"
            ball8.style.position = "absolute";
            ball8.style.top = (y_start-270).toString()+"px";//controls the height
            ball8.style.left = (x_start-150).toString()+"px";
            ball8.style.zIndex = "50";

            ballcontainer.appendChild(ball8);

            var ball9 = document.createElement('div');
            ball9.id = this._name +'_ball_8';
            ball9.style.width = "100px";
            ball9.style.height = "100px"
            ball9.style.position = "absolute";
            ball9.style.top = (y_start-295).toString()+"px";//controls the height
            ball9.style.left = (x_start+125).toString()+"px";
            ball9.style.zIndex = "50";

            ballcontainer.appendChild(ball9);

            var ball10 = document.createElement('div');
            ball10.id = this._name +'_ball_9';
            ball10.style.width = "100px";
            ball10.style.height = "100px"
            ball10.style.position = "absolute";
            ball10.style.top = (y_start-330).toString()+"px";//controls the height
            ball10.style.left = (x_start-65).toString()+"px";
            ball10.style.zIndex = "50";

            ballcontainer.appendChild(ball10);


            var ball11 = document.createElement('div');
            ball11.id = this._name +'_ball_10';
            ball11.style.width = "100px";
            ball11.style.height = "100px"
            ball11.style.position = "absolute";
            ball11.style.top = (y_start-350).toString()+"px";//controls the height
            ball11.style.left = (x_start-245).toString()+"px";
            ball11.style.zIndex = "50";

            ballcontainer.appendChild(ball11);

            var ball12 = document.createElement('div');
            ball12.id = this._name +'_ball_11';
            ball12.style.width = "100px";
            ball12.style.height = "100px"
            ball12.style.position = "absolute";
            ball12.style.top = (y_start-365).toString()+"px";//controls the height
            ball12.style.left = (x_start+54).toString()+"px";
            ball12.style.zIndex = "50";

            ballcontainer.appendChild(ball12);

            var ball13 = document.createElement('div');
            ball13.id = this._name +'_ball_12';
            ball13.style.width = "100px";
            ball13.style.height = "100px"
            ball13.style.position = "absolute";
            ball13.style.top = (y_start-365).toString()+"px";//controls the height
            ball13.style.left = (x_start-150).toString()+"px";
            ball13.style.zIndex = "50";

            ballcontainer.appendChild(ball13);

            var ball14 = document.createElement('div');
            ball14.id = this._name +'_ball_13';
            ball14.style.width = "100px";
            ball14.style.height = "100px"
            ball14.style.position = "absolute";
            ball14.style.top = (y_start-424).toString()+"px";//controls the height
            ball14.style.left = (x_start-20).toString()+"px";
            ball14.style.zIndex = "50";

            ballcontainer.appendChild(ball14);

            var ball15 = document.createElement('div');
            ball15.id = this._name +'_ball_14';
            ball15.style.width = "100px";
            ball15.style.height = "100px"
            ball15.style.position = "absolute";
            ball15.style.top = (y_start-450).toString()+"px";//controls the height
            ball15.style.left = (x_start-110).toString()+"px";
            ball15.style.zIndex = "50";

            ballcontainer.appendChild(ball15);






    }



    }

}/**
 * Created by floop on 03/04/14.
 */
