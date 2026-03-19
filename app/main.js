const form = document.getElementById('ruta-form');
const inicioInput = document.getElementById('inicio');
const finalInput = document.getElementById('final');
const mensaje = document.getElementById('mensaje');
const rutaContenedor = document.getElementById('ruta');
const calcularBtn = document.getElementById('calcular-btn');
const limpiarBtn = document.getElementById('limpiar-btn');

const CIUDADES_VALIDAS = new Set([
	'Aguascalientes',
	'CDMX',
	'Celaya',
	'Guanajuato',
	'Jilotepec',
	'Monterrey',
	'Oaxaca',
	'Queretaro',
	'Sinaloa',
	'Sonora',
	'Tamaulipas',
	'Zacatecas'
]);

const API_URL = 'https://bfs-vuelos.vercel.app/calcular';

function capitalizarCiudad(valor) {
	return valor
		.trim()
		.toLowerCase()
		.split(' ')
		.filter(Boolean)
		.map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1))
		.join(' ');
}

function setMensaje(texto, tipo = '') {
	mensaje.textContent = texto;
	mensaje.className = `message ${tipo}`.trim();
}

function limpiarRuta() {
	rutaContenedor.innerHTML = '';
}

function renderRuta(ciudades) {
	limpiarRuta();

	if (!Array.isArray(ciudades) || ciudades.length === 0) {
		return;
	}

	ciudades.forEach((ciudad, index) => {
		const chip = document.createElement('span');
		chip.className = 'chip';
		chip.textContent = ciudad;
		chip.style.animationDelay = `${index * 50}ms`;
		rutaContenedor.appendChild(chip);

		if (index < ciudades.length - 1) {
			const arrow = document.createElement('span');
			arrow.className = 'arrow';
			arrow.textContent = '->';
			arrow.style.animationDelay = `${index * 50 + 20}ms`;
			rutaContenedor.appendChild(arrow);
		}
	});
}

async function calcularRuta(evento) {
	evento.preventDefault();

	const inicio = capitalizarCiudad(inicioInput.value);
	const final = capitalizarCiudad(finalInput.value);

	if (!inicio || !final) {
		setMensaje('Escribe ciudad de inicio y ciudad destino.', 'error');
		limpiarRuta();
		return;
	}

	if (inicio === final) {
		setMensaje('El origen y destino no pueden ser la misma ciudad.', 'error');
		limpiarRuta();
		return;
	}

	if (!CIUDADES_VALIDAS.has(inicio) || !CIUDADES_VALIDAS.has(final)) {
		setMensaje('Usa ciudades validas del listado sugerido.', 'error');
		limpiarRuta();
		return;
	}

	calcularBtn.disabled = true;
	setMensaje('Calculando ruta...', '');
	limpiarRuta();

	try {
		const respuesta = await fetch(API_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ inicio, final })
		});

		if (!respuesta.ok) {
			throw new Error(`Error HTTP ${respuesta.status}`);
		}

		const data = await respuesta.json();
		const ruta = data?.ruta;

		if (!Array.isArray(ruta) || ruta.length === 0) {
			setMensaje('No se encontro una ruta valida para esas ciudades.', 'error');
			return;
		}

		renderRuta(ruta);
		setMensaje(`Ruta encontrada con ${ruta.length - 1} salto(s).`, 'ok');
	} catch (error) {
		setMensaje('No se pudo conectar al servicio en Vercel. Intenta de nuevo en unos segundos.', 'error');
	} finally {
		calcularBtn.disabled = false;
	}
}

function limpiarFormulario() {
	form.reset();
	setMensaje('');
	limpiarRuta();
	inicioInput.focus();
}

form.addEventListener('submit', calcularRuta);
limpiarBtn.addEventListener('click', limpiarFormulario);