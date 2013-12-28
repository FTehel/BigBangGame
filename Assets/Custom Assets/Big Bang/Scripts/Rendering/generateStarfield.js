var generatorsMid = new backGroundGenerator[0];
var playing = false;
var midUniverse = false;

function transferStats(other : generateStarfield){
	generatorsMid = other.generatorsMid;
}

function setMidUniverse(){
	midUniverse = true;
	for(var gens : backGroundGenerator in generatorsMid){
		gens.createStartTiles();
	}
}

function Update(){
	if(playing){
		if(midUniverse){
			for(var gens : backGroundGenerator in generatorsMid){
				gens.updateGrid();
			}
		}
	}
}