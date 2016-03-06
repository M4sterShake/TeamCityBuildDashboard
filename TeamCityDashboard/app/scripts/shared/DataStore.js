DataStore = function() {
  var that = this;

  this.GetServers = function(callback) {
    chrome.storage.sync.get("teamCityServers", function (storedServers) {
      callback(storedServers["teamCityServers"]);
    });
  }

  this.GetServer = function (serverName, callback) {
    var serverFound = false;
    that.GetServers(function (servers) {
      if (servers != null) {
        for (var i = 0; i < servers.length && serverFound === false; i++) {
          if (servers[i].displayName === serverName) {
            serverFound = true;
            callback(null, servers[i]);
          }
        }
        if (serverFound === false) {
          callback({ message: "Unable to find a server with the name '" + serverName + "'" });
        }
      }
    });
  }

  this.AddServer = function (server, callback) {
    that.GetServers(function (storedServers) {
      if (storedServers != null) {
        if (!serverAlreadyExists(storedServers, server)) {
          server.id = generateGUID();
          storedServers.push(server);
          chrome.storage.sync.set({ 'teamCityServers': storedServers}, function() {
            handleErrors(callback);
          });
        } else {
          callback({ message: "You've already added a server with that URL" });
        }
      } else {
        server.id = generateGUID();
        var servers = [server];
        chrome.storage.sync.set({ 'teamCityServers': servers }, function () {
          handleErrors(callback);
        });
      }
    });
  }

  this.UpdateServer = function(server, callback) {
    var serverFound = false;
    that.GetServers(function (servers) {
      if (servers != null) {
        for (var i = 0; i < servers.length && serverFound === false; i++) {
          if (servers[i].id === server.id) {
            serverFound = true;
            servers[i].displayName = server.displayName;
            servers[i].url = server.url;
            servers[i].username = server.username;
            servers[i].password = server.password;
            servers[i].subscriptions = server.subscriptions;
            chrome.storage.sync.set({ 'teamCityServers': servers }, function () {
              handleErrors(callback);
            });
          }
        }
        if (serverFound === false) {
          callback({ message: "Unable to find a server with the name '" + server.originalDisplayName + "'" });
        }
      }
    });
  }

  //this.SaveSubscriptionsForServer = function(server, callback) {
  //  var serverFound = false;
  //  that.GetServers(function(servers) {
  //    if (servers != null) {
  //      for (var i = 0; i < servers.length && serverFound === false; i++) {
  //        if (servers[i].id === server.id) {
  //          servers[i].subscriptions = server.subscriptions;
  //          serverFound = true;
  //          chrome.storage.sync.set({'teamCityServers': servers}, function() {
  //            handleErrors(callback);
  //          });
  //        }
  //      }
  //      if (serverFound === false) {
  //        callback({ message: "Unable to find a server with the name '" + server.originalDisplayName + "'" });
  //      }
  //    }
  //  });
  //}

  function serverAlreadyExists(serverList, server) {
      var serverExists = false;
      for (var i = 0; i < serverList.length; i++) {
        if (serverList[i].url === server.url) {
          serverExists = true;
        }
      }
    return serverExists;
  }

  function handleErrors(callback, returnItem) {
    if (chrome.runtime.lastError) {
      if (chrome.runtime.lastError.message) {
        callback(chrome.runtime.lastError);
      } else {
        callback({ message: "An error occured, not sure what... soz!" });
      }
    } else {
      if (returnItem == null) {
        callback(null);
      } else {
        callback(null, returnItem);
      }
    }
  }

  function generateGUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
  };
}

DataStore.init = function () {
  return new DataStore();
};