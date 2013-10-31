Models
===========================
- Project
    - Basic object
    - Properties:
        - name: String
        - location: String


Collections
===========================
- ProjectListCollection
    - List of Project models


Views
===========================
- ProjectListView
    - Displays the project list on the left side
    - Controls html element #list-projects
    - Based on ProjectListCollection
    - When the ProjectListCollection changes, the project list will update

- ProjectCreateView
    - Displays the form for creating a new project
    - Controls html element #content
    - Based on ProjectListCollection
    - When a new project is created, the ProjectListCollection is updated

- ProjectInfoView
    - Displays the project information
    - Controls html element #content
    - Uses /public/pages/project_config.html as a template
    - Based on Project from the collection

- ProjectBuildView
    - Displays the build page
    - Controls html element #content
    - Uses /public/pages/builder.html as a template
    - Based on Project from the collection

Other
===========================
- lib/ui/main.js
    - Initialize everything

- lib/ui/server.js
    - Used to communicate with node server

- public/js/webworks-gui.js
    - Single JS file that contains all JS files for the web page
    - Created by running "grunt" command in build instructions
