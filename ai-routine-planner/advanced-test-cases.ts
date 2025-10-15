/**
 * Advanced Test Cases for AI-Augmented RoutinePlanner
 * 
 * Stress-testing scenarios designed to challenge the AI augmentation
 * and explore prompt engineering strategies.
 */

import * as fs from 'fs';
import { AIRoutinePlanner, ExerciseDatabase, MuscleGroup, ExperienceLevel, User, UserPreferences } from './routine-planner';
import { GeminiLLM } from './gemini-llm';

interface Config {
    apiKey: string;
}

interface TestResult {
    testName: string;
    prompt: string;
    success: boolean;
    error?: string;
    response?: string;
    parsedData?: any;
}

class AdvancedTestRunner {
    public planner: AIRoutinePlanner;
    private llm: GeminiLLM;
    private results: TestResult[] = [];

    constructor() {
        const config = this.loadConfig();
        this.llm = new GeminiLLM(config);
        this.planner = new AIRoutinePlanner(this.llm);
    }

    private loadConfig(): Config {
        try {
            const configData = fs.readFileSync('./config.json', 'utf8');
            return JSON.parse(configData);
        } catch (error) {
            return { apiKey: 'demo-key-for-testing' };
        }
    }

    async runAdvancedTest(testName: string, testFunction: () => Promise<TestResult>): Promise<TestResult> {
        console.log(`\n${'='.repeat(80)}`);
        console.log(`🚀 ADVANCED TEST: ${testName}`);
        console.log('='.repeat(80));

        const result = await testFunction();
        this.results.push(result);
        
        console.log(`\n📊 Test Result: ${result.success ? '✅ PASSED' : '❌ FAILED'}`);
        if (result.error) {
            console.log(`❌ Error: ${result.error}`);
        }
        console.log(`📝 Prompt Used: ${result.prompt}`);
        if (result.response) {
            console.log(`🤖 AI Response Length: ${result.response.length} characters`);
        }
        
        return result;
    }

    printSummary(): void {
        console.log(`\n${'='.repeat(80)}`);
        console.log('📈 ADVANCED TEST SUMMARY');
        console.log('='.repeat(80));
        
        const passed = this.results.filter(r => r.success).length;
        const total = this.results.length;
        
        console.log(`Total Advanced Tests: ${total}`);
        console.log(`Passed: ${passed}`);
        console.log(`Failed: ${total - passed}`);
        console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
        
        if (total - passed > 0) {
            console.log(`\n❌ Failed Tests:`);
            this.results.filter(r => !r.success).forEach(result => {
                console.log(`  - ${result.testName}: ${result.error}`);
            });
        }
    }

    getResults(): TestResult[] {
        return this.results;
    }
}

/**
 * TEST CASE 1: Complex Multi-Constraint Scenario
 * 
 * This test challenges the AI with multiple conflicting constraints,
 * requiring it to make intelligent trade-offs and prioritizations.
 */
