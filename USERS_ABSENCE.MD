# Ausencias de Usuarios

Esta guía describe el flujo de ausencias/vacaciones para profesionales y cómo impacta en la reserva de turnos. Está pensada para front-end (web/app) y para QA.

## Concepto
- Una ausencia define un rango de fechas en el que un usuario/profesional no ofrece turnos.
- Al consultar slots de disponibilidad, si la fecha cae en una ausencia, el backend devuelve `availableTimes: []` y el detalle de la ausencia.
- Al intentar crear un turno en una fecha ausente, el backend rechaza con error.

## Endpoints principales

### Crear ausencia
- **POST** `/absences`
- **Body (JSON)**
```json
{
  "UserId": "<uuid del profesional>",
  "startDate": "2025-09-15T00:00:00.000Z", 
  "endDate": "2025-09-20T00:00:00.000Z",
  "reason": "Vacaciones" // opcional
}
```
- **Respuestas**
  - `201` con el objeto de ausencia creado (`startDate`/`endDate` se guardan en formato `YYYY-MM-DD`).
  - `401` si el usuario no pertenece al mismo Enterprise o ya existe una ausencia que se solapa con el rango.

### Listar ausencias de un usuario
- **GET** `/absences/user/:id`
- **Ejemplo**: `/absences/user/USER_ID`
- **Respuestas**
  - `200` con array ordenado ascendente por `startDate`.
  - `401` si el usuario no pertenece al mismo Enterprise.

### Eliminar ausencia
- **DELETE** `/absences/:id`
- **Ejemplo**: `/absences/ABSENCE_ID`
- **Respuestas**
  - `200` `{ "message": "Absence removed successfully." }`
  - `401` si no existe o no pertenece al Enterprise del token.

## Impacto en turnos

### Consultar slots disponibles
- **POST** `/appointments/member-slots`
- **Body**
```json
{
  "UserId": "<uuid del profesional>",
  "date": "2025-09-16T00:00:00.000Z",
  "duration": 30
}
```
- **Respuestas**
  - Si hay ausencia ese día: 
    ```json
    {
      "availableTimes": [],
      "user": { ... },
      "absence": {
        "id": "...",
        "startDate": "2025-09-15",
        "endDate": "2025-09-20",
        "reason": "Vacaciones"
      }
    }
    ```
  - Si no hay ausencia: `availableTimes` incluye horarios `{ hs, available }`.

### Crear turno
- **POST** `/appointments`
- Si la fecha cae en ausencia: `401` con mensaje `"User is not available for this date."`.

## Reglas de negocio claves
- El rango debe ser válido: `startDate <= endDate`.
- No se permiten solapamientos de ausencias para el mismo usuario.
- Todas las operaciones requieren token válido; el usuario de la ausencia debe pertenecer al mismo `EnterpriseId` del token.
- Ausencias afectan solo al usuario indicado; no alteran horarios de la compañía.

## Recomendaciones para front-end
1. Mostrar las ausencias en calendario del profesional (bloque completo por rango).
2. Al pedir slots (`member-slots`), si viene `absence`, inhabilitar la fecha/mostrar banner "Profesional no disponible".
3. Antes de confirmar un turno, manejar el error 401 por ausencia y refrescar disponibilidad.
4. Ofrecer eliminar ausencia desde el panel del profesional usando `DELETE /absences/:id`.
