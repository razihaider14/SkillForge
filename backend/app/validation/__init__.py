"""
Cross-subsystem consistency checks.

Lives outside app.detector and app.aggregator deliberately: it needs to read
from both (detector's rule table, aggregator's recommendation/composite rule
tables) without either subsystem needing to know the other is being
validated, and without introducing a reverse import edge (app.aggregator
already imports app.detector.models; app.detector must never import
anything from app.aggregator).
"""
