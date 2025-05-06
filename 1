<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>자전거 대여 시스템</title>
    <style>
        #map {
            height: 400px;
            width: 100%;
        }
    </style>
</head>
<body>
    <h1>자전거 대여 시스템</h1>

    <div>
        <button id="rentButton">대여</button>
        <button id="returnButton">반납하기</button>
        <p>대여 시간: <span id="timer">0</span> 초</p>
    </div>

    <div id="map"></div>

    <script>
        let rentButton = document.getElementById("rentButton");
        let returnButton = document.getElementById("returnButton");
        let timerElement = document.getElementById("timer");
        let map, bikeMarker, timerInterval;
        let startTime, currentTime;

        // 지도 초기화
        function initMap() {
            map = new google.maps.Map(document.getElementById("map"), {
                center: { lat: 37.5665, lng: 126.978 },
                zoom: 15
            });
        }

        // 대여 버튼 클릭 시 타이머 시작
        rentButton.addEventListener("click", function () {
            startTime = Date.now();
            timerInterval = setInterval(updateTimer, 1000);
        });

        // 반납 버튼 클릭 시 자전거 위치 표시
        returnButton.addEventListener("click", function () {
            if (bikeMarker) {
                bikeMarker.setMap(null); // 기존 자전거 마커 삭제
            }
            navigator.geolocation.getCurrentPosition(function (position) {
                let userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                bikeMarker = new google.maps.Marker({
                    position: userLocation,
                    map: map,
                    title: "자전거 위치"
                });
                map.setCenter(userLocation); // 지도 중앙을 사용자 위치로 설정
            });
        });

        // 타이머 업데이트 함수
        function updateTimer() {
            currentTime = Date.now();
            let elapsedTime = Math.floor((currentTime - startTime) / 1000);
            timerElement.textContent = elapsedTime;
        }

        // 구글 지도 API 로드
        function loadGoogleMapsScript() {
            let script = document.createElement('script');
            script.src = "https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&callback=initMap";
            script.async = true;
            document.body.appendChild(script);
        }

        loadGoogleMapsScript();
    </script>
</body>
</html>
