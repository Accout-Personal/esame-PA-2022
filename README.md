# Progetto di Programmazione Avanzata 2022 - Yihang Zhang, Scalella Simone.
Esame di programmazione avanzata univpm 2022.
## Obiettivi del progetto
Il servizio back-end realizzato permette di prenotare un vaccino, svolge anche altre operazioni correlate alla prenotazione. Il sistema ha due tipi di utenti che sono lo user generico e l'admin. Di seguito riportiamo una lista sintetica delle operazioni che sono state realizzate:

- L'amministratore può aggiungere un centro di vaccinazione 
- L'amministratore può aggiungere un vaccino specificando la data di validità della copertura 
- L'utente può ottenere l’elenco dei centri vaccinali che sono entro un raggio di x km da una posizione che lui ha specificato 
     - Egli ha la possibilità di ordinare in modo crescente e decrescente in base alla distanza e può filtrare i risultati ottenendo quelli che hanno una disponibilità residua di posti in un dato giorno
- L'utente può visualizzare gli slot temporali disponibili per un dato centro vaccinale fornendo al più 5 giorni diversi. L’utente ha la possibilità di specificare anche delle fasce orarie
- L'utente può prenotare una vaccinazione presso un centro vaccinale; deve specificare la fascia oraria, il centro vaccinale ed il vaccino.
    - L'utente può prenotare solo una vaccinazione per un vaccino mai effettuato o se la copertura risulti scaduta alla data scelta
    - L'utente può specificare se ottenere l'identificatore di prenotazione sotto forma di JSON o QR-code, o PDF.
 - L'amministratore può visualizzare sotto forma di JSON o PDF le prenotazioni per un centro vaccinale per un dato giorno.
 - L'utente può modificare la propria richiesta o cancellarla
 - L'utente può accedere alla lista di tutte le prenotazioni
 - L'amministratore può verificare il QR-code o il codice di prenotazione inviato come json
 - L'amministratore può verificare per un centro vaccinale il numero di prenotazioni che non sono andate e buon fine in quanto l’utente si è dimenticato / non presentato
 - L'amministratore può visualizzare le statistiche circa il numero di prenotazioni che sono andate a buone fine, il risultato può essere ordinato, in modo crescente o decrescente, in base alla media dei centri vaccinali
 
 ## Approccio allo sviluppo
 In questa sezione andiamo bremente a descrivere qual'è stato l'approccio allo sviluppo adottato dai due studenti, dall'inizio alla fine del progetto.
 Il progetto è stato realizzato in quattro fasi principali:
 1. Nella prima fase, una ricevuta la traccia del progetto, gli studenti hanno letto più volte tale documento, sottolineando le parti più importanti, al fine di comprendere al meglio quali erano le funzionalità da implementare e anche, sul come implementarle. Successivamente è stato realizzato il database, necessario per proseguire con lo sviluppo del progetto. Una volta realizzato il database, sono state effettuate diverse scelte riguardo la struttura del progetto, abbiamo scelto quali dovevano essere i pattern architetturali e di design da utilizzare. Tali pattern saranno descritti successivamente. Infine, c'è stata una suddivisione dei compiti, lo studente Yihang Zhang è partito dall'autenticazione ed è sceso verso il presenter, mentre lo studente Scalella Simone è partito dai model ed è salito verso il presenter.
 
 2. In questa seconda fase gli studenti hanno proseguito con l'implementazione delle varie funzionalità richieste. Sono state utilizzate le varie documentazioni messe a disposizione dal professore, per poter utilizzare al meglio le varie componenti, come ad esempio sequelize e jwt. La scrittura del codice è stata fatta rispettando i vincoli strutturali definiti nei pattern scelti precedentemente.
 
 3. Durante la terza fase sono state svolte operazioni di miglioramento del codice e delle funzionalità implementate, e sono stati eseguiti vari test.
 Durante il miglioramento del codice siamo andati ad aggiornare le funzionalità già implementate, cercando di utilizzare il più possibile programmazione funzionale e altri argomenti visti durante il corso di programmazione avanzata. Questo perchè inizialmente, le funzionalità vengono implementate con un pò di fretta, quindi non sempre si usa la soluzione migliore, oppure tale soluzione non la si conosce, ed emerge successivamente tramite un confronto con il collega. Il risultato sono delle funzionalità implementate in modo elegante e che soddisfano degli standard di programmazione imposti anche dalla prova stessa. Infine, sono stati eseguiti una serie di test sul back-end, e sono stati aggiunti dei controlli dove necessario, affinchè tutte le eccezioni venissero gestite correttamente.
 
 4. Questa è la fase conclusiva del progetto, dove sono stati messi insieme i servizi utilizzando docker, ed è stata realizzata la documentazione del progetto.
 
 # Dettagli delle richieste
 La seguente tabella mostra le richieste possibili:
 
 | Tipo  | Rotta | Utente | Token JWT |
