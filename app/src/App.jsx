
import { useState } from 'react'
import axios from 'axios'

const LUGARES = [
  "Jilotepec",
  "Sonora",
  "Guanajuato",
  "Oaxaca",
  "Sinaloa",
  "CDMX",
  "Celaya",
  "Zacatecas",
  "Monterrey",
  "Tamaulipas",
  "Queretaro"
]

function App() {
  const [inicio, setInicio] = useState('')
  const [final, setFinal] = useState('')
  const [resultado, setResultado] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)

  const handleCalcular = async () => {
    if (!inicio || !final) {
      setError('Por favor selecciona ambos lugares')
      return
    }

    if (inicio === final) {
      setError('El lugar de inicio y final no pueden ser iguales')
      return
    }

    setCargando(true)
    setError(null)

    try {
      const response = await axios.post('https://bfs-problem.onrender.com/calcular', {
        inicio,
        final
      })
      setResultado(response.data)
    } catch (err) {
      setError('Error al conectar con el servidor: ' + (err.message || 'Error desconocido'))
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-indigo-600">
          Calculadora de Rutas BFS
        </h1>

        <div className="space-y-4">
          {/* Selector Inicio */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Lugar de Inicio
            </label>
            <select
              value={inicio}
              onChange={(e) => setInicio(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 bg-white"
            >
              <option value="">Selecciona un lugar</option>
              {LUGARES.map((lugar) => (
                <option key={lugar} value={lugar}>
                  {lugar}
                </option>
              ))}
            </select>
          </div>

          {/* Selector Final */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Lugar Final
            </label>
            <select
              value={final}
              onChange={(e) => setFinal(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 bg-white"
            >
              <option value="">Selecciona un lugar</option>
              {LUGARES.map((lugar) => (
                <option key={lugar} value={lugar}>
                  {lugar}
                </option>
              ))}
            </select>
          </div>

          {/* Botón Calcular */}
          <button
            onClick={handleCalcular}
            disabled={cargando}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            {cargando ? 'Calculando...' : 'Calcular Ruta'}
          </button>

          {/* Mensajes de Error */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
              <p className="font-semibold">Error</p>
              <p>{error}</p>
            </div>
          )}

          {/* Resultado */}
          {resultado && (
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
              <h2 className="font-bold text-lg text-green-800 mb-2">Resultado</h2>
              <div className="bg-white rounded p-3 border border-green-200">
                {resultado.ruta ? (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-semibold">Ruta encontrada:</span>
                    </p>
                    <p className="text-indigo-600 font-mono font-semibold">
                      {Array.isArray(resultado.ruta) 
                        ? resultado.ruta.join(' → ') 
                        : resultado.ruta}
                    </p>
                    {resultado.distancia && (
                      <p className="text-sm text-gray-600 mt-2">
                        <span className="font-semibold">Distancia:</span> {resultado.distancia} pasos
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-red-600 font-semibold">
                    No hay ruta disponible entre estos lugares
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
