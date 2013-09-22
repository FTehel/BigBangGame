//class formation{
	var Name : String;
	var minDust : int;
	var prefab : Transform;
	var maxGrav : float;
	var dustTypes : dustProportion[];
	var massRadiusRatio : float;
	var dustDistance : float;
	var startMass : float;
	var growthRate : float;
	static var startRadius : float;
	
/*	function formation(name : String, minDust : int, prefab : Transform, maxGrav : float, dustTypes : dustProportion[]){
		this.name = name;
		this.minDust = minDust;
		this.prefab = prefab;
		this.maxGrav = maxGrav;
		this.dustTypes = dustTypes;
	}*/
	
	
	function addDustType(dustType : String, dustPercentage : int){
		var temp : dustProportion[] = new dustProportion[dustTypes.length + 1];
		for(var i = 0;i < dustTypes.length;i++){
			temp[i] = dustTypes[i];
		}
		var newDustType = new dustProportion(dustType, dustPercentage);
		temp[dustTypes.length] = newDustType;
	}
	
	function compareTo(other : dustProportion[]){
		var thisProp = getProportionPercentage(other);
		var otherProp = getProportionPercentage(dustTypes);
		
		var n : float = 0;
		for(var i = 0;i < thisProp.length;i++){
			var otherFound = false;
			var j = 0;
			while(!otherFound && j < otherProp.length){
				if(otherProp[i].typeEquals(otherProp[j])){
					otherFound = true;
					n += Mathf.Abs(thisProp[i].dustAmount - otherProp[j].dustAmount);
				}
				j++;
			}
		}
		return n;
	}
	
	function getProportionPercentage(proportions : dustProportion[]){
		var n : float;
		for(var i = 0;i < proportions.length;i++){
			n+=proportions[i].dustAmount;
		}
		var returnArray = new dustProportion[proportions.length];
		for(var j = 0;j < dustTypes.length;j++){
			var newDust = new dustProportion(proportions[j].dustType,proportions[j].dustAmount/n);
			returnArray[j] = newDust;
		}
		return returnArray;
	}
	
	function enoughDust(type : String, n : int){
		var dustType = getDustType(type);
		if(n >= dustType.dustAmount){
			return true;
		}
		return false;
	}
	
	function enoughDust(other : dustProportion){
		var dustType = getDustType(other.dustType);
		if(other.dustAmount >= dustType.dustAmount){
			return true;
		}
		return false;
	}
	
	function enoughDust(other : dustProportion[]){
		for(var i = 0;i < other.length;i++){
			if(!enoughDust(other[i])){
				return false;
			}
		}
		return true;
	}
	
	function emptyDustTypes(){
		var newArray = new dustProportion[dustTypes.length];
		for(var i = 0;i < dustTypes.length;i++){
			var newType = new dustProportion(dustTypes[i]);
			newType.dustAmount = 0;
			newArray[i] = newType;
		}
		return newArray;
	}
	
	function getDustType(type : String){
		for(var i = 0;i < dustTypes.length;i++){
			if(dustTypes[i].dustType == type){
				return dustTypes[i];
			}
		}
		return null;
	}
	
	function usesDustType(type : String){
		if(getDustType(type) == null){
			return false;
		}
		return true;
	}
	
	function hasAllDust(types : Transform[]){
		for(var j = 0;j < dustTypes.length;j++){
			var found = false;
			for(var i = 0;i < types.length;i++){
				if(types[i].tag == dustTypes[j].dustType){
					found = true;
				}
			}
			if(!found){
				return false;
			}
		}
		return true;
	}
//}