# Assignment 3

## Augment the design of a concept

~~~
concept RoutinePlanner [User, Exercise]
  purpose manage workout templates and balance muscle group training
  principle ensure balanced training across muscle groups and movement patterns
  state
    a set of WorkoutTemplates with
      templateId String
      name String
      exercises List<Exercise>
      muscleGroups Set<MuscleGroup>
    a set of UserTemplates with
      user User
      templateId String
      isDefault Boolean
    a set of WeeklyVolume with
      user User
      muscleGroup MuscleGroup
      weekStart Date
      volume Number
  actions
    createTemplate (user: User, name: String, exercises: List<Exercise>) : (templateId: String)
      effect creates new workout template
    getSuggestedWorkout (user: User, date: Date) : (template: WorkoutTemplate?)
      effect returns template based on recent training volume and balance
    updateVolume (user: User, exercise: Exercise, sets: Number, reps: Number, weight: Number)
      effect updates weekly volume for exercise's muscle groups
    checkBalance (user: User, weekStart: Date) : (imbalance: List<MuscleGroup>)
      effect returns muscle groups with significantly lower volume
~~~

~~~
concept AIRoutinePlanner [User, Exercise]
  purpose manage workout templates with AI-powered generation and balance muscle group training
  principle ensure balanced training across muscle groups with intelligent template generation from natural language
  state
    a set of WorkoutTemplates with
      templateId String
      name String
      exercises List<Exercise>
      muscleGroups Set<MuscleGroup>
      isAIGenerated Boolean
      generationPrompt String?
    a set of UserTemplates with
      user User
      templateId String
      isDefault Boolean
    a set of WeeklyVolume with
      user User
      muscleGroup MuscleGroup
      weekStart Date
      volume Number
    a set of UserPreferences with
      user User
      experienceLevel String
      goals String
      availableEquipment List<String>
      timePerSession Number
      preferredMuscleGroups List<MuscleGroup>
  actions
    createTemplate (user: User, name: String, exercises: List<Exercise>) : (templateId: String)
      effect creates new workout template
    generateWorkoutFromPrompt (user: User, prompt: String, preferences: UserPreferences) : (template: WorkoutTemplate?)
      effect uses LLM to generate workout template from natural language description
      requires valid user preferences and prompt
    getSuggestedWorkout (user: User, date: Date) : (template: WorkoutTemplate?)
      effect returns template based on recent training volume and balance
    updateVolume (user: User, exercise: Exercise, sets: Number, reps: Number, weight: Number)
      effect updates weekly volume for exercise's muscle groups
    checkBalance (user: User, weekStart: Date) : (imbalance: List<MuscleGroup>)
      effect returns muscle groups with significantly lower volume
    customizeWorkout (user: User, templateId: String, modifications: String) : (template: WorkoutTemplate?)
      effect uses LLM to modify existing template based on natural language requests
    analyzeWorkout (user: User, templateId: String) : (analysis: String)
      effect uses LLM to provide detailed analysis and recommendations for workout template
~~~


**New LLM-Powered Actions:**

1. **generateWorkoutFromPrompt**: Takes natural language descriptions like "I want a 45-minute upper body workout focusing on strength" and generates a complete workout template with appropriate exercises, sets, and reps based on user preferences and fitness level.

2. **customizeWorkout**: Allows users to modify existing templates through natural language, such as "add more core work" or "make this more beginner-friendly."

3. **analyzeWorkout**: Provides intelligent feedback on workout templates, suggesting improvements, identifying potential imbalances, or explaining the benefits of specific exercise selections.

**Enhanced State:**
- Added `isAIGenerated` flag to track AI-created templates
- Added `generationPrompt` to store the original request for reference
- Added `UserPreferences` to provide context for AI generation

**Preserved Functionality:**
All original actions remain unchanged, ensuring the concept can function without AI components. Users can still manually create templates, get volume-based suggestions, and track training balance.

~~~
sync startWorkout
  when
    UserManagement.getUser (userId) : (user)
    WorkoutTracking.startSession (user, date) : (sessionId)
  then
    AIRoutinePlanner.getSuggestedWorkout (user, date) : (template)

sync generateCustomWorkout
  when
    AIRoutinePlanner.generateWorkoutFromPrompt (user, prompt, preferences) : (template)
    UserManagement.getUser (userId) : (user)
  then
    AIRoutinePlanner.createTemplate (user, template.name, template.exercises) : (templateId)

sync recordExercise
  when
    WorkoutTracking.recordExercise (sessionId, exercise, weight, sets, reps, notes)
    WorkoutTracking.getLastWeight (user, exercise) : (lastWeight)
  then
    ProgressionEngine.suggestWeight (user, exercise, lastWeight, sets, reps) : (suggestion)
    AIRoutinePlanner.updateVolume (user, exercise, sets, reps, weight)

sync applyProgression
  when
    ProgressionEngine.suggestWeight (user, exercise, lastWeight, lastSets, lastReps) : (suggestion)
    UserManagement.getUser (userId) : (user)
  then
    ProgressionEngine.updateProgression (user, exercise, suggestion.newWeight)

