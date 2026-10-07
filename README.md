# Aura Tienda en linea

Landing de hidrolavadora con pago contra entrega. HTML, CSS y JavaScript sin compilación ni dependencias instalables.

## Estructura

- `index.html`: contenido y estructura de la página.
- `assets/css/styles.css`: estilos, adaptación móvil y animación del botón.
- `assets/js/main.js`: galería, combos, validaciones, municipios y configuración comercial.
- `assets/images/`: las 18 imágenes utilizadas, incluidas las portadas de video.
- `assets/videos/`: los 3 videos utilizados.

## Vista local

Abre `index.html` en un navegador para revisar el diseño. Para probar mediante HTTP, ejecuta desde esta carpeta:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Visita http://127.0.0.1:8080/.

## Publicación

Sube `index.html` y la carpeta `assets` completa a la raíz pública del hosting asociado al dominio. Mantén las carpetas y nombres; activa HTTPS. No es necesario subir este README.

## Pedidos y contacto

- Los pedidos se guardarán en Google Sheets mediante Apps Script.
- Instalación: [instrucciones de Google Sheets](integraciones/google-sheets/INSTALACION.md).
- Receptor: `integraciones/google-sheets/Code.gs` (se instala en Google, no en el hosting).
- URL `/exec` configurada en `CONFIG.endpoint`, en `assets/js/main.js`, para pruebas locales. Antes de publicar, agregar el dominio a `AJUSTES.origenes` en Apps Script y desplegar una nueva versión.
- El modal de éxito solo se muestra después de recibir confirmación de guardado.
- Correo de soporte: soporteauratienda@gmail.com. WhatsApp: +57 316 095 8557.
- Prueba local realizada: Apps Script confirmó el guardado y la página mostró el modal de éxito. Pedido ficticio: PRUEBA AURA — NO DESPACHAR, referencia AURA-4f47b4aab3b17d66f7db5d47701e4fff. Al cambiar de dominio, repetir la prueba.

## Edición

Marca y contactos: `CONFIG` en `assets/js/main.js` y contenido de `index.html`.

Precios: actualiza las tarjetas y el resumen inicial en el HTML y el objeto `COMBOS` en JavaScript, además de `CATALOGO` en Apps Script (el servidor determina el precio).

Imágenes y videos: sustituye los archivos conservando sus nombres, o actualiza sus rutas en el HTML y en la galería de JavaScript. Las rutas de la galería se resuelven desde `index.html`.

## Checkout flotante y oferta de salida

Los botones de compra abren una ventana con los dos kits, los datos de envío y el resumen. Al intentar cerrarla después de iniciar el formulario, se ofrece una vez un 10 % de descuento opcional. Se mantienen los datos y se permite salir sin aceptar.

**Pendiente:** actualizar la implementación de Apps Script con `integraciones/google-sheets/Code.gs` (versión 3) para aceptar la nueva promoción. La página comprueba compatibilidad antes de enviar el pedido. Doble Batería: 125.900 COP con promoción; Dúo Familiar: 179.900 COP. La prueba del receptor anterior no valida esta nueva versión.

## Mensajes comerciales

Los textos de stock (85 % vendido), opción más vendida, despacho inmediato y pago por QR fueron suministrados por la tienda. El indicador de stock es manual, no está conectado al inventario ni cambia por tiempo o visitas: actualizar texto y `value` en `index.html` cuando cambie el lote. Mantener estas afirmaciones alineadas con ventas, disponibilidad y acuerdos de recaudo de la tienda.

El recuadro de $150.000 incluye un ejemplo de 5 lavadas de $30.000 y aclara los factores que determinan el ahorro real. Los sellos de transportadoras usan sus nombres, no logotipos de certificación.
