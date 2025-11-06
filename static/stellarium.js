const url = '/stellarium'
let haSteps = 0, decSteps = 0
let focuser = 0
let loadingSpinner = document.querySelector('#loadingSpinner')
let ha = 0, dec = 0, haCorrection = 0, decCorrection = 0, haCorrectionOld = 0, decCorrectionOld = 0
let haStepInSec = 0, decStepInSec = 0, haStepOld = 0, decStepOld = 0, stepInSecTime = 0
let haResult = 0, decResult = 0


async function stellariumConnect() {
  if(document.getElementById("stellariumConnect").checked){
    let response = await fetch(url)
    if (response.ok) {
      let json = await response.json()

      if (json.status == 200) {
        document.querySelector('.stellariumInfo').innerHTML = "Stellarium connected!"

        document.querySelector('.objectInfo').innerHTML = json.info
        document.querySelector('.objectCoordinates').innerHTML = "HA/Dec: " + json.coordinates
        ha = parseFloat(json.coordinates.substring(0, 2)) * 3600 + parseFloat(json.coordinates.substring(3, 5)) * 60 + parseFloat(json.coordinates.substring(6, 11))
        dec = (parseFloat(json.coordinates.substring(14, 16)) * 3600 + parseFloat(json.coordinates.substring(17, 19)) * 60 + parseFloat(json.coordinates.substring(20, 24)))
        if (json.coordinates.substring(13, 14) == "-") {
          dec = -dec
        }
        document.querySelector('.objectHa').innerHTML = ha
        document.querySelector('.objectDec').innerHTML = dec

        document.querySelector('.objectAz').innerHTML = json.Az
        document.querySelector('.objectAlt').innerHTML = json.Alt
  
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
    
intervalConnection = window.setInterval(function () { stellariumConnect() }, 1000)
