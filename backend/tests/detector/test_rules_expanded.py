"""
Integration tests for the massively expanded RULES list.

Mirrors tests/detector/test_rules.py's conventions: each test class covers
one technology with a minimal positive case and a plausible negative case,
exercised through the public detect_technologies() API.

Organized into the same sections as app/detector/rules.py for easy
cross-reference.
"""

from tests.conftest import d, f, repo

from app.detector.detector import detect_technologies


def has(technology: str, repository: dict) -> bool:
    return technology in detect_technologies(repository)


# Python: frameworks, ORMs, task queues


class TestFlask:
    def test_detected_by_dependency(self):
        assert has(
            "Flask",
            repo(
                f("requirements.txt"),
                file_contents={"requirements.txt": "flask==3.0\n"},
            ),
        )

    def test_not_detected_without_dependency(self):
        assert not has(
            "Flask",
            repo(f("requirements.txt"), file_contents={"requirements.txt": "django\n"}),
        )

    def test_not_detected_without_file_contents(self):
        assert not has("Flask", repo(f("requirements.txt")))


class TestDjangoRestFramework:
    def test_detected_by_dependency(self):
        assert has(
            "Django REST Framework",
            repo(
                f("requirements.txt"),
                file_contents={"requirements.txt": "djangorestframework==3.14\n"},
            ),
        )

    def test_not_detected_without_dependency(self):
        assert not has(
            "Django REST Framework",
            repo(f("requirements.txt"), file_contents={"requirements.txt": "django\n"}),
        )


class TestCelery:
    def test_detected_by_dependency(self):
        assert has(
            "Celery",
            repo(
                f("requirements.txt"),
                file_contents={"requirements.txt": "celery==5.3\n"},
            ),
        )

    def test_not_detected_without_dependency(self):
        assert not has(
            "Celery",
            repo(f("requirements.txt"), file_contents={"requirements.txt": "flask\n"}),
        )


class TestScrapy:
    def test_detected_by_dependency(self):
        assert has(
            "Scrapy",
            repo(
                f("requirements.txt"),
                file_contents={"requirements.txt": "scrapy==2.11\n"},
            ),
        )

    def test_not_detected_without_dependency(self):
        assert not has(
            "Scrapy",
            repo(f("requirements.txt"), file_contents={"requirements.txt": "flask\n"}),
        )


class TestStreamlit:
    def test_detected_by_dependency(self):
        assert has(
            "Streamlit",
            repo(
                f("requirements.txt"),
                file_contents={"requirements.txt": "streamlit==1.30\n"},
            ),
        )

    def test_not_detected_without_dependency(self):
        assert not has(
            "Streamlit",
            repo(f("requirements.txt"), file_contents={"requirements.txt": "flask\n"}),
        )


class TestSQLAlchemy:
    def test_detected_by_dependency(self):
        assert has(
            "SQLAlchemy",
            repo(
                f("requirements.txt"),
                file_contents={"requirements.txt": "sqlalchemy==2.0\n"},
            ),
        )

    def test_not_detected_without_dependency(self):
        assert not has(
            "SQLAlchemy",
            repo(f("requirements.txt"), file_contents={"requirements.txt": "flask\n"}),
        )


class TestPytest:
    def test_detected_by_dependency(self):
        assert has(
            "pytest",
            repo(
                f("requirements.txt"),
                file_contents={"requirements.txt": "pytest==7.4\n"},
            ),
        )

    def test_not_detected_without_dependency(self):
        assert not has(
            "pytest",
            repo(f("requirements.txt"), file_contents={"requirements.txt": "flask\n"}),
        )


# Python: static analysis & documentation


class TestRuff:
    def test_detected_by_ruff_toml(self):
        assert has("Ruff", repo(f("ruff.toml")))

    def test_detected_by_pyproject_section(self):
        content = "[tool.ruff]\nline-length = 100\n"
        assert has(
            "Ruff", repo(f("pyproject.toml"), file_contents={"pyproject.toml": content})
        )

    def test_not_detected_without_evidence(self):
        assert not has("Ruff", repo(f("main.py")))


class TestBlack:
    def test_detected_by_pyproject_section(self):
        content = "[tool.black]\nline-length = 88\n"
        assert has(
            "Black",
            repo(f("pyproject.toml"), file_contents={"pyproject.toml": content}),
        )

    def test_not_detected_without_section(self):
        assert not has(
            "Black",
            repo(
                f("pyproject.toml"),
                file_contents={"pyproject.toml": "[build-system]\n"},
            ),
        )

    def test_not_detected_without_file_contents(self):
        assert not has("Black", repo(f("pyproject.toml")))


class TestMypy:
    def test_detected_by_mypy_ini(self):
        assert has("mypy", repo(f("mypy.ini")))

    def test_detected_by_pyproject_section(self):
        content = "[tool.mypy]\nstrict = true\n"
        assert has(
            "mypy", repo(f("pyproject.toml"), file_contents={"pyproject.toml": content})
        )

    def test_not_detected_without_evidence(self):
        assert not has("mypy", repo(f("main.py")))


