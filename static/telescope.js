function writeJson(dirHa, dirDec){
  //{"ha":301624,"dec":467604,"corHa":7,"corDec":0,"command":"sync","haSpeed":177.7778}
  let syncSpeed = document.querySelector('input[name="syncSpeed"]:checked').value;
  let haResult = parseFloat((ha / 0.005625).toFixed(0)) + parseFloat(haCorrection)
  let decResult = parseFloat((dec / 0.084375).toFixed(0)) + parseFloat(decCorrection)
  let dataJson = {
    ha: haResult,
    dec: decResult,
    corHa: dirHa * syncSpeed,
    corDec: dirDec * syncSpeed,
    command:"sync",
    haSpeed:177.7778
  }  
  serialWrite(dataJson)
}

function writeJsonMove(){
  let dataJson = {
    ha: 0,
    dec: 0,
    corHa: 0,
    corDec: 0,
    command:"move",
    haSpeed:237.037037
  }  
  serialWrite(dataJson)
}

document.getElementById("buttonMove").addEventListener("mousedown", function () {
  writeJsonMove()
})

document.getElementById("buttonUp").addEventListener("mousedown", function () {
  writeJson(0, 1)
})

document.getElementById("buttonUp").addEventListener("mouseup", function () {
  writeJson(0, 0)
})

document.getElementById("buttonDown").addEventListener("mousedown", function () {
  writeJson(0, -1)
})

document.getElementById("buttonDown").addEventListener("mouseup", function () {
  writeJson(0, 0)
})

document.getElementById("buttonLeft").addEventListener("mousedown", function () {
  writeJson(-1, 0)
})

document.getElementById("buttonLeft").addEventListener("mouseup", function () {
  writeJson(0, 0)
})

document.getElementById("buttonRight").addEventListener("mousedown", function () {
  writeJson(1, 0)
})

document.getElementById("buttonRight").addEventListener("mouseup", function () {
  writeJson(0, 0)
})

document.getElementById("buttonLeftUp").addEventListener("mousedown", function () {
  writeJson(-1, 1)
})

document.getElementById("buttonLeftUp").addEventListener("mouseup", function () {
  writeJson(0, 0)
})

document.getElementById("buttonRightUp").addEventListener("mousedown", function () {
  writeJson(1, 1)
})

document.getElementById("buttonRightUp").addEventListener("mouseup", function () {
  writeJson(0, 0)
})

document.getElementById("buttonDownLeft").addEventListener("mousedown", function () {
  writeJson(-1, -1)
})

document.getElementById("buttonDownLeft").addEventListener("mouseup", function () {
  writeJson(0, 0)
})

document.getElementById("buttonRightDown").addEventListener("mousedown", function () {
  writeJson(1, -1)
})

document.getElementById("buttonRightDown").addEventListener("mouseup", function () {
  writeJson(0, 0)
})

