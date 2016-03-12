Dashboard = function(dataStoreParam, teamCityApiParam, targetElement) {
  var that = this,
    dataStore = dataStoreParam,
    teamCityApi = teamCityApiParam,
    dashboardServers = [];
  
  this.Show = function() {
    dataStore.GetServers(function (servers) {
      var orderedServerList = servers.sort(positionComparer); //Create an ordered list of servers based on their position on the dashboard.
      for (var i = 0; i < orderedServerList.length; i++) {
        orderedServerList[i].position = i;
        var dashboardServer = Object.create(ServerDashboardItem).Init(orderedServerList[i], targetElement, teamCityApi);
        dashboardServer.Show();
        dashboardServers.push(dashboardServer);
      }
      targetElement.packery({
        itemSelector: '.server-grid-item'
      });
      // Save the servers now that they definitely have an order;
    });
  }

  function positionComparer(a, b) {
    if (a.position === null && b.position === null) {
      return 0;
    }
    else if (a.position === null) {
      return -1;
    }
    else if (b.position === null) {
      return 1;
    }
    else if (a.position === b.position) {
      return 0;
    }
    else if (a.position < b.position) {
      return -1;
    }
    else if (a.position > b.position) {
      return 1;
    }
    else {
      return 0;
    }
  }
}

var dashboard = new Dashboard(DataStore.init(), TeamCityApi.init(), $("#dashboard-grid-container"));
dashboard.Show();