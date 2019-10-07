import { createVirtualSymlink } from './helpers/firebase-package-symlink';
async function Main() {
  try {
    await createVirtualSymlink();
  } catch (e) {
    console.log(e);
  }
}

Main();
