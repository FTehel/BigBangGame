var ships : Transform[];
var dust : formationDust;
var shipTypesA = new Transform[0];
var shipTypes : shipCreation[];
var level = 1;
var shipsDragging : Transform[];
var shipDragEffect : float = 10;

function addCreation(prefab : Transform){
	var creation = prefab.GetComponent(shipCreation);
	var temp = new shipCreation[shipTypes.length + 1];
	for(var i = 0;i<shipTypes.length;i++){
		temp[i] = shipTypes[i];
	}
	temp[shipTypes.length] = creation;
	shipTypes = temp;
}

function addAllCreations(){
	for(var i = 0;i<shipTypesA.length;i++){
		addCreation(shipTypesA[i]);
	}
}

function Awake(){
	addAllCreations();
}

function transferStats(other : shipsHolder){
	ships = other.ships;
	shipTypesA = other.shipTypesA;
	level = other.level;
	shipDragEffect = other.shipDragEffect;
	addAllCreations();
}

function updateFunction(){
	cycleThroughShips();
}

function Start(){
	dust = GetComponent(formationDust);
}

function Update () {
	updateFunction();
}

function getStats(){
	var stats = GameObject.Find("statsHolder");
	transferStats(stats.GetComponent(shipsHolder));
}

function cycleThroughShips(){
	for(var i = 0;i < ships.length;i++){
		ships[i].GetComponent(ship).cycleThroughObjects();
		ships[i].GetComponent(ship).cycleThroughAsteroids();
		if(dust.mouseGravExists){
			addShipToDrag(ships[i]);
			if(dust.dragShips && inShipsDragging(ships[i]) != -1){
				ships[i].GetComponent(ship).setVelocity(dragShipGroup(ships[i]));
			}
		}
	}
}

function dragShipGroup(f : Transform){
	var movement = f.GetComponent(ship).getVelocity();
	var distance = Vector3.Distance(f.position, dust.mouseGrav.position);
	//if(distance <= dust.getMouseGravDistance() * 2){
		var percent = 1-(distance/(dust.getMouseGravDistance()*2));
		if(Time.timeScale != 0 && Time.deltaTime != 0){
			movement = Vector3.Lerp(movement,dust.getMouseDrag(1)/Time.deltaTime, shipDragEffect);
		}
		if(dust.formedObjects.length > 1){
			//movement = dust.snapToPerfect(movement,f.GetComponent(gravityWell));
			//Debug.Log(5 + " " + movement);
		}
	//}
	//Debug.Log(6 + " " + movement);
	return movement;
}

function inShipsDragging(ship : Transform){
	for(var i = 0;i < shipsDragging.length;i++){
		if(shipsDragging[i] == ship){
			return i;
		}
	}
	return -1;
}

function addShipToDrag(ship : Transform){
	var distance = Vector3.Distance(ship.position, dust.mouseGrav.position);
	if(distance <= dust.getMouseGravDistance()){
		addShipToDragging(ship);
	}
}

function addShipToDragging(ship2 : Transform){
	if(inShipsDragging(ship2) == -1){
		var temp = new Transform [shipsDragging.length + 1];
		for(var i = 0;i < shipsDragging.length;i++){
			temp[i] = shipsDragging[i];
		}
		temp[shipsDragging.length] = ship2;
		shipsDragging = temp;
		ship2.GetComponent(ship).dragging = true;
	}
}

function removeShipFromDrag(index : int){
	var temp = new Transform [shipsDragging.length - 1];
	var i = 0;
	var j = 0;
	while(i < shipsDragging.Length){
		if(i != index){
			temp[j] = shipsDragging[i];
			j++;
		}
		i++;
	}
	shipsDragging = temp;
}

function addShip(newShip : Transform){
	var temp = new Transform[ships.length + 1];
	for(var i = 0;i<ships.length;i++){
		temp[i] = ships[i];
	}
	temp[ships.length] = newShip;
	ships = temp;
}

function removeShip(index : int){
	var temp = new Transform[ships.length - 1];
	var i = 0;
	var j = 0;
	while(i < ships.length){
		if(i != index){
			temp[j] = ships[i];
			j++;
		}
		i++;
	}
	ships = temp;
}

function createShip(position : Vector3){
	var newShip : Transform;
	var thisPos = position;
	thisPos.y = dust.gravityPlane;
	newShip = UnityEngine.Object.Instantiate(getShipToCreate(),thisPos,Quaternion.identity);
	addShip(newShip);
	var length = ships.length -1;
	ships[length].GetComponent(ship).position = thisPos;
	if(dust.formedObjects.length >= 1){
		ships[length].GetComponent(ship).setVelocity(dust.getStartPerfectVelocity(position));
	}
}

function getShipToCreate(){
	for(var i = 0; i < shipTypes.length;i++){
		if(level == shipTypes[i].level){
			return shipTypes[i].prefab;
		}
	}
}

function clearShipsDragging(){
	for(var i = 0;i < shipsDragging.length;i++){
		shipsDragging[i].GetComponent(ship).dragging = false;
	}
	shipsDragging = new Transform[0];
}