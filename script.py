import json
import urllib.request
import time
from bs4 import BeautifulSoup

def obtener_celulares():
    productos = []
    
    # Definimos cuántas páginas queremos recorrer (ej. 5 páginas traerán entre 80 y 100+ celulares)
    PAGINAS_A_RECORRER = 5 
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
    }

    for pagina in range(1, PAGINAS_A_RECORRER + 1):
        # Añadimos el parámetro &page= para recorrer varias páginas
        url = f"https://www.amazon.com/s?k=cell+phones&page={pagina}"
        
        try:
            req = urllib.request.Request(url, headers=headers)
            html = urllib.request.urlopen(req).read()
            soup = BeautifulSoup(html, 'html.parser')
            
            # Buscar contenedores de productos
            items = soup.find_all('div', {'data-component-type': 's-search-result'})
            
            # Recorremos TODOS los productos encontrados en la página (sin [:10])
            for item in items:
                # Evitar banners publicitarios que no tienen título o precio
                titulo_elem = item.find('h2')
                if not titulo_elem:
                    continue
                titulo = titulo_elem.text.strip()
                
                # Enlace
                link_elem = item.find('a', class_='a-link-normal')
                link = "https://www.amazon.com" + link_elem['href'] if link_elem and 'href' in link_elem.attrs else "#"
                
                # Imagen
                img_elem = item.find('img', class_='s-image')
                imagen = img_elem['src'] if img_elem and 'src' in img_elem.attrs else ""
                
                # Precio
                precio_elem = item.find('span', class_='a-offscreen')
                precio = precio_elem.text.strip() if precio_elem else "Consultar precio"
                
                productos.append({
                    "titulo": titulo,
                    "link": link,
                    "imagen": imagen,
                    "precio": precio
                })
                
            print(f"Página {pagina} procesada. Total acumulado: {len(productos)} productos.")
            
            # Pausa de 2 segundos entre páginas para evitar ser bloqueados por Amazon
            time.sleep(2)
            
        except Exception as e:
            print(f"Error al extraer la página {pagina}: {e}")
            break

    # Si por algún motivo de bloqueo no se obtuvo nada, dejamos un respaldo mínimo
    if not productos:
        productos = [{
            "titulo": "Ver todos los celulares en Amazon",
            "link": "https://www.amazon.com/s?k=cell+phones",
            "imagen": "https://via.placeholder.com/150",
            "precio": "Ver ofertas"
        }]

    # Guardar todos los celulares acumulados en productos.json
    with open('productos.json', 'w', encoding='utf-8') as f:
        json.dump(productos, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    obtener_celulares()