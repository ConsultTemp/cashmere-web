import React from "react"
import { Metadata } from "next"
import { defaultSEO } from "@/lib/seo-config"

export const metadata: Metadata = {
 title: "Privacy Policy | Cashmere Studio Milano",
 description: "Informazioni sulla privacy per il sito di Cashmere Studio Milano.",
 alternates: {
   canonical: "/privacy",
 },
}
const PrivacyPage = () => {
 return (
   <div className="container max-w-3xl py-8 px-4 sm:px-6">
     <h1 className="text-3xl font-semibold mb-8">Informativa sulla Privacy</h1>

     <section className="mb-6">
       <h2 className="text-xl font-semibold mb-2">1. Introduzione</h2>
       <p>
         La tua privacy è importante per noi. Questa informativa sulla privacy spiega come raccogliamo, utilizziamo,
         divulghiamo e proteggiamo le tue informazioni quando utilizzi il nostro sito web. Utilizzando il sito, accetti
         le pratiche descritte in questa informativa.
       </p>
     </section>

     <section className="mb-6">
       <h2 className="text-xl font-semibold mb-2">2. Informazioni che Raccogliamo</h2>
       <p>
         Raccogliamo informazioni che ci fornisci volontariamente quando effettui una prenotazione attraverso il nostro
         sito. Queste informazioni possono includere:
       </p>
       <ul className="list-disc pl-5">
         <li>Username Instagram</li>
         <li>Numero di telefono</li>
         <li>Dettagli della prenotazione</li>
       </ul>
       <p>
         Non raccogliamo altre informazioni personali, né utilizziamo i tuoi dati per scopi diversi da quelli necessari
         per fornirti il servizio richiesto.
       </p>
     </section>

     <section className="mb-6">
       <h2 className="text-xl font-semibold mb-2">3. Come Utilizziamo le Tue Informazioni</h2>
       <p>
         Le informazioni raccolte vengono utilizzate esclusivamente per gestire le prenotazioni effettuate tramite il
         nostro sito. In particolare, utilizziamo i tuoi dati per:
       </p>
       <ul className="list-disc pl-5">
         <li>Confermare la tua prenotazione</li>
         <li>Comunicare con te riguardo alla tua prenotazione</li>
         <li>Fornire assistenza clienti</li>
       </ul>
       <p>Non utilizziamo i tuoi dati per fini di marketing, pubblicità, o analisi.</p>
     </section>

     <section className="mb-6">
       <h2 className="text-xl font-semibold mb-2">4. Divulgazione delle Informazioni</h2>
       <p>
         Non vendiamo, affittiamo o condividiamo le tue informazioni personali con terze parti, salvo nei seguenti casi:
       </p>
       <ul className="list-disc pl-5">
         <li>Quando richiesto dalla legge o per rispondere a procedimenti legali</li>
         <li>Per proteggere i nostri diritti, proprietà o sicurezza, o quelli dei nostri utenti o altri</li>
       </ul>
       <p>In tutti gli altri casi, le tue informazioni saranno trattate come strettamente confidenziali.</p>
     </section>

     <section className="mb-6">
       <h2 className="text-xl font-semibold mb-2">5. Sicurezza dei Dati</h2>
       <p>
         Adottiamo misure di sicurezza tecniche e organizzative adeguate per proteggere le tue informazioni personali da
         accessi non autorizzati, perdita, distruzione o divulgazione. Tuttavia, nessun sistema di sicurezza è
         impenetrabile e non possiamo garantire la sicurezza assoluta dei tuoi dati.
       </p>
     </section>

     <section className="mb-6">
       <h2 className="text-xl font-semibold mb-2">6. I Tuoi Diritti</h2>
       <p>
         Hai il diritto di accedere, correggere, aggiornare o richiedere la cancellazione dei tuoi dati personali in
         qualsiasi momento. Per esercitare questi diritti, puoi contattarci utilizzando le informazioni di contatto
         fornite alla fine di questa informativa.
       </p>
     </section>

     <section className="mb-6">
       <h2 className="text-xl font-semibold mb-2">7. Modifiche a Questa Informativa</h2>
       <p>
         Ci riserviamo il diritto di aggiornare questa informativa sulla privacy in qualsiasi momento. Eventuali
         modifiche verranno pubblicate su questa pagina con la data dell'ultimo aggiornamento. Ti consigliamo di
         controllare regolarmente questa informativa per rimanere informato su come proteggiamo i tuoi dati.
       </p>
     </section>

     <section className="mb-6">
       <h2 className="text-xl font-semibold mb-2">8. Contatti</h2>
       <p>
         Se hai domande o preoccupazioni riguardo a questa informativa sulla privacy o alle nostre pratiche di gestione
         dei dati, puoi contattarci a:
       </p>
       <address>
         Cashmere Studio srl
         <br />
         Via Oreste Salomone 61, Milano
         <br />
         Email: cashmerestudiomilano@gmail.com
         <br />
         Telefono: +39 351 420 6294
       </address>
     </section>
   </div>
 )
}

export default PrivacyPage