class TestIsort:
    def test_detected_by_isort_cfg(self):
        assert has("isort", repo(f(".isort.cfg")))

    def test_detected_by_pyproject_section(self):
        content = '[tool.isort]\nprofile = "black"\n'
        assert has(
            "isort",
            repo(f("pyproject.toml"), file_contents={"pyproject.toml": content}),
        )

    def test_not_detected_without_evidence(self):
        assert not has("isort", repo(f("main.py")))


class TestFlake8:
    def test_detected_by_flake8_file(self):
        assert has("Flake8", repo(f(".flake8")))

    def test_not_detected_without_file(self):
        assert not has("Flake8", repo(f("main.py")))


class TestPylint:
    def test_detected_by_pylintrc(self):
        assert has("Pylint", repo(f(".pylintrc")))

    def test_not_detected_without_file(self):
        assert not has("Pylint", repo(f("main.py")))


class TestSphinx:
    def test_detected_by_dependency(self):
        assert has(
            "Sphinx",
            repo(
                f("requirements.txt"),
                file_contents={"requirements.txt": "sphinx==7.2\n"},
            ),
        )

    def test_not_detected_without_dependency(self):
        assert not has(
            "Sphinx",
            repo(f("requirements.txt"), file_contents={"requirements.txt": "flask\n"}),
        )


# JavaScript / TypeScript: frameworks with unique config files


class TestSvelte:
    def test_detected_by_extension(self):
        assert has("Svelte", repo(f("src/App.svelte")))

    def test_not_detected_without_extension(self):
        assert not has("Svelte", repo(f("src/App.vue")))


class TestSvelteKit:
    def test_detected_by_config(self):
        assert has("SvelteKit", repo(f("svelte.config.js")))

    def test_not_detected_without_config(self):
        assert not has("SvelteKit", repo(f("src/App.svelte")))


class TestRemix:
    def test_detected_by_config(self):
        assert has("Remix", repo(f("remix.config.js")))

    def test_not_detected_without_config(self):
        assert not has("Remix", repo(f("package.json")))


class TestGatsby:
    def test_detected_by_config(self):
        assert has("Gatsby", repo(f("gatsby-config.js")))

    def test_not_detected_without_config(self):
        assert not has("Gatsby", repo(f("package.json")))


class TestAstro:
    def test_detected_by_extension(self):
        assert has("Astro", repo(f("src/pages/index.astro")))

    def test_not_detected_without_extension(self):
        assert not has("Astro", repo(f("src/App.vue")))


class TestDeno:
    def test_detected_by_deno_json(self):
        assert has("Deno", repo(f("deno.json")))

    def test_detected_by_deno_jsonc(self):
        assert has("Deno", repo(f("deno.jsonc")))

    def test_not_detected_without_config(self):
        assert not has("Deno", repo(f("package.json")))


# JavaScript / TypeScript: backend frameworks & libraries


class TestExpress:
    def test_detected_by_dependency(self):
        content = '{"dependencies": {"express": "^4.18.0"}}'
        assert has(
            "Express", repo(f("package.json"), file_contents={"package.json": content})
        )

    def test_not_detected_without_dependency(self):
        content = '{"dependencies": {"react": "^18.0.0"}}'
        assert not has(
            "Express", repo(f("package.json"), file_contents={"package.json": content})
        )


class TestNestJS:
    def test_detected_by_scoped_dependency(self):
        content = '{"dependencies": {"@nestjs/core": "^10.0.0"}}'
        assert has(
            "NestJS", repo(f("package.json"), file_contents={"package.json": content})
        )

    def test_not_detected_without_dependency(self):
        content = '{"dependencies": {"express": "^4.18.0"}}'
        assert not has(
            "NestJS", repo(f("package.json"), file_contents={"package.json": content})
        )


class TestRedux:
    def test_detected_by_dependency(self):
        content = '{"dependencies": {"redux": "^4.2.0"}}'
        assert has(
            "Redux", repo(f("package.json"), file_contents={"package.json": content})
        )

    def test_not_detected_without_dependency(self):
        content = '{"dependencies": {"react": "^18.0.0"}}'
        assert not has(
            "Redux", repo(f("package.json"), file_contents={"package.json": content})
        )


class TestGraphQL:
    def test_detected_by_dependency(self):
        content = '{"dependencies": {"graphql": "^16.8.0"}}'
        assert has(
            "GraphQL", repo(f("package.json"), file_contents={"package.json": content})
        )

    def test_not_detected_without_dependency(self):
        content = '{"dependencies": {"express": "^4.18.0"}}'
        assert not has(
            "GraphQL", repo(f("package.json"), file_contents={"package.json": content})
        )


# JavaScript / TypeScript: testing frameworks


class TestJest:
    def test_detected_by_dependency(self):
        content = '{"devDependencies": {"jest": "^29.0.0"}}'
        assert has(
            "Jest", repo(f("package.json"), file_contents={"package.json": content})
        )

    def test_not_detected_without_dependency(self):
        content = '{"devDependencies": {"mocha": "^10.0.0"}}'
        assert not has(
            "Jest", repo(f("package.json"), file_contents={"package.json": content})
        )


