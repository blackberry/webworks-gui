/** XML MANAGER
 * This method returns the config.xml file 
 **/


/**
 * This method returns the associated path by a given id 
 **/

var dataConfigXML;

function getPathById(id){
    _getAtributeById(id,'project')
};

function getPasswordById(id){
    _getAtributeById(id,'certificate')
};

function _getAtributeById(id,type){ 
    xhttp=new XMLHttpRequest()
    xhttp.open("GET",'/public/xml/'+ type + 's.xml',false);
    xhttp.send();
    
    xmlDoc=xhttp.responseXML;
    elements = xmlDoc.getElementsByTagName(type);
    args=xmlDoc.getElementsByTagName(type+'s')[0];
    

    for(var i=0;i<elements.length;i++) {
        if(elements[i].attributes[0].nodeValue==id){
            //console.log(elements[i].attributes[1].nodeValue)
            return elements[i].attributes[1].nodeValue
        }
    }
};

/**
 * This method returns the config.xml file 
 **/
function getConfigXml(path){
    var request = "/project_config?path="+path;//+"&cmd="+cmd+"&args="+args;  
        $.get(request, function(data) { 
            configEvent = new Event("CONFIG_XML_LOADED");
            dataConfigXML = data //typeof data === "string" ? data : JSON.stringify(data.configFile);
            document.dispatchEvent(configEvent);
            
        });  
   // setConfigXMLValue('name', 'evil app',path)
};

/**
 * This method writes on config.xml
 **/
function setConfigXMLValue(key, value, path){
    var request = "/project_config?path="+path;//+"&cmd="+cmd+"&args="+args;  
        $.get(request, function(data) { 
            dataConfigXML = data.configFile;
            //console.log(dataConfigXML)
            //$(dataConfigXML).find('widget').each(function(){
            console.log($(dataConfigXML).find(key)[0]);
            $(dataConfigXML).find(key).text(value);
            console.log($(dataConfigXML).find(key)[0]);
            //})
        });
        
};
            


function updateConfigXML(key, value) {
    
    
    
     /*   $.get("data/config.xml",function(data){
        $(data).find('widget').each(function(){
            $("#appName").val($(this).find("name").text());
            $("#author").val($(this).find("author").text());
            $("#appdesc").val($(this).find("description").text());
            $("#iconimage").val($(this).find("icon").attr("src"));
            $("#splash").val($(this).find("splash").attr("src"));
            
            */
}

/**
 * This method get a xml with the project information
 **/
function getProjectsXML(){
    return _getSomeXML('projects');
};

function getCertificatesXML(){
    return _getSomeXML('certificates');
};


function _getSomeXML(type){  
    xmlhttp=new XMLHttpRequest();
        xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            return xmlhttp.responseText;
        }
    }

    xmlhttp.open("GET",'/public/xml/'+type +'.xml',false);
    xmlhttp.send();
    return xmlhttp.responseXML;
};



/**
 * This method insert a project into projectsXML. Where ID is the project name
 **/

function addProjectInProjectsXML(id, path){
    xhttp=new XMLHttpRequest()
    xhttp.open("GET",'/public/xml/projects.xml',false);
    xhttp.send();
    
    xmlDoc=xhttp.responseXML;
    
    //console.log(xmlDoc)
    
    newel=xmlDoc.createElement("project");
    
    newel.setAttribute("id", id);
    newel.setAttribute("path", path);
    args=xmlDoc.getElementsByTagName("projects")[0];
    args.appendChild(newel)
    

    string = new XMLSerializer().serializeToString(args);
    requestServer2(string,'addProject')
    
};

function addCertificateInCertificatesXML(id, password){
    xhttp=new XMLHttpRequest()
    xhttp.open("GET",'/public/xml/certificates.xml',false);
    xhttp.send();
    
    xmlDoc=xhttp.responseXML;
    
    console.log(xmlDoc)
    
    newel=xmlDoc.createElement("certificate");
    
    newel.setAttribute("id", id);
    newel.setAttribute("password", password);
    args=xmlDoc.getElementsByTagName("certificates")[0];
    args.appendChild(newel)
    

    string = new XMLSerializer().serializeToString(args);
    requestServer2(string,'addCertificate')
};





    function requestServer2(args,cmd){
        console.log("args ", args)
        var request = "/xmlManager?cmd="+cmd+"&args="+args;
        $.get(request, function(data) { log(data); });
    };

