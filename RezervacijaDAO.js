const ds = require("fs");

class RezervacijaDAO{
    ucitajRezervacije = function(){
        var rezervacijePodaci = ds.readFileSync("podaci/rezervacije.csv", "utf-8").trim().split("\n");
        return rezervacijePodaci;
    };

    dodajRezervaciju = function(rezervacija){
        var rezervacijePodaci = this.ucitajRezervacije();
        rezervacijePodaci.push(rezervacija);
        var noviCSV = rezervacijePodaci.join("\n");
        ds.writeFile(
            "podaci/rezervacije.csv",
            noviCSV,
            {flag: "w"},
            (greska) => {
                if(greska) console.log(greska);
            }
        );
    };

    brisiRezervaciju = function(id){
        var rezervacijePodaci = this.ucitajRezervacije();
        var noviCSV = "";
        var obrisanaRezervacija = "";
        for(var redakRezervacije of rezervacijePodaci){
            if(rezervacijePodaci.indexOf(redakRezervacije) != id){
                noviCSV += redakRezervacije + "\n";
            }else{
                obrisanaRezervacija = redakRezervacije;
            }
        }
        ds.writeFile(
            "podaci/rezervacije.csv",
            noviCSV.trim(),//.slice(0,-1),
            {flag: "w"},
            (greska) => {
                if(greska) console.log(greska);
            }
        );
        return obrisanaRezervacija;
    };

    azurirajRezervaciju = function(id, rezervacija){
        var rezervacijePodaci = this.ucitajRezervacije();
        for(var redakRezervacije of rezervacijePodaci){
            if(rezervacijePodaci.indexOf(redakRezervacije) === id){
                rezervacijePodaci[id] = rezervacija;
                break;
            }
        }
        var noviCSV = rezervacijePodaci.join("\n");
        ds.writeFile(
            "podaci/rezervacije.csv",
            noviCSV,
            {flag: "w"},
            (greska) => {
                if(greska) console.log(greska);
            }
        );
    };
}

module.exports = RezervacijaDAO;