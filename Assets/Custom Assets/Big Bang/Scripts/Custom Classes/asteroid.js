	var upgrades : objectUpgrade[] = new objectUpgrade[0];
	var currentUpgrade : int = 0;
	var isPlanet = false;
	var currentScale : float;
	
	function Update(){
		updateFunction();
	}
	
	function upgrade(){
		for(var i = currentUpgrade;i < upgrades.length;i++){
			if(transform.localScale.x >= upgrades[i].scale){
				currentUpgrade = i + 1;
				if(upgrades[i].thisAnimation != null){
					animation.AddClip(upgrades[i].thisAnimation,upgrades[i].thisAnimation.name);
					animation.CrossFade(upgrades[i].thisAnimation.name,0,PlayMode.StopAll);
				}
				isPlanet = upgrades[i].planet;
				GetComponent(MeshFilter).mesh = upgrades[i].mesh;
				if(upgrades[i].material != null){
					renderer.material = upgrades[i].material;
				}
				if(upgrades[i].changeRotation){
					transform.rotation = upgrades[i].rotation;
				}
				if(upgrades[i].planet){
					transform.GetComponent(planet).enabled = true;
				}
			}
		}
	}
	
	function transferStats(other : asteroid){
		upgrades = other.upgrades;
		currentUpgrade = other.currentUpgrade;
		isPlanet = other.isPlanet;
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