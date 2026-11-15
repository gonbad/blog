"""The publication upload is confined to the verified dist file inventory."""
import json
import sys
import tarfile
import tempfile
import unittest
from pathlib import Path

from deploy import REMOTE, ROOT, create_archive, save_receipt

from publisher import build


class DistUpload(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix='blog-dist-upload-')
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        publication = self.root / 'docs/kandoo/living/publication.md'
        publication.parent.mkdir(parents=True)
        publication.write_text('# Publication\n\n- Origin: https://example.invalid\n')
        for identifier, kind, content in [('000-index', 'index', '<a href="001-post/">Post</a>'), ('001-post', 'post', '<h1>Public post</h1>')]:
            folder = self.root / 'projects' / identifier
            (folder / 'src').mkdir(parents=True)
            (folder / 'src/index.html').write_text('<!doctype html><html><body>' + content + '</body></html>')
            contract = self.root / 'docs/projects' / identifier / 'living/publication.md'
            contract.parent.mkdir(parents=True)
            contract.write_text(f'# Publication\n\n- Kind: {kind}\n- Source: src\n- Version: 0.1.0\n- Publish: yes\n')
        (self.root / 'deploy').mkdir()
        (self.root / 'deploy/server.conf').write_text('Private configuration fixture')
        (self.root / '.env').write_text('PRIVATE_FIXTURE=not-public')
        build(self.root)
        self.dist = self.root / 'dist'
        self.archive = self.root / 'upload.tar.gz'

    def test_only_manifest_and_verified_dist_files_enter_upload(self):
        manifest = create_archive(self.dist, self.archive)
        with tarfile.open(self.archive) as archive:
            members = archive.getmembers()
            expected = {'dist/release.json'} | {f'dist/{name}' for name in manifest['sha256']}
            self.assertEqual({member.name for member in members}, expected)
            self.assertTrue(all(member.isfile() for member in members))
            self.assertTrue(all(member.name.startswith('dist/') for member in members))
            self.assertNotIn('deploy/server.conf', archive.getnames())
            self.assertNotIn('.env', archive.getnames())
        compile(REMOTE, '<remote-deployment>', 'exec')

    def test_remote_release_normalizes_public_permissions(self):
        self.assertIn('path.chmod(0o755)', REMOTE)
        self.assertIn('path.chmod(0o644)', REMOTE)
        self.assertIn("'public_permissions_normalized': True", REMOTE)

    def test_unlisted_source_file_in_dist_is_rejected(self):
        (self.dist / 'source.py').write_text('private source fixture')
        with self.assertRaisesRegex(ValueError, 'inventory'):
            create_archive(self.dist, self.archive)
        self.assertFalse(self.archive.exists())

    def test_tampered_public_file_is_rejected(self):
        (self.dist / 'index.html').write_text('Unverified replacement')
        with self.assertRaisesRegex(ValueError, 'checksum'):
            create_archive(self.dist, self.archive)
        self.assertFalse(self.archive.exists())

    def test_later_deployment_keeps_previous_receipt_unchanged(self):
        (self.root / 'docs/kandoo/living/status.md').write_text('# Status\n\n- Shared open version: 0.5\n')
        first = save_receipt(self.root, {'release': 'one', 'published': True})
        original = first.read_bytes()
        second = save_receipt(self.root, {'release': 'two', 'published': True})
        self.assertNotEqual(first, second)
        self.assertEqual(first.read_bytes(), original)
        self.assertEqual(json.loads((second.parent / 'deployment.json').read_text())['release'], 'two')
