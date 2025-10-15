"""
Driver Script for AI-Augmented RoutinePlanner

This is the main entry point for testing the AI-augmented RoutinePlanner implementation.
It runs comprehensive test cases and provides formatted output.
"""

import sys
import os
from datetime import datetime

# Add current directory to path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from test_cases import run_all_tests
from ai_routine_planner import AIRoutinePlanner
from concept_specification import User, UserPreferences, ExperienceLevel, MuscleGroup


def print_header():
    """Print a formatted header"""
    print("="*80)
    print("AI-AUGMENTED ROUTINE PLANNER - IMPLEMENTATION TESTING")
    print("="*80)
    print(f"Test Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Concept: AI-Augmented RoutinePlanner")
    print(f"Features: LLM-powered workout generation, customization, and analysis")
    print("="*80)


def demonstrate_basic_functionality():
    """Demonstrate basic functionality with examples"""
    print("\nBASIC FUNCTIONALITY DEMONSTRATION")
    print("-"*50)
    
    # Create planner instance
    planner = AIRoutinePlanner()
    
    # Create test user and preferences
    user = User("demo_user", "DemoUser", "demo@example.com")
    preferences = UserPreferences(
        user_id=user.user_id,
        experience_level=ExperienceLevel.INTERMEDIATE,
        goals="Build muscle and improve overall fitness",
        available_equipment=["barbell", "dumbbells", "bench", "pull-up bar"],
        time_per_session=45,
        preferred_muscle_groups=[MuscleGroup.CHEST, MuscleGroup.BACK, MuscleGroup.LEGS]
    )
    
    print(f"User: {user.username}")
    print(f"Goals: {preferences.goals}")
    print(f"Equipment: {', '.join(preferences.available_equipment)}")
    print(f"Time Available: {preferences.time_per_session} minutes")
    print(f"Preferred Groups: {[mg.value for mg in preferences.preferred_muscle_groups]}")
    
    # Demonstrate AI workout generation
    print(f"\nAI WORKOUT GENERATION DEMO")
    print("-"*30)
    
    prompts = [
        "I want a 45-minute upper body workout focusing on strength building",
        "Create a quick 30-minute full body workout for a beginner",
        "I need a chest and triceps workout with progressive overload"
    ]
    
    for i, prompt in enumerate(prompts, 1):
        print(f"\nPrompt {i}: {prompt}")
        template = planner.generate_workout_from_prompt(user, prompt, preferences)
        
        if template:
            print(f"Generated: {template.name}")
            print(f"   Duration: {template.estimated_duration} minutes")
            print(f"   Exercises: {template.total_exercises}")
            print(f"   Sets: {template.total_sets}")
            print(f"   Muscle Groups: {[mg.value for mg in template.muscle_groups]}")
            
            # Show first few exercises
            print("   Sample Exercises:")
            for j, exercise_set in enumerate(template.exercises[:3], 1):
                print(f"     {j}. {exercise_set.exercise.name} ({exercise_set.sets}x{exercise_set.reps})")
            if len(template.exercises) > 3:
                print(f"     ... and {len(template.exercises) - 3} more exercises")
        else:
            print("Failed to generate workout")
    
    # Demonstrate customization
    print(f"\nWORKOUT CUSTOMIZATION DEMO")
    print("-"*30)
    
    if planner.get_user_templates(user):
        original_template = planner.get_user_templates(user)[0]
        print(f"Original: {original_template.name}")
        
        modifications = "Add more core work and make it more beginner-friendly"
        print(f"Modifications: {modifications}")
        
        customized = planner.customize_workout(user, original_template.template_id, modifications)
        if customized:
            print(f"Customized: {customized.name}")
            print(f"   Exercises: {[ex.exercise.name for ex in customized.exercises]}")
    
    # Demonstrate analysis
    print(f"\nWORKOUT ANALYSIS DEMO")
    print("-"*30)
    
    if planner.get_user_templates(user):
        template = planner.get_user_templates(user)[0]
        analysis = planner.analyze_workout(user, template.template_id)
        print(f"Analyzing: {template.name}")
        print("Analysis:")
        for line in analysis.split('\n'):
            print(f"   {line}")
    
    # Show usage statistics
    print(f"\nUSAGE STATISTICS")
    print("-"*20)
    stats = planner.get_usage_stats()
    for key, value in stats.items():
        print(f"   {key.replace('_', ' ').title()}: {value}")


def main():
    """Main driver function"""
    print_header()
    
    # Run basic functionality demonstration
    demonstrate_basic_functionality()
    
    # Run comprehensive test suite
    print(f"\nRUNNING COMPREHENSIVE TEST SUITE")
    print("="*50)
    
    try:
        success = run_all_tests()
        
        print(f"\n{'='*80}")
        if success:
            print("ALL TESTS PASSED! Implementation is working correctly.")
            print("AI-augmented RoutinePlanner is ready for use.")
        else:
            print("SOME TESTS FAILED! Please review the implementation.")
            print("Check the test output above for specific issues.")
        print("="*80)
        
        return 0 if success else 1
        
    except Exception as e:
        print(f"\nCRITICAL ERROR: {e}")
        print("The test suite encountered an unexpected error.")
        return 1


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
