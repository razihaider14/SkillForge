"""
Technology detection rules.
Each Rule pairs a technology name with the conditions that identify it.
Adding a new technology means adding a new Rule here, no other file needs to change.
Rule conditions (matchers) use AND logic: all must be satisfied.
Within a single matcher, multiple values use OR logic,
"""

from app.detector.matchers import (
    HasDirectory,
    HasExtension,
    HasFilename,
    HasFileGlob,
    HasPath,
)
from app.detector.models import Rule

RULES: list[Rule] = [
    Rule(
        name="Python",
        matchers=[HasExtension(".py")],
    ),
    Rule(
        name="Arduino",
        matchers=[HasExtension(".ino")],
    ),
    Rule(
        name="PlatformIO",
        matchers=[HasFilename("platform.ini")],
    ),
    Rule(
        name="Node.js",
        matchers=[HasFilename("package.json")],
    ),
    Rule(
        name="Docker",
        matchers=[
            HasFileGlob("dockerfile")
        ],  # Matches Dockerfile, dockerfile, DOCKERFILE, etc.
    ),
    Rule(
        name="Docker Compose",
        matchers=[
            HasFilename(
                "docker-compose.yml",
                "docker-compose.yaml",
                "compose.yml",
                "compose.yaml",
            )
        ],
    ),
    Rule(
        name="GitHub Actions",
        matchers=[HasPath(".github/workflows")],
    ),
    Rule(
        name="Rust",
        matchers=[HasFilename("Cargo.toml")],
    ),
    Rule(
        name="Go",
        matchers=[HasFilename("go.mod")],
    ),
    Rule(
        name="Java Maven",
        matchers=[HasFilename("pom.xml")],
    ),
    Rule(
        name="CMake",
        matchers=[HasFilename("CMakeLists.txt")],
    ),
]
