/**
 * Created by max on 21.09.2015.
 */
"use strict";
var express = require("express");
var app = express();
var path = require("path");
var session = require("express-session");
var bodyParser = require("body-parser");
var MongoStore = require("connect-mongo")(session);
var ObjectID = require('mongodb').ObjectID;
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var db = new Db('tutor', new Server('localhost', 27017, {safe: true}, {auto_reconnect: true}));
//var db = new Db('sections', new Server('localhost', 27017, {safe: true}, {auto_reconnect: true}));

db.open(function () {
    console.log("mongo opened");
    db.collection("notes", function (err, notes) {
        db.notes = notes;
    });
    db.collection("sections", function (err, sections) {
        db.sections = sections;
    });
    db.collection("users", function (err, users) {
        db.users = users;
    });
    db.collection("countries", function (err, countries) {
        db.countries = countries;
    });
    db.collection("cities", function (err, cities) {
        db.cities = cities;
    });
});

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
    secret: 'angular_tutorial',
    resave: true,
    saveUninitialized: true
}));
/*app.use(
 session({
 store: new MongoStore({url: "mongodb://localhost:27017/angular_session"}),
 secret: "angular_tutorial",
 resave: true,
 saveUninitialized: true
 })
 );*/

app.listen(3000);

app.get("/notes", function (req, res) {
    var userName = req.session.userName ? req.session.userName : 'demo';

    req.query.user = userName;

    console.log("get notes request: " + JSON.stringify(req.query));

    db.notes.find(req.query).toArray(function (err, items) {
        if (err) {
            console.log("error " + err);
            res.end();
        } else {
            console.log("send " + items);
            res.send(items);
        }
    });
});

app.post("/notes", function (req, res) {
    if (req.session.userName == undefined) {
        res.sendStatus(403);
        console.log("post notes:" + JSON.stringify(req.body) + " unauthorised");
        return;
    }

    console.log("insert: " + req.body);
    db.notes.insertOne(req.body);
    res.end();
});

app.delete("/notes", function (req, res) {
    if (req.session.userName == undefined) {
        res.sendStatus(403);
        console.log("delete notes: " + JSON.stringify(req.query) + ". unauthorised");
        return;
    }

    if (req.query.id) {
        var id = new ObjectID(req.query.id);
        db.notes.remove({_id: id}, function (err) {
            if (err) {
                console.log("error " + err);
            }
        });
    }
    res.end();
});

app.put("/notes", function (req, res) {
    if (req.session.userName == undefined) {
        res.sendStatus(403);
        console.log("put notes: " + JSON.stringify(req.body) + ". unauthorised");
        return;
    }

    db.notes.find().toArray(function (err, items) {
        var id = req.body.id;
        var note = items.filter(function (note) {
            return note._id == id;
        })
            .pop();
        var min = items
            .map(function (note) {
                return note.order;
            })
            .reduce(function (prev, curr) {
                return Math.min(prev || 0, curr || 0);
            });
        note.order = (min || 0) - 1;
        var oid = new ObjectID(id);
        db.notes.updateOne({_id: oid}, {$set: {order: note.order}});

        res.end();
    });
});

app.get("/sections", function (req, res) {

    var userName = req.session.userName ? req.session.userName : 'demo';
    req.query.user = userName;

    console.log("get sections: " + JSON.stringify(req.query));
    db.sections.find(req.query).toArray(function (err, items) {
        if (err) {
            console.log("error on get sections: " + err);
            res.end();
        }
        console.log(items);
        res.send(items);
    });
});

app.post("/sections", function (req, res) {
    if (req.session.userName == undefined) {
        res.sendStatus(403);
        console.log("post sections:" + JSON.stringify(req.body) + " unauthorised");
        return;
    }

    db.sections.insert(req.body);
    res.end();
});

app.put("/section/:id", function (req, res) {
    if (req.session.userName == undefined) {
        res.sendStatus(403);
        console.log("put sections:" + JSON.stringify(req.query) + " unauthorised");
        return;
    }
    db.sections.update({_id: new ObjectID(req.params.id)}, {$set: req.body});
    res.end();
});

app.get("/isUserUnique", function (req, res) {
    console.log("check user: " + JSON.stringify(req.query));
    db.users.findOne(req.query, function (err, user) {
        if (user) {
            res.send(false);
        } else {
            res.send(true);
        }
    });
});

app.post('/user', function (req, res) {
    console.log("insert user: " + JSON.stringify(req.body));
    db.users.insertOne(req.body)
        .then(function () {
            res.end();
        }
    );
});

app.get("/countries", function (req, res) {
    db.countries.find({}, {name: 1, _id: 0}).toArray(function (err, items) {
        res.send(items);
    })
});

app.get("/cities", function (req, res) {
    console.log(JSON.stringify(req.query));
    db.cities.find(req.query, {name: 1, _id: 0})
        .toArray(function (err, arr) {
            res.send(arr);
        });
});

app.post("/login", function (req, res) {

    db.users.find({
        name: req.body.login,
        password: req.body.password
    })
        .toArray(function (err, arr) {
            res.send(arr.length > 0);
        });
});