const WebSocket = require('ws');
const { updateDeliveryPersonLocation, getDeliveryPersonPosition } = require('./api_elective/controller/DeliveryController'); 

let wss = null;

function startWebSocketServer(server) {
  wss = new WebSocket.Server({ server });

  wss.on('connection', ws => {
    ws.on('message', async message => {
      let msg = JSON.parse(message);
      console.log('Received:', msg);

      if (msg.action === 'updateDeliveryPersonLocation') {
        try {
          await updateDeliveryPersonLocation(msg.deliveryPersonId, msg.latitude, msg.longitude);
          console.log('Location updated successfully');
        } catch (error) {
          console.error('An error occurred:', error);
        }
      } else if (msg.action === 'getDeliveryPersonPosition') {
        try {
          const position = await getDeliveryPersonPosition(msg.deliveryPersonId);
          ws.send(JSON.stringify({ action: 'deliveryPersonPosition', position: position }));
        } catch (error) {
          console.error('An error occurred:', error);
        }
      }
    });
  });
}

function broadcast(data) {
  if (wss) {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }
}

module.exports = { startWebSocketServer, broadcast };