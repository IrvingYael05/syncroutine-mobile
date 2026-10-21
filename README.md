# SyncRoutine Mobile

SyncRoutine Mobile es el cliente nativo del ecosistema **SyncRoutine**, diseñado para actuar como un ejecutor inteligente (estilo *Smartwatch*) de rutinas y bloques de tareas. La aplicación permite a los usuarios desvincularse de la plataforma web, ofreciendo una experiencia inmersiva para la gestión del tiempo con sincronización bidireccional, persistencia criptográfica y tolerancia a fallos de red.

---

## Características Principales

- **Emparejamiento Passwordless (Host-Client):** Inicio de sesión seguro mediante escaneo de código QR nativo, eliminando la fricción de ingresar credenciales manualmente.
- **Sincronización en Tiempo Real:** Descarga instantánea de bloques de tareas y actividades desde el backend empresarial.
- **Motor de Tiempo Resiliente:** Cronómetro de alta precisión basado en marcas de tiempo (`Date.now()`) que continúa calculando el progreso de forma exacta incluso si la aplicación pasa a segundo plano.
- **Gestión Inteligente de Energía:** Forzado automático de pantalla activa (`keep-awake`) durante la ejecución de rutinas para evitar interrupciones.
- **Interfaz "Card-Based" Inmersiva:** Navegación híbrida con un diseño minimalista adaptado a los estándares *Edge-to-Edge* americanos.

---

## Stack Tecnológico y Arquitectura

El proyecto está construido bajo el paradigma de **Programación Funcional**, garantizando inmutabilidad y un flujo de datos unidireccional.

- **Framework:** React Native + Expo (SDK 57)
- **Lenguaje:** TypeScript
- **Gestión de Estado Global:** Context API (`AuthContext`)
- **Autenticación y Sesiones:** Supabase (JWT)
- **Persistencia Segura:** Expo Secure Store (Keychain/Keystore nativo)
- **Integración de Hardware:** Expo Camera

### Arquitectura de Carpetas (Separación de Responsabilidades)
El proyecto utiliza una arquitectura modular que separa estrictamente la lógica de red (Servicios) de las vistas (UI):

```text
src/
├── app/                  # Rutas y Vistas (Expo Router)
│   ├── (auth)/           # Grupo de rutas de autenticación (QR Scanner)
│   └── (app)/            # Grupo de rutas protegidas (Dashboard, Player)
├── components/           # Componentes UI reutilizables (CustomModal, Cards)
├── constants/            # Sistema de diseño global (theme.ts, Colors)
├── context/              # Estados globales (AuthContext)
└── core/
    └── services/         # Capa de red (API Client, Endpoints, Supabase)
```

## Instalación y Configuración Local
### Prerrequisitos
- Node.js (v18 o superior)
- Entorno de desarrollo móvil (Android Studio / Xcode) o la app Expo Go en tu dispositivo físico.
- Backend de Spring Boot activo en la red local o en la nube.

### Pasos de despliegue
- Clonar el repositorio:

```Bash
git clone https://github.com/IrvingYael05/syncroutine-mobile.git
cd syncroutine-mobile
```

- Instalar dependencias:
```Bash
npm install
```

- Configurar variables de entorno:
Crea un archivo .env en la raíz del proyecto y define las variables de conexión hacia el backend de Spring Boot y Supabase:

``` Fragmento de código
EXPO_PUBLIC_API_URL=http://TUP_IP_LOCAL:8080
EXPO_PUBLIC_SUPABASE_URL=tu_url_de_supabase
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_llave_anonima
```

- Levantar el servidor de desarrollo:

``` Bash
npx expo start
```

## Compilación para Producción (APK)
La aplicación está configurada para compilarse en la nube utilizando EAS Build. Para generar un archivo instalable .apk para Android:

- Instalar la interfaz de comandos de EAS:

```Bash
npm install -g eas-cli
```

- Ejecutar el perfil de compilación preview:

```Bash
eas build -p android --profile preview
```

## Prácticas de Seguridad Implementadas
- **Aislamiento de Lógica de Red:** Las peticiones HTTP se interceptan en una capa de servicios (apiClient.ts), centralizando la inyección de Bearer Tokens.

- **Protección contra Inyección y Fugas (Logcat):** Los JWT (Access y Refresh Tokens) jamás se imprimen en consola.

- **Manejo Seguro de Errores:** Excepciones de red (404, Timeout) son atrapadas y presentadas al usuario mediante retroalimentación visual genérica, ocultando la estructura interna del servidor.

- **Guards de Navegación:** El enrutador (_layout.tsx) bloquea el retroceso hacia las pantallas de autenticación una vez que la sesión criptográfica ha sido validada.

Desarrollado para el ecosistema SyncRoutine.