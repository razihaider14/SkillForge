"""
Concrete Matcher implementations for the technology rule engine.
Primitive matchers inspect individual properties of repository entries:
    HasExtension : file extension
    HasFilename : exact filename (case-insensitive)
    HasDirectory : directory name (case-insensitive)
    HasPath : path prefix (case-insensitive)
    HasFileGlob : filename glob pattern
    HasFileContent : file content substring (stub; always False)

Composite matchers combine other matchers with boolean logic:
    AnyOf — OR:  matches if any child matcher matches
    AllOf — AND: matches if all child matchers match

All primitive matching is case-insensitive.
Candidate values within a single primitive matcher use OR logic.
"""

from dataclasses import dataclass
from fnmatch import fnmatch

from app.detector.models import Entry, Matcher

# Primitive matchers


@dataclass(frozen=True)
class HasExtension:
    """
    Matches if the tree contains at least one file whose extension
    is among the given extensions (case-insensitive).

    Example:
        HasExtension(".py")
        HasExtension(".c", ".cpp", ".h")
    """

    extensions: tuple[str, ...]

    def __init__(self, *extensions: str) -> None:
        object.__setattr__(self, "extensions", tuple(e.lower() for e in extensions))

    def matches(self, entries: list[Entry]) -> bool:
        return any(e.is_file and e.extension in self.extensions for e in entries)


@dataclass(frozen=True)
class HasFilename:
    """
    Matches if the tree contains a file whose name exactly matches any of
    the given filenames (case-insensitive, anywhere in the tree).

    Example:
        HasFilename("Cargo.toml")
        HasFilename("docker-compose.yml", "docker-compose.yaml")
    """

    names: tuple[str, ...]

    def __init__(self, *names: str) -> None:
        object.__setattr__(self, "names", tuple(n.lower() for n in names))

    def matches(self, entries: list[Entry]) -> bool:
        return any(e.is_file and e.name.lower() in self.names for e in entries)


@dataclass(frozen=True)
class HasDirectory:
    """
    Matches if the tree contains a directory whose name exactly matches any
    of the given names (case-insensitive, anywhere in the tree).

    Example:
        HasDirectory(".github")
        HasDirectory("k8s", "kubernetes")
    """

    names: tuple[str, ...]

    def __init__(self, *names: str) -> None:
        object.__setattr__(self, "names", tuple(n.lower() for n in names))

    def matches(self, entries: list[Entry]) -> bool:
        return any(e.is_dir and e.name.lower() in self.names for e in entries)


@dataclass(frozen=True)
class HasPath:
    """
    Matches if any entry's full path starts with any of the given prefixes
    (case-insensitive).

    Useful for pinpointing files or directories at a known location in the
    tree, e.g. asserting that a Spring Boot resources directory exists, or
    that at least one workflow file lives inside .github/workflows/.

    Example:
        HasPath(".github/workflows")
        HasPath("src/main/resources/application.properties")
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
    Matches if any file in the tree has a name matching any of the given
    glob patterns (case-insensitive, fnmatch semantics).

    Unlike HasExtension (extension only) or HasFilename (exact name), this
    matches against the full filename with wildcard support in any position.

    A pattern with no wildcards behaves as a case-insensitive exact match.

    Example:
        HasFileGlob("dockerfile")      # Dockerfile, DOCKERFILE, etc.
        HasFileGlob("next.config.*")   # next.config.js, next.config.ts, ...
        HasFileGlob("test_*.py")       # pytest test files
        HasFileGlob("jenkinsfile*")    # Jenkinsfile, Jenkinsfile.groovy
    """

    patterns: tuple[str, ...]

    def __init__(self, *patterns: str) -> None:
        object.__setattr__(self, "patterns", tuple(p.lower() for p in patterns))

    def matches(self, entries: list[Entry]) -> bool:
        return any(
            e.is_file and any(fnmatch(e.name.lower(), p) for p in self.patterns)
            for e in entries
        )


@dataclass(frozen=True)
class HasFileContent:
    """
    Stub for future file-content inspection.

    Will match if a file with the given name contains the given substring.
    Currently always returns False, requires file content retrieval to be
    implemented in the GitHub client before this matcher can be activated.

    The rule format is stable: rules using HasFileContent can be written
    today and will start working automatically once content is available.

    Example (future use):
        HasFileContent("requirements.txt", "fastapi")
        HasFileContent("package.json", '"react"')
        HasFileContent("pom.xml", "spring-boot")
    """

    filename: str
    contains: str

    def matches(self, entries: list[Entry]) -> bool:
        # Not yet implemented: requires file content from the GitHub API.
        return False


# Composite matchers


@dataclass(frozen=True)
class AnyOf:
    """
    Composite matcher: matches if ANY of the given matchers match (OR logic).

    Use when a technology can be identified by multiple alternative signals
    and you want to express the alternatives inside a single rule, rather than
    duplicating the rule.

    Example : detect a JVM build file of any kind:
        AnyOf(HasFilename("pom.xml"), HasFilename("build.gradle"))

    Example : nested inside a rule alongside other matchers:
        Rule(
            name="Spring Boot",
            matchers=[
                AnyOf(HasFilename("pom.xml"), HasFilename("build.gradle")),
                HasPath("src/main/resources/application.properties"),
            ],
        )
    """

    matchers: tuple[Matcher, ...]

    def __init__(self, *matchers: Matcher) -> None:
        object.__setattr__(self, "matchers", matchers)

    def matches(self, entries: list[Entry]) -> bool:
        return any(m.matches(entries) for m in self.matchers)


@dataclass(frozen=True)
class AllOf:
    """
    Composite matcher: matches if ALL of the given matchers match (AND logic).

    Equivalent to listing matchers at the Rule level, but useful for grouping
    a sub-condition set inside an AnyOf, enabling full nested boolean logic.

    Example : Spring Boot detected via either Maven or Gradle, each paired
    with its own config file signal:
        AnyOf(
            AllOf(
                HasFilename("pom.xml"),
                HasPath("src/main/resources/application.properties"),
            ),
            AllOf(
                HasFilename("build.gradle"),
                HasPath("src/main/resources/application.properties"),
            ),
        )
    """

    matchers: tuple[Matcher, ...]

    def __init__(self, *matchers: Matcher) -> None:
        object.__setattr__(self, "matchers", matchers)

    def matches(self, entries: list[Entry]) -> bool:
        return all(m.matches(entries) for m in self.matchers)
