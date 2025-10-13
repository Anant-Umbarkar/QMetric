// bloomRecommendation.js

function generateBloomRecommendations(sequenceData, coDetails, bloomLevelMap, actualCOData) {
    const recommendations = [];
    const actualWeightage = {};
    const expectedWeightage = {};

    // Count number of questions per Bloom's level
    const levelQuestionCounts = {};
    sequenceData.forEach((question) => {
        const actualLevel = question["Bloom's Taxonomy Level"];
        levelQuestionCounts[actualLevel] = (levelQuestionCounts[actualLevel] || 0) + 1;
    });

    const totalQuestions = sequenceData.length;

    // Calculate actual weightage as percentage of questions for each level
    for (let level = 1; level <= 4; level++) {
        const count = levelQuestionCounts[level] || 0;
        actualWeightage[level] = totalQuestions > 0 ? ((count / totalQuestions) * 100).toFixed(2) : "0.00";
    }

    // Calculate expected weightage per Bloom's level from CO mapping using actualCOData
    Object.entries(coDetails).forEach(([coKey, details]) => {
        if (details.blooms && details.blooms.length > 0) {
            const bloom = details.blooms[0].toLowerCase();
            const level = bloomLevelMap[bloom] || 4;
            // Normalize CO key for actualCOData lookup (e.g., "CO1" -> "1")
            let normalizedKey = coKey;
            if (actualCOData[coKey] === undefined) {
                normalizedKey = coKey.replace(/CO/i, '').trim();
            }
            const coWeightage = actualCOData[normalizedKey]?.weightage || 0;
            expectedWeightage[level] = (expectedWeightage[level] || 0) + coWeightage;
        }
    });

    sequenceData.forEach((question, index) => {
        const coKey = question.CO;
        const actualLevel = question["Bloom's Taxonomy Level"];
        const expectedBloom = coDetails[coKey]?.blooms[0]?.toLowerCase() || '';
        const expectedLevel = bloomLevelMap[expectedBloom] || 4;

        if (actualLevel !== expectedLevel) {
            recommendations.push({
                questionIndex: index + 1,
                co: coKey,
                expectedLevel,
                actualLevel,
                suggestion: actualLevel < expectedLevel ? "Decrease Bloom's level" : "Increase Bloom's level"
            });
        } else {
            recommendations.push({
                questionIndex: index + 1,
                co: coKey,
                expectedLevel,
                actualLevel,
                suggestion: "Bloom's level is appropriate"
            });
        }
    });

    // Prepare overview for Bloom levels 1 to 4
    const bloomLevelOverview = {};
    for (let level = 1; level <= 4; level++) {
        bloomLevelOverview[level] = {
            numberOfQuestions: levelQuestionCounts[level] || 0,
            actual: actualWeightage[level],
            expected: expectedWeightage[level] || 0
        };
    }

    return {
        recommendations,
        bloomLevelOverview
    };
}

module.exports = { generateBloomRecommendations };
