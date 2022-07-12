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
 1. Nella prima fase, una ricevuta la traccia del progetto, gli studenti hanno letto più volte tale documento, sottolineando le parti più importanti, al fine di comprendere al meglio quali erano le funzionalità da implementare e anche, sul come implementarle. Successivamente è stato realizzato il database, necessario per proseguire con lo sviluppo del progetto. Una volta realizzato il database, abbiamo fatto effettuato diverse scelte riguardo la struttura del progetto, abbiamo scelto quali dovevano essere i pattern architetturali e di design da utilizzare. Tali pattern saranno descritti successivamente. Infine, c'è stata una suddivisione dei compiti, lo studente Yihang Zhang è partito dall'autenticazione ed è sceso verso il presenter, mentre lo studente Scalella Simone è partito dai model ed è salito verso il presenter.
 
 2. In questa seconda fase gli studenti hanno proseguito con l'implementazione delle varie funzionalità richieste. Sono state utilizzate le varie documentazioni messe a disposizione dal professore, per poter utilizzare al meglio le varie componenti, come ad esempio sequelize e jwt. La scrittura del codice è stata fatta rispettando i vincoli strutturali definiti nei pattern scelti precedentemente.
 
 3. Durante la terza fase sono state svolte operazioni di miglioramento del codice e delle funzionalità implementate, e sono stati eseguiti vari test.
 Durante il miglioramento del codice siamo andati ad aggiornare le funzionalità già implementate, cercando di utilizzare il più possibile programmazione funzionale e altri argomenti visti durante il corso di programmazione avanzata. Questo perchè inizialmente, le funzionalità vengono implementate con un pò di fretta, quindi non sempre si usa la soluzione migliore, oppure tale soluzione non la si conosce, ed emerge successivamente tramite un confronto con il collega. Il risultato sono delle funzionalità implementate in modo elegante e che soddisfano degli standard di programmazione imposti anche dalla prova stessa. Infine, abbiamo eseguito tutta una serie di test sul back-end, e abbiamo aggiunto dei controlli dove necessario, affinchè tutte le eccezioni venissero gestite correttamente.
 
 4. Questa è la fase conclusiva del progetto, dove abbiamo messo insieme i servizi utilizzando docker, e dove abbiamo realizzato la documentazione del progetto.
 
 # Dettagli delle richieste
 
 # Progettazione - Pattern
 In questa sezione riportiamo i pattern utilizzati con le motivazioni per cui sono stati scelti. Partiamo con i pattern architetturali, i quali definiscono la struttura del progetto e delle sue componenti, poi procediamo con i design pattern che descrivono le interazioni che ci sono tra le classi, il loro comportamento, e il modo in cui creano le istanze.
 
 ## MVP
Questo è il pattern architetturale scelto per implementare il progetto. Questo pattern ci permette di implementare un'importante principio di buona programmazione, che è quello della separazione delle componenti, e separazione dei ruoli. Questo pattern è una evoluzione del pattern MVC, nel quale abbiamo tre componenti principali, che sono il model, il controller e la view. Per questo progetto la view non viene considerata, in quanto abbiamo implementato solo il back-end dell'applicazione, senza front-end. Il pattern MVP differisce dal MVC perchè la componente view e model sono completamente separate, infatti, il model comunica solo con il presenter, la view comunica solo con il presenter, e il presenter comunica con entrambi.
Utilizzando questo pattern abbiamo che solo la componente model interagisce con il database, infatti abbiamo un model per ogni tabella, in questo modo abbiamo evitato il problema del god object, cioè abbiamo evitato di avere una componente troppo grande e difficile da gestire.
Il presenter chiama i metodi del model per ottenere i dati di interesse che saranno poi utilizzati per costruire il risultato che viene restituito al client.

## DAO
Questo è un pattern architetturale che abbiamo implementato indirettamente. Uno degli strumenti utilizzati è sequelize, il quale ci permette di collegarci al database mysql. Sequelize permette di ottenere i dati dalle tabelle tramite delle raw query. Questa non è una buona pratica di programmazione, in quanto si potrebbe incorrere nel problema dell' SQL injection, nel momento in cui si completa la query con dei dati inseriti dall'utente. Per evitare questo problema sequelize mette a disposizione i model, con i model è possibile definire un oggetto che rappresenta una tabella del database. Questo oggetto possiede già dei metodi che possono essere utilizzati per fare delle query sulla tabella stessa. In questo modo abbiamo stratificato e isolato l'accesso alla tabella, creando un maggior livello di astrazione ed una più facile manutenibilità del codice.
