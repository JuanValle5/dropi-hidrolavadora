# Conectar los pedidos de Aura con Google Sheets

## 1. Crear la hoja

Con tu cuenta de Aura, crea una hoja llamada **Pedidos Aura** en Google Sheets. Déjala privada; no la publiques ni habilites el acceso a cualquiera con el enlace. No necesitas crear columnas.

## 2. Instalar el receptor

1. Dentro de la hoja, abre **Extensiones → Apps Script**.
2. Sustituye el contenido de `Código.gs` por todo el contenido del archivo `Code.gs` de esta carpeta.
3. En `AJUSTES.origenes`, agrega el origen exacto de tu página cuando tengas el dominio: por ejemplo, `https://auratienda.com`. Si también usas `www`, agrega `https://www.auratienda.com`. Conserva las direcciones locales si usarás la vista previa. No agregues rutas ni barras finales.
4. Guarda el proyecto con el nombre **Pedidos Aura**.
5. En el selector de funciones, elige **prepararHoja** y pulsa **Ejecutar**. Autoriza el acceso a la hoja con tu cuenta. Esta función registra la hoja y crea la pestaña **Pedidos** con sus encabezados. No ejecutes `doPost` manualmente.

## 3. Publicar la aplicación web

1. Pulsa **Implementar → Nueva implementación**.
2. En el engranaje de tipo, selecciona **Aplicación web**.
3. En **Ejecutar como**, elige **Yo** (la cuenta propietaria).
4. En **Quién tiene acceso**, elige **Cualquier usuario** / **Cualquiera**, incluyendo visitantes sin cuenta de Google. No elijas “cualquier usuario con cuenta de Google”. Si tu cuenta de empresa no ofrece acceso anónimo, necesitarás una cuenta que lo permita o revisar la restricción con el administrador.
5. Pulsa **Implementar** y copia la URL de la aplicación web que termina en **/exec**. No uses la URL `/dev` ni la dirección del editor.

Esto permite recibir solicitudes públicas, pero no hace pública tu hoja. El receptor no ofrece un listado de los pedidos. La validación de origen y el token correlacionan la respuesta; no son autenticación contra bots. Para campañas de alto volumen conviene añadir protección contra abuso y vigilar las cuotas de Apps Script.

## 4. Conectar la página

Comparte en el chat **la URL /exec y el dominio donde irá la página**. No hacen falta contraseñas ni permisos para leer la hoja.

La URL se coloca en `CONFIG.endpoint` de `assets/js/main.js`. Si prefieres hacerlo tú, sustituye únicamente la cadena vacía `endpoint:''`.

## 5. Probar antes de recibir clientes

- Abre la página por HTTP local o HTTPS en el dominio, no desde `file://`.
- Envía un pedido identificado como PRUEBA con datos ficticios.
- Debe aparecer exactamente una fila en Pedidos y el modal de éxito en la página.
- Verifica referencia, combo, total, nombre, teléfono y dirección.
- Si falla la conexión, se conservan los datos y se muestra un error; nunca se confirma un guardado sin respuesta.
- Los reintentos con los mismos datos durante esa sesión mantienen la referencia y no generan otra fila. Recargar la página inicia una nueva sesión; si hubo una respuesta incierta, consulta la referencia antes de volver a pedir.

## Datos guardados

Referencia, fecha de Colombia, nombre, WhatsApp, departamento, municipio, dirección, combo, contenido, total, envío, recaudo, forma de pago y estado. Estado inicial: **Pendiente de contactar**; puedes actualizarlo manualmente. Mantén los encabezados y la columna Referencia en su posición.

## Cambios posteriores

Si modificas el código de Apps Script, usa **Implementar → Gestionar implementaciones → Editar → Nueva versión → Implementar**, conservando la URL. Guarda también los cambios en el archivo local `Code.gs`.

Cuando cambies precios, actualiza `CATALOGO` en Apps Script y los precios de la página. El servidor no confía en un total enviado por el navegador.

## Qué subes al hosting

Solo `index.html` y `assets/`. La carpeta `integraciones/` y el README son documentación y código para instalar en Google; no se necesitan en el sitio publicado.

Documentación oficial: https://developers.google.com/apps-script/guides/web

## Actualización: ventana flotante y descuento SALIDA10

Sustituye el código del editor por el `Code.gs` actualizado. Luego ve a Implementar → Gestionar implementaciones → Editar (lápiz) → Nueva versión → Implementar. Conserva la URL existente. No necesitas volver a crear columnas ni borrar pedidos.

Solo se ofrecen Doble Batería (119.900 COP) y Dúo Familiar (199.900 COP). La promoción SALIDA10 descuenta el 10 % y redondea hacia abajo a la centena: 107.900 COP y 179.900 COP respectivamente. El receptor calcula el precio y guarda la descripción del descuento en Contenido; Total COP guarda el importe final. Las columnas anteriores se conservan.

La aplicación comprueba la versión 4 del receptor antes de enviar datos personales. Mientras siga activa la versión antigua, no crea pedidos ni muestra una confirmación falsa. La comprobación de compatibilidad no guarda una fila.

La oferta se muestra una sola vez por sesión de página al intentar cerrar el formulario con datos. Puede rechazarse; no bloquea la salida ni intercepta el cierre de la pestaña. Tras aceptarla, se aplica también al cambiar de kit. No se acumula.

## Cambiar de cuenta de Google

1. Inicia sesión con la nueva cuenta y crea una hoja privada llamada Pedidos Aura. Los pedidos anteriores se quedan en la hoja anterior; no se trasladan automáticamente.
2. Desde la nueva hoja, abre Extensiones → Apps Script. Pega el `Code.gs` actualizado de esta carpeta.
3. Guarda y ejecuta `prepararHoja`. Autoriza con la nueva cuenta. No ejecutes `doPost` manualmente.
4. Implementa una nueva Aplicación web: ejecutar como Yo (nueva cuenta), acceso Cualquier usuario, incluidos visitantes sin cuenta de Google.
5. Copia la URL terminada en `/exec` y compártela en el chat para sustituir `CONFIG.endpoint`. La hoja puede permanecer privada.
6. Realiza un pedido ficticio, confirma la fila en la nueva hoja y comprueba el mensaje de éxito. No necesitas modificar el correo de soporte de la tienda para cambiar el propietario de la hoja.

Los orígenes locales ya están incluidos. El receptor versión 4 usa 119.900 COP para una unidad y 199.900 COP para dos; con SALIDA10 redondeado: 107.900 y 179.900 COP. No requiere nuevos encabezados.

## Dominio de producción configurado

Sitio: https://auratienda-hidrolavadora.pages.dev/

La nueva URL de Apps Script está configurada en `assets/js/main.js`. La comprobación de compatibilidad respondió correctamente en local y en producción (versión 4), sin crear pedidos. El dominio publicado ya está habilitado.

Para habilitarlo, reemplaza el código del editor por este `Code.gs`, que ya incluye `https://auratienda-hidrolavadora.pages.dev` en `AJUSTES.origenes`. Guarda y usa Implementar → Gestionar implementaciones → Editar → Nueva versión → Implementar. Conserva la URL. No necesitas ejecutar de nuevo prepararHoja ni cambiar los encabezados. Después publica los archivos actualizados de la página y prueba un pedido desde el dominio.
