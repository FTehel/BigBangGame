var particlePrefabs : Transform[];
var particleDensity : int;
var particles : Transform[];

var particleSize : float = 0.1;

function Start (){
	fill();
}

function fill(){
	for(var i : int = 0;i < particleDensity;i++){
		var particlePosition = (Random.insideUnitSphere * transform.localScale.x)+transform.position;
		var newParticle = randomParticle();
		newParticle.localScale = Vector3.one*particleSize;
		var particle = Instantiate(newParticle,particlePosition,Quaternion.identity);
		particle.parent = transform;
	}
}

function randomParticle(){
	if(particlePrefabs.Length > 0){
		var range = particlePrefabs.Length - 1;
		var n : int = Mathf.RoundToInt(Random.Range(0,range));
		return particlePrefabs[n];
	}
}