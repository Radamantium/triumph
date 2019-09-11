'use strict';

bezierApp();

function bezierApp(svgCanvasId = 'bezierCanvas',
                   headerId    = 'header'       ) {

  /* BASE VARIABLES AND DEFENITIONS */
  let bezierCanvas;
  let header;

  try {
    bezierCanvas = document.getElementById(svgCanvasId);
    if (!bezierCanvas) {
      throw new Error('function "bezier" error. Uncorrect input data: svgCanvasId is not defined');
    }

    header = document.getElementById(headerId);
    if (!header) {
      throw new Error('function "bezier" error. Uncorrect input data: headerId is not defined');
    }
  } catch (error) {
    console.log(error.message);
    return;
  }

  let controls;
  let addCurveButton;
  let delCurveButton;
  let changeColorButton;
  let clearAllButton;
  let palette;

  let curves = [];
  let selectedCurve = null;

  /* CREATE CONTROLS */
  createControls();

  function createControls() {
    controls = document.createElement('nav');
    controls.id = 'controls';
    controls.classList.add('controls');
    header.appendChild(controls);

    addCurveButton = document.createElement('button');
    addCurveButton.classList.add('controls__button');
    addCurveButton.id = 'add-curve-btn';
    addCurveButton.innerHTML = 'Add curve';
    controls.appendChild(addCurveButton);

    delCurveButton = document.createElement('button');
    delCurveButton.classList.add('controls__button');
    delCurveButton.id = 'del-curve-btn';
    delCurveButton.disabled = true;
    delCurveButton.innerHTML = 'Delete curve';
    controls.appendChild(delCurveButton);

    changeColorButton = document.createElement('button');
    changeColorButton.classList.add('controls__button');
    changeColorButton.id = 'hange-color-btn';
    changeColorButton.innerHTML = 'Change color';
    controls.appendChild(changeColorButton);
    createPalette();

    clearAllButton = document.createElement('button');
    clearAllButton.classList.add('controls__button');
    clearAllButton.id = 'clear-all-btn';
    clearAllButton.innerHTML = 'Clear all';
    controls.appendChild(clearAllButton);
  }

  function createPalette() {
    palette = document.createElement('div');
    palette.classList.add('palette');
    palette.id = 'palette';
    palette.style.display = 'none';

    palette.hide = function() {
      palette.style.display = 'none';
    };

    palette.show = function() {
      palette.style.display = 'block';
    };

    palette.toggleDisplay = function() {
      if (palette.style.display == 'block') {
        palette.style.display = 'none';
      } else {
        palette.style.display = 'block';
      }
    };

    changeColorButton.appendChild(palette);

    let colors = ['white', 'black', 'dimgrey', 'red', 'green', 'blue', 'yellow'];
    for (let color of colors) {
      let elem = document.createElement('div');
      elem.classList.add('palette__color');
      elem.style.backgroundColor = color;
      elem.dataset.color = color;
      elem.addEventListener( 'click', setColor.bind(elem, color) );
      palette.appendChild(elem);
    }
  }

  /* BASE VARIABLES AND DEFENITIONS */
 
  bezierCanvas.addEventListener(      'mousedown', unselectCurves);
  addCurveButton.addEventListener(    'click',     addNewCurve);
  delCurveButton.addEventListener(    'click',     deleteSelectedCurve);
  clearAllButton.addEventListener(    'click',     clearBezierCanvas);
  changeColorButton.addEventListener( 'click',     changeCurveColor);

  /* FUNCTIONS */
  function selectCurve(e) {
    e.preventDefault();
    e.stopPropagation();

    unselectCurves();
    delCurveButton.disabled = false;

    selectedCurve = curves.find( (item) => item.id == this.id );
    selectedCurve.showGuides();
  }

  function unselectCurves() {
    palette.hide();
    delCurveButton.disabled = true;

    selectedCurve = null;
    for (let curve of curves) {
      curve.hideGuides();
    }
  }  

  function addNewCurve(e) {
    unselectCurves();
    addCurveButton.disabled = true;
    delCurveButton.disabled = true;
    changeColorButton.disabled = true;
    clearAllButton.disabled = true;

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
          newCurve = new CubicBezierCurve(pointA, pointA, pointA, pointA, bezierCanvas);

          document.onmousemove = function(e) {
            pointC1 = getLocalCoords(e);
            newCurve.setPointsAndUpdate(pointA, pointC1, pointC1, pointC1);
          };

          document.onmouseup = function(e) {
            document.onmousemove = function(e) {
              pointB = getLocalCoords(e);
              newCurve.setPointsAndUpdate(pointA, pointC1, pointB, pointB);
            };
            getEndPoints();
          };
        };
      }

      function getEndPoints() {
        bezierCanvas.onmousedown = function(e) {
          e.stopPropagation();
          e.preventDefault();
          pointB = getLocalCoords(e);
          newCurve.setPointsAndUpdate(pointA, pointC1, pointB, pointB);

          document.onmousemove = function(e) {
            pointC2 = getLocalCoords(e);
            newCurve.setPointsAndUpdate(pointA, pointC1, pointC2, pointB);
          };

          document.onmouseup = function(e) {
            document.onmousemove = null;
            document.onmouseup = null;
            bezierCanvas.onmousedown = null;

            newCurve.setMoveListeners();
            newCurve.setSelectListener( selectCurve.bind(newCurve) );
            selectedCurve = newCurve;
            curves.push(newCurve);
            addCurveButton.disabled = false;
            delCurveButton.disabled = false;
            changeColorButton.disabled = false;
            clearAllButton.disabled = false;
          };
        };
      }
    }
  }

  function deleteSelectedCurve(e) {
    if (selectedCurve == null) return;

    let selectedCurveNum = curves.findIndex( (item) => item.id == selectedCurve.id );
    curves.splice(selectedCurveNum, 1);

    selectedCurve.delete();
    selectedCurve = null;
  }

  function changeCurveColor(e) {
    palette.toggleDisplay();
  }

  function setColor(newColor) {
    if (selectedCurve == null) {
      options.defaultCurveStroke = newColor;
    } else {
      selectedCurve.setColorAndUpate(newColor);
    }
  }

  function clearBezierCanvas(e) {
    for(let curve of curves) {
      curve.delete();
    }
    curves = [];
  }
}