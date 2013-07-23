class dustProportion{
	var dustType : String;
	var dustAmount : int;
	var dustMass : float;
	
	function dustProportion(dustType : String, dustPercent : int){
		this.dustType = dustType;
		this.dustAmount = dustAmount;
	}
	
	function dustProportion(other : dustProportion){
		this.dustType = other.dustType;
		this.dustAmount = other.dustAmount;
		this.dustMass = other.dustMass;
	}
	
	function typeEquals(dustProportion){
		if(dustType.Equals(dustProportion.dustType)){
			return true;
		}
		return false;
	}
	
	function addDust(tag : String){
		if(tag == dustType){
			dustAmount++;
		}
	}
	
	function clone(other : dustProportion){
		dustType = other.dustType;
		dustAmount = other.dustAmount;
		dustMass = other.dustMass;
	}
}