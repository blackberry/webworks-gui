$(document).ready(function(){
    
    
    /*DebugOnDeviceButton OnClick Listener*/
    //$("#content").on("click", "#debugOnDeviceButton", function(){
        //alert("Debugging on Device...");
        //log("Debbuging project on a connected device...");
        //debugProjectWithoutDebugToken(getProjectPath(), "device", getDevicePass());
    //});

    /* DebugOnEmulatorButton OnClick Listener*/
    //$("#content").on("click", "#debugOnEmulatorButton", function(){
       // log("Debbuging project on a running emulator...");
      //  alert("Debugging on Emulator...");
    //    debugProjectWithoutDebugToken(getProjectPath(), "emulator", null);
    //});
    
    /*Device Radio OnClick Listener*/
    $("#content").on("click", "#deviceRadio", function(){
        $("#content").find("#devicepassDivDebug").show("fast");
    });
    
    /*Simulator Radio OnClick Listener*/
    $("#content").on("click", "#emulatorRadio", function(){
        $("#content").find("#devicepassDivDebug").hide("fast");
    });
    
    
    /*Debug Button OnClick Listener*/
    $("#content").on("click", "#debugButton", function(){
        /*Checking the selected target*/
       // alert($("#content").find("#deviceRadio").is(":checked"));
        if($("#content").find("#deviceRadio").is(":checked")){
            alert("Debugging on device ...");
            // activeProjectPath var from scripts.js
            //alert($("#content").find("#devicepassDebug").val());
            debugProjectWithoutDebugToken(activeProjectPath, "device", $("#content").find("#devicepassDebug").val());
        }
        if($("#content").find("#emulatorRadio").is(":checked")){
            alert("Debugging on simulator ...");
            // activeProjectPath var from scripts.js
            debugProjectWithoutDebugToken(activeProjectPath, "emulator", null);
        }
    });
});

/*Temp function that returns a static path of the current project (On Projects Manager)
function getProjectPath(){
    return "C:\\HelloWorld";
}
*/

/*Temp function that returns a static keystorepass of the activated certificate (On Settings)*/
function getKeystorePass(){
    return "blackberry";
}

/*Temp function that returns a static device pass of the connected device
function getDevicePass(){
    return "442299";
}*/

/*Wating for the server return to analyse and decide what to do*/
document.addEventListener("SERVER_RETURN_ON", serverReturnHandler, false);

/*Function that analyses the return of the server. If 
  a Debug Token does not exists, then this function will
  create and install a new one, before debug the project 
  again
*/
function serverReturnHandler(){
    /* serverReturn is a variable of server-communication.js file */
    var array = serverReturn.match(/no debug token found/g);
    //alert(array);
    /*Analysing*/
    //console.log(array.lengt);
    
    if(array != null){
        if(array.length == 1){
            alert("No Debug Token Found! Creating a new Debug Token and installing on device...")
            //Debbuging project with debugtoken | activeProjecPath from scripts.js | 
            debugProjectWithDebugToken(activeProjectPath, getDevicePass(), getKeystorePass());
        }
    }
    
    
}