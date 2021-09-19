# part4-blogList Backend

A server app that powers BlogLister, a blogging application. It provides REST APIs for posting, requesting and commenting on blogs.

## APIs
### Base URL 
    baseUrl = https://bloglister-app.herokuapp.com/
### GET
#### [blogs](https://bloglister-app.herokuapp.com/api/blogs/)
    url: [$baseUrl]api/blogs/
    Method: GET

### POST
#### Sign Up - Use [BlogLister](https://bloglister-2.herokuapp.com/)(the App's frontend) or [Postman](https://www.postman.com/downloads/)

    // with Postman
    
    url:   [$baseUrl]api/users/       // https://bloglister-app.herokuapp.com/api/users/
    Method: POST
    Body:   {"username":"your username here", "name":"your name here", "password":"your password here" }
    
    **Example Response**
    
    {
    "blogs": [],
    "username": "registered username",
    "name": "registered name",
    "numberOfBlogs": 0,
    "id": "user id"
    }

#### Login - [BlogLister](https://bloglister-2.herokuapp.com/)(the App's frontend) or [Postman](https://www.postman.com/downloads/)

    ## with Postman
    
    url:   [$baseUrl]api/login/       // https://bloglister-app.herokuapp.com/api/login/
    Method: POST
    Body:   {"username":"your username here", "password":"your password here" }
    
    **Login Response Example**
    
    {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1pbmFzaCIsImlkIjoiNjE0NzZhMjI5Njk2YzgwMDA0ZTlkYTA4IiwiaWF0IjoxNjMyMDcyNTY5fQ._3oz-    NOWHbYYz2jgzJa8j6UNE1PDRBBSlZ6PPEf7n3Q-token example",
    "username": "registered username",
    "name": "registered name"
    }
    
    ** NOTE ** The token returned by the server is required for creating or modifying blogs: Authorization Header

#### Post an Blog/Article - [Postman](https://www.postman.com/downloads/)

    url:   [$baseUrl]api/blogs/       // https://bloglister-app.herokuapp.com/api/blogs/
    Method: POST
    Headers: {
           Authorization: {
                  token: bearer [token returned by the server after login]
           }
    }
    
    Body:   {"title":"title of the blog or article", "author":"author of the article", "url":"the url to the article being added" }
    
    ** Example Response **
    
    {
    "comments": [],
    "title": "Kotlin coroutines on Android",
    "author": "Android Documentation",
    "url": "https://developer.android.com/kotlin/coroutines?gclid=Cj0KCQjwv5uKBhD6ARIsAGv9a-zMDmjlqXAswuolui2ZBZf4EA8bC1x8Y1MNFmp2aJClmO5TxCynsosaAvUeEALw_wcB&gclsrc=aw.ds",
    "likes": 0,
    "user": "id of the user who added the blog",
    "id": "id of the added blog"
    }
 
 #### Post a Comment - [Postman](https://www.postman.com/downloads/)

    url:   [$baseUrl]api/blogs/:id/comments/       // https://bloglister-app.herokuapp.com/api/blogs/[id of the blog being commented]/comments/
                                                   //  You can use this:  https://bloglister-app.herokuapp.com/api/blogs/6103e79ce86a480584059197/comments
                                                   
    Method: POST
    Headers: {
           Authorization: {
                  token: bearer [token returned by the server after login]
           }
    }
    
    Body:   {"content":"your comment on the blog read" }
    
    ** Example Response **
    
    {
    "comments": [
        {
            "content": "I'll try Stripe in my next project, the API is simple.  👍",
            "id": "6106aab669fa2054340fea6b"
        },
        {
            "content": "nice one!",
            "id": "6106aaca69fa2054340fea6c"
        },
        {                                                         ↙️ newly added comment
            "content": "👏👏👏👏👏👏👏👏👏👏👏👏👏 😲",  
            "id": "61477fb89696c80004e9da0a"
        }
    ],
    "title": "A Stripe API Tutorial With React and Node.js",
    "author": " Ignacio Nicolas Aguirre",
    "url": "https://betterprogramming.pub/stripe-api-tutorial-with-react-and-node-js-1c8f2020a825",
    "likes": 7,
    "user": {
        "username": "username",
        "name": "name of blog owner",
        "id": "id of the blog owner"
    },
    "id": "6103e79ce86a480584059197"
    }
    

### PUT
#### Like a Blog

     url:   [$baseUrl]api/blogs/:id/         //  You can use this:  https://bloglister-app.herokuapp.com/api/blogs/6103e79ce86a480584059197/ 
                                                
                                                   
    Method: PUT
    Headers: {
           Authorization: {
                  token: bearer [token returned by the server after login]
           }
    }
    
    Body:   {"likes":"number" } e.g  {"likes": 1 }
    
    ** Example Response **
    
    {
    "comments": [
        "6106aab669fa2054340fea6b",
        "6106aaca69fa2054340fea6c",
        "61477fb89696c80004e9da0a"
    ],
    "title": "A Stripe API Tutorial With React and Node.js",
    "author": " Ignacio Nicolas Aguirre",
    "url": "https://betterprogramming.pub/stripe-api-tutorial-with-react-and-node-js-1c8f2020a825",
    "likes": 3,  ⬅️ **field modified**
    "user": "id of blog owner",
    "id": "6103e79ce86a480584059197"
    }
    
### DELETE

#### A blog can only be deleted by an authenticated user who added the blog
     
     url:       [$baseUrl]api/blogs/id
     Method:    DELETE
     Authorization: bearer Token
     
     
## Installation and Usage
Navigate to the the appropriate directory on your system , git clone and run the application. The app listens for request on port 3007. 

    git clone https://github.com/ambeche/part4-blogList.git
    
    ##  navigate to project root directory
    cd part4-blogList 
    
    ## installs project dependencies
    npm install  
    
    ## create a dot env file
    
    touch .env 
    
    ## open the .env file add and save the following content:
    
    PORT=3007
    MONGODB_URI=[specify ur MongoDB URI]
    ENCODING=[your secrete word for password hashing here]
         
         
    ## run the server with command: 
    npm start 

### NOTE: Node.js with at least version 14 is required to run the application. [Node](https://nodejs.org/en/download/)


    
    
    
   


   


