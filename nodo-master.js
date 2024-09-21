import net from 'node:net';
import { puertoMaestro, cantidadNodos } from './constantes';
let tiempoNodos = new Map(); // Contiene el tiempo recibido de cada nodo en forto {id => {tiempo, socket}}

let tiempoNodoCentral = Date.now();

const nodoMaestro = net.createServer((socket) => {
  console.log('Nodo conectado:', socket.remoteAddress);

  socket.on('data', (data) => {
    const msg = JSON.parse(data.toString());
    console.log(`Tiempo recibido de nodo ${msg.id}: ${msg.tiempo}`);

    // Guarda el tiempo recibido y el socket del nodo
    tiempoNodos.set(msg.id, { tiempo: msg.tiempo, socket: socket || tiempoNodos.get(msg.id)?.socket });

    // Si se han recibido tiempos de todos los nodos
    if (tiempoNodos.size === cantidadNodos) {
      const tiempoNodoMaestro = Date.now();
      const promedioTiempo = calculaTiempoPromedio(tiempoNodos, tiempoNodoMaestro);

      // Calcula los ajustes y se lo envia a cada nodo
      tiempoNodos.forEach((nodo) => {
        const ajuste = promedioTiempo - nodo.tiempo;
        nodo.socket.write(JSON.stringify({ ajuste }));
      });

      // Resetea el map de tiempos para la proxima iteracion
      tiempoNodos = new Map();
    }
  });

  socket.on('end', () => {
    console.log('Nodo desconectado:', socket.remoteAddress);
    tiempoNodos = new Map([...tiempoNodos].filter(([id, nodo]) => nodo.socket !== socket));
  });
});

function calculaTiempoPromedio(tiempoNodos, tiempoNodoMaestro) {
  const totalNodos = tiempoNodos.size + 1; // Incluyendo al nodo master
  let totalTiempo = tiempoNodoMaestro;
  for (const nodo of tiempoNodos.values()) {  
    totalTiempo += nodo.tiempo;
  }
  return totalTiempo / totalNodos;
}

nodoMaestro.listen(puertoMaestro, () => {
  console.log(`Nodo maestro ejecutándose en el puerto ${puertoMaestro}`);
});

function actualizarRelojCentral(){
  tiempoNodoCentral = Date.now();
}

// Actualiza el reloj central cada 100ms
setInterval(actualizarRelojCentral, 100);