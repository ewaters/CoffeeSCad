// Generated by CoffeeScript 1.3.3
(function() {

  define(function(require) {
    var $, CodeEditorView, CsgProcessor, GlThreeView, GlViewSettings, Library, LoadView, MainContentLayout, MainMenuView, ModalRegion, Project, ProjectFile, ProjectView, SaveView, Settings, SettingsView, app, marionette, testcode, _, _ref, _ref1, _ref2;
    $ = require('jquery');
    _ = require('underscore');
    marionette = require('marionette');
    require('bootstrap');
    CodeEditorView = require("views/codeView");
    MainMenuView = require("views/menuView");
    ProjectView = require("views/projectsview");
    SettingsView = require("views/settingsView");
    MainContentLayout = require("views/mainContentView");
    _ref = require("views/fileSaveLoadView"), LoadView = _ref.LoadView, SaveView = _ref.SaveView;
    ModalRegion = require("views/modalRegion");
    _ref1 = require("modules/project"), Library = _ref1.Library, Project = _ref1.Project, ProjectFile = _ref1.ProjectFile;
    Settings = require("modules/settings");
    CsgProcessor = require("modules/csg.processor");
    _ref2 = require("views/glThreeView"), GlViewSettings = _ref2.GlViewSettings, GlThreeView = _ref2.GlThreeView;
    testcode = "class Thingy\n  constructor: (@thickness=10, @pos=[0,0,0], @rot=[0,0,0]) ->\n  \n  render: =>\n    result = new CSG()\n    shape1 = fromPoints([[0,0], [150,50], [0,-50]])\n    shape = shape1.expand(20, 25)\n    shape = shape.extrude({offset:[0, 0, @thickness]}) \n    cyl = new Cylinder({start: [0, 0, -50],end: [0, 0, 50],radius:10, resolution:12})\n    result = shape.subtract(cyl)\n    return result.translate(@pos).rotateX(@rot[0]).\n    rotateY(@rot[1]).rotateZ(@rot[2]).color([1,0.5,0])\n\nthing = new Thingy(35)\nthing2 = new Thingy(25)\n\nres = thing.render().union(thing2.render().mirroredX().color([0.2,0.5,0.6]))\nres= res.rotateX(37)\nres= res.rotateZ(190)\nres= res.translate([0,0,100])\nreturn res";
    app = new marionette.Application({
      root: "/opencoffeescad"
    });
    app.addRegions({
      navigationRegion: "#navigation",
      mainRegion: "#mainContent",
      statusRegion: "#statusBar",
      modal: ModalRegion
    });
    app.on("start", function(opts) {
      console.log("at start");
      return $("[rel=tooltip]").tooltip({
        placement: 'bottom'
      });
    });
    app.on("initialize:after", function() {
      return console.log("after init");
      /*fetch all settings
      */

    });
    app.addInitializer(function(options) {
      var loadProject, saveProject,
        _this = this;
      this.settings = new Settings;
      this.settings.fetch();
      console.log(this.settings.at(1));
      this.lib = new Library;
      this.csgProcessor = new CsgProcessor;
      app.model = new ProjectFile({
        name: "main",
        ext: "coscad",
        content: testcode
      });
      /*
          testmodel = new ProjectFile
            name: "assembly"
            ext: "coscad"
            content: testcode   
            
          testmodel2 = new ProjectFile
            name: "part"
            ext: "coscad"
            content: "Cube()"  
            
          proj = new Project({name:'proj1'})
          proj.add testmodel
          proj.add testmodel2
          
          proj2 = new Project({name:'proj2'})
          proj2.add testmodel2
          
          @lib  = new Library
          @lib.add(proj)
          @lib.add(proj2)
          @lib.save( )
          @lib.fetch()
      */

      this.codeEditorView = new CodeEditorView({
        model: this.model
      });
      this.mainMenuView = new MainMenuView({
        model: this.lib
      });
      this.projectView = new ProjectView({
        collection: this.lib
      });
      this.glThreeView = new GlThreeView({
        model: this.model,
        settings: this.settings.at(1)
      });
      this.mainContentLayout = new MainContentLayout;
      this.mainRegion.show(this.mainContentLayout);
      this.mainContentLayout.edit.show(this.codeEditorView);
      this.mainContentLayout.gl.show(this.glThreeView);
      this.navigationRegion.show(this.mainMenuView);
      this.statusRegion.show(this.projectView);
      this.modal.app = this;
      saveProject = function(params) {
        console.log("SaveRequested");
        console.log("params: " + params);
        return console.log(params);
      };
      loadProject = function(params) {
        console.log("LoadRequested");
        return console.log("params: " + params);
      };
      app.vent.bind("fileSaveRequest", saveProject);
      app.vent.bind("fileLoadRequest", loadProject);
      app.mainMenuView.on("project:new:mouseup", function() {});
      app.mainMenuView.on("file:new:mouseup", function() {
        console.log("newfile");
        _this.model = new ProjectFile({
          name: "main",
          ext: "coscad",
          content: ""
        });
        _this.codeEditorView.model = _this.model;
        _this.glThreeView.model = _this.model;
        console.log(_this.codeEditorView.model);
        _this.codeEditorView.render();
        return _this.glThreeView.render();
      });
      app.mainMenuView.on("file:save:mouseup", function() {
        app.modView = new SaveView;
        return app.modal.show(_this.modView);
      });
      app.mainMenuView.on("file:load:mouseup", function() {
        app.modView = new LoadView;
        return app.modal.show(_this.modView);
      });
      app.mainMenuView.on("settings:mouseup", function() {
        var setTest;
        setTest = _this.settings.first();
        _this.modView = new SettingsView({
          model: setTest
        });
        _this.modView.render();
        console.log(_this.modView);
        return app.modal.show(_this.modView);
      });
      return app.glThreeView.fromCsg();
    });
    /*return _.extend app,
      module: (additionalProps)->
        return _.extend
          Views: {}
          additionalProps
    */

    return app;
  });

}).call(this);