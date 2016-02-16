(function ($) {
  var state,
    teamCityApi;

  init();

  function init() {
    // Enable validation for add server form.
    $("#add-server-form").validate({ submitHandler: addServerSubmitHandler });
    $("body").on("click", "#tc-server-list .tc-server-list-item a", serverListItemEventHandler);
    $("#add-new-server-link").on("click", toggleNewServerForm);

    state = State.init();
    teamCityApi = TeamCityApi.init();
    state.GetServers(function (servers) {
      displayServers(servers);
    });
  }

  function addServerSubmitHandler(form) {
    var server = {
      displayName: $(form).find(".tc-display-name").val(),
      url: $(form).find(".tc-url").val(),
      username: $(form).find(".tc-user").val(),
      password: $(form).find(".tc-pass").val()
    }

    teamCityApi.GetProjectsForServer(server, function (err, projects) {
      if (err) {
        displayError("failed to send get request to " + server.url);
        return;
      }

      addServer(server);
    });
  }

  function toggleNewServerForm() {
    if ($("#add-server-form").is(":visible")) {
      $("#add-server-form").hide();
    } else {
      $("#add-server-form").show();
    }
  }

  function serverListItemEventHandler(e) {
    e.preventDefault();
    displayServer($(this).text());
    displayServerProjects();
  }

  function displayServer(serverName) {
    state.GetServer(serverName, function (err, serverInfo) {
      if (err) {
        console.log(err.message);
        return;
      }

      $("#tc-display-name-header-text").text(serverInfo.displayName);
      $("#update-server-form .tc-display-name").val(serverInfo.displayName);
      $("#update-server-form .tc-url").val(serverInfo.url);
      $("#update-server-form .tc-user").val(serverInfo.username);
      $("#update-server-form .tc-pass").val(serverInfo.password);
      $("#server-settings").fadeIn();
      displayServerProjects(serverInfo, $("#projects-and-builds-list-container"));
    });
  }

  function displayServerProjects(server, targetElement) {
    teamCityApi.GetProjectsForServer(server, function(err, projects) {
      if (err) {
        displayError("failed to send get request to " + server.url);
        return;
      }
      targetElement.html("");
      displayProjectTree(projects, null, targetElement);
    });
  }

  function displayProjectTree(projects, rootProject, targetElement) {
    if (projects != null ) {
      if (rootProject == null) { rootProject = "_Root" }
      for (var i = 0; i < projects.length; i++) {
        if (projects[i].id !== "_Root" && projects[i].parentProjectId === rootProject) {
          if (targetElement.children("ul").length === 0) {
            targetElement.append("<ul class='project-list'></ul>");
          }
          var targetList = targetElement.children("ul.project-list");
          var projectListItem = $("<li class='closed'><i class='fa fa-cubes'></i>" + projects[i].name + "</li>");
          projectListItem.on("click", function(e) {
            $(this).toggleClass("closed");
          });
          targetList.append(projectListItem);
          displayProjectTree(projects, projects[i].id, targetList);
        }
      }
    }
  }

  function displayError(message) {
    $("#add-server-form .error-message .message").text(message);
    $("#add-server-form .error-message").show();
  }

  function addServer(serverInfo) {
    state.AddServer(serverInfo, function (err) {
      if (err) {
        displayError(err.message);
        return;
      }
      
      toggleNewServerForm();
      clearNewServerForm();
      state.GetServers(function(servers) {
        displayServers(servers);
        displayServer(serverInfo.displayName);
      });
    });
  }

  function clearNewServerForm() {
    $("#add-server-form .tc-display-name").val("");
    $("#add-server-form .tc-url").val("");
    $("#add-server-form .tc-user").val("");
    $("#add-server-form .tc-pass").val("");
  }

  function displayServers(servers) {
    if (servers != null) {
      for (var i = 0; i < servers.length; i++) {
        $("#tc-server-list").append("<li class='tc-server-list-item'><a href='#'><i class='fa fa-server'></i>" + servers[i].displayName + "</a><li>");
      }

      if (servers.length > 0) {
        $("#tc-server-list").fadeIn();
      }
    }
  }
})(jQuery);