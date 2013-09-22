/*
Fraser Tehel 2013
*/

class formationDust{
	var dust : Transform[] = new Transform[0];
	var startDust : Transform[];
	var startDustPosition : Vector3;
	var gravityPlane : float = -30;
	
	var gravityMass : float = 10;
	var gravityStrength : float = 10;
	var gravityDistance : float = 10;
	var dustVelocityMax : float = 10;
	var dustDecell : float = 1;
	var maxParticleDistance : float = 100;
	var particleDrag : float = 0.1;
	
	var dustGroups : int = 10;
	var dustMass : float = 0.1;
	
	var formations : formation[] = new formation[0];
	var prefabs : Transform[];
	
	//var formedObjects : Array = new Array();
	var formedObjects : Transform[] = new Transform[0];
	var formedObjectsGravityWells : gravityWell[] = new gravityWell[0];
	var formedObjectsAsteroids : asteroid[] = new asteroid[0];
	var formedObjectsFormationObjects : formationObject[] = new formationObject[0];
	var formedObjectsPrefabs : Transform[] = new Transform[0];
	var maxFormationDistance : float;
	var formationMassEffect : float = 1;
	var formationDrag : float = 100;
	var maxFormationSpeed : float = 15;
	static var formationDraging : Transform;
	static var formationsDragging : Transform[] = new Transform[0];
	var maxGroupDragSize : float = 1;
	
	var mouseGravMass : float = 10;
	var mouseGravDrag : float = 1;
	var mouseGravDistance : float = 2;
	var mouseGravDistanceToZoom = 0.1;
	var mouseGravParticleDistance : float = 10;
	var mouseDragDropOff : float = 0;
	
	static var mouseGrav : gravityWell = new gravityWell();
	static var gravWells : Array = new Array();
	static var mouseGravExists = false;
	
	var massAdditionPerDust : float = 0.1;
	
	var dustDeathTime : float = 3;
	
	var growRate : float = 1;
	
	var collisionDragAmount : float = 5;
	var explosionSpeed : float = 10;
	
	var particlesToDestroy : dustProportion[] = new dustProportion[0];
	static var particleDestroyLocation : Vector3;
	static var particleDestroyDistance : float;
	
	static var currentTimeScale : float = 1;
	static var lastTimeScale : float = 1;
	
	var returnToPlaneRate : float = 1;
	var dustSystemMass : float = 20;
	
	var particlePush : float = 1;
	var pushDistance : float = 1;
	var perfectOrbitMaxThreshold : float = 0.3;
	var perfectOrbitMinThreshold : float = 0.1;
	var perfectSpeedToAngleRatio : float = 1;
	var pullThreshold : float = 0.001;
	var minMassRatioForPull : float = 0.1;
	
	function transferStats(other : formationDust){
		perfectOrbitMaxThreshold = other.perfectOrbitMaxThreshold;
		perfectOrbitMinThreshold = other.perfectOrbitMinThreshold;
		pushDistance = other.pushDistance;
		particlePush = other.particlePush;
		dustSystemMass = other.dustSystemMass;
		particleDrag = other.particleDrag;
		maxParticleDistance = other.maxFormationDistance;
		dust = other.dust;
		startDust = other.startDust;
		startDustPosition = other.startDustPosition;
		gravityPlane = other.gravityPlane;
		
		gravityMass = other.gravityMass;
		gravityStrength = other.gravityStrength;
		gravityDistance = other.gravityDistance;
		dustVelocityMax = other.dustVelocityMax;
		dustDecell = other.dustDecell;
		
		dustGroups = other.dustGroups;
		dustMass = other.dustMass;
		
		formations = other.formations;
		prefabs = other.prefabs;
		
		formedObjects = other.formedObjects;
		formedObjectsFormationObjects = other.formedObjectsFormationObjects;
		formedObjectsGravityWells = other.formedObjectsGravityWells;
		formedObjectsPrefabs = other.formedObjectsPrefabs;
		formedObjectsAsteroids = other.formedObjectsAsteroids;
		
		maxFormationDistance = other.maxFormationDistance;
		formationMassEffect = other.formationMassEffect;
		formationDrag = other.formationDrag;
		maxFormationSpeed = other.maxFormationSpeed;
		formationDraging = other.formationDraging;
		
		mouseGravMass = other.mouseGravMass;
		mouseGravDrag = other.mouseGravDrag;
		mouseGravDistance = other.mouseGravDistance;
		mouseDragDropOff = other.mouseDragDropOff;
		
		mouseGrav = other.mouseGrav;
		gravWells = other.gravWells;
		mouseGravExists = other.mouseGravExists;
		
		massAdditionPerDust = other.massAdditionPerDust;
		
		dustDeathTime = other.dustDeathTime;
		
		growRate = other.growRate;
		
		particlesToDestroy = other.particlesToDestroy;
		particleDestroyLocation = other.particleDestroyLocation;
		particleDestroyDistance = other.particleDestroyDistance;
		
		mouseGravParticleDistance = other.mouseGravParticleDistance;
		
		explosionSpeed = other.explosionSpeed;
		returnToPlaneRate = other.returnToPlaneRate;
		maxGroupDragSize = other.maxGroupDragSize;
		addAllFormations();
		transferStats(other, true);
	}
	
	function transferStats(other : formationDust, exclude : boolean){
		minMassRatioForPull = other.minMassRatioForPull;
		formations = other.formations;
		prefabs = other.prefabs;
		mouseGravDistanceToZoom = other.mouseGravDistanceToZoom;
		perfectOrbitMaxThreshold = other.perfectOrbitMaxThreshold;
		perfectOrbitMinThreshold = other.perfectOrbitMinThreshold;
		//perfectOrbitThreshold = other.perfectOrbitThreshold;
		pushDistance = other.pushDistance;
		particlePush = other.particlePush;
		dustSystemMass = other.dustSystemMass;
		mouseGravParticleDistance = other.mouseGravParticleDistance;
		particleDrag = other.particleDrag;
		maxParticleDistance = other.maxFormationDistance;
		startDust = other.startDust;
		startDustPosition = other.startDustPosition;
		gravityPlane = other.gravityPlane;
		
		gravityMass = other.gravityMass;
		gravityStrength = other.gravityStrength;
		gravityDistance = other.gravityDistance;
		dustVelocityMax = other.dustVelocityMax;
		dustDecell = other.dustDecell;
		
		dustGroups = other.dustGroups;
		dustMass = other.dustMass;
		
		formations = other.formations;
		prefabs = other.prefabs;
		
		maxFormationDistance = other.maxFormationDistance;
		formationMassEffect = other.formationMassEffect;
		formationDrag = other.formationDrag;
		maxFormationSpeed = other.maxFormationSpeed;
		formationDraging = other.formationDraging;
		
		mouseGravMass = other.mouseGravMass;
		mouseGravDrag = other.mouseGravDrag;
		mouseGravDistance = other.mouseGravDistance;
		mouseDragDropOff = other.mouseDragDropOff;
		
		mouseGrav = other.mouseGrav;
		gravWells = other.gravWells;
		mouseGravExists = other.mouseGravExists;
		
		massAdditionPerDust = other.massAdditionPerDust;
		
		dustDeathTime = other.dustDeathTime;
		
		growRate = other.growRate;
		
		particlesToDestroy = other.particlesToDestroy;
		particleDestroyLocation = other.particleDestroyLocation;
		particleDestroyDistance = other.particleDestroyDistance;
		maxGroupDragSize = other.maxGroupDragSize;
		
		explosionSpeed = other.explosionSpeed;
		returnToPlaneRate = other.returnToPlaneRate;
		pullThreshold = other.pullThreshold;
		addAllFormations();

	}
	
