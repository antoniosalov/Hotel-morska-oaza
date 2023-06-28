const ds = require("fs");

exports.generirajTablicu = function(){
    let cjenik = ds.readFileSync("podaci/cjenik.json", "utf-8");
    cjenik = JSON.parse(cjenik);

    let tablica = `<table> <caption class="serif">Cjenik</caption> 
    <thead> <tr> <th class="stay" rowspan="2">Vrsta sobe</th> <th 
    colspan="3">Opcija obroka</th> </tr> <tr> <th>bez obroka</th> 
    <th>polupansion</th> <th>puni pansion</th> </tr> </thead> <tbody>`;
    
    for(let i=0; i<cjenik.length; i++){
        var redak = cjenik[i];
        tablica += `<tr><td class="stay">`;
        tablica += redak["Vrsta sobe"];
        tablica += `</td><td>`;
        tablica += redak["Bez obroka"];
        tablica += `</td><td>`;
        tablica += redak["Polupansion"];
        tablica += `</td><td>`;
        tablica += redak["Puni pansion"];
        tablica += `</td></tr>`
    }

    tablica += `</tbody></table>`;

    return tablica;
};