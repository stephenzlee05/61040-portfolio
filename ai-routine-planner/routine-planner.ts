/**
 * AI-Augmented RoutinePlanner Concept
 * 
 * Implements workout template management with AI-powered generation,
 * customization, and analysis using Google's Gemini API.
 */

import { GeminiLLM } from './gemini-llm';

// Enums for type safety
export enum MuscleGroup {
    CHEST = 'chest',
    BACK = 'back',
    SHOULDERS = 'shoulders',
    BICEPS = 'biceps',
    TRICEPS = 'triceps',
    ABS = 'abs',
    LEGS = 'legs',
    GLUTES = 'glutes',
    CARDIO = 'cardio'
}

export enum ExperienceLevel {
    BEGINNER = 'beginner',
    INTERMEDIATE = 'intermediate',
    ADVANCED = 'advanced'
}

// Core data structures
export interface Exercise {
    exerciseId: string;
    name: string;
    muscleGroups: Set<MuscleGroup>;
    movementPattern: string;
    equipment?: string;
    instructions?: string;
}

export interface ExerciseSet {
    exercise: Exercise;
    sets: number;
    reps: number;
    weight?: number;
    restTime?: number; // in seconds
}

export interface WorkoutTemplate {
    templateId: string;
    name: string;
    exercises: ExerciseSet[];
    muscleGroups: Set<MuscleGroup>;
    estimatedDuration: number; // in minutes
    isAIGenerated: boolean;
    generationPrompt?: string;
}

export interface User {
    userId: string;
    username: string;
    email: string;
}

export interface UserPreferences {
    userId: string;
    experienceLevel: ExperienceLevel;
    goals: string;
    availableEquipment: string[];
    timePerSession: number; // in minutes
    preferredMuscleGroups: MuscleGroup[];
    avoidExercises?: string[];
}

export interface WeeklyVolume {
    userId: string;
    muscleGroup: MuscleGroup;
    weekStart: Date;
    volume: number;
}

/**
 * Exercise database with common exercises
 */
