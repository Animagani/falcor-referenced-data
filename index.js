var falcor = require('falcor');
var falcorExpress = require('falcor-express');
var Router = require('falcor-router');

var express = require('express');
var _ = require('lodash');
var app = express();

app.use(express.static('.'));

var $ref = falcor.Model.ref;

var data = {
  genresById : {
    1: {
      name: "Crime",
      titles: [
        $ref('titlesById[1]'),
        $ref('titlesById[3]')
      ]
    },
    2: {
      name: "Comedy",
      titles: [
        $ref('titlesById[2]'),
        $ref('titlesById[4]')
      ]
    }
  },
  titlesById: {
    1: {
      name: "Godfather"
    },
    2: {
      name: "La vita è bella"
    },
    3: {
      name: "Pulp Fiction"
    },
    4: {
      name: "Intouchables"
    }
  }

}

app.use('/model.json', falcorExpress.dataSourceRoute(function(req, res) {
  return new Router([
    {
      route: "genresById.length",
      get: function(pathSet){
        var results = [];

        results.push({
          path: ['genresById', 'length'],
          value: Object.keys(data.genresById).length
        });

        return results;
      }
    },
    {
      route: "genresById[{integers:genresIds}].titles.length",
      get: function(pathSet){
        var key = 'titles';
        var results = [];

        pathSet.genresIds.forEach(function(genreId){
          var genreRecord = data.genresById[genreId];

          results.push({
            path: ['genresById', genreId, key, "length"],
            value: genreRecord[key].length
          });
        });

        return results;
      }
    },
    {
      route: "genresById[{integers:genresIds}].titles[{integers:titlesIds}]",
      get: function(pathSet){
        var key = 'titles';
        var results = [];

        pathSet.genresIds.forEach(function(genreId){
          var genreRecord = data.genresById[genreId];
          pathSet.titlesIds.forEach(function(titleId) {
            if (genreRecord.titles[titleId]) {
              results.push({
                path: ['genresById', genreId, key, titleId],
                value: genreRecord[key][titleId]
              });
            }
            else {
              results.push({
                path: ['genresById', genreId, key, titleId],
                value: undefined
              });
            }
          });
        });

        return results;
      }
    },
    {
      route: "genresById[{integers:genresIds}].name",
      get: function(pathSet){
        var key = "name";
        var results = [];

        pathSet.genresIds.forEach(function(genreId){
          var genreRecord = data.genresById[genreId];

          results.push({
            path: ['genresById', genreId, key],
            value: genreRecord[key]
          });
        });

        return results;
      }
    },
    {
      route: "titlesById[{integers:titlesIds}]['name']",
      get: function(pathSet){
        console.info('TitlesByIDS!');
        console.info(JSON.stringify(pathSet));

        var results = [];

        pathSet.titlesIds.forEach(function(titleId){
          var titleRecord = data.titlesById[titleId];

          if (titleRecord) {
            results.push({
              path: ['titlesById', titleId, 'name'],
              value: titleRecord['name']
            });
          }
          else {
            results.push({
              path: ['titlesById', titleId, 'name'],
              value: undefined
            });
          }
        });

        return results;
      }
    }
  ]);
}));

app.listen(3000);
console.log("Listening on http://localhost:3000");
