var playing = false;
var solarSystemDust : formationDust = new formationDust();
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

static var orbitCount : float = 0;

static var levelled = false;

function Update () {
	if(playing){
		updateFunction();
	}
}

function reset(){
	Debug.Log("Reseting create solar system");
	transform.GetComponent(panCamera).setStart();
	for(var j = 0;j < solarSystemDust.formedObjects.length;j++){
		Destroy(solarSystemDust.formedObjects[j].gameObject);
	}
	getStats();
	for(var i = 0;i < solarSystemDust.formedObjects.length;i++){
		Instantiate(solarSystemDust.formedObjects[i],solarSystemDust.formedObjects[i].position,Quaternion.identity);
	}
	
}

function setScene(stats : formationDust){
	solarSystemDust.transferStats(stats);
	setTutorial1();
}

function Start(){
	getStats();
	//solarSystemDust.gravityPlane = gravityPlane;
}

function getStats(){
	var stats = GameObject.Find("statsHolder");
	if(stats != null){
		transferStats(stats.GetComponent(createSolarSystem));
		solarSystemDust.transferStats(stats.GetComponent(statsHolderScript).stats,true);
	}
}

function updateFunction(){
	solarSystemDust.cycleThroughParticles();
	solarSystemDust.cycleThroughFormations();
	solarSystemDust.getMouseGravity();
	supernovaStar();
	countDownFreezeTime();
	unfreeze();
	cycleThroughSupernovae();
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
}*/

function setTutorial1(){
	var tutorial = GetComponent(menu);
	var str = "Click and drag to drag all objects in an area. As long as the mouse button is held down you will continue to drag "+
	"the objects you have selected.";
	tutorial.tutorialString = str;
}

function supernovaStar(){
	var formedObjects = solarSystemDust.formedObjects;
	for(var i = 0;i < formedObjects.length;i++){
		var star = formedObjects[i].GetComponent(star);
		if(star!= null && star.firstStar){
			var gravWell = formedObjects[i].GetComponent(gravityWell);
			var mouseGrav = solarSystemDust.mouseGrav;
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
					if(solarSystemDust.formedObjects[i] == solarSystemDust.formationDraging){
						solarSystemDust.formationDraging = null;
					}
					var dragIndex = solarSystemDust.inFormationsDragging(formedObjects[i]);
					if(dragIndex != -1){
						solarSystemDust.removeFormationFromDrag(dragIndex);
					}
					UnityEngine.Object.Destroy(formedObjects[i].gameObject);
					solarSystemDust.formedObjectsRemove(i);
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
			if(Vector3.Distance(p.position,gravWell.position) <= formedObjects[i].localScale.x/2){
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
				if(solarSystemDust.formedObjects[i] == solarSystemDust.formationDraging){
					solarSystemDust.formationDraging = null;
				}
				var dragIndex = solarSystemDust.inFormationsDragging(formedObjects[i]);
				if(dragIndex != -1){
					solarSystemDust.removeFormationFromDrag(dragIndex);
				}
				UnityEngine.Object.Destroy(formedObjects[i].gameObject);
				solarSystemDust.formedObjectsRemove(i);
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

function transferStats(other : createSolarSystem){
	supernovaParticles = other.supernovaParticles;
	supernovaDustPercent = other.supernovaDustPercent;
	supernovae = other.supernovae;

	levelled = other.levelled;
	freezeTime = other.freezeTime;
	currentFreezeTime = other.currentFreezeTime;
	orbitSpeed = other.orbitSpeed;
	supernovaSpeedToMass1 = other.supernovaSpeedToMass1;
	supernovaSpeedToMass2 = other.supernovaSpeedToMass2;
	maxOrbitCount = other.maxOrbitCount;
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
		}
		currentFreezeTime = freezeTime;
	}
}

function pulseStar(star : Transform, magnitude : float){
	
}


