/*document.getElementById("buttonSocketSend").addEventListener("mousedown", function () {
    socketWrite('e') //e  r2065E15D,00000000
})*/

document.getElementById("buttonSocketGoTo").addEventListener("mousedown", function () {
    socketWrite('r2065E15D,00000000#')
})

document.getElementById("buttonSocketStop").addEventListener("mousedown", function () {
    socketWrite('M#')
})


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

function socketWrite(data) {
  let response = fetch("/socketWrite", {
    method: "POST",
    headers: { "Content-Type": "application/text", },
    body: (data),
  })
  socketRead()
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
