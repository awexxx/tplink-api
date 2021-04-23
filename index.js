const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const { Client } = require('tplink-smarthome-api');
const app = express();
app.use(cors());

// Error Handler
process.on('uncaughtException', (error)  => {
    console.log('Something unexpected happened: ',  error);
})

// GUI
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

// On endpoint
app.get('/on', (req, res) => {

    const client = new Client();

    client.getDevice({ host: 'tp-link-internal-ip' }).then((device) => {
        
        // Uncomment this to get info about the device
      // device.getSysInfo().then(console.log);

      device.setPowerState(true);
    });

    res.send(JSON.stringify({"status": "ON", "message": "It's on!"}))
})

app.get('/off', (req, res) => {
    const client = new Client();

    client.getDevice({ host: 'tp-link-internal-ip' }).then((device) => {

        // Uncomment this to get info about the device
      // device.getSysInfo().then(console.log);

      device.setPowerState(false);
      return res.send(JSON.stringify({"status": "OFF", "message": "The light is now off!"}))
    });
});

app.get('/status', (req, res) => {
    const client = new Client();

    client.getDevice({ host: 'tp-link-internal-ip' }).then((device) => {
        device.getPowerState().then((power) => {
            console.log('The current power state is:', power)
            res.send(JSON.stringify({"status": power, "message": "true = On, false = Off"}))
        });

    });
});

// Spin up a simple Express HTTP server
const httpServer = http.createServer(app);

// Log Enable
httpServer.listen(8080, () => {
    console.log('TP-Link API running on port localhost:8080!\nMade with <3 by Awex');
});