// moduleWeightageRecommendation.js

function generateModuleRecommendations(moduleWeights) {
    const recommendations = [];

    moduleWeights.forEach((module, index) => {
        const expected = Math.round(module.expected);  
        const actual = Math.round(module.actual);      

        if (expected !== actual) {
            recommendations.push({
                module: `Module ${index + 1}`,
                expected,
                actual,
                suggestion: actual < expected ? "Increase marks for this module" : "Reduce marks for this module"
            });
        } else {
            recommendations.push({
                module: `Module ${index + 1}`,
                expected,
                actual,
                suggestion: "Marks for this module are appropriate"
            });
        }
    });

    return recommendations;
}

module.exports = { generateModuleRecommendations };
