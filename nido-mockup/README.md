# Nido — Mockup interactivo

Prototipo navegable de **Nido**, la plataforma de alquiler temporal para estudiantes universitarios desarrollada como proyecto de la materia *Metodologías Ágiles y Trabajos por Proyectos* (Universidad de Palermo).

🔗 **Demo en vivo:** _(se completa al activar GitHub Pages — ver abajo)_

## Sobre el proyecto

Nido resuelve la fricción de acceso al mercado de alquiler para estudiantes sin garantía propietaria, centralizando oferta, perfiles verificados, chat interno y contrato digital en una sola plataforma. El reto, la investigación de usuarios y la pila de producto están documentados en `proyecto_business_innovation_part1.pdf` y `part2.pdf` en la carpeta raíz del repo.

Este mockup cubre el recorrido completo de los dos perfiles de usuario definidos en `nudo_user_path.pdf`:

- **Tomás (estudiante):** registro → perfil verificado → búsqueda → ficha del inmueble → chat → contrato → panel de alquiler activo → reseña.
- **Graciela (propietario):** registro → publicación del inmueble → panel de publicaciones → consultas entrantes → chat → generación de contrato → panel de alquiler activo → reseña.

> La validación de DNI se omite deliberadamente en este prototipo (ver consigna del proyecto); el flujo muestra el estado "verificado" directamente.

## Cómo se navega

Arriba de cada página hay un selector **"Ver como Tomás / Ver como Graciela"** que cambia el rol activo y adapta la navegación, sin perder el resto del recorrido. Es un prototipo estático del lado del cliente: no hay backend ni persistencia real, todas las acciones (firmar, enviar mensajes, guardar perfil) están simuladas con JavaScript para que la demo se sienta completa.

## Estructura

```
nido-mockup/
├── index.html                 Landing
├── registro.html               Registro + selección de rol
├── perfil-estudiante.html      Construcción de perfil (Tomás)
├── perfil-propietario.html     Publicación del inmueble (Graciela)
├── busqueda.html                Búsqueda con filtros + mapa
├── ficha.html                   Ficha del inmueble
├── chat.html                    Chat interno (compartido)
├── contrato.html                 Generación y firma del contrato
├── dashboard-estudiante.html     Panel del inquilino (alquiler activo, pagos, reseña)
├── dashboard-propietario.html    Panel del propietario (publicaciones, consultas, alquiler activo, reseña)
├── css/styles.css                Sistema de diseño
└── js/app.js                     Layout compartido + interactividad
```

## Correrlo localmente

No requiere build ni dependencias. Alcanza con abrir `index.html` en el navegador, o servirlo con:

```bash
cd nido-mockup
python3 -m http.server 8080
# abrir http://localhost:8080
```

## Publicarlo en GitHub Pages

1. `git init` en la raíz del repo (si todavía no se hizo).
2. `git add` y `git commit` de los archivos.
3. Crear el repositorio en GitHub y hacer `git push`.
4. En GitHub → **Settings → Pages**, elegir la rama `main` y la carpeta `/nido-mockup` (o mover el contenido a la raíz) como source.
5. GitHub publica el sitio en `https://<usuario>.github.io/<repo>/`.

## Equipo

Invernizzi, Valentín · Ruiz, Facundo Nahuel · Sánchez Navarro, Mateo · Sosa Colello, Samanta · Yolde, Lautaro
