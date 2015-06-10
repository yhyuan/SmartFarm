  var app = angular.module('app.example', [
      'angular-meteor',
      'ui.router',
      'ionic',
      'leaflet-directive',
      'ngCordova.plugins.datePicker'
  ]);

  function onReady() {
      angular.bootstrap(document, ['app.example']);
  }

  if (Meteor.isCordova) {
      angular.element(document).on("deviceready", onReady);
  } else {
      angular.element(document).ready(onReady);
  }
  Meteor.subscribe('Fields');

  L.drawLocal.draw.toolbar.buttons.polygon = '绘制地块边界';
  L.drawLocal.edit.toolbar.buttons.edit = '编辑地块边界';
  L.drawLocal.edit.toolbar.buttons.editDisabled = '没有地块边界可以编辑';
  L.drawLocal.edit.toolbar.buttons.remove = '删除地块边界';
  L.drawLocal.edit.toolbar.buttons.removeDisabled = '没有地块边界可以删除';
  L.drawLocal.draw.toolbar.actions.text = '取消';
  L.drawLocal.draw.toolbar.actions.title = '取消绘制';
  L.drawLocal.draw.toolbar.undo.text = '删除最后一个结点';
  L.drawLocal.draw.toolbar.undo.title = '删除所绘制最后一个结点';
  L.drawLocal.edit.toolbar.actions.cancel.text = '取消';
  L.drawLocal.edit.toolbar.actions.cancel.title = '编辑，放弃所有修改。';
  L.drawLocal.edit.toolbar.actions.save.text = '保存';
  L.drawLocal.edit.toolbar.actions.save.title = '保存修改';
  L.drawLocal.draw.handlers.polygon.tooltip.start = '请点击地图以开始绘制地块边界';
  L.drawLocal.draw.handlers.polygon.tooltip.cont = '请点击地图并绘制地块边界';
  L.drawLocal.draw.handlers.polygon.tooltip.end = '请点击第一个结点来结束地块边界的绘制';
  L.drawLocal.edit.handlers.edit.tooltip.text = '拖拉地块边界结点可以编辑地块边界';
  L.drawLocal.edit.handlers.edit.tooltip.subtext = '请点击取消来取消所有修改';
  L.drawLocal.edit.handlers.remove.tooltip.text = '请点击地块边界来删除该地块边界';
