/**
 * ICT Transcript Processor
 * Converts raw transcripts into structured educational content
 */

class ICTTranscriptProcessor {
    constructor() {
        this.modules = [
            'Trading Setup Elements',
            'Market Efficiency Paradigm', 
            'Skills Mastery',
            'Balance vs Discount Markets',
            'Balance vs Premium Markets',
            'Fair Value Understanding',
            'Impulse Price Swings',
            'Entry Point Management'
        ];
        
        this.keyTerms = [
            'Order Block', 'Fair Value Gap', 'Liquidity Pool', 'Smart Money',
            'Institutional Order Flow', 'Market Structure', 'Fibonacci',
            'Premium Market', 'Discount Market', 'Equilibrium', 'Manipulation'
        ];
    }

    /**
     * Process raw transcript into structured course content
     */
    processTranscript(rawText, moduleIndex) {
        const processed = {
            module: this.modules[moduleIndex],
            lessons: this.extractLessons(rawText),
            keyPoints: this.extractKeyPoints(rawText),
            tradingConcepts: this.extractTradingConcepts(rawText),
            practicalExamples: this.extractExamples(rawText),
            actionItems: this.extractActionItems(rawText)
        };

        return processed;
    }

    /**
     * Extract lesson sections from transcript
     */
    extractLessons(text) {
        const lessons = [];
        const sections = text.split(/(?:Lesson|Part|Section)\s*\d+/gi);
        
        sections.forEach((section, index) => {
            if (section.trim().length > 100) {
                lessons.push({
                    id: index,
                    title: this.generateLessonTitle(section),
                    content: this.cleanText(section),
                    duration: this.estimateDuration(section),
                    difficulty: this.assessDifficulty(section)
                });
            }
        });

        return lessons;
    }

    /**
     * Extract key trading concepts
     */
    extractTradingConcepts(text) {
        const concepts = [];
        
        this.keyTerms.forEach(term => {
            const regex = new RegExp(`(${term}[^.]*\\.([^.]*\\.){0,2})`, 'gi');
            const matches = text.match(regex);
            
            if (matches) {
                concepts.push({
                    term: term,
                    definitions: matches.map(m => this.cleanText(m)),
                    importance: this.calculateImportance(matches.length)
                });
            }
        });

        return concepts;
    }

    /**
     * Extract practical examples for bot development
     */
    extractExamples(text) {
        const examples = [];
        const examplePatterns = [
            /piemēr[a-z]*\s*[:\-]?\s*([^.]*\.([^.]*\.){0,3})/gi,
            /example[a-z]*\s*[:\-]?\s*([^.]*\.([^.]*\.){0,3})/gi,
            /situācij[a-z]*\s*[:\-]?\s*([^.]*\.([^.]*\.){0,3})/gi
        ];

        examplePatterns.forEach(pattern => {
            const matches = text.match(pattern);
            if (matches) {
                examples.push(...matches.map(m => ({
                    text: this.cleanText(m),
                    type: 'practical',
                    botRelevance: this.assessBotRelevance(m)
                })));
            }
        });

        return examples;
    }

    /**
     * Generate course content structure
     */
    generateCourseStructure(processedModules) {
        return {
            courseTitle: "ICT Trading Mastery Program",
            totalDuration: this.calculateTotalDuration(processedModules),
            modules: processedModules.map((module, index) => ({
                moduleNumber: index + 1,
                ...module,
                quizQuestions: this.generateQuizQuestions(module),
                assignments: this.generateAssignments(module),
                botElements: this.extractBotElements(module)
            }))
        };
    }

    /**
     * Extract elements suitable for trading bot automation
     */
    extractBotElements(module) {
        const botElements = {
            entryRules: [],
            exitRules: [],
            riskManagement: [],
            marketConditions: [],
            automatable: false
        };

        // Look for specific rule patterns
        const rulePatterns = [
            /kad\s*cena\s*[^.]*\./gi,
            /if\s*[^.]*\./gi,
            /enter\s*[^.]*\./gi,
            /exit\s*[^.]*\./gi
        ];

        rulePatterns.forEach(pattern => {
            const matches = module.content?.match?.(pattern) || [];
            matches.forEach(match => {
                if (this.isAutomatable(match)) {
                    botElements.entryRules.push(this.convertToLogic(match));
                    botElements.automatable = true;
                }
            });
        });

        return botElements;
    }

