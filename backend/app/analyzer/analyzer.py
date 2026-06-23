import asyncio

from app.detector.detector import detect_technologies
from app.github.client import get_repository_contents, get_user_repositories


async def analyze_user_repositories(username: str) -> dict:
    """
    Retrieve all public repositories for a user and return their root directory contents
    Repositories that are empty (no commits) will have an empty contents list.
    """
    repos = await get_user_repositories(username)

    github_username = repos[0]["owner"]["login"] if repos else username

    contents = await asyncio.gather(
        *[get_repository_contents(github_username, repo["name"]) for repo in repos]
    )

    repositories = []
    for repo, repo_contents in zip(repos, contents):
        structured_contents = [
            {
                "name": entry["name"],
                "type": entry["type"],
            }
            for entry in repo_contents
        ]

        repository = {
            "name": repo["name"],
            "language": repo.get("language"),
            "contents": structured_contents,
        }

        repository["technologies"] = detect_technologies(repository)
        repositories.append(repository)

    return {
        "username": github_username,
        "repository_count": len(repositories),
        "repositories": repositories,
    }
