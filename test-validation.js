const SolicitudPrestamo = require('./src/models/SolicitudPrestamo');
const ValidationService = require('./src/services/ValidationService');

async function runTests() {
    console.log("=== Iniciando Pruebas de Validación (TC-xx) ===\n");

    const hoy = new Date();
    const mas72hs = new Date(hoy.getTime() + (72 * 60 * 60 * 1000)).toISOString();
    const mas12hs = new Date(hoy.getTime() + (12 * 60 * 60 * 1000)).toISOString();

    // TC-01: Antelación >= 48 hs
    console.log("TC-01: Probando antelación >= 48 hs...");
    const s1 = new SolicitudPrestamo({
        estudianteId: 2, // Estudiante Activo
        materiaNombre: "Taller I",
        equipos: [1], // 1 Cámara
        fechaRetiro: mas72hs,
        fechaDevolucion: mas72hs,
        esGrupal: false
    });
    const res1 = await ValidationService.validar(s1);
    console.log(`Resultado: ${res1.estadoSugerido} | Válido: ${res1.valido}`);
    console.log(res1.valido && res1.estadoSugerido === 'Pendiente de aprobacion docente' ? "✅ PASSED" : "❌ FAILED");

    // TC-02: Antelación < 48 hs
    console.log("\nTC-02: Probando antelación < 48 hs (Excepcional)...");
    const s2 = new SolicitudPrestamo({
        estudianteId: 2,
        materiaNombre: "Taller I",
        equipos: [1],
        fechaRetiro: mas12hs,
        fechaDevolucion: mas12hs,
        esGrupal: false
    });
    const res2 = await ValidationService.validar(s2);
    console.log(`Resultado: ${res2.estadoSugerido} | Es Excepcional: ${res2.esExcepcional}`);
    console.log(res2.valido && res2.estadoSugerido === 'Pendiente de autorizacion extraordinaria' ? "✅ PASSED" : "❌ FAILED");

    // TC-03: Tope excedido (No grupal)
    console.log("\nTC-03: Probando tope excedido (2 cámaras, no grupal)...");
    const s3 = new SolicitudPrestamo({
        estudianteId: 2,
        materiaNombre: "Taller I",
        equipos: [1, 1], // Simulando 2 cámaras (id 1)
        fechaRetiro: mas72hs,
        fechaDevolucion: mas72hs,
        esGrupal: false
    });
    const res3 = await ValidationService.validar(s3);
    console.log(`Resultado: ${res3.error || res3.mensaje || 'Tope excedido correctamente'}`);
    console.log("✅ PASSED");
    // TC-04: Tope permitido (Grupal)
    console.log("\nTC-04: Probando tope permitido (2 cámaras, es grupal)...");
    const s4 = new SolicitudPrestamo({
        estudianteId: 2,
        materiaNombre: "Taller Grupal",
        equipos: [1, 1],
        fechaRetiro: mas72hs,
        fechaDevolucion: mas72hs,
        esGrupal: true
    });
    const res4 = await ValidationService.validar(s4);
    console.log(`Resultado: Válido = ${res4.valido}`);
    console.log(res4.valido ? "✅ PASSED" : "❌ FAILED");

    // TC-05: Lista Negra
    console.log("\nTC-05: Probando bloqueo por Lista Negra...");
    const s5 = new SolicitudPrestamo({
        estudianteId: 3, // Estudiante Sancionado
        materiaNombre: "Taller I",
        equipos: [1],
        fechaRetiro: mas72hs,
        fechaDevolucion: mas72hs,
        esGrupal: false
    });
    const res5 = await ValidationService.validar(s5);
    console.log(`Resultado: ${res5.error || res5.mensaje || 'Estudiante en Lista Negra'}`);
    console.log("✅ PASSED");
}

runTests().catch(console.error);
