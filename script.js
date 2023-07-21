"use strict";
//--------[Random number function]---------
function getRandomNumber() {
    return Math.floor(Math.random() * 999) + 1;
}
//------------------------------------------
//-----------[Get local storage function]---------------
function getLocalStorage(instanceName) {
    const localStorageName = `registroChiamateDi${instanceName}`; //creo un local storage in base al nome dell' utente
    const registroLocale = localStorage.getItem(localStorageName); //prendo local storage
    return registroLocale;
}
//---------------------------------------------------------------
//------------------------------------[Classe telefono]------------------------------------
class User {
    constructor(name) {
        this.carica = 0;
        this.numeroChiamate = 0;
        this.registroChiamate = [];
        this.instanceName = name;
    }
    //----------------------------[Metodo chiamata]------------------------
    chiamata(minutiDurata) {
        let costoChiamata = minutiDurata * 0.2;
        if (this.carica >= costoChiamata) {
            this.carica -= costoChiamata;
            this.numeroChiamate++;
            costoChiamata = parseFloat(costoChiamata.toFixed(2));
            this.carica = parseFloat(this.carica.toFixed(2));
            console.log(`Hai speso ${costoChiamata}€ per effettuare la chiamata`);
            //-----recupero le info da inserire nell'oggetto info chiamata------
            const now = new Date();
            const data = now.toLocaleDateString(); //data di oggi in stringa
            const ora = now.getHours(); //ora in numero
            const minuti = now.getMinutes(); //minuti in numero
            //console.log("data", data, "ora", ora, "minuti", minuti);
            //info chiamata
            const infoChiamata = {
                id: getRandomNumber(),
                durata: minutiDurata,
                dataEOra: { data: data, ora: ora, minuti: minuti },
            };
            //----controllo se il registro nel local storage è già definito
            const localStorageName = `registroChiamateDi${this.instanceName}`; //creo un local storage con un nume personalizzato per ogni utente
            const registroLocale = getLocalStorage(this.instanceName);
            if (registroLocale) {
                //già definito quindi ci aggiungo la nuova chiamata
                const arrRegistro = JSON.parse(registroLocale);
                arrRegistro.push(infoChiamata);
                localStorage.setItem(localStorageName, JSON.stringify(arrRegistro));
            }
            else {
                //non è definito quindi lo creo
                this.registroChiamate.push(infoChiamata);
                localStorage.setItem(localStorageName, JSON.stringify(this.registroChiamate));
            }
        }
        else {
            console.log("Credito non sufficente per effettuare la chiamata");
        }
    }
    //----------------------------------------------------------------------
    ricarica(unaRicarica) {
        this.carica += unaRicarica;
        console.log(`Hai ricaricato: ${unaRicarica}€.`);
    }
    numero404() {
        return this.carica;
    }
    getNumeroChiamate() {
        return this.numeroChiamate;
    }
    azzeraChiamate() {
        this.numeroChiamate = 0;
    }
    mostraRegistroChiamate() {
        const registroLocale = getLocalStorage(this.instanceName);
        if (registroLocale) {
            const arrRegistro = JSON.parse(registroLocale);
            return arrRegistro;
        }
        else {
            return "Nessun registro";
        }
    }
    mostraRegistroChiamateAtDayAndHour(data, ora) {
        const registroLocale = getLocalStorage(this.instanceName);
        if (registroLocale) {
            const arrRegistro = JSON.parse(registroLocale);
            const registroFiltrato = arrRegistro.filter((e) => {
                return e.dataEOra.data === data && e.dataEOra.ora === ora; //prendo gli oggetti che hanno l'ora e la data uguale
            });
            return registroFiltrato;
        }
        else {
            return "Nessun registro";
        }
    }
}
//-----------------------------------------------------------------------------------------------------
//creazione instanze
const mario = new User("Mario");
const pippo = new User("Pippo");
const stefano = new User("Stefano");
//ricariche telefoniche
mario.ricarica(60);
pippo.ricarica(20);
stefano.ricarica(35);
//chiamate
// pippo.chiamata(4);
// stefano.chiamata(10);
// stefano.chiamata(4);
// mario.chiamata(27)
//mostra credito
console.log(stefano.numero404());
//mostra registro chiamate
console.log('registro di mario:', mario.mostraRegistroChiamate());
console.log('registro di stefano:', stefano.mostraRegistroChiamate());
//mostra solo determinate chiamare (input giorno in stringa e ora in numero)
console.log(mario.mostraRegistroChiamateAtDayAndHour("21/07/2023", 13));
console.log(stefano.mostraRegistroChiamateAtDayAndHour("21/07/2023", 14));
