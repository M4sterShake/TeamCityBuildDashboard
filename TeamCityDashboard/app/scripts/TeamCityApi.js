TeamCityApi = function () {
  var rootApiUrl = "/httpAuth/app/rest/";
  var getProjectsUrl = rootApiUrl + "projects";

  this.GetProjectsForServer = function (server, callback) {
    var thisServerGetProjectsUrl = server.url + getProjectsUrl;

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
  }
}

TeamCityApi.init = function () {
  return new TeamCityApi();
};