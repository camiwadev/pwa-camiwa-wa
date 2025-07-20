import requests

# URL del endpoint
url = 'https://db.camiwa.com:8092/api/collections/camiwaCategories/records'

# Leer las categorías del archivo de texto
with open('categories.txt', 'r', encoding='utf-8') as file:
    categories = file.readlines()

# Quitar los saltos de línea y espacios en blanco
categories = [category.strip() for category in categories]

# Enviar las categorías al endpoint
for category in categories:
    data = {
        "name": category,
        

        # "name": category
    }
    response = requests.post(url, json=data)
    
    # Mostrar mensaje por consola
    if response.status_code == 200 or response.status_code == 201:
        print(f"Categoría '{category}' creada exitosamente.")
    else:
        print(f"Error al crear la categoría '{category}': {response.text}")
