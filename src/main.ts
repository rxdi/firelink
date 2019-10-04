import { createFirebasePackageSymlink } from './helpers/firebase-package-symlink';
async function Main() {
  await createFirebasePackageSymlink();
}

Main();
