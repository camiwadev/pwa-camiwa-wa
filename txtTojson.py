import json

# Leer el archivo data.txt
with open('data.txt', 'r', encoding='utf-8') as file:
    lines = file.readlines()

data = {}
current_category = None

# Procesar las líneas del archivo
for line in lines:
    line = line.strip()
    if not line:
        continue
    if not line.startswith(' '):
        # Es una nueva categoría
        current_category = line
        data[current_category] = []
    else:
        # Es un elemento de la categoría actual
        if current_category:
            data[current_category].append(line.strip())

# Guardar el diccionario como un archivo JSON
with open('data.json', 'w', encoding='utf-8') as json_file:
    json.dump(data, json_file, ensure_ascii=False, indent=4)

print("Archivo data.json generado exitosamente.")
