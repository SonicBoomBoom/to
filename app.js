const express = require("express");

const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const date = require(__dirname + "/date.js")

const app = express();

const workItems = [];

mongoose.connect("mongodb://localhost:27017/toDoListDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const itemSchema = {
  name: {
    type: String,
    required: [1, "Please check your data entry, 'name' should be specified!"]
  }
};

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Welcome to your To Do List!"
});

const item2 = new Item({
  name: "Hit the '+' button to add a new item!"
});

const item3 = new Item({
  name: "<-- Hit this to delete an item!"
});

const defaultItems = [item1, item2, item3];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('view engine', 'ejs');

app.get("/", function(req, res) {
  Item.find({}, function(err, items) {
    if (err) {
      console.log(err);
    } else {
      if (items.length === 0) {
        Item.insertMany(defaultItems, function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log("Successfully saved default items to toDoListDB");
          }
        });
        res.redirect("/");
      } else {
        let day = date.getDate();

        res.render("list", {
          listTitle: day,
          newListItems: items
        });
      }
    }
  });
});

// app.get("/lists/:customListName", function(req, res) {
//   const CustomListItem = mongoose.model("CustomListItem", itemSchema);
//
//   res.render("list", {
//     listTitle: req.params.customListName,
//     newListItems: workItems
//   });
// });

app.get("/work", function(req, res) {
  res.render("list", {
    listTitle: "Work List",
    newListItems: workItems
  });
});

app.post("/", function(req, res) {
  const newItemName = req.body.newItem;

  let item = new Item({
    name: newItemName
  });

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    item.save();
    res.redirect("/");
  }
});

app.post("/delete", function(req, res) {
  const checkedItem_id = req.body.checkbox;

  Item.deleteOne({
    _id: checkedItem_id
  }, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully deleted checked item from DB!");
    }
  });
  res.redirect("/");
});

app.listen(3000, function() {
  console.log("Server started on port: 3000");
});
