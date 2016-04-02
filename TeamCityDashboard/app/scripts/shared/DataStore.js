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
          if (callback) {
            callback({ message: "Unable to find a server with the name '" + server.originalDisplayName + "'" });
          }
        }
      }
    });
  }

  this.UpdateServerSize = function(server, callback) {
    var serverFound = false;
    that.GetServers(function (servers) {
      if (servers != null) {
        for (var i = 0; i < servers.length && serverFound === false; i++) {
          if (servers[i].id === server.id) {
            serverFound = true;
            servers[i].width = server.width;
            chrome.storage.sync.set({ 'teamCityServers': servers }, function () {
              handleErrors(callback);
            });
          }
        }
        if (serverFound === false) {
          if (callback) {
            callback({ message: "Unable to find a server with the name '" + server.originalDisplayName + "'" });
          }
        }
      }
    });
  }

  this.UpdateProjectSize = function (server, project, callback) {
    var serverFound = false;
    that.GetServers(function (servers) {
      if (!servers) {
        if (callback) {
          callback({ message: "You don't appear to have any saved servers. Go to settings and choose a server to monitor." });
        }
        return;
      }
      
      for (var i = 0; i < servers.length && serverFound === false; i++) {
        if (servers[i].id === server.id) {
          serverFound = true;
          if (!servers[i].subscriptions) {
            if (callback) {
              callback({ message: "You don't appear have subscribed to any projects for the server named '" + server.name + "'"});
            }
            return;
          }

          var projectFound = false;
          for (var projectCounter = 0; projectCounter < servers[i].subscriptions.length; projectCounter++) {
            if (servers[i].subscriptions[projectCounter].id === project.id) {
              projectFound = true;
              servers[i].subscriptions[projectCounter].width = project.width;
              chrome.storage.sync.set({ 'teamCityServers': servers }, function () {
                if (callback) {
                  handleErrors(callback);
                }
              });
            }
          }

          if (projectFound === false) {
            if (callback) {
              callback({ message: "Couldnt find the specified project under the server named '" + server.name + "'" });
            }
            return;
          }
        }
        if (serverFound === false) {
          if (callback) {
            callback({ message: "Unable to find a server with the name '" + server.name + "'" });
          }
        }
      }
    });
  }

  this.UpdateBuildSize = function (server, project, build, callback) {
    var serverFound = false;
    that.GetServers(function (servers) {
      if (!servers) {
        if (callback) {
          callback({ message: "You don't appear to have any saved servers. Go to settings and choose a server to monitor." });
        }
        return;
      }

      for (var i = 0; i < servers.length && serverFound === false; i++) {
        if (servers[i].id === server.id) {
          serverFound = true;
          if (!servers[i].subscriptions) {
            if (callback) {
              callback({ message: "You don't appear have subscribed to any projects for the server named '" + server.name + "'" });
            }
            return;
          }

          var projectFound = false;
          for (var projectCounter = 0; projectCounter < servers[i].subscriptions.length; projectCounter++) {
            if (servers[i].subscriptions[projectCounter].id === project.id) {
              projectFound = true;
              var buildFound = false;
              if (!servers[i].subscriptions[projectCounter].builds) {
                if (callback) {
                  callback({ message: "You don't appear have subscribed to any builds for the project named '" + project.name + "'" });
                }
                return;
              }

              for (var buildCounter = 0; projectCounter < servers[i].subscriptions[projectCounter].builds.length; buildCounter++) {
                if (servers[i].subscriptions[projectCounter].builds[buildCounter].id === build.id) {
                  buildFound = true;
                  servers[i].subscriptions[projectCounter].builds[buildCounter].width = build.width;
                  chrome.storage.sync.set({ 'teamCityServers': servers }, function () {
                    if (callback) {
                      handleErrors(callback);
                    }
                  });
                }
              }

              if (buildFound === false) {
                if (callback) {
                  callback({ message: "Couldnt find the specified build under the project named '" + project.name + "'" });
                }
                return;
              }
            }
          }

          if (projectFound === false) {
            if (callback) {
              callback({ message: "Couldnt find the specified build under the server named '" + server.name + "'" });
            }
            return;
          }
        }
        if (serverFound === false) {
          if (callback) {
            callback({ message: "Unable to find a server with the name '" + server.name + "'" });
          }
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