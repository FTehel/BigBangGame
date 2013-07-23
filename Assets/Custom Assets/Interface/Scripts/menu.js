var skin : GUISkin;

var position : Vector2 = Vector2(20,90);
var menuButtonSize = Vector2(30,20);
var otherButtonSize = Vector2(40,20);
var textBoxSize = Vector2(70,20);
var margin : float = 5;
var labelHeight : float = 30;
var helpButtonWidth : float = 30;

var gravityStrength : float = 1;
var distanceEffect : float = 1;
var massEffect : float = 1;
var mouseDrag : float = 1;

static var currentGravityStrength : float = 1;
static var currentDistanceEffect : float = 1;
static var currentMassEffect : float = 1;
static var currentMouseDrag : float = 1;

var gravityHelpShowing = false;
var distanceHelpShowing = false;
var massHelpShowing = false;
var mouseHelpShowing = false;

var menuShowing = false;
var playing = false;

var helpMenuSize = Vector2(300,150);
var helpMenuPos = Vector2(100,100);

var tutorialMenuSize = Vector2(300,150);
var tutorialMenuPos = Vector2(450,100);

var tutorialButtonSize = Vector2(50,50);
var tutorialButtonPos = Vector2(20,20);

static var tutorialString : String;
static var tutorialShowing = false;

function Start(){
	var other = GameObject.Find("statsHolder");
	if(other!=null){
		transferStats(other.GetComponent(menu));
		currentMouseDrag = mouseDrag;
		currentMassEffect = massEffect;
		currentDistanceEffect = distanceEffect;
		currentGravityStrength = gravityStrength;
	}
}

function Update(){
	changeSettings();
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
}

var gravString : String = "";
var distanceString : String = "";
var massString : String = "";
var mouseDragString : String = "";

function popUpMenu(){
	var offset = otherButtonSize.x + margin;
	var start = position.x + menuButtonSize.x + margin;
	var posY = Screen.height - position.y;
	
	if(GUI.Button(Rect(start,posY,otherButtonSize.x,otherButtonSize.y), "New Game")){
		newGame();
	}
	
	if(GUI.Button(Rect(start + offset,posY,otherButtonSize.x,otherButtonSize.y), "Main Menu")){
		newGame();
	} 
	offset += otherButtonSize.x + margin;
	
	
	gravString = GUI.TextField(Rect(start + offset, posY, textBoxSize.x, textBoxSize.y), gravString,5);
	GUI.Box(Rect(start + offset, posY-labelHeight, textBoxSize.x - helpButtonWidth, labelHeight), "Gravity Strength");
	if(GUI.Button(Rect(start + offset+textBoxSize.x - helpButtonWidth, posY-labelHeight, helpButtonWidth, labelHeight), "?")){
		 if(!gravityHelpShowing){
			gravityHelpShowing = true;
		}
		else{
			gravityHelpShowing = false;
		}
		 massHelpShowing = false;
		 distanceHelpShowing = false;
		 mouseHelpShowing = false;
	}
	offset += textBoxSize.x + margin;
	distanceString = GUI.TextField(Rect(start + offset, posY, textBoxSize.x, textBoxSize.y), distanceString,5);
	GUI.Box(Rect(start + offset, posY-labelHeight, textBoxSize.x - helpButtonWidth, labelHeight), "Distance Effect");
	if(GUI.Button(Rect(start + offset+textBoxSize.x - helpButtonWidth, posY-labelHeight, helpButtonWidth, labelHeight), "?")){
		 gravityHelpShowing = false;
		 massHelpShowing = false;
		if(!distanceHelpShowing){
			distanceHelpShowing = true;
		}
		else{
			distanceHelpShowing = false;
		}
		 mouseHelpShowing = false;
	}
	offset += textBoxSize.x + margin;
	massString = GUI.TextField(Rect(start + offset, posY, textBoxSize.x, textBoxSize.y), massString,5);
	GUI.Box(Rect(start + offset, posY-labelHeight, textBoxSize.x - helpButtonWidth, labelHeight), "Mass Effect");
	if(GUI.Button(Rect(start + offset+textBoxSize.x - helpButtonWidth, posY-labelHeight, helpButtonWidth, labelHeight), "?")){
		gravityHelpShowing = false;
		if(!massHelpShowing){
			massHelpShowing = true;
		}
		else{
			massHelpShowing = false;
		}
		distanceHelpShowing = false;
		mouseHelpShowing = false;
	}
	offset += textBoxSize.x + margin;
	mouseDragString = GUI.TextField(Rect(start + offset, posY, textBoxSize.x, textBoxSize.y), mouseDragString,5);
	GUI.Box(Rect(start + offset, posY-labelHeight, textBoxSize.x - helpButtonWidth, labelHeight), "Drag Strength");
	if(GUI.Button(Rect(start + offset+textBoxSize.x - helpButtonWidth, posY-labelHeight, helpButtonWidth, labelHeight), "?")){
		if(!mouseHelpShowing){
			mouseHelpShowing = true;
		}
		else{
			mouseHelpShowing = false;
		}
		gravityHelpShowing = false;
		massHelpShowing = false;
		distanceHelpShowing = false;
		
	}
	
	var gravFloat : float;
	var distanceFloat : float;
	var massFloat : float;
	var dragFloat : float;
	
	if(float.TryParse(gravString, gravFloat) != null && gravString != ""){
		float.TryParse(gravString, gravFloat);
		gravityStrength = gravFloat;
	}
	if(float.TryParse(distanceString, distanceFloat) != null && distanceString != ""){
		float.TryParse(distanceString, distanceFloat);
		distanceEffect = distanceFloat;
	}
	if(float.TryParse(massString, massFloat) != null && massString != ""){
		float.TryParse(massString, massFloat); 
		massEffect = massFloat;
	}
	if(float.TryParse(mouseDragString, dragFloat) != null && mouseDragString != ""){
		float.TryParse(mouseDragString, dragFloat); 
		mouseDrag = dragFloat;
	}
	
	if(gravityHelpShowing){
		gravityHelp();
	}
	if(mouseHelpShowing){
		mouseHelp();
	}
	if( distanceHelpShowing){
		distanceHelp();
	}
	if( massHelpShowing){
		massHelp();
	}
}

