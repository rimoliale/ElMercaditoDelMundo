import os
import json
import re
import time
import random
from concurrent.futures import ThreadPoolExecutor, as_completed
from bs4 import BeautifulSoup
from curl_cffi import requests

# ==============================================================================
# CONFIGURACIÓN GENERAL
# ==============================================================================
ARCHIVO_JSON = "productos.json"
CODIGO_POSTAL_AR = "1828"
PAIS_DESTINO = "AR"
PAGINAS_BUSQUEDA = 4          # Páginas de búsqueda general a recorrer
MAX_NUEVOS_POR_CORRIDA = 40   # Cantidad máxima de celulares nuevos por ejecución
HILOS_PARALELOS = 3           # Descargas simultáneas (rápido y seguro)

URLS_SECCIONES = [
    ("Resultados", "https://www.amazon.com/s?k=unlocked+cell+phones&page={page}"),
    ("Los más vendidos", "https://www.amazon.com/Best-Sellers-Unlocked-Cell-Phones/zgbs/wireless/2407749011"),
    ("Los más valorados", "https://www.amazon.com/s?k=unlocked+cell+phones&s=review-rank&page=1"),
]

session = requests.Session(impersonate="chrome124")
session.headers.update({
    "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
})
session.cookies.set("i18n-prefs", "USD", domain=".amazon.com")
session.cookies.set("lc-main", "es_US", domain=".amazon.com")


# ==============================================================================
# 1. MEMORIA INCREMENTAL (SALTEA ASIN YA GUARDADOS)
# ==============================================================================
def cargar_productos_existentes():
    if not os.path.exists(ARCHIVO_JSON):
        return [], set()
    try:
        with open(ARCHIVO_JSON, "r", encoding="utf-8") as f:
            data = json.load(f)
            if not isinstance(data, list):
                return [], set()
            asins_vistos = {p.get("asin") for p in data if p.get("asin")}
            return data, asins_vistos
    except Exception as e:
        print(f"Aviso leyendo {ARCHIVO_JSON}: {e}")
        return [], set()


# ==============================================================================
# 2. CONFIGURACIÓN DE ENVÍO A ARGENTINA (CP 1828)
# ==============================================================================
def configurar_destino_argentina(cp="1828"):
    try:
        resp_home = session.get("https://www.amazon.com/", timeout=20)
        match_csrf = re.search(r'name="anti-csrftoken-a2z"\s+value="([^"]+)"', resp_home.text)
        csrf_token = match_csrf.group(1) if match_csrf else ""

        headers_glow = {
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
            "Referer": "https://www.amazon.com/",
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
            "https://www.amazon.com/portal-migration/hz/glow/address-change?actionSource=glow",
            json=payload,
            headers=headers_glow,
            timeout=15
        )
        print(f"Ubicación configurada -> País: {PAIS_DESTINO}, CP: {cp} (HTTP {resp_loc.status_code})")
    except Exception as e:
        print(f"Aviso al configurar CP {cp}: {e}")


# ==============================================================================
# HELPERS DE LIMPIEZA Y ESPECIFICACIONES
# ==============================================================================
def limpiar_texto(texto):
    if not texto:
        return ""
    return re.sub(r"\s+", " ", texto).strip()


def extraer_precio_numero(precio_str):
    if not precio_str:
        return None
    nums = re.findall(r"[\d,.]+", precio_str)
    if not nums:
        return None
    try:
        return float(nums[0].replace(",", ""))
    except ValueError:
        return None


def parsear_tabla_especificaciones(soup):
    specs = {}

    for tr in soup.select("#productOverview_feature_div tr"):
        cols = tr.find_all(["td", "th"])
        if len(cols) >= 2:
            k = limpiar_texto(cols[0].text).lower()
            v = limpiar_texto(cols[1].text)
            specs[k] = v

    for tr in soup.select("table.prodDetTable tr, #detailBullets_feature_div li"):
        th = tr.find("th")
        td = tr.find("td")
        if th and td:
            k = limpiar_texto(th.text).lower()
            v = limpiar_texto(td.text)
            specs[k] = v
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


