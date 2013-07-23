var mass : float = 0;
var position = Vector3.zero;
var velocity = Vector3.zero;

function Update(){
	this.position += velocity*Time.deltaTime;
	transform.position = getPosition();
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