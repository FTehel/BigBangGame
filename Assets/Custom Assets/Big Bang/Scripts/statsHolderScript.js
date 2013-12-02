/*
Fraser Tehel 2013
*/

//var stats : formationDust = new formationDust();

function Awake () {
	findStats();
	DontDestroyOnLoad(transform.gameObject);
}

function findStats(){
	var main = Camera.main;
	if(main.GetComponent(formationDust) != null){
		var other = main.GetComponent(formationDust);
		GetComponent(formationDust).transferStats(other);
	}
	if(main.GetComponent(alterTime) != null){
		var other2 = main.GetComponent(alterTime);
		GetComponent(alterTime).transferStats(other2);
	}
	if(main.GetComponent(menu) != null){
		var other3 = main.GetComponent(menu);
		GetComponent(menu).transferStats(other3);
	}
	if(main.GetComponent(zoomCamera) != null){
		var other5 = main.GetComponent(zoomCamera);
		GetComponent(zoomCamera).transferStats(other5);
	}
	if(main.GetComponent(panCamera) != null){
		var other7 = main.GetComponent(panCamera);
		GetComponent(panCamera).transferStats(other7);
	}
	if(main.GetComponent(cameraTracking) != null){
		var other6 = main.GetComponent(cameraTracking);
		GetComponent(cameraTracking).transferStats(other6);
	}
	if(main.GetComponent(zoomCameraAndroid) != null){
		var other8 = main.GetComponent(zoomCameraAndroid);
		GetComponent(zoomCameraAndroid).transferStats(other8);
	}
	if(main.GetComponent(panCameraAndroid) != null){
		var other9 = main.GetComponent(panCameraAndroid);
		GetComponent(panCameraAndroid).transferStats(other9);
	}
	if(main.GetComponent(touchTimer) != null){
		var other10 = main.GetComponent(touchTimer);
		GetComponent(touchTimer).transferStats(other10);
	}
	if(main.GetComponent(createSolarSystem) != null){
		var other11 = main.GetComponent(createSolarSystem);
		GetComponent(createSolarSystem).transferStats(other11);
	}
}
