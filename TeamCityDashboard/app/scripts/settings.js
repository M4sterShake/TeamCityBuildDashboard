(function ($) {
  var state,
    teamCityApi,
    serverInfoSection;

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
  }

  function displayServer(serverName) {
    state.GetServer(serverName, function (err, serverInfo) {
      if (err) {
        console.log(err.message);
        return;
      }

      serverInfoSection = ServerInfo.init(serverInfo, teamCityApi);
      serverInfoSection.Show("#container");
    });
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
      state.GetServers(function(servers) {
        displayServers(servers);
        displayServer(serverInfo.displayName);
      });
    });
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