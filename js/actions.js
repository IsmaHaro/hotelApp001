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

		// PONER FECHA
		fn.ponerFecha();
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

			if(tel.length == 10 ){
				throw new Error("El teléfono debe de tener 10 digitos");
			}

			// ENVIAR EL REGISTRO AL SERVIDOR
			fn.enviarRegistro(nombre, email, tel, foto);

		}catch(error){
			alert(error);
		}
	},

	enviarRegistro: function(nombre, email, tel, foto){
		$.ajax({
			method: "POST",
			url: "http://carlos.igitsoft.com/apps/test.php",
			data: {
				nom: nombre,
				mail: email,
				tel: tel
			},
			error: function(){
				alert("Error de conexion con AJAX");
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