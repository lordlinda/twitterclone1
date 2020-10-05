const express = require('express')
const cors = require('cors')
const monk = require('monk')
const Filter = require('bad-words')
const rateLimit = require("express-rate-limit");

const filter = new Filter();

const app = express()

const db = monk(process.env.MONGO_URI || "localhost/meower")

const mews = db.get('mews')
app.use(cors())
app.use(express.json())

app.get('/mews', (req, res) => {
    mews.find()
        .then(mews => {
            
            res.json(mews)
        })

})

function isValidMew(mew) {
    return mew.name && mew.name.toString().trim() !== '' &&
        mew.content && mew.content.toString().trim() !== ''
}
//this middleware only runs for post method
app.use(rateLimit({
    windowMs: 30 * 1000, // 30 seconds
    max: 1 // limit each IP to 1 requests per windowMs
}));

app.post('/mews', (req, res) => {
    //console.log(req.body)
    if (isValidMew(req.body)) {
        //insert to db
        const mew = {
            name: filter.clean(req.body.name.toString()),
            content: filter.clean(req.body.content.toString()),
            created: new Date()
        }
        mews.insert(mew)
            .then(createdMew => {
                res.json(createdMew)
            })
    } else {
        res.status(422)
        res.json({
            message: "name and content are required"
        })
    }
})


app.listen(5000, () => {
    console.log('server is listening on port 5000')
})