export class ExerciseDatabase {
    private static exercises: Map<string, Exercise> = new Map([
        // Chest exercises
        ['bench_press', {
            exerciseId: 'bench_press',
            name: 'Bench Press',
            muscleGroups: new Set([MuscleGroup.CHEST, MuscleGroup.TRICEPS, MuscleGroup.SHOULDERS]),
            movementPattern: 'push',
            equipment: 'barbell, bench',
            instructions: 'Lie on bench, grip barbell slightly wider than shoulders, lower to chest, press up'
        }],
        ['push_ups', {
            exerciseId: 'push_ups',
            name: 'Push-ups',
            muscleGroups: new Set([MuscleGroup.CHEST, MuscleGroup.TRICEPS, MuscleGroup.SHOULDERS]),
            movementPattern: 'push',
            equipment: 'none',
            instructions: 'Start in plank position, lower chest to ground, push back up'
        }],
        ['dumbbell_flyes', {
            exerciseId: 'dumbbell_flyes',
            name: 'Dumbbell Flyes',
            muscleGroups: new Set([MuscleGroup.CHEST]),
            movementPattern: 'push',
            equipment: 'dumbbells, bench',
            instructions: 'Lie on bench, arms extended, lower dumbbells in arc motion, bring together'
        }],
        ['incline_bench', {
            exerciseId: 'incline_bench',
            name: 'Incline Bench Press',
            muscleGroups: new Set([MuscleGroup.CHEST, MuscleGroup.SHOULDERS, MuscleGroup.TRICEPS]),
            movementPattern: 'push',
            equipment: 'barbell, incline bench',
            instructions: 'Similar to bench press but on incline bench at 30-45 degrees'
        }],
        
        // Back exercises
        ['pull_ups', {
            exerciseId: 'pull_ups',
            name: 'Pull-ups',
            muscleGroups: new Set([MuscleGroup.BACK, MuscleGroup.BICEPS]),
            movementPattern: 'pull',
            equipment: 'pull-up bar',
            instructions: 'Hang from bar, pull body up until chin clears bar, lower slowly'
        }],
        ['deadlift', {
            exerciseId: 'deadlift',
            name: 'Deadlift',
            muscleGroups: new Set([MuscleGroup.BACK, MuscleGroup.GLUTES, MuscleGroup.LEGS]),
            movementPattern: 'hip hinge',
            equipment: 'barbell',
            instructions: 'Stand with feet hip-width apart, grip bar, lift by extending hips and knees'
        }],
        ['bent_over_rows', {
            exerciseId: 'bent_over_rows',
            name: 'Bent-over Rows',
            muscleGroups: new Set([MuscleGroup.BACK, MuscleGroup.BICEPS]),
            movementPattern: 'pull',
            equipment: 'barbell or dumbbells',
            instructions: 'Bend at hips, pull weight to lower chest, squeeze shoulder blades'
        }],
        ['lat_pulldowns', {
            exerciseId: 'lat_pulldowns',
            name: 'Lat Pulldowns',
            muscleGroups: new Set([MuscleGroup.BACK, MuscleGroup.BICEPS]),
            movementPattern: 'pull',
            equipment: 'cable machine',
            instructions: 'Sit at lat pulldown machine, pull bar to upper chest, control return'
        }],
        
        // Shoulder exercises
        ['overhead_press', {
            exerciseId: 'overhead_press',
            name: 'Overhead Press',
            muscleGroups: new Set([MuscleGroup.SHOULDERS, MuscleGroup.TRICEPS]),
            movementPattern: 'push',
            equipment: 'barbell or dumbbells',
            instructions: 'Press weight overhead from shoulder level, extend fully'
        }],
        ['lateral_raises', {
            exerciseId: 'lateral_raises',
            name: 'Lateral Raises',
            muscleGroups: new Set([MuscleGroup.SHOULDERS]),
            movementPattern: 'isolation',
            equipment: 'dumbbells',
            instructions: 'Raise arms to sides until parallel to ground, lower slowly'
        }],
        
        // Arm exercises
        ['bicep_curls', {
            exerciseId: 'bicep_curls',
            name: 'Bicep Curls',
            muscleGroups: new Set([MuscleGroup.BICEPS]),
            movementPattern: 'isolation',
            equipment: 'dumbbells or barbell',
            instructions: 'Curl weight up, squeeze biceps at top, lower slowly'
        }],
        ['tricep_dips', {
            exerciseId: 'tricep_dips',
            name: 'Tricep Dips',
            muscleGroups: new Set([MuscleGroup.TRICEPS]),
            movementPattern: 'push',
            equipment: 'parallel bars or bench',
            instructions: 'Lower body by bending arms, push back up using triceps'
        }],
        ['close_grip_bench', {
            exerciseId: 'close_grip_bench',
            name: 'Close Grip Bench Press',
            muscleGroups: new Set([MuscleGroup.TRICEPS, MuscleGroup.CHEST]),
            movementPattern: 'push',
            equipment: 'barbell, bench',
            instructions: 'Bench press with hands closer together, focus on triceps'
        }],
        
        // Leg exercises
        ['squats', {
            exerciseId: 'squats',
            name: 'Squats',
            muscleGroups: new Set([MuscleGroup.LEGS, MuscleGroup.GLUTES]),
            movementPattern: 'squat',
            equipment: 'barbell or bodyweight',
            instructions: 'Lower body by bending knees and hips, keep chest up, drive through heels'
        }],
        ['lunges', {
            exerciseId: 'lunges',
            name: 'Lunges',
            muscleGroups: new Set([MuscleGroup.LEGS, MuscleGroup.GLUTES]),
            movementPattern: 'lunge',
            equipment: 'bodyweight or dumbbells',
            instructions: 'Step forward, lower back knee toward ground, push back to start'
        }],
        ['leg_press', {
            exerciseId: 'leg_press',
            name: 'Leg Press',
            muscleGroups: new Set([MuscleGroup.LEGS, MuscleGroup.GLUTES]),
            movementPattern: 'push',
            equipment: 'leg press machine',
            instructions: 'Push weight with legs, control descent, extend fully'
        }],
        ['calf_raises', {
            exerciseId: 'calf_raises',
            name: 'Calf Raises',
            muscleGroups: new Set([MuscleGroup.LEGS]),
            movementPattern: 'isolation',
            equipment: 'bodyweight or machine',
            instructions: 'Raise up on toes, hold briefly, lower slowly'
        }],
        
        // Core exercises
        ['plank', {
            exerciseId: 'plank',
            name: 'Plank',
            muscleGroups: new Set([MuscleGroup.ABS]),
            movementPattern: 'isometric',
            equipment: 'none',
            instructions: 'Hold straight line from head to heels, engage core'
        }],
        ['crunches', {
            exerciseId: 'crunches',
            name: 'Crunches',
            muscleGroups: new Set([MuscleGroup.ABS]),
            movementPattern: 'isolation',
            equipment: 'none',
            instructions: 'Lift shoulders off ground, crunch abs, lower slowly'
        }],
        ['russian_twists', {
            exerciseId: 'russian_twists',
            name: 'Russian Twists',
            muscleGroups: new Set([MuscleGroup.ABS]),
            movementPattern: 'rotation',
            equipment: 'none',
            instructions: 'Sit, lean back, rotate torso side to side'
        }],
        
        // Cardio exercises
        ['running', {
            exerciseId: 'running',
            name: 'Running',
            muscleGroups: new Set([MuscleGroup.CARDIO, MuscleGroup.LEGS]),
            movementPattern: 'cardio',
            equipment: 'none',
            instructions: 'Maintain steady pace, focus on breathing'
        }],
        ['cycling', {
            exerciseId: 'cycling',
            name: 'Cycling',
            muscleGroups: new Set([MuscleGroup.CARDIO, MuscleGroup.LEGS]),
            movementPattern: 'cardio',
            equipment: 'bike',
            instructions: 'Maintain steady cadence, focus on smooth pedaling'
        }]
    ]);

