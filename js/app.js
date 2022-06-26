////VARIABLES Y SELECTORES

const formulario = document.querySelector("#agregar-gasto");
const gastoListado = document.querySelector("#gastos ul");

////EVENTOS

eventListeners();
function eventListeners() {
    document.addEventListener("DOMContentLoaded", preguntarPresupuesto);

    formulario.addEventListener("submit", AgregarGasto);
}

////CLASSES

class Presupuesto {
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    } 

    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante(){
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0)
        this.restante = this.presupuesto - gastado;
    }
    eliminarGasto(id){
        this.gastos = this.gastos.filter( gasto => gasto.id !== id)
        this.calcularRestante();
    }
}

class UI {
    insertarPresupuesto(cantidad){
        //Extrayendo el valor del objeto de presupuesto con destructuring

        const { presupuesto, restante} = cantidad;

        //Agregar al HTML
        document.querySelector("#total").textContent = presupuesto;
        document.querySelector("#restante").textContent = restante;
    };

    imprimirAlerta(mensaje, tipo) {
        //Crear el DIV de alerta
        const divMensaje = document.createElement("div");
        divMensaje.classList.add("text-center", "alert");

        if (tipo==="error") {
            divMensaje.classList.add("alert-danger");
        } else {
            divMensaje.classList.add("alert-success");
        }

        //Mensaje de error

        divMensaje.textContent = mensaje;

        //Insertar en el HTML

        document.querySelector(".primario").insertBefore(divMensaje, formulario)

        //Quitar del HTML

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    mostrarGastos(gastos){

        //Limpiar HTML

        limpiarHTML();

        //Iterar sobre los gastos

        gastos.forEach( gasto => {

            const {cantidad, nombre, id} = gasto;

            //Crear un LI

            const nuevoGasto = document.createElement("li");
            nuevoGasto.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
            nuevoGasto.dataset.id = id; //Agrega un nuevo atributo al elemento (dataset agrega "data" y .id "-id" data-id)

            //Agregar el HTML del gasto

            nuevoGasto.innerHTML = `${nombre} <span class="bagde badge-primary badge-pill">$ ${cantidad} USD</span>`;

            //Botón para borrar el gasto

            const btnBorrar = document.createElement("button");
            btnBorrar.classList.add("btn", "btn-danger", "borrar-gasto")
            btnBorrar.textContent = "Borrar X"
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            //Agregar al HTML

            gastoListado.appendChild(nuevoGasto);
        })
    }

    actualizarRestante(restante){
        document.querySelector("#restante").textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj){
        const {presupuesto, restante} = presupuestoObj;

        const restanteDiv = document.querySelector(".restante")

        // Comprobar 25%

        if (restante < (presupuesto*0.25) ) {
            restanteDiv.classList.remove("alert-success", "alert-warning")
            restanteDiv.classList.add("alert-danger")
        } else if (restante < (presupuesto*0.5)) {
            restanteDiv.classList.remove("alert-success")
            restanteDiv.classList.add("alert-warning")
        } else {
            restanteDiv.classList.remove("alert-danger", "alert-warning");
            restanteDiv.classList.add("alert-success")
        }


        // Si el total es 0 o menor

        if(restante <= 0) {
            ui.imprimirAlerta ("El presupuesto se ha agotado", "error")
            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }
}


const ui = new UI();

let presupuesto;

////FUNCIONES

function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('¿Cuál es tu presupuesto?');

    if (presupuestoUsuario==="" || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <=0) {  //isNan verifica si el valor se puede convertir a número, si no se puede, devuelve True
        window.location.reload();  
    } 

    //Presupuesto válido
    presupuesto = new Presupuesto(presupuestoUsuario);

    //Asignamos al metodo en User Interface todo el objeto del presupuesto de la variable presupuesto
    ui.insertarPresupuesto(presupuesto);
}

  // Añade Gastos

function AgregarGasto(e) {
    e.preventDefault();

    //Leer los datos del formulario

    const nombre = document.querySelector("#gasto").value;
    const cantidad = Number(document.querySelector("#cantidad").value);

    //Validar formulario

    if(nombre === "" || cantidad === ""){
        ui.imprimirAlerta("Ambos campos son obligatorios", "error");
    
        return;
    } else if (cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta("Por favor ingresar una cantidad válida", "error")

        return;
    }

    // Generar un objeto con el gasto

    const gasto = {nombre, cantidad, id: Date.now()} //Date.now simula un ID, lo ideal seria que venga de una base de datos

    // Añade un nuevo gasto

    presupuesto.nuevoGasto( gasto );

    //Mensaje de éxito

    ui.imprimirAlerta("Gasto agregado correctamente");

    //Imprimir los gastos

    const {gastos, restante} = presupuesto;  //Extraer solo la propiedad gastos de todo el objeto de presupuesto
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);

    //Reinicia el formulario
    formulario.reset()
} 

//limpia el HTML previo en el listado de gastos

function limpiarHTML() {
    gastoListado.innerHTML="";
}

function eliminarGasto(id) {

    //Elimina los gastos del objeto
    presupuesto.eliminarGasto(id)

    //Elimina los gastos del HTML
    const {gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);

}

