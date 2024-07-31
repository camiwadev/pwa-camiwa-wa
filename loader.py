import requests

# URL de la API
url = 'https://db.buckapi.com:8090/api/collections/camiwaSpecialties/records'

# Lee la información del archivo de texto
with open('info.txt', 'r') as file:
    data = file.read()

# Convierte el texto a un diccionario Python
specialties = eval(data)

# Itera sobre las categorías y subcategorías y carga los datos en la API
for category, subcategories in specialties.items():
    for subcategory in subcategories:
        data = {
            "name": subcategory,
            "fatherId": category,
            "level": "subcategory"
        }
        response = requests.post(url, json=data)
        if response.status_code == 200:
            print(f"Se ha cargado correctamente la subcategoría '{subcategory}' en la categoría '{category}'.")
        else:
            print(f"Error al cargar la subcategoría '{subcategory}' en la categoría '{category}'.")
