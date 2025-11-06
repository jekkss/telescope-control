
function writeJson(haWrite, decWrite, dirHa, dirDec, command){
  //{"ha":301624,"dec":467604,"corHa":7,"corDec":0,"command":"sync","haSpeed":177.7778}
  let syncSpeed = document.querySelector('input[name="syncSpeed"]:checked').value;
  side = document.querySelector('input[name="inlineRadioOptions"]:checked').value

  //let haResult = parseFloat((ha / 0.005625).toFixed(0)) + parseFloat(haCorrection)
  //console.log(ha)
  //let decResult = parseFloat((dec / 0.084375).toFixed(0)) + parseFloat(decCorrection)

  if(side == "East"){
    haWrite -= 43200
    decWrite = -decWrite + 648000
    dirDec = -dirDec
  }

  let dataJson = {
    ha: Math.round(haWrite),
    dec: Math.round(decWrite),
    corHa: dirHa * syncSpeed,
    corDec: dirDec * syncSpeed,
    command: command,
    haSpeed:237.037037,
    side: side
  }  
  serialWrite(dataJson)
}


document.getElementById("buttonTelescopeConnect").addEventListener("mousedown", function () {
  let e = document.getElementById("selectTelescopePort");
  let data = e.options[e.selectedIndex].text;
  if(data)
    openComPort(data)
})

document.getElementById("buttonGoTo").addEventListener("mousedown", function () {
    writeJson(ha, dec, 0, 0, "GoTo")
})

document.getElementById("buttonHome").addEventListener("mousedown", function () {
    writeJson(0, 0, 0, 0, "GoTo")
})

document.getElementById("buttonStop").addEventListener("mousedown", function () {
  writeJson(ha, dec, 0, 0, "stop")
})

document.getElementById("buttonSet").addEventListener("mousedown", function () {
  writeJson(ha, dec, 0, 0, "set")
})

document.getElementById("buttonMove").addEventListener("mousedown", function () {
  writeJson(ha, dec, 0, 0, "move")
})

document.getElementById("buttonUp").addEventListener("mousedown", function () {
  writeJson(ha, dec, 0, 1, "sync")
})

document.getElementById("buttonUp").addEventListener("mouseup", function () {
  writeJson(ha, dec, 0, 0, "sync")
})

document.getElementById("buttonDown").addEventListener("mousedown", function () {
  writeJson(ha, dec, 0, -1, "sync")
})

document.getElementById("buttonDown").addEventListener("mouseup", function () {
  writeJson(ha, dec, 0, 0, "sync")
})

document.getElementById("buttonLeft").addEventListener("mousedown", function () {
  writeJson(ha, dec, -1, 0, "sync")
})

document.getElementById("buttonLeft").addEventListener("mouseup", function () {
  writeJson(ha, dec, 0, 0, "sync")
})

document.getElementById("buttonRight").addEventListener("mousedown", function () {
  writeJson(ha, dec, 1, 0, "sync")
})

document.getElementById("buttonRight").addEventListener("mouseup", function () {
  writeJson(ha, dec, 0, 0, "sync")
})

document.getElementById("buttonLeftUp").addEventListener("mousedown", function () {
  writeJson(ha, dec, -1, 1, "sync")
})

document.getElementById("buttonLeftUp").addEventListener("mouseup", function () {
  writeJson(ha, dec, 0, 0, "sync")
})

document.getElementById("buttonRightUp").addEventListener("mousedown", function () {
  writeJson(ha, dec, 1, 1, "sync")
})

document.getElementById("buttonRightUp").addEventListener("mouseup", function () {
  writeJson(ha, dec, 0, 0, "sync")
})

document.getElementById("buttonDownLeft").addEventListener("mousedown", function () {
  writeJson(ha, dec, -1, -1, "sync")
})

document.getElementById("buttonDownLeft").addEventListener("mouseup", function () {
  writeJson(ha, dec, 0, 0, "sync")
})

document.getElementById("buttonRightDown").addEventListener("mousedown", function () {
  writeJson(ha, dec, 1, -1, "sync")
})

document.getElementById("buttonRightDown").addEventListener("mouseup", function () {
  writeJson(ha, dec, 0, 0, "sync")
})

