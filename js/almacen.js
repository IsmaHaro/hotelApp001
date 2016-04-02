// document
// window
// navigator

var almacen = {
	db: null,
	tipoHabitacion: null,
	numPersonas: null,
	numHabitaciones: null,
	numDias: null,
	conectarDB: function(){
		return window.openDatabase("hotelApp", "1.0", "Hotel App", 200000);
	},
	error: function(error){
		alert("Error: "+error.message);
	},
	exito: function(){
		alert("Exito");
	},
	guardarReservasHistorial: function(th, np, nh, nd){
		almacen.db              = almacen.conectarDB();
		almacen.tipoHabitacion  = th;
		almacen.numPersonas     = np;
		almacen.numHabitaciones = nh;
		almacen.numDias         = nd;
		almacen.db.transaction(almacen.tablaHistorial, almacen.error, almacen.exito);
	},
	tablaHistorial: function(tx){
		// CREAR TABLA DE HISTORIAL
		tx.executeSql('CREATE TABLE IF NOT EXISTS historial (id INTEGER PRIMARY KEY, tipoh, nump, numh, numd)');

		// INSERTAR LOS DATOS
		tx.executeSql('INSERT INTO historial (tipoh, nump, numh, numd) VALUES ("'+almacen.tipoHabitacion+'", '+almacen.numPersonas+', '+almacen.numHabitaciones+', '+almacen.numDias+')');
	},

	cargarDatosHistorial: function(){
		almacen.db = almacen.conectarDB();
		almacen.db.transaction(almacen.leerHistorial, almacen.error);
	},

	leerHistorial: function(tx){
		tx.executeSql('SELECT * FROM historial', [], almacen.mostrarResultadosHistorial, null);
	},

	mostrarResultadosHistorial: function(tx, res){
		var cantidad = res.rows.length;
		var resultado = '<tr><td colspan="4">No hay reservas en el historial</td></tr>';

		if(cantidad > 0){
			// SI HAY RESERVAS EN EL HISTORIAL
			var resultado = '';

			for( var i = 0; i < cantidaad; i++){
				var th = res.rows.item(i).tipoh;
				var np = res.rows.item(i).nump;
				var nh = res.rows.item(i).numh;
				var nd = res.rows.item(i).numd;
				resultado += '<tr><td>'+th+'</td><td>'+np+'</td><td>'+nh+'</td><td>'+nd+'</td></tr>';
			}
		}

		$("#listaHistorial").html(resultado);
	}
};