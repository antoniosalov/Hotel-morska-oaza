document.addEventListener("DOMContentLoaded", pokreniFunkcije);

var tekstGreska = "";
var porukaGreskeVidljiva;

var regularniIzraz = /[!#<>?]/;

var focusElement = -1;

var stupnjevi = 0;

var translacija = 0;
var smjer = "poz";

var iskrivi = 0;

var sviKolacici = document.cookie.split(";");
const nazivKolacica = [];
const vrijednostKolacica = [];

const datum = new Date();
var trenutniDan = String(datum.getDate()).padStart(2, "0");
var trenutniMjesec = String(datum.getMonth()+1).padStart(2, "0");
var trenutnaGodina = String(datum.getFullYear());
var trenutniSat = String(datum.getHours()).padStart(2, "0");
var trenutneMinute = String(datum.getMinutes()).padStart(2, "0");

var datumIspravan = false;

function pokreniFunkcije(){
    kreirajKolacice();
    if(document.title === "Hotel Morska Oaza | Cjenik") informacijeCjenika();
    if(document.title === "Hotel Morska Oaza | Rezervacija") provjeraObrazac();
    if(document.title === "Hotel Morska Oaza | Autor") animacijeAutor();
}

function informacijeCjenika(){
    var informacijeRetka = document.getElementById("informacijeRetka");
    allTrs = document.getElementsByTagName("tr");
    for(let i=0; i<allTrs.length; i++){
        allTrs[i].addEventListener("mouseover", function(){
            if(window.innerWidth <= 480){
                informacijeRetka.innerText += "|";
                allThs = allTrs[i].getElementsByTagName("th");
                allTds = allTrs[i].getElementsByTagName("td");
                if(allThs.length > 0){
                    for(let j=0; j<allThs.length; j++){
                        if(allThs[j].className === "" || allThs[j].className === undefined){
                            informacijeRetka.innerText += " " + allThs[j].innerText + " | ";
                        }
                    }
                    allThs = allTrs[i+1].getElementsByTagName("th");
                    for(let j=0; j<allThs.length; j++){
                        if(allThs[j].className === "" || allThs[j].className === undefined){
                            informacijeRetka.innerText += " " + allThs[j].innerText + " | ";
                        }
                    }
                }else{
                    for(let j=0; j<allTds.length; j++){
                        if(allTds[j].className === "" || allTds[j].className === undefined){
                            informacijeRetka.innerText += " " + allTds[j].innerText + " | ";
                        }
                    }
                }
                informacijeRetka.innerHTML += "<br>";
            }
        })
    }
}

function provjeraObrazac(){
    if(!nazivKolacica.includes(" rezervacije")){
        brojRezervacija = document.getElementById("brojRezervacija");
        brojRezervacija.innerText = "Broj rezervacija: 0";
    }else{
        brojRezervacija.innerText = `Broj rezervacija: ${vrijednostKolacica[nazivKolacica.indexOf(" rezervacije")]}`;
    }
    vrijeme = document.getElementById("vrijeme");
    porukaGreske = document.getElementById("porukaGreske");
    porukaGreske.style = "display: none;";
    porukaGreskeVidljiva = false;
    gumbSubmit = document.getElementById("gumbSubmit");
    gumbSubmit.addEventListener("mouseover", function(){
        focusElement = -1;
        gumbSubmit.addEventListener("click",provjeraGreske);
    });
    gumbSubmit.addEventListener("focus", function(){
        setTimeout(function(){
            if(!porukaGreskeVidljiva){
                povecanjeKolacica();
            }
        },1000)
    });
    allInputs = document.getElementsByTagName("input");
    var focusPostoji = false;
    for(let i=0; i<allInputs.length-2; i++){
        allInputs[i].addEventListener("focusin",function(){
            focusElement = i;
            allInputs[i].addEventListener("focusout",provjeraGreske);
            focusPostoji = true;
        })
        if(focusPostoji){
            break;
        }
    }
}

function provjeraGreske(dogadaj){
    allInputs = document.getElementsByTagName("input");
    for(let i=0; i<allInputs.length-2; i++){
        if(focusElement > -1 && focusElement !== i){
            continue;
        }
        if(allInputs[i].value === ""){
            allInputs[i].style = "border-color: red;";
            if(!tekstGreska.includes("Prije slanja obrasca potrebno je ispuniti "+allInputs[i].getAttribute("name"))){
                tekstGreska += "Prije slanja obrasca potrebno je ispuniti "+allInputs[i].getAttribute("name")+". ";
                if(allInputs[i].getAttribute("type") === "date"){
                    vrijeme.disabled = true;
                    vrijeme.value = "";
                }
            }
        }else{
            if(tekstGreska.includes("Prije slanja obrasca potrebno je ispuniti "+allInputs[i].getAttribute("name"))){
                tekstGreska = tekstGreska.replace("Prije slanja obrasca potrebno je ispuniti "+allInputs[i].getAttribute("name")+". ","");
                allInputs[i].style = "border-color: #6fffe9;";
                if(allInputs[i].getAttribute("type") === "date"){
                    vrijeme.disabled = false;
                }
            }
        }
        if(allInputs[i].getAttribute("type") === "text" || allInputs[i].getAttribute("type") === "email"){
            if(regularniIzraz.test(allInputs[i].value.trim())){
                allInputs[i].style = "border-color: red;";
                if(!tekstGreska.includes(allInputs[i].getAttribute("name")+" ne smije sadržavati specijalne znakove (!,?,#,<,>).")){
                    tekstGreska += allInputs[i].getAttribute("name")+" ne smije sadržavati specijalne znakove (!,?,#,<,>). ";
                }
            }else{
                if(tekstGreska.includes(allInputs[i].getAttribute("name")+" ne smije sadržavati specijalne znakove (!,?,#,<,>).")){
                    tekstGreska = tekstGreska.replace(allInputs[i].getAttribute("name")+" ne smije sadržavati specijalne znakove (!,?,#,<,>). ","");
                    allInputs[i].style = "border-color: #6fffe9;";
                }
            }
        }
        if(allInputs[i].getAttribute("type") === "date" && allInputs[i].value.length > 0){
            if((allInputs[i].value.substring(0,4) < trenutnaGodina) || (allInputs[i].value.substring(0,4) === trenutnaGodina && allInputs[i].value.substring(5,7) < trenutniMjesec) || (allInputs[i].value.substring(0,4) === trenutnaGodina && allInputs[i].value.substring(5,7) === trenutniMjesec && allInputs[i].value.substring(8) < trenutniDan)){
                allInputs[i].style = "border-color: red;";
                if(!tekstGreska.includes("Odabrani datum ne smije biti u prošlosti.")){
                    tekstGreska += "Odabrani datum ne smije biti u prošlosti. ";
                    vrijeme.disabled = true;
                    vrijeme.value = "";
                }
            }else{
                if(tekstGreska.includes("Odabrani datum ne smije biti u prošlosti.")){
                    tekstGreska = tekstGreska.replace("Odabrani datum ne smije biti u prošlosti. ","");
                    allInputs[i].style = "border-color: #6fffe9;";
                    vrijeme.disabled = false;
                }
            }
        }
        if(allInputs[i].getAttribute("type") === "time" && allInputs[i].value.length > 0){
            if(allInputs[i-1].value.substring(0,4) === trenutnaGodina && allInputs[i-1].value.substring(5,7) == trenutniMjesec && allInputs[i-1].value.substring(8) === trenutniDan){
                if((allInputs[i].value.substring(0,2) < trenutniSat) || (allInputs[i].value.substring(0,2) === trenutniSat && allInputs[i].value.substring(3) < trenutneMinute)){
                    allInputs[i].style = "border-color: red;";
                    if(!tekstGreska.includes("Ako je odabrani datum današnji datum, ne može se unijeti vrijeme koje je manje od trenutnog vremena.")){
                        tekstGreska += "Ako je odabrani datum današnji datum, ne može se unijeti vrijeme koje je manje od trenutnog vremena. ";
                    }
                }else{
                    if(tekstGreska.includes("Ako je odabrani datum današnji datum, ne može se unijeti vrijeme koje je manje od trenutnog vremena.")){
                        tekstGreska = tekstGreska.replace("Ako je odabrani datum današnji datum, ne može se unijeti vrijeme koje je manje od trenutnog vremena. ","");
                        allInputs[i].style = "border-color: #6fffe9;";
                    }
                }
            }
        }
    }
    soba = document.getElementById("soba");
    obrok = document.getElementById("obrok");
    if(soba.value === 0 || obrok.value === 0){
        tekstGreska += "U padajućem izborniku mora biti odabrana barem jedna opcija. ";
        soba.style = "border-color: red;";
        obrok.style = "border-color: red;";
    }else{
        tekstGreska = tekstGreska.replace("U padajućem izborniku mora biti odabrana barem jedna opcija. ","");
        soba.style = "border-color: #6fffe9;";
        obrok.style = "border-color: #6fffe9;";
    }
    if(tekstGreska.length > 0){
        var ispisGreska = "";
        if(tekstGreska.includes("potrebno je ispuniti")){
            ispisGreska += "Prije slanja obrasca potrebno je ispuniti sve podatke. ";
        }
        if(tekstGreska.includes("specijalne znakove")){
            ispisGreska += "Svi tekstualni podaci ne smiju sadržavati specijalne znakove (!,?,#,<,>). ";
        }
        if(tekstGreska.includes("u prošlosti")){
            ispisGreska += "Odabrani datum ne smije biti u prošlosti. ";
        }
        if(tekstGreska.includes("današnji datum")){
            ispisGreska += "Ako je odabrani datum današnji datum, ne može se unijeti vrijeme koje je manje od trenutnog vremena. ";
        }
        if(tekstGreska.includes("barem jedna")){
            ispisGreska += "U padajućem izborniku mora biti odabrana barem jedna opcija. ";
        }
        porukaGreske.innerText = ispisGreska;
        porukaGreske.style = "display: visible;";
        porukaGreskeVidljiva = true;
        porukaGreske.addEventListener("click", function(){
            porukaGreske.style = "display: none;";
            porukaGreskeVidljiva = false;
        })
        dogadaj.preventDefault();
        return ispisGreska;
    }else{
        return "";
    }
}

function povecanjeKolacica(){
    if(!nazivKolacica.includes(" rezervacije")){
        document.cookie = "rezervacije=1";
        brojRezervacija = document.getElementById("brojRezervacija");
        brojRezervacija.innerText = "Broj rezervacija: 1";
        sviKolacici = document.cookie.split(";");
        for(let i=0; i<sviKolacici.length; i++){
            nazivKolacica[i] = sviKolacici[i].split("=")[0];
            vrijednostKolacica[i] = sviKolacici[i].split("=")[1];
        }
    }else{
        sviKolacici = document.cookie.split(";");
        for(let i=0; i<sviKolacici.length; i++){
            nazivKolacica[i] = sviKolacici[i].split("=")[0];
            vrijednostKolacica[i] = sviKolacici[i].split("=")[1];
        }
        let novaVrijednost = parseInt(vrijednostKolacica[nazivKolacica.indexOf(" rezervacije")]);
        novaVrijednost++;
        document.cookie = `rezervacije=${novaVrijednost.toString()}`;
        sviKolacici = document.cookie.split(";");
        for(let i=0; i<sviKolacici.length; i++){
            nazivKolacica[i] = sviKolacici[i].split("=")[0];
            vrijednostKolacica[i] = sviKolacici[i].split("=")[1];
        }
        brojRezervacija.innerText = `Broj rezervacija: ${vrijednostKolacica[nazivKolacica.indexOf(" rezervacije")]}`;
    }
}

function animacijeAutor(){
    slikaAutor = document.getElementById("slikaAutor");
    slikaAutor.addEventListener("click", rotacijaSlike);
    autorSmjer = document.getElementById("autorSmjer");
    autorSmjer.addEventListener("click", translacijaSmjera);
    autorIme = document.getElementById("autorIme");
    autorIme.addEventListener("click", iskrivljenoIme);
}

function rotacijaSlike(){
    stupnjevi = (stupnjevi+1)%360;
    slikaAutor.style.transform = `rotate(${stupnjevi}deg)`;
    setTimeout('rotacijaSlike()',15);
}

function translacijaSmjera(){
    if(window.innerWidth > 480 && window.innerWidth <= 1024){
        if(smjer === "poz"){
            translacija += 1;
            if(translacija>250) smjer = "neg";
        }else{
            translacija -= 1;
            if(translacija<1) smjer = "poz";
        }
    }else if(window.innerWidth <= 480){
        if(smjer === "poz"){
            translacija += 1;
            if(translacija>50) smjer = "neg";
        }else{
            translacija -= 1;
            if(translacija<1) smjer = "poz";
        }
    }else{
        if(smjer === "poz"){
            translacija += 1;
            if(translacija>900) smjer = "neg";
        }else{
            translacija -= 1;
            if(translacija<1) smjer = "poz";
        }
    }
    autorSmjer.style.transform = `translate(${translacija}px)`;
    setTimeout('translacijaSmjera()',7.5);
}

function iskrivljenoIme(){
    iskrivi = (iskrivi+1)%180;
    while(iskrivi >= 80 && iskrivi <= 100){
        iskrivi++;
    }
    autorIme.style.transform = `skewX(${iskrivi}deg)`;
    setTimeout('iskrivljenoIme()',10);
}

function kreirajKolacice(){
    prebaciTemuGumb = document.getElementById("prebaciTemuGumb");
    sviKolacici = document.cookie.split(";");
    for(let i=0; i<sviKolacici.length; i++){
        nazivKolacica[i] = sviKolacici[i].split("=")[0];
        vrijednostKolacica[i] = sviKolacici[i].split("=")[1];
    }
    if(!nazivKolacica.includes(" tema")){
        document.cookie = "tema=svijetlu";
        sviKolacici = document.cookie.split(";");
        for(let i=0; i<sviKolacici.length; i++){
            nazivKolacica[i] = sviKolacici[i].split("=")[0];
            vrijednostKolacica[i] = sviKolacici[i].split("=")[1];
        }
    }
    prebaciTemuGumb.innerText = "Prebaci se na x temu";
    prebaciTemuGumb.innerText = prebaciTemuGumb.innerText.replace("x",vrijednostKolacica[nazivKolacica.indexOf(" tema")]);
    var trenutnaTema = vrijednostKolacica[nazivKolacica.indexOf(" tema")];
    var glavaStranice = document.getElementsByTagName("head")[0];
    var noviLink = document.createElement("link");
    noviLink.rel = "stylesheet";
    noviLink.type = "text/css";
    noviLink.href = "/css/svijetlaTema.css";
    if(trenutnaTema === "svijetlu"){
        try {
            glavaStranice.removeChild(noviLink);   
        }catch(greska){
            console.log(greska);
        }
    }else{
        glavaStranice.appendChild(noviLink);
    }
    prebaciTemuGumb.addEventListener("click",prebaciTemu);
}

function prebaciTemu(){
    var trenutnaTema = vrijednostKolacica[nazivKolacica.indexOf(" tema")];
    var glavaStranice = document.getElementsByTagName("head")[0];
    var noviLink = document.createElement("link");
    noviLink.rel = "stylesheet";
    noviLink.type = "text/css";
    noviLink.href = "/css/svijetlaTema.css";
    if(trenutnaTema === "svijetlu"){
        document.cookie = "tema=tamnu";
        glavaStranice.appendChild(noviLink);
    }else{
        document.cookie = "tema=svijetlu";
        noviLink = glavaStranice.getElementsByTagName("link");
        noviLink = noviLink[noviLink.length-1];
        noviLink.href = "";
    }
    sviKolacici = document.cookie.split(";");
    for(let i=0; i<sviKolacici.length; i++){
        nazivKolacica[i] = sviKolacici[i].split("=")[0];
        vrijednostKolacica[i] = sviKolacici[i].split("=")[1];
    }
    prebaciTemuGumb.innerText = "Prebaci se na x temu";
    prebaciTemuGumb.innerText = prebaciTemuGumb.innerText.replace("x",vrijednostKolacica[nazivKolacica.indexOf(" tema")]);
}