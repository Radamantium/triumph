'use strict';

bezierApp();

function bezierApp(svgCanvasId = 'bezierCanvas',
                clearBtnId  = 'clear-btn', 
                addBtnId    = 'add-curve-btn', 
                delBtnId    = 'del-curve-btn', 
                colorBtnId  = 'change-color-btn') {

  /* BASE VARIABLES AND DEFENITIONS */
  let bezierCanvas;
  let clearButton;
  let addButton;
  let delButton;
  let changeColorButton;

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

    changeColorButton = document.getElementById(colorBtnId);
    if (!changeColorButton) {
      throw new Error(errorStingBegin + 'colorBtnId' + errorStingEnd);
    }
  } catch (error) {
    console.log(error.message);
    return;
  }

  clearButton.addEventListener( 'click', clearBezierCanvas);
  addButton.addEventListener(   'click', addNewCurve);
  delButton.addEventListener(   'click', deleteSelectedCurve);
  changeColorButton.addEventListener( 'click', changeCurveColor);
  bezierCanvas.addEventListener('mousedown', unselectCurves);

  setColorButtons();

  let curves = [];
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

            newCurve.setMoveListeners();
            newCurve.setSelectListener( selectCurve.bind(newCurve) );
            selectedCurve = newCurve;
            curves.push(newCurve);
          };
        };
      }
    }
  }


  function clearBezierCanvas(e) {
    for(let curve of curves) {
      curve.delete();
    }
    curves = [];
  }

  function unselectCurves() {
    document.getElementById('palette').classList.add('palette_hidden');
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
    document.getElementById('palette').classList.toggle('palette_hidden');
  }

  function setColorButtons() {
    let colorButtons = document.getElementsByClassName('palette__color');
    for (let button of colorButtons) {
      let newColor = button.dataset.color;
      button.addEventListener('click', function() {
        if (selectedCurve == null) {
          options.defaultCurveStroke = newColor;
        } else {
          selectedCurve.setColorAndUpate(newColor);
        }
      });
    }
  }
}