    /**
     * Helper methods
     */
    cleanText(text) {
        return text
            .replace(/\s+/g, ' ')
            .replace(/^\W+|\W+$/g, '')
            .trim();
    }

    generateLessonTitle(section) {
        const firstSentence = section.split('.')[0];
        return firstSentence.substring(0, 60) + '...';
    }

    estimateDuration(text) {
        const wordCount = text.split(/\s+/).length;
        return Math.ceil(wordCount / 150); // Assume 150 words per minute
    }

    assessDifficulty(text) {
        const complexTerms = this.keyTerms.filter(term => 
            text.toLowerCase().includes(term.toLowerCase())
        ).length;
        
        if (complexTerms > 5) return 'Advanced';
        if (complexTerms > 2) return 'Intermediate';
        return 'Beginner';
    }

    calculateImportance(frequency) {
        if (frequency > 10) return 'Critical';
        if (frequency > 5) return 'Important';
        return 'Basic';
    }

    assessBotRelevance(text) {
        const automationKeywords = [
            'cena', 'līmenis', 'signāls', 'ienākšana', 'izeja',
            'price', 'level', 'signal', 'entry', 'exit'
        ];
        
        const relevanceScore = automationKeywords.filter(keyword =>
            text.toLowerCase().includes(keyword)
        ).length;

        return relevanceScore > 2 ? 'High' : relevanceScore > 0 ? 'Medium' : 'Low';
    }

    isAutomatable(rule) {
        const automatablePatterns = [
            /\d+%/, // Percentage levels
            /fibonacci/i,
            /līmenis/i,
            /level/i,
            /above|below|virs|zem/i
        ];

        return automatablePatterns.some(pattern => pattern.test(rule));
    }

    convertToLogic(rule) {
        // Convert human language rule to pseudocode
        return {
            originalRule: rule,
            pseudocode: this.translateToPseudocode(rule),
            parameters: this.extractParameters(rule)
        };
    }

    translateToPseudocode(rule) {
        // Basic translation logic - expand this based on specific rules
        let pseudocode = rule.toLowerCase();
        
        const translations = {
            'kad cena': 'when price',
            'virs': 'above',
            'zem': 'below',
            'ienākšana': 'entry',
            'izeja': 'exit'
        };

        Object.entries(translations).forEach(([latvian, english]) => {
            pseudocode = pseudocode.replace(new RegExp(latvian, 'g'), english);
        });

        return pseudocode;
    }

    extractParameters(rule) {
        const parameters = {};
        
        // Extract percentages
        const percentages = rule.match(/\d+\.?\d*%/g);
        if (percentages) parameters.percentages = percentages;
        
        // Extract numbers
        const numbers = rule.match(/\d+\.?\d*/g);
        if (numbers) parameters.values = numbers;

        return parameters;
    }

    generateQuizQuestions(module) {
        // Generate quiz questions based on module content
        return [
            {
                question: `What is the main concept in ${module.module}?`,
                type: 'multiple-choice',
                options: ['A', 'B', 'C', 'D'],
                correct: 'A'
            }
        ];
    }

    generateAssignments(module) {
        return [
            {
                title: `Practice ${module.module}`,
                description: 'Apply the concepts learned in this module',
                deliverable: 'Trading journal entry'
            }
        ];
    }

    calculateTotalDuration(modules) {
        return modules.reduce((total, module) => {
            return total + (module.lessons?.reduce((lessonTotal, lesson) => {
                return lessonTotal + (lesson.duration || 0);
            }, 0) || 0);
        }, 0);
    }
}

module.exports = ICTTranscriptProcessor;

// Example usage:
if (require.main === module) {
    const processor = new ICTTranscriptProcessor();
    
    // Example with your Latvian transcript
    const sampleTranscript = `
        Forex tirdzniecības iestatījumu elementu pārvaldīšana
        Kad cena sasniedz 62% Fibonacci līmeni, mēs varam apsvertīt ienākšanas punktu.
        Orderu bloki ir svarīgi identificēt...
    `;
    
    const result = processor.processTranscript(sampleTranscript, 0);
    console.log('Processed Content:', JSON.stringify(result, null, 2));
}