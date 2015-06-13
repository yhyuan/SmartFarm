Meteor.publish('Fields', function() {
    return Fields.find({
        $or: [{
            staffs: {
                $in: [this.userId]
            }
        }, {
            $and: [{
                owner: this.userId
            }, {
                owner: {
                    $exists: true
                }
            }]

        }]
    });
});
  
  Fields.allow({
    insert: function (userId, field) {
      return userId && field.owner === userId;
    },
    update: function (userId, field, fields, modifier) {
      if (userId !== field.owner)
        return false;

      return true;
    },
    remove: function (userId, field) {
      if (userId !== field.owner)
        return false;

      return true;
    }
  });
/*
  Meteor.publish('Tasks', function() {
      return Tasks.find({});
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
*/
  var apiCall = function(apiUrl, callback) {
      // try…catch allows you to handle errors 

      try {
          var response = HTTP.get(apiUrl).data;
          //console.log(response);
          // A successful API call returns no error 
          // but the contents from the JSON response
          if(response.status === 0) {
            callback(null, response);
          } else {
            // Create an Error object and return it via callback
            var myError = new Meteor.Error(501, response);
            callback(myError, null);
          }          
      } catch (error) {
          //console.log(error);
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
      'geoJsonForAddress': function(address) {
          //console.log(address);
          // avoid blocking other method calls from the same client
          this.unblock();
          var apiUrl = 'http://api.map.baidu.com/geocoder/v2/?address=' + address + '&output=json&ak=dg6vqwlXGRKITgjxC6c2iQ08';
          // asynchronous call to the dedicated API calling function
          var response = Meteor.wrapAsync(apiCall)(apiUrl);
          return response;
      },
      'getWeatherForecast': function(latlng) {
          this.unblock();
          //https://api.forecast.io/forecast/xxxxxxxxxxxxxxxxxxxxx/lat,lon,2014-02-24T19:00:00?units=si&exclude=currently,minutely,hourly
          var apiUrl = 'https://api.forecast.io/forecast/0e5a9a380119f9b39ba5fc18efdff39b/' + latlng.lat + ',' + latlng.lng + '?units=si';
          // asynchronous call to the dedicated API calling function
          var response = Meteor.wrapAsync(apiCall)(apiUrl);
/*
              si: Returns results in SI units. In particular, properties now have the following units:
              summary: Any summaries containing temperature or snow accumulation units will have their values in degrees Celsius or in centimeters (respectively).
              nearestStormDistance: Kilometers.
              precipIntensity: Millimeters per hour.
              precipIntensityMax: Millimeters per hour.
              precipAccumulation: Centimeters.
              temperature: Degrees Celsius.
              temperatureMin: Degrees Celsius.
              temperatureMax: Degrees Celsius.
              apparentTemperature: Degrees Celsius.
              dewPoint: Degrees Celsius.
              windSpeed: Meters per second.
              pressure: Hectopascals (which are, conveniently, equivalent to the default millibars).
              visibility: Kilometers.
*/          
          return response;
      },      
      'createField': function(options) {
          if(! this.userId) {
            throw new Meteor.Error(403, "You must be logged in");
          }
          return Fields.insert({staffs: [], owner: this.userId, name: options.name, geometry: options.geometry});
      },
      'updateField': function(options) {
          if(! this.userId) {
            throw new Meteor.Error(403, "You must be logged in");
          }

          if(options.owner !== this.useId) {
            throw new Meteor.Error(403, "You must be the owner of this field.");
          }
          Fields.update(options._id, {$set: {name: options.name, geometry: options.geometry}});
      }
  });