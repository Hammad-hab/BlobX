/**
 * A Simple data structure for storing, retriving and handling
 * duplicate shaders. Most used uniform setUniformAtI
 */

import {Vector3, MathUtils} from 'three';

class MaterialContainer {
  private materials: any[];
  constructor() {
    this.materials = [];
  }

  addMaterials(material: any) {
    this.materials.push(material);
  }

  getNMaterials() {
    return this.materials.length;
  }

  getMaterial(index: number) {
    return this.materials[index];
  }
  createMatUniformVariation(
    index: number,
    uniformValue: any,
    uniformName: string,
  ) {
    const nmat = this.materials[index].clone();
    nmat.uniforms[uniformName].value = uniformValue;
    this.materials.push(nmat);
  }

  setUniformAt(index: number, uniformValue: any, uniformName: string) {
    console.log('SET_UNIFORM:', uniformName);
    const nmat = this.materials[index];
    nmat.uniforms[uniformName].value = uniformValue;
  }

  setUniformAtI(index: number, uniformValue: any, uniformName: string) {
    const nmat = this.materials[index];
    nmat.uniforms[uniformName].value += uniformValue;
  }

  setUniformAtAll(uniformValue: any, uniformName: string) {
    for (const mat of this.materials) {
      mat.uniforms[uniformName].value = MathUtils.lerp(
        mat.uniforms[uniformName].value.x,
        uniformValue,
        0.1,
      );
    }
  }

  setNewColor(
    index: number,
    uniformColor: string,
    r: number,
    g: number,
    b: number,
  ) {
    const nmat = this.materials[index];
    const originalColor = nmat.uniforms[uniformColor].value;
    const targetColor = new Vector3(r, g, b);
    const res = originalColor.lerp(targetColor, 0.05);
    nmat.uniforms[uniformColor].value.copy(res);
    nmat.needsUpdate = true;
    //const nmat = this.materials[index];
    //const OriginalColor = nmat.uniforms[uniformColor].value;
    // OriginalColor.lerp(new THREE.Vector3(r, g, b), 1.0);
  }

  dampOutAtIVec(index: number, uniformName: string, alpha = 0.1) {
    const nmat = this.materials[index];
    const unf = nmat.uniforms[uniformName];
    const tgt = new Vector3(0, 0, 0);
    unf.lerp(tgt, alpha);
  }
}

export default MaterialContainer;
