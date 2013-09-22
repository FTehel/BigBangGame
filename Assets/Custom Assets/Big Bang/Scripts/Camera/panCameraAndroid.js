var xLimit : Vector2 = Vector2(100,100);
var zLimit : Vector2 = Vector2(100,100);

var edgeThreshold : float = 5;

var cameraSpeed : float = 10;

static var startPos : Vector3;

var playing = false;

var infinite = false;

var speedToZoom : float = 1;

var lastPos : Vector2;
var currentPos : Vector2;
var movement : Vector2;

var moving : boolean = false;

static var limits : limits = new limits();

function setStart(){
	startPos = transform.position;
	limits.maxX = startPos.x + xLimit.x;
	limits.minX = startPos.x - xLimit.y;
	limits.maxZ = startPos.z + zLimit.x;
	limits.minZ = startPos.z - zLimit.y;
	playing = true;
	var other = GameObject.Find("statsHolder");
	if(other!=null){
		transferStats(other.GetComponent(panCameraAndroid));
	}
}

function Update () {
	if(playing){
		updateFunction();
	}
}

function updateFunction(){
	if(!moving && Input.touches.Length == 2){
		moving = true;
		getMovement();
	}
	if(moving && Input.touches.Length == 2){
		getMovement();
		move();
	}
	if(moving && Input.touches.Length != 2){
		moving = false;
	}
}

function getMovement(){
	var average = (Input.touches[0].position + Input.touches[1].position)/2;
	currentPos = average;
	movement = currentPos - lastPos;
	lastPos = currentPos;
}

function move(){
	if(!infinite){
		if(movement.x > 0 && transform.position.x + movement.x <= limits.maxX){
			transform.position.x -= movement.x * getSpeed();
		}
		if(movement.x < 0 && transform.position.x + movement.x >= limits.minX){
			transform.position.x -= movement.x * getSpeed();
		}
		if(movement.y > 0 && transform.position.z + movement.y <= limits.maxZ){
			transform.position.z -= movement.y * getSpeed();
		}
		if(movement.y < 0 && transform.position.z + movement.y >= limits.minZ){
			transform.position.z -= movement.y * getSpeed();
		}
	}
	else{
		transform.position.x -= movement.x * getSpeed();
		transform.position.z -= movement.y * getSpeed();
	}
}

function getSpeed(){
	var zoom = Camera.main.GetComponent(zoomCamera);
	var height = Camera.main.transform.position.y - zoom.gravityPlane;
	return cameraSpeed * height * speedToZoom;
}

function transferStats(other : panCameraAndroid){
	xLimit = other.xLimit;
	zLimit = other.zLimit;
	edgeThreshold = other.edgeThreshold;
	cameraSpeed = other.cameraSpeed;	
	speedToZoom = other.speedToZoom;
}