/**
 * This method remove a project from projectsXML
 **/
function removeProjectInProjectsXML(id){
    xhttp=new XMLHttpRequest()
    xhttp.open("GET",'/public/xml/projects.xml',false);
    xhttp.send();
    
    xmlDoc=xhttp.responseXML;
    console.log(xmlDoc)
    console.log(id)
    elements = xmlDoc.getElementsByTagName('project');
    args=xmlDoc.getElementsByTagName("projects")[0];
    

    for(var i=0;i<elements.length;i++) {
        if(elements[i].attributes[0].nodeValue==id){
            args.removeChild(elements[i])
        }
    }
    string = new XMLSerializer().serializeToString(args);
    requestServer2(string,'removeProject')
};

/**
 * This method remove a certificate from certificatesXML
 **/
function removeCertificateInCertificatesXML(id){
    xhttp=new XMLHttpRequest()
    xhttp.open("GET",'/public/xml/certificates.xml',false);
    xhttp.send();
    
    xmlDoc=xhttp.responseXML;
    console.log(xmlDoc)
    console.log(id)
    elements = xmlDoc.getElementsByTagName('certificate');
    args=xmlDoc.getElementsByTagName("certificates")[0];
    

    for(var i=0;i<elements.length;i++) {
        if(elements[i].attributes[0].nodeValue==id){
            args.removeChild(elements[i])
        }
    }
    string = new XMLSerializer().serializeToString(args);
    requestServer2(string,'removeCertificate')
};

function getActiveProject() {
    console.log("getActiveProject")
    xhttp=new XMLHttpRequest()
    xhttp.open("GET",'/public/xml/projects.xml',false);
    xhttp.send();
    
    xmlDoc=xhttp.responseXML;
    args=xmlDoc.getElementsByTagName("projects")[0];
    var activeProject = new Object();
    activeProject.id = args.attributes[0].nodeValue
    activeProject.path = args.attributes[1].nodeValue
    return activeProject;
}

function setActiveProject(id,path) {
    xhttp=new XMLHttpRequest()
    xhttp.open("GET",'/public/xml/projects.xml',false);
    xhttp.send();
    
    xmlDoc=xhttp.responseXML;
    args=xmlDoc.getElementsByTagName("projects")[0];
    
    args.setAttribute("activeId", id)
    args.setAttribute("activePath", path)
    
    console.log(args)

    string = new XMLSerializer().serializeToString(args);
    requestServer2(string,'setActiveProject')
}

function getActiveCertificate() {
    console.log("getActiveCertificate")
    xhttp=new XMLHttpRequest()
    xhttp.open("GET",'/public/xml/certificates.xml',false);
    xhttp.send();
    
    xmlDoc=xhttp.responseXML;
    args=xmlDoc.getElementsByTagName("certificatess")[0];
    var activeProject = new Object();
    activeProject.id = args.attributes[0].nodeValue
    activeProject.password = args.attributes[1].nodeValue
    return activeProject;
}

function setActiveCertificate(id,password) {
    xhttp=new XMLHttpRequest()
    xhttp.open("GET",'/public/xml/certificates.xml',false);
    xhttp.send();
    
    xmlDoc=xhttp.responseXML;
    args=xmlDoc.getElementsByTagName("certificates")[0];
    
    args.setAttribute("activeId", id)
    args.setAttribute("activePassword", password)
    
    console.log(args)

    string = new XMLSerializer().serializeToString(args);
    requestServer2(string,'setActiveCertificate')
}



function addProjectInProjectsXMLAndSetActive(id, path){
    xhttp=new XMLHttpRequest()
    xhttp.open("GET",'/public/xml/projects.xml',false);
    xhttp.send();
    
    xmlDoc=xhttp.responseXML;
    
    
    newel=xmlDoc.createElement("project");
    
    newel.setAttribute("id", id);
    newel.setAttribute("path", path);


    args=xmlDoc.getElementsByTagName("projects")[0];
    
    args.setAttribute("activeId", id)
    args.setAttribute("activePath", path)
    args.appendChild(newel)
    

    string = new XMLSerializer().serializeToString(args);
    requestServer2(string,'addProject')
    
};

