//Version-2
const fs = require('fs');
const xlsx = require('xlsx');

// Bloom's taxonomy verbs by category
const bloomsTaxonomyVerbs = {
    "remember": ["recall", "give", "reproduce", "memorize", "define", "identify", "describe", "label", "list", "name", "state", "match", "recognize", "examine", "draw", "write", "locate", "quote", "read", "record", "repeat", "retell", "visualize", "copy", "duplicate", "enumerate", "listen", "observe", "omit", "tabulate", "tell", "what", "why", "when", "where", "which"],
    "understand": ["explain", "how", "interpret", "paraphrase", "summarize", "classify", "compare", "differentiate", "discuss", "distinguish", "extend", "predict", "associate", "contrast", "convert", "demonstrate", "estimate", "identify", "infer", "relate", "restate", "translate", "generalize", "group", "illustrate", "judge", "observe", "order", "report", "represent", "research", "review", "rewrite", "show", "trace"],
    "apply": ["solve", "apply", "modify", "use", "calculate", "change", "demonstrate", "experiment", "relate", "show", "complete", "manipulate", "practice", "simulate", "transfer"],
    "analyze": ["analyze", "compare", "classify", "contrast", "distinguish", "infer", "separate", "categorize", "differentiate", "correlate", "deduce", "devise", "dissect", "estimate", "evaluate"],
    "evaluate": ["evaluate", "judge", "assess", "appraise", "critique", "criticize", "discern", "discriminate", "consider", "weigh", "measure", "estimate", "rate", "grade", "score", "rank", "test", "recommend", "decide", "conclude", "argue", "debate", "justify", "persuade", "defend", "support", "summarize", "editorialize", "predict", "distinguish"],
    "create": ["design", "compose", "create", "plan", "combine", "formulate", "invent", "hypothesize", "substitute", "compile", "construct", "develop", "generalize", "integrate", "modify", "organize", "prepare", "produce", "rearrange", "rewrite", "adapt", "arrange", "assemble", "choose", "collaborate", "facilitate", "imagine", "intervene", "manage", "originate", "propose", "simulate", "solve", "support", "test", "validate"]
};

// Function to structurize and process the Excel data
exports.Structurize = (data, inputFile, bloomLevelMap) => {
    return new Promise((resolve, reject) => {
        try {
            const workbook = xlsx.readFile(inputFile);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // Convert the sheet into a JSON array
            const tableData = xlsx.utils.sheet_to_json(sheet, { defval: '' });

            const StructurizedData = tableData.map(row => {
                const questionText = row.question || row.Question || row.QUESTION || '';
                
                if (!questionText) {
                    console.warn(`Missing question text for row: ${JSON.stringify(row)}`);
                    return null; // Skip this row if no question text is found
                }

                const bloom = exports.FindBloomLevelsInText(questionText, bloomLevelMap);

                const moduleNumber = row.Module !== undefined && row.Module !== null
                ? String(row.Module).trim()
                : 'N/A';

                // Return structured data for each row, ensuring no null values
                return questionText ? {
                    ...row,
                    "Bloom's Verbs": bloom.words,
                    "Bloom's Taxonomy Level": bloom.highestLevel,
                    "Module": moduleNumber 
                } : null;
            }).filter(row => row !== null); 

            resolve(StructurizedData);
        } catch (error) {
            reject(`Error processing the file: ${error.message}`);
        }
    });
};

// Helper to find level name from verb
function findBloomLevel(word, bloomLevelMap) {
    for (const level in bloomsTaxonomyVerbs) {
        if (bloomsTaxonomyVerbs[level].includes(word)) {
            return level;
        }
    }
    return "Not Found";
}

// Public method to analyze Bloom level in a sentence
exports.FindBloomLevelsInText = (text, bloomLevelMap) => {
    const words = text.split(/\W+/); // Simple tokenization
    const wordResult = [];
    const levelResult = [];
    let highestLevel = Infinity; // Start with the highest possible value

    for (const word of words) {
        const level = findBloomLevel(word.toLowerCase(), bloomLevelMap);
        if (level !== "Not Found") {
            // console.log(level);
            const levelIndex = getBloomLevelIndex(level, bloomLevelMap);
            wordResult.push(word);
            levelResult.push(levelIndex);
            highestLevel = Math.min(highestLevel, levelIndex); 
        }
    }

    return {
        words: wordResult.join(", "),
        levels: levelResult.join(", "),
        highestLevel
    };
}

// Helper to convert level to number using bloomLevelMap
function getBloomLevelIndex(level, bloomLevelMap) {
    return bloomLevelMap[level] || Infinity; 
}






// C:\Users\user\Desktop\WEB D\mp>curl -X POST http://localhost:80/totext ^  -F "file=@C:\Users\user\Downloads\sample.xlsx" ^  -F "Sequence=[{\"name\":\"CO1\",\"type\":\"CO\",\"weight\":50,\"blooms\":[\"Understand\"]},{\"name\":\"CO2\",\"type\":\"CO\",\"weight\":30,\"blooms\":[\"Apply\"]},{\"name\":\"CO3\",\"type\":\"CO\",\"weight\":20,\"blooms\":[\"Analyse\"]},{\"name\":\"Module1\",\"type\":\"Module\",\"hours\":10},{\"name\":\"Module2\",\"type\":\"Module\",\"hours\":15}]" ^  -F "FormData={\"College Name\":\"XYZ College\",\"Branch\":\"Computer Science\",\"Year Of Study\":\"2nd Year\",\"Semester\":\"3rd\",\"Course Name\":\"Data Structures\",\"Course Code\":\"CS201\",\"Course Teacher\":\"Dr. Smith\"}"

//Experimenting
// curl -X POST http://localhost:80/upload/totext ^ -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODY0MWNiMGFjYTk4ZTc5NzRhYzhhZjYiLCJpYXQiOjE3NTI5MDIwNTcsImV4cCI6MTc1MzE2MTI1N30.Qo5kj7ufK0gjuAK0YgZbrVxxqaT3UbrkYC3SGER4Ae4" ^ -F "file=@C:\Users\user\Downloads\sample.xlsx" ^ -F "Sequence=[{\"name\":\"CO1\",\"type\":\"CO\",\"weight\":50,\"blooms\":[\"Understand\"]},{\"name\":\"CO2\",\"type\":\"CO\",\"weight\":30,\"blooms\":[\"Apply\"]},{\"name\":\"CO3\",\"type\":\"CO\",\"weight\":20,\"blooms\":[\"Analyse\"]},{\"name\":\"Module1\",\"type\":\"Module\",\"hours\":10},{\"name\":\"Module2\",\"type\":\"Module\",\"hours\":15}]" ^ -F "FormData={\"College Name\":\"XYZ College\",\"Branch\":\"Computer Science\",\"Year Of Study\":\"2nd Year\",\"Semester\":\"3rd\",\"Course Name\":\"Data Structures\",\"Course Code\":\"CS201\",\"Course Teacher\":\"Dr. Smith\"}"
