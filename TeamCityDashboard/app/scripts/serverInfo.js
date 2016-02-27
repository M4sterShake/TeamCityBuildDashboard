ServerInfo = function () {
  this.Server = null;
  this.dataStore = null;
  this.TeamCityApi = null;
  this.ServerListPage = null;

  var that = this,
    serverInfoRootId = "#server-settings",
    $serverInfoElement = null;

  this.Show = function(containerId) {
    $serverInfoElement = $(Handlebars.templates['ServerInfoTemplate'](that.Server));
    if ($(serverInfoRootId).length) {
      $(serverInfoRootId).html($serverInfoElement.html());
    } else {
      initEventHandlers();
      $(containerId).append($serverInfoElement);
    }
    displayServerProjects("#projects-and-builds-list-container");
  }

  function initEventHandlers() {
    $serverInfoElement.find("#update-server-form").validate({ submitHandler: updateServerSubmitHandler });
    $("body").on("change", "#projects-and-builds-list-container input[type=checkbox].build, #projects-and-builds-list-container input[type=checkbox].project", projectOrBuildCheckedHandler);
  }

  function updateServerSubmitHandler(form) {
    var server = {
      originalDisplayName: $(form).find(".tc-original-display-name").val(),
      displayName: $(form).find(".tc-display-name").val(),
      url: $(form).find(".tc-url").val(),
      username: $(form).find(".tc-user").val(),
      password: $(form).find(".tc-pass").val()
    }

    that.DataStore.UpdateServer(server, function (err) {
      if (err) {
        displayError("Unable to update server - " + err.message);
        return;
      }

      $("#tc-display-name-header-text").text(server.displayName);
      that.Server.displayName = server.displayName;
      that.Server.url = server.url;
      that.Server.username = server.username;
      that.Server.password = server.password;
      displayServerProjects("#projects-and-builds-list-container");
      that.ServerListPage.Show();
    });
  }

  function projectOrBuildCheckedHandler(e) {
    if ($(this).hasClass("build")) {
      selectBuildProject($(this));
      updateSubscribedProjectsAndBuilds();
    }
    else if ($(this).hasClass("project")) {
      selectProjectBuilds($(this));
      updateSubscribedProjectsAndBuilds();
    }
  }

  function selectProjectBuilds($projectCheckbox) {
    var isChecked = $projectCheckbox.is(":checked"),
      projectId = $projectCheckbox.data("project");
    $projectCheckbox.parents("ul").first().find("ul.build-list[data-project='" + projectId + "']>li input[type=checkbox]").prop("checked", isChecked);
  }

  function selectBuildProject($buildCheckbox) {
    var isChecked = $buildCheckbox.is(":checked"),
      $parentProjectCheckbox = $buildCheckbox.parents("ul.project-list").first().find("li.project-list-item input[data-project='" + $buildCheckbox.data("project") + "']"),
      $siblingBuilds = $buildCheckbox.parents("li.build-list-item").siblings(".build-list-item");
    var siblingsAreChecked = $siblingBuilds.find(".build.tc-item-checkbox:checked").length > 0;
    var parentShouldBeChecked = isChecked || siblingsAreChecked;
    $parentProjectCheckbox.prop("checked", parentShouldBeChecked);
  }

  function updateSubscribedProjectsAndBuilds() {
    var $projectListItems = $("#projects-and-builds-list-container").find(".project-list-item");
    var subscribedProjectsAndBuilds = [];
    $projectListItems.each(function (index, listItem) {
      var $listItem = $(listItem);
      if ($listItem.find(".project.tc-item-checkbox").is(":checked")) {
        var projectId = $listItem.data("project");
        var $projectBuildListItems = $("#projects-and-builds-list-container").find("ul[data-project='" + projectId + "'] .build-list-item");
        var $selectedProjectBuildCheckboxes = $projectBuildListItems.find("input.build[type=checkbox]:checked");
        if ($selectedProjectBuildCheckboxes.length > 0) {
          var subscribedBuildsForThisProject = [];
          $selectedProjectBuildCheckboxes.each(function (buildIndex, buildItem) {
            var $buildItem = $(buildItem);
            subscribedBuildsForThisProject.push({
              id: $buildItem.data("build")
            });
          });

          subscribedProjectsAndBuilds.push({
            id: $listItem.data("project"),
            name: $listItem.text(),
            serverId: that.Server.id,
            builds: subscribedBuildsForThisProject
          });
        }
      }
    });

    that.DataStore.SaveSubscriptionsForServer(that.Server, subscribedProjectsAndBuilds, function(err) {
      if (err) {
        displayError(err.message);
      }
    });
    console.log(subscribedProjectsAndBuilds);
  }

  function displayServerProjects(targetElement) {
    var $targetElement = $(targetElement);
    $targetElement.html("");
    HelperMethods.DisplayLoadingSpinner($targetElement);
    that.TeamCityApi.GetProjectsForServer(that.Server, function (err, projects) {
      HelperMethods.RemoveLoadingSpinner($targetElement);
      $targetElement.parent().find(".la-ball-scale-ripple-multiple").remove();
      if (err) {
        displayError("Failed to connect to " + that.Server.url + " with the given credentials - " + err.message);
        return;
      }
      
      $targetElement.html("");
      displayProjectTree(projects, null, $targetElement);
      HelperMethods.ClearErrors($serverInfoElement);
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
          var projectListItem = $("<li class='closed project-list-item' data-project='" + projects[i].id + "'><i class='fa fa-caret-right'></i>" + getCheckBoxForListItem(projects[i].id, projects[i].id, "project") + projects[i].name + "</li>");
          projectListItem.on("click", projectListItemEventHandler);
          targetList.append(projectListItem);
          displayProjectTree(projects, projects[i].id, targetList);
        }
      }
    }
  }

  function projectListItemEventHandler(e) {
    if (!$(e.target).hasClass("checkbox-label") && !$(e.target).hasClass("tc-item-checkbox")) {
      toggleItemOpen($(this));
      var $projectListItem = $(e.target).is("li") ? $(e.target) : $(e.target).parent("li");
      var $loadingSpinner = HelperMethods.GetLoadingSpinner().insertAfter($projectListItem);
      var projectName = $projectListItem.text();
      var projectId = $projectListItem.data("project");
      that.TeamCityApi.GetBuildsForProject(that.Server, projectName, function(err, builds) {
        if (builds != null && builds.length > 0) {
          var $projectList = $projectListItem.parent("ul");
          $projectList.find(".build-list[data-project='" + $projectListItem.data("project") + "']").remove();
          var $buildList = $("<ul class='build-list' data-project='" + $projectListItem.attr("data-project") + "'><ul>");
          for (var i = 0; i < builds.length; i++) {
            $buildList.append("<li class='build-list-item'>" + getCheckBoxForListItem(builds[i].id, projectId, "build") + "<i class='fa fa-cubes'></i>" + builds[i].name + "</li>");
          }
          checkBuildsIfProjectChecked($buildList, $projectListItem.find(".tc-item-checkbox").is(":checked"));
          HelperMethods.RemoveLoadingSpinner($loadingSpinner);
          $buildList.insertAfter($projectListItem);
        }
      });
    }
  }

  function toggleItemOpen($item) {
    $item.toggleClass("closed");
    $item.toggleClass("open");
    var projectExpandIcon = $item.find('i.fa.fa-caret-right, i.fa.fa-caret-down');
    projectExpandIcon.toggleClass("fa-caret-right");
    projectExpandIcon.toggleClass("fa-caret-down");
  }

  function getCheckBoxForListItem(itemId, projectId, itemType) {
    var isChecked = false;
    if (that.Server.subscriptions != null && that.Server.subscriptions.length > 0) {
      for (var i = 0; i < that.Server.subscriptions.length && isChecked === false; i++) {
        if (that.Server.subscriptions[i].id === projectId) {
          if (itemType === "project") {
            isChecked = true;
          }
          else if (itemType === "build") {
            if (that.Server.subscriptions[i].builds != null && that.Server.subscriptions[i].builds.length > 0) {
              for (var j = 0; j < that.Server.subscriptions[i].builds.length && isChecked === false; j++) {
                if (that.Server.subscriptions[i].builds[j].id === itemId) {
                  isChecked = true;
                }
              }
            }
          }
        }
      }
    }

    return "<input type='checkbox' data-project='" + projectId + "' " +
      (itemType === "build" ? "data-build='" + itemId + "'" : "") +
      (isChecked === true ? "checked='checked'" : "") +
      " class='" + itemType + " tc-item-checkbox'id='check-" + itemId + "' name='check-" + itemId + "'></input><label for='check-" + itemId + "' class='checkbox-label'></label>";
  }

  function checkBuildsIfProjectChecked($buildList, projectIsChecked) {
    if (projectIsChecked) {
      if ($buildList.find(".tc-item-checkbox:checked").length === 0) {
        $buildList.find(".tc-item-checkbox").prop("checked", true);
      }
    }
  }

  function displayError(message) {
    HelperMethods.DisplayError($(serverInfoRootId).find(".messages"), message);
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