var size : Vector2 = Vector2(20,30);
var buttonSize : Vector2 = Vector2(10,5);
var pos : Vector2 = Vector2(70,20);
var buttonPos : float = 10;
var displaying = false;

function Start(){
	vectorsToPercent();
}

function vector2ToScreenPercent(vector : Vector2){
	var xPercent = vector.x/100;
	var yPercent = vector.y/100;
	var x = Mathf.RoundToInt(xPercent*Screen.width);
	var y = Mathf.RoundToInt(yPercent*Screen.height);
	return Vector2(x,y);
}

function floatToHeightPercent(n : float){
	var xPercent = n/100;
	var x = Mathf.RoundToInt(xPercent*Screen.height);
	return x;
}

function floatToWidthPercent(n : float){
	var xPercent = n/100;
	var x = Mathf.RoundToInt(xPercent*Screen.width);
	return x;
}

function vectorsToPercent(){
	size = vector2ToScreenPercent(size);
	buttonSize = vector2ToScreenPercent(buttonSize);
	pos = vector2ToScreenPercent(pos);
	buttonPos = floatToHeightPercent(buttonPos);
}

function GUIfunction(){
	GUI.Box(Rect(pos.x,pos.y,size.x,size.y),"");
	if(GUI.Button(Rect(pos.x + ((size.x/2)-(buttonSize.x/2)),pos.y + buttonPos,buttonSize.x,buttonSize.y),"Barren")){
		GetComponent(planet).makeBarren();
	}
	if(GUI.Button(Rect(pos.x + ((size.x/2)-(buttonSize.x/2)),pos.y + buttonPos + buttonSize.y,buttonSize.x,buttonSize.y),"Life")){
		GetComponent(planet).createLife();
	}
	if(GUI.Button(Rect(pos.x + ((size.x/2)-(buttonSize.x/2)),pos.y + buttonPos + (buttonSize.y*2),buttonSize.x,buttonSize.y),"Ice")){
		GetComponent(planet).freeze();
	}
}

function OnGUI(){
	if(displaying){
		GUIfunction();
	}
}