async function testComplexMultiConstraint(): Promise<TestResult> {
    const runner = new AdvancedTestRunner();
    
    // Create a user with very specific and potentially conflicting constraints
    const user: User = {
        userId: 'complex_user_1',
        username: 'ComplexUser1',
        email: 'complex1@example.com'
    };

    const preferences: UserPreferences = {
        userId: user.userId,
        experienceLevel: ExperienceLevel.INTERMEDIATE,
        goals: 'Build maximum strength while maintaining cardiovascular health and preventing injury',
        availableEquipment: ['barbell', 'dumbbells', 'bench', 'pull-up bar', 'kettlebell'],
        timePerSession: 30, // Very tight time constraint
        preferredMuscleGroups: [MuscleGroup.CHEST, MuscleGroup.BACK, MuscleGroup.LEGS, MuscleGroup.SHOULDERS]
    };

    const prompt = `Create a workout that meets these COMPETING requirements:
    
CONFLICTING CONSTRAINTS:
- Time limit: ONLY 30 minutes total
- Goal: Build maximum strength (requires heavy weights, long rest)
- Goal: Maintain cardiovascular health (requires moderate intensity, shorter rest)
- Goal: Prevent injury (requires proper warm-up, controlled movements)
- Equipment: Limited to basic gym equipment
- Experience: Intermediate level
- Must target: Chest, Back, Legs, Shoulders (4 major groups)

DILEMMA: Strength training needs 2-3 minutes rest between sets, but cardio needs shorter rest.
DILEMMA: Warm-up takes time but prevents injury.
DILEMMA: Targeting 4 muscle groups in 30 minutes is challenging.

You must create a workout that intelligently balances these competing demands.
Respond with ONLY a JSON object in this exact format:
{
    "workout_name": "Balanced workout name",
    "estimated_duration": 30,
    "exercises": [
        {
            "exercise_name": "Exercise Name",
            "sets": 3,
            "reps": 8,
            "rest_time": 60
        }
    ]
}

Make intelligent trade-offs and explain your reasoning briefly in the workout_name.`;

    try {
        console.log('🎯 Testing: Complex Multi-Constraint Scenario');
        console.log('Challenge: Multiple conflicting requirements in tight timeframe');
        
        const template = await runner.planner.generateWorkoutFromPrompt(user, prompt, preferences);
        
        if (!template) {
            return {
                testName: 'Complex Multi-Constraint',
                prompt,
                success: false,
                error: 'Failed to generate workout template'
            };
        }

        // Validate the constraints were handled intelligently
        const durationValid = template.estimatedDuration <= 35; // Allow some flexibility
        const hasMultipleMuscleGroups = template.muscleGroups.size >= 3;
        const hasReasonableRestTimes = template.exercises.every(ex => (ex.restTime || 60) <= 180); // Max 3 min rest
        
        const success = durationValid && hasMultipleMuscleGroups && hasReasonableRestTimes;
        
        return {
            testName: 'Complex Multi-Constraint',
            prompt,
            success,
            error: success ? undefined : `Duration: ${template.estimatedDuration}min, Muscle Groups: ${template.muscleGroups.size}, Rest times: ${template.exercises.map(ex => ex.restTime).join(',')}`,
            parsedData: template
        };

    } catch (error) {
        return {
            testName: 'Complex Multi-Constraint',
            prompt,
            success: false,
            error: (error as Error).message
        };
    }
}

/**
 * TEST CASE 2: Ambiguous and Contradictory Instructions
 * 
 * This test presents the AI with ambiguous, contradictory, or nonsensical
 * instructions to see how it handles confusion and makes reasonable interpretations.
 */
async function testAmbiguousContradictoryInstructions(): Promise<TestResult> {
    const runner = new AdvancedTestRunner();
    
    const user: User = {
        userId: 'ambiguous_user_2',
        username: 'AmbiguousUser2',
        email: 'ambiguous2@example.com'
    };

    const preferences: UserPreferences = {
        userId: user.userId,
        experienceLevel: ExperienceLevel.BEGINNER,
        goals: 'Get stronger and more flexible',
        availableEquipment: ['bodyweight', 'resistance bands'],
        timePerSession: 45,
        preferredMuscleGroups: []
    };

    const prompt = `I need a workout that is:
- SUPER intense but also gentle and relaxing
- Focuses on building massive muscles but also helps with flexibility
- Takes exactly 45 minutes but should feel like it takes 2 hours
- Uses only bodyweight but also needs heavy weights
- Perfect for beginners but also challenges advanced athletes
- Burns maximum calories but also builds strength
- Can be done anywhere but requires a full gym
- Should be easy to follow but also mentally challenging

Please create a workout that somehow satisfies ALL these contradictory requirements.
Make reasonable interpretations and compromises where needed.

Respond with ONLY a JSON object in this exact format:
{
    "workout_name": "Compromise workout name",
    "estimated_duration": 45,
    "exercises": [
        {
            "exercise_name": "Exercise Name",
            "sets": 3,
            "reps": 8,
            "rest_time": 60
        }
    ]
}

Be creative in finding solutions that address the spirit of these conflicting requests.`;

    try {
        console.log('🎯 Testing: Ambiguous Contradictory Instructions');
        console.log('Challenge: Nonsensical and contradictory requirements');
        
        const template = await runner.planner.generateWorkoutFromPrompt(user, prompt, preferences);
        
        if (!template) {
            return {
                testName: 'Ambiguous Contradictory Instructions',
                prompt,
                success: false,
                error: 'Failed to generate workout template'
            };
        }

        // Success if it generates something reasonable despite contradictory instructions
        const hasExercises = template.exercises.length > 0;
        const durationReasonable = template.estimatedDuration >= 30 && template.estimatedDuration <= 120;
        
        const success =  hasExercises && durationReasonable;
        
        return {
            testName: 'Ambiguous Contradictory Instructions',
            prompt,
            success,
            error: success ? undefined : `Name: ${template.name}, Exercises: ${template.exercises.length}, Duration: ${template.estimatedDuration}`,
            parsedData: template
        };

    } catch (error) {
        return {
            testName: 'Ambiguous Contradictory Instructions',
            prompt,
            success: false,
            error: (error as Error).message
        };
    }
}

