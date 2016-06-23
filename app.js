var model = new falcor.Model({source: new falcor.HttpDataSource('/model.json')});

model
  .get(["genresById", 1, 'name'],
       ["genresById", 1, 'titles', {to: 100}, ["name"]],
       ["titlesById", {to: 100}, "name"]
      )
  .then(function(response) {
    document.getElementById('response').innerHTML = JSON.stringify(response, null, 2);
  }, function(err) {
    console.log(err);
  });
