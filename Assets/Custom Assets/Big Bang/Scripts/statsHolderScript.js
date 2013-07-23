/*
Fraser Tehel 2013
*/

var stats : formationDust = new formationDust();

function Awake () {
	findStats();
	DontDestroyOnLoad(transform.gameObject);
}

function findStats(){
	var main = Camera.main;
	if(main.GetComponent(createFirstStars) != null){
		var other = main.GetComponent(createFirstStars);
		stats.transferStats(other.firstStarFormation);
	}
	if(main.GetComponent(alterTime) != null){
		var other2 = main.GetComponent(alterTime);
		GetComponent(alterTime).transferStats(other2);
	}
	if(main.GetComponent(menu) != null){
		var other3 = main.GetComponent(menu);
		GetComponent(menu).transferStats(other3);
	}
	if(main.GetComponent(createSolarSystem) != null){
		var other4 = main.GetComponent(createSolarSystem);
		GetComponent(createSolarSystem).transferStats(other4);
	}
}