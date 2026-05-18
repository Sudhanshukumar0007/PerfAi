const axios = require('axios');
const Employee = require('../models/Employee');

const getRecommendation = async (req, res, next) => {
  try {
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({ error: 'employeeId is required' });
    }

    const employee = await Employee.findOne({ _id: employeeId, createdBy: req.user.id });
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const prompt = `You are an expert HR analyst. Analyze the following employee profile and provide structured recommendations.

Employee Profile:
- Name: ${employee.name}
- Department: ${employee.department}
- Skills: ${employee.skills.join(', ')}
- Performance Score: ${employee.performanceScore}/100
- Years of Experience: ${employee.experience}

You MUST respond with ONLY a valid JSON object. No explanation, no markdown, no code fences. Just raw JSON.

{
  "promotionEligible": true,
  "promotionReason": "one sentence explaining why or why not",
  "trainingRecommendations": ["skill1", "skill2", "skill3"],
  "overallRating": "Excellent",
  "aiFeedback": "2-3 sentence detailed feedback paragraph about this employee.",
  "rank": "Top Performer"
}

Rules:
- promotionEligible: boolean (true if performanceScore >= 75)
- overallRating: one of exactly: "Excellent", "Good", "Average", "Needs Improvement"
- rank: one of exactly: "Top Performer", "Strong Performer", "Average Performer", "Needs Development"
- trainingRecommendations: array of 3 strings
- All fields are required`;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-oss-120b:free',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 1500,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'PerfAI',
        },
      }
    );

    const rawContent = response.data.choices[0]?.message?.content || '';
    console.log('Raw AI response:', rawContent); // helpful for debugging

    if (!rawContent) {
      return res.status(500).json({ error: 'AI returned empty response' });
    }

    const cleaned = rawContent
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);

    let parsedResponse;
    try {
      if (jsonMatch) {
        let jsonString = jsonMatch[0];
        
        // Quick trick to fix lightly truncated JSON (very common with free models)
        if (jsonString.lastIndexOf('}') < jsonString.lastIndexOf('"')) {
          jsonString += '"}';
        } else if (!jsonString.endsWith('}')) {
          jsonString += '}';
        }

        parsedResponse = JSON.parse(jsonString);
      } else {
        parsedResponse = JSON.parse(cleaned);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response. Raw was:', cleaned);
      // Instead of failing completely, provide a graceful fallback so the UI still works
      parsedResponse = {
        promotionEligible: employee.performanceScore >= 80,
        promotionReason: "Automatically inferred based on performance score due to AI service limitation.",
        trainingRecommendations: ["General Skills Enhancement", "Communication Training"],
        overallRating: employee.performanceScore >= 80 ? "Excellent" : (employee.performanceScore >= 50 ? "Good" : "Needs Improvement"),
        aiFeedback: "AI recommendation service provided an incomplete response. This is a generic analysis based on standard metrics."
      };
    }

    const rankMap = {
      'top performer': 'Top Performer',
      'strong performer': 'Strong Performer', 
      'average performer': 'Average Performer',
      'needs development': 'Needs Development',
    };
    const normalizedRank = rankMap[parsedResponse.rank?.toLowerCase()] || parsedResponse.rank || 'Average Performer';

    const ratingMap = {
      'excellent': 'Excellent',
      'good': 'Good',
      'average': 'Average',
      'needs improvement': 'Needs Improvement',
    };
    const normalizedRating = ratingMap[parsedResponse.overallRating?.toLowerCase()] || parsedResponse.overallRating || 'Average';

    // Default missing fields
    const finalResponse = {
      promotionEligible: !!parsedResponse.promotionEligible,
      promotionReason: parsedResponse.promotionReason || "Reason not provided by AI.",
      trainingRecommendations: Array.isArray(parsedResponse.trainingRecommendations) ? parsedResponse.trainingRecommendations : ["Review core competencies"],
      overallRating: normalizedRating,
      rank: normalizedRank,
      aiFeedback: parsedResponse.aiFeedback || "No additional feedback.",
      employee: {
        name: employee.name,
        department: employee.department,
        performanceScore: employee.performanceScore,
        experience: employee.experience,
        skills: employee.skills,
      }
    };

    return res.status(200).json(finalResponse);
  } catch (error) {
    console.error('AI Controller Error:', error.response?.data || error.message);
    const apiError = error.response?.data?.error?.message || error.message;
    return res.status(500).json({ error: 'Failed to get recommendation: ' + apiError });
  }
};

module.exports = { getRecommendation };
