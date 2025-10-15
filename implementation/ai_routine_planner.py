"""
AI-Augmented RoutinePlanner Implementation

This module implements the AI-augmented RoutinePlanner concept with LLM integration
for generating workout templates from natural language descriptions.
"""

import json
import logging
from typing import List, Set, Optional, Dict, Any
from datetime import datetime, date, timedelta
import uuid

from concept_specification import (
    User, Exercise, ExerciseSet, WorkoutTemplate, UserPreferences,
    WeeklyVolume, MuscleGroup, ExperienceLevel
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class AIWorkoutGenerator:
    """AI-powered workout generator using simulated LLM responses"""
    
    def __init__(self):
        """Initialize the AI workout generator"""
        self.usage_count = 0
        self.max_usage = 1000  # Higher limit for implementation
        
    def _get_available_exercises(self, equipment_list: List[str]) -> List[Exercise]:
        """Get exercises available with the provided equipment"""
        from exercise_database import EXERCISE_DATABASE
        
        available = []
        for exercise in EXERCISE_DATABASE.values():
            can_do = False
            
            # Bodyweight exercises are always available
            if exercise.equipment == "none":
                can_do = True
            else:
                # Check if any available equipment matches
                for equipment in equipment_list:
                    if equipment.lower() in exercise.equipment.lower():
                        can_do = True
                        break
            
            if can_do:
                available.append(exercise)
        
        return available
    
    def _simulate_ai_response(self, prompt: str, preferences: UserPreferences) -> Dict[str, Any]:
        """Simulate AI response based on prompt and preferences"""
        # This simulates different responses based on the prompt content
        prompt_lower = prompt.lower()
        
        if "upper body" in prompt_lower and "strength" in prompt_lower:
            return {
                "workout_name": "Upper Body Strength Builder",
                "estimated_duration": 45,
                "exercises": [
                    {"exercise_name": "Bench Press", "sets": 4, "reps": 6, "rest_time": 120},
                    {"exercise_name": "Pull-ups", "sets": 3, "reps": 8, "rest_time": 90},
                    {"exercise_name": "Overhead Press", "sets": 3, "reps": 8, "rest_time": 90},
                    {"exercise_name": "Bent-over Rows", "sets": 3, "reps": 10, "rest_time": 90},
                    {"exercise_name": "Bicep Curls", "sets": 3, "reps": 12, "rest_time": 60},
                    {"exercise_name": "Tricep Dips", "sets": 3, "reps": 10, "rest_time": 60}
                ]
            }
        elif "full body" in prompt_lower and "beginner" in prompt_lower:
            return {
                "workout_name": "Full Body Beginner Routine",
                "estimated_duration": 30,
                "exercises": [
                    {"exercise_name": "Push-ups", "sets": 3, "reps": 8, "rest_time": 60},
                    {"exercise_name": "Squats", "sets": 3, "reps": 12, "rest_time": 60},
                    {"exercise_name": "Plank", "sets": 3, "reps": 30, "rest_time": 60},
                    {"exercise_name": "Lunges", "sets": 2, "reps": 10, "rest_time": 45},
                    {"exercise_name": "Crunches", "sets": 2, "reps": 15, "rest_time": 45}
                ]
            }
        elif "chest" in prompt_lower and "triceps" in prompt_lower:
            return {
                "workout_name": "Chest & Triceps Power",
                "estimated_duration": 40,
                "exercises": [
                    {"exercise_name": "Bench Press", "sets": 4, "reps": 8, "rest_time": 90},
                    {"exercise_name": "Dumbbell Flyes", "sets": 3, "reps": 12, "rest_time": 60},
                    {"exercise_name": "Incline Bench Press", "sets": 3, "reps": 8, "rest_time": 90},
                    {"exercise_name": "Tricep Dips", "sets": 3, "reps": 12, "rest_time": 60},
                    {"exercise_name": "Close Grip Bench Press", "sets": 3, "reps": 10, "rest_time": 75}
                ]
            }
        elif "back" in prompt_lower and "biceps" in prompt_lower:
            return {
                "workout_name": "Back & Biceps Builder",
                "estimated_duration": 45,
                "exercises": [
                    {"exercise_name": "Deadlift", "sets": 4, "reps": 5, "rest_time": 120},
                    {"exercise_name": "Pull-ups", "sets": 4, "reps": 8, "rest_time": 90},
                    {"exercise_name": "Bent-over Rows", "sets": 3, "reps": 10, "rest_time": 90},
                    {"exercise_name": "Lat Pulldowns", "sets": 3, "reps": 12, "rest_time": 60},
                    {"exercise_name": "Bicep Curls", "sets": 4, "reps": 12, "rest_time": 60}
                ]
            }
        else:
            # Default balanced workout
            return {
                "workout_name": "Balanced Full Body Workout",
                "estimated_duration": 50,
                "exercises": [
                    {"exercise_name": "Squats", "sets": 4, "reps": 8, "rest_time": 90},
                    {"exercise_name": "Bench Press", "sets": 3, "reps": 8, "rest_time": 90},
                    {"exercise_name": "Bent-over Rows", "sets": 3, "reps": 10, "rest_time": 90},
                    {"exercise_name": "Overhead Press", "sets": 3, "reps": 8, "rest_time": 75},
                    {"exercise_name": "Plank", "sets": 3, "reps": 45, "rest_time": 60}
                ]
            }
    
    def _parse_ai_response(self, response: Dict[str, Any], prompt: str) -> Optional[WorkoutTemplate]:
        """Parse AI response into WorkoutTemplate"""
        try:
            from exercise_database import EXERCISE_DATABASE
            
            # Create exercise sets
            exercise_sets = []
            used_muscle_groups = set()
            
            for ex_data in response['exercises']:
                exercise_name = ex_data['exercise_name']
                
                # Find matching exercise in database
                exercise = None
                for db_exercise in EXERCISE_DATABASE.values():
                    if db_exercise.name.lower() == exercise_name.lower():
                        exercise = db_exercise
                        break
                
                if not exercise:
                    logger.warning(f"Exercise not found in database: {exercise_name}")
                    continue
                
                # Create exercise set
                exercise_set = ExerciseSet(
                    exercise=exercise,
                    sets=ex_data.get('sets', 3),
                    reps=ex_data.get('reps', 8),
                    rest_time=ex_data.get('rest_time', 90)
                )
                
                exercise_sets.append(exercise_set)
                used_muscle_groups.update(exercise.muscle_groups)
            
            # Create workout template
            template = WorkoutTemplate(
                template_id=f"ai_generated_{self.usage_count}_{uuid.uuid4().hex[:8]}",
                name=response['workout_name'],
                exercises=exercise_sets,
                muscle_groups=used_muscle_groups,
                estimated_duration=response['estimated_duration'],
                is_ai_generated=True,
                generation_prompt=prompt
            )
            
            return template
            
        except Exception as e:
            logger.error(f"Error parsing AI response: {e}")
            return None
    
    def generate_workout_from_prompt(self, user_prompt: str, preferences: UserPreferences) -> Optional[WorkoutTemplate]:
        """
        Generate a workout template from natural language prompt
        
        Args:
            user_prompt: Natural language description of desired workout
            preferences: User preferences and constraints
            
        Returns:
            WorkoutTemplate or None if generation fails
        """
        if self.usage_count >= self.max_usage:
            logger.warning("Usage limit reached")
            return None
        
        try:
            # Simulate AI response
            ai_response = self._simulate_ai_response(user_prompt, preferences)
            
            # Parse response
            template = self._parse_ai_response(ai_response, user_prompt)
            
            if template:
                self.usage_count += 1
                logger.info(f"Successfully generated workout: {template.name}")
            
            return template
            
        except Exception as e:
            logger.error(f"Error generating workout: {e}")
            return None
    
    def customize_workout(self, original_template: WorkoutTemplate, modifications: str, preferences: UserPreferences) -> Optional[WorkoutTemplate]:
        """
        Customize an existing workout template based on natural language modifications
        
        Args:
            original_template: The original workout template
            modifications: Natural language description of desired changes
            preferences: User preferences and constraints
            
        Returns:
            Modified WorkoutTemplate or None if customization fails
        """
        try:
            # Create a new prompt that includes the original workout and modifications
            prompt = f"Modify this workout: {original_template.name}. Changes requested: {modifications}"
            
            # Generate new workout based on modifications
            new_template = self.generate_workout_from_prompt(prompt, preferences)
            
            if new_template:
                # Mark as customized
                new_template.name = f"Customized {original_template.name}"
                new_template.generation_prompt = f"Customized from: {original_template.name}. {modifications}"
            
            return new_template
            
        except Exception as e:
            logger.error(f"Error customizing workout: {e}")
            return None
    
    def analyze_workout(self, template: WorkoutTemplate) -> str:
        """
        Analyze a workout template and provide recommendations
        
        Args:
            template: Workout template to analyze
            
        Returns:
            Analysis string with recommendations
        """
        try:
            # Simple analysis based on template characteristics
            analysis_parts = []
            
            analysis_parts.append(f"Workout Analysis: {template.name}")
            analysis_parts.append(f"Duration: {template.estimated_duration} minutes")
            analysis_parts.append(f"Total Exercises: {template.total_exercises}")
            analysis_parts.append(f"Total Sets: {template.total_sets}")
            
            # Muscle group analysis
            muscle_groups = [mg.value for mg in template.muscle_groups]
            analysis_parts.append(f"Targeted Muscle Groups: {', '.join(muscle_groups)}")
            
            # Exercise recommendations
            if template.total_exercises < 4:
                analysis_parts.append("Recommendation: Consider adding more exercises for better muscle development")
            elif template.total_exercises > 8:
                analysis_parts.append("Recommendation: This is a high-volume workout - ensure adequate rest")
            
            # Rest time analysis
            avg_rest = sum(ex.rest_time or 90 for ex in template.exercises) / len(template.exercises)
            if avg_rest < 60:
                analysis_parts.append("Recommendation: Consider longer rest periods for strength development")
            
            return "\n".join(analysis_parts)
            
        except Exception as e:
            logger.error(f"Error analyzing workout: {e}")
            return "Analysis failed"


class AIRoutinePlanner:
    """AI-Augmented RoutinePlanner Implementation"""
    
    def __init__(self):
        """Initialize the AI RoutinePlanner"""
        self.workout_templates: Dict[str, WorkoutTemplate] = {}
        self.user_templates: Dict[str, List[str]] = {}  # user_id -> template_ids
        self.weekly_volumes: Dict[str, List[WeeklyVolume]] = {}  # user_id -> volumes
        self.user_preferences: Dict[str, UserPreferences] = {}  # user_id -> preferences
        self.ai_generator = AIWorkoutGenerator()
    
    def create_template(self, user: User, name: str, exercises: List[ExerciseSet]) -> str:
        """
        Create a new workout template
        
        Args:
            user: The user creating the template
            name: Template name
            exercises: List of exercise sets
            
        Returns:
            Template ID
        """
        template_id = f"manual_{uuid.uuid4().hex[:8]}"
        
        # Determine muscle groups
        muscle_groups = set()
        for exercise_set in exercises:
            muscle_groups.update(exercise_set.exercise.muscle_groups)
        
        # Estimate duration (rough calculation: 2 minutes per set including rest)
        estimated_duration = sum(exercise_set.sets * 2 for exercise_set in exercises)
        
        template = WorkoutTemplate(
            template_id=template_id,
            name=name,
            exercises=exercises,
            muscle_groups=muscle_groups,
            estimated_duration=estimated_duration,
            is_ai_generated=False
        )
        
        self.workout_templates[template_id] = template
        
        # Add to user's templates
        if user.user_id not in self.user_templates:
            self.user_templates[user.user_id] = []
        self.user_templates[user.user_id].append(template_id)
        
        logger.info(f"Created template '{name}' with {len(exercises)} exercises")
        return template_id
    
    def generate_workout_from_prompt(self, user: User, prompt: str, preferences: UserPreferences) -> Optional[WorkoutTemplate]:
        """
        Generate workout template from natural language prompt using AI
        
        Args:
            user: The user requesting the workout
            prompt: Natural language description
            preferences: User preferences
            
        Returns:
            Generated WorkoutTemplate or None
        """
        # Store preferences
        self.user_preferences[user.user_id] = preferences
        
        # Generate workout using AI
        template = self.ai_generator.generate_workout_from_prompt(prompt, preferences)
        
        if template:
            # Store the template
            self.workout_templates[template.template_id] = template
            
            # Add to user's templates
            if user.user_id not in self.user_templates:
                self.user_templates[user.user_id] = []
            self.user_templates[user.user_id].append(template.template_id)
        
        return template
    
    def get_suggested_workout(self, user: User, target_date: date) -> Optional[WorkoutTemplate]:
        """
        Get suggested workout based on recent training volume and balance
        
        Args:
            user: The user
            target_date: Date for the workout
            
        Returns:
            Suggested WorkoutTemplate or None
        """
        # Simple logic: suggest a workout based on recent volume
        week_start = target_date - timedelta(days=target_date.weekday())
        
        if user.user_id in self.weekly_volumes:
            volumes = self.weekly_volumes[user.user_id]
            recent_volumes = [v for v in volumes if v.week_start >= week_start - timedelta(days=7)]
            
            # Find muscle groups with lower volume
            muscle_volume = {}
            for volume in recent_volumes:
                if volume.muscle_group not in muscle_volume:
                    muscle_volume[volume.muscle_group] = 0
                muscle_volume[volume.muscle_group] += volume.volume
            
            # Suggest workout targeting underworked muscle groups
            if not muscle_volume or min(muscle_volume.values()) < 10:
                # Create a balanced workout suggestion
                return self._create_balanced_workout(user)
        
        # Default: return first available template for user
        if user.user_id in self.user_templates and self.user_templates[user.user_id]:
            template_id = self.user_templates[user.user_id][0]
            return self.workout_templates.get(template_id)
        
        return None
    
    def update_volume(self, user: User, exercise: Exercise, sets: int, reps: int, weight: float):
        """
        Update weekly volume for exercise's muscle groups
        
        Args:
            user: The user
            exercise: The exercise performed
            sets: Number of sets
            reps: Number of reps
            weight: Weight used
        """
        week_start = date.today() - timedelta(days=date.today().weekday())
        volume = sets * reps * weight
        
        if user.user_id not in self.weekly_volumes:
            self.weekly_volumes[user.user_id] = []
        
        # Update volume for each muscle group targeted by the exercise
        for muscle_group in exercise.muscle_groups:
            # Check if volume already exists for this muscle group this week
            existing_volume = None
            for vol in self.weekly_volumes[user.user_id]:
                if (vol.muscle_group == muscle_group and 
                    vol.week_start == week_start):
                    existing_volume = vol
                    break
            
            if existing_volume:
                existing_volume.volume += volume
            else:
                new_volume = WeeklyVolume(
                    user_id=user.user_id,
                    muscle_group=muscle_group,
                    week_start=week_start,
                    volume=volume
                )
                self.weekly_volumes[user.user_id].append(new_volume)
        
        logger.info(f"Updated volume for {user.user_id}: {exercise.name} (+{volume})")
    
    def check_balance(self, user: User, week_start: date) -> List[MuscleGroup]:
        """
        Check training balance and return muscle groups with significantly lower volume
        
        Args:
            user: The user
            week_start: Start of the week to check
            
        Returns:
            List of muscle groups with lower volume
        """
        if user.user_id not in self.weekly_volumes:
            return []
        
        volumes = [v for v in self.weekly_volumes[user.user_id] 
                  if v.week_start == week_start]
        
        if not volumes:
            return []
        
        muscle_volume = {}
        for volume in volumes:
            if volume.muscle_group not in muscle_volume:
                muscle_volume[volume.muscle_group] = 0
            muscle_volume[volume.muscle_group] += volume.volume
        
        if not muscle_volume:
            return []
        
        # Find muscle groups with volume significantly below average
        avg_volume = sum(muscle_volume.values()) / len(muscle_volume)
        threshold = avg_volume * 0.5  # 50% below average
        
        imbalanced_groups = [
            muscle_group for muscle_group, volume in muscle_volume.items()
            if volume < threshold
        ]
        
        return imbalanced_groups
    
    def customize_workout(self, user: User, template_id: str, modifications: str) -> Optional[WorkoutTemplate]:
        """
        Customize an existing workout template using AI
        
        Args:
            user: The user
            template_id: ID of template to customize
            modifications: Natural language description of modifications
            
        Returns:
            Customized WorkoutTemplate or None
        """
        if template_id not in self.workout_templates:
            logger.error(f"Template {template_id} not found")
            return None
        
        if user.user_id not in self.user_preferences:
            logger.error(f"No preferences found for user {user.user_id}")
            return None
        
        original_template = self.workout_templates[template_id]
        preferences = self.user_preferences[user.user_id]
        
        # Use AI to customize the workout
        customized_template = self.ai_generator.customize_workout(
            original_template, modifications, preferences
        )
        
        if customized_template:
            # Store the customized template
            self.workout_templates[customized_template.template_id] = customized_template
            
            # Add to user's templates
            if user.user_id not in self.user_templates:
                self.user_templates[user.user_id] = []
            self.user_templates[user.user_id].append(customized_template.template_id)
        
        return customized_template
    
    def analyze_workout(self, user: User, template_id: str) -> str:
        """
        Analyze a workout template and provide recommendations
        
        Args:
            user: The user
            template_id: ID of template to analyze
            
        Returns:
            Analysis string
        """
        if template_id not in self.workout_templates:
            return f"Template {template_id} not found"
        
        template = self.workout_templates[template_id]
        return self.ai_generator.analyze_workout(template)
    
    def _create_balanced_workout(self, user: User) -> Optional[WorkoutTemplate]:
        """Create a balanced workout for the user"""
        from exercise_database import EXERCISE_DATABASE
        
        # Simple balanced workout
        exercises = [
            ExerciseSet(EXERCISE_DATABASE["squats"], 3, 10),
            ExerciseSet(EXERCISE_DATABASE["bench_press"], 3, 8),
            ExerciseSet(EXERCISE_DATABASE["bent_over_rows"], 3, 10),
            ExerciseSet(EXERCISE_DATABASE["plank"], 3, 30)
        ]
        
        template_id = self.create_template(user, "Balanced Full Body", exercises)
        return self.workout_templates.get(template_id)
    
    def get_user_templates(self, user: User) -> List[WorkoutTemplate]:
        """Get all templates for a user"""
        if user.user_id not in self.user_templates:
            return []
        
        templates = []
        for template_id in self.user_templates[user.user_id]:
            if template_id in self.workout_templates:
                templates.append(self.workout_templates[template_id])
        
        return templates
    
    def get_usage_stats(self) -> Dict[str, Any]:
        """Get usage statistics"""
        return {
            "total_templates": len(self.workout_templates),
            "ai_generated_templates": len([t for t in self.workout_templates.values() if t.is_ai_generated]),
            "manual_templates": len([t for t in self.workout_templates.values() if not t.is_ai_generated]),
            "total_users": len(self.user_templates),
            "ai_usage_count": self.ai_generator.usage_count
        }
