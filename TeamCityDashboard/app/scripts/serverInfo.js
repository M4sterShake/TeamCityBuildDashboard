ServerInfo = function () {
  this.Server = null;
  this.teamCityApi = null;

  var that = this;
  var serverInfoRootId = "#server-settings";

  this.Show = function(containerId) {
    if ($(serverInfoRootId).length) {
      $(serverInfoRootId).remove();
    }

    var template = Handlebars.templates['ServerInfoTemplate'](that.Server);
    $(containerId).append(template);
    $(serverInfoRootId).fadeIn();
    displayServerProjects("#projects-and-builds-list-container");
  }

  function displayServerProjects(targetElement) {
    that.teamCityApi.GetProjectsForServer(that.Server, function (err, projects) {
      if (err) {
        displayError("failed to send get request to " + that.server.url);
        return;
      }
      $targetElement = $(targetElement);
      $targetElement.html("");
      displayProjectTree(projects, null, $targetElement);
    });
  }

  function displayProjectTree(projects, rootProject, targetElement) {
    if (projects != null) {
      if (rootProject == null) { rootProject = "_Root" }
      for (var i = 0; i < projects.length; i++) {
        if (projects[i].id !== "_Root" && projects[i].parentProjectId === rootProject) {
          if (targetElement.children("ul").length === 0) {
            targetElement.append("<ul class='project-list'></ul>");
          }
          var targetList = targetElement.children("ul.project-list");
          var projectListItem = $("<li class='closed'><i class='fa fa-cubes'></i>" + projects[i].name + "</li>");
          projectListItem.on("click", function (e) {
            $(this).toggleClass("closed");
          });
          targetList.append(projectListItem);
          displayProjectTree(projects, projects[i].id, targetList);
        }
      }
    }
  }
}

ServerInfo.init = function (server, teamCityApi) {
  var serverInfo = new ServerInfo();
  serverInfo.Server = server;
  serverInfo.teamCityApi = teamCityApi;
  return serverInfo;
};