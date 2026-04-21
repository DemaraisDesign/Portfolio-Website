import re

updates = {
    "The Secret in the Wings": "Balancing surreal, dream-like wonder with the macabre, and bridging the gap between candle-smoked folklore and modern psychological depth.",
    "The Sparrow": "Fusing small town, Midwestern idealism with a graphic novel aesthetic to explore the delicate balance between adolescent belonging and the heavy burden of guilt.",
    "The Yellow Boat": "Honoring the true story of a boy's beautiful imagination while navigating the heavy burden of his terminal illness through a vibrant, childlike lens.",
    "The 4th Graders Present an Unnamed Love-Suicide": "Fusing surreal minimalism with a unique, childlike Theatre of Cruelty tone to explore the juxtaposition of the ruthlessness of youth with the innocence of childhood love.",
    "Writer's Theatre": "Four classic horror stories commissioned and recorded during the isolation of Covid lockdowns, when sound and voice had to conjure every world.",
    "A Christmas Carol": "A record of the sonic development of an Emmy nominated film adaptation of Dickens' classic.",
    "HigherL": "Interactive audio design for GMetri, a web-based tool for immersive and interactive content. Reached 700k+ students across New York and Florida.",
    "Frozen Fluid": "Three scientists on a dying polar plain, constructing and deconstructing the systems of gender, faith, and time itself, while the world thaws around them.",
    "Take With Water": "Drawn almost entirely from nature, the landscape itself supports the emotional weight of this subtle dystopian story through touches of music and metaphor.",
    "Under Milkwood": 'Dylan Thomas\'s "play for voices" builds a complete world that leans heavily on language and sound, one that lives equally in dreams and in the waking life of a small town by the sea.',
    "She Kills Monsters": "A show that bridges the painful reality of grief and the fantastical realm of the imagination — finding the emotional truth underneath the monsters, the magic, and the 80's/90s nostalgia.",
    "The Nomad Project": "Nine different radio plays based at specific coordinates around Los Angeles, fully produced and recorded in isoloation during the Covid 19 lockdowns."
}

path = "src/data/projects.js"
with open(path, "r", encoding="utf-8") as f:
    original_code = f.read()

new_code = original_code

for title, new_desc in updates.items():
    # Find the block starting with title: "..." up to desc: "..."
    # We will use regex to find the title and the very next desc:
    pattern = re.compile(rf'(title:\s*"{re.escape(title)}".*?desc:\s*")[^"]*(")', re.DOTALL)
    
    # If using single quotes for desc, also handle that
    pattern_double = re.compile(rf'(title:\s*"{re.escape(title)}".*?desc:\s*")[^"]*(")', re.DOTALL)
    pattern_single = re.compile(rf"(title:\s*\"{re.escape(title)}\".*?desc:\s*')[^']*(')", re.DOTALL)
    
    def replacer(match):
        return match.group(1) + new_desc.replace('"', '\\"') + match.group(2)
        
    if pattern_single.search(new_code):
        new_code = pattern_single.sub(replacer, new_code, count=1)
    else:
        new_code = pattern_double.sub(replacer, new_code, count=1)

with open(path, "w", encoding="utf-8") as f:
    f.write(new_code)

print("Done patching.")
