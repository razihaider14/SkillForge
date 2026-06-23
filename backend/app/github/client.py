import httpx

from app.config import settings

BASE_URL = "https://api.github.com"
GITHUB_TIMEOUT = 10.0

_TREE_TYPE_MAP = {"blob": "file", "tree": "dir"}


class GitHubUserNotFoundError(Exception):
    """Raised when the requested GitHub user doesn't exist."""


class GitHubRateLimitError(Exception):
    """Raised when the GitHub API rate limit has been exceeded."""


class GitHubAPIError(Exception):
    """Raised when GitHun returns an unexpected error response."""


def _build_headers() -> dict:
    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "SkillForge-App",
    }
    if settings.GITHUB_TOKEN:
        headers["Authorization"] = f"Bearer {settings.GITHUB_TOKEN}"
    return headers


def _handle_error_response(response: httpx.Response) -> None:
    """Raise the appropriate exception for a non-2xx GitHub response."""
    if response.status_code == 403:
        data = response.json()
        if "rate limit" in data.get("message", "").lower():
            raise GitHubRateLimitError()
        raise GitHubAPIError(data.get("message", "Forbidden"))

    if response.is_error:
        raise GitHubAPIError(f"GitHub API returned {response.status_code}")


async def get_user_repositories(username: str) -> list[dict]:
    """
    Fetch the public repositories of a GitHub user.
    Raises:
    GitHubUserNotFoundError: if the user does not exist (404)
    GitHubRateLimitError: if the rate limit has been exceeded (403)
    GitHubAPIError: for any other unexpected error response.
    """
    url = f"{BASE_URL}/users/{username}/repos"

    async with httpx.AsyncClient(timeout=GITHUB_TIMEOUT) as client:
        response = await client.get(
            url,
            params={"per_page": 100},
            headers=_build_headers(),
        )

    if response.status_code == 404:
        raise GitHubUserNotFoundError(username)

    _handle_error_response(response)
    return response.json()


async def get_repository_tree(owner: str, repo: str) -> list[dict]:
    """
    Fetch the complete file tree of a repo in a single API call using Git Trees API with recursive = 1.
    Each returned entry contains:
    "path": full relative path from the repo root (e.g "src/main.py")
    "name": the final path component (e.g "main.py")
    "type": "file" (blob) or "dir" (tree)
    Returns an empty list if the repository is empty (no commits yet).
    If GitHub truncates the tree (> 100,000 entries), the partial result is returned as-is.
    Raises:
    GitHubRateLimitError: if the rate limit has been exceeded (403).
    GitHubAPIError: for any other unexpected error response.
    """
    url = f"{BASE_URL}/repos/{owner}/{repo}/git/trees/HEAD"

    async with httpx.AsyncClient(timeout=GITHUB_TIMEOUT) as client:
        response = await client.get(
            url,
            params={"recursive": "1"},
            headers=_build_headers(),
        )

    # Empty repositories (no commits) return 404 on the contents endpoint
    if response.status_code == 404:
        return []

    _handle_error_response(response)

    data = response.json()

    if data.get("truncated"):
        raise GitHubAPIError(f"Repository tree for '{repo}' is too large to analyze.")

    return [
        {
            "path": entry["path"],
            "name": entry["path"].split("/")[-1],
            "type": _TREE_TYPE_MAP.get(entry["type"], entry["type"]),
        }
        for entry in data.get("tree", [])
    ]
