import json
import requests

# URL del endpoint
url = 'https://db.camiwa.com:8092/api/collections/camiwaSpecialties/records'

# Leer las especialidades del archivo specialties.txt
with open('specialties.txt', 'r', encoding='utf-8') as file:
    data = json.load(file)

# Contar el total de especialidades
total_specialties = sum(len(details['specialties']) for details in data.values())
processed_specialties = 0

# Procesar cada categoría y sus especialidades
for category, details in data.items():
    father_id = details['id']
    specialties = details['specialties']
    
    for specialty in specialties:
        # Crear el diccionario de datos
        payload = {
            "name": specialty,
            "fatherId": father_id,
            "image": "",  # Asumimos que no hay imagen por el momento
            "level": ""  # Asumimos que no hay nivel por el momento
        }
        
        # Enviar la solicitud POST
        response = requests.post(url, json=payload)
        
        # Mostrar mensaje por consola
        processed_specialties += 1
        if response.status_code == 200 or response.status_code == 201:
            print(f"[{processed_specialties}/{total_specialties}] Especialidad '{specialty}' creada exitosamente.")
        else:
            print(f"[{processed_specialties}/{total_specialties}] Error al crear la especialidad '{specialty}': {response.text}")
