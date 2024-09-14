// jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const request = require("request");


const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req,res){

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    //console.log(firstName, lastName, email);

    const data = {
        members: [
            {
                email_address: email, 
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsondata = JSON.stringify(data);

    const url = "https://us14.api.mailchimp.com/3.0/lists/bf5cd0cdde"

    const options = {
        method: "POST",
        auth: "Monkey:c28e27b646ba90c2a594094994a652b5-us14"
    }

    const request = https.request(url, options, function(response){

        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }else{
            res.sendFile(__dirname+"/failure.html")
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        });

    });

    app.post("/failure", function(req,res){

        res.redirect("/");

    });

    request.write(jsondata);
    request.end();


})

app.listen(3000,function(){
    console.log("Server is running on port 3000...");
});





// MAILCHIMP API: c28e27b646ba90c2a594094994a652b5-us14

// Unique Audience ID for: MonkeyMan
// bf5cd0cdde