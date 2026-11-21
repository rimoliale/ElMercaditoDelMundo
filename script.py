import os
import json
import re
import time
import random
from concurrent.futures import ThreadPoolExecutor, as_completed
from bs4 import BeautifulSoup
from curl_cffi import requests

ARCHIVO_JSON = "productos.json"
CODIGO_POSTAL_AR = "1828"
PAIS_DESTINO = "AR"
DOMINIO_AMAZON = "https://www.amazon.es"
PAGINAS_BUSQUEDA = 3
MAX_NUEVOS_POR_CORRIDA = 30
HILOS_PARALELOS = 2

PERFILES_TLS = ["chrome124", "chrome120", "safari17_0"]

URLS_BUSQUEDA = [
    f"{DOMINIO_AMAZON}/s?k=moviles+libres&page={{page}}",
    f"{DOMINIO_AMAZON}/s?k=smartphone+libre&page={{page}}",
]


def crear_sesion():
    s = requests.Session(impersonate=random.choice(PERFILES_TLS))
    s.headers.update({
        "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Upgrade-Insecure-Requests": "1",
    })
    s.cookies.set("i18n-prefs", "EUR", domain=".amazon.es")
    s.cookies.set("lc-main", "es_ES", domain=".amazon.es")
    return s


session = crear_sesion()


def cargar_productos_existentes():
    if not os.path.exists(ARCHIVO_JSON):
        return [], set()
    try:
        with open(ARCHIVO_JSON, "r", encoding="utf-8") as f:
            contenido = f.read().strip()
            if not contenido:
                return [], set()
            data = json.loads(contenido)
            if not isinstance(data, list):
                return [], set()
            asins_vistos = {p.get("asin") for p in data if p.get("asin")}
            return data, asins_vistos
    except Exception as e:
        print(f"Aviso leyendo {ARCHIVO_JSON} (se reinicia como lista vacía): {e}")
        return [], set()


def configurar_destino_argentina(cp="1828"):
    try:
        resp_home = session.get(f"{DOMINIO_AMAZON}/", timeout=20)
        match_csrf = re.search(r'name="anti-csrftoken-a2z"\s+value="([^"]+)"', resp_home.text)
        csrf_token = match_csrf.group(1) if match_csrf else ""

        headers_glow = {
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
            "Referer": f"{DOMINIO_AMAZON}/",
        }
        if csrf_token:
            headers_glow["anti-csrftoken-a2z"] = csrf_token

        payload = {
            "locationType": "COUNTRY",
            "countryCode": PAIS_DESTINO,
            "zipCode": str(cp),
            "storeContext": "generic",
            "deviceType": "web",
            "pageType": "Gateway",
            "actionSource": "glow"
        }
        resp_loc = session.post(
            f"{DOMINIO_AMAZON}/portal-migration/hz/glow/address-change?actionSource=glow",
            json=payload,
            headers=headers_glow,
            timeout=15
        )
        print(f"Ubicación configurada en amazon.es -> País: {PAIS_DESTINO}, CP: {cp} (HTTP {resp_loc.status_code})")
    except Exception as e:
        print(f"Aviso al configurar CP {cp}: {e}")


def limpiar_texto(texto):
    if not texto:
        return ""
    return re.sub(r"\s+", " ", texto).strip()


def extraer_precio_numero(precio_str):
    """Soporta formato europeo de amazon.es (ej: '1.299,99 €' -> 1299.99)."""
    if not precio_str:
        return None
    nums = re.findall(r"[\d.,]+", precio_str)
    if not nums:
        return None
    val = nums[0]
    if "," in val and "." in val:
        val = val.replace(".", "").replace(",", ".")
    elif "," in val:
        val = val.replace(",", ".")
    try:
        return float(val)
    except ValueError:
        return None


def formatear_euro(valor):
    if not valor:
        return ""
    texto = f"{valor:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
    return f"€ {texto}"


def parsear_tabla_especificaciones(soup):
    specs = {}
    for tr in soup.select("#productOverview_feature_div tr"):
        cols = tr.find_all(["td", "th"])
        if len(cols) >= 2:
            specs[limpiar_texto(cols[0].text).lower()] = limpiar_texto(cols[1].text)

    for tr in soup.select("table.prodDetTable tr, #detailBullets_feature_div li"):
        th = tr.find("th")
        td = tr.find("td")
        if th and td:
            specs[limpiar_texto(th.text).lower()] = limpiar_texto(td.text)
        else:
            txt = limpiar_texto(tr.text)
            if ":" in txt:
                partes = txt.split(":", 1)
                specs[partes[0].lower().strip()] = partes[1].strip()
    return specs


def buscar_spec(specs, palabras_clave):
    for clave_real, valor in specs.items():
        for palabra in palabras_clave:
            if palabra in clave_real:
                return valor
    return ""


