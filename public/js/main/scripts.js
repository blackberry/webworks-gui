/* WEBWORKS GUI TOOL @GUSTAVOCOSTAW*/

var activeProjectPath;
var activeProjectId;
var projectItemClicked;
var pageSelected;

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
                    $.get("/" + $(this).data("page"), function (data) {
                        $("#content").html(data);
                        xmlLoadConfig();
                    })
                }
            })
            //tooltips 

            $("body").on("mouseover",".tooltipstart",function(){
                $(this).find("div").show("fast");
            });
            $("body").on("mouseout",".tooltipstart",function(){
                $(this).find("div").hide();
            });

            //OPEN FIRST TIME
            if(localStorage.getItem("firstime") == "false"){
                $(".title-item-menu").eq(3).click();
                localStorage.setItem("firstime","true");
            }
            else {
                $(".title-item-menu").eq(0).click();
            }

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
                    $.get("/info.html", function (data) {
                        
                        $("#content").html(data);
                        
                        /* WAITING CONFIG.XML IMPLEMENT
                        function updateInfo(){
                            $("#appName").val($(dataConfigXML.configFile).find("name").text());
                            $("#author").val($(dataConfigXML.configFile).find("author").text());
                            $("#appdesc").val($(dataConfigXML.configFile).find("description").text());
                            $("#iconimage").val($(dataConfigXML.configFile).find("icon").attr("src"));
                            $("#splash").val($(dataConfigXML.configFile).find("splash").attr("src"));
                        }
                        */ 
                        
                    });
                }
                projectItemClicked = $(this).attr("data-path");
            })

        }

        function events() {
            //plugin btn ajax
            $("body").on("click", ".list-settings-project li a", function () {
                var clickedElement = $(this);
                if(pageSelected){
                    pageSelected.removeClass("actived");
                }
                $.get("/" + $(this).data("page"), function (data) {
                    $("#content").html(data);
                    pageSelected = clickedElement;
                    pageSelected.addClass("actived");
                });
            })

            //new project event
            $(".new-project").click(function () {
                //alert("event project")
                $.get("/" + $(this).data("page"), function (data) {
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
                                        $("#list-projects").html($("#list-projects").html() + '<li class="project-list" data-path="' + txtProjectPath + '"><a href="#" data-page="info.html" class="project-name-info">' + projectName + '</a><div class="delete-btn tooltipstart" data-projectid="id" data-page="project_delete.html"><div class="mytooltip">click here to delete your project</div></div></li>');
                                        $("#list-projects").html($("#list-projects").html() + '<ul class="list-settings-project" style="display:block;"><li><a href="#" class="project-button" data-page="plugins.html">Plugins</a></li><li><a href="#" class="project-button" data-page="debug.html">Debug</a></li><li><a href="#" class="project-button" data-page="release.html">Release</a></li></ul>');

                                        $.get("/info.html", function (data) {


                                            activeProjectPath = txtProjectPath;
                                            alert("activeProjectPath: " + activeProjectPath);
                                            $("#content").off("click", "#btnCreateProject", sendProject);
                                            $("#content").html(data);
                                           // updateInfo()
                                            
                                            
                                            /* WAITING CONFIG.XML IMPLEMENT
                                            function updateInfo(){
                                                
                                                $("#appName").val($(dataConfigXML.configFile).find("name").text());
                                                $("#author").val($(dataConfigXML.configFile).find("author").text());
                                                $("#appdesc").val($(dataConfigXML.configFile).find("description").text());
                                                $("#iconimage").val($(dataConfigXML.configFile).find("icon").attr("src"));
                                                $("#splash").val($(dataConfigXML.configFile).find("splash").attr("src"));
                                                console.log($("#appName").val());
                                
                                            };
                                            */
                                                        
                                            
                                        })
                                    }
                                    //error
                                    else {
                                        alert("error");
                                    }
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
                $.get("/" + $(this).data("page"), function (data) {
                    $("#content").html(data);

                });
            });
            //delete event
            $("body").on("click", ".delete-btn", function () {


            });


        }

        //verify if projects exist

        function projectExist(projectName) {
            var x,
                proj = getProjectsXML();
            if (proj) {
                x = proj.getElementsByTagName("project");
                for (i = 0; i < x.length; ++i) {
                    if (x[i].attributes[0].nodeValue == projectName) {
                        return true;
                    }
                }
            }
            return false;
        }



        startTool();

    }

    WebWorksTool = new WebWorksTool();
})
