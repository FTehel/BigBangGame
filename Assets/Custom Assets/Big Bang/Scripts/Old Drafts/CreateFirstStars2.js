var playing : boolean = false;

var dust : Transform;
var dustDistance : float = 20;
var dustOffset : float = 20;
var dustYRotation : float = -30;
var dustMass : float = 1;
var dustDecell : float = 500;
var dustMinSpeed : Vector2 = Vector2(0.1,0.5);
var maxDustDistance : float = -20;
static var sceneSetting = true;

 
var newSkybox : Material;
var gravityMass : float = 10;
var gravityStrength : float = 10;
var gravityDistance : float = 10;
var gravVelocityMax : float = 10;
var dustGroups : int = 10;


var mouseGravMass : float = 10;
var mouseGravDistance : float = 2;

var starFormationMinimumDust : float = 10;
var starFormationDustDistance : float = 1;
var starFormationMaxGrav : float = 10;
var starStartMass : float = 10;
var starObject : Transform;
static var newStarRadius : float;
var starMassRadiusRatio : float = 1;

var starDustMassAddition = 0.1;
var dustDeathTime : float = 5;
static var dustObject : Transform;
static var dustCreated = false;
static var stars : Array = new Array();

static var mouseGravExists = false;
static var mouseGrav : gravityWell = new gravityWell();

function Awake(){
	newStarRadius = Mathf.Pow(starStartMass/(1.25*3.14),0.33)*starMassRadiusRatio;
}

function setScene(){
	mouseGrav.mass = mouseGravMass;
	var skybox = transform.GetComponent(Skybox);
	skybox.material = newSkybox;
	var createPos : Vector3 = camera.ScreenToWorldPoint(Vector3(Screen.width/2,Screen.height/2,dustDistance));
	var dustRotation : Quaternion;
	dustRotation.eulerAngles = Vector3(0,dustYRotation,0);
	dustObject = Instantiate(dust,createPos,dustRotation);
	dustObject.position += dustObject.TransformDirection(Vector3(0,0,-dustOffset));
	transform.GetComponent(panCamera).setStart();
}

function slowParticles(){
	var particleObject = dustObject.GetComponent(ParticleSystem);
	var p : ParticleSystem.Particle[] = new ParticleSystem.Particle[particleObject.particleCount+1];
	var l : int = particleObject.GetParticles(p);
    var i : int = 0;
    while (i < l) {
    	var newVelocity : Vector3 = p[i].velocity;
    	var toSpeed = Random.Range( dustMinSpeed.x,dustMinSpeed.y);
    	var toVelocity = toSpeed*(p[i].velocity.normalized);
    	newVelocity = Vector3.Lerp(newVelocity,toVelocity, dustDecell * Time.deltaTime);
    	p[i].velocity = newVelocity;
		i++;
    }
	particleObject.SetParticles(p, l);
}

function particleSlowed(){
	var particleObject = dustObject.GetComponent(ParticleSystem);
	var p : ParticleSystem.Particle[] = new ParticleSystem.Particle[particleObject.particleCount+1];
	var l : int = particleObject.GetParticles(p);
    var i : int = 0;
    if(l < 900){
    	return false;
    }
    while (i < l) {
    	if(p[i].velocity.magnitude > dustMinSpeed.y){
    		return false;
    	}
		i++;
    }
   	return true;
}

function Update () {
	if(playing){
		updateFunction();
	}
}

function updateFunction(){
	if(sceneSetting){
		if(!particleSlowed()){
			slowParticles();
		}
		else{
			var particleObject = dustObject.GetComponent(ParticleSystem);
			particleObject.emissionRate = 10;
			sceneSetting = false;
		}
	}
	else{
		if(Input.GetMouseButton(0) && !mouseGravExists){
			lastMousePos = mouseGrav.position;
			mouseGravExists = true;
		}
		if(Input.GetMouseButton(0) && mouseGravExists){
			createMouseGravWell();
		}
		if(!Input.GetMouseButton(0) && mouseGravExists){
			mouseGravExists = false;
		}
		//cycleThroughParticles();
		pullParticlesToAllWells();
		findDustCollisions();
		if(noParticles() && stars.length > 0){
			newGame();
		}
	}
}

function cycleThroughParticles(){
	var particleObject = dustObject.GetComponent(ParticleSystem);
	var p : ParticleSystem.Particle[] = new ParticleSystem.Particle[particleObject.particleCount+1];
	var l : int = particleObject.GetParticles(p);
    var i : int = 0;
    while (i < l) {
    	p[i].velocity = getParticleVelocity(p[i]);
    	p[i].lifetime = getParticleLife(p[i]);
		i++;
    }
	particleObject.SetParticles(p, l);
}

