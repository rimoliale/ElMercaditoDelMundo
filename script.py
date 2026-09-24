import json
import urllib.request
from bs4 import BeautifulSoup

def obtener_celulares():
    # URL de búsqueda de celulares en Amazon
    url = "https://www.amazon.es/s?k=cell+phones"
    
    # Simular un navegador real para evitar bloqueos básicos
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
    }

    req = urllib.request.Request(url, headers=headers)
    
    productos = []
    
    try:
        html = urllib.request.urlopen(req).read()
        soup = BeautifulSoup(html, 'html.parser')
        
        # Buscar contenedores de productos
        items = soup.find_all('div', {'data-component-type': 's-search-result'})
        
        for item in items[:10]: # Extraemos los primeros 10 resultados
            # Título
            titulo_elem = item.find('h2')
            titulo = titulo_elem.text.strip() if titulo_elem else "Celular"
            
            # Enlace
            link_elem = item.find('a', class_='a-link-normal')
            link = "https://www.amazon.es" + link_elem['href'] if link_elem else "#"
            
            # Imagen
            img_elem = item.find('img', class_='s-image')
            imagen = img_elem['src'] if img_elem else ""
            
            # Precio
            precio_elem = item.find('span', class_='a-offscreen')
            precio = precio_elem.text.strip() if precio_elem else "Consultar precio"
            
            productos.append({
                "titulo": titulo,
                "link": link,
                "imagen": imagen,
                "precio": precio
            })
            
    except Exception as e:
        print(f"Error al extraer de Amazon: {e}")
        # Si falla por captcha, mantenemos una estructura mínima para no romper la web
        if not productos:
            productos = [{
                "titulo": "Ver todos los celulares en Amazon",
                "link": "https://www.amazon.es/s?k=cell+phones",
                "imagen": "https://via.placeholder.com/150",
                "precio": "Ver ofertas"
            }]

    # Guardar los datos en productos.json
    with open('productos.json', 'w', encoding='utf-8') as f:
        json.dump(productos, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    obtener_celulares()