class TestMocha:
    def test_detected_by_dependency(self):
        content = '{"devDependencies": {"mocha": "^10.0.0"}}'
        assert has(
            "Mocha", repo(f("package.json"), file_contents={"package.json": content})
        )

    def test_not_detected_without_dependency(self):
        content = '{"devDependencies": {"jest": "^29.0.0"}}'
        assert not has(
            "Mocha", repo(f("package.json"), file_contents={"package.json": content})
        )


class TestCypress:
    def test_detected_by_dependency(self):
        content = '{"devDependencies": {"cypress": "^13.0.0"}}'
        assert has(
            "Cypress", repo(f("package.json"), file_contents={"package.json": content})
        )

    def test_not_detected_without_dependency(self):
        content = '{"devDependencies": {"jest": "^29.0.0"}}'
        assert not has(
            "Cypress", repo(f("package.json"), file_contents={"package.json": content})
        )


class TestPlaywright:
    def test_detected_by_playwright_package(self):
        content = '{"dependencies": {"playwright": "^1.40.0"}}'
        assert has(
            "Playwright",
            repo(f("package.json"), file_contents={"package.json": content}),
        )

    def test_detected_by_scoped_test_package(self):
        content = '{"devDependencies": {"@playwright/test": "^1.40.0"}}'
        assert has(
            "Playwright",
            repo(f("package.json"), file_contents={"package.json": content}),
        )

    def test_not_detected_without_dependency(self):
        content = '{"devDependencies": {"jest": "^29.0.0"}}'
        assert not has(
            "Playwright",
            repo(f("package.json"), file_contents={"package.json": content}),
        )


class TestVitest:
    def test_detected_by_dependency(self):
        content = '{"devDependencies": {"vitest": "^1.0.0"}}'
        assert has(
            "Vitest", repo(f("package.json"), file_contents={"package.json": content})
        )

    def test_not_detected_without_dependency(self):
        content = '{"devDependencies": {"jest": "^29.0.0"}}'
        assert not has(
            "Vitest", repo(f("package.json"), file_contents={"package.json": content})
        )


# Monorepo tooling & JS/general static analysis


class TestNpmYarnWorkspaces:
    def test_detected_by_workspaces_key(self):
        content = '{"name": "monorepo", "workspaces": ["packages/*"]}'
        assert has(
            "npm/Yarn Workspaces",
            repo(f("package.json"), file_contents={"package.json": content}),
        )

    def test_not_detected_without_workspaces_key(self):
        content = '{"name": "app"}'
        assert not has(
            "npm/Yarn Workspaces",
            repo(f("package.json"), file_contents={"package.json": content}),
        )

    def test_not_detected_without_file_contents(self):
        assert not has("npm/Yarn Workspaces", repo(f("package.json")))


class TestNx:
    def test_detected_by_nx_json(self):
        assert has("Nx", repo(f("nx.json")))

    def test_not_detected_without_file(self):
        assert not has("Nx", repo(f("package.json")))


class TestTurborepo:
    def test_detected_by_turbo_json(self):
        assert has("Turborepo", repo(f("turbo.json")))

    def test_not_detected_without_file(self):
        assert not has("Turborepo", repo(f("package.json")))


class TestLerna:
    def test_detected_by_lerna_json(self):
        assert has("Lerna", repo(f("lerna.json")))

    def test_not_detected_without_file(self):
        assert not has("Lerna", repo(f("package.json")))


class TestRush:
    def test_detected_by_rush_json(self):
        assert has("Rush", repo(f("rush.json")))

    def test_not_detected_without_file(self):
        assert not has("Rush", repo(f("package.json")))


class TestESLint:
    def test_detected_by_legacy_dotfile(self):
        assert has("ESLint", repo(f(".eslintrc.json")))

    def test_detected_by_flat_config(self):
        assert has("ESLint", repo(f("eslint.config.js")))

    def test_not_detected_without_config(self):
        assert not has("ESLint", repo(f("package.json")))


class TestPrettier:
    def test_detected_by_dotfile(self):
        assert has("Prettier", repo(f(".prettierrc.json")))

    def test_detected_by_config_file(self):
        assert has("Prettier", repo(f("prettier.config.js")))

    def test_not_detected_without_config(self):
        assert not has("Prettier", repo(f("package.json")))


class TestStylelint:
    def test_detected_by_dotfile(self):
        assert has("Stylelint", repo(f(".stylelintrc.json")))

    def test_not_detected_without_config(self):
        assert not has("Stylelint", repo(f("style.css")))


# JS package manager lockfiles


class TestYarn:
    def test_detected_by_lockfile(self):
        assert has("Yarn", repo(f("yarn.lock")))

    def test_not_detected_without_lockfile(self):
        assert not has("Yarn", repo(f("package.json")))


class TestNpm:
    def test_detected_by_lockfile(self):
        assert has("npm", repo(f("package-lock.json")))

    def test_not_detected_without_lockfile(self):
        assert not has("npm", repo(f("package.json")))


