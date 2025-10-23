# extraction_logic.py
import sys
import spacy
import subprocess

# Load spaCy English model
try:
    nlp = spacy.load("en_core_web_sm")
except Exception as e:
    print("Downloading spaCy model...", file=sys.stderr)
    subprocess.run([sys.executable, "-m", "spacy", "download", "en_core_web_sm"], check=True)
    print(f"spaCy model loading error: {e}", file=sys.stderr)
    sys.exit(1)

# Bloom's taxonomy verbs
blooms_verbs = {
    "recall", "give", "reproduce", "memorize", "define", "identify", "describe",
    "label", "list", "name", "state", "match", "recognize", "examine", "draw",
    "write", "locate", "quote", "read", "record", "repeat", "retell", "visualize",
    "copy", "duplicate", "enumerate", "listen", "observe", "omit", "tabulate",
    "tell", "what", "why", "when", "where", "which", "explain", "how", "interpret",
    "paraphrase", "summarize", "classify", "compare", "differentiate", "discuss",
    "distinguish", "extend", "predict", "associate", "contrast", "convert",
    "demonstrate", "estimate", "infer", "relate", "restate", "translate",
    "generalize", "group", "illustrate", "judge", "order", "report", "represent",
    "research", "review", "rewrite", "show", "trace", "solve", "apply", "modify",
    "use", "calculate", "change", "experiment", "complete", "manipulate",
    "practice", "simulate", "transfer", "analyse", "analyze", "separate",
    "categorize", "correlate", "deduce", "devise", "dissect", "evaluate",
    "visualise", "assess", "appraise", "critique", "criticize", "discern",
    "discriminate", "consider", "weigh", "measure", "rate", "grade", "score",
    "rank", "test", "recommend", "decide", "conclude", "argue", "debate",
    "justify", "persuade", "defend", "support", "editorialize", "design",
    "compose", "create", "plan", "combine", "formulate", "invent", "hypothesize",
    "substitute", "compile", "construct", "develop", "integrate", "organize",
    "prepare", "produce", "rearrange", "adapt", "arrange", "assemble", "choose",
    "collaborate", "facilitate", "imagine", "intervene", "manage", "originate",
    "propose", "validate"
}

def extract_blooms_verbs(text):
    doc = nlp(text)
    return sorted({
        lemma for token in doc
        if (lemma := token.lemma_.lower().strip())
        and lemma.isalpha()  
        and lemma in blooms_verbs
    })

if __name__ == "__main__":
    input_text = sys.stdin.read().strip()
    if not input_text:
        print("No input provided.", file=sys.stderr)
        sys.exit(1)

    verbs = extract_blooms_verbs(input_text)
    print(','.join(verbs))