def recolectar_por_secciones(asins_existentes):
    global session
    catalogo_nuevo = {}

    for url_template in URLS_BUSQUEDA:
        if len(catalogo_nuevo) >= MAX_NUEVOS_POR_CORRIDA:
            break

        for pagina in range(1, PAGINAS_BUSQUEDA + 1):
            if len(catalogo_nuevo) >= MAX_NUEVOS_POR_CORRIDA:
                break

            url = url_template.format(page=pagina)
            try:
                resp = session.get(url, timeout=20)
                soup = BeautifulSoup(resp.text, "html.parser")
                titulo_pagina = limpiar_texto(soup.title.text) if soup.title else "Sin título"
                items = soup.find_all("div", {"data-component-type": "s-search-result"})

                print(f"   -> URL pág {pagina} | HTTP {resp.status_code} | Items: {len(items)} | Title: {titulo_pagina[:45]}")

                if len(items) == 0:
                    time.sleep(random.uniform(2.5, 4.0))
                    session = crear_sesion()
                    configurar_destino_argentina(CODIGO_POSTAL_AR)
                    resp = session.get(url, timeout=20)
                    soup = BeautifulSoup(resp.text, "html.parser")
                    items = soup.find_all("div", {"data-component-type": "s-search-result"})
                    print(f"   -> Reintento pág {pagina} | Items encontrados: {len(items)}")

                for item in items:
                    asin = item.get("data-asin", "").strip()
                    if not asin or asin in asins_existentes or asin in catalogo_nuevo:
                        continue

                    titulo_el = item.find("h2")
                    img_el = item.find("img", class_="s-image")
                    badge_el = item.select_one("span.a-badge-text")
                    badge_texto = limpiar_texto(badge_el.text) if badge_el else ""

                    rating_el = item.select_one("span.a-icon-alt")
                    rating_num = 0.0
                    if rating_el:
                        m_rat = re.search(r"(\d+[.,]\d+)", rating_el.text)
                        if m_rat:
                            rating_num = float(m_rat.group(1).replace(",", "."))

                    resenas_el = item.select_one("span.s-underline-text")
                    resenas = limpiar_texto(resenas_el.text) if resenas_el else ""

                    precios_spans = item.select("span.a-price span.a-offscreen")
                    precios_nums = [
                        extraer_precio_numero(p.text)
                        for p in precios_spans
                        if extraer_precio_numero(p.text) is not None
                    ]

                    secciones = ["Resultados"]
                    if badge_texto:
                        secciones.append(badge_texto)
                    if rating_num >= 4.4:
                        secciones.append("Los más valorados")

                    catalogo_nuevo[asin] = {
                        "asin": asin,
                        "titulo_lista": limpiar_texto(titulo_el.text) if titulo_el else "",
                        "imagen_lista": img_el["src"] if img_el and img_el.get("src") else "",
                        "precios_detectados": precios_nums,
                        "secciones": secciones,
                        "badge_amazon": badge_texto,
                        "rating": rating_num,
                        "cantidad_resenas": resenas,
                        "link": f"{DOMINIO_AMAZON}/dp/{asin}"
                    }

                time.sleep(random.uniform(1.5, 2.8))
            except Exception as e:
                print(f"Error en búsqueda pág {pagina}: {e}")

    return list(catalogo_nuevo.values())[:MAX_NUEVOS_POR_CORRIDA]


