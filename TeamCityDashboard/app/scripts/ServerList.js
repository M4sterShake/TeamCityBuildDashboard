ServerList = function() {
  this.DataStore = null;
  this.TeamCityApi = null;
  this.SettingsPage = null;

  var that = this;
  var serverListRootId = "#server-list";
  var serverListUlId = "#tc-server-list";
  var serverListElement = null;

  this.Show = function(containerId) {
    if ($(serverListRootId).length) {
      $(serverListRootId).remove();
    }

    serverListElement = $(Handlebars.templates['ServerListTemplate']());
    initEventHandlers(serverListElement);
    $(containerId).append(serverListElement);
    serverListElement.fadeIn();
    that.DataStore.GetServers(function (servers) {
      displayServers(servers);
    });
  }

  function initEventHandlers(serverListElement) {
    serverListElement.find("#add-server-form").validate({ submitHandler: addServerSubmitHandler });
    $("body").on("click", "#tc-server-list .tc-server-list-item a", serverListItemEventHandler);
    serverListElement.find("#add-new-server-link").on("click", toggleNewServerForm);
  }

  function addServerSubmitHandler(form) {
    var server = {
      displayName: $(form).find(".tc-display-name").val(),
      url: $(form).find(".tc-url").val(),
      username: $(form).find(".tc-user").val(),
      password: $(form).find(".tc-pass").val()
    }

    that.TeamCityApi.GetProjectsForServer(server, function (err, projects) {
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

  function clearNewServerForm() {
    $("#add-server-form input[type='text'], #add-server-form input[type='url'], #add-server-form input[type='password']").val("");
  }

  function serverListItemEventHandler(e) {
    e.preventDefault();
    displayServer($(this).text());
  }

  function displayServer(serverName) {
    that.DataStore.GetServer(serverName, function (err, serverInfo) {
      if (err) {
        console.log(err.message);
        return;
      }

      ServerInfo.init(serverInfo, that.TeamCityApi).Show("#container");
      that.SettingsPage.moveForwardSettingsPage();
    });
  }

  function displayServers(servers) {
    if (servers != null) {
      $(serverListUlId).html("");
      for (var i = 0; i < servers.length; i++) {
        $(serverListUlId).append("<li class='tc-server-list-item'><a href='#'><i class='fa fa-server'></i>" + servers[i].displayName + "</a><li>");
      }

      if (servers.length > 0) {
        $(serverListUlId).fadeIn();
      }
    }
  }

  function displayError(message) {
    $("#add-server-form .error-message .message").text(message);
    $("#add-server-form .error-message").show();
  }

  function addServer(serverInfo) {
    that.DataStore.AddServer(serverInfo, function (err) {
      if (err) {
        displayError(err.message);
        return;
      }

      toggleNewServerForm();
      clearNewServerForm();
      that.DataStore.GetServers(function (servers) {
        displayServers(servers);
        displayServer(serverInfo.displayName);
      });
    });
  }
}

ServerList.init = function (dataStore, teamCityApi, settingsPage) {
  var serverList = new ServerList();
  serverList.DataStore = dataStore;
  serverList.TeamCityApi = teamCityApi;
  serverList.SettingsPage = settingsPage;
  return serverList;
};