class TestPnpm:
    def test_detected_by_lockfile(self):
        assert has("pnpm", repo(f("pnpm-lock.yaml")))

    def test_not_detected_without_lockfile(self):
        assert not has("pnpm", repo(f("package.json")))


class TestBun:
    def test_detected_by_binary_lockfile(self):
        assert has("Bun", repo(f("bun.lockb")))

    def test_detected_by_text_lockfile(self):
        assert has("Bun", repo(f("bun.lock")))

    def test_not_detected_without_lockfile(self):
        assert not has("Bun", repo(f("package.json")))


# Java / JVM: frameworks & testing (content-marker based)


class TestJUnit:
    def test_detected_in_pom_xml(self):
        content = "<dependency><groupId>junit</groupId><artifactId>junit</artifactId></dependency>"
        assert has("JUnit", repo(f("pom.xml"), file_contents={"pom.xml": content}))

    def test_detected_in_build_gradle(self):
        content = 'testImplementation "junit:junit:4.13.2"'
        assert has(
            "JUnit", repo(f("build.gradle"), file_contents={"build.gradle": content})
        )

    def test_not_detected_without_marker(self):
        assert not has(
            "JUnit",
            repo(f("pom.xml"), file_contents={"pom.xml": "<project></project>"}),
        )

    def test_not_detected_without_file_contents(self):
        assert not has("JUnit", repo(f("pom.xml")))


class TestQuarkus:
    def test_detected_in_pom_xml(self):
        content = "<artifactId>quarkus-resteasy</artifactId>"
        assert has("Quarkus", repo(f("pom.xml"), file_contents={"pom.xml": content}))

    def test_not_detected_without_marker(self):
        assert not has(
            "Quarkus",
            repo(f("pom.xml"), file_contents={"pom.xml": "<project></project>"}),
        )


class TestMicronaut:
    def test_detected_in_build_gradle_kts(self):
        content = 'implementation("io.micronaut:micronaut-http-server")'
        assert has(
            "Micronaut",
            repo(f("build.gradle.kts"), file_contents={"build.gradle.kts": content}),
        )

    def test_not_detected_without_marker(self):
        assert not has(
            "Micronaut",
            repo(
                f("build.gradle.kts"), file_contents={"build.gradle.kts": "plugins {}"}
            ),
        )


class TestCheckstyle:
    def test_detected_by_config_file(self):
        assert has("Checkstyle", repo(f("checkstyle.xml")))

    def test_not_detected_without_config(self):
        assert not has("Checkstyle", repo(f("pom.xml")))


# C / C++: package managers and alternative build systems


class TestConan:
    def test_detected_by_conanfile_txt(self):
        assert has("Conan", repo(f("conanfile.txt")))

    def test_detected_by_conanfile_py(self):
        assert has("Conan", repo(f("conanfile.py")))

    def test_not_detected_without_file(self):
        assert not has("Conan", repo(f("CMakeLists.txt")))


class TestVcpkg:
    def test_detected_by_vcpkg_json(self):
        assert has("vcpkg", repo(f("vcpkg.json")))

    def test_not_detected_without_file(self):
        assert not has("vcpkg", repo(f("CMakeLists.txt")))


class TestBazel:
    def test_detected_by_workspace(self):
        assert has("Bazel", repo(f("WORKSPACE")))

    def test_detected_by_workspace_bazel(self):
        assert has("Bazel", repo(f("WORKSPACE.bazel")))

    def test_detected_by_build_bazel(self):
        assert has("Bazel", repo(f("BUILD.bazel")))

    def test_not_detected_without_file(self):
        assert not has("Bazel", repo(f("CMakeLists.txt")))


class TestNinja:
    def test_detected_by_build_ninja(self):
        assert has("Ninja", repo(f("build.ninja")))

    def test_not_detected_without_file(self):
        assert not has("Ninja", repo(f("CMakeLists.txt")))


class TestMeson:
    def test_detected_by_meson_build(self):
        assert has("Meson", repo(f("meson.build")))

    def test_not_detected_without_file(self):
        assert not has("Meson", repo(f("CMakeLists.txt")))


# Embedded / IoT


class TestZephyrRTOS:
    def test_detected_by_west_yml(self):
        assert has("Zephyr RTOS", repo(f("west.yml")))

    def test_not_detected_without_file(self):
        assert not has("Zephyr RTOS", repo(f("platformio.ini")))


class TestMbedOS:
    def test_detected_by_mbed_app_json(self):
        assert has("Mbed OS", repo(f("mbed_app.json")))

    def test_not_detected_without_file(self):
        assert not has("Mbed OS", repo(f("platformio.ini")))


# DevOps: provisioning & configuration management


class TestVagrant:
    def test_detected_by_vagrantfile(self):
        assert has("Vagrant", repo(f("Vagrantfile")))

    def test_not_detected_without_file(self):
        assert not has("Vagrant", repo(f("main.tf")))


