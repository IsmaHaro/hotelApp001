var geo = {
	latitud: null,
	longitud: null,

	error: function(error){
		alert("Codigo: "+error.code);
	},

	exito: function(position){
alert("position: "+position.coords.latitude+" "+position.coords.longitude);
		geo.latitud = position.coords.latitude;
		geo.longitud = position.coords.longitude;

		// OPCIONES DEL MAPA
		var options = {
			zoom: 13,
			center: {
				lat: geo.latitud,
				lng: geo.longitud
			},
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		// CREAR EL MAPA
		var map = new google.maps.Map(document.getElementById("canvas"), options);
	},

	ponerMapa: function(){
		alert("Obteniendo coordenadas");
		navigator.geolocation.getCurrentPosition(geo.exito, geo.error);
	}

};