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
///<reference path="../References.ts" />
var PowerViz;
(function (PowerViz) {
    //class that defines a container for topviews so we can
    //manipulate them
    var TopViewContainer = (function () {
        function TopViewContainer() {
            var _this = this;
            this.setup = function () {
                var con = _this._container;

                for (var i in con) {
                    console.log("meeeeh");
                }
            };
            this.addItem = function (view) {
                _this._container.push(view);
            };
            this._container = new Array();
        }
        return TopViewContainer;
    })();
    PowerViz.TopViewContainer = TopViewContainer;
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
            this.setup = function () {
                //Set the size of the div:
                //ViewUtils.setElementToViewWidth(this._id);
                //$(this._id).css("background-color", "green");
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
        }
        return TopView;
    })();
    PowerViz.TopView = TopView;
})(PowerViz || (PowerViz = {}));
///<reference path="../References.ts" />
var PowerViz;
(function (PowerViz) {
    //Class that defines a Price_TopView, that is
    //a view that is to be placed in the topbar of the view
    var Price_TopView = (function () {
        function Price_TopView() {
            var _this = this;
            this._name = "testPrice_TopView";
            this._id = "#testPrice_TopView";
            //Required by View interface.
            this.setup = function () {
                //Set the size of the div:
                //ViewUtils.setElementToViewWidth(this._id);
                //$(this._id).css("background-color", "green");
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
            var element = document.createElement("div");
            element.id = this._name;
            element.appendChild(document.createTextNode('The man who mistook his wife for a hat'));
            document.getElementById('top-bar').appendChild(element);
            PowerViz.ViewUtils.setElementTopBarWidth(this._id);
            PowerViz.ViewUtils.setElementTopBarHeight(this._id);
        }
        Object.defineProperty(Price_TopView.prototype, "controller", {
            set: function (c) {
                this._controller = c;
            },
            enumerable: true,
            configurable: true
        });
        return Price_TopView;
    })();
    PowerViz.Price_TopView = Price_TopView;
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
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
                //this._view.controller = this; //Connect the view to this controller.
            };
            //Internal timer function, runs every X seconds.
            this.onTime = function () {
                console.log("time..." + _this._counter);
                _this._counter += 1;
                //Tell the view to set the headline:
                //this._view.setHeadline("This is the new headline - " + this._counter); //Call a function on the view.
                //Notice, when looking at the TestView code, that the View does not call functions inside the controller,
                //besides the mandatory enable() and disable().
            };
        }
        return TestTopController;
    })();
    PowerViz.TestTopController = TestTopController;
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
                var topContainer = new PowerViz.TopViewContainer();

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

                topContainer.addItem(testTopView);
                topContainer.addItem(testTopView);

                topContainer.setup();

                //Prognose view and controller:
                /*
                var prognoseView = new PrognoseView();
                var prognoseController = new PrognoseDummyController(); //new PrognoseController();
                prognoseController.connectToView(prognoseView);
                ViewContainer.instance.registerView("PrognoseView", prognoseView);
                */
                //this._controllerContainer = new ControllerContainer();
                //Now that all views are created, set them up.
                PowerViz.ViewContainer.instance.setupViews();
                PowerViz.ViewContainer.instance.setActiveView("PrognoseView");

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
})(PowerViz || (PowerViz = {}));