/**
 * TEST CASE 3: Extreme Edge Cases and Boundary Testing
 * 
 * This test pushes the AI to its limits with extreme values, unusual scenarios,
 * and boundary conditions that could cause failures.
 */
async function testExtremeEdgeCases(): Promise<TestResult> {
    const runner = new AdvancedTestRunner();
    
    const user: User = {
        userId: 'extreme_user_3',
        username: 'ExtremeUser3',
        email: 'extreme3@example.com'
    };

    const preferences: UserPreferences = {
        userId: user.userId,
        experienceLevel: ExperienceLevel.ADVANCED,
        goals: 'Prepare for an extreme fitness challenge',
        availableEquipment: ['barbell', 'dumbbells', 'bench', 'pull-up bar', 'squat rack', 'cable machine', 'kettlebell', 'medicine ball', 'resistance bands'],
        timePerSession: 180, // 3 hours - extremely long
        preferredMuscleGroups: [MuscleGroup.CHEST, MuscleGroup.BACK, MuscleGroup.LEGS, MuscleGroup.SHOULDERS, MuscleGroup.ABS, MuscleGroup.GLUTES, MuscleGroup.TRICEPS, MuscleGroup.BICEPS]
    };

    const prompt = `Create an EXTREME workout for an advanced athlete preparing for a fitness competition:

EXTREME REQUIREMENTS:
- Duration: EXACTLY 180 minutes (3 hours) - no more, no less
- Target: ALL 8 major muscle groups (chest, back, legs, shoulders, abs, glutes, triceps, biceps)
- Volume: Maximum possible volume while maintaining form
- Intensity: Should be extremely challenging but sustainable for 3 hours
- Progression: Include warm-up, main work, and cool-down phases
- Equipment: Use ALL available equipment creatively
- Rest: Minimize rest time but allow for recovery
- Variety: Include strength, power, endurance, and mobility work

CHALLENGES:
- 3 hours is an extremely long workout
- Targeting 15 muscle groups is comprehensive
- Must maintain intensity throughout
- Need to prevent overtraining and injury
- Must be structured and progressive

Create a workout that pushes the boundaries of what's possible while remaining safe and effective.

Respond with ONLY a JSON object in this exact format:
{
    "workout_name": "Extreme 3-hour workout name",
    "estimated_duration": 180,
    "exercises": [
        {
            "exercise_name": "Exercise Name",
            "sets": 5,
            "reps": 10,
            "rest_time": 60
        }
    ]
}

This should be a comprehensive, structured, and challenging workout.`;

    try {
        console.log('🎯 Testing: Extreme Edge Cases');
        console.log('Challenge: 3-hour workout targeting all muscle groups');
        
        const template = await runner.planner.generateWorkoutFromPrompt(user, prompt, preferences);
        
        if (!template) {
            return {
                testName: 'Extreme Edge Cases',
                prompt,
                success: false,
                error: 'Failed to generate workout template'
            };
        }

        // Validate extreme requirements
        const durationClose = Math.abs(template.estimatedDuration - 180) <= 30; // Allow some flexibility
        const hasManyExercises = template.exercises.length >= 15; // Should have many exercises for 3 hours
        const hasManyMuscleGroups = template.muscleGroups.size >= 6; // Should target most muscle groups
        const hasReasonableSets = template.exercises.every(ex => ex.sets >= 1 && ex.sets <= 10);
        
        const success = durationClose && hasManyExercises && hasManyMuscleGroups && hasReasonableSets;
        
        return {
            testName: 'Extreme Edge Cases',
            prompt,
            success,
            error: success ? undefined : `Duration: ${template.estimatedDuration}min, Exercises: ${template.exercises.length}, Muscle Groups: ${template.muscleGroups.size}`,
            parsedData: template
        };

    } catch (error) {
        return {
            testName: 'Extreme Edge Cases',
            prompt,
            success: false,
            error: (error as Error).message
        };
    }
}

