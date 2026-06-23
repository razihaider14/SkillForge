"""
Concrete Matcher implementations for the technology rule engine.
Each matcher is a frozen dataclass that accepts one or more candidate
values and checks them against a repository's flat entry list.
Candidate values always use OR logic within a single matcher.
All matchers in a Rule use AND logic.
Matching is always case-insensitive.
"""

from dataclasses import dataclass
from fnmatch import fnmatch

from app.detector.models import Entry


@dataclass(frozen=True)
class HasExtension:
    """
    Matches if the tree contains at least one file whose extension is among the given extensions.
    Example:
    HasExtension(".py")
    HasExtension(".c", ".cpp", ".h")
    """

    extensions: tuple[str, ...]

    def __init__(self, *extensions: str) -> None:
        object.__setattr__(self, "extensions", tuple(e.lower() for e in extensions))

    def matches(self, entries: list[Entry]) -> bool:
        return any(e.is_file and e.extension in self.extensions for e in entries)


@dataclass
class HasFilename:
    """
    Matches if the tree contains a file whose name is among the given
    filenames (case-insensitive, anywhere in the tree).
    Example:
    HasFilename("Cargo.toml")
    HasFilename("docker-compose.yml", "docker-compose.yaml", "compose.yml")
    """

    names: tuple[str, ...]

    def __init__(self, *names: str) -> None:
        object.__setattr__(self, "names", tuple(n.lower() for n in names))

    def matches(self, entries: list[Entry]) -> bool:
        return any(e.is_file and e.name.lower() in self.names for e in entries)


@dataclass(frozen=True)
class HasDirectory:
    """
    Matches if the tree contains a directory whose name is among the given names (case-insensitive, anywhere in the tree).
    Example:
    HasDirectory(".github")
    HasDirectory("src", "lib")
    """

    names: tuple[str, ...]

    def __init__(self, *names: str) -> None:
        object.__setattr__(self, "names", tuple(n.lower() for n in names))

    def matches(self, entries: list[Entry]) -> bool:
        return any(e.is_dir and e.name.lower() in self.names for e in entries)


@dataclass(frozen=True)
class HasPath:
    """
    Matches if the tree contains any entry whose path starts with any
    of the given prefixes (case-insensitive).
    Userful for asserting that a well-known directory or path exists
    anywhere under a given location.
    Example:
    HasPath(".gtihub/workflows") # any entry inside workflows/
    HasPath("src/main.rs") # file at that exact path or deeper
    """

    paths: tuple[str, ...]

    def __init__(self, *paths: str) -> None:
        object.__setattr__(self, "paths", tuple(p.lower() for p in paths))

    def matches(self, entries: list[Entry]) -> bool:
        return any(
            e.path.lower().startswith(path) for path in self.paths for e in entries
        )


@dataclass(frozen=True)
class HasFileGlob:
    """
    Matches if any file in the tree has a name that matches any of the
    given glob patterns (case-insensitive, fnmatch semantics).
    Unlike HasExtension (which matches the extension only), this matches
    against the full filename and supports wildcards in any position.
    Example:
    HasFileGlob("test_*.py") # pytest test files
    HasFileGlob("*.config.js") # JS config files
    HasFileGlob("Makefile*") #Makefile or Makefile.am etc.
    """

    patters: tuple[str, ...]

    def __init__(self, *patterns: str) -> None:
        object.__setattr__(self, "patterns", tuple(p.lower() for p in patterns))

    def matches(self, entries: list[Entry]) -> bool:
        return any(
            e.is_file and any(fnmatch(e.name.lower(), p) for p in self.patterns)
            for e in entries
        )


@dataclass
class HasFileContent:
    """
    Stub for future file-content inspection.

    Will match if a file with the given name contains the given substring.
    Currently always return False; requires file content retrieval to be
    implemented in the GitHub client before this can be achieved.
    Example (future):
    HasFileContent("requirements.txt", "fastapi")
    HasFileContent("package.json", "react")
    """

    filename: str
    contains: str

    def matches(self, entries: list[Entry]) -> bool:
        # Not yet implemented: requires file content from the GitHub API.
        return False
