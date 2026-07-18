
const V='5.3.0',QKEY='mjm_quoteos_quotes_v5',SKEY='mjm_quoteos_settings_v5';
const $=s=>document.querySelector(s), money=(n,c='PEN')=>new Intl.NumberFormat('es-PE',{style:'currency',currency:c,maximumFractionDigits:0}).format(n||0);
const esc=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
let settings={cost:18,sale:32,margin:22,cont:6,business:'MJM Solutions',tagline:'Software · Automatización · IA',email:'',phone:'',infraAdminMargin:25,maintenanceBasic:120,maintenanceBusiness:250,maintenanceManaged:480,...JSON.parse(localStorage.getItem(SKEY)||'{}')};
let quotes=JSON.parse(localStorage.getItem(QKEY)||'[]'), current=null, page='dashboard';

const markets={PE:{name:'Perú',currency:'PEN',fx:1,m:{portfolio:.72,junior:1,studio:1.5}},US:{name:'Estados Unidos',currency:'USD',fx:.27,m:{portfolio:1.8,junior:2.5,studio:3.7}},ES:{name:'España',currency:'EUR',fx:.25,m:{portfolio:1.5,junior:2.1,studio:3}},CL:{name:'Chile',currency:'USD',fx:.27,m:{portfolio:1.1,junior:1.5,studio:2.2}},CO:{name:'Colombia',currency:'USD',fx:.27,m:{portfolio:.95,junior:1.25,studio:1.8}},MX:{name:'México',currency:'USD',fx:.27,m:{portfolio:1.15,junior:1.55,studio:2.3}}};
const products=[
['landing','Landing page',10,390,300,1500,'3–6 días hábiles'],['corporate','Web corporativa',24,890,800,5000,'1–3 semanas'],['catalog','Catálogo digital',34,1290,1200,5500,'2–4 semanas'],['ecommerce','Tienda online',70,2490,2000,15000,'4–10 semanas'],['pwa','PWA / app web',70,2490,2500,12000,'4–10 semanas'],['dashboard','Dashboard',55,1990,2500,12000,'3–8 semanas'],['inventory','Sistema de inventario',105,3490,5000,25000,'6–14 semanas'],['crm','CRM',120,3990,7000,30000,'8–16 semanas'],['erp','ERP modular',220,7990,15000,80000,'3–8 meses'],['mobile','App Android + iOS',150,5990,6000,30000,'3–6 meses'],['desktop','Sistema de escritorio',95,3290,3500,18000,'5–12 semanas'],['desktop_local','Escritorio local / monousuario',48,1590,1500,7000,'2–6 semanas'],['desktop_multi','Escritorio multiusuario en red',135,4490,5000,22000,'8–16 semanas'],['pos_desktop','POS de escritorio',125,3990,4500,20000,'7–15 semanas'],['automation','Automatización',32,990,1000,10000,'1–5 semanas'],['ai','Solución con IA',90,3490,5000,40000,'1–4 meses']
].map(x=>({id:x[0],name:x[1],base:x[2],floor:x[3],low:x[4],high:x[5],time:x[6]}));
const modules=[
['responsive','Diseño responsive',3],['contact','Formulario',3],['whatsapp','WhatsApp',1],['seo','SEO básico',4],['admin','Panel administrador',24],['auth','Inicio de sesión',10],['roles','Roles y permisos',12],['db','Base de datos',12],['crud','Gestión de registros',18],['files','Archivos e imágenes',10],['pdf','Reportes PDF',8],['excel','Excel / CSV',6],['kpi','Dashboard KPI',18],['payment','Pasarela de pago',22],['notify','Notificaciones',10],['email','Correos automáticos',7],['scanner','Escáner',16],['offline','Modo offline',24],['maps','Mapas / GPS',24],['calendar','Agenda',14],['api','API externa',16],['ai','Integración IA',28],['audit','Auditoría',14],['multi','Multiempresa',28],['installer','Instalador Windows',8],['autoupdate','Actualización automática',14],['localdb','Base de datos local',8],['network','Trabajo en red local',20],['printing','Impresión y tickets',12],['backup','Copias de seguridad',10],['hardware','Integración con hardware',18],['sync','Sincronización nube-escritorio',26]
].map(x=>({id:x[0],name:x[1],hours:x[2]}));
const routes={
landing:{stack:['HTML, CSS y JavaScript','GitHub Pages o Cloudflare Pages','Dominio propio','Formulario ligero'],steps:['Recopilar logo, textos y referencias','Definir estructura y llamada a la acción','Diseñar y desarrollar','Optimizar celular, velocidad y SEO','Conectar formulario y WhatsApp','Configurar dominio, DNS y SSL','Probar y entregar accesos'],third:[['Dominio','Recomendado','Anual','Cliente'],['Hosting estático','Obligatorio','Gratis inicialmente','Proveedor/cliente'],['Correo corporativo','Opcional','Mensual','Cliente']]},
mobile:{stack:['Flutter o React Native','Firebase, Supabase o API propia','Google Play Console','Apple Developer'],steps:['Definir alcance móvil','Diseñar flujos y prototipo','Construir app y backend','Integrar servicios del dispositivo','Probar Android e iOS','Preparar fichas de tienda','Publicar y monitorear'],third:[['Google Play Console','Para Android','Cuenta de publicación','Cliente'],['Apple Developer','Para iOS','Membresía anual','Cliente'],['Backend','Según alcance','Gratis inicial o mensual','Cliente']]},
desktop:{stack:['C#/.NET, Electron o Java','SQLite para uso local o PostgreSQL/SQL Server para red','Instalador y actualizador','Backups locales y/o nube'],steps:['Definir equipos, usuarios y red','Diseñar flujos de escritorio','Modelar datos y permisos','Construir módulos principales','Integrar impresión, escáner u otro hardware','Crear instalador y política de actualización','Probar en Windows objetivo','Entregar instalador, respaldo y manual'],third:[['Licencia de base de datos','Según tecnología','Gratis o mensual','Cliente'],['Certificado de firma','Opcional','Anual','Cliente/proveedor'],['Servidor local o nube','Solo multiusuario','Único o mensual','Cliente'],['Soporte remoto','Recomendado','Mensual','Cliente']]},
default:{stack:['Frontend responsive','Backend serverless o API','Firebase, Supabase o PostgreSQL','Hosting, dominio y respaldos'],steps:['Levantar proceso actual','Definir usuarios, reglas y datos','Diseñar prototipo','Construir módulos prioritarios','Configurar autenticación y seguridad','Probar con datos reales','Migrar y publicar','Capacitar y dar garantía'],third:[['Dominio','Recomendado','Anual','Cliente'],['Hosting/backend','Obligatorio','Gratis inicial o mensual','Cliente'],['Base de datos','Obligatorio','Gratis inicial o mensual','Cliente'],['Backups','Recomendado','Mensual','Cliente']]}
};
const navItems=[['dashboard','◫','Dashboard'],['quote','＋','Nueva cotización'],['consult','✦','Consultor junior'],['route','✓','Ruta de implementación'],['architect','⌘','Arquitecto de Software'],['infrastructure','◈','Infraestructura y recurrentes'],['history','⌕','Cotizaciones'],['settings','⚙','Configuración']];
function save(){localStorage.setItem(QKEY,JSON.stringify(quotes));localStorage.setItem(SKEY,JSON.stringify(settings))}
function toast(t){$('#toast').textContent=t;$('#toast').classList.add('show');setTimeout(()=>$('#toast').classList.remove('show'),2200)}
function product(id){return products.find(x=>x.id===id)||products[0]}
function blank(){return{id:uid(),name:'Nueva solución digital',client:'',company:'',country:'PE',profile:'portfolio',product:'landing',complexity:'basic',reuse:'high',urgency:'normal',screens:1,modules:['responsive','contact','whatsapp','seo'],objective:'Presentar servicios y generar contactos.',status:'Borrador',infraMode:'direct',maintenancePlan:'none',infraCustom:[],created:new Date().toISOString()}}
function calc(q){let p=product(q.product), selected=modules.filter(m=>(q.modules||[]).includes(m.id)), h=p.base+selected.reduce((a,b)=>a+b.hours,0)+(Number(q.screens||1)-1)*1.4;h*=({basic:1,medium:1.25,high:1.6,enterprise:2}[q.complexity]||1)*({high:.58,medium:.76,low:.9,none:1}[q.reuse]||1)*({normal:1,fast:1.15,urgent:1.3}[q.urgency]||1);h=Math.max(6,Math.round(h));let mk=markets[q.country], mult=mk.m[q.profile], internal=h*settings.cost, base=h*settings.sale*mult, min=internal*(1+settings.margin/100)+base*settings.cont/100, rec=Math.max(min,base,p.floor*mult), fx=mk.fx;return{p,selected,h,currency:mk.currency,internal:internal*fx,min:min*fx,express:Math.round(Math.max(min,rec*.82)*fx/10)*10,rec:Math.round(rec*fx/10)*10,premium:Math.round(rec*1.35*fx/10)*10,low:p.low*fx,high:p.high*fx}}
function nav(){ $('#nav').innerHTML=navItems.map(x=>`<button class="nav ${page===x[0]?'active':''}" data-p="${x[0]}">${x[1]} &nbsp; ${x[2]}</button>`).join('');document.querySelectorAll('.nav').forEach(b=>b.onclick=()=>go(b.dataset.p))}
function title(a,b){$('#title').textContent=a;$('#subtitle').textContent=b}
function go(p){page=p;$('#sidebar').classList.remove('open');render()}
function render(){nav();({dashboard,quote,consult,route,architect,infrastructure,history,settingsView}[page]||dashboard)()}
function dashboard(){title('Dashboard','Centro comercial y técnico');let won=quotes.filter(q=>q.status==='Ganada').length;$('#view').innerHTML=`<div class="card hero"><span class="eyebrow">MJM Solutions · QuoteOS v${V}</span><h2>Empieza a vender software con una metodología profesional.</h2><p>Diagnostica, cotiza, explica la implementación y genera una propuesta comercial limpia.</p><div class="buttons"><button class="btn primary" onclick="newQuote()">Crear cotización</button><button class="btn secondary" onclick="go('consult')">Abrir consultor junior</button></div></div><div class="grid g4" style="margin-top:18px"><div class="card kpi"><span class="muted">Cotizaciones</span><b>${quotes.length}</b><small>Guardadas localmente</small></div><div class="card kpi"><span class="muted">Ganadas</span><b>${won}</b><small>Oportunidades cerradas</small></div><div class="card kpi"><span class="muted">Entrada</span><b>S/ 390</b><small>Landing portafolio</small></div><div class="card kpi"><span class="muted">Versión</span><b>v${V}</b><small>Perú Launch Edition</small></div></div><div class="grid g2" style="margin-top:18px"><div class="card"><h3>Ruta para tu primer cliente</h3><div class="steps">${['Cotiza una Landing Express','Genera la propuesta PDF','Solicita 50% de adelanto','Publica y pide testimonio'].map((s,i)=>`<div class="step"><div class="num">${i+1}</div><div><h4>${s}</h4><p>${['Producto simple para crear portafolio.','Documento con alcance, plazo y condiciones.','No empieces sin compromiso comercial.','Cada entrega debe convertirse en evidencia.'][i]}</p></div></div>`).join('')}</div></div><div class="card"><h3>Referencias iniciales Perú</h3><table><thead><tr><th>Servicio</th><th>Entrada MJM</th><th>Rango</th></tr></thead><tbody>${products.slice(0,7).map(p=>`<tr><td>${p.name}</td><td>${money(p.floor)}</td><td>${money(p.low)} – ${money(p.high)}</td></tr>`).join('')}</tbody></table></div></div>`}
function quote(){title('Nueva cotización','Motor competitivo y rentable');if(!current)current=blank();let c=calc(current);$('#view').innerHTML=`<div class="grid g3"><div class="card" style="grid-column:span 2"><h2>Datos y alcance</h2><div class="form"><label>Proyecto<input id="name" value="${esc(current.name)}"></label><label>Cliente<input id="client" value="${esc(current.client)}"></label><label>Empresa<input id="company" value="${esc(current.company)}"></label><label>Mercado<select id="country">${Object.entries(markets).map(([k,m])=>`<option value="${k}" ${current.country===k?'selected':''}>${m.name}</option>`).join('')}</select></label><label>Perfil<select id="profile"><option value="portfolio">Portafolio agresivo</option><option value="junior" ${current.profile==='junior'?'selected':''}>Consultora junior</option><option value="studio" ${current.profile==='studio'?'selected':''}>Estudio profesional</option></select></label><label>Producto<select id="product">${products.map(p=>`<option value="${p.id}" ${current.product===p.id?'selected':''}>${p.name}</option>`).join('')}</select></label><label>Complejidad<select id="complexity"><option value="basic">Básica</option><option value="medium" ${current.complexity==='medium'?'selected':''}>Media</option><option value="high" ${current.complexity==='high'?'selected':''}>Alta</option><option value="enterprise" ${current.complexity==='enterprise'?'selected':''}>Empresarial</option></select></label><label>Reutilización<select id="reuse"><option value="high">Plantilla reutilizable</option><option value="medium" ${current.reuse==='medium'?'selected':''}>Componentes propios</option><option value="low" ${current.reuse==='low'?'selected':''}>Poca reutilización</option><option value="none" ${current.reuse==='none'?'selected':''}>Desde cero</option></select></label><label>Urgencia<select id="urgency"><option value="normal">Normal</option><option value="fast" ${current.urgency==='fast'?'selected':''}>Rápida</option><option value="urgent" ${current.urgency==='urgent'?'selected':''}>Urgente</option></select></label><label>Pantallas<input id="screens" type="number" min="1" value="${current.screens}"></label><label class="span3">Objetivo<textarea id="objective">${esc(current.objective)}</textarea></label></div><h3>Funcionalidades</h3><div class="modules">${modules.map(m=>`<label class="module"><input type="checkbox" data-m="${m.id}" ${(current.modules||[]).includes(m.id)?'checked':''}><span><b>${m.name}</b><small>Referencia interna: ${m.hours} h</small></span></label>`).join('')}</div></div><div class="card summary"><span class="eyebrow">Precio recomendado</span><div class="price">${money(c.rec,c.currency)}</div><p class="muted">${c.p.time} · ${c.h} h internas</p><div class="tiers"><div class="tier"><small>Express</small><b>${money(c.express,c.currency)}</b></div><div class="tier"><small>Recomendado</small><b>${money(c.rec,c.currency)}</b></div><div class="tier"><small>Premium</small><b>${money(c.premium,c.currency)}</b></div></div><hr style="border:0;border-top:1px solid var(--line);margin:18px 0"><p><b>Mínimo rentable</b><br>${money(c.min,c.currency)}</p><p><b>Rango de referencia</b><br>${money(c.low,c.currency)} – ${money(c.high,c.currency)}</p><div class="notice">Los precios son configurables y priorizan entrada al mercado sin ocultar tu costo interno.</div><div class="buttons" style="margin-top:15px"><button class="btn primary" onclick="saveQuote()">Guardar</button><button class="btn secondary" onclick="proposal()">Propuesta PDF</button></div></div></div>`;bind()}
function bind(){let map={name:'name',client:'client',company:'company',country:'country',profile:'profile',product:'product',complexity:'complexity',reuse:'reuse',urgency:'urgency',screens:'screens',objective:'objective'};Object.entries(map).forEach(([id,k])=>$('#'+id).onchange=e=>{current[k]=e.target.value;quote()});document.querySelectorAll('[data-m]').forEach(x=>x.onchange=e=>{let id=e.target.dataset.m;current.modules=e.target.checked?[...new Set([...(current.modules||[]),id])]:(current.modules||[]).filter(y=>y!==id);quote()})}
function consult(){title('Consultor junior','Diagnóstico por señales, alcance y contexto');$('#view').innerHTML=`<div class="grid g2"><div class="card"><h2>Diagnóstico guiado avanzado</h2><p class="muted">El motor analiza el problema, canal, usuarios, conectividad, datos, hardware e integraciones. No usa un precio fijo.</p><div class="form"><label class="span2">Problema a resolver<textarea id="need" placeholder="Ej.: sistema para ventas en caja, lector de códigos, tickets y trabajo sin internet"></textarea></label><label>Canal principal<select id="channel"><option>Web</option><option>Celular</option><option>Escritorio Windows</option><option>Web y celular</option><option>Escritorio y nube</option></select></label><label>Usuarios<select id="users"><option value="1">1 usuario</option><option value="5">2–5 usuarios</option><option value="20">6–20 usuarios</option><option value="100">21–100 usuarios</option><option value="500">Más de 100</option></select></label><label>Login<select id="login"><option>No</option><option>Sí</option></select></label><label>Offline<select id="offline"><option>No</option><option>Sí</option></select></label><label>Base de datos<select id="dbneed"><option>No estoy seguro</option><option>No</option><option>Sí</option></select></label><label>Integraciones<select id="integrations"><option value="0">Ninguna</option><option value="1">1 integración</option><option value="2">2–3 integraciones</option><option value="4">4 o más</option></select></label><label>Hardware<select id="hardware"><option>Ninguno</option><option>Impresora / tickets</option><option>Escáner / lector</option><option>Ambos</option></select></label><label>Datos o procesos<input id="data" placeholder="Productos, ventas, clientes, reportes..."></label><label class="span2">Funciones importantes<input id="features" placeholder="Ej.: PDF, Excel, dashboard, pagos, mapas, IA..."></label></div><button class="btn primary" style="margin-top:15px" onclick="diagnose()">Generar diagnóstico</button></div><div class="card" id="diag"><p class="muted">Completa el diagnóstico para recibir una recomendación explicada.</p></div></div>`}
function diagnose(){
 const text=(need.value+' '+data.value+' '+features.value).toLowerCase();
 const scores={landing:0,corporate:0,ecommerce:0,pwa:0,dashboard:0,inventory:0,crm:0,erp:0,mobile:0,desktop:0,desktop_local:0,desktop_multi:0,pos_desktop:0,automation:0,ai:0};
 const reasons=[];
 const add=(id,pts,why)=>{scores[id]=(scores[id]||0)+pts;if(why)reasons.push({id,why,pts})};
 const has=(...words)=>words.some(w=>text.includes(w));
 if(has('landing','página informativa','captar clientes','presentar servicios')) add('landing',8,'Necesidad comercial simple e informativa');
 if(has('web corporativa','empresa','nosotros','servicios')) add('corporate',5,'Contenido institucional multipágina');
 if(has('tienda','ecommerce','carrito','pago online','comprar')) add('ecommerce',10,'Venta online y pagos');
 if(has('inventario','stock','almacén','producto','kardex')) add('inventory',10,'Control de productos y existencias');
 if(has('cliente','prospecto','oportunidad','seguimiento','crm')) add('crm',8,'Gestión de clientes y oportunidades');
 if(has('erp','compras','ventas','contabilidad','proveedor','facturación')) add('erp',8,'Procesos empresariales integrados');
 if(has('dashboard','kpi','indicador','gráfico','reporte ejecutivo')) add('dashboard',7,'Visualización de indicadores');
 if(has('automatizar','automatización','excel','sheets','correo automático','bot')) add('automation',8,'Automatización de tareas repetitivas');
 if(has('ia','inteligencia artificial','chatbot','clasificar','generar texto')) add('ai',10,'Uso explícito de inteligencia artificial');
 if(has('caja','pos','ticket','boleta','punto de venta')) add('pos_desktop',10,'Operación de caja y tickets');
 if(channel.value.includes('Celular')) add('mobile',8,'Canal móvil seleccionado');
 if(channel.value==='Web y celular'){add('pwa',7,'Debe funcionar en web y celular');add('mobile',4)}
 if(channel.value==='Web') add('pwa',4,'Canal web seleccionado');
 if(channel.value==='Escritorio Windows'){add('desktop',9,'Aplicación de escritorio seleccionada');add('desktop_local',4)}
 if(channel.value==='Escritorio y nube'){add('desktop_multi',9,'Escritorio conectado y multiusuario');add('desktop',6);add('pwa',3)}
 const u=+users.value;
 if(u===1 && channel.value.includes('Escritorio')) add('desktop_local',5,'Uso individual o local');
 if(u>=5 && channel.value.includes('Escritorio')) add('desktop_multi',6,'Varios usuarios requieren red o servidor');
 if(u>=20){add('erp',2);add('pwa',2);add('desktop_multi',2);reasons.push({id:'general',why:'Mayor número de usuarios incrementa arquitectura y seguridad',pts:2})}
 if(offline.value==='Sí'){add('desktop',5,'Necesidad de trabajo sin internet');add('desktop_local',4);add('mobile',2)}
 if(dbneed.value==='Sí'){add('pwa',2);add('desktop',2);add('inventory',2);add('crm',2)}
 const ints=+integrations.value;if(ints>=2){add('erp',2);add('pwa',2);add('desktop_multi',2);reasons.push({id:'general',why:`${ints} integraciones elevan complejidad`,pts:ints})}
 if(hardware.value.includes('Impresora')){add('pos_desktop',6);add('desktop',3)}
 if(hardware.value.includes('Escáner')){add('inventory',5);add('desktop',3);add('mobile',2)}
 if(hardware.value==='Ambos'){add('pos_desktop',8);add('desktop',5);add('inventory',5)}
 if(has('pdf')) reasons.push({module:'pdf'});if(has('excel')) reasons.push({module:'excel'});if(has('mapa','gps')) reasons.push({module:'maps'});if(has('pago')) reasons.push({module:'payment'});if(has('escáner','lector')) reasons.push({module:'scanner'});if(has('ticket','imprimir')) reasons.push({module:'printing'});if(has('respaldo','backup')) reasons.push({module:'backup'});
 let pid=Object.entries(scores).sort((a,b)=>b[1]-a[1])[0][0];
 if(Math.max(...Object.values(scores))===0) pid=channel.value.includes('Escritorio')?'desktop':channel.value.includes('Celular')?'mobile':'pwa';
 current=blank();current.product=pid;current.name='Solución para '+(need.value||'proceso digital');current.objective=need.value||'Digitalizar y mejorar el proceso indicado por el cliente.';
 let mods=['responsive'];
 const dataDriven=dbneed.value==='Sí'||has('inventario','stock','cliente','venta','registro','producto','reporte','sistema');
 if(dataDriven) mods.push('db','crud');if(login.value==='Sí')mods.push('auth','roles');if(offline.value==='Sí')mods.push('offline');if(+integrations.value>0)mods.push('api');
 const modMap={pdf:'pdf',excel:'excel',maps:'maps',payment:'payment',scanner:'scanner',printing:'printing',backup:'backup'};reasons.filter(r=>r.module).forEach(r=>mods.push(modMap[r.module]));
 if(channel.value.includes('Escritorio')) mods.push('installer','localdb');if(u>=5&&channel.value.includes('Escritorio'))mods.push('network','backup');if(hardware.value!=='Ninguno')mods.push('hardware');
 current.modules=[...new Set(mods)];current.screens=Math.max(1,Math.min(20,Math.ceil((text.split(/[,; ]+/).filter(Boolean).length)/8)+2));current.complexity=u>=100||+integrations.value>=4?'high':u>=20||+integrations.value>=2?'medium':'basic';current.reuse='medium';
 let c=calc(current), top=Object.entries(scores).sort((a,b)=>b[1]-a[1]).slice(0,3), confidence=Math.min(96,45+top[0][1]*4+(top[0][1]-top[1][1])*3);
 const why=[...new Set(reasons.filter(r=>r.id===pid||r.id==='general').sort((a,b)=>b.pts-a.pts).map(r=>r.why))].slice(0,5);
 $('#diag').innerHTML=`<span class="eyebrow">Diagnóstico dinámico</span><h2>${c.p.name}</h2><p>${esc(current.objective)}</p><p><span class="status good">Confianza ${Math.round(confidence)}%</span></p><h3>¿Por qué?</h3><ul>${why.length?why.map(x=>`<li>${esc(x)}</li>`).join(''):'<li>Selección basada principalmente en el canal indicado.</li>'}</ul><p><b>Módulos sugeridos:</b> ${c.selected.map(m=>m.name).join(' · ')}</p><p><b>Complejidad:</b> ${current.complexity} · <b>Horas internas:</b> ${c.h}</p><p><b>Inversión preliminar:</b> ${money(c.rec,c.currency)}</p><p><b>Plazo:</b> ${c.p.time}</p><details><summary>Alternativas evaluadas</summary><p>${top.map(([id,s])=>`${product(id).name}: ${s} puntos`).join('<br>')}</p></details><button class="btn primary" onclick="go('quote')">Editar cotización</button>`;
}

