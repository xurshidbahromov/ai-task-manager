import json

def analyze_task_priority(title: str, description: str = "") -> str:
    text = (title + " " + (description or "")).lower()
    high_keywords = ["urgent", "asap", "deadline", "important", "fix", "critical", "today", "boss"]
    low_keywords = ["later", "maybe", "someday", "wishlist", "ignore", "low"]
    
    if any(word in text for word in high_keywords):
        return "High"
    elif any(word in text for word in low_keywords):
        return "Low"
    else:
        return "Medium"

def decompose_task(title: str) -> str:
    """
    AI Logic to break down a main task into 3 actionable sub-steps.
    """
    title_low = title.lower()
    
    strategies = {
        "website": ["Define sitemap", "Design UI in Figma", "Setup React frontend", "Connect Backend API"],
        "app": ["Market research", "Wireframe concepts", "MVP development", "Alpha testing"],
        "report": ["Gather data", "Draft outline", "Write executive summary", "Final review"],
        "book": ["Outline chapters", "Write first draft", "Self-editing", "Find a publisher"],
        "email": ["Draft response", "Check tone & grammar", "Attach files", "Hit send"],
        "code": ["Understand requirements", "Write unit tests", "Implement logic", "Refactor"],
        "bug": ["Reproduce the issue", "Identify root cause", "Implement fix", "Verify fix"],
        "exam": ["Review lecture notes", "Create practice quiz", "Study group session", "Rest well"],
        "travel": ["Book flights", "Reserve accommodation", "Pack essentials", "Plan itinerary"],
    }
    
    # Simple keyword matching for decomposition
    for key, steps in strategies.items():
        if key in title_low:
            return json.dumps(steps)
            
    # Default strategy
    return json.dumps(["Phase 1: Research", "Phase 2: Execution", "Phase 3: Final Review"])
