const bcrypt = require('bcryptjs/dist/bcrypt');
const http = require('http');
const app = require('./app');
const server = http.createServer(app);
const User = require('./model/user');
const jwt = require('jsonwebtoken');


const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;




//register
app.get('/register',async(req,res)=>{
    res.render("register.html");
})


app.post('/register', async (req, res) => {

    try {
        const { Name, password } = req.body;


        if (!(Name && password)) {
            res.status(400).send("All fields need to be filled");
        }
        const oldUser = await User.findOne({ Name });

        if (oldUser) {
            res.status(404).send("User already exists");
        }

        encryptedPassword = await bcrypt.hash(password, 10);


        const user = await User.create({
            Name,
            password: encryptedPassword,
        });

        const token = jwt.sign({
            user_id: user._id,
        }, process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            });

        user.token = token;

        res.status(201);
        res.render('login.html');
    } catch (error) {
        console.log(error);

    }

});






//login
app.get('/login',(req,res)=>{
    res.render('login.html');
})

app.post('/login', async(req, res) => {
    try {
        const { Name, password } =req.body;

        if(!(Name && password)){
            res.status(404).send('all inputs should be filled');
        }
        const user = await User.findOne({ Name });

        if(user && (await bcrypt.compare(password,user.password))) {
            const token = jwt.sign(
                {Name,},
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );

            user.token = token;

            res.status(200);
            res.render("secret.html")
        }else(
            res.send("incorrect name or password")
        )
    } catch (error) {
       console.log(error) 
    }
});


server.listen(port, () => {
    console.log(`Server running on port ${port}`);
})