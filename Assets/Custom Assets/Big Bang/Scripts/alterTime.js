var sliderScale : float = 1;
var timeScale : float = 1;
var position : Vector2 = Vector2(10,10);
var size : Vector2 = Vector2(100,20);
var max : float = 2;
var min : float = 0;
var positivePower : float = 4;
var negativePower : float = 10;
var maxScale : float = 100;
var minScale : float = 0.01;
var textNo : int = 8;
var textOffset : float = 5;
var textSize : float = 10;
var skin : GUISkin;
var playing = false;
var labelSize = Vector2(70,30);
var positiveToNegative : float = 10;

function Update () {
	if(playing){
		var lastScale = Time.timeScale;
		positivePower = Mathf.Log(maxScale)/Mathf.Log(max);
		negativePower = Mathf.Log(minScale)/Mathf.Log(min);
		var newScale : float = sliderScale;
		if(newScale > 1){
			newScale = Mathf.Pow(newScale,positivePower);
		}
		if(newScale < 1){
			newScale = Mathf.Pow(newScale,negativePower);
		}
		if(newScale >= 100){
			newScale = 99.9999;
		}
		if(newScale < 0.01){
			newScale = 0.01;
		}
		if(newScale != lastScale){
			GetComponent(cameraTracking).lastClick = 0;
		}
		Time.timeScale = newScale;
	}
}

function Start(){
	var stats = GameObject.Find("statsHolder");
	if(stats != null){
		transferStats(stats.GetComponent(alterTime));
	}
	vectorsToPercent();
}	

function vectorsToPercent(){
	position = vector2ToScreenPercent(position);
	size = vector2ToScreenPercent(size);
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
	var num : float = scale;
	if(scale > 1){
		num = Mathf.Pow(num,positivePower);
	}
	if(scale < 1){
		num = Mathf.Pow(num,negativePower);
	}
	if(num == 0){
		num = minScale;
	}
	else if(num < 0.1){
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
	this.minScale = other.minScale;
	this.maxScale = other.maxScale;
	this.sliderScale = other.sliderScale;
	this.position = other.position;
	this.size = other.size;
	this.max = other.max;
	this.min = other.min;
	this.positivePower = other.positivePower;
	this.negativePower = other.negativePower;
	this.textNo = other.textNo;
	this.textOffset = other.textOffset;
	this.textSize = other.textSize;
	this.skin = other.skin;
	this.labelSize = other.labelSize;
	this.timeScale = other.timeScale;
	this.positiveToNegative = other.positiveToNegative;
}