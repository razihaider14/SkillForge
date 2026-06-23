"""
Public API for the technology detector.
External callers (e.g analyzer.py) user only detect_technologies().
The internal enginer, matchers, models, and rules are implementation details.
"""

from app.detector.engine import detect
from app.detector.models import Entry
from app.detector.rules import RULES


def detect_technologies(repository: dict) -> list[str]:
    """
    Inspect a repo's contents and return a sorted list of detected technology names.
    Args:
    repository: a dict containing:
    "contents": list of entry dicts, each with "path", "name", "type".
    Returns:
    A sorted list of detected technology names.
    """
    entries = [
        Entry(path=item["path"], name=item["name"], type=item["type"])
        for item in repository.get("contents") or []
    ]
    return detect(entries, RULES)