	function formedObjectsAdd(object : Transform){
		var temp = new Transform[formedObjects.length + 1];
		for(var i = 0;i < formedObjects.length;i++){
			temp[i] = formedObjects[i];
		}
		temp[formedObjects.length] = object;
		formedObjects = temp;
		var gravWell = object.GetComponent(gravityWell);
		var formObject = object.GetComponent(formationObject);
		var newAsteroid = object.GetComponent(asteroid);
		formedGravAdd(gravWell);
		formedFormationsAdd(formObject);
		formedAsteroidAdd(newAsteroid);
	}
	
	function formedGravAdd(gravWell : gravityWell){
		var temp = new gravityWell[formedObjectsGravityWells.length + 1];
		for(var i = 0;i < formedObjectsGravityWells.length;i++){
			temp[i] = formedObjectsGravityWells[i];
		}
		var newWell = new gravityWell();
		newWell.transferStats(gravWell);
		temp[formedObjectsGravityWells.length] = newWell;
		formedObjectsGravityWells = temp;
	}
	
	function formedAsteroidAdd(other : asteroid){
		var temp = new asteroid[formedObjectsAsteroids.length + 1];
		for(var i = 0;i < formedObjectsAsteroids.length;i++){
			temp[i] = formedObjectsAsteroids[i];
		}
		temp[formedObjectsAsteroids.length] = other;
		formedObjectsAsteroids = temp;
	}
	
	function formedFormationsAdd(formation : formationObject){
		var temp = new formationObject[formedObjectsFormationObjects.length + 1];
		for(var i = 0;i < formedObjectsFormationObjects.length;i++){
			temp[i] = formedObjectsFormationObjects[i];
		}
		var newFormation = new formationObject();
		newFormation.transferStats(formation);
		temp[formedObjectsFormationObjects.length] = newFormation;
		formedObjectsFormationObjects = temp;
	}
	
	function formedPrefabsAdd(prefab : Transform){
		var temp = new Transform[formedObjectsPrefabs.length + 1];
		for(var i = 0;i < formedObjectsPrefabs.length;i++){
			temp[i] = formedObjectsPrefabs[i];
		}
		temp[formedObjectsPrefabs.length] = prefab;
		formedObjectsPrefabs = temp;
	}
	
	function formedObjectsRemove(index : int){
		formedGravWellsRemove(index);
		formedFormationsRemove(index);
		formedPrefabsRemove(index);
		formedAsteroidsRemove(index);
		var temp = new Transform[formedObjects.length - 1];
		var i = 0;
		var j = 0;
		while(i < formedObjects.length){
			if(i != index){
				temp[j] = formedObjects[i];
				j++;
			}
			i++;
		}
		formedObjects = temp;
	}
	
	function formedGravWellsRemove(index : int){
		var temp = new gravityWell[formedObjectsGravityWells.length - 1];
		if(formedObjectsGravityWells.length > 0){
			var i = 0;
			var j = 0;
			while(i < formedObjectsGravityWells.length){
				if(i != index){
					temp[j] = formedObjectsGravityWells[i];
					j++;
				}
				i++;
			}
			formedObjectsGravityWells = temp;
		}
		else{
			formedObjectsGravityWells = temp;
		}
	}
	
	function formedAsteroidsRemove(index : int){
		var temp = new asteroid[formedObjectsAsteroids.length - 1];
		if(formedObjectsAsteroids.length > 0){
			var i = 0;
			var j = 0;
			while(i < formedObjectsAsteroids.length){
				if(i != index){
					temp[j] = formedObjectsAsteroids[i];
					j++;
				}
				i++;
			}
			formedObjectsAsteroids = temp;
		}
		else{
			formedObjectsAsteroids = temp;
		}
	}
	
	function formedFormationsRemove(index : int){
		var temp = new formationObject[formedObjectsFormationObjects.length - 1];
		if(formedObjectsFormationObjects.length > 0){
			var i = 0;
			var j = 0;
			while(i < formedObjectsFormationObjects.length){
				if(i != index){
					temp[j] = formedObjectsFormationObjects[i];
					j++;
				}
				i++;
			}
			formedObjectsFormationObjects = temp;
		}
		else{
			formedObjectsFormationObjects = temp;
		}
	}
	
	function formedPrefabsRemove(index : int){
		var temp = new Transform[formedObjectsPrefabs.length - 1];
		if(formedObjectsPrefabs.length > 0){
			var i = 0;
			var j = 0;
			while(i < formedObjectsPrefabs.length){
				if(i != index){
					temp[j] = formedObjectsPrefabs[i];
					j++;
				}
				i++;
			}
			formedObjectsPrefabs = temp;
		}
		else{
			formedObjectsPrefabs = temp;
		}
	}
	
	
	function getFormation(name : String){
		for(var i = 0;i < formations.length;i++){
			if(formations[i].Name == name){
				return formations[i];
			}
		}
		return null;
	}
	
	function addFormation(prefab : Transform){
		var formation = prefab.GetComponent(formation);
		var temp = new formation[formations.length + 1];
		for(var i = 0;i<formations.length;i++){
			temp[i] = formations[i];
		}
		temp[formations.length] = formation;
		formations = temp;
	}
	
	function addAllFormations(){
		for(var i = 0;i<prefabs.length;i++){
			addFormation(prefabs[i]);
		}
		arrangeFormations();
	}
	
