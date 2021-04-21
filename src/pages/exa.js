var markers = [];
var searchplace;
var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
var i = 0;
var mapContainer = document.getElementById("map"),
  // 지도를 표시할 div
  mapOption = {
    center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표 level: 5 // 지도의 확대 레벨
  };
var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function (position) {
    var lat = position.coords.latitude,
      lon = position.coords.longitude;
    var locPosition = new kakao.maps.LatLng(lat, lon);
    displayMarker(locPosition); //마커로 나의 위치를 표시
  });
} else {
  var locPosition = new kakao.maps.LatLng(33.450701, 126.570667);
  displayMarker(locPosition);
} //현재 위치 띄우기
function displayMarker(locPosition) {
  marker1 = new kakao.maps.Marker({ map: map, position: locPosition });
  var iwContent = (iwRemoveable = true);
  map.setCenter(locPosition);
} //검색후 위치띄우기
function displayMarker2(place) {
  var marker2 = new kakao.maps.Marker({
    map: map,
    position: new kakao.maps.LatLng(place.y, place.x),
  }); // 마커에 클릭이벤트를 등록합니다
  kakao.maps.event.addListener(marker2, "click", function () {
    var pn = place.place_name; // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
    infowindow.setContent("" + place.place_name + " " + "");
    infowindow.open(map, marker2);
    markers.push(marker2);
  });
} //메뉴 열리기
function openNav() {
  document.getElementById("myside").style.width = "300px";
} //메뉴 닫히기
function closeNav() {
  document.getElementById("myside").style.width = "0";
}
function locsearch() {
  searchplace = document.getElementsByClassName("search")[0].value;
  marker2.setMap(null);
  var ps = new kakao.maps.services.Places(); // 키워드로 장소를 검색합니다 ps.keywordSearch(searchplace, placesSearchCB);
} // 키워드 검색 완료 시 호출되는 콜백함수 입니다
function placesSearchCB(data, status, pagination) {
  if (status === kakao.maps.services.Status.OK) {
    marker1.setMap(null); // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해 // LatLngBounds 객체에 좌표를 추가합니다
    var bounds = new kakao.maps.LatLngBounds();
    for (var i = 0; i < data.length; i++) {
      displayMarker2(data[i]);
      bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
    } // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
    map.setBounds(bounds);
  }
}
function start_road(pn) {
  document.getElementById("locstart").value = pn;
}
function end_road(pn) {
  document.getElementById("locend").value = pn;
}
