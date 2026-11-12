import * as THREE from './vendor/three.module.js';
import {createWindLeaves} from './wind-leaves.js';
import {ringRadius,X_RING_RADIUS} from './target-config.js';
const sightTangent=(distance,zoom)=>Math.tan(20.25*Math.PI/360)/(zoom*Math.max(1,(distance+6)/48));
// Original procedural assets: no assets from another game are used.
export function createRange(canvas){
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.setClearColor('#bacfce');renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;
 const scene=new THREE.Scene();const windLeaves=createWindLeaves(scene);scene.fog=new THREE.Fog('#b7c9bd',45,160);const cam=new THREE.PerspectiveCamera(20.25,1,.05,240);scene.add(cam);cam.position.set(0,1.5,-6);
 scene.add(new THREE.HemisphereLight('#e7f4ff','#667843',2.6));const sun=new THREE.DirectionalLight('#fff0ca',3);sun.position.set(-15,24,-8);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-40;sun.shadow.camera.right=40;sun.shadow.camera.top=110;sun.shadow.camera.bottom=-30;sun.shadow.camera.far=160;scene.add(sun);
 const mat=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.75,...extra});const wood=mat('#645036'),gold=mat('#d1a447',{metalness:.6,roughness:.25}),black=mat('#22313a',{metalness:.35});
 function mesh(geometry,material,parent=scene){let m=new THREE.Mesh(geometry,material);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 let ground=mesh(new THREE.PlaneGeometry(260,260),mat('#758456'));ground.rotation.x=-Math.PI/2;ground.position.z=55;let lane=mesh(new THREE.PlaneGeometry(3,120),mat('#b4a47e'));lane.rotation.x=-Math.PI/2;lane.position.set(0,.005,52);
 // Deterministic scenery keeps resets free of distracting asset changes.
 for(let i=0;i<100;i++){let side=i%2?1:-1,x=side*(5+(i*13%28)),z=(i*19%140)-12,h=3+(i%7)*.55;let trunk=mesh(new THREE.CylinderGeometry(.12,.22,h*.6,6),wood);trunk.position.set(x,h*.3,z);for(let n=0;n<3;n++){let crown=mesh(new THREE.ConeGeometry(1.15-n*.2,h*.65,7),mat(['#355c47','#496d49','#607b50'][i%3]));crown.position.set(x,h*.55+n*h*.18,z);}}
 for(let z=0;z<=100;z+=10){for(let side of [-1,1]){let post=mesh(new THREE.BoxGeometry(.06,.6,.06),wood);post.position.set(side*2.2,.3,z);}let mark=mesh(new THREE.PlaneGeometry(2.5,.035),mat('#eee4c0'));mark.rotation.x=-Math.PI/2;mark.position.set(0,.012,z);}
 const target=new THREE.Group();scene.add(target);let back=mesh(new THREE.CylinderGeometry(.7,.7,.16,64),mat('#b99a5e'),target);back.rotation.x=Math.PI/2;back.position.y=1.5;
 const colors=['#f4f0df','#f4f0df','#222d36','#222d36','#248fbd','#248fbd','#e64636','#e64636','#ffd044','#ffd044'];for(let i=0;i<10;i++){let ring=mesh(new THREE.CircleGeometry(ringRadius(i),64),mat(colors[i],{side:THREE.DoubleSide}),target);ring.position.set(0,1.5,-.09-i*.001);let edge=mesh(new THREE.RingGeometry(ringRadius(i)-.0015,ringRadius(i),64),mat('#172e37',{side:THREE.DoubleSide}),target);edge.position.copy(ring.position);edge.position.z-=.0005;}let pin=mesh(new THREE.RingGeometry(X_RING_RADIUS-.0015,X_RING_RADIUS,24),mat('#987223',{side:THREE.DoubleSide}),target);pin.position.set(0,1.5,-.105);
 for(let side of [-1,1]){let leg=mesh(new THREE.BoxGeometry(.085,1.5,.09),wood,target);leg.position.set(side*.38,.68,.1);leg.rotation.z=side*-.18;}
 function arrow(){let g=new THREE.Group();let shaft=mesh(new THREE.CylinderGeometry(.007,.007,.72,8),mat('#3c4040',{metalness:.7,roughness:.3}),g);shaft.rotation.x=Math.PI/2;let tip=mesh(new THREE.ConeGeometry(.018,.09,6),mat('#d7e0df',{metalness:.85,roughness:.2}),g);tip.rotation.x=Math.PI/2;tip.position.z=.4;for(let i=0;i<3;i++){let feather=mesh(new THREE.BoxGeometry(.07,.003,.16),mat(i?'#eee9d5':'#c84d35'),g);feather.position.z=-.26;feather.rotation.z=i*Math.PI*2/3;}return g;}
 const flying=arrow();scene.add(flying);const embedded=new THREE.Group();scene.add(embedded);let embeddedCount=0;
 const bow=new THREE.Group();cam.add(bow);bow.position.set(.29,-.19,-.72);bow.rotation.z=-.12;
 const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(0,-.37,0),new THREE.Vector3(-.06,-.24,-.045),new THREE.Vector3(-.1,0,0),new THREE.Vector3(-.06,.24,-.045),new THREE.Vector3(0,.37,0)]);mesh(new THREE.TubeGeometry(curve,32,.014,8,false),gold,bow);let grip=mesh(new THREE.CylinderGeometry(.027,.027,.14,12),black,bow);grip.position.x=-.1;let hand=mesh(new THREE.SphereGeometry(.052,12,10),mat('#96735b'),bow);hand.scale.set(.7,1.3,.8);hand.position.set(-.1,-.015,.025);let wrist=mesh(new THREE.CylinderGeometry(.035,.045,.25,10),mat('#455844'),bow);wrist.position.set(-.11,-.16,.07);wrist.rotation.x=-.45;
 const stringGeo=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),new THREE.Vector3(),new THREE.Vector3()]);bow.add(new THREE.Line(stringGeo,new THREE.LineBasicMaterial({color:'#eadfbc'})));let nocked=arrow();nocked.scale.setScalar(.7);bow.add(nocked);
 const trailGeo=new THREE.BufferGeometry();const trail=new THREE.Line(trailGeo,new THREE.LineBasicMaterial({color:'#f9efd3',transparent:true,opacity:.55}));scene.add(trail);
 const predictionGeo=new THREE.BufferGeometry();const prediction=new THREE.Line(predictionGeo,new THREE.LineDashedMaterial({color:'#f9efd3',dashSize:.12,gapSize:.18,transparent:true,opacity:.65}));scene.add(prediction);
 const reticle=new THREE.Mesh(new THREE.RingGeometry(.004,.005,32),new THREE.MeshBasicMaterial({color:'#fff6cb',depthTest:false,transparent:true,opacity:.85}));reticle.position.z=-1;cam.add(reticle);
 const debrisGeometry=new THREE.BufferGeometry(),debris=new THREE.Points(debrisGeometry,new THREE.PointsMaterial({color:'#efcb77',size:.035,transparent:true}));scene.add(debris);
 let elapsed=0,recoil=0,lastArrow=false,look=new THREE.Vector3(0,1.5,30),lastDistance=30;const temp=new THREE.Vector3();
 return{
 aimPoint(pointer,distance,zoom,aspect){const tangent=sightTangent(distance,zoom);return{x:pointer.x*aspect*tangent*(distance+6),y:1.5+pointer.y*tangent*(distance+6)};},
 render({game,controller,director,physics,assist,dt,time,width,height}){
 elapsed+=dt;renderer.setSize(width,height,false);cam.aspect=width/height;
 if(game.distance!==lastDistance||game.shots.length<embeddedCount){embedded.clear();embeddedCount=0;lastDistance=game.distance;}target.position.z=game.distance;
 const a=game.arrow,impactAge=director.active&&!a?director.hold:10;
 let pos=new THREE.Vector3(0,1.5,-6),focus=new THREE.Vector3(0,1.5,game.distance);
 if(a){let p=new THREE.Vector3(-a.p.x,a.p.y,a.p.z);let velocity=new THREE.Vector3(-a.v.x,a.v.y,a.v.z).normalize();pos.copy(p).add(new THREE.Vector3(.65,.28,-2.8));focus.copy(p).addScaledVector(velocity,4);if(!lastArrow)recoil=1;}
 else if(director.active){const hit=game.shots.at(-1)?.hit;let x=hit?-hit.x:0,y=hit?.y??1.5;focus.set(x/2,(y+1.5)/2,game.distance);const extent=Math.max(.8,Math.abs(x)/2+.4,Math.abs(y-1.5)/2+.4),back=extent/(Math.tan(19*Math.PI/180)*Math.min(cam.aspect,1))+1;pos.set(focus.x+.3,focus.y+.3,game.distance-back);}
 let blend=1-Math.exp(-dt*(a?14:6));if(!a&&!director.active){cam.position.copy(pos);look.copy(focus);}else{cam.position.lerp(pos,blend);look.lerp(focus,blend);}cam.lookAt(look);cam.fov=director.active?38:2*Math.atan(sightTangent(game.distance,director.drawZoom))*180/Math.PI;cam.updateProjectionMatrix();
 recoil=Math.max(0,recoil-dt*4);bow.visible=!a&&!director.active;bow.rotation.z=-.12+Math.sin(time*2)*.008;bow.rotation.x=recoil*.13;bow.scale.y=1-controller.power*.08;
 let pull=controller.power*.17;let coords=stringGeo.attributes.position;coords.setXYZ(0,0,-.37,0);coords.setXYZ(1,-.1,0,.03+pull);coords.setXYZ(2,0,.37,0);coords.needsUpdate=true;nocked.position.set(-.1,0,-.12+pull);nocked.visible=game.remaining>0;
 let aim=controller.getAim(time);reticle.visible=bow.visible&&game.remaining>0;const tangent=Math.tan(cam.fov*Math.PI/360);reticle.position.set(controller.pointer.x*cam.aspect*tangent,controller.pointer.y*tangent,-1);
 flying.visible=!!a;trail.visible=!!a;if(a){flying.position.set(-a.p.x,a.p.y,a.p.z);flying.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),temp.set(-a.v.x,a.v.y,a.v.z).normalize());trailGeo.setFromPoints(a.trail.map(p=>new THREE.Vector3(-p.x,p.y,p.z)));}
 while(embeddedCount<game.shots.length){let shot=game.shots[embeddedCount++];if(!shot.hit||!shot.points)continue;let g=arrow();g.position.set(-shot.hit.x,shot.hit.y,shot.hit.z-.33);g.userData.born=elapsed;g.userData.baseX=g.position.x;embedded.add(g);}
 for(let g of embedded.children){let age=elapsed-g.userData.born;g.rotation.y=Math.sin(age*75)*.045*Math.exp(-age*6);g.rotation.x=Math.sin(age*64)*.025*Math.exp(-age*6);}
 target.rotation.z=impactAge<.4?Math.sin(impactAge*70)*.012*Math.exp(-impactAge*10):0;
 prediction.visible=assist&&!a&&!director.active&&game.remaining>0;if(prediction.visible){let trace=physics.trace(aim,controller.drawing?controller.power:1,game.wind,game.distance);predictionGeo.setFromPoints(trace.points.map(p=>new THREE.Vector3(-p.x,p.y,p.z)));prediction.computeLineDistances();}
 debrisGeometry.setFromPoints(game.particles.map(p=>new THREE.Vector3(-p.x,p.y,p.z)));debris.material.opacity=game.particles[0]?.life??0;
 windLeaves.update(dt,game.arrow?.wind??game.wind,cam.position.z);lastArrow=!!a;renderer.render(scene,cam);
 },dispose(){windLeaves.dispose();renderer.dispose();}};
}
