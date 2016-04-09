var geo = {
	latitud: null,
	longitud: null,

	error: function(error){
		alert("Codigo: "+error.code);
	},

	exito: function(position){
		geo.latitud = position.coords.latitude;
		geo.longitud = position.coords.longitude;

		var hotel = {
			lat: 19.046583,
			lng: -98.207966
		}

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

		var directionsDisplay = new google.maps.DirectionsRender({
			map: map
		});

		var request = {
			destination: hotel,
			origin: {
				lat: geo.latitud,
				lng: geo.longitud
			},
			travelMode: google.maps.TravelMode.DRIVING
		};

		// CREAR SERVICIO DE DIRECCIONES
		var directionsService = new google.maps.DirectionsService();

		// SOLICITAR LA RUTA
		directionsService.route(request, function(response, status){
			if(status == google.maps.DirectionsStatus.OK){
				// DESPLEGAR LA RUTA EN EL MAPA
				directionsDisplay.setDirections(response);
			}
		});
	},

	ponerMapa: function(){
		alert("Obteniendo coordenadas");
		navigator.geolocation.getCurrentPosition(geo.exito, geo.error);
	}

};