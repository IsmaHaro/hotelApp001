// document
// window
// navigator

var almacen = {
	db: null,
	tipoHabitacion: null,
	numPersonas: null,
	numHabitaciones: null,
	numDias: null,
	correo: null,
	password: null,
	conectarDB: function(){
		return window.openDatabase("hotelApp", "1.0", "Hotel App", 200000);
	},
	error: function(error){
		alert("Error: "+error.message);
	},
	exito: function(){
		//alert("Exito");
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

	guardarUsuarios: function(correo, password){
		almacen.db       = almacen.conectarDB();
		almacen.correo   = correo;
		almacen.password = password;
		almacen.db.transaction(almacen.tablaUsuarios, almacen.error, almacen.exito);
	},

	tablaUsuarios: function(tx){
		// CREAR TABLA DE USUARIOS
		tx.executeSql('CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY, correo, password)');

		// INSERTAR LOS DATOS
		tx.executeSql('INSERT INTO usuarios (correo, password) VALUES ("'+almacen.correo+'", "'+almacen.password+'")');
	},

	comprobarExistenciaUsuario: function(mail, password){
		almacen.db				= almacen.conectarDB();
		almacen.correo			= mail;
		almacen.password		= password;

		almacen.db.transaction(almacen.leerUsuarios, almacen.error, almacen.exito);
	},

	leerUsuarios: function(tx){
		//Crear tabla de historial
		tx.executeSql('CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY, correo, password)');
		//leer tabla historial
		tx.executeSql('SELECT * FROM usuarios', [], almacen.validarUsuario);
	},

	validarUsuario:function(tx, res){
		var cantidad = res.rows.length;
		var coincidencias = 0;

		if(cantidad > 0){
			for(var i = 0; i < cantidad; i++){
				var mail = res.rows.item(i).correo;
				var pass = res.rows.item(i).password;

				if(mail == almacen.correo){
					if(pass == alamacen.password){
						coincidencias = 1;
						break;
					}
				}
			}
			if(coincidencias > 0){
				navigator.notification.alert("Sesión iniciada correctamente", function(){
					navigator.vibrate(1000);
					navigator.notification.beep(1);
					window.localStorage.setItem("user", almacen.correo);
					window.location.href="#home";
				}, "Bienvenido", "Siguiente");
			} else {
				navigator.notification.alert("Usuario o contraseña no válidos", function(){
					
				}, "Error", "Aceptar");
			}
		} else {
			navigator.notification.alert("Usuario o contraseña no válidos", function(){
					
			}, "Error", "Aceptar");
		}
	}

	cargarDatosHistorial: function(){
		almacen.db = almacen.conectarDB();
		almacen.db.transaction(almacen.leerHistorial, almacen.error);
	},

	leerHistorial: function(tx){
		// CREAR TABLA DE HISTORIAL SI NO EXISTE
		tx.executeSql('CREATE TABLE IF NOT EXISTS historial (id INTEGER PRIMARY KEY, tipoh, nump, numh, numd)');

		// LEER DEL HISTORIAL
		tx.executeSql('SELECT * FROM historial', [], almacen.mostrarResultadosHistorial, null);
	},

	mostrarResultadosHistorial: function(tx, res){
		var cantidad = res.rows.length;
		var resultado = '<tr><td colspan="4">No hay reservas en el historial</td></tr>';

		if(cantidad > 0){
			// SI HAY RESERVAS EN EL HISTORIAL
			var resultado = '';

			for( var i = 0; i < cantidad; i++){
				var th = res.rows.item(i).tipoh;
				var np = res.rows.item(i).nump;
				var nh = res.rows.item(i).numh;
				var nd = res.rows.item(i).numd;
				resultado += '<tr><td>'+th+'</td><td>'+np+'</td><td>'+nh+'</td><td>'+nd+'</td></tr>';
			}
		}

		$("#listaHistorial").html(resultado);
	},

	guardarReservaLocal: function(th, np, nh, nd){
		almacen.db              = almacen.conectarDB();
		almacen.tipoHabitacion  = th;
		almacen.numPersonas     = np;
		almacen.numHabitaciones = nh;
		almacen.numDias         = nd;
		almacen.db.transaction(almacen.tablaReservasPendientes, almacen.error, almacen.exito);
	},

	tablaReservasPendientes: function(tx){
		// CREAR TABLA DE RESERVAS_PENDIENTES
		tx.executeSql('CREATE TABLE IF NOT EXISTS reservas_pendientes (id INTEGER PRIMARY KEY, tipoh, nump, numh, numd)');

		// INSERTAR LOS DATOS
		tx.executeSql('INSERT INTO reservas_pendientes (tipoh, nump, numh, numd) VALUES ("'+almacen.tipoHabitacion+'", '+almacen.numPersonas+', '+almacen.numHabitaciones+', '+almacen.numDias+')');
	},

	cargarDatosReservasP: function(){
		almacen.db = almacen.conectarDB();
		almacen.db.transaction(almacen.leerReservasP, almacen.error);
	},

	leerReservasP: function(tx){
		// CREAR TABLA DE RESERVAS_PENDIENTES
		tx.executeSql('CREATE TABLE IF NOT EXISTS reservas_pendientes (id INTEGER PRIMARY KEY, tipoh, nump, numh, numd)');

		// LEER TABLA DE RESERVAS_PENDIENTES		
		tx.executeSql('SELECT * FROM reservas_pendientes', [], almacen.mostrarResultadosReservasP, null);
	},

	mostrarResultadosReservasP: function(tx, res){
		var cantidad = res.rows.length;
		var resultado = '<tr><td colspan="4">No hay reservas pendientes</td></tr>';

		if(cantidad > 0){
			// SI HAY RESERVAS PENDIENTES
			var resultado = '';

			for( var i = 0; i < cantidad; i++){
				var th = res.rows.item(i).tipoh;
				var np = res.rows.item(i).nump;
				var nh = res.rows.item(i).numh;
				var nd = res.rows.item(i).numd;
				resultado += '<tr><td>'+th+'</td><td>'+np+'</td><td>'+nh+'</td><td>'+nd+'</td></tr>';
			}
		}

		$("#listaReservasP").html(resultado);
	},

	sincronizarPendientes: function(){
		almacen.db = almacen.conectarDB();
		almacen.db.transaction(almacen.leerPendientes, almacen.error);
	},

	leerPendientes: function(tx){
		// CREAR TABLA DE RESERVAS_PENDIENTES SI AUN NO EXISTE
		tx.executeSql('CREATE TABLE IF NOT EXISTS reservas_pendientes (id INTEGER PRIMARY KEY, tipoh, nump, numh, numd)');

		// LEEMOS LA TABLA DE RESERVAS_PENDIENTES
		tx.executeSql('SELECT * FROM reservas_pendientes', [], almacen.procesarPendientes);
	},

	procesarPendientes: function(tx, res){
		var cantidad = res.rows.length;

		if(cantidad > 0){
			for( var i = 0; i < cantidad; i++){
				var th = res.rows.item(i).tipoh;
				var np = res.rows.item(i).nump;
				var nh = res.rows.item(i).numh;
				var nd = res.rows.item(i).numd;

				fn.enviarReserva(th, np, nh, nd);
				tx.executeSql('DELETE FROM reservas_pendientes WHERE id = "'+res.rows.item(i).id+'"');
			}
		}
	}
};