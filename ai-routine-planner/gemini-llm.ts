/**
 * LLM Integration for AI RoutinePlanner
 * 
 * Handles AI-powered workout generation, customization, and analysis using Google's Gemini API.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Configuration for API access
 */
export interface Config {
    apiKey: string;
}

export class GeminiLLM {
    private apiKey: string;
    private usageCount: number = 0;
    private maxUsage: number = 1000; // Higher limit for implementation

    constructor(config: Config) {
        this.apiKey = config.apiKey;
    }

    async executeLLM(prompt: string): Promise<string> {
        try {
            // Check usage limits
            if (this.usageCount >= this.maxUsage) {
                throw new Error('Usage limit reached for demo');
            }

            // For demo purposes, simulate API responses
            if (this.apiKey === 'demo-key-for-testing') {
                this.usageCount++;
                return this.simulateAIResponse(prompt);
            }

            // Initialize Gemini AI for real API calls
            const genAI = new GoogleGenerativeAI(this.apiKey);
            const model = genAI.getGenerativeModel({ 
                model: "gemini-2.5-flash-lite",
                generationConfig: {
                    maxOutputTokens: 2000,
                    temperature: 0.7,
                }
            });

            // Execute the LLM
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            this.usageCount++;
            return text;
            
        } catch (error) {
            console.error('Error calling Gemini API:', (error as Error).message);
            throw error;
        }
    }

    /**
     * Simulate AI responses for demo purposes
     */
    private simulateAIResponse(prompt: string): string {
        const promptLower = prompt.toLowerCase();
        
        if (promptLower.includes('analyze')) {
            return `Workout Analysis:
- Duration: Appropriate for the target muscle groups
- Exercise Selection: Well-balanced compound and isolation movements
- Volume: Moderate to high volume suitable for intermediate trainees
- Progression: Good variety for progressive overload
- Recommendations: Consider adding more core work and ensuring proper form`;
        } else if (promptLower.includes('upper body') && promptLower.includes('strength')) {
            return JSON.stringify({
                workout_name: "Upper Body Strength Builder",
                estimated_duration: 45,
                exercises: [
                    { exercise_name: "Bench Press", sets: 4, reps: 6, rest_time: 120 },
                    { exercise_name: "Pull-ups", sets: 3, reps: 8, rest_time: 90 },
                    { exercise_name: "Overhead Press", sets: 3, reps: 8, rest_time: 90 },
                    { exercise_name: "Bent-over Rows", sets: 3, reps: 10, rest_time: 90 },
                    { exercise_name: "Bicep Curls", sets: 3, reps: 12, rest_time: 60 },
                    { exercise_name: "Tricep Dips", sets: 3, reps: 10, rest_time: 60 }
                ]
            });
        } else if (promptLower.includes('full body') && promptLower.includes('beginner')) {
            return JSON.stringify({
                workout_name: "Full Body Beginner Routine",
                estimated_duration: 30,
                exercises: [
                    { exercise_name: "Push-ups", sets: 3, reps: 8, rest_time: 60 },
                    { exercise_name: "Squats", sets: 3, reps: 12, rest_time: 60 },
                    { exercise_name: "Plank", sets: 3, reps: 30, rest_time: 60 },
                    { exercise_name: "Lunges", sets: 2, reps: 10, rest_time: 45 },
                    { exercise_name: "Crunches", sets: 2, reps: 15, rest_time: 45 }
                ]
            });
        } else if (promptLower.includes('chest') && promptLower.includes('triceps')) {
            return JSON.stringify({
                workout_name: "Chest & Triceps Power",
                estimated_duration: 40,
                exercises: [
                    { exercise_name: "Bench Press", sets: 4, reps: 8, rest_time: 90 },
                    { exercise_name: "Dumbbell Flyes", sets: 3, reps: 12, rest_time: 60 },
                    { exercise_name: "Incline Bench Press", sets: 3, reps: 8, rest_time: 90 },
                    { exercise_name: "Tricep Dips", sets: 3, reps: 12, rest_time: 60 },
                    { exercise_name: "Close Grip Bench Press", sets: 3, reps: 10, rest_time: 75 }
                ]
            });
        } else if (promptLower.includes('back') && promptLower.includes('biceps')) {
            return JSON.stringify({
                workout_name: "Back & Biceps Builder",
                estimated_duration: 45,
                exercises: [
                    { exercise_name: "Deadlift", sets: 4, reps: 5, rest_time: 120 },
                    { exercise_name: "Pull-ups", sets: 4, reps: 8, rest_time: 90 },
                    { exercise_name: "Bent-over Rows", sets: 3, reps: 10, rest_time: 90 },
                    { exercise_name: "Lat Pulldowns", sets: 3, reps: 12, rest_time: 60 },
                    { exercise_name: "Bicep Curls", sets: 4, reps: 12, rest_time: 60 }
                ]
            });
        } else if (promptLower.includes('analysis')) {
            return `Workout Analysis:
- Duration: Appropriate for the target muscle groups
- Exercise Selection: Well-balanced compound and isolation movements
- Volume: Moderate to high volume suitable for intermediate trainees
- Progression: Good variety for progressive overload
- Recommendations: Consider adding more core work and ensuring proper form`;
        } else if (promptLower.includes('customize') || promptLower.includes('modify')) {
            return JSON.stringify({
                workout_name: "Customized Upper Body Workout",
                estimated_duration: 50,
                exercises: [
                    { exercise_name: "Bench Press", sets: 3, reps: 8, rest_time: 90 },
                    { exercise_name: "Assisted Pull-ups", sets: 3, reps: 6, rest_time: 90 },
                    { exercise_name: "Overhead Press", sets: 3, reps: 8, rest_time: 90 },
                    { exercise_name: "Bent-over Rows", sets: 3, reps: 10, rest_time: 90 },
                    { exercise_name: "Bicep Curls", sets: 3, reps: 12, rest_time: 60 },
                    { exercise_name: "Plank", sets: 3, reps: 30, rest_time: 60 }
                ]
            });
        } else {
            // Default balanced workout
            return JSON.stringify({
                workout_name: "Balanced Full Body Workout",
                estimated_duration: 50,
                exercises: [
                    { exercise_name: "Squats", sets: 4, reps: 8, rest_time: 90 },
                    { exercise_name: "Bench Press", sets: 3, reps: 8, rest_time: 90 },
                    { exercise_name: "Bent-over Rows", sets: 3, reps: 10, rest_time: 90 },
                    { exercise_name: "Overhead Press", sets: 3, reps: 8, rest_time: 75 },
                    { exercise_name: "Plank", sets: 3, reps: 45, rest_time: 60 }
                ]
            });
        }
    }

    /**
     * Get usage statistics
     */
    getUsageStats(): { usageCount: number; maxUsage: number; remainingUsage: number } {
        return {
            usageCount: this.usageCount,
            maxUsage: this.maxUsage,
            remainingUsage: this.maxUsage - this.usageCount
        };
    }
}
