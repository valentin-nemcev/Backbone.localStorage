$(document).ready(function() {


  Backbone.sync = Backbone.localSync

  var libraryStore = new window.Store("libraryStore")

  var Library = Backbone.Collection.extend({
    localStorage: libraryStore
  });

  var library = new Library();

  var attrs = {
          title  : 'The Tempest',
          author : 'Bill Shakespeare',
          length : 123
      };

  module("localStorage", {setup: function() {
    libraryStore.async = false
    
    libraryStore.empty();
    library.fetch()
  }});



  test("collection read", function() {
    library.fetch();
    equals(library.length, 0);
  });

  test("collection create", function() {
    library.create(attrs);
    equals(library.length, 1);
    equals(library.first().get('title'), 'The Tempest');
    equals(library.first().get('author'), 'Bill Shakespeare');
    equals(library.first().get('length'), 123);
  });

  test("collection update", function() {
    library.create(attrs);
    library.first().save({id: '1-the-tempest', author: 'William Shakespeare'});
    equals(library.first().get('id'), '1-the-tempest');
    equals(library.first().get('title'), 'The Tempest');
    equals(library.first().get('author'), 'William Shakespeare');
    equals(library.first().get('length'), 123);
  });

  test("collection destroy", function() {
    library.create(attrs);
    library.first().destroy();
    equals(library.length, 0);
  });


  module("localStorage async", {setup: function() {
    libraryStore.async = true
    libraryStore.asyncDelay = 15
    
    libraryStore.empty();
    library.fetch()
  }});

  test("default async options", function() {
    var libraryStore = new window.Store("libraryStore")
    equal(libraryStore.async, false)
    equal(libraryStore.asyncDelay, 50)
  });

  

  asyncTest("collection read", function() {
    var async = false
    library.fetch({success: function(){
      equals(library.length, 0);
      ok(async)
      start()
    }});
    async = true
  });

  asyncTest("collection create", function() {
    library.create(attrs, {success: function(model){
      equals(library.length, 1);
      equals(library.first(), model)
      equals(model.get('title'), 'The Tempest');
      equals(model.get('author'), 'Bill Shakespeare');
      equals(model.get('length'), 123);
      start()
    }});
    notEqual(library.length, 1);
  });

  asyncTest("collection update", function() {
    library.create(attrs, {success: function(model){
      var async = false
      model.save({id: '1-the-tempest', author: 'William Shakespeare'}, {success: function(model){
        equals(model.get('id'), '1-the-tempest');
        equals(model.get('title'), 'The Tempest');
        equals(model.get('author'), 'William Shakespeare');
        equals(model.get('length'), 123);
        ok(async)
        start();
      }});
      async = true
    }});
  });

  asyncTest("collection destroy", function() {
    library.create(attrs, {success: function(model){
      model.destroy({success: function(model){
        equals(library.length, 0);
      }});
      notEqual(library.length, 0);
      start();
    }});
  });

});
