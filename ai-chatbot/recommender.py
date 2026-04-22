"""
Pet Recommendation Engine

Uses keyword extraction and scoring to match pets to user lifestyle.
Handles multi-turn conversation to gather lifestyle info, then recommends.
"""

import re
from pets_data import get_all_pets

# ── Keyword dictionaries for lifestyle extraction ──────────────────────────

SPACE_KEYWORDS = {
    "small": {"apartment", "studio", "small", "tiny", "compact", "flat", "dorm", "room", "one-bedroom", "1bhk", "1 bhk"},
    "medium": {"medium", "moderate", "average", "2bhk", "2 bhk", "two-bedroom", "condo", "townhouse"},
    "large": {"large", "big", "house", "yard", "garden", "backyard", "villa", "farm", "spacious", "3bhk", "3 bhk"},
}

TIME_KEYWORDS = {
    "busy": {"busy", "no time", "work", "hectic", "packed", "travel", "always out", "long hours", "overtime", "little time"},
    "moderate": {"moderate", "some time", "weekends", "average", "balanced", "normal", "regular"},
    "free": {"free", "lots of time", "retired", "stay home", "work from home", "remote", "wfh", "plenty of time", "available", "home a lot"},
}

ACTIVITY_KEYWORDS = {
    "low": {"sedentary", "couch", "lazy", "relax", "calm", "quiet", "low energy", "chill", "homebody", "inactive"},
    "moderate": {"moderate", "sometimes", "walks", "occasional", "balanced", "normal"},
    "high": {"active", "energetic", "run", "running", "jog", "jogging", "hike", "hiking", "sport", "sports", "exercise", "outdoor", "outdoors", "athletic", "gym", "fit", "fitness"},
}

CLIMATE_KEYWORDS = {
    "hot": {"hot", "warm", "tropical", "humid", "summer", "desert", "heat", "sunny", "scorching"},
    "cold": {"cold", "cool", "winter", "snow", "freezing", "chilly", "frigid", "icy"},
    "moderate": {"moderate", "mild", "temperate", "pleasant", "normal", "average"},
}

EXTRA_KEYWORDS = {
    "kids": {"kids", "children", "child", "toddler", "baby", "family", "son", "daughter", "kid"},
    "quiet": {"quiet", "silent", "peaceful", "no noise", "no barking", "calm"},
    "budget": {"cheap", "affordable", "budget", "low cost", "inexpensive", "economical"},
    "allergy": {"allergy", "allergic", "hypoallergenic", "sneeze", "asthma"},
    "first_pet": {"first pet", "beginner", "never had", "new to", "first time", "starter"},
}


def _extract_keywords(text):
    """Extract lifestyle factors from user message text."""
    text_lower = text.lower()
    factors = {}

    # Check space
    for level, keywords in SPACE_KEYWORDS.items():
        if any(kw in text_lower for kw in keywords):
            factors["space"] = level
            break

    # Check time
    for level, keywords in TIME_KEYWORDS.items():
        if any(kw in text_lower for kw in keywords):
            factors["time"] = level
            break

    # Check activity
    for level, keywords in ACTIVITY_KEYWORDS.items():
        if any(kw in text_lower for kw in keywords):
            factors["activity"] = level
            break

    # Check climate
    for level, keywords in CLIMATE_KEYWORDS.items():
        if any(kw in text_lower for kw in keywords):
            factors["climate"] = level
            break

    # Check extras
    for category, keywords in EXTRA_KEYWORDS.items():
        if any(kw in text_lower for kw in keywords):
            factors[category] = True

    return factors


