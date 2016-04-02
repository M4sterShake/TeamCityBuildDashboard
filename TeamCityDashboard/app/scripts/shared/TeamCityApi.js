TeamCityApi = function () {
  var rootApiUrl = "/httpAuth/app/rest/";
  var getProjectsUrl = rootApiUrl + "projects";
  var getBuildsUrl = rootApiUrl + "buildTypes";
  var runningBuildsUrl = rootApiUrl + "builds?locator=running:true";

  function makeApiRequest(server, apiUrl, callback) {
    $.ajax({
      url: apiUrl,
      username: server.username,
      password: server.password,
      success: function (response) {
        callback(null, response);
      },
      error: function (xhr, status, error) {
        callback({ message: error });
      },
      dataType: "json"
    });
  }

  this.GetProjectsForServer = function (server, callback) {
    var thisServerGetProjectsUrl = server.url + getProjectsUrl;
    chrome.runtime.sendMessage({ clearCookie: "TCSESSIONID", cookieUrl: thisServerGetProjectsUrl }, function (response) {
      makeApiRequest(server, thisServerGetProjectsUrl, function (err, response) { callback(err, response.project) });
    });
  }

  this.GetBuildsForProject = function (server, project, callback) {
    var thisProjectGetBuildsUrl = server.url + getBuildsUrl + "?locator=project:name:" + project;
    makeApiRequest(server, thisProjectGetBuildsUrl, function (err, response) { callback(err, response.buildType) });
  }

  this.GetBuildStatus = function (server, buildId, callback) {
    var thisBuildRunsUrl = server.url + getBuildsUrl + "/id:" + buildId + "/builds";
    makeApiRequest(server, thisBuildRunsUrl, function (err, response) {
      var latestBuildStatus;
      if (response.build && response.build.length > 0) {
        latestBuildStatus = response.build[0].status;
      } else {
        latestBuildStatus = "NOT_RUN";
      }
      callback(err, latestBuildStatus);
    });
  }

  this.GetLatestBuild = function (server, buildId, callback) {
    var thisBuildRunsUrl = server.url + getBuildsUrl + "/id:" + buildId + "/builds";
    makeApiRequest(server, thisBuildRunsUrl, function (err, response) {
      var latestBuild = null;
      if (response.build && response.build.length > 0) {
        makeApiRequest(server, server.url + response.build[0].href, function(err, buildRunResponse) {
          if (buildRunResponse) {
            callback(null, buildRunResponse);
          } else {
            callback(null, null);
          }
        });
      } else {
        callback(null, null);
      }
    });
  }

  this.GetRunningBuild = function (server, buildId, callback) {
    var thisRunningBuildsUrl = server.url + runningBuildsUrl;
    makeApiRequest(server, thisRunningBuildsUrl, function (err, response) {
      if (err) {
        callback(err);
        return;
      }

      var matchedBuild = null;
      if (response.build && response.build.length > 0) {
        for (var i = 0; i < response.build.length; i++) {
          if (response.build[i].buildTypeId === buildId) {
            matchedBuild = response.build[i];
          }
        }
      }

      callback(null, matchedBuild);
    });
  }
}

TeamCityApi.init = function () {
  return new TeamCityApi();
};