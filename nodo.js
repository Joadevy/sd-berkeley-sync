import net from 'node:net';
import { puertoMaestro } from './constantes';

const obtenerDesfasajeRandomEntre = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const tiempoNodo = Date.now() + obtenerDesfasajeRandomEntre(-500, 500);
const nodo = new net.Socket();
nodo.connect(puertoMaestro, 'localhost', () => {
  console.log('Conectado al nodo maestro');

  // Cada 5 segundos hace una peticion al nodo maestro para ajustarse
  setInterval(() => {
    nodo.write(JSON.stringify({ id: crypto.randomUUID(), tiempo: tiempoNodo }));
  }, 5000);
  
  nodo.on('data', (data) => {
    const msgNodoMaestro = JSON.parse(data.toString());

    // Si recibe un ajuste, lo aplica
    if (msgNodoMaestro.ajuste) {
      const tiempoPrevioLegible = new Date(tiempoNodo).toLocaleString();
      tiempoNodo += msgNodoMaestro.ajuste;
      const tiempoAjustadoLegible = new Date(tiempoNodo).toLocaleString();
      console.log(`Ajuste recibido: ${msgNodoMaestro.ajuste}. Antes el tiempo era ${tiempoPrevioLegible} y ahora el tiempo es ${tiempoAjustadoLegible}`);
    }
  });

  nodo.on('end', () => {
    console.log('Desconectado del nodo maestro');
  });
});