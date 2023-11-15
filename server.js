const express = require('express');

const app = express();

app.get('/', (req, res) => res.send('Bienvendo a la prueba del servidor'))

app.listen(3000);
console.log('SERVIDOR INICIADO.. : PORT:3000')