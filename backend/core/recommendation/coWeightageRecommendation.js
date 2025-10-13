// coWeightageRecommendation.js

function generateCORecommendations(coDetails, actualCOData) {
    const recommendations = [];

    // Step 1: Calculate total weight of all COs
    const totalWeight = Object.values(coDetails).reduce((sum, details) => sum + details.weight, 0);

    // Step 2: Calculate expected marks for each CO based on total weight
    Object.entries(coDetails).forEach(([coKey, details]) => {
        const expectedMarks = totalWeight > 0 ? (details.weight / totalWeight) * 100 : 0;
        const roundedExpected = Math.round(expectedMarks);  // Rounded normally
        const actual = actualCOData[parseInt(coKey.replace("CO", ""))] || 0;

        if (roundedExpected !== actual) {
            recommendations.push({
                co: coKey,
                expected: roundedExpected,
                actual,
                suggestion: actual < roundedExpected ? "Increase marks" : "Decrease marks"
            });
        } else {
            recommendations.push({
                co: coKey,
                expected: roundedExpected,
                actual,
                suggestion: "Marks are appropriate"
            });
        }
    });

    return recommendations;
}

module.exports = { generateCORecommendations };