function hasModule(q,id){return (q.modules||[]).includes(id)}
function implementationPlan(q){
  const p=product(q.product), isDesktop=q.product.startsWith('desktop')||q.product==='pos_desktop',
        isMobile=q.product==='mobile', isWeb=['landing','corporate','catalog','ecommerce','pwa','dashboard'].includes(q.product),
        isEnterprise=['inventory','crm','erp'].includes(q.product), isAI=q.product==='ai'||hasModule(q,'ai'),
        offline=hasModule(q,'offline')||q.product==='desktop_local'||q.product==='pos_desktop',
        scanner=hasModule(q,'scanner')||q.product==='pos_desktop',
        payment=hasModule(q,'payment')||q.product==='ecommerce',
        maps=hasModule(q,'maps'), multi=hasModule(q,'multi'), api=hasModule(q,'api'),
        auth=hasModule(q,'auth')||hasModule(q,'roles')||isEnterprise, db=hasModule(q,'db')||hasModule(q,'crud')||isEnterprise||isMobile,
        print=hasModule(q,'printing')||hasModule(q,'pdf')||q.product==='pos_desktop';

  let front, backend, database, deploy, language, rationale=[], risks=[], services=[], steps=[], nodes=[];

  if(isDesktop){
    language='C# + .NET';
    front=q.product==='desktop_local'?'WinUI 3 o WPF':'WPF / WinUI 3';
    backend=q.product==='desktop_cloud'||multi||api?'ASP.NET Core API':'Lógica local en la aplicación';
    database=q.product==='desktop_local'||q.product==='pos_desktop'?'SQLite local':q.product==='desktop_network'?'SQL Server Express / PostgreSQL en red':'SQLite local + PostgreSQL/Firebase en nube';
    deploy='Instalador MSIX/MSI para Windows';
    rationale.push('El acceso directo a impresoras, lectores y archivos locales favorece una aplicación de escritorio.');
    if(offline) rationale.push('La base local permite operar sin internet y sincronizar después cuando corresponda.');
    if(q.product==='desktop_network'||multi) rationale.push('El trabajo multiusuario requiere una base central, control de concurrencia y copias de seguridad.');
    services=[['Certificado de firma de código','Opcional','Anual','Cliente'],['Servidor local o nube','Según modalidad','Mensual o equipo propio','Cliente'],['Base de datos','Según modalidad','Gratis inicial o licencia','Cliente'],['Backups externos','Recomendado','Mensual','Cliente']];
    steps=['Levantamiento del flujo operativo y periféricos','Diseño de base de datos y pantallas','Construcción de aplicación Windows','Integración con impresoras, lector o hardware','Pruebas offline y multiusuario','Creación de instalador y actualización','Piloto en equipos reales','Capacitación, entrega y respaldo'];
    nodes=['Operador Windows',front,database,backend,offline?'Sincronización':'Reportes / impresión'];
    if(scanner) risks.push('Validar modelos de lectores y forma de entrada antes de cerrar el alcance.');
    risks.push('Probar la instalación en las versiones reales de Windows del cliente.');
  } else if(isMobile){
    language='Flutter (Dart)';
    front='Aplicación Flutter para Android e iOS';
    backend='Firebase / Supabase o API Node.js';
    database=offline?'SQLite local + sincronización en nube':'Firestore o PostgreSQL';
    deploy='Google Play + App Store';
    rationale.push('Flutter reduce el costo al compartir una base de código entre Android e iOS.');
    if(offline) rationale.push('El funcionamiento offline exige una base local, colas de sincronización y resolución de conflictos.');
    services=[['Google Play Console','Android','Cuenta de publicación','Cliente'],['Apple Developer','iOS','Membresía anual','Cliente'],['Backend y base de datos','Obligatorio','Gratis inicial o mensual','Cliente'],['Servicio de notificaciones','Opcional','Por consumo','Cliente']];
    steps=['Definir alcance y dispositivos compatibles','Diseñar flujos y prototipo móvil','Configurar backend, usuarios y base de datos','Desarrollar aplicación multiplataforma','Integrar cámara, GPS, notificaciones u offline','Pruebas en dispositivos Android e iPhone','Preparar privacidad y fichas de tienda','Publicar, monitorear y entregar'];
    nodes=['Usuario móvil','Flutter',database,backend,'Google Play / App Store'];
    risks.push('Las revisiones de App Store y Google Play pueden modificar la fecha final de publicación.');
  } else if(isWeb && !isEnterprise){
    language=q.product==='landing'||q.product==='corporate'?'HTML, CSS y JavaScript / Astro':'React o Next.js';
    front=q.product==='landing'?'Sitio estático optimizado':q.product==='corporate'?'Web multipágina responsive':'Aplicación web responsive';
    backend=db||auth||payment?'Firebase, Supabase o API Node.js':'No requerido o servicio ligero para formularios';
    database=db?'Firestore / PostgreSQL':'No requerida';
    deploy='Cloudflare Pages, Firebase Hosting o Vercel';
    rationale.push('Una arquitectura web reduce costos de instalación y facilita el acceso desde cualquier dispositivo.');
    if(q.product==='landing') rationale.push('Un sitio estático es suficiente y evita pagar un servidor para una página informativa.');
    if(payment) rationale.push('Los pagos deben integrarse mediante una pasarela; la aplicación no debe almacenar tarjetas.');
    services=[['Dominio','Recomendado','Anual','Cliente'],['Hosting frontend','Obligatorio','Gratis inicial o mensual','Cliente'],...(db?[['Backend / base de datos','Obligatorio','Gratis inicial o mensual','Cliente']]:[]),...(payment?[['Pasarela de pago','Obligatorio','Comisión por transacción','Cliente']]:[])];
    steps=['Recopilar contenido, identidad y objetivos','Definir mapa de páginas y alcance','Diseñar interfaz responsive','Desarrollar frontend y componentes','Configurar formularios, datos e integraciones','Optimizar velocidad, SEO y seguridad','Conectar dominio, DNS y SSL','Probar, publicar y entregar accesos'];
    nodes=['Visitante',front,backend,database==='No requerida'?'Formulario / WhatsApp':database,'Dominio + hosting'];
    risks.push('El cliente debe entregar textos, imágenes y aprobaciones para mantener el plazo.');
  } else {
    language='React / TypeScript';
    front='Aplicación web responsive o PWA';
    backend='Node.js / NestJS, Cloud Functions o ASP.NET Core';
    database=multi||q.product==='erp'?'PostgreSQL':'Firebase / Supabase / PostgreSQL';
    deploy='Hosting web + servicios backend administrados';
    rationale.push('Una arquitectura por capas permite separar interfaz, reglas empresariales y datos.');
    rationale.push(database==='PostgreSQL'?'PostgreSQL es adecuado para relaciones, transacciones y módulos empresariales.':'Firebase o Supabase aceleran una primera versión con bajo costo operativo.');
    if(multi) rationale.push('Multiempresa exige aislamiento de datos, permisos y auditoría por organización.');
    services=[['Dominio','Recomendado','Anual','Cliente'],['Hosting frontend','Obligatorio','Gratis inicial o mensual','Cliente'],['Backend y base de datos','Obligatorio','Mensual según consumo','Cliente'],['Almacenamiento y backups','Recomendado','Mensual','Cliente'],['Monitoreo y correo','Recomendado','Por consumo','Cliente']];
    steps=['Levantar procesos, usuarios y reglas','Priorizar MVP y módulos posteriores','Diseñar modelo de datos y prototipo','Construir autenticación, roles y auditoría','Desarrollar módulos por iteraciones','Integrar reportes, archivos y servicios externos','Pruebas con datos reales y seguridad','Migración, capacitación y producción'];
    nodes=['Usuarios',front,backend,database,'Reportes / integraciones'];
    risks.push('Los sistemas empresariales requieren validación continua del proceso, no solo aprobación visual.');
  }

  if(isAI){
    rationale.push('La IA debe implementarse detrás de una API, con límites de consumo, registro de errores y revisión humana.');
    services.push(['API de inteligencia artificial','Según uso','Por consumo','Cliente']);
    risks.push('El costo y precisión de la IA dependen del volumen, modelo y calidad de los datos.');
    nodes.splice(nodes.length-1,0,'Servicio de IA');
  }
  if(maps){
    services.push(['API de mapas','Según consumo','Gratis inicial o mensual','Cliente']);
    risks.push('Las funciones GPS deben probarse con permisos y condiciones reales de señal.');
  }
  if(api) risks.push('Confirmar documentación, límites y disponibilidad de cada API externa antes de comprometer el plazo.');
  if(print) rationale.push('La generación de documentos o impresión debe validarse con formatos y equipos reales del cliente.');

  const complexityScore=(p.base/20)+(q.modules||[]).length*.35+(offline?2:0)+(multi?2:0)+(isAI?2:0)+(api?1:0);
  const level=complexityScore<4?'Baja':complexityScore<8?'Media':complexityScore<13?'Alta':'Crítica';
  return {p,language,front,backend,database,deploy,rationale,risks,services,steps,nodes,level};
}
function projectMap(nodes){
  return `<div class="project-map">${nodes.map((n,i)=>`${i?'<div class="map-arrow">↓</div>':''}<div class="map-node">${esc(n)}</div>`).join('')}</div>`;
}


