/* WEBWORKS GUI TOOL @GUSTAVOCOSTAW*/

function loadMyProjects(){

    console.log(getProjectsXML());
    projects = getProjectsXML();
        $(projects).find('project').each(function(){
            project = $(this);
            $("#list-projects").append('<li class="project-list" data-path="'+project.attr("path")+'"><a href="#" data-page="info.html" class="project-name-info">'+project.attr("id")+'</a><div class="delete-btn tooltipstart" data-projectid="'+project.attr("id")+'" data-page="project_delete.html"><div class="mytooltip">click here to delete your project</div></div></li>');
            $("#list-projects").append('<ul class="list-settings-project"><li><a href="#" class="project-button" data-page="plugins.html">Plugins</a></li><li><a href="#" class="project-button" data-page="debug.html">Debug</a></li><li><a href="#" class="project-button" data-page="release.html">Release</a></li></ul>');
        })      
}
$(document).ready(function(){


    var storageTool = function(){

        function startProjects(){
            
            loadMyProjects();
        }


        startProjects();

    }

    storageTool = new storageTool();
});

//CONFIG.XML WAITING CONFIG.XML IMPLEMENT
/*
function xmlLoadConfig(){
    $.get("public/xml/config.xml",function(data){
        $(data).find('widget').each(function(){
            $("#appName").val($(this).find("name").text());
            $("#author").val($(this).find("author").text());
            $("#appdesc").val($(this).find("description").text());
            $("#iconimage").val($(this).find("icon").attr("src"));
            $("#splash").val($(this).find("splash").attr("src"));
        });
    })
}
*/