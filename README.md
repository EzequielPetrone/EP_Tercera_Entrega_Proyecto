# Backend - Segunda Entrega Parcial Proyecto - EZEQUIEL PETRONE

(Al final de este doc hay ejemplos de los body que acepta cada endpoint)

Gracias tanto a los comentarios del código como a los errores que devuelve cada endpoint es fácil entender el funcionamiento, de todos modos algunas notas:

## Tercera Entrega:

- Todas las vistas de la web son proporcionadas por el back.
Pero el front maneja el render de los elementos dinámicos y todo lo que es interacción con el usuario.

- Al momento del SIGNUP, para la imagen avatar del user (por ahora) pide ingresar la url de alguna imagen ya hosteada.

Pendiente: implementar multer para qué el user pueda adjuntar un file y se guarde en public.

- Si tuviese la posibilidad de dedicarle más tiempo, estaría bueno permitirle al user modificar sus datos personales...

- Todo lo relacionado con la configuración de Pssport Local está en /src/auth/auth.js

- Cuando un nuevo user se loguea, se crea automáticamente un carrito abierto asociado a dicho user.
(Si un user se loguea y por algún motivo no cuenta con un carrito abierto asociado a su cuenta se le crea también...)

- Obviamente el contendido del carrito de un user persiste, por ende al desloguearse y volverse a loguear no lo pierde.
(Si bien no hace falta en este proyecto, en paralelo debería haber una rutina que elimine los carritos con X tiempo de antigüedad)

- Dado que yo no quería que esté expuesto en el front datos como el id de los carritos, lo que hice fue darle a los endpoints de api/carritos la inteligencia suficiente para reconocer al user authenticado y devolver la data de su carrito correspondiente.

- Decidí manejar el ABM del maestro de productos por fuera de la web.
(Con Postman por ejemplo. En caso que sea necesario se lo puedo incorporar)

- Si tuviese la posibilidad de dedicarle más tiempo, estaría bueno agregarle filtros al store de productos del home.
(Hoy muestro todos)

- Actualmente el sistema modifica el stock del maestro de productos cuando un user agrega / elimina productos a su carrito.
Así lo tengo desde la primer entrega del proyecto porque entendí que es lo que pedía la descripción de la API rest.

Mi duda es si así está bien o en realidad la baja del stock debe hacerse al momento del checkout.
Aunque, si lo hago al momento del checkout, corro el riesgo de que en ese momento salte que no hay stock para cierto pedido.
En fin, me gustaría saber qué conviene en un e-commerce real...

Pendiente: limitar la qty de unidades que un user puede agregar de un producto para evitar quiebres de stock sin comprar...

- Al momento del checkout lo que hago es "cerrar" el carrito en cuestión y "abrir" un nuevo carrito vacío.
(En realidad ese cierre de carrito debería crear otra entidad llamada PEDIDO o algo por el estilo dentro de la BD)

- Obviamente hay validaciones que no permiten hacer el checkout de un carrito vacío.

- Actualmente el monto total que muestra el carrito lo calcula con el precio de los productos al momento que fue agregado al mismo.
(Está hecho así porque la descripción de la API de los entregables anteriores pedía que guardemos TODOS los datos del producto dentro del array del carrito)

Si yo haría el diseño, sólo guardaría SKU y qty en el carrito, y todo lo relacionado con el precio lo calcularía en tiempo real obteniendolo del maestro de productos!

- Mails que el sistema envía:

A) Al admin informando Nuevo registro con datos del new user.

B) Al admin (bcc) y al mail registrado del user (to) con el checkout de su carrito

(Tener en cuenta que estoy usando ethereal por ende logueo la URL de visualización de los mails en cuestión pero en realidad no se envían)

Pendiente: mejorar el HTML enviado. Actualmente estoy mandando un json así nomás en texto plano.

- Mensajes de WhatsApp que el sistema envía:

A) Al admin y al mail registrado del user con el checkout de su carrito

(Tener en cuenta que el trial de Twilio sólo te permite enviar a números de telefóno previamente registrados...)

Pendiente: mejorar el contenido enviado. Actualmente estoy mandando un json así nomás en texto plano.

- El mail y el nro de teléfono del ADMIN del site están configurados en /src/config/config.js

- El AuthToken de Twilio está en el .env - Antes de correr la app en forma local, editarlo! de ahí o en /src/config/config.js
(Cuando lo subí a GitHub hardcodeado en el código me mandaron un mail informando que me lo revocaban jajaja)

- Cambié todos los console.log por mi logger Winston.

- Para levantar el server en modo CLUSTER pasarle -m CLUSTER por parámetro (o editarlo en /src/config/config.js)

- En la carpeta tests_artillery están los files con los resultados de ejecutar 1000 requests en modo FORK vs CLUSTER

Queda claro que en modo CLUSTER el ratio de qty de respuestas por segundo sube y la media del response time baja!

- TODO: deploy en heroku

## Primera Entrega:

-Reutilicé la clase Contenedor que había desarrollado en las primeras entregas ya que estaba bastante completa, es por eso que las clases que extiendan de la misma me quedaron tan simples.

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