function infrastructureCatalog(q){
  const p=product(q.product), a=implementationPlan(q), isMobile=q.product==='mobile',
        isWeb=['landing','corporate','catalog','ecommerce','pwa','dashboard','inventory','crm','erp','automation','ai'].includes(q.product),
        isDesktop=q.product.startsWith('desktop')||q.product==='pos_desktop',
        needsDb=hasModule(q,'db')||hasModule(q,'crud')||['inventory','crm','erp','ecommerce','pwa','mobile','ai'].includes(q.product),
        needsAI=hasModule(q,'ai')||q.product==='ai',
        needsEmail=hasModule(q,'email')||hasModule(q,'notify')||hasModule(q,'contact'),
        needsPayments=hasModule(q,'payment')||q.product==='ecommerce';

  let items=[];
  if(isWeb){
    items.push({id:'domain',name:'Dominio',provider:'Registrador a elección',required:q.product!=='landing'?'Recomendado':'Recomendado',period:'Anual',monthly:0,annual:70,owner:'Cliente',included:false,notes:'Debe registrarse a nombre del cliente.'});
    items.push({id:'hosting',name:'Hosting frontend',provider:q.product==='landing'?'GitHub Pages / Cloudflare Pages':'Vercel / Firebase Hosting / Cloudflare',required:'Obligatorio',period:'Mensual',monthly:q.product==='landing'?0:35,annual:q.product==='landing'?0:420,owner:'Cliente',included:false,notes:q.product==='landing'?'Puede iniciar en un plan gratuito.':'Puede iniciar gratis y pasar a pago según tráfico.'});
  }
  if(needsDb){
    items.push({id:'database',name:'Base de datos y backend',provider:'Firebase / Supabase / PostgreSQL',required:'Obligatorio',period:'Mensual',monthly:['erp','inventory','crm'].includes(q.product)?90:35,annual:['erp','inventory','crm'].includes(q.product)?1080:420,owner:'Cliente',included:false,notes:'El costo real depende de almacenamiento, lecturas y usuarios.'});
  }
  if(needsEmail){
    items.push({id:'emailservice',name:'Correo transaccional / formularios',provider:'Resend / Brevo / servicio similar',required:'Según volumen',period:'Mensual',monthly:20,annual:240,owner:'Cliente',included:false,notes:'Puede existir un nivel gratuito inicial.'});
  }
  if(needsPayments){
    items.push({id:'payments',name:'Pasarela de pago',provider:'Mercado Pago / Culqi / Stripe',required:'Obligatorio',period:'Por transacción',monthly:0,annual:0,owner:'Cliente',included:false,notes:'La comisión se descuenta por cada operación.'});
  }
  if(needsAI){
    items.push({id:'aiapi',name:'Consumo de API de IA',provider:'OpenAI u otro proveedor',required:'Obligatorio',period:'Por consumo',monthly:60,annual:720,owner:'Cliente',included:false,notes:'Debe configurarse un límite mensual y alertas de consumo.'});
  }
  if(isMobile){
    items.push({id:'play',name:'Cuenta Google Play',provider:'Google',required:'Para Android',period:'Único / según política',monthly:0,annual:100,owner:'Cliente',included:false,notes:'La cuenta debe pertenecer al cliente.'});
    items.push({id:'apple',name:'Cuenta Apple Developer',provider:'Apple',required:'Para iOS',period:'Anual',monthly:0,annual:380,owner:'Cliente',included:false,notes:'Membresía renovable a nombre del cliente.'});
  }
  if(isDesktop){
    items.push({id:'signing',name:'Firma de código',provider:'Proveedor de certificado',required:'Opcional',period:'Anual',monthly:0,annual:550,owner:'Cliente',included:false,notes:'Reduce advertencias de seguridad al instalar.'});
    if(q.product==='desktop_multi'||hasModule(q,'network')||hasModule(q,'sync')){
      items.push({id:'server',name:'Servidor local o nube',provider:'VPS / PC servidor',required:'Obligatorio',period:'Mensual',monthly:80,annual:960,owner:'Cliente',included:false,notes:'Depende de usuarios simultáneos y disponibilidad requerida.'});
    }
  }
  if(hasModule(q,'files')||hasModule(q,'backup')||['inventory','crm','erp'].includes(q.product)){
    items.push({id:'backup',name:'Backups y almacenamiento',provider:'Storage administrado',required:'Recomendado',period:'Mensual',monthly:25,annual:300,owner:'Cliente',included:false,notes:'Definir retención, restauración y responsable.'});
  }
  items.push({id:'corporatemail',name:'Correo corporativo',provider:'Google Workspace / Microsoft 365 / Zoho',required:'Opcional',period:'Mensual',monthly:25,annual:300,owner:'Cliente',included:false,notes:'Costo por cuenta de usuario.'});
  return items;
}
function infraTotals(q){
  const items=infrastructureCatalog(q);
  const annual=items.reduce((s,x)=>s+Number(x.annual||0),0);
  const monthly=items.reduce((s,x)=>s+Number(x.monthly||0),0);
  const mode=q.infraMode||'direct';
  const margin=mode==='managed'?Number(settings.infraAdminMargin||0)/100:0;
  const managedMonthly=Math.round(monthly*(1+margin));
  const maintenance={none:0,basic:Number(settings.maintenanceBasic||0),business:Number(settings.maintenanceBusiness||0),managed:Number(settings.maintenanceManaged||0)}[q.maintenancePlan||'none'];
  const firstYear=annual+managedMonthly*12+maintenance*12;
  return {items,annual,monthly,managedMonthly,maintenance,firstYear,mode};
}
function infraModeLabel(mode){
  return {direct:'Cliente paga directamente',managed:'MJM administra y refactura',included:'Infraestructura incluida temporalmente'}[mode]||'Cliente paga directamente';
}

