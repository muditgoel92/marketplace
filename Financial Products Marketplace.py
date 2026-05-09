"""
linkedin_screenshotter.py
─────────────────────────────────────────────────────────────────────────────
Performance benchmark: finds a LinkedIn URL via DuckDuckGo and screenshots
the profile – for 5 people in one run.

REQUIREMENTS (install once):
    pip install playwright
    playwright install chromium
─────────────────────────────────────────────────────────────────────────────
"""

import time
import re
import os
from datetime import datetime
from urllib.parse import urlparse, parse_qs, urlencode
from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout

# ── Configuration ────────────────────────────────────────────────────────────

OUTPUT_DIR = "linkedin_screenshots"

# ── Test subjects ─────────────────────────────────────────────────────────────

PEOPLE = [
    {“name”: “Robin Von Burg”, “org”: “ABN AMRO Bank”, “country”:
“Netherlands”}, {“name”: “Marie Pierre Rozet”, “org”: “Arval BNP Paribas
Group”, “country”: “France”}, {“name”: “Ania Maxwell”, “org”: “Atom
Bank”, “country”: “UK”}, {“name”: “Phoebe Lloyd Evans”, “org”: “Atom
Bank”, “country”: “UK”}, {“name”: “Russell Collingham”, “org”: “Atom
Bank”, “country”: “UK”}, {“name”: “Manolo Moure”, “org”: “BBVA”,
“country”: “Spain”}, {“name”: “Monica Aguado Sanchez”, “org”: “BBVA”,
“country”: “Spain”}, {“name”: “Adri Purkayast”, “org”: “BNP Paribas”,
“country”: “UK”}, {“name”: “Anthony Belpaire”, “org”: “BNP Paribas”,
“country”: “Belgium”}, {“name”: “Antonio Martinez Moreno”, “org”: “BNP
Paribas”, “country”: “Spain”}, {“name”: “Beatrice Stevenson”, “org”:
“BNP Paribas”, “country”: “France”}, {“name”: “David Neuman”, “org”:
“BNP Paribas”, “country”: “France”}, {“name”: “David White”, “org”: “BNP
Paribas”, “country”: “France”}, {“name”: “Farid Oukaci”, “org”: “BNP
Paribas”, “country”: “France”}, {“name”: “Houda Lahlou”, “org”: “BNP
Paribas”, “country”: “France”}, {“name”: “Jean-Christophe Arouete”,
“org”: “BNP Paribas”, “country”: “France”}, {“name”: “Joao Almeida”,
“org”: “BNP Paribas”, “country”: “Portugal”}, {“name”: “Magdalena
Borissov-Kociolek”, “org”: “BNP Paribas”, “country”: “France”}, {“name”:
“Paul-Andre Roussel”, “org”: “BNP Paribas”, “country”: “France”},
{“name”: “Ricardo Amaral Rezende”, “org”: “BNP Paribas”, “country”:
“France”}, {“name”: “Su Yang”, “org”: “BNP Paribas”, “country”:
“France”}, {“name”: “Ward Thils”, “org”: “BNP Paribas”, “country”:
“Belgium”}, {“name”: “Xuan-Son Nguyen”, “org”: “BNP Paribas”, “country”:
“France”}, {“name”: “Laurens Meulman”, “org”: “BNY”, “country”:
“Germany”}, {“name”: “German Garitaonaindia”, “org”: “Banco Sabadell”,
“country”: “Spain”}, {“name”: “Patricia Ferreres De Diego”, “org”:
“Banco Sabadell”, “country”: “Spain”}, {“name”: “Sheriff Olujide”,
“org”: “Bank ABC”, “country”: “UK”}, {“name”: “Jan Maria Kowalski”,
“org”: “Bank Pekao”, “country”: “Poland”}, {“name”: “Jennifer Flynn”,
“org”: “Bank of America”, “country”: “USA”}, {“name”: “Qian Zhao”,
“org”: “Bank of America”, “country”: “UK”}, {“name”: “Adrian Roman
Urdiales”, “org”: “Bankinter”, “country”: “Spain”}, {“name”: “Andy
Mcmahon”, “org”: “Barclays”, “country”: “UK”}, {“name”: “Ankit Chhajer”,
“org”: “Barclays”, “country”: “UK”}, {“name”: “Arnab Ganguly”, “org”:
“Barclays”, “country”: “UK”}, {“name”: “Islam Utyagulov”, “org”:
“Barclays”, “country”: “UK”}, {“name”: “Luke Christoforidis”, “org”:
“Barclays”, “country”: “UK”}, {“name”: “Paulo De Sa”, “org”: “Barclays”,
“country”: “UK”}, {“name”: “Samuel Siddons”, “org”: “Barclays”,
“country”: “UK”}, {“name”: “Srikant Bhagat”, “org”: “Barclays”,
“country”: “UK”}, {“name”: “Stephen Broadhurst”, “org”: “Barclays”,
“country”: “UK”}, {“name”: “Francois Buet-Golfouse”, “org”: “Barclays
Bank”, “country”: “UK”}, {“name”: “Tanmoy Ghosh”, “org”: “Barclays
Bank”, “country”: “India”}, {“name”: “Cristina Vazquez Pelegri”, “org”:
“CaixaBank”, “country”: “Spain”}, {“name”: “Simon W.”, “org”: “Charles
Schwab”, “country”: “UK”}, {“name”: “Ami Craven”, “org”: “Citi”,
“country”: “UK”}, {“name”: “Mark Fullbrook”, “org”: “Citi”, “country”:
“UK”}, {“name”: “Michael Cockcroft”, “org”: “Citi”, “country”: “UK”},
{“name”: “Mihai Arnautu”, “org”: “Citi”, “country”: “UK”}, {“name”:
“Mike Scott”, “org”: “Citi”, “country”: “UK”}, {“name”: “Tipi Renard”,
“org”: “Citi”, “country”: “UK”}, {“name”: “Wayne Liao”, “org”: “Citi”,
“country”: “UK”}, {“name”: “William Monks”, “org”: “Citi”, “country”:
“UK”}, {“name”: “Deepa Rao”, “org”: “Cognizant”, “country”: “UK”},
{“name”: “Tomas Klenke”, “org”: “Commerzbank”, “country”: “Germany”},
{“name”: “Sonal Surana”, “org”: “Commonwealth Bank”, “country”:
“Australia”}, {“name”: “Jean-Baptiste Meriem”, “org”: “Credit Agricole”,
“country”: “France”}, {“name”: “Mahendirane Manivannane”, “org”: “Credit
Agricole”, “country”: “Singapore”}, {“name”: “Nicole Roux”, “org”:
“Credit Agricole”, “country”: “France”}, {“name”: “Simone
Fabiole-Nicoletto”, “org”: “Credit Agricole”, “country”: “Italy”},
{“name”: “Olga Burdzinska”, “org”: “Credit Suisse”, “country”:
“Poland”}, {“name”: “Tim Mason”, “org”: “DEUTSCHE BANK”, “country”:
“United Kingdom”}, {“name”: “Ingrid Puiggene Robles”, “org”: “DNB”,
“country”: “Norway”}, {“name”: “Kasper Tjorntved Davidsen”, “org”:
“Danske Bank”, “country”: “Denmark”}, {“name”: “Snehasish Mahapatra”,
“org”: “Danske Bank”, “country”: “Denmark”}, {“name”: “Max Sommerfeld”,
“org”: “Deutsche Bank”, “country”: “Germany”}, {“name”: “Maxim
Romanovsky”, “org”: “Deutsche Bank”, “country”: “Germany”}, {“name”:
“Paul Hewitt”, “org”: “Deutsche Bank”, “country”: “UK”}, {“name”: “Sumit
Goyal”, “org”: “Deutsche Bank”, “country”: “UK”}, {“name”: “Vivek
Cheriyath”, “org”: “Deutsche Bank”, “country”: “Singapore”}, {“name”:
“Akash Dewangan”, “org”: “EY”, “country”: “UK”}, {“name”: “Prasad
Prabhakaran”, “org”: “Esynergy”, “country”: “UK”}, {“name”: “Benjamin
Szekeres”, “org”: “Goldman Sachs”, “country”: “UK”}, {“name”: “Goncalo
De Melo”, “org”: “Goldman Sachs”, “country”: “UK”}, {“name”: “Raktim
Datta”, “org”: “Goldman Sachs”, “country”: “UK”}, {“name”: “Baris
Alyildiz”, “org”: “Groupe BPCE”, “country”: “France”}, {“name”: “Mohamed
El Moktar A.”, “org”: “Groupe BPCE”, “country”: “France”}, {“name”:
“Elias Romei”, “org”: “HDI ASSICURAZIONI”, “country”: “Italy”}, {“name”:
“Derek Pang”, “org”: “HSBC”, “country”: “UK”}, {“name”: “Jeff Valane”,
“org”: “HSBC”, “country”: “UK”}, {“name”: “John Hosking”, “org”: “HSBC”,
“country”: “UK”}, {“name”: “Sol Enenmoh”, “org”: “HSBC”, “country”:
“UK”}, {“name”: “Sujay Gupta”, “org”: “HSBC”, “country”: “UK”}, {“name”:
“Tom Croft”, “org”: “HSBC”, “country”: “UK”}, {“name”: “Daniela
Aragaki”, “org”: “Handelsbanken”, “country”: “Sweden”}, {“name”: “Clara
Campisi”, “org”: “ING”, “country”: “Netherlands”}, {“name”: “Will
Chien”, “org”: “ING”, “country”: “Netherlands”}, {“name”: “Desislava
Nikolova”, “org”: “Intesa Sanpaolo”, “country”: “Italy”}, {“name”:
“Greta Greco”, “org”: “Intesa Sanpaolo”, “country”: “Italy”}, {“name”:
“Sofia Ruggeri”, “org”: “Intesa Sanpaolo”, “country”: “Italy”}, {“name”:
“Lee Obrien”, “org”: “Investec”, “country”: “UK”}, {“name”: “Ali Rais
Shaghaghi”, “org”: “JP Morgan”, “country”: “UK”}, {“name”: “Ashleigh
Thompson”, “org”: “JP Morgan”, “country”: “UK”}, {“name”: “Carlos
Santos”, “org”: “JP Morgan”, “country”: “UK”}, {“name”: “David Mellor”,
“org”: “JP Morgan”, “country”: “UK”}, {“name”: “Dilshat Uteshev”, “org”:
“JP Morgan”, “country”: “UK”}, {“name”: “Einar Bui Magnusson”, “org”:
“JP Morgan”, “country”: “UK”}, {“name”: “Jing Wang”, “org”: “JP Morgan”,
“country”: “UK”}, {“name”: “John Greenall”, “org”: “JP Morgan”,
“country”: “UK”}, {“name”: “Kevin Cornally”, “org”: “JP Morgan”,
“country”: “Ireland”}, {“name”: “Lucas Vinh Tran”, “org”: “JP Morgan”,
“country”: “UK”}, {“name”: “Neela Muhil Vannan”, “org”: “JP Morgan”,
“country”: “UK”}, {“name”: “Nelson Vadori”, “org”: “JP Morgan”,
“country”: “France”}, {“name”: “Nicolas Marchesotti”, “org”: “JP
Morgan”, “country”: “UK”}, {“name”: “Petros Ypsilantis”, “org”: “JP
Morgan”, “country”: “UK”}, {“name”: “Phyllis M. Kodi Asiama-Bekoe”,
“org”: “JP Morgan”, “country”: “UK”}, {“name”: “Sambit Mohanty”, “org”:
“JP Morgan”, “country”: “UK”}, {“name”: “Sean M.”, “org”: “JP Morgan”,
“country”: “UK”}, {“name”: “Sia Togia”, “org”: “JP Morgan”, “country”:
“UK”}, {“name”: “Simon Eltringham”, “org”: “JP Morgan”, “country”:
“UK”}, {“name”: “Toni Kitaka”, “org”: “JP Morgan”, “country”: “UK”},
{“name”: “Yawwani Gunawardana”, “org”: “JP Morgan”, “country”: “UK”},
{“name”: “Akhilesh Gupta”, “org”: “JPMorgan Chase”, “country”: “USA”},
{“name”: “Scott Lombardo”, “org”: “JPMorgan Chase”, “country”: “USA”},
{“name”: “Mansoor H.”, “org”: “Jyske Bank”, “country”: “Denmark”},
{“name”: “Martin Clausen”, “org”: “Jyske Bank”, “country”: “Denmark”},
{“name”: “Berk Gokden”, “org”: “Klarna”, “country”: “Netherlands”},
{“name”: “Felix Leenhardt”, “org”: “Klarna”, “country”: “Germany”},
{“name”: “Joao Tonon”, “org”: “Klarna”, “country”: “Germany”}, {“name”:
“Kevin Lindemann”, “org”: “Klarna”, “country”: “UK”}, {“name”: “Sebnem
Erener”, “org”: “Klarna”, “country”: “Sweden”}, {“name”: “Yuri Gusev”,
“org”: “Klarna”, “country”: “Sweden”}, {“name”: “Gerhard Wohlgenannt”,
“org”: “LGT Private Banking”, “country”: “Liechtenstein”}, {“name”:
“Matthew Martindale”, “org”: “Lloyds Banking Group”, “country”: “UK”},
{“name”: “Max Souter”, “org”: “Lloyds Banking Group”, “country”: “UK”},
{“name”: “Richard Bates”, “org”: “Lloyds Banking Group”, “country”:
“UK”}, {“name”: “Vijay Rentala”, “org”: “Lloyds Banking Group”,
“country”: “UK”}, {“name”: “Chris Kenyon”, “org”: “MUFG”, “country”:
“UK”}, {“name”: “Santiago Castro”, “org”: “MUFG”, “country”: “UK”},
{“name”: “Adil Nussipov”, “org”: “Morgan Stanley”, “country”:
“Hungary”}, {“name”: “Marek Rathousky”, “org”: “NN Group”, “country”:
“Czech”}, {“name”: “Andrew Robinson”, “org”: “NatWest Group”, “country”:
“UK”}, {“name”: “Chris Conway”, “org”: “NatWest Group”, “country”:
“UK”}, {“name”: “David More”, “org”: “NatWest Group”, “country”: “UK”},
{“name”: “Grant Falconer”, “org”: “NatWest Group”, “country”: “UK”},
{“name”: “Jatin Patel”, “org”: “NatWest Group”, “country”: “UK”},
{“name”: “Maja Pantic”, “org”: “NatWest Group”, “country”: “UK”},
{“name”: “Laurent Chauvet”, “org”: “Natixis Corporate & Investment
Banking”, “country”: “France”}, {“name”: “Lyes Meghara”, “org”: “Natixis
Corporate & Investment Banking”, “country”: “France”}, {“name”: “Soon
Yung Low”, “org”: “Natwest”, “country”: “UK”}, {“name”: “Soumi
Chatterjee”, “org”: “Nomura”, “country”: “UK”}, {“name”: “Azin Emami”,
“org”: “Nordea”, “country”: “Denmark”}, {“name”: “Iida Herttuainen”,
“org”: “Nordea”, “country”: “Denmark”}, {“name”: “John Skov”, “org”:
“Nordea”, “country”: “Denmark”}, {“name”: “Ross Richards”, “org”:
“Nordea”, “country”: “Norway”}, {“name”: “Kim Ostergaard”, “org”:
“Nykredit”, “country”: “Denmark”}, {“name”: “Lasse Daniel Sander
Jensen”, “org”: “Nykredit”, “country”: “Denmark”}, {“name”: “Oyvind
Strom”, “org”: “Nykredit”, “country”: “Denmark”}, {“name”: “Juha
Vesanto”, “org”: “OP Financial Group”, “country”: “Finland”}, {“name”:
“Benjamin Hirsch”, “org”: “Oldenburgische Landesbank”, “country”:
“Germany”}, {“name”: “Ania Pawlowicz”, “org”: “PKO Bank Polski”,
“country”: “Poland”}, {“name”: “Martyna Rachanczyk”, “org”: “PKO Bank
Polski”, “country”: “Poland”}, {“name”: “Philip Yazdani”, “org”: “Pictet
Group”, “country”: “Switzerland”}, {“name”: “Bisheng Liu”, “org”: “RBC”,
“country”: “Canada”}, {“name”: “Daniel Bloch”, “org”: “RISK BOOKS”,
“country”: “France”}, {“name”: “Luis Santos”, “org”: “Raiffeisen Bank
International AG”, “country”: “Austria”}, {“name”: “Thomas Limbacher”,
“org”: “Raiffeisen Bank International AG”, “country”: “Austria”},
{“name”: “Denis Agiev”, “org”: “Revolut”, “country”: “UAE”}, {“name”:
“Pavel Nesterov”, “org”: “Revolut”, “country”: “UK”}, {“name”: “Carolina
Sanchez Ruiz”, “org”: “Santander”, “country”: “Spain”}, {“name”: “Conny
Ploth”, “org”: “Santander”, “country”: “Spain”}, {“name”: “Ignacio
Bernal”, “org”: “Santander”, “country”: “Spain”}, {“name”: “Marta García
De Oteyza Kindelan”, “org”: “Santander”, “country”: “Spain”}, {“name”:
“Monica Sanchez-Ocana Luengo”, “org”: “Santander”, “country”: “Spain”},
{“name”: “Rui Barrento”, “org”: “Santander”, “country”: “Spain”},
{“name”: “Daniel Herbera”, “org”: “Societe Generale”, “country”:
“France”}, {“name”: “Khaled Soudani”, “org”: “Societe Generale”,
“country”: “France”}, {“name”: “Nadia Khanijali”, “org”: “Societe
Generale”, “country”: “France”}, {“name”: “Nydia G.”, “org”: “Societe
Generale”, “country”: “France”}, {“name”: “Regis Bernard”, “org”:
“Societe Generale”, “country”: “France”}, {“name”: “Rebecca
Noorderhaven”, “org”: “Starling Bank”, “country”: “UK”}, {“name”:
“Annabelle Gerard”, “org”: “Stellantis Finance & Services”, “country”:
“France”}, {“name”: “Arnaud Dudouet”, “org”: “Stellantis Finance &
Services”, “country”: “France”}, {“name”: “David Janjgava”, “org”:
“Stellantis Finance & Services”, “country”: “Germany”}, {“name”: “Joan
Andre”, “org”: “Stellantis Finance & Services”, “country”: “France”},
{“name”: “Kaynaz Behdin”, “org”: “Stellantis Finance & Services”,
“country”: “France”}, {“name”: “Krzysztof Miksa”, “org”: “Stellantis
Finance & Services”, “country”: “Poland”}, {“name”: “Paola Antonella
Garzonio”, “org”: “Stellantis Finance & Services”, “country”: “Italy”},
{“name”: “Andy Perryman”, “org”: “Sumitomo Mitsui Banking Corporation”,
“country”: “USA”}, {“name”: “Lucas Le Corvec”, “org”: “The Postal Bank”,
“country”: “France”}, {“name”: “Alex Maloftis”, “org”: “UBS”, “country”:
“UK”}, {“name”: “Alex Porciani”, “org”: “UBS”, “country”:
“Switzerland”}, {“name”: “Ana Torres Vonmoos”, “org”: “UBS”, “country”:
“Switzerland”}, {“name”: “Anastasia K.”, “org”: “UBS”, “country”: “UK”},
{“name”: “Arek Bochnak”, “org”: “UBS”, “country”: “Poland”}, {“name”:
“Bartlomiej Pietran”, “org”: “UBS”, “country”: “Poland”}, {“name”:
“Chris Finn”, “org”: “UBS”, “country”: “UK”}, {“name”: “Christian
Diethelm-Spiss”, “org”: “UBS”, “country”: “Switzerland”}, {“name”:
“Claire Beck”, “org”: “UBS”, “country”: “Switzerland”}, {“name”: “Daniel
Harris”, “org”: “UBS”, “country”: “UK”}, {“name”: “Debmalya Biswas”,
“org”: “UBS”, “country”: “Switzerland”}, {“name”: “Dennis Meier”, “org”:
“UBS”, “country”: “Switzerland”}, {“name”: “Dimiter Milushev”, “org”:
“UBS”, “country”: “Switzerland”}, {“name”: “Eleni Verteouri”, “org”:
“UBS”, “country”: “Switzerland”}, {“name”: “Fabrizio Ghigi”, “org”:
“UBS”, “country”: “Switzerland”}, {“name”: “Georg Langlotz”, “org”:
“UBS”, “country”: “Switzerland”}, {“name”: “Geraldine Bloch”, “org”:
“UBS”, “country”: “Switzerland”}, {“name”: “Giovanni Catalano”, “org”:
“UBS”, “country”: “Switzerland”}, {“name”: “Giovanni V.”, “org”: “UBS”,
“country”: “Switzerland”}, {“name”: “Javiera Guedes”, “org”: “UBS”,
“country”: “Switzerland”}, {“name”: “Jorg Altmann”, “org”: “UBS”,
“country”: “Switzerland”}, {“name”: “Jurre Corver”, “org”: “UBS”,
“country”: “Switzerland”}, {“name”: “Kevin Sullivan”, “org”: “UBS”,
“country”: “UK”}, {“name”: “Kinga Surowka”, “org”: “UBS”, “country”:
“UK”}, {“name”: “Kornelia Trzesowska”, “org”: “UBS”, “country”:
“Poland”}, {“name”: “Luca Stinca”, “org”: “UBS”, “country”:
“Switzerland”}, {“name”: “Luther Teng”, “org”: “UBS”, “country”: “UK”},
{“name”: “Mateusz Bracisiewicz”, “org”: “UBS”, “country”: “Poland”},
{“name”: “Maximilian Kronborg”, “org”: “UBS”, “country”: “UK”}, {“name”:
“Maximillian Scrase”, “org”: “UBS”, “country”: “Switzerland”}, {“name”:
“Michal Czyszczon”, “org”: “UBS”, “country”: “Poland”}, {“name”:
“Nicolas Pose”, “org”: “UBS”, “country”: “Switzerland”}, {“name”: “Nikos
Karastathis”, “org”: “UBS”, “country”: “Switzerland”}, {“name”: “Philip
Hill”, “org”: “UBS”, “country”: “UK”}, {“name”: “Priyanka Bajaj”, “org”:
“UBS”, “country”: “UK”}, {“name”: “Sergio Greco”, “org”: “UBS”,
“country”: “Switzerland”}, {“name”: “Shilpen Patel”, “org”: “UBS”,
“country”: “UK”}, {“name”: “Spencer Rockman”, “org”: “UBS”, “country”:
“UK”}, {“name”: “Stefano Medagli”, “org”: “UBS”, “country”:
“Switzerland”}, {“name”: “Sumeet Gyanchandani”, “org”: “UBS”, “country”:
“Switzerland”}, {“name”: “Taiji Okada”, “org”: “UBS”, “country”: “UK”},
{“name”: “Vinitha Sivaraman”, “org”: “UBS”, “country”: “Switzerland”},
{“name”: “Marco Filippone”, “org”: “UniCredit”, “country”: “Italy”},
{“name”: “Ayca A.”, “org”: “bunq”, “country”: “Netherlands”}, {“name”:
“Wessel Endtz”, “org”: “bunq”, “country”: “Netherlands”}, {“name”:
“Harmenjan Sijtsma”, “org”: “de Volksbank”, “country”: “Netherlands”}

]

