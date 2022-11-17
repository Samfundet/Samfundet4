import random

# Random samf-related words with norwegian and english translations
# Feel free to add more cool stuff
samf_words = [
    ("Reke", "Shrimp"),
    ("Herrem", "Herrem"),
    ("Gjengen", "Gang"),
    ("Runde", "Roundie"),
    ("Røde", "Red"),
    ("Huset", "House"),
    ("Samf", "Samf"),
    ("på Huset", "on da House"),
    ("Diverse", "Whatever"),
    ("Musikk", "Music"),
    ("Konsert", "Concert"),
    ("Baris", "Naked"),
    ("Sanktus", "Sanktus"),
    ("Richardus", "Richardus"),
    ("Birkeland", "Birkyland"),
    ("Richard", "Richard"),
    ("Studenter", "Students"),
    ("Eksamen", "Exam"),
    ("NTNU", "NTNU"),
    ("Gløsinger", "Glossies"),
    ("Opptak", "Admission"),
    ("STØNT", "Weirdos"),
    ("Web", "Web"),
    ("Redda", "Redda"),
    ("Layout", "Layout"),
    ("MG", "MG"),
    ("FK", "FK"),
    ("DG", "DG"),
    ("KU", "KU"),
    ("KSG", "KSG"),
    ("SIT", "SIT"),
    ("FG", "FG")
]


def words(count=1, include_english=False):
    choice = random.choices(samf_words, k=count)
    no = " ".join([w[0] for w in choice])
    en = " ".join([w[1] for w in choice])
    if include_english:
        return no, en
    return no

