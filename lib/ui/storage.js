var storage = {};

function readProjects() {
    return localStorage.projects ? JSON.parse(localStorage.projects) : {};
}

function saveProjects(projects) {
    localStorage.projects = JSON.stringify(projects);
}

storage = {
    readProjects: readProjects,
    saveProjects: saveProjects
};

module.exports = storage;
