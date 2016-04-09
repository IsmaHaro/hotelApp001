var fn = {
	deviceready: function(){
		document.addEventListener("deviceready", fn.init, false);
	},

	init: function(){

		// CHECAR SI USUARIO ESTA REGISTRADO
		if(!fn.estaRegistrado()){
			window.location.href="#registro";
		}

		$("#registro div[data-role=footer] a").tap(fn.registrar);
		$("#registro .ui-content a").tap(fn.tomarFoto);
		$("#reserva1 ul[data-role=listview] a").tap(fn.SeleccionarTipoHabitacion);
		$("#reserva1 div[data-role=navbar] .ui-btn-active").tap(fn.reserva1Siguiente);
		$("#reserva2 div[data-role=navbar] .ui-btn-active").tap(fn.hacerReserva);
		$("#boton-historial").tap(fn.mostrarHistorial);
		$("#boton-reservasp").tap(fn.mostrarReservasP);
		$("#boton-ubicacion").tap(fn.mostrarUbicacion);
		$("#boton-galeria").tap(fn.llenarGaleria);

		document.addEventListener("online", fn.sincronizarReservasPendientes, false);

		// PONER FECHA
		fn.ponerFecha();
	},

	llenarGaleria: function(){
		// CELDAS EN jquery mobile
		// <div class="ui-block-a"></div>
		// <div class="ui-block-b"></div>

		var impar = true;

		for(var i = 1; i <= 8 ; i++ ){
			if(impar){
				$("#gallery").append('<div class="ui-block-a"><img src="../img/galeria/'+i+'.jpg"></div>');
				impar = false;

			}else{
				$("#gallery").append('<div class="ui-block-b"><img src="../img/galeria/'+i+'.jpg"></div>');
				impar = true;
			}			
		}
	},

	mostrarUbicacion: function(){
		$.getScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyCKrZkh24ZjiYdD0BS445a5NjNEtn6oBeg&callback=mapa');
	},

	sincronizarReservasPendientes: function(){
		alert("Se sincronizo las reservas con el servidor");
		navigator.vibrate(1000);
		almacen.sincronizarPendientes();
	},

	mostrarReservasP: function(){
		almacen.cargarDatosReservasP();
	},

	mostrarHistorial: function(){
		almacen.cargarDatosHistorial();
	},

	hacerReserva: function(){
		// OBTENER LOS DATOS DE LA RESERVA
		var tipoDeHabitacion = $("#reserva1").attr("th");
		var numPersonas      = $("#numPersonas").val();
		var numHabitaciones  = $("#numHabitaciones").val();
		var numDias          = $("#numDias").val();

		// ENVIAR LOS DATOS DEPENDIENDO SI HAY O NO CONEXION
		if(ni.estaConectado()){
			// ENVIAR DATOS AL SERVIDOR
			fn.enviarReserva(tipoDeHabitacion, numPersonas, numHabitaciones, numDias);

		}else{
			// GUARDAR DATOS LOCALES
			almacen.guardarReservaLocal(tipoDeHabitacion, numPersonas, numHabitaciones, numDias);
		}

		// RESETEAR DATOS
		$("#reserva1 ul[data-role=listview] a").css("background-color", "");
		$("#reserva1").removeAttr("th");
		$("#reserva2 select").prop("selectedIndex", 0).selectmenu("refresh", true);

		// IR AL HOME
		window.location.href="#home";
	},

	enviarReserva: function(tipoDeHabitacion, numPersonas, numHabitaciones, numDias){
		$.ajax({
			method: "POST",
			url: "http://carlos.igitsoft.com/apps/test.php",
			data: {
				tipo: tipoDeHabitacion,
				habitaciones: numHabitaciones,
				personas: numPersonas,
				dias: numDias
			},
			error: function(){
				alert("Error de conexion con el servidor");
			}

		}).done(function(respuesta){
			if(respuesta == 1){
				// COLOCAR RESERVA EN EL HISTORIAL
				almacen.guardarReservasHistorial(tipoDeHabitacion, numPersonas, numHabitaciones, numDias);

			}else{
				alert("Error al guardar reserva en el servidor");
			}
		});
	},

	reserva1Siguiente: function(){
		if($("#reserva1").attr("th") != undefined){
			window.location.href = "#reserva2";

		}else{
			alert("Es necesario seleccionar un tipo de habitación");
		}
	},

	SeleccionarTipoHabitacion: function(){
		$("#reserva1 ul[data-role=listview] a").css("background-color", "");
		$(this).css("background-color", "#38C");
		$("#reserva1").attr("th", $(this).text());
	},

	estaRegistrado: function(){
		if(window.localStorage.getItem("user")){
			return true;
		}

		return false;
	},

	tomarFoto: function(){
		mc.abrirCamara();
	},

	registrar: function(){
		// OBTENER LOS DATOS DEL FORMULARIO
		var nombre = $("#regNom").val();
		var email  = $("#regEmail").val();
		var tel    = $("#regTel").val();
		var foto   = $("#fotoTomada").attr("rel");

		try{
			if(typeof nombre !== "string"){
				throw new Error("El nombre no es valido");
			}

			if(email == ""){
				throw new Error("Debe de agregar email");
			}

			if(foto == undefined){
				throw new Error("Debe de tomar una foto");
			}

			if(Number.isNaN(Number(tel))){
				throw new Error("El teléfono no es valido");
			}

			if(tel.length != 10 ){
				throw new Error("El teléfono debe de tener 10 digitos");
			}

			// ENVIAR EL REGISTRO AL SERVIDOR
			fn.enviarRegistro(nombre, email, tel, foto);

		}catch(error){
			alert(error);
		}
	},

	enviarRegistro: function(nombre, email, tel, foto){
		alert(nombre+" "+email+" "+tel);
		$.ajax({
			method: "POST",
			url: "http://carlos.igitsoft.com/apps/test.php",
			data: {
				nom: nombre,
				mail: email,
				tel: tel
			},
			error: function(e){
				alert("Error de conexion con AJAX ");
			}

		}).done(function( mensaje ){
			if( mensaje == 1){			
				ft.transferir(foto);

			}else{
				alert("Error al enviar los datos al servidor, mensaje: "+mensaje);
			}
		});
	},

	ponerFecha: function(){
		var fecha = new Date();

		var dia  = fecha.getDate();
		var mes  = fecha.getMonth()+1;
		var anio = fecha.getFullYear();

		var hoy = dia+" / "+mes+" / "+anio;

		$(".fecha").html(hoy);
	}
};


// EJECUTAR EN PHONEGAP
$(fn.deviceready);                                              

// EJECUTAR EN NAVEGADOR
//fn.init();
//$(fn.init);