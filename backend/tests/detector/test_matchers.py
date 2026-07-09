"""
Unit tests for every matcher type.

Each test class covers one matcher in isolation: correct positives,
correct negatives, edge cases (empty tree, case sensitivity, etc.).
"""

import pytest
from tests.conftest import d, f
from app.detector.matchers import (
    AllOf,
    AnyOf,
    HasDirectory,
    HasExtension,
    HasFileContent,
    HasFileGlob,
    HasFilename,
    HasPath,
)
from app.detector.models import Entry


def entries(*items: dict) -> list[Entry]:
    return [Entry(path=e["path"], name=e["name"], type=e["type"]) for e in items]


# HasExtension


class TestHasExtension:
    def test_matches_exact_extension(self):
        assert HasExtension(".py").matches(entries(f("app/main.py")))

    def test_matches_any_of_multiple_extensions(self):
        m = HasExtension(".c", ".h")
        assert m.matches(entries(f("src/util.h")))
        assert m.matches(entries(f("src/main.c")))

    def test_case_insensitive(self):
        assert HasExtension(".py").matches(entries(f("Script.PY")))

    def test_no_match_on_wrong_extension(self):
        assert not HasExtension(".py").matches(entries(f("main.js")))

    def test_no_match_on_directory(self):
        # A directory named "src.py" should not trigger extension matching
        assert not HasExtension(".py").matches(entries(d("src.py")))

    def test_no_match_on_empty_tree(self):
        assert not HasExtension(".py").matches([])

    def test_no_match_for_file_without_extension(self):
        assert not HasExtension(".py").matches(entries(f("Makefile")))


# HasFilename


class TestHasFilename:
    def test_matches_exact_name(self):
        assert HasFilename("Cargo.toml").matches(entries(f("Cargo.toml")))

    def test_case_insensitive(self):
        assert HasFilename("Dockerfile").matches(entries(f("dockerfile")))
        assert HasFilename("dockerfile").matches(entries(f("Dockerfile")))

    def test_matches_nested_file(self):
        assert HasFilename("pom.xml").matches(entries(f("modules/core/pom.xml")))

    def test_matches_any_of_multiple_names(self):
        m = HasFilename("docker-compose.yml", "compose.yml")
        assert m.matches(entries(f("compose.yml")))

    def test_no_match_on_wrong_name(self):
        assert not HasFilename("pom.xml").matches(entries(f("build.gradle")))

    def test_no_match_on_directory_with_same_name(self):
        assert not HasFilename("Makefile").matches(entries(d("Makefile")))

    def test_no_match_on_empty_tree(self):
        assert not HasFilename("pom.xml").matches([])


# HasDirectory


class TestHasDirectory:
    def test_matches_directory(self):
        assert HasDirectory(".github").matches(entries(d(".github")))

    def test_case_insensitive(self):
        assert HasDirectory(".github").matches(entries(d(".GitHub")))

    def test_matches_any_of_multiple_names(self):
        m = HasDirectory("k8s", "kubernetes")
        assert m.matches(entries(d("k8s")))
        assert m.matches(entries(d("kubernetes")))

    def test_no_match_on_file_with_same_name(self):
        assert not HasDirectory(".github").matches(entries(f(".github")))

    def test_no_match_when_absent(self):
        assert not HasDirectory(".circleci").matches(entries(d(".github")))

    def test_no_match_on_empty_tree(self):
        assert not HasDirectory("src").matches([])


# HasPath


class TestHasPath:
    def test_matches_exact_path(self):
        assert HasPath("src/main.py").matches(entries(f("src/main.py")))

    def test_matches_prefix(self):
        # Any entry whose path starts with the given prefix
        assert HasPath(".github/workflows").matches(
            entries(f(".github/workflows/ci.yml"))
        )

    def test_case_insensitive(self):
        assert HasPath("src/main/resources").matches(
            entries(f("src/main/resources/application.properties"))
        )

    def test_no_match_when_path_absent(self):
        assert not HasPath("src/main/resources").matches(
            entries(f("src/test/resources/test.properties"))
        )

    def test_no_match_on_empty_tree(self):
        assert not HasPath(".github/workflows").matches([])

    def test_does_not_match_unrelated_path(self):
        assert not HasPath("src/main/resources/application.properties").matches(
            entries(f("src/main/resources/logback.xml"))
        )


