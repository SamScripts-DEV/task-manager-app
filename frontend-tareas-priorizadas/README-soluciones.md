# 🛠️ Documentación de Soluciones: Gestor de Tareas (Ionic + Angular Standalone)

Este documento detalla los desafíos técnicos encontrados durante el desarrollo del frontend de la aplicación "Gestor de Tareas Priorizadas" y las soluciones definitivas aplicadas. La aplicación utiliza **Angular Standalone Components** junto con **Ionic Framework (v7/v8)**.

---

## 📋 1. Resumen de Problemas Resueltos

Durante el desarrollo nos enfrentamos a tres bloques principales de errores:
1. **Navegación bloqueada o Vistas en blanco:** Al intentar cambiar de vistas (ej. de Tareas a Crear Tarea), el componente no renderizaba o la pantalla se congelaba reteniendo el foco (`aria-hidden`).
2. **Ausencia de estilos base:** Componentes de Ionic sin forma o mal posicionados de manera nativa.
3. **Superposición de etiquetas (Labels) en formularios:** El texto de los `ion-input` se encimaba con los placeholders al editar o crear una nueva tarea.

---

## 🚀 2. Solución a la Navegación y Renderizado (Ionic Router)

### El Problema
Al usar componentes Standalone, Ionic requiere una sincronización perfecta entre su enrutador (`IonicRouteStrategy`) y el DOM. Inicialmente, fallos silenciosos (como alias de importación no resueltos) o discrepancias entre `@ionic/angular` y `@ionic/angular/standalone` provocaban que los componentes no se inicializaran.

### La Solución
1. **Importaciones Relativas Seguras:**
   Se cambiaron los alias (como `@services/task.services`) por rutas relativas explícitas (`../../services/task.services`). Esto previene fallos silenciosos del compilador `esbuild`.
2. **Configuración en `main.ts`:**
   Aseguramos que la aplicación provea la estrategia de rutas de Ionic y sus módulos correctamente en el arranque:
   ```typescript
   bootstrapApplication(AppComponent, {
     providers: [
       provideZoneChangeDetection(),
       { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
       importProvidersFrom(IonicModule.forRoot({})),
       provideRouter(routes, withPreloading(PreloadAllModules)),
       // ... otros providers
     ],
   });
   ```

---

## 🎨 3. Solución de Estilos Base Globales (CSS Core)

### El Problema
Nada de lo que hacíamos con Ionic parecía tener el estilo por defecto esperado. Faltaban variables, márgenes, y comportamientos básicos del layout.

### La Solución
En arquitecturas Standalone (especialmente al no usar el CLI de Ionic clásico), es obligatorio incluir manualmente el **Core CSS de Ionic**. Se debe inyectar al inicio del archivo `src/global.scss`:

```scss
/* Core CSS requerido para componentes de Ionic */
@import "@ionic/angular/css/core.css";

/* Utilidades básicas */
@import "@ionic/angular/css/normalize.css";
@import "@ionic/angular/css/structure.css";
@import "@ionic/angular/css/typography.css";
/* ... entre otros ... */
```

---

## 📝 4. Refactorización de Formularios (Migración a Ionic v7+)

### El Problema
En los formularios (`create-task` y `login`), el texto flotante ("Título de la tarea") colisionaba visualmente con el texto ingresado o el placeholder. Esto se debe a que la directiva `<ion-label position="floating">` dentro de un `<ion-item>` es sintaxis heredada de **Ionic 6** y ha sido deprecada en favor de la API moderna de Ionic 7/8.

### La Solución
Se refactorizó el HTML para aprovechar las propiedades nativas `label` y `labelPlacement` incrustadas directamente en los inputs:

**❌ Sintaxis Antigua (Problemática):**
```html
<ion-item lines="outline">
  <ion-label position="floating">Título de la tarea</ion-label>
  <ion-input type="text" formControlName="title"></ion-input>
</ion-item>
```

**✅ Sintaxis Moderna (Corregida y Aplicada):**
```html
<ion-input 
  label="Título de la tarea" 
  labelPlacement="floating" 
  fill="outline" 
  type="text" 
  formControlName="title" 
  placeholder="Ej: Comprar leche"
  class="ion-margin-bottom">
</ion-input>
```

Para componentes complejos como el calendario (`ion-datetime`), se creó un wrapper manual en flexbox (`.date-container`) simulando el comportamiento visual moderno.

---

## 📂 5. Estructura Final del Módulo de Tareas

A continuación, la arquitectura clave que permite el flujo de Tareas Priorizadas:

```text
src/app/
 ├── models/
 │    └── task.model.ts          # Interfaz estricta TypeScript (id, importance, effort, etc.)
 ├── services/
 │    ├── auth.services.ts       # Storage (Token), Observable de Sesión (BehaviorSubject)
 │    └── task.services.ts       # CRUD a API + Manejo de Estados con RxJS
 ├── components/
 │    └── task-card/             # [Componente "Tonto" / Presentacional] 
 │         ├── .html             # Muestra Título, Badge de Prioridad y Eventos (click)
 │         └── .ts               # @Input() task / @Output() edit, delete, complete
 └── pages/
      ├── tasks/                 # [Componente Inteligente / Contenedor]
      │    ├── .html             # ion-refresher, *ngFor asíncrono, FAB Button
      │    └── .ts               # Se suscribe a task.services y rutea (NavController)
      └── create-task/           # [Componente Dual: Crea y Edita]
           ├── .html             # Formulario Reactivo Moderno (Ionic 7+)
           └── .ts               # Evalúa si recibe :id en URL para mutar a estado "Edición"
```

## 🧠 Buenas Prácticas Establecidas
1. **Ruteo Direccional:** Se utilizó estrictamente el servicio nativo `NavController` de Ionic (`navigateForward`, `navigateBack`, `navigateRoot`) sobre el nativo de Angular (`Router`). Esto garantiza que las transiciones nativas en móviles existan.
2. **Reactividad (OnPush):** Los componentes utilizan `ChangeDetectionStrategy.OnPush` en conjunto con el pipe `async` en el HTML, mejorando brutalmente el rendimiento en móviles.
3. **Manejo de Eventos UI:** Uso del evento nativo `(click)="... $event.stopPropagation()"` en controles táctiles para evitar activaciones dobles en tarjetas clicables.