def _score_pet(pet, factors):
    """
    Score a pet based on how well it matches the user's lifestyle factors.
    Returns a score between 0-100 and explanation parts.
    """
    score = 50  # Base score
    reasons = []

    # ── Space matching ──
    if "space" in factors:
        space = factors["space"]
        if space == "small":
            if pet["space_need"] <= 2:
                score += 15
                reasons.append("Great for small spaces")
            elif pet["space_need"] >= 4:
                score -= 20
                reasons.append("May need more space than available")
            else:
                score += 5
        elif space == "medium":
            if pet["space_need"] <= 3:
                score += 10
                reasons.append("Fits well in moderate living space")
            else:
                score -= 5
        elif space == "large":
            score += 10
            reasons.append("Your spacious home is a great fit")

    # ── Time matching ──
    if "time" in factors:
        time = factors["time"]
        if time == "busy":
            if pet["time_need"] <= 2:
                score += 15
                reasons.append("Low maintenance — perfect for busy schedules")
            elif pet["time_need"] >= 4:
                score -= 20
                reasons.append("Needs more attention than you may have time for")
            else:
                score += 0
        elif time == "moderate":
            if pet["time_need"] <= 3:
                score += 10
                reasons.append("Manageable care requirements for your schedule")
            else:
                score -= 5
        elif time == "free":
            if pet["time_need"] >= 3:
                score += 10
                reasons.append("You'll have plenty of time for bonding")
            else:
                score += 5

    # ── Activity matching ──
    if "activity" in factors:
        activity = factors["activity"]
        if activity == "low":
            if pet["activity_level"] <= 2:
                score += 15
                reasons.append("Matches your relaxed lifestyle")
            elif pet["activity_level"] >= 4:
                score -= 15
                reasons.append("This pet needs more exercise than you may prefer")
        elif activity == "moderate":
            if 2 <= pet["activity_level"] <= 4:
                score += 10
                reasons.append("Activity needs align with your moderate lifestyle")
        elif activity == "high":
            if pet["activity_level"] >= 4:
                score += 15
                reasons.append("Active companion for your energetic lifestyle")
            elif pet["activity_level"] <= 2:
                score -= 10
                reasons.append("This pet may not keep up with your active pace")

    # ── Climate matching ──
    if "climate" in factors:
        climate = factors["climate"]
        if "any" in pet["climate"]:
            score += 5
            reasons.append("Adapts to any climate")
        elif climate in pet["climate"]:
            score += 10
            reasons.append(f"Well-suited for {climate} climates")
        else:
            score -= 10
            reasons.append(f"May not thrive in {climate} conditions")

    # ── Extra factor bonuses ──
    if factors.get("kids"):
        if pet["kid_friendly"] >= 4:
            score += 10
            reasons.append("Excellent with children")
        elif pet["kid_friendly"] <= 2:
            score -= 10
            reasons.append("Not ideal around small children")

    if factors.get("quiet"):
        if pet["noise_level"] <= 2:
            score += 10
            reasons.append("Very quiet — ideal for peaceful homes")
        elif pet["noise_level"] >= 4:
            score -= 10
            reasons.append("Can be noisy at times")

    if factors.get("budget"):
        if pet["cost"] <= 2:
            score += 10
            reasons.append("Very budget-friendly")
        elif pet["cost"] >= 4:
            score -= 10
            reasons.append("Higher upfront and ongoing costs")

    if factors.get("first_pet"):
        if pet["time_need"] <= 2 and pet["cost"] <= 3:
            score += 10
            reasons.append("Beginner-friendly — great first pet!")
        elif pet["time_need"] >= 4:
            score -= 5

    # Clamp score
    score = max(10, min(100, score))

    # Provide a default reason if none from matching
    if not reasons:
        reasons.append(pet["description"][:80])

    return score, reasons


# ── Conversation state machine ─────────────────────────────────────────────

QUESTIONS = [
    {
        "key": "space",
        "question": "🏠 What's your living space like? (e.g., small apartment, medium condo, large house with a yard)",
    },
    {
        "key": "time",
        "question": "⏰ How much free time do you have for a pet? (e.g., very busy, moderate, lots of free time)",
    },
    {
        "key": "activity",
        "question": "🏃 How active is your lifestyle? (e.g., sedentary/couch, moderate, very active/hiking)",
    },
    {
        "key": "climate",
        "question": "🌡️ What's the climate where you live? (e.g., hot, cold, moderate)",
    },
]


def process_message(user_message, session):
    """
    Process a user message and return a response with optional pet recommendations.

    Args:
        user_message: The user's chat message
        session: Dict tracking conversation state {factors: {}, step: int, done: bool}

    Returns:
        dict with keys: reply (str), pets (list or None), session (dict)
    """
    if session is None:
        session = {"factors": {}, "step": 0, "done": False}

    # If already done, allow follow-up questions
    if session.get("done"):
        return _handle_followup(user_message, session)

    # Extract any factors from the current message
    new_factors = _extract_keywords(user_message)
    session["factors"].update(new_factors)

    # Check if user gave lots of info at once (skip to results)
    if len(session["factors"]) >= 3 and session["step"] <= 1:
        return _generate_recommendations(session)

    # If we extracted something relevant to the current question, advance
    current_step = session["step"]
    if current_step < len(QUESTIONS):
        expected_key = QUESTIONS[current_step]["key"]
        if expected_key in session["factors"]:
            session["step"] += 1

    # If first message and no factors, send greeting
    if current_step == 0 and not new_factors:
        greeting = (
            "👋 **Hey there! I'm PetMatch AI** — your personal pet recommendation assistant!\n\n"
            "I'll ask you a few quick questions about your lifestyle to find your perfect pet companion. "
            "You can answer each question one at a time, or describe your lifestyle all at once!\n\n"
        )
        greeting += QUESTIONS[0]["question"]
        session["step"] = 0
        return {"reply": greeting, "pets": None, "session": session}

    # Check if we have enough information
    if session["step"] >= len(QUESTIONS) or len(session["factors"]) >= 4:
        return _generate_recommendations(session)

    # Ask next unanswered question
    next_step = session["step"]
    while next_step < len(QUESTIONS):
        if QUESTIONS[next_step]["key"] not in session["factors"]:
            break
        next_step += 1

    if next_step >= len(QUESTIONS):
        return _generate_recommendations(session)

    session["step"] = next_step
    ack = "Got it! " if new_factors else "I'd love to help! "
    reply = ack + QUESTIONS[next_step]["question"]
    return {"reply": reply, "pets": None, "session": session}


