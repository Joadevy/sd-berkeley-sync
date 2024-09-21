![](https://res.cloudinary.com/dkjkgri6x/image/upload/v1726946006/Screenshot_2024-09-21_at_4.13.11_PM_lff1e6.png)

## Objetivo de la aplicación
Simular el algoritmo de sincronización de Berkeley utilizando sockets TCP en un modelo de nodo central estático.

## Introducción al Algoritmo de Berkeley
El algoritmo de Berkeley es un método de sincronización de relojes en sistemas distribuidos. Fue diseñado para ajustar los relojes de un grupo de computadoras de manera que todos los nodos tengan una hora coherente. En este algoritmo, un nodo central (coordinador) recopila los tiempos de todos los nodos, calcula el tiempo promedio y envía ajustes a cada nodo para sincronizar sus relojes con el tiempo promedio.

## Lógica de la Comunicación
Se cuenta con una arquitectura de nodo central estático donde un nodo maestro se comunica con varios nodos esclavos para sincronizar sus relojes utilizando el algoritmo de Berkeley. El nodo maestro recopila los tiempos de los nodos esclavos, calcula el tiempo promedio y envía ajustes a cada nodo para sincronizar sus relojes.

## Componentes

### Nodo Maestro
Encargado de gestionar la sincronización de los relojes de los nodos esclavos. Recibe los tiempos de los nodos esclavos, calcula el tiempo promedio y envía ajustes a cada nodo.

### Nodo Esclavo
Proceso que se conecta al nodo maestro y envía su tiempo actual. Recibe ajustes del nodo maestro para sincronizar su reloj.

## Cómo ejecutar
Está pensado para ejecutar directamente en la terminal usando Node.js o el equivalente en el entorno de ejecución de JavaScript de preferencia (se utilizó Bun particularmente). Se propone una "interactividad" en el nodo esclavo donde podrá enviar su tiempo actual al nodo maestro y recibir ajustes para sincronizar su reloj.

1. En la primera terminal, ejecuta el nodo central o maestro:
   ```bash
   node nodo-master.js
   ```

2. En la segunda terminal, ejecuta un nodo consumidor o esclavo. Esto puede repetirse tantas veces como nodos consumidores se quiera tener. Se debe considerar que se configuro el codigo, en el archivo constantes.js, para un minimo de 3 nodos consumidores para que el algoritmo comience a ejecutarse.
```bash
   node nodo.js
```
