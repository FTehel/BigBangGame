/*
Fraser Tehel 2013
*/

var formations : Transform [];
var starRange : Vector2;
var massRange : Vector2;
var lengthRange : Vector2;
var positionRange : float;
var velocityRange : float;
var minDistance : float = 10;
static var startPos = Vector3.zero;
var power : float = -2;
static var currentX = 1;
var growSpeed : float = 100;
var maxDot : float = 0.7;
static var centralMass : Vector3;

function Start(){
	startFunction();
}

function startFunction () {
	GetComponent(createSolarSystem).getStats();
	currentX = 1;
	GetComponent(menu).playing = true;
	GetComponent(alterTime).playing = true;
	GetComponent(zoomCamera).playing = true;
	GetComponent(zoomCameraAndroid).playing = true;
	transform.GetComponent(panCamera).setStart();
	transform.GetComponent(panCameraAndroid).setStart();
	var ray : Ray = Camera.main.ScreenPointToRay(Vector2(Screen.width/2,Screen.height/2));
	var planePosition = Vector3(0,transform.GetComponent(formationDust).gravityPlane,0);
	var hPlane : Plane = new Plane(Vector3.up, planePosition);
	var distance : float = 0;
	if(hPlane.Raycast(ray, distance)){
	    startPos = ray.GetPoint(distance);
	}
	var distanceFromCentre : float = 0;
	var starNumber = Mathf.RoundToInt(Random.Range(starRange.x,starRange.y));
	for(var i = 0;i < starNumber;i++){
		distanceFromCentre += Random.Range(lengthRange.x,lengthRange.y);
		var newVector = randomVector(distanceFromCentre);
		var position : Vector3 = Vector3(Random.Range(startPos.x-positionRange,startPos.x + positionRange),0,
		Random.Range(startPos.z-positionRange,startPos.z + positionRange));
		if(i == 0){
			centralMass = position;
			GetComponent(generateGalaxy).setScene(position);
		}
		else{
			position = centralMass + newVector;
		}
		var velocity : Vector3 = Vector3(Random.Range(-velocityRange,velocityRange),0,
		Random.Range(-velocityRange,velocityRange));
		if(i != 0){
			var vectorToMass = centralMass - position;
			var dot = Vector3.Dot(velocity.normalized,vectorToMass.normalized);
			while(Mathf.Abs(dot) > maxDot){
				velocity = Vector3(Random.Range(-velocityRange,velocityRange),0,
				Random.Range(-velocityRange,velocityRange));
				dot = Vector3.Dot(velocity.normalized,vectorToMass.normalized);
			}
		}
		var mass = Random.Range(massRange.x,massRange.y);
		var currentY = Mathf.Pow(currentX, power);
		mass *= currentY;
		currentX++;
		var starIndex = Mathf.RoundToInt(Random.Range(0,formations.Length-1));
		var formation = formations[starIndex].GetComponent(formation);
		velocity *= 1-currentY;
		transform.GetComponent(formationDust).createFormation(position,formation.prefab,mass,velocity,formation,growSpeed);
	}
	transform.GetComponent(createSolarSystem).playing = true;
}

function isTooClose(position : Vector3){
	var formedObjects = transform.GetComponent(formationDust).formedObjects;
	for(var i = 0;i < formedObjects.length;i++){
		var otherPos = formedObjects[i].GetComponent(gravityWell).position;
		if(Vector3.Distance(otherPos,position) < minDistance){
			return true;
		}
	}
}

function newPosition(position : Vector3){
	var newPosition = position;
	while(isTooClose(newPosition)){
		newPosition = Vector3(Random.Range(startPos.x-positionRange,startPos.x + positionRange),0,
		Random.Range(startPos.z-positionRange,startPos.z + positionRange));
	}
	return newPosition;
}

function randomVector(length : float){
	var point = Random.insideUnitCircle;
	var point3 = Vector3(point.x,0,point.y);
	point3 = point3.normalized;
	return point3*length;
}