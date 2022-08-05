# Backend - Segunda Entrega Parcial Proyecto - EZEQUIEL PETRONE

(Al final de este doc hay ejemplos de los body que acepta cada endpoint)

Gracias tanto a los comentarios del código como a los errores que devuelve cada endpoint es fácil entender el funcionamiento, de todos modos algunas notas:

## Tercera Entrega:

- Todas las vistas de la web son proporcionadas por el back.
Pero el front maneja el render de los elementos dinámicos y todo lo que es interacción con el usuario.

- Al momento del SIGNUP, para la imagen avatar del user por ahora pide ingresar una url de alguna imagen ya hosteada.

TODO: implementar multer para qué el user pueda adjuntar un file y se guarde en public.

- Si tuviese la posibilidad de dedicarle más tiempo, estaría bueno permitirle al user modificar sus datos personales...

- Cuando un nuevo user se loguea, se crea automáticamente un carrito abierto asociado a dicho user.
(Si un user se loguea y por algún motivo no cuenta con un carrito abierto asociado a su cuenta se le crea también...)

- Obviamente el contendido del carrito de un user persiste, por ende al desloguearse y volverse a loguear no lo pierde.
(Si bien no hace falta en este proyecto, en paralelo debería haber una rutina que elimine los carritos con X tiempo de antigüedad)

- Dado que yo no quería que esté expuesto en el front datos como el id de los carritos, lo que hice fue darle a los endpoints de api/carritos la inteligencia suficiente para reconocer al user authenticado y devolver la data de su carrito correspondiente.

- Decidí manejar el ABM del maestro de productos por fuera de la web.
(En caso que sea necesario se lo puedo incorporar)

- Actualmente el sistema modifica el stock del maestro de productos cuando un user agrega / elimina productos a su carrito.
Así lo tengo desde la primer entrega del proyecto porque entendí que es lo que pedía la descripción de la API rest.

Mi duda es si así está bien o en realidad la baja del stock debe hacerse al momento del checkout.
Aunque, si lo hago al momento del checkout, corro el riesgo de que en ese momento salte que no hay stock para cierto pedido.
En fin, me gustaría saber qué conviene en un e-commerce real...

TODO: limitar la qty de unidades que un user puede agregar de un producto para evitar quiebres de stock sin comprar...

TODO: cuando un producto se queda sin stock justo mientras lo estas agregando al carrito hoy el front muestra alert y hace un refresh del site. Debería ser más friendly / elegante...

- Al momento del checkout lo que hago es "cerrar" el carrito en cuestión y "abrir" un nuevo carrito vacío.
(En realidad ese cierre de carrito debería crear otra entidad llamada PEDIDO o algo por el estilo dentro de la BD)

- Actualmente el monto total que muestra el carrito lo calcula con el precio de los productos al momento que fue agregado al mismo.
(Está hecho así porque la descripción de la API de los entregables anteriores pedía que guardemos TODOS los datos del producto dentro del array del carrito)

Si yo haría el diseño, sólo guardaría SKU y qty en el carrito, y todo lo relacionado con el precio lo calcularía en tiempo real obteniendolo del maestro de productos!

- Mails que el sistema envía:

A) Al admin informando Nuevo registro con datos del new user.

B) Al admin (bcc) y al mail registrado del user (to) con el checkout de su carrito

(Tener en cuenta que estoy usando ethereal por ende logueo la URL de visualización de los mails en cuestión pero en realidad no se envían)

TODO: mejorar el HTML enviado. Actualmente estoy mandando un json así nomás en texto plano.

- Mensajes de WhatsApp que el sistema envía:

A) Al admin y al mail registrado del user con el checkout de su carrito

(Tener en cuenta que el trial de Twilio sólo te permite enviar a números de telefóno previamente registrados...)

TODO: mejorar el contenido enviado. Actualmente estoy mandando un json así nomás en texto plano.

- El mail y el nro de teléfono del ADMIN del site están configurados en /src/config/config.js

- El AuthToken de Twilio está en el .env - Antes de correr la app en forma local, editarlo! de ahí o en /src/config/config.js
(Cuando lo subí a GitHub hardcodeado en el código me mandaron un mail informando que me lo revocaban jajaja)

- Cambié todos los console.log por mi logger Winston.

- TODO: habilitar modo CLUSTER

- TODO: informe tests con artillery

- TODO: deploy en heroku

- DUDA: cómo era para que si un error me rompe la ejecución del server se autoreinicie solito?? había que asociarle a algo de node un listener on exit o algo así?

## Segunda Entrega:

-El .env no lo agregué al .gitignore sólo por una cuestión práctica a la hora de la corrección. Obviamente no debería subirse a git en realidad.

-En src/daos/daos.js se exportan los DAOS según lo especificado en el .env dónde se puede elegir si se quiere operar utilizando contenedores de archivo, de MongoDB o de Firebase.

-Para el seteo del contenedor Firebase me pareció más práctico que el contenido del json de auth sea directamente una variable de entorno y no tener que andar importando files externos. Aunque es un esquema que puede modificarse llegado el caso.

-Los json que devuelve cada router (API rest) siempre son iguales, independientemente del tipo de contenedor seleccionado.

-Me hubiese encantado tener tiempo para hacer el FrontEnd también. Hasta me parece más divertido testearlo así. Pero bueno me até a lo obligatorio y dejé de lado lo opcional por razones de fuerza mayor.


## Primera Entrega:

-La variable que maneja el boolean de ADMIN está en routerCarrito.js

-Reutilicé la clase Contenedor que había desarrollado en las primeras entregas ya que estaba bastante completa, es por eso que las clases que extiendan de la misma me quedaron tan simples.

-Se valida tanto al momento de dar de alta un producto como al editarlo que la estructura del req.body recibido sea la correcta.

-Cuando se quiere eliminar un producto del file, primero se valida que ese producto no esté en algún carrito. En dicho caso se solicita primero eliminarlo de cada carrito y luego eliminarlo del file de productos.

-Cuando se agrega un producto a un carrito sólo se necesita id del producto y qty deseada (esa qty es el stock del producto dentro del array productos del carrito). Si el producto no existe aún en dicho carrito lo agrega pero si ya existe suma la qty actual a la original.

-Cuando se agrega un producto a un carrito se descuenta la qty seleccionada del stock del producto en el file de productos. SE VALIDA QUE HAYA STOCK SUFICIENTE ANTES DE HACER DICHA OPERACIÓN.

-Cuando se elimina un producto de un carrito se devuelve la qty que poseía al stock del file de productos. Si se elimina un carrito entero, devuelve stock por cada uno de los productos incluídos.

# ejemplo body POST / PUT de productos (router productos)

{
    "nombre": "Remera Vintage",
    "descripcion": "Es una Remera Clasic Style",
    "codigo": "RV123",
    "thumbnail": "www.misimagenes.com/remeravintage",
    "precio": 1900,
    "stock": 50
}

# ejemplo body POST un producto dentro de un carrito (router carritos)

{
    "idProd": "18siW1imNGyOlkoa2vCq",
    "qty": 10
}