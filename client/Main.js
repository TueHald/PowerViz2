///<reference path="../References.ts" />
var PowerViz;
(function (PowerViz) {
    //The view container. All views should be contained here.
    //Will handle the swiping carousel, so that no mouse movement
    //in x seconds will make the carousel run on its own.
    //The view container is also responseible for showing/hiding the loading spinner.
    var ViewContainer = (function () {
        //Should be called once at app start.
        function ViewContainer() {
            var _this = this;
            this._swiper = null;
            this._autoswipeTime = 120;
            this._inactiveWait = 180;
            this._inactiveCounter = 0;
            this._inactiveTimer = null;
            this._currentView = null;
            this._views = {};
            this._swipeCounter = 0;
            //Creates the swiper and makes subelements of slider-container swipeable.
            this.createSwiper = function () {
                _this._swiper = Swipe(document.getElementById("slider"), {
                    continuous: true,
                    disableScroll: true,
                    callback: _this.onSwipeBegin,
                    transitionEnd: _this.onSwipeEnd
                });
            };
            //Called every time the mouse moves on screen.
            //No mouse move means no interaction.
            this.mousemove = function () {
                //Reset the timer:
                _this._inactiveCounter = 0;
                _this._swipeCounter = 0;
            };
            //Invoked once a second.
            this.ontimer = function () {
                _this._inactiveCounter += 1;
                if (_this._inactiveCounter > _this._inactiveWait) {
                    _this._swipeCounter += 1;
                }
                if (_this._swipeCounter >= _this._autoswipeTime) {
                    //this._slider.next();
                    _this._swiper.next();
                    _this._swipeCounter = 0;
                }
            };
            this.onSwipeBegin = function (index, element) {
                _this.setActiveView(element.id);
            };
            this.onSwipeEnd = function (index, element) {
                /*if(this._views[element.id]==null)
                return;
                if(this._currentView!=null)
                this._currentView.disable();
                this._currentView = this._views[element.id];
                this._currentView.enable();*/
            };
            //Registers a single view under a given name.
            this.registerView = function (name, view) {
                _this._views[name] = view;
            };
            //Calls setup() on all registered views.
            this.setupViews = function () {
                for (var x in _this._views) {
                    _this._views[x].setup();
                }
            };
            this.next = function () {
                if (_this._swiper != null) {
                    _this._swiper.next();
                }
            };
            this.prev = function () {
                if (_this._swiper != null) {
                    _this._swiper.prev();
                }
            };
            //Moves the slider to the specified selector id.
            this.moveTo = function (id) {
                var pos = -1;
                $(".swipe-box").each(function (index, element) {
                    var el = element;
                    if (el.id == id)
                        pos = index;
                });
                console.log(pos);
                if (pos < 0)
                    return;
                _this._swiper.slide(pos, 300);
            };
            //sets the active view, enabling/disabling as needed.
            this.setActiveView = function (id) {
                var topviewconatainer = new PowerViz.TopViewContainerController();
                topviewconatainer.viewHasChanged(id);
                console.log(id);
                if (_this._currentView != null) {
                    _this._currentView.disable();
                    _this._currentView = null;
                }

                if (_this._views[id] != null) {
                    _this._currentView = _this._views[id];
                    _this._currentView.enable();
                }
            };
            $("body").get(0).addEventListener("mousemove", this.mousemove, false); //Listen for all mouse move events.
            $("body").get(0).addEventListener("touchstart", this.mousemove, false);

            //Start the inactivity timer:
            this._inactiveCounter = 0;
            this._swipeCounter = 0;
            this._inactiveTimer = setInterval(this.ontimer, 1000);

            this._views = {};
        }
        Object.defineProperty(ViewContainer, "instance", {
            get: function () {
                if (ViewContainer._instance == null)
                    ViewContainer._instance = new ViewContainer();
                return ViewContainer._instance;
            },
            enumerable: true,
            configurable: true
        });
        ViewContainer._instance = null;
        return ViewContainer;
    })();
    PowerViz.ViewContainer = ViewContainer;
})(PowerViz || (PowerViz = {}));
///<reference path="../References.ts" />
var PowerViz;
(function (PowerViz) {
    var ControllerContainer = (function () {
        function ControllerContainer() {
        }
        return ControllerContainer;
    })();
    PowerViz.ControllerContainer = ControllerContainer;
})(PowerViz || (PowerViz = {}));
//<reference path="../References.ts" />
var PowerViz;
(function (PowerViz) {
    var ViewUtils = (function () {
        function ViewUtils() {
        }
        ViewUtils.setElementToWinHeight = function (id_string, minus) {
            //console.log(id_string);
            //$(id).height($(window).height());
            $(id_string).css("height", "" + ($(window).height() - (0 || minus)) + "px");
        };

        //Sets the element to the available window height minus the topbar height.
        ViewUtils.setElementToViewHeight = function (id) {
            var topHeight = $("#top-bar").height();
            ViewUtils.setElementToWinHeight(id, topHeight);
        };

        ViewUtils.getViewHeight = function () {
            var topHeight = $("#top-bar").height();
            return $(window).height() - topHeight;
        };

        //Shows the loading spinner.
        ViewUtils.showLoader = function () {
            $("#loader-spinner").show();
        };

        //Hides the loading spinner.
        ViewUtils.hideLoader = function () {
            $("#loader-spinner").hide();
        };

        //Sets the element to the available window width
        ViewUtils.setElementTopBarWidth = function (id) {
            var topWidth = $("#top-bar").width();
            $(id).css("width", "" + topWidth + "px");
        };

        //Sets the element to the available Topbar height
        ViewUtils.setElementTopBarHeight = function (id) {
            var topHeight = $("#top-bar").height();
            $(id).css("height", "" + topHeight + "px");
        };

        ViewUtils.getTopBarWidth = function () {
            return $("#top-bar").width();
        };
        return ViewUtils;
    })();
    PowerViz.ViewUtils = ViewUtils;
})(PowerViz || (PowerViz = {}));
/*
Implementation of the Observer Pattern.
*/
var PowerViz;
(function (PowerViz) {
    var Observer = (function () {
        function Observer(observable, updatefunc) {
            var _this = this;
            //Called when the observable has changed its state.
            this.update = function (val) {
                if (_this.onUpdate != null)
                    _this.onUpdate(val);
            };
            this.bind = function (observableName) {
                //this._bindId = BindingManager.instance.bindObserver(observableName, this);
            };
            this.bind(observable);
            this.onUpdate = updatefunc || function (val) {
            };
        }
        Observer.prototype.onUpdate = function (val) {
        };

        Object.defineProperty(Observer.prototype, "value", {
            get: function () {
                return this._observable.value;
            },
            set: function (val) {
                this._observable.setValueFromObserver(val, this);
            },
            enumerable: true,
            configurable: true
        });

        return Observer;
    })();
    PowerViz.Observer = Observer;

    var Observable = (function () {
        function Observable(name) {
            var _this = this;
            this.setValueFromObserver = function (val, obs) {
                _this._value = val;

                for (var i in _this._observers) {
                    if (_this._observers[i] != obs) {
                        _this._observers[i].update(val);
                    }
                }
            };
            this.detach = function (obs) {
                var pos = _this._observers.indexOf(obs);
                if (pos < 0)
                    return;
            };
            this._observers = new Array();
        }
        Object.defineProperty(Observable.prototype, "value", {
            get: function () {
                return this._value;
            },
            set: function (val) {
                //Notify all the observers:
                this._value = val;
                for (var i in this._observers) {
                    this._observers[i].update(val);
                }
            },
            enumerable: true,
            configurable: true
        });


        Observable.prototype.attach = function (obs) {
            this._observers.push(obs);
        };
        return Observable;
    })();
    PowerViz.Observable = Observable;

    var BindingManager = (function () {
        function BindingManager() {
            this.bindObservable = function (name, obs) {
                return -1;
            };
            this.bindObserver = function (name, obser) {
                return -1;
            };
            this.unbindObserver = function (obser, bindId) {
            };
            this.unbindObservable = function (obs, bindId) {
            };
            this.notify = function (bindId, value) {
            };
            this._observerables = {};
        }
        Object.defineProperty(BindingManager, "instance", {
            get: function () {
                if (BindingManager._instance == null)
                    BindingManager._instance = new BindingManager;
                return BindingManager._instance;
            },
            enumerable: true,
            configurable: true
        });
        BindingManager._instance = null;
        return BindingManager;
    })();
    PowerViz.BindingManager = BindingManager;
})(PowerViz || (PowerViz = {}));
// This function creates a new anchor element and uses location
// properties (inherent) to get the desired URL data. Some String
// operations are used (to normalize results across browsers).
function parseURL(url) {
    var a = document.createElement('a');
    a.href = url;
    return {
        source: url,
        protocol: a.protocol.replace(':', ''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function () {
            var ret = {}, seg = a.search.replace(/^\?/, '').split('&'), len = seg.length, i = 0, s;
            for (; i < len; i++) {
                if (!seg[i]) {
                    continue;
                }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
        hash: a.hash.replace('#', ''),
        path: a.pathname.replace(/^([^\/])/, '/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
        segments: a.pathname.replace(/^\//, '').split('/')
    };
}
///<reference path="../References.ts" />
var PowerViz;
(function (PowerViz) {
    //class that defines a container for topviews so we can
    //manipulate them
    var TopViewContainer = (function () {
        function TopViewContainer() {
            var _this = this;
            this.setupViews = function () {
                _this._viewWidth = _this._viewWidth / _this._container.length;

                console.log("width is:" + _this._viewWidth);

                for (var i in _this._container) {
                    var element = document.getElementById(_this._container[i]._name);

                    //-2 --> taking note of the border, else the element will not fit
                    element.style.width = (_this._viewWidth - 2).toString() + "px";
                    element.style.cssFloat = "left";

                    PowerViz.ViewUtils.setElementTopBarHeight(_this._container[i]._id);
                }
            };
            this.addItem = function (view) {
                _this._container.push(view);
            };
            //sets the active view
            this.setActiveView = function (viewNumber) {
                for (var i in _this._container) {
                    if (_this._container[i]._refToView == viewNumber) {
                        _this._container[i].enable();
                    } else {
                        _this._container[i].disable();
                    }
                }
            };
            this._container = new Array();
            this._viewWidth = PowerViz.ViewUtils.getTopBarWidth();
        }
        Object.defineProperty(TopViewContainer, "instance", {
            get: function () {
                if (TopViewContainer._instance == null)
                    TopViewContainer._instance = new TopViewContainer();
                return TopViewContainer._instance;
            },
            enumerable: true,
            configurable: true
        });
        TopViewContainer._instance = null;
        return TopViewContainer;
    })();
    PowerViz.TopViewContainer = TopViewContainer;
})(PowerViz || (PowerViz = {}));
/**
* Created by floop on 07/03/14.
*/
///<reference path="../References.ts" />
var PowerViz;
(function (PowerViz) {
    var DrawUtils = (function () {
        function DrawUtils() {
        }
        // estimate the movement of the arm
        // x0: start
        // x1: end
        // t: step from 0 to 1
        DrawUtils.handDrawMovement = function (x0, x1, t) {
            return x0 + (x0 - x1) * (15 * Math.pow(t, 4) - 6 * Math.pow(t, 5) - 10 * Math.pow(t, 3));
        };

        // inspired by this paper
        // http://iwi.eldoc.ub.rug.nl/FILES/root/2008/ProcCAGVIMeraj/2008ProcCAGVIMeraj.pdf
        DrawUtils.handDrawLine = function (ctx, x0, y0, x1, y1) {
            console.log("logged");
            var coords = [];
            ctx.moveTo(x0, y0);

            var d = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));

            var steps = d / 40;
            if (steps < 4) {
                steps = 4;
            }

            // fuzzyness
            var f = 10.0;
            for (var i = 1; i <= steps; i++) {
                var t1 = i / steps;
                var t0 = t1 - 1 / steps;
                var xt0 = this.handDrawMovement(x0, x1, t0);
                var yt0 = this.handDrawMovement(y0, y1, t0);
                var xt1 = this.handDrawMovement(x0, x1, t1);
                var yt1 = this.handDrawMovement(y0, y1, t1);

                this.storeCoordinate(x1, y1, coords);
                ctx.quadraticCurveTo(this.fuzz(xt0, f), this.fuzz(yt0, f), xt1, yt1);
                ctx.moveTo(xt1, yt1);
                ctx.strokeStyle = 'green';
                ctx.lineWidth = 2;
                ctx.lineCap = "round";
                ctx.stroke();
            }

            var lineData = [];
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
        };

        DrawUtils.handDrawnGraph = function (ctx, coords) {
            for (var i = 0; i <= coords.length - 1; i++) {
                if (i == coords.length - 1) {
                    break;
                }
                console.log("outer");
                this.handDrawLine(ctx, coords[i].x, coords[i].y, coords[i + 1].x, coords[i + 1].y);
            }
        };

        // hand draw a circle
        // ctx: Context2D
        // x, y: Coordinates
        // r: radius
        DrawUtils.handDrawCircle = function (ctx, x, y, r) {
            var steps = Math.ceil(Math.sqrt(r) * 3);

            // fuzzyness dependent on radius
            var f = 0.50 * r;

            // distortion of the circle
            var xs = 1.0 + Math.random() * 0.1 - 0.05;
            var ys = 2.0 - xs;
            var coords = [];

            ctx.moveTo(x + r * xs, y);

            for (var i = 1; i <= steps; i++) {
                var t0 = (Math.PI * 2 / steps) * (i - 1);
                var t1 = (Math.PI * 2 / steps) * i;
                var x0 = x + Math.cos(t0) * r * xs;
                var y0 = y + Math.sin(t0) * r * ys;
                var x1 = x + Math.cos(t1) * r * xs;
                var y1 = y + Math.sin(t1) * r * ys;

                this.storeCoordinate(x0, y0, coords);
                ctx.bezierCurveTo(this.fuzz(x0, f), this.fuzz(y0, f), x1, y1);

                ctx.moveTo(x1, y1);
                //ctx.stroke();
            }
            var lineData = [];

            for (var i = 0; i < coords.length; i++) {
                var x = coords[i].x;
                var y = coords[i].y;
                lineData.push({ "x": x, "y": y });
                console.log("x=" + x.toString() + "y=" + y.toString());
            }
        };

        DrawUtils.fuzz = function (x, f) {
            return x + Math.random() * f - f / 2;
        };

        DrawUtils.storeCoordinate = function (xVal, yVal, array) {
            array.push({ x: xVal, y: yVal });
        };

        DrawUtils.lineFunction = d3.svg.line().x(function (d) {
            return d.x;
        }).y(function (d) {
            return d.y;
        }).interpolate("cardinal");
        return DrawUtils;
    })();
    PowerViz.DrawUtils = DrawUtils;
})(PowerViz || (PowerViz = {}));
///<reference path="../References.ts" />
///<reference path="../References.ts" />
var PowerViz;
(function (PowerViz) {
    var TestView = (function () {
        function TestView() {
            var _this = this;
            this._name = "TestView";
            this._id = "#TestView";
            //Required by View interface.
            this.setup = function () {
                //Set the size of the div:
                PowerViz.ViewUtils.setElementToViewHeight(_this._id);
                $(_this._id).css("background-color", "yellow");
            };
            //Required by the View interface.
            this.enable = function () {
                _this._controller.enable();
            };
            //Required by the View interface.
            this.disable = function () {
                _this._controller.disable();
            };
            //Required by the View interface.
            this.beginLoading = function () {
            };
            //Required by the View interface.
            this.endLoading = function () {
            };
            //--------------------
            //Specific for this view.
            this.setHeadline = function (txt) {
                $(_this._id).text(txt);
            };
        }
        Object.defineProperty(TestView.prototype, "controller", {
            //Not required, but makes linking the controller to the view sligtly easier.
            //Should only be used by the controller.
            set: function (c) {
                this._controller = c;
            },
            enumerable: true,
            configurable: true
        });
        return TestView;
    })();
    PowerViz.TestView = TestView;
})(PowerViz || (PowerViz = {}));
///<reference path="../References.ts" />
var PowerViz;
(function (PowerViz) {
    var PrognoseView = (function () {
        function PrognoseView() {
            var _this = this;
            this._name = "PrognoseView";
            this._id = "#PrognoseView";
            //sets up the DOM elements.
            this.setup = function () {
                //Set the size of the div:
                PowerViz.ViewUtils.setElementToViewHeight(_this._id);

                //Setup Raphael drawing:
                _this._paper = Raphael($(_this._id).get(0), 300, 300);
                $(_this._id + ".svg").css("position", "absolute");
                _this._paper.safari();
                _this.drawCurve([14, 22, 1, 99, 30, 22, 23, 40, 5], 25);
            };
            this.clear = function () {
                $(_this._id).html("");
            };
            //Sets the wind data based on granularity etc.
            this.setWindValues = function (data, granularity) {
            };
            //Draws a curve based on an array of values.
            this.drawCurve = function (points, space) {
                var x = 50;
                var y = 50;
                var str = "M" + x + "," + y;
                for (var n in points) {
                    str += "T" + x + "," + (y + points[n]);
                    x += space;
                }
                console.log(str);
                var curve = _this._paper.path(str);
                curve.attr("stroke", "#ff0000");
            };
            this.enable = function () {
                _this._controller.enable();
            };
            this.disable = function () {
                _this._controller.disable();
            };
            //Called by controller when loading starts.
            this.beginLoading = function () {
                //Display the "active" spinner.
                console.log("BeginLoading");
                PowerViz.ViewUtils.showLoader();
            };
            //Called by controller when loading has finished.
            this.endLoading = function () {
                //hide the "active" spinner.
                console.log("EndLoading");
                PowerViz.ViewUtils.hideLoader();
            };
        }
        PrognoseView.prototype.setController = function (ctrl) {
            this._controller = ctrl;
        };
        PrognoseView.prototype.getController = function () {
            return this._controller;
        };
        return PrognoseView;
    })();
    PowerViz.PrognoseView = PrognoseView;
})(PowerViz || (PowerViz = {}));
///<reference path="../References.ts" />
var PowerViz;
(function (PowerViz) {
    //The top view is slightly different from the other views,
    //in that it is not part of the view container.... yet.
    var TopView = (function () {
        function TopView() {
            var _this = this;
            this._selected = false;
            this.setup = function () {
                var element = document.createElement("div");
                element.id = _this._name;

                //element.appendChild(document.createTextNode(this._name));
                document.getElementById('top-bar').appendChild(element);
                element.style.border = "1px solid black";

                //element.style.width = "0px";
                //element.style.height = "0px";
                _this._selected = false;
            };
            //Required by the View interface.
            this.enable = function () {
                //this._controller.enable();
                var element = document.getElementById(_this._name);
                element.style.backgroundColor = "blue";
            };
            //Required by the View interface.
            this.disable = function () {
                //this._controller.disable();
                var element = document.getElementById(_this._name);
                element.style.backgroundColor = "gray";
            };
            //Required by the View interface.
            this.beginLoading = function () {
            };
            //Required by the View interface.
            this.endLoading = function () {
            };
        }
        return TopView;
    })();
    PowerViz.TopView = TopView;
})(PowerViz || (PowerViz = {}));
///<reference path="../References.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PowerViz;
(function (PowerViz) {
    //Class that defines a Price_TopView, that is
    //a view that is to be placed in the topbar of the view
    var Price_TopView = (function (_super) {
        __extends(Price_TopView, _super);
        function Price_TopView() {
            _super.apply(this, arguments);
            this._name = "testPrice_TopView";
            this._id = "#testPrice_TopView";
            this._refToView = "viewThree";
            //Required by the View interface.
            this.beginLoading = function () {
            };
            //Required by the View interface.
            this.endLoading = function () {
            };
        }
        Object.defineProperty(Price_TopView.prototype, "controller", {
            set: function (c) {
                this._controller = c;
            },
            enumerable: true,
            configurable: true
        });
        return Price_TopView;
    })(PowerViz.TopView);
    PowerViz.Price_TopView = Price_TopView;
})(PowerViz || (PowerViz = {}));
///<reference path="../References.ts" />
var PowerViz;
(function (PowerViz) {
    //Class that defines a Price_TopView, that is
    //a view that is to be placed in the topbar of the view
    var Env_TopView = (function (_super) {
        __extends(Env_TopView, _super);
        function Env_TopView() {
            _super.apply(this, arguments);
            this._name = "testEnv_TopView";
            this._id = "#testEnv_TopView";
            //reference to the view, essentially the same as the view name
            this._refToView = "viewTwo";
            //Required by the View interface.
            this.beginLoading = function () {
            };
            //Required by the View interface.
            this.endLoading = function () {
            };
        }
        Object.defineProperty(Env_TopView.prototype, "controller", {
            set: function (c) {
                this._controller = c;
            },
            enumerable: true,
            configurable: true
        });
        return Env_TopView;
    })(PowerViz.TopView);
    PowerViz.Env_TopView = Env_TopView;
})(PowerViz || (PowerViz = {}));
///<reference path="../References.ts" />
var PowerViz;
(function (PowerViz) {
    //Class that defines a Price_TopView, that is
    //a view that is to be placed in the topbar of the view
    var Flex_TopView = (function (_super) {
        __extends(Flex_TopView, _super);
        function Flex_TopView() {
            _super.apply(this, arguments);
            this._name = "testFlex_TopView";
            this._id = "#testFlex_TopView";
            this._refToView = "PrognoseView";
            //Required by the View interface.
            this.beginLoading = function () {
            };
            //Required by the View interface.
            this.endLoading = function () {
            };
        }
        Object.defineProperty(Flex_TopView.prototype, "controller", {
            set: function (c) {
                this._controller = c;
            },
            enumerable: true,
            configurable: true
        });
        return Flex_TopView;
    })(PowerViz.TopView);
    PowerViz.Flex_TopView = Flex_TopView;
})(PowerViz || (PowerViz = {}));
//Base class for all controllers
///<reference path="../References.ts" />
var PowerViz;
(function (PowerViz) {
    var TestController = (function () {
        function TestController() {
            var _this = this;
            //Required by the Controller interface.
            this.enable = function () {
                _this._timer = setInterval(_this.onTime, 2000); //Start the timer.
                _this._counter = 0; //A counter, just for fun.
                _this.onTime(); //Run the "updating" procedure once when the view is enabled.
            };
            //Required by the Controller interface.
            this.disable = function () {
                if (_this._timer != null)
                    clearInterval(_this._timer);
                _this._timer = null;
            };
            //Connects a view to this. Should be the only method used for connecting a view to a controller.
            this.connectView = function (v) {
                _this._view = v;
                _this._view.controller = _this; //Connect the view to this controller.
            };
            //Internal timer function, runs every X seconds.
            this.onTime = function () {
                console.log("time..." + _this._counter);
                _this._counter += 1;

                //Tell the view to set the headline:
                _this._view.setHeadline("This is the new headline - " + _this._counter); //Call a function on the view.
                //Notice, when looking at the TestView code, that the View does not call functions inside the controller,
                //besides the mandatory enable() and disable().
            };
        }
        return TestController;
    })();
    PowerViz.TestController = TestController;
})(PowerViz || (PowerViz = {}));
///<reference path="../References.ts" />
var PowerViz;
(function (PowerViz) {
    var PrognoseController = (function () {
        function PrognoseController() {
            var _this = this;
            this._timer = null;
            this._frequency = 120;
            this.connectToView = function (view) {
                _this._view = view;
                _this._view.setController(_this);
            };
            this.enable = function () {
                //Start timer.
                if (_this._timer == null) {
                    _this._timer = setInterval(_this.onTime, _this._frequency * 1000);
                }
                _this._enabled = true;

                //Get data and send it to the view. Use the timer function:
                _this.onTime();
            };
            this.disable = function () {
                //Stop timer.
                if (_this._timer != null) {
                    clearInterval(_this._timer);
                    _this._timer = null;
                }
                _this._enabled = false;
            };
            //Called once on each time interval.
            this.onTime = function () {
                //Get data from the model.
                //Send the data to the view.
                //this._view.beginLoading();
                //this._view.endLoading();
            };
            //Called from the view when the time slider moves.
            this.onSliderChange = function (newPosition) {
                //change the datagranularity that is sent to the view.
            };
            this.onDataReceived = function () {
                //All data has ben reeived, so send data to the view.
            };
        }
        return PrognoseController;
    })();
    PowerViz.PrognoseController = PrognoseController;
})(PowerViz || (PowerViz = {}));
///<reference path="PrognoseController.ts" />
var PowerViz;
(function (PowerViz) {
    //Use this controller as a dummy during dev, to skip using the model.
    var PrognoseDummyController = (function (_super) {
        __extends(PrognoseDummyController, _super);
        function PrognoseDummyController() {
            var _this = this;
            _super.call(this);
            this.onTime = function () {
                console.log("Getting prognose data, sending it off to the view.");
                _this._fakeTimer = setInterval(_this.onFakeTime, 1000);
                _this._view.beginLoading();
            };
            this.onFakeTime = function () {
                clearInterval(_this._fakeTimer);
                _this._view.endLoading();
            };
        }
        return PrognoseDummyController;
    })(PowerViz.PrognoseController);
    PowerViz.PrognoseDummyController = PrognoseDummyController;
})(PowerViz || (PowerViz = {}));
///<reference path="../References.ts" />
var PowerViz;
(function (PowerViz) {
    var TestTopController = (function () {
        function TestTopController() {
            var _this = this;
            //Required by the Controller interface.
            this.enable = function () {
            };
            //Required by the Controller interface.
            this.disable = function () {
            };
            //Connects a view to this. Should be the only method used for connecting a view to a controller.
            this.connectView = function (v) {
                _this._view = v;
                //this._view.controller = this; //Connect the view to this controller.
            };
            //Internal timer function, runs every X seconds.
            this.onTime = function () {
                console.log("time..." + _this._counter);
                _this._counter += 1;
            };
        }
        return TestTopController;
    })();
    PowerViz.TestTopController = TestTopController;
})(PowerViz || (PowerViz = {}));
/**
* Created by floop on 03/03/14.
*/
///<reference path="../References.ts" />
var PowerViz;
(function (PowerViz) {
    //defines a controller that controls the TopviewContainer
    var TopViewContainerController = (function () {
        function TopViewContainerController() {
            //this method should be called when view have changed
            this.viewHasChanged = function (newView) {
                PowerViz.TopViewContainer.instance.setActiveView(newView);
            };
        }
        return TopViewContainerController;
    })();
    PowerViz.TopViewContainerController = TopViewContainerController;
})(PowerViz || (PowerViz = {}));
///<reference path="References.ts"/>
var PowerViz;
(function (PowerViz) {
    //PowerViz 2 main application point.
    var Main = (function () {
        function Main() {
            var _this = this;
            //Called when the document is loaded and ready to be presented.
            this.ready = function () {
                _this.setupViews();
            };
            //Sets up the different views and connects them to the right controllers.
            this.setupViews = function () {
                //Setup the swiper:
                PowerViz.ViewContainer.instance.createSwiper();

                //Setup the test sketches:
                //1. Set the containing div size.
                //2. Set the image to fit withing the div.
                _this.positionSketch("#sketchFlex", "#PrognoseView");
                _this.positionSketch("#sketchSource", "#viewTwo");
                _this.positionSketch("#sketchPrice", "#viewThree");

                //Test view:
                var testView = new PowerViz.TestView();
                var testController = new PowerViz.TestController();
                testController.connectView(testView);
                PowerViz.ViewContainer.instance.registerView("TestView", testView);

                //test topview
                var testTopView = new PowerViz.Price_TopView();
                testTopView.setup();
                var testTopView2 = new PowerViz.Flex_TopView();
                testTopView2.setup();
                var testTopView3 = new PowerViz.Env_TopView();
                testTopView3.setup();

                PowerViz.TopViewContainer.instance.addItem(testTopView);
                PowerViz.TopViewContainer.instance.addItem(testTopView2);
                PowerViz.TopViewContainer.instance.addItem(testTopView3);
                testTopView2.enable();

                PowerViz.TopViewContainer.instance.setupViews();

                //end test topview
                //Now that all views are created, set them up.
                PowerViz.ViewContainer.instance.setupViews();
                PowerViz.ViewContainer.instance.setActiveView("PrognoseView");

                //////MICHAELS PLAYGROUND!!!!/////////////
                testLine();

                ///////////////////////////////////
                PowerViz.ViewUtils.hideLoader();
            };
            $(document).ready(this.ready);
        }
        Object.defineProperty(Main.prototype, "controllerContainer", {
            get: function () {
                return this._controllerContainer;
            },
            enumerable: true,
            configurable: true
        });

        Main.prototype.positionSketch = function (sketchId, sketchContainer) {
            PowerViz.ViewUtils.setElementToViewHeight(sketchContainer);
            $(sketchId).width($(sketchContainer).width());
            $(sketchId).height($(sketchContainer).height());
            var left = ($(sketchContainer).width() - $(sketchId).width()) / 2;
            $(sketchId).css("left", "" + left + "px");
        };
        return Main;
    })();
    PowerViz.Main = Main;

    function testLine() {
        var margin = 4;

        //x0,y0,x1,y1,fuzzyness
        //slopedline(0,80,90,150,5);
        var lineData = [
            { "x": 1, "y": 5 }, { "x": 150, "y": 60 },
            { "x": 240, "y": 20 }, { "x": 280, "y": 40 },
            { "x": 490, "y": 5 }, { "x": 1400, "y": 60 }];

        //var lineData = [ { "x": 1,   "y": 5},  { "x": 600,  "y": 5}];
        drawGraph(lineData, "body", "test1");
    }

    //draws a horissontal line between two x coordinates, fuzzyness
    //is the randomness of the line, eg. how sketchy it looks.
    function drawHorisontalLine(from, to, fuzzyness) {
        var svg = d3.select("body").append("svg").attr("width", "100%").attr("height", "100%").style("top", "50%").style("position", "absolute");

        var lineData = d3.range(from, to, fuzzyness).map(function (x) {
            return { x: x, y: 10 + Math.floor(Math.random() * 6) - 3 };
        });

        var lineFunction = d3.svg.line().x(function (d) {
            return d.x;
        }).y(function (d) {
            return d.y;
        }).interpolate("basis");

        function draw(points) {
            var lineGraph = svg.append("path").attr("stroke", "blue").attr("stroke-width", 1).attr("fill", "none").attr("d", lineFunction(points));

            if (points.length < lineData.length)
                draw(lineData);
        }

        draw([]);
    }

    //draws a horissontal line between two x coordinates, fuzzyness
    //is the randomness of the line, eg. how sketchy it looks.
    //roughly based on: http://stackoverflow.com/questions/20695723/d3-smoothly-animate-a-hand-drawn-line
    function drawVerticalLine(from, to, fuzzyness) {
        var svg = d3.select("body").append("svg").attr("width", "100%").attr("height", "100%").style("top", "50%").style("position", "absolute");

        var lineData = d3.range(from, to, fuzzyness).map(function (y) {
            return { y: y, x: 10 + Math.floor(Math.random() * 6) - 3 };
        });

        var lineFunction = d3.svg.line().x(function (d) {
            return d.x;
        }).y(function (d) {
            return d.y;
        }).interpolate("cardinal");

        function draw(points) {
            var lineGraph = svg.append("path").attr("stroke", "blue").attr("stroke-width", 1).attr("fill", "none").attr("d", lineFunction(points));

            if (points.length < lineData.length)
                draw(lineData);
        }

        draw([]);
    }

    function slopedline(x0, y0, x1, y1, fuzzyness) {
        var dx = Math.abs(x1 - x0);
        var dy = Math.abs(y1 - y0);
        var sx = (x0 < x1) ? 1 : -1;
        var sy = (y0 < y1) ? 1 : -1;
        var err = dx - dy;
        var linedata = [];

        var vectorLength = jitterFunction((x0 - x1), (y0, y1));

        console.log((100 / vectorLength) + fuzzyness);

        //set the interval of the points
        var interval = Math.floor((100 / vectorLength) + fuzzyness);
        var intervalCount = 0;

        while (true) {
            if (intervalCount % interval == 0 || ((x0 == x1) && (y0 == y1))) {
                console.log("x-coordinate: " + x0 + " and y-coordinate: " + y0);
                addLineData(x0 + Math.floor(Math.random() * 6) - 2, y0 + Math.floor(Math.random() * 6) - 2, linedata);
            }

            intervalCount++;
            if ((x0 == x1) && (y0 == y1))
                break;
            var e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x0 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y0 += sy;
            }
        }

        /*//This is the accessor function we talked about above
        var lineFunction = d3.svg.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; })
        .interpolate("cardinal");
        
        //The SVG Container
        var svgContainer = d3.select("body").append("svg")
        .attr("width", 200)
        .attr("height", 200);
        
        //The line SVG Path we draw
        var lineGraph = svgContainer.append("path")
        .attr("d", lineFunction(linedata))
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("fill", "none");*/
        function addLineData(x, y, array) {
            array.push({ "x": x, "y": y });
        }

        return linedata;
    }

    //function to draw a graph
    //takes a name for the svgelement and a id string that defines an element to insert svg into.
    function drawGraph(CoordinateSet, id, svgname) {
        console.log(CoordinateSet.toString());
        var pathdata = [];

        for (var i = 0; i < CoordinateSet.length - 1; i++) {
            var tempdata = slopedline(CoordinateSet[i].x, CoordinateSet[i].y, CoordinateSet[i + 1].x, CoordinateSet[i + 1].y, 14);
            console.log(tempdata.toString());
            pathdata = pathdata.concat(tempdata);
        }

        //This is the accessor function we talked about above
        var lineFunction = d3.svg.line().x(function (d) {
            return d.x;
        }).y(function (d) {
            return d.y;
        }).interpolate("basis-open");

        //The SVG Container
        var svgContainer = d3.select(id).append("svg").attr("id", svgname).attr("width", 1400).attr("height", 200).style("top", "50%").style("position", "absolute");

        //The line SVG Path we draw
        var lineGraph = svgContainer.append("path").attr("d", lineFunction(pathdata)).attr("stroke", "blue").attr("stroke-width", 4).attr("fill", "none").style("stroke-dasharray", ("5, 5, 5, 5, 5, 5, 10, 5, 10, 5, 10, 5")).style("top", "50%").style("position", "absolute");
    }

    //function that calculates vector
    //and returns it
    function jitterFunction(x, y) {
        var vectorLength = 0;

        vectorLength = Math.sqrt((x * x) + (y * y));

        return vectorLength;
    }
})(PowerViz || (PowerViz = {}));
