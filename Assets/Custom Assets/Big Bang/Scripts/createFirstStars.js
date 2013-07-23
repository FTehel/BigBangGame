/*
Fraser Tehel 2013
*/

var playing : boolean = false;

var dustDistance : float = 20;
var dustOffset : float = 20;
var dustYRotation : float = -30;
var dustDecell : float = 500;
var startDustDecell : float = 10;
var dustDecellAccell : float = 0.1;
var dustMinSpeed : Vector2 = Vector2(0.1,0.5);
var maxDustDistance : float = -20;
static var sceneSetting = true;
var cameraUnlockNumber : int = 500;

var newEmissionRate : int = 10;
var newStartLife : float = 400;
 
var newSkybox : Material;

var firstStarFormation : formationDust = new formationDust();

function reset(){
	Debug.Log("Reseting create first stars");

	for(var i = 0;i < firstStarFormation.dust.length;i++){
		Destroy(firstStarFormation.dust[i].gameObject);
	}
	for(var j = 0;j < firstStarFormation.formedObjects.length;j++){
		Destroy(firstStarFormation.formedObjects[j].gameObject);
	}
	firstStarFormation.formedObjects = new Array();
	firstStarFormation.dust = new Transform[0];
	firstStarFormation.mouseDrag = Vector2.zero;
	playing = false;
	dustDecell = startDustDecell;
	sceneSetting = true;
}

function setScene(){
	setTutorial1();
	startDustDecell = dustDecell;
	var sceneSetting = true;
	var skybox = transform.GetComponent(Skybox);
	skybox.material = newSkybox;
	var createPos : Vector3 = camera.ScreenToWorldPoint(Vector3(Screen.width/2,Screen.height/2,dustDistance));
	var dustRotation : Quaternion;
	dustRotation.eulerAngles = Vector3(0,dustYRotation,0);
	firstStarFormation.startDustPosition = createPos;
	firstStarFormation.setScene();
	for(var i = 0;i < firstStarFormation.dust.length;i++){
		firstStarFormation.dust[i] = Instantiate(firstStarFormation.dust[i],createPos,dustRotation);
		firstStarFormation.dust[i].position += firstStarFormation.dust[i].TransformDirection(Vector3(0,0,-dustOffset));
		firstStarFormation.gravityPlane = firstStarFormation.dust[i].position.y;
	}
	transform.GetComponent(panCamera).setStart();
	transform.GetComponent(alterTime).playing = true;
}

function slowParticles(){
	dustDecell += dustDecellAccell*Time.deltaTime;
	for(var j = 0;j < firstStarFormation.dust.length;j++){
		var v : float = 0;
		var particleObject = firstStarFormation.dust[j].GetComponent(ParticleSystem);
		var p : ParticleSystem.Particle[] = new ParticleSystem.Particle[particleObject.particleCount+1];
		var l : int = particleObject.GetParticles(p);
	    var i : int = 0;
	    while (i < l) {
	    	var newVelocity : Vector3 = p[i].velocity;
	    	var toSpeed = Random.Range(dustMinSpeed.x,dustMinSpeed.y);
	    	var toVelocity = toSpeed*(p[i].velocity.normalized);
	    	newVelocity = Vector3.Lerp(newVelocity,toVelocity, dustDecell);
	    	p[i].velocity = newVelocity;
	    	if(newVelocity.magnitude > v){
	    		v = newVelocity.magnitude;
	    	}
			i++;
	    }
		particleObject.SetParticles(p, l);
		if(l > 0){
			particleObject.startSpeed = v;
		}
	}
}

