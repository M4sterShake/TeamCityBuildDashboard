TeamCityApi = function () {
  var rootApiUrl = "/httpAuth/app/rest/";
  var getProjectsUrl = rootApiUrl + "projects";
  var getBuildsUrl = rootApiUrl + "buildTypes";

  this.GetProjectsForServer = function (server, callback) {
    var thisServerGetProjectsUrl = server.url + getProjectsUrl;
    chrome.runtime.sendMessage({ clearCookie: "TCSESSIONID", cookieUrl: thisServerGetProjectsUrl }, function (response) {
      $.ajax({
        url: thisServerGetProjectsUrl,
        username: server.username,
        password: server.password,
        success: function(response) {
          callback(null, response.project);
        },
        error: function (xhr, status, error) {
          callback({ message: error });
        },
        dataType: "json"
      });
    });
  }

  this.GetBuildsForProject = function (server, project, callback) {
    var thisProjectGetBuildsUrl = server.url + getBuildsUrl + "?locator=project:name:" + project;

    $.ajax({
      url: thisProjectGetBuildsUrl,
      username: server.username,
      password: server.password,
      success: function (response) {
        callback(null, response.buildType);
      },
      error: function (xhr, status, error) {
        callback({ message: error });
      },
      dataType: "json"
    });
  }
}

TeamCityApi.init = function () {
  return new TeamCityApi();
};