class TestPacker:
    def test_detected_by_pkr_hcl_extension(self):
        assert has("Packer", repo(f("template.pkr.hcl")))

    def test_not_detected_by_plain_hcl(self):
        # Confirms the fix: a generic .hcl file (e.g. a Terraform file
        # someone renamed) must not trigger Packer detection.
        assert not has("Packer", repo(f("main.hcl")))

    def test_not_detected_without_file(self):
        assert not has("Packer", repo(f("main.tf")))


class TestPuppet:
    def test_detected_by_puppetfile(self):
        assert has("Puppet", repo(f("Puppetfile")))

    def test_not_detected_without_file(self):
        assert not has("Puppet", repo(f("main.tf")))


class TestChef:
    def test_detected_by_metadata_rb(self):
        assert has("Chef", repo(f("metadata.rb")))

    def test_not_detected_without_file(self):
        assert not has("Chef", repo(f("main.tf")))


# Cloud: IaC and serverless frameworks


class TestPulumi:
    def test_detected_by_pulumi_yaml(self):
        assert has("Pulumi", repo(f("Pulumi.yaml")))

    def test_not_detected_without_file(self):
        assert not has("Pulumi", repo(f("main.tf")))


class TestAWSCDK:
    def test_detected_by_cdk_json(self):
        assert has("AWS CDK", repo(f("cdk.json")))

    def test_not_detected_without_file(self):
        assert not has("AWS CDK", repo(f("main.tf")))


class TestServerlessFramework:
    def test_detected_by_serverless_yml(self):
        assert has("Serverless Framework", repo(f("serverless.yml")))

    def test_not_detected_without_file(self):
        assert not has("Serverless Framework", repo(f("main.tf")))


class TestAWSSAM:
    def test_detected_by_samconfig_toml(self):
        assert has("AWS SAM", repo(f("samconfig.toml")))

    def test_not_detected_without_file(self):
        assert not has("AWS SAM", repo(f("main.tf")))


class TestGoogleCloudBuild:
    def test_detected_by_cloudbuild_yaml(self):
        assert has("Google Cloud Build", repo(f("cloudbuild.yaml")))

    def test_not_detected_without_file(self):
        assert not has("Google Cloud Build", repo(f("main.tf")))


class TestAzureBicep:
    def test_detected_by_extension(self):
        assert has("Azure Bicep", repo(f("main.bicep")))

    def test_not_detected_without_extension(self):
        assert not has("Azure Bicep", repo(f("main.tf")))


# Databases & ORMs


class TestFlyway:
    def test_detected_by_flyway_conf(self):
        assert has("Flyway", repo(f("flyway.conf")))

    def test_detected_by_flyway_toml(self):
        assert has("Flyway", repo(f("flyway.toml")))

    def test_not_detected_without_file(self):
        assert not has("Flyway", repo(f("pom.xml")))


class TestLiquibase:
    def test_detected_by_properties_file(self):
        assert has("Liquibase", repo(f("liquibase.properties")))

    def test_not_detected_without_file(self):
        assert not has("Liquibase", repo(f("pom.xml")))


class TestTypeORM:
    def test_detected_by_dependency(self):
        content = '{"dependencies": {"typeorm": "^0.3.0"}}'
        assert has(
            "TypeORM", repo(f("package.json"), file_contents={"package.json": content})
        )

    def test_not_detected_without_dependency(self):
        content = '{"dependencies": {"express": "^4.18.0"}}'
        assert not has(
            "TypeORM", repo(f("package.json"), file_contents={"package.json": content})
        )


class TestSequelize:
    def test_detected_by_dependency(self):
        content = '{"dependencies": {"sequelize": "^6.35.0"}}'
        assert has(
            "Sequelize",
            repo(f("package.json"), file_contents={"package.json": content}),
        )

    def test_not_detected_without_dependency(self):
        content = '{"dependencies": {"express": "^4.18.0"}}'
        assert not has(
            "Sequelize",
            repo(f("package.json"), file_contents={"package.json": content}),
        )


class TestMongoose:
    def test_detected_by_dependency(self):
        content = '{"dependencies": {"mongoose": "^8.0.0"}}'
        assert has(
            "Mongoose", repo(f("package.json"), file_contents={"package.json": content})
        )

    def test_not_detected_without_dependency(self):
        content = '{"dependencies": {"express": "^4.18.0"}}'
        assert not has(
            "Mongoose", repo(f("package.json"), file_contents={"package.json": content})
        )


class TestPrismaORM:
    def test_detected_by_scoped_dependency(self):
        content = '{"dependencies": {"@prisma/client": "^5.0.0"}}'
        assert has(
            "Prisma ORM",
            repo(f("package.json"), file_contents={"package.json": content}),
        )

    def test_not_detected_without_dependency(self):
        content = '{"dependencies": {"express": "^4.18.0"}}'
        assert not has(
            "Prisma ORM",
            repo(f("package.json"), file_contents={"package.json": content}),
        )


# ML / AI


