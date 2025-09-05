const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

mongoose.connect(process.env.MONGO_URL{
    useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(()=> console.log('Databse connected successfully'))
.catch(err=>( console.log(err)));

const FirstSchema = new mongoose.Schema({
  name: { type: String, required: true },
  priority: String,
});

const dbitem = mongoose.model("task", FirstSchema);
// const item1 = new dbitem({
//   name: "Learn Node.js",
//   priority: "High"
// });
// const item2 = new dbitem({
//   name: "learn DevOps",
//   priority: "Medium"
// });
// const item3 = new dbitem({
//   name: "Learn to ride a bike",
//   priority: "Low"
// });

// dbitem.insertMany([item1, item2, item3]);
// let Items = [];
// let count = 1;

app.get("/", async function (req, res) {
  try {
    const foundItems = await dbitem.find({});
    const filter = (req.query.priority || "all").toLowerCase();
    const AlertMsg = req.query.AlertMsg || "";

    let filterItems = foundItems;

    if (filter !== "all") {
      filterItems = foundItems.filter(
        (item) =>
          item.priority && item.priority.toLowerCase() === filter.toLowerCase()
      );
    }
    res.render("list", {
      enter: filterItems,
      filter: filter,
      AlertMsg: AlertMsg,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/", async function (req, res) {
  try {
    const ItemName = req.body.enter;
    const priority = req.body.priority;

    if (!ItemName || !ItemName.trim()) {
      return res.redirect("/?AlertMsg= Please enter the task first :");
    }

    const newItem = new dbitem({ name: ItemName, priority: priority });
    await newItem.save();

    res.redirect("/?AlertMsg= Item Added in the Todo List Successfully");
  } catch (err) {
    console.log(err);
  }
  //   console.log(req.body.enter);
  //   const task = req.body.enter;
  //   const priority = req.body.priority;

  //   if (!task.trim()) {
  //     return res.send(
  //       "<script>alert('Task Cannot be empty'); window.location='/'</script>"
  //     );
  //   }

  //   Items.push({ id: count++, task: task, priority: priority });
  //   res.redirect("/");
});

app.put("/edit/:id", async function (req, res) {
  try {
    const id = req.params.id;
    const UpdateItem = req.body.enter;
    const UpdatePriority = req.body.priority;

    await dbitem.findByIdAndUpdate(id, {
      name: UpdateItem,
      priority: UpdatePriority,
    });

    res.redirect("/?AlertMsg= Item Updated Successfully");
  } catch (err) {
    console.log(err);
  }
});

app.delete("/delete/:id", async function (req, res) {
  try {
    const id = req.params.id;
    await dbitem.findByIdAndDelete(id);
    res.redirect("/?AlertMsg= Item Deleted Successfully");
  } catch (err) {
    console.log(err);
  }
});
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
