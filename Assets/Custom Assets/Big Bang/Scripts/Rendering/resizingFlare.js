var texture : Texture;
var oldTexture : Texture;
var textureFading = false;
var currentLayer : int = 0;
var size : float;
var xPercentOfY : float;
static var height : float;
var alphaBlend = false;
var layers : flareLayer[] = new flareLayer[0];
var crossFadeSize : float = 5;
var fade : Vector2;
var lastPos : Vector2;
var lastPos2 : Vector2;
var trail : float = 0.5;
var lastSize : Vector2 = Vector2.zero;
var lastSize2 : Vector2 = Vector2.zero;
var minSize : float;
var width : float;
var fadeMod : float = 1.1;

function OnGUI(){
	getTexture(textureSize().y);
	getFade(textureSize().y);
	if(textureFading){
		var oldColour : Color = GUI.color;
		GUI.color = Color( 1, 1, 1,1);
		if(texture != null){
			//GUI.color = Color( 1, 1, 1,fade.x*trail);
			//GUI.DrawTexture( drawRectangleLastPos2(), texture, ScaleMode.StretchToFill, alphaBlend);
			GUI.color = Color( 1, 1, 1,fade.x*fadeMod);
			//GUI.DrawTexture( drawRectangleLastPos(), texture, ScaleMode.StretchToFill, alphaBlend);
			GUI.DrawTexture( drawRectangle(), texture, ScaleMode.StretchToFill, alphaBlend);
		}
		GUI.color = Color( 1, 1, 1,fade.y);
		if(oldTexture != null){
			//GUI.DrawTexture( drawRectangleLastPos2(), oldTexture, ScaleMode.StretchToFill, alphaBlend);
			GUI.color = Color( 1, 1, 1,fade.y*fadeMod);
			//GUI.DrawTexture( drawRectangleLastPos(), oldTexture, ScaleMode.StretchToFill, alphaBlend);
			GUI.DrawTexture( drawRectangle(), oldTexture, ScaleMode.StretchToFill, alphaBlend);
		}
		GUI.color = oldColour;
	}
	else if (texture != null){
		var oldColour2 = GUI.color;
		oldColour2 = GUI.color = Color( 1, 1, 1, 1);
		//GUI.DrawTexture( drawRectangleLastPos2(), texture, ScaleMode.StretchToFill, alphaBlend);
		//GUI.color = Color( 1, 1, 1,trail);
		//GUI.DrawTexture( drawRectangleLastPos(), texture, ScaleMode.StretchToFill, alphaBlend);
		GUI.DrawTexture( drawRectangle(), texture, ScaleMode.StretchToFill, alphaBlend);
		
		GUI.color = oldColour2;
	}
}

function getXPercent(){
	var h = texture.height;
	xPercentOfY = texture.width/h;
}

function Start(){
	getXPercent();
	orderLayers();
	oldTexture = texture;
}

function textureSize(){
	var right = transform.position + sphereBound();
	var left = transform.position - sphereBound();
	var rScreen = Camera.main.WorldToScreenPoint(right);
	var lScreen = Camera.main.WorldToScreenPoint(left);
	var x = Mathf.Abs(rScreen.x - lScreen.x);
	if(x < minSize){
		x = minSize;
	}
	var y = x/xPercentOfY;
	var returnVector = Vector2(x,y)*size;
	if(rScreen.z > 0 && lScreen.z > 0){
		if(x <= Screen.width){
			return returnVector;
		}
		return Vector2.zero;
	}
	else{
		return Vector2.zero;
	}
}

function drawRectangle(){
	var texSize = textureSize();
	lastSize = texSize;
	getTexture(texSize.y);
	getFade(texSize.y);
	var screenPos = screenPos(texSize.y);
	lastPos = screenPos;
	var returnRect = Rect(screenPos.x,screenPos.y,texSize.x,texSize.y);
	return returnRect;
}

function drawRectangleLastPos(){
	var texSize = lastSize;
	lastSize2 = texSize;
	getTexture(texSize.y);
	getFade(texSize.y);
	var screenPos = lastPos;
	lastPos2 = lastPos;
	var returnRect = Rect(screenPos.x,screenPos.y,texSize.x,texSize.y);
	return returnRect;
}

function drawRectangleLastPos2(){
	var texSize = lastSize2;
	var screenPos = lastPos2;
	var returnRect = Rect(screenPos.x,screenPos.y,texSize.x,texSize.y);
	return returnRect;
}

function screenPos(y : float){
	var vector = Camera.main.WorldToScreenPoint(transform.position);
	return Vector2(vector.x - ((xPercentOfY * y)/2),Screen.height-(vector.y + (y/2)));
}

function sphereBound(){
	var s = transform.localScale.x/2;
	var toCamera = Camera.main.transform.position - transform.position;
	var right = Vector3(-toCamera.z,0,toCamera.x);
	return right.normalized*s;
}

