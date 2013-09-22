var mass : float = 0;
var position = Vector3.zero;
var velocity = Vector3.zero;
var speed : float;

function Update(){
	velocity.y = 0;
	this.position += velocity*Time.deltaTime;
	transform.position = getPosition();
	speed = velocity.magnitude;
}

function transferStats(other : gravityWell){
	mass = other.mass;
	position = other.position;
	velocity = other.velocity;
}

function getPosition(){
	if(GetComponent(star)!= null){
		var star = GetComponent(star);
		if(star.firstStar){
			var finalPos = position + star.currentVibrateOffset;
			return finalPos;
		}
		return position;
	}
	return position;
}