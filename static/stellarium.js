const url = '/api'
let haSteps = 0, decSteps = 0
let focuser = 0
let loadingSpinner = document.querySelector('#loadingSpinner')
let ha = 0, dec = 0, haCorrection = 0, decCorrection = 0, haCorrectionOld = 0, decCorrectionOld = 0
let haStepInSec = 0, decStepInSec = 0, haStepOld = 0, decStepOld = 0, stepInSecTime = 0
let haResult = 0, decResult = 0

document.addEventListener('keydown', (event) => {
  const key = event.key;
  switch (key) {
      case 'ArrowUp':   
        document.getElementById('decCorrectionMicro').value = Number(document.getElementById('decCorrectionMicro').value) + 100
        decCorrection = Number(document.getElementById('decCorrectionMicro').value) + Number(document.getElementById('decCorrection').value)
        document.querySelector('.decCorrectionValue').innerHTML = decCorrection
        break
      case 'ArrowDown':  
        document.getElementById('decCorrectionMicro').value = Number(document.getElementById('decCorrectionMicro').value) - 100
        decCorrection = Number(document.getElementById('decCorrectionMicro').value) + Number(document.getElementById('decCorrection').value)
        document.querySelector('.decCorrectionValue').innerHTML = decCorrection
        break
      case 'ArrowLeft':  
        document.getElementById('haCorrectionMicro').value = Number(document.getElementById('haCorrectionMicro').value) - 100
        haCorrection = Number(document.getElementById('haCorrectionMicro').value) + Number(document.getElementById('haCorrection').value)
        document.querySelector('.haCorrectionValue').innerHTML = haCorrection
        break
      case 'ArrowRight': 
        document.getElementById('haCorrectionMicro').value = Number(document.getElementById('haCorrectionMicro').value) + 100
        haCorrection = Number(document.getElementById('haCorrectionMicro').value) + Number(document.getElementById('haCorrection').value)
        document.querySelector('.haCorrectionValue').innerHTML = haCorrection
        break
  }
  calculateSteps("goto")
});

document.getElementById("haCorrection").addEventListener("mouseup", function () {
  haCorrection = Number(document.getElementById('haCorrectionMicro').value) + Number(this.value)
  document.querySelector('.haCorrectionValue').innerHTML = haCorrection
  calculateSteps("goto")
})

document.getElementById("haCorrectionMicro").addEventListener("mousemove", function () {
  haCorrection = Number(document.getElementById('haCorrection').value) + Number(this.value)
  if(haCorrection != haCorrectionOld){
    haCorrectionOld = haCorrection
    document.querySelector('.haCorrectionValue').innerHTML = haCorrection
    calculateSteps("goto")
  }
})

document.getElementById("decCorrection").addEventListener("mouseup", function () {
  decCorrection = Number(document.getElementById('decCorrectionMicro').value) + Number(this.value)
  document.querySelector('.decCorrectionValue').innerHTML = decCorrection
  calculateSteps("goto")
})

document.getElementById("decCorrectionMicro").addEventListener("mousemove", function () {
  decCorrection = Number(document.getElementById('decCorrection').value) + Number(this.value)
  if(decCorrection != decCorrectionOld){
    document.querySelector('.decCorrectionValue').innerHTML = decCorrection
    decCorrectionOld = decCorrection
    calculateSteps("goto")
  }
})

document.getElementById("buttonGoTo").addEventListener("mousedown", function () {
  calculateSteps("goto")
})

document.getElementById("buttonMovement").addEventListener("mousedown", function () {
  switchMovement.checked = !switchMovement.checked
  if(!switchMovement.checked){
    calculateSteps("goto")
  }
})

document.getElementById("buttonHome").addEventListener("mousedown", function () {
  let dataJson = {
    ha: 0,
    dec: 0,
    command: "goto"
  }   
  serialWrite(dataJson)
})

/*document.getElementById("selectTelescopePort").addEventListener("mousedown", function () {
  document.getElementById('selectTelescopePort').options.length = 0;
  serialPorts()
})*/

