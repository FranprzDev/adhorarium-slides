import { BackgroundMode } from "./background";

export interface Slide {
  readonly id: string;
  readonly title: string;
  readonly mode: BackgroundMode;
  /** Planned speaking time in seconds. */
  readonly seconds: number;
  /** Spanish speaker notes, one paragraph per entry. */
  readonly notes: readonly string[];
  readonly html: string;
}

const PROD_HOST = "adhorarium.vercel.app";

function shot(file: string, path: string, alt: string, className = ""): string {
  return `
    <figure class="shot ${className}">
      <div class="shot-bar"><span></span><span></span><span></span><em>${PROD_HOST}${path}</em></div>
      <img src="shots/${file}.webp" alt="${alt}" />
    </figure>`;
}

function card(file: string, alt: string, className = ""): string {
  return `<figure class="shot shot-bare ${className}"><img src="shots/${file}.webp" alt="${alt}" /></figure>`;
}

function header(index: string, eyebrow: string, title: string): string {
  return `
    <header class="slide-head reveal">
      <p class="eyebrow"><span class="eyebrow-index">${index}</span>${eyebrow}</p>
      <h2>${title}</h2>
    </header>`;
}

function bullets(items: readonly string[], className = ""): string {
  return `<ul class="bullets ${className}">${items.map((item) => `<li class="reveal">${item}</li>`).join("")}</ul>`;
}

const LOGO_MARK = `<img class="mark" src="brand/adhorarium-mark.svg" alt="" />`;

