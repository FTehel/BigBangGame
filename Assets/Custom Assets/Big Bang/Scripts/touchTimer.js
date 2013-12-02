var isThisEnabled = true;
var enableAttempted = false;
var restTime : float = 0.1;
var lastTime : float = 0.0;

function isEnabled(){
	if(Time.time > (lastTime+(restTime*Time.timeScale))){
		return true;
	}
	return false;
}

function disable(){
	lastTime = Time.time;
}

function transferStats(other : touchTimer){
	restTime = other.restTime;
}