const fs = require('fs');
const express = require('express');
const uuid = require('uuid');
const app = express();

app.use(express.json());

app.get

app.get("/api", (req, res) => {
    let id = req.params.id;
    let files = fs.readdirSync('./artwork');
    let randomFile = files[Math.floor(Math.random() * files.length)];
    let data = JSON.parse(fs.readFileSync('./artwork/' + randomFile));
    if (!randomFile) {
        res.status(404).json({"mess":"Err: No Files Found"});
    } else {
        res.json({ "img": data.img, "author": data.author });
    }
});

app.post("/api/", (req, res) => {
    let body = req.body;
    let id = uuid.v4();
    if (!body.img || !body.pass) {
        res.status(400).json({ 
            "mess": "Err: Body Must Contain The Following",
            "exampleBody": {
                "img": "IMAGE_URL (REQUIRED)",
                "pass": "PASSWORD (REQUIRED)",
                "author": "YOUR_NAME (OPTIONAL)"
            }
        });
    } else {
        let data = JSON.stringify(body);
        fs.writeFileSync(`./artwork/${id}.json`, data);
        res.json({ "mess": "Sucsess", "id": id });
    }
});

app.delete("/api/:id", (req, res) => {
    let id = req.params.id;
    let file = require(`./artwork/${id}.json`);
    if (file.pass !== req.body.pass) {
        res.status(401).json({ "mess": "Incorrect password" });
    } else {
        fs.unlinkSync(`./artwork/${id}.json`);
        res.json({ "mess": "Deleted" });
    }
});

app.listen(5080, () => {
    console.log("Server started on port 5080");
});