/* ==========================================================================
   TALLER 1 / PARTE 2: JS Y MANIPULACIÓN DEL DOM
   Tienda: Santana Effects
   Técnica: Delegación de Eventos (Event Delegation)
   ========================================================================== */

// --- 1. SELECCIÓN DE ELEMENTOS PRINCIPALES DEL DOM ---
const contenedorProductos = document.querySelector('#contenedor-productos');
const contenidoCarrito = document.querySelector('#contenido-carrito');
const btnVaciarCarrito = document.querySelector('#vaciar-carrito');
const formularioNuevoProducto = document.querySelector('#formulario-nuevo-producto');

// --- 2. ESTADO DE LA APLICACIÓN ---
// Arreglo global para almacenar los objetos agregados al carrito
let articulosCarrito = [];

// --- 3. REGISTRO DE EVENT LISTENERS ---
cargarEventListeners();

/**
 * Registra los eventos principales usando la técnica de Delegación de Eventos
 */
function cargarEventListeners() {
    // A. Delegación de eventos para agregar productos
    // Escuchamos el contenedor padre en lugar de cada botón individual
    contenedorProductos.addEventListener('click', agregarProducto);

    // B. Evento para vaciar el carrito
    btnVaciarCarrito.addEventListener('click', vaciarCarrito);

    // C. Evento para procesar el formulario de nuevos artículos
    formularioNuevoProducto.addEventListener('submit', crearNuevoProducto);
}

// --- 4. FUNCIONALIDAD: AGREGAR AL CARRITO (Delegación) ---

/**
 * Captura clics dentro de la sección tienda y filtra los que vienen de los botones
 * @param {Event} e - Objeto Event pasado por la delegación
 */
function agregarProducto(e) {
    // Verificamos mediante delegación si el usuario hizo clic en un botón de agregar
    if (e.target.classList.contains('btn-agregar')) {
        // Obtenemos la tarjeta padre (<article>) navegando desde el botón
        const tarjetaProducto = e.target.parentElement.parentElement;
        leerDatosProducto(tarjetaProducto);
    }
}

/**
 * Lee la estructura HTML de la tarjeta y actualiza el arreglo del carrito
 * @param {HTMLElement} tarjeta - Elemento HTML de la tarjeta capturada
 */
function leerDatosProducto(tarjeta) {
    // Creamos un objeto limpio con los 6 atributos leídos del DOM
    const infoProducto = {
        imagen: tarjeta.querySelector('.producto-img').src,
        nombre: tarjeta.querySelector('h3').textContent,
        precio: tarjeta.querySelector('.producto-precio').textContent,
        id: tarjeta.querySelector('h3').textContent, // Usamos el nombre como ID único
        cantidad: 1
    };

    // Verificar si el pedal ya fue agregado previamente al carrito
    const existe = articulosCarrito.some(producto => producto.id === infoProducto.id);

    if (existe) {
        // Si ya existe, recorremos el arreglo y sumamos +1 a su cantidad
        articulosCarrito = articulosCarrito.map(producto => {
            if (producto.id === infoProducto.id) {
                producto.cantidad++;
                return producto; // Retorna el objeto modificado
            } else {
                return producto; // Retorna los objetos sin cambios
            }
        });
    } else {
        // Si es la primera vez, agregamos el nuevo producto al arreglo
        articulosCarrito = [...articulosCarrito, infoProducto];
    }

    // Dibujamos la tabla actualizada en el HTML
    renderizarCarritoHTML();
}

// --- 5. DIBUJAR Y VACIAR EL CARRITO DE COMPRAS ---

/**
 * Inyecta las filas dinámicas de la tabla del carrito en el DOM
 */
function renderizarCarritoHTML() {
    // Limpiamos el HTML previo de la tabla
    limpiarCarritoHTML();

    // Si no hay productos, mostramos el estado por defecto
    if (articulosCarrito.length === 0) {
        contenidoCarrito.innerHTML = `
            <tr>
                <td colspan="4" class="carrito-vacio">El carrito está vacío</td>
            </tr>
        `;
        return;
    }

    // Recorremos el arreglo global e inyectamos cada fila <tr>
    articulosCarrito.forEach(producto => {
        const { imagen, nombre, precio, cantidad } = producto;
        const fila = document.createElement('tr');

        fila.innerHTML = `
            <td>
                <img src="${imagen}" width="50" style="border-radius: 4px; object-fit: cover;">
            </td>
            <td>${nombre}</td>
            <td>${precio}</td>
            <td style="font-weight: bold;">${cantidad}</td>
        `;

        contenidoCarrito.appendChild(fila);
    });
}

/**
 * Remueve los nodos hijos de la tabla del carrito para evitar duplicaciones
 */
function limpiarCarritoHTML() {
    while (contenidoCarrito.firstChild) {
        contenidoCarrito.removeChild(contenidoCarrito.firstChild);
    }
}

/**
 * Reinicia el arreglo del carrito en JS y limpia la vista en HTML
 */
function vaciarCarrito() {
    articulosCarrito = [];
    renderizarCarritoHTML();
}

// --- 6. FUNCIONALIDAD: AGREGAR ARTÍCULO DESDE EL FORMULARIO ---

/**
 * Captura datos del formulario, valida restricciones y crea una nueva tarjeta
 * @param {Event} e - Evento Submit
 */
function crearNuevoProducto(e) {
    e.preventDefault();

    // Captura de valores ingresados en el formulario
    const nombre = document.querySelector('#nombre-input').value;
    const attr1 = document.querySelector('#attr1-input').value;
    const attr2 = document.querySelector('#attr2-input').value;
    const attr3 = document.querySelector('#attr3-input').value;
    const imagen = document.querySelector('#imagen-input').value;
    const precioNumerico = parseFloat(document.querySelector('#precio-input').value);

    // Requisito estricto del taller: Alerta si el precio es menor a $1.000
    if (precioNumerico < 1000) {
        alert('Error: El precio del artículo debe ser igual o superior a $1.000');
        return;
    }

    const precioFormateado = `$ ${precioNumerico.toLocaleString('es-CO')}`;

    // Creación dinámica de la tarjeta
    const nuevaTarjeta = document.createElement('article');
    nuevaTarjeta.classList.add('tarjeta-producto');

    nuevaTarjeta.innerHTML = `
        <img src="${imagen}" alt="${nombre}" class="producto-img">
        <div class="producto-info">
            <h3>${nombre}</h3>
            <ul class="producto-atributos">
                <li><strong>Tipo:</strong> ${attr1}</li>
                <li><strong>Circuito:</strong> ${attr2}</li>
                <li><strong>Alimentación:</strong> ${attr3}</li>
            </ul>
            <p class="producto-precio">${precioFormateado}</p>
            <button class="btn-agregar">Agregar al carrito</button>
        </div>
    `;

    // ¡VENTAJA DE LA DELEGACIÓN!
    // No necesitamos agregar ningún addEventListener a este nuevo botón.
    // Como está dentro de #contenedor-productos, el escuchador padre lo atrapará automáticamente.
    contenedorProductos.appendChild(nuevaTarjeta);

    // Vaciar los campos del formulario
    formularioNuevoProducto.reset();

    alert(`¡Producto "${nombre}" creado exitosamente en la tienda!`);
}