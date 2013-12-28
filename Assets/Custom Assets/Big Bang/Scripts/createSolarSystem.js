var playing = false;
//var solarSystemDust : formationDust = new formationDust();
var supernovaParticles : Transform[] = new Transform[0];
var supernovaDustPercent : float;
var supernovae : Transform[] = new Transform[0];
var freezeTime : float = 5;
var currentFreezeTime : float;
var currentI = 0;
var endI = 0;
var orbitSpeed : float = 0.2;
var supernovaSpeedToMass1 : float = 1;
var supernovaSpeedToMass2 : float = 1;
var maxOrbitCount = 25;
var supernovaLight : Transform;
var newZoomLimits = Vector2(5,100);
var android = false;
var statsGot = false;
var newSkybox : Material;

static var orbitCount : float = 0;

static var levelled = false;
static var cleaned = false;
static var tutorialShowed = false;
static var tutorial2Showed = false;
static var tutorial3Showed = false;
static var tutorial4Showed = false;

function Start(){
	if(!statsGot){
		getStats();
	}
	//getStats();
}

function getStats(){
	playing = true;
	var stats = GameObject.Find("statsHolder");
	if(stats != null){
		transferStats(stats.GetComponent(createSolarSystem));
		GetComponent(formationDust).transferStats(stats.GetComponent(formationDust),true);
		GetComponent(formationDust).playing = true;
		GetComponent(formationDust).mouseEnabled = true;
		GetComponent(formationDust).limitGravity = false;
		GetComponent(shipsHolder).transferStats(stats.GetComponent(shipsHolder));
		GetComponent(generateStarfield).transferStats(stats.GetComponent(generateStarfield));
	}
	//setTutorial1();
	if(playing){
		GetComponent(zoomCamera).setLimits(newZoomLimits, true);
		GetComponent(zoomCameraAndroid).setLimits(newZoomLimits, true);
		var skybox = transform.GetComponent(Skybox);
		skybox.material = newSkybox;
		GetComponent(generateStarfield).playing = true;
		GetComponent(generateStarfield).setMidUniverse();
	}
}

function transferStats(other : createSolarSystem){
	newZoomLimits = other.newZoomLimits;
	supernovaParticles = other.supernovaParticles;
	supernovaDustPercent = other.supernovaDustPercent;
	supernovae = other.supernovae;
	supernovaLight = other.supernovaLight;
	levelled = other.levelled;
	cleaned = other.cleaned;
	freezeTime = other.freezeTime;
	currentFreezeTime = other.currentFreezeTime;
	orbitSpeed = other.orbitSpeed;
	supernovaSpeedToMass1 = other.supernovaSpeedToMass1;
	supernovaSpeedToMass2 = other.supernovaSpeedToMass2;
	maxOrbitCount = other.maxOrbitCount;
	android = other.android;
	newSkybox = other.newSkybox;
}

function reset(){
	Debug.Log("Reseting create solar system");
	transform.GetComponent(panCamera).setStart();
	transform.GetComponent(panCameraAndroid).setStart();
	Time.timeScale = 1;
	for(var j = 0;j < GetComponent(formationDust).formedObjects.length;j++){
		Destroy(GetComponent(formationDust).formedObjects[j].gameObject);
	}
	getStats();
	for(var i = 0;i < GetComponent(formationDust).formedObjects.length;i++){
		Instantiate(GetComponent(formationDust).formedObjects[i],GetComponent(formationDust).formedObjects[i].position,Quaternion.identity);
	}
}

function setScene(stats : formationDust){
	GetComponent(zoomCamera).setLimits(newZoomLimits, true);
	GetComponent(zoomCameraAndroid).setLimits(newZoomLimits, true);
	GetComponent(formationDust).transferStats(stats, false);
	var skybox = transform.GetComponent(Skybox);
	skybox.material = newSkybox;
	Debug.Log("setting scene");
	//setTutorial1();
	//getStats();
}

