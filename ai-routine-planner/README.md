# AI-Augmented RoutinePlanner

A TypeScript implementation of an AI-augmented workout routine planner using Google's Gemini API. This project demonstrates how to integrate Large Language Models (LLMs) into a fitness application for intelligent workout generation, customization, and analysis.

## 🎯 Features

### AI-Powered Actions
- **Generate Workouts**: Create personalized workout templates from natural language descriptions
- **Customize Workouts**: Modify existing workouts using AI based on natural language requests  
- **Analyze Workouts**: Get intelligent analysis and recommendations for workout templates

### Core Functionality
- **Manual Template Creation**: Create workouts without AI assistance
- **Volume Tracking**: Monitor weekly training volume across muscle groups
- **Balance Checking**: Identify muscle groups with lower training volume
- **Workout Suggestions**: Get recommendations based on training history
- **Comprehensive Exercise Database**: 25+ exercises with muscle group classifications

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API key (optional for demo mode)

### Installation

1. **Clone or download the project**
2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up configuration (optional):**
   ```bash
   cp config.json.template config.json
   # Edit config.json with your Gemini API key
   ```

4. **Build the project:**
   ```bash
   npm run build
   ```

### Running Tests

```bash
# Run all tests
npm start

# Run specific test suites
npm run manual    # Manual workout functionality only
npm run ai        # AI-powered features only  
npm run mixed     # Combined manual + AI functionality
```

## 📁 Project Structure

```
ai-routine-planner/
├── routine-planner.spec          # Concept specification
├── routine-planner.ts            # Main implementation
├── gemini-llm.ts                # LLM wrapper for Gemini API
├── routine-planner-tests.ts     # Comprehensive test suite
├── package.json                 # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── config.json.template        # Configuration template
├── config.json                 # API configuration (create from template)
└── README.md                   # This file
```

## 🧪 Test Coverage

The implementation includes comprehensive tests for:

- ✅ AI workout generation from various prompts
- ✅ Workout customization and modification
- ✅ Workout analysis and recommendations
- ✅ Manual template creation
- ✅ Volume tracking and balance checking
- ✅ Usage statistics and monitoring

### Sample Test Scenarios

#### AI Generation Tests
- "I want a 45-minute upper body workout focusing on strength building"
- "Create a quick 30-minute full body workout for a beginner"
- "I need a chest and triceps workout with progressive overload"

#### Customization Tests
- "Add more core work and make it more beginner-friendly"
- "Remove tricep exercises and focus on chest"

#### Analysis Features
- Exercise count and volume analysis
- Rest time recommendations
- Muscle group balance assessment

## 🔧 Implementation Details

### AI Integration
- **Gemini API**: Uses Google's Gemini 2.5 Flash Lite model
- **Demo Mode**: Includes simulated responses for testing without API key
- **Context Awareness**: Considers user preferences, equipment, and experience level
- **Response Parsing**: Converts AI responses into structured workout templates
- **Error Handling**: Graceful fallback when AI generation fails

### Data Models
- **User**: Represents users with preferences and settings
- **Exercise**: Comprehensive exercise database with muscle group classifications
- **WorkoutTemplate**: Complete workout templates with AI generation metadata
- **UserPreferences**: Context for personalized AI generation
- **WeeklyVolume**: Training volume tracking per muscle group

### State Management
- **Templates**: Stores both AI-generated and manual workout templates
- **Volume Tracking**: Monitors weekly training volume per muscle group
- **User Preferences**: Maintains context for AI generation
- **Usage Statistics**: Tracks AI usage and system performance

## 📊 Usage Statistics

The implementation tracks:
- Total templates created (AI vs manual)
- AI generation usage count
- User activity and preferences
- System performance metrics

## 🎨 Console Output Formatting

The implementation provides:
- **Color-coded test results** (✅ passed, ❌ failed)
- **Structured output** with clear sections and headers
- **Progress indicators** during test execution
- **Detailed analysis** of generated workouts
- **Usage statistics** and performance metrics

## 🔍 Key Implementation Highlights

1. **Preserved Original Functionality**: All original RoutinePlanner actions work alongside AI features
2. **Graceful Degradation**: System works even when AI features are unavailable
3. **Comprehensive Testing**: Full test coverage with realistic scenarios
4. **Production-Ready Structure**: Organized code with proper error handling
5. **Extensible Design**: Easy to add new AI features or integrate real LLM APIs

## 🚀 Running the Implementation

Execute the full test suite:
```bash
npm start
```

This will run:
1. Basic functionality demonstration
2. Comprehensive test cases
3. Formatted output with results
4. Usage statistics and summary

## 📝 Concept Specification

The implementation follows the AI-augmented RoutinePlanner concept specification:

- **Purpose**: Manage workout templates with AI-powered generation and balance muscle group training
- **Principle**: Ensure balanced training across muscle groups with intelligent template generation from natural language
- **State**: Comprehensive workout templates, user preferences, and volume tracking
- **Actions**: Full CRUD operations plus AI-powered generation, customization, and analysis

## 🔐 Security Notes

- API keys should be stored in `config.json` (not committed to version control)
- The demo mode works without real API keys for testing
- Real API usage requires a valid Gemini API key from Google AI Studio

## 📈 Future Enhancements

- Integration with real Gemini API for production use
- Expanded exercise database with more variations
- Advanced user preference modeling
- Workout difficulty progression algorithms
- Integration with wearable device data
- Social features for sharing and rating workouts

## 📄 License

This is a prototype created for educational purposes as part of Assignment 3.
