import type { FC } from "react";
import { Metadata } from "next";
import { getPageMetadata } from "@/lib/seo";

export const metadata: Metadata = getPageMetadata("Polityka Prywatności", "polityka-prywatnosci", [
  "Polityka prywatności Wielmi Kraków",
  "Ochrona danych osobowych Wielmi Smart Homes",
  "Regulamin serwisu Wielmi",
  "Polityka cookies Wielmi Kraków",
  "Bezpieczeństwo danych Wielmi Smart Homes",
  "Przetwarzanie danych osobowych Wielmi",
  "Zasady prywatności Wielmi Smart Homes"
]);

const Page: FC = function () {
  return (
    <section className="section">
      <div className="content-center-span">
        <h1 className="text-4xl font-bold mb-6">Polityka Prywatności</h1>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">1. Informacje ogólne</h2>
          <p>
            Niniejsza Polityka Prywatności określa zasady przetwarzania danych osobowych użytkowników przez firmę Wilemi
            za pośrednictwem strony internetowej&nbsp;
            <a href="https://wielmi.pl" className="text-blue-500">
              wielmi.pl
            </a>
            &nbsp; dalej: Strona.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">2. Administrator danych</h2>
          <p>
            Administratorem Twoich danych osobowych jest Wilemi, z siedzibą przy ul. Lipowa 3D, 30-702 Kraków. W
            sprawach związanych z ochroną danych osobowych można kontaktować się pod adresem e-mail:&nbsp;
            <a href="mailto:kontakt@wielmi.pl" className="text-blue-500">
              kontakt@wielmi.pl
            </a>
            .
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">3. Rodzaje przetwarzanych danych</h2>
          <p>Firma może przetwarzać następujące dane osobowe użytkowników:</p>
          <ul className="list-disc list-inside ml-4">
            <li>Imię i nazwisko</li>
            <li>Adres e-mail</li>
            <li>Numer telefonu</li>
          </ul>
          <p>Dane te są zbierane bezpośrednio od użytkowników za pośrednictwem formularza kontaktowego.</p>
          <p>
            Do pomiaru odsłon i diagnostyki błędów wykorzystujemy dane techniczne: adres odwiedzanej strony bez
            wrażliwych parametrów i fragmentów, czas spędzony na stronie i zdarzenie jej opuszczenia, typ przeglądarki,
            system operacyjny, pomiary szybkości ładowania i responsywności strony (Web Vitals) oraz oczyszczone informacje o błędzie.
            Dane wpisane w formularzu kontaktowym nie są przekazywane do narzędzia analitycznego.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">4. Cele przetwarzania danych</h2>
          <p>Twoje dane osobowe są przetwarzane w następujących celach:</p>
          <ul className="list-disc list-inside ml-4">
            <li>Odpowiadanie na zapytania użytkowników przesłane za pośrednictwem formularza kontaktowego</li>
            <li>Pomiar liczby odsłon i wydajności stron oraz wykrywanie i usuwanie błędów technicznych</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">5. Udostępnianie danych</h2>
          <p>
            Do pomiaru odsłon i monitorowania błędów korzystamy z PostHog Cloud EU, z przechowywaniem danych
            w regionie Unii Europejskiej. PostHog otrzymuje dane techniczne opisane w tej polityce oraz metadane
            połączenia, w tym adres IP i informacje o przeglądarce, potrzebne do obliczenia identyfikatora
            zmieniającego się każdego dnia. Nie tworzymy profili użytkowników ani nie identyfikujemy ich
            na podstawie danych z formularza kontaktowego.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">6. Prawa użytkowników</h2>
          <p>Użytkownikom przysługują następujące prawa w związku z przetwarzaniem danych osobowych:</p>
          <ul className="list-disc list-inside ml-4">
            <li>Prawo dostępu do danych</li>
            <li>Prawo do sprostowania danych</li>
            <li>Prawo do usunięcia danych</li>
            <li>Prawo do ograniczenia przetwarzania danych</li>
            <li>Prawo do przenoszenia danych</li>
            <li>Prawo do wniesienia sprzeciwu wobec przetwarzania danych</li>
            <li>Prawo do cofnięcia zgody na przetwarzanie danych</li>
          </ul>
          <p>
            Aby skorzystać z powyższych praw, prosimy o kontakt pod adresem e-mail:&nbsp;
            <a href="mailto:kontakt@wielmi.pl" className="text-blue-500">
              kontakt@wielmi.pl
            </a>
            .
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">7. Pliki cookies i technologie śledzące</h2>
          <p>
            Strona nie wykorzystuje analitycznych plików cookies. Wykorzystujemy wyłącznie niezbędne pliki cookies
            techniczne związane z działaniem serwisu. Pomiar odsłon i błędów działa w trybie bez cookies i nie
            zapisuje danych w localStorage ani sessionStorage. Nie nagrywamy sesji i nie zbieramy kliknięć
            ani treści formularzy do celów analitycznych.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">8. Bezpieczeństwo danych</h2>
          <p>
            Dane z formularza kontaktowego są przechowywane w skrzynce e-mail, a dane techniczne w PostHog Cloud EU.
            Stosujemy odpowiednie środki techniczne i
            organizacyjne w celu ochrony danych osobowych przed nieautoryzowanym dostępem, utratą lub zniszczeniem.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">9. Okres przechowywania danych</h2>
          <p>
            Nie przechowujemy danych osobowych użytkowników dłużej niż jest to konieczne do realizacji celów
            przetwarzania, chyba że przepisy prawa stanowią inaczej.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">10. Podstawa prawna przetwarzania danych</h2>
          <p>
            Podstawą prawną przetwarzania danych osobowych z formularza kontaktowego jest zgoda użytkownika wyrażona
            poprzez wysłanie formularza.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">11. Zmiany w Polityce Prywatności</h2>
          <p>
            W przypadku wprowadzenia zmian w niniejszej Polityce Prywatności, zaktualizowana wersja zostanie
            opublikowana na Stronie.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">12. Usługi zewnętrzne</h2>
          <p>
            Strona korzysta z PostHog Cloud EU do pomiaru odsłon i monitorowania błędów przeglądarki.
            Usługa działa bez analitycznych cookies i trwałych identyfikatorów w przeglądarce. Informacje
            o usłudze są dostępne na stronie{' '}
            <a href="https://posthog.com/privacy" className="text-blue-500">PostHog</a>.
          </p>
        </section>
      </div>
    </section>
  );
};

export default Page;
