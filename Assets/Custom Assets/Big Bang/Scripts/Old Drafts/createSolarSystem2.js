var gases : Array = new Array();
var playing = false;
var regenSpeed : float = 10;
var reduceSpeed : float = 5;

var stardust1 : Transform;
var stardust2 : Transform;
var stardustAngleMax : float = 3;
var stardustAngleMin : float = -3;

var supernovaTime : float = 10;
var supernovaSlowTime : float = 10;
var supernovaRotateSpeed : float = 5;
var supernovaRotateDistanceEffect : float = 200;

static var nebulae : Array = new Array();

function setScene () {
	transferStars();
}

function Update (){
	updateFunction();
}

function updateFunction(){
	supernovaTime += regenSpeed*Time.deltaTime;
	cycleParticles();
	if(Input.GetMouseButton(0)){
		supernovaStars();
	}
}

function transferStars(){
	var firstStars = transform.GetComponent(createFirstStars).stars;
	pop3Stars = new Transform[firstStars.length];
	
	for(var i = 0;i < firstStars.length;i++){
		pop3Stars[i] = firstStars[i];
	}
}

function supernovaStars(){
	var ray : Ray = Camera.main.ScreenPointToRay(Input.mousePosition);
	var hit : RaycastHit;
   	if (Physics.Raycast (ray, hit, 100)){
        if(hit.transform.tag.Equals("firstStar")){
        	var star = hit.transform.GetComponent(star);
        	star.supernovaTime -= (reduceSpeed+regenSpeed)*Time.deltaTime;
        	star.regenSpeed = regenSpeed;
        	if(star.supernovaTime <= 0){
        		var mass = hit.transform.GetComponent(gravityWell).mass;
        		var newGas1 : Transform;
        		var newGas2 : Transform;
        		gases.Add(newGas1);
        		gases.Add(newGas2);
        		gases[gases.length-2] = Instantiate(stardust1,hit.transform.position,Quaternion.identity);
        		gases[gases.length-1] = Instantiate(stardust2,hit.transform.position,Quaternion.identity);
    			Destroy(hit.transform.gameObject);
        	}
        }
    }
}

function cycleParticles(){
	for(var i = 0;i < gases.length;i++){
		var particleObject = gases[i].GetComponent(ParticleSystem);
		var p : ParticleSystem.Particle[] = new ParticleSystem.Particle[particleObject.particleCount+1];
		var l : int = particleObject.GetParticles(p);
	    var j : int = 0;
	    while (j < l) {
	    	p[j].velocity = directionParticle(p[j]);
	    	p[j].velocity = rotateParticle(p[j],gases[i].position);
	    	p[j].velocity = slowParticle(p[j],gases[i].position);
	    }
	    particleObject.SetParticles(p, j);
    }
}

function slowParticle(particle : ParticleSystem.Particle, source : Vector3){
	var outwardVelocity = particle.position - source;
	outwardVelocity = outwardVelocity.normalized;
	var velocity = particle.velocity.normalized;
	var dot = Vector3.Dot(velocity,outwardVelocity);
	if(dot < 0){
		dot = 0;
	}
	var speed = particle.outwardVelocity.magnitude*dot;
	var percentage = Time.deltaTime/supernovaSlowTime;
	var newVelocity = particle.velocity;
	newVelocity-= outwardVelocity*speed*percentage;
	return newVelocity;
}

function rotateParticle(particle : ParticleSystem.Particle, source : Vector3){
	var outwardVector = particle.position - source;
	var rightVector = Vector3(-outwardVector.z,outwardVector.y,outwardVector.x);
	rightVector = rightVector.normalized;
	rightVector *= supernovaRotateSpeed*Time.deltaTime;
	var newVelocity = particle.velocity + rightVector;
	return newVelocity;
}

function directionParticle(particle : ParticleSystem.Particle){
	var velocity = particle.velocity;
	if(velocity.y > stardustAngleMax || velocity.y < stardustAngleMin){
		var magnitude = velocity.magnitude;
		velocity.y = Random.Range(stardustAngleMax,stardustAngleMin);
		velocity = velocity.normalized;
		velocity*=magnitude;
	}
	return velocity;
}