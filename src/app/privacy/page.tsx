import Link from 'next/link'

export const metadata = { title: 'Politika privatnosti – BLKTOP' }

const CONTACT = 'danube.works.sr@gmail.com'
const UPDATED = '8. maj 2026.'

export default function PrivacyPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      color: 'rgba(255,255,255,0.82)',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '60px 24px 80px' }}>

        <Link href="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: 'rgba(255,255,255,0.35)', fontSize: 13, textDecoration: 'none',
          marginBottom: 40,
        }}>
          ← Nazad
        </Link>

        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>
          Politika privatnosti
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, margin: '0 0 48px' }}>
          Poslednje ažuriranje: {UPDATED}
        </p>

        <Section title="1. Ko smo mi">
          <p>
            BLKTOP je servis za organizovanje rekreativnih košarkaških utakmica na otvorenim
            terenima. Servis nije privredno društvo — razvija ga i njime upravlja fizičko lice kao
            lični projekat. Kontakt: <a href={`mailto:${CONTACT}`} style={{ color: '#f97316' }}>{CONTACT}</a>.
          </p>
        </Section>

        <Section title="2. Koje podatke prikupljamo">
          <ul>
            <li><strong>Nalog:</strong> e-mail adresa i lozinka (lozinka se čuva samo kao hash, ne vidimo je).</li>
            <li><strong>Profil:</strong> korisničko ime i profilna slika koje ti uneseš.</li>
            <li><strong>Aktivnost:</strong> sesije koje kreiraš ili kojima se pridružuješ.</li>
            <li><strong>Push notifikacije:</strong> token uređaja, samo ako eksplicitno uključiš notifikacije.</li>
            <li><strong>Lokacija:</strong> koordinate se koriste samo u browseru da centriše mapu — ne šaljemo ih na server niti ih čuvamo.</li>
          </ul>
        </Section>

        <Section title="3. Kako koristimo podatke">
          <ul>
            <li>Da ti omogućimo kreiranje naloga i prijavu.</li>
            <li>Da prikažemo igre na kojima učestvuješ i termine koje si kreirao.</li>
            <li>Da šaljemo push notifikacije o igrama (samo ako si dao saglasnost).</li>
          </ul>
          <p>Podatke ne prodajemo, ne iznajmljujemo i ne delimo sa trećim stranama u komercijalne svrhe.</p>
        </Section>

        <Section title="4. Ko obrađuje podatke (podprocesori)">
          <p>
            Koristimo <strong>Supabase</strong> (SAD/EU) kao bazu podataka i autentifikaciju.
            Supabase je ISO 27001 sertifikovan i usklađen sa GDPR. Podaci se čuvaju na serverima u EU regionu.
          </p>
          <p>
            Koristimo <strong>Vercel</strong> (SAD) za hosting Next.js aplikacije. Vercel može privremeno
            logovat IP adresu pri svakom zahtevu radi dijagnostike.
          </p>
        </Section>

        <Section title="5. Koliko čuvamo podatke">
          <ul>
            <li>Podaci naloga se čuvaju dok ne obrišeš nalog.</li>
            <li>Poruke u chatu sesije se čuvaju 90 dana, posle automatski brišemo.</li>
            <li>Push tokeni se brišu čim isključiš notifikacije ili obrišeš nalog.</li>
          </ul>
        </Section>

        <Section title="6. Tvoja prava (GDPR)">
          <p>Imaš pravo da:</p>
          <ul>
            <li>Zatražiš uvid u sve podatke koje imamo o tebi.</li>
            <li>Zatražiš ispravku netačnih podataka.</li>
            <li>Zatražiš brisanje naloga i svih podataka.</li>
            <li>Povučeš saglasnost za notifikacije u bilo kom trenutku (Settings → Obaveštenja).</li>
          </ul>
          <p>
            Zahteve šalji na <a href={`mailto:${CONTACT}`} style={{ color: '#f97316' }}>{CONTACT}</a>.
            Odgovaramo u roku od 30 dana.
          </p>
        </Section>

        <Section title="7. Kolačići (cookies)">
          <p>
            Koristimo isključivo funkcionalne kolačiće neophodne za prijavu (session token).
            Ne koristimo analitičke, reklamne niti kolačiće trećih strana za praćenje.
          </p>
        </Section>

        <Section title="8. Bezbednost">
          <p>
            Sav saobraćaj je enkriptovan (HTTPS/TLS). Lozinke se nikada ne čuvaju u čistom tekstu.
            Pristup bazi podataka je zaštićen Row Level Security politikama — svaki korisnik vidi
            samo podatke koje sme da vidi.
          </p>
        </Section>

        <Section title="9. Deca">
          <p>
            Servis nije namenjen osobama mlađim od 16 godina. Ukoliko saznamo da smo prikupili
            podatke maloletnog lica, odmah ćemo obrisati nalog.
          </p>
        </Section>

        <Section title="10. Izmene ove politike">
          <p>
            Ako napravimo značajne izmene, obavićemo te putem e-maila. Datum poslednje izmene
            uvek je prikazan na vrhu ove stranice.
          </p>
        </Section>

        <div style={{
          marginTop: 48,
          padding: '20px 24px',
          borderRadius: 12,
          background: 'rgba(249,115,22,0.07)',
          border: '1px solid rgba(249,115,22,0.15)',
          fontSize: 14,
          color: 'rgba(255,255,255,0.5)',
        }}>
          Pitanja ili zahtevi: <a href={`mailto:${CONTACT}`} style={{ color: '#f97316' }}>{CONTACT}</a>
        </div>

      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 36 }}>
      <h2 style={{ fontSize: 16, fontWeight: 600, color: '#fff', margin: '0 0 12px' }}>{title}</h2>
      <div style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,0.6)' }}>
        {children}
      </div>
    </section>
  )
}
