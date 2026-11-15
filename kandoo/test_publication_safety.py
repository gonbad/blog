"""Regressions for V9.5 F13–F17 using real builds and disposable artifacts."""
import hashlib
import json
import shutil
import tempfile
import unittest
import zipfile
from pathlib import Path
from unittest.mock import patch

from deploy import create_archive
from publisher import PROJECT_OUTPUT_MANIFEST, build, check_release, markdown_fields


def inventory(root):
    return {p.relative_to(root).as_posix(): p.read_bytes()
            for p in root.rglob('*') if p.is_file()}


class PublicationSafety(unittest.TestCase):
    def setUp(self):
        temporary = tempfile.TemporaryDirectory(prefix='journal-safety-')
        self.addCleanup(temporary.cleanup)
        self.root = Path(temporary.name) / 'ژورنال با فاصله'
        settings = self.root / 'docs/kandoo/living/publication.md'
        settings.parent.mkdir(parents=True)
        settings.write_text('# Publication\n\n- Origin: https://example.invalid\n')
        for identifier, kind, content in (
            ('000-index', 'index', '<a href="001-post/">Post</a>'),
            ('001-post', 'post', '<h1>Original edition</h1>'),
        ):
            source = self.root / 'projects' / identifier / 'src'
            source.mkdir(parents=True)
            (source / 'index.html').write_text('<!doctype html><html><body>'+content+'</body></html>')
            contract = self.root / 'docs/projects' / identifier / 'living/publication.md'
            contract.parent.mkdir(parents=True)
            contract.write_text(f'- Kind: {kind}\n- Source: src\n- Version: 0.1\n- Publish: yes\n')

    def contract(self, identifier='001-post'):
        return self.root / 'docs/projects' / identifier / 'living/publication.md'

    def test_protected_output_is_rejected_without_mutation(self):
        build(self.root)
        before = inventory(self.root)
        with self.assertRaises(ValueError):
            build(self.root, self.root / 'docs')
        self.assertEqual(inventory(self.root), before)

    def test_source_host_git_and_nested_output_paths_are_protected(self):
        build(self.root)
        for name in ('docs/new-output', 'kandoo', '.git', '.claude', '.agents',
                     '.opencode', 'projects/001-post/dist', 'dist/nested',
                     '.publication-history/other'):
            with self.subTest(output=name):
                before = inventory(self.root)
                with self.assertRaises(ValueError):
                    build(self.root, self.root / name)
                self.assertEqual(inventory(self.root), before)

    def test_nonempty_custom_directory_and_project_dist_are_not_adopted(self):
        custom = self.root.parent / 'personal folder'
        custom.mkdir()
        (custom / 'keep.md').write_text('Personal notes')
        with self.assertRaises(ValueError):
            build(self.root, custom)
        self.assertEqual((custom / 'keep.md').read_text(), 'Personal notes')
        self.assertFalse((self.root / 'projects/000-index/dist').exists())

        output = self.root / 'projects/001-post/dist'
        output.mkdir()
        (output / 'keep.md').write_text('Unowned Project files')
        before = inventory(self.root)
        with self.assertRaises(ValueError):
            build(self.root)
        self.assertEqual(inventory(self.root), before)

    def test_project_id_cannot_redirect_output(self):
        contract = self.contract()
        contract.write_text(contract.read_text()+'- ID: ../../other\n- Public path: 001-post\n')
        with self.assertRaises(ValueError):
            build(self.root)
        self.assertFalse((self.root / 'dist').exists())

    def test_symlinked_ancestors_and_source_output_overlap_are_rejected(self):
        outside = self.root.parent / 'outside'
        outside.mkdir()
        alias = self.root / 'alias'
        alias.symlink_to(outside, target_is_directory=True)
        with self.assertRaises(ValueError):
            build(self.root, alias / 'preview')
        self.assertEqual(list(outside.iterdir()), [])
        alias.unlink()
        source = self.root / 'projects/001-post/src'
        source.rename(source.with_name('dist'))
        contract = self.contract()
        contract.write_text(contract.read_text().replace('Source: src', 'Source: dist'))
        before = inventory(self.root)
        with self.assertRaises(ValueError):
            build(self.root)
        self.assertEqual(inventory(self.root), before)

    def test_empty_and_previously_generated_custom_outputs_can_be_rebuilt(self):
        output = self.root.parent / 'custom output'
        output.mkdir()
        self.assertTrue(build(self.root, output)['ok'])
        self.assertTrue(build(self.root, output)['ok'])
        self.assertTrue(check_release(output)['ok'])

    def test_legacy_project_outputs_are_adopted_only_when_their_bytes_match(self):
        build(self.root)
        for folder in (self.root / 'projects').iterdir():
            (folder / 'dist' / PROJECT_OUTPUT_MANIFEST).unlink(missing_ok=True)
        # The prior aggregate inventory proves ownership even when the source changed.
        (self.root / 'projects/001-post/src/index.html').write_text('<h1>New edition</h1>')
        self.assertTrue(build(self.root)['ok'])
        for folder in (self.root / 'projects').iterdir():
            self.assertEqual(json.loads((folder / 'dist' / PROJECT_OUTPUT_MANIFEST).read_text())['project'], folder.name)

    def test_project_output_metadata_does_not_replace_a_public_release_json(self):
        public = self.root / 'projects/001-post/src/release.json'
        public.write_text('{"purpose":"post runtime data"}')
        build(self.root)
        self.assertEqual((self.root / 'projects/001-post/dist/release.json').read_bytes(), public.read_bytes())
        self.assertTrue(build(self.root)['ok'])

    def test_private_local_download_is_rejected_before_output_replacement(self):
        build(self.root)
        old = inventory(self.root / 'dist')
        private = self.root / 'projects/001-post/src/downloads/operator.local.md'
        private.parent.mkdir()
        private.write_text('DUMMY_PRIVATE_MARKER')
        with self.assertRaisesRegex(ValueError, 'Private'):
            build(self.root)
        self.assertEqual(inventory(self.root / 'dist'), old)

    def test_private_material_sources_and_targets_are_rejected(self):
        material = self.root / 'projects/001-post/materials'
        material.mkdir()
        for name in ('account.local.md', 'ssh.key', 'identity.pem', 'identity.p12',
                     'identity.pfx', 'id_ed25519', 'known_hosts', 'credentials.txt', '.envrc'):
            (material / name).write_text('DUMMY_PRIVATE_MARKER')
        original = self.contract().read_text()
        for name in (p.name for p in material.iterdir()):
            with self.subTest(source=name):
                self.contract().write_text(original+f'\n| Source | Target |\n| --- | --- |\n| materials/{name} | downloads/public.txt |\n')
                with self.assertRaisesRegex(ValueError, 'Private'):
                    build(self.root)
        (material / 'public.md').write_text('Intentional public download')
        self.contract().write_text(original+'\n| Source | Target |\n| --- | --- |\n| materials/public.md | downloads/note.local.md |\n')
        with self.assertRaisesRegex(ValueError, 'Private'):
            build(self.root)

    def test_public_markdown_download_still_enters_the_offline_package(self):
        download = self.root / 'projects/001-post/src/downloads/readme.md'
        download.parent.mkdir()
        download.write_text('Public instructions')
        self.contract().write_text(self.contract().read_text() + '\n- Archive: 001-post-v0.1.zip\n')
        build(self.root)
        with zipfile.ZipFile(self.root / 'dist/001-post/downloads/001-post-v0.1.zip') as archive:
            self.assertEqual(archive.read('downloads/readme.md'), b'Public instructions')

    def test_unpublished_partial_contract_does_not_block_public_build(self):
        (self.root / 'projects/002-draft').mkdir()
        contract = self.contract('002-draft')
        contract.parent.mkdir(parents=True)
        contract.write_text('- Publish: no\n- Version:\n- Kind: unfinished\n- Build command: "\n')
        self.assertEqual(build(self.root)['projects'], ['000-index', '001-post'])
        with self.assertRaisesRegex(ValueError, 'Invalid publication'):
            build(self.root, self.root / '.preview/draft', '002-draft')
        contract.write_text('- Publish: yes\n- Version:\n')
        with self.assertRaisesRegex(ValueError, 'Invalid publication'):
            build(self.root)
        contract.write_text('- Publish: perhaps\n')
        with self.assertRaisesRegex(ValueError, 'Publish must'):
            build(self.root)

    def test_successful_rebuild_retains_exact_previous_aggregate_and_project(self):
        build(self.root)
        before = inventory(self.root / 'dist')
        project_before = inventory(self.root / 'projects/001-post/dist')
        (self.root / 'projects/001-post/src/index.html').write_text('<h1>Changed edition</h1>')
        build(self.root)
        aggregate_history = self.root / '.publication-history/dist'
        project_history = self.root / 'projects/001-post/.publication-history/dist'
        snapshots = list(aggregate_history.iterdir()) if aggregate_history.exists() else []
        self.assertEqual(len(snapshots), 1)
        self.assertEqual(inventory(snapshots[0]), before)
        self.assertTrue(check_release(snapshots[0])['ok'])
        self.assertEqual(inventory(next(project_history.iterdir())), project_before)
        # Restore from the exact snapshot without rebuilding source or changing history.
        restored = self.root.parent / 'restored'
        shutil.copytree(snapshots[0], restored)
        self.assertEqual(inventory(restored), before)
        self.assertTrue(check_release(restored)['ok'])

    def test_snapshot_retention_is_bounded_and_deduplicates_identical_builds(self):
        for index in range(6):
            (self.root / 'projects/001-post/src/index.html').write_text(f'<h1>Edition {index}</h1>')
            build(self.root)
        history = self.root / '.publication-history/dist'
        snapshots = list(history.iterdir())
        self.assertEqual(len(snapshots), 3)
        editions = {(p / '001-post/index.html').read_text() for p in snapshots}
        self.assertTrue(all(any(f'Edition {n}' in text for text in editions) for n in (2, 3, 4)))
        build(self.root)
        build(self.root)
        self.assertEqual(len(list(history.iterdir())), 3)
        self.assertEqual({(p / '001-post/index.html').read_text() for p in history.iterdir()}, editions)

    def test_failed_activation_restores_previous_files(self):
        build(self.root)
        before = inventory(self.root / 'dist')
        (self.root / 'projects/001-post/src/index.html').write_text('<h1>Changed</h1>')
        rename = Path.rename

        def fail_aggregate(source, target):
            if source.name == 'site' and target == self.root / 'dist':
                raise OSError('Fixture activation failure')
            return rename(source, target)

        with patch.object(Path, 'rename', fail_aggregate):
            with self.assertRaisesRegex(OSError, 'Fixture activation'):
                build(self.root)
        self.assertEqual(inventory(self.root / 'dist'), before)
        self.assertTrue(check_release(self.root / 'dist')['ok'])

    def test_symlinked_history_is_rejected_before_any_output_replacement(self):
        build(self.root)
        before = inventory(self.root / 'dist')
        outside = self.root.parent / 'personal-history'
        outside.mkdir()
        (outside / 'keep.md').write_text('Personal notes')
        (self.root / '.publication-history').symlink_to(outside, target_is_directory=True)
        with self.assertRaises(ValueError):
            build(self.root)
        self.assertEqual(inventory(self.root / 'dist'), before)
        self.assertEqual((outside / 'keep.md').read_text(), 'Personal notes')


