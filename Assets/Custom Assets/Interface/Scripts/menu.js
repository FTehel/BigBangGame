var skin : GUISkin;

var position : Vector2 = Vector2(20,90);
var menuButtonSize = Vector2(30,20);
var otherButtonSize = Vector2(40,20);
var margin : float = 5;
var menuShowing = false;
var shopShowing = false;
var playing = false;
var shopScrollPosition : Vector2 = Vector2.zero;

var tutorialMenuSize = Vector2(300,150);
var tutorialMenuPos = Vector2(450,100);

var tutorialButtonSize = Vector2(50,50);
var tutorialButtonPos = Vector2(20,20);

var shopMenuSize = Vector2(80,10);
var shopMenuPosition : float = 10;
var shopScrollBarHeight : float = 2;
var shopButtonSize : Vector2;

static var tutorialString : String;
static var tutorialShowing = false;

var shopItems : shopItem[] = new shopItem[0];
var imageDraging : Texture;
var isImageDraging : boolean = false;
var itemBuying : shopItem;

var lastTouchPos : Vector2;

var android : boolean = false;

function Start(){
	var other = GameObject.Find("statsHolder");
	if(other!=null){
		transferStats(other.GetComponent(menu));
	}
	turnVectorsToPercents();
	orderShopItems();
}

