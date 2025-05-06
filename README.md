# 🎯 Entrega 2

Repositorio correspondiente a la **Entrega 2** del trabajo práctico. En esta entrega se amplía el trabajo anterior incorporando:

- 🧱 Backend con **arquitectura limpia** (Express + TypeScript).  
- 🌐 Frontend web con **React**, **Next.js** y **Redux**.  
- 🤖 Bot de **Telegram** conectado al backend.  
- 🐳 Contenedorización con Docker y orquestación con Docker Compose.

---

## 📦 Entrega 1 - Backend

El objetivo principal fue presentar una arquitectura limpia en una aplicación Express utilizando TypeScript.

### 📋 Prerrequisitos

Antes de comenzar, asegurate de tener instalado lo siguiente:

- [Node.js](https://nodejs.org/) (v14 o superior)  
- [npm](https://www.npmjs.com/) (viene incluido con Node.js)  
- [Docker](https://www.docker.com/get-started)  
- [Git](https://git-scm.com/) (control de versiones)

---

## 🚀 Comenzando - Backend

### Instalación de dependencias

```bash
npm install
```

### Configuración de variables de entorno

Crear un archivo `.env` en la raíz del proyecto basado en `.env.example`:

```bash
NODE_ENV=development
PORT=3001
API_PREFIX=/api

JWT_SECRET=your_development_secret_key_change_in_production
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

LOG_LEVEL=debug
```

### Compilar y ejecutar

```bash
npm run build
npm start
```

La API estará disponible en: [http://localhost:3001/api](http://localhost:3001/api)

### Modo desarrollo (hot reload)

```bash
npm run dev
```

---

## 🧪 Tests

```bash
npm test
```

---

## 📁 Estructura del backend

```
src/
├── application/
│   ├── dtos/
│   ├── services/
│   └── interfaces/
├── domain/
│   ├── entities/
│   ├── repositories/
│   └── value-objects/
├── infrastructure/
│   ├── config/
│   ├── http/
│   ├── logging/
│   └── repositories/
└── interfaces/
    ├── controllers/
    ├── middleware/
    └── routes/
```

### Capas

- **Domain Layer**: Entidades y lógica de negocio independientes del resto.  
- **Application Layer**: Casos de uso de negocio.  
- **Infrastructure Layer**: Frameworks, BD, etc.  
- **Interface Layer**: Rutas, controladores, middleware.

---

## 🌐 Frontend Web

Se incorporó una interfaz web que permite a los usuarios interactuar con la plataforma de manera visual e intuitiva.

### Tecnologías y decisiones de diseño

- **React**: Client-Side Rendering (CSR) para interactividad dinámica.  
- **Redux**:  
  - Estado global predecible y centralizado.  
  - Facilidad de debugging y testing (time-travel, middleware).  
  - Compartición sencilla de datos (usuario, ofertas, publicaciones).  
- **Next.js**:  
  - Renderizado híbrido (SSR + CSR).  
  - SSR para componentes estáticos (botones, formularios).  
  - CSR para pantallas de alta interactividad.

### 📁 Estructura del frontend

```
frontend/
├── app/            # Páginas manejadas por Next.js
├── components/     # Componentes reutilizables
├── services/       # Consumo de APIs del backend
├── types/          # Tipos de datos de respuestas del backend
└── lib/            # Redux slices y unificación de llamadas a APIs
```

- **Slices de Redux**: Cada slice (e.g., `publicacionesSlice`, `usuarioSlice`) agrupa estado y reducers.  
- **Lib de APIs**: Centraliza `axios` y lógica de llamadas, desacoplando vistas de servicios.

### 🔧 Mejoras implementadas

- Conexión completa entre frontend y backend.  
- Vistas para:
  - Mis ofertas en el front.  
- Sistema de roles (Usuario y Admin) solo en el back.  
- Paginación en listados masivos.  


### ⚠️ Pendientes

- Visualización de estadísticas para el rol Admin (lógica y rutas listas; falta UI).
- Integración con la API de Magic The Gathering.
---

## 🤖 Bot de Telegram

Se agregó un canal alternativo de interacción mediante un bot de Telegram.


### 📁 Estructura del bot

```
bot/
├── application/
│   ├── Conversations/   # Manejo de flujos de conversación
│   └── Menus/           # Definición de menús y botones inline
├── bot/                 # Sesión, almacenamiento de contexto y repositorio de usuarios
├── client/              # Cliente HTTP para llamadas al backend
└── types/               # Definición de errores y tipos compartidos
```

### Funcionalidades actuales

- Login con token y persistencia de sesión.  
- Listado de publicaciones activas.  
- Listado y aceptación de ofertas.  
- Navegación mediante botones inline.

### 🔧 Pendientes

- Flujo de creación de publicaciones directamente en Telegram.  
- Paginación en listados (inline pagination).  
- Mejor manejo de errores y validaciones.

---

## 🐳 Docker

Cada servicio (backend, frontend y bot) incluye su propio `Dockerfile`. Además, en la raíz del repositorio se encuentra un archivo `docker-compose.yml` que permite ejecutar todos los servicios conjuntamente desde la carpeta raíz:

```bash
docker-compose build
docker-compose up
```

Esto levantará:
- Servicio de la API (Express + TypeScript)  
- Servicio del frontend (Next.js)  
- Servicio del bot de Telegram

---

## 🔧 Mejoras planeadas para la fase 2

1. Integración de la API de **Magic The Gathering** para enriquecer datos.
2. Existe un bug con el bot de Telegram que hace que se loguee constantemente al back.
3. Agregar pantallas para Admin de visualización de estadísticas de la plataforma.
4. Agregar test de funcionalidad del backend (estamos en alrededor de 50%, queremos llevarlo a 80%).

### Acceso al bot de Telegram:

[Acceder al bot](https://t.me/magic_cards_g3_bot)

---

## 🧠 Decisiones de diseño

- **TypeScript**: Robustez, autocompletado y mantenimiento.  
- **Clean Architecture**: Modularidad y testabilidad.  
- **Redux + Next.js**: Escalabilidad y performance híbrida SSR/CSR.

> Esta estructura es clave para escalar hacia microservicios o nuevos canales de comunicación.
