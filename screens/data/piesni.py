import re
import json

def parse_songs_from_txt(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    songs = []
    current = None
    song_counter = 0

    for raw in lines:
        # obetnij wszystkie spacje/tabulatory z lewej
        line = raw.lstrip('\t\r ')  # zostawiam tylko \n jeśli jest
        # wykryj nagłówek: "liczba.kropka<TAB>tytuł..."
        header = re.match(r'^(\d+)\.\t(.+)', line)
        if header:
            # jeśli mieliśmy już pieśń w budowie, zamknij ją
            if current:
                current["text"] = "".join(current["text"])
                songs.append(current)

            song_counter += 1
            title = header.group(2).rstrip('\r\n')
            current = {
                "id": str(song_counter),
                "title": title,
                "text": []
            }
            continue

        # jeśli jesteśmy w treści pieśni
        if current is not None:
            # jeżeli to w pliku była pusta linia -> akapit
            if line.strip() == "":
                current["text"].append("\n")
            else:
                # usuń numeraliki wersów typu "1)" lub "1."
                content = re.sub(r'^\d+[)\.]\s*', '', line).rstrip('\r\n')
                # dorzuć prawdziwy znak nowej linii
                current["text"].append(content + "\n")

    # na końcu dopisz ostatnią pieśń
    if current:
        current["text"] = "".join(current["text"])
        songs.append(current)

    return songs

def save_songs_to_json(songs, output_file):
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(songs, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    piesni = parse_songs_from_txt("piesni.txt")
    save_songs_to_json(piesni, "piesni.json")
    print(f"Zapisano {len(piesni)} pieśni do piesni.json")
