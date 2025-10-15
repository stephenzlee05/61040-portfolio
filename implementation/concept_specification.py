"""
AI-Augmented RoutinePlanner Concept Specification

This file contains the complete specification for the AI-augmented RoutinePlanner concept,
including both the original concept and the AI-enhanced version.
"""

from typing import List, Set, Optional, Dict, Any
from dataclasses import dataclass, field
from enum import Enum
import uuid
from datetime import datetime, date


class MuscleGroup(Enum):
    """Muscle groups for exercise classification"""
    CHEST = "chest"
    BACK = "back"
    SHOULDERS = "shoulders"
    BICEPS = "biceps"
    TRICEPS = "triceps"
    ABS = "abs"
    LEGS = "legs"
    GLUTES = "glutes"
    CARDIO = "cardio"


class ExperienceLevel(Enum):
    """User experience levels"""
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


@dataclass
class User:
    """Represents a user in the system"""
    user_id: str
    username: str
    email: str


@dataclass
class Exercise:
    """Represents a single exercise"""
    exercise_id: str
    name: str
    muscle_groups: Set[MuscleGroup]
    movement_pattern: str
    equipment: Optional[str] = None
    instructions: Optional[str] = None


@dataclass
class ExerciseSet:
    """Represents a set of an exercise"""
    exercise: Exercise
    sets: int
    reps: int
    weight: Optional[float] = None
    rest_time: Optional[int] = None  # seconds


@dataclass
class WorkoutTemplate:
    """Represents a complete workout template"""
    template_id: str
    name: str
    exercises: List[ExerciseSet]
    muscle_groups: Set[MuscleGroup]
    estimated_duration: int  # minutes
    is_ai_generated: bool = False
    generation_prompt: Optional[str] = None
    
    @property
    def total_exercises(self) -> int:
        """Returns the total number of exercises in the template"""
        return len(self.exercises)
    
    @property
    def total_sets(self) -> int:
        """Returns the total number of sets across all exercises"""
        return sum(exercise_set.sets for exercise_set in self.exercises)


@dataclass
class UserPreferences:
    """User preferences for workout generation"""
    user_id: str
    experience_level: ExperienceLevel
    goals: str
    available_equipment: List[str]
    time_per_session: int  # minutes
    preferred_muscle_groups: List[MuscleGroup]
    avoid_exercises: List[str] = field(default_factory=list)


@dataclass
class WeeklyVolume:
    """Tracks weekly training volume for muscle groups"""
    user_id: str
    muscle_group: MuscleGroup
    week_start: date
    volume: float


@dataclass
class WeightSuggestion:
    """Represents a weight progression suggestion"""
    current_weight: float
    suggested_weight: float
    reason: str
    confidence: float


# Original RoutinePlanner Concept Specification
"""
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
"""

# AI-Augmented RoutinePlanner Concept Specification
"""
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
"""
