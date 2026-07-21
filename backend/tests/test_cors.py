"""
Tests for the CORSMiddleware added to support the Portlio frontend
(a separate origin from this API). These check the actual response headers
FastAPI/Starlette produce, not just that the middleware is present.
"""

from unittest.mock import AsyncMock, patch

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

FAKE_REPO = {"name": "myrepo", "language": "Python", "owner": {"login": "octocat"}}
FAKE_TREE = [
    {
        "path": "requirements.txt",
        "name": "requirements.txt",
        "type": "file",
        "size": 20,
    },
]


class TestCORSAllowedOrigin:
    @patch("app.analyzer.analyzer.get_repository_file_contents", new_callable=AsyncMock)
    @patch("app.analyzer.analyzer.get_repository_tree", new_callable=AsyncMock)
    @patch("app.analyzer.analyzer.get_user_repositories", new_callable=AsyncMock)
    def test_allowed_origin_receives_acao_header(
        self, mock_repos, mock_tree, mock_content
    ):
        mock_repos.return_value = [FAKE_REPO]
        mock_tree.return_value = FAKE_TREE

        # http://localhost:3000 is the default in Settings.FRONTEND_ORIGINS,
        # matching the Next.js dev server started by `npm run dev`.
        response = client.get(
            "/analyze/octocat", headers={"Origin": "http://localhost:3000"}
        )

        assert response.status_code == 200
        assert (
            response.headers["access-control-allow-origin"] == "http://localhost:3000"
        )

    def test_preflight_request_is_approved_for_allowed_origin(self):
        response = client.options(
            "/analyze/octocat",
            headers={
                "Origin": "http://localhost:3000",
                "Access-Control-Request-Method": "GET",
            },
        )

        assert response.status_code == 200
        assert (
            response.headers["access-control-allow-origin"] == "http://localhost:3000"
        )


class TestCORSDisallowedOrigin:
    @patch("app.analyzer.analyzer.get_repository_file_contents", new_callable=AsyncMock)
    @patch("app.analyzer.analyzer.get_repository_tree", new_callable=AsyncMock)
    @patch("app.analyzer.analyzer.get_user_repositories", new_callable=AsyncMock)
    def test_unrecognized_origin_receives_no_acao_header(
        self, mock_repos, mock_tree, mock_content
    ):
        mock_repos.return_value = [FAKE_REPO]
        mock_tree.return_value = FAKE_TREE

        # The request itself still succeeds server-side (Starlette's
        # CORSMiddleware doesn't block the request), but without an
        # Access-Control-Allow-Origin header, a real browser refuses to let
        # frontend JS read the response. That's the actual security
        # boundary, so that's what this test checks.
        response = client.get(
            "/analyze/octocat", headers={"Origin": "https://evil.example.com"}
        )

        assert response.status_code == 200
        assert "access-control-allow-origin" not in response.headers

    def test_preflight_request_rejected_for_unrecognized_origin(self):
        response = client.options(
            "/analyze/octocat",
            headers={
                "Origin": "https://evil.example.com",
                "Access-Control-Request-Method": "GET",
            },
        )

        assert "access-control-allow-origin" not in response.headers


class TestCORSMethodRestriction:
    def test_only_get_is_allowed(self):
        response = client.options(
            "/analyze/octocat",
            headers={
                "Origin": "http://localhost:3000",
                "Access-Control-Request-Method": "POST",
            },
        )

        # Every Portlio endpoint is a read; POST was never a supported
        # method here, and CORS shouldn't imply otherwise.
        assert response.status_code == 400
