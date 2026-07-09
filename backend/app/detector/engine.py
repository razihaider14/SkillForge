"""
Technology detection engine.
The engine is a pure function: given a list of entries and a list of rules,
it evaluates every rule and returns a MatchResult for each that passes.

It has no knowledge of GitHub, HTTP, or application state, and no side
effects; making it straightforward to test in isolation.
"""

from app.detector.models import Entry, MatchResult, Rule


def detect(entries: list[Entry], rules: list[Rule]) -> list[MatchResult]:
    """
    Evaluate all rules against the entry list and return a MatchResult for
    every rule whose matchers are all satisfied.

    A rule matches when every one of its matchers returns True (AND logic).
    Matchers may themselves implement OR or nested logic internally.

    Results are returned in the order rules are defined. Sorting by priority,
    confidence, or name is left to the caller.

    Args:
        entries: Flat list of all entries in the repository tree.
        rules:   List of technology rules to evaluate.

    Returns:
        List of MatchResult objects for every matched rule.
    """
    return [
        MatchResult(
            name=rule.name,
            category=rule.category,
            confidence=rule.confidence,
            priority=rule.priority,
        )
        for rule in rules
        if all(matcher.matches(entries) for matcher in rule.matchers)
    ]