class UploadPrivacy(unittest.TestCase):
    def test_a_private_file_in_a_hash_valid_release_is_rejected(self):
        fixture = PublicationSafety()
        fixture.setUp()
        self.addCleanup(fixture.doCleanups)
        build(fixture.root)
        dist = fixture.root / 'dist'
        path = dist / '001-post/downloads/operator.local.md'
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text('DUMMY_PRIVATE_MARKER')
        manifest = json.loads((dist / 'release.json').read_text())
        manifest['sha256'][path.relative_to(dist).as_posix()] = hashlib.sha256(path.read_bytes()).hexdigest()
        (dist / 'release.json').write_text(json.dumps(manifest))
        with self.assertRaisesRegex(ValueError, 'Private'):
            create_archive(dist, fixture.root / 'upload.tar.gz')
        self.assertFalse((fixture.root / 'upload.tar.gz').exists())


class MigratedProjectScopes(unittest.TestCase):
    def test_every_current_project_has_scope_status_and_selected_dossier(self):
        journal = Path(__file__).resolve().parents[1]
        for project in sorted((journal / 'projects').iterdir()):
            if not project.is_dir() or project.name.startswith('.'):
                continue
            with self.subTest(project=project.name):
                living = journal / 'docs/projects' / project.name / 'living'
                self.assertTrue((living / 'idea.md').is_file(), living / 'idea.md')
                fields = markdown_fields(living / 'status.md')
                self.assertEqual(fields['project'], project.name)
                self.assertTrue((journal / fields['open_version_dossier']).is_dir())


if __name__ == '__main__':
    unittest.main()
