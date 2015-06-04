  Meteor.startup(function() {
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