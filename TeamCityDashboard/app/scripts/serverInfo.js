ServerInfo = function () {
  this.Server = null;
  this.teamCityApi = null;

  var that = this,
    serverInfoRootId = "#server-settings",
    $serverInfoElement = null;

  this.Show = function(containerId) {
    if ($(serverInfoRootId).length) {
      $(serverInfoRootId).remove();
    }

    var template = Handlebars.templates['ServerInfoTemplate'](that.Server);
    $serverInfoElement = $(template);
    $(containerId).append($serverInfoElement);
    initEventHandlers();
    displayServerProjects("#projects-and-builds-list-container");
  }

  function initEventHandlers() {
    $serverInfoElement.find("#update-server-form").validate({ submitHandler: updateServerSubmitHandler });
  }

  function updateServerSubmitHandler(form) {
    
  }

  function displayServerProjects(targetElement) {
    var $targetElement = $(targetElement);
    $("<div class='la-ball-scale-ripple-multiple'><div></div><div></div><div></div></div>").insertBefore($targetElement);
    that.teamCityApi.GetProjectsForServer(that.Server, function (err, projects) {
      $targetElement.parent().find(".la-ball-scale-ripple-multiple").remove();
      if (err) {
        displayError("failed to send get request to " + that.server.url);
        return;
      }
      
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
          projectListItem.on("click", projectListItemEventHandler);
          targetList.append(projectListItem);
          displayProjectTree(projects, projects[i].id, targetList);
        }
      }
    }
  }

  function projectListItemEventHandler(e) {
    $(this).toggleClass("closed");
    var $projectListItem = $(e.target).is("li") ? $(e.target) : $(e.target).parent("li");
    var projectName = $projectListItem.text();
    that.teamCityApi.GetBuildsForProject(that.Server, projectName, function (err, builds) {
      if (builds != null && builds.length > 0) {
        var $projectList = $projectListItem.parent("ul");
        $projectList.find('.build-list').remove();
        $("<ul class='build-list'><ul>").insertAfter($projectListItem);
        for (var i = 0; i < builds.length; i++) {
          $projectList.find(".build-list").append("<li class='build-list-item'><i class='fa fa-cube'></i>" + builds[i].name + "</li>");
        }
      }
    });
  }
}

ServerInfo.init = function (server, teamCityApi) {
  var serverInfo = new ServerInfo();
  serverInfo.Server = server;
  serverInfo.teamCityApi = teamCityApi;
  return serverInfo;
};