class TestTensorFlow:
    def test_detected_by_dependency(self):
        assert has(
            "TensorFlow",
            repo(
                f("requirements.txt"),
                file_contents={"requirements.txt": "tensorflow==2.15\n"},
            ),
        )

    def test_not_detected_without_dependency(self):
        assert not has(
            "TensorFlow",
            repo(f("requirements.txt"), file_contents={"requirements.txt": "flask\n"}),
        )


class TestPyTorch:
    def test_detected_by_dependency(self):
        assert has(
            "PyTorch",
            repo(
                f("requirements.txt"),
                file_contents={"requirements.txt": "torch==2.1\n"},
            ),
        )

    def test_not_detected_without_dependency(self):
        assert not has(
            "PyTorch",
            repo(f("requirements.txt"), file_contents={"requirements.txt": "flask\n"}),
        )


class TestScikitLearn:
    def test_detected_by_dependency(self):
        assert has(
            "scikit-learn",
            repo(
                f("requirements.txt"),
                file_contents={"requirements.txt": "scikit-learn==1.4\n"},
            ),
        )

    def test_not_detected_without_dependency(self):
        assert not has(
            "scikit-learn",
            repo(f("requirements.txt"), file_contents={"requirements.txt": "flask\n"}),
        )


class TestKeras:
    def test_detected_by_dependency(self):
        assert has(
            "Keras",
            repo(
                f("requirements.txt"),
                file_contents={"requirements.txt": "keras==3.0\n"},
            ),
        )

    def test_not_detected_without_dependency(self):
        assert not has(
            "Keras",
            repo(f("requirements.txt"), file_contents={"requirements.txt": "flask\n"}),
        )


class TestXGBoost:
    def test_detected_by_dependency(self):
        assert has(
            "XGBoost",
            repo(
                f("requirements.txt"),
                file_contents={"requirements.txt": "xgboost==2.0\n"},
            ),
        )

    def test_not_detected_without_dependency(self):
        assert not has(
            "XGBoost",
            repo(f("requirements.txt"), file_contents={"requirements.txt": "flask\n"}),
        )


class TestLangChain:
    def test_detected_by_dependency(self):
        assert has(
            "LangChain",
            repo(
                f("requirements.txt"),
                file_contents={"requirements.txt": "langchain==0.1\n"},
            ),
        )

    def test_not_detected_without_dependency(self):
        assert not has(
            "LangChain",
            repo(f("requirements.txt"), file_contents={"requirements.txt": "flask\n"}),
        )


class TestHuggingFaceTransformers:
    def test_detected_by_dependency(self):
        assert has(
            "Hugging Face Transformers",
            repo(
                f("requirements.txt"),
                file_contents={"requirements.txt": "transformers==4.36\n"},
            ),
        )

    def test_not_detected_without_dependency(self):
        assert not has(
            "Hugging Face Transformers",
            repo(f("requirements.txt"), file_contents={"requirements.txt": "flask\n"}),
        )


class TestOpenAISDK:
    def test_detected_by_dependency(self):
        assert has(
            "OpenAI SDK",
            repo(
                f("requirements.txt"),
                file_contents={"requirements.txt": "openai==1.6\n"},
            ),
        )

    def test_not_detected_without_dependency(self):
        assert not has(
            "OpenAI SDK",
            repo(f("requirements.txt"), file_contents={"requirements.txt": "flask\n"}),
        )


# Data Science


class TestPandas:
    def test_detected_by_dependency(self):
        assert has(
            "pandas",
            repo(
                f("requirements.txt"),
                file_contents={"requirements.txt": "pandas==2.1\n"},
            ),
        )

    def test_not_detected_without_dependency(self):
        assert not has(
            "pandas",
            repo(f("requirements.txt"), file_contents={"requirements.txt": "flask\n"}),
        )


class TestNumPy:
    def test_detected_by_dependency(self):
        assert has(
            "NumPy",
            repo(
                f("requirements.txt"),
                file_contents={"requirements.txt": "numpy==1.26\n"},
            ),
        )

    def test_not_detected_without_dependency(self):
        assert not has(
            "NumPy",
            repo(f("requirements.txt"), file_contents={"requirements.txt": "flask\n"}),
        )


class TestMatplotlib:
    def test_detected_by_dependency(self):
        assert has(
            "Matplotlib",
            repo(
                f("requirements.txt"),
                file_contents={"requirements.txt": "matplotlib==3.8\n"},
            ),
        )

    def test_not_detected_without_dependency(self):
        assert not has(
            "Matplotlib",
            repo(f("requirements.txt"), file_contents={"requirements.txt": "flask\n"}),
        )


class TestR:
    def test_detected_by_extension(self):
        assert has("R", repo(f("analysis.r")))

    def test_not_detected_without_extension(self):
        assert not has("R", repo(f("main.py")))


class TestRMarkdown:
    def test_detected_by_extension(self):
        assert has("R Markdown", repo(f("report.rmd")))

    def test_not_detected_without_extension(self):
        assert not has("R Markdown", repo(f("analysis.r")))


# Documentation tools