	function arrangeFormations(){
		for(var i = 0;i<formations.length;i++){
			var temp = formations[i];
			for(var j = i;j<formations.length;j++){
				if(formations[i].dustDistance < formations[j].dustDistance){
					formations[i] = formations[j];
					formations[j] = temp;
				}
			}
		}
	}
	
	function addDust(newDust : Transform){
		var temp = new Transform[dust.length + 1];
		for(var i = 0;i<dust.length;i++){
			temp[i] = dust[i];
		}
		temp[dust.length] = newDust;
		dust = temp;
	}
	
	function removeDust(index : int){
		var i = 0;
		var j = 0;
		var temp = new Transform[dust.length - 1];
		while(i < dust.length){
			if(i!=index){
				temp[j] = dust[i];
				j++;
			}
			i++;
		}
		dust = temp;
	}
	
	function addAllDust(){
		for(var i = 0;i < startDust.length;i ++){
			addDust(startDust[i]);
		}
	}
	
	function setScene(){
		mouseGrav.mass = mouseGravMass;
		addAllFormations();
		addAllDust();
	}
	
	function cycleThroughScene(){
		//currentTimeScale = Camera.main.GetComponent(alterTime).sliderScale;
		cycleThroughParticles();
		cycleThroughFormations();
		//lastTimeScale = currentTimeScale;
	}
	
	function cycleThroughParticles(){
		for(var j = 0;j < dust.length;j++){
			var particleObject = dust[j].GetComponent(ParticleSystem);
			var p : ParticleSystem.Particle[] = new ParticleSystem.Particle[particleObject.particleCount+1];
			var l : int = particleObject.GetParticles(p);
		    var i : int = 0;
		    while (i < l) {
		    	//Put particle operations in here.
		    	var initialSpeed = p[i].velocity.magnitude;
		    	var newVelocity = pullParticleToWell(p[i]);
		    	var pVelocity = Vector3.zero;
		    	var h = i % dustGroups;
		    	//var h : int = Random.Range(0,dustGroups);
		    	if(p[i].lifetime > dustDeathTime){
		    		while(h < l){
			    		pVelocity += pullParticleToParticle(p[i],p[h]);
			    		h += dustGroups;
			    	}
			    	if(pVelocity.magnitude > dustVelocityMax){
			    		//pVelocity = limitVector(pVelocity);
			    	}
					newVelocity += pVelocity;
					if(newVelocity.magnitude > dustVelocityMax){
						newVelocity = newVelocity.normalized * initialSpeed;
					}
					
						newVelocity = slowParticle(newVelocity);
					
					p[i].velocity = newVelocity;
					if(mouseGravExists && p[i].lifetime > dustDeathTime){
						newVelocity = dragParticle(p[i]);
						p[i].position = dragParticlePosition(p[i]);
					}
					p[i].velocity = newVelocity;
					p[i].velocity = moveParticleToGravPlane(p[i]);
					
				}
				p[i].size = shrinkParticle(p[i]);
				p[i].lifetime = mergeParticle(p[i], dust[j].tag);
				p[i].velocity = destroyParticleInFormationVelocity(p[i], dust[j].tag);
				p[i].lifetime = destroyParticleInFormation(p[i], dust[j].tag);
				p[i].lifetime = destroyParticle(p[i]);
				p[i].velocity = mergeParticleVelocity(p[i], dust[j].tag);
				//p[i].velocity = alterTimeScale(p[i].velocity);
				i++;
		    }
			particleObject.SetParticles(p, l);
		}
		cleanParticles();
	}
	
	function cleanParticles(){
		for(var j = 0;j < dust.length;j++){
			var particleObject = dust[j].GetComponent(ParticleSystem);
			var p : ParticleSystem.Particle[] = new ParticleSystem.Particle[particleObject.particleCount+1];
			var l : int = particleObject.GetParticles(p);
			if(l == 0){
				UnityEngine.Object.Destroy(dust[j].gameObject);
				removeDust(j);
			}
		}
	}
	
	function createMouseGravWell(){
		var ray : Ray = Camera.main.ScreenPointToRay(Input.mousePosition);
		var planePosition = Vector3(0,gravityPlane,0);
		var hPlane : Plane = new Plane(Vector3.up, planePosition);
		var distance : float = 0;
		var position : Vector3;
		if(hPlane.Raycast(ray, distance)){
		    position = ray.GetPoint(distance);
		}
		mouseGrav.position = position;
		dragFormationWithRay();
		createFormation();
	}
	
	function createTouchGravWell(){
		var ray : Ray = Camera.main.ScreenPointToRay(Input.touches[0].position);
		var planePosition = Vector3(0,gravityPlane,0);
		var hPlane : Plane = new Plane(Vector3.up, planePosition);
		var distance : float = 0;
		var position : Vector3;
		if(hPlane.Raycast(ray, distance)){
		    position = ray.GetPoint(distance);
		}
		mouseGrav.position = position;
		dragFormationWithRay();
		createFormation();
	}
	
	function getMouseGravity(){
		if(Input.GetMouseButton(0) && !mouseGravExists){
			mouseGravExists = true;
			createMouseGravWell();
			lastMousePos = mouseGrav.position;
		}
		if(Input.GetMouseButton(0) && mouseGravExists){
			createMouseGravWell();
			setMouseDrag();
		}
		if(!Input.GetMouseButton(0) && mouseGravExists){
			mouseGravExists = false;
			formationDraging = null;
			clearFormationsDragging();
		}
	}
	
	function getTouchGravity(){
		if(Input.touches.Length == 1 && !mouseGravExists){
			mouseGravExists = true;
			createTouchGravWell();
			lastMousePos = mouseGrav.position;
		}
		if(Input.touches.Length == 1 && mouseGravExists){
			createTouchGravWell();
			setMouseDrag();
		}
		if(Input.touches.Length == 0 && mouseGravExists){
			mouseGravExists = false;
			formationDraging = null;
			clearFormationsDragging();
		}
	}
	
	function pullParticleToWell(p : ParticleSystem.Particle){
		var newVelocity : Vector3 = Vector3.zero;
		var initialSpeed = p.velocity.magnitude;
		for(var j : int = 0; j < formedObjects.length;j++){
			if(formedObjects[j]!=null){
				var gravWell = formedObjects[j].GetComponent(gravityWell);
				newVelocity += getGravity(p.position, gravWell.position, dustMass, gravWell.mass)*Time.deltaTime;
			}
		}
		if(mouseGravExists){
			newVelocity += getMouseGravity(p.position, dustMass, 0)*Time.deltaTime;
		}
		newVelocity.y = 0;
		newVelocity = newVelocity + p.velocity;
		/*if(newVelocity.magnitude > dustVelocityMax){
			newVelocity = newVelocity.normalized * initialSpeed;
		}*/
		return newVelocity;
	}
	