def obtener_detalle_producto(item_base):
    asin = item_base["asin"]
    url = item_base["link"]
    time.sleep(random.uniform(0.8, 1.8))

    try:
        resp = session.get(url, timeout=25)
        soup = BeautifulSoup(resp.text, "html.parser")

        titulo_el = soup.select_one("#productTitle")
        titulo = limpiar_texto(titulo_el.text) if titulo_el else item_base["titulo_lista"]

        if not titulo:
            return None

        img_el = soup.select_one("#landingImage, #imgBlkFront")
        imagen = (
            img_el.get("data-old-hires")
            or img_el.get("src")
            or item_base["imagen_lista"]
            if img_el
            else item_base["imagen_lista"]
        )

        precios_ficha = []
        for sel in [
            "#corePriceDisplay_desktop_feature_div span.a-offscreen",
            "#corePrice_feature_div span.a-offscreen",
            "span.apexPriceToPay span.a-offscreen",
            "span.a-text-price span.a-offscreen",
        ]:
            for el in soup.select(sel):
                num = extraer_precio_numero(el.text)
                if num:
                    precios_ficha.append(num)

        todos_precios = item_base["precios_detectados"] + precios_ficha
        precio_actual = min(todos_precios) if todos_precios else None
        precio_mas_caro = max(todos_precios) if todos_precios else None

        color = limpiar_texto(
            (soup.select_one("#variation_color_name .selection") or soup.select_one("#inline-twister-expanded-dimension-text-color_name") or BeautifulSoup("", "html.parser")).text
        )
        estilo = limpiar_texto(
            (soup.select_one("#variation_style_name .selection") or soup.select_one("#inline-twister-expanded-dimension-text-style_name") or BeautifulSoup("", "html.parser")).text
        )
        tamano_var = limpiar_texto(
            (soup.select_one("#variation_size_name .selection") or soup.select_one("#inline-twister-expanded-dimension-text-size_name") or BeautifulSoup("", "html.parser")).text
        )

        bullets = [
            limpiar_texto(li.text)
            for li in soup.select("#feature-bullets ul li span.a-list-item")
            if limpiar_texto(li.text) and "ver más" not in li.text.lower()
        ]

        entrega_el = soup.select_one(
            "#mir-layout-DELIVERY_BLOCK-slot-PRIMARY_DELIVERY_MESSAGE_LARGE, #deliveryBlockMessage"
        )
        texto_entrega = limpiar_texto(entrega_el.text) if entrega_el else ""

        match_envio = re.search(r"[\d.,]+\s*€|€\s*[\d.,]+", texto_entrega)
        costo_envio = match_envio.group(0) if match_envio else "Sin envío directo / Consultar"

        match_fecha = re.search(
            r"(?:entrega|llega).*?(?:\d+\s*de\s*\w+)(?:\s*-\s*(?:\d+\s*de\s*\w+))?",
            texto_entrega,
            re.IGNORECASE,
        )
        dias_entrega = match_fecha.group(0) if match_fecha else texto_entrega

        specs = parsear_tabla_especificaciones(soup)
        marca = buscar_spec(specs, ["marca", "brand", "fabricante"]) or (titulo.split()[0] if titulo else "")
        almacenamiento = (
            buscar_spec(specs, ["capacidad de almacenamiento", "capacidad de la memoria", "almacenamiento"])
            or tamano_var
        )
        anio = buscar_spec(specs, ["año del modelo", "año"])
        estado = (
            limpiar_texto((soup.select_one("#condition-statement, #renewedProgramDescriptionAtf") or BeautifulSoup("", "html.parser")).text)
            or buscar_spec(specs, ["condición", "estado"])
            or "Nuevo"
        )
        sistema_operativo = buscar_spec(specs, ["sistema operativo"])
        tamano_pantalla = buscar_spec(specs, ["tamaño de la pantalla", "tamaño de pantalla", "dimensiones"])

        return {
            "asin": asin,
            "titulo": titulo,
            "link": url,
            "imagen": imagen,
            "secciones": item_base["secciones"],
            "badge_amazon": item_base["badge_amazon"],
            "rating": item_base["rating"],
            "cantidad_resenas": item_base["cantidad_resenas"],
            "marca": marca,
            "estilo": estilo,
            "color": color or buscar_spec(specs, ["color"]),
            "tamano": tamano_var or tamano_pantalla,
            "acerca_de_este_producto": bullets,
            "entrega": {
                "codigo_postal": CODIGO_POSTAL_AR,
                "detalle_completo": texto_entrega,
                "costo_envio": costo_envio,
                "dias_estimados_argentina": dias_entrega,
            },
            "precio": formatear_euro(precio_actual) if precio_actual else "Consultar precio",
            "precio_mas_caro": formatear_euro(precio_mas_caro) if precio_mas_caro else "",
            "precio_numerico": precio_actual or 0,
            "precio_mas_caro_numerico": precio_mas_caro or 0,
            "especificaciones": {
                "capacidad_almacenamiento": almacenamiento,
                "anio": anio,
                "estado": estado,
                "sistema_operativo": sistema_operativo,
                "tamano_pantalla": tamano_pantalla,
            },
        }
    except Exception as e:
        print(f"Error procesando ASIN {asin}: {e}")
        return None


def main():
    productos_guardados, asins_existentes = cargar_productos_existentes()
    print(f"0. Celulares previos en {ARCHIVO_JSON}: {len(productos_guardados)}")

    configurar_destino_argentina(CODIGO_POSTAL_AR)
    lista_nuevos = recolectar_por_secciones(asins_existentes)
    print(f"2. Celulares NUEVOS detectados en amazon.es: {len(lista_nuevos)}")

    if not lista_nuevos:
        if not productos_guardados:
            with open(ARCHIVO_JSON, "w", encoding="utf-8") as f:
                json.dump([], f)
        print("No se obtuvieron items nuevos en esta ejecución.")
        return

    nuevos_detallados = []
    with ThreadPoolExecutor(max_workers=HILOS_PARALELOS) as executor:
        futuros = {executor.submit(obtener_detalle_producto, item): item for item in lista_nuevos}
        for futuro in as_completed(futuros):
            data = futuro.result()
            if data and data["titulo"]:
                nuevos_detallados.append(data)
                print(f"   [OK] {data['asin']} | {data['precio']} | {data['titulo'][:40]}...")

    total_final = productos_guardados + nuevos_detallados
    with open(ARCHIVO_JSON, "w", encoding="utf-8") as f:
        json.dump(total_final, f, ensure_ascii=False, indent=2)

    print(f"Listo: +{len(nuevos_detallados)} agregados. Total: {len(total_final)}")


if __name__ == "__main__":
    main()