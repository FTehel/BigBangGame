var speed : float = 10;
var velocity : Vector3 = Vector3.zero;
var position : Vector3 = Vector3.zero;
var orbitee : Transform;
var dragging = false;
var avoidDistance : float = 2;
var dust : formationDust;

function Start(){
	dust = GetComponent(formationDust);
}

function updateFunction(){
	velocity.y = 0;
	this.position += velocity*Time.deltaTime;
	transform.position = getPosition();
	speed = velocity.magnitude;
}

function Update(){
	updateFunction();
}

function flyAwayFromObject(f : Transform){
	var gravWell = f.GetComponent(gravityWell);
	var v = gravWell.velocity;
	var mass = gravWell.mass;
	var size = f.localScale.x;
	var p = f.position;
	if(Vector3.Distance(p,position) < minSafeDistance(mass,size)){
		
	}
}

function isInPath(size : float, velocity : Vector3){
	var right = Vector3(-velocity.z,velocity.y,velocity.y);
	var s1 = right.normalized;
}

function minSafeDistance(mass : float, size : float){
	 var minEscape = Mathf.sqrt(mass/speed);
	 var minCollide = size*0.75;
	 if(minEscape > minCollide){
	 	return minEscape;
	 }
	 return minCollide;
}

function escapeVector(){
}

function setVelocity(v : Vector3){
	
}