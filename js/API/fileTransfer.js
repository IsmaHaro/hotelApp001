var ft = {
	exito: function(r){
		if(r.response){
			navigator.notification.alert("Registrado Correctamente", function(){
					navigator.vibrate(1000);
					navigator.notification.beep(1);
					window.localStorage.setItem("user", $("#regNom").val());
					window.location.href = "#home";
				}, "Bienvenido", "Siguiente");

			}else{
				navigator.notification.alert("Error al subir foto en el servidor");
			}
		}
	},

	error: function(){
		alert("Error al enviar foto al servidor");
	},

	transferir: function(path){
		// OPCIONES DE ENVIO
		var options      = new FileUploadOptions();
		options.fileKey  = "foto";
		options.fileName = "miFoto";
		options.mimeType = "image/jpeg";

		var ft2 = new FileTransfer();
		ft2.upload(path,"http://carlos.igitsoft.com/apps/test.php", ft.exito, ft.error, options);
	}
};