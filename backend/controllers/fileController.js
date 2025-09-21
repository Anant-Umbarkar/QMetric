//version2
const path = require("path");
const fs = require("fs");
const { Structurize } = require("../core/Regex/Regex");
const PaperInfo = require("../Model/PaperInfo");
const { Evaluate } = require("../core/evaluate/evaluate");

exports.convertToText = async (req, res) => {
    if (!req.file) {
        return res.status(400).send({ error: "No file uploaded." });
    }

    const {userId} = req.user; 
    
    const inputFileName = req.file.originalname;
    const fileExtension = path.extname(inputFileName).toLowerCase();
    const supportedExtensions = ['.xlsx'];

    if (!supportedExtensions.includes(fileExtension)) {
        return res.status(400).send({
            error: "Invalid File Format",
            message: "Only Excel files (.xlsx) are supported."
        });
    }

    try {
        const outputDir = path.join(__dirname, '../Converted');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const result = await saveToDB( userId, req.body.Sequence, req.body.FormData, req.file.path);
        if (result.error) {
            return res.status(500).send(result);
        }

        return res.send(result);

    } catch (error) {
        console.error('Error during conversion or DB save:', error);
        return res.status(500).send({ error: "Server error while processing file" });
    }
};

const saveToDB = async ( userId,Sequence, FormData, filePath) => {
    try {
        // Step 1: Safely Parse Input JSON
        let sequenceArray, formData;

        try {
            sequenceArray = JSON.parse(Sequence);
            formData = JSON.parse(FormData);
        } catch (parseErr) {
            console.error("Error parsing JSON:", parseErr);
            return { error: "Invalid JSON in Sequence or FormData" };
        }

        const coWeights = {};
        const moduleHours = {};
        const coDetails = {};

        // Step 2: Process Sequence and FormData to Extract COs and Modules
        sequenceArray.forEach(item => {
            const match = item.name.match(/\d+/);  // Match the CO or Module number
            if (!match) return;

            const number = match[0];

            if (item.type === 'CO') {
                const coKey = `CO${number}`;
                const weight = parseFloat(item.weight || 0);

                // Normalize Bloom levels to lowercase
                const blooms = Array.isArray(item.blooms)
                    ? item.blooms.filter(b => typeof b === 'string').map(b => b.toLowerCase())
                    : (typeof item.blooms === 'string' ? [item.blooms.toLowerCase()] : []);

                coWeights[coKey] = weight;
                coDetails[coKey] = { weight, blooms };
            } else if (item.type === 'Module') {
                moduleHours[`M${number}`] = parseFloat(item.hours || 0);
            }
        });

        // Step 3: Define Bloom Level Order
        const allBloomLevels = ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'];
        const bloomLevelMap = {};

        // Step 4: Sort COs by weight (highest weight gets lowest index)
        const sortedCOs = Object.entries(coDetails).sort((a, b) => b[1].weight - a[1].weight);

        // Assign levels to used Bloom levels
        sortedCOs.forEach(([_, data], index) => {
            const bloom = (data.blooms[0] || "").toLowerCase();
            if (bloom && !bloomLevelMap[bloom]) {
                bloomLevelMap[bloom] = index + 1;
            }
        });

        // Step 5: Assign default level 4 to unused Bloom levels
        allBloomLevels.forEach(level => {
            if (!bloomLevelMap[level]) {
                bloomLevelMap[level] = 4;
            }
        });

        console.log("Normalized Bloom Level Map:", bloomLevelMap);

        // Step 6: Process Question Data
        const questionData = await Structurize([], filePath, bloomLevelMap);
        const evaluationResult = Evaluate(questionData, coDetails, moduleHours, bloomLevelMap);

        // Step 7: Save Data to MongoDB
        const paper = new PaperInfo({
            "College Name": formData["College Name"],
            "Branch": formData.Branch,
            "Year Of Study": formData["Year Of Study"],
            "Semester": formData.Semester,
            "Course Name": formData["Course Name"],
            "Course Code": formData["Course Code"],
            "Course Teacher": formData["Course Teacher"],
            Sequence: {
                COs: coDetails,
                ModuleHours: moduleHours
            },
            "Collected Data": evaluationResult,
            "userId": userId
        });

        // Step 8: Save the paper document to MongoDB
        await paper.save();
        return evaluationResult;

    } catch (error) {
        console.error("Error saving to MongoDB:", error);
        return { error: "Failed to process and save data" };
    }
};

exports.getResults = async (req, res) => {
  try {
    // Safely destructure userId from req.user, fallback to 'anonymous' if req.user is undefined
    const { userId } = req.user || { userId: 'anonymous' };
    // console.log(userId)
   
    // Get all results for this user
    const userResults = await PaperInfo.find({ userId })
                                  .sort({ createdAt: -1 })
                                  .lean();

    if (userResults.length === 0) {
      return res.status(404).json({ 
        error: 'No results found',
        message: 'No analysis results found for your account'
      });
    }

    // Return the most recent result
    const latestResult = userResults[0];
    const { extractedText, ...responseData } = latestResult;

    res.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to retrieve results'
    });
  }
};

// exports.getResults = async(req, res) => {
//   try{
//     const id = req.params.id;
//     console.log(id);
//     const paper = await PaperInfo.findById(id);
//     res.status(200).json(paper);
//   } catch(error){
//     res.status(500).json({message: error.message})
//   }
// };

exports.getResultsById = async (req, res) => {
  try {
    // Safely destructure userId from req.user, fallback to 'anonymous' if req.user is undefined
    const { userId } = req.user || { userId: 'anonymous' };
   
   
    // Get all results for this user
    const userResults = await PaperInfo.find({ userId })
                                  .sort({ createdAt: -1 })
                                  .lean();

    if (userResults.length === 0) {
      return res.status(404).json({ 
        error: 'No results found',
        message: 'No analysis results found for your account'
      });
    }

    // Return the most recent result
    const results = userResults.map(({extractedText, ...rest}) => rest);

    res.json({
      success: true,
      data: results
    });

  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to retrieve results'
    });
  }
};

exports.searchPapers = async(req, res) => {
    try{
        const { userId } = req.user;
        const {query} = req.body;

        const searchRegex = new RegExp(query, 'i');

        const papers = await PaperInfo.find ({
            userId: userId,
            $or: [
            {"College Name":searchRegex},
            {"Branch":searchRegex},
            {"Course Name":searchRegex},
            {"Course Code":searchRegex}
        ]
    });

    res.json(papers);
}catch(error){
    res.status(500).json({error: error.message })
}
};