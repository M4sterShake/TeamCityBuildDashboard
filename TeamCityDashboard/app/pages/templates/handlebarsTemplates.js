!function(){var e=Handlebars.template,a=Handlebars.templates=Handlebars.templates||{};a.ServerInfoTemplate=e({compiler:[7,">= 4.0.0"],main:function(e,a,s,r,n){var l,t=null!=a?a:{},i=s.helperMissing,d="function",p=e.escapeExpression;return'\ufeff<div id="server-settings" class="settings-page">\r\n  <h2 id="tc-display-name-header"><i class=\'fa fa-server\'></i><span id="tc-display-name-header-text">'+p((l=null!=(l=s.displayName||(null!=a?a.displayName:a))?l:i,typeof l===d?l.call(t,{name:"displayName",hash:{},data:n}):l))+'</span></h2>\r\n  <form action="#" id="update-server-form" name="add-server-form" class="col-sm-6">\r\n    <input type="hidden" name="tc-original-display-name" class="tc-original-display-name" value="'+p((l=null!=(l=s.displayName||(null!=a?a.displayName:a))?l:i,typeof l===d?l.call(t,{name:"displayName",hash:{},data:n}):l))+'"/>\r\n    <div class="form-row">\r\n      <input type="text" name="tc-display-name" class="tc-display-name" placeholder="Display Name" value="'+p((l=null!=(l=s.displayName||(null!=a?a.displayName:a))?l:i,typeof l===d?l.call(t,{name:"displayName",hash:{},data:n}):l))+'" />\r\n    </div>\r\n    <div class="form-row">\r\n      <input type="url" name="tc-url" class="tc-url" placeholder="TeamCity URL" value="'+p((l=null!=(l=s.url||(null!=a?a.url:a))?l:i,typeof l===d?l.call(t,{name:"url",hash:{},data:n}):l))+'" />\r\n    </div>\r\n    <div class="form-row">\r\n      <input type="text" name="tc-user" class="tc-user" placeholder="Username" value="'+p((l=null!=(l=s.username||(null!=a?a.username:a))?l:i,typeof l===d?l.call(t,{name:"username",hash:{},data:n}):l))+'" />\r\n    </div>\r\n    <div class="form-row">\r\n      <input type="password" name="tc-pass" class="tc-pass" placeholder="Password" value="'+p((l=null!=(l=s.password||(null!=a?a.password:a))?l:i,typeof l===d?l.call(t,{name:"password",hash:{},data:n}):l))+'" />\r\n    </div>\r\n    <input type="submit" name="update-server-submit" id="update-server-button" value="Update Server" />\r\n    <span class="messages"></span>\r\n  </form>\r\n  <div id="server-projects" class="col-sm-6">\r\n    <h3 id="projects-header">Projects</h3>\r\n    <div id="projects-and-builds-list-container"></div>\r\n  </div>\r\n</div>'},useData:!0}),a.ServerListTemplate=e({compiler:[7,">= 4.0.0"],main:function(e,a,s,r,n){return'\ufeff<div id="server-list" class="settings-page current-settings-page">\r\n  <h2>TeamCity Servers</h2>\r\n  <p>\r\n    <a href="#" id="add-new-server-link"><i class="fa fa-plus"></i>New Server</a>\r\n  </p>\r\n  <form action="#" id="add-server-form" name="add-server-form">\r\n    <div class="form-row">\r\n      <input type="text" name="tc-display-name" class="tc-display-name" placeholder="Display Name" />\r\n    </div>\r\n    <div class="form-row">\r\n      <input type="url" name="tc-url" class="tc-url" placeholder="TeamCity URL" />\r\n    </div>\r\n    <div class="form-row">\r\n      <input type="text" name="tc-user" class="tc-user" placeholder="Username" />\r\n    </div>\r\n    <div class="form-row">\r\n      <input type="password" name="tc-pass" class="tc-pass" placeholder="Password" />\r\n    </div>\r\n    <input type="submit" name="add-server-submit" id="add-server-button" value="Add Server" />\r\n    <span class="messages"></span>\r\n  </form>\r\n  <ul id="tc-server-list"></ul>\r\n</div>'},useData:!0})}();