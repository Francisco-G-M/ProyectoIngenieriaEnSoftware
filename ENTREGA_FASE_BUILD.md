# Informe de Entrega - Fase BUILD
**Proyecto:** Sistema de Gestión para el Laboratorio de Medios Audiovisuales (UNTDF)  
**Caso de Uso Crítico:** CU_04 - Solicitar Préstamo de Equipos Audiovisuales  
**Grupo:** N° 2  

---

## 1. Cobertura de Especificaciones (RFC)
Se completó exitosamente la implementación técnica conforme a la arquitectura y diseño especificados en `RFC_CU04_Prestamo.md` mediante metodología *Spec-Driven Development*:
- **Persistencia:** Base de datos relacional local SQLite (`database.sqlite`) con esquema de usuarios, equipos y solicitudes de préstamo.
- **Modelos de Dominio:** Encapsulamiento de lógica en `Usuario.js`, `Equipo.js` y `SolicitudPrestamo.js`.
- **Servicios:** Centralización de reglas de negocio en `ValidationService.js`.
- **API REST:** Exposición de endpoints HTTP mediante Express en `PrestamoController.js` y `server.js`.
- **Interfaz Web:** Prototipo cliente web funcional en `src/public/index.html`.

---

## 2. Matriz de Verificación de Reglas de Negocio

| ID Caso de Prueba | Escenario de Validación | Regla Aplicada | Estado |
| :--- | :--- | :--- | :---: |
| **TC-01** | Antelación $\ge 48$ hs hábiles | Derivación a flujo regular (Pendiente aprobación docente) | **PASSED** |
| **TC-02** | Antelación $< 48$ hs hábiles | Derivación a `CU_08` Autorización Extraordinaria | **PASSED** |
| **TC-03** | Exceso de tope en materia individual | Bloqueo (Máx. 1 kit cámara / 1 kit sonido) | **PASSED** |
| **TC-04** | Exceso de tope en materia grupal | Autorización por flag `esGrupal` | **PASSED** |
| **TC-05** | Usuario en Lista Negra | Rechazo inmediato de solicitud | **PASSED** |

---

## 3. Instrucciones de Despliegue Local

Para ejecutar y probar el prototipo en un entorno local:

1. **Instalar dependencias:**
   ```bash
   npm install