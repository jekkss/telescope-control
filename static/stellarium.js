let switchStellariumConnect = document.getElementById("intervalConnection")

switchStellariumConnect.addEventListener("mousemove", function () {
  interval = document.querySelector('#intervalConnection')
  if (interval.checked) {
    intervalConnection = window.setInterval(function () { stellariumConnect() }, 150)
  }else{
    window.clearInterval(intervalConnection)
  }
})

    async function stellariumConnect() {
        let response = await fetch('/api')
        if (response.ok) {
          let json = await response.json()
          if (json.status == 200) {
            document.querySelector('.stellariumInfo').innerHTML = "Stellarium connected!"
            let switchMovement = document.querySelector('#switchMovement')
            if (document.querySelector('.telescopInfo').innerHTML.substring(0, 10) != json.info.substring(0, 10)) {
              switchMovement.checked = false
            } 
            document.querySelector('.telescopInfo').innerHTML = json.info
            if (switchMovement.checked) {
              document.querySelector('.telescopCoordinates').innerHTML = "HA/Dec: " + json.coordinates
              ha = parseFloat(json.coordinates.substring(0, 2)) * 3600 + parseFloat(json.coordinates.substring(3, 5)) * 60 + parseFloat(json.coordinates.substring(6, 11))
              document.querySelector('.telescopHa').innerHTML = "HA: " + ha.toFixed(1) + "/" + (ha / 0.005625).toFixed(0)
              dec = parseFloat(json.coordinates.substring(14, 16)) * 3600 + parseFloat(json.coordinates.substring(17, 19)) * 60 + parseFloat(json.coordinates.substring(20, 24))
              if (json.coordinates.substring(13, 14) == "-") {
                dec = -dec
              }
              document.querySelector('.telescopDec').innerHTML = "Dec: " + dec.toFixed(1) + "/" + (dec / 0.084375).toFixed(0)
              calculateSteps()
            }
          } else {
            document.querySelector('.stellariumInfo').innerHTML = json.info//"Stellarium is not connected! Stellarium connected! The object is not selected!"
          }

        } else {
          if (switchStellariumConnect.checked) {
            switchStellariumConnect.checked = false
          }
          document.querySelector('.stellariumInfo').innerHTML = json.info//  "Stellarium is not connected!"
          alert("Error HTTP: " + response.status)
        }
        return Promise.json
    }

    
    readSettings()
    writeSettings()
    //intervalConnection = window.setInterval(function () { stellariumConnect() }, 100)
