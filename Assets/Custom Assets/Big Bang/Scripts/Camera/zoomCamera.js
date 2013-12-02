var sensitivity : float = 1;
var limits : Vector2 = Vector2(5,40);
var zoomSpeed : float = 2;
var originalLimits : Vector2;

var playing = false;
var zoomTarget : Vector3;
var targetFound = true;
var zoomDistance : float;

var sceneSet = false;
var gravityPlane : float;
var targetZoomSpeed : float;

function LateUpdate () {
	if(playing){
		updateFunction();
		if(!sceneSet){
			setScene();
		}
	}
}

function Awake(){
	var other = GameObject.Find("statsHolder");
	if(other!=null){
		transferStats(other.GetComponent(zoomCamera));
	} 
	originalLimits = limits;
}

function setScene(){
	var plane : float;
	if(GetComponent(formationDust) != null){
		plane = GetComponent(formationDust).gravityPlane;
	}
	gravityPlane = plane;
	limits.x = plane + originalLimits.x;
	limits.y = plane + originalLimits.y;
	//gravityWell = plane;
	sceneSet = true;
} 

function setLimits(newLimits : Vector2, solarSystem : boolean){
	var plane : float;
	//if(!solarSystem){
	plane = GetComponent(formationDust).gravityPlane;
	//}
	originalLimits = newLimits;
	limits.x = originalLimits.x + plane;
	limits.y = originalLimits.y + plane;
}

function transferStats(other : zoomCamera){
	sensitivity = other.sensitivity;
	limits = other.limits;
	zoomSpeed = other.zoomSpeed;
	targetZoomSpeed = other.targetZoomSpeed;
}

function updateFunction(){
	if(Time.timeScale != 0 && zoomInput() != 0){
		var movement = cameraDirection() * zoomInput() * Time.deltaTime * sensitivity; 
		movement = limitMovement(movement);
		if((movement.y > 0 && Camera.main.transform.position.y <= limits.y) ||
		(movement.y < 0 && Camera.main.transform.position.y >= limits.x)){
			Camera.main.transform.position += movement;
		}
	}
	if(!targetFound){
		//zoomToDistance(zoomDistance,zoomTarget);
	}
}

function cameraDirection(){
	var cam : Transform = Camera.main.transform;
	var cameraFront : Vector3 = cam.TransformDirection (Vector3.forward);
	return cameraFront.normalized;
}

function zoomInput(){
	if(Time.timeScale != 0){
		return (Input.GetAxis("Mouse ScrollWheel")/Time.timeScale)*(Camera.main.transform.position.y-gravityPlane);
	}
	return 0;
}

function limitMovement(vector : Vector3){
	var newY = transform.position.y + vector.y;
	var percent : float = 1;
	var distance : float;
	if(newY < limits.x){
		distance = transform.position.y - limits.x;
		percent = Mathf.Abs(distance/vector.y);
		targetFound = true;
	}
	if(newY > limits.y){
		distance = transform.position.y - limits.y;
		percent = Mathf.Abs(distance/vector.y);
		targetFound = true;
	}
	vector *= percent;
	return vector;
}

var totalDistance : float = 1;
var currentDistance : float = 1;

function setTotalDistance(target : Vector3){
	totalDistance = Vector3.Distance(transform.position,target);
	totalDistance -= zoomDistance;
	currentDistance = 0;
}

var movementPercent : float = 1;

function setPercent(distance : float){
	movementPercent = distance;
}

function zoomToDistance(distance : float, target : Vector3){
	var movement = cameraDirection() * Time.deltaTime * targetZoomSpeed;
	Debug.Log(targetZoomSpeed + " 1");
	var newPos = Camera.main.transform.position + movement;
	var yDifference = transform.position.y - (target.y +distance);
	var heightToDistance = movement.y/Vector2(movement.x,movement.z).magnitude;
	var minHeight = target.y +distance;
	if(newPos.y < minHeight){
		movement = movement.normalized;
		var newH = Mathf.Abs(transform.position.y - minHeight);
		movement*= newH*heightToDistance;
		targetFound = true;
	}
	movement = limitMovement(movement);
	Camera.main.transform.position += movement;
}

function zoomToDistance(distance : float, target : Vector3, percent : float){
	var movement = cameraDirection();
	var distanceMag = percent * totalDistance;
	var currentPercent = currentDistance/totalDistance;
	var newPercent = distanceMag/totalDistance;
	var percentDifference = currentPercent - newPercent;
	movement*= percentDifference*totalDistance;
	var newPos = Camera.main.transform.position + movement;
	var yDifference = transform.position.y - (target.y +distance);
	var heightToDistance = movement.y/Vector2(movement.x,movement.z).magnitude;
	var minHeight = target.y +distance;
	if(newPos.y < minHeight){
		movement = movement.normalized;
		var newH = Mathf.Abs(transform.position.y - minHeight);
		movement*= newH*heightToDistance;
		targetFound = true;
	}
	movement = limitMovement(movement);
	Camera.main.transform.position += movement;
}

function setTargetZoomSpeed(time : float, target : Vector3){
	var distance = Vector3.Distance(target, transform.position);
	distance -= zoomDistance;
	targetZoomSpeed = distance/time;
}