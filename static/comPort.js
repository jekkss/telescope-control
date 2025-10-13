document.getElementById("selectTelescopePort").addEventListener("mousedown", function () {
    document.getElementById('selectTelescopePort').options.length = 0;
    serialPorts()
})

document.getElementById("selectFocuserPort").addEventListener("mousedown", function () {
    document.getElementById('selectFocuserPort').options.length = 0;
    serialPorts()
})

document.getElementById("buttonTelescopeConnect").addEventListener("mousedown", function () {
    let e = document.getElementById("selectTelescopePort");
    let data = e.options[e.selectedIndex].text;
    if(data)
      openComPort(data)
})

async function openComPort(data) {
    let response = await fetch("/serialTelescopeOpen", {
      method: "POST",
      headers: { "Content-Type": "application/text", },
      body: JSON.stringify(data),
    })
    let json = await response.text()
    document.querySelector('#comPortInfo').innerHTML = json.slice(1,-1)
}

document.getElementById("buttonTelescopeDisconnect").addEventListener("mousedown", function () {
    let e = document.getElementById("selectTelescopePort");
    let data = e.options[e.selectedIndex].text;
    if(data)
      closeComPort(data)
})

async function closeComPort(data) {
    let response = await fetch("/serialTelescopeClose", {
      method: "POST",
      headers: { "Content-Type": "application/text", },
      body: JSON.stringify(data),
    })
    let json = await response.text()
    document.querySelector('#comPortInfo').innerHTML = json.slice(1,-1)
}

function serialWrite(data) {
  let response = fetch("/serialTelescopeWrite", {
    method: "POST",
    headers: { "Content-Type": "application/text", },
    body: JSON.stringify(data),
  })
}

async function serialRead() {
  let response = await fetch("/serialTelescopeRead")
  //let responseOpen = await fetch("/serialOpen")

  return response.text()
}

async function serialPorts() {
  let response = await fetch("/serialPorts")
  let responseStatus = response.ok
  //let responseOpen = await fetch("/serialOpen")
  if (responseStatus) {
    let json = await response.text()
    json = json.slice(2,-2)
    let selectTag = document.querySelector('#selectTelescopePort');
    let selectTagFocuser = document.querySelector('#selectFocuserPort');

    langArray = json.split('","')
    langArray.map( (lang, i) => {
        let opt = document.createElement("option");
        opt.value = i + 1;
        opt.innerHTML = lang;
        selectTag.append(opt);

        opt = document.createElement("option");
        opt.value = i + 1;
        opt.innerHTML = lang;
        selectTagFocuser.append(opt);
    });

  }
  return Promise
}

async function comPortConnect() {
  let result = await serialRead()
  resultJson = JSON.parse(result)

  if(resultJson.ha){
    document.querySelector('.telescopCurrentHa').innerHTML = resultJson.ha   
  }
  
  if(resultJson.dec){
    document.querySelector('.telescopCurrentDec').innerHTML = resultJson.dec
  }

  if(result !== "null" && result !== "0")
    document.querySelector('#telescopeComPortInfoLog').innerHTML = result + "<br>" + document.querySelector('#telescopeComPortInfoLog').innerHTML 
  //console.log(await serialRead())
}

intervalComPort = window.setInterval(function () { comPortConnect() }, 100)