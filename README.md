# CareKK

<p align="center">
  <img src="https://raw.githubusercontent.com/dcaceresm/carekk/master/carekk-app/public/images/cacu.png">
</p>

Inspirado en el juego universitario favorito de los niños de [31 Minutos](https://es.wikipedia.org/wiki/31_minutos), llega **CareKK**, una versión online de este juego para disfrutar con toda la familia (Edad Recomendada: 0-99 Años).

Disponible en [(Pronto...)](https://###)

Este proyecto es de código abierto (*MIT license*) por lo que puede ser utilizado por cualquier persona bajo los límites de esta licencia.

## Cómo Aportar:
- Enviando un correo a `dignaciocaceres AT gmail com` con el asunto `CareKK`; sobre todo si has jugado alguna variante distinta de las reglas dispuestas más abajo. 
- Generar un *pull-request* del repositorio o reportando un issue, **sobre todo** si optimiza/mejora la jugabilidad y reduce la carga en los sockets.
- Aportes gráficos, diseños de interfaces, etc. serán bien recibidos.
- Ayuda con el Hosting / Deployment


## Features Implementadas

### Funcionalidad Básica:
    - Se puede crear una **mesa de juego**. Se asigna un número de mesa al azar
    - Se puede ingresar a una **mesa**.
    - El creador de la mesa puede iniciar el juego.
    - Se pueden jugar cartas. Se respetan las reglas básicas tickeadas más abajo. *(eventualmente todas)*

### Falta:
    - Poder ganar (ó perder jaja)
    - 3 Cartas ocultas y 3 Cartas Visibles (las que se juegan cuando se acaban las cartas del mazo y las de tu mano).





## Features Planeadas

### Funcionalidad Básica:
    - Se pueden crear **salas de juego** y entrar a las mismas a jugar.
    - Juego básico
    

### Reglas Básicas:
- El **2** es comodín.
- El **3** copia la última carta lanzada.
- El **7** obliga al jugador a lanzar una carta menor o igual a 7.
- El **10** ***quema*** las cartas:
    - Primera Variante: Se puede jugar siempre.
    - Segunda Variante: Se puede jugar *ssi* la carta en la pila es menor o igual a 10.
- El **J** invierte el sentido del juego:
    - Primera Variante: Cada **J** jugada provoca una inversión del sentido.
    - Segunda Variante: El *Stack* de **J** jugado provoca una única inversión del sentido del juego.
- El **As** es la carta más alta.
- El **Joker** provoca que el jugador siguiente se lleve la pila de cartas en juego.

### Características Avanzadas:
- Lanzar varias cartas iguales (**Stack**) en una sola jugada (por ejemplo, 2 **sietes** al mismo tiempo.)
- Escoger Reglas y variantes antes de comenzar cada juego.
- Escoger la posibilidad de jugar sin Jokers
- Cálculo de cartas en función del número de jugadores de una partida.
- Posibilidad de espectar un juego.
- Variante **Relámpago** ⚡


## Extras
- 🌎 Traducir el juego a otros idiomas. 
- 📱 Responsiveness 

