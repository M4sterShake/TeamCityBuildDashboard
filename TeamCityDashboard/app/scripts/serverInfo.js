ServerInfo = function () {
  this.Server = null;

}

ServerInfo.init = function (server) {
  var serverInfo = new ServerInfo();
  serverInfo.Server = server;
  return new ServerInfo();
};