| ------------- | ------------- | ------------- | ------------- |
| Get  | /login  | -  | No  |
| Get  | /getCentro  | User  | Si  |
| Get  | /getSlotCentro  | User  | Si  |
| Post  | /prenota  | User  | Si  |
| Post  | /cancella  | User  | Si  |
| Post  | /modifica  | User  | Si  |
| Get  | /myListPrenota  | User  | Si  |
| Post  | /newCentro  | Admin  | Si  |
| Post  | /newVaccino  | Admin  | Si  |
| Get  | /listPrenota  | Admin  | Si  |
| Post  | /verify  | Admin  | Si  |
| Post  | /confirmVax  | Admin  | Si  |
| Get  | /statCentro  | Admin  | Si  |
| Get  | /getassenze  | Admin  | Si  |

## Esempi di richieste

### Login
Tramite questa richiesta è possibile effettuare il login. Se le credenziali sono corrette verrà restituito un token jwt.
```
{
    "username":"user1",
    "password":"password"
}
* oppure
{
    "username":"admin1",
    "password":"adminadmin"
}
```

### Ottenere i centri vaccinali entro una certa distanza
Tramite questa richiesta è possibile ottenere una lista di centri vaccinali, che non superano una certa distanza, definita dall'utente. La distanza viene calcolata in base alla posizione del centro vaccinale e delle coordinate inviate dall'utente stesso. Tutte le distanze sono calcolate in Km, inoltre la distanza viene arrotondata alla seconda cifra decimale. Il valore di order se uguale a true indica ordinamento crescente, uguale a false indica ordinamento decrescente.
```
{
    "lat":43.5851,
    "long":13.514147,
    "dist":100,
    "order":true
}
* Il parametro order di default assume valore true, quindi può essere omesso
```
L'utente può anche filtrare questo risultato specificando una data, in questo modo verranno selezionati solo i centri vaccinali che hanno una disponibilità residua maggiore di zero per quella data.
```
{
    "lat":43.5851,
    "long":13.514147,
    "dist":100,
    "data":"2022-07-23",
    "disp":true
}
* Il parametro order di default assume valore true, quindi può essere omesso
* Il parametro data di default assume come valore la data corrente, quindi può essere omesso
```

### Ottenere gli slot liberi per un centro vaccinale, specificando al massimo cinque date.
Tramite questa richiesta l'utente può visualizzare gli slot liberi specificando un centro vaccinale, deve anche specificare una o più date, fino a un massimo di cinque. Per motivi applicativi vengono prese in considerazione solo le date ***strettamente maggiori*** della data odierna. Se tutte le date non sono valide viene restituito un risultato vuoto. L'utente può specificare una fascia oraria.
```
{
    "centro":3,
    "date":["2022-07-22","2022-12-31"],
    "fascia":1,
    "formato":"ora"
}
* Il parametro fascia, se non specificato, fa restituire tutti gli slot disponibili all'interno di entrambe le fascie. Può essere omesso.
* Il parametro formato può ricevere come valore solo la stringa "ora", la quale permette di ottenere l'ora relativa ai vari slot disponibili.
* Se omesso, o se viene inserita una qualsiasi altra stringa, come risultato vengono restituiti gli slot, rappresentati con il loro numero, e non con l'ora. 
```
### Inserire una prenotazione
Tramite questa richiesta è possibile inserire una prenotazione.
```
{
    "data":"2022-07-25",
    "centro_vac":2,
    "slot":3,
    "vaccino":6,
    "formato":"json"
}
* Il parametro formato, se non specificato, farà restituire il risultato sotto forma di json. Può essere omesso.
* I valori che possono essere inseriti sono "json","pdf","qrcode". Se si inserisce un altra stringa verrà restituito il risultato sotto forma di json.
```
Come da requisiti è stato:
1. effettuato un controllo per fare in modo che un utente possa prenotare solo una vaccinazione per un vaccino mai effettuato o se la copertura risulti scaduta alla data scelta dell’utente.
2. viene fornito un identificatore di prenotazione; si può specificare se ritornare questo codice sotto forma di JSON o QR-code (immagine) o PDF (il pdf contiene tutti i dati richiesti dai requisiti, che sono il QR-code, la data ed ora scelta, il centro di vaccinazione ed il codice fiscale dell’utente).

### Cancellare una prenotazione
Tramite questa richiesta è possibile cancellare una prenotazione. Un utente può cancellare solo prenotazioni fatte da lui.
```
{
    "id":144
}
```
### Modificare una prenotazione
Tramite questa richiesta è possibile modificare una prenotazione. Si possono modificare solo prenotazioni fatte dall'utente stesso, inoltre valgono gli stessi vincoli definiti per l'inserimento. L'unico parametro obbligatorio è l'id della prenotazione, tutti gli altri parametri che appartengono alla prenotazione, possono essere omessi, in quel caso, durante la modifica, vengono utilizzati i vecchi valori, quindi quel campo non cambia. Nel database cambiano solo i valori dei parametri specificati nella richiesta.
```
{
    "id":168,
    "data":"2023-07-22",
    "slot":3,
    "vaccino":7,
    "centro_vac":2
}
```


 # Progettazione - Pattern
 In questa sezione riportiamo i pattern utilizzati con le motivazioni per cui sono stati scelti. Partiamo con i pattern architetturali, i quali definiscono la struttura del progetto e delle sue componenti, poi procediamo con i design pattern che descrivono le interazioni che ci sono tra le classi, il loro comportamento, e il modo in cui creano le istanze.
 
 ## MVP
