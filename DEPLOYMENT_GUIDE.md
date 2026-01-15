# 🚀 Guía de Deployment a Vercel

## Paso 1: Preparar el Repositorio Git

```bash
# Si aún no has inicializado git
git init

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "feat: Sistema completo con autenticación, banners y admin"

# Crear repositorio en GitHub y conectarlo
git remote add origin https://github.com/tu-usuario/tu-repositorio.git
git branch -M main
git push -u origin main
```

## Paso 2: Configurar Supabase

### 2.1 Ejecutar el Script SQL
1. Ve a tu proyecto de Supabase: https://supabase.com/dashboard
2. Navega a **SQL Editor**
3. Copia el contenido de `supabase_setup.sql`
4. Pégalo y ejecuta el script
5. Verifica que todas las tablas se crearon correctamente

### 2.2 Habilitar Autenticación
1. Ve a **Authentication** > **Providers**
2. Habilita **Email** provider
3. Configura las opciones:
   - ✅ Enable Email provider
   - ✅ Confirm email (opcional, pero recomendado)
   - Configura las URLs de redirección

### 2.3 Obtener Credenciales
1. Ve a **Settings** > **API**
2. Copia:
   - **Project URL** (VITE_SUPABASE_URL)
   - **anon/public key** (VITE_SUPABASE_ANON_KEY)

## Paso 3: Deployment en Vercel

### 3.1 Conectar con Vercel
1. Ve a https://vercel.com
2. Haz clic en **Add New** > **Project**
3. Importa tu repositorio de GitHub
4. Selecciona el repositorio de FEREST

### 3.2 Configurar Variables de Entorno
En la sección **Environment Variables**, agrega:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima-aqui
```

### 3.3 Configuración de Build
Vercel debería detectar automáticamente que es un proyecto Vite. Verifica:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3.4 Deploy
1. Haz clic en **Deploy**
2. Espera a que termine el build (aproximadamente 1-2 minutos)
3. ¡Tu sitio estará en vivo! 🎉

## Paso 4: Crear Cuenta de Administrador

### 4.1 Registrar Admin
1. Ve a tu sitio en Vercel (ej: https://tu-proyecto.vercel.app)
2. Haz clic en **Registrarse**
3. Usa el email: **leninzumaran0@gmail.com**
4. Crea una contraseña segura
5. Completa el registro

### 4.2 Verificar Email (si está habilitado)
1. Revisa el email de leninzumaran0@gmail.com
2. Haz clic en el enlace de verificación
3. Inicia sesión

### 4.3 Verificar Rol de Admin
1. Inicia sesión con la cuenta creada
2. Deberías ver el botón **ADMINISTRACIÓN** en el navbar
3. Haz clic para acceder al panel de admin
4. Verifica que puedes ver todas las pestañas

## Paso 5: Configurar Banners Iniciales

1. Ve a **Panel de Administración** > **BANNERS**
2. Haz clic en **Nuevo Banner**
3. Crea tu primer banner:
   - **Título**: "¡Bienvenidos a FEREST Premium!"
   - **Descripción**: "Las mejores bebidas de Trujillo con delivery"
   - **Color de Fondo**: #FF6B6B
   - **Color de Texto**: #FFFFFF
   - **Activo**: ✅
4. Guarda y verifica que aparece en la página principal

## Paso 6: Agregar Productos

1. Ve a **Panel de Administración** > **PRODUCTOS**
2. Agrega tus primeros productos con:
   - Nombre del producto
   - Descripción
   - Precio
   - Categoría
   - URL de imagen
   - Stock

## Paso 7: Configurar Dominio Personalizado (Opcional)

### 7.1 En Vercel
1. Ve a tu proyecto en Vercel
2. Haz clic en **Settings** > **Domains**
3. Agrega tu dominio personalizado

### 7.2 En tu Proveedor de Dominio
1. Agrega un registro CNAME apuntando a `cname.vercel-dns.com`
2. O sigue las instrucciones específicas de Vercel

## Paso 8: Actualizar URLs de Redirección en Supabase

1. Ve a Supabase > **Authentication** > **URL Configuration**
2. Agrega tu dominio de Vercel a:
   - **Site URL**: https://tu-proyecto.vercel.app
   - **Redirect URLs**: 
     - https://tu-proyecto.vercel.app/**
     - https://tu-proyecto.vercel.app/login
     - https://tu-proyecto.vercel.app/register

## 🔧 Troubleshooting

### Error: "Unsupported provider: provider is not enabled"
**Solución**: Ve a Supabase > Authentication > Providers y habilita Email

### Error: Build failed
**Solución**: 
1. Verifica que las variables de entorno estén configuradas en Vercel
2. Revisa los logs de build en Vercel
3. Asegúrate de que `npm run build` funciona localmente

### Error: Cannot access admin panel
**Solución**:
1. Verifica que el email sea exactamente: leninzumaran0@gmail.com
2. Revisa en Supabase > Table Editor > profiles que el rol sea "admin"
3. Si no, actualiza manualmente: `UPDATE profiles SET role = 'admin' WHERE email = 'leninzumaran0@gmail.com'`

### Los banners no aparecen
**Solución**:
1. Verifica que el banner esté marcado como "Activo"
2. Revisa las fechas de inicio y fin
3. Verifica que el orden de visualización sea correcto

## 📱 Testing Post-Deployment

### Checklist de Funcionalidades:
- [ ] Página principal carga correctamente
- [ ] Banners se muestran en la parte superior
- [ ] Productos se cargan desde Supabase
- [ ] Carrito funciona correctamente
- [ ] Formulario de contacto envía mensajes
- [ ] Botón de WhatsApp funciona (901296314)
- [ ] Registro de usuarios funciona
- [ ] Login de usuarios funciona
- [ ] Admin puede acceder al panel
- [ ] Admin puede crear/editar productos
- [ ] Admin puede crear/editar banners
- [ ] Admin puede ver mensajes
- [ ] Responsive en móvil funciona

## 🎯 Optimizaciones Post-Deployment

### Performance
1. Vercel automáticamente optimiza las imágenes
2. Considera usar Supabase Storage para imágenes de productos
3. Habilita caché en Vercel para mejor rendimiento

### SEO
1. Agrega meta tags en `index.html`
2. Configura `robots.txt`
3. Agrega `sitemap.xml`

### Analytics
1. Agrega Google Analytics (opcional)
2. Usa Vercel Analytics (incluido gratis)

## 🔄 Actualizaciones Futuras

Para actualizar el sitio:

```bash
# Hacer cambios en el código
git add .
git commit -m "descripción de cambios"
git push origin main
```

Vercel automáticamente detectará los cambios y hará un nuevo deployment.

## 📞 Soporte

Si encuentras algún problema:
1. Revisa los logs en Vercel Dashboard
2. Revisa los logs en Supabase Dashboard
3. Verifica la consola del navegador (F12)

---

**¡Tu aplicación está lista para producción!** 🎉

**URL del Proyecto**: https://tu-proyecto.vercel.app
**Admin Email**: leninzumaran0@gmail.com
**WhatsApp**: +51 901296314
