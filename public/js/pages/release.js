$(document).ready(function(){
    
    /*Device Radio OnClick Listener*/
    $("#content").on("click", "#deviceRadio", function(){
        $("#content").find("#devicepassDivRelease").show("fast");
    });
    
    /*Simulator Radio OnClick Listener*/
    $("#content").on("click", "#emulatorRadio", function(){
        $("#content").find("#devicepassDivRelease").hide("fast");
    });
    
    
    /*Release Button OnClick Listener*/
    $("#content").on("click", "#releaseButton", function(){
        alert("Building a new release ...");
        $("#content").find("#console").html("Loading...");
        /*Building a new release for both of targets(device and simulator)*/
         // using getProjectPath() and getKeystorePass() temp methods from debug.js
         buildProjectRelease(activeProjectPath, "blackberry");
    });
    
    /*Install Button OnClick Listener*/
    $("#content").on("click", "#installButton", function(){
        
        /*Checking the selected target*/
        
        if($("#content").find("#deviceRadio").is(":checked")){
            alert("Installing release on device ...");
            // using getProjectPath() and getDevicePass() temp methods from debug.js
            installProjectReleaseOnDevice(activeProjectPath, $("#content").find("#devicepassRelease").val());
           //alert($("#content").find("#devicepassRelease").val());
        }
        if($("#content").find("#emulatorRadio").is(":checked")){
            alert("Installing release on simulator ...");
            // using getProjectPath() and getDevicePass() temp methods from debug.js
            installProjectReleaseOnEmulator(activeProjectPath, $("#content").find("#devicepassRelease").val());
        }
    });
});