	function pullParticleToParticle(q : ParticleSystem.Particle, r : ParticleSystem.Particle){
		var newVelocity : Vector3;
		newVelocity = getGravity(q.position, r.position, dustMass * dustGroups, dustMass)*Time.deltaTime;
		newVelocity += getPush(q.position, r.position, dustMass * dustGroups, dustMass,q.size)*Time.deltaTime;
		newVelocity.y = 0;
		return newVelocity;
	}
	
	static var lastMousePos : Vector3;
	static var mouseDrag : Vector3;
	
	function getMouseDrag(percent : float){
		return percent * mouseDrag;
	}
	
	function setMouseDrag(){
		var currentMousePos = mouseGrav.position;
		var movement = currentMousePos - lastMousePos;
		lastMousePos = currentMousePos;
		mouseDrag = movement;
	}
	
	function dragParticle(p : ParticleSystem.Particle){
		var movement = p.velocity;
		var distance = Vector3.Distance(p.position + getMouseDrag(1)*2, mouseGrav.position);
		if(distance <= mouseGravParticleDistance){
			var percent = 1-(distance/mouseGravParticleDistance);
			percent *= mouseDragDropOff;
			if(percent > 1){
				percent = 1;
			}
			movement = Vector3.Lerp(movement,getMouseDrag(percent)/Time.deltaTime,particleDrag*percent);
		}
		return movement;
	}
	
	function dragParticlePosition(p : ParticleSystem.Particle){
		var position = p.position;
		var distance = Vector3.Distance(p.position, mouseGrav.position);
		if(distance <= getMouseGravDistance()){
			var percent = 1-(distance/getMouseGravDistance());
			percent *= mouseDragDropOff;
			if(percent > 1){
				percent = 1;
			}
			position += mouseGravDrag*getMouseDrag(percent);
		}
		return position;
	}
	
	function getMouseGravity(thisPos : Vector3, thisMass : float, extraRange : float){
		
		var distance = Vector3.Distance(thisPos,mouseGrav.position);
		var thisGravity : Vector3 = (mouseGrav.position - thisPos);
		thisGravity = thisGravity.normalized;
		thisGravity *= getMousePull(distance,thisMass, extraRange);
		return thisGravity*gravityStrength;
	}
	
	function getMouseGravity(thisPos : Vector3, thisMass : float, extraRange : float, print : boolean){
		
		var distance = Vector3.Distance(thisPos,mouseGrav.position);
		var thisGravity : Vector3 = (mouseGrav.position - thisPos);
		thisGravity = thisGravity.normalized;
		thisGravity *= getMousePull(distance,thisMass, extraRange);
		return thisGravity*gravityStrength;
	}
	
	function getMousePull(distance : float, thisMass : float, extraRange : float){
		if(distance <= getMouseGravDistance() + extraRange){
			var percent = 1-(distance/(getMouseGravDistance()+extraRange));
			if(percent > 1){
				percent = 1;
			}
			var pull = percent * (thisMass * gravityMass * mouseGravMass * mouseGrav.mass);
			return pull;
		}
		return 0;
	}
	
	function slowParticle(velocity : Vector3){
		var s = velocity.magnitude;
		if(s > dustVelocityMax){
			var n = velocity.normalized;
			var x = dustDecell * Time.deltaTime;
			if(x > s){
				x = s;
			}
			s -= x;
			n *= s;
			return n;
		}
		return velocity;
	}
	
	function mergeParticle(p : ParticleSystem.Particle, tag : String){
		var lifetime = p.lifetime;
		if(lifetime > dustDeathTime){
			for(var i = 0;i < formedObjects.length;i++){
				if(formedObjects[i]!= null){
					if(formedObjects[i].GetComponent(formationObject).inDustTypes(tag) && Vector3.Distance(p.position,formedObjects[i].position) < (formedObjects[i].localScale.y/2) + 0.1 + 
					(formedObjects[i].GetComponent(formationObject).dustDistance/2)){
						formedObjects[i].GetComponent(formationObject).mergeWithDust(p, tag);
						lifetime = dustDeathTime;
					}
				}
			}
		}
		return lifetime;
	}
	
	function mergeParticleVelocity(p : ParticleSystem.Particle, tag : String){
		var velocity = p.velocity;
		for(var i = 0;i < formedObjects.length;i++){
			if(formedObjects[i] != null){
				if(formedObjects[i].GetComponent(formationObject).inDustTypes(tag) && Vector3.Distance(p.position,formedObjects[i].position) < formedObjects[i].localScale.y/2 +
				(formedObjects[i].GetComponent(formationObject).dustDistance/3)){
					velocity = formedObjects[i].GetComponent(gravityWell).velocity;
				}
			}
		}
		return velocity;
	}
	
	function shrinkParticle(p : ParticleSystem.Particle){
		var remainingLife = p.lifetime;
		var s : float = 0;
		if(remainingLife < dustDeathTime){
			s = (p.size/remainingLife) * Time.deltaTime;
		}
		return p.size - s;
	}
		
	function getGravity(thisPos : Vector3, well : Vector3, thisMass : float, otherMass : float){
		var distance = Vector3.Distance(thisPos,well);
		var thisGravity = Vector3.zero;
		if(distance > 0){
			thisGravity = (well - thisPos);
			thisGravity = thisGravity.normalized;
			var pull = getPull(distance,thisMass,otherMass);
			if(pull > pullThreshold){
				thisGravity *= pull;
				return thisGravity;
			}
		}
		return thisGravity;
	}
	
	function getPush(thisPos : Vector3, well : Vector3, thisMass : float, otherMass : float, size : float){
		var distance = Vector3.Distance(thisPos,well);
		var thisGravity = Vector3.zero;
		if(distance > 0 && distance <= size){
			thisGravity = (well - thisPos);
			thisGravity = thisGravity.normalized;
			var percent = 1-(distance/(size));
			if(percent > 1){
				percent = 1;
			}
			if(percent < 0){
				percent = 0;
			}
			var push : float = particlePush*Mathf.Pow(percent,pushDistance);
			thisGravity *= push;
			
			return -thisGravity;
		}
	}
	
	function getPull(distance : float, thisMass : float,otherMass : float){
		var massPow = Mathf.Pow(otherMass,gravityMass);
		var thisPow = Mathf.Pow(thisMass,gravityMass);
		var distancePow = distance*gravityDistance;
		var pull = (gravityStrength*(massPow))/(distancePow*distancePow);
		return pull;
	}
	
