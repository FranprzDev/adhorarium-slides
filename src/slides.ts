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
    seconds: 80,
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
    seconds: 80,
    notes: [
      "El objetivo general fue desarrollar una aplicación web, usable desde computadora y celular, para que los estudiantes de ingeniería de FRT consulten el plan de correlativas, registren su situación académica, planifiquen qué cursar y en qué mesa rendir, y armen su horario sin superposiciones, con datos que mantiene un administrador.",
      "En el alcance entran la consulta pública del plan, el registro y el inicio de sesión, los estados y notas, las mesas, el perfil con GPA, el panel de administración, el gestor de horarios y el asistente.",
      "Quedan afuera, a propósito, la inscripción a cursado o exámenes, que es del sistema oficial; las fechas de mesas; la integración con SYSACAD; la carga de los horarios oficiales; generar un horario completo automáticamente; y la recuperación de contraseña.",
    ],
    html: `
      ${header("02", "Objetivo y alcance", "Un solo lugar para planificar el avance en la carrera")}
      <blockquote class="goal reveal">Aplicación web, accesible desde computadoras y móviles, para que los estudiantes de ingeniería de la UTN-FRT consulten su plan de correlativas, registren su situación académica, planifiquen qué cursar y en qué mesa rendir, y armen su horario sin superposiciones, con datos administrables por un responsable autorizado.</blockquote>
      <div class="scope">
        <section class="scope-col scope-in reveal">
          <h3>Incluido</h3>
          <ul class="chips">
            <li>Plan de correlativas público</li><li>Registro e inicio de sesión</li><li>Estados y notas</li>
            <li>Dependencias por materia</li><li>Buscador de mesas</li><li>Perfil con promedio y GPA</li>
            <li>Gestor de horarios</li><li>Exportar · compartir · importar</li><li>Asistente de horarios</li>
            <li>Panel de administración</li><li>Modo demostración</li>
          </ul>
        </section>
        <section class="scope-col scope-out reveal">
          <h3>Excluido</h3>
          <ul class="chips">
            <li>Inscripción a cursado y exámenes</li><li>Fechas de las mesas</li><li>Integración con SYSACAD</li>
            <li>Carga de horarios oficiales</li><li>Horario completo automático</li><li>Recuperación de contraseña</li>
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
      "Hay tres actores principales. El visitante, sin cuenta, consulta el plan público, explora el modo demostración y puede ver un horario compartido. El estudiante registra su situación, consulta mesas y perfil, arma su horario y usa el asistente. El administrador mantiene materias, correlativas y comisiones.",
      "Como actores secundarios están Google, para el inicio de sesión alternativo, y Vercel AI Gateway, que da acceso al modelo de lenguaje. En total el modelo tiene veinte casos de uso.",
    ],
    html: `
      ${header("03", "Usuarios y actores", "Tres roles, veinte casos de uso")}
      <div class="actors">
        <article class="actor reveal">
          <p class="actor-tag">Visitante</p>
          <h3>Sin cuenta</h3>
          <ul><li>Plan de correlativas público</li><li>Modo demostración</li><li>Ver y exportar un horario compartido</li><li>Registrarse e iniciar sesión</li></ul>
          <p class="actor-cu">CU01 · CU02 · CU03 · CU16 · CU17</p>
        </article>
        <article class="actor actor-main reveal">
          <p class="actor-tag">Estudiante · rol student</p>
          <h3>Planifica su carrera</h3>
          <ul><li>Registra estados y notas</li><li>Consulta mesas y su perfil</li><li>Arma, exporta, comparte e importa horarios</li><li>Usa el asistente de horarios</li></ul>
          <p class="actor-cu">CU04 – CU11 · CU15 · CU17 – CU19</p>
        </article>
        <article class="actor reveal">
          <p class="actor-tag">Administrador · rol admin</p>
          <h3>Mantiene los datos</h3>
          <ul><li>Materias de cada carrera</li><li>Correlativas para cursar y para rendir</li><li>Comisiones con días, horas y aulas</li></ul>
          <p class="actor-cu">CU11 – CU14 · CU20</p>
        </article>
      </div>
      <div class="secondary reveal">
        <span class="secondary-label">Actores secundarios</span>
        <span class="pill">Google · OAuth 2.0 (ingreso alternativo)</span>
        <span class="pill">Vercel AI Gateway · modelo de lenguaje</span>
        <span class="pill pill-brass">CU01 – CU20</span>
      </div>`,
  },
  {
    id: "demo-plan",
    title: "Plan de correlativas y gestor de materias",
    mode: BackgroundMode.Light,
    seconds: 100,
    notes: [
      "Empiezo por el corazón del sistema. El plan de correlativas se muestra por niveles, y se puede consultar sin registrarse, eligiendo la carrera.",
      "Al tocar una materia se ve qué necesita para cursarse y qué materias habilita. En la captura, Paradigmas de Programación: necesita Lógica y Algoritmos y habilita Desarrollo de Software, Diseño de Sistemas e Ingeniería y Calidad de Software.",
      "En el gestor de materias el estudiante marca cada materia como no cursada, cursando, regular o promocionada, y carga la nota de las promocionadas. El cambio se ve al instante, se confirma con un aviso y, si el servidor lo rechaza, se revierte.",
      "Hay cinco carreras cargadas: Sistemas, Electrónica, Civil, Mecánica y Energía Eléctrica.",
    ],
    html: `
      ${header("04", "Funcionalidades · Plan y materias", "El plan de estudios como un grafo de correlativas")}
      <div class="demo">
        <div class="demo-text">
          ${bullets([
            "<strong>Plan por niveles</strong>, público y sin registrarse, para las 5 carreras cargadas.",
            "<strong>Dependencias</strong>: al tocar una materia, qué necesita para cursarse y qué habilita.",
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
    id: "demo-horarios",
    title: "Gestor de horarios",
    mode: BackgroundMode.Light,
    seconds: 110,
    notes: [
      "El gestor de horarios es la funcionalidad más nueva. El estudiante agrega una materia y elige una de sus comisiones del catálogo; si la materia no tiene comisiones cargadas, puede cargar los días y horas a mano.",
      "El sistema detecta superposiciones: dos franjas chocan solo si son el mismo día y sus rangos se cruzan. En la captura, una comisión de Paradigmas se pisa con Análisis Matemático II: el aviso arriba, los bloques en rojo y lado a lado en la grilla.",
      "En el panel lateral cada comisión avisa antes de elegirla si se superpone con otra materia, y con un clic se cambia por la que no choca. Esta lógica es una función pura, cubierta por pruebas unitarias.",
    ],
    html: `
      ${header("05", "Funcionalidades · Horarios", "Armar el cuatrimestre sin superposiciones")}
      <div class="demo demo-wide">
        <div class="demo-media">
          ${shot("horarios-superposicion", "/dashboard/horarios", "Gestor de horarios con una superposición marcada en rojo", "reveal")}
        </div>
        <div class="demo-side">
          ${card("horarios-comisiones", "Selector de comisiones con aviso de superposición", "reveal side-card")}
          ${bullets([
            "Comisión del catálogo o <strong>carga manual</strong> de días y horas.",
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
      ${header("06", "Funcionalidades · Exportar y compartir", "Del horario propio al de todo el grupo")}
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
    seconds: 80,
    notes: [
      "El asistente de horarios es un chat de solo consulta. Responde qué materias puedo cursar, qué finales puedo rendir o qué combinación de comisiones no se superpone.",
      "La decisión de diseño clave: lo que tiene que ser exacto se calcula por código. Las materias habilitadas para cursar o rendir se calculan en el servidor y se le entregan al modelo como listas; el modelo solo lo explica en lenguaje natural.",
      "Usa el AI SDK de Vercel sobre Vercel AI Gateway, con el modelo openai/gpt-4.1-mini configurable por variable de entorno. No tiene herramientas, así que no puede modificar datos, y sus instrucciones le prohíben inventar horarios. Además limita el tamaño de las preguntas y las solicitudes por usuario.",
    ],
    html: `
      ${header("07", "Funcionalidades · Asistente", "Un modelo de lenguaje anclado en datos del sistema")}
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
      "Desde acá se dan de alta, modifican y eliminan materias y correlativas. Cada correlativa indica su propósito, para cursar o para rendir, y su condición, regular o aprobada, y se valida la integridad del plan: misma carrera, sin autorreferencias, sin ciclos y sin requerir materias de un nivel superior.",
      "También se gestiona el catálogo de comisiones con turno, período y franjas con aula. Al editar una comisión, el cambio se ve en todos los horarios que la usan: en la captura avisa que impacta en dos horarios de estudiantes.",
    ],
    html: `
      ${header("08", "Funcionalidades · Administración", "Datos que se corrigen sin desplegar código")}
      <div class="demo">
        <div class="demo-text">
          ${bullets([
            "Acceso solo con <strong>rol admin</strong>, verificado en el servidor.",
            "ABM de materias y correlativas: <strong>propósito</strong> (cursar / rendir) y <strong>condición</strong> (regular / aprobada).",
            "Integridad del plan: sin autorreferencias, <strong>sin ciclos</strong>, sin requisitos de un nivel superior.",
            "Comisiones con turno, período y franjas con aula: un cambio se refleja <strong>en todos los horarios</strong>.",
          ])}
        </div>
        <div class="demo-media stack">
          ${shot("admin-panel", "/admin", "Panel de administración con el listado de materias", "stack-back reveal")}
          ${card("admin-comision-editar", "Edición de una comisión con sus franjas horarias", "stack-front stack-front-card reveal")}
        </div>
      </div>`,
  },
  {
    id: "arquitectura",
    title: "Arquitectura y stack",
    mode: BackgroundMode.Light,
    seconds: 110,
    notes: [
      "La arquitectura es cliente-servidor en capas, implementada como un monolito Next.js desplegado en Vercel: un solo proyecto y un solo despliegue.",
      "En el navegador, React 19 con Tailwind y shadcn/ui; la exportación a PDF y PNG se genera ahí. En el servidor, Next.js 15 con App Router: Server Components, Server Actions y Route Handlers. Auth.js resuelve la sesión y antes de cualquier operación se verifica el rol.",
      "La lógica de negocio vive en funciones puras de TypeScript: correlativas, integridad de planes, GPA, superposiciones e importación. Por eso se prueban de forma unitaria.",
      "Los datos están en Neon PostgreSQL, en AWS us-east-1, y solo el servidor se conecta, con Drizzle ORM. El asistente llega al modelo a través de Vercel AI Gateway, autenticado con el token OIDC del despliegue, sin claves guardadas. GitHub Actions verifica cada pull request y cada integración a main se despliega sola.",
    ],
    html: `
      ${header("09", "Arquitectura y stack", "Cliente-servidor en capas sobre un monolito Next.js")}
      <div class="arch reveal">
        <div class="arch-col">
          <p class="arch-label">Navegador</p>
          <div class="arch-box">
            <h4>Presentación</h4>
            <p>React 19 · Tailwind CSS · shadcn/ui · Zustand</p>
            <p class="arch-sub">Exportación PDF (jsPDF) y PNG (canvas)</p>
          </div>
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
          <div class="arch-box arch-brass"><h4>Dominio · funciones puras TypeScript</h4><p>Correlativas · integridad · GPA · superposiciones · importación · contexto del asistente</p></div>
          <div class="arch-box"><h4>Acceso a datos · Drizzle ORM</h4><p>Driver serverless de Neon</p></div>
        </div>
        <div class="arch-arrow">TLS</div>
        <div class="arch-col">
          <p class="arch-label">Servicios externos</p>
          <div class="arch-box"><h4>Neon PostgreSQL</h4><p>Serverless · AWS us-east-1</p></div>
          <div class="arch-box"><h4>Vercel AI Gateway</h4><p>AI SDK · <code>openai/gpt-4.1-mini</code> · token OIDC</p></div>
          <div class="arch-box"><h4>Google Identity</h4><p>OAuth 2.0 / OpenID Connect</p></div>
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
      "El modelo de datos está en PostgreSQL y se define como código con Drizzle; evoluciona con migraciones versionadas: la 0000 crea el esquema, la 0001 agrega el hash de contraseña y la 0002 las tablas de horarios. Las tres están aplicadas en producción.",
      "Hay cuatro grupos: el académico, con carreras, materias, correlativas con propósito y condición, y mesas; los usuarios con el modelo de Auth.js ampliado con rol, carrera y hash; los estados de cada materia por usuario; y los horarios: comisiones con sus franjas en jsonb, las entradas del horario de cada estudiante y los horarios compartidos.",
    ],
    html: `
      ${header("10", "Modelo de datos", "PostgreSQL definido como código con Drizzle")}
      <div class="erd">
        <section class="erd-group reveal">
          <h3>Académico</h3>
          <div class="table-card"><b>careers</b><span>código · nombre · plan</span></div>
          <div class="table-card"><b>subjects</b><span>número · nivel 1–6 · electiva · ciencias básicas · mesa</span></div>
          <div class="table-card"><b>subject_correlatives</b><span>propósito cursar / rendir · condición regulares / aprobadas</span></div>
          <div class="table-card"><b>exam_tables</b><span>Mesa I · Mesa II · Mesa III</span></div>
        </section>
        <section class="erd-group reveal">
          <h3>Usuarios · Auth.js</h3>
          <div class="table-card"><b>users</b><span>rol student / admin · carrera · password_hash (bcrypt)</span></div>
          <div class="table-card"><b>accounts</b><span>cuentas OAuth vinculadas (Google)</span></div>
          <div class="table-card table-muted"><b>sessions · verification_tokens</b><span>requeridas por el adaptador, sin uso (JWT)</span></div>
        </section>
        <section class="erd-group reveal">
          <h3>Situación académica</h3>
          <div class="table-card"><b>user_subject_states</b><span>no_cursada · cursando · regular · promocionada · nota 1–10 solo si promocionada</span></div>
        </section>
        <section class="erd-group reveal">
          <h3>Horarios</h3>
          <div class="table-card"><b>commissions</b><span>turno · período · franjas en jsonb (día, inicio, fin, aula)</span></div>
          <div class="table-card"><b>schedule_entries</b><span>commission o custom · restricción check</span></div>
          <div class="table-card"><b>schedule_shares</b><span>id aleatorio de 22 caracteres · instantánea jsonb</span></div>
        </section>
      </div>
      <p class="migrations reveal"><span>Migraciones</span><code>0000</code> esquema inicial <code>0001_users_password_hash</code> <code>0002_schedule_builder</code> · las tres aplicadas en producción</p>`,
  },
  {
    id: "seguridad",
    title: "Seguridad",
    mode: BackgroundMode.Light,
    seconds: 70,
    notes: [
      "En seguridad, las contraseñas se guardan solo como hash bcrypt con factor 12; se exige un mínimo de 10 caracteres con letras y números y un máximo de 72 bytes, que es el límite de bcrypt. Seguimos la guía de OWASP.",
      "Para evitar fuerza bruta hay límites de intentos: 8 por correo y 30 por cliente cada 15 minutos, y límites de registros. El mensaje de error es siempre el mismo y el tiempo de respuesta también, para no revelar si una cuenta existe.",
      "La sesión es un JWT en una cookie HttpOnly firmada y cifrada. La base nunca está expuesta al navegador y el rol se verifica en el servidor; el registro público solo crea estudiantes.",
      "Además, al retomar el proyecto se removieron credenciales que estaban versionadas y se actualizó Next.js a 15.5.27 por la CVE-2025-66478, que bloqueaba los despliegues.",
    ],
    html: `
      ${header("11", "Seguridad", "Responsabilidades nuevas, resueltas con la guía de OWASP")}
      <div class="sec-grid">
        <article class="sec reveal"><h3>Contraseñas</h3><p>Solo <strong>hash bcrypt</strong> con factor 12. Mínimo 10 caracteres con letras y números; máximo 72 bytes.</p></article>
        <article class="sec reveal"><h3>Fuerza bruta</h3><p><strong>8 intentos por correo</strong> y 30 por cliente cada 15 min; límites de registros por hora y por día.</p></article>
        <article class="sec reveal"><h3>Sin enumeración</h3><p>Mismo mensaje y <strong>mismo tiempo de respuesta</strong> exista o no la cuenta.</p></article>
        <article class="sec reveal"><h3>Sesión</h3><p>JWT en <strong>cookie HttpOnly</strong>, firmada y cifrada con un secreto del servidor.</p></article>
        <article class="sec reveal"><h3>Autorización</h3><p>Rol verificado <strong>en el servidor</strong>; la base no es accesible desde el navegador; el registro solo crea estudiantes.</p></article>
        <article class="sec reveal"><h3>Endurecimiento</h3><p>Credenciales fuera del repositorio (PR #16); Next.js 15.5.27 corrige la <strong>CVE-2025-66478</strong> (PR #17).</p></article>
      </div>`,
  },
  {
    id: "calidad",
    title: "Calidad",
    mode: BackgroundMode.Light,
    seconds: 75,
    notes: [
      "En calidad, la lógica de dominio se extrajo a funciones puras y, junto con el acceso a datos, se cubre con 244 pruebas de Vitest en 23 archivos; ese es el resultado de la integración continua de main en el commit eb784ab.",
      "Cubren la conversión GPA, las correlativas, la integridad de cada plan, las reglas del panel, la autenticación, los horarios y el asistente con un modelo simulado. Las pruebas de integración corren contra PGlite, un PostgreSQL en memoria con el mismo esquema que producción.",
      "Además sumé una suite end-to-end con TesterArmy e2e: 48 pruebas en 7 archivos que recorren el sitio de producción como lo haría un usuario, desde las páginas públicas y el registro hasta los horarios, el asistente y el panel de administración. La corrida final del 16 de octubre pasó 48 de 48. Mientras se armaba, la suite encontró un error real: el mensaje de validación de la nota quedaba detrás del diálogo, y se corrigió en los PR 36 y 37.",
      "Cada pull request pasa por cuatro verificaciones en GitHub Actions: lint, tipos, pruebas y compilación.",
    ],
    html: `
      ${header("12", "Calidad", "Cada cambio verificado antes de integrarse")}
      <div class="quality">
        <div class="stats">
          <div class="stat reveal"><b>244</b><span>pruebas automatizadas (Vitest)</span></div>
          <div class="stat reveal"><b>23</b><span>archivos de prueba</span></div>
          <div class="stat reveal"><b>48</b><span>pruebas E2E (TesterArmy e2e) en 7 archivos: 48/48 en producción</span></div>
          <div class="stat reveal"><b>4</b><span>verificaciones por PR: Lint · Typecheck · Test · Build</span></div>
        </div>
        <div class="suites reveal">
          <p class="aside-label">Qué se prueba</p>
          <ul class="chips chips-dark">
            <li>Conversión GPA</li><li>Correlativas</li><li>Integridad de los planes</li><li>Reglas del panel</li>
            <li>Autenticación y límites</li><li>Superposiciones e importación</li><li>Asistente con modelo simulado</li>
            <li>Integración con PGlite</li>
          </ul>
          <p class="aside-label aside-label-gap">Pruebas E2E sobre producción</p>
          <ul class="chips">
            <li>Páginas públicas · 8</li><li>Autenticación · 8</li><li>Herramientas del estudiante · 6</li><li>Horarios · 10</li>
            <li>Importar horario · 3</li><li>Asistente · 1</li><li>Administración · 12</li>
          </ul>
          <p class="aside-note">Vitest: CI de <code>main</code> en el commit <code>eb784ab</code> (PR #35). E2E: corrida final del 16/10/2026 sobre https://adhorarium.vercel.app en <code>f2d6d0c</code>, 48 pruebas más 6 de preparación, todas aprobadas.</p>
        </div>
      </div>`,
  },
  {
    id: "metodologia",
    title: "Metodología e historial",
    mode: BackgroundMode.Light,
    seconds: 60,
    notes: [
      "La metodología fue iterativa e incremental con prácticas ágiles, documentada con UML, usando las fases del Proceso Unificado como marco para ordenar los artefactos. Al ser un proyecto individual no hubo ceremonias formales.",
      "Cada incremento se hizo en una rama propia y entró a main por pull request, con integración continua y despliegue continuo en Vercel. El historial registra 48 pull requests, 46 de ellos integrados.",
      "La versión 1 es de junio de 2025, con Supabase. Tras una pausa larga, en octubre de 2026 se endureció el proyecto, se migró a Neon, Drizzle y Auth.js, y se sumaron la identidad visual, el asistente, el ingreso con contraseña y el gestor de horarios. El 16 de octubre se agregó la suite E2E y una ronda de correcciones de accesibilidad y de interfaz.",
    ],
    html: `
      ${header("13", "Metodología e historial", "Iterativo e incremental, un pull request por incremento")}
      <div class="method-tags reveal">
        <span class="pill">Prácticas ágiles</span><span class="pill">UML</span><span class="pill">Fases del Proceso Unificado como marco</span>
        <span class="pill">Ramas feat/ · fix/ · chore/</span><span class="pill pill-brass">48 pull requests · 46 integrados</span>
      </div>
      <ol class="timeline">
        <li class="reveal"><time>May–jun 2025</time><h4>Versión 1</h4><p>Prototipo inicial y PR #1–#14: planes, mesas, gestor de materias, perfil GPA. Supabase.</p></li>
        <li class="reveal tl-pause"><time>Jun 2025 – sep 2026</time><h4>Pausa</h4><p>Al retomar: credenciales versionadas y despliegues fallidos desde el 05/09/2026.</p></li>
        <li class="reveal"><time>Oct 2026</time><h4>Endurecimiento</h4><p>PR #16–#19: credenciales, Next.js 15.5.27, cero errores de tipos, ESLint.</p></li>
        <li class="reveal"><time>14/10/2026</time><h4>Versión 2</h4><p>PR #22–#27: Neon + Drizzle, Auth.js v5, panel de administración.</p></li>
        <li class="reveal"><time>15/10/2026</time><h4>Versiones 2.1 – 2.3</h4><p>PR #28–#35: identidad visual, asistente, correo + contraseña, gestor de horarios.</p></li>
        <li class="reveal"><time>16/10/2026</time><h4>Calidad</h4><p>PR #36–#48: suite E2E, accesibilidad, página 404, menú móvil y correcciones.</p></li>
      </ol>`,
  },
  {
    id: "resultados",
    title: "Resultados",
    mode: BackgroundMode.Light,
    seconds: 50,
    notes: [
      "Como resultado, AdHorarium está en producción en adhorarium.vercel.app, con los veinte casos de uso implementados y todos los módulos habilitados.",
      "La base tiene 195 materias y 735 correlatividades de cinco carreras, verificadas en producción, más las tres mesas de examen. Los planes se cargan con scripts reproducibles desde archivos versionados, y eso permitió reconstruir la base al migrar de proveedor.",
      "Funciona en celular y en computadora, con modo claro y oscuro.",
    ],
    html: `
      ${header("14", "Resultados", "En producción, con datos reales de cinco carreras")}
      <div class="results">
        <div class="results-main">
          <div class="stats stats-row">
            <div class="stat reveal"><b>195</b><span>materias</span></div>
            <div class="stat reveal"><b>735</b><span>correlatividades</span></div>
            <div class="stat reveal"><b>5</b><span>carreras</span></div>
            <div class="stat reveal"><b>20</b><span>casos de uso</span></div>
          </div>
          <table class="careers reveal">
            <thead><tr><th>Carrera</th><th>Materias</th><th>Correlatividades</th></tr></thead>
            <tbody>
              <tr><td>Ingeniería en Sistemas de Información</td><td>36</td><td>73</td></tr>
              <tr><td>Ingeniería Electrónica</td><td>37</td><td>118</td></tr>
              <tr><td>Ingeniería Civil</td><td>41</td><td>259</td></tr>
              <tr><td>Ingeniería Mecánica</td><td>40</td><td>132</td></tr>
              <tr><td>Ingeniería en Energía Eléctrica</td><td>41</td><td>153</td></tr>
            </tbody>
          </table>
          <p class="aside-note reveal">Valores verificados en producción el 15/10/2026 · ${PROD_HOST}</p>
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
      "Quiero ser claro con las limitaciones. La más importante: no hay una fuente digital de los horarios oficiales de cursado, así que el catálogo de comisiones de producción tiene solo cinco comisiones de ejemplo, con días y aulas ficticios. El gestor y el asistente van a usar los horarios oficiales sin cambios de código cuando se carguen.",
      "Tampoco hay recuperación de contraseña ni verificación de correo, ni fechas de mesas, y el asistente sugiere combinaciones pero no arma el horario solo.",
      "Como trabajo futuro: cargar los horarios oficiales, sumar recuperación de contraseña y verificación de correo, evaluar Argon2id que es la primera opción de OWASP, incorporar las fechas de mesas, generar combinaciones sin superposiciones y extender a otras especialidades.",
    ],
    html: `
      ${header("15", "Limitaciones y trabajo futuro", "Lo que falta, dicho con claridad")}
      <div class="limits">
        <section class="limit-col reveal">
          <h3>Limitaciones actuales</h3>
          <ul>
            <li><strong>Catálogo de comisiones de ejemplo</strong>: 5 comisiones con días, horas y aulas ficticios.</li>
            <li>Sin recuperación de contraseña ni verificación del correo.</li>
            <li>Sin fechas de las mesas de examen.</li>
            <li>El asistente sugiere combinaciones; el estudiante elige cada comisión.</li>
          </ul>
        </section>
        <section class="limit-col limit-future reveal">
          <h3>Trabajo futuro</h3>
          <ul>
            <li>Cargar los <strong>horarios oficiales</strong> de cursado de la Facultad.</li>
            <li>Recuperación de contraseña y verificación del correo.</li>
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
    seconds: 70,
    notes: [
      "Para cerrar: AdHorarium cumple el objetivo de reunir en una aplicación web el plan de correlativas, la situación de cada estudiante, las mesas y el armado del horario, con datos administrables.",
      "Me llevo cinco aprendizajes. Primero, la dependencia de servicios externos es un riesgo real: tres riesgos se materializaron, y tener los planes versionados permitió reconstruir la base. Segundo, concentrar datos y autorización en el servidor simplifica la seguridad. Tercero, un modelo de lenguaje es útil si se lo ancla en datos calculados por código. Cuarto, la autenticación también es una decisión de operación. Y quinto, separar el dominio de la interfaz es lo que habilita la verificación automática.",
    ],
    html: `
      ${header("16", "Conclusiones", "Cinco aprendizajes del proyecto")}
      <ol class="lessons">
        <li class="reveal"><b>01</b><div><h3>La dependencia externa es un riesgo real</h3><p>Tres riesgos se materializaron; los planes versionados permitieron reconstruir la base en otro proveedor.</p></div></li>
        <li class="reveal"><b>02</b><div><h3>Datos y autorización en el servidor</h3><p>Pasar de RLS en el navegador a Server Actions con rol verificado redujo la superficie expuesta.</p></div></li>
        <li class="reveal"><b>03</b><div><h3>IA anclada en datos calculados</h3><p>Lo exacto lo calcula el código; el modelo solo lo explica.</p></div></li>
        <li class="reveal"><b>04</b><div><h3>Autenticar también es operar</h3><p>Las contraseñas trajeron hash, límites de intentos y mensajes neutros, cubiertos con pruebas.</p></div></li>
        <li class="reveal"><b>05</b><div><h3>Dominio separado de la interfaz</h3><p>Funciones puras probadas en cada PR dan confianza para cambiar tras pausas largas.</p></div></li>
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
