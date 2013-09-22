var xLimit : Vector2 = Vector2(100,100);
var zLimit : Vector2 = Vector2(100,100);

var edgeThreshold : float = 5;

var cameraSpeed : float = 10;

static var startPos : Vector3;

var playing = false;

var infinite = false;

var speedToZoom : float = 1;

class limits{
	static var maxX : float;
	static var minX : float;
	static var maxZ : float;
	static var minZ : float;
}

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
		transferStats(other.GetComponent(panCamera));
	} 
}

function Update () {
	if(playing){
		updateFunction();
	}
}

function updateFunction(){
	transform.position += findEdge()*getSpeed()*Time.deltaTime/Time.timeScale;
}

function isMouseNearEdge(){
	var mousePos = Input.mousePosition;
	if(mousePos.x <= edgeThreshold || mousePos.x >= Screen.width - edgeThreshold || 
	mousePos.y <= edgeThreshold || mousePos.y >= Screen.height - edgeThreshold){
		return true;
	}
	return false;
}

function findEdge(){
	var mousePos = Input.mousePosition;
	var edge : Vector3;
	if(isMouseNearEdge()){
		if(mousePos.x <= edgeThreshold){
			edge.x = -1;
			if(!infinite && transform.position.x < limits.minX){
				edge.x = 0;
			}
		}
		if(mousePos.y <= edgeThreshold){
			edge.z = -1;
			if(!infinite && transform.position.z < limits.minZ){
				edge.z = 0;
			}
		}
		if(mousePos.x >= Screen.width - edgeThreshold){
			edge.x = 1;
			if(!infinite && transform.position.x > limits.maxX){
				edge.x = 0;
			}
		}
		if(mousePos.y >= Screen.height - edgeThreshold){
			edge.z = 1;
			if(!infinite && transform.position.z > limits.maxZ){
				edge.z = 0;
			}
		}
		return edge;
	}
	return Vector3.zero;
}

function getSpeed(){
	var zoom = Camera.main.GetComponent(zoomCamera);
	var height = Camera.main.transform.position.y - zoom.gravityPlane;
	return cameraSpeed * height * speedToZoom;
}

function transferStats(other : panCamera){
	xLimit = other.xLimit;
	zLimit = other.zLimit;
	edgeThreshold = other.edgeThreshold;
	cameraSpeed = other.cameraSpeed;	
	speedToZoom = other.speedToZoom;
}