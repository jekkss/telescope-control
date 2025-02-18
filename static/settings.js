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