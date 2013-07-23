var copyRightSize = Vector2(200,40);
var copyRightPos = Vector2(200,20);
var playing = true;
var skin : GUISkin;

function copyRightNotice(){
	var Copyright = "\00A9";
	GUI.Box(Rect( copyRightPos.x, copyRightPos.y, copyRightSize.x, copyRightSize.y),"© Fraser Tehel 2013");
}

function OnGUI(){
	if(playing){
		GUI.skin = skin;
		copyRightNotice();
	}
}