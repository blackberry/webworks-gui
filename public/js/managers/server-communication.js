/**
 * This method makes the request to the NodeJS server
 **/
function requestServer(flag, path, cmd, args){
    
    switch(flag){
        // Build, Run, Clean, Init and Version
        case "project":
             var request = "/project?path="+path+"&cmd="+cmd+"&args="+args;   
        break;
        // Create, Init, Target, Check_reqs
        case "global":
            var request = "/global?path="+path+"&cmd="+cmd+"&args="+args;    
        break;
        
        case "project_config":
             var request = "/project_config?path="+path+"&cmd="+cmd+"&args="+args;    
        break;
        
        case "config":
             var request = "/config?path="+path+"&cmd="+cmd+"&args="+args;    
        break;
    }
    
    $.get(request, function(data) { log(data); });
}

var serverReturn;
var serverReturnEvent;

serverReturnEvent = new Event("SERVER_RETURN_ON");

// Writes the log of the server into a TextField with "console" id
function log(data) {
    
    var box = $("#console"),
    nl = box.val().length > 0 ? "\n" : "",
    
    val = typeof data === "string" ? data : JSON.stringify(data);
    serverReturn = val;
    json = data;
    document.dispatchEvent(serverReturnEvent);

    box.val(box.val() + nl + val);
  
    
};