class TestMkDocs:
    def test_detected_by_mkdocs_yml(self):
        assert has("MkDocs", repo(f("mkdocs.yml")))

    def test_not_detected_without_file(self):
        assert not has("MkDocs", repo(f("README.md")))


class TestDocusaurus:
    def test_detected_by_config(self):
        assert has("Docusaurus", repo(f("docusaurus.config.js")))

    def test_not_detected_without_config(self):
        assert not has("Docusaurus", repo(f("README.md")))


class TestReadTheDocs:
    def test_detected_by_config(self):
        assert has("Read the Docs", repo(f(".readthedocs.yaml")))

    def test_not_detected_without_config(self):
        assert not has("Read the Docs", repo(f("README.md")))


# Cloud / Containers: additional orchestration tooling


class TestSkaffold:
    def test_detected_by_skaffold_yaml(self):
        assert has("Skaffold", repo(f("skaffold.yaml")))

    def test_not_detected_without_file(self):
        assert not has("Skaffold", repo(f("Dockerfile")))


class TestKustomize:
    def test_detected_by_kustomization_yaml(self):
        assert has("Kustomize", repo(f("kustomization.yaml")))

    def test_not_detected_without_file(self):
        assert not has("Kustomize", repo(f("Dockerfile")))


# CI/CD: additional providers


class TestBuildkite:
    def test_detected_by_directory(self):
        assert has("Buildkite", repo(d(".buildkite")))

    def test_not_detected_without_directory(self):
        assert not has("Buildkite", repo(f(".travis.yml")))


class TestDroneCI:
    def test_detected_by_drone_yml(self):
        assert has("Drone CI", repo(f(".drone.yml")))

    def test_not_detected_without_file(self):
        assert not has("Drone CI", repo(f(".travis.yml")))


class TestBitbucketPipelines:
    def test_detected_by_config(self):
        assert has("Bitbucket Pipelines", repo(f("bitbucket-pipelines.yml")))

    def test_not_detected_without_config(self):
        assert not has("Bitbucket Pipelines", repo(f(".travis.yml")))


# Mobile: additional platforms & package managers


class TestXcodeProject:
    def test_detected_by_pbxproj_inside_any_bundle_name(self):
        assert has("Xcode Project", repo(f("MyApp.xcodeproj/project.pbxproj")))

    def test_not_detected_without_pbxproj(self):
        assert not has("Xcode Project", repo(f("main.swift")))


class TestCocoaPods:
    def test_detected_by_podfile(self):
        assert has("CocoaPods", repo(f("Podfile")))

    def test_not_detected_without_file(self):
        assert not has("CocoaPods", repo(f("main.swift")))


class TestSwiftPackageManager:
    def test_detected_by_package_swift(self):
        assert has("Swift Package Manager", repo(f("Package.swift")))

    def test_not_detected_without_file(self):
        assert not has("Swift Package Manager", repo(f("main.swift")))


class TestIonic:
    def test_detected_by_config(self):
        assert has("Ionic", repo(f("ionic.config.json")))

    def test_not_detected_without_config(self):
        assert not has("Ionic", repo(f("package.json")))


class TestNuGet:
    def test_detected_by_nuget_config(self):
        assert has("NuGet", repo(f("nuget.config")))

    def test_detected_by_packages_config(self):
        assert has("NuGet", repo(f("packages.config")))

    def test_not_detected_without_file(self):
        assert not has("NuGet", repo(f("app.csproj")))


# PHP: frameworks


class TestSymfony:
    def test_detected_by_dependency(self):
        content = '{"require": {"symfony/framework-bundle": "^6.4"}}'
        assert has(
            "Symfony",
            repo(f("composer.json"), file_contents={"composer.json": content}),
        )

    def test_not_detected_without_dependency(self):
        content = '{"require": {"laravel/framework": "^10.0"}}'
        assert not has(
            "Symfony",
            repo(f("composer.json"), file_contents={"composer.json": content}),
        )


class TestDrupal:
    def test_detected_by_dependency(self):
        content = '{"require": {"drupal/core": "^10.2"}}'
        assert has(
            "Drupal", repo(f("composer.json"), file_contents={"composer.json": content})
        )

    def test_not_detected_without_dependency(self):
        content = '{"require": {"laravel/framework": "^10.0"}}'
        assert not has(
            "Drupal", repo(f("composer.json"), file_contents={"composer.json": content})
        )


class TestWordPress:
    def test_detected_by_wp_config(self):
        assert has("WordPress", repo(f("wp-config.php")))

    def test_detected_by_wp_config_sample(self):
        assert has("WordPress", repo(f("wp-config-sample.php")))

    def test_not_detected_without_file(self):
        assert not has("WordPress", repo(f("index.php")))


class TestPHPUnit:
    def test_detected_by_dependency(self):
        content = '{"require-dev": {"phpunit/phpunit": "^10.5"}}'
        assert has(
            "PHPUnit",
            repo(f("composer.json"), file_contents={"composer.json": content}),
        )

    def test_not_detected_without_dependency(self):
        content = '{"require": {"laravel/framework": "^10.0"}}'
        assert not has(
            "PHPUnit",
            repo(f("composer.json"), file_contents={"composer.json": content}),
        )