	function limitVector(vector : Vector3){
		return vector.normalized * dustVelocityMax;
	}
	
	function canCreate(prefab : formation, well : Vector3){
		var pull : float = 0;
		for(var i : int = 0;i < formedObjects.length;i++){
			if(formedObjects[i]!=null){
				var distance : float = Vector3.Distance(well,formedObjects[i].position);
				var otherMass = formedObjects[i].GetComponent(gravityWell).mass;
				pull += getPull(distance,prefab.startMass,otherMass);
			}
		}
		if(pull < prefab.maxGrav){
			return enoughDustInWell(prefab, well);
		}
		else{
			return false;
		}
	}
	
	function enoughDustInWell(prefab : formation, well : Vector3){
		if(prefab.hasAllDust(dust)){
			var compareTypes = prefab.emptyDustTypes();
			for(var i = 0;i < dust.Length;i++){
				var dustType = prefab.getDustType(dust[i].tag);
				if(dustType != null){
					var dustCount : int;
					var particleObject = dust[i].GetComponent(ParticleSystem);
					var p : ParticleSystem.Particle[] = new ParticleSystem.Particle[particleObject.particleCount+1];
					var l : int = particleObject.GetParticles(p);
				    var j : int = 0;
				    while (j < l && dustCount < dustType.dustAmount) {
				    	if(p[j].lifetime > dustDeathTime && Vector3.Distance(p[j].position,well) <= prefab.dustDistance){
				    		dustCount ++;
				    		for(var k = 0;k < compareTypes.length;k++){
						    	compareTypes[k].addDust(dust[i].tag);
						    }
				    	}
						j++;
				    }
			   	}
			}
			return prefab.enoughDust(compareTypes);
		}
		return false;
	}
	
	function createFormation(){
		for(var i = 0;i < formations.length;i++){
			if(canCreate(formations[i],mouseGrav.position)){
				var newFormation : Transform;
				formedPrefabsAdd(formations[i].prefab);
				newFormation = UnityEngine.Object.Instantiate(formations[i].prefab,mouseGrav.position,Quaternion.identity);
				formedObjectsAdd(newFormation);
				formedObjects[formedObjects.length-1].GetComponent(gravityWell).position = mouseGrav.position;
				formedObjects[formedObjects.length-1].GetComponent(gravityWell).mass = formations[i].startMass;
				formedObjects[formedObjects.length-1].GetComponent(formationObject).transferStats(formations[i]);
				formedObjects[formedObjects.length-1].localScale = Vector3.zero;
				createFormation(formations[i],mouseGrav.position);
				var grav = formedObjects[formedObjects.length-1].GetComponent(gravityWell);
				if(formedObjects.Length > 1){
					grav.velocity = getStartPerfectVelocity(grav);
				}
			}
		}
	}
	
	function createFormation(position : Vector3, formation : Transform, mass : float, velocity : Vector3, other : formation, speed : float){
		var newFormation : Transform;
		var thisPos = position;
		thisPos.y = gravityPlane;
		formedPrefabsAdd(other.prefab);
	
		newFormation = UnityEngine.Object.Instantiate(formation,thisPos,Quaternion.identity);
		formedObjectsAdd(newFormation);
		formedGravAdd(newFormation.GetComponent(gravityWell));
		var length = formedObjects.length;
	
		formedObjects[length-1].localScale = Vector3.zero;
		formedObjects[length-1].GetComponent(gravityWell).mass = mass;
		//velocity = formedObjects[length-1].GetComponent(gravityWell).velocity;
		formedObjects[length-1].GetComponent(formationObject).transferStats(other);
		//solarSystemDust.formedObjects[length-1].GetComponent(formationObject).growAmount = Mathf.Pow(mass/(1.33*3.14),0.33)*other.massRadiusstarRatio*2;
		//solarSystemDust.formedObjects[length-1].GetComponent(formationObject).growAmount = 1;
		formedObjects[length-1].GetComponent(formationObject).newGrowRate = speed;
		formedObjects[length-1].GetComponent(formationObject).setDustAmount("firstGas", mass);
		formedObjects[length-1].GetComponent(gravityWell).position = thisPos;
		if(formedObjects.Length > 1){
			velocity = getStartPerfectVelocity(formedObjects[length-1].GetComponent(gravityWell));
		}
		formedObjects[length-1].GetComponent(gravityWell).velocity = velocity;
	}
	
	function createFormation(formation : formation, position : Vector3){
		for(var i = 0;i < formation.dustTypes.length;i++){
			addToDestroyList(formation.dustTypes[i]);
		}
		particleDestroyDistance = formation.dustDistance * 2;
		particleDestroyLocation = position;
	}
	
	function getWell(formation : Transform){
		var well = formation.GetComponent(gravityWell);
		return well;
	}
	
	function inDestroyList(proportion : dustProportion){
		for(var i = 0;i < particlesToDestroy.length;i++){
			if(particlesToDestroy[i].dustType == proportion.dustType){
				return i;
			}
		}
		return -1;
	}
	
	function inDestroyList(name : String){
		for(var i = 0;i < particlesToDestroy.length;i++){
			if(particlesToDestroy[i].dustType == name){
				return i;
			}
		}
		return -1;
	}
	
	function addToDestroyList(proportion : dustProportion){
		var index = inDestroyList(proportion);
		if(index > -1){
			particlesToDestroy[index].dustAmount += proportion.dustAmount;
		}
		else{
			var temp = new dustProportion[particlesToDestroy.length + 1];
			for(var i = 0;i < particlesToDestroy.length;i++){
				temp[i] = particlesToDestroy[i];
			}
			var newProportion : dustProportion = new dustProportion(proportion);
			temp[particlesToDestroy.length] = newProportion;
			particlesToDestroy = temp;
		}
	}
	
	function destroyParticleInFormationVelocity(p : ParticleSystem.Particle, type : String){
		
		var velocity = p.velocity;
		if(p.lifetime > dustDeathTime){
			if(Vector3.Distance(p.position,particleDestroyLocation) <= particleDestroyDistance){
				var index = inDestroyList(type);
				if(index > -1){
					velocity = Vector3.zero;
				}
			}
		}
		return velocity;
	}
	
	function destroyParticleInFormation(p : ParticleSystem.Particle, type : String){
		
		var lifetime = p.lifetime;
		if(lifetime > dustDeathTime){
			if(Vector3.Distance(p.position,particleDestroyLocation) <= particleDestroyDistance){
				var index = inDestroyList(type);
				if(index > -1){
					if(particlesToDestroy[index].dustAmount > 0){
						particlesToDestroy[index].dustAmount --;
						lifetime = dustDeathTime;
					}
				}
			}
		}
		return lifetime;
	}
	
