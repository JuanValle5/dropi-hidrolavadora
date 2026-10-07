'use strict';
/* Pega en endpoint la URL /exec de la aplicación web de Google Apps Script. */
const CONFIG = {marca:'Aura Tienda en linea', whatsapp:'573160958557', correo:'soporteauratienda@gmail.com', endpoint:'https://script.google.com/macros/s/AKfycbxDkBafDl3DrJeNgLhPgg8wnZDaXjxgekShcCFfjkrKRiBi0FFBXVWFCL34ZceaGIv5/exec'};
const COMBOS = {doble:{nombre:'Kit Doble Batería',detalle:'1 hidrolavadora + 2 baterías + kit',precio:139900},duo:{nombre:'Dúo Familiar',detalle:'2 hidrolavadoras + 2 baterías + 2 kits',precio:199900}};
const CIUDADES = {'Amazonas':['Leticia','Puerto Nariño'],'Antioquia':['Medellín','Bello','Envigado','Itagüí','Rionegro','Apartadó'],'Arauca':['Arauca','Arauquita','Saravena'],'Atlántico':['Barranquilla','Soledad','Malambo','Puerto Colombia'],'Bogotá D. C.':['Bogotá'],'Bolívar':['Cartagena','Magangué','Turbaco'],'Boyacá':['Tunja','Duitama','Sogamoso','Chiquinquirá'],'Caldas':['Manizales','La Dorada','Chinchiná'],'Caquetá':['Florencia','San Vicente del Caguán'],'Casanare':['Yopal','Aguazul','Villanueva'],'Cauca':['Popayán','Santander de Quilichao','Puerto Tejada'],'Cesar':['Valledupar','Aguachica','Bosconia'],'Chocó':['Quibdó','Istmina','Tadó'],'Córdoba':['Montería','Cereté','Lorica'],'Cundinamarca':['Soacha','Chía','Zipaquirá','Facatativá','Girardot','Fusagasugá','Mosquera','Madrid'],'Guainía':['Inírida'],'Guaviare':['San José del Guaviare','El Retorno'],'Huila':['Neiva','Pitalito','Garzón'],'La Guajira':['Riohacha','Maicao','San Juan del Cesar'],'Magdalena':['Santa Marta','Ciénaga','Fundación'],'Meta':['Villavicencio','Acacías','Granada'],'Nariño':['Pasto','Ipiales','Tumaco'],'Norte de Santander':['Cúcuta','Ocaña','Pamplona'],'Putumayo':['Mocoa','Puerto Asís','Orito'],'Quindío':['Armenia','Calarcá','Montenegro'],'Risaralda':['Pereira','Dosquebradas','Santa Rosa de Cabal'],'San Andrés y Providencia':['San Andrés','Providencia'],'Santander':['Bucaramanga','Floridablanca','Girón','Piedecuesta','Barrancabermeja'],'Sucre':['Sincelejo','Corozal','Sampués'],'Tolima':['Ibagué','Espinal','Melgar'],'Valle del Cauca':['Cali','Palmira','Buenaventura','Tuluá','Buga','Jamundí'],'Vaupés':['Mitú'],'Vichada':['Puerto Carreño','La Primavera']};
const $ = s => document.querySelector(s);
const money = n => '$'+new Intl.NumberFormat('es-CO').format(n);
const dialog = $('#message-dialog');
function showMessage(title,body){$('#dialog-title').textContent=title;$('#dialog-text').textContent=body;dialog.showModal();}
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
const gallery=$('#desktop-gallery');
const photos=[['assets/images/kit-completo.jpeg','Kit completo y accesorios'],['assets/images/montaje-y-lavado.jpeg','Montaje y uso sobre un carro'],['assets/images/medidas-y-accesorios.jpeg','Medidas y accesorios del producto'],['assets/images/boquillas-y-espuma.jpeg','Boquillas y aplicación de espuma'],['assets/images/detalle-gatillo.jpeg','Detalle del gatillo y agarre'],['assets/images/detalle-conexiones.jpeg','Detalle de las conexiones']];
photos.push(...[["assets/images/maletin-abierto.jpg", "Maletín abierto con dos baterías"], ["assets/images/kit-real.jpg", "Fotografía del kit completo"], ["assets/images/instalacion.jpg", "Guía de instalación en español"], ["assets/images/espuma.jpg", "Aplicación de espuma"]]);
for(const [src,alt] of photos){const b=document.createElement('button');b.className='thumb';b.type='button';b.setAttribute('aria-label','Ver '+alt.toLowerCase());b.setAttribute('aria-pressed',String(src===photos[0][0]));const im=document.createElement('img');im.src=src;im.alt='';im.loading='lazy';b.append(im);b.addEventListener('click',()=>{$('#main-product').src=src;$('#main-product').alt=alt;document.querySelectorAll('.thumb').forEach(el=>el.setAttribute('aria-pressed',String(el===b)));});gallery.querySelector('.thumbs').append(b);}
const breakpoint=matchMedia('(max-width:760px)');
function placeGallery(){if(breakpoint.matches){$('#mobile-gallery').append(gallery);gallery.style.display='block';}else{$('.hero').append(gallery);gallery.style.display='';}}
placeGallery();breakpoint.addEventListener('change',placeGallery);
function selectedCombo(){return document.querySelector('input[name="combo"]:checked').value;}
let discountAccepted=false;
let exitOfferShown=false;
function promotionalPrice(price){return Math.floor(price*0.9/100)*100;}
function orderTotal(){const price=COMBOS[selectedCombo()].precio;return discountAccepted?promotionalPrice(price):price;}
function updateOrder(){const c=COMBOS[selectedCombo()];$('#summary-name').textContent=c.nombre;$('#summary-detail').textContent=c.detalle;document.querySelectorAll('[data-total]').forEach(el=>el.textContent=money(orderTotal()));$('#summary-subtotal').textContent=money(c.precio);$('#discount-row').hidden=!discountAccepted;$('#discount-amount').textContent='−'+money(c.precio-orderTotal());}
document.querySelectorAll('input[name="combo"]').forEach(el=>el.addEventListener('change',updateOrder));
const checkoutDialog=$('#checkout-dialog'),exitDialog=$('#exit-offer-dialog');
function openCheckout(){checkoutDialog.showModal();document.body.classList.add('checkout-open');$('#checkout-title').focus();checkoutDialog.scrollTop=0;}
function closeCheckout(){if(exitDialog.open)exitDialog.close();if(checkoutDialog.open)checkoutDialog.close();document.body.classList.remove('checkout-open');}
function hasOrderDetails(){return [...$('#order-form').querySelectorAll('input:not([type="hidden"]),textarea,select')].some(el=>el.value.trim());}
function requestCheckoutClose(){
 if(!submitting&&!discountAccepted&&!exitOfferShown&&hasOrderDetails()){
  exitOfferShown=true;const c=COMBOS[selectedCombo()];
  $('#exit-kit').textContent=c.nombre;$('#exit-original').textContent=money(c.precio);
  $('#exit-total').textContent=money(promotionalPrice(c.precio));$('#exit-savings').textContent='Ahorras '+money(c.precio-promotionalPrice(c.precio))+' COP.';
  exitDialog.showModal();return;
 }
 closeCheckout();
}
document.querySelectorAll('[data-open-checkout]').forEach(b=>b.addEventListener('click',openCheckout));
$('#close-checkout').addEventListener('click',requestCheckoutClose);
checkoutDialog.addEventListener('cancel',e=>{e.preventDefault();requestCheckoutClose();});
checkoutDialog.addEventListener('close',()=>document.body.classList.remove('checkout-open'));
function outsideDialog(event,element){const r=element.getBoundingClientRect();return event.target===element&&(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom);}
checkoutDialog.addEventListener('click',e=>{if(outsideDialog(e,checkoutDialog))requestCheckoutClose();});
$('#accept-discount').addEventListener('click',()=>{discountAccepted=true;updateOrder();exitDialog.close();$('.order-summary').scrollIntoView({block:'nearest',behavior:'smooth'});$('.submit').focus({preventScroll:true});});
$('#decline-discount').addEventListener('click',closeCheckout);
exitDialog.addEventListener('cancel',e=>{e.preventDefault();closeCheckout();});
exitDialog.addEventListener('click',e=>{if(outsideDialog(e,exitDialog))closeCheckout();});
const department=$('#department'),city=$('#city');
Object.keys(CIUDADES).forEach(d=>department.add(new Option(d,d)));
department.addEventListener('change',()=>{city.value='';city.disabled=!department.value;city.placeholder=department.value?'Escribe o selecciona tu municipio':'Selecciona primero el departamento';$('#city-list').replaceChildren(...(CIUDADES[department.value]||[]).map(name=>new Option(name,name)));});
const phone=$('#phone');function validatePhone(){const cleaned=phone.value.replace(/[\s()+-]/g,'');const valid=/^(?:57)?3\d{9}$/.test(cleaned);phone.setCustomValidity(valid?'':'Ingresa un celular colombiano de 10 dígitos que empiece por 3 (puedes incluir +57).');return cleaned.replace(/^57(?=3\d{9}$)/,'');}phone.addEventListener('input',validatePhone);
for(const id of ['full-name','city','address']){$('#'+id).addEventListener('input',function(){this.setCustomValidity(this.value.trim().length>=(id==='address'?10:id==='full-name'?5:2)?'':'Completa este campo con información válida.');});}
// Envío invisible por iframe: espera confirmación explícita del receptor.
// No se usa fetch(no-cors): una respuesta opaca no demuestra que se guardó el pedido.
let submitting=false;
let retryOrder=null;
function randomToken(){return Array.from(crypto.getRandomValues(new Uint8Array(16)),b=>b.toString(16).padStart(2,'0')).join('');}
function enviarPedido(datos){
 return new Promise((resolve,reject)=>{
  const token=randomToken();
  const frame=document.createElement('iframe');
  frame.name='aura-'+token;frame.hidden=true;frame.setAttribute('aria-hidden','true');frame.title='Envío del pedido';
  const transport=document.createElement('form');
  transport.hidden=true;transport.method='POST';transport.action=CONFIG.endpoint;transport.target=frame.name;
  for(const [key,value] of Object.entries({...datos,token,origen:location.origin})){
   const input=document.createElement('input');input.type='hidden';input.name=key;input.value=value;transport.append(input);
  }
  function cleanup(){clearTimeout(timer);window.removeEventListener('message',onMessage);transport.remove();frame.remove();}
  function onMessage(event){
   let origin;try{origin=new URL(event.origin);}catch{return;}
   const google=origin.protocol==='https:'&&(origin.hostname==='script.google.com'||origin.hostname==='script.googleusercontent.com'||origin.hostname.endsWith('.script.googleusercontent.com')||origin.hostname.endsWith('-script.googleusercontent.com'));
   const data=event.data;
   if(!google||!data||data.type!=='aura-order-result'||data.token!==token||data.referencia!==datos.referencia)return;
   cleanup();data.ok===true?resolve(data):reject(new Error('El pedido no se pudo guardar. Revisa tus datos y vuelve a intentar o contáctanos por WhatsApp.'));
  }
  const timer=setTimeout(()=>{cleanup();reject(new Error('No pudimos confirmar la recepción. Tus datos siguen aquí: puedes reintentar o consultar por WhatsApp. Referencia: '+datos.referencia));},45000);
  window.addEventListener('message',onMessage);
  document.body.append(frame,transport);
  try{HTMLFormElement.prototype.submit.call(transport);}catch{cleanup();reject(new Error('No se pudo enviar. Intenta de nuevo o contáctanos por WhatsApp.'));}
 });
}
$('#order-form').addEventListener('submit',async event=>{
 event.preventDefault();
 const celular=validatePhone();
 if(submitting||!event.currentTarget.reportValidity())return;
 $('#form-error').textContent='';
 if(!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(CONFIG.endpoint)){
  showMessage('Pedidos por WhatsApp','Estamos habilitando el formulario. Por ahora puedes pedir tu kit por WhatsApp al 316 095 8557.');return;
 }
 if(!/^https?:$/.test(location.protocol)){
  showMessage('Abre la página desde el sitio web','El formulario necesita abrirse desde el dominio de la tienda o la vista previa local.');return;
 }
 const datos={nombre:$('#full-name').value.trim(),telefono:celular,departamento:department.value,ciudad:city.value.trim(),direccion:$('#address').value.trim(),combo:selectedCombo(),promocion:discountAccepted?'SALIDA10':'',totalEsperado:String(orderTotal())};
 const fingerprint=JSON.stringify(datos);
 if(!retryOrder||retryOrder.fingerprint!==fingerprint)retryOrder={fingerprint,referencia:'AURA-'+randomToken()};
 const reference=retryOrder.referencia;
 const form=$('#order-form'),button=$('.submit');
 const controls=[...form.querySelectorAll('input,select,textarea,button'),...document.querySelectorAll('input[name="combo"]')];
 const previous=controls.map(el=>el.disabled);
 submitting=true;button.disabled=true;form.setAttribute('aria-busy','true');controls.forEach(el=>el.disabled=true);button.textContent='ENVIANDO TU PEDIDO…';
 let success=false;
 try{
  const version=await enviarPedido({accion:'capacidades',referencia:reference});
  if(version.version!==3)throw new Error('Estamos actualizando los pedidos. Contáctanos por WhatsApp para conservar tu oferta.');
  const saved=await enviarPedido({...datos,referencia:reference});
  if(saved.total!==Number(datos.totalEsperado))throw new Error('El importe recibido no coincide. Consulta por WhatsApp con la referencia '+reference+' antes de volver a pedir.');
  success=true;retryOrder=null;closeCheckout();discountAccepted=false;
  form.reset();$('#city-list').replaceChildren();city.placeholder='Selecciona primero el departamento';
  showMessage('¡Pedido enviado con éxito!','Nos contactaremos contigo por WhatsApp para confirmar los datos y coordinar la entrega.\n\nReferencia: '+reference);
 }catch(error){$('#form-error').textContent=error.message;}
 finally{
  submitting=false;form.removeAttribute('aria-busy');controls.forEach((el,i)=>el.disabled=previous[i]);
  if(success){city.disabled=true;form.querySelectorAll('input,textarea').forEach(el=>el.setCustomValidity(''));updateOrder();}
  button.disabled=false;button.textContent='CONFIRMAR MI PEDIDO CON PAGO CONTRA ENTREGA';
 }
});
$('#whatsapp').addEventListener('click',()=>{if(!/^\d{10,15}$/.test(CONFIG.whatsapp)){showMessage('Atención por WhatsApp','El número de atención de la tienda aún no está configurado. Este botón estará disponible cuando el comercio agregue su línea de WhatsApp.');return;}window.open('https://wa.me/'+CONFIG.whatsapp+'?text='+encodeURIComponent('Hola, quiero hacer una consulta sobre la hidrolavadora inalámbrica antes de hacer mi pedido contra entrega'),'_blank','noopener,noreferrer');});
const POLICIES={retracto:['Derecho de retracto','Para compras a distancia, cuando resulte aplicable, puedes ejercer el derecho de retracto dentro de los cinco (5) días hábiles siguientes a la entrega, conforme al artículo 47 de la Ley 1480 de 2011 y sus modificaciones.\n\nComunícate por WhatsApp al 316 095 8557 o al correo soporteauratienda@gmail.com para iniciar la solicitud. Aplican las condiciones y excepciones legales.']};
document.querySelectorAll('[data-policy]').forEach(b=>b.addEventListener('click',()=>showMessage(...POLICIES[b.dataset.policy])));
if(CONFIG.marca!=='Aura Tienda en linea'){document.querySelectorAll('[data-brand]').forEach(el=>el.textContent=CONFIG.marca);$('#footer-brand').textContent=CONFIG.marca;document.title=CONFIG.marca+' | Hidrolavadora portátil';}
$('#year').textContent=new Date().getFullYear();
let heroVisible=true,checkoutVisible=false;
function sticky(){ $('#sticky-buy').hidden=heroVisible||checkoutVisible; }
const observer=new IntersectionObserver(entries=>{for(const e of entries){if(e.target.classList.contains('hero'))heroVisible=e.isIntersecting;else checkoutVisible=e.isIntersecting;}sticky();},{threshold:0});observer.observe($('.hero'));observer.observe($('#formulario-pedido'));
