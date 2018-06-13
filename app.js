var express = require('express')
var app = express()
var cors = require('cors')
var dockerCLI = require('docker-cli-js');
var dockerstats = require('dockerstats');
var DockerOptions = dockerCLI.Options;
var Docker = dockerCLI.Docker;

var options = new DockerOptions(
   );    
 
var docker = new Docker(options);

var dockerList = {};
app.use(cors())
app.get('/status/:id', (req, res) => {
console.log('in');
res.setHeader('Content-Type', 'application/json');
var id = req.params.id;
var name;


name = dockerList[id]


dockerstats.dockerContainerStats(id, (data) => {
  var cont = {};
  cont.names = name;
  cont.mem_usage = data.mem_usage;
  cont.mem_limit = data.mem_limit;
  cont.mem_percent = data.mem_percent;
  cont.cpu_percent = data.cpu_percent;

  res.send(cont);

  })

});


app.get('/list', (req, res) => {
  var Arr = [];
  dockerList = {};
  res.setHeader('Content-Type', 'application/json');
  docker.command('ps').then((data) => {
  list = data.containerList;

  for(let i = 0; i <list.length; i++) {
  var name = list[i].names;
  if(name != "py_influx_test" && name != "grafana_influx" && name != "InfluxDB_container" && name.indexOf("proxy") === -1) {
  Arr.push(list[i]["container id"]);
  var realName = name.split(".",2)
  dockerList[list[i]["container id"]] = `${realName[0]}.${realName[1]}`;
    }
  }
  console.log(dockerList)
  res.send(Arr);
  });



});



app.listen(9999)
