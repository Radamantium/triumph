'use strict';

bezier();

function bezier(svgCanvasId = 'bezierCanvas',
                clearBtnId  = 'clear-btn', 
                addBtnId    = 'add-curve-btn', 
                delBtnId    = 'del-curve-btn', 
                colorBtnId  = 'change-color-btn') {

  /* BASE VARIABLES AND DEFENITIONS */
  let bezierCanvas;
  let clearButton;
  let addButton;
  let delButton;
  let colorButton;

  try {
    let errorStingBegin = 'function "bezier" error. Uncorrect input data: ';
    let errorStingEnd   = ' is not defined';

    bezierCanvas = document.getElementById(svgCanvasId);
    if (!bezierCanvas) {
      throw new Error(errorStingBegin + 'svgCanvasId' + errorStingEnd);
    }

    clearButton = document.getElementById(clearBtnId);
    if (!clearButton) {
      throw new Error(errorStingBegin + 'clearBtnId' + errorStingEnd);
    }

    addButton = document.getElementById(addBtnId);
    if (!addButton) {
      throw new Error(errorStingBegin + 'addBtnId' + errorStingEnd);
    }

    delButton = document.getElementById(delBtnId);
    if (!delButton) {
      throw new Error(errorStingBegin + 'delBtnId' + errorStingEnd);
    }

    colorButton = document.getElementById(colorBtnId);
    if (!colorButton) {
      throw new Error(errorStingBegin + 'colorBtnId' + errorStingEnd);
    }
  } catch (error) {
    console.log(error.message);
    return;
  }

  clearButton.addEventListener( 'click', clearBezierCanvas);
  addButton.addEventListener(   'click', addNewCurve);
  delButton.addEventListener(   'click', deleteSelectedCurve);
  colorButton.addEventListener( 'click', changeCurveColor);
  bezierCanvas.addEventListener('mousedown', unselectCurves);

  let selectedCurve = null;

  /* FUNCTIONS */
  function addNewCurve(e) {
    unselectCurves();

    let pointA;
    let pointB;
    let pointC1;
    let pointC2;
    let newCurve;

    getPoints();

    function getPoints() {

      getBeginPoints();

      function getBeginPoints() {
        bezierCanvas.onmousedown = function(e) {
          e.stopPropagation();
          e.preventDefault();
          pointA = getLocalCoords(e);
          pointC1 = pointA;
          newCurve = new CubicBezierCurve(pointA, pointA, pointA, pointA, bezierCanvas);

          document.onmousemove = function(e) {
            e.stopPropagation();
            pointC1 = getLocalCoords(e);
            newCurve.setPointsAndUpdate(pointA, pointC1, pointC1, pointC1);
          };

          document.onmouseup = function(e) {
            document.onmousemove = function(e) {
              e.stopPropagation();
              pointB = getLocalCoords(e);
              newCurve.setPointsAndUpdate(pointA, pointC1, pointB, pointB);
            };
            document.onmouseup = null;
            bezierCanvas.onmousedown = null;
            getEndPoints();
          };
        };
      }

      function getEndPoints() {
        bezierCanvas.onmousedown = function(e) {
          e.stopPropagation();
          e.preventDefault();
          pointB = getLocalCoords(e);
          pointC2 = pointB;
          newCurve.setPointsAndUpdate(pointA, pointC1, pointB, pointB);

          document.onmousemove = function(e) {
            e.stopPropagation();
            pointC2 = getLocalCoords(e);
            newCurve.setPointsAndUpdate(pointA, pointC1, pointC2, pointB);
          };

          document.onmouseup = function(e) {
            e.stopPropagation();
            document.onmousemove = null;
            document.onmouseup = null;
            bezierCanvas.onmousedown = null;
            setupNewCurve(newCurve);
          };
        };
      }
    }
  }

  function setupNewCurve(curve) {
    curve.setPointsListeners();
    curve.setMoveListener();
    curve.html.addEventListener('mousedown', selectCurve.bind(curve));
    selectedCurve = curve;
    curves.push(curve);
  }

  function clearBezierCanvas(e) {
    for(let curve of curves) {
      curve.delete();
    }
    curves = [];
  }

  function unselectCurves() {
    selectedCurve = null;

    for (let curve of curves) {
      curve.hideGuides();
    }
  }
  
  function selectCurve(e) {
    e.preventDefault();
    e.stopPropagation();

    unselectCurves();

    selectedCurve = curves.find( (item) => item.id == this.id );
    selectedCurve.showGuides();
  }

  function deleteSelectedCurve(e) {
    if (selectedCurve == null) return;

    let selectedCurveNum = curves.findIndex( (item) => item.id == selectedCurve.id );
    curves.splice(selectedCurveNum, 1);
    
    selectedCurve.delete();
    selectedCurve = null;

  }

  function changeCurveColor(e) {
    console.log('changeCurveColor');
  }
}