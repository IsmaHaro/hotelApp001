var mc = {
	exito: function(mediaFiles){
	 	var i, path, len;
	    for (i = 0, len = mediaFiles.length; i < len; i += 1) {
	        path = mediaFiles[i].fullPath;
	        $("#fotoTomada").html('<img src="'+path+'">');

	        $("#fotoTomada").attr("rel", path);
	    }
	},

	error: function(){
		alert("Error al tomar foto");
	},

	abrirCamara: function(){
		navigator.device.capture.captureImage(mc.exito, mc.error, {limit: 1});
	}
};