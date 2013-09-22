	var upgrades : objectUpgrade[] = new objectUpgrade[0];
	var currentUpgrade : int = 0;
	var planet = false;
	var trailToSize : float = 10;
	var currentScale : float;
	
	function Update(){
		updateFunction();
	}
	
	function upgrade(){
		transform.GetComponent(TrailRenderer).time = trailToSize*transform.localScale.x;
		for(var i = currentUpgrade;i < upgrades.length;i++){
			if(transform.localScale.x >= upgrades[i].scale){
				currentUpgrade = i;
				if(upgrades[i].thisAnimation != null){
					animation.clip = upgrades[i].thisAnimation;
				}
				planet = upgrades[i].planet;
				GetComponent(MeshFilter).mesh = upgrades[i].mesh;
				if(upgrades[i].material != null){
					GetComponent(MeshRenderer).materials[0] = upgrades[i].material;
				}
			}
		}
	}
	
	function transferStats(other : asteroid){
		upgrades = other.upgrades;
		currentUpgrade = other.currentUpgrade;
		planet = other.planet;
		GetComponent(MeshFilter).mesh = upgrades[currentUpgrade].mesh;
		if(upgrades[currentUpgrade].material != null){
			GetComponent(MeshRenderer).materials[0] = upgrades[currentUpgrade].material;
		}
		if(upgrades[currentUpgrade].thisAnimation != null){
			animation.clip = upgrades[currentUpgrade].thisAnimation;
		}
	}
	
	function updateFunction(){
		var scale = GetComponent(formationObject).scale;
		if(currentScale != scale){
			upgrade();
			currentScale = scale;
		}
	}