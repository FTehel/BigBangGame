var textures : planetTexture[] = new planetTexture[0];
var pTexture : planetTexture;
var texture : Texture;
var oldTexture : Texture;
var textureChangePercent : float = 1;
var crossFadeTime : float = 10;
static var currentCrossFade : float = 0;

function Update(){
	fadeTexture();
}

function Start(){
	pickTexture();
}

function pickTexture(){
	var i : int = 0;
	i = Random.Range(0,textures.length-1);
	pTexture = textures[i];
	oldTexture = pTexture.barren;
	texture = pTexture.barren;
	renderer.material.SetTexture("_Tex",pTexture.barren);
	renderer.material.SetTexture("_Tex2",pTexture.barren);
	renderer.material.SetFloat("_Blend",1);
}

function fadeTexture(){
	if(textureChangePercent != 1){
		textureChangePercent = currentCrossFade/crossFadeTime;
		if(textureChangePercent > 1){
			textureChangePercent = 1;
			currentCrossFade = 0;
		}
		setTexture(textureChangePercent);
	}
}

function setTexture(fade : float){
	renderer.material.SetFloat("_Blend",fade);
	if(Time.timeScale != 0){
		currentCrossFade += Time.deltaTime/Time.timeScale;
	}
}

function changeTexture(newTexture : Texture){
	if(textureChangePercent == 1){
		oldTexture = texture;
		texture = newTexture;
		renderer.material.SetTexture("_Tex",oldTexture);
		renderer.material.SetTexture("_Tex2",texture);
		renderer.material.SetFloat("_Blend",0);
		textureChangePercent = 0;
	}
}

function createLife(){
	changeTexture(pTexture.life);
}

function freeze(){
	changeTexture(pTexture.icy);
}

function makeBarren(){
	changeTexture(pTexture.barren);
}