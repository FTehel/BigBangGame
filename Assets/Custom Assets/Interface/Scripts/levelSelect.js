var menuSize : Vector2 = Vector2(40,100);
var menuPos : Vector2 = Vector2(10,100);
var buttonHeight : float = 20;
var buttonMargin : float = 5;
var scrollWidth : float = 20;
var levelButtons : levelButton[] = new levelButton[0];
var playing = true;


var skin : GUISkin;
static var scrollPosition = Vector2.zero;

function Start(){
	vectorsToPercent();
}

function vectorsToPercent(){
	menuSize = vector2ToScreenPercent(menuSize);
	menuPos = vector2ToScreenPercent(menuPos);
	buttonHeight = floatToHeightPercent(buttonHeight);
	scrollWidth = floatToWidthPercent(scrollWidth);
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
		GUIFunction();
	}
}

function GUIFunction(){
	//menuPos.y = menuSize.y;
	//var newSize = Vector2(menuSize.x,Screen.height - (menuSize.y*2));
	var newSize = menuSize;
	scrollPosition = GUI.BeginScrollView(Rect(menuPos.x,menuPos.y,newSize.x + scrollWidth,newSize.y),
	scrollPosition,Rect(menuPos.x,menuPos.y,menuSize.x,buttonMargin+((buttonHeight+buttonMargin)*levelButtons.length)));
	var buttonPos = Vector2(menuPos.x + buttonMargin,menuPos.y + buttonMargin);
	var buttonSize = Vector2(menuSize.x - (buttonMargin*2),buttonHeight);
	var buttonOffset = buttonHeight + buttonMargin;
	for(var i = 0;i < levelButtons.length;i++){
		var buttonPos2 = Vector2(buttonPos.x,buttonPos.y+(buttonOffset*i));
		if(GUI.Button(Rect(buttonPos2.x,buttonPos2.y,buttonSize.x,buttonSize.y), levelButtons[i].title)){
			GetComponent(copyRightNotice).playing = false;
			if(levelButtons[i].title == "New Game"){
				transform.GetComponent(createUniverse).playing = true;
				transform.GetComponent(createUniverse).setScene();
				transform.GetComponent(menu).playing = true;
				this.playing = false;
			}
			else{
				if(levelButtons[i].level != ""){
					Application.LoadLevel(levelButtons[i].level);
				}
			}
		}
	}
	GUI.EndScrollView();
}