let haSteps = 0, decSteps = 0  
let loadingSpinner = document.querySelector('#loadingSpinner')
let ha = 0, dec = 0, haCorrection = 0, decCorrection = 0

document.getElementById("haCorrection").addEventListener("mousemove", function () {
    if (haCorrection != this.value) {
      haCorrection = this.value
      document.querySelector('.haCorrectionValue').innerHTML = haCorrection
      calculateSteps()
    }
  })

  document.getElementById("decCorrection").addEventListener("mousemove", function () {
    if (decCorrection != this.value) {
      decCorrection = this.value
      document.querySelector('.decCorrectionValue').innerHTML = decCorrection
      calculateSteps()
    }
  })

  function calculateSteps(){
    let haResult = parseFloat((ha / 0.005625).toFixed(0)) + parseFloat(haCorrection)
    let decResult = parseFloat((dec / 0.084375).toFixed(0)) + parseFloat(decCorrection)
    serialData = haResult + "/" + decResult
    document.querySelector('#coordinatesLabel').innerHTML = serialData
    let dataJson = {
      ha: haResult,
      dec: decResult
    }   
    serialWrite(dataJson)
  }