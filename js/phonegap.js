function init() {
    document.addEventListener("deviceready", onDR, false);
} 
function onDR(){
    document.addEventListener("backbutton", backKeyDown, true);
    //boot your app...
}
function backKeyDown() { 
    // do something here if you wish
    return false;
}