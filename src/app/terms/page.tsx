import Link from 'next/link'

export const metadata = { title: 'Uslovi korišćenja – BLKTOP' }

const CONTACT = 'danube.works.sr@gmail.com'
const UPDATED = '8. maj 2026.'

export default function TermsPage() {
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
          Uslovi korišćenja
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, margin: '0 0 48px' }}>
          Poslednje ažuriranje: {UPDATED}
        </p>

        <Section title="1. Prihvatanje uslova">
          <p>
            Korišćenjem BLKTOP servisa prihvataš ove uslove. Ako se ne slažeš, molimo te da
            ne koristiš servis. Uslovi se primenjuju na sve korisnike, uključujući goste i
            registrovane korisnike.
          </p>
        </Section>

        <Section title="2. Opis servisa">
          <p>
            BLKTOP je platforma koja omogućava korisnicima da organizuju i pronalaze rekreativne
            košarkaške utakmice na javnim terenima. Servis se pruža besplatno i bez garancije
            dostupnosti ili kontinuiteta.
          </p>
        </Section>

        <Section title="3. Nalog i registracija">
          <ul>
            <li>Moraš imati najmanje 16 godina da bi koristio servis.</li>
            <li>Odgovoran si za čuvanje lozinke i sve aktivnosti na svom nalogu.</li>
            <li>Nalog je strogo lični — nije dozvoljena preprodaja niti deljenje naloga.</li>
            <li>Zadržavamo pravo da suspendujemo ili obrišemo nalog koji krši ove uslove.</li>
          </ul>
        </Section>

        <Section title="4. Pravila ponašanja">
          <p>Zabranjeno je:</p>
          <ul>
            <li>Kreiranje lažnih sesija ili terena sa ciljem obmane korisnika.</li>
            <li>Uznemiravanje, vređanje ili pretnje prema drugim korisnicima.</li>
            <li>Korišćenje servisa u komercijalne svrhe bez prethodne saglasnosti.</li>
            <li>Automatizovano prikupljanje podataka (scraping, botovi).</li>
            <li>Pokušaj neovlašćenog pristupa sistemu ili tuđim nalozima.</li>
          </ul>
        </Section>

        <Section title="5. Sadržaj koji objavljuješ">
          <p>
            Odgovoran si za sve sadržaje koje uneseš (korisničko ime, opis sesije, poruke u chatu).
            Objavljenim sadržajem ne smeš kršiti prava trećih lica. Zadržavamo pravo da uklonimo
            sadržaj koji smatramo uvredljivim ili nezakonitim, bez prethodnog obaveštenja.
          </p>
        </Section>

        <Section title="6. Odricanje od odgovornosti">
          <p>
            BLKTOP je alat za koordinaciju — <strong>nismo odgovorni</strong> za:
          </p>
          <ul>
            <li>Fizičke povrede nastale tokom igre.</li>
            <li>Nepojavljivanje korisnika na dogovorenu igru.</li>
            <li>Stanje ili dostupnost javnih terena.</li>
            <li>Štetu nastalu usled privremene nedostupnosti servisa.</li>
            <li>Sadržaj koji su uneli drugi korisnici.</li>
          </ul>
          <p>
            Servis se pruža „kakav jeste" (<em>as-is</em>) bez ikakvih garancija. Igraš na
            sopstvenu odgovornost.
          </p>
        </Section>

        <Section title="7. Dostupnost servisa">
          <p>
            Ne garantujemo neprekidnu dostupnost servisa. Zadržavamo pravo da privremeno
            ili trajno obustavimo servis bez prethodnog obaveštenja, bez obaveze nadoknade.
          </p>
        </Section>

        <Section title="8. Intelektualna svojina">
          <p>
            Sav kod, dizajn i sadržaj servisa (osim sadržaja koji su uneli korisnici) je vlasništvo
            operatera. Nije dozvoljeno kopiranje, reprodukcija ili distribucija bez pisane saglasnosti.
          </p>
        </Section>

        <Section title="9. Primenjivo pravo">
          <p>
            Na ove uslove primenjuje se pravo Republike Srbije. Za sve sporove nadležan je
            stvarno nadležni sud u Beogradu.
          </p>
        </Section>

        <Section title="10. Izmene uslova">
          <p>
            Zadržavamo pravo da izmenimo ove uslove u bilo kom trenutku. O značajnim izmenama
            bićeš obavešten putem e-maila. Nastavak korišćenja servisa nakon izmena znači
            prihvatanje novih uslova.
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
          Pitanja: <a href={`mailto:${CONTACT}`} style={{ color: '#f97316' }}>{CONTACT}</a>
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
