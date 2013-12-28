class backGroundGenerator{
	var particles : Transform;
	var height : float = -10000;
	var generateDistance : int = 3;
	var createdTiles : Transform[] = new Transform[0];
	var tileSize : int = 30000;
	var centre : Vector2 = Vector2.zero;
	var cameraOffset : Vector2 = Vector2.zero;
	var left : float;
	var right : float;
	var front : float;
	var back : float;
	
	function addTile(newTile : Transform){
		var temp = new Transform[createdTiles.length + 1];
		for(var i = 0;i<createdTiles.length;i++){
			temp[i] = createdTiles[i];
		}
		temp[createdTiles.length] = newTile;
		createdTiles = temp;
	}

	function removeTile(index : int){
		var temp = new Transform[createdTiles.length - 1];
		var i = 0;
		var j = 0;
		while(i < createdTiles.length){
			if(i != index){
				temp[j] = createdTiles[i];
				j++;
			}
			i++;
		}
		createdTiles = temp;
	}
	
	function inTiles(tile : Transform){
		for(var i = 0;i < createdTiles.length;i++){
			if(createdTiles[i] == tile){
				return i;
			}
		}
		return -1;
	}
	
	function createTile(x : float, y : float){
		var newTile : Transform;
		var	pos = Vector3(x,height,y);
		newTile = UnityEngine.Object.Instantiate(particles,pos,Quaternion.identity);
		addTile(newTile);
	}
	
	function deleteTile(tile : Transform){
		var index = inTiles(tile);
		if(index != -1){
			UnityEngine.Object.Destroy(tile.gameObject);
			removeTile(index);
		}
	}
	
	function deleteTile(index : int){
		if(index != -1){
			UnityEngine.Object.Destroy(createdTiles[index].gameObject);
			removeTile(index);
		}
	}
	
	function createStartTile(){
		createTile(0,0);
	}
	
	function createStartTiles(){
		var x = -(tileSize * generateDistance);
		left = x;
		var y = x;
		front = y;
		for(var i = 0;i < (generateDistance * 2) + 1;i++){
			for(var j = 0;j < (generateDistance * 2) + 1;j++){
				createTile(x,y);
				x += tileSize;
			}
			right = x;
			x = -(tileSize * generateDistance);
			y += tileSize;
		}
		back = y;
	}
	
	function width(){
		return (generateDistance * 2) + 1;
	}
	
	function halfWidth(){
		return tileSize * generateDistance;
	}
	
	function addRowFront(){
		var x = centre.x-halfWidth();
		var y = centre.y-halfWidth()-tileSize;
		//front = y;
		for(var i = 0;i < width();i++){
			createTile(x,y);
			x += tileSize;
		}
		removeRowBack();
		centre.y-=tileSize;
	}
	
	function removeRowBack(){
		var y = centre.y+halfWidth();
		//y = back;
		for(var i = 0;i < createdTiles.length;i++){
			if(createdTiles[i].position.z == y){
				deleteTile(i);
				i--;
			}
		}
		//back -= tileSize;
	}
	
	function addRowBack(){
		var x = centre.x-halfWidth();
		var y = centre.y+halfWidth()+tileSize;
		//back = y;
		for(var i = 0;i < width();i++){
			createTile(x,y);
			x += tileSize;
		}
		removeRowFront();
		centre.y+=tileSize;
	}
	
	function removeRowFront(){
		var y = centre.y-halfWidth();
		//y = front;
		for(var i = 0;i < createdTiles.length;i++){
			if(createdTiles[i].position.z == y){
				deleteTile(i);
				i--;
			}
			
		}
		//front += tileSize;
	}
	
	function addRowLeft(){
		var x = centre.x-halfWidth()-tileSize;
		var y = centre.y-halfWidth();
		//left = x;
		for(var i = 0;i < width();i++){
			createTile(x,y);
			y += tileSize;
		}
		removeRowRight();
		centre.x-=tileSize;
	}
	
	function removeRowRight(){
		var x = centre.x+halfWidth();
		//x = right;
		for(var i = 0;i < createdTiles.length;i++){
			if(createdTiles[i].position.x == x){
				deleteTile(i);
				i--;
			}
		}
		//right -= tileSize;
	}
	
	function addRowRight(){
		var x = centre.x+halfWidth()+tileSize;
		var y = centre.y-halfWidth();
		//right = x;
		for(var i = 0;i < width();i++){
			createTile(x,y);
			y += tileSize;
		}
		removeRowLeft();
		centre.x+=tileSize;
	}
	
	function removeRowLeft(){
		var x = centre.x-halfWidth();
		//x = left;
		for(var i = 0;i < createdTiles.length;i++){
			if(createdTiles[i].position.x == x){
				deleteTile(i);
				i--;
			}
		}
		//left += tileSize;
	}
	
	function cameraDistanceFromCentre(){
		var pos = Camera.main.transform.position + Vector3( cameraOffset.x,0,cameraOffset.y);
		return pos - Vector3(centre.x,0,centre.y);
	}
	
	function updateGrid(){
		var camPos = cameraDistanceFromCentre();
		if(camPos.x >= tileSize){
			addRowRight();
		}
		if(camPos.x <= -tileSize){
			addRowLeft();
		}
		if(camPos.z >= tileSize){
			addRowBack();
		}
		if(camPos.z <= -tileSize){
			addRowFront();
		}
	}
}