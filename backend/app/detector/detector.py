# Detection rules: each technology maps to the conditions that identify it.
# "language": repo's primary language must match (case-insensitive).
# "files": All entries must exist, each entry is either a plain filename string (any type) or a dict {"name": "...", "type": "file"|"dir"}.
# "any_files": At least one entry must exist, same format as "files". Supports "*.ext" glob syntax (always matched as type "file").
# All specified keys for a rule must be satisfied for detection to trigger.
# All filename comparisons are case-insensitive.

_RULES: list[dict] = [
    {
        "name": "Python",
        "language": "python",
    },
    {
        "name": "Arduino",
        "language": "c++",
        "any_files": ["*.ino"],
    },
    {
        "name": "PlatformIO",
        "files": [{"name": "platformio.ini", "type": "file"}],
    },
    {
        "name": "Node.js",
        "files": [{"name": "package.json", "type": "file"}],
    },
    {
        "name": "Docker",
        "any_files": [{"name": "dockerfile", "type": "file"}],
    },
    {
        "name": "Docker Compose",
        "any_files": [
            {"name": "docker-compose.yml", "type": "file"},
            {"name": "docker-compose.yaml", "type": "file"},
            {"name": "compose.yml", "type": "file"},
            {"name": "compose.yaml", "type": "file"},
        ],
    },
    {
        "name": "GitHub Actions",
        "files": [{"name": ".github", "type": "dir"}],
    },
    {
        "name": "Rust",
        "files": [{"name": "cargo.toml", "type": "file"}],
    },
    {
        "name": "Go",
        "files": [{"name": "go.mod", "type": "file"}],
    },
    {
        "name": "Java Maven",
        "files": [{"name": "pom.xml", "type": "file"}],
    },
    {
        "name": "CMake",
        "files": [{"name": "cmakelists.txt", "type": "file"}],
    },
]


def _build_index(contents: list[dict]) -> dict[str, str]:
    """Return a mapping of lowercase filename -> type for all root entries."""
    return {entry["name"].lower(): entry["type"] for entry in contents}


def _entry_matches(candidate: str | dict, index: dict[str, str]) -> bool:
    """
    Check whether a single rule matches against the contents index.
    Hndles three forms:
    - "*.ext" glob: any file ending in that extension
    - {"name": ..., "type": ...} exact name + type check (case-insensitive)
    """
    if isinstance(candidate, str) and candidate.startswith("*."):
        ext = candidate[1:]  # "*.ino" -> ".ino"
        return any(name.endswith(ext) for name, typ in index.items() if typ == "file")

    if isinstance(candidate, dict):
        name = candidate["name"].lower()
        expected_type = candidate.get("type")
        actual_type = index.get(name)
        if actual_type is None:
            return False
        return expected_type is None or actual_type == expected_type

    # Plain string with no glob: match name only, any type
    return candidate.lower() in index


def detect_technologies(repository: dict) -> list[str]:
    """
    Inspect a repo's primary language and root directory contents and return a sorted list of detected technologies using deterministic rules.
    Args:
    repository: a dict eith keys:
    "language" (str | None): the repo's primary language.
    "contents" (list[dict]): root entries, each with "name" and "type".
    Returns:
    A sorted list of detected technology names.
    """
    language: str = (repository.get("language") or "").lower()
    contents: list[dict] = repository.get("contents") or []
    index = _build_index(contents)

    detected: list[str] = []

    for rule in _RULES:
        if "language" in rule and language != rule["language"]:
            continue

        if "files" in rule and not all(_entry_matches(e, index) for e in rule["files"]):
            continue

        if "any_files" in rule and not any(
            _entry_matches(e, index) for e in rule["any_files"]
        ):
            continue

        detected.append(rule["name"])

    return sorted(detected)
