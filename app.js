// Connect to MQTT broker (example: Mosquitto public broker with WebSocket)
const client = mqtt.connect('wss://test.mosquitto.org:8081');

// Subscribe to connection events
client.on('connect', () => {
  console.log('Connected to MQTT broker');
  if (typeof updateConnectionStatus === 'function') {
    updateConnectionStatus(true);
  }
});

client.on('disconnect', () => {
  console.log('Disconnected from MQTT broker');
  if (typeof updateConnectionStatus === 'function') {
    updateConnectionStatus(false);
  }
});

// Handle errors
client.on('error', (err) => {
  console.error('Connection error: ', err);
  if (typeof updateConnectionStatus === 'function') {
    updateConnectionStatus(false);
  }
  client.end();
});

// Publish command to topic
function sendCommand(command) {
  const topic = 'esp32/car/command';
  console.log('Sending command:', command);
  
  // Visual feedback
  const commandMap = {
    'forward': '🔼',
    'backward': '🔽', 
    'left': '◀️',
    'right': '▶️',
    'stop': '⏹️'
  };
  
  console.log(`${commandMap[command] || '🚗'} Command: ${command}`);
  
  // Publish to MQTT
  if (client && client.connected) {
    client.publish(topic, command);
  } else {
    console.warn('MQTT client not connected');
    if (typeof updateConnectionStatus === 'function') {
      updateConnectionStatus(false);
    }
  }
}

// Add keyboard support for desktop users
document.addEventListener('keydown', function(event) {
  // Prevent default behavior for arrow keys
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(event.code)) {
    event.preventDefault();
  }
  
  switch(event.code) {
    case 'ArrowUp':
    case 'KeyW':
      sendCommand('forward');
      document.getElementById('up').style.transform = 'translateY(1px) scale(0.95)';
      break;
    case 'ArrowDown':
    case 'KeyS':
      sendCommand('backward');
      document.getElementById('down').style.transform = 'translateY(1px) scale(0.95)';
      break;
    case 'ArrowLeft':
    case 'KeyA':
      sendCommand('left');
      document.getElementById('left').style.transform = 'translateY(1px) scale(0.95)';
      break;
    case 'ArrowRight':
    case 'KeyD':
      sendCommand('right');
      document.getElementById('right').style.transform = 'translateY(1px) scale(0.95)';
      break;
    case 'Space':
      sendCommand('stop');
      document.getElementById('stop').style.transform = 'translateY(1px) scale(0.95)';
      break;
  }
});

document.addEventListener('keyup', function(event) {
  // Reset button styles on key release
  const buttonMap = {
    'ArrowUp': 'up',
    'KeyW': 'up',
    'ArrowDown': 'down', 
    'KeyS': 'down',
    'ArrowLeft': 'left',
    'KeyA': 'left',
    'ArrowRight': 'right',
    'KeyD': 'right',
    'Space': 'stop'
  };
  
  const buttonId = buttonMap[event.code];
  if (buttonId) {
    document.getElementById(buttonId).style.transform = '';
  }
});