/*function Update () {
	if(playing){
		updateFunction();
	}
}



function setScene(stats : formationDust){
	GetComponent(zoomCamera).setLimits(newZoomLimits, true);
	GetComponent(zoomCameraAndroid).setLimits(newZoomLimits, true);
	setTutorial1();
	//getStats();
	solarSystemDust.transferStats(stats);
}

function Start(){
	getStats();
	//solarSystemDust.gravityPlane = gravityPlane;
}

function getStats(){
	var stats = GameObject.Find("statsHolder");
	if(stats != null){
		//transferStats(stats.GetComponent(formationDust));
		GetComponent(formationDust).transferStats(stats.GetComponent(formationDust),true);
	}
	setTutorial1();
	if(playing){
		GetComponent(zoomCamera).setLimits(newZoomLimits, true);
		GetComponent(zoomCameraAndroid).setLimits(newZoomLimits, true);
	}
}

function updateFunction(){
	solarSystemDust.cycleThroughScene();
	if(!android){
		solarSystemDust.getMouseGravity();
	}
	else{
		solarSystemDust.getTouchGravity();
	}
	//supernovaStar();
	/*countDownFreezeTime();
	unfreeze();
	//cycleThroughSupernovae();
	hasStar();
	hasAsteroid();
}

/*function createFormation(position : Vector3, formation : Transform, mass : float, velocity : Vector3, other : formation, speed : float){
	var newFormation : Transform;
	var thisPos = position;
	thisPos.y = gravityPlane;
	solarSystemDust.formedPrefabsAdd(other.prefab);

	newFormation = Instantiate(formation,thisPos,Quaternion.identity);
	solarSystemDust.formedObjectsAdd(newFormation);
	var length = solarSystemDust.formedObjects.length;

	solarSystemDust.formedObjects[length-1].localScale = Vector3.zero;
	solarSystemDust.formedObjects[length-1].GetComponent(gravityWell).mass = mass;
	solarSystemDust.formedObjects[length-1].GetComponent(gravityWell).velocity = velocity;
	solarSystemDust.formedObjects[length-1].GetComponent(formationObject).transferStats(other);
	//solarSystemDust.formedObjects[length-1].GetComponent(formationObject).growAmount = Mathf.Pow(mass/(1.33*3.14),0.33)*other.massRadiusstarRatio*2;
	//solarSystemDust.formedObjects[length-1].GetComponent(formationObject).growAmount = 1;
	solarSystemDust.formedObjects[length-1].GetComponent(formationObject).newGrowRate = speed;
	
	solarSystemDust.formedObjects[length-1].GetComponent(gravityWell).position = thisPos;
}

function setTutorial1(){
	var tutorial = GetComponent(menu);
	var str = "Now that you've turned all the light gas into stars we need to make some heavier elements. When stars go supernova "+
	"they release heavier elements. Click and hold on a star to make it go supernova. The supernova shockwave will also supernova "+
	"other stars.";
	tutorial.setTutorial(str);
	tutorialShowed = true;
}

function setTutorial2(){
	var tutorial = GetComponent(menu);
	var str = "Supernovae leave behind nubelae, made of dust and gas. Make a star out of gas.\n\n\nRed = Gas\n\nBlue = Dust";
	tutorial.setTutorial(str);
	tutorial2Showed = true;
}

function setTutorial3(){
	var tutorial = GetComponent(menu);
	var str = "Now, make some asteroids out of dust.";
	tutorial.setTutorial(str);
	tutorial3Showed = true;
}

function setTutorial4(){
	var tutorial = GetComponent(menu);
	var str = "Well done. You can drag whole groups of asteroids at a time, provided they're small enough." + 
	" When an asteroid gets large enough it becomes a planet. Make some asteroids gather enough dust and other asteroids to become "+
	"a planet.";
	tutorial.setTutorial(str);
	tutorial4Showed = true;
}

function supernovaStar(){
	var formedObjects = solarSystemDust.formedObjects;
	for(var i = 0;i < formedObjects.length;i++){
		var star = formedObjects[i].GetComponent(star);
		if(star!= null && star.firstStar){
			var gravWell = formedObjects[i].GetComponent(gravityWell);
			var mouseGrav : gravityWell = solarSystemDust.mouseGrav;
			if(solarSystemDust.mouseGravExists && Vector3.Distance(mouseGrav.position,gravWell.position) <= formedObjects[i].localScale.x/2){
				star.reduceSupernovaTime();
				if(star.currentSupernovaTime == 0){
					var speed : float;
					for(var j = 0;j < supernovaParticles.length;j++){
						var fObject = formedObjects[i].GetComponent(formationObject);
						var pNumber = 0;
						var SNDust = UnityEngine.Object.Instantiate(supernovaParticles[j],formedObjects[i].position, Quaternion.identity);
						var particleObject = SNDust.GetComponent(ParticleSystem);
						for(var k = 0;k < fObject.dustTypes.length;k++){
							pNumber += fObject.dustTypes[k].dustAmount;
						}
						if(SNDust.tag == "dust"){
							pNumber = Mathf.RoundToInt(pNumber * supernovaDustPercent);
							speed = Mathf.Pow(pNumber,0.33) * supernovaSpeedToMass2;
						}
						else{
							pNumber = Mathf.RoundToInt(pNumber * (1-supernovaDustPercent));
							speed = Mathf.Pow(pNumber,0.33)* supernovaSpeedToMass1;
						}
						particleObject.startSpeed = (speed);
						particleObject.Emit(pNumber);
						addToSupernovae(SNDust);
						//solarSystemDust.addDust(SNDust);
						currentFreezeTime = freezeTime;
						levelled = false;
					}
					var explosion = UnityEngine.Object.Instantiate(supernovaLight,formedObjects[i].position, Quaternion.identity);
					addToSupernovae(explosion);
					if(solarSystemDust.formedObjects[i] == solarSystemDust.formationDraging){
						solarSystemDust.formationDraging = null;
					}
					var dragIndex = solarSystemDust.inFormationsDragging(formedObjects[i]);
					if(dragIndex != -1){
						solarSystemDust.removeFormationFromDrag(dragIndex);
					}
					UnityEngine.Object.Destroy(formedObjects[i].gameObject);
					solarSystemDust.formedObjectsRemove(i);
					//cleanOldDust();
				}
			}
		}
	}
	
}

function addToSupernovae(nebula : Transform){
	var temp = new Transform[supernovae.length + 1];
	for(var i = 0;i < supernovae.length;i++){
		temp[i] = supernovae[i];
	}
	temp[supernovae.length] = nebula;
	supernovae = temp;
	endI++;
}

function levelParticleVelocity(p : ParticleSystem.Particle){
	var velocity = p.velocity;
	var speed = velocity.magnitude;
	velocity.y = 0;
	velocity = velocity.normalized;
	velocity *= speed;
	return velocity;
}

function cycleThroughSupernovae(){
	for(var j = 0;j < supernovae.length;j++){
		if(supernovae[j]!= null){
			var particleObject = supernovae[j].GetComponent(ParticleSystem);
			var p : ParticleSystem.Particle[] = new ParticleSystem.Particle[particleObject.particleCount+1];
			var l : int = particleObject.GetParticles(p);
			var i = 0;
			while(i < l){
				if(!levelled){
					p[i].velocity = levelParticleVelocity(p[i]);
				}
				if(orbitCount < maxOrbitCount){
					p[i].velocity = orbitParticle(p[i]);
				}
				ruptureFormation(p[i]);
				i++;
			}
			particleObject.SetParticles(p, l);
		}
	}
	orbitCount+= Time.deltaTime;
	levelled = true;
}

function ruptureFormation(p : ParticleSystem.Particle){
	var formedObjects = solarSystemDust.formedObjects;
	for(var i = 0;i < formedObjects.length;i++){
		var star = formedObjects[i].GetComponent(star);
		if(star!= null && star.firstStar){
			var gravWell = formedObjects[i].GetComponent(gravityWell);
			if(Vector3.Distance(p.position,gravWell.position) <= (formedObjects[i].localScale.x/2) + (p.size/2)){
				var speed : float;
				for(var j = 0;j < supernovaParticles.length;j++){
					var fObject = formedObjects[i].GetComponent(formationObject);
					var pNumber = 0;
					var SNDust = UnityEngine.Object.Instantiate(supernovaParticles[j],formedObjects[i].position, Quaternion.identity);
					var particleObject = SNDust.GetComponent(ParticleSystem);
					for(var k = 0;k < fObject.dustTypes.length;k++){
						pNumber += fObject.dustTypes[k].dustAmount;
					}
					if(SNDust.tag == "dust"){
						pNumber = Mathf.RoundToInt(pNumber * supernovaDustPercent);
						speed = Mathf.Pow(pNumber,0.3) * supernovaSpeedToMass2;
					}
					else{
						pNumber = Mathf.RoundToInt(pNumber * (1-supernovaDustPercent));
						speed = Mathf.Pow(pNumber,0.3) * supernovaSpeedToMass1;
					}
					particleObject.startSpeed = (speed);
					particleObject.Emit(pNumber);
					addToSupernovae(SNDust);
					//solarSystemDust.addDust(SNDust);
					currentFreezeTime = freezeTime;
					levelled = false;
					orbitCount = 0;
				}
				/*if(solarSystemDust.formedObjects[i] == solarSystemDust.formationDraging){
					solarSystemDust.formationDraging = null;
				}
				var dragIndex = solarSystemDust.inFormationsDragging(formedObjects[i]);
				if(dragIndex != -1){
					solarSystemDust.removeFormationFromDrag(dragIndex);
				}
				UnityEngine.Object.Destroy(formedObjects[i].gameObject);
				solarSystemDust.formedObjectsRemove(i);
				i = formedObjects.length;
			}
		}
	}
}

function orbitParticle(p : ParticleSystem.Particle){
	var velocity = p.velocity;
	velocity = velocity.normalized;
	var newDirection = Vector3(velocity.z,0,-velocity.x);
	var newVelocity = p.velocity + (newDirection * orbitSpeed * Time.deltaTime);
	newVelocity.y = 0;
	return newVelocity;
}

function countDownFreezeTime(){
	if(currentFreezeTime > 0 && currentI != endI){
		currentFreezeTime -= Time.deltaTime;
	}
	if(currentFreezeTime < 0){
		currentFreezeTime = 0;
	}
	
}

function unfreeze(){
	if(currentFreezeTime == 0){
		while(currentI < endI){
			solarSystemDust.addDust(supernovae[currentI]);
			currentI ++;
			if(!tutorial2Showed && tutorialShowed){
				setTutorial2();
			}
		}
		currentFreezeTime = freezeTime;
	}
}

function pulseStar(star : Transform, magnitude : float){
	
}

function cleanOldDust(){
	for(var j = 0;j < solarSystemDust.dust.length;j++){
		if(solarSystemDust.dust[j]!= null){
			var particleObject = solarSystemDust.dust[j].GetComponent(ParticleSystem);
			var p : ParticleSystem.Particle[] = new ParticleSystem.Particle[particleObject.particleCount+1];
			var l : int = particleObject.GetParticles(p);
			var i = 0;
			while(i < l){
				p[i].lifetime = solarSystemDust.dustDeathTime;
				i++;
			}
			particleObject.SetParticles(p, l);
		}
	}
	cleaned = true;
}

function hasAsteroid(){
	if(!tutorial4Showed && tutorial3Showed){
		for(var j = 0;j < solarSystemDust.formedObjects.length;j++){
			if(solarSystemDust.formedObjects[j].GetComponent(asteroid) != null){
				setTutorial4();
				return;
			}
		}
	}
}

function hasStar(){
	if(!tutorial3Showed && tutorial2Showed){
		for(var j = 0;j < solarSystemDust.formedObjects.length;j++){
			if(solarSystemDust.formedObjects[j].GetComponent(star) != null){
				setTutorial3();
				return;
			}
		}
	}
}*/