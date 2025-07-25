# 🚀 Deploy en Netlify

## Configuración Específica para Netlify

### Archivos de Configuración

1. **`netlify.toml`** - Configuración principal de Netlify
2. **`public/_redirects`** - Redirecciones para SPA
3. **`vite.config.prod.js`** - Configuración de Vite para producción

### Variables de Entorno en Netlify

Configura las siguientes variables de entorno en tu dashboard de Netlify:

```
NODE_VERSION=18
NPM_FLAGS=--legacy-peer-deps
```

### Configuración del Build

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 18.x

### Solución de Problemas

#### Error: "Cannot read properties of undefined (reading 'forwardRef')"

Este error se soluciona con:

1. **Configuración de chunks optimizada** en `vite.config.prod.js`
2. **Variables de entorno** correctas
3. **Redirecciones** para SPA

#### Optimizaciones Implementadas

- ✅ Separación de chunks por funcionalidad
- ✅ Configuración específica para React 19
- ✅ Optimización de dependencias
- ✅ Redirecciones para SPA
- ✅ Headers de seguridad

### Comandos de Deploy

```bash
# Build local para testing
npm run build

# Build de desarrollo
npm run build:dev

# Preview local
npm run preview
```

### Estructura de Chunks

- `react-vendor`: React + React-DOM
- `ui-libs`: Lucide React
- `three-components`: Three.js + componentes pesados
- `Home`: Componentes de la página principal
- `Store`: Componentes de la tienda
- `Cart`: Componentes del carrito
- `AdminPanel`: Panel administrativo

### Notas Importantes

- La aplicación usa React 19, asegúrate de que Netlify soporte esta versión
- Los chunks están optimizados para carga diferida
- Las redirecciones están configuradas para SPA
- Los headers de seguridad están configurados 