function rayToCamera(){
	var toCameraVector = Camera.main.transform.position - transform.position;
	if(Physics.Raycast(transform.position,toCameraVector,toCameraVector.magnitude)){
		return true;
	}
	return false;
}

function getTexture(size : float){
	for(var i = layers.length-1;i >= 0;i--){
		if(layers[i].size <= size){
			if(currentLayer != i){
				oldTexture = texture;
				texture = layers[i].texture;
				currentLayer = i;
			}
			i = -1;
		}
	}
}

function orderLayers(){
	for(var i = 0;i < layers.length;i++){
		for(var j = i+1;j < layers.length;j++){
			if(layers[i].size >= layers[j].size){
				var temp : flareLayer = layers[i];
				layers[i] = layers[j];
				layers[j] = temp;
			}
		}
	}
}

/*function getFade(size : float){
	var startSize = layers[currentLayer].size;
	if(size <= startSize * crossFadeSize){
		fade = Vector2(1,0);
		textureFading = false;
	}
	else{
		var sizePercent = (startSize - size)/(startSize - (startSize * crossFadeSize));
		fade = Vector2(1 - sizePercent,sizePercent);
		Debug.Log(sizePercent + " " + startSize + " " + size + " ");
		textureFading = true;
	}
}*/

function getFade(size : float){
	var startSize = layers[currentLayer].size;
	var max = sizeUp() - (sizeUp() * crossFadeSize);
	var min = startSize + (startSize * crossFadeSize);
	var sizePercent : float = -1;
	var range : float = -1;
	width = size;
	if(size >= max){
		textureFading = true;
		range = (sizeUp() * crossFadeSize) + (sizeUp() * crossFadeSize);
		sizePercent = (size - max)/range;
		fade = Vector2(1 - sizePercent, sizePercent);
		oldTexture = upTexture();
	}
	else if(size <= min){
		textureFading = true;
		range = (startSize * crossFadeSize) + (startSize * crossFadeSize);
		sizePercent = (min-size)/range;
		fade = Vector2(1 - sizePercent, sizePercent);
		oldTexture = downTexture();
	}
	else{
		textureFading = false;
	}
}

function sizeDown(){
	var i = currentLayer - 1 ;
	if(i >= 0){
		return layers[i].size;
	}
	else return -1;
}

function upTexture(){
	var i = currentLayer + 1;
	if(i < layers.length){
		return layers[i].texture;
	}
	return oldTexture;
}

function downTexture(){
	var i = currentLayer - 1 ;
	if(i >= 0){
		return layers[i].texture;
	}
	return null;
}

function sizeUp(){
	var i = currentLayer + 1;
	if(i < layers.length){
		return layers[i].size;
	}
	return 100000;
}

function pointsOnScreen(point1 : Vector2, point2 : Vector2){
	if(!pointOnScreen(point1) && !pointOnScreen(point2)){
		return false;
	}
	return true;
}

function pointsOnScreen(point1 : Vector2, point2 : Vector2, size : float){
	if(!pointOnScreen(point1, size) && !pointOnScreen(point2, size)){
		return false;
	}
	return true;
}

function pointOnScreen(point : Vector2){
	if(point.x > Screen.width || point.x < 0){
		return false;
	}
	if(point.y > Screen.height || point.y < 0){
		return false;
	}
	return true;
}

function pointOnScreen(point : Vector3, size : float){
	if(point.x > Screen.width + (size/2) || point.x < 0 - (size/2)){
		return false;
	}
	if(point.y > Screen.height + (size/2) || point.y < 0 - (size/2)){
		return false;
	}
	return true;
}

function rectangleOnScreen(rectangle : Rect){
	if(rectangle.xMax < 0 || rectangle.xMin > Screen.width){
		return false;
	}
	if(rectangle.yMax < 0 || rectangle.yMin > Screen.height){
		return false;
	}
	return true;
}

/*function pointOnScreen(point : Vector3){
	var cameraPos = Camera.main.transform.position;
	var cameraDirection = Camera.main.transform.TransformDirection(Vector3.forward);
	var vectorToPoint = point - cameraPos;
	vectorToPoint = vectorToPoint.normalized;
	cameraDirection = cameraDirection.normalized;
	if(Vector3.Dot(cameraDirection,vectorToPoint) <= 0){
		Debug.Log("False " + Vector3.Dot(cameraDirection,vectorToPoint));
		return false;
	}
	Debug.Log("True " + Vector3.Dot(cameraDirection,vectorToPoint));
	return true;
}*/

function pointsOnScreen(point1 : Vector3, point2 : Vector3){
	if(pointOnScreen(point1) && pointOnScreen(point2)){
		return true;
	}
	return false;
}

function pointOnScreen(point : Vector3){
	var cameraPos = Camera.main.transform.position;
	if(point.y < cameraPos.y){
		return true;
	}
	return false;
}

