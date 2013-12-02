var target : Transform;
var targetPosition : Vector3 = Vector3.zero;
var lastTargetPos : Vector3 = Vector3.zero;
var currentTargetPos : Vector3 = Vector3.zero;
var movementThreshold : float;
var doubleClickTime : float = 0.5;
var lastClick : float = 0;
var currentCentreMass : Vector3;
var positionLerpSpeed : float = 5;

var targetLerpSpeed : float = 10;
var currentTargetLerpPos : Vector3;
var lastTargetLerpPos : Vector3;
var targetFound = false;
var targetFoundDistance : float = 3;
var zoomScaleRatio : float = 2;
var selectDistance : float = 0.03;
var zoomDistance : float = 1;
var collisionDistance : float = 2;

var touchDown : boolean = false;
var mouseDown : boolean = false;
var android = false;

function getDistance(){
	var zoom = Camera.main.GetComponent(zoomCamera);
	var height = Camera.main.transform.position.y - zoom.gravityPlane;	
	return selectDistance * height;
}

function Awake () {
	var other = GameObject.Find("statsHolder");
	if(other!=null){
		transferStats(other.GetComponent(cameraTracking));
	}
	currentCentreMass = centreMass();
	setTargetPosition(currentCentreMass);
}

function LateUpdate () {
	if(!android){
		updateFunctionPC();
	}
	else{
		updateFunctionAndroid();
	}
}

function updateFunctionPC(){
	if(Input.GetMouseButton(0) && !mouseDown){
		mouseDown = true;
		if(Time.time <= lastClick + (doubleClickTime*Time.timeScale)){
			selectTarget();
		}
		lastClick = Time.time;
	}
	if(!Input.GetMouseButton(0)){
		mouseDown = false;
	}
	if(target != null){
		setTargetPosition(target.position);
		if(!targetFound){
			GetComponent(panCamera).playing = false;
			lerpToTarget(target.position);
		}
	}
	/*else{
		setTargetPosition(centreMass());
	}*/
	if(targetFound){
		GetComponent(panCamera).playing = true;
		moveCamera();
	}
}

function updateFunctionAndroid(){
	if(Input.touches.Length == 1 && !touchDown){
		touchDown = true;
		if(Time.time <= lastClick + (doubleClickTime*Time.timeScale)){
			selectTarget();
		}
		lastClick = Time.time;
	}
	if(Input.touches.Length == 0){
		touchDown = false;
	}
	if(target != null){
		setTargetPosition(target.position);
		if(!targetFound){
			GetComponent(panCamera).playing = false;
			lerpToTarget(target.position);
		}
	}
	/*else{
		setTargetPosition(centreMass());
	}*/
	if(targetFound){
		GetComponent(panCamera).playing = true;
		moveCamera();
	}
}

function transferStats(other : cameraTracking){
	collisionDistance = other.collisionDistance;
	movementThreshold = other.movementThreshold;
	doubleClickTime = other.doubleClickTime;
	positionLerpSpeed = other.positionLerpSpeed;
	targetLerpSpeed = other.targetLerpSpeed;
	targetFoundDistance = other.targetFoundDistance;
	zoomScaleRatio = other.zoomScaleRatio;
	selectDistance = other.selectDistance;
	android = other.android;
}

function moveCamera(){
	var movement = Vector3.zero;
	var percent : float = 1;
	currentTargetPos = targetPosition;
	movement = (currentTargetPos - lastTargetPos);
	lastTargetPos = currentTargetPos;
	movement.y = 0;
	if(target != null && distance(targetPosition) < movementThreshold * target.localScale.x){
		percent = distance(targetPosition)/(movementThreshold*target.localScale.x);
	}
	movement*=percent;
	Camera.main.transform.position += movement;
}

function selectTarget(newTarget : Transform){
	if(newTarget!= null){
		target = newTarget;
		lastTargetPos = newTarget.position;
		currentTargetPos = newTarget.position;
		targetFound = false;
		currentTargetLerpPos = centreScreen(newTarget.position);
		lastTargetLerpPos = centreScreen(newTarget.position);
		zoomDistance = newTarget.localScale.x * zoomScaleRatio;
		if(zoomDistance <= 0){
			zoomDistance = 0.1;
		}
		var targetPlanetInterface = target.GetComponent(planetInterface);
		if(targetPlanetInterface != null){
			if(target.GetComponent(planet).enabled){
				targetPlanetInterface.displaying = true;
			}
		}
	}
	else{
		deselect();
	}
}