# ── Helpers ───────────────────────────────────────────────────────────────────

def safe_filename(name: str) -> str:
    return re.sub(r"[^a-zA-Z0-9_\-]", "_", name)

def build_ddg_url(name: str, org: str, country: str) -> str:
    """
    Build a DuckDuckGo search URL that:
      - searches in English (kl=us-en)
      - restricts results to linkedin.com/in/ profiles
    """
    query = f"{name} {org} {country} linkedin site:linkedin.com/in"
    params = {
        "q":  query,
        "kl": "us-en",   # region = US English – forces English results
        "kp": "-2",      # safe search off (avoids filtering legit profiles)
    }
    return "https://duckduckgo.com/?" + urlencode(params)

# ── Core logic ────────────────────────────────────────────────────────────────

def find_and_screenshot(page, person: dict, output_dir: str) -> dict:
    name    = person["name"]
    org     = person["org"]
    country = person["country"]
    result  = {"name": name, "linkedin_url": None,
                "screenshot": None, "elapsed_s": None, "error": None}

    start = time.perf_counter()
    print(f"\n{'─'*60}")
    print(f"[{name}]  Searching: {name} {org} {country} linkedin")

    try:
        # 1️⃣  Go directly to DuckDuckGo with the pre-built English search URL
        search_url = build_ddg_url(name, org, country)
        page.goto(search_url, wait_until="domcontentloaded")

        # Accept cookie/consent banner if present
        try:
            page.click("button:has-text('Accept all')", timeout=3000)
        except PWTimeout:
            pass

        page.wait_for_load_state("domcontentloaded")
        time.sleep(1)

        # 2️⃣  Find first linkedin.com/in/ link in results
        linkedin_url = None
        for a in page.locator("a[href*='linkedin.com/in/'], a[href*='linkedin.com/pub/']").all():
            href = a.get_attribute("href") or ""
            if href.startswith("/url?"):
                qs = parse_qs(urlparse(href).query)
                href = qs.get("q", [href])[0]
            if "linkedin.com/in/" in href or "linkedin.com/pub/" in href:
                linkedin_url = href.split("?")[0]
                break

        if not linkedin_url:
            raise ValueError("No LinkedIn URL found on the search results page.")

        result["linkedin_url"] = linkedin_url
        print(f"  ✔  LinkedIn URL: {linkedin_url}")

        # 3️⃣  Open LinkedIn profile – force English with ?locale=en_US
        english_url = linkedin_url.rstrip("/") + "?locale=en_US"
        page.goto(english_url, wait_until="domcontentloaded", timeout=20000)
        time.sleep(2)

        # 4️⃣  Screenshot
        os.makedirs(output_dir, exist_ok=True)
        filename = f"{safe_filename(name)}_{datetime.now().strftime('%H%M%S')}.png"
        filepath = os.path.join(output_dir, filename)
        page.screenshot(path=filepath, full_page=True)
        result["screenshot"] = filepath
        print(f"  📸 Screenshot saved: {filepath}")

    except Exception as exc:
        result["error"] = str(exc)
        print(f"  ✖  ERROR: {exc}")

    result["elapsed_s"] = round(time.perf_counter() - start, 2)
    print(f"  ⏱  Elapsed: {result['elapsed_s']} s")
    return result


