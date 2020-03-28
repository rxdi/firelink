import { createVirtualSymlink } from './create-virtual-symlink';
async function Main() {
  try {
    await createVirtualSymlink();
  } catch (e) {
    console.log(e);
  }
}

Main();
