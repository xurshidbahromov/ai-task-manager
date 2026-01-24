import json

def analyze_task_priority(title: str, description: str = "") -> str:
    text = (title + " " + (description or "")).lower()
    
    # Kengaytirilgan yuqori ustuvorlik kalit so'zlari
    high_keywords = [
        # English
        "urgent", "asap", "deadline", "important", "fix", "critical", "today", "boss", "must", "emergency",
        "immediate", "priority", "alert", "required", "mandatory", "essential", "vital", "crucial", "pressing",
        # O'zbekcha
        "shoshilinch", "muhim", "bugun", "shart", "tezda", "darhol", "muammo", "zudlik", "darrov", "asosiy",
        "zarur", "majburiy", "kechiktirib", "dolzarb", "jiddiy", "tezkor"
    ]
    
    # Kengaytirilgan past ustuvorlik kalit so'zlari
    low_keywords = [
        # English
        "later", "maybe", "someday", "wishlist", "ignore", "low", "eventually", "optional", "whenever",
        "backlog", "future", "minor", "trivial", "sometime",
        # O'zbekcha
        "keyinroq", "balki", "qachondir", "ixtiyoriy", "past", "vaqti kelganda", "xohishga ko'ra", "imkon bo'lganda",
        "ahamiyatsiz", "ikkinchi darajali", "bo'sh vaqtda", "zararsiz"
    ]
    
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

def categorize_transaction(description: str) -> str:
    """
    Simulates AI categorization for financial transactions.
    """
    desc = description.lower()
    
    mapping = {
        "food": ["lunch", "dinner", "breakfast", "cafe", "restaurant", "burger", "coffee", "grocery", "market", "food"],
        "transport": ["uber", "taxi", "bus", "train", "flight", "gas", "fuel", "parking"],
        "salary": ["salary", "wage", "paycheck", "freelance", "upwork", "project"],
        "shopping": ["clothes", "shoes", "amazon", "electronics", "gift", "buy"],
        "utilities": ["rent", "bill", "electricity", "water", "internet", "phone"],
        "entertainment": ["movie", "cinema", "game", "netflix", "spotify", "subscription"],
        "health": ["doctor", "pharmacy", "medicine", "gym", "sport"],
    }
    
    for category, keywords in mapping.items():
        if any(keyword in desc for keyword in keywords):
            return category.capitalize()
            
    return "General"
