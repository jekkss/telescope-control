const url = '/api'
let haSteps = 0, decSteps = 0
let focuser = 0
let loadingSpinner = document.querySelector('#loadingSpinner')
let ha = 0, dec = 0, haCorrection = 0, decCorrection = 0

document.getElementById("haCorrection").addEventListener("mouseup", function () {
  if (haCorrection != this.value) {
    haCorrection = this.value
    document.querySelector('.haCorrectionValue').innerHTML = haCorrection
    calculateSteps()
  }
})

document.getElementById("decCorrection").addEventListener("mouseup", function () {
  if (decCorrection != this.value) {
    decCorrection = this.value
    document.querySelector('.decCorrectionValue').innerHTML = decCorrection
    calculateSteps()
  }
})

document.getElementById("buttonGoTo").addEventListener("mousedown", function () {
  switchMovement.checked = true
  setTimeout(function() {
    switchMovement.checked = false
  }, (100));
})

document.getElementById("selectTelescopePort").addEventListener("mousedown", function () {
  document.getElementById('selectTelescopePort').options.length = 0;
  serialPorts()
})

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

function calculateSteps(){
  
  let haResult = parseFloat((ha / 0.005625).toFixed(0)) + parseFloat(haCorrection)
  let decResult = parseFloat((dec / 0.084375).toFixed(0)) + parseFloat(decCorrection)
   
  if(haResult > 7680000){
    haResult -= 7680000
    decResult = 7680000 - decResult//decResult - 3840000
  }/*else{
    decResult = (3840000 - decResult)
  }*/
  //haResult = 0
  //decResult = 0 
  serialData = haResult + "/" + decResult

  document.querySelector('#coordinatesLabel').innerHTML = serialData
  let dataJson = {
    ha: haResult,
    dec: decResult
  }   
  serialWrite(dataJson)
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
        if (switchMovement.checked) {
          document.querySelector('.telescopCoordinates').innerHTML = "HA/Dec: " + json.coordinates
          ha = parseFloat(json.coordinates.substring(0, 2)) * 3600 + parseFloat(json.coordinates.substring(3, 5)) * 60 + parseFloat(json.coordinates.substring(6, 11))
          dec = (parseFloat(json.coordinates.substring(14, 16)) * 3600 + parseFloat(json.coordinates.substring(17, 19)) * 60 + parseFloat(json.coordinates.substring(20, 24)))
          if (json.coordinates.substring(13, 14) == "-") {
            dec = -dec
          }

          document.querySelector('.telescopHa').innerHTML = "HA: " + ha.toFixed(1) + "/" + (ha / 0.005625).toFixed(0)
          document.querySelector('.telescopDec').innerHTML = "Dec: " + dec.toFixed(1) + "/" + (dec / 0.084375).toFixed(0)
          calculateSteps()
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
intervalConnection = window.setInterval(function () { stellariumConnect() }, 100)
