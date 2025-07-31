// Connect to MQTT broker (example: Mosquitto public broker with WebSocket)
const client = mqtt.connect('wss://test.mosquitto.org:8081');

// Subscribe to connection events
client.on('connect', () => {
  console.log('Connected to MQTT broker');
});

// Handle errors
client.on('error', (err) => {
  console.error('Connection error: ', err);
  client.end();
});

// Publish command to topic
function sendCommand(command) {
  const topic = 'esp32/car/command';
  console.log('Sending command:', command);
  client.publish(topic, command);
}