# Ruby: frameworks & testing


class TestSinatra:
    def test_detected_by_dependency(self):
        assert has(
            "Sinatra", repo(f("Gemfile"), file_contents={"Gemfile": 'gem "sinatra"\n'})
        )

    def test_not_detected_without_dependency(self):
        assert not has(
            "Sinatra", repo(f("Gemfile"), file_contents={"Gemfile": 'gem "rails"\n'})
        )


class TestRSpec:
    def test_detected_by_dependency(self):
        assert has(
            "RSpec", repo(f("Gemfile"), file_contents={"Gemfile": 'gem "rspec"\n'})
        )

    def test_not_detected_without_dependency(self):
        assert not has(
            "RSpec", repo(f("Gemfile"), file_contents={"Gemfile": 'gem "rails"\n'})
        )


# Go: frameworks & ORMs


class TestGin:
    def test_detected_by_dependency(self):
        content = "require github.com/gin-gonic/gin v1.9.1\n"
        assert has("Gin", repo(f("go.mod"), file_contents={"go.mod": content}))

    def test_not_detected_without_dependency(self):
        content = "require github.com/labstack/echo/v4 v4.11.4\n"
        assert not has("Gin", repo(f("go.mod"), file_contents={"go.mod": content}))


class TestEcho:
    def test_detected_by_dependency_with_version_suffix(self):
        content = "require github.com/labstack/echo/v4 v4.11.4\n"
        assert has("Echo", repo(f("go.mod"), file_contents={"go.mod": content}))

    def test_not_detected_without_dependency(self):
        content = "require github.com/gin-gonic/gin v1.9.1\n"
        assert not has("Echo", repo(f("go.mod"), file_contents={"go.mod": content}))


class TestFiber:
    def test_detected_by_dependency_with_version_suffix(self):
        content = "require github.com/gofiber/fiber/v2 v2.50.0\n"
        assert has("Fiber", repo(f("go.mod"), file_contents={"go.mod": content}))

    def test_not_detected_without_dependency(self):
        content = "require github.com/gin-gonic/gin v1.9.1\n"
        assert not has("Fiber", repo(f("go.mod"), file_contents={"go.mod": content}))


class TestGORM:
    def test_detected_by_dependency(self):
        content = "require gorm.io/gorm v1.25.5\n"
        assert has("GORM", repo(f("go.mod"), file_contents={"go.mod": content}))

    def test_not_detected_without_dependency(self):
        content = "require github.com/gin-gonic/gin v1.9.1\n"
        assert not has("GORM", repo(f("go.mod"), file_contents={"go.mod": content}))


# Rust: frameworks & libraries


class TestActixWeb:
    def test_detected_by_dependency(self):
        content = '[dependencies]\nactix-web = "4"\n'
        assert has(
            "Actix Web", repo(f("Cargo.toml"), file_contents={"Cargo.toml": content})
        )

    def test_not_detected_without_dependency(self):
        content = '[dependencies]\nserde = "1.0"\n'
        assert not has(
            "Actix Web", repo(f("Cargo.toml"), file_contents={"Cargo.toml": content})
        )


class TestRocket:
    def test_detected_by_dependency(self):
        content = '[dependencies]\nrocket = "0.5"\n'
        assert has(
            "Rocket", repo(f("Cargo.toml"), file_contents={"Cargo.toml": content})
        )

    def test_not_detected_without_dependency(self):
        content = '[dependencies]\nserde = "1.0"\n'
        assert not has(
            "Rocket", repo(f("Cargo.toml"), file_contents={"Cargo.toml": content})
        )


class TestTokio:
    def test_detected_by_dependency(self):
        content = '[dependencies]\ntokio = "1"\n'
        assert has(
            "Tokio", repo(f("Cargo.toml"), file_contents={"Cargo.toml": content})
        )

    def test_not_detected_without_dependency(self):
        content = '[dependencies]\nserde = "1.0"\n'
        assert not has(
            "Tokio", repo(f("Cargo.toml"), file_contents={"Cargo.toml": content})
        )


class TestSerde:
    def test_detected_by_dependency(self):
        content = '[dependencies]\nserde = "1.0"\n'
        assert has(
            "Serde", repo(f("Cargo.toml"), file_contents={"Cargo.toml": content})
        )

    def test_not_detected_without_dependency(self):
        content = '[dependencies]\ntokio = "1"\n'
        assert not has(
            "Serde", repo(f("Cargo.toml"), file_contents={"Cargo.toml": content})
        )


class TestDiesel:
    def test_detected_by_dependency(self):
        content = '[dependencies]\ndiesel = "2.1"\n'
        assert has(
            "Diesel", repo(f("Cargo.toml"), file_contents={"Cargo.toml": content})
        )

    def test_not_detected_without_dependency(self):
        content = '[dependencies]\ntokio = "1"\n'
        assert not has(
            "Diesel", repo(f("Cargo.toml"), file_contents={"Cargo.toml": content})
        )