Questo è il pattern architetturale scelto per implementare il progetto. Questo pattern ci permette di implementare un'importante principio di buona programmazione, che è quello della separazione delle componenti, e separazione dei ruoli. Questo pattern è una evoluzione del pattern MVC, nel quale ci sono tre componenti principali, che sono il model, il controller e la view. Per questo progetto la view non viene considerata, in quanto è stato implementato solo il back-end dell'applicazione, senza front-end. Il pattern MVP differisce dal MVC perchè la componente view e model sono completamente separate, infatti, il model comunica solo con il presenter, la view comunica solo con il presenter, e il presenter comunica con entrambi.
Utilizzando questo pattern solo la componente model interagisce con il database, infatti è presente un model per ogni tabella, in questo modo è stato evitato il problema del god object, cioè si è evitato di avere una componente troppo grande e difficile da gestire.
Il presenter chiama i metodi del model per ottenere i dati di interesse che saranno poi utilizzati per costruire il risultato che viene restituito al client.

## DAO
Questo è un pattern architetturale implementato indirettamente, serve per stratificare e isolare l'accesso alle tabelle, creando un maggior livello di astrazione ed una più facile manutenibilità del codice. Uno degli strumenti utilizzati è sequelize, il quale ci permette di collegarci al database mysql. Sequelize permette di ottenere i dati dalle tabelle tramite delle raw query. Questa non è una buona pratica di programmazione, in quanto si potrebbe incorrere nel problema dell' SQL injection, nel momento in cui si completa la query con dei dati inseriti dall'utente. Per evitare questo problema sequelize mette a disposizione i model, con i model è possibile definire un oggetto che rappresenta una tabella del database. Questo oggetto possiede già dei metodi che possono essere utilizzati per fare delle query sulla tabella stessa.

## Singleton
Questo è un Creational Design Pattern, esso serve per assicurarsi che di una classe si abbia una sola istanza accessibile globalmente. E' stato utilizzato questo pattern per instaurare una connessione al database, in questo modo siamo sicuri di lavorare sempre con la stessa istanza di connessione.

## Proxy
Questo è uno Structural design pattern che fornisce un oggetto utilizzato per controllare l'accesso ad un altro oggetto, il proxy e l'oggetto controllato implementano la stessa interfaccia, in maniera tale da essere intercambiabili in modo trasparente.
E' stato utilizzato questo pattern all'interno del progetto per controllare le chiamate fatte ai metodi dei model. E' stato definito un proxy per ogni model, esso serve per implementare il controllo e la sanificazione dei dati di input inseriti dall'utente. Vengono effettuati diversi controlli relativi ai tipi di dato, al valore che tali dati assumono, sono stati effettuati controlli relativi alla validità dei dati, ad esempio non si può cancellare una prenotazione che non esiste, e altri ancora di questo tipo. Il presenter comunica con i model solo attraverso i proxy.

## Chain of Responsibility (COR)
Questo fa parte dei Behavioural Design Pattern, esso consente di passare le richieste lungo una catena di controllori. Alla ricezione di una richiesta, ciascun controllore decide di elaborare la richiesta e, successivamente, decide di passarla o meno al controllore successivo della catena. In express, questo pattern è realizzato tramite le funzionalità dei middleware i quali rappresentano i veri e propri anelli della catena.
Tale pattern è stato utilizzato per filtrare le richieste HTTP, in modo da far arrivare al presenter solamente quelle che soddisfavano tutti i requisiti che sono stati imposti.
Le rotte si dividono in rotte per l'utente normale e rotte per l'admin. In entrambe le rotte, escluso il Login, è stata definita una catena di middleware composta da:
- Middleware per il controllo del formato del json.
- Middleware per il controllo della presenza del token jwt
- Middleware per il controllo della validità del token jwt

Infine, solo per le rotte dell'amministratore, è stato definito un'ulteriore middleware per il controllo del tipo, cioè dei privilegi (se il tipo è 0 questo utente è uno user semplice, se è 1 questo utente è un amministratore).

## Build
Questo pattern consente di costruire oggetti complessi passo dopo passo. Il modello consente di produrre diversi tipi e rappresentazioni di un oggetto utilizzando lo stesso codice di costruzione.
All'interno del progetto questo pattern è stato utilizzato per produrre due risultati principali. Il primo riguarda la lista dei centri vaccinali, su cui vengono eseguite diverse operazioni implementate nel build, in questo modo il presenter richiama in sequenza i metodi di interesse e produce il risultato richiesto dall'utente. Nel secondo caso abbiamo il BuildRes che contiene i metodi per produrre un certo tipo di risultato, il quale consiste nella risposta data all'utente dopo che ha effettuato una prenotazione con successo. Siccome l'utente può specificare tre tipi di formato per la risposta, è stato implementato un director che istanzia la classe buildRes, in seguito alla preferenza specificata dall'utente, il director chiama un metodo del buildRes e restituisce il risultato finale con il formato specificato dall'utente.
