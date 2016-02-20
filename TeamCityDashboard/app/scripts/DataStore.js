DataStore = function() {
  
  this.GetServers = function(callback) {
    chrome.storage.sync.get("teamCityServers", function (storedServers) {
      callback(storedServers["teamCityServers"]);
    });
  }

  this.GetServer = function (serverName, callback) {
    var that = this,
      serverFound = false;
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
    var that = this;
    that.GetServers(function (storedServers) {
      if (storedServers != null) {
        if (!serverAlreadyExists(storedServers, server)) {
          chrome.storage.sync.set({ 'teamCityServers': storedServers.push() }, function() {
            handleErrors(callback);
          });
        } else {
          callback({ message: "You've already added a server with that URL" });
        }
      } else {
        var servers = [server];
        chrome.storage.sync.set({ 'teamCityServers': servers }, function () {
          handleErrors(callback);
        });
      }
    });
  }

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
}

DataStore.init = function () {
  return new DataStore();
};