ServerList = function() {
  this.DataStore = null;
  this.TeamCityApi = null;
  this.SettingsPage = null;

  var that = this;
  var serverListRootId = "#server-list";
  var serverListUlId = "#tc-server-list";
  var serverListElement = null;

  this.Show = function(containerId) {
    serverListElement = $(Handlebars.templates['ServerListTemplate']());
    if ($(serverListRootId).length) {
      $(serverListRootId).html(serverListElement.html());
      initEventHandlers($(serverListRootId));
    } else {
      initEventHandlers(serverListElement);
      initGlobalEventHandlers();
      $(containerId).append(serverListElement);
    }
    
    serverListElement.fadeIn();
    that.DataStore.GetServers(function (servers) {
      displayServers(servers);
    });
  }

  function initEventHandlers(serverListElement) {
    serverListElement.find("#add-server-form").validate({ submitHandler: addServerSubmitHandler });
    serverListElement.find("#add-new-server-link").on("click", toggleNewServerForm);
  }

  function initGlobalEventHandlers() {
    $("body").on("click", "#tc-server-list .tc-server-list-item a", serverListItemEventHandler);
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
        displayError("Couldn't connect to " + server.url + " with the specified credentials - " + err.message);
        return;
      }

      addServer(server);
    });
  }

  function toggleNewServerForm() {
    if ($("#add-server-form").is(":visible")) {
      $("#add-server-form").slideUp({
        duration: 1250,
        easing: "easeOutQuart"
      });
    } else {
      $("#add-server-form").slideDown({
        duration: 1250,
        easing: "easeOutQuart"
      });
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

      ServerInfo.init(serverInfo, that.DataStore, that.TeamCityApi, that).Show("#container");
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

  function displayError(message) {
    HelperMethods.DisplayError($(serverListRootId).find(".messages"), message);
  }
}

ServerList.init = function (dataStore, teamCityApi, settingsPage) {
  var serverList = new ServerList();
  serverList.DataStore = dataStore;
  serverList.TeamCityApi = teamCityApi;
  serverList.SettingsPage = settingsPage;
  return serverList;
};