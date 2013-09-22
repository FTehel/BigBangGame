var singularityDistance : float = 100;
var singularity : Transform;

var particles : Transform;

static var particleObject : Transform;

var particleSize : float = 0.9;
var particleDistance : float = 10;

static var particleFinalPos : Vector3;

var expansionSpeed : float = 100;
var expansionRatio : float = 1.5;

var maxExpansion : float = 100000;

var vibrateMagnitude : float = 100;

var singularityCreated : boolean = false;
var expansionStarted : boolean = false;
var expansionReady : boolean = false;
var clickReady = false;

var singularityObject : Transform;

var destroyed = false;

var cameraRotation : float = 20;
var rotationSpeed : float = 5;
var playing = false;

var startSkybox : Material;

function Update(){
	if(!destroyed && playing){
		updateFunction();
	}
}

function updateFunction () {
	if(!Input.GetMouseButton(0)){
		clickReady = true;
	}
	if(clickReady){
		if(Input.GetMouseButton(0) && expansionReady){
			particleObject = Instantiate(particles,singularityObject.position,Quaternion.identity);
			expansionStarted = true;
			expansionReady = false;
		}
		if(expansionStarted){
			expand();
		}
		var notAllowedArea1 : Rect;
		var menu = GetComponent(menu);
		var tutPos = Screen.width - menu.tutorialButtonSize.x - menu.tutorialButtonPos.x;
		notAllowedArea1 = Rect(tutPos, menu.tutorialButtonPos.y, menu.tutorialButtonSize.x, menu.tutorialButtonSize.y);
		if(!notAllowedArea1.Contains(Vector2(Input.mousePosition.x,Screen.height-Input.mousePosition.y))){
			if(Input.GetMouseButton(0) && !singularityCreated){
				setTutorial2();
				singularityCreated = true;
				var createPos : Vector3 = camera.ScreenToWorldPoint(Vector3(Input.mousePosition.x,Input.mousePosition.y,singularityDistance));
				var particleFinalPos = camera.ScreenToWorldPoint(Vector3(Input.mousePosition.x,Input.mousePosition.y,particleDistance));
				singularityObject = Instantiate(singularity,createPos,Quaternion.identity);
			}
		}
		if(!Input.GetMouseButton(0) && singularityCreated && !expansionStarted){
			expansionReady = true;
		}
		
		if(singularityCreated && getScaleProgress() == 1 && rotateCamera()){
			destroyThis();
		}
	}
}

function reset(){
	clickReady = false;
	singularityCreated = false;
	expansionReady = false;
	expansionStarted = false;
	if(singularityObject != null){
		Destroy(singularityObject.gameObject);
	}
	playing = true;
	destroyed = false;
	setScene();
	camera.transform.rotation = Quaternion.identity;
	vScale = Vector2.zero;
	vPosition = Vector2.zero;
	setTutorial1();
}

function setScene(){
	var skybox = transform.GetComponent(Skybox);
	skybox.material = startSkybox;
	setTutorial1();
}

function expand(){
	if(singularityObject != null && singularityObject.localScale.x < maxExpansion*expansionRatio){
		particleObject.localScale.x = singularityObject.localScale.x*particleSize;
		particleObject.localScale.z = singularityObject.localScale.x*particleSize;
		singularityObject.localScale.x += singularityObject.localScale.x*expansionSpeed*Time.deltaTime*expansionRatio;
		vibrate();
	}
	if(singularityObject != null && singularityObject.localScale.y < maxExpansion*expansionRatio){
		particleObject.localScale.y = singularityObject.localScale.y*particleSize;
		singularityObject.localScale.y += singularityObject.localScale.y*expansionSpeed*Time.deltaTime;
	}
}

function getScaleProgress(){
	if(singularityObject != null){
		var percent : float = singularityObject.localScale.x/maxExpansion;
		if(percent > 1){
			percent = 1;
		}
		return percent;
	}
	return 0;
}

var vScale : Vector2;
var vPosition : Vector2;

function vibrate(){
	/*vScale = Vector2(Random.Range(-vibrateMagnitude,vibrateMagnitude),Random.Range(-vibrateMagnitude,vibrateMagnitude));
	vPosition = Vector2(Random.Range(-vibrateMagnitude,vibrateMagnitude),Random.Range(-vibrateMagnitude,vibrateMagnitude));
	vScale *= singularityObject.localScale.magnitude;
	vPosition *= singularityObject.localScale.magnitude;*/

	singularityObject.position.x -= vPosition.x;
	singularityObject.position.y -= vPosition.y;
	singularityObject.localScale.x -= vScale.x;
	singularityObject.localScale.y -= vScale.y;

	vScale = Vector2(Random.Range(-vibrateMagnitude,vibrateMagnitude),Random.Range(-vibrateMagnitude,vibrateMagnitude));
	vPosition = Vector2(Random.Range(-vibrateMagnitude,vibrateMagnitude),Random.Range(-vibrateMagnitude,vibrateMagnitude));
	vScale *= singularityObject.localScale.magnitude;
	vPosition *= singularityObject.localScale.magnitude;
	
	singularityObject.position.x += vPosition.x;
	singularityObject.position.y += vPosition.y;
	singularityObject.localScale.x += vScale.x;
	singularityObject.localScale.y += vScale.y;
}

function destroyThis(){
	Debug.Log("Destroying");
	destroyed = true;
	Destroy(singularityObject.gameObject);
	Destroy(particleObject.gameObject);
	
	newGame();
}

function newGame(){
	var nextGame = transform.GetComponent(createFirstStars);
	nextGame.playing = true;
	nextGame.setScene();
}

function rotateCamera(){
	transform.rotation.eulerAngles = Vector3.Lerp(transform.rotation.eulerAngles, Vector3(cameraRotation,0,0),rotationSpeed * Time.deltaTime);
	if(transform.rotation.eulerAngles == Vector3(cameraRotation,0,0)){
		return true;
	}
}

function setTutorial1(){
	var tutorial = GetComponent(menu);
	var str = "In the beginning there was nothing. No time, space or energy, until a singularity appeared. " +
	"Click anywhere once to create a singularity";
	tutorial.setTutorial(str);
}

function setTutorial2(){
	var tutorial = GetComponent(menu);
	var str = "The singularity rapidly expanded, creating what we now call The Big Bang. Click anywhere again to make the singularity expand.";
	tutorial.setTutorial(str);
}