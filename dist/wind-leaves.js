import * as THREE from './vendor/three.module.js';
// Physics +x is screen-right; the 3D range mirrors x to look down its +z axis.
export function advanceLeaf(leaf,dt,wind){
 leaf.x-=wind*.75*dt;
 // Recycle outside the view instead of changing the direction of travel.
 if(leaf.x<-6)leaf.x+=12;
 if(leaf.x>6)leaf.x-=12;
 leaf.phase+=dt*(1.8+Math.abs(wind)*.45);
 leaf.spin+=dt*wind*.65;
}
export function createWindLeaves(scene){
 const shape=new THREE.Shape();shape.moveTo(0,-.65);shape.bezierCurveTo(-.48,-.2,-.5,.27,0,.68);shape.bezierCurveTo(.5,.27,.48,-.2,0,-.65);
 const geometry=new THREE.ShapeGeometry(shape,8);
 const material=new THREE.MeshStandardMaterial({color:'#a4aa56',side:THREE.DoubleSide,roughness:1,transparent:true,opacity:.85,depthWrite:false});
 const count=64,mesh=new THREE.InstancedMesh(geometry,material,count);mesh.frustumCulled=false;mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);scene.add(mesh);
 const dummy=new THREE.Object3D(),color=new THREE.Color();
 const leaves=Array.from({length:count},(_,i)=>({x:(i*2.37%12)-6,z:1+(i*3.71%22),baseY:.4+(i*1.31%2.8),phase:i*1.73,spin:i*.83,size:.055+(i*13%35)/1000}));
 for(let i=0;i<count;i++){color.set(['#9ba554','#c2ac64','#7f9251','#b58d4f'][i%4]);mesh.setColorAt(i,color);}
 return{update(dt,wind,cameraZ){
  for(let i=0;i<count;i++){const leaf=leaves[i];advanceLeaf(leaf,dt,wind);
   // Keep a light scattering ahead of the aim/chase camera without a new allocation.
   if(leaf.z<cameraZ+.7||leaf.z>cameraZ+26)leaf.z=cameraZ+2+(i*3.71%22);
   dummy.position.set(leaf.x,leaf.baseY+Math.sin(leaf.phase)*.16,leaf.z);
   dummy.rotation.set(Math.sin(leaf.phase*.7)*.8,leaf.spin,Math.sin(leaf.phase)*.55+leaf.spin*.3);
   dummy.scale.setScalar(leaf.size);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);
  }mesh.instanceMatrix.needsUpdate=true;
 },dispose(){scene.remove(mesh);geometry.dispose();material.dispose();}};
}
