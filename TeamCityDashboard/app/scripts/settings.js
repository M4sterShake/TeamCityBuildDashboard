(function () {
  var dataStore,
    teamCityApi;

  init();

  function init() {
    dataStore = DataStore.init();
    teamCityApi = TeamCityApi.init();
    ServerList.init(dataStore, teamCityApi).Show("#container");
  }
})();