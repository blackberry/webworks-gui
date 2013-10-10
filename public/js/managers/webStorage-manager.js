/** XML MANAGER
 * This method returns the config.xml file 
 **/


/**
 * This method returns the associated path by a given id 
 **/

function getPathById(id){
    _getAtributeById(id,'project')
};

function getPasswordById(id){
    _getAtributeById(id,'certificate')
};

function _getAtributeById(id,type){ 
      
  itemString = localStorage.getItem(type+'s.xml')
  parser=new DOMParser();
  xmlDoc=parser.parseFromString(itemString,"text/xml");
  
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
 * This method get a xml with the project information
 **/
function getProjectsXML(){
    return _getSomeXML('projects');
};

function getCertificatesXML(){
    
};


function _getSomeXML(type){  
    return localStorage.projects;
};



/**
 * This method insert a project into projectsXML. Where ID is the project name
 **/

function addProjectInProjectsXML(id, path){
    

    itemString = localStorage.getItem('projects')
    if(itemString==null) {
        itemString = "<projects> </projects>"
    }
    parser=new DOMParser();
    xmlDoc=parser.parseFromString(itemString,"text/xml");
    
    //console.log(xmlDoc)
    
    newel=xmlDoc.createElement("project");
    
    newel.setAttribute("id", id);
    newel.setAttribute("path", path);
    args=xmlDoc.getElementsByTagName("projects")[0];
    args.appendChild(newel)
    

    string = new XMLSerializer().serializeToString(args);
    //requestServer2(string,'addProject')
    localStorage.setItem('projects',string)
    
};

function addCertificateInCertificatesXML(id, password){
    
    itemString = localStorage.getItem('certificates')
    if(itemString==null) {
        itemString = "<certificates> </certificates>"
    }
    parser=new DOMParser();
    xmlDoc=parser.parseFromString(itemString,"text/xml");
    
    
    newel=xmlDoc.createElement("certificate");
    
    newel.setAttribute("id", id);
    newel.setAttribute("password", password);
    args=xmlDoc.getElementsByTagName("certificates")[0];
    args.appendChild(newel)
    

    string = new XMLSerializer().serializeToString(args);
    localStorage.setItem('certificates',string)
};




/**
 * This method remove a project from projectsXML
 **/
function removeProjectInProjectsXML(id){

    itemString = localStorage.getItem('projects')
    parser=new DOMParser();
    xmlDoc=parser.parseFromString(itemString,"text/xml");
    
    
    elements = xmlDoc.getElementsByTagName('project');
    args=xmlDoc.getElementsByTagName("projects")[0];
    

    for(var i=0;i<elements.length;i++) {
        if(elements[i].attributes[0].nodeValue==id){
            args.removeChild(elements[i])
        }
    }
    string = new XMLSerializer().serializeToString(args);
    localStorage.setItem('projects',string)
};

/**
 * This method remove a certificate from certificatesXML
 **/
function removeCertificateInCertificatesXML(id){
    itemString = localStorage.getItem('certificates')
    parser=new DOMParser();
    xmlDoc=parser.parseFromString(itemString,"text/xml");
    
    elements = xmlDoc.getElementsByTagName('certificate');
    args=xmlDoc.getElementsByTagName("certificates")[0];
    

    for(var i=0;i<elements.length;i++) {
        if(elements[i].attributes[0].nodeValue==id){
            args.removeChild(elements[i])
        }
    }
    string = new XMLSerializer().serializeToString(args);
    localStorage.setItem('certificates',string)
};

function getActiveProjectId() {
        return localStorage.getItem('activeProjectId')
}

function setActiveProjectId(id) {
    localStorage.setItem('activeProjectId',id)
}

function getActiveProjectPath() {
        return localStorage.getItem('activeProjectPath')
}

function setActiveProjectPath(path) {
    localStorage.setItem('activeProjectPath',path)
}

function getActiveCertificateId() {
        return localStorage.getItem('activeCertificateId')
}

function setActiveCertificateId(id) {
    localStorage.setItem('activeCertificateId',id)
}

function getActiveCertificatePassword() {
        return localStorage.getItem('activeCertificatePassword')
}

function setActiveCertificatePassword(password) {
    localStorage.setItem('activeCertificatePassword',password)
}

function addProjectInProjectsXMLAndSetActive(id, path){

    addProjectInProjectsXML(id, path)
    localStorage.setItem('activeProjectId',id)
    localStorage.setItem('activeProjectPath',path)
    
};

