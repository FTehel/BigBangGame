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
var sceneSetting = true;
var cameraUnlockNumber : int = 500;

var particlesToSlow : int = 150;

var newEmissionRate : int = 10;
var newStartLife : float = 400;
 
var newSkybox : Material;

var firstStarFormation : formationDust;
var minDust : int = 100;
var pullToCentre : float = 1;

var android = false;

static var centre : Vector3;
static var tutorialShowed = false;
static var tutorial2Showed = false;
static var tutorial3Showed = false;

function Start(){
	firstStarFormation = GetComponent(formationDust);
}

function updateFunction(){
	
	if(sceneSetting){
		particlesSpawned = true;
		if(!particleSlowed()){
			slowParticles();
			destroyParticles();
		}
		if(particleSlowed()){
			for(var j = 0;j < firstStarFormation.dust.length;j++){
				var particleObject = firstStarFormation.dust[j].GetComponent(ParticleSystem);
				particleObject.emissionRate = 3;
				particleObject.startSpeed = dustMinSpeed.y;
			}
			sceneSetting = false;
			firstStarFormation.mouseEnabled = true;
			firstStarFormation.playing = true;
			Debug.Log("sceneSetting done");
		}
	}
	else{
		GetComponent(generateStarfield).playing = true;
		destroyParticles();
		//pullFormationsToCentre();
		if(firstStarFormation.formedObjects.length > 0){
			if(!tutorialShowed){
				//setTutorial2();
			}
			if(!GetComponent(menu).tutorialShowing && !tutorial2Showed){
				//setTutorial3();
			}
			for(var i = 0;i < firstStarFormation.dust.length;i++){
				firstStarFormation.dust[i].GetComponent(ParticleSystem).enableEmission = false;
			}
		}
		if(firstStarFormation.formedObjects.length > 1){
			if(!GetComponent(menu).tutorialShowing && !tutorial3Showed){
				//setTutorial4();
			}
		}
		if(noParticles() && firstStarFormation.formedObjects.length > 0){
			newGame();
		}
	}
	
}

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
	firstStarFormation.playing = false;
	dustDecell = startDustDecell;
	sceneSetting = true;
	Time.timeScale = 1;
}

function setScene(){
	setTutorial1();
	startDustDecell = dustDecell;
	var sceneSetting = true;
	var skybox = transform.GetComponent(Skybox);
	skybox.material = newSkybox;
	var createPos : Vector3 = camera.ScreenToWorldPoint(Vector3(Screen.width/2,Screen.height/2,dustDistance));
	centre = createPos;
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
	transform.GetComponent(panCameraAndroid).setStart();
	transform.GetComponent(alterTime).playing = true;
	transform.GetComponent(zoomCamera).playing = true;
	transform.GetComponent(zoomCameraAndroid).playing = true;
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
	    	var toSpeed = firstStarFormation.dustVelocityMax * 0.9;
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
	    if(l < particlesToSlow){
	    	return false;
	    }
	    while (i < l) {
	    	if(p[i].velocity.magnitude > firstStarFormation.dustVelocityMax){
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

var particlesSpawned = false;



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
		if(l > minDust){
			if(l <= cameraUnlockNumber){
				GetComponent(panCamera).infinite = true;
				GetComponent(panCameraAndroid).infinite = true;
			}
			return false;
		}
	}
	return true;
}

function pullFormationsToCentre(){
	var formations = firstStarFormation.formedObjects;
	for(var i = 0;i < formations.length;i++){
		var distance = Vector3.Distance(formations[i].position,centre);
		var pull = pullToCentre*(distance * distance)*Time.deltaTime;
		var direction = centre - formations[i].position;
		formations[i].GetComponent(gravityWell).velocity += pull*direction;
	}
}

function newGame(){
	var nextGame = transform.GetComponent(createSolarSystem);
	nextGame.playing = true;
	playing = false;
	nextGame.setScene(firstStarFormation);
	GetComponent(panCamera).infinite = true;
	GetComponent(panCameraAndroid).infinite = true;
	Debug.Log("Next Game 2");
}

function setTutorial1(){
	var tutorial = GetComponent(menu);
	var str = "The energy from The Big Bang condensed into matter. At first there was only hydrogen and helium, and these formed the " +
	"first stars. Click and drag to move gas around. Condense enough gas into one area, then click to create a star.";
	tutorial.setTutorial(str);
}

function setTutorial2(){
	var tutorial = GetComponent(menu);
	var str = "Well done, the first star has formed. Every object has gravity, and will pull in all objects, dust and gas around it." +
	" As a star absorbs gas it will become larger.";
	tutorial.setTutorial(str);
	tutorialShowed = true;
}

function setTutorial3(){
	var tutorial = GetComponent(menu);
	var str = "Double click on an object to centre on it. Move the cursor to the sides of the screen to move the camera. Scroll "+
	"to move in and out.\n\n\nTry to create another star.";
	tutorial.setTutorial(str);
	tutorial2Showed = true;
}

function setTutorial4(){
	var tutorial = GetComponent(menu);
	var str = "Now that you have two stars they can orbit each other. Click and drag on an object to pull it. Try to throw one star " +
	"around another to get it to orbit.\n\n\nIf you want, make a few more stars. Absorb the rest of the gas to continue to the next stage.";
	tutorial.setTutorial(str);
	tutorial3Showed = true;
}