/**
 * PROMPT VARIANT 1: Structured Constraint-Based Prompting
 * 
 * This variant uses a highly structured format that explicitly lists constraints
 * and asks the AI to address each one systematically.
 */
function createStructuredConstraintPrompt(basePrompt: string): string {
    return `You are an expert fitness trainer. Analyze the following request and create a workout that systematically addresses each constraint.

REQUEST: ${basePrompt}

SYSTEMATIC APPROACH:
1. CONSTRAINT ANALYSIS: Identify all stated constraints and their priorities
2. CONFLICT RESOLUTION: For conflicting constraints, determine the best compromise
3. WORKOUT DESIGN: Create a workout that maximizes satisfaction of all constraints
4. VALIDATION: Ensure the workout is safe, effective, and achievable

CONSTRAINT PRIORITY HIERARCHY:
- Safety and injury prevention (HIGHEST)
- Time constraints (HIGH)
- Equipment limitations (MEDIUM)
- Experience level appropriateness (MEDIUM)
- Specific goals and preferences (LOWER)

For each exercise you include, justify how it addresses the constraints:
- How does it fit the time constraint?
- How does it use available equipment?
- How does it match the experience level?
- How does it contribute to the stated goals?

Respond with ONLY a JSON object in this exact format:
{
    "workout_name": "Systematically designed workout name",
    "estimated_duration": 45,
    "exercises": [
        {
            "exercise_name": "Exercise Name",
            "sets": 3,
            "reps": 8,
            "rest_time": 60
        }
    ]
}

Make your workout name reflect how you addressed the key constraints.`;
}

/**
 * PROMPT VARIANT 2: Role-Based Expert Prompting
 * 
 * This variant assigns the AI a specific expert role and asks it to think
 * like that expert would when solving the problem.
 */
function createRoleBasedExpertPrompt(basePrompt: string): string {
    return `You are Dr. Sarah Chen, a world-renowned sports scientist and strength coach with 20 years of experience. You've worked with Olympic athletes, professional sports teams, and have published over 100 research papers on exercise physiology and training methodology.

Your expertise includes:
- Exercise physiology and biomechanics
- Periodization and training program design
- Injury prevention and rehabilitation
- Sports psychology and motivation
- Nutrition and recovery optimization

A client has come to you with this request: "${basePrompt}"

As Dr. Chen, how would you approach this problem?

YOUR EXPERT PROCESS:
1. CLINICAL ASSESSMENT: What are the underlying needs behind this request?
2. EVIDENCE-BASED DECISIONS: What does the research say about optimal approaches?
3. INDIVIDUALIZATION: How would you adapt general principles to this specific case?
4. RISK MANAGEMENT: What potential issues do you need to prevent?
5. OUTCOME OPTIMIZATION: How do you maximize benefits while minimizing risks?

Based on your expertise, create a workout that demonstrates your clinical reasoning and evidence-based approach.

Respond with ONLY a JSON object in this exact format:
{
    "workout_name": "Evidence-based workout name",
    "estimated_duration": 45,
    "exercises": [
        {
            "exercise_name": "Exercise Name",
            "sets": 3,
            "reps": 8,
            "rest_time": 60
        }
    ]
}

Your workout name should reflect your expert methodology and approach.`;
}

