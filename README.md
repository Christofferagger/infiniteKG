# infiniteKG 💭
A typescript app that enables you to grasp complex concepts visually via knowledge graphs🤩

Ask any question and receive an in-depth answer and a visual knowledge graph. Chat with the app and expand the graph as you build out your knowledge🧠

The project is highly inspired by @Yohei's [instagraph](https://github.com/yoheinakajima/instagraph), check it out😊

## Demo👀

https://github.com/Christofferagger/infiniteKG/assets/88538278/e57e0430-e0e6-473a-aeb1-b08d17e05506

## Tweet 🐔
Link...

## Set it up 🫡

### 1. Clone the repository
```
https://github.com/Christofferagger/infiniteKG.git
```

### 2. Rename the env example file with these commands
```
cd server
```
```
mv .env.example .env
```

### 3. Insert your openAI API key in the new .env file
Replace "Your-OpenAI-Key-Here" with your API key in the new .env file

### 4. Create a neo4j profile
[Link to signup](https://login.neo4j.com/u/signup/identifier?state=hKFo2SBDYjMwOWVyemN6YjdpSTVjc0dYNUszc3hzam9HcXRwQaFur3VuaXZlcnNhbC1sb2dpbqN0aWTZIHBLYmNManNpbmtTQ3ZNM2NzcXRUOHpfdkxUNE1oeFBJo2NpZNkgV1NMczYwNDdrT2pwVVNXODNnRFo0SnlZaElrNXpZVG8)

### 5. Create a new instance
1. Click on create new instance

In the .env file;

3. Replace your_neo4j_password with the generated password
4. Replace your_neo4j_username with neo4j
5. Replace your_neo4j_url with the connection URI located in the new instance

## 6. Install all dependencies
If still in server directory navigate to infiniteKG
```
cd ..
```
```
npm install
```

## 7. Run the application
```
npm start
```