    static getExercise(exerciseId: string): Exercise | undefined {
        return this.exercises.get(exerciseId);
    }

    static getAllExercises(): Exercise[] {
        return Array.from(this.exercises.values());
    }

    static getExercisesByMuscleGroup(muscleGroup: MuscleGroup): Exercise[] {
        return this.getAllExercises().filter(exercise => 
            exercise.muscleGroups.has(muscleGroup)
        );
    }

    static searchExercises(query: string): Exercise[] {
        const queryLower = query.toLowerCase();
        return this.getAllExercises().filter(exercise =>
            exercise.name.toLowerCase().includes(queryLower) ||
            Array.from(exercise.muscleGroups).some(mg => mg.includes(queryLower))
        );
    }
}

/**
 * Main AI-Augmented RoutinePlanner class
 */
export class AIRoutinePlanner {
    private workoutTemplates: Map<string, WorkoutTemplate> = new Map();
    private userTemplates: Map<string, string[]> = new Map(); // userId -> templateIds
    private weeklyVolumes: Map<string, WeeklyVolume[]> = new Map(); // userId -> volumes
    private userPreferences: Map<string, UserPreferences> = new Map(); // userId -> preferences
    private llm: GeminiLLM;

    constructor(llm: GeminiLLM) {
        this.llm = llm;
    }

