document.getElementById("selectTelescopePort").addEventListener("mousedown", function () {
    document.getElementById('selectTelescopePort').options.length = 0;
    serialPorts(document.querySelector('#selectTelescopePort'))
})

document.getElementById("selectFocuserPort").addEventListener("mousedown", function () {
    document.getElementById('selectFocuserPort').options.length = 0;
    serialPorts(document.querySelector('#selectFocuserPort'))
})

document.getElementById("buttonTelescopeConnect").addEventListener("mousedown", function () {
    let e = document.getElementById("selectTelescopePort");
    let data = e.options[e.selectedIndex].text;
    if(data)
      openComPort(data)
})

document.getElementById("buttonFocuserConnect").addEventListener("mousedown", function () {
    let e = document.getElementById("selectFocuserPort");
    let data = e.options[e.selectedIndex].text;
    if(data)
      openFocuserComPort(data)
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

async function openFocuserComPort(data) {
    let response = await fetch("/serialFocuserOpen", {
      method: "POST",
      headers: { "Content-Type": "application/text", },
      body: JSON.stringify(data),
    })
    let json = await response.text()
    document.querySelector('#comPortInfoFocuser').innerHTML = json.slice(1,-1)
}

document.getElementById("buttonTelescopeDisconnect").addEventListener("mousedown", function () {
    let e = document.getElementById("selectTelescopePort");
    let data = e.options[e.selectedIndex].text;
    if(data)
      closeComPort(data)
})

document.getElementById("buttonFocuserDisconnect").addEventListener("mousedown", function () {
    let e = document.getElementById("selectFocuserPort");
    let data = e.options[e.selectedIndex].text;
    if(data)
      closeComPortFocuser(data)
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

async function closeComPortFocuser(data) {
    let response = await fetch("/serialFocuserClose", {
      method: "POST",
      headers: { "Content-Type": "application/text", },
      body: JSON.stringify(data),
    })
    let json = await response.text()
    document.querySelector('#comPortInfoFocuser').innerHTML = json.slice(1,-1)
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

async function serialPorts(option) {
  let response = await fetch("/serialPorts")
  let responseStatus = response.ok
  //let responseOpen = await fetch("/serialOpen")
  if (responseStatus) {
    let json = await response.text()
    json = json.slice(2,-2)
    //let selectTag = document.querySelector('#selectTelescopePort');
    let selectTag = option;
    //let selectTagFocuser = document.querySelector('#selectFocuserPort');

    langArray = json.split('","')
    langArray.map( (lang, i) => {
        let opt = document.createElement("option");
        opt.value = i + 1;
        opt.innerHTML = lang;
        selectTag.append(opt);

        //opt = document.createElement("option");
        //opt.value = i + 1;
        //opt.innerHTML = lang;
        //selectTagFocuser.append(opt);
    });

  }
  return Promise
}

function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const remainingSecondsAfterHours = totalSeconds % 3600;
    const minutes = Math.floor(remainingSecondsAfterHours / 60);
    const seconds = remainingSecondsAfterHours % 60;
    function padZero(num) {
        return num < 10 ? '0' + num : num;
    }
    return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
}

async function comPortConnect() {
  if(document.querySelector('#comPortInfo').innerHTML.slice(-4) == "open"){
    let result = await serialRead()
    resultJson = JSON.parse(result)

    if(resultJson){
      side = document.querySelector('input[name="inlineRadioOptions"]:checked').value
      haCurrent = resultJson.ha
      decCurrent = resultJson.dec
      if(side == "East"){
        haCurrent += 43200
        decCurrent = decCurrent - 648000
      }
      if(haCurrent >= 0){
        document.querySelector('.telescopCurrentHa').innerHTML = formatTime(haCurrent)  
      }else{
        document.querySelector('.telescopCurrentHa').innerHTML = formatTime(haCurrent + 86400)
      }
      
      if(decCurrent >= 0){
        document.querySelector('.telescopCurrentDec').innerHTML = formatTime(decCurrent)
      }else{
        document.querySelector('.telescopCurrentDec').innerHTML = "-" + formatTime(-decCurrent)
      }

      document.querySelector('.telescopCurrentCoordinates').innerHTML = "Current HA/Dec: " + document.querySelector('.telescopCurrentHa').innerHTML + "/" + document.querySelector('.telescopCurrentDec').innerHTML

      document.querySelector('.telescopStatus').innerHTML = resultJson.status 
    }
    
    /*if(resultJson.dec){
      document.querySelector('.telescopCurrentDec').innerHTML = resultJson.dec
    }*/

    if(result !== "null" && result !== "0")
      document.querySelector('#telescopeComPortInfoLog').innerHTML = result + "<br>" + document.querySelector('#telescopeComPortInfoLog').innerHTML 

  }
  
}

intervalComPort = window.setInterval(function () { comPortConnect() }, 100)