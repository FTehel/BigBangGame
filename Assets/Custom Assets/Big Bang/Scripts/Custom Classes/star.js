var regenSpeed : float = 1;
var supernovaDecrease : float = 0.5;

var supernovaTime : float = 10;
var currentSupernovaTime : float;

var brightness : float = 1;
var minBrightness : float = 0.3;
var maxIntensity : float = 2;
var rangeToSize : float = 10;
var intensityToSize : float = 1;

var firstStar = true;

var currentTimer : float = 0;
var targetTime : float = 1;
var timeMagnitude : float = 1;
var timeIncreasing = true;

var vibrateMagnitude : Vector3 = Vector3(1,0,1);
var currentVibrateOffset = Vector3.zero;
var startVibrateTime : float = 2;
var endVibrateTime : float = 0.1;

var vibrating = false;
var supernovaParticles : Transform[] = new Transform[0];
var supernovaDustPercent : float;

function Awake(){
	currentSupernovaTime = supernovaTime;
	timeMagnitude = startVibrateTime;
}

function Update(){
	updateFunction();
}

function transferStats(other : star){
	regenSpeed = other.regenSpeed;
	supernovaDecrease = other.supernovaDecrease;
	currentSupernovaTime = other.currentSupernovaTime;
	supernovaTime = other.supernovaTime; 
	
	currentTimer = other.currentTimer;
	targetTime = other.targetTime;
	timeMagnitude = other.timeMagnitude;
	timeIncreasing = other.timeIncreasing;
	vibrateMagnitude = other.vibrateMagnitude;
	currentVibrateOffset = other.currentVibrateOffset;
	startVibrateTime = other.startVibrateTime;
	endVibrateTime = other.endVibrateTime;
}

function updateFunction(){
	setFlareBrightness();
	regenSupernovaTime();
	setLightBrightness();
	if(vibrating){
		timer();
	}
	vibrate();
}

function setLightBrightness(){
	var light = GetComponentInChildren(Light);
	light.range = transform.localScale.x*rangeToSize;
	var intensity : float = transform.localScale.x*intensityToSize;
	if(intensity > maxIntensity){
		intensity = maxIntensity;
	}
	light.intensity = intensity;
}

function setFlareBrightness(){
	var flare = GetComponent(LensFlare);
	var newBright = transform.localScale.x*brightness;
	if(newBright < minBrightness){
		newBright = minBrightness;
	}
	//flare.brightness = newBright;
	
}

function reduceSupernovaTime(){
	if(firstStar){
		if(Time.timeScale != 0){
			currentSupernovaTime -= (regenSpeed + supernovaDecrease)*Time.deltaTime/Time.timeScale;
		}
		if(currentSupernovaTime < 0){
			currentSupernovaTime = 0;
		}
	}
}

function regenSupernovaTime(){
	if(firstStar){
		if(currentSupernovaTime < supernovaTime && Time.timeScale != 0){
			currentSupernovaTime += regenSpeed * Time.deltaTime/Time.timeScale;
		}
		if(currentSupernovaTime > supernovaTime){
			currentSupernovaTime = supernovaTime;
		}
	}
}

function changeTimer(){
	if(Time.timeScale != 0){
		if(timeIncreasing){
			currentTimer += Time.deltaTime/Time.timeScale;
		}
		else{
			currentTimer -= Time.deltaTime/Time.timeScale;
		}
	}
}

function switchTimer(){
	if( timeIncreasing){
		timeIncreasing = false;
		targetTime = -timeMagnitude;
	}
	else{
		timeIncreasing = true;
		targetTime = timeMagnitude;
	}
}

function timer(){
	setTargetTime();
	if(currentTimer > targetTime && timeIncreasing){
		switchTimer();
	}
	else if(currentTimer < targetTime && !timeIncreasing){
		switchTimer();
	}
	changeTimer();
} 

function setTargetTime(){
	timeMagnitude = speedPercent();
	 if(timeIncreasing){
		targetTime = timeMagnitude;
	}
	else{
		targetTime = -timeMagnitude;
	}
}

function timePercent(){
	return currentTimer/timeMagnitude;
}

function supernovaPercent(){
	return currentSupernovaTime/supernovaTime;
}

function speedPercent(){
	var range = startVibrateTime - endVibrateTime;
	range = supernovaPercent() * range;
	range += endVibrateTime;
	return range;
}

function vibrate(){
	if(currentSupernovaTime < supernovaTime){
		vibrating = true;
		var amount = (vibrateMagnitude*transform.localScale.x)*timePercent();
		currentVibrateOffset = amount;
	}
	else{
		restoreVibrate();
	}
}

static var timeChanged = false;

function restoreVibrate(){
	if(vibrating){
		if(!timeChanged && timeIncreasing && timePercent() > 0){
			timeIncreasing = false;
			timeChanged = true;
		}
		if(!timeChanged && !timeIncreasing && timePercent() < 0){
			timeIncreasing = true;
			timeChanged = true;
		}
		if(timeChanged && timeIncreasing && timePercent() > 0){
			currentTimer = 0;
			vibrating = false;
		}
		if(timeChanged && !timeIncreasing && timePercent() < 0){
			currentTimer = 0; 
			vibrating = false;
		}
		currentVibrateOffset = (vibrateMagnitude*transform.localScale.x)*timePercent();
	}
}

