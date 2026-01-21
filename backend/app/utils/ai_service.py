import re

def analyze_task_priority(title: str, description: str = "") -> str:
    """
    A rule-based AI simulation that analyzes task text to predict priority.
    In a real-world scenario, this would call an LLM (Gemini/OpenAI) 
    or a trained NLP model.
    """
    text = (title + " " + (description or "")).lower()
    
    # High Priority Keywords
    high_keywords = ["urgent", "asap", "deadline", "important", "fix", "critical", "today", "boss"]
    # Low Priority Keywords
    low_keywords = ["later", "maybe", "someday", "wishlist", "ignore", "low"]
    
    if any(word in text for word in high_keywords):
        return "High"
    elif any(word in text for word in low_keywords):
        return "Low"
    else:
        return "Medium"

def get_ai_suggestions(title: str) -> str:
    """
    Simulates AI giving a suggestion based on the task title.
    """
    if "email" in title.lower():
        return "AI Suggestion: Keep it brief and clear."
    if "code" in title.lower() or "bug" in title.lower():
        return "AI Suggestion: Don't forget to write tests!"
    return "AI Suggestion: Break this into smaller sub-tasks for better focus."
