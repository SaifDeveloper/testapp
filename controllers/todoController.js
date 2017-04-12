var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//Connect to the database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://test:test@ds145299.mlab.com:45299/b412032');

//Create a schema- This is like a blue print
var todoSchema =new mongoose.Schema({
    item:String
});

//Crate a model
var Todo = mongoose.model('Todo',todoSchema);

//var data = [{item:'get milk'},{item:'walk dog'},{item:'kick some coding'}];

var urlencodedParser = bodyParser.urlencoded({ extended: false });


module.exports = function (app) {

    app.get('/todo',function (req,res) {
        //get data from mongodb and pass it to view
        Todo.find({},function (err,data) {
            if(err) throw err;
            res.render('todo',{todos:data});
        });
    });

    app.post('/todo',urlencodedParser,function (req,res) {
        //get data from the view and add it to mongodb
        var newTodo = Todo(req.body).save(function (err,data) {//body refers to the url which will contain the details(item).
           if(err) throw err;
           res.json(data);
        });
    });

    app.delete('/todo/:item',function (req,res) {
        //delete the requested item from mongodb
        Todo.find({item: req.params.item.replace(/\-/g," ")}).remove(function (err,data) {
            if(err) throw err;
            res.json(data);
        });
    });
};