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

  Meteor.publish('Fields', function() {
      return Fields.find({});
  });

  Meteor.publish('Tasks', function() {
      return Tasks.find({});
  });

  Fields.allow({
      insert: function() {
          return true;
      },
      update: function() {
          return true;
      },
      remove: function() {
          return true;
      }
  });

  Tasks.allow({
      insert: function() {
          return true;
      },
      update: function() {
          return true;
      },
      remove: function() {
          return true;
      }
  });

  var apiCall = function(apiUrl, callback) {
      // try…catch allows you to handle errors 

      try {
          var response = HTTP.get(apiUrl).data;
          // A successful API call returns no error 
          // but the contents from the JSON response
          callback(null, response);
      } catch (error) {
          // If the API responded with an error message and a payload 
          if (error.response) {
              var errorCode = error.response.data.code;
              var errorMessage = error.response.data.message;
              // Otherwise use a generic error message
          } else {
              var errorCode = 500;
              var errorMessage = 'Cannot access the API';
          }
          // Create an Error object and return it via callback
          var myError = new Meteor.Error(errorCode, errorMessage);
          callback(myError, null);
      }
  };

  Meteor.methods({
      'geoJsonForIp': function(ip) {
          console.log(ip);
          // avoid blocking other method calls from the same client
          this.unblock();
          var apiUrl = 'http://www.telize.com/geoip/' + ip;
          // asynchronous call to the dedicated API calling function
          var response = Meteor.wrapAsync(apiCall)(apiUrl);
          return response;
      }
  });