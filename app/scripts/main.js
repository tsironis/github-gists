var Gist = Backbone.Model.extend({
  parse: function (data) {
    var file = _.keys(data.files)[0];
    return {
      filename: file,
      url: data.html_url,
      user: {
        username: data.user.login,
        avatar_url: data.user.avatar_url
      }
    };
  }
});

var GistCollection = Backbone.Collection.extend({
  model: Gist,
  url: function() {
    return "https://api.github.com/users/"+this.username+"/gists"
  },
  initialize: function (options) {
    this.username = options.username;
  }
});

var ItemView = Backbone.View.extend({
  tagName: 'li',
  template: _.template("<img src='<%= user.avatar_url %>' /> <%= user.username %> <a href='<%= url %>'><%= filename %></a>"),
  events: {
    'click img': 'showUser'
  },
  showUser: function () {
    alert(this.model.get('filename'))
  },
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }
})

var ListView = Backbone.View.extend({
  tagName: 'ul',
  className: 'gists',
  initialize: function () {
    this.collection.on('sync', this.render, this);
  },
  render: function () {
    var list = _(this.collection.models).map(function(gist){
      var view = new ItemView({model: gist});
      return view.render().el;
    });
    $('.container').html(this.$el.append(list));
  }
});

var appRouter = Backbone.Router.extend({
  routes: {
    "gists/:username": "fetchGists"
  },
  fetchGists: function (username) {
    window.gists = new GistCollection({username: username});
    gists.fetch();

    var view = new ListView({collection: gists});
  }
});


var app = new appRouter();

Backbone.history.start();
