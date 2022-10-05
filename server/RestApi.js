const { json } = require('express');
const { default: mongoose } = require('mongoose');
const { NavItem } = require('react-bootstrap');
const db = require('./ModelHandler');
const Customer = require('../server/models/-Customer')




module.exports = class RestApi {

  constructor(expressApp) {
    this.app = expressApp;
    this.handleRequestBodyJsonErrors();
    this.createRoutes();
  }

  handleRequestBodyJsonErrors() {
    this.app.use((error, req, res, next) =>
      error instanceof SyntaxError ?
        res.status(400) && res.json({ error }) :
        next()
    );
  }

  async createRoutes() {
    await db.connect();
    this.createTablesAndViewsRoute();
    this.getBookingByDate();
    this.seekRoute();
    this.createRouter();
  }

  getBookingByDate() {
    this.app.get('/api/getBookingByDate/:id', async (req, res) => {
      let model = await db.modelsByApiRoute['timeTable'];
      let result = await model._model.find({ date: (req.params.id) }, { __v: 0 }).lean();
      res.json(result)

    });
  }

  createTablesAndViewsRoute() {
    this.app.get('/api/tablesAndViews', async (req, res) => {
      res.json("testing")
    });
  }


  createRouter() {
    let run = (req, res) => this.route(req, res);
    this.app.all('/api/:route', run);
    this.app.all('/api/:route/:id', run);
  }



  
  // WIP only finds a stationA and which route it belongs too. 
  seekRoute() {
    this.app.get('/api/seekRoute/:id', async (req, res) => {

      // example "Göteborg+Trelleborg"
      // Handle spaces ? "Stockholm C"
      const str = req.params.id;
      const splitArr = str.split("+");

      // if splitArr lenght > 1 : error , bad format.
      const stationA = splitArr[0];
      const stationB = splitArr[1];

      
      // The end result of query; initially "None".
      let searchResult = "None";

      // Case #1 - Get routes that contain both stations on single 
      try
      {
        // Using the view to connect stations to routes via ID.
        let model = await db.modelsByApiRoute['stationsInRoute'];

        // Get all train routes with related stations as childern in stations.
        let result = await model._model.find( { __v: 0 }).lean();


        // Outside loop goes through all trainRoutes
        // I should put this inside its own method.
        for(let y = 0; y < Object.values(result).length; y++)
        {
          let stationsRoute = result[y];

          // Abit confusing part here 'station' is actually the list 
          // of all stations under this trainRoute.
          for(let x = 0 ; x < stationsRoute['station'].length; x++)
          {

            let currentStation = result[y].station[x];

            if(currentStation['stationName'] === stationA){
             searchResult  =  ("Found " + stationA + " in route " + result[y].routeName);
            }
          }
        }

         res.json(searchResult);
      }
      catch(err)
      {
          res.json("{message : err}");
      }

    });
  }


  async route(req, res) {
    let { route, id } = req.params;
    let method = req.method.toLowerCase();
    let model = await db.modelsByApiRoute[route];
    if (!model) {
      res.status(404);
      res.json({ error: 'No such route' });
    }
    else {
      this[method](model, id, req, res);
    }
  }


  // async get(m, id, req, res) {
  //   id = !isNaN(+id) ? id : null;

  //   let result = await m._model
  //     .find({}, { __v: 0 }).lean();
  //   res.json({message : result});
  // }

  async get(m, id, req, res) {
    if (!req.params.id) {
      id = !isNaN(+id) ? id : null;

      let result = await m._model
        .find({}, { __v: 0 }).lean();
      // ? why unneccesary encapsulaton of result in an
      // object as message property

      // res.json({ message : result});

      res.json(result);
    }
    else {
      try {
        const found = await m._model.find({ _id: (req.params.id) }, { __v: 0 }).lean();
        if (found != null) {
          res.json(found);
        }
        else
          res.status(404).json({ message: err })
      }
      catch (err) {
        res.status(500).json({ messsage: err });
      }
    }
  }

  async post(m, id, req, res) {
    // not written yet, but should be quite simple to write
    let newPost = await m._model(req.body)
    let result = await newPost.save()
    res.json(result);
  }

  async put() {
    // not written yet, but should be quite simple to write
  }

  async delete(m, id, req, res) {
    if (!req.params.id) {
      res.json("You need to enter an Id of the object you want to delete")
    }
    else {
      let model = await db.modelsByApiRoute['tickets'];
      if (m === model) {
        let query = await m._model.find({ _id: (req.params.id) }).select('_id');
        let ticketToRemove = await m._model.findByIdAndRemove({ _id: (req.params.id) });

        res.json("Du har avbokat biljetten med nummer: " + query)
      }
      else {
        let objectToRemove = await m._model.findByIdAndRemove({ _id: (req.params.id) });
        if (!objectToRemove) {
          res.json("That object does not exist in the database")
        }
        else {
          res.json("You have removed " + objectToRemove)
        }
      }
    }
  }


  parseUrlQueryParams(url) {
    let operators = ['!=', '>=', '<=', '=', '>', '<', '≈'];
    let params = url.split('?', 2)[1];
    let keyVal = {};
    let ors = [];
    if (!params) { return [keyVal, ors] };
    for (let part of params.split('&')) {
      part = decodeURI(part);
      let operator = '';
      for (let op of operators) {
        if (part.includes(op)) {
          operator = op;
          break;
        }
      }
      if (!operator) { continue; }
      let [key, val] = part.split(operator);
      let or = key[0] === '|';
      or && (key = key.slice(1));
      ors[key] = or;
      val = isNaN(+val) ? val : +val;
      if (operator !== '=') { val = { [operator]: val } };
      keyVal[key] = val;
    }
    return [keyVal, ors];
  }

  whereFromParams(params, ors) {
    // STILL AS IN SQL VERSION
    // NEEDS REWRITE SO THAT WE BUILD A MONGO QUERY OBJECT
    let where = [];
    let whereVals = [];
    for (let [key, val] of Object.entries(params)) {
      let isObj = val && typeof val === 'object';
      let operator = isObj ? Object.keys(val)[0] : '=';
      val = isObj ? Object.values(val)[0] : val;
      operator = '≈' ? 'REGEXP' : '';
      where.push((ors[key] ? ' OR  ' : ' AND ') + key + ' ' + operator + ' ?');
      whereVals.push(val);
    }
    where = where.join('');
    return [where.slice(5), whereVals];
  }

}