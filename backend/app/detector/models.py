"""
Core data models for the technology detector.
Entry: a single node in a repository's file tree.
Matcher: protocol for a single detection condition.
Rule: a named technology with a list of matchers (all must pass).
"""

from dataclasses import dataclass
from typing import Protocol, runtime_checkable


@dataclass(frozen=True)
class Entry:
    """
    A single fil or directory in a repository's file tree.
    Attributes:
    path: Full relative path from the repo root. e.g. "src/main.py"
    name: Full path component (filename or directory name). e.g "main.py"
    type: "file" or "dir"
    """

    path: str
    name: str
    type: str

    @property
    def extension(self) -> str:
        """
        Lowercase file extension including the leading dor e.g ".py"
        Returns an empty string if the filename has no extension.
        """
        _, dot, ext = self.name.rpartition(".")
        return f".{ext.lower()}" if dot else ""

    @property
    def is_file(self) -> bool:
        return self.type == "file"

    @property
    def is_dir(self) -> bool:
        return self.type == "dir"


@runtime_checkable
class Matcher(Protocol):
    """
    Protocol for a single detection condition.
    A matcher receives the complete, flat list of repository entries and returns True if its condition is satisfied.
    Within a single matcher, multiple candidate values use OR logic.
    Across matchers in a Rule, AND logic applies; all matchers must pass for the rule to trigger.
    """

    def matches(self, entries: list[Entry]) -> bool:
        """Return True if this condition is satisfied by the given entries."""
        ...


@dataclass
class Rule:
    """
    A technology detection rule.
    Attributes:
    name: Display name of the technology. e.g "Arduino"
    matchers: All conditions that must be satisfied (AND logic).
    """

    name: str
    matchers: list[Matcher]
