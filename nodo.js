import net from 'node:net';
import { puertoMaestro } from './constantes';

const obtenerDesfasajeRandomEntre = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const desfasaje = obtenerDesfasajeRandomEntre(-500, 500);
let tiempoNodo = Date.now() + desfasaje;
const idNodo = crypto.randomUUID()

const nodo = new net.Socket();
let conexionActiva = false;

nodo.connect(puertoMaestro, 'localhost', () => {
  console.log('Conectado al nodo maestro');
  conexionActiva = true;

  const enviarHoraCada5Segundos = setInterval(() => {
      if (conexionActiva){
        // Cada 5 segundos hace una peticion al nodo maestro para ajustarse
          console.log(`Enviando tiempo al nodo maestro: ${tiempoNodo}`);
          nodo.write(JSON.stringify({ id: idNodo, tiempo: tiempoNodo }));
        }
      else clearInterval(enviarHoraCada5Segundos)
    }, 5000);
  
  nodo.on('data', (data) => {
    const msgNodoMaestro = JSON.parse(data.toString());

    // Si recibe un ajuste, lo aplica
    if (msgNodoMaestro.ajuste) {
      const tiempoPrevioLegible = new Date(tiempoNodo).toLocaleString();
      let tiempoAjustado = tiempoNodo + msgNodoMaestro.ajuste;
      const tiempoAjustadoLegible = new Date(tiempoAjustado).toLocaleString();
      console.log(`Ajuste recibido: ${msgNodoMaestro.ajuste}. Antes el tiempo era ${tiempoPrevioLegible} y ahora el tiempo es ${tiempoAjustadoLegible}`);
    }
  });

  nodo.on('error', (error) => {
    console.error('Error:', error);
    conexionActiva = false;
  });

  nodo.on('close', () => {
    console.log('Conexión cerrada');
    conexionActiva = false;

  });

  nodo.on('end', () => {
    console.log('Desconectado del nodo maestro');
    conexionActiva = false;
  });
});


function actualizarRelojNodo(){
  tiempoNodo = Date.now() + desfasaje;
}

// Actualiza el reloj cada 100ms
setInterval(actualizarRelojNodo, 100);