# HasFileGlob


class TestHasFileGlob:
    def test_literal_pattern_case_insensitive(self):
        # No wildcards: behaves as case-insensitive exact match
        assert HasFileGlob("dockerfile").matches(entries(f("Dockerfile")))
        assert HasFileGlob("dockerfile").matches(entries(f("DOCKERFILE")))

    def test_wildcard_suffix(self):
        m = HasFileGlob("next.config.*")
        assert m.matches(entries(f("next.config.js")))
        assert m.matches(entries(f("next.config.ts")))
        assert m.matches(entries(f("next.config.mjs")))

    def test_wildcard_prefix(self):
        assert HasFileGlob("jenkinsfile*").matches(entries(f("Jenkinsfile")))
        assert HasFileGlob("jenkinsfile*").matches(entries(f("Jenkinsfile.groovy")))

    def test_no_match_on_directory(self):
        assert not HasFileGlob("dockerfile").matches(entries(d("Dockerfile")))

    def test_no_match_on_partial_name(self):
        assert not HasFileGlob("vite.config.*").matches(
            entries(f("not-vite.config.js"))
        )

    def test_no_match_on_empty_tree(self):
        assert not HasFileGlob("*.py").matches([])


# HasFileContent (stub)


class TestHasFileContent:
    def test_always_returns_false(self):
        # Stub: always False until file content retrieval is implemented.
        m = HasFileContent("requirements.txt", "fastapi")
        assert not m.matches(entries(f("requirements.txt")))

    def test_false_even_on_matching_filename(self):
        m = HasFileContent("pom.xml", "spring-boot")
        assert not m.matches(entries(f("pom.xml")))


# AnyOf (composite OR)


class TestAnyOf:
    def test_matches_if_any_child_matches(self):
        m = AnyOf(HasFilename("pom.xml"), HasFilename("build.gradle"))
        assert m.matches(entries(f("pom.xml")))
        assert m.matches(entries(f("build.gradle")))

    def test_no_match_if_no_child_matches(self):
        m = AnyOf(HasFilename("pom.xml"), HasFilename("build.gradle"))
        assert not m.matches(entries(f("Cargo.toml")))

    def test_no_match_on_empty_tree(self):
        m = AnyOf(HasExtension(".py"), HasExtension(".js"))
        assert not m.matches([])

    def test_short_circuits_on_first_match(self):
        # Not strictly testable without mocking, but this verifies correctness
        m = AnyOf(HasFilename("a.txt"), HasFilename("b.txt"))
        assert m.matches(entries(f("a.txt")))


# AllOf (composite AND)


class TestAllOf:
    def test_matches_only_when_all_children_match(self):
        m = AllOf(HasFilename("pom.xml"), HasExtension(".java"))
        assert m.matches(entries(f("pom.xml"), f("src/Main.java")))

    def test_no_match_if_any_child_fails(self):
        m = AllOf(HasFilename("pom.xml"), HasExtension(".java"))
        assert not m.matches(entries(f("pom.xml")))  # missing .java
        assert not m.matches(entries(f("src/Main.java")))  # missing pom.xml

    def test_no_match_on_empty_tree(self):
        m = AllOf(HasFilename("pom.xml"), HasExtension(".java"))
        assert not m.matches([])


# Nested composites


class TestNestedComposites:
    def test_anyof_containing_allof(self):
        # (A AND B) OR (C AND D)
        m = AnyOf(
            AllOf(HasFilename("pom.xml"), HasExtension(".java")),
            AllOf(HasFilename("build.gradle"), HasExtension(".kt")),
        )
        assert m.matches(entries(f("pom.xml"), f("Main.java")))
        assert m.matches(entries(f("build.gradle"), f("Main.kt")))
        assert not m.matches(entries(f("pom.xml"), f("Main.kt")))  # mixed : no match

    def test_allof_containing_anyof(self):
        # (A OR B) AND C
        m = AllOf(
            AnyOf(HasFilename("pom.xml"), HasFilename("build.gradle")),
            HasExtension(".java"),
        )
        assert m.matches(entries(f("pom.xml"), f("src/Main.java")))
        assert m.matches(entries(f("build.gradle"), f("src/Main.java")))
        assert not m.matches(entries(f("pom.xml")))  # no .java files
