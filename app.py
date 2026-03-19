# Vuelos con busqueda en amplitud

from arbol import Nodo
from flask import Flask, request
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)


def buscar_solucion(conexiones, estado_inicial, solucion):
    solucionado = False
    nodos_visitados = []
    nodos_frontera = []
    nodo_inicial = Nodo(estado_inicial)
    nodos_frontera.append(nodo_inicial)
    while not solucionado and len(nodos_frontera):
        nodo = nodos_frontera[0]
        # Extraer nodo y agregarlo a visitados
        nodos_visitados.append(nodos_frontera.pop(0))
        if nodo.get_datos() == solucion:
            # Solucion encontrada
            solucionado = True
            return nodo
        else:
            # Expandir nodos hijo (ciudades con conexion)
            dato_nodo = nodo.get_datos()
            lista_hijos = []
            for un_hijo in conexiones[dato_nodo]:
                hijo = Nodo(un_hijo)
                lista_hijos.append(hijo)
                if not hijo.en_lista(nodos_visitados) and not hijo.en_lista(nodos_frontera):
                    nodos_frontera.append(hijo)

            nodo.set_hijos(lista_hijos)


@app.route('/calcular', methods=['POST'])
def calcular():

    data = request.get_json()
    inicio = data.get('inicio')
    final = data.get('final')

    conexiones = {
        "Jilotepec": {"Celaya", "CDMX", "Queretaro"},
        "Sonora": {"Zacatecas", "Sinaloa"},
        "Guanajuato": {"Aguascalientes"},
        "Oaxaca": {"Queretaro"},
        "Sinaloa": {"Celaya", "Sonora", "Jilotepec"},
        "CDMX": {"Monterrey"},
        "Celaya": {"Jilotepec", "Sinaloa"},
        "Zacatecas": {"Sonora", "Monterrey", "Queretaro"},
        "Monterrey": {"Zacatecas", "Sinaloa"},
        "Tamaulipas": {"Queretaro"},
        "Queretaro": {"Tamaulipas", "Zacatecas", "Sinaloa",
                      "Jilotepec", "Oaxaca"}
    }
    estado_inicial = inicio
    solucion = final
    nodo_solucion = buscar_solucion(conexiones, estado_inicial, solucion)
    # Mostrar resultado
    resultado = []
    nodo = nodo_solucion
    while nodo.get_padre() is not None:
        resultado.append(nodo.get_datos())
        nodo = nodo.get_padre()

    resultado.append(estado_inicial)
    resultado.reverse()
    return {"ruta": resultado}


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')