# ==============================================================================
# 3. RECOLECCIÓN POR SECCIONES (RESULTADOS, MÁS VENDIDOS, MÁS VALORADOS, BLACK FRIDAY)
# ==============================================================================
def recolectar_por_secciones(asins_existentes):
    catalogo_nuevo = {}
    salteados = 0

    def registrar_item(asin, seccion_origen, badge_texto="", rating=0.0, resenas="", titulo="", imagen="", precios=None):
        nonlocal salteados
        if not asin:
            return
        if asin in asins_existentes:
            salteados += 1
            return

        if asin not in catalogo_nuevo:
            catalogo_nuevo[asin] = {
                "asin": asin,
                "titulo_lista": titulo,
                "imagen_lista": imagen,
                "precios_detectados": precios or [],
                "secciones": [],
                "badge_amazon": badge_texto,
                "rating": rating,
                "cantidad_resenas": resenas,
                "link": f"https://www.amazon.com/dp/{asin}"
            }

        entry = catalogo_nuevo[asin]
        if seccion_origen and seccion_origen not in entry["secciones"]:
            entry["secciones"].append(seccion_origen)
        if badge_texto:
            if not entry["badge_amazon"]:
                entry["badge_amazon"] = badge_texto
            if badge_texto not in entry["secciones"]:
                entry["secciones"].append(badge_texto)
        if rating and not entry["rating"]:
            entry["rating"] = rating
        if resenas and not entry["cantidad_resenas"]:
            entry["cantidad_resenas"] = resenas

    # Paso A: Resultados generales + detección de Black Friday / Más vendido
    for pagina in range(1, PAGINAS_BUSQUEDA + 1):
        if len(catalogo_nuevo) >= MAX_NUEVOS_POR_CORRIDA:
            break
        url = f"https://www.amazon.com/s?k=unlocked+cell+phones&page={pagina}"
        try:
            resp = session.get(url, timeout=20)
            soup = BeautifulSoup(resp.text, "html.parser")
            items = soup.find_all("div", {"data-component-type": "s-search-result"})

            for item in items:
                asin = item.get("data-asin", "").strip()
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

                registrar_item(
                    asin=asin,
                    seccion_origen="Resultados",
                    badge_texto=badge_texto,
                    rating=rating_num,
                    resenas=resenas,
                    titulo=limpiar_texto(titulo_el.text) if titulo_el else "",
                    imagen=img_el["src"] if img_el and img_el.get("src") else "",
                    precios=precios_nums
                )

            time.sleep(random.uniform(1.0, 1.8))
        except Exception as e:
            print(f"Error en Resultados pág {pagina}: {e}")

    # Paso B: Secciones "Los más vendidos" y "Los más valorados"
    for nombre_seccion, url_sec in URLS_SECCIONES[1:]:
        if len(catalogo_nuevo) >= MAX_NUEVOS_POR_CORRIDA:
            break
        try:
            resp = session.get(url_sec, timeout=20)
            soup = BeautifulSoup(resp.text, "html.parser")

            for nodo in soup.select("[data-asin]"):
                asin = nodo.get("data-asin", "").strip()
                if len(asin) == 10:
                    img_el = nodo.find("img")
                    registrar_item(
                        asin=asin,
                        seccion_origen=nombre_seccion,
                        badge_texto=nombre_seccion,
                        titulo=limpiar_texto(img_el.get("alt", "")) if img_el else "",
                        imagen=img_el.get("src", "") if img_el else ""
                    )
            time.sleep(random.uniform(1.0, 1.8))
        except Exception as e:
            print(f"Error en sección {nombre_seccion}: {e}")

    print(f"   (Se omitieron {salteados} ocurrencias de ASIN ya guardados)")
    return list(catalogo_nuevo.values())[:MAX_NUEVOS_POR_CORRIDA]


