import json

def analyze_task_priority(title: str, description: str = "") -> str:
    text = (title + " " + (description or "")).lower()
    high_keywords = ["urgent", "asap", "deadline", "important", "fix", "critical", "today", "boss", "must", "emergency"]
    low_keywords = ["later", "maybe", "someday", "wishlist", "ignore", "low"]
    
    if any(word in text for word in high_keywords):
        return "High"
    elif any(word in text for word in low_keywords):
        return "Low"
    else:
        return "Medium"

def decompose_task(title: str) -> str:
    """
    Super-charged AI Logic with deep context-awareness for Unicorn Task Manager.
    """
    title_low = title.lower()
    
    # Detailed strategy database
    strategies = {
        "eat": ["Choose a healthy meal option", "Step away from screens", "Eat mindfully and enjoy", "Hydrate with a glass of water"],
        "food": ["Check the fridge", "Buy ingredients if needed", "Cook or order", "Enjoy your meal"],
        "wake up": ["Set an alarm for early morning", "Place phone in another room", "Drink water immediately", "Do a quick stretch"],
        "exercise": ["Get into workout gear", "Follow a 20-minute guide", "Keep track of heart rate", "Drink protein or water"],
        "meeting": ["Prepare talking points", "Check internet/camera", "Send invite link", "Take follow-up notes"],
        "study": ["Clear your desk", "Focus for 45 minutes", "Solve practice tasks", "Summarize core concepts"],
        "website": ["Sitemap & User Flow", "UI Design in Figma", "Frontend Component coding", "API Integration"],
        "read": ["Choose an interesting book", "Set a 15-page goal", "Note down new words", "Self-reflect on the plot"],
        "email": ["Draft the subject line", "Keep text concise", "Proofread for errors", "Send and archive"],
        "shopping": ["Create a grocery list", "Check budget limits", "Go to the store", "Organize items at home"],
        "gym": ["Pack your gym bag", "Drive/Walk to the gym", "Complete your split", "Stretch & Shower"],
        "rest": ["Turn off notifications", "Find a comfortable spot", "Close your eyes for 20m", "Wake up refreshed"],
        "cleaning": ["Tidy up the room", "Wipe all surfaces", "Vacuum the floor", "Organize your desk"],
        "code": ["Break logic into functions", "Write unit tests", "Implement the core feature", "Run lint and refactor"],
    }
    
    # Keyword search for specific strategy
    for key, steps in strategies.items():
        if key in title_low:
            return json.dumps(steps)
            
    # Contextual keywords for dynamic generation
    if "buy" in title_low or "get" in title_low:
        return json.dumps(["Research options", "Compare prices", "Go to the store/online", "Finalize purchase"])
    if "learn" in title_low or "course" in title_low:
        return json.dumps(["Watch video lessons", "Practice concepts", "Take a quiz", "Build a small project"])
    
    # Smart default strategy
    return json.dumps([
        f"Define the immediate first step for '{title}'",
        "Eliminate distractions for 25 minutes",
        "Document progress made",
        "Verify results and plan next step"
    ])