document.getElementById("buttonTelescopeConnect").addEventListener("mousedown", function () {
  let e = document.getElementById("selectTelescopePort");
  let data = e.options[e.selectedIndex].text;
  if(data)
    openComPort(data)
})

async function writeSettings() {
  let response = await fetch("/writeSettings", {
    method: "POST",
    headers: { "Content-Type": "application/json", },
    body: JSON.stringify({ 'id': 123, 'name': 'John Doe', 'email': 'johndoe@example.com' }),
  })
  return Promise
}

async function readSettings() {
  let response = await fetch('/readSettings');

  if (response.ok) {
    let json = await response.json()
    console.log(json)
    if (json.status == 200) {
      console.log(json)
    } else {

    }

  } else {
    alert("Error HTTP: " + response.status);
  }
  return Promise.json
}

function calculateSteps(command){
  
  haResult = parseFloat((ha / 0.005625).toFixed(0)) + parseFloat(haCorrection)
  decResult = parseFloat((dec / 0.084375).toFixed(0)) + parseFloat(decCorrection)
   
  if(haResult > 7680000){
    haResult -= 7680000
    decResult = 7680000 - decResult
  }
  serialData = haResult + "/" + decResult

  document.querySelector('#coordinatesLabel').innerHTML = serialData
  let dataJson = {
    ha: haResult,
    dec: decResult,
    command: command,
    haSpeed: haStepInSec.toFixed(4),
    decSpeed: decStepInSec.toFixed(4)
  }   
  serialWrite(dataJson)

  console.log(serialRead())

}

async function stellariumConnect() {
  if(document.getElementById("stellariumConnect").checked){
    let response = await fetch(url)
    if (response.ok) {
      let json = await response.json()
      if (json.status == 200) {
        document.querySelector('.stellariumInfo').innerHTML = "Stellarium connected!"
        let switchMovement = document.querySelector('#switchMovement')
        if (document.querySelector('.telescopInfo').innerHTML.substring(0, 10) != json.info.substring(0, 10)) {
          switchMovement.checked = false  
        } document.querySelector('.telescopInfo').innerHTML = json.info
        document.querySelector('.telescopCoordinates').innerHTML = "HA/Dec: " + json.coordinates
        ha = parseFloat(json.coordinates.substring(0, 2)) * 3600 + parseFloat(json.coordinates.substring(3, 5)) * 60 + parseFloat(json.coordinates.substring(6, 11))
        dec = (parseFloat(json.coordinates.substring(14, 16)) * 3600 + parseFloat(json.coordinates.substring(17, 19)) * 60 + parseFloat(json.coordinates.substring(20, 24)))
        if (json.coordinates.substring(13, 14) == "-") {
          dec = -dec
        }
        
        document.querySelector('.telescopHa').innerHTML = "HA: " + ha.toFixed(1) + " sec /" + (ha / 0.005625).toFixed(0) + " step"
        document.querySelector('.telescopDec').innerHTML = "Dec: " + dec.toFixed(1) + " sec /" + (dec / 0.084375).toFixed(0) + " step"
        if (switchMovement.checked) {
          haResult = parseFloat((ha / 0.005625).toFixed(0)) + parseFloat(haCorrection)
          decResult = parseFloat((dec / 0.084375).toFixed(0)) + parseFloat(decCorrection)
        
          haStepInSec = (haResult - haStepOld) / (Date.now() - stepInSecTime)
          haStepOld = haResult
          decStepInSec = (decResult - decStepOld) / (Date.now() - stepInSecTime)
          decStepOld = decResult
          stepInSecTime = Date.now()
          calculateSteps("movement")
        }
      } else {
        document.querySelector('.stellariumInfo').innerHTML = "Stellarium connected! The object is not selected!"
      }

    } else {
      document.querySelector('.stellariumInfo').innerHTML = "Stellarium is not connected!"
      alert("Error HTTP: " + response.status)
    }
    return Promise.json
  }
}

    
//readSettings()
//writeSettings()
intervalConnection = window.setInterval(function () { stellariumConnect() }, 1000)
//window.document.hasFocus = function() {return true;}