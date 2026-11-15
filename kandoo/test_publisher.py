"""Publication regressions: private drafts, manifest-free preview and public boundaries."""
import json
import tempfile
import unittest
from pathlib import Path

from deploy import create_archive
from publisher import build, check_release


class PublicationDrafts(unittest.TestCase):
    def setUp(self):
        temp = tempfile.TemporaryDirectory(prefix='ژورنال مستقل ')
        self.addCleanup(temp.cleanup)
        self.root = Path(temp.name)
        settings = self.root / 'docs/kandoo/living/publication.md'
        settings.parent.mkdir(parents=True)
        settings.write_text('# Publication\n\n- Origin: https://example.invalid\n')
        self.project('000-index', '<a href="001-post/">Post</a>', 'index', publish=True)
        self.project('001-post', '<h1>Public post</h1>', publish=True)
        self.project('002-draft', '<h1>Private draft</h1>')
        private = self.root / 'projects/002-draft/inputs'
        private.mkdir()
        (private / 'private.md').write_text('PRIVATE_INPUT_MUST_NOT_SHIP')
        (self.root / 'projects/003-unfinished').mkdir()

    def project(self, identifier, content, kind='post', publish=False):
        folder = self.root / 'projects' / identifier
        (folder / 'src').mkdir(parents=True)
        (folder / 'src/index.html').write_text('<!doctype html><html><body>'+content+'</body></html>')
        if publish:
            contract = self.root / 'docs/projects' / identifier / 'living/publication.md'
            contract.parent.mkdir(parents=True)
            contract.write_text(f'# Publication\n\n- Kind: {kind}\n- Source: src\n- Version: 0.1\n- Publish: yes\n')

    def test_manifest_free_drafts_do_not_break_or_enter_publication(self):
        report = build(self.root)
        self.assertEqual(report['projects'], ['000-index', '001-post'])
        self.assertEqual(report['offline_archives'], 0)
        self.assertFalse(list((self.root / 'dist').rglob('*.zip')))
        manifest = json.loads((self.root / 'dist/release.json').read_text())
        self.assertEqual(manifest['projects']['001-post']['targets'], {'web': '001-post/index.html'})
        self.assertFalse((self.root / 'dist/002-draft').exists())
        self.assertFalse(list(self.root.rglob('project.json')))
        self.assertFalse((self.root / 'workspace.json').exists())

    def test_preview_builds_real_draft_but_cannot_deploy(self):
        output = self.root / '.preview/draft'
        report = build(self.root, output, '002-draft')
        self.assertTrue(report['preview_only'])
        self.assertIn('002-draft', report['projects'])
        self.assertIn('Private draft', (output / '002-draft/index.html').read_text())
        self.assertFalse((output / '002-draft/inputs').exists())
        with self.assertRaisesRegex(ValueError, 'Preview-only'):
            create_archive(output, self.root / 'upload.tar.gz')
        self.assertFalse((self.root / 'upload.tar.gz').exists())

    def test_explicit_publication_does_not_copy_private_project_input(self):
        contract = self.root / 'docs/projects/002-draft/living/publication.md'
        contract.parent.mkdir(parents=True)
        contract.write_text('# Publication\n\n- Publish: yes\n- Source: src\n')
        build(self.root)
        manifest = json.loads((self.root / 'dist/release.json').read_text())
        self.assertIn('002-draft', manifest['projects'])
        self.assertFalse(any('inputs' in p for p in manifest['sha256']))
        self.assertTrue(check_release(self.root / 'dist')['ok'])

    def test_unknown_preview_or_source_escape_is_actionable(self):
        with self.assertRaisesRegex(ValueError, 'Unknown preview'):
            build(self.root, preview='999-missing')
        contract = self.root / 'docs/projects/001-post/living/publication.md'
        contract.write_text('# Publication\n\n- Publish: yes\n- Source: ../../outside\n')
        with self.assertRaisesRegex(ValueError, 'leaves publication'):
            build(self.root)

    def test_primary_post_follows_saved_selection_and_preview_overrides_it(self):
        self.project('004-another-post', '<h1>Another post</h1>', publish=True)
        (self.root / 'docs/kandoo/living/status.md').write_text('# Status\n\n- Active Project: 001-post\n')
        build(self.root)
        release = json.loads((self.root / 'dist/release.json').read_text())
        self.assertEqual(release['post'], '001-post')
        build(self.root, self.root / '.preview/draft', '002-draft')
        preview = json.loads((self.root / '.preview/draft/release.json').read_text())
        self.assertEqual(preview['post'], '002-draft')

    def test_explicit_archive_can_be_removed_without_losing_materials(self):
        contract = self.root / 'docs/projects/001-post/living/publication.md'
        original = contract.read_text()
        material = self.root / 'projects/001-post/materials/exercise.md'
        material.parent.mkdir()
        material.write_text('Intentional exercise')
        material_row = '\n| Source | Target |\n| --- | --- |\n| materials/exercise.md | downloads/exercise.md |\n'
        contract.write_text(original + '\n- Archive: deck.zip\n- Archive aliases: previous-deck.zip\n' + material_row)
        self.assertEqual(build(self.root)['offline_archives'], 1)
        downloads = self.root / 'dist/001-post/downloads'
        self.assertEqual((downloads / 'deck.zip').read_bytes(), (downloads / 'previous-deck.zip').read_bytes())
        contract.write_text(original + '\n- Archive:\n' + material_row)
        self.assertEqual(build(self.root)['offline_archives'], 0)
        self.assertFalse((downloads / 'deck.zip').exists())
        self.assertFalse((downloads / 'previous-deck.zip').exists())
        self.assertEqual((downloads / 'exercise.md').read_text(), 'Intentional exercise')
        self.assertTrue(check_release(self.root / 'dist')['ok'])
        self.assertTrue(list((self.root / '.publication-history').rglob('deck.zip')))
        create_archive(self.root / 'dist', self.root / 'web-only-upload.tar.gz')

    def test_alias_without_archive_is_rejected_before_replacing_output(self):
        build(self.root)
        prior = (self.root / 'dist/release.json').read_bytes()
        contract = self.root / 'docs/projects/001-post/living/publication.md'
        contract.write_text(contract.read_text() + '\n- Archive aliases: stray.zip\n')
        with self.assertRaisesRegex(ValueError, 'explicit Archive'):
            build(self.root)
        self.assertEqual((self.root / 'dist/release.json').read_bytes(), prior)

    def test_release_records_both_https_origins_and_rejects_invalid_aliases(self):
        settings = self.root / 'docs/kandoo/living/publication.md'
        settings.write_text('- Origin: https://example.invalid\n- Aliases: https://old.example.invalid\n')
        build(self.root)
        manifest = json.loads((self.root / 'dist/release.json').read_text())
        self.assertEqual(manifest['aliases'], ['https://old.example.invalid'])
        for alias in ('http://old.example.invalid', 'https://old.example.invalid/path', 'https://example.invalid'):
            with self.subTest(alias=alias):
                settings.write_text('- Origin: https://example.invalid\n- Aliases: '+alias+'\n')
                with self.assertRaises(ValueError):
                    build(self.root)

    def test_unlisting_and_unpublishing_have_distinct_effects(self):
        index = self.root / 'projects/000-index/src/index.html'
        index.write_text('<h1>Index without the post card</h1>')
        build(self.root)
        self.assertTrue((self.root / 'dist/001-post/index.html').is_file())
        contract = self.root / 'docs/projects/001-post/living/publication.md'
        contract.write_text(contract.read_text().replace('Publish: yes', 'Publish: no'))
        build(self.root)
        self.assertFalse((self.root / 'dist/001-post').exists())
        self.assertTrue((self.root / 'projects/001-post/src/index.html').is_file())


if __name__ == '__main__':
    unittest.main()
