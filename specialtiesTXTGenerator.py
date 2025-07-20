import json

# Cargar datos de especialidades desde el archivo especialidades.json
with open("especialidades.json", "r", encoding="utf-8") as file:
    categories_data = json.load(file)

# Información de categorías con sus respectivos ids
categories_info = [
    {"id": "qw02w11sim5tmr7", "name": "Médico General"},
    {"id": "k0kq5c0a0ulfem5", "name": "Cirugía Plástica"},
    {"id": "zjwt1ytejgj5im3", "name": "Estetica"},
    {"id": "8x7lctbgu0xrr6c", "name": "Odontologia"},
    {"id": "w47nv34vlvexl2a", "name": "Óptica"},
    {"id": "h9058p5ox57z7vw", "name": "Audiología"},
    {"id": "115fat2186o56nk", "name": "Psicologia"},
    {"id": "rocjj0nbs37dhas", "name": "Fisioterapia y Rehabilitación"},
    {"id": "r43lfcb20inskhv", "name": "Yoga y Meditacion"},
    {"id": "4cur9qd5lalpydn", "name": "Entrenadores personales"},
    {"id": "reiy8l6177f7e9h", "name": "Servicio Spa"},
    {"id": "4qpeus5mia73alv", "name": "Servicio de Belleza"},
    {"id": "ytbl3uf9svafhq9", "name": "Guías de aventura"},
    {"id": "ktuw1146tm9jfzr", "name": "Guia Turistico Bilingue"},
    {"id": "nakj562mbde1wk8", "name": "Terapia Energetica"},
    {"id": "sa7wb7353gpme0s", "name": "Enfermeras"},
    {"id": "rh4n9khtchppsaa", "name": "Espiritualidad"},
    {"id": "ntxtipav582j8l7", "name": "Tatuajes"}
]

# Crear un diccionario cruzado de categorías y especialidades
crossed_data = {}
total_specialties = 0

for category in categories_info:
    category_name = category["name"]
    category_id = category["id"]
    specialties = categories_data.get(category_name, [])
    crossed_data[category_name] = {
        "id": category_id,
        "specialties": specialties
    }
    total_specialties += len(specialties)

print(f"Total de especialidades: {total_specialties}")

# Preguntar si desea guardar el archivo con el nombre por defecto o con otro
default_filename = "specialties.txt"
user_choice = input(f"¿Desea guardar el archivo con el nombre '{default_filename}'? (s/n): ").strip().lower()

if user_choice == 's':
    filename = default_filename
else:
    filename = input("Ingrese el nombre del archivo: ").strip()

# Guardar la información en el archivo especificado
with open(filename, "w", encoding="utf-8") as file:
    json.dump(crossed_data, file, ensure_ascii=False, indent=4)

print(f"Archivo {filename} generado con éxito.")