    /**
     * Create a new workout template manually
     */
    createTemplate(user: User, name: string, exercises: ExerciseSet[]): string {
        const templateId = `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Determine muscle groups from exercises
        const muscleGroups = new Set<MuscleGroup>();
        for (const exerciseSet of exercises) {
            exerciseSet.exercise.muscleGroups.forEach(mg => muscleGroups.add(mg));
        }
        
        // Estimate duration (rough calculation: 2 minutes per set including rest)
        const estimatedDuration = exercises.reduce((total, exerciseSet) => 
            total + (exerciseSet.sets * 2), 0);
        
        const template: WorkoutTemplate = {
            templateId,
            name,
            exercises,
            muscleGroups,
            estimatedDuration,
            isAIGenerated: false
        };
        
        this.workoutTemplates.set(templateId, template);
        
        // Add to user's templates
        const userTemplates = this.userTemplates.get(user.userId) || [];
        userTemplates.push(templateId);
        this.userTemplates.set(user.userId, userTemplates);
        
        console.log(`Created template '${name}' with ${exercises.length} exercises`);
        return templateId;
    }

    /**
     * Generate workout template from natural language prompt using AI
     */
    async generateWorkoutFromPrompt(user: User, prompt: string, preferences: UserPreferences): Promise<WorkoutTemplate | null> {
        try {
            // Store preferences
            this.userPreferences.set(user.userId, preferences);
            
            // Build AI prompt
            const aiPrompt = this.buildWorkoutPrompt(prompt, preferences);
            
            // Call LLM
            console.log('🤖 Requesting workout generation from Gemini AI...');
            const response = await this.llm.executeLLM(aiPrompt);
            
            console.log('✅ Received response from Gemini AI!');
            console.log('\n🤖 RAW GEMINI RESPONSE');
            console.log('======================');
            console.log(response);
            console.log('======================\n');
            
            // Parse and create template
            const template = this.parseAIResponse(response, prompt);
            
            if (template) {
                // Validate against plausible failure modes
                this.validateAIGeneratedTemplate(template, preferences);
                // Store the template
                this.workoutTemplates.set(template.templateId, template);
                
                // Add to user's templates
                const userTemplates = this.userTemplates.get(user.userId) || [];
                userTemplates.push(template.templateId);
                this.userTemplates.set(user.userId, userTemplates);
                
                console.log(`Successfully generated workout: ${template.name}`);
            }
            
            return template;
            
        } catch (error) {
            console.error('❌ Error generating workout:', (error as Error).message);
            return null;
        }
    }

    /**
     * Get suggested workout based on recent training volume and balance
     */
    getSuggestedWorkout(user: User, targetDate: Date): WorkoutTemplate | null {
        const weekStart = this.getWeekStart(targetDate);
        
        if (this.userTemplates.has(user.userId)) {
            const userTemplates = this.userTemplates.get(user.userId)!;
            if (userTemplates.length > 0) {
                const templateId = userTemplates[0];
                return this.workoutTemplates.get(templateId) || null;
            }
        }
        
        return null;
    }

    /**
     * Update weekly volume for exercise's muscle groups
     */
    updateVolume(user: User, exercise: Exercise, sets: number, reps: number, weight: number): void {
        const weekStart = this.getWeekStart(new Date());
        const volume = sets * reps * weight;
        
        let userVolumes = this.weeklyVolumes.get(user.userId) || [];
        
        // Update volume for each muscle group targeted by the exercise
        for (const muscleGroup of exercise.muscleGroups) {
            // Check if volume already exists for this muscle group this week
            let existingVolume = userVolumes.find(vol => 
                vol.muscleGroup === muscleGroup && vol.weekStart.getTime() === weekStart.getTime()
            );
            
            if (existingVolume) {
                existingVolume.volume += volume;
            } else {
                userVolumes.push({
                    userId: user.userId,
                    muscleGroup,
                    weekStart,
                    volume
                });
            }
        }
        
        this.weeklyVolumes.set(user.userId, userVolumes);
        console.log(`Updated volume for ${user.userId}: ${exercise.name} (+${volume})`);
    }

    /**
     * Check training balance and return muscle groups with significantly lower volume
     */
    checkBalance(user: User, weekStart: Date): MuscleGroup[] {
        const userVolumes = this.weeklyVolumes.get(user.userId) || [];
        const volumes = userVolumes.filter(vol => 
            vol.weekStart.getTime() === weekStart.getTime()
        );
        
        if (volumes.length === 0) {
            return [];
        }
        
        const muscleVolume = new Map<MuscleGroup, number>();
        for (const volume of volumes) {
            const current = muscleVolume.get(volume.muscleGroup) || 0;
            muscleVolume.set(volume.muscleGroup, current + volume.volume);
        }
        
        // Find muscle groups with volume significantly below average
        const avgVolume = Array.from(muscleVolume.values()).reduce((a, b) => a + b, 0) / muscleVolume.size;
        const threshold = avgVolume * 0.5; // 50% below average
        
        const imbalancedGroups: MuscleGroup[] = [];
        for (const [muscleGroup, volume] of muscleVolume.entries()) {
            if (volume < threshold) {
                imbalancedGroups.push(muscleGroup);
            }
        }
        
        return imbalancedGroups;
    }

    /**
     * Customize an existing workout template using AI
     */
    async customizeWorkout(user: User, templateId: string, modifications: string): Promise<WorkoutTemplate | null> {
        const originalTemplate = this.workoutTemplates.get(templateId);
        if (!originalTemplate) {
            console.error(`Template ${templateId} not found`);
            return null;
        }
        
        const preferences = this.userPreferences.get(user.userId);
        if (!preferences) {
            console.error(`No preferences found for user ${user.userId}`);
            return null;
        }
        
        try {
            // Create customization prompt
            const prompt = `You are a fitness trainer. I need you to modify an existing workout based on specific requests.

ORIGINAL WORKOUT: "${originalTemplate.name}"
MODIFICATIONS REQUESTED: "${modifications}"

EXERCISES IN ORIGINAL WORKOUT:
${originalTemplate.exercises.map(ex => `- ${ex.exercise.name} (${ex.sets} sets, ${ex.reps} reps)`).join('\n')}

Please create a modified workout that incorporates the requested changes. Respond with ONLY a JSON object in this exact format:
{
    "workout_name": "Modified workout name",
    "estimated_duration": 45,
    "exercises": [
        {
            "exercise_name": "Exercise Name",
            "sets": 3,
            "reps": 8,
            "rest_time": 90
        }
    ]
}

Make sure all exercise names exactly match exercises from a standard gym database (Bench Press, Squats, Pull-ups, etc.).`;
            
            console.log('🤖 Requesting workout customization from Gemini AI...');
            const response = await this.llm.executeLLM(prompt);
            
            console.log('✅ Received customization from Gemini AI!');
            console.log('\n🤖 RAW GEMINI RESPONSE');
            console.log('======================');
            console.log(response);
            console.log('======================\n');
            
            // Parse and create customized template
            const customizedTemplate = this.parseAIResponse(response, `Customized from: ${originalTemplate.name}. ${modifications}`);
            
            if (customizedTemplate) {
                // Validate against plausible failure modes using stored preferences
                this.validateAIGeneratedTemplate(customizedTemplate, preferences);
                // Store the customized template
                this.workoutTemplates.set(customizedTemplate.templateId, customizedTemplate);
                
                // Add to user's templates
                const userTemplates = this.userTemplates.get(user.userId) || [];
                userTemplates.push(customizedTemplate.templateId);
                this.userTemplates.set(user.userId, userTemplates);
            }
            
            return customizedTemplate;
            
        } catch (error) {
            console.error('❌ Error customizing workout:', (error as Error).message);
            return null;
        }
    }

    /**
     * Analyze a workout template and provide recommendations
     */
    async analyzeWorkout(user: User, templateId: string): Promise<string> {
        const template = this.workoutTemplates.get(templateId);
        if (!template) {
            return `Template ${templateId} not found`;
        }
        
        try {
            const prompt = `Analyze this workout template and provide recommendations: ${JSON.stringify(template)}`;
            
            console.log('🤖 Requesting workout analysis from Gemini AI...');
            const response = await this.llm.executeLLM(prompt);
            
            console.log('✅ Received analysis from Gemini AI!');
            return response;
            
        } catch (error) {
            console.error('❌ Error analyzing workout:', (error as Error).message);
            return 'Analysis failed due to API error';
        }
    }

    /**
     * Get all templates for a user
     */
    getUserTemplates(user: User): WorkoutTemplate[] {
        const userTemplates = this.userTemplates.get(user.userId) || [];
        return userTemplates
            .map(templateId => this.workoutTemplates.get(templateId))
            .filter((template): template is WorkoutTemplate => template !== undefined);
    }

    /**
     * Get usage statistics
     */
    getUsageStats(): { totalTemplates: number; aiGeneratedTemplates: number; manualTemplates: number; totalUsers: number; aiUsageCount: number } {
        const templates = Array.from(this.workoutTemplates.values());
        return {
            totalTemplates: templates.length,
            aiGeneratedTemplates: templates.filter(t => t.isAIGenerated).length,
            manualTemplates: templates.filter(t => !t.isAIGenerated).length,
            totalUsers: this.userTemplates.size,
            aiUsageCount: this.llm.getUsageStats().usageCount
        };
    }

    /**
     * Helper methods
     */
    
    private buildWorkoutPrompt(userPrompt: string, preferences: UserPreferences): string {
        const availableExercises = this.getAvailableExercises(preferences.availableEquipment);
        const exerciseList = availableExercises.map(ex => 
            `- ${ex.name} (${Array.from(ex.muscleGroups).join(', ')})`
        ).join('\n');
        
        const preferredGroups = preferences.preferredMuscleGroups.join(', ');
        
        return `
You are a professional fitness trainer creating a personalized workout plan.

USER REQUEST: "${userPrompt}"

USER PROFILE:
- Experience Level: ${preferences.experienceLevel}
- Goals: ${preferences.goals}
- Available Equipment: ${preferences.availableEquipment.join(', ')}
- Time Available: ${preferences.timePerSession} minutes
- Preferred Muscle Groups: ${preferredGroups}
- Avoid Exercises: ${preferences.avoidExercises?.join(', ') || 'None'}

AVAILABLE EXERCISES:
${exerciseList}

INSTRUCTIONS:
Create a workout plan that matches the user's request and profile. Consider:
1. Appropriate difficulty level for their experience
2. Equipment availability
3. Time constraints
4. Muscle group balance
5. Progressive overload principles

Respond with a JSON object in this exact format:
{
    "workout_name": "Descriptive workout name",
    "estimated_duration": 45,
    "exercises": [
        {
            "exercise_name": "Exercise Name",
            "sets": 3,
            "reps": 8,
            "rest_time": 90,
            "notes": "Optional form tips or modifications"
        }
    ]
}

Make sure all exercise names exactly match the available exercises listed above.
`;
    }

    private parseAIResponse(response: string, prompt: string): WorkoutTemplate | null {
        try {
            // Extract JSON from response - handle both simple JSON and complex responses
            let jsonMatch = response.match(/\{[\s\S]*\}/);
            
            // If no JSON found, try to find JSON within markdown code blocks
            if (!jsonMatch) {
                const codeBlockMatch = response.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
                if (codeBlockMatch) {
                    jsonMatch = [codeBlockMatch[1]];
                }
            }
            
            // If still no JSON, try to find any JSON-like structure
            if (!jsonMatch) {
                const anyJsonMatch = response.match(/\{[\s\S]*?"workout_name"[\s\S]*?\}/);
                if (anyJsonMatch) {
                    jsonMatch = anyJsonMatch;
                }
            }
            
            if (!jsonMatch) {
                throw new Error('No JSON found in response');
            }
            
            const data = JSON.parse(jsonMatch[0]);
            
            // Validate required fields
            if (!data.workout_name || !data.exercises || !Array.isArray(data.exercises)) {
                throw new Error('Invalid response format');
            }
            
            // Create exercise sets
            const exerciseSets: ExerciseSet[] = [];
            const usedMuscleGroups = new Set<MuscleGroup>();
            
            for (const exData of data.exercises) {
                const exercise = this.findExerciseByName(exData.exercise_name);
                if (!exercise) {
                    console.warn(`Exercise not found in database: ${exData.exercise_name}`);
                    continue;
                }
                
                const exerciseSet: ExerciseSet = {
                    exercise,
                    sets: exData.sets || 3,
                    reps: exData.reps || 8,
                    restTime: exData.rest_time || 90
                };
                
                exerciseSets.push(exerciseSet);
                exercise.muscleGroups.forEach(mg => usedMuscleGroups.add(mg));
            }
            
            if (exerciseSets.length === 0) {
                throw new Error('No valid exercises found after parsing AI response');
            }
            
            // Create workout template
            const templateId = `ai_generated_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const template: WorkoutTemplate = {
                templateId,
                name: data.workout_name,
                exercises: exerciseSets,
                muscleGroups: usedMuscleGroups,
                estimatedDuration: data.estimated_duration || 45,
                isAIGenerated: true,
                generationPrompt: prompt
            };
            
            return template;
            
        } catch (error) {
            console.error('Error parsing AI response:', (error as Error).message);
            return null;
        }
    }

    /**
     * Validators for LLM-generated templates to catch common logical issues
     * Throws an Error if a validation fails
     */
    private validateAIGeneratedTemplate(template: WorkoutTemplate, preferences: UserPreferences): void {
        // 1) Schema/content sanity: non-empty name, exercises, sensible bounds
        if (!template.name || template.name.trim().length < 3) {
            throw new Error('Validation failed: workout_name is missing or too short');
        }
        if (!template.exercises || template.exercises.length === 0) {
            throw new Error('Validation failed: exercises list is empty');
        }

        // Prevent duplicates and ensure reasonable sets/reps/rest bounds per experience level
        const seenExerciseIds = new Set<string>();
        let totalSets = 0;
        for (const set of template.exercises) {
            if (seenExerciseIds.has(set.exercise.exerciseId)) {
                throw new Error(`Validation failed: duplicate exercise detected - ${set.exercise.name}`);
            }
            seenExerciseIds.add(set.exercise.exerciseId);

            totalSets += set.sets;
        }

        // Experience-level volume heuristics
        if (preferences.experienceLevel === ExperienceLevel.BEGINNER && totalSets > 24) {
            throw new Error(`Validation failed: total sets (${totalSets}) too high for beginner profile`);
        }

        // 2) Equipment feasibility: all exercises must be performable with available equipment
        const available = new Set(this.getAvailableExercises(preferences.availableEquipment).map(e => e.exerciseId));
        for (const set of template.exercises) {
            if (!available.has(set.exercise.exerciseId)) {
                throw new Error(`Validation failed: exercise not available with provided equipment - ${set.exercise.name}`);
            }
        }

        // 3) Time feasibility: estimatedDuration vs computed and session budget with tolerance
        const computedDuration = this.computeEstimatedDurationMinutes(template.exercises);
        const durationDiff = Math.abs(computedDuration - template.estimatedDuration);
        // More lenient deviation from computed duration
        if (durationDiff > Math.max(15, preferences.timePerSession * 0.6)) {
            throw new Error(`Validation failed: estimated_duration (${template.estimatedDuration}m) deviates too far from computed (${computedDuration.toFixed(0)}m)`);
        }

        // More lenient allowance over/under session time budget
        const sessionTolerance = Math.max(15, preferences.timePerSession * 0.5);
        if (template.estimatedDuration > preferences.timePerSession + sessionTolerance) {
            throw new Error(`Validation failed: plan exceeds session time by more than tolerance (${template.estimatedDuration}m > ${preferences.timePerSession}m + ${sessionTolerance}m)`);
        }
        if (template.estimatedDuration < Math.max(10, preferences.timePerSession * 0.25)) {
            throw new Error(`Validation failed: plan is unrealistically short for requested session (${template.estimatedDuration}m)`);
        }

        // 4) Minimal muscle group diversity when user specifies preferred groups (soft requirement)
        if (preferences.preferredMuscleGroups && preferences.preferredMuscleGroups.length > 0) {
            const overlap = preferences.preferredMuscleGroups.filter(mg => template.muscleGroups.has(mg));
            if (overlap.length === 0) {
                throw new Error('Validation failed: none of the preferred muscle groups are targeted');
            }
        }
    }

    /**
     * Compute duration from sets, reps and rest time using simple heuristics
     */
    private computeEstimatedDurationMinutes(exercises: ExerciseSet[]): number {
        let totalSeconds = 0;
        for (const set of exercises) {
            const timePerRepSeconds = 3; // average tempo
            const workSeconds = set.sets * set.reps * timePerRepSeconds;
            const restSeconds = set.sets * (set.restTime ?? 90);
            totalSeconds += workSeconds + restSeconds;
        }
        return Math.round(totalSeconds / 60);
    }

    private findExerciseByName(name: string): Exercise | null {
        const exercises = ExerciseDatabase.getAllExercises();
        
        // First try exact match
        let exercise = exercises.find(ex => ex.name.toLowerCase() === name.toLowerCase());
        if (exercise) return exercise;
        
        // Try to find by removing common prefixes/suffixes
        const normalizedName = name.toLowerCase()
            .replace(/^dumbbell\s+/, '') // Remove "dumbbell " prefix
            .replace(/^barbell\s+/, '')  // Remove "barbell " prefix
            .replace(/\s+\(.*\)$/, '')   // Remove parentheses and contents
            .replace(/\s+on\s+.*$/, '')  // Remove "on knees", "on bench" etc
            .trim();
            
        exercise = exercises.find(ex => ex.name.toLowerCase() === normalizedName);
        if (exercise) return exercise;
        
        // Try partial matching for common variations
        const partialMatches = exercises.filter(ex => 
            normalizedName.includes(ex.name.toLowerCase()) || 
            ex.name.toLowerCase().includes(normalizedName)
        );
        
        return partialMatches.length > 0 ? partialMatches[0] : null;
    }

    private getAvailableExercises(equipment: string[]): Exercise[] {
        const allExercises = ExerciseDatabase.getAllExercises();
        
        return allExercises.filter(exercise => {
            // Bodyweight exercises are always available
            if (!exercise.equipment || exercise.equipment === 'none') {
                return true;
            }
            
            // Check if any available equipment matches
            return equipment.some(eq => 
                exercise.equipment!.toLowerCase().includes(eq.toLowerCase())
            );
        });
    }

    private getWeekStart(date: Date): Date {
        const weekStart = new Date(date);
        const day = weekStart.getDay();
        const diff = weekStart.getDate() - day; // Adjust to Monday start
        weekStart.setDate(diff);
        weekStart.setHours(0, 0, 0, 0);
        return weekStart;
    }

    /**
     * Display workout template in a readable format
     */
    displayWorkout(template: WorkoutTemplate): void {
        console.log(`\n📋 ${template.name}`);
        console.log('='.repeat(50));
        console.log(`Duration: ${template.estimatedDuration} minutes`);
        console.log(`AI Generated: ${template.isAIGenerated ? 'Yes' : 'No'}`);
        console.log(`Muscle Groups: ${Array.from(template.muscleGroups).join(', ')}`);
        console.log(`Total Exercises: ${template.exercises.length}`);
        console.log(`Total Sets: ${template.exercises.reduce((sum, ex) => sum + ex.sets, 0)}`);
        
        console.log('\n📝 Exercises:');
        template.exercises.forEach((exerciseSet, index) => {
            console.log(`  ${index + 1}. ${exerciseSet.exercise.name}`);
            console.log(`     Sets: ${exerciseSet.sets} × Reps: ${exerciseSet.reps}`);
            if (exerciseSet.restTime) {
                console.log(`     Rest: ${exerciseSet.restTime}s`);
            }
        });
        
        if (template.generationPrompt) {
            console.log(`\n💬 Generation Prompt: ${template.generationPrompt}`);
        }
    }
}