function createMouseGravWell(){
	var ray : Ray = Camera.main.ScreenPointToRay(Input.mousePosition);
	var hPlane : Plane = new Plane(Vector3.up, dustObject.position);
	var distance : float = 0;
	var position : Vector3;
	if(hPlane.Raycast(ray, distance)){
	    position = ray.GetPoint(distance);
	}
	mouseGrav.position = position;
	if(canCreateStar(position)){
		createStar(position);
	}
}

function pullParticlesToAllWells(){
	var particleObject = dustObject.GetComponent(ParticleSystem);
	var p : ParticleSystem.Particle[] = new ParticleSystem.Particle[particleObject.particleCount+1];
	var l : int = particleObject.GetParticles(p);
    var i : int = 0;
    while (i < l) {
    	var newVelocity : Vector3 = Vector3.zero;
    	for(var j : int = 0; j < stars.length;j++){
    		var gravWell = stars[j].GetComponent(gravityWell);
    		newVelocity += getGravity(p[i].position, gravWell.position, dustMass, gravWell.mass)*Time.deltaTime;
    	}
    	if(mouseGravExists){
    		newVelocity += getMouseGravity(p[i].position, dustMass);
    	}
    	var k : int = 0;
    	while(k<l){
    		if(k!=i){
    			newVelocity += getGravity(p[i].position, p[k].position, dustMass, dustMass*dustGroups)*Time.deltaTime;
    		}
    		k+=dustGroups;
    	}
    	newVelocity.y = 0;
    	newVelocity = newVelocity + p[i].velocity;
    	if(newVelocity.magnitude > gravVelocityMax){
    		newVelocity = limitVector(newVelocity);
    	}
    	p[i].velocity = newVelocity;
		i++;
    }
	particleObject.SetParticles(p, l);
}

function getMouseGravity(position,thisMass){
	var distance = Vector3.Distance(position,mouseGrav.position);
	var distancePercent : float = 0;
	if(distance < mouseGravDistance){
		distancePercent = 1-(distance/mouseGravDistance);
	}
	var thisGravity : Vector3 = (mouseGrav.position - position);
	thisGravity *= getMousePull(distance,thisMass,mouseGrav.mass)*distancePercent;
	return thisGravity*gravityStrength;
}

var lastMousePos : Vector3;
/*
function getMouseGravity(thisPosition,thisMass){
	var thisMousePos = mouseGrav.position;
	var offset = thisMousePos - lastMousePos;
	var distance = Vector3.Distance(thisPosition,mouseGrav.position);
	var distancePercent : float = 0;
	if(distance < mouseGravDistance){
		distancePercent = 1-(distance/mouseGravDistance);
	}
	offset *= distancePercent;
	lastMousePos = thisMousePos;
	var newPosition = offset + thisPosition;
	return offset;
}
*/
function getParticleVelocity(p : ParticleSystem.Particle){
	var newVelocity : Vector3 = Vector3.zero;
	for(var j : int = 0; j < stars.length;j++){
		var gravWell = stars[j].GetComponent(gravityWell);
		newVelocity += getGravity(p.position, gravWell.position, dustMass, gravWell.mass)*Time.deltaTime;
	}
	if(mouseGravExists){
		newVelocity += getGravity(p.position, mouseGrav.position, dustMass, mouseGrav.mass)*Time.deltaTime;
	}
	newVelocity.y = 0;
	newVelocity = newVelocity + p.velocity;
	if(newVelocity.magnitude > gravVelocityMax){
		newVelocity = limitVector(newVelocity);
	}
	return newVelocity;
}

function moveStars(){
	for(var i : int = 0;i < stars.length;i++){
		
	}
}

function moveGravityWell(gravWell : gravityWell){
	gravWell.position += gravWell.velocity;
}

function getGravity(thisPos : Vector3, well : Vector3, thisMass : float, otherMass : float){
	var distance = Vector3.Distance(thisPos,well);
	var thisGravity : Vector3 = (well - thisPos);
	thisGravity *= getPull(distance,thisMass,otherMass);
	return thisGravity*gravityStrength;
}

function getPull(distance : float, thisMass : float,otherMass : float){
	var pull = ((thisMass*gravityMass*otherMass))/((distance*distance)/gravityDistance);
	return pull;
}

function getMousePull(distance : float, thisMass : float,otherMass : float){
	var pull = (thisMass*gravityMass*otherMass);
	return pull;
}

function createStar(well : Vector3){
	var newStar : Transform;
	stars.Add(newStar);
	stars[stars.length-1] = Instantiate(starObject,well,Quaternion.identity);
	stars[stars.length-1].GetComponent(star).regenSpeed = transform.GetComponent(createSolarSystem).regenSpeed;
	var starGravWell = stars[stars.length-1].GetComponent(gravityWell);
	var star = stars[stars.length-1].GetComponent(star);
	starGravWell.position = well;
	starGravWell.mass = starStartMass;
	star.growAmount += newStarRadius*2;
	var dustDestroyed : int = 0;
	var particleObject = dustObject.GetComponent(ParticleSystem);
	var p : ParticleSystem.Particle[] = new ParticleSystem.Particle[particleObject.particleCount+1];
	var l : int = particleObject.GetParticles(p);
    var i : int = 0;
    while (i < l && dustDestroyed < starFormationMinimumDust) {
    	var distance = Vector3.Distance(p[i].position, well);
    	if(p[i].lifetime >= dustDeathTime && distance <= newStarRadius/2){
    		dustDestroyed++;
    		p[i].lifetime = dustDeathTime;
    	}
		i++;
    }
    particleObject.SetParticles(p, l);
    disableParticles();
}

