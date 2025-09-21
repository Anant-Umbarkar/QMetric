// bloomRecommendation.js

function generateBloomRecommendations(sequenceData, coDetails, bloomLevelMap) {
    const recommendations = [];

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
        }
    });

    return recommendations;
}

module.exports = { generateBloomRecommendations };
