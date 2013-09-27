/* WEBWORKS GUI TOOL @GUSTAVOCOSTAW*/

var activeProjectPath;
var activeProjectId;
var projectItemClicked;

$(document).ready(function () {


    var WebWorksTool = function () {

        function startTool() {

            //efects
            effects();
            //events
            events();
        }


        function effects() {

            //variaveis pra gravar objetos
            var objAtualPrincipal, objAtualSub;



            //evento nos botões principais
            $("body").on("click", ".title-item-menu", function () {
                //verifica se já esta escondido
                if ($(this).next("ul").css("display") == "none") {
                    //verifica se existir o obj some
                    if (objAtualPrincipal) {

                        objAtualPrincipal.removeClass("title-item-menu-selected");
                        objAtualPrincipal.next("ul").slideToggle("slow");
                    }
                    //substitui novo obj
                    objAtualPrincipal = $(this);
                    objAtualPrincipal.addClass("title-item-menu-selected");
                    //mostra obj atual
                    objAtualPrincipal.next("ul").slideDown("slow");
                    //load info
                    $.get("pages/" + $(this).data("page"), function (data) {
                        $("#content").html(data);
                        xmlLoadConfig();
                    })
                }
            })
            //tooltips 

            $("body").on("mouseover",".tooltipstart",function(){
                $(this).find("div").show("fast");
            })
            $("body").on("mouseout",".tooltipstart",function(){
                $(this).find("div").hide();
            })
            //Forçar Click
            $(".title-item-menu").eq(0).click();

            //evento nos botoes projetos
            $("body").on("click", ".project-list", function () {
                if(projectItemClicked === $(this).attr("data-path")){
                    ajaxPage();
                }

                //verifica se já esta escondido
                if ($(this).next("ul").css("display") == "none") {
                    //verifica se existir o obj some
                    if (objAtualSub) {
                        objAtualSub.next("ul").slideToggle("slow");
                    }
                    //substitui novo obj
                    objAtualSub = $(this);
                    //mostra obj atual
                    objAtualSub.next("ul").slideDown("slow");

                    activeProjectPath = $(this).data("path");
                    alert("activeProjectPath: " + activeProjectPath);
                    ajaxPage();
                }

                //load info
                function ajaxPage(){
                    $.get("pages/info.html", function (data) {
                        $("#content").html(data);
                        document.addEventListener("CONFIG_XML_LOADED",updateInfo);
                        getConfigXml(activeProjectPath);
                        
                        
                        function updateInfo(){
                            $("#appName").val($(dataConfigXML.configFile).find("name").text());
                            $("#author").val($(dataConfigXML.configFile).find("author").text());
                            $("#appdesc").val($(dataConfigXML.configFile).find("description").text());
                            $("#iconimage").val($(dataConfigXML.configFile).find("icon").attr("src"));
                            $("#splash").val($(dataConfigXML.configFile).find("splash").attr("src"));
                            
                            document.removeEventListener("CONFIG_XML_LOADED", updateInfo);
            
                        }
                        
                    });
                }
                projectItemClicked = $(this).attr("data-path");
            })

        }

        //verify if projects exist

        function projectExist(projectName) {

            x = getProjectsXML().getElementsByTagName("project");

            for (i = 0; i < x.length; ++i) {
                if (x[i].attributes[0].nodeValue == projectName) {

                    return true;
                }
            }
            return false;
        }

        function events() {
            //plugin btn ajax
            $("body").on("click", ".project-button", function () {
                $.get("pages/" + $(this).data("page"), function (data) {
                    $("#content").html(data);
                });
            })

            //new project event
            $(".new-project").click(function () {
                //alert("event project")
                $.get("pages/" + $(this).data("page"), function (data) {
                    //$.get("pages/"+$(this).data("page"),function(data){
                    $("#content").html(data);

                    $("#content").on("click", "#btnCreateProject", sendProject);

                    function sendProject() {

                        //get values btn
                        var projectName = $("#txtProjectName").val();
                        var txtProjectPath = $("#txtProjectPath").val();

                       
                        //verifico se tesdm val
                        if (projectName && txtProjectPath) {
                            
                            var existProject = projectExist(projectName);
                            if (!existProject) {
                                 $("#content").html("loading...");
                                //create the project
                                createProject(projectName, txtProjectPath);

                                //listener
                                document.addEventListener("SERVER_RETURN_ON", serverReturnHandler);
                                
                        
                                


                                function serverReturnHandler() {

                                    //json
                                    var response = serverReturn;

                                    //sucess
                                    console.log(serverReturn)
                                    if (response.slice(11, 15) == 'true') {

                                        //add project in xml
                                        addProjectInProjectsXMLAndSetActive(projectName, txtProjectPath);
                                        

                                        $(".list-settings-project").hide();

                                        //add project in accordeon
                                        $("#list-projects").html($("#list-projects").html() + '<li class="project-list" data-path="' + txtProjectPath + '"><a href="#" data-page="info.html" class="project-name-info">' + projectName + '</a><div class="delete-btn tooltipstart" data-projectid="'+project.attr("id")+'" data-page="project_delete.html"><div class="mytooltip">click here to delete your project</div></div></li>');
                                        $("#list-projects").html($("#list-projects").html() + '<ul class="list-settings-project" style="display:block;"><li><a href="#" class="project-button" data-page="plugins.html">Plugins</a></li><li><a href="#" class="project-button" data-page="debug.html">Debug</a></li><li><a href="#" class="project-button" data-page="release.html">Release</a></li></ul>');

                                        $.get("pages/info.html", function (data) {
                                            document.addEventListener("CONFIG_XML_LOADED",updateInfo);
                                            getConfigXml(txtProjectPath);

                                            activeProjectPath = txtProjectPath;
                                            alert("activeProjectPath: " + activeProjectPath);
                                            $("#content").off("click", "#btnCreateProject", sendProject);
                                            $("#content").html(data);
                                           // updateInfo()
                                            
                                            
                                            
                                            function updateInfo(){
                                                console.log($(dataConfigXML.configFile).find("name").text());
                                                $("#appName").val($(dataConfigXML.configFile).find("name").text());
                                                $("#author").val($(dataConfigXML.configFile).find("author").text());
                                                $("#appdesc").val($(dataConfigXML.configFile).find("description").text());
                                                $("#iconimage").val($(dataConfigXML.configFile).find("icon").attr("src"));
                                                $("#splash").val($(dataConfigXML.configFile).find("splash").attr("src"));
                                                console.log($("#appName").val());
                                                
                                                document.removeEventListener("CONFIG_XML_LOADED", updateInfo);
                                
                                            };
                                                        
                                            
                                        })
                                    }
                                    //error
                                    else {
                                        alert("fail")
                                    }
                                    //remove event
                                    document.removeEventListener("SERVER_RETURN_ON", serverReturnHandler);
                                }
                            } else if (existProject) {
                                alert("This project name is already being used. Please, provide other name of the project");
                            } else {
                                alert("Please, write all inputs");
                            }
                        }
                    }

                });
            })
            //import event
            $(".import-btn").click(function () {
                $.get("pages/" + $(this).data("page"), function (data) {
                    $("#content").html(data);

                });
            });
            //delete event
            $("body").on("click", ".delete-btn", function () {
                if (confirm("Do you realy want to remove this project?")) {
                    $(this).parent().next(".list-settings-project").hide("slow", function () {
                        $(this).css("display", "none");
                        $(this).remove();
                    });
                    $(this).parent().hide("slow");
                    
                    removeProjectInProjectsXML($(this).attr('data-projectid'));
                }

            });


        }



        startTool();

    }

    WebWorksTool = new WebWorksTool();
})