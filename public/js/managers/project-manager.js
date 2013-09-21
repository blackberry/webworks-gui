/** PROJECT MANAGER 
 This JS file contains all methods related to management of the project such as 
 create, build, sign and install.
 **/

/*Vars*/
var cmd;
var path;
var args;

 /**
 * This method get the project name and creates a project 
 * into workspace defined by user.
 **/
function createProject(projectName, projectPath) {
    /*var cmd = "cmd=create",
        url;

    switch (arguments.length) {
    case 1:
        url = cmd + "&args=" + name;
        break;

    case 2:
        url = cmd + "&args=" + path + "+app.id." + name + "+" + name;;
        break;
    }
    */   
    
    cmd = "create";    
    args = projectPath + "+app.id." + projectName + "+" + projectName;
    
    requestServer("global", path, cmd, args);
};


/**
 * This method creates and install Debug Token in the device, 
 * builds a debug release of the project and install the debug 
 * release on the device.
 **/
function debugProjectWithDebugToken(projectPath, devicepass, keystorepass){
    // Aways is debugged with webinspector. I do know how to remove webinspector mode
    
    cmd = "run";
    path = projectPath;
    args = "--device --devicepass " + devicepass + " --keystorepass " + keystorepass;
    
    requestServer("project", path, cmd, args);
};

/**
 * This method builds a debug release of the project and 
 * install it on the device
 **/
function debugProjectWithoutDebugToken(projectPath, target, devicepass){
    // Aways is debugged with webinspector. I do know how to remove webinspector mode
    
    cmd = "run";
    path = projectPath;
    
    if(target == "device"){
        args = "--device --devicepass " + devicepass;
    }
    
    if(target == "emulator"){
        args = "--emulator";
    }

    requestServer("project",path, cmd, args);
};

/**
 * This method builds an application, creating a signed bar file.
 The bar file created by this method can be uploaded on the store
 **/
function buildProjectRelease(projectPath, keystorePass){
    cmd = "build";
    path = projectPath;
    
    args = "--release -k " + keystorePass;
    
    requestServer("project", path, cmd, args);
};

/**
 * This method installs the relase bar file of a project on a connected device
 **/
function installProjectReleaseOnDevice(projectPath, devicePass){
    cmd = "run";
    path = projectPath;
    
    args = "--device" + " --devicepass " + devicePass + " --no-build";
    
    requestServer("project", path, cmd, args);
};


/**
 * This method installs the relase bar file of a project on a running emulator
 **/
function installProjectReleaseOnEmulator(projectPath){
    cmd = "run";
    path = projectPath;
    
    args = "--emulator" + " --no-build";
    
    requestServer("project", path, cmd, args);
};








