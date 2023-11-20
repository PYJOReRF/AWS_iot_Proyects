//----------------------------SERVER WEBSOCKET---------------
//import WebSocket from 'ws';
//import http from 'http';

//const server = http.createServer();
//const wss = new WebSocket.Server({ server });

//wss.on('connection', (socket) => {
//  console.log('nueva conexion');

  // Escucha mensajes desde el cliente
//  socket.on('message', (message) => {
//    console.log(`recibido: ${message}`);
//  });
//});

//const port = 3000;

//server.listen(port, () => {
//  console.log(`Servidor WebSocket escuchando en ws://:${port}`);
//});
//----------------------------SERVER HTTP---------------------//
import http from 'http';
import WebSocket from 'ws';

// Crear un servidor HTTP
const servidor = http.createServer((req, res) => {
  // Obtener la dirección IP del cliente conectado
  const clienteDireccionIP = req.connection.remoteAddress;
  // Crear el servidor WebSocket
  const servidorWebSocket = new WebSocket.Server({ servidor });
  // Leer los datos recibidos desde la solicitud (cualquier tipo de dato)
  let data = '';

  req.on('data', (chunk) => {
    data += chunk;
  });

  req.on('end', () => {
    try {
      // Analizar los datos como JSON
      const jsonData = JSON.parse(data);

      // Verificar si el campo "data" existe en el JSON
      if (jsonData.hasOwnProperty('data')) {
        // Convertir solo el campo "data" a Buffer y luego a cadena hexadecimal
        const dataBase64 = jsonData.data;
        const dataBuffer = Buffer.from(dataBase64, 'base64');
        const dataHex = dataBuffer.toString('hex');

        // Modificar el objeto JSON con la conversión a hexadecimal
        jsonData.data = dataHex;
        // Manejar conexiones WebSocket
	servidorWebSocket.on('connection', (socket) => {
 	 // Enviar el jsonData cuando se establece una nueva conexión WebSocket
 	  console.log('nueva conexion');
          socket.send(JSON.stringify(jsonData));
	});
        // Imprimir el JSON completo con el campo "data" convertido a hexadecimal
        console.log(`Datos recibidos desde ${clienteDireccionIP} con "data" en hexadecimal:`);
        console.log(jsonData);
      } else {
        console.warn(`El campo "data" no está presente en los datos recibidos desde ${clienteDireccionIP}.`);
      }
    } catch (error) {
      console.error(`Error en recepción desde ${clienteDireccionIP}: ${error.message}`);
    }
  });

  req.on('error', (error) => {
    // En caso de error en la solicitud
    console.error(`Error en la solicitud desde ${clienteDireccionIP}: ${error.message}`);
  });
});

// Especificar el puerto en el que se escuchará el servidor
const puerto = 3006;
const puertoWebSocket = 3000;
const direccionIP = '172.16.22.245';

// Iniciar el servidor y escuchar en la dirección IP y puerto especificados
servidor.listen(puerto, direccionIP, () => {
  console.log(`Servidor escuchando en http://${direccionIP}:${puerto}/`);
  console.log(`Servidor WebSocket INICIADO:  ws://localhost:${puertoWebSocket}/`);
});

        
