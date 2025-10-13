import sys
import spacy

nlp = spacy.load("en_core_web_sm")

def extract_verbs(text):
    doc = nlp(str(text))
    return [token.lemma_ for token in doc if token.pos_ == "VERB"]

if __name__ == "__main__":
    text = sys.argv[1]
    verbs = extract_verbs(text)
    print(','.join(verbs))  # Output as comma-separated string