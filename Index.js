const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');


const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

let Items = [] ;
let count = 1;

app.get('/', function(req,res){
    const filter = req.query.priority || 'ALL';
    let filterItems = Items;

    if(filter != 'ALL'){
        filterItems = Items.filter(Item => Item.priority.toLowerCase() === filter.toLowerCase());
    }
    res.render('list', {enter : filterItems, filter: filter});
});

app.post('/', function(req,res){
    
    console.log(req.body.enter);
    const task = req.body.enter;
    const priority = req.body.priority;

    if(!task.trim()){
        return res.send("<script>alert('Task Cannot be empty'); window.location='/'</script>");
    }


    Items.push({id: count++, task: task, priority: priority});
    res.redirect('/');
    
});

app.put('/edit/:id', function(req, res){
    const id = parseInt(req.params.id);
    const UpdateItem = req.body.enter;
    const UpdatePriority = req.body.priority;

    const Item = Items.find(t => t.id == id);

    if(Item){
        Item.task = UpdateItem;
        Item.priority = UpdatePriority;
    }
    res.redirect('/');
});

app.delete('/delete/:id', function(req, res){
    const id = parseInt(req.params.enter);
    const Item = Items.filter(t => t.id !== id);
    res.redirect('/');
});
app.listen(9000, function(){
    console.log('Server is started');
});