function route(){
  title('Ruta de implementación','Arquitectura dinámica según la cotización activa');
  let q=current||blank(),c=calc(q),a=implementationPlan(q);
  $('#view').innerHTML=`
  <div class="route-banner card">
    <div><span class="eyebrow">Cotización activa</span><h2>${esc(q.name)}</h2><p>${a.p.name} · Complejidad tecnológica ${a.level} · ${c.p.time}</p></div>
    <button class="btn primary" onclick="go('architect')">Ver análisis del arquitecto</button>
  </div>
  <div class="grid g2" style="margin-top:18px">
    <div class="card"><span class="eyebrow">${a.p.name}</span><h2>Arquitectura sugerida</h2>
      <div class="decision-grid">
        ${[['Lenguaje / framework',a.language],['Interfaz',a.front],['Backend',a.backend],['Base de datos',a.database],['Publicación',a.deploy]].map((x,i)=>`<div class="decision"><div class="num">${i+1}</div><div><small>${x[0]}</small><b>${x[1]}</b></div></div>`).join('')}
      </div>
      <h3>Por qué se recomienda</h3>
      <ul class="clean-list">${a.rationale.map(x=>`<li>${x}</li>`).join('')}</ul>
    </div>
    <div class="card"><h2>Mapa del proyecto</h2>${projectMap(a.nodes)}<p class="muted map-note">El mapa cambia automáticamente cuando agregas offline, IA, APIs, multiempresa o cambias de plataforma.</p></div>
  </div>
  <div class="grid g2" style="margin-top:18px">
    <div class="card"><h2>Salida a producción</h2><div class="steps">${a.steps.map((s,i)=>`<div class="step"><div class="num">${i+1}</div><div><h4>${s}</h4><p>${i<2?'Definición y aprobación del cliente.':i<a.steps.length-2?'Construcción, integración y validación técnica.':'Entrega, accesos y continuidad operativa.'}</p></div><span class="status warn">Pendiente</span></div>`).join('')}</div></div>
    <div class="card"><h2>Riesgos y validaciones</h2>${a.risks.length?`<div class="risk-list">${a.risks.map((r,i)=>`<div class="risk-card"><b>${i+1}</b><span>${r}</span></div>`).join('')}</div>`:'<div class="notice">No se detectaron riesgos técnicos especiales para el alcance actual.</div>'}
      <h3 style="margin-top:22px">Antes de cotizar definitivamente</h3>
      <div class="check-grid">${['Validar alcance y exclusiones','Confirmar quién paga servicios externos','Probar APIs o hardware crítico','Definir responsable de aprobaciones','Acordar respaldo y mantenimiento'].map(x=>`<label class="check-item"><input type="checkbox"> ${x}</label>`).join('')}</div>
    </div>
  </div>
  <div class="card" style="margin-top:18px"><h2>Costos y cuentas de terceros</h2><p class="muted">No deben confundirse con el precio de desarrollo de MJM Solutions.</p><table><thead><tr><th>Recurso</th><th>Necesidad</th><th>Pago</th><th>Responsable</th></tr></thead><tbody>${a.services.map(x=>`<tr>${x.map(y=>`<td>${y}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
function architect(){
  title('Arquitecto de Software','Justificación técnica y alternativas');
  let q=current||blank(),c=calc(q),a=implementationPlan(q);
  const alternatives = a.p.id==='landing'
    ? [['HTML/Astro','Menor costo y máxima velocidad','Ideal'],['WordPress','Edición frecuente por el cliente','Alternativa'],['React/Next.js','Crecimiento hacia una app','Solo si se justifica']]
    : (q.product.startsWith('desktop')||q.product==='pos_desktop')
    ? [['C# + WPF/WinUI','Integración Windows y periféricos','Recomendado'],['Electron','Código web empaquetado','Más consumo de recursos'],['Aplicación web/PWA','Sin instalación','No ideal para hardware/offline intenso']]
    : q.product==='mobile'
    ? [['Flutter','Una base para Android/iOS','Recomendado'],['React Native','Ecosistema JavaScript','Alternativa'],['Kotlin + Swift','Máximo control nativo','Mayor costo']]
    : [['Firebase / Supabase','MVP rápido y bajo costo','Recomendado inicial'],['Node.js + PostgreSQL','Mayor control y relaciones','Escalamiento'],['.NET + SQL Server','Entorno corporativo Microsoft','Según cliente']];
  $('#view').innerHTML=`
  <div class="grid g3">
    <div class="card kpi"><span class="muted">Complejidad</span><b>${a.level}</b><small>${c.h} horas internas estimadas</small></div>
    <div class="card kpi"><span class="muted">Arquitectura</span><b style="font-size:20px">${a.language}</b><small>${a.deploy}</small></div>
    <div class="card kpi"><span class="muted">Inversión recomendada</span><b>${money(c.rec,c.currency)}</b><small>${c.p.time}</small></div>
  </div>
  <div class="grid g2" style="margin-top:18px">
    <div class="card"><h2>Decisión técnica recomendada</h2>
      ${[['Frontend / aplicación',a.front],['Servicios y lógica',a.backend],['Persistencia',a.database],['Entrega',a.deploy]].map(x=>`<div class="architect-row"><small>${x[0]}</small><b>${x[1]}</b></div>`).join('')}
      <h3>Fundamento</h3><ul class="clean-list">${a.rationale.map(x=>`<li>${x}</li>`).join('')}</ul>
    </div>
    <div class="card"><h2>Comparación de alternativas</h2><table><thead><tr><th>Alternativa</th><th>Cuándo usarla</th><th>Evaluación</th></tr></thead><tbody>${alternatives.map(x=>`<tr><td><b>${x[0]}</b></td><td>${x[1]}</td><td>${x[2]}</td></tr>`).join('')}</tbody></table>
      <div class="notice" style="margin-top:16px">La recomendación prioriza costo de entrada, rapidez de implementación y facilidad de mantenimiento para una consultora junior.</div>
    </div>
  </div>
  <div class="card" style="margin-top:18px"><h2>Preguntas técnicas pendientes</h2><div class="question-grid">
    ${['¿Cuántos usuarios simultáneos habrá?','¿Qué ocurre cuando no hay internet?','¿Qué información es crítica y debe respaldarse?','¿Qué equipos, impresoras o lectores se usarán?','¿Qué sistemas externos deben integrarse?','¿Quién administrará usuarios y permisos?','¿Cuánto crecerán los datos en 12 meses?','¿Qué nivel de soporte espera el cliente?'].map(x=>`<div class="question-card"><span>?</span><b>${x}</b></div>`).join('')}
  </div></div>`;
}

function infrastructure(){
  title('Infraestructura y costos recurrentes','Dominio, hosting, APIs, mantenimiento y primer año');
  let q=current||blank(),c=calc(q),t=infraTotals(q);
  current=q;
  $('#view').innerHTML=`
  <div class="grid g3">
    <div class="card kpi"><span class="muted">Desarrollo inicial</span><b>${money(c.rec,c.currency)}</b><small>Honorarios de MJM Solutions</small></div>
    <div class="card kpi"><span class="muted">Terceros estimados</span><b>${money(t.annual+t.managedMonthly*12,c.currency)}</b><small>Primer año de infraestructura</small></div>
    <div class="card kpi"><span class="muted">Mantenimiento</span><b>${money(t.maintenance,c.currency)}/mes</b><small>Plan seleccionado</small></div>
  </div>
  <div class="grid g2" style="margin-top:18px">
    <div class="card">
      <h2>Modalidad de administración</h2>
      <div class="form">
        <label class="span2">¿Quién contrata y paga los servicios?
          <select id="infraMode">
            <option value="direct" ${q.infraMode==='direct'?'selected':''}>Cliente paga directamente</option>
            <option value="managed" ${q.infraMode==='managed'?'selected':''}>MJM administra y refactura</option>
            <option value="included" ${q.infraMode==='included'?'selected':''}>Incluido temporalmente como promoción</option>
          </select>
        </label>
        <label class="span2">Plan de mantenimiento
          <select id="maintenancePlan">
            <option value="none" ${q.maintenancePlan==='none'?'selected':''}>Sin mantenimiento</option>
            <option value="basic" ${q.maintenancePlan==='basic'?'selected':''}>Esencial — ${money(settings.maintenanceBasic)}/mes</option>
            <option value="business" ${q.maintenancePlan==='business'?'selected':''}>Negocio — ${money(settings.maintenanceBusiness)}/mes</option>
            <option value="managed" ${q.maintenancePlan==='managed'?'selected':''}>Administrado — ${money(settings.maintenanceManaged)}/mes</option>
          </select>
        </label>
      </div>
      <div class="notice" style="margin-top:15px">
        <b>Recomendación:</b> las cuentas deben estar a nombre del cliente. MJM Solutions puede configurarlas y administrarlas, pero el cliente debe conservar la propiedad y el método de pago.
      </div>
      <h3 style="margin-top:20px">Qué incluye cada plan</h3>
      <div class="maintenance-grid">
        <div class="maintenance-card"><b>Esencial</b><p>Revisión básica, respaldo y ajustes pequeños.</p><strong>${money(settings.maintenanceBasic)}/mes</strong></div>
        <div class="maintenance-card featured"><b>Negocio</b><p>Soporte, backups, monitoreo y cambios menores.</p><strong>${money(settings.maintenanceBusiness)}/mes</strong></div>
        <div class="maintenance-card"><b>Administrado</b><p>Gestión completa de infraestructura y continuidad.</p><strong>${money(settings.maintenanceManaged)}/mes</strong></div>
      </div>
    </div>
    <div class="card">
      <h2>Resumen económico</h2>
      <div class="architect-row"><small>Servicios externos mensuales</small><b>${money(t.monthly,c.currency)}</b></div>
      <div class="architect-row"><small>Servicios externos anuales</small><b>${money(t.annual,c.currency)}</b></div>
      <div class="architect-row"><small>Cobro mensual administrado por MJM</small><b>${money(t.managedMonthly,c.currency)}</b></div>
      <div class="architect-row"><small>Mantenimiento seleccionado</small><b>${money(t.maintenance,c.currency)}</b></div>
      <div class="architect-row total-row"><small>Primer año estimado, incluido desarrollo</small><b>${money(c.rec+t.firstYear,c.currency)}</b></div>
      <p class="muted">Los montos de proveedores son referencias configurables y pueden variar por consumo, impuestos, promociones y tipo de cambio.</p>
    </div>
  </div>
  <div class="card" style="margin-top:18px">
    <div class="section-head"><div><h2>Servicios externos recomendados</h2><p class="muted">Separados de los honorarios de desarrollo.</p></div></div>
    <div class="table-scroll"><table><thead><tr><th>Servicio</th><th>Proveedor sugerido</th><th>Necesidad</th><th>Periodicidad</th><th>Mensual</th><th>Anual</th><th>Responsable</th></tr></thead><tbody>
      ${t.items.map(x=>`<tr><td><b>${x.name}</b><br><small>${x.notes}</small></td><td>${x.provider}</td><td>${x.required}</td><td>${x.period}</td><td>${money(x.monthly,c.currency)}</td><td>${money(x.annual,c.currency)}</td><td>${x.owner}</td></tr>`).join('')}
    </tbody></table></div>
  </div>
  <div class="card" style="margin-top:18px">
    <h2>Reglas comerciales recomendadas</h2>
    <div class="rule-grid">
      ${[
        ['Propiedad','Dominio, hosting, tiendas y APIs deben quedar a nombre del cliente.'],
        ['Pago','Los servicios externos se pagan por adelantado o directamente al proveedor.'],
        ['Administración','Si MJM administra, se añade margen por gestión y responsabilidad.'],
        ['Suspensión','Definir qué ocurre si el cliente no renueva o no paga a tiempo.'],
        ['Migración','Entregar accesos y permitir migración cuando termine la relación comercial.'],
        ['Cambios de tarifa','Los proveedores pueden modificar precios; no garantizar montos indefinidamente.']
      ].map((x,i)=>`<div class="rule-card"><span>${i+1}</span><div><b>${x[0]}</b><p>${x[1]}</p></div></div>`).join('')}
    </div>
  </div>`;
  $('#infraMode').onchange=e=>{current.infraMode=e.target.value;infrastructure()};
  $('#maintenancePlan').onchange=e=>{current.maintenancePlan=e.target.value;infrastructure()};
}

function history(){title('Cotizaciones','Historial y seguimiento');$('#view').innerHTML=`<div class="card">${quotes.length?`<table><thead><tr><th>Proyecto</th><th>Cliente</th><th>Precio</th><th>Acciones</th></tr></thead><tbody>${quotes.map(q=>`<tr><td><b>${esc(q.name)}</b><br><small>${product(q.product).name}</small></td><td>${esc(q.client||'Sin cliente')}</td><td>${money(q.price,q.currency||'PEN')}</td><td><button class="btn secondary" onclick="openQuote('${q.id}')">Abrir</button> <button class="btn secondary" onclick="pdfQuote('${q.id}')">PDF</button> <button class="btn danger" onclick="removeQuote('${q.id}')">×</button></td></tr>`).join('')}</tbody></table>`:'<p class="muted">Aún no hay cotizaciones guardadas.</p>'}</div>`}
function settingsView(){title('Configuración','Tarifas e identidad comercial');$('#view').innerHTML=`<div class="grid g2"><div class="card"><h2>Modelo financiero</h2><div class="form"><label>Costo interno/hora<input id="cost" type="number" value="${settings.cost}"></label><label>Tarifa comercial base<input id="sale" type="number" value="${settings.sale}"></label><label>Margen mínimo %<input id="margin" type="number" value="${settings.margin}"></label><label>Contingencia %<input id="cont" type="number" value="${settings.cont}"></label><label>Margen administración infraestructura %<input id="infraAdminMargin" type="number" value="${settings.infraAdminMargin}"></label><label>Mantenimiento Esencial<input id="maintenanceBasic" type="number" value="${settings.maintenanceBasic}"></label><label>Mantenimiento Negocio<input id="maintenanceBusiness" type="number" value="${settings.maintenanceBusiness}"></label><label>Mantenimiento Administrado<input id="maintenanceManaged" type="number" value="${settings.maintenanceManaged}"></label></div></div><div class="card"><h2>Identidad</h2><div class="form"><label class="span2">Nombre<input id="business" value="${esc(settings.business)}"></label><label class="span2">Eslogan<input id="tagline" value="${esc(settings.tagline)}"></label><label>Correo<input id="email" value="${esc(settings.email)}"></label><label>Teléfono<input id="phone" value="${esc(settings.phone)}"></label></div><button class="btn primary" style="margin-top:15px" onclick="saveSettings()">Guardar</button></div></div>`}
function saveSettings(){settings={...settings,cost:+cost.value,sale:+sale.value,margin:+margin.value,cont:+cont.value,infraAdminMargin:+infraAdminMargin.value,maintenanceBasic:+maintenanceBasic.value,maintenanceBusiness:+maintenanceBusiness.value,maintenanceManaged:+maintenanceManaged.value,business:business.value,tagline:tagline.value,email:email.value,phone:phone.value};save();toast('Configuración guardada')}
function saveQuote(){let c=calc(current);current={...current,price:c.rec,currency:c.currency,hours:c.h};let i=quotes.findIndex(q=>q.id===current.id);i>=0?quotes[i]={...current}:quotes.unshift({...current});save();toast('Cotización guardada')}
function proposalHTML(q){
  let c=calc(q),a=implementationPlan(q),t=infraTotals(q),r={steps:a.steps};
  const extAnnual=t.annual+t.managedMonthly*12;
  const firstYear=c.rec+t.firstYear;
  return `<!doctype html><html><head><meta charset="utf-8"><title>Propuesta</title><style>
  @page{size:A4;margin:15mm}*{box-sizing:border-box}body{font-family:Arial;color:#172033;margin:0;line-height:1.45}
  header{display:flex;justify-content:space-between;border-bottom:3px solid #2563eb;padding-bottom:16px}.logo{font-size:22px;font-weight:800}.tag{color:#64748b;font-size:12px}
  h1{font-size:29px;margin:28px 0 4px}h2{font-size:16px;margin-top:25px;color:#17427f;border-bottom:1px solid #dfe6ef;padding-bottom:6px}
  .meta,.summary{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.box{border:1px solid #dce3ed;border-radius:10px;padding:11px}.price{font-size:29px;font-weight:800;color:#174dbb}
  table{width:100%;border-collapse:collapse;font-size:11px}td,th{padding:8px;border-bottom:1px solid #e2e7ee;text-align:left}th{background:#f5f7fb}
  .callout{padding:11px;border-radius:10px;background:#eef4ff;color:#17427f}.sign{display:grid;grid-template-columns:1fr 1fr;gap:60px;margin-top:55px}.line{border-top:1px solid #555;padding-top:8px}.foot{margin-top:30px;font-size:10px;color:#667085}
  </style></head><body>
  <header><div><div class="logo">${esc(settings.business)}</div><div class="tag">${esc(settings.tagline)}</div></div><b>PROPUESTA COMERCIAL</b></header>
  <h1>${esc(q.name)}</h1><p>Preparada para <b>${esc(q.client||q.company||'Cliente')}</b> · ${new Date().toLocaleDateString('es-PE')}</p>
  <div class="meta"><div class="box"><small>Solución</small><br><b>${c.p.name}</b></div><div class="box"><small>Plazo</small><br><b>${c.p.time}</b></div><div class="box"><small>Modalidad</small><br><b>Precio cerrado</b></div></div>
  <h2>Resumen ejecutivo</h2><p>${esc(q.objective)}</p>
  <h2>Alcance incluido</h2><table>${c.selected.map(m=>`<tr><td>✓</td><td>${m.name}</td></tr>`).join('')}</table>
  <h2>Plan de implementación</h2><ol>${r.steps.slice(0,7).map(s=>`<li>${s}</li>`).join('')}</ol>
  <h2>Inversión de desarrollo</h2><div class="summary"><div class="box"><small>Honorarios MJM Solutions</small><div class="price">${money(c.rec,c.currency)}</div></div><div class="box"><small>Plazo estimado</small><b>${c.p.time}</b></div><div class="box"><small>Garantía</small><b>15 días</b></div></div>
  <h2>Costos externos y recurrentes</h2>
  <p class="callout">Estos costos corresponden a proveedores externos y no forman parte de los honorarios de desarrollo, salvo contratación expresa de un plan administrado.</p>
  <table><thead><tr><th>Servicio</th><th>Periodicidad</th><th>Estimado mensual</th><th>Estimado anual</th><th>Responsable</th></tr></thead><tbody>
    ${t.items.map(x=>`<tr><td>${x.name}</td><td>${x.period}</td><td>${money(x.monthly,c.currency)}</td><td>${money(x.annual,c.currency)}</td><td>${x.owner}</td></tr>`).join('')}
  </tbody></table>
  <h2>Resumen del primer año</h2><div class="summary"><div class="box"><small>Desarrollo inicial</small><b>${money(c.rec,c.currency)}</b></div><div class="box"><small>Infraestructura estimada</small><b>${money(extAnnual,c.currency)}</b></div><div class="box"><small>Mantenimiento anual</small><b>${money(t.maintenance*12,c.currency)}</b></div></div>
  <p><b>Total estimado del primer año:</b> ${money(firstYear,c.currency)}</p>
  <h2>Condiciones comerciales</h2><p>50% para iniciar y 50% antes de publicación. Vigencia: 10 días. Las cuentas de dominio, hosting, tiendas, APIs y pasarelas deben quedar a nombre del cliente. Los precios de proveedores pueden variar. La modalidad seleccionada para infraestructura es: <b>${infraModeLabel(q.infraMode)}</b>.</p>
  <div class="sign"><div class="line">${esc(settings.business)}<br>${esc(settings.email)} ${esc(settings.phone)}</div><div class="line">Conformidad del cliente</div></div>
  <div class="foot">Generado con QuoteOS v${V}. Los montos recurrentes son estimaciones y deben validarse al momento de contratación.</div>
  <script>setTimeout(()=>window.print(),400)<\/script></body></html>`;
}
function proposal(){let w=open('','_blank');w.document.write(proposalHTML(current));w.document.close()}function pdfQuote(id){let q=quotes.find(x=>x.id===id),w=open('','_blank');w.document.write(proposalHTML(q));w.document.close()}
function newQuote(){current=blank();go('quote')}function openQuote(id){current=JSON.parse(JSON.stringify(quotes.find(q=>q.id===id)));go('quote')}function removeQuote(id){if(confirm('¿Eliminar cotización?')){quotes=quotes.filter(q=>q.id!==id);save();history()}}
$('#menu').onclick=()=>$('#sidebar').classList.toggle('open');$('#theme').onclick=()=>{let t=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=t;localStorage.setItem('mjm_theme',t)};document.documentElement.dataset.theme=localStorage.getItem('mjm_theme')||'light';render();
