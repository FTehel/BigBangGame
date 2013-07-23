var xLimit : Vector2 = Vector2(100,100);
var zLimit : Vector2 = Vector2(100,100);

var edgeThreshold : float = 5;

var cameraSpeed : float = 10;

static var startPos : Vector3;

var playing = false;

var infinite = false;

class limits{
	static var maxX;
	static var minX;
	static var maxZ;
	static var minZ;
}

static var limits : limits = new limits();

function setStart(){
	startPos = transform.position;
	limits.maxX = startPos.x + xLimit.x;
	limits.minX = startPos.x - xLimit.y;
	limits.maxZ = startPos.z + zLimit.x;
	limits.minZ = startPos.z - zLimit.y;
	playing = true;
}

function Update () {
	if(playing){
		updateFunction();
	}
}

function updateFunction(){
	transform.position += findEdge()*cameraSpeed*Time.deltaTime/Time.timeScale;
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