	function  destroyParticle(p : ParticleSystem.Particle){
		var lifeTime = p.lifetime;
		if(Vector3.Distance(p.position,Camera.main.transform.position) > maxParticleDistance){
			lifeTime = 0;
		}
		return lifeTime;
	}
	
	function moveParticleToGravPlane(p : ParticleSystem.Particle){
		var velocity = p.velocity;
		if(p.position.y > gravityPlane){
			var newYV = returnToPlaneRate*Mathf.Abs(gravityPlane - p.position.y);
			velocity.y = Mathf.Lerp(velocity.y,-newYV,returnToPlaneRate);
		}
		if(p.position.y < gravityPlane){
			var newYV2 = returnToPlaneRate*Mathf.Abs(gravityPlane - p.position.y);
			velocity.y = Mathf.Lerp(velocity.y,newYV2,returnToPlaneRate);
		}
		return velocity;
	}
	
	function cycleThroughFormations(){
		for(var i = 0;i < formedObjects.length;i++){
			//repairFormedObject(i);
			clearFormationsDragging();
			if(formedObjects[i] != null){
				//var velocity = formedObjects[i].GetComponent(gravityWell).velocity;
				formedObjects[i].GetComponent(gravityWell).velocity = pullFormationToWell(formedObjects[i],i);
				collideFormation(formedObjects[i], i);
				if(mouseGravExists){
					addFormationToDrag(formedObjects[i],formedObjects[i].localScale.x/2);
					selectFormationToDrag();
					if(formationDraging == formedObjects[i]){
						formedObjects[i].GetComponent(gravityWell).velocity = dragFormationGroup(formedObjects[i]);
					}
					if(formationDraging != formedObjects[i] && inFormationsDragging(formedObjects[i]) && 
					formedObjects[i].localScale.x <= maxGroupDragSize){
						formedObjects[i].GetComponent(gravityWell).velocity = dragFormationGroup(formedObjects[i]);
					}
				}
				//formedObjects[i].GetComponent(gravityWell).velocity = dragFormation(formedObjects[i],formedObjects[i].localScale.y/2);
				formedObjects[i].GetComponent(gravityWell).velocity = collisionDrag(formedObjects[i],i);
				//formedObjects[i].GetComponent(gravityWell).position = dragFormationPosition(formedObjects[i],formedObjects[i].localScale.y/2);
				//formedObjects[i].GetComponent(gravityWell).velocity = alterTimeScale(formedObjects[i].GetComponent(gravityWell).velocity);
				destroyFormation(i);
			}
			/*if(formedObjects.Length > 1){
				var other = getStrongestPull(formedObjects[i].position).position;
				var distance = Vector3.Distance(formedObjects[i].position,other);
				if(distance > maxDistance || maxDistance == -1){
					maxDistance = distance;
				}
				if(distance < minDistance || minDistance == -1){
					minDistance = distance;
				}
				distanceRange = maxDistance- minDistance;
			}*/
		}
	}
	
	/*var distanceRange : float;
	var maxDistance : float = -1;
	var minDistance : float = -1;*/
	
	function pullFormationToWell(formation : Transform, exlude : int){
		var newVelocity : Vector3 = Vector3.zero;
		var originalVelocity : Vector3 = formation.GetComponent(gravityWell).velocity;
		var formationMass = formation.GetComponent(gravityWell).mass;
		for(var j : int = 0; j < formedObjects.length;j++){
			if(formedObjects[j]!= null){
				var gravWell = formedObjects[j].GetComponent(gravityWell);
				var mass = gravWell.mass;
				if(j != exlude && mass > formationMass* minMassRatioForPull){
					newVelocity += getGravity(formation.position, gravWell.position, formationMass, mass)*Time.deltaTime;
				}
			}
		}
		if(mouseGravExists){
			//newVelocity += getMouseGravity(formation.position, formationMass, formation.localScale.x/2, true)*Time.deltaTime;
		}
		newVelocity.y = 0;
		//newVelocity /= Mathf.Pow(formationMass, gravityMass/4);
		newVelocity += originalVelocity;
		if(newVelocity.magnitude > maxFormationSpeed){
			newVelocity = newVelocity.normalized*originalVelocity.magnitude;
		}
		return newVelocity;
	}
	
	function selectFormationToDrag2(){
		var ray : Ray = Camera.main.ScreenPointToRay(Input.mousePosition);
		var hit : RaycastHit;
	    if (Physics.Raycast (ray, hit, 1000)) {
	    	if(hit.transform != null){
	        	formationDraging = hit.transform;
	        }
	    }
	}
	
	function selectFormationToDrag(){
		if(formationDraging == null){
			var closestDistance = getMouseGravDistance();
			var closestInt = -1;
			for(var i = 0;i < formationsDragging.length;i++){
				var distance = Vector3.Distance(formationsDragging[i].position, mouseGrav.position);
				if(distance < closestDistance){
					closestInt = i;
					closestDistance = distance;
				}
			}
			if(closestInt != -1){
				formationDraging = formationsDragging[closestInt];
			}
		}
	}
	
	function addFormationToDrag(formation : Transform){
		var temp = new Transform [formationsDragging.length + 1];
		for(var i = 0;i < formationsDragging.length;i++){
			temp[i] = formationsDragging[i];
		}
		temp[formationsDragging.length] = formation;
		formationsDragging = temp;
	}
	
	function removeFormationFromDrag(index : int){
		var temp = new Transform [formationsDragging.length - 1];
		var i = 0;
		var j = 0;
		while(i < formationsDragging.Length){
			if(i != index){
				temp[j] = formationsDragging[i];
				j++;
			}
			i++;
		}
		formationsDragging = temp;
	}
	
	function addFormationToDrag(formation : Transform, extraDistance : float){
		if(!formationIsTracking(formation)){
			var distance = Vector3.Distance(formation.position, mouseGrav.position);
			if(distance <= getMouseGravDistance() + extraDistance){
				addFormationToDrag(formation);
			}
		}
	}
	
	function clearFormationsDragging(){
		formationsDragging = new Transform[0];
	}
	
	function inFormationsDragging(formation : Transform){
		for(var i = 0;i < formationsDragging.length;i++){
			if(formationsDragging[i] == formation){
				return i;
			}
		}
		return -1;
	}
	