# ==============================================================================
# 4. EXTRACCIÓN COMPLETA DE CADA FICHA (/dp/ASIN)
# ==============================================================================
def obtener_detalle_producto(item_base):
    asin = item_base["asin"]
    url = item_base["link"]
    time.sleep(random.uniform(0.5, 1.4))

    try:
        resp = session.get(url, timeout=25)
        soup = BeautifulSoup(resp.text, "html.parser")

        titulo_el = soup.select_one("#productTitle")
        titulo = limpiar_texto(titulo_el.text) if titulo_el else item_base["titulo_lista"]

        img_el = soup.select_one("#landingImage, #imgBlkFront")
        imagen = (
            img_el.get("data-old-hires")
            or img_el.get("src")
            or item_base["imagen_lista"]
            if img_el
            else item_base["imagen_lista"]
        )

        # Precios (actual vs más caro / tachado)
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

        # Variantes exactas del ASIN: Color, Estilo, Tamaño
        color = limpiar_texto(
            (soup.select_one("#variation_color_name .selection") or soup.select_one("#inline-twister-expanded-dimension-text-color_name") or BeautifulSoup("", "html.parser")).text
        )
        estilo = limpiar_texto(
            (soup.select_one("#variation_style_name .selection") or soup.select_one("#inline-twister-expanded-dimension-text-style_name") or BeautifulSoup("", "html.parser")).text
        )
        tamano_var = limpiar_texto(
            (soup.select_one("#variation_size_name .selection") or soup.select_one("#inline-twister-expanded-dimension-text-size_name") or BeautifulSoup("", "html.parser")).text
        )

        # Acerca de este producto
        bullets = [
            limpiar_texto(li.text)
            for li in soup.select("#feature-bullets ul li span.a-list-item")
            if limpiar_texto(li.text) and "ver más" not in li.text.lower()
        ]

        # Envío / Entrega a Argentina (CP 1828)
        entrega_el = soup.select_one(
            "#mir-layout-DELIVERY_BLOCK-slot-PRIMARY_DELIVERY_MESSAGE_LARGE, #deliveryBlockMessage"
        )
        texto_entrega = limpiar_texto(entrega_el.text) if entrega_el else ""

        match_envio = re.search(r"(?:US\$|\$)\s*[\d,.]+", texto_entrega)
        costo_envio = match_envio.group(0) if match_envio else "Sin envío directo / Consultar"

        match_fecha = re.search(
            r"(?:entrega|delivery|llega).*?(?:\d+\s*de\s*\w+|\w+\s*\d+)(?:\s*-\s*(?:\d+\s*de\s*\w+|\w+\s*\d+))?",
            texto_entrega,
            re.IGNORECASE,
        )
        dias_entrega = match_fecha.group(0) if match_fecha else texto_entrega

        # Especificaciones técnicas
        specs = parsear_tabla_especificaciones(soup)

        marca = buscar_spec(specs, ["marca", "brand"]) or (titulo.split()[0] if titulo else "")
        almacenamiento = (
            buscar_spec(specs, ["capacidad de almacenamiento", "memory storage capacity", "almacenamiento"])
            or tamano_var
        )
        anio = buscar_spec(specs, ["año del modelo", "model year", "año"])
        estado = (
            limpiar_texto((soup.select_one("#condition-statement, #renewedProgramDescriptionAtf") or BeautifulSoup("", "html.parser")).text)
            or buscar_spec(specs, ["condición", "condition", "estado"])
            or "Nuevo"
        )
        sistema_operativo = buscar_spec(specs, ["sistema operativo", "operating system"])
        tamano_pantalla = buscar_spec(specs, ["tamaño de la pantalla", "screen size", "dimensiones"])

        # Completar rating/reseñas si vino desde Best Sellers sin esos datos
        rating_final = item_base["rating"]
        if not rating_final:
            r_el = soup.select_one("#acrPopover span.a-icon-alt")
            if r_el:
                m_r = re.search(r"(\d+[.,]\d+)", r_el.text)
                if m_r:
                    rating_final = float(m_r.group(1).replace(",", "."))

        resenas_final = item_base["cantidad_resenas"]
        if not resenas_final:
            rev_el = soup.select_one("#acrCustomerReviewText")
            if rev_el:
                resenas_final = limpiar_texto(rev_el.text)

        return {
            "asin": asin,
            "titulo": titulo,
            "link": url,
            "imagen": imagen,
            # Secciones y reputación estilo Amazon
            "secciones": item_base["secciones"],
            "badge_amazon": item_base["badge_amazon"],
            "rating": rating_final,
            "cantidad_resenas": resenas_final,
            # Variantes y datos principales
            "marca": marca,
            "estilo": estilo,
            "color": color or buscar_spec(specs, ["color"]),
            "tamano": tamano_var or tamano_pantalla,
            "acerca_de_este_producto": bullets,
            # Entrega a Argentina CP 1828
            "entrega": {
                "codigo_postal": CODIGO_POSTAL_AR,
                "detalle_completo": texto_entrega,
                "costo_envio": costo_envio,
                "dias_estimados_argentina": dias_entrega,
            },
            # Precios
            "precio": f"US$ {precio_actual:,.2f}" if precio_actual else "Consultar precio",
            "precio_mas_caro": f"US$ {precio_mas_caro:,.2f}" if precio_mas_caro else "",
            "precio_numerico": precio_actual or 0,
            "precio_mas_caro_numerico": precio_mas_caro or 0,
            # Especificaciones técnicas adicionales
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


# ==============================================================================
# EJECUCIÓN PRINCIPAL
# ==============================================================================
def main():
    productos_guardados, asins_existentes = cargar_productos_existentes()
    print(f"0. Ya hay {len(productos_guardados)} celulares guardados en {ARCHIVO_JSON}.")

    print(f"1. Configurando destino Argentina (CP {CODIGO_POSTAL_AR})...")
    configurar_destino_argentina(CODIGO_POSTAL_AR)

    print("2. Buscando ASINs nuevos por secciones...")
    lista_nuevos = recolectar_por_secciones(asins_existentes)
    print(f"   Se encontraron {len(lista_nuevos)} celulares NUEVOS para detallar.")

    if not lista_nuevos:
        print("No hay celulares nuevos para agregar. No se modifica productos.json.")
        return

    nuevos_detallados = []
    print(f"3. Extrayendo fichas técnicas en paralelo ({HILOS_PARALELOS} hilos)...")
    with ThreadPoolExecutor(max_workers=HILOS_PARALELOS) as executor:
        futuros = {executor.submit(obtener_detalle_producto, item): item for item in lista_nuevos}
        for futuro in as_completed(futuros):
            data = futuro.result()
            if data and data["titulo"]:
                nuevos_detallados.append(data)
                print(f"   [NUEVO] {data['asin']} | {data['marca']} ({data['color']}) -> {data['titulo'][:35]}...")

    # Agrega los nuevos arriba y conserva intactos todos los anteriores
    total_final = nuevos_detallados + productos_guardados

    with open(ARCHIVO_JSON, "w", encoding="utf-8") as f:
        json.dump(total_final, f, ensure_ascii=False, indent=2)

    print(f"Listo: +{len(nuevos_detallados)} celulares nuevos. Total acumulado: {len(total_final)}.")


if __name__ == "__main__":
    main()