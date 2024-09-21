import net from 'node:net';
import { puertoMaestro, cantidadNodos } from './constantes';
let tiempoNodos = []; // Contiene el tiempo recibido de cada nodo en forto {id, tiempo, socket}

const nodoMaestro = net.createServer((socket) => {
  console.log('Nodo conectado:', socket.remoteAddress);

  socket.on('data', (data) => {
    const msg = JSON.parse(data.toString());
    console.log(`Tiempo recibido de nodo ${msg.id}: ${msg.tiempo}`);

    tiempoNodos.push({ id: msg.id, tiempo: msg.tiempo, socket });

    // Si se han recibido tiempos de todos los nodos
    if (tiempoNodos.length === cantidadNodos) {
      const tiempoNodoMaestro = Date.now();
      const promedioTiempo = calculaTiempoPromedio(tiempoNodos, tiempoNodoMaestro);

      // Calcula los ajustes y se lo envia a cada nodo
      tiempoNodos.forEach((nodo) => {
        const ajuste = promedioTiempo - nodo.tiempo;
        nodo.socket.write(JSON.stringify({ ajuste }));
      });

      // Resetea el array de tiempos para la proxima iteracion
      tiempoNodos = [];
    }
  });

  socket.on('end', () => {
    console.log('Nodo desconectado:', socket.remoteAddress);
    tiempoNodos = tiempoNodos.filter(nodo => nodo.socket !== socket);
  });
});

function calculaTiempoPromedio(tiempoNodos, tiempoNodoMaestro) {
  const totalNodos = tiempoNodos.length + 1; // Incluyendo al nodo master
  const totalTiempo = tiempoNodos.reduce((acc, nodo) => acc + nodo.tiempo, tiempoNodoMaestro);
  return totalTiempo / totalNodos;
}

nodoMaestro.listen(puertoMaestro, () => {
  console.log(`Nodo maestro ejecutándose en el puerto ${puertoMaestro}`);
});