sync checkBalance
  when
    AIRoutinePlanner.updateVolume (user, exercise, sets, reps, weight)
    AIRoutinePlanner.checkBalance (user, weekStart) : (imbalance)
  then
    AIRoutinePlanner.getSuggestedWorkout (user, nextDate) : (balancedTemplate)
~~~



## Design the user interaction

### Low-Fidelity UI Sketches

#### Sketch 1: AI Workout Generation Entry Point
```
┌─────────────────────────────────────────────────────────┐
│  PlateMate - AI Workout Generator                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 💬 "Generate AI Workout"                        │   │
│  │                                                 │   │
│  │ Describe your workout:                          │   │
│  │ ┌─────────────────────────────────────────────┐ │   │
│  │ │ I want a 45-minute upper body workout      │ │   │
│  │ │ focusing on strength building              │ │   │
│  │ └─────────────────────────────────────────────┘ │   │
│  │                                                 │   │
│  │ [Generate Workout] [Cancel]                    │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Or choose from templates:                       │   │
│  │ • Upper Body Strength                          │   │
│  │ • Full Body Beginner                           │   │
│  │ • Chest & Triceps                              │   │
│  │ • Back & Biceps                                │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘

Context to LLM: User prompt + profile data
┌─────────────────────────────────────────────────────────┐
│ LLM receives:                                           │
│ • User prompt: "45-min upper body strength"            │
│ • Experience: Intermediate                             │
│ • Equipment: [barbell, dumbbells, bench]              │
│ • Goals: "Build muscle and strength"                   │
│ • Time: 45 minutes                                     │
│ • Preferred groups: chest, back, shoulders             │
└─────────────────────────────────────────────────────────┘
```

#### Sketch 2: AI-Generated Workout Display
```
┌─────────────────────────────────────────────────────────┐
│  🤖 AI Generated: Upper Body Strength Builder          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ⏱️ Duration: 45 minutes                                │
│  🎯 Focus: Chest, Back, Shoulders, Arms                │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 📋 Workout Plan                                │   │
│  │                                                 │   │
│  │ 1. Bench Press                                 │   │
│  │    ████ 4 sets × 6 reps (120s rest)           │   │
│  │                                                 │   │
│  │ 2. Pull-ups                                    │   │
│  │    ███ 3 sets × 8 reps (90s rest)             │   │
│  │                                                 │   │
│  │ 3. Overhead Press                              │   │
│  │    ███ 3 sets × 8 reps (90s rest)             │   │
│  │                                                 │   │
│  │ 4. Bent-over Rows                              │   │
│  │    ███ 3 sets × 10 reps (90s rest)            │   │
│  │                                                 │   │
│  │ 5. Bicep Curls                                 │   │
│  │    ███ 3 sets × 12 reps (60s rest)            │   │
│  │                                                 │   │
│  │ 6. Tricep Dips                                 │   │
│  │    ███ 3 sets × 10 reps (60s rest)            │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [✅ Use This Workout] [✏️ Edit] [🔄 Regenerate]        │
└─────────────────────────────────────────────────────────┘

LLM Output: Structured workout template
┌─────────────────────────────────────────────────────────┐
│ LLM provides:                                          │
│ • Exercise names from database                         │
│ • Sets/reps/rest recommendations                       │
│ • Progressive overload principles                      │
│ • Equipment-appropriate selections                     │
└─────────────────────────────────────────────────────────┘
```

#### Sketch 3: Workout Confirmation and Customization
```
┌─────────────────────────────────────────────────────────┐
│  ✏️ Customize AI Workout                               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 💬 What would you like to change?               │   │
│  │ ┌─────────────────────────────────────────────┐ │   │
│  │ │ Add more core work and make it more        │ │   │
│  │ │ beginner-friendly                          │ │   │
│  │ └─────────────────────────────────────────────┘ │   │
│  │                                                 │   │
│  │ [Apply Changes] [Cancel]                       │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Or make specific changes:                       │   │
│  │                                                 │   │
│  │ • Remove: Tricep Dips                          │   │
│  │ • Add: Plank (3 sets × 30s)                    │   │
│  │ • Modify: Reduce bench press to 3 sets         │   │
│  │                                                 │   │
│  │ [Save Changes]                                  │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘

Context to LLM: Original workout + modification request
┌─────────────────────────────────────────────────────────┐
│ LLM receives:                                          │
│ • Original workout template                            │
│ • User modification: "add core, make beginner-friendly"│
│ • Updated preferences if needed                        │
└─────────────────────────────────────────────────────────┘
```                                                  

### User Journey Description

The user journey begins when a fitness enthusiast opens PlateMate and wants to try a new workout but isn't sure what to do. They discover the AI workout generator and describe their needs in natural language: "I want a 45-minute upper body workout focusing on strength." The system immediately provides context to the LLM including their experience level, available equipment, and preferences. The AI generates a personalized workout template with appropriate exercises, sets, and reps. The user reviews the generated workout and can either accept it as-is, request modifications through natural language ("add more core work"), or make specific manual adjustments. Once satisfied, they can start their workout with PlateMate's existing smart weight recall and progression tracking features. This seamless integration allows users to benefit from AI-powered workout creation while maintaining access to all of PlateMate's core functionality for tracking and progression.


## Implement your concept