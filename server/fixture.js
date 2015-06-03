  Meteor.startup(function () {
    console.log(Fields.find({}).count());
  if (Fields.find({}).count() === 0) {
      Fields.insert({
        name: "test1"
      });
      Fields.insert({
        name: "test2"
      });
      Fields.insert({
        name: "test3"
      });
  }
});

  Meteor.publish('Fields', function () {
    return Fields.find({});
  });

  Meteor.publish('Tasks', function () {
    return Tasks.find({});
  });

  Fields.allow({
    insert: function () {
      return true;
    },
    update: function () {
      return true;
    },
    remove: function () {
      return true;
    }
  });

  Tasks.allow({
    insert: function () {
      return true;
    },
    update: function () {
      return true;
    },
    remove: function () {
      return true;
    }
  });