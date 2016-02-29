!function(){var e=Handlebars.template,a=Handlebars.templates=Handlebars.templates||{};a.BuildGridBuild=e({compiler:[7,">= 4.0.0"],main:function(e,a,r,s,l){var n,i=null!=a?a:{},t=r.helperMissing,d="function",u=e.escapeExpression;return'\ufeff<div class="build-grid-item grid-item" data-build-id="'+u((n=null!=(n=r.buildId||(null!=a?a.buildId:a))?n:t,typeof n===d?n.call(i,{name:"buildId",hash:{},data:l}):n))+'">\r\n  <div class="build-title">'+u((n=null!=(n=r.buildTitle||(null!=a?a.buildTitle:a))?n:t,typeof n===d?n.call(i,{name:"buildTitle",hash:{},data:l}):n))+"</div>\r\n</div>"},useData:!0}),a.BuildGridProject=e({compiler:[7,">= 4.0.0"],main:function(e,a,r,s,l){var n,i=null!=a?a:{},t=r.helperMissing,d="function",u=e.escapeExpression;return'\ufeff<div class="project-grid-item grid-item" data-server-name="'+u((n=null!=(n=r.projectId||(null!=a?a.projectId:a))?n:t,typeof n===d?n.call(i,{name:"projectId",hash:{},data:l}):n))+'">\r\n  <h2 class="title">'+u((n=null!=(n=r.projectName||(null!=a?a.projectName:a))?n:t,typeof n===d?n.call(i,{name:"projectName",hash:{},data:l}):n))+'</h2>\r\n  <div class="project-contents"></div>\r\n</div>'},useData:!0}),a.BuildGridServer=e({compiler:[7,">= 4.0.0"],main:function(e,a,r,s,l){var n,i=null!=a?a:{},t=r.helperMissing,d="function",u=e.escapeExpression;return'\ufeff<div class="server-grid-item grid-item" data-server-name="'+u((n=null!=(n=r.serverId||(null!=a?a.serverId:a))?n:t,typeof n===d?n.call(i,{name:"serverId",hash:{},data:l}):n))+'">\r\n  <h2 class="title">'+u((n=null!=(n=r.serverName||(null!=a?a.serverName:a))?n:t,typeof n===d?n.call(i,{name:"serverName",hash:{},data:l}):n))+'</h2>\r\n  <div class="server-contents"></div>\r\n</div>'},useData:!0}),a.ServerInfoTemplate=e({compiler:[7,">= 4.0.0"],main:function(e,a,r,s,l){var n,i=null!=a?a:{},t=r.helperMissing,d="function",u=e.escapeExpression;return'\ufeff<div id="server-settings" class="settings-page">\r\n  <h2 id="tc-display-name-header"><i class=\'fa fa-server\'></i><span id="tc-display-name-header-text">'+u((n=null!=(n=r.displayName||(null!=a?a.displayName:a))?n:t,typeof n===d?n.call(i,{name:"displayName",hash:{},data:l}):n))+'</span></h2>\r\n  <form action="#" id="update-server-form" name="add-server-form" class="col-sm-6">\r\n    <input type="hidden" name="tc-original-display-name" class="tc-original-display-name" value="'+u((n=null!=(n=r.displayName||(null!=a?a.displayName:a))?n:t,typeof n===d?n.call(i,{name:"displayName",hash:{},data:l}):n))+'" required/>\r\n    <div class="form-row">\r\n      <input type="text" name="tc-display-name" class="tc-display-name" placeholder="Display Name" value="'+u((n=null!=(n=r.displayName||(null!=a?a.displayName:a))?n:t,typeof n===d?n.call(i,{name:"displayName",hash:{},data:l}):n))+'" required/>\r\n    </div>\r\n    <div class="form-row">\r\n      <input type="url" name="tc-url" class="tc-url" placeholder="TeamCity URL" value="'+u((n=null!=(n=r.url||(null!=a?a.url:a))?n:t,typeof n===d?n.call(i,{name:"url",hash:{},data:l}):n))+'" required/>\r\n    </div>\r\n    <div class="form-row">\r\n      <input type="text" name="tc-user" class="tc-user" placeholder="Username" value="'+u((n=null!=(n=r.username||(null!=a?a.username:a))?n:t,typeof n===d?n.call(i,{name:"username",hash:{},data:l}):n))+'" required/>\r\n    </div>\r\n    <div class="form-row">\r\n      <input type="password" name="tc-pass" class="tc-pass" placeholder="Password" value="'+u((n=null!=(n=r.password||(null!=a?a.password:a))?n:t,typeof n===d?n.call(i,{name:"password",hash:{},data:l}):n))+'" required/>\r\n    </div>\r\n    <input type="submit" name="update-server-submit" id="update-server-button" value="Update Server" />\r\n    <span class="messages"></span>\r\n  </form>\r\n  <div id="server-projects" class="col-sm-6">\r\n    <h3 id="projects-header">Projects</h3>\r\n    <p class="tag-line">Choose the projects and builds that you want to appear on the dashboard...</p>\r\n    <div id="projects-and-builds-list-container"></div>\r\n  </div>\r\n</div>'},useData:!0}),a.ServerListTemplate=e({compiler:[7,">= 4.0.0"],main:function(e,a,r,s,l){return'\ufeff<div id="server-list" class="settings-page current-settings-page">\r\n  <h2>TeamCity Servers</h2>\r\n  <div class="col-sm-6">\r\n    <p id="new-server-header"><i class="fa fa-plus"></i>New Server</p>\r\n    <form action="#" id="add-server-form" name="add-server-form">\r\n      <div class="form-row">\r\n        <input type="text" name="tc-display-name" class="tc-display-name" placeholder="Display Name" required/>\r\n      </div>\r\n      <div class="form-row">\r\n        <input type="url" name="tc-url" class="tc-url" placeholder="TeamCity URL" required/>\r\n      </div>\r\n      <div class="form-row">\r\n        <input type="text" name="tc-user" class="tc-user" placeholder="Username" required/>\r\n      </div>\r\n      <div class="form-row">\r\n        <input type="password" name="tc-pass" class="tc-pass" placeholder="Password" required/>\r\n      </div>\r\n      <input type="submit" name="add-server-submit" id="add-server-button" value="Add Server" required/>\r\n      <span class="messages"></span>\r\n    </form>\r\n  </div>\r\n  <div class="col-sm-6">\r\n    <h3 id="saved-servers-header">Saved Servers</h3>\r\n    <ul id="tc-server-list" class="col-sm-6"></ul>\r\n  </div>\r\n</div>'},useData:!0})}();