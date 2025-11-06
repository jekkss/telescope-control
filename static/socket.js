
function socketSend(){
  if(document.getElementById("socketSend").checked){
    socketUrl = document.getElementById("socketUrl").value
    socketOpen(socketUrl)
    writeString = ':Sz' + document.querySelector('.objectAz').innerHTML + '#'
    socketWrite(writeString)
    socketUrl = document.getElementById("socketUrl").value
    socketOpen(socketUrl)
    writeString = ':Sa' + document.querySelector('.objectAlt').innerHTML + '#'
    socketWrite(writeString)
  }
}
/*
document.getElementById("buttonSocketSend").addEventListener("mousedown", function () {
  writeString = ':Sz' + document.querySelector('.objectAz').innerHTML + '#'
  socketWrite(writeString)
})
/*
document.getElementById("buttonSocketStop").addEventListener("mousedown", function () {
    socketWrite('M#')
})*/


document.getElementById("buttonSocketOpen").addEventListener("mousedown", function () {
  document.querySelector('.socketInfo').innerHTML = "Socket connected..."
  socketUrl = document.getElementById("socketUrl").value
  socketOpen(socketUrl)
})



async function socketRead(data) {
  let response = await fetch("/socketRead", {
    method: "POST",
    headers: { "Content-Type": "application/text", },
    body: (data),
  })

  let json = await response.text()
  console.log(json.slice(1,-1))
}

async function socketWrite(data) {
  let response = await fetch("/socketWrite", {
    method: "POST",
    headers: { "Content-Type": "application/text", },
    body: (data),
  })
  //socketRead()
  //return(response)
}

async function socketOpen(data) {
  let response = await fetch("/socketOpen", {
    method: "POST",
    headers: { "Content-Type": "application/text", },
    body: (data),
  })
  let json = await response.text()
  document.querySelector('.socketInfo').innerHTML = "Socket " + json.slice(1,-1) + "!"
}

intervalSocketSend = window.setInterval(function () { socketSend() }, 2000)
