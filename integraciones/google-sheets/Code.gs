/** Aura Tienda: instalar desde Extensiones > Apps Script en una hoja privada. */
const AJUSTES = {
  pestana: 'Pedidos',
  // Agrega aquí el origen exacto de tu dominio (sin rutas ni barra final).
  origenes: ['http://127.0.0.1:8080', 'http://localhost:8080']
};
const CATALOGO = {
  doble: {nombre: 'Kit Doble Batería', contenido: '1 hidrolavadora + 2 baterías + kit', total: 139900},
  duo: {nombre: 'Dúo Familiar', contenido: '2 hidrolavadoras + 2 baterías + 2 kits', total: 199900}
};
const COLUMNAS = ['Referencia', 'Fecha Colombia', 'Nombre', 'WhatsApp', 'Departamento', 'Municipio', 'Dirección', 'Combo', 'Contenido', 'Total COP', 'Envío COP', 'Recaudo COP', 'Pago', 'Estado'];

// Ejecutar manualmente UNA VEZ desde el editor antes de implementar.
function prepararHoja() {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  if (!libro) throw new Error('Abre Apps Script desde la hoja de cálculo.');
  PropertiesService.getScriptProperties().setProperty('AURA_SHEET_ID', libro.getId());
  const hoja = libro.getSheetByName(AJUSTES.pestana) || libro.insertSheet(AJUSTES.pestana);
  if (hoja.getLastRow() === 0) {
    hoja.appendRow(COLUMNAS);
    hoja.getRange(1, 1, 1, COLUMNAS.length).setFontWeight('bold').setBackground('#d1fae5');
    hoja.setFrozenRows(1);
  } else if (hoja.getRange(1, 1, 1, COLUMNAS.length).getValues()[0].join('|') !== COLUMNAS.join('|')) {
    throw new Error('La pestaña Pedidos tiene otras columnas. Renómbrala y ejecuta de nuevo.');
  }
}  

function doGet() {
  return HtmlService.createHtmlOutput('Receptor de pedidos Aura. No muestra datos de clientes.');
}

function doPost(e) {
  const p = e && e.parameter || {};
  const origen = String(p.origen || '');
  const token = String(p.token || '');
  const referencia = String(p.referencia || '');
  const respuesta = {type: 'aura-order-result', token: token, referencia: referencia, ok: false};
  let lock;
  try {
    if (!AJUSTES.origenes.includes(origen)) throw new Error('Origen no habilitado.');
    if (!/^[a-f0-9]{32}$/.test(token) || !/^AURA-[a-f0-9]{32}$/.test(referencia)) throw new Error('Solicitud inválida.');
    if (p.accion === 'capacidades') {
      respuesta.ok = true; respuesta.version = 3;
      return responder_(respuesta, origen);
    }
    if (String(p.website || '')) throw new Error('Solicitud inválida.');
    const campo = (nombre, min, max) => {
      const valor = String(p[nombre] || '').trim();
      if (valor.length < min || valor.length > max) throw new Error('Revisa el campo '+nombre+'.');
      // Neutraliza fórmulas al guardar texto proporcionado por visitantes.
      return /^[=+@\-\t\r\n]/.test(valor) ? "'"+valor : valor;
    };
    const nombre = campo('nombre', 5, 100);
    const telefono = String(p.telefono || '');
    if (!/^3\d{9}$/.test(telefono)) throw new Error('Revisa el celular.');
    const departamento = campo('departamento', 2, 80);
    const ciudad = campo('ciudad', 2, 80);
    const direccion = campo('direccion', 10, 300);
    const combo = Object.prototype.hasOwnProperty.call(CATALOGO, p.combo) ? CATALOGO[p.combo] : null;
    if (!combo) throw new Error('Selecciona un combo válido.');
    const promocion = String(p.promocion || '');
    if (promocion && promocion !== 'SALIDA10') throw new Error('Promoción inválida.');
    const total = promocion === 'SALIDA10' ? Math.floor(combo.total * 0.9 / 100) * 100 : combo.total;
    if (String(total) !== String(p.totalEsperado)) throw new Error('El precio cambió.');
    const id = PropertiesService.getScriptProperties().getProperty('AURA_SHEET_ID');
    if (!id) throw new Error('Receptor sin configurar.');
    lock = LockService.getScriptLock();
    if (!lock.tryLock(20000)) throw new Error('Receptor ocupado.');
    const hoja = SpreadsheetApp.openById(id).getSheetByName(AJUSTES.pestana);
    if (!hoja) throw new Error('No existe la pestaña Pedidos.');
    const cantidad = hoja.getLastRow();
    const existente = cantidad > 1 && hoja.getRange(2, 1, cantidad - 1, 1).createTextFinder(referencia).matchEntireCell(true).findNext();
    if (!existente) {
      hoja.appendRow([referencia, Utilities.formatDate(new Date(), 'America/Bogota', 'yyyy-MM-dd HH:mm:ss'), nombre, "'"+telefono, departamento, ciudad, direccion, combo.nombre, combo.contenido + (promocion ? ' · Descuento SALIDA10: 10 % + redondeo a la baja ('+(combo.total-total)+' COP)' : ''), total, 0, 0, 'Contra entrega', 'Pendiente de contactar']);
      SpreadsheetApp.flush();
    }
    respuesta.total = existente ? Number(hoja.getRange(existente.getRow(), 10).getValue()) : total;
    respuesta.version = 3;
    respuesta.ok = true;
  } catch (error) {
    // No devolver detalles internos ni información personal al navegador.
    respuesta.message = 'No pudimos confirmar tu pedido. Revisa los datos y vuelve a intentar, o contáctanos por WhatsApp.';
  } finally {
    if (lock && lock.hasLock()) lock.releaseLock();
  }
  return responder_(respuesta, origen);
}

function responder_(respuesta, origen) {
  if (!AJUSTES.origenes.includes(origen)) return HtmlService.createHtmlOutput('Origen no habilitado.');
  const json = JSON.stringify(respuesta).replace(/</g, '\\u003c');
  const destino = JSON.stringify(origen).replace(/</g, '\\u003c');
  // El HTML no muestra información; confirma al sitio solo después de guardar.
  return HtmlService.createHtmlOutput('<!doctype html><html><body><script>window.top.postMessage('+json+','+destino+');</script></body></html>')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
