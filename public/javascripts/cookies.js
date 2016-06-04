function createCookie(name,value,days) {
 var expires;
  if (days) {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    expires = "; expires="+date.toUTCString();
  }
  else expires = "";
  document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

var cName1 = readCookie('cName1');
var cScore1 = Math.round(parseInt(readCookie('cScore1'))) || 0;
var cName2 = readCookie('cName2');
var cScore2 = Math.round(parseInt(readCookie('cScore2'))) || 0;
var cName3 = readCookie('cName3');
var cScore3 = Math.round(parseInt(readCookie('cScore3'))) || 0;
var cNotSet = true;

function setHighscore(score,p1,p2){
  if((score > cScore1) && cNotSet === true){
    cName3 = cName2;
    cScore3 = cScore2;

    cScore2 = cName1;
    cScore2 = cScore1;

    cName1 = p1 + " & " + p2;
    cScore1 = Math.round(score);

    createCookie('cName1', cName1, 7);
    createCookie('cScore1', cScore1, 7);
    createCookie('cName2', cName2, 7);
    createCookie('cScore2', cScore2, 7);
    createCookie('cName3', cName3, 7);
    createCookie('cScore3', cScore3, 7);
    cNotSet = false;
    console.log("set 1");

  }else if((score > cScore2) && cNotSet === true){

    cName3 = cName2;
    cScore3 = cScore2;

    cName2 = p1 + " & " + p2;
    cScore2 = Math.round(score);

    createCookie('cName2', cName2, 7);
    createCookie('cScore2', cScore2, 7);
    createCookie('cName3', cName3, 7);
    createCookie('cScore3', cScore3, 7);


    cNotSet = false;
    console.log("set 2");
  }else if((score > cScore3) && cNotSet === true){

    cName3 = p1 + " & " + p2;
    cScore3 = Math.round(score);

    createCookie('cName3', cName3, 7);
    createCookie('cScore3', cScore3, 7);
    cNotSet = false;
    console.log("set 3");
  }else{
    console.log("set nothing");
  }
  cNotSet = true;
}
function setHighscoreList() {
	$('#highscoreOneNames').html("1. " + cName1);
	$('#highscoreOneScore').html(cScore1);

	$('#highscoreTwoNames').html("2. " + cName2);
	$('#highscoreTwoScore').html(cScore2);

	$('#highscoreThreeNames').html("3. " + cName3);
	$('#highscoreThreeScore').html(cScore3);
}
