var growAmount : float = 0;
var thisGrowRate : float;
var startGrowRate : float = 0;
var newGrowRate : float = 0;
var dustTypes : dustProportion[] = new dustProportion[0];
var massRadiusRatio : float;
var scale : float = 0;
var explosionParticles : Transform[] = new Transform[0];
var dustDistance : float = 0;

function restore(){
	transform.localScale = Vector3(scale,scale,scale);
}

function grow(growRate : float){
	var g = growRate*Time.deltaTime;
	if(g > growAmount){
		g = growAmount;
	}
	scale += g;
	growAmount-=g;
}

function updateScale(){
	transform.localScale = Vector3(scale,scale,scale);
}

function addDustType(dustType : dustProportion){
	var temp : dustProportion[] = new dustProportion[dustTypes.length + 1];
	for(var i = 0;i < dustTypes.length;i++){
		temp[i] = dustTypes[i];
	}
	var newType = new dustProportion(dustType);
	temp[dustTypes.length] = newType;
	dustTypes = temp;
}

function Update(){
	updateFunction();
}

function Awake(){
	startGrowRate = thisGrowRate;
	if(newGrowRate != 0){
		thisGrowRate = newGrowRate;
	}
}

function updateFunction(){
	if(growAmount > 0){
		grow(thisGrowRate);
	}
	if(growAmount <= 0){
		growAmount = 0;
		if(startGrowRate != 0){
			thisGrowRate = startGrowRate;
			newGrowRate = startGrowRate;
		}
	}
	if(newGrowRate != 0){
		thisGrowRate = newGrowRate;
	}
	updateScale();
}
function inDustTypes(dustType : String){
	for(var i = 0;i < dustTypes.length;i++){
		if(dustTypes[i].dustType == dustType){
			return true;
		}
	}
	return false;
}

function getDustIndex(tag : String){
	for(var i = 0;i < dustTypes.length;i++){
		if(dustTypes[i].dustType == tag){
			return i;
		}
	}
	return -1;
}

function addDust(index : int){
	dustTypes[index].dustAmount ++;
	
}

function addDust(index : int, amount : int){
	dustTypes[index].dustAmount += amount;
}

function getGrowthAmount(dustType : String){
	for(var i = 0;i < dustTypes.length;i++){
		if(dustTypes[i].dustType == dustType){
			return dustTypes[i].dustMass;
		}
	}
}

function mergeWithDust(p : ParticleSystem.Particle, tag : String){
	if(inDustTypes(tag)){
		var i = getDustIndex(tag);
		addDust(i);
		var mass = transform.GetComponent(gravityWell).mass;
		var growthAmount = getGrowthAmount(tag);
		mass += growthAmount;
		transform.GetComponent(gravityWell).mass = mass;
		var newSize = Mathf.Pow((mass*massRadiusRatio)/(1.33*3.14),0.33)*2;
		var newGrowAmount = newSize - transform.localScale.y;
		growAmount += newGrowAmount;
		if(GetComponent(asteroid) != null){
			GetComponent(asteroid).upgrade();
		}
	}
}

function addDust(other : dustProportion){
	var index = getDustIndex(other.dustType);
	if(index != -1){
		addDust(index,other.dustAmount);
	}
}

function transferStats(other : formation){
	for(var i = 0;i < other.dustTypes.length;i++){
		addDustType(other.dustTypes[i]);
	}
	massRadiusRatio = other.massRadiusRatio;
	thisGrowRate = other.growthRate;
	var mass = transform.GetComponent(gravityWell).mass;
	growAmount = Mathf.Pow(mass/(1.33*3.14),0.33)*massRadiusRatio*2;
	dustDistance = other.dustDistance;
}

function transferStats(other : formationObject){
	dustTypes = other.dustTypes;
	massRadiusRatio = other.massRadiusRatio;
	thisGrowRate = other.thisGrowRate;
	startGrowRate = other.startGrowRate;
	newGrowRate = other.newGrowRate;
	growAmount = other.growAmount;
	scale = other.scale;
}

function getExplosionNumber(explosion : Transform){
	for(var i = 0;i < dustTypes.length;i++){
		if(dustTypes[i].dustType == explosion.tag){
			return dustTypes[i].dustAmount;
		}
	}
	return -1;
}

function explode(explosion : Transform){
	var particleSystem = explosion.GetComponent(ParticleSystem);
	particleSystem.Emit(getExplosionNumber(explosion));
}

function setDustAmount(type : String, mass : float){
	var index = getDustIndex(type);
	var amount = Mathf.RoundToInt(mass/dustTypes[index].dustMass);
	dustTypes[index].dustAmount = amount;
}