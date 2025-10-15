<concept_spec>
concept AIRoutinePlanner

purpose
    manage workout templates with AI-powered generation and balance muscle group training

principle
    ensure balanced training across muscle groups with intelligent template generation from natural language;
    users can create manual templates or generate AI-powered templates from prompts;
    the system tracks weekly volume and provides intelligent suggestions

state
    a set of WorkoutTemplate with
        a templateId String
        a name String
        a list of exercises List<Exercise>
        a set of muscleGroups Set<MuscleGroup>
        an estimatedDuration Number // in minutes
        an isAIGenerated Boolean
        an optional generationPrompt String

    a set of Exercise with
        an exerciseId String
        a name String
        a set of muscleGroups Set<MuscleGroup>
        a movementPattern String
        an optional equipment String
        an optional instructions String

    a set of ExerciseSet with
        an exercise Exercise
        a sets Number
        a reps Number
        an optional weight Number
        an optional restTime Number // in seconds

    a set of User with
        a userId String
        a username String
        an email String

    a set of UserPreferences with
        a userId String
        an experienceLevel String
        a goals String
        a list of availableEquipment List<String>
        a timePerSession Number // in minutes
        a list of preferredMuscleGroups List<MuscleGroup>

    a set of WeeklyVolume with
        a userId String
        a muscleGroup MuscleGroup
        a weekStart Date
        a volume Number

    invariants
        every exercise in a template exists in the exercise set
        every muscle group in a template is from exercises in that template
        estimated duration is positive
        sets and reps are positive numbers
        rest time is non-negative

actions
    createTemplate(user: User, name: String, exercises: List<ExerciseSet>): String
        requires user exists, name is non-empty, exercises is non-empty
        effect creates new workout template and returns templateId

    generateWorkoutFromPrompt(user: User, prompt: String, preferences: UserPreferences): WorkoutTemplate?
        requires user exists, prompt is non-empty, preferences are valid
        effect uses LLM to generate workout template from natural language description

    getSuggestedWorkout(user: User, date: Date): WorkoutTemplate?
        effect returns template based on recent training volume and balance

    updateVolume(user: User, exercise: Exercise, sets: Number, reps: Number, weight: Number)
        effect updates weekly volume for exercise's muscle groups

    checkBalance(user: User, weekStart: Date): List<MuscleGroup>
        effect returns muscle groups with significantly lower volume

    customizeWorkout(user: User, templateId: String, modifications: String): WorkoutTemplate?
        requires template exists
        effect uses LLM to modify existing template based on natural language requests

    analyzeWorkout(user: User, templateId: String): String
        requires template exists
        effect uses LLM to provide detailed analysis and recommendations

notes
    This concept demonstrates AI augmentation by adding LLM-powered workout generation,
    customization, and analysis while preserving all original manual functionality.
    The system maintains workout templates, tracks training volume, and provides
    intelligent suggestions based on user preferences and training history.
</concept_spec>
