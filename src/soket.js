import http from 'http';
import mqtt from 'mqtt';

// Configurar la conexión MQTT
const mqttOptions = {
  username: 'UG67',
  password: '5599lm',
};

const mqttClient = mqtt.connect('mqtt://172.16.22.245:1883', mqttOptions);

// Crear un servidor HTTP
const servidor = http.createServer((req, res) => {
  const clienteDireccionIP = req.connection.remoteAddress;
  let data = '';

  req.on('data', (chunk) => {
    data += chunk;
  });

  req.on('end', () => {
    try {
      const jsonData = JSON.parse(data);

      if (jsonData.hasOwnProperty('data')) {
        const dataBase64 = jsonData.data;
        const dataBuffer = Buffer.from(dataBase64, 'base64');
        const dataHex = dataBuffer.toString('hex');

        jsonData.data = dataHex;

        console.log(`Datos recibidos desde ${clienteDireccionIP} con "data" en hexadecimal:`);
        console.log(jsonData);

        // Enviar jsonData por MQTT al tópico 'gw/send'
        mqttClient.publish('gw/send', JSON.stringify(jsonData));
      } else {
        console.warn(`El campo "data" no está presente en los datos recibidos desde ${clienteDireccionIP}.`);
      }
    } catch (error) {
      console.error(`Error en recepción desde ${clienteDireccionIP}: ${error.message}`);
    }
  });

  req.on('error', (error) => {
    console.error(`Error en la solicitud desde ${clienteDireccionIP}: ${error.message}`);
  });
});

const puerto = 3006;
const direccionIP = '172.16.22.245';

servidor.listen(puerto, direccionIP, () => {
  console.log(`Servidor escuchando en http://${direccionIP}:${puerto}/`);
});
