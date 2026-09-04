# Minutas GARVI - Transcriptor IA

Aplicación web para transcribir audio de reuniones en tiempo real usando el micrófono y generar documentos PDF.

## Requisitos

- **Navegador**: Google Chrome o Microsoft Edge (recomendado)
- **Micrófono**: Cualquier micrófono funcional (integrado o externo)
- **Conexión a internet**: Requerida para el reconocimiento de voz

## Cómo usar

### Paso 1: Abrir la aplicación
1. Ve a la carpeta donde están los archivos
2. Abre el archivo `index.html` con Google Chrome o Microsoft Edge
   - Clic derecho → Abrir con → Google Chrome

### Paso 2: Configurar la conferencia
1. Ingresa el nombre de la conferencia
2. Nombre del ponente (opcional)
3. Lugar (opcional)
4. Selecciona el idioma de reconocimiento

### Paso 3: Iniciar grabación
1. Haz clic en **"Iniciar Grabación"**
2. Permite el acceso al micrófono cuando el navegador lo solicite
3. La transcripción comenzará automáticamente

### Paso 4: Controlar la grabación
- **Pausar**: Detiene temporalmente la transcripción
- **Reanudar**: Continúa la transcripción
- **Detener**: Finaliza la grabación

### Paso 5: Generar PDF
1. Haz clic en **"Generar PDF"**
2. El archivo se descargará automáticamente con formato profesional
3. Incluye: fecha, ponente, lugar, transcripción con timestamps y estadísticas

## Funcionalidades

- Transcripción en tiempo real
- Soporte para múltiples idiomas
- Marcas de tiempo en cada segmento
- Contador de palabras en vivo
- Pausar/reanudar grabación
- Exportación a PDF profesional
- Diseño responsivo (funciona en móvil y desktop)

## Idiomas soportados

- Español (España y México)
- Inglés (US y UK)
- Portugués (Brasil)
- Francés
- Alemán
- Italiano
- Chino
- Japonés

## Solución de problemas

| Problema | Solución |
|----------|----------|
| No reconoce el micrófono | Verifica permisos del navegador |
| No transcribe | Usa Chrome o Edge, requiere internet |
| Error de red | Verifica tu conexión a internet |
| El PDF no se genera | Debe haber al menos un segmento transcrito |

## Archivos

```
Generador de READ IA/
├── index.html      # Estructura de la aplicación
├── style.css       # Estilos y diseño
└── app.js          # Lógica de transcripción y PDF
```

## Notas importantes

- El reconocimiento de voz usa la API de Web Speech (gratuita)
- La precisión depende de la calidad del audio ambiente
- Se recomienda usar en ambientes con poco ruido
- Los datos se procesan localmente, no se almacenan en servidores
