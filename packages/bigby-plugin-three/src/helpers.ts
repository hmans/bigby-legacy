import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

export async function loadGLTF(url: string) {
  return new GLTFLoader().loadAsync(url)
}