function canCreateStar(well : Vector3){
	var pull : float = 0;
	for(var i : int = 0;i < stars.length;i++){
		var distance : float = Vector3.Distance(well,stars[i].position);
		var otherMass = stars[i].GetComponent(gravityWell).mass;
		pull += getPull(distance,starStartMass,otherMass);
	}
	if(pull < starFormationMaxGrav){
		return enoughDustInWell(well);
	}
	else{
		return false;
	}
}

function growStar(starToGrow : Transform){
	var gravWell = starToGrow.GetComponent(gravityWell);
	var starScript = starToGrow.GetComponent(star);
	var mass = gravWell.mass;
	mass += starDustMassAddition;
	gravWell.mass = mass;
	var newScale = Mathf.Pow(mass/(1.25*3.14),0.33)*starMassRadiusRatio*2*(starDustMassAddition/mass);
	starScript.growAmount+=newScale;
}

function findDustCollisions(){
	var particleObject = dustObject.GetComponent(ParticleSystem);
	var p : ParticleSystem.Particle[] = new ParticleSystem.Particle[particleObject.particleCount+1];
	var l : int = particleObject.GetParticles(p);
    var i : int = 0;
    while (i < l) {
    	for(var j : int = 0; j < stars.length;j++){
    		var gravWell = stars[j].GetComponent(gravityWell);
    		var distance = Vector3.Distance(p[i].position,gravWell.position);
    		if(p[i].lifetime >= dustDeathTime && distance <= stars[j].localScale.x/4){
    			growStar(stars[j]);
    			p[i].lifetime = dustDeathTime;
    		}
    	}
    	if(p[i].lifetime < dustDeathTime){
    		p[i].size = shrinkParticle(p[i]);
    	}
		i++;
    }
    particleObject.SetParticles(p, l);
}

function shrinkParticle(p : ParticleSystem.Particle){
	var shrinkage : float;
	if(p.lifetime > 0){
		shrinkage = p.size/p.lifetime;
	}
	shrinkage *= Time.deltaTime;
	return p.size - shrinkage;
}

function getParticleLife(p : ParticleSystem.Particle){
	for(var j : int = 0; j < stars.length;j++){
		var gravWell = stars[j].GetComponent(gravityWell);
		var distance = Vector3.Distance(p.position,gravWell.position);
		if(distance <= stars[j].localScale.x/4){
			growStar(stars[j]);
			return -1;
		}
	}
	return p.lifetime;
}

function enoughDustInWell(well : Vector3){
	var dustCount : int;
	var particleObject = dustObject.GetComponent(ParticleSystem);
	var p : ParticleSystem.Particle[] = new ParticleSystem.Particle[particleObject.particleCount+1];
	var l : int = particleObject.GetParticles(p);
    var i : int = 0;
    while (i < l) {
    	if(Vector3.Distance(p[i].position,well) <= starFormationDustDistance){
    		dustCount ++;
    	}
		i++;
    }
    if(dustCount >= starFormationMinimumDust){
    	return true;
    }
    else{
    	return false;
    }
}

function disableParticles(){
	var particles = dustObject.GetComponent(ParticleSystem);
	particles.enableEmission = false;
}

function destroyParticles(){
	var particleObject = dustObject.GetComponent(ParticleSystem);
	var p : ParticleSystem.Particle[] = new ParticleSystem.Particle[particleObject.particleCount+1];
	var l : int = particleObject.GetParticles(p);
    var i : int = 0;
    while (i < l) {
    	if(p[i].position.z < maxDustDistance){
    		p[i].lifetime = -1;
    	}
    }
    particleObject.SetParticles(p, l);
}

function limitVector(vector : Vector3){
	return vector.normalized * gravVelocityMax;
}

function noParticles(){
	var particleObject = dustObject.GetComponent(ParticleSystem);
	var p : ParticleSystem.Particle[] = new ParticleSystem.Particle[particleObject.particleCount+1];
	var l : int = particleObject.GetParticles(p);
	if(l > 0){
		return false;
	}
	return true;
}

function newGame(){
	var nextGame = transform.GetComponent(createSolarSystem);
	nextGame.playing = true;
	playing = false;
	Debug.Log("Destroying2");
	Destroy(dustObject.gameObject);
	//nextGame.setScene();
}

