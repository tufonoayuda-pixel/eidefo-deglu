import React from 'react';

const EfodeaLanding = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="hero-bg text-white py-20">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">EFODEA</h1>
          <p className="text-xl md:text-2xl mb-2">Evaluación Fonoaudiológica de la Deglución en Adultos</p>
          <p className="text-lg opacity-90">Sistema clínico estandarizado para la valoración de la deglución con criterios objetivos</p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">¿Cómo funciona EFODEA?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Documenta, puntúa y toma decisiones clínicas objetivas para la evaluación de la deglución en adultos
            </p>
          </div>

          <div className="bg-blue-50 rounded-xl p-8 mb-12 border border-blue-100">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-efodea-blue flex items-center justify-center text-white font-bold text-lg">1</div>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Accede con tus credenciales</h3>
                <p className="text-gray-600">Ingresa con tu usuario y contraseña proporcionados por Neuromav</p>
              </div>
            </div>
            <div className="flex items-start mt-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-efodea-blue flex items-center justify-center text-white font-bold text-lg">2</div>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Completa la evaluación por componentes</h3>
                <p className="text-gray-600">Documenta sistemáticamente cada componente de la evaluación clínica</p>
              </div>
            </div>
            <div className="flex items-start mt-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-efodea-blue flex items-center justify-center text-white font-bold text-lg">3</div>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Obtén puntaje y recomendación clínica</h3>
                <p className="text-gray-600">El sistema calcula automáticamente si procede a evaluación nutritiva según criterios validados</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="component-card bg-white p-6 rounded-xl shadow border border-gray-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
              <h3 className="font-bold text-lg text-gray-800 mb-3">Historia Clínica</h3>
              <p className="text-gray-600 text-sm">Antecedentes médicos, diagnósticos y factores de riesgo</p>
            </div>
            <div className="component-card bg-white p-6 rounded-xl shadow border border-gray-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
              <h3 className="font-bold text-lg text-gray-800 mb-3">Nivel de Conciencia</h3>
              <p className="text-gray-600 text-sm">Estado de alerta y respuesta a estímulos</p>
            </div>
            <div className="component-card bg-white p-6 rounded-xl shadow border border-gray-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
              <h3 className="font-bold text-lg text-gray-800 mb-3">Estado Cognitivo</h3>
              <p className="text-gray-600 text-sm">Capacidad de atención, memoria y comprensión</p>
            </div>
            <div className="component-card bg-white p-6 rounded-xl shadow border border-gray-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
              <h3 className="font-bold text-lg text-gray-800 mb-3">Cooperación</h3>
              <p className="text-gray-600 text-sm">Disposición del paciente para participar en la evaluación</p>
            </div>
            <div className="component-card bg-white p-6 rounded-xl shadow border border-gray-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
              <h3 className="font-bold text-lg text-gray-800 mb-3">Seguimiento de Instrucciones</h3>
              <p className="text-gray-600 text-sm">Capacidad para entender y ejecutar órdenes simples</p>
            </div>
            <div className="component-card bg-white p-6 rounded-xl shadow border border-gray-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
              <h3 className="font-bold text-lg text-gray-800 mb-3">EOF Anatomo-Funcional</h3>
              <p className="text-gray-600 text-sm">Evaluación de estructuras y funciones orofaciales</p>
            </div>
            <div className="component-card bg-white p-6 rounded-xl shadow border border-gray-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
              <h3 className="font-bold text-lg text-gray-800 mb-3">Sensibilidad</h3>
              <p className="text-gray-600 text-sm">Percepción sensorial en cavidad oral y faringe</p>
            </div>
            <div className="component-card bg-white p-6 rounded-xl shadow border border-gray-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
              <h3 className="font-bold text-lg text-gray-800 mb-3">Calidad Vocal</h3>
              <p className="text-gray-600 text-sm">Características de la voz y posible compromiso laríngeo</p>
            </div>
            <div className="component-card bg-white p-6 rounded-xl shadow border border-gray-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
              <h3 className="font-bold text-lg text-gray-800 mb-3">Reflejos</h3>
              <p className="text-gray-600 text-sm">Presencia y respuesta de reflejos protectores</p>
            </div>
            <div className="component-card bg-white p-6 rounded-xl shadow border border-gray-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
              <h3 className="font-bold text-lg text-gray-800 mb-3">Deglución No Nutritiva</h3>
              <p className="text-gray-600 text-sm">Capacidad para tragar saliva y realizar movimientos deglutorios</p>
            </div>
            <div className="component-card bg-white p-6 rounded-xl shadow border border-gray-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
              <h3 className="font-bold text-lg text-gray-800 mb-3">Deglución Nutritiva</h3>
              <p className="text-gray-600 text-sm">Evaluación con diferentes consistencias alimentarias</p>
            </div>
            <div className="component-card bg-white p-6 rounded-xl shadow border border-gray-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
              <h3 className="font-bold text-lg text-gray-800 mb-3">Puntaje y Decisión</h3>
              <p className="text-gray-600 text-sm">Recomendación automatizada para proceder o no a evaluación nutritiva</p>
            </div>
          </div>
        </div>
      </section>

      {/* Decision Algorithm Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Algoritmo de Decisión Clínica</h2>
            <p className="text-xl text-gray-600">
              Sistema de puntaje que determina la seguridad para proceder a evaluación nutritiva
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 p-6 bg-blue-50 rounded-lg">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <h3 className="text-xl font-bold text-gray-800">Componentes Críticos</h3>
                <p className="text-gray-600">Evaluación de conciencia, cooperación y reflejos protectores</p>
              </div>
              <div className="text-3xl font-bold text-efodea-blue">≥ 8 puntos</div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center text-white font-bold">✓</div>
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-800">Puntaje ≥ 8 puntos</h4>
                  <p className="text-gray-600">Seguro para proceder a evaluación nutritiva con consistencias</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-danger flex items-center justify-center text-white font-bold">✗</div>
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-800">Puntaje &lt; 8 puntos</h4>
                  <p className="text-gray-600">No procede evaluación nutritiva. Se recomienda seguimiento y reevaluación</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200"> {/* Changed from bg-amber-50 border-amber-200 */}
              <h4 className="font-bold text-lg text-efodea-blue mb-2">Advertencia Clínica</h4> {/* Changed text-amber-800 */}
              <p className="text-blue-700"> {/* Changed text-amber-700 */}
                Independiente del puntaje, si existen signos de riesgo de aspiración o compromiso
                neurológico severo, se debe aplicar criterio clínico profesional para la decisión final.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Access Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Acceso a la Plataforma EFODEA</h2>
            <p className="text-xl text-gray-600">
              Solo para fonoaudiólogos certificados en el uso de EFODEA
            </p>
          </div>

          <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">¿Aún no tienes credenciales?</h3>
            <p className="mb-6 text-blue-100 max-w-2xl mx-auto">
              Completa el curso de certificación EFODEA para obtener tu usuario y contraseña
              de acceso a la plataforma clínica
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-white text-efodea-blue font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition duration-300"> {/* Changed text-primary */}
                Inscribirme al Curso
              </button>
              <button className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-efodea-blue transition duration-300"> {/* Changed hover:text-primary */}
                Más Información
              </button>
            </div>
          </div>

          <div className="mt-12 bg-gray-50 p-8 rounded-xl">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">Características de la Plataforma</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <div className="text-green-500 text-xl mr-3">✓</div>
                <div>
                  <h4 className="font-bold text-gray-800">Registro Digital</h4>
                  <p className="text-gray-600">Guarda todos los datos de tus evaluaciones en la nube</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="text-green-500 text-xl mr-3">✓</div>
                <div>
                  <h4 className="font-bold text-gray-800">Cálculo Automático</h4>
                  <p className="text-gray-600">Puntaje y recomendación generados automáticamente</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="text-green-500 text-xl mr-3">✓</div>
                <div>
                  <h4 className="font-bold text-gray-800">Informes Clínicos</h4>
                  <p className="text-gray-600">Genera informes profesionales para tu expediente clínico</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="text-green-500 text-xl mr-3">✓</div>
                <div>
                  <h4 className="font-bold text-gray-800">Seguridad de Datos</h4>
                  <p className="text-gray-600">Protección de la información de tus pacientes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center">
            <h4 className="font-bold text-xl mb-4">EFODEA</h4>
            <p className="text-gray-400 mb-6">Herramienta clínica validada para la evaluación de la deglución en adultos</p>
            <p className="text-gray-500">© 2025 Neuromav. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EfodeaLanding;