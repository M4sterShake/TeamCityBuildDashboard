var DashboardItem = {
  Init: function (buildParam, targetElement) {
    this.dashboardItem = buildParam;
    this.$targetElement = $(targetElement);
    return this;
  },
  SetItemWidth: function (server) {
    server.width = server.width ? server.width : "large";
    if (server.width === "small") {
      server.colSize = "col-xs-4";
    } else if (server.width === "medium") {
      server.colSize = "col-xs-6";
    } else if (server.width === "large") {
      server.colSize = "col-xs-12";
    }

    return server;
  }
}