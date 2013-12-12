var speed : float = 10;
var gVelocity : Vector3 = Vector3.zero;
var thrustVelocity : Vector3 = Vector3.zero;
var position : Vector3 = Vector3.zero;
var orbitee : Transform;
var dragging = false;
var avoidDistance : float = 2;
var dust : formationDust;
var fuel = 100;
var infiniteFuel = true;

function Start(){
	dust = GetComponent(formationDust);
}

function updateFunction(){
	var velocity = getVelocity();
	velocity.y = 0;
	this.position += velocity*Time.deltaTime;
	transform.position = position;
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
	var minDistance = minSafeDistance(mass,size);
	if(Vector3.Distance(p,position) < minDistance){
		var vToObject = position - p;
		if(Vector3.Dot(v.normalized,vToObject.normalized) > 0){
			var d1 = Vector3(-v.z,v.y,v.x);
			d1 = d1.normalized;
			var d2 = Vector3(v.z,v.y,-v.x);
			d2 = d2.normalized;
			var p1 = position + d1;
			var p2 = position + d2;
			if(Vector3.Distance(position,p1) < Vector3.Distance(position,p2)){
				moveToPoint(p1);
			}
			else{
				moveToPoint(p2);
			}
		}
		else if(Vector3.Dot(v,getVelocity()) < 0){
			var d1a = Vector3(-v.z,v.y,v.x);
			d1a = d1a.normalized;
			var d2a = Vector3(v.z,v.y,-v.x);
			d2a = d2a.normalized;
			var p1a = p + d1a;
			var p2a = p + d2a;
			if(Vector3.Distance(position,p1a) < Vector3.Distance(position,p2a)){
				moveToPoint(p1a);
			}
			else{
				moveToPoint(p2a);
			}
		}
		else{
			vToObject = vToObject.normalized;
			var p3 = p + (vToObject*minDistance);
			moveToPoint(p3);
		}
	}
}

function isInPath(size : float, velocity : Vector3){
	var right = Vector3(-velocity.z,velocity.y,velocity.y);
	var s1 = right.normalized;
}

function minSafeDistance(mass : float, size : float){
	 var minEscape = Mathf.Sqrt(mass/speed);
	 var minCollide = size*0.75;
	 if(minEscape > minCollide){
	 	return minEscape;
	 }
	 return minCollide;
}

function escapeVector(){
}

function setVelocity(v : Vector3){
	var tV = v - gVelocity;
	var tMag = tV.magnitude;
	if(tMag > speed){
		tMag = speed;
	}
	var t = tV.normalized*tMag;
	thrustVelocity = t;
}

function getVelocity(){
	return gVelocity + thrustVelocity;
}

function moveToPoint(p : Vector3){
	var moveDirection = p - position;
	var thrustDirection = moveDirection - gVelocity;
	thrustDirection = thrustDirection.normalized;
	thrustVelocity = thrustDirection * speed;
}

function cycleThroughObjects(){
	var objects = dust.formedObjects;
	for(var i = 0;i < objects.length;i++){
		flyAwayFromObject(objects[i]);
		gVelocity += pullToWell(objects[i]);
	}
}

function cycleThroughAsteroids(){
	var objects = dust.asteroids;
	for(var i = 0;i < objects.length;i++){
		flyAwayFromObject(objects[i]);
	}
}

function pullToWell(well : Transform){
	var newVelocity : Vector3 = Vector3.zero;
	var gravWell = well.GetComponent(gravityWell);
	var mass = gravWell.mass;
	newVelocity = dust.getGravity(position, gravWell.position, 0, mass)*Time.deltaTime;
	newVelocity.y = 0;
	return newVelocity;
}

function dragShip(){
	
}