function selectTarget(dust : formationDust){
	var nearbyObjects : Transform[] = new Transform[0];
	var closestDistance : float;
	for(var i = 0;i < dust.formedObjects.length;i++){
		var distance = Vector3.Distance(dust.formedObjects[i].position, dust.mouseGrav.position);
		if(distance <=  getDistance() + (dust.formedObjects[i].localScale.x/2)){
			if(getDistance() + (dust.formedObjects[i].localScale.x/2) > closestDistance){
				closestDistance = getDistance() + (dust.formedObjects[i].localScale.x/2);
			}
			var temp = new Transform [nearbyObjects.length + 1];
			for(var j = 0;j < nearbyObjects.length;j++){
				temp[j] = nearbyObjects[j];
			}
			temp[nearbyObjects.length] = dust.formedObjects[i];
			nearbyObjects = temp;
		}
	}
	for(var l = 0;l < dust.asteroids.length;l++){
		var distance2 = Vector3.Distance(dust.asteroids[l].position, dust.mouseGrav.position);
		if(distance2 <=  getDistance() + (dust.asteroids[l].localScale.x/2)){
			if(getDistance() + (dust.asteroids[l].localScale.x/2) > closestDistance){
				closestDistance = getDistance() + (dust.asteroids[l].localScale.x/2);
			}
			var temp2 = new Transform [nearbyObjects.length + 1];
			for(var m = 0;m < nearbyObjects.length;m++){
				temp2[m] = nearbyObjects[m];
			}
			temp2[nearbyObjects.length] = dust.asteroids[l];
			nearbyObjects = temp2;
		}
	}
	var closestInt = -1;
	for(var k = 0;k< nearbyObjects.length;k++){
		var distance3 = Vector3.Distance(nearbyObjects[k].position, dust.mouseGrav.position);
		if(distance3 < closestDistance){
			closestInt = k;
			closestDistance = distance3;
		}
	}
	if(closestInt != -1 && nearbyObjects[closestInt] != target){
		selectTarget(nearbyObjects[closestInt]);
	}
	else{
		deselect();
	}
}

function selectTarget(){
	if(GetComponent(formationDust) != null && GetComponent(formationDust).playing){
		selectTarget(GetComponent(formationDust));
	}
}

function deselect(){
	if(target != null){
		var targetPlanetInterface = target.GetComponent(planetInterface);
		if(targetPlanetInterface != null){
			if(target.GetComponent(planet).enabled){
				targetPlanetInterface.displaying = false;
			}
		}
	}
	target = null;
	currentTargetPos = targetPosition;
	lastTargetPos = targetPosition;
	targetFound = true;
	var zoom = GetComponent(zoomCamera);
	zoom.targetFound = true;
	
}

function centreScreen(plane : Vector3){
	var ray : Ray = Camera.main.ScreenPointToRay(Vector2(Screen.width/2,Screen.height/2));
	var planePosition = plane;
	var hPlane : Plane = new Plane(Vector3.up, planePosition);
	var distance : float = 0;
	var position : Vector3;
	if(hPlane.Raycast(ray, distance)){
	    position = ray.GetPoint(distance);
	}
	return position;
}

function distance(plane : Vector3){
	return Vector3.Distance(centreScreen(plane),targetPosition);
}

function centreMass(){
	var firstStars = GetComponent(formationDust);
	
	if(firstStars != null && firstStars.playing){
		return firstStars.centreMass();
	}
}

function setTargetPosition(newPosition : Vector3){
	targetPosition = newPosition;
	currentTargetPos = newPosition;
}

function lerpToTarget(vector : Vector3){
	var cameraVector = Camera.main.transform.TransformDirection(Vector3.forward);
	cameraVector = -cameraVector.normalized;
	var zoomVector = cameraVector * zoomDistance;
	var lerpTarget = vector + zoomVector;
	
	var distance = Vector3.Distance(centreScreen(vector),vector);
	var speed = targetLerpSpeed/distance;
	currentTargetLerpPos = Vector3.Lerp(Camera.main.transform.position,lerpTarget, speed);
	/*var movement = vector - centreScreen(vector);
	movement = currentTargetLerpPos - lastTargetLerpPos;*/
	Camera.main.transform.position = currentTargetLerpPos;
	//lastTargetLerpPos = currentTargetLerpPos;
	if(Vector3.Distance(Camera.main.transform.position,lerpTarget) <= targetFoundDistance){
		targetFound = true;
	}
}

function collideCamera(object : Transform){
	var radius = object.localScale.x;
	var h = radius * collisionDistance;
	if(Vector3.Distance(transform.position,object.position) < h){
		var a = Vector2.Distance(Vector2(transform.position.x,transform.position.z),Vector2(object.position.x,object.position.z));
		var x = Mathf.Sqrt((h*h) - (a*a));
		transform.position.y = x + object.position.y;
	}
}

function getCollisions(){
	
}