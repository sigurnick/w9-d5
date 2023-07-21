//--------[Random number function]---------
function getRandomNumber(): number {
  return Math.floor(Math.random() * 999) + 1;
}
//------------------------------------------


//-----------[Get local storage function]---------------
function getLocalStorage(instanceName: string): string | null {
  const localStorageName = `registroChiamateDi${instanceName}`; //creo un local storage in base al nome dell' utente
  const registroLocale: string | null = localStorage.getItem(localStorageName); //prendo local storage
  return registroLocale;
}
//-----------[Get local storage funct---------------




//-----------[Oggetto registro]-------------
type Registro = {
  id: number;
  durata: number;
  dataEOra: {
    data: string;
    ora: number;
    minuti: number;
  };
};
//--------------------------------------------

//-------------------[Interfaccia telefono]--------------------
interface Smartphone {
  carica: number;
  numeroChiamate: number;
  registroChiamate: Registro[];
  ricarica(unaRicarica: number): void;
  chiamata(minutiDurata: number): void;
  numero404(): number;
  getNumeroChiamate(): number;
  azzeraChiamate(): void;
}
//---------------------------------------------------------------

//------------------------------------[Classe telefono]------------------------------------
class User implements Smartphone {
  carica: number = 0;
  numeroChiamate: number = 0;
  registroChiamate: Registro[] = [];
  private instanceName: string;

  constructor(name: string) {
    this.instanceName = name;
  }

  //----------------------------[Metodo chiamata]------------------------
  public chiamata(minutiDurata: number): void {
    let costoChiamata: number = minutiDurata * 0.2;

    if (this.carica >= costoChiamata) {
      this.carica -= costoChiamata;
      this.numeroChiamate++;

      costoChiamata = parseFloat(costoChiamata.toFixed(2));
      this.carica = parseFloat(this.carica.toFixed(2));
      console.log(`Hai speso ${costoChiamata}€ per effettuare la chiamata`);

      //-----recupero le info da inserire nell'oggetto info chiamata------
      const now = new Date();

      const data: string = now.toLocaleDateString(); //data di oggi in stringa
      const ora: number = now.getHours(); //ora in numero
      const minuti: number = now.getMinutes(); //minuti in numero
      //console.log("data", data, "ora", ora, "minuti", minuti);

      //info chiamata
      const infoChiamata: Registro = {
        id: getRandomNumber(),
        durata: minutiDurata,
        dataEOra: { data: data, ora: ora, minuti: minuti },
      };

      //----controllo se il registro nel local storage è già definito
      const localStorageName = `registroChiamateDi${this.instanceName}`; //creo un local storage con un nume personalizzato per ogni utente

      const registroLocale = getLocalStorage(this.instanceName);
      if (registroLocale) {
        //già definito quindi ci aggiungo la nuova chiamata
        const arrRegistro: Registro[] = JSON.parse(registroLocale);
        arrRegistro.push(infoChiamata);
        localStorage.setItem(localStorageName, JSON.stringify(arrRegistro));
      } else {
        //non è definito quindi lo creo
        this.registroChiamate.push(infoChiamata);
        localStorage.setItem(
          localStorageName,
          JSON.stringify(this.registroChiamate)
        );
      }
    } else {
      console.log("Credito non sufficente per effettuare la chiamata");
    }
  }
  //----------------------------------------------------------------------

  public ricarica(unaRicarica: number): void {
    this.carica += unaRicarica;
    console.log(`Hai ricaricato: ${unaRicarica}€.`);
  }

  numero404(): number {
    return this.carica;
  }

  getNumeroChiamate(): number {
    return this.numeroChiamate;
  }

  azzeraChiamate(): void {
    this.numeroChiamate = 0;
  }

  mostraRegistroChiamate(): Registro[] | string {
    const registroLocale = getLocalStorage(this.instanceName);

    if (registroLocale) {
      const arrRegistro: Registro[] = JSON.parse(registroLocale);
      return arrRegistro;
    } else {
      return "Nessun registro";
    }
  }

  mostraRegistroChiamateAtDayAndHour(
    data: string,
    ora: number
  ): Registro[] | string {
    const registroLocale = getLocalStorage(this.instanceName);

    if (registroLocale) {
      const arrRegistro: Registro[] = JSON.parse(registroLocale);
      const registroFiltrato = arrRegistro.filter((e) => {
        return e.dataEOra.data === data && e.dataEOra.ora === ora; //prendo gli oggetti che hanno l'ora e la data uguale
      });
      return registroFiltrato;
    } else {
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
console.log('registro di mario:',mario.mostraRegistroChiamate());
console.log('registro di stefano:',stefano.mostraRegistroChiamate());


//mostra solo determinate chiamare (input giorno in stringa e ora in numero)
console.log(mario.mostraRegistroChiamateAtDayAndHour("21/07/2023", 13)); 
console.log(stefano.mostraRegistroChiamateAtDayAndHour("21/07/2023", 14));

