"""
Tests for app.validation.detectability.

Two layers:
  - Unit tests against small, hand-built fake rule objects, so the
    function's logic is verified independent of the production rule tables
    ever changing.
  - One integration test against the REAL production rule tables
    (app.detector.rules.RULES, app.aggregator.rules.COMPLEMENT_RULES,
    app.aggregator.rules.COMPOSITE_SKILL_RULES). This is the actual
    regression guard: it fails the build the moment anyone adds a
    recommendation/composite reference to a technology name with no
    matching detector rule, which is exactly the class of bug that let
    "FreeRTOS" go permanently un-suppressable.
"""

from dataclasses import dataclass, field

from app.aggregator.rules import COMPLEMENT_RULES, COMPOSITE_SKILL_RULES
from app.detector.rules import RULES
from app.validation.detectability import (
    assert_recommendation_graph_is_detectable,
    find_undetectable_recommendation_names,
)


# Minimal stand-ins for Rule/ComplementRule/CompositeSkillRule, so these
# unit tests exercise only the fields find_undetectable_recommendation_names
# actually reads and don't need to satisfy those dataclasses' full
# constructors/validation.
@dataclass
class _FakeDetectorRule:
    name: str


@dataclass
class _FakeComplementRule:
    recommended: str
    complements: tuple[str, ...]


@dataclass
class _FakeCompositeRule:
    base_technologies: tuple[str, ...] = field(default_factory=tuple)


class TestFindUndetectableRecommendationNames:
    def test_returns_empty_when_every_referenced_name_is_detectable(self):
        detector_rules = [_FakeDetectorRule("Python"), _FakeDetectorRule("Ruff")]
        complement_rules = [
            _FakeComplementRule(recommended="Ruff", complements=("Ruff",))
        ]
        composite_rules = []

        undetectable = find_undetectable_recommendation_names(
            detector_rules, complement_rules, composite_rules
        )

        assert undetectable == set()

    def test_finds_a_name_missing_from_complement_rules_recommended(self):
        detector_rules = [_FakeDetectorRule("ESP32")]
        complement_rules = [
            _FakeComplementRule(recommended="FreeRTOS", complements=("FreeRTOS",))
        ]
        composite_rules = []

        undetectable = find_undetectable_recommendation_names(
            detector_rules, complement_rules, composite_rules
        )

        assert undetectable == {"FreeRTOS"}

    def test_finds_a_name_missing_from_complement_rules_complements(self):
        # "recommended" itself is detectable, but an alternative listed in
        # "complements" is not -- still a real gap, since that alternative
        # is checked for presence too.
        detector_rules = [_FakeDetectorRule("Ruff")]
        complement_rules = [
            _FakeComplementRule(
                recommended="Ruff", complements=("Ruff", "SuperLinter9000")
            )
        ]
        composite_rules = []

        undetectable = find_undetectable_recommendation_names(
            detector_rules, complement_rules, composite_rules
        )

        assert undetectable == {"SuperLinter9000"}

    def test_finds_a_name_missing_from_composite_base_technologies(self):
        detector_rules = [_FakeDetectorRule("Arduino")]
        complement_rules = []
        composite_rules = [
            _FakeCompositeRule(base_technologies=("Arduino", "GhostSDK"))
        ]

        undetectable = find_undetectable_recommendation_names(
            detector_rules, complement_rules, composite_rules
        )

        assert undetectable == {"GhostSDK"}

    def test_a_trigger_only_name_is_not_checked(self):
        # find_undetectable_recommendation_names only inspects
        # recommended/complements/base_technologies, never `trigger` --
        # this fake stands in for a ComplementRule whose trigger is a
        # chained, not-directly-detectable name, and confirms that alone
        # doesn't get flagged (see the module docstring for why).
        detector_rules = [_FakeDetectorRule("ESP32")]
        complement_rules = [
            _FakeComplementRule(recommended="ESP32", complements=("ESP32",))
        ]

        undetectable = find_undetectable_recommendation_names(
            detector_rules, complement_rules, composite_rules=[]
        )

        assert undetectable == set()

    def test_deduplicates_a_name_referenced_multiple_times(self):
        detector_rules = []
        complement_rules = [
            _FakeComplementRule(recommended="Ghost", complements=("Ghost",)),
            _FakeComplementRule(recommended="Ghost", complements=("Ghost", "Other")),
        ]
        composite_rules = [_FakeCompositeRule(base_technologies=("Ghost",))]

        undetectable = find_undetectable_recommendation_names(
            detector_rules, complement_rules, composite_rules
        )

        assert undetectable == {"Ghost", "Other"}


class TestAssertRecommendationGraphIsDetectable:
    def test_passes_silently_when_fully_detectable(self):
        detector_rules = [_FakeDetectorRule("Ruff")]
        complement_rules = [
            _FakeComplementRule(recommended="Ruff", complements=("Ruff",))
        ]

        assert_recommendation_graph_is_detectable(
            detector_rules, complement_rules, composite_rules=[]
        )  # must not raise

    def test_raises_with_offending_names_when_gaps_exist(self):
        detector_rules = []
        complement_rules = [
            _FakeComplementRule(recommended="Phantom", complements=("Phantom",))
        ]

        try:
            assert_recommendation_graph_is_detectable(
                detector_rules, complement_rules, composite_rules=[]
            )
        except AssertionError as exc:
            assert "Phantom" in str(exc)
        else:
            raise AssertionError(
                "expected assert_recommendation_graph_is_detectable to raise"
            )


class TestProductionRecommendationGraphIsDetectable:
    """
    The actual regression guard. Runs against the real, production
    RULES / COMPLEMENT_RULES / COMPOSITE_SKILL_RULES tables.

    If this test ever fails, it means someone added a
    ComplementRule/CompositeSkillRule referencing a technology name with no
    matching detector Rule -- i.e. the exact bug class that made "FreeRTOS"
    permanently un-suppressable as a recommendation regardless of what a
    user's repositories contained. Add the missing detector rule (or fix
    the typo/reference) rather than skipping this test.
    """

    def test_every_recommendation_target_is_detectable(self):
        assert_recommendation_graph_is_detectable(
            RULES, COMPLEMENT_RULES, COMPOSITE_SKILL_RULES
        )
