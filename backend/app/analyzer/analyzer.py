import asyncio

from app.detector.detector import detect_technologies
from app.github.client import get_repository_tree, get_user_repositories


async def analyze_user_repositories(username: str) -> dict:
    """
    Retrieve all public repositories for a user, recursively transverse each repository's full file tree, and detect technologies.
    Repositories that are empty (no commits) will have an empty contents and technologies list.
    """
    repos = await get_user_repositories(username)

    github_username = repos[0]["owner"]["login"] if repos else username

    trees = await asyncio.gather(
        *[get_repository_tree(github_username, repo["name"]) for repo in repos]
    )

    repositories = []
    for repo, tree in zip(repos, trees):
        repository = {
            "name": repo["name"],
            "language": repo.get("language"),
            "contents": tree,
        }

        repository["technologies"] = detect_technologies(repository)
        repositories.append(repository)

    return {
        "username": github_username,
        "repository_count": len(repositories),
        "repositories": repositories,
    }
