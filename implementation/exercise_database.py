"""
Exercise Database

This module contains a comprehensive database of exercises with their
associated muscle groups, movement patterns, and equipment requirements.
"""

from typing import List
from concept_specification import Exercise, MuscleGroup


# Exercise database with common exercises
EXERCISE_DATABASE = {
    # Chest exercises
    "bench_press": Exercise(
        exercise_id="bench_press",
        name="Bench Press",
        muscle_groups={MuscleGroup.CHEST, MuscleGroup.TRICEPS, MuscleGroup.SHOULDERS},
        movement_pattern="push",
        equipment="barbell, bench",
        instructions="Lie on bench, grip barbell slightly wider than shoulders, lower to chest, press up"
    ),
    "push_ups": Exercise(
        exercise_id="push_ups",
        name="Push-ups",
        muscle_groups={MuscleGroup.CHEST, MuscleGroup.TRICEPS, MuscleGroup.SHOULDERS},
        movement_pattern="push",
        equipment="none",
        instructions="Start in plank position, lower chest to ground, push back up"
    ),
    "dumbbell_flyes": Exercise(
        exercise_id="dumbbell_flyes",
        name="Dumbbell Flyes",
        muscle_groups={MuscleGroup.CHEST},
        movement_pattern="push",
        equipment="dumbbells, bench",
        instructions="Lie on bench, arms extended, lower dumbbells in arc motion, bring together"
    ),
    "incline_bench": Exercise(
        exercise_id="incline_bench",
        name="Incline Bench Press",
        muscle_groups={MuscleGroup.CHEST, MuscleGroup.SHOULDERS, MuscleGroup.TRICEPS},
        movement_pattern="push",
        equipment="barbell, incline bench",
        instructions="Similar to bench press but on incline bench at 30-45 degrees"
    ),
    
    # Back exercises
    "pull_ups": Exercise(
        exercise_id="pull_ups",
        name="Pull-ups",
        muscle_groups={MuscleGroup.BACK, MuscleGroup.BICEPS},
        movement_pattern="pull",
        equipment="pull-up bar",
        instructions="Hang from bar, pull body up until chin clears bar, lower slowly"
    ),
    "deadlift": Exercise(
        exercise_id="deadlift",
        name="Deadlift",
        muscle_groups={MuscleGroup.BACK, MuscleGroup.GLUTES, MuscleGroup.LEGS},
        movement_pattern="hip hinge",
        equipment="barbell",
        instructions="Stand with feet hip-width apart, grip bar, lift by extending hips and knees"
    ),
    "bent_over_rows": Exercise(
        exercise_id="bent_over_rows",
        name="Bent-over Rows",
        muscle_groups={MuscleGroup.BACK, MuscleGroup.BICEPS},
        movement_pattern="pull",
        equipment="barbell or dumbbells",
        instructions="Bend at hips, pull weight to lower chest, squeeze shoulder blades"
    ),
    "lat_pulldowns": Exercise(
        exercise_id="lat_pulldowns",
        name="Lat Pulldowns",
        muscle_groups={MuscleGroup.BACK, MuscleGroup.BICEPS},
        movement_pattern="pull",
        equipment="cable machine",
        instructions="Sit at lat pulldown machine, pull bar to upper chest, control return"
    ),
    
    # Shoulder exercises
    "overhead_press": Exercise(
        exercise_id="overhead_press",
        name="Overhead Press",
        muscle_groups={MuscleGroup.SHOULDERS, MuscleGroup.TRICEPS},
        movement_pattern="push",
        equipment="barbell or dumbbells",
        instructions="Press weight overhead from shoulder level, extend fully"
    ),
    "lateral_raises": Exercise(
        exercise_id="lateral_raises",
        name="Lateral Raises",
        muscle_groups={MuscleGroup.SHOULDERS},
        movement_pattern="isolation",
        equipment="dumbbells",
        instructions="Raise arms to sides until parallel to ground, lower slowly"
    ),
    "rear_delt_flyes": Exercise(
        exercise_id="rear_delt_flyes",
        name="Rear Delt Flyes",
        muscle_groups={MuscleGroup.SHOULDERS},
        movement_pattern="isolation",
        equipment="dumbbells",
        instructions="Bend forward, raise dumbbells to sides, focus on rear delts"
    ),
    
    # Arm exercises
    "bicep_curls": Exercise(
        exercise_id="bicep_curls",
        name="Bicep Curls",
        muscle_groups={MuscleGroup.BICEPS},
        movement_pattern="isolation",
        equipment="dumbbells or barbell",
        instructions="Curl weight up, squeeze biceps at top, lower slowly"
    ),
    "tricep_dips": Exercise(
        exercise_id="tricep_dips",
        name="Tricep Dips",
        muscle_groups={MuscleGroup.TRICEPS},
        movement_pattern="push",
        equipment="parallel bars or bench",
        instructions="Lower body by bending arms, push back up using triceps"
    ),
    "close_grip_bench": Exercise(
        exercise_id="close_grip_bench",
        name="Close Grip Bench Press",
        muscle_groups={MuscleGroup.TRICEPS, MuscleGroup.CHEST},
        movement_pattern="push",
        equipment="barbell, bench",
        instructions="Bench press with hands closer together, focus on triceps"
    ),
    
    # Leg exercises
    "squats": Exercise(
        exercise_id="squats",
        name="Squats",
        muscle_groups={MuscleGroup.LEGS, MuscleGroup.GLUTES},
        movement_pattern="squat",
        equipment="barbell or bodyweight",
        instructions="Lower body by bending knees and hips, keep chest up, drive through heels"
    ),
    "lunges": Exercise(
        exercise_id="lunges",
        name="Lunges",
        muscle_groups={MuscleGroup.LEGS, MuscleGroup.GLUTES},
        movement_pattern="lunge",
        equipment="bodyweight or dumbbells",
        instructions="Step forward, lower back knee toward ground, push back to start"
    ),
    "leg_press": Exercise(
        exercise_id="leg_press",
        name="Leg Press",
        muscle_groups={MuscleGroup.LEGS, MuscleGroup.GLUTES},
        movement_pattern="push",
        equipment="leg press machine",
        instructions="Push weight with legs, control descent, extend fully"
    ),
    "calf_raises": Exercise(
        exercise_id="calf_raises",
        name="Calf Raises",
        muscle_groups={MuscleGroup.LEGS},
        movement_pattern="isolation",
        equipment="bodyweight or machine",
        instructions="Raise up on toes, hold briefly, lower slowly"
    ),
    
    # Core exercises
    "plank": Exercise(
        exercise_id="plank",
        name="Plank",
        muscle_groups={MuscleGroup.ABS},
        movement_pattern="isometric",
        equipment="none",
        instructions="Hold straight line from head to heels, engage core"
    ),
    "crunches": Exercise(
        exercise_id="crunches",
        name="Crunches",
        muscle_groups={MuscleGroup.ABS},
        movement_pattern="isolation",
        equipment="none",
        instructions="Lift shoulders off ground, crunch abs, lower slowly"
    ),
    "russian_twists": Exercise(
        exercise_id="russian_twists",
        name="Russian Twists",
        muscle_groups={MuscleGroup.ABS},
        movement_pattern="rotation",
        equipment="bodyweight or medicine ball",
        instructions="Sit, lean back, rotate torso side to side"
    ),
    
    # Cardio exercises
    "running": Exercise(
        exercise_id="running",
        name="Running",
        muscle_groups={MuscleGroup.CARDIO, MuscleGroup.LEGS},
        movement_pattern="cardio",
        equipment="none",
        instructions="Maintain steady pace, focus on breathing"
    ),
    "cycling": Exercise(
        exercise_id="cycling",
        name="Cycling",
        muscle_groups={MuscleGroup.CARDIO, MuscleGroup.LEGS},
        movement_pattern="cardio",
        equipment="bike",
        instructions="Maintain steady cadence, focus on smooth pedaling"
    ),
}


def get_exercises_by_muscle_group(muscle_group: MuscleGroup) -> List[Exercise]:
    """Returns all exercises that target a specific muscle group"""
    return [exercise for exercise in EXERCISE_DATABASE.values() 
            if muscle_group in exercise.muscle_groups]


def get_exercises_by_equipment(equipment: str) -> List[Exercise]:
    """Returns all exercises that can be done with specific equipment"""
    equipment_lower = equipment.lower()
    return [exercise for exercise in EXERCISE_DATABASE.values()
            if exercise.equipment and equipment_lower in exercise.equipment.lower()]


def get_bodyweight_exercises() -> List[Exercise]:
    """Returns all bodyweight exercises"""
    return [exercise for exercise in EXERCISE_DATABASE.values()
            if exercise.equipment == "none" or "bodyweight" in exercise.equipment.lower()]


def search_exercises(query: str) -> List[Exercise]:
    """Search exercises by name or muscle group"""
    query_lower = query.lower()
    results = []
    
    for exercise in EXERCISE_DATABASE.values():
        if (query_lower in exercise.name.lower() or 
            any(query_lower in mg.value.lower() for mg in exercise.muscle_groups)):
            results.append(exercise)
    
    return results
