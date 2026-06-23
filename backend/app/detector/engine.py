"""
Technology detection engine.
The engine is a pure function: given a list of entries and a list of rules,
it returns the names of all rules whose matchers are fully satisfied.
It has no knowledge of GitHub, HTTP, or application state.
"""

from app.detector.models import Entry, Rule


def detect(entries: list[Entry], rules: list[Rule]) -> list[str]:
    """
    Run all rules against the entry list and return a sorted list of
    detected technology names.
    A rule is considered matched when every one of its matchers returns
    True for the given entries (AND logic).
    Args:
    entries: Flat list of all entries in the repository tree.
    rules: List of technology rules to evaluate.
    Returns:
    A sorted list of matched technology names.
    """
    return sorted(
        rule.name
        for rule in rules
        if all(matcher.matches(entries) for matcher in rule.matchers)
    )
