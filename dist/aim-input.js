// Touch works like a trackpad: the contact location never moves the reticle by itself.
export class AimInput {
 constructor(){this.active=null;this.touchSensitivity=.75;}
 begin(event,pointer,rect){if(this.active!==null)return null;this.active={id:event.pointerId,touch:event.pointerType==='touch',x:event.clientX,y:event.clientY};return this.active.touch?{...pointer}:this.absolute(event,rect);}
 absolute(event,rect){return{x:Math.max(-.95,Math.min(.95,(event.clientX-rect.left)/rect.width*2-1)),y:Math.max(-.95,Math.min(.95,1-(event.clientY-rect.top)/rect.height*2))};}
 move(event,pointer,rect){const active=this.active;if(!active)return event.pointerType==='touch'?null:this.absolute(event,rect);if(event.pointerId!==active.id)return null;if(!active.touch)return this.absolute(event,rect);const next={x:Math.max(-.95,Math.min(.95,pointer.x+(event.clientX-active.x)/rect.width*2*this.touchSensitivity)),y:Math.max(-.95,Math.min(.95,pointer.y-(event.clientY-active.y)/rect.height*2*this.touchSensitivity))};active.x=event.clientX;active.y=event.clientY;return next;}
 end(event){if(this.active?.id!==event.pointerId)return false;this.active=null;return true;}
 cancel(){this.active=null;}
}