def _generate_recommendations(session):
    """Score all pets and return top recommendations."""
    factors = session["factors"]
    all_pets = get_all_pets()

    scored = []
    for pet in all_pets:
        score, reasons = _score_pet(pet, factors)
        scored.append({
            "id": pet["id"],
            "name": pet["name"],
            "type": pet["type"],
            "image": pet["image"],
            "description": pet["description"],
            "lifespan": pet["lifespan"],
            "score": score,
            "reasons": reasons,
        })

    # Sort by score descending
    scored.sort(key=lambda x: x["score"], reverse=True)
    top_pets = scored[:5]

    # Build reply
    factors_summary = []
    if "space" in factors:
        factors_summary.append(f"**Space**: {factors['space']}")
    if "time" in factors:
        factors_summary.append(f"**Time**: {factors['time']}")
    if "activity" in factors:
        factors_summary.append(f"**Activity**: {factors['activity']}")
    if "climate" in factors:
        factors_summary.append(f"**Climate**: {factors['climate']}")

    extras = []
    if factors.get("kids"):
        extras.append("kid-friendly")
    if factors.get("quiet"):
        extras.append("quiet")
    if factors.get("budget"):
        extras.append("budget-friendly")
    if factors.get("first_pet"):
        extras.append("beginner-friendly")

    reply = "🎉 **Great! Based on your lifestyle, here are my top pet recommendations:**\n\n"
    if factors_summary:
        reply += "Your profile: " + " | ".join(factors_summary)
        if extras:
            reply += " | " + ", ".join(extras)
        reply += "\n\n"
    reply += "Check out the pet cards below — each one is scored on how well they match your lifestyle! 🐾"

    session["done"] = True
    return {"reply": reply, "pets": top_pets, "session": session}


def _handle_followup(user_message, session):
    """Handle messages after recommendations have been given."""
    text_lower = user_message.lower()

    # Check if user wants to restart
    restart_words = {"restart", "start over", "reset", "new", "again", "different", "redo"}
    if any(w in text_lower for w in restart_words):
        new_session = {"factors": {}, "step": 0, "done": False}
        reply = (
            "🔄 **Let's start fresh!** I'll ask you about your lifestyle again.\n\n"
            + QUESTIONS[0]["question"]
        )
        return {"reply": reply, "pets": None, "session": new_session}

    # Check if asking about a specific pet
    all_pets = get_all_pets()
    for pet in all_pets:
        if pet["name"].lower() in text_lower or pet["id"].replace("_", " ") in text_lower:
            reply = (
                f"🐾 **{pet['name']}** ({pet['type']})\n\n"
                f"{pet['description']}\n\n"
                f"**Lifespan**: {pet['lifespan']}\n"
                f"**Space need**: {'🟢' * pet['space_need']}{'⚪' * (5 - pet['space_need'])} ({pet['space_need']}/5)\n"
                f"**Time need**: {'🟢' * pet['time_need']}{'⚪' * (5 - pet['time_need'])} ({pet['time_need']}/5)\n"
                f"**Activity**: {'🟢' * pet['activity_level']}{'⚪' * (5 - pet['activity_level'])} ({pet['activity_level']}/5)\n"
                f"**Kid-friendly**: {'🟢' * pet['kid_friendly']}{'⚪' * (5 - pet['kid_friendly'])} ({pet['kid_friendly']}/5)\n\n"
                f"Would you like to know about another pet, or type **restart** to get new recommendations?"
            )
            return {"reply": reply, "pets": None, "session": session}

    # Generic follow-up
    reply = (
        "🤔 I can help with more! Here's what you can do:\n\n"
        "• **Ask about a specific pet** — e.g., \"Tell me more about the Golden Retriever\"\n"
        "• **Type 'restart'** — to get new recommendations based on different preferences\n"
        "• **Add more details** — e.g., \"I also have kids\" or \"I need a quiet pet\""
    )

    # Check if new factors were given
    new_factors = _extract_keywords(user_message)
    if new_factors:
        session["factors"].update(new_factors)
        session["done"] = False
        return _generate_recommendations(session)

    return {"reply": reply, "pets": None, "session": session}