/**
 * PROMPT VARIANT 3: Iterative Refinement Prompting
 * 
 * This variant asks the AI to generate multiple options and then refine
 * the best one, simulating an iterative design process.
 */
function createIterativeRefinementPrompt(basePrompt: string): string {
    return `You are a creative workout designer. The client has requested: "${basePrompt}"

DESIGN PROCESS - Generate 3 different workout concepts:

CONCEPT 1 - Conservative Approach:
Focus on safety, basic movements, proven effectiveness
- Prioritizes: Safety and fundamentals
- Trade-offs: May be less exciting but more reliable

CONCEPT 2 - Balanced Approach:
Mix of proven and innovative elements
- Prioritizes: Balance of effectiveness and engagement
- Trade-offs: Moderate risk/reward

CONCEPT 3 - Innovative Approach:
Creative solutions, advanced techniques, maximum engagement
- Prioritizes: Innovation and excitement
- Trade-offs: Higher complexity, requires more expertise

After considering all three concepts, select the BEST approach for this specific client and situation. Consider:
- Which concept best addresses their constraints?
- Which concept has the best risk/reward ratio?
- Which concept is most likely to achieve their goals?

Now implement your chosen concept as the final workout.

Respond with ONLY a JSON object in this exact format:
{
    "workout_name": "Refined workout name (indicate chosen concept)",
    "estimated_duration": 45,
    "exercises": [
        {
            "exercise_name": "Exercise Name",
            "sets": 3,
            "reps": 8,
            "rest_time": 60
        }
    ]
}

Your workout name should indicate which concept you chose and why.`;
}

/**
 * Main execution function for advanced testing
 */
async function runAdvancedTests(): Promise<void> {
    console.log('🚀 STARTING ADVANCED AI AUGMENTATION STRESS TESTS');
    console.log('='.repeat(80));
    console.log('Testing the limits of AI-powered workout generation');
    console.log('='.repeat(80));

    const runner = new AdvancedTestRunner();

    // Run the three challenging test cases
    await runner.runAdvancedTest('Complex Multi-Constraint', testComplexMultiConstraint);
    await runner.runAdvancedTest('Ambiguous Contradictory', testAmbiguousContradictoryInstructions);
    await runner.runAdvancedTest('Extreme Edge Cases', testExtremeEdgeCases);

    runner.printSummary();

    console.log('\n🔬 PROMPT ENGINEERING VARIANTS');
    console.log('='.repeat(80));
    console.log('These are the three prompt variants designed to handle challenging scenarios:');
    
    const basePrompt = "I want a workout that builds strength but also improves flexibility";
    
    console.log('\n📋 VARIANT 1: Structured Constraint-Based Prompting');
    console.log(createStructuredConstraintPrompt(basePrompt));
    
    console.log('\n👩‍⚕️ VARIANT 2: Role-Based Expert Prompting');
    console.log(createRoleBasedExpertPrompt(basePrompt));
    
    console.log('\n🔄 VARIANT 3: Iterative Refinement Prompting');
    console.log(createIterativeRefinementPrompt(basePrompt));
}

// Export functions for use in other files
export {
    runAdvancedTests,
    testComplexMultiConstraint,
    testAmbiguousContradictoryInstructions,
    testExtremeEdgeCases,
    createStructuredConstraintPrompt,
    createRoleBasedExpertPrompt,
    createIterativeRefinementPrompt
};

// Run if executed directly
if (require.main === module) {
    runAdvancedTests().catch(console.error);
}
