var sliderScale : float = 1;
var timeScale : float = 1;
var position : Vector2 = Vector2(10,10);
var size : Vector2 = Vector2(100,20);
var max : float = 2;
var min : float = 0;
var power : float = 4;
var textNo : int = 8;
var textOffset : float = 5;
var textSize : float = 10;
var skin : GUISkin;
var playing = false;
var labelSize = Vector2(70,30);

function Update () {
	if(playing){
		var timeScale = Mathf.Pow(sliderScale,power);
		if(timeScale > 99.9){
			timeScale = 99.9;
		}
		if(timeScale < 0.01){
			timeScale = 0.01;
		}
		Time.timeScale = timeScale;
	}
}

function Start(){
	var stats = GameObject.Find("statsHolder");
	if(stats != null){
		transferStats(stats.GetComponent(alterTime));
	}
}	

function OnGUI(){
	if(playing){
		GUI.skin = skin;
		sliderScale = GUI.HorizontalSlider(Rect(position.x,position.y,size.x,size.y),sliderScale,min,max);
		GUI.Box(Rect(position.x+size.x,position.y, labelSize.x, labelSize.y),"Time Scale");
		GUI.Box(Rect(position.x,position.y,size.x,size.y), "");
		for(var i = 0;i < textNo;i++){
			var textPos = textPos(i);
			GUI.Box(Rect(textPos.x,textPos.y,textSize,textSize),textNumber(i));
		}
	}
}

function textPos(index : int){
	var increment : float = (size.x)/(textNo-1);
	var start = Vector2(position.x-(textSize/2),position.y + size.y + textOffset);
	var finalPos = start + Vector2(increment*index,0);
	return finalPos;
}

function textNumber(index : int){
	var increment : float = (size.x)/(textNo-1);
	var pos = increment * index;
	var scale = pos/size.x;
	scale *= max;
	var num = Mathf.Pow(scale,power);
	if(num < 0.1){
		num = num - (num % 0.01);
	}
	else if (num >= 0.94){
		num = Mathf.RoundToInt(num);
	}
	else{
		num = num - (num % 0.1);
	}
	return "" + num;
}

function transferStats(other : alterTime){
	this.sliderScale = other.sliderScale;
	this.position = other.position;
	this.size = other.size;
	this.max = other.max;
	this.min = other.min;
	this.power = other.power;
	this.textNo = other.textNo;
	this.textOffset = other.textOffset;
	this.textSize = other.textSize;
	this.skin = other.skin;
	this.labelSize = other.labelSize;
	this.timeScale = other.timeScale;
}