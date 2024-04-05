var map = L.map('map').setView([22.1696, 91.4996], 10);
        mapLink = "<a href='http://openstreetmap.org'>OpenStreetMap</a>";
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: 'Leaflet &copy; ' + mapLink + ', contribution',
            maxZoom: 18
        }).addTo(map);

		function calculateDistance(lat1, lon1, lat2, lon2) {
			const Radius = 6371; 
			const dLat = (lat2 - lat1) * Math.PI / 180; 
			const dLon = (lon2 - lon1) * Math.PI / 180;
			const circleDistance = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
					  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
					  Math.sin(dLon / 2) * Math.sin(dLon / 2);
			const centralAngle = 2 * Math.atan2(Math.sqrt(circleDistance), Math.sqrt(1 - circleDistance));
			const distance = Radius * centralAngle;
			return distance;
		}
		
		const lat1 = 22.1696;
		const lon1 = 91.4996;
		const lat2 = 22.2637;
		const lon2 = 91.7159;

		const marker = L.marker([22.1696, 91.4996], {}).addTo(map);
		const newMarker = L.marker([22.2637, 91.7159]).addTo(map);
		
		const shipIcon = L.icon({
			iconUrl: 'vessel-icon.png',
			iconSize: [40, 40]
		})
		
        const shipMarker = L.marker([22.1696, 91.4996], {
            icon: shipIcon
        }).addTo(map);

        map.on('click', function (e) {

            const startPoint = L.latLng(22.1696, 91.4996);
            const endPoint = L.latLng(22.2637, 91.7159);
			
            const speed = 20;
            const distance = calculateDistance(lat1, lon1, lat2, lon2); 
            const duration = ((distance / speed) * 3600);

            shipMarker.animate = function (from, to) {
                const start = +new Date();
                let timer = setInterval(function () {
                    const timeElap = +new Date() - start;
                    if (timeElap > duration) {
                        clearInterval(timer);
                    }
                    const progress = timeElap / duration;
                    const lng = from[0].lng + (to[0].lng - from[0].lng) * progress;
                    const lat = from[0].lat + (to[0].lat - from[0].lat) * progress;
                    shipMarker.setLatLng([lat, lng]);
                }, 500);
            }
            shipMarker.animate([startPoint], [endPoint]);
        });