	function getStrongestPull(pos : Vector3){
		var highest : int = -1;
		var highestGrav : float = 0;
		for(var i = 0;i < formedObjects.length;i++){
			if(Vector3.Distance(pos,formedObjects[i].position) > formedObjects[i].localScale.x/2){
				var mass = formedObjects[i].GetComponent(gravityWell).mass;
				var magnitude = getGravity(pos, formedObjects[i].position, 1, mass).magnitude;
				if(magnitude > highestGrav){
					highestGrav = magnitude;
					highest = i;
				}
			}
		}
		if(highest != -1){
			return formedObjects[highest].GetComponent(gravityWell);
		}
	}
	
	function getPerfectOrbitSpeed(well : gravityWell , other : gravityWell){
		var massPow = Mathf.Pow(other.mass,gravityMass);
		var thisPow = Mathf.Pow(well.mass,gravityMass);
		var distance = Vector3.Distance(well.position,other.position);
		var distancePow = distance*gravityDistance;
		var m = getPull(other.mass,well.mass,distance)*Time.deltaTime;
		var x = Mathf.Sqrt((gravityStrength * (massPow))/distancePow);
		return x;
	}
	
	/*function getPerfectOrbitSpeed(well : gravityWell , other : gravityWell){
		var massPow = Mathf.Pow(other.mass,gravityMass);
		var thisPow = Mathf.Pow(well.mass,gravityMass);
		var distance = (well.position-other.position).magnitude;
		var distancePow = distance*gravityDistance;
		
		var m = getPull(other.mass,well.mass,distance);
		var x = Mathf.Sqrt((distance * distance) - ((distance - m) * (distance - m)));
		return x;
	}*/
	
	/*function getPerfectOrbitSpeed(well : gravityWell , other : gravityWell){
		var m = Mathf.Pow(other.mass,gravityMass);
		var thisPow = Mathf.Pow(well.mass,gravityMass);
		var distance = (well.position-other.position).magnitude;
		var d = distance*gravityDistance;
		var f = getPull(m,m,d)*Time.deltaTime;
		var x = Mathf.Sqrt(Mathf.Abs((f*d)-(m*d)));
		return x*Time.deltaTime;
	}*/
	
	function getPerfectOrbitVelocity(well : gravityWell , other : gravityWell){
		var angle = other.position - well.position;
		angle = angle.normalized;
		var right = Vector3(angle.z,angle.y,-angle.x);
		var dot = Vector3.Dot(well.velocity.normalized,right);
		if(dot < 0){
			right = -right;
		}
		return ((right * getPerfectOrbitSpeed(well , other)) + other.velocity);
	}
	
	function getStartPerfectVelocity(well : gravityWell){
		var other = getStrongestPull(well.position);
		var v = getPerfectOrbitVelocity(well , other);
		//v += getGravity(well.position, other.position, well.mass, other.mass)*Time.deltaTime;
		return v;
	}
	
	function getPerfectOrbitVelocity(v : Vector3, well : gravityWell){
		var other = getStrongestPull(well.position);
		if(other.mass > well.mass){
			return getPerfectOrbitVelocity(well , other);
		}
		return v;
	}
	
	function snapToPerfect(velocity : Vector3, well : gravityWell){
		var perfect = getPerfectOrbitVelocity(velocity, well);
		var v = velocity;
		var m = velocity.magnitude;
		var m2 = perfect.magnitude;
		var speedPercent = m/m2;
		speedPercent*=perfectSpeedToAngleRatio;
		if(speedPercent > 1){
			speedPercent = 1;
		}
		var speedDifference = Mathf.Abs(speedPercent - 1);
		var directionDifference = Mathf.Abs(1-Vector3.Dot(perfect.normalized,v.normalized));
		var meanDifference = (speedDifference + directionDifference)/2;
		if(meanDifference <= perfectOrbitMinThreshold){
			v = perfect;
		}
		else if(meanDifference <= perfectOrbitMaxThreshold){
			var x = meanDifference - perfectOrbitMinThreshold;
			var y = perfectOrbitMaxThreshold - perfectOrbitMinThreshold;
			var percent = 1 - (x/y);
			var XPercent = 1 - percent;
			var V1 = v * XPercent;
			var V2 = perfect * percent;
			v = (V1+V2)/2;
		}
		return v;
	}
	
	function dragFormation(f : Transform, extraDistance : float){
		var movement = f.GetComponent(gravityWell).velocity;
		var distance = Vector3.Distance(f.position, mouseGrav.position);
		if(distance <= getMouseGravDistance() + extraDistance){
			var percent = 1-(distance/(getMouseGravDistance()+extraDistance));
			percent *= mouseDragDropOff;
			if(percent > 1){
				percent = 1;
			}
			movement = Vector3.Lerp(movement,getMouseDrag(percent)/Time.deltaTime,formationDrag/Mathf.Pow(f.GetComponent(gravityWell).mass,formationMassEffect));
			if(formedObjects.length > 1){
				movement = snapToPerfect(movement,f.GetComponent(gravityWell));
			}
		}	
		return movement;
	}
	
	function dragFormationGroup(f : Transform){
		var movement = f.GetComponent(gravityWell).velocity;
		var distance = Vector3.Distance(f.position, mouseGrav.position);
		movement = Vector3.Lerp(movement,getMouseDrag(1)/Time.deltaTime,formationDrag/Mathf.Pow(f.GetComponent(gravityWell).mass,formationMassEffect));
		if(formedObjects.length > 1){
			movement = snapToPerfect(movement,f.GetComponent(gravityWell));
		}
		return movement;
	}
	
	function dragFormationWithRay2(){
		selectFormationToDrag();
		if(formationDraging != null){
			var movement = formationDraging.GetComponent(gravityWell).velocity;
			movement = Vector3.Lerp(movement,getMouseDrag(1)/Time.deltaTime,formationDrag/formationDraging.GetComponent(gravityWell).mass);
			formationDraging.GetComponent(gravityWell).velocity = movement;
		}
	}
	
	function dragFormationWithRay(){
		if(formationDraging != null){
			var movement = formationDraging.GetComponent(gravityWell).velocity;
			movement = Vector3.Lerp(movement,getMouseDrag(1)/Time.deltaTime,formationDrag/formationDraging.GetComponent(gravityWell).mass);
			formationDraging.GetComponent(gravityWell).velocity = movement;
		}
	}
	
