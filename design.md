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


Other
===========================
- lib/ui/main.js
    - Initialize everything

- public/js/webworks-gui.js
    - Single JS file that contains all JS files for the web page
    - Created by running "grunt" command in build instructions
