
# 📦 Entrega 1

Repositorio correspondiente a la **Entrega 1** del trabajo práctico. El objetivo principal es presentar una arquitectura limpia en una aplicación Express utilizando TypeScript.

---

## 📋 Prerrequisitos

Antes de comenzar, asegurate de tener instalado lo siguiente:

- [Node.js](https://nodejs.org/) (v14 o superior)
- [npm](https://www.npmjs.com/) (viene incluido con Node.js)
- [Docker](https://www.docker.com/get-started) (opcional, para correr en contenedores)
- [Git](https://git-scm.com/) (control de versiones)

---

## 🚀 Comenzando

### Instalación de dependencias

```bash
npm install
```

### Configuración de variables de entorno

Crear un archivo `.env` en la raíz del proyecto basado en `.env.example`:

```bash
# Configuración general
NODE_ENV=development
PORT=3001
API_PREFIX=/api

# Autenticación JWT
JWT_SECRET=your_development_secret_key_change_in_production
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Logging
LOG_LEVEL=debug
```

### Compilar el proyecto

```bash
npm run build
```

### Ejecutar la aplicación

```bash
npm start
```

La API estará disponible en: [http://localhost:3001/api](http://localhost:3001/api)

### Ejecutar en modo desarrollo (con hot reload)

```bash
npm run dev
```

---

## 🧪 Correr tests

```bash
npm test
```

---

## 🐳 Uso con Docker

### Construir y levantar con Docker Compose

```bash
docker-compose build
docker-compose up
```

La API estará disponible en: [http://localhost:3001/api](http://localhost:3001/api)

---

## 📁 Estructura del proyecto

Se sigue una arquitectura limpia (Clean Architecture):

```
src/
├── application/         # Reglas de negocio de la aplicación
│   ├── dtos/            
│   ├── services/        
│   └── interfaces/      
├── domain/              # Reglas de negocio de dominio
│   ├── entities/        
│   ├── repositories/    
│   └── value-objects/   
├── infrastructure/      # Frameworks, controladores y herramientas externas
│   ├── config/          
│   ├── http/            
│   ├── logging/         
│   └── repositories/    
└── interfaces/          # Adaptadores de interfaz
    ├── controllers/     
    ├── middleware/      
    └── routes/          
```

### Explicación de las capas:

- **Domain Layer**: Entidades y lógica de negocio independientes del resto de la app.
- **Application Layer**: Casos de uso y lógica de aplicación.
- **Infrastructure Layer**: Implementaciones técnicas, frameworks y servicios externos.
- **Interface Layer**: Controladores HTTP, middleware y rutas.

---

## ❓ Preguntas para consultar con el ayudante

- ¿Qué patrón es óptimo para guardar entidades relacionadas desde los servicios de otras entidades?  
  _(Ej: desde el service de ofertas guardar cartas y publicaciones)_  
  → Creemos que usar servicios en vez de acceder directo a los repositorios permite un mejor desacople y facilita la futura división en microservicios. Que opinas al respecto?

- ¿Conviene refactorizar `update` en métodos separados?  
  _(Ej: `/offer/{id}/accept`)_

- ¿Conviene refactorizar Publicaciones para evitar que tenga una lista de ofertas, y que cada oferta referencie a su publicación?

---

## 🔧 Mejoras planeadas

- Agregar roles (Usuario y Admin): el Admin podrá ver estadísticas de la plataforma.  
  → Sabemos cómo implementarlo, sería agregar un `enum` y permisos en middleware.



- Integración de la API de **Magic The Gathering** para enriquecer datos.

- Nuevas rutas:
  - `/me/publications`: Ver publicaciones históricas del usuario.
  - `/me/offers`: Ver ofertas históricas del usuario.

- Agregar paginación a endpoints que devuelven muchos datos.

---

## 🧠 Decisiones de diseño

- **TypeScript**: Elegido por experiencia previa y facilidad de integración con Docker.
- **Clean Architecture**: Adoptada para facilitar mantenibilidad, escalabilidad y testeo.

### Ventajas:

- 🔁 **Modularidad**: Separación clara de responsabilidades.
- 🔧 **Desacoplamiento**: Cambios internos sin afectar capas externas.
- 🎛️ **Flexibilidad**: Se puede modificar la infraestructura sin tocar la lógica de negocio.
- 🔌 **Independencia tecnológica**: No atada a frameworks ni BD específicos.
- 🧪 **Testabilidad**: Fácil de testear la lógica de negocio sin depender del servidor ni base de datos.

> Esta estructura es clave si en el futuro se quiere escalar hacia microservicios.