export const slides: readonly Slide[] = [
  {
    id: "portada",
    title: "Portada",
    mode: BackgroundMode.Dark,
    seconds: 30,
    notes: [
      "Buenos días. Mi nombre es Francisco Miguel Perez, legajo 56355, y voy a presentar mi trabajo final de Seminario Integrador: AdHorarium, un planificador académico para las carreras de ingeniería de la UTN.",
      "La presentación dura unos veinte minutos: problema, objetivo, una recorrida por las funcionalidades con capturas reales de producción, la arquitectura y la calidad, y cierro con limitaciones y conclusiones.",
    ],
    html: `
      <div class="cover">
        <p class="cover-inst reveal">Universidad Tecnológica Nacional · Facultad Regional Tucumán</p>
        <div class="cover-brand reveal">
          ${LOGO_MARK}
          <h1 class="wordmark">Ad<span>Horarium</span></h1>
        </div>
        <p class="cover-sub reveal">Planificador académico para carreras de ingeniería de la UTN</p>
        <div class="cover-rule reveal"></div>
        <dl class="cover-meta reveal">
          <div><dt>Alumno</dt><dd>Francisco Miguel Perez</dd></div>
          <div><dt>Legajo</dt><dd>56355</dd></div>
          <div><dt>Cátedra</dt><dd>Seminario Integrador</dd></div>
          <div><dt>Carrera</dt><dd>Ingeniería en Sistemas de Información</dd></div>
        </dl>
        <p class="cover-foot reveal">Presentación del trabajo final · San Miguel de Tucumán · 2026</p>
      </div>`,
  },
  {
    id: "problema",
    title: "El problema",
    mode: BackgroundMode.Light,
    seconds: 70,
    notes: [
      "Cada estudiante de ingeniería avanza por un plan con un régimen de correlatividades: para cursar una materia necesita otras regularizadas o aprobadas, y para rendir el final necesita las correlativas aprobadas.",
      "A eso se suma que en la Regional Tucumán los finales se organizan en tres mesas, Mesa I, II y III, y que armar el cuatrimestre implica elegir comisiones sin que los horarios se pisen.",
      "Hoy esa información se reconstruye cruzando a mano el plan de cada departamento, los listados de mesas, SYSACAD, planillas propias y consultas entre compañeros. SYSACAD resuelve lo administrativo, pero no está pensado para planificar. Existen herramientas de estudiantes de otras facultades, como FIUBA Map o Plan UTN de FRBA, pero ninguna orientada a los planes y mesas de FRT.",
    ],
    html: `
      ${header("01", "El problema", "Planificar la carrera hoy es cruzar fuentes dispersas")}
      <div class="grid-problem">
        <div class="pain-list">
          <article class="pain reveal">
            <div class="pain-icon">⇄</div>
            <div><h3>Correlativas</h3><p>Para cursar, otras materias regularizadas o aprobadas; para rendir el final, las correlativas aprobadas.</p></div>
          </article>
          <article class="pain reveal">
            <div class="pain-icon">▦</div>
            <div><h3>Horarios</h3><p>Elegir comisiones para el cuatrimestre sin superposiciones se resuelve a mano.</p></div>
          </article>
          <article class="pain reveal">
            <div class="pain-icon">Ⅲ</div>
            <div><h3>Mesas de examen</h3><p>Los finales de FRT se rinden en Mesa I, II y III: hay que saber en cuál va cada materia.</p></div>
          </article>
        </div>
        <aside class="sources reveal">
          <p class="aside-label">Lo que hoy se cruza a mano</p>
          <ul>
            <li>Planes y régimen de correlatividades de cada departamento</li>
            <li>Listados de mesas de examen</li>
            <li>SYSACAD, la autogestión de la Facultad</li>
            <li>Planillas personales</li>
            <li>Consultas entre compañeros</li>
          </ul>
          <p class="aside-note">SYSACAD resuelve la gestión administrativa, pero no está orientado a la planificación. Las herramientas de estudiantes existentes (FIUBA Map, Plan UTN de FRBA, UTN-Correlativas de FRLP) no cubren los planes ni las mesas de FRT.</p>
        </aside>
      </div>`,
  },
  {
    id: "objetivo",
    title: "Objetivo y alcance",
    mode: BackgroundMode.Light,
    seconds: 70,
    notes: [
      "El objetivo general fue desarrollar una aplicación web, usable desde computadora y celular, para que los estudiantes de ingeniería de FRT consulten el plan de correlativas, registren su situación académica, planifiquen qué cursar y en qué mesa rendir, y armen su horario sin superposiciones, con datos que mantiene un administrador.",
      "En el alcance entran la consulta pública del plan, el ciclo completo de la cuenta, los estados y notas, cargados a mano o importados desde SYSACAD, las mesas, el perfil con GPA, el gestor de horarios con los horarios oficiales de Sistemas, el asistente, el panel de administración con importación de comisiones y el monitoreo sin costo.",
      "Quedan afuera, a propósito, la inscripción a cursado o exámenes, que es del sistema oficial; las fechas de mesas; una conexión directa con SYSACAD, porque AdHorarium nunca recibe las credenciales del estudiante; los horarios de las otras carreras; generar un horario completo automáticamente; y publicar la extensión en las tiendas.",
    ],
    html: `
      ${header("02", "Objetivo y alcance", "Un solo lugar para planificar la carrera")}
      <blockquote class="goal reveal">Aplicación web, accesible desde computadoras y móviles, para que los estudiantes de ingeniería de la UTN-FRT consulten su plan de correlativas, registren su situación académica, planifiquen qué cursar y en qué mesa rendir, y armen su horario sin superposiciones, con datos administrables por un responsable autorizado.</blockquote>
      <div class="scope">
        <section class="scope-col scope-in reveal">
          <h3>Incluido</h3>
          <ul class="chips">
            <li>Plan de correlativas público</li><li>Planes 2023 y 2008 · electivas</li><li>Cuenta: registro, recuperación, confirmación, baja</li>
            <li>Estados y notas</li><li>Importar desde SYSACAD</li><li>Buscador de mesas</li><li>Perfil con promedio y GPA</li>
            <li>Horarios oficiales de Sistemas</li><li>Exportar · compartir · importar</li><li>Asistente de horarios</li>
            <li>Administración e importación de comisiones</li><li>Monitoreo sin costo</li>
          </ul>
        </section>
        <section class="scope-col scope-out reveal">
          <h3>Excluido</h3>
          <ul class="chips">
            <li>Inscripción a cursado y exámenes</li><li>Fechas de las mesas</li><li>Conexión directa con SYSACAD</li>
            <li>Horarios oficiales de otras carreras</li><li>Horario completo automático</li><li>Extensión en las tiendas</li>
          </ul>
        </section>
      </div>`,
  },
  {
    id: "actores",
    title: "Usuarios y actores",
    mode: BackgroundMode.Light,
    seconds: 45,
    notes: [
      "Hay tres actores principales. El visitante, sin cuenta, consulta el plan público, explora el modo demostración, puede ver un horario compartido y recuperar su contraseña. El estudiante registra su situación, también importándola desde SYSACAD, consulta mesas y perfil, arma su horario, usa el asistente y gestiona su cuenta. El administrador mantiene materias, correlativas y comisiones, y puede importar los horarios desde un archivo.",
      "Como actores secundarios están Google, para el inicio de sesión alternativo; Vercel AI Gateway, que da acceso al modelo de lenguaje; SYSACAD, cuya página la abre el propio estudiante; y Brevo, el servicio de correo. En total el modelo tiene veinticinco casos de uso.",
    ],
    html: `
      ${header("03", "Usuarios y actores", "Tres roles, veinticinco casos de uso")}
      <div class="actors">
        <article class="actor reveal">
          <p class="actor-tag">Visitante</p>
          <h3>Sin cuenta</h3>
          <ul><li>Plan de correlativas público</li><li>Modo demostración</li><li>Ver y exportar un horario compartido</li><li>Registrarse, ingresar y recuperar la contraseña</li></ul>
          <p class="actor-cu"><span class="nowrap">CU01 – CU03</span> · CU16 · CU17 · CU21</p>
        </article>
        <article class="actor actor-main reveal">
          <p class="actor-tag">Estudiante · rol student</p>
          <h3>Planifica su carrera</h3>
          <ul><li>Registra estados y notas o los trae de SYSACAD</li><li>Consulta mesas y su perfil</li><li>Arma, exporta, comparte e importa horarios</li><li>Usa el asistente; confirma o elimina su cuenta</li></ul>
          <p class="actor-cu"><span class="nowrap">CU04 – CU11</span> · CU15 · <span class="nowrap">CU17 – CU19</span> · <span class="nowrap">CU22 – CU24</span></p>
        </article>
        <article class="actor reveal">
          <p class="actor-tag">Administrador · rol admin</p>
          <h3>Mantiene los datos</h3>
          <ul><li>Materias de cada carrera</li><li>Correlativas para cursar y para rendir</li><li>Comisiones con días, horas y aulas</li><li>Importación de comisiones</li></ul>
          <p class="actor-cu"><span class="nowrap">CU11 – CU14</span> · CU20 · CU23 · CU25</p>
        </article>
      </div>
      <div class="secondary reveal">
        <span class="secondary-label">Actores secundarios</span>
        <span class="pill">Google · OAuth 2.0</span>
        <span class="pill">Vercel AI Gateway</span>
        <span class="pill">SYSACAD · vía el navegador</span>
        <span class="pill">Brevo · correo</span>
        <span class="pill pill-brass">CU01 – CU25</span>
      </div>`,
  },
  {
    id: "demo-plan",
    title: "Plan de correlativas y gestor de materias",
    mode: BackgroundMode.Light,
    seconds: 90,
    notes: [
      "Empiezo por el corazón del sistema. El plan de correlativas se muestra por niveles, y se puede consultar sin registrarse, eligiendo la carrera y el plan.",
      "Al tocar una materia se ve qué necesita para cursarse y qué materias habilita. En la captura, Paradigmas de Programación: necesita Lógica y Estructuras Discretas y Algoritmos y Estructuras de Datos, y habilita, entre otras, Desarrollo de Software, Diseño de Sistemas de Información, el Seminario Integrador y electivas, que llevan su etiqueta.",
      "En el gestor de materias el estudiante marca cada materia como no cursada, cursando, regular o promocionada, y carga la nota de las promocionadas. El cambio se ve al instante, se confirma con un aviso y, si el servidor lo rechaza, se revierte.",
      "Hay seis planes cargados de cinco carreras: Sistemas en sus planes 2023 y 2008, con sus electivas y el Seminario Integrador, Electrónica, Civil, Mecánica y Energía Eléctrica.",
    ],
    html: `
      ${header("04", "Funcionalidades · Plan y materias", "El plan de estudios como un grafo de correlativas")}
      <div class="demo">
        <div class="demo-text">
          ${bullets([
            "<strong>Plan por niveles</strong>, público y sin registrarse: 6 planes de 5 carreras, con Sistemas <strong>2023 y 2008</strong>.",
            "<strong>Dependencias</strong>: al tocar una materia, qué necesita para cursarse y qué habilita; las <strong>electivas</strong> llevan su etiqueta.",
            "<strong>Estados</strong>: no cursada, cursando, regular o promocionada, con la nota final de las promocionadas.",
            "Cambio inmediato con aviso; <strong>se revierte</strong> si el servidor lo rechaza.",
          ])}
        </div>
        <div class="demo-media stack">
          ${shot("dashboard-plan", "/dashboard", "Plan de correlativas de Ingeniería en Sistemas de Información por niveles", "stack-back reveal")}
          ${card("dependencias-zoom", "Vista de dependencias de Paradigmas de Programación: qué necesita y qué habilita", "stack-front stack-zoom reveal")}
        </div>
      </div>`,
  },
  {
    id: "demo-sysacad",
    title: "Importar desde SYSACAD",
    mode: BackgroundMode.Light,
    seconds: 75,
    notes: [
      "Para reducir la carga inicial de datos, el estudiante puede traer su estado académico desde SYSACAD en lugar de cargar materia por materia.",
      "Entra a SYSACAD con su propio usuario y abre «Estado académico». Una extensión para Chrome, Edge y Firefox, sin permisos adicionales, detecta la tabla y agrega el botón «Llevar a AdHorarium». Los datos viajan en el fragmento de la URL, que el navegador no transmite al servidor en la solicitud: solo lo lee la página de AdHorarium, después de iniciar sesión. AdHorarium nunca conoce su usuario ni su contraseña. Sin la extensión, puede copiar la tabla y pegarla.",
      "Antes de guardar, una vista previa muestra qué materias son nuevas, cuáles avanzan y cuáles reciben nota, y lista para revisar las filas ambiguas o de otro plan, como el curso de ingreso. Cada fila se vincula por nombre exacto, por prefijo o por similitud. El modo Combinar nunca baja un estado; Reemplazar deja que SYSACAD mande, sin borrar una nota existente.",
      "Las capturas usan un estado académico ficticio, «Alumno, Ejemplo», con notas, tomos y folios inventados, que forma parte de las pruebas del repositorio. No se guardan el legajo, el tomo ni el folio.",
    ],
    html: `
      ${header("05", "Funcionalidades · Importar desde SYSACAD", "Del estado académico al plan, sin cargar a mano")}
      <div class="demo">
        <div class="demo-text">
          <ol class="flow reveal">
            <li><span>1</span><p>El estudiante abre <strong>«Estado académico»</strong> con su propia sesión</p></li>
            <li><span>2</span><p>La extensión agrega <strong>«Llevar a AdHorarium»</strong>, o pega la tabla</p></li>
            <li><span>3</span><p><strong>Vista previa</strong>: nuevas, avanzan, con nota y para revisar</p></li>
          </ol>
          ${bullets([
            "Extensión Manifest V3 para Chrome, Edge y Firefox, <strong>sin permisos</strong>; nunca recibe credenciales.",
            "Vínculo por nombre exacto, prefijo o similitud; filas de <strong>otro plan</strong> a revisar.",
            "<strong>Combinar</strong> nunca baja un estado; <strong>Reemplazar</strong> no borra notas.",
          ], "bullets-compact")}
        </div>
        <div class="demo-media stack">
          ${shot("sysacad-vista-previa", "/importar/sysacad", "Vista previa de la importación desde SYSACAD con materias nuevas, que avanzan y para revisar", "stack-back reveal")}
          ${card("sysacad-extension", "Barra «Llevar a AdHorarium» de la extensión sobre un Estado académico de ejemplo", "stack-front stack-zoom reveal")}
        </div>
      </div>`,
  },
  {
    id: "demo-horarios",
    title: "Gestor de horarios",
    mode: BackgroundMode.Light,
    seconds: 100,
    notes: [
      "En el gestor de horarios el estudiante agrega una materia y elige una de sus comisiones del catálogo; si la materia no tiene comisiones cargadas, puede cargar los días y horas a mano.",
      "El catálogo ya tiene los horarios oficiales del segundo cuatrimestre de 2026 del Departamento de Sistemas: 203 comisiones de los planes 2023 y 2008, cada una con su fuente y su fecha de actualización.",
      "El sistema detecta superposiciones: dos franjas chocan solo si son el mismo día y sus rangos se cruzan. En la captura, la comisión 2K02 de Paradigmas se pisa el lunes con Análisis Matemático II: el aviso arriba, los bloques en rojo y lado a lado en la grilla.",
      "En el panel lateral cada comisión avisa antes de elegirla si se superpone con otra materia, y con un clic se cambia por la que no choca. Esta lógica es una función pura, cubierta por pruebas unitarias.",
    ],
    html: `
      ${header("06", "Funcionalidades · Horarios", "Armar el cuatrimestre sin superposiciones")}
      <div class="demo demo-wide">
        <div class="demo-media">
          ${shot("horarios-superposicion", "/dashboard/horarios", "Gestor de horarios con una superposición marcada en rojo", "reveal")}
        </div>
        <div class="demo-side">
          ${card("horarios-comisiones", "Selector de comisiones con aviso de superposición", "reveal side-card")}
          ${bullets([
            "<strong>Horarios oficiales</strong> 2.º cuatr. 2026 de Sistemas, o carga manual.",
            "Choque solo si es <strong>el mismo día</strong> y los rangos se cruzan.",
            "Conflictos en rojo, <strong>lado a lado</strong> en la grilla.",
          ], "bullets-compact")}
        </div>
      </div>`,
  },
  {
    id: "demo-compartir",
    title: "Exportar, compartir e importar",
    mode: BackgroundMode.Light,
    seconds: 60,
    notes: [
      "El horario se exporta a PDF o a imagen PNG. Las dos salidas usan el mismo código de dibujo en el navegador: el PDF es vectorial con jsPDF y la imagen se dibuja en un canvas de 3508 por 2480 píxeles, una A4 a unos 300 ppp. No consume servidor.",
      "También se comparte con un enlace de solo lectura. El identificador es aleatorio de 128 bits y el enlace guarda una instantánea sin datos personales.",
      "Otro estudiante lo abre y lo importa: puede combinarlo con el suyo o reemplazarlo. Se omiten materias de otras carreras y comisiones eliminadas.",
    ],
    html: `
      ${header("07", "Funcionalidades · Exportar y compartir", "Del horario propio al de todo el grupo")}
      <div class="trio">
        <article class="trio-item reveal">
          <div class="trio-media trio-paper">${card("horario-ejemplo", "Horario exportado en formato A4 apaisado")}</div>
          <h3>Exportar</h3>
          <p>PDF vectorial (jsPDF) y PNG de 3508 × 2480 px con el mismo código de dibujo, generados en el navegador.</p>
        </article>
        <article class="trio-item reveal">
          <div class="trio-media">${shot("compartido-publico", "/horarios/compartido/…", "Vista pública de un horario compartido")}</div>
          <h3>Compartir</h3>
          <p>Enlace de solo lectura con identificador aleatorio de 128 bits y una instantánea sin datos personales.</p>
        </article>
        <article class="trio-item reveal">
          <div class="trio-media">${shot("compartido-importar", "/horarios/compartido/…", "Diálogo para importar un horario compartido")}</div>
          <h3>Importar</h3>
          <p>Combinar con el horario propio o reemplazarlo; se omiten otras carreras y comisiones eliminadas.</p>
        </article>
      </div>`,
  },
  {
    id: "demo-asistente",
    title: "Asistente de horarios con IA",
    mode: BackgroundMode.Light,
    seconds: 70,
    notes: [
      "El asistente de horarios es un chat de solo consulta. Responde qué materias puedo cursar, qué finales puedo rendir o qué combinación de comisiones no se superpone. En la captura, el estudiante pregunta qué comisiones de Física II no chocan con su horario guardado: responde 2K01, 2K02, 2K04, 2K06 y 2K07, y explica por qué 2K03 y 2K05 se superponen.",
      "La decisión de diseño clave: lo que tiene que ser exacto se calcula por código. Las materias habilitadas para cursar o rendir se calculan en el servidor y se le entregan al modelo como listas; el modelo solo lo explica en lenguaje natural.",
      "Usa el AI SDK de Vercel sobre Vercel AI Gateway, con el modelo openai/gpt-4.1-mini configurable por variable de entorno. No tiene herramientas, así que no puede modificar datos, y sus instrucciones le prohíben inventar horarios. Además limita el tamaño de las preguntas y las solicitudes por usuario.",
    ],
    html: `
      ${header("08", "Funcionalidades · Asistente", "Un modelo de lenguaje anclado en datos del sistema")}
      <div class="demo">
        <div class="demo-text">
          <ol class="flow reveal">
            <li><span>1</span><p>Plan, estados, comisiones y horario guardado</p></li>
            <li><span>2</span><p>El servidor <strong>calcula</strong> qué se puede cursar y rendir</p></li>
            <li><span>3</span><p>El modelo <strong>explica</strong>; no decide ni escribe</p></li>
          </ol>
          ${bullets([
            "AI SDK + <strong>Vercel AI Gateway</strong>, modelo <code>openai/gpt-4.1-mini</code> por variable de entorno.",
            "<strong>Sin herramientas</strong>: no modifica datos; tiene prohibido inventar horarios.",
            "Límites de tamaño de la conversación y de solicitudes por usuario.",
          ], "bullets-compact")}
        </div>
        <div class="demo-media stack stack-chat">
          ${shot("asistente", "/dashboard/horarios", "Asistente de horarios abierto sobre el gestor de horarios", "stack-back reveal")}
          ${card("asistente-zoom", "Respuesta del asistente comparando comisiones sin superposiciones", "stack-front stack-tall reveal")}
        </div>
      </div>`,
  },
  {
    id: "demo-admin",
    title: "Panel de administración",
    mode: BackgroundMode.Light,
    seconds: 60,
    notes: [
      "El panel de administración solo lo ve el rol admin; el rol se verifica en el servidor, y un estudiante que entra a /admin termina en Acceso denegado.",
      "Desde acá se dan de alta, modifican y eliminan materias y correlativas, con filtro por carrera, búsqueda por nombre o número y paginación. Cada correlativa indica su propósito, para cursar o para rendir, y su condición, regular o aprobada, y se valida la integridad del plan: misma carrera, sin autorreferencias, sin ciclos y sin requerir materias de un nivel superior.",
      "También se gestiona el catálogo de comisiones. Los horarios de un cuatrimestre se importan de una vez desde un CSV o JSON con una fila por clase: el servidor valida cada fila, detecta superposiciones y filas contradictorias, y muestra una vista previa de comisiones nuevas, con cambios y sin cambios. Repetir la importación no cambia nada y las comisiones existentes conservan su identificador, así que los horarios de los estudiantes siguen apuntando a ellas. Así se cargaron los horarios oficiales.",
    ],
    html: `
      ${header("09", "Funcionalidades · Administración", "Datos que se corrigen sin desplegar código")}
      <div class="demo">
        <div class="demo-text">
          ${bullets([
            "Acceso solo con <strong>rol admin</strong>, verificado en el servidor.",
            "ABM de materias y correlativas: <strong>propósito</strong> (cursar / rendir) y <strong>condición</strong> (regular / aprobada); sin ciclos ni autorreferencias.",
            "Filtro por carrera, búsqueda por nombre o número y <strong>paginación</strong>.",
            "<strong>Importar comisiones</strong> desde CSV o JSON con vista previa; repetirla no cambia nada.",
          ])}
        </div>
        <div class="demo-media stack">
          ${shot("admin-panel", "/admin", "Panel de administración con el listado de materias", "stack-back reveal")}
          ${card("admin-importar-comisiones", "Diálogo «Importar comisiones» con la vista previa de un archivo CSV", "stack-front stack-front-wide reveal")}
        </div>
      </div>`,
  },
  {
    id: "arquitectura",
    title: "Arquitectura y stack",
    mode: BackgroundMode.Light,
    seconds: 100,
    notes: [
      "La arquitectura es cliente-servidor en capas, implementada como un monolito Next.js desplegado en Vercel: un solo proyecto y un solo despliegue.",
      "En el navegador, React 19 con Tailwind y shadcn/ui; la exportación a PDF y PNG se genera ahí. Aparte, la extensión del navegador corre solo en la página de SYSACAD y comparte el mismo lector de la tabla que la página web. En el servidor, Next.js 15 con App Router: Server Components, Server Actions y Route Handlers. Auth.js resuelve la sesión y antes de cualquier operación se verifica el rol.",
      "La lógica de negocio vive en funciones puras de TypeScript: correlativas, integridad de planes, GPA, superposiciones, importaciones y el lector de SYSACAD. Por eso se prueban de forma unitaria.",
      "Los datos están en Neon PostgreSQL, en AWS us-east-1, y solo el servidor se conecta, con Drizzle ORM. El asistente llega al modelo a través de Vercel AI Gateway, autenticado con el token OIDC del despliegue. Los correos de la cuenta salen por Brevo a través de un proveedor intercambiable, y el monitoreo usa Web Analytics y Speed Insights de Vercel, sin costo. GitHub Actions verifica cada pull request y cada integración a main se despliega sola.",
    ],
    html: `
      ${header("10", "Arquitectura y stack", "Cliente-servidor en capas sobre un monolito Next.js")}
      <div class="arch reveal">
        <div class="arch-col">
          <p class="arch-label">Navegador</p>
          <div class="arch-box">
            <h4>Presentación</h4>
            <p>React 19 · Tailwind CSS · shadcn/ui · Zustand</p>
            <p class="arch-sub">Exportación PDF (jsPDF) y PNG (canvas)</p>
          </div>
          <div class="arch-box"><h4>Extensión para SYSACAD</h4><p>Manifest V3 · Chrome, Edge, Firefox · sin permisos</p></div>
          <div class="arch-box arch-ci"><h4>Dispositivo del usuario</h4><p>Computadora, tablet o teléfono con Chrome, Firefox, Edge o Safari</p></div>
        </div>
        <div class="arch-arrow">HTTPS</div>
        <div class="arch-col arch-server">
          <p class="arch-label">Vercel · funciones serverless</p>
          <div class="arch-box arch-strong">
            <h4>Aplicación · Next.js 15 (App Router)</h4>
            <p>Server Components · Server Actions · Route Handlers</p>
          </div>
          <div class="arch-row">
            <div class="arch-box"><h4>Auth.js v5</h4><p>Correo + contraseña (bcrypt) · Google · JWT</p></div>
            <div class="arch-box"><h4>Autorización</h4><p>Rol student / admin en el servidor</p></div>
          </div>
          <div class="arch-box arch-brass"><h4>Dominio · funciones puras TypeScript</h4><p>Correlativas · integridad · GPA · superposiciones · importaciones · lector de SYSACAD · contexto del asistente</p></div>
          <div class="arch-box"><h4>Acceso a datos · Drizzle ORM</h4><p>Driver serverless de Neon</p></div>
        </div>
        <div class="arch-arrow">TLS</div>
        <div class="arch-col">
          <p class="arch-label">Servicios externos</p>
          <div class="arch-box"><h4>Neon PostgreSQL</h4><p>Serverless · AWS us-east-1</p></div>
          <div class="arch-box"><h4>Vercel AI Gateway</h4><p>AI SDK · <code>openai/gpt-4.1-mini</code> · token OIDC</p></div>
          <div class="arch-box"><h4>Google Identity</h4><p>OAuth 2.0 / OpenID Connect</p></div>
          <div class="arch-box"><h4>Brevo · Vercel Analytics</h4><p>Correos de la cuenta · uso, rendimiento y errores</p></div>
          <div class="arch-box arch-ci"><h4>GitHub Actions → Vercel</h4><p>CI en cada PR · despliegue continuo</p></div>
        </div>
      </div>`,
  },
  {
    id: "datos",
    title: "Modelo de datos",
    mode: BackgroundMode.Light,
    seconds: 50,
    notes: [
      "El modelo de datos está en PostgreSQL y se define como código con Drizzle; evoluciona con seis migraciones versionadas, todas aplicadas en producción: el esquema inicial, el hash de contraseña, las tablas de horarios, la fuente de las comisiones, los tokens de un solo uso con la tabla de salida de correos y la confirmación del correo. El plan 2008, las electivas y el Seminario Integrador no necesitaron cambios de esquema: un plan distinto es otra carrera, ISI-2008.",
      "Hay cuatro grupos: el académico, con carreras, materias, correlativas con propósito y condición, y mesas; los usuarios con el modelo de Auth.js ampliado con rol, carrera, hash y fecha de confirmación del correo, más los tokens; los estados de cada materia por usuario; y los horarios: comisiones con sus franjas en jsonb y su fuente, las entradas del horario de cada estudiante y los horarios compartidos.",
    ],
    html: `
      ${header("11", "Modelo de datos", "PostgreSQL definido como código con Drizzle")}
      <div class="erd">
        <section class="erd-group reveal">
          <h3>Académico</h3>
          <div class="table-card"><b>careers</b><span>código (ISI, ISI-2008, …) · nombre · plan</span></div>
          <div class="table-card"><b>subjects</b><span>número · nivel 1–6 · electiva · ciencias básicas · mesa</span></div>
          <div class="table-card"><b>subject_correlatives</b><span>propósito cursar / rendir · condición regulares / aprobadas</span></div>
          <div class="table-card"><b>exam_tables</b><span>Mesa I · Mesa II · Mesa III</span></div>
        </section>
        <section class="erd-group reveal">
          <h3>Usuarios · Auth.js</h3>
          <div class="table-card"><b>users</b><span>rol · carrera · password_hash (bcrypt) · email_verified</span></div>
          <div class="table-card"><b>accounts</b><span>cuentas OAuth vinculadas (Google)</span></div>
          <div class="table-card"><b>user_tokens</b><span>recuperación o confirmación · hash SHA-256 · vencimiento</span></div>
          <div class="table-card table-muted"><b>sessions · verification_tokens · mail_outbox</b><span>del adaptador, sin uso (JWT) · salida de correos solo para pruebas</span></div>
        </section>
        <section class="erd-group reveal">
          <h3>Situación académica</h3>
          <div class="table-card"><b>user_subject_states</b><span>no_cursada · cursando · regular · promocionada · nota 1–10 solo si promocionada</span></div>
        </section>
        <section class="erd-group reveal">
          <h3>Horarios</h3>
          <div class="table-card"><b>commissions</b><span>turno · período · franjas en jsonb&nbsp;· cuatrimestre y fuente</span></div>
          <div class="table-card"><b>schedule_entries</b><span>commission o custom · restricción check</span></div>
          <div class="table-card"><b>schedule_shares</b><span>id aleatorio de 22 caracteres · instantánea jsonb</span></div>
        </section>
      </div>
      <p class="migrations reveal"><span>Migraciones</span><code>0000</code> – <code>0005</code> esquema · contraseña · horarios · fuente de comisiones · tokens · confirmación del correo · las seis aplicadas en producción</p>`,
  },
  {
    id: "seguridad",
    title: "Seguridad",
    mode: BackgroundMode.Light,
    seconds: 60,
    notes: [
      "En seguridad, las contraseñas se guardan solo como hash bcrypt con factor 12; se exige un mínimo de 10 caracteres con letras y números y un máximo de 72 bytes, que es el límite de bcrypt. Seguimos la guía de OWASP. Para evitar fuerza bruta hay límites de intentos, y el mensaje y el tiempo de respuesta son siempre los mismos, para no revelar si una cuenta existe.",
      "Los enlaces de recuperación y de confirmación usan tokens aleatorios de un solo uso; en la base solo se guarda su hash SHA-256 con vencimiento: 30 minutos para recuperar la contraseña y 24 horas para confirmar el correo.",
      "La sesión es un JWT en una cookie HttpOnly firmada y cifrada; el rol se verifica en el servidor. La suite E2E encontró que, si se pulsaba Salir mientras el panel cargaba, una respuesta en curso volvía a guardar la cookie; el PR 67 hizo que las respuestas en segundo plano ya no la renueven.",
      "El estudiante puede eliminar su cuenta con todos sus datos, de acuerdo con los derechos de la Ley 25.326, y la importación desde SYSACAD nunca maneja sus credenciales.",
    ],
    html: `
      ${header("12", "Seguridad", "Responsabilidades nuevas, resueltas con la guía de OWASP")}
      <div class="sec-grid">
        <article class="sec reveal"><h3>Contraseñas</h3><p>Solo <strong>hash bcrypt</strong> con factor 12; mínimo 10 caracteres, máximo 72 bytes; límites de intentos y <strong>sin enumeración</strong>.</p></article>
        <article class="sec reveal"><h3>Tokens de un solo uso</h3><p>Recuperación y confirmación: solo el <strong>hash SHA-256</strong>, con vencimiento de 30 min y 24 h.</p></article>
        <article class="sec reveal"><h3>Sesión</h3><p>JWT en <strong>cookie HttpOnly</strong>; las respuestas en segundo plano ya no la renuevan tras «Salir» (PR #67).</p></article>
        <article class="sec reveal"><h3>Autorización</h3><p>Rol verificado <strong>en el servidor</strong>; la base no es accesible desde el navegador; el registro solo crea estudiantes.</p></article>
        <article class="sec reveal"><h3>Datos personales</h3><p><strong>Eliminación de la cuenta</strong> con todos sus datos (Ley 25.326); SYSACAD sin credenciales de por medio.</p></article>
        <article class="sec reveal"><h3>Endurecimiento</h3><p>Credenciales fuera del repositorio (PR #16); Next.js 15.5.27 corrige la <strong>CVE-2025-66478</strong> (PR #17).</p></article>
      </div>`,
  },
  {
    id: "calidad",
    title: "Calidad",
    mode: BackgroundMode.Light,
    seconds: 75,
    notes: [
      "En calidad, la lógica de dominio se extrajo a funciones puras y, junto con el acceso a datos, se cubre con 401 pruebas de Vitest en 37 archivos; ese es el resultado sobre la rama principal en el commit 6c9589a, del PR 67.",
      "Cubren la conversión GPA, las correlativas, la integridad de cada plan, incluido el 2008, las reglas del panel, la autenticación y el ciclo de vida de la cuenta, los horarios, las dos importaciones, el lector de SYSACAD y el asistente con un modelo simulado. Las pruebas de integración corren contra PGlite, un PostgreSQL en memoria con el mismo esquema que producción.",
      "Además hay una suite end-to-end con TesterArmy e2e: 78 casos en 13 archivos que recorren el sitio de producción como lo haría un usuario. En la corrida final del 16 de octubre, sobre la versión 6c9589a, aprobaron los 70 casos ejecutables y los 10 de preparación, 80 de 80; los 8 restantes leen correos de una tabla que solo existe fuera de producción y se omiten por diseño. La suite encontró dos defectos reales: el mensaje de una nota inválida oculto detrás del diálogo, y la sesión que seguía activa después de Salir.",
      "Cada pull request pasa por cuatro verificaciones en GitHub Actions: lint, tipos, pruebas y compilación.",
    ],
    html: `
      ${header("13", "Calidad", "Cada cambio verificado antes de integrarse")}
      <div class="quality">
        <div class="stats">
          <div class="stat reveal"><b>401</b><span>pruebas automatizadas (Vitest) en 37 archivos</span></div>
          <div class="stat reveal"><b>78</b><span>casos E2E (TesterArmy e2e) en 13 archivos</span></div>
          <div class="stat reveal"><b>80/80</b><span>casos y preparaciones aprobados en producción; 8 omitidos por diseño</span></div>
          <div class="stat reveal"><b>4</b><span>verificaciones por PR: Lint · Typecheck · Test · Build</span></div>
        </div>
        <div class="suites reveal">
          <p class="aside-label">Qué se prueba</p>
          <ul class="chips chips-dark">
            <li>Conversión GPA</li><li>Correlativas</li><li>Integridad de los planes</li><li>Reglas del panel</li>
            <li>Autenticación y cuenta</li><li>Superposiciones</li><li>Importaciones y SYSACAD</li><li>Asistente simulado</li>
            <li>Integración con PGlite</li>
          </ul>
          <p class="aside-label aside-label-gap">Casos E2E sobre producción</p>
          <ul class="chips">
            <li>Públicas · 8</li><li>Autenticación · 8</li><li>Estudiante · 7</li><li>Horarios · 10</li>
            <li>Importar horario · 3</li><li>Asistente · 1</li><li>Administración · 15</li><li>Recuperación · 7</li>
            <li>Comisiones · 4</li><li>SYSACAD · 4</li><li>Confirmación · 4</li><li>Baja de cuenta · 4</li><li>Plan 2008 · 3</li>
          </ul>
          <p class="aside-note">Vitest: rama principal en <code>6c9589a</code> (PR #67). E2E: corrida final del 16/10/2026, 12:12–12:18, sobre https://adhorarium.vercel.app en <code>6c9589a</code>: 70 casos y 10 preparaciones aprobados, 0 fallas, 319 s. Dos defectos reales encontrados (PR #36–#37 y #67).</p>
        </div>
      </div>`,
  },
  {
    id: "metodologia",
    title: "Metodología e historial",
    mode: BackgroundMode.Light,
    seconds: 55,
    notes: [
      "La metodología fue iterativa e incremental con prácticas ágiles, documentada con UML, usando las fases del Proceso Unificado como marco para ordenar los artefactos. Al ser un proyecto individual no hubo ceremonias formales.",
      "Cada incremento se hizo en una rama propia y entró a main por pull request, con integración continua y despliegue continuo en Vercel. El historial registra 67 pull requests, 65 de ellos integrados.",
      "La versión 1 es de junio de 2025, con Supabase. Tras una pausa larga, en octubre de 2026 se endureció el proyecto, se migró a Neon, Drizzle y Auth.js, y se sumaron la identidad visual, el asistente, el ingreso con contraseña y el gestor de horarios. El 16 de octubre llegaron la suite E2E y la auditoría de calidad, y después el ciclo de vida de la cuenta, los horarios oficiales, la importación desde SYSACAD y el plan 2008 con las electivas.",
    ],
    html: `
      ${header("14", "Metodología e historial", "Iterativo e incremental, un pull request por incremento")}
      <div class="method-tags reveal">
        <span class="pill">Prácticas ágiles</span><span class="pill">UML</span><span class="pill">Fases del Proceso Unificado como marco</span>
        <span class="pill">Ramas feat/ · fix/ · chore/</span><span class="pill pill-brass">67 pull requests · 65 integrados</span>
      </div>
      <ol class="timeline">
        <li class="reveal"><time>May–jun 2025</time><h4>Versión 1</h4><p>Prototipo inicial y PR #1–#14: planes, mesas, gestor de materias, perfil GPA. Supabase.</p></li>
        <li class="reveal tl-pause"><time>Jun 2025 – sep 2026</time><h4>Pausa</h4><p>Al retomar: credenciales versionadas y despliegues fallidos desde el 05/09/2026.</p></li>
        <li class="reveal"><time>13–14/10/2026</time><h4>Versión 2</h4><p>PR #16–#27: endurecimiento, Neon + Drizzle, Auth.js v5, panel de administración.</p></li>
        <li class="reveal"><time>15/10/2026</time><h4>Versiones 2.1 – 2.3</h4><p>PR #28–#35: identidad visual, asistente, correo + contraseña, gestor de horarios.</p></li>
        <li class="reveal"><time>16/10 · madrugada</time><h4>Versión 2.4</h4><p>PR #36–#48: suite E2E, accesibilidad, página 404 y correcciones.</p></li>
        <li class="reveal"><time>16/10 · mañana</time><h4>Versiones 2.5 – 2.8</h4><p>PR #49–#67: cuenta, horarios oficiales, SYSACAD, plan 2008 y electivas.</p></li>
      </ol>`,
  },
  {
    id: "resultados",
    title: "Resultados",
    mode: BackgroundMode.Light,
    seconds: 55,
    notes: [
      "Como resultado, AdHorarium está en producción en adhorarium.vercel.app, con los veinticinco casos de uso implementados y todos los módulos habilitados.",
      "La base tiene 288 materias y 1244 correlatividades de seis planes, verificadas en producción, más las tres mesas de examen y 203 comisiones oficiales de Sistemas. Los planes se cargan con scripts reproducibles desde archivos versionados, y cada materia del plan 2008 y de las electivas indica el documento oficial del que se leyó.",
      "Funciona en celular y en computadora, con modo claro y oscuro.",
    ],
    html: `
      ${header("15", "Resultados", "En producción, con datos reales de seis planes")}
      <div class="results">
        <div class="results-main">
          <div class="stats stats-row">
            <div class="stat reveal"><b>288</b><span>materias</span></div>
            <div class="stat reveal"><b>1244</b><span>correlatividades</span></div>
            <div class="stat reveal"><b>203</b><span>comisiones oficiales</span></div>
            <div class="stat reveal"><b>25</b><span>casos de uso</span></div>
          </div>
          <table class="careers reveal">
            <thead><tr><th>Carrera · plan</th><th>Materias</th><th>Correlatividades</th><th>Comisiones</th></tr></thead>
            <tbody>
              <tr><td>Sistemas de Información · 2023</td><td>65</td><td>248</td><td>173</td></tr>
              <tr><td>Sistemas de Información · 2008</td><td>64</td><td>334</td><td>30</td></tr>
              <tr><td>Electrónica · 2025a</td><td>37</td><td>118</td><td>0</td></tr>
              <tr><td>Civil · 2023</td><td>41</td><td>259</td><td>0</td></tr>
              <tr><td>Mecánica · 2023</td><td>40</td><td>132</td><td>0</td></tr>
              <tr><td>Energía Eléctrica · 2023</td><td>41</td><td>153</td><td>0</td></tr>
            </tbody>
          </table>
          <p class="aside-note reveal">Sistemas incluye 28 electivas por plan · valores verificados en producción el 16/10/2026 · ${PROD_HOST}</p>
        </div>
        <div class="phones reveal">
          ${card("dashboard-movil", "Plan de correlativas en un teléfono", "phone")}
          ${card("horarios-movil", "Gestor de horarios en un teléfono", "phone")}
        </div>
      </div>`,
  },
  {
    id: "limitaciones",
    title: "Limitaciones y trabajo futuro",
    mode: BackgroundMode.Light,
    seconds: 50,
    notes: [
      "Quiero ser claro con las limitaciones. La más visible: en producción todavía no están configuradas las variables del proveedor de correo, así que los correos de recuperación y de confirmación no se envían; el código está listo y probado.",
      "Solo Sistemas tiene horarios oficiales cargados; las demás carreras no tienen comisiones. La extensión se descarga desde el sitio, no está en las tiendas. No hay fechas de mesas, y el asistente sugiere combinaciones pero no arma el horario solo.",
      "Como trabajo futuro: configurar el correo y Speed Insights, publicar la extensión, cargar los horarios de las demás carreras y actualizar los de cada cuatrimestre con la importación, evaluar Argon2id que es la primera opción de OWASP, incorporar las fechas de mesas, generar combinaciones sin superposiciones y extender a otras especialidades.",
    ],
    html: `
      ${header("16", "Limitaciones y trabajo futuro", "Lo que falta, dicho con claridad")}
      <div class="limits">
        <section class="limit-col reveal">
          <h3>Limitaciones actuales</h3>
          <ul>
            <li><strong>Correos sin enviar</strong>: falta configurar el proveedor en producción.</li>
            <li>Horarios oficiales solo de <strong>Sistemas</strong>.</li>
            <li>Extensión descargable, fuera de las tiendas.</li>
            <li>Sin fechas de las mesas de examen.</li>
            <li>El asistente sugiere combinaciones; el estudiante elige cada comisión.</li>
          </ul>
        </section>
        <section class="limit-col limit-future reveal">
          <h3>Trabajo futuro</h3>
          <ul>
            <li>Configurar el <strong>correo</strong> y Speed Insights; publicar la extensión.</li>
            <li>Horarios de las demás carreras, actualizados <strong>cada cuatrimestre</strong>.</li>
            <li>Migrar el hash a <strong>Argon2id</strong>, primera opción de OWASP.</li>
            <li>Fechas de cada mesa de examen.</li>
            <li>Combinaciones de comisiones sin superposiciones generadas automáticamente.</li>
            <li>Planes de otras especialidades de la Facultad.</li>
          </ul>
        </section>
      </div>`,
  },
  {
    id: "conclusiones",
    title: "Conclusiones",
    mode: BackgroundMode.Light,
    seconds: 65,
    notes: [
      "Para cerrar: AdHorarium cumple el objetivo de reunir en una aplicación web el plan de correlativas, la situación de cada estudiante, las mesas y el armado del horario, con datos administrables. Hoy el catálogo tiene los horarios oficiales de Sistemas en sus planes 2023 y 2008, y el estudiante puede traer su estado académico desde SYSACAD sin cargarlo a mano.",
      "Me llevo seis aprendizajes. Primero, la dependencia de servicios externos es un riesgo real: tres riesgos se materializaron, y tener los planes versionados permitió reconstruir la base. Segundo, concentrar datos y autorización en el servidor simplifica la seguridad. Tercero, un modelo de lenguaje es útil si se lo ancla en datos calculados por código. Cuarto, la autenticación también es una decisión de operación. Quinto, separar el dominio de la interfaz habilita la verificación automática, y permitió compartir un único lector de SYSACAD entre la página y la extensión. Y sexto, los datos oficiales también hay que validarlos: importarlos con vista previa, con su fuente y dejando fuera lo ambiguo fue más confiable que transcribirlos a mano.",
    ],
    html: `
      ${header("17", "Conclusiones", "Seis aprendizajes del proyecto")}
      <ol class="lessons">
        <li class="reveal"><b>01</b><div><h3>La dependencia externa es un riesgo real</h3><p>Tres riesgos se materializaron; los planes versionados permitieron reconstruir la base en otro proveedor.</p></div></li>
        <li class="reveal"><b>02</b><div><h3>Datos y autorización en el servidor</h3><p>Pasar de RLS en el navegador a Server Actions con rol verificado redujo la superficie expuesta.</p></div></li>
        <li class="reveal"><b>03</b><div><h3>IA anclada en datos calculados</h3><p>Lo exacto lo calcula el código; el modelo solo lo explica.</p></div></li>
        <li class="reveal"><b>04</b><div><h3>Autenticar también es operar</h3><p>Contraseñas, tokens y baja de cuenta trajeron hash, límites y mensajes neutros, cubiertos con pruebas.</p></div></li>
        <li class="reveal"><b>05</b><div><h3>Dominio separado de la interfaz</h3><p>Funciones puras probadas en cada PR; un único lector de SYSACAD para la página y la extensión.</p></div></li>
        <li class="reveal"><b>06</b><div><h3>Los datos oficiales también se validan</h3><p>PDF con abreviaturas y páginas contradictorias: vista previa, fuente de cada dato y fuera lo ambiguo.</p></div></li>
      </ol>`,
  },
  {
    id: "preguntas",
    title: "Preguntas",
    mode: BackgroundMode.Dark,
    seconds: 20,
    notes: [
      "Muchas gracias. La aplicación está en producción en adhorarium.vercel.app, pueden escanear el código QR para probarla. Quedo atento a sus preguntas.",
    ],
    html: `
      <div class="closing">
        <div class="closing-text">
          <p class="eyebrow eyebrow-light reveal">Gracias</p>
          <h2 class="closing-title reveal">¿Preguntas?</h2>
          <p class="closing-url reveal">${PROD_HOST}</p>
          <p class="closing-meta reveal">Francisco Miguel Perez · Legajo 56355<br />Seminario Integrador · UTN Facultad Regional Tucumán · 2026</p>
          <p class="closing-repo reveal">github.com/FranprzDev/AdHorarium</p>
        </div>
        <figure class="qr reveal">
          <img src="qr-adhorarium.svg" alt="Código QR a https://${PROD_HOST}" />
          <figcaption>Escaneá para abrir AdHorarium</figcaption>
        </figure>
      </div>`,
  },
];
