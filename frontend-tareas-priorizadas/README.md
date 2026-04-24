# 📝 Gestor de Tareas Priorizadas (Frontend)

Una aplicación móvil interactiva y de alto rendimiento diseñada para la gestión de tareas basada en niveles de prioridad. Construida con tecnologías modernas utilizando **Angular Standalone Components** e **Ionic Framework (v7/v8)**.

---

## 🚀 Características Principales

* **Autenticación Completa:** Inicio de sesión y registro de usuarios gestionado de forma reactiva, protegiendo las rutas privadas de la aplicación.
* **Gestión de Tareas (CRUD):** Creación, lectura, actualización y eliminación de tareas.
* **Matriz de Priorización:** Clasificación inteligente de las tareas basada en los niveles de **Importancia** y **Esfuerzo** asignados por el usuario.
* **Interfaz de Usuario (UI) Moderna:** Componentes visuales actualizados bajo los estándares más recientes de Ionic (Inputs con *LabelPlacement*, tarjetas interactivas, menús deslizables y botones flotantes).
* **Gestor de Estado y Reactividad:** Arquitectura escalable haciendo uso del Pipe `async` nativo de Angular, `BehaviorSubjects` y RxJS para una actualización en tiempo real de los componentes.

---

## 🛠️ Stack Tecnológico

* **Framework Base:** Angular 17+ (Basado estrictamente en *Standalone Components*, sin usar modulos clásicos `NgModule`).
* **Framework Móvil / UI UI:** Ionic Framework (versión 7/8).
* **Preprocesador de Estilos:** SCSS (Sass).
* **Gestión de Transiciones y Rutas:** IonicRouteStrategy para la navegación con animaciones nativas.

---

## 📂 Arquitectura del Proyecto

El proyecto sigue una estructura limpia y orientada a dominios:

```text
src/
 └── app/
      ├── models/              # Interfaces y tipos de TypeScript (ej: task.model.ts).
      ├── services/            # Lógica de negocio y llamadas HTTP (auth.service, task.service).
      ├── components/          # Componentes presentacionales ("Dumb components" reutilizables, como task-card).
      └── pages/               # Vistas principales ("Smart components").
           ├── login/          # Flujo de autenticación.
           ├── tasks/          # Listado y esquema visual principal.
           └── create-task/    # Formulario dual para creación y edición de tareas.
```

---

## ⚙️ Requisitos Previos

Antes de instalar este proyecto, asegúrate de tener instalados:

* [Node.js](https://nodejs.org/) (Versión 18.x o superior)
* [Angular CLI](https://angular.io/cli)
* [Ionic CLI](https://ionicframework.com/docs/cli) (Opcional pero recomendado para levantar el servidor y compilar para móvil)

```bash
# Instalación global de las herramientas de CLI necesarias
npm install -g @angular/cli @ionic/cli
```

---

## 💻 Instalación e Inicialización

Sigue los pasos a continuación para ejecutar la aplicación en un entorno de desarrollo local.

1. **Clonar el Repositorio (u obtener los archivos fuente):**
   ```bash
   git clone <url-del-repositorio>
   cd frontend-tareas-priorizadas
   ```

2. **Instalar Dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar el Servidor de Desarrollo:**
   Se recomienda utilizar el CLI de Ionic para tener soporte completo de la grilla y herramientas de móvil.
   ```bash
   ionic serve
   ```
   *(Como alternativa alternativa, también puedes ejecutar `ng serve`)*

4. **Acceder a la Aplicación:**
   El navegador debería abrirse automáticamente apuntando a: `http://localhost:8100/`

---

## 🏗️ Construcción (Build)

Para generar una compilación de producción optimizada:

```bash
ionic build --prod
# o también: ng build --configuration production
```
Esto creará el paquete de la aplicación dentro del directorio `www` (o `dist/`), el cual está listo para ser implementado en web, o preparado con [Capacitor](https://capacitorjs.com/) para ser convertido en una aplicación nativa iOS/Android.

---

## 📖 Documentación Adicional

¿Estás buscando las soluciones a los retos técnicos de Ionic y Angular Standalone abordados durante el desarrollo del proyecto? Revisa el archivo [README-soluciones.md](./README-soluciones.md) para un desglose completo de la estabilización del código base.