function changeSettings(){
	var solarSystem = GetComponent(createSolarSystem);
	var firstStars = GetComponent(createFirstStars);
	if(currentDistanceEffect != distanceEffect){
		currentDistanceEffect = distanceEffect;
		if(solarSystem != null){
			solarSystem.solarSystemDust.gravityDistance = distanceEffect;
		}
		if(firstStars != null){
			firstStars.firstStarFormation.gravityDistance = distanceEffect;
		}
	}
	if(currentMassEffect != massEffect){
		currentMassEffect = massEffect;
		if(solarSystem != null){
			solarSystem.solarSystemDust.gravityMass = massEffect;
		}
		if(firstStars != null){
			firstStars.firstStarFormation.gravityMass = massEffect;
		}
	}
	if(currentGravityStrength != gravityStrength){
		currentGravityStrength = gravityStrength;
		if(solarSystem != null){
			solarSystem.solarSystemDust.gravityStrength = gravityStrength;
		}
		if(firstStars != null){
			firstStars.firstStarFormation.gravityStrength = gravityStrength;
		}
	}
	if(currentMouseDrag != mouseDrag){
		currentMouseDrag = mouseDrag;
		if(solarSystem != null){
			var newFormationDrag = mouseDrag;
			var difference = newFormationDrag/solarSystem.solarSystemDust.formationDrag;
			var newParticleDrag = solarSystem.solarSystemDust.particleDrag*difference;
			solarSystem.solarSystemDust.formationDrag = mouseDrag;
			solarSystem.solarSystemDust.particleDrag = newParticleDrag;
		}
		if(firstStars != null){
			var newFormationDrag2 = mouseDrag;
			var difference2 = newFormationDrag2/firstStars.firstStarFormation.formationDrag;
			var newParticleDrag2 = firstStars.firstStarFormation.particleDrag*difference2;
			firstStars.firstStarFormation.formationDrag = mouseDrag;
			firstStars.firstStarFormation.particleDrag = newParticleDrag2;
		}
	}
}

function transferStats(other : menu){
	this.skin = other.skin;
	this.position = other.position;
	this.menuButtonSize = other.menuButtonSize;
	this.otherButtonSize = other.otherButtonSize;
	this.textBoxSize = other.textBoxSize;
	this.margin = other.margin;

	this.gravityStrength = other.gravityStrength;
	this.distanceEffect = other.distanceEffect;
	this.massEffect = other.massEffect;
	this.mouseDrag = other.mouseDrag;
	this.labelHeight = other.labelHeight;
	
	this.helpMenuSize = other.helpMenuSize;
	this.helpMenuPos = other.helpMenuPos;
	this.tutorialMenuSize = other.tutorialMenuSize;
	this.tutorialMenuPos = other.tutorialMenuPos;
	
	this.tutorialButtonSize = other.tutorialButtonSize;
	this.tutorialButtonPos = other.tutorialButtonPos;
	this.tutorialString = other.tutorialString;
}

function helpMenu(text : String){
	 GUI.Box(Rect(helpMenuPos.x,helpMenuPos.y, helpMenuSize.x, helpMenuSize.y), text);
}

function gravityHelp(){
	helpMenu("Gravity Strength:\n\nGravity strength multiplies the overall effect of gravity on everything. Eg. Gravity Strength of 10" +
	" means 10 times the strength of gravity.");
}

function distanceHelp(){
	helpMenu("Distance Effect:\n\nDistance effect changes the effect distance has in calculating an object's gravity. Distance Effect" +
	" is exponential. Eg. If the distance between two objects is D the distance in the calculations will be D to the power of Distance" +
	" Effect.");
}

function massHelp(){
	helpMenu("Mass Effect:\n\nMass Effect is a trilogy of space faring RPGs/Hot alien love simulators. It's also the effect mass has in calculating an object's "+
	"gravity. Mass Effect is exponential. Eg. If the mass of an object is M in the calculations the mass will be M to the power of "+
	"Mass Effect.");
}

function mouseHelp(){
	helpMenu("Mouse Drag:\n\nMouse drag effects the mouse sensitivity when dragging an object. A low Mouse Drag will make an object lag "+
	"behind the cursor. A high Mouse Drag will make the object stick to the cursor");
}

function displayTutorial(){
	GUI.Box(Rect(Screen.width - tutorialButtonPos.x - tutorialButtonSize.x - tutorialMenuSize.x - tutorialMenuPos.x,tutorialMenuPos.y + 
	tutorialButtonPos.y,tutorialMenuSize.x,tutorialMenuSize.y),tutorialString);
}