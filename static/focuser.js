document.querySelector('#focuser').value = 0

document.getElementById("focuser").addEventListener("mousemove", function () {
  if (focuser != this.value) {
    focuser = this.value
    document.querySelector('.focuserValue').innerHTML = focuser
    document.querySelector('#focuserMicro').value = 0
  }
})

document.getElementById("focuserMicro").addEventListener("mousemove", function () {
  document.querySelector('.focuserValue').innerHTML = parseInt(document.getElementById("focuser").value) + parseInt(this.value)
})