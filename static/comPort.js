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

async function openComPort(data) {
    let response = await fetch("/serialOpen", {
      method: "POST",
      headers: { "Content-Type": "application/text", },
      body: JSON.stringify(data),
    })
    let json = await response.text()
    console.log(json.slice(1,-1))
}

function serialWrite(data) {
  let response = fetch("/serialWrite", {
    method: "POST",
    headers: { "Content-Type": "application/text", },
    body: JSON.stringify(data),
  })
}

async function serialPorts() {
  let response = await fetch("/serialPorts")
  //let responseOpen = await fetch("/serialOpen")
  if (response.ok) {
    let json = await response.text()
    json = json.slice(2,-2)
    let selectTag = document.querySelector('#selectTelescopePort');
    langArray = json.split('","')
    langArray.map( (lang, i) => {
        let opt = document.createElement("option");
        opt.value = i;
        opt.innerHTML = lang;
        selectTag.append(opt);
    });
  }
  return Promise
}