function particleSlowed(){
	for(var j = 0;j < firstStarFormation.dust.length;j++){
		var particleObject = firstStarFormation.dust[j].GetComponent(ParticleSystem);
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
			destroyParticles();
		}
		else{
			for(var j = 0;j < firstStarFormation.dust.length;j++){
				var particleObject = firstStarFormation.dust[j].GetComponent(ParticleSystem);
				particleObject.emissionRate = 10;
				particleObject.startSpeed = dustMinSpeed.y;
			}	
			sceneSetting = false;
		}
	}
	else{
		destroyParticles();
		firstStarFormation.getMouseGravity();
		firstStarFormation.cycleThroughScene();
		if(firstStarFormation.formedObjects.length > 0){
			setTutorial2();
			for(var i = 0;i < firstStarFormation.dust.length;i++){
				firstStarFormation.dust[i].GetComponent(ParticleSystem).enableEmission = false;
			}
		}
		if(noParticles() && firstStarFormation.formedObjects.length > 0){
			newGame();
		}
	}
}

/*function createFormation(){
	for(var i = 0;i < firstStarFormation.formations.length;i++){
		if(firstStarFormation.canCreate(firstStarFormation.formations[i],firstStarFormation.mouseGrav.position)){
			setTutorial2();
			var newFormation : Transform;
			for(var j = 0;j < firstStarFormation.dust.length;j++){
				firstStarFormation.dust[j].GetComponent(ParticleSystem).enableEmission = false;
			}
			firstStarFormation.formedPrefabsAdd(firstStarFormation.formations[i].prefab);
			newFormation = Instantiate(firstStarFormation.formations[i].prefab,
			firstStarFormation.mouseGrav.position,Quaternion.identity);
			firstStarFormation.formedObjectsAdd(newFormation);
			firstStarFormation.formedObjects[firstStarFormation.formedObjects.length-1].GetComponent(gravityWell).position = firstStarFormation.mouseGrav.position;
			firstStarFormation.formedObjects[firstStarFormation.formedObjects.length-1].GetComponent(gravityWell).mass = firstStarFormation.formations[i].startMass;
			firstStarFormation.formedObjects[firstStarFormation.formedObjects.length-1].GetComponent(formationObject).transferStats(firstStarFormation.formations[i]);
			firstStarFormation.formedObjects[firstStarFormation.formedObjects.length-1].localScale = Vector3.zero;
			firstStarFormation.createFormation(firstStarFormation.formations[i],firstStarFormation.mouseGrav.position);
		}
	}
}*/

function disableParticles(){
	for(var j = 0;j < firstStarFormation.dust.length;j++){
		var particles = firstStarFormation.dust[j].GetComponent(ParticleSystem);
		particles.enableEmission = false;
	}
}

function destroyParticles(){
	for(var j = 0;j < firstStarFormation.dust.length;j++){
		var particleObject = firstStarFormation.dust[j].GetComponent(ParticleSystem);
		var p : ParticleSystem.Particle[] = new ParticleSystem.Particle[particleObject.particleCount+1];
		var l : int = particleObject.GetParticles(p);
	    var i : int = 0;
	    while (i < l) {
	    	if(p[i].position.z < maxDustDistance){
	    		p[i].lifetime = 0;
	    	}
	    	i++;
	    }
	    particleObject.SetParticles(p, l);
    }
}

function noParticles(){
	for(var j = 0;j < firstStarFormation.dust.length;j++){
		var particleObject = firstStarFormation.dust[j].GetComponent(ParticleSystem);
		var p : ParticleSystem.Particle[] = new ParticleSystem.Particle[particleObject.particleCount+1];
		var l : int = particleObject.GetParticles(p);
		if(l > 0){
			if(l <= cameraUnlockNumber){
				GetComponent(panCamera).infinite = true;
			}
			return false;
		}
	}
	return true;
}

function newGame(){
	var nextGame = transform.GetComponent(createSolarSystem);
	nextGame.playing = true;
	playing = false;
	nextGame.setScene(firstStarFormation);
	GetComponent(panCamera).infinite = true;
	Debug.Log("Next Game 2");
}

function setTutorial1(){
	var tutorial = GetComponent(menu);
	var str = "Click and drag to drag stardust around. Gather enough stardust in an area and click to create a star.";
	tutorial.tutorialString = str;
}

function setTutorial2(){
	var tutorial = GetComponent(menu);
	var str = "Click and drag to drag all objects in an area. As long as the mouse button is held down you will continue to drag "+
	"the objects you have selected.";
	tutorial.tutorialString = str;
}
