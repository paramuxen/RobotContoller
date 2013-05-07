/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
(function() {

    function loadSvgObject(_oCanvas) {
        fabric.loadSVGFromURL('js/img.svg', function(objects, options) {
            var obj = fabric.util.groupSVGElements(objects, options);
            _oCanvas.add(obj).renderAll();
        })
    }
    //var log = log4javascript.getDefaultLogger();
    var createClass = fabric.util.createClass;
    //fabric.util.extend(window,fabric.util);
    function getOrientation() {
        return  window.matchMedia("(orientation: portrait)").matches ? 'portrait' : 'landscape';
    }


    var _oMatchMedia = window.matchMedia("(orientation: portrait)");
    function addOrientationChangeListener(_fListener, _oContext) {
        if (typeof _fListener == 'function') {
            _oMatchMedia.addListener(function(m) {
                if (m.matches) {
                    _fListener.call(_oContext, 'portrait'); // Changed to portrait
                } else {
                    _fListener.call(_oContext, 'landscape'); // Changed to landscape
                }
                ;
            });
        }
    }


    function isCoordsCont(tlX, tlY, brX, brY, _nX, _nY) {
        return _nX > tlX && _nX < brX && _nY > tlY && _nY < brY;
    }

    function isTarget(_oObject, _oEvent) {
        var _oOriginalEvent = _oEvent.originalEvent,
                _nX, _nY,
                _elementOffset = _oObject.canvas._offset,
                _nOffsetObjectLeft = _elementOffset.left + _oObject.getLeft(),
                _nOffsetObjectTop = _elementOffset.top + _oObject.getTop(),
                _nOffsetObjectWidth = _nOffsetObjectLeft + _oObject.getWidth(),
                _nOffsetObjectHeight = _nOffsetObjectTop + _oObject.getHeight()
        if (_oEvent.data.type == 'mstouch' || _oEvent.data.type == 'mouse') {
            if (isCoordsCont(_nOffsetObjectLeft, _nOffsetObjectTop, _nOffsetObjectWidth, _nOffsetObjectHeight, _oOriginalEvent.pageX, _oOriginalEvent.pageY)) {
                _nX = _oOriginalEvent.pageX,
                        _nY = _oOriginalEvent.pageY;
            }
        } else if (_oEvent.data.type == 'wktouch') {
            var _aTouches = _oOriginalEvent.touches,
                    i = _aTouches.length;
            while (i--) {
                if (isCoordsCont(_nOffsetObjectLeft, _nOffsetObjectTop, _nOffsetObjectWidth, _nOffsetObjectHeight, _aTouches[i].pageX, _aTouches[i].pageY)) {
                    _nX = _aTouches[i].pageX,
                            _nY = _aTouches[i].pageY;
                    break;
                }
            }

        }

        return _nY ? {x: _nX, y: _nY} : null;
    }


    function bindOrientationEvents() {
        $(window).on('compassneedscalibration', function(_oEvent) {
            _oEvent.preventDefault();
        });
        return;
        $(window).bind('deviceorientation', function(_oJQEvent) {
            if (this._textField) {
                var _oOriginalEvent = _oJQEvent.originalEvent,
                        _oRotationRate = _oOriginalEvent,
                        _aRotationRate = [];
//                for (var i in _oRotationRate) {
//                    _aRotationRate.push(i + ': ' + _oRotationRate[i]);
//                }
                if (_oRotationRate) {
                    this._textField.setText(_oRotationRate.alpha + ' ' + _oRotationRate.beta + ' ' + _oRotationRate.gamma);
                    this._canvas.renderAll();
                }
            }
        }.bind(this));
//        $(window).on('devicemotion', function(_oJQEvent) {
//            if (this._textField) {
//                var _oOriginalEvent = _oJQEvent.originalEvent,
//                        _oRotationRate = _oOriginalEvent.rotationRate,
//                        _oAcceleration = _oOriginalEvent.acceleration,
//                        _oAccelerationIncludingGravity = _oOriginalEvent.accelerationIncludingGravity,
//                        _aRotationRate = [];
//
//                for (var i in _oAccelerationIncludingGravity) {
//                    _aRotationRate.push(i + ': ' + _oAccelerationIncludingGravity[i].toFixed(2));
//                }
//
//
//                this._textField.setText(_aRotationRate.join(" "));
//                this._canvas.renderAll();
//
//            }
//        }.bind(this));
    }


    var SideManipulator = createClass(fabric.Object, {
        initialize: function(_options, _fCallBack) {
            this._observe = 0;
            this.mouseDown = this._mouseDown.bind(this);
            this.mouseMove = this._mouseMove.bind(this);
            this.mouseUp = this._mouseUp.bind(this);

            this.isTarget = isTarget.bind(this, this);
            this._onCreate(_options, _fCallBack);
        },
        _render: function(ctx) {
        },
        _createCircleObject: function(_fCallback) {
            fabric.Image.fromURL('css/images/stik.png', function(_oImg) {
                _oImg.set({left: this.getCenterPoint().x, top: this.getCenterPoint().y, width: 40, height: 40, perPixelTargetFind: true,
                    selectable: false,
                    originX: 'center',
                    originY: 'center'});
                this._circle = _oImg;
                _fCallback.apply(this);
            }.bind(this));
        },
        _createBackgroundObject: function(_options, _fCallBack) {
//            var _oCircle = new fabric.Circle(_options);
//            _oCircle.setGradient('fill', {
//                x1: 0, y1: 0, r1: _oCircle.get('radius') / 10,
//                x2: 0, y2: 0, r2: _oCircle.get('radius'),
//                opacity: 0.3,
//                colorStops: {
//                    '0': "white",
//                    '0.2': "black",
//                    '0.6': "gray",
//                    '0.8': "black",
//                    '1': "white"}
//            });
//            _oCircle.cloneAsImage(function(_oImg){
//                //Сохранить в картинку
//                //window.open(document.getElementById("canvas").toDataURL("image/png"),"tfract_save");
//                _oImg.set({top: this.getTop(), left: this.getLeft(), width: _oCircle.getWidth(), height: _oCircle.getHeight(), perPixelTargetFind: true,
//                     selectable: this.get('selectable'),
//                     originX: this.get('originX'),
//                     originY: this.get('originY')});
//               this._backgroundObject = _oImg;
//               _fCallBack.apply(this);
//           }.bind(this));
            fabric.Image.fromURL('css/images/target2.png', function(_oImg) {
                _oImg.set({top: this.getTop(), left: this.getLeft(), width: this.getWidth(), height: this.getHeight(), perPixelTargetFind: true,
                    selectable: this.get('selectable'),
                    originX: this.get('originX'),
                    originY: this.get('originY')});

                this._backgroundObject = _oImg;
                _fCallBack.apply(this);
            }.bind(this));
        },
        setRadius: function(_nRadius) {
            fabric.Circle.prototype.setRadius.apply(this, arguments);
            //this.callSuper('setRadius', _nRadius);
            if (this._backgroundObject) {
                this._backgroundObject.set({width: this.getWidth(), height: this.getHeight()});
            }
            if (this._circle) {
                var _nDiametr = this.getWidth() / 5 > 40 ? this.getWidth() / 5 : 40;
                this._circle.set({width: _nDiametr, height: _nDiametr});
            }
        },
        _onCreate: function(_options, _fCallBack) {
            fabric.Circle.prototype.initialize.apply(this, arguments);
            //this.callSuper('initialize', _options);
            var _default = $.extend({}, _options, {originX: 'center', originY: 'center', selectable: false});
            this.on('added', function() {
                this.off('added', arguments.callee);
                this._addedObject();
            }.bind(this));
            this._createBackgroundObject(_default, this._createCircleObject.bind(this, _fCallBack.bind(this, this)));

        },
        _setAccelerometerActivate: function(_bActivate) {
            $(window).bind('devicemotion', function(_oJQEvent) {
                var _oOriginalEvent = _oJQEvent.originalEvent,
                        _oRotationRate = _oOriginalEvent.rotationRate,
                        _oAcceleration = _oOriginalEvent.acceleration,
                        _oAccelerationIncludingGravity = _oOriginalEvent.accelerationIncludingGravity,
                        _aRotationRate = [];
                for (var i in _oAccelerationIncludingGravity) {
                    _aRotationRate.push(i + ': ' + _oAccelerationIncludingGravity[i].toFixed());
                }

                if (this._textField) {
                    this._textField.setText(_aRotationRate.join(" "));
                    if (this._textField.canvas) {
                        this._textField.canvas.renderAll();
                    }
                }

            }.bind(this));

        },
        _addedObject: function() {

            //            MSPointerDown
//            MSPointerMove
//            MSPointerUp
//            MSPointerOver
//            MSPointerOut
//            MSPointerHover

//Событие MSGestureTap
//Событие MSGestureHold
//Событие MSGestureStart
//Событие MSGestureChange
//Событие MSGestureEnd
//Событие MSInertiaStart
//            this.setGradient('fill', {
//                x1: 0, y1: 0, r1: 100,
//                x2: 0, y2: 0, r2: 1000,
//                opacity: 0.75,
//                colorStops: {
//                    '0': "green",
//                    '1': "black"}
//            });
            //this.setRadius(this.get('radius'));
            this.canvas.add(this._backgroundObject);
            this.canvas.add(this._getCircle());
            this._setAccelerometerActivate(true);
            //loadSvgObject(this.canvas);
            this._getCircle().bringToFront();
            this.canvas.renderAll();
            if (window.navigator.msPointerEnabled) {
                //$(this.getCanvasEl()).on('MSPointerDown', {type: 'mstouch'}, this.mouseDown);
                //$(this.getCanvasEl()).on('MSPointerMove', {type: 'mstouch'}, this.mouseMove);
                //$(this.getCanvasEl()).on('MSPointerUp', {type: 'mstouch'}, this.mouseUp);
                //$(this.getCanvasEl()).on('MSPointerCancel', {type: 'mstouch'}, this.mouseUp); 
                //$(this.getCanvasEl()).on('MSPointerOut', {type: 'mstouch'}, this.mouseUp); 

            } else {
                $(this.getCanvasEl()).on('touchstart', {type: 'wktouch'}, this.mouseDown);
                $(this.getCanvasEl()).on('touchmove', {type: 'wktouch'}, this.mouseMove);
                $(this.getCanvasEl()).on('touchend', {type: 'wktouch'}, this.mouseUp);
            }

            $(this.getCanvasEl()).on('mousedown', {type: 'mouse'}, this.mouseDown);
            $(this.getCanvasEl()).on('mousemove', {type: 'mouse'}, this.mouseMove);
            $(this.getCanvasEl()).on('mouseup', {type: 'mouse'}, this.mouseUp);
            //$(this.getCanvasEl()).on('mouseout', {type: 'mouse'}, this.mouseUp);

        },
        getCanvasEl: function() {
            return this.canvas.lowerCanvasEl;
        },
        _getCircle: function() {
            if (!this._circle) {
                this._circle = new fabric.Circle({radius: this.get('radius') / 10 > 20 ? this.get('radius') / 10 : 20, left: this.getCenterPoint().x, top: this.getCenterPoint().y, selectable: false, stroke: '0000CC', fill: 'rgb(100,100,200)'});
                //this._circle = new fabric.Circle({radius: 100, left: 100, top: 100});
                this._circle.setGradient('fill', {
                    x1: 4, y1: -2, r1: this._circle.get('radius') / 10,
                    x2: 0, y2: 0, r2: this._circle.get('radius'),
                    colorStops: {
                        '0': "CCCCFF",
                        '0.4': "9933FF",
                        "0.8": "9900FF",
                        '1': "6600FF"}
                });
            }
            return this._circle;
        },
        _mouseDown: function(_oEvent) {
            _oEvent.preventDefault();
            if (this.isTarget(_oEvent)) {
                this._observe += 1;
                this.mouseMove(_oEvent);
            }
        },
        _mouseMove: function(_oEvent) {
            _oEvent.preventDefault();
            var _oOriginalEvent = _oEvent.originalEvent,
                    _oCoords = this._observe > 0 ? this.isTarget(_oEvent) : null;
            if (_oCoords) {
                this.moveShape(this._getCircle(), _oCoords.x, _oCoords.y);
            }
        },
        _mouseUp: function(_oEvent) {
            _oEvent.preventDefault();
            if (this._observe > 0) {
                this._observe -= 1;
                if (this._observe <= 0) {
                    this._observe = 0;
                    this.moveShape(this._getCircle(), this.getCenterPoint().x, this.getCenterPoint().y, false);
                }
            }
        },
        moveShape: function(_oShape, _x, _y, _bAnimate) {
            if (_oShape) {
                var _oCanvas = this.canvas;
                var _oCanvasOffset = _oCanvas._offset,
                        _x1 = _oCanvasOffset.left + this.getLeft() + this.getWidth() / 2,
                        _nXMax = _oCanvasOffset.left + this.getLeft() + this.getWidth(),
                        _y1 = _oCanvasOffset.top + this.getTop() + +this.getHeight() / 2,
                        _nYMax = _oCanvasOffset.top + this.getHeight() + this.getHeight()
                var _nFullX = this.getWidth() / 200,
                        _nFullY = this.getHeight() / 200,
                        _nCurentPosX = _x - _x1,
                        _nCurentPosY = _y - _y1,
                        _nCoordX = (_nCurentPosX / _nFullX),
                        _nCoordY = -(_nCurentPosY / _nFullY);
//                if (this._textField) {
//                    this._textField.set({text: String(_nCoordX.toFixed()) + ' ' + String(_nCoordY.toFixed())})
//                }

                if (_bAnimate) {
                    _oShape.animate({left: _x, top: _y}, {
                        duration: 100,
                        easing: fabric.util.ease.easeOutElastic,
                        onChange: _oCanvas.renderAll.bind(_oCanvas)});
                } else {
                    _oShape.set({left: _x, top: _y});
                    _oCanvas.renderAll();
                }

            }
        }
    });

    var JoyStikApplication = createClass({
//        launchFullScreen: function (element) {
//            if(element.requestFullScreen) {
//              element.requestFullScreen();
//            } else if(element.mozRequestFullScreen) {
//              element.mozRequestFullScreen();
//            } else if(element.webkitRequestFullScreen) {
//              element.webkitRequestFullScreen();
//            }
//          },
        initialize: function() {
            this._canvas = new fabric.StaticCanvas('main_canvas', {selection: false});

            fabric.util.addListener(window, 'resize', this.adjustSize.bind(this));
            //this._initTextField();
            new SideManipulator({left: 0, top: 0, originX: 'left', originY: 'top', radius: this._getPreferredSideRadius()}, function(_Object) {
                this._sideManipulator = _Object;
                this._sideManipulator._textField = this._textField;
                this.adjustSize();
                this._canvas.add(_Object);

            }.bind(this));
            this._initEvents();

        },
        _initEvents: function() {
            //window.addEventListener('load', setOrientation, false);
            bindOrientationEvents.bind(this).call();
            //$(this._canvas.upperCanvasEl).on('mousedown', function(){debugger;});

            $(this._canvas.upperCanvasEl).on("selectstart", function(e) {
                e.preventDefault();
            }, false);
            $(this._canvas.upperCanvasEl).on("MSGestureHold", function(e) {
                e.preventDefault();
            }, false);
            // Disables visual
            $(this._canvas.upperCanvasEl).on("contextmenu", function(e) {
                e.preventDefault();
            }, false);
            // Disables menu
        },
        _initTextField: function() {
            var text = new fabric.Text('', {fontSize: 15});
            text.originX = 'left';
            text.originY = 'top';
            this._canvas.add(text);
            this._textField = text;
        },
        _getPreferredSideRadius: function() {
            return ((this.getPreferredHeight() < this.getPreferredWidth() ? this.getPreferredHeight() : this.getPreferredWidth()) / 2).toFixed();
        },
        adjustSize: function() {
            this._canvas.setHeight(this.getPreferredHeight());
            this._canvas.setWidth(this.getPreferredWidth());
            if (this._sideManipulator) {
                this._sideManipulator.setRadius(this._getPreferredSideRadius());
                if (this._textField) {
                    this._textField.set({left: this._sideManipulator.getWidth() / 2, top: 0});
                    this._textField.bringToFront();
                }

            }
            this._canvas.renderAll();
        },
        getPreferredHeight: function() {
            return document.getElementById('joystik').clientHeight;
            //return window.innerHeight;
        },
        getPreferredWidth: function() {
            return document.getElementById('joystik').clientWidth;
            //return window.innerWidth;
        },
        start: function() {

        },
        stop: function() {
        }
    });
    fabric.util.addListener(window, 'load', function() {
        (new JoyStikApplication()).start();


    });
})();
