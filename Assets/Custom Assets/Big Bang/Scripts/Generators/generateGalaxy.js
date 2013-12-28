var radiusRange : Vector2 = Vector2(1000000,10000000);
var starIncrement : float = 1000;
var arms : int = 6;
var turnDegrees : float = 180;
var armSize = 0.5;
var stars : Transform[] = new Transform[0];
var starMass : Vector2 = Vector2(500,1500);
var growSpeed : float = 100;
var armPercent : float = 0.7;
var spiralPercent : float = 0.3;
private var centre : Vector3 = Vector3.zero;
private var currentAngle : float = 0;
private var angleRange : float = 0;
private var angleIncrement : float = 0;
private var radius : float = 0;
private var dust : formationDust;
private var currentRadius : float = 0;
private var startPos : float = 0;
private var sceneSet = false;
private var starCount : int = 0;
private var spiralRadius : float;

function transferStats(other : generateGalaxy){
	radiusRange = other.radiusRange;
	starIncrement = other.starIncrement;
	arms = other.arms;
	turnDegrees = other.turnDegrees;
	armSize = other.armSize;
	stars = other.stars;
	starMass = other.starMass;
	growSpeed = other.growSpeed;	
}

function setScene(start : Vector3){
	if(!sceneSet){
		dust = GetComponent(formationDust);
		var stats = GameObject.Find("statsHolder");
		if(stats != null){
			transferStats(stats.GetComponent(generateGalaxy));
		}
		setWidth();
		setCentre(start);
		setAngleRange();
		setAngleIncrement();
		createGalaxy();
		sceneSet = true;
	}
}

function setAngleRange(){
	angleRange = (360/arms)*armSize;
}

function setAngleIncrement(){
	angleIncrement = (turnDegrees/(radius/starIncrement))+(360/arms);
}

function setWidth(){
	radius = Random.Range(radiusRange.x,radiusRange.y);
	spiralRadius = radius * spiralPercent;
}

function subAngle(){
	if(currentRadius >= spiralRadius){
		return Random.Range(0,angleRange);
	}
	else{
		return Random.Range(0,360);
	}
}

function angle(start : float){
	return loopAngle(start + subAngle());
}

function loopAngle(angle : float){
	return angle%360;
}

function starIndex(){
	var returnInt : int = Random.Range(0, stars.length - 1);
	return returnInt;
}

function getMass(){
	return Random.Range(starMass.x,starMass.y);
}

function distanceFromStart(){
	return Random.Range(0,radius);
}

function angleFromStart(){
	return Random.Range(0,360);
}

function setCentre(start : Vector3){
	var centreV2 = findPoint(distanceFromStart(),angleFromStart());
	centre = Vector3(centreV2.x + start.x,dust.gravityPlane,centreV2.y+start.z);
}

function createGalaxy(){
	while (currentRadius < radius){
		var position : Vector3;
		var newAngle : float = angle(currentAngle);
		var posV2 = findPoint(currentRadius,newAngle);
		position.x = posV2.x;
		position.z = posV2.y;
		position.y = 0;
		var formation = stars[starIndex()].GetComponent(formation);
		dust.createFormation(centre + position,formation.prefab,getMass(),Vector3.zero,formation,growSpeed);
		if(currentRadius >= spiralRadius){
			currentAngle += angleIncrement;
		}
		currentRadius += starIncrement;
		currentAngle = loopAngle(currentAngle);
		starCount ++;
	}
}

function findPoint(h : float, a : float){
	var b : float;
	var x : float;
	var y : float;
	if(a == 0){
		return Vector2(0,h);
	}
	else if(a < 90){
		//Debug.Log(a);
		a = Mathf.Deg2Rad * a;
		//Debug.Log(a + " " + Mathf.Cos(a) + " " + Mathf.Sin(a) + " " + h);
		y = Mathf.Cos(a)*h;
		x = Mathf.Sin(a)*h;
		return Vector2(x,y);
	}
	else if (a == 90){
		return Vector2(h,0);
	}
	else if(a < 180){
		b = a - 90;
		b = Mathf.Deg2Rad * b;
		y = Mathf.Sin(b)*h;
		x = Mathf.Cos(b)*h;
		return Vector2(x,-y);
	}
	else if (a == 180){
		return Vector2(0,-h);
	}
	else if(a < 270){
		b = a - 180;
		b = Mathf.Deg2Rad * b;
		y = Mathf.Cos(b)*h;
		x = Mathf.Sin(b)*h;
		return Vector2(-x,-y);
	}
	else if (a == 270){
		return Vector2(-h,0);
	}
	else{
		b = a - 270;
		b = Mathf.Deg2Rad * b;
		y = Mathf.Sin(b)*h;
		x = Mathf.Cos(b)*h;
		return Vector2(-x,y);
	}
}

