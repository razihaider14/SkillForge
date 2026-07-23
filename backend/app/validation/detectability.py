"""
Detectability invariant: every technology name referenced by the
recommendation/composite-skill rule tables must be reachable by an actual
detector rule.

Why this exists
----------------
app.aggregator.engine.generate_recommendations() suppresses a recommendation
only if the recommended (or an alternative "complement") skill is already
*present* in the portfolio -- and "present" is built entirely from what
app.detector can detect. If a name is referenced as a
ComplementRule.recommended, a ComplementRule.complements entry, or a
CompositeSkillRule.base_technologies entry, but no detector.rules.Rule
exists for that exact name, that name can never appear in "present",
regardless of what the user's repositories actually contain. The
recommendation becomes permanently un-suppressable: a structural bug, not a
tuning problem.

This module makes that invariant explicit and checkable, rather than
something that has to be independently reverse-engineered by reading two
files at once (which is how the FreeRTOS gap went unnoticed: "FreeRTOS" was
authored into app.aggregator.rules.COMPLEMENT_RULES years before this check
existed, and nothing ever cross-referenced it against app.detector.rules.RULES).

Scope
-----
Only checks recommendation-graph *targets*: ComplementRule.recommended,
ComplementRule.complements, and CompositeSkillRule.base_technologies.
Deliberately does NOT check ComplementRule.trigger -- a trigger is allowed to
be another rule's `recommended` value (that's how chaining works; see
app.aggregator.engine's MAX_RECOMMENDATION_CHAIN_DEPTH), so a trigger being
"undetectable" on its own doesn't necessarily indicate a bug the way an
un-suppressable recommendation target does. Widening this check to validate
the full trigger/chaining graph (e.g. detecting rules that can never fire at
all) is a reasonable future enhancement, but out of scope for the specific
bug class this module targets.
"""

from collections.abc import Iterable


def find_undetectable_recommendation_names(
    detector_rules: Iterable,
    complement_rules: Iterable,
    composite_rules: Iterable,
) -> set[str]:
    """
    Return every technology name referenced as a recommendation target
    (ComplementRule.recommended, ComplementRule.complements,
    CompositeSkillRule.base_technologies) that has no corresponding
    app.detector.models.Rule in `detector_rules`.

    An empty result means the recommendation graph is fully "detectable":
    every name it can ever suggest, or treat as satisfying a gap, is a name
    the detector is actually capable of finding.

    Args:
        detector_rules: app.detector.rules.RULES (or an equivalent iterable
            of objects with a `.name` attribute).
        complement_rules: app.aggregator.rules.COMPLEMENT_RULES (or an
            equivalent iterable of objects with `.recommended` and
            `.complements` attributes).
        composite_rules: app.aggregator.rules.COMPOSITE_SKILL_RULES (or an
            equivalent iterable of objects with a `.base_technologies`
            attribute).

    Returns:
        Set of technology names referenced by the recommendation/composite
        rule tables but absent from the detector's rule table. Empty if
        none are missing.
    """
    detectable_names = {rule.name for rule in detector_rules}

    referenced_names: set[str] = set()
    for complement_rule in complement_rules:
        referenced_names.add(complement_rule.recommended)
        referenced_names.update(complement_rule.complements)
    for composite_rule in composite_rules:
        referenced_names.update(composite_rule.base_technologies)

    return referenced_names - detectable_names


def assert_recommendation_graph_is_detectable(
    detector_rules: Iterable,
    complement_rules: Iterable,
    composite_rules: Iterable,
) -> None:
    """
    Raise AssertionError, naming every offending technology, if any
    recommendation/composite rule references a name the detector cannot
    detect. Intended for use in a test (see
    tests/validation/test_detectability.py) so a violation fails CI with a
    clear, actionable message rather than surfacing later as a silently
    un-suppressable recommendation in production.
    """
    undetectable = find_undetectable_recommendation_names(
        detector_rules, complement_rules, composite_rules
    )
    assert not undetectable, (
        "The following technology names are referenced by "
        "COMPLEMENT_RULES/COMPOSITE_SKILL_RULES but have no corresponding "
        "app.detector.rules.Rule, making any recommendation of them "
        "permanently un-suppressable regardless of what a user's "
        f"repositories actually contain: {sorted(undetectable)}. "
        "Add a detector rule for each name (or remove the reference) "
        "before merging."
    )
