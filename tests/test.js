$(document).ready(function() {


  Backbone.sync = Backbone.localSync

  libraryStore = new window.Store("libraryStore")

  var Library = Backbone.Collection.extend({
    localStorage: libraryStore
  });

  var library = new Library();

  var attrs = {
          title  : 'The Tempest',
          author : 'Bill Shakespeare',
          length : 123
      };

  module("localStorage", {setup: function() { libraryStore.empty(); library.fetch() }});


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
    console.info(library.models)
    equals(library.length, 0);
  });


});
