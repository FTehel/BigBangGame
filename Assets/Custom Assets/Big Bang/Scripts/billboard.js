var sceneCamera : GameObject;

function Awake(){
	sceneCamera = GameObject.Find("Main Camera");
}

function Update(){
	updateFunction();
}

function updateFunction(){
	var direction : Vector3 = sceneCamera.transform.position - transform.position;
	transform.rotation = Quaternion.FromToRotation(Vector3.up, direction);
}