	function dragFormationPosition(f : Transform, extraDistance : float){
		var position = f.position;
		var distance = Vector3.Distance(f.position, mouseGrav.position);
		if(distance <= getMouseGravDistance() + extraDistance){
			var posAdd = Vector3.zero;
			var percent = 1-(distance/(getMouseGravDistance()+extraDistance));
			percent *= mouseDragDropOff;
			if(percent > 1){
				percent = 1;
			}
			posAdd = mouseGravDrag*getMouseDrag(percent);
			if(formationMassEffect > 0){
				posAdd /= f.GetComponent(gravityWell).mass*formationMassEffect;
			}
			position += posAdd;
		}
		return position;
	}
	
	function destroyFormation(index : int){
		if(Vector3.Distance(formedObjects[index].position,Camera.main.transform.position) > maxFormationDistance){
			if(formedObjects[index] == formationDraging){
				formationDraging = null;
			}
			var dragIndex = inFormationsDragging(formedObjects[index]);
			if(dragIndex!= -1){
				removeFormationFromDrag(dragIndex);
			}
			UnityEngine.Object.Destroy(formedObjects[index].gameObject);
			formedObjectsRemove(index);
		}
	}
	
	function collideFormation(formation : Transform, exclude : int){
		for(var i = 0;i < formedObjects.length;i++){
			if(i != exclude && formedObjects[i] != null){
				var otherSize = formedObjects[i].localScale.x;
				var thisSize = formation.localScale.x;
				if(otherSize >= thisSize * 0.85){
					if(Vector3.Distance(formation.position,formedObjects[i].position) <= (otherSize/2)){
						formedObjects[i].GetComponent(gravityWell).velocity = getAverageVelocity(formedObjects[i],formation);
						//var other = formedObjects[i].GetComponent(formationObject);
						var thisF = formation.GetComponent(formationObject);
						/*for(var j = 0;j < thisF.dustTypes.length;j++){
							other.addDust(thisF.dustTypes[j]);
						}*/
						for(var j = 0;j < thisF.explosionParticles.length;j++){
							var newDust = UnityEngine.Object.Instantiate(thisF.explosionParticles[j],formation.position,Quaternion.identity);
							addDust(newDust);
							newDust.GetComponent(ParticleSystem).startSpeed = getExplosionVelocity(formation,formedObjects[i]);
							thisF.explode(newDust);
						}
						formation.GetComponent(gravityWell).position+=Vector3(maxFormationDistance*3,0,0);
						formation.position+=Vector3(maxFormationDistance*3,0,0);
					}
				}
			}
		}
	}
	
	function getExplosionVelocity(formation : Transform, other : Transform){
		var mass = formation.GetComponent(gravityWell).mass;
		var thisV = formation.GetComponent(gravityWell).velocity;
		var otherV = other.GetComponent(gravityWell).velocity;
		var difference = otherV-thisV;
		var speed = difference.magnitude;
		
		return speed * explosionSpeed * mass;
	}
	
	function collisionDrag(formation : Transform, exclude : int){
		var velocity = formation.GetComponent(gravityWell).velocity;
		for(var i = 0;i < formedObjects.length;i++){
			if(i != exclude && formedObjects[i]!=null){
				var otherSize = formedObjects[i].localScale.x;
				var thisSize = formation.localScale.x;
				if(otherSize >= thisSize && Vector3.Distance(formation.position,formedObjects[i].position) < (otherSize/2) + (thisSize/2)){
					var velocityToOther = formedObjects[i].position - formation.position;
					velocityToOther = velocityToOther.normalized;
					velocityToOther *= velocity.magnitude;
					velocity = Vector3.Lerp(velocity,velocityToOther, collisionDragAmount);
					return velocity;
				}
			}
		}
		return velocity;
	}
	
	function alterTimeScale(velocity : Vector3){
		var v = velocity * timeScalePercent();
		return v;
	}
	
	function getAverageVelocity(formation : Transform, other : Transform){
		var thisGrav = formation.GetComponent(gravityWell);
		var otherGrav = other.GetComponent(gravityWell);
		var totalMass = thisGrav.mass + otherGrav.mass;
		var massA = thisGrav.mass/totalMass;
		var massB = otherGrav.mass/totalMass;
		var totalV = (thisGrav.velocity*massA) + (otherGrav.velocity*massB);
		var average = totalV/2;
		return average;
	}
	
	function timeScalePercent(){
		if(lastTimeScale>0){
			return currentTimeScale/lastTimeScale;
		}
		return 0;
	}
	
	function repairFormedObject(index : int){
		if(formedObjects[index] == null){
			formedObjects[index] = UnityEngine.Object.Instantiate( formedObjectsPrefabs[index], formedObjectsGravityWells[index].position,
			Quaternion.identity);
			formedObjects[index].GetComponent(gravityWell).transferStats( formedObjectsGravityWells[index]);
			formedObjects[index].GetComponent(formationObject).transferStats( formedObjectsFormationObjects[index]);
			if (formedObjects[index].GetComponent(asteroid)!=null){
				formedObjects[index].GetComponent(asteroid).transferStats(formedObjectsAsteroids[index]);
			}
		}
		else{
			storeFormedObjectStats(index);
		}
	}
	
	function storeFormedObjectStats(index : int){
		formedObjectsFormationObjects[index].transferStats(formedObjects[index].GetComponent(formationObject));
		formedObjectsGravityWells[index].transferStats(formedObjects[index].GetComponent(gravityWell));
		if(formedObjectsAsteroids[index]!=null){
			formedObjectsAsteroids[index].transferStats(formedObjects[index].GetComponent(asteroid));
		}
	}
	
	function transformMissing(thing : Transform){
		try{
			var gravWell = thing.GetComponent(gravityWell).position;
			return false;
		}
		catch(err){
			return true;
		}
	}
	
	function totalMass(){
		var mass : float;
		for(var i = 0;i < formedObjects.length;i++){
			mass+=formedObjects[i].GetComponent(gravityWell).mass;
		}
		return mass;
	}
	
	function massPercent(mass : float){
		if(totalMass() == 0){
			return 1;
		}
		return mass/totalMass();
	}
	
	function centreMass(){
		var position = Vector3.zero;
		for(var i = 0;i < formedObjects.length;i++){
			var mass = formedObjects[i].GetComponent(gravityWell).mass;
			position += formedObjects[i].position * massPercent(mass);
		}
		return position;
	}
	
	function formationIsTracking(formation : Transform){
		var tracking = Camera.main.GetComponent(cameraTracking).target;
		if(tracking == formation){
			return true;
		}
		return false;
	}
	
	function getMouseGravDistance(){
		var height = Camera.main.transform.position.y - gravityPlane;
		var range = height* mouseGravDistanceToZoom * mouseGravDistance;
		return range;
	}
}