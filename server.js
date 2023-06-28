const express = require("/usr/lib/node_modules/express");
const generirajTablicu = require("./generirajTablicu.js");
const RezervacijaDAO = require("./RezervacijaDAO.js");
const fs = require("fs");
const portovi = require("/var/www/OWT/2023/portovi.js");
const port = portovi.asalov21;
const server = express();
const putanja = __dirname;
const rezdao = new RezervacijaDAO();
server.use(express.urlencoded({extended: true}));
server.use(express.json());
server.delete("/api/rezervacije/:id", (zahtjev, odgovor) => {
    let id = zahtjev.params.id;
    if(rezdao.brisiRezervaciju(id)){
        odgovor.status(200);
        odgovor.send(JSON.stringify({poruka: "Podaci obrisani"}));
    }else{
        odgovor.status(417);
        odgovor.send(JSON.stringify({greska: "Nevaljani podaci"}));
    }
})
server.put("/api/rezervacije/:id", (zahtjev, odgovor) => {
    let id = zahtjev.params.id;
    let rezervacijaZahtjev = zahtjev.body;
    if(rezervacijaZahtjev === null || rezervacijaZahtjev["prezime"] === undefined){
        odgovor.status(417);
        odgovor.send(JSON.stringify({greska: "Nevaljani podaci"}));
    }else{
        let rezervacija = "";
        rezervacija += rezervacijaZahtjev["ime"] + ";";
        rezervacija += rezervacijaZahtjev["prezime"] + ";";
        rezervacija += rezervacijaZahtjev["email"] + ";";
        rezervacija += rezervacijaZahtjev["telefon"] + ";";
        rezervacija += rezervacijaZahtjev["soba"] + ";";
        rezervacija += rezervacijaZahtjev["obrok"] + ";";
        rezervacija += rezervacijaZahtjev["datum"] + ";";
        rezervacija += rezervacijaZahtjev["vrijeme"] + ";";
        rezervacija += rezervacijaZahtjev["broj"] + "\r";
        rezdao.azurirajRezervaciju(id,rezervacija);
        odgovor.status(200);
        odgovor.send(JSON.stringify({prouka: "Podaci izmjenjeni"}));
    }
})
server.post("/api/rezervacije/:id", (zahtjev, odgovor) => {
    odgovor.status(405);
    odgovor.send(JSON.stringify({greska: "Metoda nije dopuštena"}));
})
server.get("/api/rezervacije/:id", (zahtjev, odgovor) => {
    let id = zahtjev.params.id;
    let rezervacijePodaci = rezdao.ucitajRezervacije();
    if(rezervacijePodaci[id] === undefined){
        odgovor.status(404);
        odgovor.send(JSON.stringify({greska: "Nema resursa"}));
    }else{
        //rezervacijePodaci.pop();
        let noviJSON = "[";
        noviJSON += "{";
        let red = rezervacijePodaci[id];
        let redakRezervacije = red.split(";");
        let j=0;
        noviJSON += `"ime": "${redakRezervacije[j++]}",`;
        noviJSON += `"prezime": "${redakRezervacije[j++]}",`;
        noviJSON += `"email": "${redakRezervacije[j++]}",`;
        noviJSON += `"telefon": "${redakRezervacije[j++]}",`;
        noviJSON += `"soba": "${redakRezervacije[j++]}",`;
        noviJSON += `"obrook": "${redakRezervacije[j++]}",`;
        noviJSON += `"datum": "${redakRezervacije[j++]}",`;
        noviJSON += `"vrijeme": "${redakRezervacije[j++]}",`;
        if(redakRezervacije[j].length==1){
            noviJSON += `"broj": "${redakRezervacije[j++]}"},`;
        }else{
            noviJSON += `"broj": "${redakRezervacije[j++].slice(0,-1)}"},`;
        }
        
        
        noviJSON = noviJSON.slice(0,-1);
        noviJSON += "]";
        noviJSON = JSON.parse(noviJSON);
        odgovor.status(200);
        odgovor.send(noviJSON);
    }
})
server.delete("/api/rezervacije", (zahtjev, odgovor) => {
    odgovor.status(501);
    odgovor.send(JSON.stringify({greska: "Metoda nije implementirana"}));
})
server.put("/api/rezervacije", (zahtjev, odgovor) => {
    odgovor.status(501);
    odgovor.send(JSON.stringify({greska: "Metoda nije implementirana"}));
})
server.post("/api/rezervacije", (zahtjev, odgovor) => {
    let rezervacijaZahtjev = zahtjev.body;
    if(rezervacijaZahtjev === null || rezervacijaZahtjev["prezime"] === undefined){
        odgovor.status(417);
        odgovor.send(JSON.stringify({greska: "Nevaljani podaci"}));
    }else{
        let rezervacija = "";
        rezervacija += rezervacijaZahtjev["ime"] + ";";
        rezervacija += rezervacijaZahtjev["prezime"] + ";";
        rezervacija += rezervacijaZahtjev["email"] + ";";
        rezervacija += rezervacijaZahtjev["telefon"] + ";";
        rezervacija += rezervacijaZahtjev["soba"] + ";";
        rezervacija += rezervacijaZahtjev["obrok"] + ";";
        rezervacija += rezervacijaZahtjev["datum"] + ";";
        rezervacija += rezervacijaZahtjev["vrijeme"] + ";";
        rezervacija += rezervacijaZahtjev["broj"] + "\r";
        rezdao.dodajRezervaciju(rezervacija);
        odgovor.status(200);
        odgovor.send(JSON.stringify({poruka: "Podaci dodani"}));
    }
})
server.get("/api/rezervacije", (zahtjev, odgovor) => {
    let rezervacijePodaci = rezdao.ucitajRezervacije();
    //rezervacijePodaci.pop();
    const idBrisanje = [];
    let noviJSON = "[";
    for(let red of rezervacijePodaci){
        let redakRezervacije = red.split(";");
        if(redakRezervacije[1] === undefined || redakRezervacije[1] === ""){
            idBrisanje.push(rezervacijePodaci.indexOf(red));
            continue;
        }
        noviJSON += "{";
        let i=0;
        noviJSON += `"ime": "${redakRezervacije[i++]}",`;
        noviJSON += `"prezime": "${redakRezervacije[i++]}",`;
        noviJSON += `"email": "${redakRezervacije[i++]}",`;
        noviJSON += `"telefon": "${redakRezervacije[i++]}",`;
        noviJSON += `"soba": "${redakRezervacije[i++]}",`;
        noviJSON += `"obrook": "${redakRezervacije[i++]}",`;
        noviJSON += `"datum": "${redakRezervacije[i++]}",`;
        noviJSON += `"vrijeme": "${redakRezervacije[i++]}",`;
        if(redakRezervacije[i].length==1){
            noviJSON += `"broj": "${redakRezervacije[i++]}"},`;
        }else{
            noviJSON += `"broj": "${redakRezervacije[i++].slice(0,-1)}"},`;
        }
       
    }
    noviJSON = noviJSON.slice(0,-1);
    noviJSON += "]";
    noviJSON = JSON.parse(noviJSON);
    for(id of idBrisanje){
        rezdao.brisiRezervaciju(id);
    }
    odgovor.status(200);
    odgovor.send(noviJSON);
})
server.get("/", (zahtjev, odgovor) => {
    odgovor.sendFile(putanja + "/html/index.html");
})
server.use("/css", express.static("./css"));
server.use("/dokumenti", express.static("./dokumenti"));
server.use("/autor", express.static("./dokumentacija/autor.html"));
server.use("/dokumentacija", express.static("./dokumentacija/dokumentacija.html"));
server.use("/jednokrevetna", express.static("./html/jednokrevetna.html"));
server.use("/obiteljska", express.static("./html/obiteljska.html"));
server.use("/penthouse", express.static("./html/penthouse.html"));
server.use("/kontakt", express.static("./html/kontakt.html"));
server.get("/rezervacija", (zahtjev, odgovor) => {
    odgovor.sendFile(putanja + "/html/rezervacija.html");
})
server.get("/javascript", (zahtjev, odgovor) => {
    odgovor.sendFile(putanja + "/jsk/asalov21.js");
})
server.get("/dinamicna", (zahtjev, odgovor) => {
    var zaglavlje = fs.readFileSync("podaci/zaglavlje.txt", "utf-8");
    var podnozje = fs.readFileSync("podaci/podnozje.txt", "utf-8");
    odgovor.write(zaglavlje);
    odgovor.write(generirajTablicu.generirajTablicu());
    odgovor.write(podnozje);
    odgovor.end();
})
server.use((zahtjev, odgovor) => {
    odgovor.status(404);
    odgovor.send(`<!DOCTYPE html><html lang="hr"><head> <meta charset="UTF-8"> <meta 
    name="viewport" content="width=device-width, initial-scale=1.0"> <title>Hotel Morska 
    Oaza | 404</title> <style> *{ font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 
    'Lucida Grande', 'Lucida Sans', Arial, sans-serif; } body{ background-color: #0b132b; 
    margin: 0; padding: 0; width: 98%; } #prebaciTemuGumb{ position: absolute; top: 10px;
    left: 10px; z-index: 10; background-color: #3a506b; color: #6fffe9; border: 2px solid #6fffe9;
    padding: 10px; font-weight: bold; font-size: 1rem; transition: 0.5s;} #prebaciTemuGumb:hover{
    background-color: #6fffe9; color: #0b132b; }.serif{ font-family: Georgia, 'Times New Roman', 
    Times, serif; } #logo{ width: 100px; float: left; position: relative; padding: 10px; 
    } #naslov.serif{ font-weight: bold; color: white; text-transform: uppercase; padding: 
    30px 0px; margin: 25px 0px; font-size: 3rem; text-align: center; position: relative; 
    background-color: transparent; } header{ margin: auto; width: 50%; } #banner{ height: 
    170px; width: 98%; position: absolute; top: 10px; left: 10px; opacity: 20%; } h2{ color: 
    #6fffe9; text-transform: uppercase; text-align: center; font-size: 2rem; background-color: 
    #3a506b; padding: 20px 0px; width: 33%; margin: 20px auto 0px; border: 2px solid #6fffe9; 
    border-radius: 20px; letter-spacing: 5px; } #number404{ font-size: 15rem; color: #6fffe9; 
    font-weight: bold; display: block; text-align: center; margin-right: 600px; } #povratak{ 
    font-size: 1.75rem; color: #6fffe9; text-align: center; transition: 0.5s; display: block; 
    margin: 30px auto; } #povratak:hover{ color: #3a506b; } @media (max-width: 480px){
    #prebaciTemuGumb{ font-size: 0.75rem;}
    #naslov.serif{ font-size: 1.4rem; } h2{ width: 90%; font-size: 1.5rem; } #number404{ 
    font-size: 10rem; margin-right: 0px; } #povratak{ 
    font-size: 1.4rem; } } @media (min-width: 481px) and (max-width: 1024px){ body{ 
    background-color: white; } #naslov.serif{ font-size: 2rem; color: #0b132b; } #banner{ 
    opacity: 50%; } h2{ background-color: #6fffe9; color: #0b132b; border-color: #0b132b; 
    font-size: 1.75rem; width: 60%; } #number404{ font-size: 12.5rem; color: #0b132b; 
    margin-right: 0px; } #povratak{ font-size: 1.75rem; color: #0b132b; } #povratak:hover{ 
    color: #6fffe9; } } 
    </style><script type="text/javascript" src="/javascript"></script>
    </head><body> <header><button id="prebaciTemuGumb" type="button">Prebaci se na x temu</button>
    <img id="banner" src="dokumenti/slike/banner.jpeg" 
    alt="Banner"> <a href="/"><img id="logo" src="dokumenti/slike/logo.PNG" alt="Logo 
    hotela"></a> <h1 id="naslov" class="serif">Hotel Morska Oaza</h1> </header> <div 
    id="number404">404</div> <h2 class="serif">Stranica ne postoji</h2> <a id="povratak" 
    href="/">Povratak na početnu</a></body></html>`);
})
server.listen(port, () => {
    console.log(`Server pokrenut na portu: ${port}`);
})