def run():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    results   = []
    run_start = time.perf_counter()

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=False,
            slow_mo=400,
            args=["--start-maximized"]
        )
        context = browser.new_context(
            viewport={"width": 1440, "height": 900},
            locale="en-US",                   # ← US English locale
            timezone_id="America/New_York",   # ← English timezone (avoids EU detection)
            extra_http_headers={
                "Accept-Language": "en-US,en;q=0.9",   # ← force English HTTP header
            },
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/122.0.0.0 Safari/537.36"
            ),
        )

        # Hide Playwright webdriver fingerprint
        context.add_init_script(
            "Object.defineProperty(navigator, 'webdriver', {get: () => undefined});"
        )

        page = context.new_page()

        for person in PEOPLE:
            res = find_and_screenshot(page, person, OUTPUT_DIR)
            results.append(res)
            time.sleep(2)

        browser.close()

    # ── Summary ───────────────────────────────────────────────────────────────
    total = round(time.perf_counter() - run_start, 2)
    print(f"\n{'═'*60}")
    print(f"  BENCHMARK SUMMARY  –  {len(PEOPLE)} people  |  total {total}s")
    print(f"{'═'*60}")
    print(f"  {'Name':<25} {'Time(s)':>7}  {'Status'}")
    print(f"  {'─'*25} {'─'*7}  {'─'*30}")
    for r in results:
        status = r["screenshot"] if r["screenshot"] else f"FAIL – {r['error']}"
        print(f"  {r['name']:<25} {r['elapsed_s']:>7}  {status}")
    print(f"{'═'*60}\n")
    print(f"Screenshots saved to: ./{OUTPUT_DIR}/")


if __name__ == "__main__":
    run()
