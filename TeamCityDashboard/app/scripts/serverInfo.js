ServerInfo = function () {
  this.Server = null;
  this.dataStore = null;
  this.TeamCityApi = null;
  this.ServerListPage = null;

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
    var server = {
      originalDisplayName: $(form).find(".tc-original-display-name").val(),
      displayName: $(form).find(".tc-display-name").val(),
      url: $(form).find(".tc-url").val(),
      username: $(form).find(".tc-user").val(),
      password: $(form).find(".tc-pass").val()
    }

    that.DataStore.UpdateServer(server, function(err) {
      if (err) {
        //show error
        return;
      }

      $("#tc-display-name-header-text").text(server.displayName);
      that.ServerListPage.Show();
      //show success
    });
  }

  function displayServerProjects(targetElement) {
    var $targetElement = $(targetElement);
    $("<div class='la-ball-scale-ripple-multiple'><div></div><div></div><div></div></div>").insertBefore($targetElement);
    that.TeamCityApi.GetProjectsForServer(that.Server, function (err, projects) {
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
    that.TeamCityApi.GetBuildsForProject(that.Server, projectName, function (err, builds) {
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

ServerInfo.init = function (server, dataStore, teamCityApi, serverListPage) {
  var serverInfo = new ServerInfo();
  serverInfo.Server = server;
  serverInfo.DataStore = dataStore;
  serverInfo.TeamCityApi = teamCityApi;
  serverInfo.ServerListPage = serverListPage;
  return serverInfo;
};