function orderShopItems(){
	for(var i = 0;i < shopItems.length;i++){
		for(var j = i+1;j < shopItems.length;j++){
			if(shopItems[i].price >= shopItems[j].price){
				var temp : shopItem = shopItems[i];
				shopItems[i] = shopItems[j];
				shopItems[j] = temp;
			}
		}
	}
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

function turnVectorsToPercents(){
	position = vector2ToScreenPercent(position);
	menuButtonSize = vector2ToScreenPercent(menuButtonSize);
	otherButtonSize = vector2ToScreenPercent(otherButtonSize);
	tutorialMenuSize = vector2ToScreenPercent(tutorialMenuSize);
	tutorialMenuPos = vector2ToScreenPercent(tutorialMenuPos);
	tutorialButtonSize = vector2ToScreenPercent(tutorialButtonSize);
	tutorialButtonPos = vector2ToScreenPercent(tutorialButtonPos);
	shopMenuSize = vector2ToScreenPercent(shopMenuSize);
	shopScrollBarHeight = floatToHeightPercent(shopScrollBarHeight);
	shopMenuPosition = floatToWidthPercent(shopMenuPosition);
}

function newGame(){
	if(GetComponent(createFirstStars) != null && GetComponent(createFirstStars).playing){
		newCreateFirstStars();
	}
	
	else{
		var stats = GameObject.Find("statsHolder");
		Destroy(stats);
		Application.LoadLevel("bigBang");
	}
	/*else if(GetComponent(createSolarSystem) != null && GetComponent(createSolarSystem).playing){
		if(GetComponent(GenerateSolarSystem) != null){
			newGenerateSolarSystem();
		}
		else{
			newCreateSolarSystem();
		}
	} */ 
}

function menuMenu(){
	 var levelSelect = GetComponent(levelSelect);
	 levelSelect.playing = true;
	 newGame();
}

function newCreateFirstStars(){
	GetComponent(createFirstStars).reset();
	GetComponent(createFirstStars).playing = false;
	GetComponent(createUniverse).reset();
	GetComponent(createUniverse).setScene();
}

function newCreateSolarSystem(){
	GetComponent(createSolarSystem).reset();
}

function newGenerateSolarSystem(){
	GetComponent(createSolarSystem).reset();
	GetComponent(GenerateSolarSystem).startFunction();
}

function OnGUI(){
	if(playing){
		GUIFunction();
	}
}

function GUIFunction(){
	GUI.skin = skin;
	var posY = Screen.height - position.y;
	if(GUI.Button(Rect(position.x,posY,menuButtonSize.x,menuButtonSize.y), "Menu")){
		if(menuShowing){
			menuShowing = false;
		}
		else{
			menuShowing = true;
		}
	}
	var tutPos = Screen.width - tutorialButtonSize.x - tutorialButtonPos.x;
	if(GUI.Button(Rect(tutPos,tutorialButtonPos.y,tutorialButtonSize.x,tutorialButtonSize.y), "Help")){
		if(tutorialShowing){
			tutorialShowing = false;
		}
		else{
			tutorialShowing = true;
		}
	}
	if(tutorialShowing){
		displayTutorial();
	}
	if(menuShowing){
		popUpMenu();
	}
	if(shopShowing){
		displayShop();
	}
	if(imageDraging != null){
		///GUI.DrawTexture(Rect(60,60,50,50),imageDraging, ScaleMode.StretchToFill);
	}
	if(!android){
		getImageDrag();
	}
	else{
		getImageDragAndroid();
	}
}

function displayShop(){
	var offset = 0.0;
	var scrollLength = margin + ((shopMenuSize.y - margin) * shopItems.length);
	var posY = Screen.height - position.y - menuButtonSize.y;
	var start = margin;
	var shopMenuWidth = shopMenuSize.x;
	shopButtonSize = Vector2(shopMenuSize.y - margin - margin,shopMenuSize.y - margin - margin);
	if(shopMenuWidth > scrollLength){
		shopMenuWidth = scrollLength;
	}
	shopScrollPosition = GUI.BeginScrollView(Rect(shopMenuPosition, posY, shopMenuWidth, shopMenuSize.y + shopScrollBarHeight), shopScrollPosition,
	Rect(0, 0, scrollLength, shopMenuSize.y),false,false);
	
	for(var i = 0;i < shopItems.length;i++){
		offset = i * (shopMenuSize.y - margin);
		if(GUI.RepeatButton(Rect(start + offset,margin,shopButtonSize.x,shopButtonSize.x), shopItems[i].texture)){
			buyItem(shopItems[i]);
			isImageDraging = true;
		}
	}
	
	GUI.EndScrollView();
}

function buyItem(item : shopItem){
	//Debug.Log("Button Pressed");
	imageDraging = item.texture;
	itemBuying = item;
}

function dragImage(){
	drawImage(imageDraging);
	Time.timeScale = 0;
}

function getImageDragAndroid(){
	/*if(!isImageDraging && Input.touches.Length == 1){
		isImageDraging = true;
	}*/
	if(isImageDraging && Input.touches.Length == 1){
		dragImage();
		lastTouchPos = Input.touches[0].position;
	}
	if(isImageDraging && Input.touches.Length != 1){
		isImageDraging = false;
		imageDraging = null;
		createObject(lastTouchPos);
		GetComponent(touchTimer).disable();
	}
}

function getImageDrag(){
	/*if(!isImageDraging && Input.GetMouseButton(0)){
		isImageDraging = true;
	}*/
	if(isImageDraging && Input.GetMouseButton(0)){
		dragImage();
	}
	if(isImageDraging && !Input.GetMouseButton(0)){
		isImageDraging = false;
		imageDraging = null;
		createObject(Input.mousePosition);
	}
}

function createObject(vector : Vector2){
	var solarSystem = Camera.main.transform.GetComponent(formationDust);
	if(solarSystem != null && solarSystem.playing){
		solarSystem.createFormation(vector, itemBuying.item);
	}
}

function drawImage(image : Texture){
	//if(image!= null){
		//var position = Input.touches[0].position;
		var position : Vector2 = Input.mousePosition;
		position.x -= shopButtonSize.y/2;
		position.y += shopButtonSize.y/2;
		GUI.DrawTexture(Rect(position.x,Screen.height - position.y,shopButtonSize.x,shopButtonSize.x),image, ScaleMode.StretchToFill);
	//}
}

function popUpMenu(){
	var offset = 0.0;
	var start = position.x + menuButtonSize.x + margin;
	var posY = Screen.height - position.y;
	
	if(GUI.Button(Rect(start + offset,posY,otherButtonSize.x,otherButtonSize.y), "Main Menu")){
		newGame();
	} 
	offset += otherButtonSize.x + margin;
	
	if(GUI.Button(Rect(start + offset, posY, otherButtonSize.x,otherButtonSize.y), "Shop")){
		if(shopShowing){
			shopShowing = false;
		}
		else{
			shopShowing = true;
		}
	}
}



function transferStats(other : menu){
	this.shopMenuSize = other.shopMenuSize;
	this.shopMenuPosition = other.shopMenuPosition;
	this.shopScrollBarHeight = other.shopScrollBarHeight;
	this.skin = other.skin;
	this.position = other.position;
	this.menuButtonSize = other.menuButtonSize;
	this.otherButtonSize = other.otherButtonSize;
	this.margin = other.margin;

	this.tutorialMenuSize = other.tutorialMenuSize;
	this.tutorialMenuPos = other.tutorialMenuPos;
	
	this.tutorialButtonSize = other.tutorialButtonSize;
	this.tutorialButtonPos = other.tutorialButtonPos;
	this.tutorialString = other.tutorialString;
	this.shopItems = other.shopItems;
	this.android = other.android;
}

function displayTutorial(){
	GUI.Box(Rect(Screen.width - tutorialButtonPos.x - tutorialButtonSize.x - tutorialMenuSize.x - tutorialMenuPos.x,tutorialMenuPos.y + 
	tutorialButtonPos.y,tutorialMenuSize.x,tutorialMenuSize.y),tutorialString);
}

function setTutorial(str : String){
	tutorialString = str;
	tutorialShowing = true;
}