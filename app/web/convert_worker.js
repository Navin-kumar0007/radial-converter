(function dartProgram(){function copyProperties(a,b){var s=Object.keys(a)
for(var r=0;r<s.length;r++){var q=s[r]
b[q]=a[q]}}function mixinPropertiesHard(a,b){var s=Object.keys(a)
for(var r=0;r<s.length;r++){var q=s[r]
if(!b.hasOwnProperty(q)){b[q]=a[q]}}}function mixinPropertiesEasy(a,b){Object.assign(b,a)}var z=function(){var s=function(){}
s.prototype={p:{}}
var r=new s()
if(!(Object.getPrototypeOf(r)&&Object.getPrototypeOf(r).p===s.prototype.p))return false
try{if(typeof navigator!="undefined"&&typeof navigator.userAgent=="string"&&navigator.userAgent.indexOf("Chrome/")>=0)return true
if(typeof version=="function"&&version.length==0){var q=version()
if(/^\d+\.\d+\.\d+\.\d+$/.test(q))return true}}catch(p){}return false}()
function inherit(a,b){a.prototype.constructor=a
a.prototype["$i"+a.name]=a
if(b!=null){if(z){Object.setPrototypeOf(a.prototype,b.prototype)
return}var s=Object.create(b.prototype)
copyProperties(a.prototype,s)
a.prototype=s}}function inheritMany(a,b){for(var s=0;s<b.length;s++){inherit(b[s],a)}}function mixinEasy(a,b){mixinPropertiesEasy(b.prototype,a.prototype)
a.prototype.constructor=a}function mixinHard(a,b){mixinPropertiesHard(b.prototype,a.prototype)
a.prototype.constructor=a}function lazy(a,b,c,d){var s=a
a[b]=s
a[c]=function(){if(a[b]===s){a[b]=d()}a[c]=function(){return this[b]}
return a[b]}}function lazyFinal(a,b,c,d){var s=a
a[b]=s
a[c]=function(){if(a[b]===s){var r=d()
if(a[b]!==s){A.yg(b)}a[b]=r}var q=a[b]
a[c]=function(){return q}
return q}}function makeConstList(a,b){if(b!=null)A.j(a,b)
a.$flags=7
return a}function convertToFastObject(a){function t(){}t.prototype=a
new t()
return a}function convertAllToFastObject(a){for(var s=0;s<a.length;++s){convertToFastObject(a[s])}}var y=0
function instanceTearOffGetter(a,b){var s=null
return a?function(c){if(s===null)s=A.oI(b)
return new s(c,this)}:function(){if(s===null)s=A.oI(b)
return new s(this,null)}}function staticTearOffGetter(a){var s=null
return function(){if(s===null)s=A.oI(a).prototype
return s}}var x=0
function tearOffParameters(a,b,c,d,e,f,g,h,i,j){if(typeof h=="number"){h+=x}return{co:a,iS:b,iI:c,rC:d,dV:e,cs:f,fs:g,fT:h,aI:i||0,nDA:j}}function installStaticTearOff(a,b,c,d,e,f,g,h){var s=tearOffParameters(a,true,false,c,d,e,f,g,h,false)
var r=staticTearOffGetter(s)
a[b]=r}function installInstanceTearOff(a,b,c,d,e,f,g,h,i,j){c=!!c
var s=tearOffParameters(a,false,c,d,e,f,g,h,i,!!j)
var r=instanceTearOffGetter(c,s)
a[b]=r}function setOrUpdateInterceptorsByTag(a){var s=v.interceptorsByTag
if(!s){v.interceptorsByTag=a
return}copyProperties(a,s)}function setOrUpdateLeafTags(a){var s=v.leafTags
if(!s){v.leafTags=a
return}copyProperties(a,s)}function updateTypes(a){var s=v.types
var r=s.length
s.push.apply(s,a)
return r}function updateHolder(a,b){copyProperties(b,a)
return a}var hunkHelpers=function(){var s=function(a,b,c,d,e){return function(f,g,h,i){return installInstanceTearOff(f,g,a,b,c,d,[h],i,e,false)}},r=function(a,b,c,d){return function(e,f,g,h){return installStaticTearOff(e,f,a,b,c,[g],h,d)}}
return{inherit:inherit,inheritMany:inheritMany,mixin:mixinEasy,mixinHard:mixinHard,installStaticTearOff:installStaticTearOff,installInstanceTearOff:installInstanceTearOff,_instance_0u:s(0,0,null,["$0"],0),_instance_1u:s(0,1,null,["$1"],0),_instance_2u:s(0,2,null,["$2"],0),_instance_0i:s(1,0,null,["$0"],0),_instance_1i:s(1,1,null,["$1"],0),_instance_2i:s(1,2,null,["$2"],0),_static_0:r(0,null,["$0"],0),_static_1:r(1,null,["$1"],0),_static_2:r(2,null,["$2"],0),makeConstList:makeConstList,lazy:lazy,lazyFinal:lazyFinal,updateHolder:updateHolder,convertToFastObject:convertToFastObject,updateTypes:updateTypes,setOrUpdateInterceptorsByTag:setOrUpdateInterceptorsByTag,setOrUpdateLeafTags:setOrUpdateLeafTags}}()
function initializeDeferredHunk(a){x=v.types.length
a(hunkHelpers,v,w,$)}var J={
oO(a,b,c,d){return{i:a,p:b,e:c,x:d}},
nt(a){var s,r,q,p,o,n="_$dart_js",m=a[v.dispatchPropertyName]
if(m==null)if($.oL==null){A.xO()
m=a[v.dispatchPropertyName]}if(m!=null){s=m.p
if(!1===s)return m.i
if(!0===s)return a
r=Object.getPrototypeOf(a)
if(s===r)return m.i
if(m.e===r)throw A.e(A.qb("Return interceptor for "+A.A(s(a,m))))}q=a.constructor
if(q==null)p=null
else{o=$.mo
if(o==null)o=$.mo=A.ns(n)
p=q[o]}if(p!=null)return p
p=A.xT(a)
if(p!=null)return p
if(typeof a=="function")return B.f4
s=Object.getPrototypeOf(a)
if(s==null)return B.dG
if(s===Object.prototype)return B.dG
if(typeof q=="function"){o=$.mo
if(o==null)o=$.mo=A.ns(n)
Object.defineProperty(q,o,{value:B.bV,enumerable:false,writable:true,configurable:true})
return B.bV}return B.bV},
nW(a,b){if(a<0||a>4294967295)throw A.e(A.a7(a,0,4294967295,"length",null))
return J.pC(new Array(a),b)},
aa(a,b){if(a<0||a>4294967295)throw A.e(A.a7(a,0,4294967295,"length",null))
return J.pC(new Array(a),b)},
nX(a,b){if(a<0)throw A.e(A.aJ("Length must be a non-negative integer: "+a,null))
return A.j(new Array(a),b.n("p<0>"))},
bF(a,b){if(a<0)throw A.e(A.aJ("Length must be a non-negative integer: "+a,null))
return A.j(new Array(a),b.n("p<0>"))},
pC(a,b){var s=A.j(a,b.n("p<0>"))
s.$flags=1
return s},
tR(a,b){var s=t.bP
return J.t9(s.a(a),s.a(b))},
pD(a){if(a<256)switch(a){case 9:case 10:case 11:case 12:case 13:case 32:case 133:case 160:return!0
default:return!1}switch(a){case 5760:case 8192:case 8193:case 8194:case 8195:case 8196:case 8197:case 8198:case 8199:case 8200:case 8201:case 8202:case 8232:case 8233:case 8239:case 8287:case 12288:case 65279:return!0
default:return!1}},
pE(a,b){var s,r
for(s=a.length;b<s;){r=a.charCodeAt(b)
if(r!==32&&r!==13&&!J.pD(r))break;++b}return b},
pF(a,b){var s,r,q
for(s=a.length;b>0;b=r){r=b-1
if(!(r<s))return A.a(a,r)
q=a.charCodeAt(r)
if(q!==32&&q!==13&&!J.pD(q))break}return b},
dp(a){if(typeof a=="number"){if(Math.floor(a)==a)return J.f7.prototype
return J.i8.prototype}if(typeof a=="string")return J.co.prototype
if(a==null)return J.f8.prototype
if(typeof a=="boolean")return J.f6.prototype
if(Array.isArray(a))return J.p.prototype
if(typeof a!="object"){if(typeof a=="function")return J.bS.prototype
if(typeof a=="symbol")return J.dV.prototype
if(typeof a=="bigint")return J.dU.prototype
return a}if(a instanceof A.S)return a
return J.nt(a)},
ab(a){if(typeof a=="string")return J.co.prototype
if(a==null)return a
if(Array.isArray(a))return J.p.prototype
if(typeof a!="object"){if(typeof a=="function")return J.bS.prototype
if(typeof a=="symbol")return J.dV.prototype
if(typeof a=="bigint")return J.dU.prototype
return a}if(a instanceof A.S)return a
return J.nt(a)},
bu(a){if(a==null)return a
if(Array.isArray(a))return J.p.prototype
if(typeof a!="object"){if(typeof a=="function")return J.bS.prototype
if(typeof a=="symbol")return J.dV.prototype
if(typeof a=="bigint")return J.dU.prototype
return a}if(a instanceof A.S)return a
return J.nt(a)},
xH(a){if(typeof a=="number")return J.dS.prototype
if(typeof a=="string")return J.co.prototype
if(a==null)return a
if(!(a instanceof A.S))return J.dc.prototype
return a},
xI(a){if(typeof a=="string")return J.co.prototype
if(a==null)return a
if(!(a instanceof A.S))return J.dc.prototype
return a},
bv(a){if(a==null)return a
if(typeof a!="object"){if(typeof a=="function")return J.bS.prototype
if(typeof a=="symbol")return J.dV.prototype
if(typeof a=="bigint")return J.dU.prototype
return a}if(a instanceof A.S)return a
return J.nt(a)},
bf(a,b){if(a==null)return b==null
if(typeof a!="object")return b!=null&&a===b
return J.dp(a).a_(a,b)},
d(a,b){if(typeof b==="number")if(Array.isArray(a)||typeof a=="string"||A.xR(a,a[v.dispatchPropertyName]))if(b>>>0===b&&b<a.length)return a[b]
return J.ab(a).l(a,b)},
a2(a,b,c){return J.bu(a).i(a,b,c)},
p4(a,b){return J.bu(a).E(a,b)},
p5(a,b){return J.xI(a).eK(a,b)},
p6(a,b,c){return J.bv(a).hM(a,b,c)},
p7(a,b,c){return J.bv(a).hN(a,b,c)},
t6(a,b,c){return J.bv(a).hO(a,b,c)},
t7(a,b,c){return J.bv(a).hP(a,b,c)},
nK(a,b,c){return J.bv(a).hQ(a,b,c)},
t8(a){return J.bv(a).hR(a)},
p8(a,b,c){return J.bv(a).dN(a,b,c)},
az(a,b,c){return J.bv(a).hS(a,b,c)},
I(a){return J.bv(a).hT(a)},
F(a,b,c){return J.bv(a).d1(a,b,c)},
t9(a,b){return J.xH(a).cb(a,b)},
nL(a,b){return J.bu(a).bm(a,b)},
eu(a,b,c,d){return J.bu(a).V(a,b,c,d)},
by(a){return J.dp(a).gK(a)},
cd(a){return J.bu(a).gF(a)},
bz(a){return J.ab(a).gp(a)},
ta(a){return J.bv(a).gd8(a)},
tb(a){return J.dp(a).gaX(a)},
tc(a,b,c){return J.bu(a).dj(a,b,c)},
td(a,b,c,d,e){return J.bu(a).a3(a,b,c,d,e)},
jJ(a,b){return J.bu(a).br(a,b)},
nM(a,b,c){return J.bu(a).bJ(a,b,c)},
te(a,b){return J.bu(a).iu(a,b)},
ev(a){return J.dp(a).D(a)},
hX:function hX(){},
f6:function f6(){},
f8:function f8(){},
f9:function f9(){},
cq:function cq(){},
ir:function ir(){},
dc:function dc(){},
bS:function bS(){},
dU:function dU(){},
dV:function dV(){},
p:function p(a){this.$ti=a},
i7:function i7(){},
ks:function ks(a){this.$ti=a},
ew:function ew(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
dS:function dS(){},
f7:function f7(){},
i8:function i8(){},
co:function co(){}},A={nY:function nY(){},
nO(a,b,c){if(t.Y.b(a))return new A.h_(a,b.n("@<0>").b1(c).n("h_<1,2>"))
return new A.cF(a,b.n("@<0>").b1(c).n("cF<1,2>"))},
pJ(a){return new A.dW("Field '"+a+"' has been assigned during initialization.")},
kC(a){return new A.dW("Field '"+a+"' has not been initialized.")},
tU(a){return new A.dW("Field '"+a+"' has already been initialized.")},
bY(a,b){a=a+b&536870911
a=a+((a&524287)<<10)&536870911
return a^a>>>6},
lb(a){a=a+((a&67108863)<<3)&536870911
a^=a>>>11
return a+((a&16383)<<15)&536870911},
js(a,b,c){return a},
oN(a){var s,r
for(s=$.aX.length,r=0;r<s;++r)if(a===$.aX[r])return!0
return!1},
d9(a,b,c,d){A.aV(b,"start")
if(c!=null){A.aV(c,"end")
if(b>c)A.a9(A.a7(b,0,c,"start",null))}return new A.fI(a,b,c,d.n("fI<0>"))},
q6(a,b,c){var s="count"
if(t.Y.b(a)){A.jM(b,s,t.p)
A.aV(b,s)
return new A.dI(a,b,c.n("dI<0>"))}A.jM(b,s,t.p)
A.aV(b,s)
return new A.bX(a,b,c.n("bX<0>"))},
f5(){return new A.e7("No element")},
pB(){return new A.e7("Too few elements")},
m7:function m7(a){this.a=0
this.b=a},
cA:function cA(){},
ey:function ey(a,b){this.a=a
this.$ti=b},
cF:function cF(a,b){this.a=a
this.$ti=b},
h_:function h_(a,b){this.a=a
this.$ti=b},
fZ:function fZ(){},
ez:function ez(a,b){this.a=a
this.$ti=b},
dW:function dW(a){this.a=a},
an:function an(a){this.a=a},
la:function la(){},
x:function x(){},
b3:function b3(){},
fI:function fI(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.$ti=d},
cR:function cR(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
fe:function fe(a,b,c){this.a=a
this.b=b
this.$ti=c},
c5:function c5(a,b,c){this.a=a
this.b=b
this.$ti=c},
fY:function fY(a,b,c){this.a=a
this.b=b
this.$ti=c},
bX:function bX(a,b,c){this.a=a
this.b=b
this.$ti=c},
dI:function dI(a,b,c){this.a=a
this.b=b
this.$ti=c},
fF:function fF(a,b,c){this.a=a
this.b=b
this.$ti=c},
eD:function eD(a){this.$ti=a},
eE:function eE(a){this.$ti=a},
aA:function aA(){},
c0:function c0(){},
e8:function e8(){},
hj:function hj(){},
tt(){throw A.e(A.br("Cannot modify constant Set"))},
rs(a){var s=A.rr(a)
if(s!=null)return s
return"minified:"+a},
xR(a,b){var s
if(b!=null){s=b.x
if(s!=null)return s}return t.dX.b(a)},
A(a){var s
if(typeof a=="string")return a
if(typeof a=="number"){if(a!==0)return""+a}else if(!0===a)return"true"
else if(!1===a)return"false"
else if(a==null)return"null"
s=J.ev(a)
return s},
fz(a){var s,r=$.q0
if(r==null)r=$.q0=Symbol("identityHashCode")
s=a[r]
if(s==null){s=Math.random()*0x3fffffff|0
a[r]=s}return s},
uh(a,b){var s,r=/^\s*[+-]?((0x[a-f0-9]+)|(\d+)|([a-z0-9]+))\s*$/i.exec(a)
if(r==null)return null
if(3>=r.length)return A.a(r,3)
s=r[3]
if(s!=null)return parseInt(a,10)
if(r[2]!=null)return parseInt(a,16)
return null},
iv(a){var s,r,q,p
if(a instanceof A.S)return A.aW(A.be(a),null)
s=J.dp(a)
if(s===B.f0||s===B.f5||t.cx.b(a)){r=B.c0(a)
if(r!=="Object"&&r!=="")return r
q=a.constructor
if(typeof q=="function"){p=q.name
if(typeof p=="string"&&p!=="Object"&&p!=="")return p}}return A.aW(A.be(a),null)},
q1(a){var s,r,q
if(a==null||typeof a=="number"||A.oA(a))return J.ev(a)
if(typeof a=="string")return JSON.stringify(a)
if(a instanceof A.ce)return a.D(0)
if(a instanceof A.ba)return a.hr(!0)
s=$.t1()
for(r=0;r<1;++r){q=s[r].o3(a)
if(q!=null)return q}return"Instance of '"+A.iv(a)+"'"},
q_(a){var s,r,q,p,o=a.length
if(o<=500)return String.fromCharCode.apply(null,a)
for(s="",r=0;r<o;r=q){q=r+500
p=q<o?q:o
s+=String.fromCharCode.apply(null,a.slice(r,p))}return s},
ui(a){var s,r,q,p=A.j([],t.t)
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.K)(a),++r){q=a[r]
if(!A.jn(q))throw A.e(A.cc(q))
if(q<=65535)B.c.E(p,q)
else if(q<=1114111){B.c.E(p,55296+(B.a.j(q-65536,10)&1023))
B.c.E(p,56320+(q&1023))}else throw A.e(A.cc(q))}return A.q_(p)},
q2(a){var s,r,q
for(s=a.length,r=0;r<s;++r){q=a[r]
if(!A.jn(q))throw A.e(A.cc(q))
if(q<0)throw A.e(A.cc(q))
if(q>65535)return A.ui(a)}return A.q_(a)},
uj(a,b,c){var s,r,q,p
if(c<=500&&b===0&&c===a.length)return String.fromCharCode.apply(null,a)
for(s=b,r="";s<c;s=q){q=s+500
p=q<c?q:c
r+=String.fromCharCode.apply(null,a.subarray(s,p))}return r},
e2(a){var s
if(a<=65535)return String.fromCharCode(a)
if(a<=1114111){s=a-65536
return String.fromCharCode((B.a.j(s,10)|55296)>>>0,s&1023|56320)}throw A.e(A.a7(a,0,1114111,null,null))},
ug(a){var s=a.$thrownJsError
if(s==null)return null
return A.es(s)},
jy(a){throw A.e(A.cc(a))},
a(a,b){if(a==null)J.bz(a)
throw A.e(A.nn(a,b))},
nn(a,b){var s,r="index"
if(!A.jn(b))return new A.bg(!0,b,r,null)
s=A.r(J.bz(a))
if(b<0||b>=s)return A.hV(b,s,a,null,r)
return A.of(b,r)},
xw(a,b,c){if(a<0||a>c)return A.a7(a,0,c,"start",null)
if(b!=null)if(b<a||b>c)return A.a7(b,a,c,"end",null)
return new A.bg(!0,b,"end",null)},
cc(a){return new A.bg(!0,a,null,null)},
e(a){return A.ac(a,new Error())},
ac(a,b){var s
if(a==null)a=new A.bZ()
b.dartException=a
s=A.yi
if("defineProperty" in Object){Object.defineProperty(b,"message",{get:s})
b.name=""}else b.toString=s
return b},
yi(){return J.ev(this.dartException)},
a9(a,b){throw A.ac(a,b==null?new Error():b)},
b(a,b,c){var s
if(b==null)b=0
if(c==null)c=0
s=Error()
A.a9(A.wd(a,b,c),s)},
wd(a,b,c){var s,r,q,p,o,n,m,l,k
if(typeof b=="string")s=b
else{r="[]=;add;removeWhere;retainWhere;removeRange;setRange;setInt8;setInt16;setInt32;setUint8;setUint16;setUint32;setFloat32;setFloat64".split(";")
q=r.length
p=b
if(p>q){c=p/q|0
p%=q}s=r[p]}o=typeof c=="string"?c:"modify;remove from;add to".split(";")[c]
n=t.j.b(a)?"list":"ByteData"
m=a.$flags|0
l="a "
if((m&4)!==0)k="constant "
else if((m&2)!==0){k="unmodifiable "
l="an "}else k=(m&1)!==0?"fixed-length ":""
return new A.fL("'"+s+"': Cannot "+o+" "+l+k+n)},
K(a){throw A.e(A.b_(a))},
c_(a){var s,r,q,p,o,n
a=A.rl(a.replace(String({}),"$receiver$"))
s=a.match(/\\\$[a-zA-Z]+\\\$/g)
if(s==null)s=A.j([],t.s)
r=s.indexOf("\\$arguments\\$")
q=s.indexOf("\\$argumentsExpr\\$")
p=s.indexOf("\\$expr\\$")
o=s.indexOf("\\$method\\$")
n=s.indexOf("\\$receiver\\$")
return new A.ln(a.replace(new RegExp("\\\\\\$arguments\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$argumentsExpr\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$expr\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$method\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$receiver\\\\\\$","g"),"((?:x|[^x])*)"),r,q,p,o,n)},
lo(a){return function($expr$){var $argumentsExpr$="$arguments$"
try{$expr$.$method$($argumentsExpr$)}catch(s){return s.message}}(a)},
q9(a){return function($expr$){try{$expr$.$method$}catch(s){return s.message}}(a)},
nZ(a,b){var s=b==null,r=s?null:b.method
return new A.id(a,r,s?null:b.receiver)},
bx(a){var s
if(a==null)return new A.kK(a)
if(a instanceof A.eG){s=a.a
return A.cD(a,s==null?A.ef(s):s)}if(typeof a!=="object")return a
if("dartException" in a)return A.cD(a,a.dartException)
return A.x9(a)},
cD(a,b){if(t.e.b(b))if(b.$thrownJsError==null)b.$thrownJsError=a
return b},
x9(a){var s,r,q,p,o,n,m,l,k,j,i,h,g
if(!("message" in a))return a
s=a.message
if("number" in a&&typeof a.number=="number"){r=a.number
q=r&65535
if((B.a.j(r,16)&8191)===10)switch(q){case 438:return A.cD(a,A.nZ(A.A(s)+" (Error "+q+")",null))
case 445:case 5007:A.A(s)
return A.cD(a,new A.fo())}}if(a instanceof TypeError){p=$.ry()
o=$.rz()
n=$.rA()
m=$.rB()
l=$.rE()
k=$.rF()
j=$.rD()
$.rC()
i=$.rH()
h=$.rG()
g=p.bP(s)
if(g!=null)return A.cD(a,A.nZ(A.bs(s),g))
else{g=o.bP(s)
if(g!=null){g.method="call"
return A.cD(a,A.nZ(A.bs(s),g))}else if(n.bP(s)!=null||m.bP(s)!=null||l.bP(s)!=null||k.bP(s)!=null||j.bP(s)!=null||m.bP(s)!=null||i.bP(s)!=null||h.bP(s)!=null){A.bs(s)
return A.cD(a,new A.fo())}}return A.cD(a,new A.iQ(typeof s=="string"?s:""))}if(a instanceof RangeError){if(typeof s=="string"&&s.indexOf("call stack")!==-1)return new A.fG()
s=function(b){try{return String(b)}catch(f){}return null}(a)
return A.cD(a,new A.bg(!1,null,null,typeof s=="string"?s.replace(/^RangeError:\s*/,""):s))}if(typeof InternalError=="function"&&a instanceof InternalError)if(typeof s=="string"&&s==="too much recursion")return new A.fG()
return a},
es(a){var s
if(a instanceof A.eG)return a.b
if(a==null)return new A.hb(a)
s=a.$cachedTrace
if(s!=null)return s
s=new A.hb(a)
if(typeof a==="object")a.$cachedTrace=s
return s},
oP(a){if(a==null)return J.by(a)
if(typeof a=="object")return A.fz(a)
return J.by(a)},
xo(a){if(typeof a=="number")return B.b.gK(a)
if(a instanceof A.jg)return A.fz(a)
if(a instanceof A.ba)return a.gK(a)
return A.oP(a)},
r5(a,b){var s,r,q,p=a.length
for(s=0;s<p;s=q){r=s+1
q=r+1
b.i(0,a[s],a[r])}return b},
wu(a,b,c,d,e,f){t.Z.a(a)
switch(A.r(b)){case 0:return a.$0()
case 1:return a.$1(c)
case 2:return a.$2(c,d)
case 3:return a.$3(c,d,e)
case 4:return a.$4(c,d,e,f)}throw A.e(A.pi("Unsupported number of arguments for wrapped closure"))},
jt(a,b){var s=a.$identity
if(!!s)return s
s=A.xp(a,b)
a.$identity=s
return s},
xp(a,b){var s
switch(b){case 0:s=a.$0
break
case 1:s=a.$1
break
case 2:s=a.$2
break
case 3:s=a.$3
break
case 4:s=a.$4
break
default:s=null}if(s!=null)return s.bind(a)
return function(c,d,e){return function(f,g,h,i){return e(c,d,f,g,h,i)}}(a,b,A.wu)},
tq(a2){var s,r,q,p,o,n,m,l,k,j,i=a2.co,h=a2.iS,g=a2.iI,f=a2.nDA,e=a2.aI,d=a2.fs,c=a2.cs,b=d[0],a=c[0],a0=i[b],a1=a2.fT
a1.toString
s=h?Object.create(new A.iK().constructor.prototype):Object.create(new A.dr(null,null).constructor.prototype)
s.$initialize=s.constructor
r=h?function static_tear_off(){this.$initialize()}:function tear_off(a3,a4){this.$initialize(a3,a4)}
s.constructor=r
r.prototype=s
s.$_name=b
s.$_target=a0
q=!h
if(q)p=A.pf(b,a0,g,f)
else{s.$static_name=b
p=a0}s.$S=A.tm(a1,h,g)
s[a]=p
for(o=p,n=1;n<d.length;++n){m=d[n]
if(typeof m=="string"){l=i[m]
k=m
m=l}else k=""
j=c[n]
if(j!=null){if(q)m=A.pf(k,m,g,f)
s[j]=m}if(n===e)o=m}s.$C=o
s.$R=a2.rC
s.$D=a2.dV
return r},
tm(a,b,c){if(typeof a=="number")return a
if(typeof a=="string"){if(b)throw A.e("Cannot compute signature for static tearoff.")
return function(d,e){return function(){return e(this,d)}}(a,A.th)}throw A.e("Error in functionType of tearoff")},
tn(a,b,c,d){var s=A.pe
switch(b?-1:a){case 0:return function(e,f){return function(){return f(this)[e]()}}(c,s)
case 1:return function(e,f){return function(g){return f(this)[e](g)}}(c,s)
case 2:return function(e,f){return function(g,h){return f(this)[e](g,h)}}(c,s)
case 3:return function(e,f){return function(g,h,i){return f(this)[e](g,h,i)}}(c,s)
case 4:return function(e,f){return function(g,h,i,j){return f(this)[e](g,h,i,j)}}(c,s)
case 5:return function(e,f){return function(g,h,i,j,k){return f(this)[e](g,h,i,j,k)}}(c,s)
default:return function(e,f){return function(){return e.apply(f(this),arguments)}}(d,s)}},
pf(a,b,c,d){if(c)return A.tp(a,b,d)
return A.tn(b.length,d,a,b)},
to(a,b,c,d){var s=A.pe,r=A.ti
switch(b?-1:a){case 0:throw A.e(new A.iJ("Intercepted function with no arguments."))
case 1:return function(e,f,g){return function(){return f(this)[e](g(this))}}(c,r,s)
case 2:return function(e,f,g){return function(h){return f(this)[e](g(this),h)}}(c,r,s)
case 3:return function(e,f,g){return function(h,i){return f(this)[e](g(this),h,i)}}(c,r,s)
case 4:return function(e,f,g){return function(h,i,j){return f(this)[e](g(this),h,i,j)}}(c,r,s)
case 5:return function(e,f,g){return function(h,i,j,k){return f(this)[e](g(this),h,i,j,k)}}(c,r,s)
case 6:return function(e,f,g){return function(h,i,j,k,l){return f(this)[e](g(this),h,i,j,k,l)}}(c,r,s)
default:return function(e,f,g){return function(){var q=[g(this)]
Array.prototype.push.apply(q,arguments)
return e.apply(f(this),q)}}(d,r,s)}},
tp(a,b,c){var s,r
if($.pc==null)$.pc=A.pb("interceptor")
if($.pd==null)$.pd=A.pb("receiver")
s=b.length
r=A.to(s,c,a,b)
return r},
oI(a){return A.tq(a)},
th(a,b){return A.hg(v.typeUniverse,A.be(a.a),b)},
pe(a){return a.a},
ti(a){return a.b},
pb(a){var s,r,q,p=new A.dr("receiver","interceptor"),o=Object.getOwnPropertyNames(p)
o.$flags=1
s=o
for(o=s.length,r=0;r<o;++r){q=s[r]
if(p[q]===a)return q}throw A.e(A.aJ("Field name "+a+" not found.",null))},
ns(a){return v.getIsolateTag(a)},
A9(a,b,c){Object.defineProperty(a,b,{value:c,enumerable:false,writable:true,configurable:true})},
xT(a){var s,r,q,p,o,n=A.bs($.ra.$1(a)),m=$.no[n]
if(m!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}s=$.ny[n]
if(s!=null)return s
r=v.interceptorsByTag[n]
if(r==null){q=A.qF($.qZ.$2(a,n))
if(q!=null){m=$.no[q]
if(m!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}s=$.ny[q]
if(s!=null)return s
r=v.interceptorsByTag[q]
n=q}}if(r==null)return null
s=r.prototype
p=n[0]
if(p==="!"){m=A.nA(s)
$.no[n]=m
Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}if(p==="~"){$.ny[n]=s
return s}if(p==="-"){o=A.nA(s)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:o,enumerable:false,writable:true,configurable:true})
return o.i}if(p==="+")return A.rg(a,s)
if(p==="*")throw A.e(A.qb(n))
if(v.leafTags[n]===true){o=A.nA(s)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:o,enumerable:false,writable:true,configurable:true})
return o.i}else return A.rg(a,s)},
rg(a,b){var s=Object.getPrototypeOf(a)
Object.defineProperty(s,v.dispatchPropertyName,{value:J.oO(b,s,null,null),enumerable:false,writable:true,configurable:true})
return b},
nA(a){return J.oO(a,!1,null,!!a.$iaS)},
xV(a,b,c){var s=b.prototype
if(v.leafTags[a]===true)return A.nA(s)
else return J.oO(s,c,null,null)},
xO(){if(!0===$.oL)return
$.oL=!0
A.xP()},
xP(){var s,r,q,p,o,n,m,l
$.no=Object.create(null)
$.ny=Object.create(null)
A.xN()
s=v.interceptorsByTag
r=Object.getOwnPropertyNames(s)
if(typeof window!="undefined"){window
q=function(){}
for(p=0;p<r.length;++p){o=r[p]
n=$.rj.$1(o)
if(n!=null){m=A.xV(o,s[o],n)
if(m!=null){Object.defineProperty(n,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
q.prototype=n}}}}for(p=0;p<r.length;++p){o=r[p]
if(/^[A-Za-z_]/.test(o)){l=s[o]
s["!"+o]=l
s["~"+o]=l
s["-"+o]=l
s["+"+o]=l
s["*"+o]=l}}},
xN(){var s,r,q,p,o,n,m=B.eb()
m=A.eo(B.ec,A.eo(B.ed,A.eo(B.c1,A.eo(B.c1,A.eo(B.ee,A.eo(B.ef,A.eo(B.eg(B.c0),m)))))))
if(typeof dartNativeDispatchHooksTransformer!="undefined"){s=dartNativeDispatchHooksTransformer
if(typeof s=="function")s=[s]
if(Array.isArray(s))for(r=0;r<s.length;++r){q=s[r]
if(typeof q=="function")m=q(m)||m}}p=m.getTag
o=m.getUnknownTag
n=m.prototypeForTag
$.ra=new A.nv(p)
$.qZ=new A.nw(o)
$.rj=new A.nx(n)},
eo(a,b){return a(b)||b},
xu(a,b){var s=b.length,r=v.rttc[""+s+";"+a]
if(r==null)return null
if(s===0)return r
if(s===r.length)return r.apply(null,b)
return r(b)},
pG(a,b,c,d,e,f){var s=b?"m":"",r=c?"":"i",q=d?"u":"",p=e?"s":"",o=function(g,h){try{return new RegExp(g,h)}catch(n){return n}}(a,s+r+q+p+f)
if(o instanceof RegExp)return o
throw A.e(A.k4("Illegal RegExp pattern ("+String(o)+")",a,null))},
ya(a,b,c){var s=a.indexOf(b,c)
return s>=0},
r4(a){if(a.indexOf("$",0)>=0)return a.replace(/\$/g,"$$$$")
return a},
rl(a){if(/[[\]{}()*+?.\\^$|]/.test(a))return a.replace(/[[\]{}()*+?.\\^$|]/g,"\\$&")
return a},
nE(a,b,c){var s
if(typeof b=="string")return A.yc(a,b,c)
if(b instanceof A.dT){s=b.gh1()
s.lastIndex=0
return a.replace(s,A.r4(c))}return A.yb(a,b,c)},
yb(a,b,c){var s,r,q,p
for(s=J.p5(b,a),s=s.gF(s),r=0,q="";s.C();){p=s.gN()
q=q+a.substring(r,p.ge1())+c
r=p.gdP()}s=q+a.substring(r)
return s.charCodeAt(0)==0?s:s},
yc(a,b,c){var s,r,q
if(b===""){if(a==="")return c
s=a.length
for(r=c,q=0;q<s;++q)r=r+a[q]+c
return r.charCodeAt(0)==0?r:r}if(a.indexOf(b,0)<0)return a
if(a.length<500||c.indexOf("$",0)>=0)return a.split(b).join(c)
return a.replace(new RegExp(A.rl(b),"g"),A.r4(c))},
yd(a,b,c,d){var s=a.indexOf(b,d)
if(s<0)return a
return A.ye(a,s,s+b.length,c)},
ye(a,b,c,d){return a.substring(0,b)+d+a.substring(c)},
bI:function bI(a,b){this.a=a
this.b=b},
dl:function dl(a,b){this.a=a
this.b=b},
ed:function ed(a,b,c){this.a=a
this.b=b
this.c=c},
h9:function h9(a,b,c){this.a=a
this.b=b
this.c=c},
dF:function dF(){},
eC:function eC(a,b,c){this.a=a
this.b=b
this.$ti=c},
h0:function h0(a,b){this.a=a
this.$ti=b},
c7:function c7(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
bm:function bm(a,b){this.a=a
this.$ti=b},
dG:function dG(){},
cH:function cH(a,b,c){this.a=a
this.b=b
this.$ti=c},
aQ:function aQ(a,b){this.a=a
this.$ti=b},
fD:function fD(){},
ln:function ln(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
fo:function fo(){},
id:function id(a,b,c){this.a=a
this.b=b
this.c=c},
iQ:function iQ(a){this.a=a},
kK:function kK(a){this.a=a},
eG:function eG(a,b){this.a=a
this.b=b},
hb:function hb(a){this.a=a
this.b=null},
ce:function ce(){},
hw:function hw(){},
hx:function hx(){},
iM:function iM(){},
iK:function iK(){},
dr:function dr(a,b){this.a=a
this.b=b},
iJ:function iJ(a){this.a=a},
bo:function bo(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
kF:function kF(a,b){var _=this
_.a=a
_.b=b
_.d=_.c=null},
fc:function fc(a,b){this.a=a
this.$ti=b},
a1:function a1(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
kG:function kG(a,b){this.a=a
this.$ti=b},
at:function at(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
fa:function fa(a,b){this.a=a
this.$ti=b},
fb:function fb(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
cQ:function cQ(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
nv:function nv(a){this.a=a},
nw:function nw(a){this.a=a},
nx:function nx(a){this.a=a},
ba:function ba(){},
dj:function dj(){},
dk:function dk(){},
dT:function dT(a,b){var _=this
_.a=a
_.b=b
_.e=_.d=_.c=null},
h3:function h3(a){this.b=a},
j_:function j_(a,b,c){this.a=a
this.b=b
this.c=c},
j0:function j0(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.d=null},
iL:function iL(a,b){this.a=a
this.c=b},
jc:function jc(a,b,c){this.a=a
this.b=b
this.c=c},
jd:function jd(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.d=null},
yg(a){throw A.ac(A.pJ(a),new Error())},
c(){throw A.ac(A.kC(""),new Error())},
B(){throw A.ac(A.tU(""),new Error())},
oR(){throw A.ac(A.pJ(""),new Error())},
qk(){var s=new A.m8()
return s.b=s},
m8:function m8(){this.b=null},
aE(a,b,c){},
o(a){var s,r,q
if(t.iy.b(a))return a
s=J.ab(a)
r=A.N(s.gp(a),null,!1,t.z)
for(q=0;q<s.gp(a);++q)B.c.i(r,q,s.l(a,q))
return r},
u_(a,b,c){A.aE(a,b,c)
return c==null?new DataView(a,b):new DataView(a,b,c)},
u0(a){return new Float32Array(a)},
u1(a,b,c){A.aE(a,b,c)
c=B.a.P(a.byteLength-b,4)
return new Float32Array(a,b,c)},
u2(a,b,c){A.aE(a,b,c)
c=B.a.P(a.byteLength-b,2)
return new Int16Array(a,b,c)},
pN(a){return new Int32Array(a)},
u3(a,b,c){A.aE(a,b,c)
c=B.a.P(a.byteLength-b,4)
return new Int32Array(a,b,c)},
pO(a){return new Int8Array(a)},
u4(a,b,c){A.aE(a,b,c)
return c==null?new Int8Array(a,b):new Int8Array(a,b,c)},
pP(a){return new Uint16Array(a)},
u5(a){return new Uint16Array(A.o(a))},
u6(a,b,c){A.aE(a,b,c)
c=B.a.P(a.byteLength-b,2)
return new Uint16Array(a,b,c)},
u7(a){return new Uint32Array(a)},
u8(a,b,c){A.aE(a,b,c)
if(c==null)c=B.a.P(a.byteLength-b,4)
return new Uint32Array(a,b,c)},
e_(a){return new Uint8Array(a)},
o3(a){return new Uint8Array(A.o(a))},
u9(a,b,c){A.aE(a,b,c)
return c==null?new Uint8Array(a,b):new Uint8Array(a,b,c)},
ca(a,b,c){if(a>>>0!==a||a>=c)throw A.e(A.nn(b,a))},
ji(a,b,c){var s
if(!(a>>>0!==a))if(b==null)s=a>c
else s=b>>>0!==b||a>b||b>c
else s=!0
if(s)throw A.e(A.xw(a,b,c))
if(b==null)return c
return b},
cS:function cS(){},
fk:function fk(){},
mB:function mB(a){this.a=a},
ih:function ih(){},
ak:function ak(){},
cs:function cs(){},
aT:function aT(){},
ff:function ff(){},
fg:function fg(){},
fh:function fh(){},
fi:function fi(){},
fj:function fj(){},
fl:function fl(){},
fm:function fm(){},
fn:function fn(){},
cT:function cT(){},
h4:function h4(){},
h5:function h5(){},
h6:function h6(){},
h7:function h7(){},
og(a,b){var s=b.c
return s==null?b.c=A.he(a,"bB",[b.x]):s},
q5(a){var s=a.w
if(s===6||s===7)return A.q5(a.x)
return s===11||s===12},
up(a){return a.as},
X(a){return A.mA(v.typeUniverse,a,!1)},
dm(a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=a2.w
switch(a0){case 5:case 1:case 2:case 3:case 4:return a2
case 6:s=a2.x
r=A.dm(a1,s,a3,a4)
if(r===s)return a2
return A.qs(a1,r,!0)
case 7:s=a2.x
r=A.dm(a1,s,a3,a4)
if(r===s)return a2
return A.qr(a1,r,!0)
case 8:q=a2.y
p=A.em(a1,q,a3,a4)
if(p===q)return a2
return A.he(a1,a2.x,p)
case 9:o=a2.x
n=A.dm(a1,o,a3,a4)
m=a2.y
l=A.em(a1,m,a3,a4)
if(n===o&&l===m)return a2
return A.ot(a1,n,l)
case 10:k=a2.x
j=a2.y
i=A.em(a1,j,a3,a4)
if(i===j)return a2
return A.qt(a1,k,i)
case 11:h=a2.x
g=A.dm(a1,h,a3,a4)
f=a2.y
e=A.x4(a1,f,a3,a4)
if(g===h&&e===f)return a2
return A.qq(a1,g,e)
case 12:d=a2.y
a4+=d.length
c=A.em(a1,d,a3,a4)
o=a2.x
n=A.dm(a1,o,a3,a4)
if(c===d&&n===o)return a2
return A.ou(a1,n,c,!0)
case 13:b=a2.x
if(b<a4)return a2
a=a3[b-a4]
if(a==null)return a2
return a
default:throw A.e(A.ht("Attempted to substitute unexpected RTI kind "+a0))}},
em(a,b,c,d){var s,r,q,p,o=b.length,n=A.mF(o)
for(s=!1,r=0;r<o;++r){q=b[r]
p=A.dm(a,q,c,d)
if(p!==q)s=!0
n[r]=p}return s?n:b},
x5(a,b,c,d){var s,r,q,p,o,n,m=b.length,l=A.mF(m)
for(s=!1,r=0;r<m;r+=3){q=b[r]
p=b[r+1]
o=b[r+2]
n=A.dm(a,o,c,d)
if(n!==o)s=!0
l.splice(r,3,q,p,n)}return s?l:b},
x4(a,b,c,d){var s,r=b.a,q=A.em(a,r,c,d),p=b.b,o=A.em(a,p,c,d),n=b.c,m=A.x5(a,n,c,d)
if(q===r&&o===p&&m===n)return b
s=new A.j6()
s.a=q
s.b=o
s.c=m
return s},
j(a,b){a[v.arrayRti]=b
return a},
r2(a){var s=a.$S
if(s!=null){if(typeof s=="number")return A.xL(s)
return a.$S()}return null},
xQ(a,b){var s
if(A.q5(b))if(a instanceof A.ce){s=A.r2(a)
if(s!=null)return s}return A.be(a)},
be(a){if(a instanceof A.S)return A.m(a)
if(Array.isArray(a))return A.al(a)
return A.oz(J.dp(a))},
al(a){var s=a[v.arrayRti],r=t.dG
if(s==null)return r
if(s.constructor!==r.constructor)return r
return s},
m(a){var s=a.$ti
return s!=null?s:A.oz(a)},
oz(a){var s=a.constructor,r=s.$ccache
if(r!=null)return r
return A.ws(a,s)},
ws(a,b){var s=a instanceof A.ce?Object.getPrototypeOf(Object.getPrototypeOf(a)).constructor:b,r=A.vL(v.typeUniverse,s.name)
b.$ccache=r
return r},
xL(a){var s,r=v.types,q=r[a]
if(typeof q=="string"){s=A.mA(v.typeUniverse,q,!1)
r[a]=s
return s}return q},
xJ(a){return A.dn(A.m(a))},
oG(a){var s
if(a instanceof A.ba)return A.xA(a.$r,a.eq())
s=a instanceof A.ce?A.r2(a):null
if(s!=null)return s
if(t.aJ.b(a))return J.tb(a).a
if(Array.isArray(a))return A.al(a)
return A.be(a)},
dn(a){var s=a.r
return s==null?a.r=new A.jg(a):s},
xA(a,b){var s,r,q=b,p=q.length
if(p===0)return t.aK
if(0>=p)return A.a(q,0)
s=A.hg(v.typeUniverse,A.oG(q[0]),"@<0>")
for(r=1;r<p;++r){if(!(r<q.length))return A.a(q,r)
s=A.qv(v.typeUniverse,s,A.oG(q[r]))}return A.hg(v.typeUniverse,s,a)},
bw(a){return A.dn(A.mA(v.typeUniverse,a,!1))},
wr(a){var s=this
s.b=A.x2(s)
return s.b(a)},
x2(a){var s,r,q,p,o
if(a===t.K)return A.wD
if(A.dq(a))return A.wH
s=a.w
if(s===6)return A.wn
if(s===1)return A.qN
if(s===7)return A.ww
r=A.x1(a)
if(r!=null)return r
if(s===8){q=a.x
if(a.y.every(A.dq)){a.f="$i"+q
if(q==="q")return A.wA
if(a===t.m)return A.wz
return A.wG}}else if(s===10){p=A.xu(a.x,a.y)
o=p==null?A.qN:p
return o==null?A.ef(o):o}return A.wl},
x1(a){if(a.w===8){if(a===t.p)return A.jn
if(a===t.V||a===t.X)return A.wC
if(a===t.N)return A.wF
if(a===t.y)return A.oA}return null},
wq(a){var s=this,r=A.wk
if(A.dq(s))r=A.vY
else if(s===t.K)r=A.ef
else if(A.et(s)){r=A.wm
if(s===t.I)r=A.vW
else if(s===t.jv)r=A.qF
else if(s===t.fU)r=A.vU
else if(s===t.jh)r=A.qE
else if(s===t.jX)r=A.vV
else if(s===t.mU)r=A.vX}else if(s===t.p)r=A.r
else if(s===t.N)r=A.bs
else if(s===t.y)r=A.vT
else if(s===t.X)r=A.ov
else if(s===t.V)r=A.qD
else if(s===t.m)r=A.jh
s.a=r
return s.a(a)},
wl(a){var s=this
if(a==null)return A.et(s)
return A.xS(v.typeUniverse,A.xQ(a,s),s)},
wn(a){if(a==null)return!0
return this.x.b(a)},
wG(a){var s,r=this
if(a==null)return A.et(r)
s=r.f
if(a instanceof A.S)return!!a[s]
return!!J.dp(a)[s]},
wA(a){var s,r=this
if(a==null)return A.et(r)
if(typeof a!="object")return!1
if(Array.isArray(a))return!0
s=r.f
if(a instanceof A.S)return!!a[s]
return!!J.dp(a)[s]},
wz(a){var s=this
if(a==null)return!1
if(typeof a=="object"){if(a instanceof A.S)return!!a[s.f]
return!0}if(typeof a=="function")return!0
return!1},
qM(a){if(typeof a=="object"){if(a instanceof A.S)return t.m.b(a)
return!0}if(typeof a=="function")return!0
return!1},
wk(a){var s=this
if(a==null){if(A.et(s))return a}else if(s.b(a))return a
throw A.ac(A.qI(a,s),new Error())},
wm(a){var s=this
if(a==null||s.b(a))return a
throw A.ac(A.qI(a,s),new Error())},
qI(a,b){return new A.hc("TypeError: "+A.ql(a,A.aW(b,null)))},
ql(a,b){return A.jX(a)+": type '"+A.aW(A.oG(a),null)+"' is not a subtype of type '"+b+"'"},
bb(a,b){return new A.hc("TypeError: "+A.ql(a,b))},
ww(a){var s=this
return s.x.b(a)||A.og(v.typeUniverse,s).b(a)},
wD(a){return a!=null},
ef(a){if(a!=null)return a
throw A.ac(A.bb(a,"Object"),new Error())},
wH(a){return!0},
vY(a){return a},
qN(a){return!1},
oA(a){return!0===a||!1===a},
vT(a){if(!0===a)return!0
if(!1===a)return!1
throw A.ac(A.bb(a,"bool"),new Error())},
vU(a){if(!0===a)return!0
if(!1===a)return!1
if(a==null)return a
throw A.ac(A.bb(a,"bool?"),new Error())},
qD(a){if(typeof a=="number")return a
throw A.ac(A.bb(a,"double"),new Error())},
vV(a){if(typeof a=="number")return a
if(a==null)return a
throw A.ac(A.bb(a,"double?"),new Error())},
jn(a){return typeof a=="number"&&Math.floor(a)===a},
r(a){if(typeof a=="number"&&Math.floor(a)===a)return a
throw A.ac(A.bb(a,"int"),new Error())},
vW(a){if(typeof a=="number"&&Math.floor(a)===a)return a
if(a==null)return a
throw A.ac(A.bb(a,"int?"),new Error())},
wC(a){return typeof a=="number"},
ov(a){if(typeof a=="number")return a
throw A.ac(A.bb(a,"num"),new Error())},
qE(a){if(typeof a=="number")return a
if(a==null)return a
throw A.ac(A.bb(a,"num?"),new Error())},
wF(a){return typeof a=="string"},
bs(a){if(typeof a=="string")return a
throw A.ac(A.bb(a,"String"),new Error())},
qF(a){if(typeof a=="string")return a
if(a==null)return a
throw A.ac(A.bb(a,"String?"),new Error())},
jh(a){if(A.qM(a))return a
throw A.ac(A.bb(a,"JSObject"),new Error())},
vX(a){if(a==null)return a
if(A.qM(a))return a
throw A.ac(A.bb(a,"JSObject?"),new Error())},
qT(a,b){var s,r,q
for(s="",r="",q=0;q<a.length;++q,r=", ")s+=r+A.aW(a[q],b)
return s},
wN(a,b){var s,r,q,p,o,n,m=a.x,l=a.y
if(""===m)return"("+A.qT(l,b)+")"
s=l.length
r=m.split(",")
q=r.length-s
for(p="(",o="",n=0;n<s;++n,o=", "){p+=o
if(q===0)p+="{"
p+=A.aW(l[n],b)
if(q>=0)p+=" "+r[q];++q}return p+"})"},
qK(a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1=", ",a2=null
if(a5!=null){s=a5.length
if(a4==null)a4=A.j([],t.s)
else a2=a4.length
r=a4.length
for(q=s;q>0;--q)B.c.E(a4,"T"+(r+q))
for(p=t.iD,o="<",n="",q=0;q<s;++q,n=a1){m=a4.length
l=m-1-q
if(!(l>=0))return A.a(a4,l)
o=o+n+a4[l]
k=a5[q]
j=k.w
if(!(j===2||j===3||j===4||j===5||k===p))o+=" extends "+A.aW(k,a4)}o+=">"}else o=""
p=a3.x
i=a3.y
h=i.a
g=h.length
f=i.b
e=f.length
d=i.c
c=d.length
b=A.aW(p,a4)
for(a="",a0="",q=0;q<g;++q,a0=a1)a+=a0+A.aW(h[q],a4)
if(e>0){a+=a0+"["
for(a0="",q=0;q<e;++q,a0=a1)a+=a0+A.aW(f[q],a4)
a+="]"}if(c>0){a+=a0+"{"
for(a0="",q=0;q<c;q+=3,a0=a1){a+=a0
if(d[q+1])a+="required "
a+=A.aW(d[q+2],a4)+" "+d[q]}a+="}"}if(a2!=null){a4.toString
a4.length=a2}return o+"("+a+") => "+b},
aW(a,b){var s,r,q,p,o,n,m,l=a.w
if(l===5)return"erased"
if(l===2)return"dynamic"
if(l===3)return"void"
if(l===1)return"Never"
if(l===4)return"any"
if(l===6){s=a.x
r=A.aW(s,b)
q=s.w
return(q===11||q===12?"("+r+")":r)+"?"}if(l===7)return"FutureOr<"+A.aW(a.x,b)+">"
if(l===8){p=A.x8(a.x)
o=a.y
return o.length>0?p+("<"+A.qT(o,b)+">"):p}if(l===10)return A.wN(a,b)
if(l===11)return A.qK(a,b,null)
if(l===12)return A.qK(a.x,b,a.y)
if(l===13){n=a.x
m=b.length
n=m-1-n
if(!(n>=0&&n<m))return A.a(b,n)
return b[n]}return"?"},
x8(a){var s=A.rr(a)
if(s!=null)return s
return"minified:"+a},
vM(a,b){var s=a.tR[b]
while(typeof s=="string")s=a.tR[s]
return s},
vL(a,b){var s,r,q,p,o,n=a.eT,m=n[b]
if(m==null)return A.mA(a,b,!1)
else if(typeof m=="number"){s=m
r=A.hf(a,5,"#")
q=A.mF(s)
for(p=0;p<s;++p)q[p]=r
o=A.he(a,b,q)
n[b]=o
return o}else return m},
vK(a,b){return A.qx(a.tR,b)},
vJ(a,b){return A.qx(a.eT,b)},
mA(a,b,c){var s,r=a.eC,q=r.get(b)
if(q!=null)return q
s=A.qu(a,null,b,!1)
r.set(b,s)
return s},
hg(a,b,c){var s,r,q=b.z
if(q==null)q=b.z=new Map()
s=q.get(c)
if(s!=null)return s
r=A.qu(a,b,c,!0)
q.set(c,r)
return r},
qv(a,b,c){var s,r,q,p=b.Q
if(p==null)p=b.Q=new Map()
s=c.as
r=p.get(s)
if(r!=null)return r
q=A.ot(a,b,c.w===9?c.y:[c])
p.set(s,q)
return q},
qu(a,b,c,d){return A.vB(A.vv(a,b,c,d))},
cB(a,b){b.a=A.wq
b.b=A.wr
return b},
hf(a,b,c){var s,r,q=a.eC.get(c)
if(q!=null)return q
s=new A.bq(null,null)
s.w=b
s.as=c
r=A.cB(a,s)
a.eC.set(c,r)
return r},
qs(a,b,c){var s,r=b.as+"?",q=a.eC.get(r)
if(q!=null)return q
s=A.vH(a,b,r,c)
a.eC.set(r,s)
return s},
vH(a,b,c,d){var s,r,q
if(d){s=b.w
r=!0
if(!A.dq(b))if(!(b===t.b||b===t.v))if(s!==6)r=s===7&&A.et(b.x)
if(r)return b
else if(s===1)return t.b}q=new A.bq(null,null)
q.w=6
q.x=b
q.as=c
return A.cB(a,q)},
qr(a,b,c){var s,r=b.as+"/",q=a.eC.get(r)
if(q!=null)return q
s=A.vF(a,b,r,c)
a.eC.set(r,s)
return s},
vF(a,b,c,d){var s,r
if(d){s=b.w
if(A.dq(b)||b===t.K)return b
else if(s===1)return A.he(a,"bB",[b])
else if(b===t.b||b===t.v)return t.gK}r=new A.bq(null,null)
r.w=7
r.x=b
r.as=c
return A.cB(a,r)},
vI(a,b){var s,r,q=""+b+"^",p=a.eC.get(q)
if(p!=null)return p
s=new A.bq(null,null)
s.w=13
s.x=b
s.as=q
r=A.cB(a,s)
a.eC.set(q,r)
return r},
hd(a){var s,r,q,p=a.length
for(s="",r="",q=0;q<p;++q,r=",")s+=r+a[q].as
return s},
vE(a){var s,r,q,p,o,n=a.length
for(s="",r="",q=0;q<n;q+=3,r=","){p=a[q]
o=a[q+1]?"!":":"
s+=r+p+o+a[q+2].as}return s},
he(a,b,c){var s,r,q,p=b
if(c.length>0)p+="<"+A.hd(c)+">"
s=a.eC.get(p)
if(s!=null)return s
r=new A.bq(null,null)
r.w=8
r.x=b
r.y=c
if(c.length>0)r.c=c[0]
r.as=p
q=A.cB(a,r)
a.eC.set(p,q)
return q},
ot(a,b,c){var s,r,q,p,o,n
if(b.w===9){s=b.x
r=b.y.concat(c)}else{r=c
s=b}q=s.as+(";<"+A.hd(r)+">")
p=a.eC.get(q)
if(p!=null)return p
o=new A.bq(null,null)
o.w=9
o.x=s
o.y=r
o.as=q
n=A.cB(a,o)
a.eC.set(q,n)
return n},
qt(a,b,c){var s,r,q="+"+(b+"("+A.hd(c)+")"),p=a.eC.get(q)
if(p!=null)return p
s=new A.bq(null,null)
s.w=10
s.x=b
s.y=c
s.as=q
r=A.cB(a,s)
a.eC.set(q,r)
return r},
qq(a,b,c){var s,r,q,p,o,n=b.as,m=c.a,l=m.length,k=c.b,j=k.length,i=c.c,h=i.length,g="("+A.hd(m)
if(j>0){s=l>0?",":""
g+=s+"["+A.hd(k)+"]"}if(h>0){s=l>0?",":""
g+=s+"{"+A.vE(i)+"}"}r=n+(g+")")
q=a.eC.get(r)
if(q!=null)return q
p=new A.bq(null,null)
p.w=11
p.x=b
p.y=c
p.as=r
o=A.cB(a,p)
a.eC.set(r,o)
return o},
ou(a,b,c,d){var s,r=b.as+("<"+A.hd(c)+">"),q=a.eC.get(r)
if(q!=null)return q
s=A.vG(a,b,c,r,d)
a.eC.set(r,s)
return s},
vG(a,b,c,d,e){var s,r,q,p,o,n,m,l
if(e){s=c.length
r=A.mF(s)
for(q=0,p=0;p<s;++p){o=c[p]
if(o.w===1){r[p]=o;++q}}if(q>0){n=A.dm(a,b,r,0)
m=A.em(a,c,r,0)
return A.ou(a,n,m,c!==m)}}l=new A.bq(null,null)
l.w=12
l.x=b
l.y=c
l.as=d
return A.cB(a,l)},
vv(a,b,c,d){return{u:a,e:b,r:c,s:[],p:0,n:d}},
vB(a){var s,r,q,p,o,n,m,l=a.r,k=a.s
for(s=l.length,r=0;r<s;){q=l.charCodeAt(r)
if(q>=48&&q<=57)r=A.vx(r+1,q,l,k)
else if((((q|32)>>>0)-97&65535)<26||q===95||q===36||q===124)r=A.qo(a,r,l,k,!1)
else if(q===46)r=A.qo(a,r,l,k,!0)
else{++r
switch(q){case 44:break
case 58:k.push(!1)
break
case 33:k.push(!0)
break
case 59:k.push(A.di(a.u,a.e,k.pop()))
break
case 94:k.push(A.vI(a.u,k.pop()))
break
case 35:k.push(A.hf(a.u,5,"#"))
break
case 64:k.push(A.hf(a.u,2,"@"))
break
case 126:k.push(A.hf(a.u,3,"~"))
break
case 60:k.push(a.p)
a.p=k.length
break
case 62:A.vz(a,k)
break
case 38:A.vy(a,k)
break
case 63:p=a.u
k.push(A.qs(p,A.di(p,a.e,k.pop()),a.n))
break
case 47:p=a.u
k.push(A.qr(p,A.di(p,a.e,k.pop()),a.n))
break
case 40:k.push(-3)
k.push(a.p)
a.p=k.length
break
case 41:A.vw(a,k)
break
case 91:k.push(a.p)
a.p=k.length
break
case 93:o=k.splice(a.p)
A.qp(a.u,a.e,o)
a.p=k.pop()
k.push(o)
k.push(-1)
break
case 123:k.push(a.p)
a.p=k.length
break
case 125:o=k.splice(a.p)
A.vC(a.u,a.e,o)
a.p=k.pop()
k.push(o)
k.push(-2)
break
case 43:n=l.indexOf("(",r)
k.push(l.substring(r,n))
k.push(-4)
k.push(a.p)
a.p=k.length
r=n+1
break
default:throw"Bad character "+q}}}m=k.pop()
return A.di(a.u,a.e,m)},
vx(a,b,c,d){var s,r,q=b-48
for(s=c.length;a<s;++a){r=c.charCodeAt(a)
if(!(r>=48&&r<=57))break
q=q*10+(r-48)}d.push(q)
return a},
qo(a,b,c,d,e){var s,r,q,p,o,n,m=b+1
for(s=c.length;m<s;++m){r=c.charCodeAt(m)
if(r===46){if(e)break
e=!0}else{if(!((((r|32)>>>0)-97&65535)<26||r===95||r===36||r===124))q=r>=48&&r<=57
else q=!0
if(!q)break}}p=c.substring(b,m)
if(e){s=a.u
o=a.e
if(o.w===9)o=o.x
n=A.vM(s,o.x)[p]
if(n==null)A.a9('No "'+p+'" in "'+A.up(o)+'"')
d.push(A.hg(s,o,n))}else d.push(p)
return m},
vz(a,b){var s,r=a.u,q=A.qn(a,b),p=b.pop()
if(typeof p=="string")b.push(A.he(r,p,q))
else{s=A.di(r,a.e,p)
switch(s.w){case 11:b.push(A.ou(r,s,q,a.n))
break
default:b.push(A.ot(r,s,q))
break}}},
vw(a,b){var s,r,q,p=a.u,o=b.pop(),n=null,m=null
if(typeof o=="number")switch(o){case-1:n=b.pop()
break
case-2:m=b.pop()
break
default:b.push(o)
break}else b.push(o)
s=A.qn(a,b)
o=b.pop()
switch(o){case-3:o=b.pop()
if(n==null)n=p.sEA
if(m==null)m=p.sEA
r=A.di(p,a.e,o)
q=new A.j6()
q.a=s
q.b=n
q.c=m
b.push(A.qq(p,r,q))
return
case-4:b.push(A.qt(p,b.pop(),s))
return
default:throw A.e(A.ht("Unexpected state under `()`: "+A.A(o)))}},
vy(a,b){var s=b.pop()
if(0===s){b.push(A.hf(a.u,1,"0&"))
return}if(1===s){b.push(A.hf(a.u,4,"1&"))
return}throw A.e(A.ht("Unexpected extended operation "+A.A(s)))},
qn(a,b){var s=b.splice(a.p)
A.qp(a.u,a.e,s)
a.p=b.pop()
return s},
di(a,b,c){if(typeof c=="string")return A.he(a,c,a.sEA)
else if(typeof c=="number"){b.toString
return A.vA(a,b,c)}else return c},
qp(a,b,c){var s,r=c.length
for(s=0;s<r;++s)c[s]=A.di(a,b,c[s])},
vC(a,b,c){var s,r=c.length
for(s=2;s<r;s+=3)c[s]=A.di(a,b,c[s])},
vA(a,b,c){var s,r,q=b.w
if(q===9){if(c===0)return b.x
s=b.y
r=s.length
if(c<=r)return s[c-1]
c-=r
b=b.x
q=b.w}else if(c===0)return b
if(q!==8)throw A.e(A.ht("Indexed base must be an interface type"))
s=b.y
if(c<=s.length)return s[c-1]
throw A.e(A.ht("Bad index "+c+" for "+b.D(0)))},
xS(a,b,c){var s,r=b.d
if(r==null)r=b.d=new Map()
s=r.get(c)
if(s==null){s=A.ag(a,b,null,c,null)
r.set(c,s)}return s},
ag(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i
if(b===d)return!0
if(A.dq(d))return!0
s=b.w
if(s===4)return!0
if(A.dq(b))return!1
if(b.w===1)return!0
r=s===13
if(r)if(A.ag(a,c[b.x],c,d,e))return!0
q=d.w
p=t.b
if(b===p||b===t.v){if(q===7)return A.ag(a,b,c,d.x,e)
return d===p||d===t.v||q===6}if(d===t.K){if(s===7)return A.ag(a,b.x,c,d,e)
return s!==6}if(s===7){if(!A.ag(a,b.x,c,d,e))return!1
return A.ag(a,A.og(a,b),c,d,e)}if(s===6)return A.ag(a,p,c,d,e)&&A.ag(a,b.x,c,d,e)
if(q===7){if(A.ag(a,b,c,d.x,e))return!0
return A.ag(a,b,c,A.og(a,d),e)}if(q===6)return A.ag(a,b,c,p,e)||A.ag(a,b,c,d.x,e)
if(r)return!1
p=s!==11
if((!p||s===12)&&d===t.Z)return!0
o=s===10
if(o&&d===t.lZ)return!0
if(q===12){if(b===t.dY)return!0
if(s!==12)return!1
n=b.y
m=d.y
l=n.length
if(l!==m.length)return!1
c=c==null?n:n.concat(c)
e=e==null?m:m.concat(e)
for(k=0;k<l;++k){j=n[k]
i=m[k]
if(!A.ag(a,j,c,i,e)||!A.ag(a,i,e,j,c))return!1}return A.qL(a,b.x,c,d.x,e)}if(q===11){if(b===t.dY)return!0
if(p)return!1
return A.qL(a,b,c,d,e)}if(s===8){if(q!==8)return!1
return A.wy(a,b,c,d,e)}if(o&&q===10)return A.wE(a,b,c,d,e)
return!1},
qL(a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2
if(!A.ag(a3,a4.x,a5,a6.x,a7))return!1
s=a4.y
r=a6.y
q=s.a
p=r.a
o=q.length
n=p.length
if(o>n)return!1
m=n-o
l=s.b
k=r.b
j=l.length
i=k.length
if(o+j<n+i)return!1
for(h=0;h<o;++h){g=q[h]
if(!A.ag(a3,p[h],a7,g,a5))return!1}for(h=0;h<m;++h){g=l[h]
if(!A.ag(a3,p[o+h],a7,g,a5))return!1}for(h=0;h<i;++h){g=l[m+h]
if(!A.ag(a3,k[h],a7,g,a5))return!1}f=s.c
e=r.c
d=f.length
c=e.length
for(b=0,a=0;a<c;a+=3){a0=e[a]
for(;;){if(b>=d)return!1
a1=f[b]
b+=3
if(a0<a1)return!1
a2=f[b-2]
if(a1<a0){if(a2)return!1
continue}g=e[a+1]
if(a2&&!g)return!1
g=f[b-1]
if(!A.ag(a3,e[a+2],a7,g,a5))return!1
break}}while(b<d){if(f[b+1])return!1
b+=3}return!0},
wy(a,b,c,d,e){var s,r,q,p,o,n=b.x,m=d.x
while(n!==m){s=a.tR[n]
if(s==null)return!1
if(typeof s=="string"){n=s
continue}r=s[m]
if(r==null)return!1
q=r.length
p=q>0?new Array(q):v.typeUniverse.sEA
for(o=0;o<q;++o)p[o]=A.hg(a,b,r[o])
return A.qC(a,p,null,c,d.y,e)}return A.qC(a,b.y,null,c,d.y,e)},
qC(a,b,c,d,e,f){var s,r=b.length
for(s=0;s<r;++s)if(!A.ag(a,b[s],d,e[s],f))return!1
return!0},
wE(a,b,c,d,e){var s,r=b.y,q=d.y,p=r.length
if(p!==q.length)return!1
if(b.x!==d.x)return!1
for(s=0;s<p;++s)if(!A.ag(a,r[s],c,q[s],e))return!1
return!0},
et(a){var s=a.w,r=!0
if(!(a===t.b||a===t.v))if(!A.dq(a))if(s!==6)r=s===7&&A.et(a.x)
return r},
dq(a){var s=a.w
return s===2||s===3||s===4||s===5||a===t.iD},
qx(a,b){var s,r,q=Object.keys(b),p=q.length
for(s=0;s<p;++s){r=q[s]
a[r]=b[r]}},
mF(a){return a>0?new Array(a):v.typeUniverse.sEA},
bq:function bq(a,b){var _=this
_.a=a
_.b=b
_.r=_.f=_.d=_.c=null
_.w=0
_.as=_.Q=_.z=_.y=_.x=null},
j6:function j6(){this.c=this.b=this.a=null},
jg:function jg(a){this.a=a},
j4:function j4(){},
hc:function hc(a){this.a=a},
vp(){var s,r,q
if(self.scheduleImmediate!=null)return A.xg()
if(self.MutationObserver!=null&&self.document!=null){s={}
r=self.document.createElement("div")
q=self.document.createElement("span")
s.a=null
new self.MutationObserver(A.jt(new A.m4(s),1)).observe(r,{childList:true})
return new A.m3(s,r,q)}else if(self.setImmediate!=null)return A.xh()
return A.xi()},
vq(a){self.scheduleImmediate(A.jt(new A.m5(t.M.a(a)),0))},
vr(a){self.setImmediate(A.jt(new A.m6(t.M.a(a)),0))},
vs(a){A.oi(B.ad,t.M.a(a))},
oi(a,b){var s=B.a.P(a.a,1000)
return A.vD(s<0?0:s,b)},
vD(a,b){var s=new A.mw()
s.jp(a,b)
return s},
ek(a){return new A.j1(new A.aj($.a8,a.n("aj<0>")),a.n("j1<0>"))},
ei(a,b){a.$2(0,null)
b.b=!0
return b.a},
c8(a,b){A.w_(a,b)},
eh(a,b){var s,r,q=b.$ti
q.n("1/?").a(a)
s=a==null?q.c.a(a):a
if(!b.b)b.a.jv(s)
else{r=b.a
if(q.n("bB<1>").b(s))r.fq(s)
else r.fv(s)}},
eg(a,b){var s=A.bx(a),r=A.es(a),q=b.b,p=b.a
if(q)p.e9(new A.bh(s,r))
else p.fk(new A.bh(s,r))},
w_(a,b){var s,r,q=new A.mH(b),p=new A.mI(b)
if(a instanceof A.aj)a.hq(q,p,t.z)
else{s=t.z
if(a instanceof A.aj)a.iw(q,p,s)
else{r=new A.aj($.a8,t.c)
r.a=8
r.c=a
r.hq(q,p,s)}}},
en(a){var s=function(b,c){return function(d,e){while(true){try{b(d,e)
break}catch(r){e=r
d=c}}}}(a,1)
return $.a8.iq(new A.na(s),t.q,t.p,t.z)},
nN(a){var s
if(t.e.b(a)){s=a.gdm()
if(s!=null)return s}return B.ek},
k6(a,b){var s
if(!b.b(null))throw A.e(A.jL(null,"computation","The type parameter is not nullable"))
s=new A.aj($.a8,b.n("aj<0>"))
A.us(a,new A.k7(null,s,b))
return s},
me(a,b,c){var s,r,q,p,o={},n=o.a=a
for(s=t.c;r=n.a,(r&4)!==0;n=a){a=s.a(n.c)
o.a=a}if(n===b){s=A.uq()
b.fk(new A.bh(new A.bg(!0,n,null,"Cannot complete a future with itself"),s))
return}q=b.a&1
s=n.a=r|q
if((s&24)===0){p=t.F.a(b.c)
b.a=b.a&1|4
b.c=n
n.h5(p)
return}if(!c)if(b.c==null)n=(s&16)===0||q!==0
else n=!1
else n=!0
if(n){p=b.cX()
b.du(o.a)
A.dg(b,p)
return}b.a^=2
A.jp(null,null,b.b,t.M.a(new A.mf(o,b)))},
dg(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d={},c=d.a=a
for(s=t.u,r=t.F;;){q={}
p=c.a
o=(p&16)===0
n=!o
if(b==null){if(n&&(p&1)===0){m=s.a(c.c)
A.oD(m.a,m.b)}return}q.a=b
l=b.a
for(c=b;l!=null;c=l,l=k){c.a=null
A.dg(d.a,c)
q.a=l
k=l.a}p=d.a
j=p.c
q.b=n
q.c=j
if(o){i=c.c
i=(i&1)!==0||(i&15)===8}else i=!0
if(i){h=c.b.b
if(n){p=p.b===h
p=!(p||p)}else p=!1
if(p){s.a(j)
A.oD(j.a,j.b)
return}g=$.a8
if(g!==h)$.a8=h
else g=null
c=c.c
if((c&15)===8)new A.mj(q,d,n).$0()
else if(o){if((c&1)!==0)new A.mi(q,j).$0()}else if((c&2)!==0)new A.mh(d,q).$0()
if(g!=null)$.a8=g
c=q.c
if(c instanceof A.aj){p=q.a.$ti
p=p.n("bB<2>").b(c)||!p.y[1].b(c)}else p=!1
if(p){f=q.a.b
if((c.a&24)!==0){e=r.a(f.c)
f.c=null
b=f.dK(e)
f.a=c.a&30|f.a&1
f.c=c.c
d.a=c
continue}else A.me(c,f,!0)
return}}f=q.a.b
e=r.a(f.c)
f.c=null
b=f.dK(e)
c=q.b
p=q.c
if(!c){f.$ti.c.a(p)
f.a=8
f.c=p}else{s.a(p)
f.a=f.a&1|16
f.c=p}d.a=f
c=f}},
wO(a,b){var s
if(t.C.b(a))return b.iq(a,t.z,t.K,t.l)
s=t.R
if(s.b(a))return s.a(a)
throw A.e(A.jL(a,"onError",u.c))},
wK(){var s,r
for(s=$.el;s!=null;s=$.el){$.hl=null
r=s.b
$.el=r
if(r==null)$.hk=null
s.a.$0()}},
x3(){$.oB=!0
try{A.wK()}finally{$.hl=null
$.oB=!1
if($.el!=null)$.oZ().$1(A.r_())}},
qU(a){var s=new A.j2(a),r=$.hk
if(r==null){$.el=$.hk=s
if(!$.oB)$.oZ().$1(A.r_())}else $.hk=r.b=s},
x_(a){var s,r,q,p=$.el
if(p==null){A.qU(a)
$.hl=$.hk
return}s=new A.j2(a)
r=$.hl
if(r==null){s.b=p
$.el=$.hl=s}else{q=r.b
s.b=q
$.hl=r.b=s
if(q==null)$.hk=s}},
zc(a,b){A.js(a,"stream",t.K)
return new A.jb(b.n("jb<0>"))},
us(a,b){var s=$.a8
if(s===B.U)return A.oi(a,t.M.a(b))
return A.oi(a,t.M.a(s.hV(b)))},
oD(a,b){A.x_(new A.n0(a,b))},
qQ(a,b,c,d,e){var s,r=$.a8
if(r===c)return d.$0()
$.a8=c
s=r
try{r=d.$0()
return r}finally{$.a8=s}},
wW(a,b,c,d,e,f,g){var s,r=$.a8
if(r===c)return d.$1(e)
$.a8=c
s=r
try{r=d.$1(e)
return r}finally{$.a8=s}},
wV(a,b,c,d,e,f,g,h,i){var s,r=$.a8
if(r===c)return d.$2(e,f)
$.a8=c
s=r
try{r=d.$2(e,f)
return r}finally{$.a8=s}},
jp(a,b,c,d){t.M.a(d)
if(B.U!==c){d=c.hV(d)
d=d}A.qU(d)},
m4:function m4(a){this.a=a},
m3:function m3(a,b,c){this.a=a
this.b=b
this.c=c},
m5:function m5(a){this.a=a},
m6:function m6(a){this.a=a},
mw:function mw(){},
mx:function mx(a,b){this.a=a
this.b=b},
j1:function j1(a,b){this.a=a
this.b=!1
this.$ti=b},
mH:function mH(a){this.a=a},
mI:function mI(a){this.a=a},
na:function na(a){this.a=a},
bh:function bh(a,b){this.a=a
this.b=b},
k7:function k7(a,b,c){this.a=a
this.b=b
this.c=c},
df:function df(a,b,c,d,e){var _=this
_.a=null
_.b=a
_.c=b
_.d=c
_.e=d
_.$ti=e},
aj:function aj(a,b){var _=this
_.a=0
_.b=a
_.c=null
_.$ti=b},
mb:function mb(a,b){this.a=a
this.b=b},
mg:function mg(a,b){this.a=a
this.b=b},
mf:function mf(a,b){this.a=a
this.b=b},
md:function md(a,b){this.a=a
this.b=b},
mc:function mc(a,b){this.a=a
this.b=b},
mj:function mj(a,b,c){this.a=a
this.b=b
this.c=c},
mk:function mk(a,b){this.a=a
this.b=b},
ml:function ml(a){this.a=a},
mi:function mi(a,b){this.a=a
this.b=b},
mh:function mh(a,b){this.a=a
this.b=b},
j2:function j2(a){this.a=a
this.b=null},
jb:function jb(a){this.$ti=a},
hi:function hi(){},
ja:function ja(){},
mu:function mu(a,b){this.a=a
this.b=b},
n0:function n0(a,b){this.a=a
this.b=b},
tV(a,b){return new A.bo(a.n("@<0>").b1(b).n("bo<1,2>"))},
tW(a,b,c){return b.n("@<0>").b1(c).n("o_<1,2>").a(A.r5(a,new A.bo(b.n("@<0>").b1(c).n("bo<1,2>"))))},
P(a,b){return new A.bo(a.n("@<0>").b1(b).n("bo<1,2>"))},
tX(a){return new A.dh(a.n("dh<0>"))},
o0(a){return new A.dh(a.n("dh<0>"))},
or(){var s=Object.create(null)
s["<non-identifier-key>"]=s
delete s["<non-identifier-key>"]
return s},
ig(a,b,c){var s=A.tV(b,c)
a.cc(0,new A.kH(s,b,c))
return s},
o1(a,b){var s=A.tX(b)
s.cE(0,a)
return s},
o2(a){var s,r
if(A.oN(a))return"{...}"
s=new A.fH("")
try{r={}
B.c.E($.aX,a)
s.a+="{"
r.a=!0
a.cc(0,new A.kJ(r,s))
s.a+="}"}finally{if(0>=$.aX.length)return A.a($.aX,-1)
$.aX.pop()}r=s.a
return r.charCodeAt(0)==0?r:r},
tY(a){return 8},
tZ(a){var s
a=(a<<1>>>0)-1
for(;;a=s){s=(a&a-1)>>>0
if(s===0)return a}},
dh:function dh(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
j8:function j8(a){this.a=a
this.c=this.b=null},
h1:function h1(a,b,c){var _=this
_.a=a
_.b=b
_.d=_.c=null
_.$ti=c},
kH:function kH(a,b,c){this.a=a
this.b=b
this.c=c},
G:function G(){},
dY:function dY(){},
kJ:function kJ(a,b){this.a=a
this.b=b},
fd:function fd(a,b){var _=this
_.a=a
_.d=_.c=_.b=0
_.$ti=b},
h2:function h2(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=null
_.$ti=e},
bW:function bW(){},
ha:function ha(){},
vO(a,b,c){var s,r,q,p,o=c-b
if(o<=4096)s=$.rP()
else s=new Uint8Array(o)
for(r=0;r<o;++r){q=b+r
if(!(q<a.length))return A.a(a,q)
p=a[q]
if((p&255)!==p)p=255
s[r]=p}return s},
vN(a,b,c,d){var s=a?$.rO():$.rN()
if(s==null)return null
if(0===c&&d===b.length)return A.qw(s,b)
return A.qw(s,b.subarray(c,d))},
qw(a,b){var s,r
try{s=a.decode(b)
return s}catch(r){}return null},
vP(a){switch(a){case 65:return"Missing extension byte"
case 67:return"Unexpected extension byte"
case 69:return"Invalid UTF-8 byte"
case 71:return"Overlong encoding"
case 73:return"Out of unicode range"
case 75:return"Encoded surrogate"
case 77:return"Unfinished UTF-8 octet sequence"
default:return""}},
mD:function mD(){},
mC:function mC(){},
mz:function mz(){},
my:function my(){},
ds:function ds(){},
hB:function hB(){},
hC:function hC(){},
ie:function ie(){},
kE:function kE(){},
kD:function kD(a){this.a=a},
iR:function iR(){},
lp:function lp(){},
mE:function mE(a){this.b=0
this.c=a},
iS:function iS(a){this.a=a},
hh:function hh(a){this.a=a
this.b=16
this.c=0},
jA(a){var s=A.uh(a,null)
if(s!=null)return s
throw A.e(A.k4(a,null,null))},
tv(a,b){a=A.ac(a,new Error())
if(a==null)a=A.ef(a)
a.stack=b.D(0)
throw a},
N(a,b,c,d){var s,r=J.nW(a,d)
if(a!==0&&b!=null)for(s=0;s<a;++s)r[s]=b
return r},
dX(a,b,c){var s,r,q=A.j([],c.n("p<0>"))
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.K)(a),++r)B.c.E(q,c.a(a[r]))
if(b)return q
q.$flags=1
return q},
t(a,b){var s,r
if(Array.isArray(a))return A.j(a.slice(0),b.n("p<0>"))
s=A.j([],b.n("p<0>"))
for(r=J.cd(a);r.C();)B.c.E(s,r.gN())
return s},
pK(a,b,c){var s,r=J.nX(a,c)
for(s=0;s<a;++s)B.c.i(r,s,b.$1(s))
return r},
pL(a,b){var s=A.dX(a,!1,b)
s.$flags=3
return s},
d8(a,b,c){var s,r,q,p,o
A.aV(b,"start")
s=c==null
r=!s
if(r){q=c-b
if(q<0)throw A.e(A.a7(c,b,null,"end",null))
if(q===0)return""}if(Array.isArray(a)){p=a
o=p.length
if(s)c=o
return A.q2(b>0||c<o?p.slice(b,c):p)}if(t.hD.b(a))return A.ur(a,b,c)
if(r)a=J.te(a,c)
if(b>0)a=J.jJ(a,b)
s=A.t(a,t.p)
return A.q2(s)},
ur(a,b,c){var s=a.length
if(b>=s)return""
return A.uj(a,b,c==null||c>s?s:c)},
iI(a){return new A.dT(a,A.pG(a,!1,!0,!1,!1,""))},
q8(a,b,c){var s=J.cd(b)
if(!s.C())return a
if(c.length===0){do a+=A.A(s.gN())
while(s.C())}else{a+=A.A(s.gN())
while(s.C())a=a+c+A.A(s.gN())}return a},
uq(){return A.es(new Error())},
jX(a){if(typeof a=="number"||A.oA(a)||a==null)return J.ev(a)
if(typeof a=="string")return JSON.stringify(a)
return A.q1(a)},
tw(a,b){A.js(a,"error",t.K)
A.js(b,"stackTrace",t.l)
A.tv(a,b)},
ht(a){return new A.hs(a)},
aJ(a,b){return new A.bg(!1,null,b,a)},
jL(a,b,c){return new A.bg(!0,a,b,c)},
jM(a,b,c){return a},
um(a){var s=null
return new A.bV(s,s,!1,s,s,a)},
of(a,b){return new A.bV(null,null,!0,a,b,"Value not in range")},
a7(a,b,c,d,e){return new A.bV(b,c,!0,a,d,"Invalid value")},
un(a,b,c,d){if(a<b||a>c)throw A.e(A.a7(a,b,c,d,null))
return a},
b6(a,b,c){if(0>a||a>c)throw A.e(A.a7(a,0,c,"start",null))
if(b!=null){if(a>b||b>c)throw A.e(A.a7(b,a,c,"end",null))
return b}return c},
aV(a,b){if(a<0)throw A.e(A.a7(a,0,null,b,null))
return a},
hV(a,b,c,d,e){return new A.hU(b,!0,a,e,"Index out of range")},
br(a){return new A.fL(a)},
qb(a){return new A.iP(a)},
q7(a){return new A.e7(a)},
b_(a){return new A.hz(a)},
pi(a){return new A.ma(a)},
k4(a,b,c){return new A.bO(a,b,c)},
tQ(a,b,c){var s,r
if(A.oN(a)){if(b==="("&&c===")")return"(...)"
return b+"..."+c}s=A.j([],t.s)
B.c.E($.aX,a)
try{A.wI(a,s)}finally{if(0>=$.aX.length)return A.a($.aX,-1)
$.aX.pop()}r=A.q8(b,t.e7.a(s),", ")+c
return r.charCodeAt(0)==0?r:r},
kr(a,b,c){var s,r
if(A.oN(a))return b+"..."+c
s=new A.fH(b)
B.c.E($.aX,a)
try{r=s
r.a=A.q8(r.a,a,", ")}finally{if(0>=$.aX.length)return A.a($.aX,-1)
$.aX.pop()}s.a+=c
r=s.a
return r.charCodeAt(0)==0?r:r},
wI(a,b){var s,r,q,p,o,n,m,l=a.gF(a),k=0,j=0
for(;;){if(!(k<80||j<3))break
if(!l.C())return
s=A.A(l.gN())
B.c.E(b,s)
k+=s.length+2;++j}if(!l.C()){if(j<=5)return
if(0>=b.length)return A.a(b,-1)
r=b.pop()
if(0>=b.length)return A.a(b,-1)
q=b.pop()}else{p=l.gN();++j
if(!l.C()){if(j<=4){B.c.E(b,A.A(p))
return}r=A.A(p)
if(0>=b.length)return A.a(b,-1)
q=b.pop()
k+=r.length+2}else{o=l.gN();++j
for(;l.C();p=o,o=n){n=l.gN();++j
if(j>100){for(;;){if(!(k>75&&j>3))break
if(0>=b.length)return A.a(b,-1)
k-=b.pop().length+2;--j}B.c.E(b,"...")
return}}q=A.A(p)
r=A.A(o)
k+=r.length+q.length+4}}if(j>b.length+2){k+=5
m="..."}else m=null
for(;;){if(!(k>80&&b.length>3))break
if(0>=b.length)return A.a(b,-1)
k-=b.pop().length+2
if(m==null){k+=5
m="..."}}if(m!=null)B.c.E(b,m)
B.c.E(b,q)
B.c.E(b,r)},
o5(a,b,c,d){var s
if(B.av===c){s=B.a.gK(a)
b=J.by(b)
return A.lb(A.bY(A.bY($.jI(),s),b))}if(B.av===d){s=B.a.gK(a)
b=J.by(b)
c=J.by(c)
return A.lb(A.bY(A.bY(A.bY($.jI(),s),b),c))}s=B.a.gK(a)
b=J.by(b)
c=J.by(c)
d=J.by(d)
d=A.lb(A.bY(A.bY(A.bY(A.bY($.jI(),s),b),c),d))
return d},
n(a){var s,r,q=$.jI()
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.K)(a),++r)q=A.bY(q,J.by(a[r]))
return A.lb(q)},
bA:function bA(a){this.a=a},
m9:function m9(){},
a3:function a3(){},
hs:function hs(a){this.a=a},
bZ:function bZ(){},
bg:function bg(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
bV:function bV(a,b,c,d,e,f){var _=this
_.e=a
_.f=b
_.a=c
_.b=d
_.c=e
_.d=f},
hU:function hU(a,b,c,d,e){var _=this
_.f=a
_.a=b
_.b=c
_.c=d
_.d=e},
fL:function fL(a){this.a=a},
iP:function iP(a){this.a=a},
e7:function e7(a){this.a=a},
hz:function hz(a){this.a=a},
ij:function ij(){},
fG:function fG(){},
ma:function ma(a){this.a=a},
bO:function bO(a,b,c){this.a=a
this.b=b
this.c=c},
f:function f(){},
cr:function cr(a,b,c){this.a=a
this.b=b
this.$ti=c},
au:function au(){},
S:function S(){},
je:function je(){},
fH:function fH(a){this.a=a},
hF:function hF(a,b){this.a=a
this.$ti=b},
ut(a){throw A.e(A.br("Uint64List not supported on the web."))},
tk(a,b,c){return J.p6(a,b,c)},
tP(a,b,c){return J.nK(a,b,c)},
oj(a,b,c){var s=a.BYTES_PER_ELEMENT
c=A.b6(b,c,B.a.Z(a.byteLength,s))
return J.F(B.d.gt(a),a.byteOffset+b*s,(c-b)*s)},
qa(a,b,c){return J.az(a,b,c)},
tG(a){return J.p7(a,0,null)},
tH(a){return a.od(0,0,null)},
hD:function hD(){},
nT(a,b){var s=new A.ke()
s.j6(a,b)
return s},
ke:function ke(){this.a=$
this.b=0
this.c=2147483647},
eY:function eY(a,b){this.a=a
this.b=b},
eX:function eX(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.r=_.f=_.e=0
_.w=d
_.x=null
_.y=0},
ee:function ee(a,b){this.a=a
this.b=b},
m2:function m2(){},
mG:function mG(){},
tu(a,b,c,d){var s=A.oq(),r=A.oq(),q=A.oq(),p=new Uint16Array(16),o=new Uint32Array(573),n=new Uint8Array(573)
s=new A.jU(a,c,s,r,q,p,o,n)
s.la(b,d)
s.kx(B.aJ)
return s},
ph(a,b,c,d){var s,r=b*2,q=a.length
if(!(r>=0&&r<q))return A.a(a,r)
r=a[r]
s=c*2
if(!(s>=0&&s<q))return A.a(a,s)
s=a[s]
if(r>=s)if(r===s){if(!(b>=0&&b<573))return A.a(d,b)
r=d[b]
if(!(c>=0&&c<573))return A.a(d,c)
r=r<=d[c]}else r=!1
else r=!0
return r},
oq(){return new A.mn()},
vt(a,b,c){var s,r,q,p,o,n,m,l=new Uint16Array(16)
for(s=0,r=1;r<=15;++r){s=s+c[r-1]<<1>>>0
if(!(r<16))return A.a(l,r)
l[r]=s}for(q=a.length,p=0;p<=b;++p){o=p*2
n=o+1
if(!(n<q))return A.a(a,n)
m=a[n]
if(m===0)continue
if(!(m<16))return A.a(l,m)
n=l[m]
if(!(m<16))return A.a(l,m)
l[m]=n+1
n=A.vu(n,m)
a.$flags&2&&A.b(a)
if(!(o<q))return A.a(a,o)
a[o]=n}},
vu(a,b){var s,r=0
do{s=A.aN(a,1)
r=(r|a&1)<<1>>>0
if(--b,b>0){a=s
continue}else break}while(!0)
return A.aN(r,1)},
qm(a){var s
if(a<256){if(!(a>=0))return A.a(B.aY,a)
s=B.aY[a]}else{s=256+A.aN(a,7)
if(!(s<512))return A.a(B.aY,s)
s=B.aY[s]}return s},
os(a,b,c,d,e){return new A.mv(a,b,c,d,e)},
aN(a,b){if(a>=0)return B.a.aM(a,b)
else return B.a.aM(a,b)+B.a.O(2,(~b>>>0)+65536&65535)},
eb:function eb(a,b){this.a=a
this.b=b},
jU:function jU(a,b,c,d,e,f,g,h){var _=this
_.a=a
_.b=b
_.c=null
_.e=_.d=0
_.x=_.w=_.r=_.f=$
_.y=2
_.id=_.go=_.fy=_.fx=_.fr=_.dy=_.dx=_.db=_.cy=_.cx=_.CW=_.ch=_.ay=_.ax=_.at=_.as=_.Q=$
_.k1=0
_.p3=_.p2=_.p1=_.ok=_.k4=_.k3=_.k2=$
_.p4=c
_.R8=d
_.RG=e
_.rx=f
_.ry=g
_.x1=_.to=$
_.x2=h
_.bn=_.aZ=_.c_=_.co=_.bO=_.aV=_.bN=_.y2=_.y1=_.xr=$},
b9:function b9(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
mn:function mn(){this.c=this.b=this.a=$},
mv:function mv(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
kq:function kq(a,b){var _=this
_.a=a
_.b=null
_.c=b
_.f=!1
_.w=_.r=0},
aY(a){return new A.hr(a,null,null)},
hr:function hr(a,b,c){this.a=a
this.b=b
this.c=c},
ex:function ex(a,b){this.a=a
this.b=b},
py(a){return new A.eZ(new A.j3(a,0,new Uint8Array(65536),B.ac),0,null,B.ac)},
pz(a,b,c){return new A.eZ(a.b,a.c+b,c,a.a)},
eZ:function eZ(a,b,c,d){var _=this
_.b=a
_.c=b
_.d=c
_.e=0
_.a=d},
j3:function j3(a,b,c,d){var _=this
_.b=a
_.c=b
_.d=c
_.r=_.f=_.e=0
_.w=!1
_.a=d},
hW(a,b,c,d){var s,r,q,p,o=new A.f_(b)
if(d==null)d=0
A.aV(d,"offset")
if(d<0)d=0
else{s=a.length
if(d>s)d=s}r=a.length-d
if(c==null)c=r
if(c<0||c>r)c=r
q=t.D.b(a)?a:new Uint8Array(A.o(a))
p=J.F(B.d.gt(q),q.byteOffset+d,c)
o.b=p
o.d=p.length
return o},
f_:function f_(a){var _=this
_.b=null
_.c=0
_.d=$
_.a=a},
f0:function f0(){},
ua(a){return new A.il(new Uint8Array(32768),a)},
il:function il(a,b){this.b=0
this.c=a
this.a=b},
fp:function fp(){},
jS:function jS(a,b){this.a=a
this.b=b},
Y:function Y(a){this.a=-1
this.b=a},
cG:function cG(a,b){this.a=a
this.b=b},
dt:function dt(a){this.a=a},
du:function du(a){this.a=a},
dv:function dv(a){this.a=a},
dw:function dw(a){this.a=a},
dx:function dx(a){this.a=a},
dy:function dy(a){this.a=a},
dA:function dA(a,b){this.a=a
this.b=b},
dB:function dB(a){this.a=a},
dC:function dC(a,b){this.a=a
this.b=b},
dD:function dD(a){this.a=a},
dE:function dE(a,b){this.a=a
this.b=b},
tr(a,b,c){var s=new A.eA(new Uint8Array(3))
s.j0(a,b,c)
return s},
ts(a,b,c,d){var s=new A.dz(new Uint8Array(4))
s.j1(a,b,c,d)
return s},
bi:function bi(a){this.a=a},
eA:function eA(a){this.a=a},
dz:function dz(a){this.a=a},
eB:function eB(a){this.a=a},
hA:function hA(a){this.a=a},
er(a,b,c){var s
if(b===c)return a
switch(b.a){case 0:if(a===0)s=0
else{s=B.dF.l(0,c)
s.toString}return s
case 1:switch(c.a){case 0:return a===0?0:1
case 1:return a
case 2:return a*5
case 3:return a*75
case 4:return a*21845
case 5:return a*1431655765
case 6:return a*42
case 7:return a*10922
case 8:return a*715827882
case 9:case 10:case 11:return a/3}break
case 2:switch(c.a){case 0:return a===0?0:1
case 1:return B.a.j(A.r(a),1)
case 2:return a
case 3:return a*17
case 4:return a*4369
case 5:return a*286331153
case 6:return a*8
case 7:return a*2184
case 8:return a*143165576
case 9:case 10:case 11:return a/3}break
case 3:switch(c.a){case 0:return a===0?0:1
case 1:return B.a.j(A.r(a),6)
case 2:return B.a.j(A.r(a),4)
case 3:return a
case 4:return a*257
case 5:return a*16843009
case 6:return B.a.j(A.r(a),1)
case 7:return a*128
case 8:return a*8421504
case 9:case 10:case 11:return a/255}break
case 4:switch(c.a){case 0:return a===0?0:1
case 1:return B.a.j(A.r(a),14)
case 2:return B.a.j(A.r(a),12)
case 3:return B.a.j(A.r(a),8)
case 4:return a
case 5:return A.r(a)<<8>>>0
case 6:return B.a.j(A.r(a),9)
case 7:return B.a.j(A.r(a),1)
case 8:return a*524296
case 9:case 10:case 11:return a/65535}break
case 5:switch(c.a){case 0:return a===0?0:1
case 1:return B.a.j(A.r(a),30)
case 2:return B.a.j(A.r(a),28)
case 3:return B.a.j(A.r(a),24)
case 4:return B.a.j(A.r(a),16)
case 5:return a
case 6:return B.a.j(A.r(a),25)
case 7:return B.a.j(A.r(a),17)
case 8:return B.a.j(A.r(a),1)
case 9:case 10:case 11:return a/4294967295}break
case 6:switch(c.a){case 0:return a===0?0:1
case 1:return a<=0?0:B.a.j(A.r(a),5)
case 2:return a<=0?0:B.a.j(A.r(a),3)
case 3:return a<=0?0:A.r(a)<<1>>>0
case 4:return a<=0?0:A.r(a)*516
case 5:return a<=0?0:A.r(a)*33818640
case 6:return a
case 7:return a*258
case 8:return a*16909320
case 9:case 10:case 11:return a/127}break
case 7:switch(c.a){case 0:return a===0?0:1
case 1:return a<=0?0:B.a.j(A.r(a),15)
case 2:return a<=0?0:B.a.j(A.r(a),11)
case 3:return a<=0?0:B.a.j(A.r(a),7)
case 4:return a<=0?0:A.r(a)<<1>>>0
case 5:return a<=0?0:A.r(a)*131076
case 6:return B.a.j(A.r(a),8)
case 7:return a
case 8:return A.r(a)*65538
case 9:case 10:case 11:return a/32767}break
case 8:switch(c.a){case 0:return a===0?0:1
case 1:return a<=0?0:B.a.j(A.r(a),29)
case 2:return a<=0?0:B.a.j(A.r(a),27)
case 3:return a<=0?0:B.a.j(A.r(a),23)
case 4:return a<=0?0:B.a.j(A.r(a),16)
case 5:return a<=0?0:A.r(a)<<1>>>0
case 6:return B.a.j(A.r(a),24)
case 7:return B.a.j(A.r(a),16)
case 8:return a
case 9:case 10:case 11:return a/2147483647}break
case 9:case 10:case 11:switch(c.a){case 0:return a===0?0:1
case 1:return B.b.h(B.b.L(a,0,1)*3)
case 2:return B.b.h(B.b.L(a,0,1)*15)
case 3:return B.b.h(B.b.L(a,0,1)*255)
case 4:return B.b.h(B.b.L(a,0,1)*65535)
case 5:return B.b.h(B.b.L(a,0,1)*4294967295)
case 6:return B.b.h(a<0?B.b.L(a,-1,1)*128:B.b.L(a,-1,1)*127)
case 7:return B.b.h(a<0?B.b.L(a,-1,1)*32768:B.b.L(a,-1,1)*32767)
case 8:return B.b.h(a<0?B.b.L(a,-1,1)*2147483648:B.b.L(a,-1,1)*2147483647)
case 9:case 10:case 11:return a}break}},
av:function av(a,b){this.a=a
this.b=b},
eM:function eM(a,b){this.a=a
this.b=b},
hu:function hu(a,b){this.a=a
this.b=b},
eH(a){var s,r=new A.bM(A.P(t.N,t.P))
r.j7(a)
s=a.b
if(s!=null)r.b=new Uint8Array(A.o(s))
return r},
nP(a){var s=new A.bM(A.P(t.N,t.P))
s.cd(a)
return s},
bM:function bM(a){this.b=null
this.c=0
this.a=a},
j5:function j5(a,b){this.a=a
this.b=b},
i(a,b,c){return new A.hE(a,b)},
hE:function hE(a,b){this.a=a
this.b=b},
b0:function b0(a){this.a=a},
kk:function kk(a){this.a=a},
po(a){var s=new A.aR(A.P(t.p,t.r),new A.b0(A.P(t.N,t.P)))
s.i0(a)
return s},
aR:function aR(a,b){this.a=a
this.b=b},
kl:function kl(a){this.a=a},
km:function km(a){this.a=a},
tL(a){var s=new Uint16Array(1)
s[0]=a
return new A.bR(s)},
pv(a,b){var s=new A.bR(new Uint16Array(b))
s.jc(a,b)
return s},
kn(a){var s=new Uint32Array(1)
s[0]=a
return new A.b1(s)},
pq(a,b){var s=new A.b1(new Uint32Array(b))
s.j9(a,b)
return s},
pr(a,b){var s,r=J.bF(b,t.i)
for(s=0;s<b;++s)r[s]=new A.b7(a.k(),a.k())
return new A.bC(r)},
pu(a,b){var s=new A.bQ(new Int16Array(b))
s.jb(a,b)
return s},
ps(a,b){var s=new A.bP(new Int32Array(b))
s.ja(a,b)
return s},
pt(a,b){var s,r,q,p,o=J.bF(b,t.i)
for(s=0;s<b;++s){r=a.k()
q=$.V()
q.$flags&2&&A.b(q)
q[0]=r
r=$.ad()
if(0>=r.length)return A.a(r,0)
p=r[0]
q[0]=a.k()
o[s]=new A.b7(p,r[0])}return new A.bE(o)},
pw(a,b){var s=new A.cl(new Float32Array(b))
s.jd(a,b)
return s},
pp(a,b){var s=new A.ck(new Float64Array(b))
s.j8(a,b)
return s},
ao:function ao(a,b){this.a=a
this.b=b},
a6:function a6(){},
bn:function bn(a){this.a=a},
cM:function cM(a){this.a=a},
bR:function bR(a){this.a=a},
b1:function b1(a){this.a=a},
bC:function bC(a){this.a=a},
bD:function bD(a){this.a=a},
bQ:function bQ(a){this.a=a},
bP:function bP(a){this.a=a},
bE:function bE(a){this.a=a},
cl:function cl(a){this.a=a},
ck:function ck(a){this.a=a},
cm:function cm(a){this.a=a},
cN:function cN(a){this.a=a},
oK(c7,c8,c9,d0,d1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6=null
if(c7.gaH())c7=c7.i_(c7.gak())
if(c8===B.bi)return c9.iH(c7)
if(B.dE.af(c8))return A.xx(c7,c9,c8,d1)
s=B.oE.l(0,c8)
s.toString
r=c7.gI()
q=c7.gJ()
p=c9.gW()
o=A.Z(c6,c6,B.e,0,B.l,r,c6,0,1,p,B.e,q,!1)
n=!1
if(c7.gM()===B.e)if(!c7.gaH()){m=c7.gak()>=3
n=m}l=c7.gak()
k=n?new Uint8Array(A.o(c7.a0())):c6
j=o.a0()
m=n?p.a*3:0
i=new Int32Array(m)
if(n)for(h=p.a,g=p.b,f=2<g,e=1<g,d=0<g,c=p.c,b=c.length,a=0,a0=0;a<h;++a,a0=a1){a1=a0+1
if(d){a2=a*g
if(!(a2>=0&&a2<b))return A.a(c,a2)
a2=c[a2]}else a2=0
a2=B.a.h(a2)
if(!(a0<m))return A.a(i,a0)
i[a0]=a2
a0=a1+1
if(e){a2=a*g+1
if(!(a2>=0&&a2<b))return A.a(c,a2)
a2=c[a2]}else a2=0
a2=B.a.h(a2)
if(!(a1<m))return A.a(i,a1)
i[a1]=a2
a1=a0+1
if(f){a2=a*g+2
if(!(a2>=0&&a2<b))return A.a(c,a2)
a2=c[a2]}else a2=0
a2=B.a.h(a2)
if(!(a0<m))return A.a(i,a0)
i[a0]=a2}a3=s.length
m=A.j([],t.n)
for(a4=0;a4<a3;++a4)m.push(s[a4][0])
a5=new Float64Array(A.o(m))
m=t.t
h=A.j([],m)
for(a4=0;a4<a3;++a4)h.push(B.b.h(s[a4][1]))
a6=new Int32Array(A.o(h))
h=A.j([],m)
for(a4=0;a4<a3;++a4)h.push(B.b.h(s[a4][2]))
a7=new A.np(k,q,l,c9,j,i,a3,a6,new Int32Array(A.o(h)),r,a5)
a8=new A.nq(n?c7:A.b2(c7,!1,!1),c9,o,p,s,q,r)
a9=n?a7:a8
if(d0===B.ey){b0=q+r-1
for(b1=q-1,b2=0;b2<b0;++b2){b3=b2<r?0:b2-r+1
b4=b2<q?b2:b1
if((b2&1)===0)for(b5=b3;b5<=b4;++b5)a9.$3(b5,b2-b5,1)
else for(b5=b4;b5>=b3;--b5)a9.$3(b5,b2-b5,1)}return o}if(d0===B.ez){b6=Math.max(q,r)
for(b7=1;b7<b6;)b7=b7<<1>>>0
b8=A.j([0,0],m)
b9=b7*b7
for(b2=0;b2<b9;++b2){A.wp(b7,b2,b8)
s=b8[0]
if(s<q&&b8[1]<r)a9.$3(s,b8[1],1)}return o}c0=d0===B.ex
c1=c0?-1:1
for(c2=q-1,c3=0;c3<r;++c3){if(c0)c1*=-1
s=c1===1
c4=s?0:c2
c5=s?q:0
for(b5=c4;b5!==c5;b5+=c1)a9.$3(b5,c3,c1)}return o},
xx(a,b,c,d){var s,r,q,p,o,n,m,l,k=null,j=B.dE.l(0,c),i=j.length,h=a.gI(),g=a.gJ(),f=A.Z(k,k,B.e,0,B.l,h,k,0,1,b.gW(),B.e,g,!1)
for(s=0;s<h;++s){r=j[B.a.a1(s,i)]
for(q=r.length,p=0;p<g;++p){o=a.a
n=o==null?k:o.S(p,s,k)
if(n==null)n=new A.J()
o=B.a.a1(p,i)
if(!(o<q))return A.a(r,o)
m=(r[o]-0.5)*255*d
l=b.dY(B.b.az(B.b.L(n.l(0,0)+m,0,255)),B.b.az(B.b.L(n.l(0,1)+m,0,255)),B.b.az(B.b.L(n.l(0,2)+m,0,255)))
o=f.a
if(o!=null)o.aS(p,s,l)}}return f},
wp(a,b,c){var s,r,q,p,o,n
B.c.i(c,0,0)
B.c.i(c,1,0)
for(s=b,r=1;r<a;r=r<<1>>>0){q=s>>>1&1
p=(s^q)&1
if(p===0){if(q===1){o=r-1
B.c.i(c,0,o-c[0])
B.c.i(c,1,o-c[1])}n=c[0]
c[0]=c[1]
c[1]=n}B.c.i(c,0,c[0]+r*q)
B.c.i(c,1,c[1]+r*p)
s=s>>>2}},
aK:function aK(a,b){this.a=a
this.b=b},
dH:function dH(a,b){this.a=a
this.b=b},
np:function np(a,b,c,d,e,f,g,h,i,j,k){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i
_.y=j
_.z=k},
nq:function nq(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
aw(a,b,c,d){var s
if(d)s=a<0||b<0
else s=a<1||b<1
if(s)throw A.e(A.k("Invalid image dimensions "+a+"x"+b))
if(c>0&&a*b>c)throw A.e(A.k("Image dimensions "+a+"x"+b+" exceed the maximum of "+c+" pixels"))},
im:function im(a){this.a=a
this.c=0},
p9(a){var s,r,q=new A.jR()
if(!A.pa(a))A.a9(A.k("Not a bitmap file."))
a.d+=2
s=a.k()
r=$.V()
r.$flags&2&&A.b(r)
r[0]=s
s=$.ad()
if(0>=s.length)return A.a(s,0)
a.d+=4
r[0]=a.k()
q.b=s[0]
return q},
pa(a){if(a.c-a.d<2)return!1
return A.w(a,null,0).m()===19778},
tg(a,b){var s,r,q,p,o=b==null?A.p9(a):b,n=a.d,m=a.k(),l=a.k(),k=$.V()
k.$flags&2&&A.b(k)
k[0]=l
l=$.ad()
if(0>=l.length)return A.a(l,0)
s=l[0]
k[0]=a.k()
l=l[0]
r=a.m()
q=a.m()
p=a.k()
if(p>=14)A.a9(A.k("Unsupported BMP compression type: "+p))
if(!(p<14))return A.a(B.b9,p)
p=B.b9[p]
a.k()
k[0]=a.k()
k[0]=a.k()
k=a.k()
a.k()
n=new A.aZ(o,s,l,m,r,q,p,k,n)
n.fb(a,b)
return n},
am:function am(a,b){this.a=a
this.b=b},
jR:function jR(){this.b=$},
aZ:function aZ(a,b,c,d,e,f,g,h,i){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.z=h
_.ay=_.ax=_.at=_.as=$
_.ch=null
_.fx=_.fr=_.dy=_.dx=_.db=_.cy=_.cx=_.CW=$
_.fy=i},
tf(a,b){return new A.hv(a,b==null?268435456:b)},
hv:function hv(a,b){var _=this
_.a=$
_.b=null
_.c=a
_.d=b},
jQ:function jQ(a,b){this.a=a
this.b=b},
jO:function jO(a,b){this.a=a
this.b=b},
jN:function jN(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
jP:function jP(a,b,c){this.a=a
this.b=b
this.c=c},
jV:function jV(a,b){var _=this
_.a=$
_.b=null
_.c=a
_.d=b},
L:function L(){},
jT:function jT(){},
jW:function jW(){},
hG:function hG(){},
f2:function f2(a,b,c,d){var _=this
_.r=a
_.w=b
_.x=c
_.b=_.a=0
_.c=d},
cJ:function cJ(a,b){this.a=a
this.b=b},
cI:function cI(a,b){this.a=a
this.b=b},
hH:function hH(){var _=this
_.w=_.r=_.f=_.d=_.c=_.b=_.a=$},
pj(a,b,c,d){var s,r
switch(a.a){case 1:return new A.i1(c,b)
case 2:return new A.f3(c,d==null?1:d,b)
case 3:return new A.f3(c,d==null?16:d,b)
case 4:s=d==null?32:d
r=new A.i_(c,s,b)
r.jg(b,c,s)
return r
case 5:return new A.i0(c,d==null?16:d,b)
case 6:return new A.f2(c,d==null?32:d,!1,b)
case 7:return new A.f2(c,d==null?32:d,!0,b)
default:throw A.e(A.k("Invalid compression type: "+a.D(0)))}},
bk:function bk(a,b){this.a=a
this.b=b},
bN:function bN(){},
hY:function hY(){},
tA(a,b,c,d){var s,r,q,p,o,n,m,l
if(b===0){if(d!==0)throw A.e(A.k("Incomplete huffman data"))
return}s=a.d
r=a.k()
q=a.k()
a.d+=4
p=a.k()
o=!0
if(r<65537)o=q>=65537
if(o)throw A.e(A.k("Invalid huffman table size"))
a.d+=4
n=A.N(65537,0,!1,t.p)
m=J.aa(16384,t.ho)
for(l=0;l<16384;++l)m[l]=new A.hI()
A.tB(a,b-20,r,q,n)
if(p>8*(b-(a.d-s)))throw A.e(A.k("Error in header for Huffman-encoded data (invalid number of bits)."))
A.tx(n,r,q,m)
A.tz(n,m,a,p,q,d,c)},
tz(a,b,c,d,e,f,g){var s,r,q,p,o,n,m,l,k,j="Error in Huffman-encoded data (invalid code).",i=A.j([0,0],t.t),h=c.d+B.a.P(d+7,8)
for(s=b.length,r=0;c.d<h;){A.nQ(i,c)
while(q=i[1],q>=14){p=B.a.aM(i[0],q-14)&16383
if(!(p<s))return A.a(b,p)
o=b[p]
p=o.a
if(p!==0){B.c.i(i,1,q-p)
r=A.nR(o.b,e,i,c,g,r,f)}else{if(o.c==null)throw A.e(A.k(j))
for(n=0;n<o.b;++n){q=o.c
if(!(n<q.length))return A.a(q,n)
q=q[n]
if(!(q<65537))return A.a(a,q)
m=a[q]&63
for(;;){q=i[1]
if(!(q<m&&c.d<h))break
A.nQ(i,c)}if(q>=m){p=o.c
if(!(n<p.length))return A.a(p,n)
p=p[n]
if(!(p<65537))return A.a(a,p)
q-=m
if(a[p]>>>6===(B.a.aM(i[0],q)&B.a.O(1,m)-1)>>>0){B.c.i(i,1,q)
q=o.c
if(!(n<q.length))return A.a(q,n)
l=A.nR(q[n],e,i,c,g,r,f)
r=l
break}}}if(n===o.b)throw A.e(A.k(j))}}}k=8-d&7
B.c.i(i,0,B.a.j(i[0],k))
B.c.i(i,1,i[1]-k)
while(q=i[1],q>0){p=B.a.U(i[0],14-q)&16383
if(!(p<s))return A.a(b,p)
o=b[p]
p=o.a
if(p!==0){B.c.i(i,1,q-p)
r=A.nR(o.b,e,i,c,g,r,f)}else throw A.e(A.k(j))}if(r!==f)throw A.e(A.k("Error in Huffman-encoded data (decoded data are shorter than expected)."))},
nR(a,b,c,d,e,f,g){var s,r,q,p,o,n,m="Error in Huffman-encoded data (decoded data are longer than expected)."
if(a===b){if(c[1]<8)A.nQ(c,d)
B.c.i(c,1,c[1]-8)
s=B.a.aM(c[0],c[1])&255
if(f+s>g)throw A.e(A.k(m))
r=f-1
q=e.length
if(!(r>=0&&r<q))return A.a(e,r)
p=e[r]
for(r=e.$flags|0;o=s-1,s>0;s=o,f=n){n=f+1
r&2&&A.b(e)
if(!(f<q))return A.a(e,f)
e[f]=p}}else{if(f<g){e.toString
n=f+1
e.$flags&2&&A.b(e)
if(!(f<e.length))return A.a(e,f)
e[f]=a}else throw A.e(A.k(m))
f=n}return f},
tx(a,b,c,d){var s,r,q,p,o,n,m,l,k="Error in Huffman-encoded data (invalid code table entry)."
for(s=d.length,r=t.t;b<=c;++b){if(!(b<65537))return A.a(a,b)
q=a[b]
p=q>>>6
o=q&63
if(B.a.a6(p,o)!==0)throw A.e(A.k(k))
if(o>14){q=B.a.a4(p,o-14)
if(!(q<s))return A.a(d,q)
n=d[q]
if(n.a!==0)throw A.e(A.k(k));++n.b
q=n.c
if(q==null){q=A.j([],r)
n.snH(q)}B.c.E(q,b)}else if(o!==0){q=14-o
m=B.a.U(p,q)
if(!(m<s))return A.a(d,m)
for(l=B.a.U(1,q);l>0;--l,++m){if(!(m<s))return A.a(d,m)
n=d[m]
if(n.a!==0||n.c!=null)throw A.e(A.k(k))
n.a=o
n.b=b}}}},
tB(a,b,c,d,e){var s,r,q,p,o,n="Error in Huffman-encoded data (unexpected end of code table data).",m="Error in Huffman-encoded data (code table is longer than expected).",l=a.d,k=A.j([0,0],t.t)
for(s=d+1;c<=d;++c){if(a.d-l>b)throw A.e(A.k(n))
r=A.pk(6,k,a)
B.c.i(e,c,r)
if(r===63){if(a.d-l>b)throw A.e(A.k(n))
q=A.pk(8,k,a)+6
if(c+q>s)throw A.e(A.k(m))
for(;p=q-1,q!==0;q=p,c=o){o=c+1
B.c.i(e,c,0)}--c}else if(r>=59){q=r-59+2
if(c+q>s)throw A.e(A.k(m))
for(;p=q-1,q!==0;q=p,c=o){o=c+1
B.c.i(e,c,0)}--c}}A.ty(e)},
ty(a){var s,r,q,p,o,n=A.N(59,0,!1,t.p)
for(s=0;s<65537;++s){r=a[s]
if(!(r<59))return A.a(n,r)
B.c.i(n,r,n[r]+1)}for(q=0,s=58;s>0;--s,q=p){p=q+n[s]>>>1
B.c.i(n,s,q)}for(s=0;s<65537;++s){o=a[s]
if(o>0){if(!(o<59))return A.a(n,o)
r=n[o]
B.c.i(n,o,r+1)
B.c.i(a,s,(o|r<<6)>>>0)}}},
nQ(a,b){B.c.i(a,0,(a[0]<<8|b.H())>>>0)
B.c.i(a,1,a[1]+8>>>0)},
pk(a,b,c){var s
while(s=b[1],s<a){B.c.i(b,0,(b[0]<<8|J.d(c.a,c.d++))>>>0)
B.c.i(b,1,b[1]+8>>>0)}B.c.i(b,1,s-a)
return(B.a.aM(b[0],b[1])&B.a.O(1,a)-1)>>>0},
hI:function hI(){this.b=this.a=0
this.c=null},
tC(a){var s
if(a.length<8)return!1
s=A.v(a,!1,null,0)
if(s.k()!==20000630)return!1
if(s.H()!==2)return!1
if((s.bx()&4294967289)>>>0!==0)return!1
return!0},
hJ:function hJ(a){var _=this
_.b=_.a=0
_.c=a
_.d=null
_.e=$},
pA(a,b,c,d){var s=new A.hZ(a,A.j([],t.a_),A.P(t.N,t.iW),B.cd,b)
s.j4(a,b,c,d)
return s},
eI:function eI(){},
k1:function k1(a,b){this.a=a
this.b=b},
hZ:function hZ(a,b,c,d,e){var _=this
_.a=a
_.b=null
_.c=b
_.d=0
_.e=c
_.r=$
_.x=_.w=0
_.at=$
_.ax=d
_.ay=null
_.ch=$
_.CW=null
_.cx=0
_.cy=null
_.db=e
_.k1=_.id=_.go=_.fy=_.fx=_.fr=_.dy=_.dx=null
_.k2=$
_.k3=null},
i_:function i_(a,b,c){var _=this
_.r=null
_.w=a
_.x=b
_.y=$
_.z=null
_.b=_.a=0
_.c=c},
h8:function h8(){var _=this
_.f=_.e=_.d=_.c=_.b=_.a=$},
i0:function i0(a,b,c){var _=this
_.r=a
_.w=b
_.x=null
_.b=_.a=0
_.c=c},
i1:function i1(a,b){var _=this
_.r=null
_.w=a
_.b=_.a=0
_.c=b},
f3:function f3(a,b,c){var _=this
_.w=a
_.x=b
_.y=null
_.b=_.a=0
_.c=c},
jY:function jY(a){this.a=null
this.b=a},
k0:function k0(a,b){this.a=a
this.b=b},
jZ:function jZ(a,b){this.a=a
this.b=b},
k_:function k_(a,b,c){this.a=a
this.b=b
this.c=c},
pm(a){var s=new Uint8Array(a*3)
return new A.eN(A.tJ(a),a,null,new A.aU(s,a,3))},
tI(a){return new A.eN(a.a,a.b,a.c,A.pQ(a.d))},
tJ(a){var s
for(s=1;s<=8;++s)if(B.a.O(1,s)>=a)return s
return 0},
eN:function eN(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
eO:function eO(){},
i2:function i2(){var _=this
_.e=_.d=_.c=_.b=_.a=$
_.f=null
_.r=80
_.w=0
_.x=-1
_.y=$},
ch:function ch(a){var _=this
_.b=_.a=0
_.e=_.c=null
_.r=a},
k8:function k8(a){var _=this
_.a=null
_.b=a
_.f=_.e=_.d=_.c=0
_.r=null
_.w=0
_.x=null
_.z=_.y=$
_.Q=null
_.as=0
_.at=null
_.ch=_.ay=_.ax=0
_.CW=null
_.fr=_.dy=_.dx=_.db=_.cy=_.cx=0},
kb:function kb(a,b){this.a=a
this.b=b},
k9:function k9(a,b){this.a=a
this.b=b},
ka:function ka(a,b,c){this.a=a
this.b=b
this.c=c},
kc:function kc(a,b,c){var _=this
_.b=0
_.e=a
_.f=b
_.w=c
_.as=_.Q=_.z=null
_.ax=_.at=$
_.fr=_.dy=_.dx=_.db=_.cy=_.cx=_.CW=_.ch=_.ay=0
_.fx=!1
_.fy=$
_.go=0
_.id=null},
kd:function kd(a,b){this.a=a
this.b=b},
pn(a){var s,r,q,p
if(a.m()!==0)return null
s=a.m()
if(s>=3)return null
if(B.fh[s]===B.co)return null
r=a.m()
q=J.bF(r,t.aw)
for(p=0;p<r;++p){J.d(a.a,a.d++)
J.d(a.a,a.d++)
J.d(a.a,a.d++);++a.d
a.m()
a.m()
q[p]=new A.hS(a.k(),a.k())}return new A.hR(r,q)},
dK:function dK(a,b){this.a=a
this.b=b},
hR:function hR(a,b){this.d=a
this.e=b},
hS:function hS(a,b){this.d=a
this.e=b},
hQ:function hQ(a,b,c,d,e,f,g,h,i){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.z=h
_.ay=_.ax=_.at=_.as=$
_.ch=null
_.fx=_.fr=_.dy=_.dx=_.db=_.cy=_.cx=_.CW=$
_.fy=i},
kf:function kf(a){this.b=this.a=null
this.c=a},
ki:function ki(a,b){this.a=a
this.b=b},
kh:function kh(a,b,c){this.a=a
this.b=b
this.c=c},
kg:function kg(a,b){this.a=a
this.b=b},
m1:function m1(){},
kj:function kj(){},
pg(a,b,c,d,e){var s,r
if(a===b)s=0
else s=a===1&&b===4?2:1
if(c===d)r=0
else r=c===1&&d===4?2:1
return new A.hy(e,s,r)},
hy:function hy(a,b,c){this.e=a
this.f=b
this.r=c},
rb(a){var s=$.rZ(),r=s.a,q=r.get(a)
if(q==null){q=A.w1(a)
s.$ti.n("1?").a(q)
r.set(a,q)
s=q}else s=q
return s},
w1(a){var s,r,q,p,o,n=new Uint16Array(512)
for(s=0;s<512;++s)for(r=a,q=1;q<=9;++q){p=r[B.a.a4(s,9-q)&1]
if(p instanceof A.dJ){o=p.a
if(!(s<512))return A.a(n,s)
n[s]=(q<<8|o)>>>0
break}if(!(p instanceof A.cL))break
r=p.a}return n},
ci:function ci(){},
cL:function cL(a){this.a=a},
dJ:function dJ(a){this.a=a},
pI(a){var s,r=a.f.e
r.toString
s=a.b
s=new A.kA(a,B.a.Z(r+s-1,s),a.gdZ())
s.jh(a)
return s},
r9(a){var s,r=A.pI(a)
r.iD(0,a.gdZ())
s=r.d
s===$&&A.c()
return s},
kA:function kA(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.w=_.r=_.f=_.e=_.d=$},
kt:function kt(){this.d=null},
cp:function cp(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.x=_.w=_.r=_.f=_.e=$
_.y=!1
_.z=0
_.ay=_.ax=_.at=_.as=_.Q=$},
kv(){var s,r,q,p,o=A.N(4,null,!1,t.jH),n=A.j([],t.gU),m=t.iM,l=J.nX(0,m)
m=J.nX(0,m)
s=A.j([],t.an)
r=A.j([],t.hg)
q=new Uint8Array(64)
p=new Int32Array(64)
return new A.i9(new A.bM(A.P(t.N,t.P)),o,n,l,m,s,r,q,p,new Int16Array(0))},
tS(a,b,c,d,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=B.a.Z(8,b),e=f*f
for(s=e>>>1,r=c.length,q=0;q<b;++q){p=d+q
if(!(p<r))return A.a(c,p)
p=c[p]
p.toString
for(o=p.$flags|0,n=q*f,m=0;m<b;++m){for(l=m*f,k=0,j=0;j<f;++j){i=(n+j)*8+l
for(h=0;h<f;++h){g=i+h
if(!(g<64))return A.a(a,g)
k+=a[g]}}l=a0+m
g=B.a.Z(k+s,e)
o&2&&A.b(p)
if(!(l<p.length))return A.a(p,l)
p[l]=g}}},
i9:function i9(a,b,c,d,e,f,g,h,i,j){var _=this
_.a=0
_.b=1
_.d=_.c=$
_.x=_.r=_.f=_.e=null
_.y=a
_.z=b
_.Q=c
_.as=d
_.at=e
_.ax=f
_.ay=!1
_.ch=0
_.cx=_.CW=!1
_.cy=null
_.db=g
_.dx=h
_.dy=i
_.fr=j},
ec:function ec(a){this.a=a
this.b=0},
j9:function j9(){},
ia:function ia(a,b){var _=this
_.e=_.d=_.c=_.b=null
_.r=_.f=0
_.x=_.w=$
_.y=a
_.z=b},
ib:function ib(){this.b=this.a=0},
kB:function kB(){this.r=this.f=$},
ic:function ic(a,b,c,d,e,f,g,h,i){var _=this
_.a=a
_.b=b
_.f=$
_.r=null
_.y=c
_.z=d
_.Q=e
_.as=f
_.at=g
_.ax=h
_.ay=null
_.cx=_.CW=_.ch=0
_.cy=!1
_.dx=_.db=0
_.dy=$
_.fr=i},
pH(){return new A.kw(268435456)},
kw:function kw(a){this.a=a},
ky:function ky(a,b){this.a=a
this.b=b},
kx:function kx(a,b,c){this.a=a
this.b=b
this.c=c},
tT(a,b){return a>0?a:a+B.a.U(1,b)-1},
ku:function ku(a,b){this.a=a
this.b=b},
kz:function kz(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.w=_.r=_.f=_.e=$
_.x=e
_.y=f
_.z=g
_.Q=null
_.at=_.as=0},
mm:function mm(a,b){this.a=a
this.b=b},
kQ:function kQ(a,b,c){this.a=a
this.b=b
this.c=c},
e1:function e1(a,b){this.a=a
this.b=b},
fx:function fx(a,b){this.a=a
this.b=b},
fy:function fy(){},
i3:function i3(a,b,c,d,e,f,g,h,i){var _=this
_.y=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i},
ct:function ct(a,b){this.a=a
this.b=b},
iu:function iu(){},
i4:function i4(a,b,c){var _=this
_.c=_.b=_.a=0
_.d=-1
_.r=_.f=0
_.z=_.x=_.w=null
_.Q=""
_.at=null
_.ax=a
_.CW=1
_.cy=b
_.db=c},
pZ(a){var s=t.N,r=A.j([],t.fi),q=A.j([],t.t),p=a==null?268435456:a
return new A.kM(new A.i4(A.P(s,s),r,q),p)},
kM:function kM(a,b){var _=this
_.a=a
_.b=b
_.d=_.c=0
_.e=$
_.f=0},
kP:function kP(a,b){this.a=a
this.b=b},
kN:function kN(a,b){this.a=a
this.b=b},
kO:function kO(a,b,c){this.a=a
this.b=b
this.c=c},
jf:function jf(){},
uf(a){var s,r,q=new A.an(a),p=!q.gab(q)&&a.length<=79&&q.gd5(q)!==32&&q.gcH(q)!==32,o=a.length,n=0
for(;;){if(!(p&&n<o))break
if(!(n<o))return A.a(a,n)
s=a.charCodeAt(n)
if(!(s>=32&&s<=126))r=s>=161&&s<=255
else r=!0
if(r){if(s===32){r=n-1
if(!(r>=0))return A.a(a,r)
r=a.charCodeAt(r)===32}else r=!1
p=!r}else p=!1;++n}return p?a:"ICC_PROFILE"},
ud(a,b,c){var s,r,q,p=a.length,o=c.$flags|0,n=1,m=0
for(;;){if(!(m<b&&m<p))break
s=n+1
if(!(m<p))return A.a(a,m)
r=a[m]
o&2&&A.b(c)
if(!(n<c.length))return A.a(c,n)
c[n]=r;++m
n=s}for(m=b;m<p;++m,n=s){s=n+1
r=a[m]
q=m-b
if(!(q>=0))return A.a(a,q)
q=a[q]
o&2&&A.b(c)
if(!(n<c.length))return A.a(c,n)
c[n]=r-q}},
ue(a,b,c){var s,r,q,p,o,n,m,l=a.length
for(s=b.length,r=c.$flags|0,q=1,p=0;p<l;++p,q=o){o=q+1
n=a[p]
if(!(p<s))return A.a(b,p)
m=b[p]
r&2&&A.b(c)
if(!(q<c.length))return A.a(c,q)
c[q]=n-m}},
ub(a,b,c,d){var s,r,q,p,o=a.length,n=b.length,m=d.$flags|0,l=1,k=0
for(;;){if(!(k<c&&k<o))break
s=l+1
if(!(k<o))return A.a(a,k)
r=a[k]
if(!(k<n))return A.a(b,k)
q=b[k]
m&2&&A.b(d)
if(!(l<d.length))return A.a(d,l)
d[l]=r-(q>>>1);++k
l=s}for(k=c;k<o;++k,l=s){s=l+1
r=a[k]
q=k-c
if(!(q>=0))return A.a(a,q)
q=a[q]
if(!(k<n))return A.a(b,k)
p=b[k]
m&2&&A.b(d)
if(!(l<d.length))return A.a(d,l)
d[l]=r-(q+p>>>1)}},
uc(a,b,c,d){var s,r,q,p,o,n,m,l,k,j=a.length,i=b.length,h=d.$flags|0,g=1,f=0
for(;;){if(!(f<c&&f<j))break
s=g+1
if(!(f<j))return A.a(a,f)
r=a[f]
if(!(f<i))return A.a(b,f)
q=b[f]
h&2&&A.b(d)
if(!(g<d.length))return A.a(d,g)
d[g]=r-q;++f
g=s}for(f=c;f<j;++f,g=s){r=f-c
if(!(r>=0))return A.a(a,r)
p=a[r]
if(!(f<i))return A.a(b,f)
o=b[f]
if(!(r<i))return A.a(b,r)
n=b[r]
m=o-n
l=p-n
k=m+l
if(m<0)m=-m
if(l<0)l=-l
if(k<0)k=-k
s=g+1
r=a[f]
if(m<=l&&m<=k)q=p
else q=l<=k?o:n
h&2&&A.b(d)
if(!(g<d.length))return A.a(d,g)
d[g]=r-q}},
it:function it(a,b){this.a=a
this.b=b},
is:function is(a,b,c){var _=this
_.a=null
_.b=a
_.c=0
_.d=b
_.e=$
_.f=0
_.r=!1
_.w=null
_.z=c},
kS:function kS(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
kR:function kR(a,b,c){this.a=a
this.b=b
this.c=c},
cu:function cu(a,b){this.a=a
this.b=b},
cv:function cv(a){this.b=this.a=0
this.e=a},
kT:function kT(a,b){var _=this
_.b=_.a=null
_.c=a
_.d=b},
kW:function kW(a,b,c){this.a=a
this.b=b
this.c=c},
kX:function kX(a,b){this.a=a
this.b=b},
kV:function kV(a,b){this.a=a
this.b=b},
kU:function kU(){},
iw:function iw(){this.a=null},
ix:function ix(){this.a=null},
bG:function bG(){},
iA:function iA(){this.a=null},
iB:function iB(){this.a=null},
iE:function iE(){this.a=null},
iF:function iF(){this.a=null},
fA:function fA(a){this.b=a},
iD:function iD(){},
kY:function kY(){var _=this
_.w=_.r=_.f=_.e=$},
d6:function d6(a){this.a=a
this.c=null},
q3(a,b){var s=A.j([],t.k9),r=b==null?268435456:b
r=new A.iy(s,A.P(t.p,t.ok),a.length,r)
r.jj(a,b)
return r},
oa(a,b,c,d){var s=a/255,r=b/255,q=c/255,p=d/255,o=r*(1-q),n=s*(1-p)
return B.b.h(B.b.L((2*s<q?2*r*s+o+n:p*q-2*(q-s)*(p-r)+o+n)*255,0,255))},
l2(a,b){if(b===0)return 0
return B.a.h(B.a.L(B.b.h(255*(1-(1-a/255)/(b/255))),0,255))},
l4(a,b){return B.a.h(B.a.L(a+b-255,0,255))},
oc(a,b){return B.a.h(B.a.L(255-(255-b)*(255-a),0,255))},
l3(a,b){if(b===255)return 255
return B.b.h(B.b.L(a/255/(1-b/255)*255,0,255))},
od(a,b){var s=a/255,r=b/255,q=1-r
return B.b.az(255*(q*r*s+r*(1-q*(1-s))))},
o8(a,b){var s=b/255,r=a/255
if(r<0.5)return B.b.az(510*s*r)
else return B.b.az(255*(1-2*(1-s)*(1-r)))},
oe(a,b){if(b<128)return A.l2(a,2*b)
else return A.l3(a,2*(b-128))},
o9(a,b){var s
if(b<128)return A.l4(a,2*b)
else{s=2*(b-128)
return s+a>255?255:a+s}},
ob(a,b){return b<128?Math.min(a,2*b):Math.max(a,2*(b-128))},
o7(a,b){return B.b.az(b+a-2*b*a/255)},
aL(a,b,c){var s,r,q
if(a==null)s=0
else{s=a.length
if(c===1){if(!(b>=0&&b<s))return A.a(a,b)
s=a[b]}else{if(!(b>=0&&b<s))return A.a(a,b)
r=a[b]
q=b+1
if(!(q<s))return A.a(a,q)
q=(r<<8|a[q])>>>8
s=q}}return s},
q4(b7,b8,b9,c0,c1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5=null,b6=A.P(t.p,t.dS)
for(s=c1.length,r=0;q=c1.length,r<q;c1.length===s||(0,A.K)(c1),++r){p=c1[r]
b6.i(0,p.a,p)}if(b8===8)o=1
else o=b8===16?2:-1
n=A.Z(b5,b5,B.e,0,B.l,c0,b5,0,q,b5,B.e,b9,!1)
if(o===-1)throw A.e(A.k("PSD: unsupported bit depth: "+A.A(b8)))
m=b6.l(0,0)
l=b6.l(0,1)
k=b6.l(0,2)
j=b6.l(0,-1)
i=A.j([0,0,0],t.t)
h=-o
for(s=n.a,s=s.gF(s),g=q>=5,f=q===4,e=q>=2,q=q>=4;s.C();){d=s.gN()
h+=o
switch(b7){case B.dM:d.sq(A.aL(m.c,h,o))
d.sB(A.aL(l.c,h,o))
d.sA(A.aL(k.c,h,o))
d.sv(q?A.aL(j.c,h,o):255)
if(d.gv()!==0){d.sq((d.gq()+d.gv()-255)*255/d.gv())
d.sB((d.gB()+d.gv()-255)*255/d.gv())
d.sA((d.gA()+d.gv()-255)*255/d.gv())}break
case B.dO:c=A.aL(m.c,h,o)
b=A.aL(l.c,h,o)
a=A.aL(k.c,h,o)
a0=q?A.aL(j.c,h,o):255
a1=((c*100>>>8)+16)/116
a2=(b-128)/500+a1
a3=a1-(a-128)/200
a4=Math.pow(a1,3)
a1=a4>0.008856?a4:(a1-0.13793103448275862)/7.787
a5=Math.pow(a2,3)
a2=a5>0.008856?a5:(a2-0.13793103448275862)/7.787
a6=Math.pow(a3,3)
a3=a6>0.008856?a6:(a3-0.13793103448275862)/7.787
a2=a2*95.047/100
a1=a1*100/100
a3=a3*108.883/100
a7=a2*3.240454836+a1*-1.53713885+a3*-0.498531547
a8=a2*-0.96926639+a1*1.87601093+a3*0.041556082
a9=a2*0.05564342+a1*-0.20402585+a3*1.05722516
a7=a7>0.0031308?1.055*Math.pow(a7,0.4166666666666667)-0.055:12.92*a7
a8=a8>0.0031308?1.055*Math.pow(a8,0.4166666666666667)-0.055:12.92*a8
a9=a9>0.0031308?1.055*Math.pow(a9,0.4166666666666667)-0.055:12.92*a9
b0=[B.b.az(B.b.L(a7*255,0,255)),B.b.az(B.b.L(a8*255,0,255)),B.b.az(B.b.L(a9*255,0,255))]
d.sq(b0[0])
d.sB(b0[1])
d.sA(b0[2])
d.sv(a0)
break
case B.dL:b1=A.aL(m.c,h,o)
a0=e?A.aL(j.c,h,o):255
d.sq(b1)
d.sB(b1)
d.sA(b1)
d.sv(a0)
break
case B.dN:b2=A.aL(m.c,h,o)
b3=A.aL(l.c,h,o)
a1=A.aL(k.c,h,o)
b4=A.aL(b6.l(0,f?-1:3).c,h,o)
a0=g?A.aL(j.c,h,o):255
A.r3(255-b2,255-b3,255-a1,255-b4,i)
d.sq(i[0])
d.sB(i[1])
d.sA(i[2])
d.sv(a0)
break
default:throw A.e(A.k("Unhandled color mode: "+A.A(b7)))}}return n},
bp:function bp(a,b){this.a=a
this.b=b},
iy:function iy(a,b,c,d){var _=this
_.b=_.a=0
_.d=_.c=null
_.e=$
_.r=_.f=null
_.w=a
_.x=$
_.y=null
_.z=b
_.as=$
_.at=c
_.ch=_.ay=_.ax=null
_.CW=d},
iz:function iz(){},
iC:function iC(a,b,c){var _=this
_.b=_.a=null
_.f=_.e=_.d=_.c=$
_.r=null
_.as=_.y=_.w=$
_.ay=a
_.ch=b
_.cx=null
_.cy=c},
uk(a,b){var s
switch(a){case"lsct":s=b.c-b.d
b.k()
if(s>=12){if(b.ar(4)!=="8BIM")A.a9(A.k("Invalid key in layer additional data"))
b.ar(4)}if(s>=16)b.k()
return new A.iD()
default:return new A.fA(b)}},
e3:function e3(){},
kZ:function kZ(a){this.a=null
this.b=a},
l0:function l0(a,b,c){this.a=a
this.b=b
this.c=c},
l1:function l1(a,b){this.a=a
this.b=b},
l_:function l_(a,b){this.a=a
this.b=b},
iG:function iG(){},
e5:function e5(a,b,c){this.a=a
this.b=b
this.c=c},
aB:function aB(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
e4:function e4(){var _=this
_.Q=_.z=_.y=_.f=_.d=_.b=_.a=0},
d7:function d7(a){var _=this
_.b=0
_.c=a
_.Q=_.r=_.f=0},
fB:function fB(){this.y=this.b=this.a=0},
bU(a,b){var s,r=a>>>8
if(!(r<256))return A.a(B.ap,r)
r=B.ap[r]
s=b>>>8
if(!(s<256))return A.a(B.ap,s)
return(r<<17|B.ap[s]<<16|B.ap[a&255]<<1|B.ap[b&255])>>>0},
b5:function b5(a){var _=this
_.a=a
_.b=0
_.c=!1
_.d=0
_.e=!1
_.f=0
_.r=!1},
l5:function l5(a){this.b=this.a=null
this.c=a},
l8:function l8(a,b){this.a=a
this.b=b},
l6:function l6(a,b){this.a=a
this.b=b},
l7:function l7(a,b,c){this.a=a
this.b=b
this.c=c},
fJ:function fJ(a){var _=this
_.b=_.a=0
_.c=a
_.Q=_.z=_.y=_.x=_.f=_.e=0
_.as=null
_.ax=0},
aC:function aC(a,b){this.a=a
this.b=b},
lc:function lc(a){this.a=null
this.b=$
this.c=a},
le:function le(a,b,c){this.a=a
this.b=b
this.c=c},
lf:function lf(a,b){this.a=a
this.b=b},
ld:function ld(a,b){this.a=a
this.b=b},
lg:function lg(a){this.a=a
this.c=this.b=0},
iN:function iN(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=null
_.f=e},
oh(a,b,c){var s=new A.lm(b,a),r=t.I
s.e=A.N(b,null,!1,r)
s.f=A.N(b,null,!1,r)
return s},
lm:function lm(a,b){var _=this
_.a=a
_.c=b
_.d=0
_.f=_.e=null
_.r=$
_.x=_.w=null
_.y=0
_.z=2
_.as=0
_.at=null},
iO:function iO(a,b,c,d){var _=this
_.a=a
_.c=_.b=0
_.d=b
_.w=_.r=_.f=_.e=1
_.x=c
_.y=d
_.z=!1
_.Q=1
_.at=_.as=$
_.ch=_.ay=0
_.cx=_.CW=null
_.db=_.cy=$
_.dy=1
_.fx=_.fr=0
_.id=null
_.k3=_.k2=_.k1=$},
da:function da(a,b){this.a=a
this.b=b},
ae:function ae(a,b){this.a=a
this.b=b},
b8:function b8(a,b){this.a=a
this.b=b},
db:function db(a){var _=this
_.b=_.a=0
_.d=null
_.f=a},
pM(){return new A.kI(new Uint8Array(4096))},
kI:function kI(a){var _=this
_.a=9
_.d=_.c=_.b=0
_.w=_.r=_.f=_.e=$
_.x=a
_.z=_.y=$
_.Q=null
_.as=$},
lh:function lh(a){var _=this
_.b=_.a=null
_.c=$
_.d=a},
lk:function lk(a,b){this.a=a
this.b=b},
li:function li(a,b){this.a=a
this.b=b},
lj:function lj(a,b,c){this.a=a
this.b=b
this.c=c},
ll:function ll(){},
ok(a,b){var s=new Int32Array(4),r=new Int32Array(4),q=new Int8Array(4),p=new Int8Array(4),o=A.N(8,null,!1,t.nX),n=A.N(4,null,!1,t.nk)
return new A.lq(a,b,new A.lF(),new A.lQ(),new A.lz(s,r),new A.lT(q,p),o,n,new Uint8Array(4))},
aD(a,b,c,d,e){var s,r,q,p,o
for(s=c.length,r=a.$flags|0,q=0;q<e;++q){p=b+q
o=d+q
if(!(o>=0&&o<s))return A.a(c,o)
o=c[o]
r&2&&A.b(a)
if(!(p>=0&&p<a.length))return A.a(a,p)
a[p]=o}},
qf(a,b,c){if(c===0)if(a===0)return b===0?6:5
else return b===0?4:0
return c},
lq:function lq(a,b,c,d,e,f,g,h,i){var _=this
_.a=a
_.b=b
_.c=$
_.d=null
_.e=$
_.f=c
_.r=d
_.w=e
_.x=f
_.as=_.Q=_.z=_.y=0
_.ax=_.at=null
_.ch=_.ay=$
_.cx=_.CW=null
_.cy=$
_.db=g
_.dy=h
_.fr=null
_.fy=_.fx=$
_.go=null
_.id=i
_.p3=_.p2=_.p1=_.ok=_.k4=_.k3=_.k2=_.k1=$
_.R8=_.p4=null
_.x2=_.x1=_.to=_.ry=_.rx=_.RG=$
_.xr=null
_.y2=_.y1=0
_.bN=$
_.aV=null
_.bO=$
_.c_=_.co=null
_.aZ=$},
qc(a){var s=new A.fN(a)
s.b=254
s.c=0
s.d=-8
return s},
fN:function fN(a){var _=this
_.a=a
_.d=_.c=_.b=$
_.e=!1},
qd(a){var s=$.t0(),r=$.t_(),q=a<1024?1024:a
return new A.lr(s,r,new Uint8Array(q))},
lr:function lr(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.d=0
_.e=254
_.r=_.f=0
_.w=-8},
ls:function ls(a,b,c,d){var _=this
_.a=a
_.b=b
_.w=c
_.z=d},
mJ(a){var s
if((a&4294967040)>>>0===0)s=a
else s=a<0?0:255
return s},
E(a,b,c){return a+2*b+c+2>>>2},
ho(a5,a6,a7,a8,a9,b0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4
if(!(a6<512))return A.a(a5,a6)
s=a5[a6]
if(!(a8<1792))return A.a(a7,a8)
r=s-a7[a8]
s=a6+1
if(!(s<512))return A.a(a5,s)
s=a5[s]
q=a8+1
if(!(q<1792))return A.a(a7,q)
p=s-a7[q]
q=a6+2
if(!(q<512))return A.a(a5,q)
q=a5[q]
s=a8+2
if(!(s<1792))return A.a(a7,s)
o=q-a7[s]
s=a6+3
if(!(s<512))return A.a(a5,s)
s=a5[s]
q=a8+3
if(!(q<1792))return A.a(a7,q)
n=s-a7[q]
m=r+n
l=p+o
k=p-o
j=r-n
s=B.a.Y(B.a.j(k*2217+j*5352+1812,9),32)
i=B.a.Y(B.a.j(j*2217-k*5352+937,9),32)
a6+=32
a8+=32
if(!(a6<512))return A.a(a5,a6)
q=a5[a6]
if(!(a8<1792))return A.a(a7,a8)
r=q-a7[a8]
q=a6+1
if(!(q<512))return A.a(a5,q)
q=a5[q]
h=a8+1
if(!(h<1792))return A.a(a7,h)
p=q-a7[h]
h=a6+2
if(!(h<512))return A.a(a5,h)
h=a5[h]
q=a8+2
if(!(q<1792))return A.a(a7,q)
o=h-a7[q]
q=a6+3
if(!(q<512))return A.a(a5,q)
q=a5[q]
h=a8+3
if(!(h<1792))return A.a(a7,h)
n=q-a7[h]
g=r+n
f=p+o
k=p-o
j=r-n
e=B.a.Y(B.a.j(k*2217+j*5352+1812,9),32)
d=B.a.Y(B.a.j(j*2217-k*5352+937,9),32)
a6+=32
a8+=32
if(!(a6<512))return A.a(a5,a6)
h=a5[a6]
if(!(a8<1792))return A.a(a7,a8)
r=h-a7[a8]
h=a6+1
if(!(h<512))return A.a(a5,h)
h=a5[h]
q=a8+1
if(!(q<1792))return A.a(a7,q)
p=h-a7[q]
q=a6+2
if(!(q<512))return A.a(a5,q)
q=a5[q]
h=a8+2
if(!(h<1792))return A.a(a7,h)
o=q-a7[h]
h=a6+3
if(!(h<512))return A.a(a5,h)
h=a5[h]
q=a8+3
if(!(q<1792))return A.a(a7,q)
n=h-a7[q]
c=r+n
b=p+o
k=p-o
j=r-n
a=B.a.Y(B.a.j(k*2217+j*5352+1812,9),32)
a0=B.a.Y(B.a.j(j*2217-k*5352+937,9),32)
a6+=32
a8+=32
if(!(a6<512))return A.a(a5,a6)
q=a5[a6]
if(!(a8<1792))return A.a(a7,a8)
r=q-a7[a8]
q=a6+1
if(!(q<512))return A.a(a5,q)
q=a5[q]
h=a8+1
if(!(h<1792))return A.a(a7,h)
p=q-a7[h]
h=a6+2
if(!(h<512))return A.a(a5,h)
h=a5[h]
q=a8+2
if(!(q<1792))return A.a(a7,q)
o=h-a7[q]
q=a6+3
if(!(q<512))return A.a(a5,q)
q=a5[q]
h=a8+3
if(!(h<1792))return A.a(a7,h)
n=q-a7[h]
a1=r+n
a2=p+o
k=p-o
j=r-n
a3=B.a.Y(B.a.j(k*2217+j*5352+1812,9),32)
a4=B.a.Y(B.a.j(j*2217-k*5352+937,9),32)
A.mN((m+l)*8,(g+f)*8,(c+b)*8,(a1+a2)*8,a9,b0)
A.mN(s,e,a,a3,a9,b0+1)
A.mN((m-l)*8,(g-f)*8,(c-b)*8,(a1-a2)*8,a9,b0+2)
A.mN(i,d,a0,a4,a9,b0+3)},
mN(a,b,c,d,e,f){var s,r,q,p=a+d,o=b+c,n=b-c,m=a-d,l=B.a.Y(B.a.j(p+o+7,4),32)
e.$flags&2&&A.b(e)
s=e.length
if(!(f<s))return A.a(e,f)
e[f]=l
l=f+4
r=B.a.Y(B.a.j(n*2217+m*5352+12e3,16),32)
q=m!==0?1:0
if(!(l<s))return A.a(e,l)
e[l]=r+q
q=f+8
r=B.a.Y(B.a.j(p-o+7,4),32)
if(!(q<s))return A.a(e,q)
e[q]=r
r=f+12
q=B.a.Y(B.a.j(m*2217-n*5352+51e3,16),32)
if(!(r<s))return A.a(e,r)
e[r]=q},
xB(a,b,c,d){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=new Int32Array(16)
for(s=0;s<4;++s,b+=64){if(!(b<256))return A.a(a,b)
r=a[b]
q=b+32
if(!(q<256))return A.a(a,q)
q=a[q]
p=r+q
o=b+16
if(!(o<256))return A.a(a,o)
o=a[o]
n=b+48
if(!(n<256))return A.a(a,n)
n=a[n]
m=o+n
l=o-n
k=r-q
q=s*4
if(!(q<16))return A.a(f,q)
f[q]=p+m
r=1+q
if(!(r<16))return A.a(f,r)
f[r]=k+l
r=2+q
if(!(r<16))return A.a(f,r)
f[r]=k-l
q=3+q
if(!(q<16))return A.a(f,q)
f[q]=p-m}for(r=c.$flags|0,q=d+4,o=d+8,n=d+12,s=0;s<4;++s){j=f[s]
i=f[8+s]
p=j+i
h=f[4+s]
g=f[12+s]
m=h+g
l=h-g
k=j-i
i=d+s
j=B.a.j(p+m,1)
r&2&&A.b(c)
if(!(i<16))return A.a(c,i)
c[i]=(j&2147483647)-((j&2147483648)>>>0)
j=q+s
i=B.a.j(k+l,1)
if(!(j<16))return A.a(c,j)
c[j]=(i&2147483647)-((i&2147483648)>>>0)
i=o+s
j=B.a.j(k-l,1)
if(!(i<16))return A.a(c,i)
c[i]=(j&2147483647)-((j&2147483648)>>>0)
j=n+s
i=B.a.j(p-m,1)
if(!(j<16))return A.a(c,j)
c[j]=(i&2147483647)-((i&2147483648)>>>0)}},
yj(a,b,c,d){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=new Int32Array(16)
for(s=b+12,r=b+4,q=b+8,p=0;p<4;++p){o=b+p
if(!(o<16))return A.a(a,o)
o=a[o]
n=s+p
if(!(n<16))return A.a(a,n)
n=a[n]
m=o+n
l=r+p
if(!(l<16))return A.a(a,l)
l=a[l]
k=q+p
if(!(k<16))return A.a(a,k)
k=a[k]
j=l+k
i=l-k
h=o-n
if(!(p<16))return A.a(f,p)
f[p]=m+j
n=8+p
if(!(n<16))return A.a(f,n)
f[n]=m-j
f[4+p]=h+i
n=12+p
if(!(n<16))return A.a(f,n)
f[n]=h-i}for(s=c.$flags|0,p=0;p<4;++p){r=p*4
if(!(r<16))return A.a(f,r)
g=f[r]+3
q=3+r
if(!(q<16))return A.a(f,q)
q=f[q]
m=g+q
o=1+r
if(!(o<16))return A.a(f,o)
o=f[o]
r=2+r
if(!(r<16))return A.a(f,r)
r=f[r]
j=o+r
i=o-r
h=g-q
q=B.a.j(m+j,3)
s&2&&A.b(c)
if(!(d<256))return A.a(c,d)
c[d]=(q&2147483647)-((q&2147483648)>>>0)
q=d+16
r=B.a.j(h+i,3)
if(!(q<256))return A.a(c,q)
c[q]=(r&2147483647)-((r&2147483648)>>>0)
r=d+32
q=B.a.j(m-j,3)
if(!(r<256))return A.a(c,r)
c[r]=(q&2147483647)-((q&2147483648)>>>0)
q=d+48
r=B.a.j(h-i,3)
if(!(q<256))return A.a(c,q)
c[q]=(r&2147483647)-((r&2147483648)>>>0)
d+=64}},
rc(a,b){var s,r,q,p
if(!(b<512))return A.a(a,b)
s=a[b]
for(r=0;r<16;++r){for(q=0;q<16;++q){p=b+q
if(!(p<512))return A.a(a,p)
if(a[p]!==s)return!1}b+=32}return!0},
oM(a,b,c,d){var s,r,q,p,o
for(s=a.length,r=0,q=0;q<c;++q){for(p=1;p<16;++p){o=b+p
if(!(o<s))return A.a(a,o)
r+=a[o]!==0?1:0
if(r>d)return!1}b+=16}return!0},
jx(a1,a2,a3,a4,a5,a6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=a3.length
if(!(a4<a0))return A.a(a3,a4)
s=a3[a4]
r=a4+8
if(!(r<a0))return A.a(a3,r)
r=a3[r]
q=s+r
p=s-r
r=a4+4
if(!(r<a0))return A.a(a3,r)
r=a3[r]
s=B.a.Y(B.a.j(r*35468,16),32)
o=a4+12
if(!(o<a0))return A.a(a3,o)
o=a3[o]
n=s-(B.a.Y(B.a.j(o*20091,16),32)+o)
m=B.a.Y(B.a.j(r*20091,16),32)+r+B.a.Y(B.a.j(o*35468,16),32)
o=a4+1
if(!(o<a0))return A.a(a3,o)
o=a3[o]
r=a4+9
if(!(r<a0))return A.a(a3,r)
r=a3[r]
l=o+r
k=o-r
r=a4+5
if(!(r<a0))return A.a(a3,r)
r=a3[r]
o=B.a.Y(B.a.j(r*35468,16),32)
s=a4+13
if(!(s<a0))return A.a(a3,s)
s=a3[s]
j=o-(B.a.Y(B.a.j(s*20091,16),32)+s)
i=B.a.Y(B.a.j(r*20091,16),32)+r+B.a.Y(B.a.j(s*35468,16),32)
s=a4+2
if(!(s<a0))return A.a(a3,s)
s=a3[s]
r=a4+10
if(!(r<a0))return A.a(a3,r)
r=a3[r]
h=s+r
g=s-r
r=a4+6
if(!(r<a0))return A.a(a3,r)
r=a3[r]
s=B.a.Y(B.a.j(r*35468,16),32)
o=a4+14
if(!(o<a0))return A.a(a3,o)
o=a3[o]
f=s-(B.a.Y(B.a.j(o*20091,16),32)+o)
e=B.a.Y(B.a.j(r*20091,16),32)+r+B.a.Y(B.a.j(o*35468,16),32)
o=a4+3
if(!(o<a0))return A.a(a3,o)
o=a3[o]
r=a4+11
if(!(r<a0))return A.a(a3,r)
r=a3[r]
d=o+r
c=o-r
r=a4+7
if(!(r<a0))return A.a(a3,r)
r=a3[r]
o=B.a.Y(B.a.j(r*35468,16),32)
s=a4+15
if(!(s<a0))return A.a(a3,s)
s=a3[s]
b=o-(B.a.Y(B.a.j(s*20091,16),32)+s)
a=B.a.Y(B.a.j(r*20091,16),32)+r+B.a.Y(B.a.j(s*35468,16),32)
A.mV(q+m,l+i,h+e,d+a,a1,a2,a5,a6)
A.mV(p+n,k+j,g+f,c+b,a1,a2+32,a5,a6+32)
A.mV(p-n,k-j,g-f,c-b,a1,a2+64,a5,a6+64)
A.mV(q-m,l-i,h-e,d-a,a1,a2+96,a5,a6+96)},
mV(a,b,c,d,e,f,g,h){var s=a+4,r=s+c,q=s-c,p=B.a.Y(B.a.j(b*35468,16),32)-(B.a.Y(B.a.j(d*20091,16),32)+d),o=B.a.Y(B.a.j(b*20091,16),32)+b+B.a.Y(B.a.j(d*35468,16),32)
if(!(f<1792))return A.a(e,f)
b=A.mJ(e[f]+B.a.Y(B.a.j(r+o,3),32))
g.$flags&2&&A.b(g)
c=g.length
if(!(h<c))return A.a(g,h)
g[h]=b
b=h+1
d=f+1
if(!(d<1792))return A.a(e,d)
d=A.mJ(e[d]+B.a.Y(B.a.j(q+p,3),32))
if(!(b<c))return A.a(g,b)
g[b]=d
d=h+2
b=f+2
if(!(b<1792))return A.a(e,b)
b=A.mJ(e[b]+B.a.Y(B.a.j(q-p,3),32))
if(!(d<c))return A.a(g,d)
g[d]=b
b=h+3
d=f+3
if(!(d<1792))return A.a(e,d)
d=A.mJ(e[d]+B.a.Y(B.a.j(r-o,3),32))
if(!(b<c))return A.a(g,b)
g[b]=d},
wi(a,b,c){var s,r,q,p
for(s=a.$flags|0,r=0;r<4;++r){q=b+r*32
s&2&&A.b(a)
if(!(q<1792))return A.a(a,q)
a[q]=c
p=q+1
if(!(p<1792))return A.a(a,p)
a[p]=c
p=q+2
if(!(p<1792))return A.a(a,p)
a[p]=c
p=q+3
if(!(p<1792))return A.a(a,p)
a[p]=c}},
mO(a,b,c,d){var s,r,q,p,o,n=c*16843009,m=b>>>2
for(s=d===16,r=a.$flags|0,q=0;q<d;++q){r&2&&A.b(a)
p=a.length
if(!(m<p))return A.a(a,m)
a[m]=n
o=m+1
if(!(o<p))return A.a(a,o)
a[o]=n
if(s){o=m+2
if(!(o<p))return A.a(a,o)
a[o]=n
o=m+3
if(!(o<p))return A.a(a,o)
a[o]=n}m+=8}},
n9(a,b){var s,r=a.length,q=b+1,p=b+2,o=b+3
if($.ru()===B.c_){if(!(b<r))return A.a(a,b)
s=a[b]
if(!(q<r))return A.a(a,q)
q=a[q]
if(!(p<r))return A.a(a,p)
p=a[p]
if(!(o<r))return A.a(a,o)
o=s+q*256+p*65536+a[o]*16777216
r=o}else{if(!(b<r))return A.a(a,b)
s=a[b]
if(!(q<r))return A.a(a,q)
q=a[q]
if(!(p<r))return A.a(a,p)
p=a[p]
if(!(o<r))return A.a(a,o)
o=s*16777216+q*65536+p*256+a[o]
r=o}return r},
jr(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j
if(c==null){A.mO(a,b,127,e)
return}s=A.n9(c,d)
r=A.n9(c,d+4)
q=e===16
p=q?A.n9(c,d+8):0
o=q?A.n9(c,d+12):0
n=b>>>2
for(m=a.$flags|0,l=0;l<e;++l){m&2&&A.b(a)
k=a.length
if(!(n<k))return A.a(a,n)
a[n]=s
j=n+1
if(!(j<k))return A.a(a,j)
a[j]=r
if(q){j=n+2
if(!(j<k))return A.a(a,j)
a[j]=p
j=n+3
if(!(j<k))return A.a(a,j)
a[j]=o}n+=8}},
jk(a,b,c,d,e){var s,r,q,p,o,n,m,l
if(c==null){A.mO(a,b,129,e)
return}s=b>>>2
for(r=e===16,q=c.length,p=a.$flags|0,o=0;o<e;++o){n=d+o
if(!(n<q))return A.a(c,n)
m=c[n]*16843009
p&2&&A.b(a)
n=a.length
if(!(s<n))return A.a(a,s)
a[s]=m
l=s+1
if(!(l<n))return A.a(a,l)
a[l]=m
if(r){l=s+2
if(!(l<n))return A.a(a,l)
a[l]=m
l=s+3
if(!(l<n))return A.a(a,l)
a[l]=m}s+=8}},
n4(a,b,c,d,e,f,a0,a1){var s,r,q,p,o,n,m,l,k,j,i,h,g
if(d==null){if(f!=null)A.jr(b,c,f,a0,a1)
else A.mO(b,c,129,a1)
return}if(f==null){A.jk(b,c,d,e,a1)
return}s=$.p2()
r=e-1
q=d.length
if(!(r>=0&&r<q))return A.a(d,r)
p=255-d[r]
for(r=f.length,o=s.length,n=a.$flags|0,m=0;m<a1;++m){l=e+m
if(!(l<q))return A.a(d,l)
k=p+d[l]
for(j=0;j<a1;j+=4){l=c+j
i=a0+j
if(!(i<r))return A.a(f,i)
h=k+f[i]
if(!(h>=0&&h<o))return A.a(s,h)
h=s[h]
n&2&&A.b(a)
if(!(l<1792))return A.a(a,l)
a[l]=h
h=l+1
g=i+1
if(!(g<r))return A.a(f,g)
g=k+f[g]
if(!(g>=0&&g<o))return A.a(s,g)
g=s[g]
if(!(h<1792))return A.a(a,h)
a[h]=g
g=l+2
h=i+2
if(!(h<r))return A.a(f,h)
h=k+f[h]
if(!(h>=0&&h<o))return A.a(s,h)
h=s[h]
if(!(g<1792))return A.a(a,g)
a[g]=h
l+=3
i+=3
if(!(i<r))return A.a(f,i)
i=k+f[i]
if(!(i>=0&&i<o))return A.a(s,i)
i=s[i]
if(!(l<1792))return A.a(a,l)
a[l]=i}c+=32}},
mL(a,b,c,d,e,f,g,h,i){var s,r,q,p
if(e!=null){for(s=e.length,r=0,q=0;q<g;++q){p=f+q
if(!(p<s))return A.a(e,p)
r+=e[p]}if(c!=null)for(s=c.length,q=0;q<g;++q){p=d+q
if(!(p<s))return A.a(c,p)
r+=c[p]}else r+=r
r=B.a.a6(r+h,i)}else if(c!=null){for(s=c.length,r=0,q=0;q<g;++q){p=d+q
if(!(p<s))return A.a(c,p)
r+=c[p]}r=B.a.a6(r+r+h,i)}else r=128
A.mO(a,b,r,g)},
xZ(a,b,c,d,e,f){A.mL(b,0,c,d,e,f,16,16,5)
A.jr(b,512,e,f,16)
A.jk(b,528,c,d,16)
A.n4(a,b,16,c,d,e,f,16)},
rh(a,b,c,d,e,f){var s,r
A.mL(b,1024,c,d,e,f,8,8,4)
A.jr(b,1280,e,f,8)
A.jk(b,1296,c,d,8)
A.n4(a,b,1040,c,d,e,f,8)
s=d+16
r=f+8
A.mL(b,1032,c,s,e,r,8,8,4)
A.jr(b,1288,e,r,8)
A.jk(b,1304,c,s,8)
A.n4(a,b,1048,c,s,e,r,8)},
y_(d3,d4,d5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2=d5-1
if(!(d2>=0&&d2<40))return A.a(d4,d2)
s=d4[d2]
d2=d5-2
if(!(d2>=0&&d2<40))return A.a(d4,d2)
r=d4[d2]
q=d5-3
if(!(q>=0&&q<40))return A.a(d4,q)
p=d4[q]
q=d5-4
if(!(q>=0&&q<40))return A.a(d4,q)
o=d4[q]
q=d5-5
if(!(q>=0&&q<40))return A.a(d4,q)
n=d4[q]
if(!(d5<40))return A.a(d4,d5)
m=d4[d5]
q=d5+1
if(!(q<40))return A.a(d4,q)
l=d4[q]
q=d5+2
if(!(q<40))return A.a(d4,q)
k=d4[q]
q=d5+3
if(!(q<40))return A.a(d4,q)
j=d4[q]
q=d5+4
if(!(q<40))return A.a(d4,q)
i=d4[q]
q=d5+5
if(!(q<40))return A.a(d4,q)
h=d4[q]
q=d5+6
if(!(q<40))return A.a(d4,q)
g=d4[q]
q=d5+7
if(!(q<40))return A.a(d4,q)
f=d4[q]
A.wi(d3,1536,4+m+l+k+j+n+o+p+r>>>3)
e=$.p2()
d=255-s
for(q=e.length,c=d3.$flags|0,b=0;b<4;++b){a=d2-b
if(!(a>=0))return A.a(d4,a)
a0=d+d4[a]
a1=1540+b*32
a=a0+m
if(!(a>=0&&a<q))return A.a(e,a)
a=e[a]
c&2&&A.b(d3)
if(!(a1<1792))return A.a(d3,a1)
d3[a1]=a
a=a1+1
a2=a0+l
if(!(a2>=0&&a2<q))return A.a(e,a2)
a2=e[a2]
if(!(a<1792))return A.a(d3,a)
d3[a]=a2
a2=a1+2
a=a0+k
if(!(a>=0&&a<q))return A.a(e,a)
a=e[a]
if(!(a2<1792))return A.a(d3,a2)
d3[a2]=a
a=a1+3
a2=a0+j
if(!(a2>=0&&a2<q))return A.a(e,a2)
a2=e[a2]
if(!(a<1792))return A.a(d3,a)
d3[a]=a2}A.jq(d3,1544,A.E(s,m,l),A.E(m,l,k),A.E(l,k,j),A.E(k,j,i),4)
d2=A.E(s,r,p)
q=A.E(r,p,o)
c=A.E(p,o,n)
a=A.E(o,n,n)
A.jq(d3,1548,d2,d2,d2,d2,1)
A.jq(d3,1580,q,q,q,q,1)
A.jq(d3,1612,c,c,c,c,1)
A.jq(d3,1644,a,a,a,a,1)
a=A.E(p,o,n)
d3.$flags&2&&A.b(d3)
d3[1648]=a
d3[1616]=A.E(r,p,o)
d3[1649]=A.E(r,p,o)
a3=A.E(s,r,p)
d3[1584]=a3
d3[1617]=a3
d3[1650]=a3
a4=A.E(m,s,r)
d3[1552]=a4
d3[1585]=a4
d3[1618]=a4
d3[1651]=a4
a5=A.E(l,m,s)
d3[1553]=a5
d3[1586]=a5
d3[1619]=a5
a6=A.E(k,l,m)
d3[1554]=a6
d3[1587]=a6
d3[1555]=A.E(j,k,l)
a7=s+m+1>>>1
d3[1556]=a7
d3[1621]=a7
a8=m+l+1>>>1
d3[1557]=a8
d3[1622]=a8
a9=l+k+1>>>1
d3[1558]=a9
d3[1623]=a9
a=k+j+1>>>1
d3[1559]=a
d3[1652]=A.E(o,p,r)
d3[1620]=A.E(p,r,s)
b0=A.E(r,s,m)
d3[1588]=b0
d3[1653]=b0
b1=A.E(s,m,l)
d3[1589]=b1
d3[1654]=b1
b2=A.E(m,l,k)
d3[1590]=b2
d3[1655]=b2
d3[1591]=A.E(l,k,j)
d3[1560]=A.E(m,l,k)
b3=A.E(l,k,j)
d3[1561]=b3
d3[1592]=b3
b4=A.E(k,j,i)
d3[1562]=b4
d3[1593]=b4
d3[1624]=b4
b5=A.E(j,i,h)
d3[1563]=b5
d3[1594]=b5
d3[1625]=b5
d3[1656]=b5
b6=A.E(i,h,g)
d3[1595]=b6
d3[1626]=b6
d3[1657]=b6
b7=A.E(h,g,f)
d3[1627]=b7
d3[1658]=b7
d3[1659]=A.E(g,f,f)
d3[1564]=a8
d3[1565]=a9
d3[1628]=a9
d3[1566]=a
d3[1629]=a
b8=j+i+1>>>1
d3[1567]=b8
d3[1630]=b8
d3[1596]=A.E(m,l,k)
b9=A.E(l,k,j)
d3[1597]=b9
d3[1660]=b9
c0=A.E(k,j,i)
d3[1598]=c0
d3[1661]=c0
c1=A.E(j,i,h)
d3[1599]=c1
d3[1662]=c1
d3[1631]=A.E(i,h,g)
d3[1663]=A.E(h,g,f)
c2=r+s+1>>>1
d3[1664]=c2
d3[1698]=c2
c3=p+r+1>>>1
d3[1696]=c3
d3[1730]=c3
c4=o+p+1>>>1
d3[1728]=c4
d3[1762]=c4
d3[1760]=n+o+1>>>1
d3[1667]=A.E(m,l,k)
d3[1666]=A.E(s,m,l)
c5=A.E(r,s,m)
d3[1665]=c5
d3[1699]=c5
c6=A.E(p,r,s)
d3[1697]=c6
d3[1731]=c6
c7=A.E(o,p,r)
d3[1729]=c7
d3[1763]=c7
d3[1761]=A.E(n,o,p)
d3[1668]=r+p+1>>>1
c8=p+o+1>>>1
d3[1670]=c8
d3[1700]=c8
c9=o+n+1>>>1
d3[1702]=c9
d3[1732]=c9
d3[1669]=A.E(r,p,o)
d0=A.E(p,o,n)
d3[1671]=d0
d3[1701]=d0
d1=A.E(o,n,n)
d3[1703]=d1
d3[1733]=d1
d3[1735]=n
d3[1734]=n
d3[1764]=n
d3[1765]=n
d3[1766]=n
d3[1767]=n},
jq(a,b,c,d,e,f,g){var s,r,q,p
for(s=a.$flags|0,r=0;r<g;++r){q=b+r*32
s&2&&A.b(a)
if(!(q<1792))return A.a(a,q)
a[q]=c
p=q+1
if(!(p<1792))return A.a(a,p)
a[p]=d
p=q+2
if(!(p<1792))return A.a(a,p)
a[p]=e
p=q+3
if(!(p<1792))return A.a(a,p)
a[p]=f}},
xK(a,b,c,d){var s,r,q,p,o,n,m,l,k
for(s=c.length,r=0,q=0;q<4;++q){if(!(b<512))return A.a(a,b)
p=a[b]
if(!(d<s))return A.a(c,d)
o=p-c[d]
p=b+1
if(!(p<512))return A.a(a,p)
p=a[p]
n=d+1
if(!(n<s))return A.a(c,n)
m=p-c[n]
n=b+2
if(!(n<512))return A.a(a,n)
n=a[n]
p=d+2
if(!(p<s))return A.a(c,p)
l=n-c[p]
p=b+3
if(!(p<512))return A.a(a,p)
p=a[p]
n=d+3
if(!(n<s))return A.a(c,n)
k=p-c[n]
r+=o*o+m*m+l*l+k*k
b+=32
d+=32}return r},
jw(a,b,c,d,e,f){var s,r,q,p,o,n,m
for(s=c.length,r=0,q=0;q<f;++q){for(p=0;p<e;++p){o=b+p
if(!(o<512))return A.a(a,o)
o=a[o]
n=d+p
if(!(n<s))return A.a(c,n)
m=o-c[n]
r+=m*m}b+=32
d+=32}return r},
n2(a2,a3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1=a2.length
if(!(a3<a1))return A.a(a2,a3)
s=a2[a3]
r=a3+2
if(!(r<a1))return A.a(a2,r)
r=a2[r]
q=s+r
p=a3+1
if(!(p<a1))return A.a(a2,p)
p=a2[p]
o=a3+3
if(!(o<a1))return A.a(a2,o)
o=a2[o]
n=p+o
m=p-o
l=s-r
a3+=32
if(!(a3<a1))return A.a(a2,a3)
r=a2[a3]
s=a3+2
if(!(s<a1))return A.a(a2,s)
s=a2[s]
k=r+s
o=a3+1
if(!(o<a1))return A.a(a2,o)
o=a2[o]
p=a3+3
if(!(p<a1))return A.a(a2,p)
p=a2[p]
j=o+p
i=o-p
h=r-s
a3+=32
if(!(a3<a1))return A.a(a2,a3)
s=a2[a3]
r=a3+2
if(!(r<a1))return A.a(a2,r)
r=a2[r]
g=s+r
p=a3+1
if(!(p<a1))return A.a(a2,p)
p=a2[p]
o=a3+3
if(!(o<a1))return A.a(a2,o)
o=a2[o]
f=p+o
e=p-o
d=s-r
a3+=32
if(!(a3<a1))return A.a(a2,a3)
r=a2[a3]
s=a3+2
if(!(s<a1))return A.a(a2,s)
s=a2[s]
c=r+s
o=a3+1
if(!(o<a1))return A.a(a2,o)
o=a2[o]
p=a3+3
if(!(p<a1))return A.a(a2,p)
p=a2[p]
b=o+p
a=o-p
a0=r-s
return A.n3(q+n,k+j,g+f,c+b,38,32,20,9)+A.n3(l+m,h+i,d+e,a0+a,32,28,17,7)+A.n3(l-m,h-i,d-e,a0-a,20,17,10,4)+A.n3(q-n,k-j,g-f,c-b,9,7,4,2)},
n3(a,b,c,d,e,f,g,a0){var s=a+c,r=b+d,q=b-d,p=a-c,o=s+r,n=p+q,m=p-q,l=s-r,k=o<0?-o:o,j=n<0?-n:n,i=m<0?-m:m,h=l<0?-l:l
return e*k+f*j+g*i+a0*h},
xW(a,b,c,d){var s,r,q,p,o,n,m
for(s=c.$flags|0,r=0;r<4;++r){for(q=0,p=0;p<4;++p)for(o=p*32,n=0;n<4;++n){m=b+n+o
if(!(m<512))return A.a(a,m)
q+=a[m]}o=d+r
s&2&&A.b(c)
if(!(o<16))return A.a(c,o)
c[o]=q
b+=4}},
xs(a,b,c,d){var s,r,q,p,o
for(s=a.length,r=c.$flags|0,q=0;q<4;++q){if(!(b<s))return A.a(a,b)
p=a[b]
r&2&&A.b(c)
if(!(d<512))return A.a(c,d)
c[d]=p
p=d+1
o=b+1
if(!(o<s))return A.a(a,o)
o=a[o]
if(!(p<512))return A.a(c,p)
c[p]=o
o=d+2
p=b+2
if(!(p<s))return A.a(a,p)
p=a[p]
if(!(o<512))return A.a(c,o)
c[o]=p
p=d+3
o=b+3
if(!(o<s))return A.a(a,o)
o=a[o]
if(!(p<512))return A.a(c,p)
c[p]=o
b+=32
d+=32}},
xr(a,b,c,d){var s
for(s=0;s<8;++s){B.d.a3(c,d,d+16,a,b)
b+=32
d+=32}},
mK:function mK(){},
on(a,b){var s=a+b
return s===0?255:B.a.Z(255*a+B.a.P(s,2),s)},
lx:function lx(a,b,c,d){var _=this
_.a=a
_.b=b
_.d=c
_.e=d},
H(a,b,c){return B.a.Y(B.a.j(a+2*b+c+2,2),32)},
uI(a){var s,r=A.j([A.H(J.d(a.a,a.d+-33),J.d(a.a,a.d+-32),J.d(a.a,a.d+-31)),A.H(J.d(a.a,a.d+-32),J.d(a.a,a.d+-31),J.d(a.a,a.d+-30)),A.H(J.d(a.a,a.d+-31),J.d(a.a,a.d+-30),J.d(a.a,a.d+-29)),A.H(J.d(a.a,a.d+-30),J.d(a.a,a.d+-29),J.d(a.a,a.d+-28))],t.t)
for(s=0;s<4;++s)a.dS(s*32,4,r)},
uA(a){var s=J.d(a.a,a.d+-33),r=J.d(a.a,a.d+-1),q=J.d(a.a,a.d+31),p=J.d(a.a,a.d+63),o=J.d(a.a,a.d+95),n=A.w(a,null,0),m=n.dX(),l=A.H(s,r,q)
m.$flags&2&&A.b(m)
if(0>=m.length)return A.a(m,0)
m[0]=16843009*l
n.d+=32
l=n.dX()
m=A.H(r,q,p)
l.$flags&2&&A.b(l)
if(0>=l.length)return A.a(l,0)
l[0]=16843009*m
n.d+=32
m=n.dX()
l=A.H(q,p,o)
m.$flags&2&&A.b(m)
if(0>=m.length)return A.a(m,0)
m[0]=16843009*l
n.d+=32
l=n.dX()
m=A.H(p,o,o)
l.$flags&2&&A.b(l)
if(0>=l.length)return A.a(l,0)
l[0]=16843009*m},
uy(a){var s,r,q,p
for(s=4,r=0;r<4;++r)s+=J.d(a.a,a.d+(r-32))+J.d(a.a,a.d+(-1+r*32))
s=B.a.j(s,3)
for(r=0;r<4;++r){q=a.a
p=a.d+r*32
J.eu(q,p,p+4,s)}},
oo(a,b){var s,r,q,p,o,n,m=255-J.d(a.a,a.d+-33)
for(s=0,r=0;r<b;++r){q=m+J.d(a.a,a.d+(s-1))
for(p=0;p<b;++p){o=$.nG()
n=q+J.d(a.a,a.d+(-32+p))
if(!(n>=0&&n<766))return A.a(o,n)
n=o[n]
J.a2(a.a,a.d+(s+p),n)}s+=32}},
uG(a){A.oo(a,4)},
uH(a){A.oo(a,8)},
uF(a){A.oo(a,16)},
uE(a){var s,r=J.d(a.a,a.d+-1),q=J.d(a.a,a.d+31),p=J.d(a.a,a.d+63),o=J.d(a.a,a.d+95),n=J.d(a.a,a.d+-33),m=J.d(a.a,a.d+-32),l=J.d(a.a,a.d+-31),k=J.d(a.a,a.d+-30),j=J.d(a.a,a.d+-29)
a.i(0,96,A.H(q,p,o))
s=A.H(r,q,p)
a.i(0,97,s)
a.i(0,64,s)
s=A.H(n,r,q)
a.i(0,98,s)
a.i(0,65,s)
a.i(0,32,s)
s=A.H(m,n,r)
a.i(0,99,s)
a.i(0,66,s)
a.i(0,33,s)
a.i(0,0,s)
s=A.H(l,m,n)
a.i(0,67,s)
a.i(0,34,s)
a.i(0,1,s)
s=A.H(k,l,m)
a.i(0,35,s)
a.i(0,2,s)
a.i(0,3,A.H(j,k,l))},
uD(a){var s,r=J.d(a.a,a.d+-32),q=J.d(a.a,a.d+-31),p=J.d(a.a,a.d+-30),o=J.d(a.a,a.d+-29),n=J.d(a.a,a.d+-28),m=J.d(a.a,a.d+-27),l=J.d(a.a,a.d+-26),k=J.d(a.a,a.d+-25)
a.i(0,0,A.H(r,q,p))
s=A.H(q,p,o)
a.i(0,32,s)
a.i(0,1,s)
s=A.H(p,o,n)
a.i(0,64,s)
a.i(0,33,s)
a.i(0,2,s)
s=A.H(o,n,m)
a.i(0,96,s)
a.i(0,65,s)
a.i(0,34,s)
a.i(0,3,s)
s=A.H(n,m,l)
a.i(0,97,s)
a.i(0,66,s)
a.i(0,35,s)
s=A.H(m,l,k)
a.i(0,98,s)
a.i(0,67,s)
a.i(0,99,A.H(l,k,k))},
uK(a){var s=J.d(a.a,a.d+-1),r=J.d(a.a,a.d+31),q=J.d(a.a,a.d+63),p=J.d(a.a,a.d+-33),o=J.d(a.a,a.d+-32),n=J.d(a.a,a.d+-31),m=J.d(a.a,a.d+-30),l=J.d(a.a,a.d+-29),k=B.a.Y(B.a.j(p+o+1,1),32)
a.i(0,65,k)
a.i(0,0,k)
k=B.a.Y(B.a.j(o+n+1,1),32)
a.i(0,66,k)
a.i(0,1,k)
k=B.a.Y(B.a.j(n+m+1,1),32)
a.i(0,67,k)
a.i(0,2,k)
a.i(0,3,B.a.Y(B.a.j(m+l+1,1),32))
a.i(0,96,A.H(q,r,s))
a.i(0,64,A.H(r,s,p))
k=A.H(s,p,o)
a.i(0,97,k)
a.i(0,32,k)
k=A.H(p,o,n)
a.i(0,98,k)
a.i(0,33,k)
k=A.H(o,n,m)
a.i(0,99,k)
a.i(0,34,k)
a.i(0,35,A.H(n,m,l))},
uJ(a){var s,r=J.d(a.a,a.d+-32),q=J.d(a.a,a.d+-31),p=J.d(a.a,a.d+-30),o=J.d(a.a,a.d+-29),n=J.d(a.a,a.d+-28),m=J.d(a.a,a.d+-27),l=J.d(a.a,a.d+-26),k=J.d(a.a,a.d+-25)
a.i(0,0,B.a.Y(B.a.j(r+q+1,1),32))
s=B.a.Y(B.a.j(q+p+1,1),32)
a.i(0,64,s)
a.i(0,1,s)
s=B.a.Y(B.a.j(p+o+1,1),32)
a.i(0,65,s)
a.i(0,2,s)
s=B.a.Y(B.a.j(o+n+1,1),32)
a.i(0,66,s)
a.i(0,3,s)
a.i(0,32,A.H(r,q,p))
s=A.H(q,p,o)
a.i(0,96,s)
a.i(0,33,s)
s=A.H(p,o,n)
a.i(0,97,s)
a.i(0,34,s)
s=A.H(o,n,m)
a.i(0,98,s)
a.i(0,35,s)
a.i(0,67,A.H(n,m,l))
a.i(0,99,A.H(m,l,k))},
uB(a){var s,r=J.d(a.a,a.d+-1),q=J.d(a.a,a.d+31),p=J.d(a.a,a.d+63),o=J.d(a.a,a.d+95)
a.i(0,0,B.a.Y(B.a.j(r+q+1,1),32))
s=B.a.Y(B.a.j(q+p+1,1),32)
a.i(0,32,s)
a.i(0,2,s)
s=B.a.Y(B.a.j(p+o+1,1),32)
a.i(0,64,s)
a.i(0,34,s)
a.i(0,1,A.H(r,q,p))
s=A.H(q,p,o)
a.i(0,33,s)
a.i(0,3,s)
s=A.H(p,o,o)
a.i(0,65,s)
a.i(0,35,s)
a.i(0,99,o)
a.i(0,98,o)
a.i(0,97,o)
a.i(0,96,o)
a.i(0,66,o)
a.i(0,67,o)},
uz(a){var s=J.d(a.a,a.d+-1),r=J.d(a.a,a.d+31),q=J.d(a.a,a.d+63),p=J.d(a.a,a.d+95),o=J.d(a.a,a.d+-33),n=J.d(a.a,a.d+-32),m=J.d(a.a,a.d+-31),l=J.d(a.a,a.d+-30),k=B.a.Y(B.a.j(s+o+1,1),32)
a.i(0,34,k)
a.i(0,0,k)
k=B.a.Y(B.a.j(r+s+1,1),32)
a.i(0,66,k)
a.i(0,32,k)
k=B.a.Y(B.a.j(q+r+1,1),32)
a.i(0,98,k)
a.i(0,64,k)
a.i(0,96,B.a.Y(B.a.j(p+q+1,1),32))
a.i(0,3,A.H(n,m,l))
a.i(0,2,A.H(o,n,m))
k=A.H(s,o,n)
a.i(0,35,k)
a.i(0,1,k)
k=A.H(r,s,o)
a.i(0,67,k)
a.i(0,33,k)
k=A.H(q,r,s)
a.i(0,99,k)
a.i(0,65,k)
a.i(0,97,A.H(p,q,r))},
uV(a){var s
for(s=0;s<16;++s)a.cI(s*32,16,a,-32)},
uT(a){var s,r,q,p,o
for(s=0,r=16;r>0;--r){q=J.d(a.a,a.d+(s-1))
p=a.a
o=a.d+s
J.eu(p,o,o+16,q)
s+=32}},
lD(a,b){var s,r,q
for(s=0;s<16;++s){r=b.a
q=b.d+s*32
J.eu(r,q,q+16,a)}},
uL(a){var s,r
for(s=16,r=0;r<16;++r)s+=J.d(a.a,a.d+(-1+r*32))+J.d(a.a,a.d+(r-32))
A.lD(B.a.j(s,5),a)},
uN(a){var s,r
for(s=8,r=0;r<16;++r)s+=J.d(a.a,a.d+(-1+r*32))
A.lD(B.a.j(s,4),a)},
uM(a){var s,r
for(s=8,r=0;r<16;++r)s+=J.d(a.a,a.d+(r-32))
A.lD(B.a.j(s,4),a)},
uO(a){A.lD(128,a)},
uW(a){var s
for(s=0;s<8;++s)a.cI(s*32,8,a,-32)},
uU(a){var s,r,q,p,o
for(s=0,r=0;r<8;++r){q=J.d(a.a,a.d+(s-1))
p=a.a
o=a.d+s
J.eu(p,o,o+8,q)
s+=32}},
lE(a,b){var s,r,q
for(s=0;s<8;++s){r=b.a
q=b.d+s*32
J.eu(r,q,q+8,a)}},
uP(a){var s,r
for(s=8,r=0;r<8;++r)s+=J.d(a.a,a.d+(r-32))+J.d(a.a,a.d+(-1+r*32))
A.lE(B.a.j(s,4),a)},
uQ(a){var s,r
for(s=4,r=0;r<8;++r)s+=J.d(a.a,a.d+(r-32))
A.lE(B.a.j(s,3),a)},
uR(a){var s,r
for(s=4,r=0;r<8;++r)s+=J.d(a.a,a.d+(-1+r*32))
A.lE(B.a.j(s,3),a)},
uS(a){A.lE(128,a)},
lA(a,b){return B.a.j(a*b+1073741824,16)-16384},
lB(a,b,c,d,e){var s=b+c+d*32
a.i(0,s,A.ux(J.d(a.a,a.d+s)+(B.a.j(e+65536,3)-8192)))},
lC(a,b,c,d,e){A.lB(a,0,0,b,c+d)
A.lB(a,0,1,b,c+e)
A.lB(a,0,2,b,c-e)
A.lB(a,0,3,b,c-d)},
uC(){var s,r,q,p
if(!$.qe){for(s=-255;s<=255;++s){r=$.oV()
q=255+s
p=s<0?-s:s
r.$flags&2&&A.b(r)
r[q]=p
p=$.oW()
r=B.a.j(r[q],1)
p.$flags&2&&A.b(p)
p[q]=r}for(s=-1020;s<=1020;++s){r=$.oX()
if(s<-128)q=-128
else q=s>127?127:s
r.$flags&2&&A.b(r)
r[1020+s]=q}for(s=-112;s<=112;++s){r=$.oY()
if(s<-16)q=-16
else q=s>15?15:s
r.$flags&2&&A.b(r)
r[112+s]=q}for(s=-255;s<=510;++s){r=$.nG()
if(s<0)q=0
else q=s>255?255:s
r.$flags&2&&A.b(r)
r[255+s]=q}$.qe=!0}},
ux(a){var s
if((a&-256)>>>0===0)s=a
else s=a<0?0:255
return s},
ly:function ly(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
ol(a){var s=new Uint8Array(512),r=new Uint8Array(512),q=new Uint8Array(512),p=new Uint8Array(1792),o=new Uint8Array(17),n=new Uint8Array(32),m=new Uint8Array(32),l=new Uint8Array(40),k=new Int32Array(9),j=new Int32Array(9)
s=new A.lu(a,s,r,q,p,o,n,m,l,k,j,new Int8Array(4))
r=a.as
r===$&&A.c()
s.at=r
q=a.at
q===$&&A.c()
s.ax=q
s.f3(0)
s.fx=a.c*a.d
B.d.V(r,0,r.length,127)
B.d.V(q,0,q.length,127)
q=a.Q
q===$&&A.c()
B.t.V(q,0,q.length,0)
q=a.ax
q===$&&A.c()
if(q!=null)B.O.V(q,0,q.length,0)
s.fr=!1
return s},
om(a,b,c,d,e,f,g,h){var s,r,q,p
for(s=f<h,r=0;r<g;++r){q=e+f
B.d.a3(d,e,q,a,b)
if(s){p=q-1
if(!(p>=0&&p<512))return A.a(d,p)
B.d.V(d,q,e+h,d[p])}e+=32
b+=c}for(r=g;r<h;++r){B.d.a3(d,e,e+h,d,e-32)
e+=32}},
fO(a,b,c,d,e,f,g){var s,r,q,p,o,n
for(s=a.length,r=d.$flags|0,q=0;q<f;++q,b+=c){p=e+q
if(!(b>=0&&b<s))return A.a(a,b)
o=a[b]
r&2&&A.b(d)
if(!(p<d.length))return A.a(d,p)
d[p]=o}for(s=e+f-1,r=d.length,p=d.$flags|0;q<g;++q){o=e+q
if(!(s>=0&&s<r))return A.a(d,s)
n=d[s]
p&2&&A.b(d)
if(!(o<r))return A.a(d,o)
d[o]=n}},
lu:function lu(a,b,c,d,e,f,g,h,i,j,k,l){var _=this
_.a=a
_.c=_.b=0
_.d=b
_.e=c
_.f=d
_.r=e
_.w=$
_.y=_.x=0
_.z=1
_.as=_.Q=0
_.ax=_.at=$
_.ay=f
_.ch=g
_.CW=h
_.cx=i
_.db=_.cy=0
_.dx=j
_.dy=k
_.fr=!1
_.fx=0
_.fy=l},
qJ(a){var s,r,q,p,o,n,m,l=new Uint8Array(1056)
for(s=0,r=0;r<4;++r)for(q=B.c.gF(a[r]);q.C();)for(p=J.cd(q.gN());p.C();)for(o=J.cd(p.gN());o.C();s=m){n=o.gN()
m=s+1
if(!(s>=0&&s<1056))return A.a(l,s)
l[s]=n}return l},
bd(a,b){var s
if(a===0){if(!(b>=0&&b<256))return A.a(B.n,b)
s=B.n[b]}else{s=255-b
if(!(s>=0&&s<256))return A.a(B.n,s)
s=B.n[s]}return s},
lv:function lv(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.y=!0},
nB(a,b,c,d,e){var s=e.e,r=e.a,q=r[1],p=e.b,o=p[1],n=e.c,m=n[1],l=e.d,k=l[1],j=A.aG(a,b,c,d,s[0],r[0],p[0],n[0],l[0])?0:-1
if(A.aG(a,b+1,c,d+1,s[1],q,o,m,k))j=1
if(A.aG(a,b+4,c,d+2,s[4],q,o,m,k))j=2
if(A.aG(a,b+8,c,d+3,s[8],q,o,m,k))j=3
if(A.aG(a,b+5,c,d+4,s[5],q,o,m,k))j=4
if(A.aG(a,b+2,c,d+5,s[2],q,o,m,k))j=5
if(A.aG(a,b+3,c,d+6,s[3],q,o,m,k))j=6
if(A.aG(a,b+6,c,d+7,s[6],q,o,m,k))j=7
if(A.aG(a,b+9,c,d+8,s[9],q,o,m,k))j=8
if(A.aG(a,b+12,c,d+9,s[12],q,o,m,k))j=9
if(A.aG(a,b+13,c,d+10,s[13],q,o,m,k))j=10
if(A.aG(a,b+10,c,d+11,s[10],q,o,m,k))j=11
if(A.aG(a,b+7,c,d+12,s[7],q,o,m,k))j=12
if(A.aG(a,b+11,c,d+13,s[11],q,o,m,k))j=13
if(A.aG(a,b+14,c,d+14,s[14],q,o,m,k))j=14
return A.aG(a,b+15,c,d+15,s[15],q,o,m,k)?15:j},
aG(a,b,c,d,e,f,g,h,i){var s,r,q,p
if(!(b<a.length))return A.a(a,b)
s=a[b]
r=s<0?-1:1
q=s*r+e
if(q>i){p=B.a.j(q*g+h,17)
p=(p>2047?2047:p)*r
a.$flags&2&&A.b(a)
a[b]=p*f
c.$flags&2&&A.b(c)
if(!(d<c.length))return A.a(c,d)
c[d]=p
return p!==0}c.$flags&2&&A.b(c)
if(!(d<c.length))return A.a(c,d)
c[d]=0
a.$flags&2&&A.b(a)
a[b]=0
return!1},
nC(a,b,c){var s,r,q,p,o,n
if(!(b<256))return A.a(a,b)
s=a[b]
r=s<0
if(r)s=-s
if(s>c.d[0]){q=B.a.j(s*c.b[0]+c.c[0],17)
if(q>2047)q=2047
p=q*c.a[0]
o=s-p
n=r?-p:p
a.$flags&2&&A.b(a)
a[b]=n
return B.a.Y(B.a.j(r?-o:o,1),32)}a.$flags&2&&A.b(a)
a[b]=0
return B.a.Y(B.a.j(r?-s:s,1),32)},
rk(a,b,c,d,e){var s=A.nB(a,b,c,d,e)>=0?1:0
return s|(A.nB(a,b+16,c,d+16,e)>=0?2:0)},
vf(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=J.aa(4,t.gL)
for(s=0;s<4;++s){r=new Int32Array(16)
q=new Int32Array(16)
p=new Int32Array(16)
o=new Int32Array(16)
n=new Int32Array(16)
m=new Int32Array(16)
l=new Int32Array(16)
k=new Int32Array(16)
j=new Int32Array(16)
i=new Int32Array(16)
h=new Int32Array(16)
g=new Int32Array(16)
f=new Int32Array(16)
e=new Int32Array(16)
d[s]=new A.iZ(new A.fV(r,q,p,o,n),new A.fV(m,l,k,j,i),new A.fV(h,g,f,e,new Int32Array(16)))}return new A.lS(a,d)},
fV:function fV(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
iZ:function iZ(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.cx=_.ch=_.ay=_.ax=_.as=_.Q=_.z=_.y=_.x=_.w=_.r=_.f=_.e=_.d=0},
lS:function lS(a,b){var _=this
_.a=a
_.b=b
_.y=_.x=_.w=_.r=_.f=_.e=_.d=_.c=0
_.z=!1},
oF(a,b){b.e=(b.d+b.c)*a+256*(b.a+b.b)},
uw(a,b,c){return((a*8+b)*3+c)*11},
c3:function c3(a,b,c,d,e){var _=this
_.e=_.d=_.c=_.b=_.a=0
_.f=a
_.r=b
_.w=c
_.x=0
_.y=d
_.z=0
_.Q=e
_.as=0},
lt:function lt(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i
_.y=j
_.z=k
_.Q=l
_.as=m
_.at=!1
_.ax=n
_.ay=o
_.ch=p
_.CW=q
_.cx=r
_.cy=s},
oC(a,b,c){return((a*8+b)*3+c)*11},
nu(a1,a2,a3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=a2.c,a0=a2.d
a0===$&&A.c()
s=a2.e
r=a2.a
q=a1.a
p=A.oC(a,r,a3)
if(!(p>=0&&p<1056))return A.a(q,p)
o=q[p]
if(a2.b<0)return A.bd(0,o)
n=a3===0?A.bd(1,o):0
p=a1.d
m=a*16
l=(m+r)*3+a3
if(!(l>=0&&l<192))return A.a(p,l)
k=p[l]
j=m*3
for(m=a2.b,l=a1.e,i=l.length,h=a1.c,g=a0.length;r<m;){f=s+r
if(!(f<g))return A.a(a0,f)
e=a0[f]
d=e<0?-e:e
if(!(d>=0&&d<i))return A.a(l,d)
f=l[d]
c=k+(d>67?67:d)
if(!(c>=0&&c<6528))return A.a(h,c)
n+=f+h[c];++r
f=d>=2?2:d
f=j+r*3+f
if(!(f<192))return A.a(p,f)
k=p[f]}p=s+r
if(!(p<g))return A.a(a0,p)
e=a0[p]
d=e<0?-e:e
n+=a1.nD(k,d)
if(r<15){b=d===1?1:2
a0=A.oC(a,B.K[r+1],b)
if(!(a0>=0&&a0<1056))return A.a(q,a0)
n+=A.bd(0,q[a0])}return n},
oQ(a2,a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=a3.c,a1=a3.d
a1===$&&A.c()
s=a3.e
r=a3.b
q=a3.a
p=A.oC(a0,q,a4)
if(a5.mT(0,a2,r>=0?1:0,p)===0)return 0
for(o=a0*8,n=a1.length;q<16;q=m){m=q+1
l=s+q
if(!(l<n))return A.a(a1,l)
k=a1[l]
j=k<0
i=j?-k:k
l=i!==0?1:0
h=p+1
a5.aI((l<<15|h)>>>0)
if(a2.b_(l,h)===0){p=(o+B.K[m])*3*11
continue}l=i>1?1:0
h=p+2
a5.aI((l<<15|h)>>>0)
if(a2.b_(l,h)===0)p=((o+B.K[m])*3+1)*11
else{l=i>4?1:0
h=p+3
a5.aI((l<<15|h)>>>0)
if(a2.b_(l,h)===0){l=i!==2?1:0
h=p+4
a5.aI((l<<15|h)>>>0)
if(a2.b_(l,h)!==0){l=i===4?1:0
h=p+5
a5.aI((l<<15|h)>>>0)
a2.b_(l,h)}}else{l=i>10?1:0
h=p+6
a5.aI((l<<15|h)>>>0)
if(a2.b_(l,h)===0){l=i>6?1:0
h=p+7
a5.aI((l<<15|h)>>>0)
if(a2.b_(l,h)===0)a5.aI(((i===6?1:0)<<15|16543)>>>0)
else{a5.aI(((i>=9?1:0)<<15|16549)>>>0)
a5.aI((((i&1)===0?1:0)<<15|16529)>>>0)}}else{g=i-3
if(g<16){l=p+8
a5.aI((l|0)>>>0)
a2.b_(0,l)
l=p+9
a5.aI((l|0)>>>0)
a2.b_(0,l)
g-=8
f=4
e=B.cA}else if(g<32){l=p+8
a5.aI((l|0)>>>0)
a2.b_(0,l)
l=p+9
a5.aI((l|32768)>>>0)
a2.b_(1,l)
g-=16
f=8
e=B.cB}else{l=p+8
h=p+10
d=p+9
c=(l|32768)>>>0
if(g<64){a5.aI(c)
a2.b_(1,l)
a5.aI((h|0)>>>0)
a2.b_(0,d)
g-=32
f=16
e=B.cz}else{a5.aI(c)
a2.b_(1,l)
a5.aI((h|32768)>>>0)
a2.b_(1,d)
g-=64
f=1024
e=B.cJ}}for(l=e.length,b=0;f!==0;b=a){h=(g&f)!==0?1:0
a=b+1
if(!(b<l))return A.a(e,b)
a5.aI((h<<15|e[b]|16384)>>>0)
f=f>>>1}}}p=((o+B.K[m])*3+2)*11}a5.aI(((j?1:0)<<15|16512)>>>0)
if(m!==16){l=m<=r?1:0
a5.aI((l<<15|p)>>>0)
l=a2.b_(l,p)===0}else l=!0
if(l)return 1}return 1},
iY:function iY(){var _=this
_.a=0
_.b=-1
_.c=0
_.d=$
_.e=0},
xd(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=a.ch
e===$&&A.c()
s=e.a>1||a.a.b<=1
if(!s){r=a.c*a.d
e=a.f
e===$&&A.c()
B.d.V(e,0,r,1)
e=a.r
e===$&&A.c()
B.d.V(e,0,r,0)
e=a.w
e===$&&A.c()
B.d.V(e,0,r,0)
e=a.x
e===$&&A.c()
B.d.V(e,0,r,0)
e=a.y
e===$&&A.c()
B.d.V(e,0,r,0)
e=a.ch
e===$&&A.c()
e=e.b[0]
a.cx=a.CW=e.e=e.d=0
return}q=new Int32Array(256)
p=A.ol(a)
e=new Int16Array(16)
o=new A.mq(a,p,e,new Int32Array(32))
n=a.c*a.d
e=p.a
m=a.a.b<=1
l=0
k=0
do{p.i9(!0)
p.cM(0)
p.iT(!1)
j=e.x
j===$&&A.c()
i=p.x
j.$flags&2&&A.b(j)
if(!(i<j.length))return A.a(j,i)
j[i]=0
h=m?o.kP():o.jx()
j=o.f=o.jy()
g=255-B.a.j(3*h+j+2,2)
if(g<0)g=0
q[g]=q[g]+1
i=a.y
i===$&&A.c()
f=p.x
i.$flags&2&&A.b(i)
if(!(f<i.length))return A.a(i,f)
i[f]=g
o.e=g
l+=g
k+=j}while(p.eS())
a.CW=B.a.Z(l,n)
a.cx=B.a.Z(k,n)
A.vZ(a,q)},
vZ(a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2=a3.ch
a2===$&&A.c()
s=a2.a
r=new Int32Array(4)
q=new Int32Array(256)
p=new Int32Array(4)
o=new Int32Array(4)
n=0
for(;;){if(!(n<=255&&a4[n]===0))break;++n}m=255
for(;;){if(!(m>n&&a4[m]===0))break;--m}l=m-n
for(a2=2*s,k=0,j=1;k<s;++k,j+=2){i=B.a.Z(j*l,a2)
if(!(k<4))return A.a(r,k)
r[k]=n+i}for(h=0,k=0;k<6;++k){B.t.V(p,0,s,0)
B.t.V(o,0,s,0)
for(g=n,f=0;g<=m;++g)if(a4[g]!==0){for(;;){e=f+1
if(e<s){if(!(e>=0&&e<4))return A.a(r,e)
a2=r[e]
if(!(f>=0&&f<4))return A.a(r,f)
a2=Math.abs(g-a2)<Math.abs(g-r[f])}else a2=!1
if(!a2)break
f=e}if(!(g<256))return A.a(q,g)
q[g]=f
if(!(f>=0&&f<4))return A.a(o,f)
a2=o[f]
i=a4[g]
if(!(f<4))return A.a(o,f)
o[f]=a2+g*i
i=p[f]
a2=a4[g]
if(!(f<4))return A.a(p,f)
p[f]=i+a2}for(h=0,d=0,c=0,j=0;j<s;++j){if(!(j<4))return A.a(p,j)
a2=p[j]
if(a2!==0){b=B.a.Z(o[j]+B.a.P(a2,2),a2)
d+=Math.abs(r[j]-b)
if(!(j<4))return A.a(r,j)
r[j]=b
a2=p[j]
h+=b*a2
c+=a2}}h=B.a.Z(h+B.a.P(c,2),c)
if(d<5)break}for(a2=a3.c*a3.d,i=a3.y,a=a3.x,j=0;j<a2;++j){i===$&&A.c()
if(!(j<i.length))return A.a(i,j)
a0=i[j]
a===$&&A.c()
if(!(a0<256))return A.a(q,a0)
a1=q[a0]
a.$flags&2&&A.b(a)
if(!(j<a.length))return A.a(a,j)
a[j]=a1
a1=q[a0]
if(!(a1>=0&&a1<4))return A.a(r,a1)
a1=r[a1]
i.$flags&2&&A.b(i)
i[j]=a1}A.x0(a3,r,h)},
x0(a,b,c){var s,r,q,p,o,n,m,l,k,j,i=a.ch
i===$&&A.c()
s=i.a
r=b[0]
if(s>1)for(q=r,p=0;p<s;++p){if(!(p<4))return A.a(b,p)
o=b[p]
if(r>o)r=o
if(q<o)q=o}else q=r
for(n=(q===r?r+1:q)-r,p=0;p<s;++p){if(!(p<4))return A.a(b,p)
m=b[p]
l=B.a.Z(255*(m-c),n)
k=B.a.Z(255*(m-r),n)
m=i.b[p]
if(l<-127)j=-127
else j=l>127?127:l
m.d=j
if(k<0)j=0
else j=k>255?255:k
m.e=j}},
mq:function mq(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.f=_.e=0},
lw:function lw(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.ax=_.at=_.as=_.Q=_.z=_.y=_.x=_.w=_.r=_.f=$
_.ay=f
_.ch=$
_.cx=_.CW=0
_.cy=!1
_.dy=_.dx=_.db=0},
lU:function lU(a){this.a=a
this.b=0},
uv(){var s,r=J.aa(3,t.D)
for(s=0;s<3;++s)r[s]=new Uint8Array(11)
return new A.fM(r)},
ve(){var s,r,q,p,o=new Uint8Array(3),n=J.aa(4,t.ac)
for(s=t.e5,r=0;r<4;++r){q=J.aa(8,s)
for(p=0;p<8;++p)q[p]=A.uv()
n[r]=q}B.d.V(o,0,3,255)
return new A.lR(o,n)},
lF:function lF(){this.d=$},
lQ:function lQ(){},
lT:function lT(a,b){var _=this
_.b=_.a=!1
_.c=!0
_.d=a
_.e=b},
fM:function fM(a){this.a=a},
lR:function lR(a,b){this.a=a
this.b=b},
lz:function lz(a,b){var _=this
_.a=$
_.b=null
_.d=_.c=$
_.e=a
_.f=b},
c1:function c1(){var _=this
_.b=_.a=0
_.c=!1
_.d=0},
fT:function fT(){this.b=this.a=0},
iX:function iX(a,b,c){this.a=a
this.b=b
this.c=c},
fU:function fU(a,b){var _=this
_.a=a
_.b=$
_.c=b
_.e=_.d=null
_.f=$},
fW:function fW(a,b,c){this.a=a
this.b=b
this.c=c},
bJ(a,b){var s,r,q=B.a.O(a,b),p=q>>>9,o=q&511,n=$.rY(),m=n.length
if(!(p<m))return A.a(n,p)
s=n[p]
r=p+1
if(!(r<m))return A.a(n,r)
return B.a.j(n[r]*o+s*(512-o)+64,7)},
xM(a0){var s,r,q,p,o,n,m,l,k=a0.gJ(),j=a0.gI(),i=B.a.j(k+1,1),h=B.a.j(j+1,1),g=A.wU(a0),f=k*j,e=new Uint8Array(f),d=i*h,c=new Uint8Array(d),b=new Uint8Array(d),a=!1
if(a0.gak()===2||a0.gak()===4)for(d=g.length,s=3;s<d;s+=4)if(g[s]!==255){a=!0
break}if(a){r=new Uint8Array(f)
for(d=g.length,s=0,q=3;s<f;++s,q+=4){if(!(q<d))return A.a(g,q)
r[s]=g[q]}}else r=null
p=4*k
o=new Int32Array(4*i)
for(n=0,m=0;f=n+1,f<j;n+=2,++m){l=n*p
A.oE(g,l,e,n*k,k)
A.oE(g,l+p,e,f*k,k)
if(a&&A.qR(g,l,k,2,p))A.qz(g,l,p,o,k)
else A.qy(g,l,p,o,k)
A.qS(o,c,b,m*i,i)}if(n<j){l=n*p
A.oE(g,l,e,n*k,k)
if(a&&A.qR(g,l,k,1,p))A.qz(g,l,0,o,k)
else A.qy(g,l,0,o,k)
A.qS(o,c,b,m*i,i)}return new A.lV(k,j,e,c,b,r)},
wU(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=null,d=a.a
if(a.gM()===B.e)s=(d==null?e:d.gW())==null&&d instanceof A.cn
else s=!1
if(s){r=d.d
q=a.gJ()*a.gI()
switch(a.gak()){case 4:return r
case 3:s=q*4
p=new Uint8Array(s)
for(o=r.length,n=0,m=0;n<q;++n,m+=3){l=n*4
if(!(m<o))return A.a(r,m)
k=r[m]
if(!(l<s))return A.a(p,l)
p[l]=k
k=l+1
j=m+1
if(!(j<o))return A.a(r,j)
j=r[j]
if(!(k<s))return A.a(p,k)
p[k]=j
j=l+2
k=m+2
if(!(k<o))return A.a(r,k)
k=r[k]
if(!(j<s))return A.a(p,j)
p[j]=k
k=l+3
if(!(k<s))return A.a(p,k)
p[k]=255}return p
case 1:s=q*4
p=new Uint8Array(s)
for(o=r.length,n=0;n<q;++n){if(!(n<o))return A.a(r,n)
i=r[n]
l=n*4
if(!(l<s))return A.a(p,l)
p[l]=i
k=l+1
if(!(k<s))return A.a(p,k)
p[k]=i
k=l+2
if(!(k<s))return A.a(p,k)
p[k]=i
k=l+3
if(!(k<s))return A.a(p,k)
p[k]=255}return p}}s=a.a
h=s==null?e:s.gW()
s=!1
if(a.gM()===B.e)if(h instanceof A.aU)if(d instanceof A.cn)if(d.c===1){s=h.b
s=s===3||s===4}if(s)return A.wM(d.d,h)
g=a.n4(255,B.e,4)
s=g.gak()
f=4!==s?g.n3(e,4):g
s=f.a
s=s==null?e:s.iF(f!==g,B.el)
return s==null?g.a0():s},
wM(a,b){var s,r,q,p,o,n,m,l,k,j,i=b.c,h=b.b,g=i.length,f=Math.min(B.a.Z(g,h),256),e=new Uint8Array(1024)
if(h<4)for(s=f;s<256;++s){r=4*s+3
if(!(r>=0&&r<1024))return A.a(e,r)
e[r]=255}for(r=h===4,s=0;s<f;++s){q=4*s
p=s*h
if(!(p>=0&&p<g))return A.a(i,p)
o=i[p]
if(!(q<1024))return A.a(e,q)
e[q]=o
o=q+1
n=p+1
if(!(n<g))return A.a(i,n)
n=i[n]
if(!(o<1024))return A.a(e,o)
e[o]=n
n=q+2
o=p+2
if(!(o<g))return A.a(i,o)
o=i[o]
if(!(n<1024))return A.a(e,n)
e[n]=o
q+=3
if(r){p+=3
if(!(p<g))return A.a(i,p)
p=i[p]}else p=255
if(!(q<1024))return A.a(e,q)
e[q]=p}g=a.length
r=g*4
m=new Uint8Array(r)
for(l=0,k=0;l<g;++l,k+=4){j=4*a[l]
if(!(j<1024))return A.a(e,j)
q=e[j]
if(!(k<r))return A.a(m,k)
m[k]=q
q=k+1
p=j+1
if(!(p<1024))return A.a(e,p)
p=e[p]
if(!(q<r))return A.a(m,q)
m[q]=p
p=k+2
q=j+2
if(!(q<1024))return A.a(e,q)
q=e[q]
if(!(p<r))return A.a(m,p)
m[p]=q
q=k+3
p=j+3
if(!(p<1024))return A.a(e,p)
p=e[p]
if(!(q<r))return A.a(m,q)
m[q]=p}return m},
oE(a,b,c,d,e){var s,r,q,p,o,n,m
for(s=a.length,r=c.$flags|0,q=0;q<e;++q,b+=4){p=d+q
if(!(b>=0&&b<s))return A.a(a,b)
o=a[b]
n=b+1
if(!(n<s))return A.a(a,n)
n=a[n]
m=b+2
if(!(m<s))return A.a(a,m)
m=a[m]
r&2&&A.b(c)
if(!(p>=0&&p<c.length))return A.a(c,p)
c[p]=16839*o+33059*n+6420*m+32768+1048576>>>16}},
qR(a,b,c,d,e){var s,r,q,p,o
for(s=4*c,r=a.length,q=0;q<d;++q,b+=e)for(p=b+3,o=b+s;p<o;p+=4){if(!(p>=0&&p<r))return A.a(a,p)
if(a[p]!==255)return!0}return!1},
qy(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=$.jH()
for(s=B.a.j(e,1),r=a.length,q=f.length,p=b,o=0;o<s;++o,p+=8){n=p+c
m=4*o
if(!(p>=0&&p<r))return A.a(a,p)
l=a[p]
if(!(l<q))return A.a(f,l)
l=f[l]
k=p+4
if(!(k<r))return A.a(a,k)
k=a[k]
if(!(k<q))return A.a(f,k)
k=f[k]
if(!(n>=0&&n<r))return A.a(a,n)
j=a[n]
if(!(j<q))return A.a(f,j)
j=f[j]
i=n+4
if(!(i<r))return A.a(a,i)
i=a[i]
if(!(i<q))return A.a(f,i)
i=A.bJ(l+k+j+f[i],0)
d.$flags&2&&A.b(d)
j=d.length
if(!(m<j))return A.a(d,m)
d[m]=i
i=m+1
k=p+1
if(!(k<r))return A.a(a,k)
k=a[k]
if(!(k<q))return A.a(f,k)
k=f[k]
l=p+5
if(!(l<r))return A.a(a,l)
l=a[l]
if(!(l<q))return A.a(f,l)
l=f[l]
h=n+1
if(!(h<r))return A.a(a,h)
h=a[h]
if(!(h<q))return A.a(f,h)
h=f[h]
g=n+5
if(!(g<r))return A.a(a,g)
g=a[g]
if(!(g<q))return A.a(f,g)
g=A.bJ(k+l+h+f[g],0)
d.$flags&2&&A.b(d)
if(!(i<j))return A.a(d,i)
d[i]=g
m+=2
g=p+2
if(!(g<r))return A.a(a,g)
g=a[g]
if(!(g<q))return A.a(f,g)
g=f[g]
i=p+6
if(!(i<r))return A.a(a,i)
i=a[i]
if(!(i<q))return A.a(f,i)
i=f[i]
h=n+2
if(!(h<r))return A.a(a,h)
h=a[h]
if(!(h<q))return A.a(f,h)
h=f[h]
l=n+6
if(!(l<r))return A.a(a,l)
l=a[l]
if(!(l<q))return A.a(f,l)
l=A.bJ(g+i+h+f[l],0)
d.$flags&2&&A.b(d)
if(!(m<j))return A.a(d,m)
d[m]=l}if((e&1)!==0){n=p+c
s=4*o
if(!(p>=0&&p<r))return A.a(a,p)
m=a[p]
if(!(m<q))return A.a(f,m)
m=f[m]
if(!(n>=0&&n<r))return A.a(a,n)
l=a[n]
if(!(l<q))return A.a(f,l)
l=A.bJ(m+f[l],1)
d.$flags&2&&A.b(d)
m=d.length
if(!(s<m))return A.a(d,s)
d[s]=l
l=s+1
k=p+1
if(!(k<r))return A.a(a,k)
k=a[k]
if(!(k<q))return A.a(f,k)
k=f[k]
j=n+1
if(!(j<r))return A.a(a,j)
j=a[j]
if(!(j<q))return A.a(f,j)
j=A.bJ(k+f[j],1)
d.$flags&2&&A.b(d)
if(!(l<m))return A.a(d,l)
d[l]=j
s+=2
j=p+2
if(!(j<r))return A.a(a,j)
j=a[j]
if(!(j<q))return A.a(f,j)
j=f[j]
l=n+2
if(!(l<r))return A.a(a,l)
l=a[l]
if(!(l<q))return A.a(f,l)
l=A.bJ(j+f[l],1)
d.$flags&2&&A.b(d)
if(!(s<m))return A.a(d,s)
d[s]=l}},
qz(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i,h,g
for(s=B.a.j(e,1),r=a.length,q=d.$flags|0,p=b,o=0;o<s;++o,p+=8){n=p+c
m=p+3
if(!(m>=0&&m<r))return A.a(a,m)
m=a[m]
l=p+7
if(!(l>=0&&l<r))return A.a(a,l)
l=a[l]
k=n+3
if(!(k>=0&&k<r))return A.a(a,k)
k=a[k]
j=n+7
if(!(j>=0&&j<r))return A.a(a,j)
i=m+l+k+a[j]
m=i===1020||i===0
l=4*o
if(m)A.vQ(a,p,n,d,l)
else{m=A.hm(a,p,n,4,i,0)
q&2&&A.b(d)
k=d.length
if(!(l<k))return A.a(d,l)
d[l]=m
m=l+1
j=A.hm(a,p,n,4,i,1)
if(!(m<k))return A.a(d,m)
d[m]=j
j=l+2
m=A.hm(a,p,n,4,i,2)
if(!(j<k))return A.a(d,j)
d[j]=m}m=l+3
q&2&&A.b(d)
if(!(m<d.length))return A.a(d,m)
d[m]=i}if((e&1)!==0){n=p+c
s=p+3
if(!(s>=0&&s<r))return A.a(a,s)
s=a[s]
m=n+3
if(!(m>=0&&m<r))return A.a(a,m)
i=2*(s+a[m])
s=i===1020||i===0
m=4*o
if(s){h=$.jH()
if(!(p>=0&&p<r))return A.a(a,p)
s=a[p]
l=h.length
if(!(s<l))return A.a(h,s)
s=h[s]
if(!(n>=0&&n<r))return A.a(a,n)
k=a[n]
if(!(k<l))return A.a(h,k)
k=A.bJ(s+h[k],1)
q&2&&A.b(d)
s=d.length
if(!(m<s))return A.a(d,m)
d[m]=k
k=m+1
j=p+1
if(!(j<r))return A.a(a,j)
j=a[j]
if(!(j<l))return A.a(h,j)
j=h[j]
g=n+1
if(!(g<r))return A.a(a,g)
g=a[g]
if(!(g<l))return A.a(h,g)
g=A.bJ(j+h[g],1)
if(!(k<s))return A.a(d,k)
d[k]=g
g=m+2
k=p+2
if(!(k<r))return A.a(a,k)
k=a[k]
if(!(k<l))return A.a(h,k)
k=h[k]
j=n+2
if(!(j<r))return A.a(a,j)
j=a[j]
if(!(j<l))return A.a(h,j)
j=A.bJ(k+h[j],1)
if(!(g<s))return A.a(d,g)
d[g]=j}else{s=A.hm(a,p,n,0,i,0)
q&2&&A.b(d)
r=d.length
if(!(m<r))return A.a(d,m)
d[m]=s
s=m+1
l=A.hm(a,p,n,0,i,1)
if(!(s<r))return A.a(d,s)
d[s]=l
l=m+2
s=A.hm(a,p,n,0,i,2)
if(!(l<r))return A.a(d,l)
d[l]=s}s=m+3
q&2&&A.b(d)
if(!(s<d.length))return A.a(d,s)
d[s]=i}},
vQ(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i=$.jH()
for(s=a.length,r=i.length,q=b+4,p=c+4,o=0;o<3;++o){n=e+o
m=b+o
if(!(m>=0&&m<s))return A.a(a,m)
m=a[m]
if(!(m<r))return A.a(i,m)
m=i[m]
l=q+o
if(!(l>=0&&l<s))return A.a(a,l)
l=a[l]
if(!(l<r))return A.a(i,l)
l=i[l]
k=c+o
if(!(k>=0&&k<s))return A.a(a,k)
k=a[k]
if(!(k<r))return A.a(i,k)
k=i[k]
j=p+o
if(!(j>=0&&j<s))return A.a(a,j)
j=a[j]
if(!(j<r))return A.a(i,j)
j=A.bJ(m+l+k+i[j],0)
d.$flags&2&&A.b(d)
if(!(n<d.length))return A.a(d,n)
d[n]=j}},
hm(a,b,c,d,e,f){var s,r,q,p,o,n,m,l,k=$.jH(),j=b+3,i=a.length
if(!(j>=0&&j<i))return A.a(a,j)
j=a[j]
s=b+f
if(!(s>=0&&s<i))return A.a(a,s)
s=a[s]
r=k.length
if(!(s<r))return A.a(k,s)
s=k[s]
q=b+d
p=q+3
if(!(p>=0&&p<i))return A.a(a,p)
p=a[p]
q+=f
if(!(q>=0&&q<i))return A.a(a,q)
q=a[q]
if(!(q<r))return A.a(k,q)
q=k[q]
o=c+3
if(!(o>=0&&o<i))return A.a(a,o)
o=a[o]
n=c+f
if(!(n>=0&&n<i))return A.a(a,n)
n=a[n]
if(!(n<r))return A.a(k,n)
n=k[n]
m=c+d
l=m+3
if(!(l>=0&&l<i))return A.a(a,l)
l=a[l]
m+=f
if(!(m>=0&&m<i))return A.a(a,m)
m=a[m]
if(!(m<r))return A.a(k,m)
m=k[m]
r=$.rX()
if(!(e<r.length))return A.a(r,e)
return A.bJ(B.a.j((j*s+p*q+o*n+l*m)*r[e],17),0)},
qS(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j
for(s=c.$flags|0,r=b.$flags|0,q=a.length,p=0;p<e;++p){o=4*p
if(!(o<q))return A.a(a,o)
n=a[o]
m=o+1
if(!(m<q))return A.a(a,m)
l=a[m]
o+=2
if(!(o<q))return A.a(a,o)
k=a[o]
o=d+p
j=B.a.j(-9719*n-19081*l+28800*k+131072+33554432,18)
if((j&4294967040)>>>0===0)m=j
else m=255
r&2&&A.b(b)
if(!(o<b.length))return A.a(b,o)
b[o]=m
j=B.a.j(28800*n-24116*l-4684*k+131072+33554432,18)
if((j&4294967040)>>>0===0)m=j
else m=255
s&2&&A.b(c)
if(!(o<c.length))return A.a(c,o)
c[o]=m}},
lV:function lV(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
mR:function mR(){},
mX:function mX(){},
mW:function mW(){},
op(a,b){var s,r=A.j([],t.nK),q=A.j([],t.ip),p=new Uint32Array(2),o=new A.iT(a,p)
p=o.e=J.F(B.q.gt(p),0,null)
s=a.H()
p.$flags&2&&A.b(p)
if(0>=p.length)return A.a(p,0)
p[0]=s
s=a.H()
p.$flags&2&&A.b(p)
if(1>=p.length)return A.a(p,1)
p[1]=s
s=a.H()
p.$flags&2&&A.b(p)
if(2>=p.length)return A.a(p,2)
p[2]=s
s=a.H()
p.$flags&2&&A.b(p)
if(3>=p.length)return A.a(p,3)
p[3]=s
s=a.H()
p.$flags&2&&A.b(p)
if(4>=p.length)return A.a(p,4)
p[4]=s
s=a.H()
p.$flags&2&&A.b(p)
if(5>=p.length)return A.a(p,5)
p[5]=s
s=a.H()
p.$flags&2&&A.b(p)
if(6>=p.length)return A.a(p,6)
p[6]=s
s=a.H()
p.$flags&2&&A.b(p)
if(7>=p.length)return A.a(p,7)
p[7]=s
o.b=!1
return new A.fP(o,b,r,q)},
cy(a,b){return B.a.j(a+B.a.O(1,b)-1,b)},
fP:function fP(a,b,c,d){var _=this
_.b=a
_.c=b
_.d=null
_.w=_.r=_.f=0
_.x=null
_.Q=_.z=_.y=0
_.as=null
_.at=0
_.ax=c
_.ay=null
_.ch=d
_.CW=0
_.cx=null
_.cy=$
_.db=0
_.dx=null
_.fr=_.dy=0},
i5:function i5(a,b,c,d){var _=this
_.b=a
_.c=b
_.d=null
_.w=_.r=_.f=0
_.x=null
_.Q=_.z=_.y=0
_.as=null
_.at=0
_.ax=c
_.ay=null
_.ch=d
_.CW=0
_.cx=null
_.cy=$
_.db=0
_.dx=null
_.fr=_.dy=0},
xc(d4,d5,d6,d7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3=J.aa(12,t.mC)
for(s=0;s<12;++s)d3[s]=new Uint32Array(256)
r=d3[0]
q=d3[1]
p=d3[2]
o=d3[3]
n=d3[4]
m=d3[5]
l=d3[6]
k=d3[7]
j=d3[8]
i=d3[9]
h=d3[10]
g=d3[11]
f=d4.length
if(0>=f)return A.a(d4,0)
e=d4[0]
for(d=r.$flags|0,c=q.$flags|0,b=p.$flags|0,a=o.$flags|0,a0=n.$flags|0,a1=m.$flags|0,a2=l.$flags|0,a3=k.$flags|0,a4=j.$flags|0,a5=i.$flags|0,a6=h.$flags|0,a7=g.$flags|0,a8=0;a8<d6;++a8){a9=a8*d5
for(b0=a8>0,b1=a9-d5,b2=0;b2<d5;++b2,e=b4){b3=a9+b2
if(!(b3>=0&&b3<f))return A.a(d4,b3)
b4=d4[b3]
b5=(16711935+((b4&4278255360)>>>0)-((e&4278255360)>>>0)&4278255360|4278255360+(b4&16711935)-(e&16711935)&16711935)>>>0
if(b5!==0)if(b0){b3=b1+b2
if(!(b3>=0&&b3<f))return A.a(d4,b3)
b3=b4===d4[b3]}else b3=!1
else b3=!0
if(b3)continue
b3=b4>>>24&255
b6=r[b3]
d&2&&A.b(r)
if(!(b3<256))return A.a(r,b3)
r[b3]=b6+1
b6=b4>>>16
b3=b6&255
b7=q[b3]
c&2&&A.b(q)
if(!(b3<256))return A.a(q,b3)
q[b3]=b7+1
b7=b4>>>8&255
b3=p[b7]
b&2&&A.b(p)
if(!(b7<256))return A.a(p,b7)
p[b7]=b3+1
b3=b4&255
b8=o[b3]
a&2&&A.b(o)
if(!(b3<256))return A.a(o,b3)
o[b3]=b8+1
b8=b5>>>24&255
b3=n[b8]
a0&2&&A.b(n)
if(!(b8<256))return A.a(n,b8)
n[b8]=b3+1
b3=b5>>>16
b8=b3&255
b9=m[b8]
a1&2&&A.b(m)
if(!(b8<256))return A.a(m,b8)
m[b8]=b9+1
b9=b5>>>8&255
b8=l[b9]
a2&2&&A.b(l)
if(!(b9<256))return A.a(l,b9)
l[b9]=b8+1
b8=b5&255
c0=k[b8]
a3&2&&A.b(k)
if(!(b8<256))return A.a(k,b8)
k[b8]=c0+1
b6=b6-b7&255
c0=j[b6]
a4&2&&A.b(j)
if(!(b6<256))return A.a(j,b6)
j[b6]=c0+1
b7=b4-b7&255
c0=i[b7]
a5&2&&A.b(i)
if(!(b7<256))return A.a(i,b7)
i[b7]=c0+1
b3=b3-b9&255
c0=h[b3]
a6&2&&A.b(h)
if(!(b3<256))return A.a(h,b3)
h[b3]=c0+1
b9=b5-b9&255
c0=g[b9]
a7&2&&A.b(g)
if(!(b9<256))return A.a(g,b9)
g[b9]=c0+1}}f=h[0]
a6&2&&A.b(h)
if(0>=256)return A.a(h,0)
h[0]=f+1
f=g[0]
a7&2&&A.b(g)
if(0>=256)return A.a(g,0)
g[0]=f+1
f=m[0]
a1&2&&A.b(m)
if(0>=256)return A.a(m,0)
m[0]=f+1
f=l[0]
a2&2&&A.b(l)
if(0>=256)return A.a(l,0)
l[0]=f+1
f=k[0]
a3&2&&A.b(k)
if(0>=256)return A.a(k,0)
k[0]=f+1
f=n[0]
a0&2&&A.b(n)
if(0>=256)return A.a(n,0)
n[0]=f+1
c1=new Float64Array(12)
for(c2=0;c2<12;++c2){f=A.w0(d3[c2])
if(!(c2<12))return A.a(c1,c2)
c1[c2]=f}f=c1[0]
d=c1[1]
c=c1[2]
c3=f+d+c+c1[3]
d=c1[4]
b=c1[5]
a=c1[6]
a0=c1[7]
c4=f+c1[8]+c+c1[9]
c=c1[10]
f=c1[11]
c5=A.qW(d5,d7)*A.qW(d6,d7)
c6=d+b+a+a0+c5*(Math.log(14)/0.6931471805599453)
a0=Math.log(24)
c7=c6<c3
c8=c7?c6:c3
c9=c4<c8
if(c9){c8=c4
c7=!1}if(d+c+a+f+c5*(a0/0.6931471805599453)<c8){c7=!0
c9=!0}if(c7&&c9){d0=g
d1=h}else if(c7){d0=k
d1=m}else if(c9){d0=i
d1=j}else{d0=o
d1=q}c2=1
for(;;){if(!(c2<256)){d2=!0
break}if(d1[c2]!==0||d0[c2]!==0){d2=!1
break}++c2}return new A.lG(c9,c7,c7&&!d2)},
qW(a,b){return B.a.j(a+B.a.O(1,b)-1,b)},
w0(a){var s,r,q,p,o,n,m,l,k
for(s=0,r=0,q=0,p=0,o=0;o<256;++o){n=a[o]
if(n!==0){s+=n;++r
p+=n*(Math.log(n)/0.6931471805599453)
if(n>q)q=n}}if(s===0)return 0
p=s*(Math.log(s)/0.6931471805599453)-p
m=r<5
if(m){if(r<=1)return 0
if(r===2)return(99*s+p)/100}if(m)l=r===3?0.95:0.7
else l=0.627
k=l*(2*s-q)+(1-l)*p
return p<k?k:p},
lG:function lG(a,b,c){this.a=a
this.b=b
this.c=c},
xn(b5,b6,b7,b8,b9,c0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4
if(b5.length<b9||b6.length<b9||b7.length<b9||b8.length<b9)throw A.e(A.aJ("computeMatches needs "+b9+" of every plane",null))
s=new Uint32Array(b9)
r=new Int32Array(b9)
q=new A.mp(b9,s,r)
q.jn(b5,b6,b7,b8,b9)
q.nn()
p=new Uint32Array(b9)
o=t.fT
o=A.o1(new A.c5(A.j([1,2,c0-1,c0,c0+1],t.t),t.gw.a(new A.nk(b9)),o),o.n("f.E"))
o=A.t(o,A.m(o).c)
B.c.f6(o)
n=new Int32Array(A.o(o))
m=n.length
if(m>5)throw A.e(A.q7("the near-neighbor walk has five slots, not "+m))
l=new Int32Array(5)
B.t.V(l,0,5,b9)
for(k=0;k<m;++k){o=n[k]
if(!(k<5))return A.a(l,k)
l[k]=o}j=l[0]
i=l[1]
h=l[2]
g=l[3]
f=l[4]
e=b9-1
for(d=b9,c=0,b=0,a=0,a0=0,a1=0;e>0;){for(;d>e;d=a2){a2=d-1
if(!(a2<b9))return A.a(s,a2)
a3=s[a2]
if(a2>=j){o=a2-j
if(!(o>=0&&o<b9))return A.a(s,o)
o=a3===s[o]}else o=!1
if(o){if(c<4095)++c}else c=0
if(a2>=i){o=a2-i
if(!(o>=0&&o<b9))return A.a(s,o)
o=a3===s[o]}else o=!1
if(o){if(b<4095)++b}else b=0
if(a2>=h){o=a2-h
if(!(o>=0&&o<b9))return A.a(s,o)
o=a3===s[o]}else o=!1
if(o){if(a<4095)++a}else a=0
if(a2>=g){o=a2-g
if(!(o>=0&&o<b9))return A.a(s,o)
o=a3===s[o]}else o=!1
if(o){if(a0<4095)++a0}else a0=0
if(a2>=f){o=a2-f
if(!(o>=0&&o<b9))return A.a(s,o)
o=a3===s[o]}else o=!1
if(o){if(a1<4095)++a1}else a1=0}a4=b9-e
if(a4>4095)a4=4095
if(c>0){a5=j
a6=c}else{a6=0
a5=0}if(b>a6){a5=i
a6=b}if(a>a6){a5=h
a6=a}if(a0>a6){a5=g
a6=a0}if(a1>a6){a5=f
a6=a1}if(a6<a4){a7=a4<256?a4:256
if(!(e<b9))return A.a(r,e)
k=r[e]
a8=0
for(;;){if(!(k>=0&&a8<86))break;++a8
a9=e-k
if(a9>1048456)break
o=k+a6
if(!(o>=0&&o<b9))return A.a(s,o)
o=s[o]
b0=e+a6
if(!(b0>=0&&b0<b9))return A.a(s,b0)
if(o===s[b0]){b1=0
for(;;){if(b1<a4){o=e+b1
if(!(o<b9))return A.a(s,o)
o=s[o]
b0=k+b1
if(!(b0>=0&&b0<b9))return A.a(s,b0)
b0=o===s[b0]
o=b0}else o=!1
if(!o)break;++b1}if(b1>a6){if(b1>=a7){a5=a9
a6=b1
break}a5=a9
a6=b1}}if(!(k>=0&&k<b9))return A.a(r,k)
k=r[k]}}o=a5<<12
if(!(e<b9))return A.a(p,e)
p[e]=(o|a6)>>>0
b0=a5>0
b2=e
for(;;){if(!(b0&&a6<4095))break
b3=b2-1
b4=!0
if(b3>0)if(b3>=a5){b4=b3-a5
if(!(b4>=0&&b4<b9))return A.a(s,b4)
b4=s[b4]
if(!(b3>=0&&b3<b9))return A.a(s,b3)
b4=b4!==s[b3]}if(b4)break;++a6
if(!(b3>=0))return A.a(p,b3)
p[b3]=(o|a6)>>>0
b2=b3}e=b2-1}return new A.lO(p,n)},
y4(a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=a2.a,a0=a2.b,a1=a2.c
for(s=a0.length,r=0,q=0,p=0;p<a;){if(!(p>=0&&p<s))return A.a(a0,p)
o=a0[p];++r
if(o<=1){++q;++p}else p+=o}n=new Uint8Array(r)
m=new Int32Array(q)
l=r-q
k=new Int32Array(l)
j=new Int32Array(l)
i=new Int32Array(r)
for(h=a1.length,g=0,f=0,e=0,p=0;p<a;){if(!(p>=0&&p<s))return A.a(a0,p)
o=a0[p]
if(!(g<r))return A.a(i,g)
i[g]=p
if(o<=1){if(!(g<r))return A.a(n,g)
n[g]=1
d=f+1
if(!(f<q))return A.a(m,f)
m[f]=p;++p
f=d}else{if(!(e<l))return A.a(k,e)
k[e]=o
c=e+1
if(!(p<h))return A.a(a1,p)
b=a1[p]
if(!(e<l))return A.a(j,e)
j[e]=b
p+=o
e=c}++g}return new A.lH(n,m,k,j,i)},
uX(a,a0,a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i=new Float64Array(280),h=new Float64Array(256),g=new Float64Array(256),f=new Float64Array(256),e=new Float64Array(40),d=a.a,c=a.b,b=a.c
for(s=b.length,r=c.length,q=a1.length,p=a0.length,o=a2.length,n=a3.length,m=0;m<d;){if(!(m>=0&&m<r))return A.a(c,m)
l=c[m]
if(l<=1){if(!(m<q))return A.a(a1,m)
k=a1[m]
B.x.i(i,k,B.x.l(i,k)+1)
if(!(m<p))return A.a(a0,m)
k=a0[m]
B.x.i(h,k,B.x.l(h,k)+1)
if(!(m<o))return A.a(a2,m)
k=a2[m]
B.x.i(g,k,B.x.l(g,k)+1)
if(!(m<n))return A.a(a3,m)
k=a3[m]
B.x.i(f,k,B.x.l(f,k)+1);++m}else{k=A.jB(l)
if(!(k>=0&&k<280))return A.a(i,k)
j=i[k]
if(!(k<280))return A.a(i,k)
i[k]=j+1
if(!(m<s))return A.a(b,m)
j=A.jC(A.jv(a4,b[m]))
if(!(j>=0&&j<40))return A.a(e,j)
k=e[j]
if(!(j<40))return A.a(e,j)
e[j]=k+1
m+=l}}return new A.lK(A.iV(i),A.iV(h),A.iV(g),A.iV(f),A.iV(e))},
iV(a){var s,r,q,p,o,n,m,l
for(s=a.length,r=0,q=0;q<s;++q)r+=a[q]
if(r===0){p=new Float64Array(s)
B.x.V(p,0,s,8)
return p}o=new Float64Array(s)
for(p=r+1,n=0;n<s;++n){m=a[n]
l=Math.log((m>0?m:1)/p)
if(!(n<s))return A.a(o,n)
o[n]=-(l/0.6931471805599453)}return o},
lH:function lH(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
lM:function lM(a,b,c){this.a=a
this.b=b
this.c=c},
lO:function lO(a,b){this.a=a
this.b=b},
nk:function nk(a){this.a=a},
mp:function mp(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.e=_.d=$},
lK:function lK(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=$},
lL:function lL(a){this.a=a},
iT:function iT(a,b){var _=this
_.a=0
_.b=!0
_.c=a
_.d=b
_.e=$},
iU:function iU(a){var _=this
_.a=a
_.d=_.c=_.b=0},
lJ:function lJ(a,b){this.a=a
this.b=b},
y6(a,b,c,d,e,f,g,h,i,j){var s,r,q,p,o,n,m,l
for(s=j.length,r=0,q=1/0,p=null,o=0;o<3;++o){n=B.ff[o]
m=new Int32Array(s)
if(n>0)A.xa(a,b,c,d,e,f,g,n,m)
else B.t.V(m,0,s,-1)
l=A.wg(a,b,c,d,e,f,g,h,i,n,m)
if(l<q){p=m
q=l
r=n}}p.toString
B.t.bB(j,0,p)
return r},
xa(a,a0,a1,a2,a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=B.a.U(1,a6),e=new Uint32Array(f),d=new Uint8Array(f),c=new A.n7(a2,a,a0,a1),b=new A.n8(32-a6)
for(s=a3.length,r=a5.length,q=a4.length,p=0,o=0,n=0,m=0;m<s;++m)if(a3[m]!==0){if(!(p<q))return A.a(a4,p)
l=c.$1(a4[p])
k=b.$1(l)
if(k>>>0!==k||k>=f)return A.a(d,k)
if(d[k]!==0){if(k>>>0!==k||k>=f)return A.a(e,k)
j=e[k]===l}else j=!1
j=j?k:-1
a7.$flags&2&&A.b(a7)
if(!(p<a7.length))return A.a(a7,p)
a7[p]=j
if(k>>>0!==k||k>=f)return A.a(e,k)
e[k]=l
if(k>>>0!==k||k>=f)return A.a(d,k)
d[k]=1;++p;++n}else{i=o+1
if(!(o<r))return A.a(a5,o)
h=a5[o]
for(g=0;g<h;++g){l=c.$1(n+g)
k=b.$1(l)
if(k>>>0!==k||k>=f)return A.a(e,k)
e[k]=l
if(k>>>0!==k||k>=f)return A.a(d,k)
d[k]=1}n+=h
o=i}},
wg(a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=280+(b3>0?B.a.U(1,b3):0),b=t.p,a=A.N(c,0,!1,b),a0=A.N(256,0,!1,b),a1=A.N(256,0,!1,b),a2=A.N(256,0,!1,b),a3=A.N(40,0,!1,b)
for(b=a8.length,s=b0.length,r=b1.length,q=a5.length,p=a4.length,o=a6.length,n=a7.length,m=b4.length,l=a9.length,k=0,j=0,i=0;i<b;++i)if(a8[i]!==0){if(!(k<m))return A.a(b4,k)
h=b4[k]
g=k+1
if(!(k<l))return A.a(a9,k)
f=a9[k]
if(h>=0){e=280+h
if(!(e<c))return A.a(a,e)
B.c.i(a,e,a[e]+1)}else{if(!(f>=0&&f<q))return A.a(a5,f)
e=a5[f]
B.c.i(a,e,B.c.l(a,e)+1)
if(!(f<p))return A.a(a4,f)
e=a4[f]
B.c.i(a0,e,B.c.l(a0,e)+1)
if(!(f<o))return A.a(a6,f)
e=a6[f]
B.c.i(a1,e,B.c.l(a1,e)+1)
if(!(f<n))return A.a(a7,f)
e=a7[f]
B.c.i(a2,e,B.c.l(a2,e)+1)}k=g}else{if(!(j<s))return A.a(b0,j)
e=A.jB(b0[j])
if(!(e>=0&&e<c))return A.a(a,e)
B.c.i(a,e,a[e]+1)
if(!(j<r))return A.a(b1,j)
e=A.jC(A.jv(b2,b1[j]))
if(!(e>=0&&e<40))return A.a(a3,e)
B.c.i(a3,e,a3[e]+1);++j}d=A.jj(a)+A.jj(a0)+A.jj(a1)+A.jj(a2)+A.jj(a3)
for(c=[a,a0,a1,a2,a3],i=0;i<5;++i)for(b=B.c.gF(c[i]);b.C();)if(b.gN()>0)d+=4
return d},
jj(a){var s,r,q,p,o
for(s=a.length,r=0,q=0;q<s;++q)r+=a[q]
if(r===0)return 0
for(p=0,q=0;q<s;++q){o=a[q]
if(o>0)p-=o*(Math.log(o/r)/0.6931471805599453)}return p},
n7:function n7(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
n8:function n8(a){this.a=a},
oy(a1,a2,a3,a4,a5,a6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0
for(s=a2.length,r=a1.length,q=0,p=0,o=0;o<a3;++o){if(!(o<r))return A.a(a1,o)
n=a1[o]
n=n<128?n:n-256
if(!(o<s))return A.a(a2,o)
m=a2[o]
q+=n*(m<128?m:m-256)
p+=n*n}if(p===0)return 0
l=B.a.L(B.b.az(32*q/p),-128,127)
a4.$flags&2&&A.b(a4)
if(0>=6)return A.a(a4,0)
a4[0]=0
a5.$flags&2&&A.b(a5)
if(0>=6)return A.a(a5,0)
a5[0]=0
for(k=l-2,j=l+2,i=1;k<=j;++k)if(k>=-128&&k<=127){h=k&255
h=h<128?h:h-256
if(!(i<6))return A.a(a5,i)
a5[i]=h
g=i+1
if(!(i<6))return A.a(a4,i)
a4[i]=k
i=g}B.t.V(a6,0,i,0)
for(j=a6.$flags|0,o=0;o<a3;++o){if(!(o<r))return A.a(a1,o)
f=a1[o]
f=f<128?f:f-256
if(!(o<s))return A.a(a2,o)
k=a2[o]
for(e=0;e<i;++e){if(!(e<6))return A.a(a5,e)
d=k-B.a.j(a5[e]*f,5)&255
h=a6[e]
c=d<128?d:256-d
j&2&&A.b(a6)
if(!(e<6))return A.a(a6,e)
a6[e]=h+c}}b=a6[0]
for(a=0,e=1;e<i;++e){if(!(e<6))return A.a(a6,e)
a0=a6[e]
if(a0<b){a=a4[e]
b=a0}}return a&255},
y7(c1,c2,c3,c4,c5,c6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7=B.a.O(1,c6),a8=B.a.j(c4+a7-1,c6),a9=B.a.j(c5+a7-1,c6),b0=A.j([],t.l3),b1=new Uint32Array(512),b2=new Uint32Array(512),b3=a7*a7,b4=new Uint8Array(b3),b5=new Uint8Array(b3),b6=new Uint8Array(b3),b7=new Uint8Array(b3),b8=new Int32Array(6),b9=new Int32Array(6),c0=new Int32Array(6)
for(s=c2.length,r=c1.length,q=c3.length,p=0;p<a9;++p)for(o=p*a7,n=o+a7,m=0;m<a8;++m){l=m*a7
k=l+a7
k=k<c4?k:c4
j=n<c5?n:c5
for(i=o,h=0;i<j;++i){g=i*c4
for(f=l;f<k;++f){e=g+f
if(!(e>=0&&e<s))return A.a(c2,e)
B.d.i(b4,h,c2[e])
if(!(e<r))return A.a(c1,e)
B.d.i(b5,h,c1[e])
if(!(e<q))return A.a(c3,e)
B.d.i(b6,h,c3[e]);++h}}d=A.oy(b4,b5,h,b8,b9,c0)
c=A.oy(b4,b6,h,b8,b9,c0)
for(b=c-256,a=c<128,a0=0;a0<h;++a0){if(!(a0<b3))return A.a(b6,a0)
a1=b6[a0]
a2=b4[a0]
a3=a?c:b
a2=B.a.j(a3*(a2<128?a2:a2-256),5)
if(!(a0<b3))return A.a(b7,a0)
b7[a0]=a1-a2&255}a4=A.oy(b5,b7,h,b8,b9,c0)
B.c.E(b0,new A.fQ(d,c,a4))
for(b=a4-256,a=a4<128,a1=d-256,a2=d<128,a0=0;a0<h;++a0){if(!(a0<b3))return A.a(b5,a0)
a3=b5[a0]
if(!(a3<512))return A.a(b1,a3)
a5=b1[a3]
if(!(a3<512))return A.a(b1,a3)
b1[a3]=a5+1
a5=256+b6[a0]
if(!(a5<512))return A.a(b1,a5)
a3=b1[a5]
if(!(a5<512))return A.a(b1,a5)
b1[a5]=a3+1
a3=b5[a0]
a5=b4[a0]
a6=a2?d:a1
a3=a3-B.a.j(a6*(a5<128?a5:a5-256),5)&255
a5=b2[a3]
if(!(a3<512))return A.a(b2,a3)
b2[a3]=a5+1
a5=b7[a0]
a3=b5[a0]
a6=a?a4:b
a3=256+(a5-B.a.j(a6*(a3<128?a3:a3-256),5)&255)
a5=b2[a3]
if(!(a3<512))return A.a(b2,a3)
b2[a3]=a5+1}}return A.mM(b1,256,0)+A.mM(b1,256,256)-A.mM(b2,256,0)-A.mM(b2,256,256)>a8*a9*24?b0:null},
mM(a,b,c){var s,r,q,p,o
for(s=0,r=0;r<b;++r){q=c+r
if(!(q<512))return A.a(a,q)
s+=a[q]}if(s===0)return 0
for(p=0,r=0;r<b;++r){q=c+r
if(!(q<512))return A.a(a,q)
o=a[q]
if(o>0)p-=o*(Math.log(o/s)/0.6931471805599453)}return p},
xe(a,b,c,a0,a1,a2,a3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=B.a.j(a0+B.a.O(1,a2)-1,a2)
for(s=c.$flags|0,r=a.$flags|0,q=c.length,p=b.length,o=a3.length,n=a.length,m=0;m<a1;++m)for(l=m*a0,k=0;k<a0;++k){j=l+k
i=B.a.a6(m,a2)*d+B.a.a6(k,a2)
if(!(i<o))return A.a(a3,i)
h=a3[i]
if(!(j>=0&&j<n))return A.a(a,j)
g=a[j]
i=h.a
if(!(j<p))return A.a(b,j)
f=b[j]
i=i<128?i:i-256
i=B.b.j(i*(f<128?f:f-256),5)
r&2&&A.b(a)
a[j]=g-i&255
if(!(j<q))return A.a(c,j)
i=c[j]
f=h.b
e=b[j]
f=f<128?f:f-256
f=B.b.j(f*(e<128?e:e-256),5)
e=h.c
e=e<128?e:e-256
e=B.b.j(e*(g<128?g:g-256),5)
s&2&&A.b(c)
c[j]=i-f-e&255}},
fQ:function fQ(a,b,c){this.a=a
this.b=b
this.c=c},
uZ(a,b){return B.a.aM(a+B.a.U(1,b)-1,b)},
uY(a,b){var s,r,q,p,o,n,m,l,k=b.a,j=b.b,i=b.c
for(s=j.$flags|0,r=a.a,q=r.length,p=i.$flags|0,o=0;o<k;){if(!(o>=0&&o<q))return A.a(r,o)
n=r[o]&4095
m=n>=3?n:1
s&2&&A.b(j)
if(!(o<j.length))return A.a(j,o)
j[o]=m
l=r[o]
p&2&&A.b(i)
if(!(o<i.length))return A.a(i,o)
i[o]=l>>>12
o+=m}},
lN:function lN(a){this.a=a},
mr:function mr(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
j7:function j7(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.z=_.y=_.x=_.w=_.r=$},
fS(a){var s=new Float64Array(5),r=new Int32Array(5),q=new Int32Array(5),p=A.N(5,$.rI(),!1,t.bW),o=new Int32Array(5),n=new Uint32Array(a),m=new Uint32Array(256),l=new Uint32Array(256),k=new Uint32Array(256)
return new A.fR(a,n,m,l,k,new Uint32Array(40),s,r,q,p,o)},
xl(a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5=null,a6=a7.length
if(a6<2)return a5
s=t.cy
r=A.j([],s)
q=new Int32Array(a6)
for(p=0;p<a6;++p){o=a7[p]
if(o.gcn()===0){q[p]=0
if(r.length===0){n=A.fS(o.a)
o.d0(n)
B.c.E(r,n)}continue}for(m=-1,l=1/0,k=0;j=r.length,k<j;++k){j=r[k].ij(o)
if(!(k<r.length))return A.a(r,k)
i=j-r[k].gcn()-o.gcn()
if(i<l){l=i
m=k}}if(m>=0)h=l>160&&j<16
else h=!0
if(h){q[p]=j
n=A.fS(o.a)
o.d0(n)
B.c.E(r,n)}else{q[p]=m
if(!(m>=0&&m<j))return A.a(r,m)
o.d0(r[m])}}if(r.length<2)return a5
g=B.c.gd5(a7).a
f=r.length
e=J.aa(f,t.d)
for(d=0;d<f;++d)e[d]=A.fS(g)
for(p=0;p<a6;++p){o=a7[p]
if(o.gcn()===0)q[p]=p>0?q[p-1]:0
else{for(c=0,l=1/0,k=0;k<r.length;++k){j=r[k].ij(o)
if(!(k<r.length))return A.a(r,k)
i=j-r[k].gcn()
if(i<l){l=i
c=k}}q[p]=c}j=q[p]
if(!(j>=0&&j<f))return A.a(e,j)
o.d0(e[j])}j=r.length
b=new Uint32Array(j)
for(d=0;d<a6;++d){k=q[d]
if(!(k>=0&&k<j))return A.a(b,k)
b[k]=b[k]+1}a=new Int32Array(j)
a0=A.j([],s)
for(k=0;k<r.length;++k){s=a0.length
if(!(k<j))return A.a(a,k)
a[k]=s
if(!(k<j))return A.a(b,k)
if(b[k]>0){if(!(k<f))return A.a(e,k)
B.c.E(a0,e[k])}}if(a0.length<2)return a5
for(p=0;p<a6;++p){s=q[p]
if(!(s>=0&&s<j))return A.a(a,s)
q[p]=a[s]}B.c.ca(r)
B.c.cE(r,a0)
a1=A.fS(g)
for(d=0;d<a6;++d)a7[d].d0(a1)
for(s=r.length,a2=0,d=0;j=r.length,d<j;r.length===s||(0,A.K)(r),++d)a2+=r[d].gcn()
a3=new Uint32Array(j)
for(d=0;d<a6;++d){k=q[d]
if(!(k>=0&&k<j))return A.a(a3,k)
a3[k]=a3[k]+1}for(a4=0,d=0;d<j;++d){n=a3[d]
if(n>0)a4-=n*(Math.log(n/a6)/0.6931471805599453)}a2+=a4+160
return a2<a1.gcn()?new A.lI(q,r.length,a2):a5},
mZ:function mZ(){},
fR:function fR(a,b,c,d,e,f,g,h,i,j,k){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=$
_.w=g
_.x=h
_.y=i
_.z=!1
_.Q=j
_.as=k},
lI:function lI(a,b,c){this.a=a
this.b=b
this.c=c},
jB(a){var s,r
if(a<=4)return 255+a
s=a-1
r=A.mY(s)
return 256+2*r+(B.a.aM(s,r-1)&1)},
rd(a){var s,r
if(a<=4)return B.dP
s=a-1
r=A.mY(s)-1
return new A.bI(r,s-B.a.U(2+(B.a.aM(s,r)&1),r))},
jv(a,b){var s,r=B.a.Z(b,a),q=b-r*a
if(q<=8&&r<8){s=r*16+8-q
if(!(s>=0&&s<128))return A.a(B.aZ,s)
return B.aZ[s]+1}else if(q>a-8&&r<7){s=(r+1)*16+8+a-q
if(!(s>=0&&s<128))return A.a(B.aZ,s)
return B.aZ[s]+1}return b+120},
jC(a){var s,r=a-1
if(r<4)return r
s=A.mY(r)
return 2*s+(B.a.aM(r,s-1)&1)},
ri(a){var s,r=a-1
if(r<4)return B.dP
s=A.mY(r)-1
return new A.bI(s,r-B.a.U(2+(B.a.aM(r,s)&1),s))},
mY(a){var s
for(s=0;a>1;){a=B.a.j(a,1);++s}return s},
ep(a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=t.p,a0=A.N(a4,0,!1,a),a1=t.t,a2=A.j([],a1)
for(s=0;s<a4;++s){if(!(s<a3.length))return A.a(a3,s)
if(a3[s]>0)B.c.E(a2,s)}r=a2.length
if(r===0){B.c.i(a0,0,1)
return a0}if(r===1){if(0>=r)return A.a(a2,0)
B.c.i(a0,a2[0],1)
return a0}q=2*r
p=A.N(q,0,!1,a)
o=A.N(q,-1,!1,a)
n=A.N(q,-1,!1,a)
for(m=1;;m*=2){for(s=0;l=a2.length,s<l;++s){a=a2[s]
if(!(a<a3.length))return A.a(a3,a)
B.c.i(p,s,a3[a])
if(!(s<q))return A.a(p,s)
if(p[s]<m)B.c.i(p,s,m)}a=A.j(new Array(l),a1)
for(s=0;s<l;++s)a[s]=s
B.c.f7(a,new A.nb(p))
for(;a.length>1;l=i){k=B.c.is(a,0)
j=B.c.is(a,0)
i=l+1
if(!(k<q))return A.a(p,k)
r=p[k]
if(!(j<q))return A.a(p,j)
B.c.i(p,l,r+p[j])
B.c.i(o,l,k)
B.c.i(n,l,j)
r=a.length
h=0
for(;;){if(h<r){g=a[h]
if(!(g<q))return A.a(p,g)
g=p[g]
if(!(l<q))return A.a(p,l)
g=g<=p[l]}else g=!1
if(!g)break;++h}B.c.nv(a,h,l)}f=A.j([a[0]],a1)
e=A.j([0],a1)
for(d=0;a=f.length,a!==0;){if(0>=a)return A.a(f,-1)
c=f.pop()
if(0>=e.length)return A.a(e,-1)
b=e.pop()
if(!(c>=0&&c<q))return A.a(o,c)
a=o[c]
if(a===-1){if(!(c<a2.length))return A.a(a2,c)
B.c.i(a0,a2[c],b)
if(b>d)d=b}else{B.c.E(f,a)
if(!(c<q))return A.a(n,c)
B.c.E(f,n[c])
a=b+1
B.c.E(e,a)
B.c.E(e,a)}}if(d<=a5)break}return a0},
hp(a,b,c){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=A.j([],t.t)
for(s=c.length,r=0;r<b;++r){if(!(r<s))return A.a(c,r)
if(c[r]>0)B.c.E(e,r)}s=e.length
if(s<=2)s=s===0||B.c.gcH(e)<=255
else s=!1
if(s){a.T(1,1)
s=e.length
if(s===0){a.T(0,1)
a.T(0,1)
a.T(0,1)
return}a.T(s-1,1)
if(0>=e.length)return A.a(e,0)
q=e[0]
if(q<=1){a.T(0,1)
a.T(q,1)}else{a.T(1,1)
a.T(q,8)}s=e.length
if(s===2){if(1>=s)return A.a(e,1)
a.T(e[1],8)}else B.c.i(c,q,0)
return}p=A.w2(c,b)
o=A.N(19,0,!1,t.p)
for(s=p.length,n=0;n<p.length;p.length===s||(0,A.K)(p),++n){m=p[n].a
if(!(m>=0&&m<19))return A.a(o,m)
B.c.i(o,m,o[m]+1)}l=A.ep(o,19,7)
k=A.eq(new Int32Array(A.o(l)),19)
s=l.length
r=18
for(;;){if(!(r>=4)){j=4
break}m=B.b1[r]
if(!(m<s))return A.a(l,m)
if(l[m]!==0){j=r+1
break}--r}a.T(0,1)
a.T(j-4,4)
for(r=0;r<j;++r){m=B.b1[r]
if(!(m<s))return A.a(l,m)
a.T(l[m],3)}a.T(0,1)
for(m=p.length,i=k.length,n=0;n<p.length;p.length===m||(0,A.K)(p),++n){h=p[n]
g=h.a
if(!(g>=0&&g<i))return A.a(k,g)
f=k[g]
if(!(g<s))return A.a(l,g)
a.T(f,l[g])
g=h.b
if(g>0)a.T(h.c,g)}s=e.length
if(s===1){if(0>=s)return A.a(e,0)
B.c.i(c,e[0],0)}},
w2(a,b){var s,r,q,p,o,n,m,l,k,j=A.j([],t.cF)
for(s=a.length,r=0;r<b;){if(!(r>=0&&r<s))return A.a(a,r)
q=a[r]
if(q===0){p=0
for(;;){o=r+p
if(o<b){if(!(o<s))return A.a(a,o)
n=a[o]===0}else n=!1
if(!n)break;++p}for(m=p;m>0;)if(m>=11){l=B.a.L(m,11,138)
B.c.E(j,new A.c6(18,7,l-11))
m-=l}else if(m>=3){l=B.a.L(m,3,10)
B.c.E(j,new A.c6(17,3,l-3))
m-=l}else{B.c.E(j,new A.c6(0,0,0));--m}r=o}else{B.c.E(j,new A.c6(q,0,0));++r
for(;;){if(r<b){if(!(r>=0&&r<s))return A.a(a,r)
n=a[r]===q}else n=!1
if(!n)break
p=0
for(;;){o=r+p
if(o<b){if(!(o>=0&&o<s))return A.a(a,o)
n=a[o]===q&&p<6}else n=!1
if(!n)break;++p}if(p>=3)B.c.E(j,new A.c6(16,2,p-3))
else for(k=0;k<p;++k)B.c.E(j,new A.c6(q,0,0))
r=o}}}return j},
eq(a,b){var s,r,q,p,o,n,m,l,k,j,i,h=t.p,g=A.N(b,0,!1,h)
for(s=a.length,r=0,q=0;q<b;++q){if(!(q<s))return A.a(a,q)
p=a[q]
if(p>r)r=p}if(r===0)return g
o=r+1
n=A.N(o,0,!1,h)
for(q=0;q<b;++q){if(!(q<s))return A.a(a,q)
m=a[q]
if(m>0){if(!(m<o))return A.a(n,m)
B.c.i(n,m,n[m]+1)}}B.c.i(n,0,0)
l=A.N(o,0,!1,h)
for(k=0,j=1;j<=r;++j){h=j-1
if(!(h<o))return A.a(n,h)
k=k+n[h]<<1>>>0
B.c.i(l,j,k)}for(q=0;q<b;++q){if(!(q<s))return A.a(a,q)
i=a[q]
if(i>0){if(!(i<o))return A.a(l,i)
B.c.i(g,q,A.wT(l[i],i))
B.c.i(l,i,l[i]+1)}}return g},
wT(a,b){var s,r
for(s=0,r=0;r<b;++r){s=(s<<1|a&1)>>>0
a=a>>>1}return s},
nb:function nb(a){this.a=a},
c6:function c6(a,b,c){this.a=a
this.b=b
this.c=c},
c2(a,b){return((a^b)>>>1&2139062143)+((a&b)>>>0)},
de(a){if(a<0)return 0
if(a>255)return 255
return a},
lP(a,b,c){return Math.abs(b-c)-Math.abs(a-c)},
v_(a,b,c){return 4278190080},
v0(a,b,c){return a},
v5(a,b,c){if(!(c>=0&&c<b.length))return A.a(b,c)
return b[c]},
v6(a,b,c){var s=c+1
if(!(s>=0&&s<b.length))return A.a(b,s)
return b[s]},
v7(a,b,c){var s=c-1
if(!(s>=0&&s<b.length))return A.a(b,s)
return b[s]},
v8(a,b,c){var s,r,q=b.length
if(!(c>=0&&c<q))return A.a(b,c)
s=b[c]
r=c+1
if(!(r<q))return A.a(b,r)
return A.c2(A.c2(a,b[r]),s)},
v9(a,b,c){var s=c-1
if(!(s>=0&&s<b.length))return A.a(b,s)
return A.c2(a,b[s])},
va(a,b,c){if(!(c>=0&&c<b.length))return A.a(b,c)
return A.c2(a,b[c])},
vb(a,b,c){var s=c-1,r=b.length
if(!(s>=0&&s<r))return A.a(b,s)
s=b[s]
if(!(c>=0&&c<r))return A.a(b,c)
return A.c2(s,b[c])},
vc(a,b,c){var s,r,q=b.length
if(!(c>=0&&c<q))return A.a(b,c)
s=b[c]
r=c+1
if(!(r<q))return A.a(b,r)
return A.c2(s,b[r])},
v1(a,b,c){var s,r,q=c-1,p=b.length
if(!(q>=0&&q<p))return A.a(b,q)
q=b[q]
if(!(c>=0&&c<p))return A.a(b,c)
s=b[c]
r=c+1
if(!(r<p))return A.a(b,r)
r=b[r]
return A.c2(A.c2(a,q),A.c2(s,r))},
v2(a,b,c){var s,r,q=b.length
if(!(c>=0&&c<q))return A.a(b,c)
s=b[c]
r=c-1
if(!(r>=0&&r<q))return A.a(b,r)
r=b[r]
return A.lP(s>>>24,a>>>24,r>>>24)+A.lP(s>>>16&255,a>>>16&255,r>>>16&255)+A.lP(s>>>8&255,a>>>8&255,r>>>8&255)+A.lP(s&255,a&255,r&255)<=0?s:a},
v3(a,b,c){var s,r,q=b.length
if(!(c>=0&&c<q))return A.a(b,c)
s=b[c]
r=c-1
if(!(r>=0&&r<q))return A.a(b,r)
r=b[r]
return(A.de((a>>>24)+(s>>>24)-(r>>>24))<<24|A.de((a>>>16&255)+(s>>>16&255)-(r>>>16&255))<<16|A.de((a>>>8&255)+(s>>>8&255)-(r>>>8&255))<<8|A.de((a&255)+(s&255)-(r&255)))>>>0},
v4(a,b,c){var s,r,q,p,o,n=b.length
if(!(c>=0&&c<n))return A.a(b,c)
s=b[c]
r=c-1
if(!(r>=0&&r<n))return A.a(b,r)
r=b[r]
q=A.c2(a,s)
s=q>>>24
n=q>>>16&255
p=q>>>8&255
o=q>>>0&255
return(A.de(s+B.a.P(s-(r>>>24),2))<<24|A.de(n+B.a.P(n-(r>>>16&255),2))<<16|A.de(p+B.a.P(p-(r>>>8&255),2))<<8|A.de(o+B.a.P(o-(r&255),2)))>>>0},
dd:function dd(a,b){this.a=a
this.b=b},
iW:function iW(a){var _=this
_.a=a
_.c=_.b=0
_.d=null
_.e=0},
lW:function lW(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.f=_.e=_.d=0
_.r=1
_.w=!1
_.x=$
_.y=!1},
oT(a){var s,r=a.length,q=new Uint8Array(r)
for(s=0;s<r;++s){if(!(s<r))return A.a(q,s)
q[s]=a.charCodeAt(s)}return q},
r0(a){var s,r,q,p,o,n
for(s=a.length,r=4,q=0;q<s;++q){p=a[q].b.length
o=(p&1)===1?1:0
r+=8+p+o}n=A.ai(!1,8192)
n.au(A.oT("RIFF"))
n.ae(r)
n.au(A.oT("WEBP"))
for(s=a.length,q=0;q<a.length;a.length===s||(0,A.K)(a),++q)a[q].o8(n)
return J.F(B.d.gt(n.c),0,n.a)},
qY(a,b){a.u(b&255)
a.u(B.a.j(b,8)&255)
a.u(B.a.j(b,16)&255)},
cz:function cz(a,b){this.a=a
this.b=b},
fX:function fX(){},
i6:function i6(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.r=_.f=$
_.w=1
_.y=_.x=$},
nS(a){var s,r=J.bF(a,t.a6)
for(s=0;s<a;++s)r[s]=new A.hM()
return new A.eQ(r,0)},
tK(){var s,r,q=J.aa(5,t.lJ)
for(s=0;s<5;++s)q[s]=A.nS(0)
r=J.aa(64,t.lq)
for(s=0;s<64;++s)r[s]=new A.hN()
return new A.eP(q,r)},
hM:function hM(){this.b=this.a=0},
hN:function hN(){this.b=this.a=0},
eQ:function eQ(a,b){this.a=a
this.b=b},
eP:function eP(a,b){var _=this
_.a=a
_.b=!1
_.c=0
_.e=_.d=!1
_.f=b},
eR:function eR(){var _=this
_.b=_.a=null
_.e=_.d=0},
hO:function hO(a){this.a=a
this.b=null},
ea:function ea(a,b){this.a=a
this.b=b},
c4:function c4(a,b){var _=this
_.b=_.a=0
_.c=null
_.e=_.d=!1
_.f=a
_.r=null
_.w=""
_.y=0
_.z=b
_.as=0
_.at=null
_.ch=_.ay=0},
f4:function f4(a,b){var _=this
_.b=_.a=0
_.c=null
_.e=_.d=!1
_.f=a
_.r=null
_.w=""
_.y=0
_.z=b
_.as=0
_.at=null
_.ch=_.ay=0},
lX:function lX(a){this.a=null
this.b=a
this.c=null},
m_:function m_(a,b){this.a=a
this.b=b},
lY:function lY(a,b){this.a=a
this.b=b},
lZ:function lZ(a,b,c){this.a=a
this.b=b
this.c=c},
vi(a){var s=a.c
if(s==null)return null
return s.b===B.ai?s.c:A.nU(s).i3()},
vh(a){var s,r,q,p,o,n
for(s=a.gav(),r=s.length,q=0;q<s.length;s.length===r||(0,A.K)(s),++q){p=s[q]
if(!(p.gak()===2||p.gak()===4))continue
for(o=p.a,o=o.gF(o);o.C();){n=o.gN()
if(n.gv()!==n.gG())return!0}}return!1},
vg(a){var s
if(a.gbe().gab(0))return null
s=A.ai(!1,8192)
a.gbe().aR(s)
return J.F(B.d.gt(s.c),0,s.a)},
m0:function m0(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
nU(a){return new A.cj(a.a,a.b,B.d.dn(a.c,0))},
hP:function hP(a,b){this.a=a
this.b=b},
cj:function cj(a,b,c){this.a=a
this.b=b
this.c=c},
Z(a,b,c,d,e,f,g,h,i,j,k,l,m){var s,r=null,q=new A.ap(r,r,r,a,h,e,d,0)
B.c.E(q.gav(),q)
if(l<0||f<0)A.a9(A.aJ("Invalid image dimensions "+l+"x"+f,r))
q.c=g
if(b!=null)q.e=A.eH(b)
s=!1
if(j==null)if(m)s=q.gM()===B.L||q.gM()===B.R||q.gM()===B.S||q.gM()===B.e||q.gM()===B.u
q.fz(l,f,c,i,s?q.jY(c,k,i):j)
return q},
eS(a,b,c,d){var s,r,q,p,o=null,n=a.e
n=n==null?o:A.eH(n)
s=a.c
s=s==null?o:A.nU(s)
r=a.w
q=a.r
p=a.f
p=p==null?o:new A.bi(new Uint8Array(A.o(p.a)))
r=new A.ap(o,s,n,p,q,r,a.y,a.z)
r.jf(a,b,c,d)
return r},
b2(a,b,c){var s,r,q,p,o,n=null,m=a.a
m=m==null?n:m.aA(c)
s=a.e
s=s==null?n:A.eH(s)
r=a.c
r=r==null?n:A.nU(r)
q=a.w
p=a.r
o=a.f
o=o==null?n:new A.bi(new Uint8Array(A.o(o.a)))
q=new A.ap(m,r,s,o,p,q,a.y,a.z)
q.je(a,b,c)
return q},
k5:function k5(a,b){this.a=a
this.b=b},
ap:function ap(a,b,c,d,e,f,g,h){var _=this
_.a=a
_.b=null
_.c=b
_.d=null
_.e=c
_.f=d
_.r=e
_.w=f
_.x=$
_.y=g
_.z=h},
kp:function kp(a,b){this.a=a
this.b=b},
ko:function ko(){},
aq:function aq(){},
tM(a,b,c){return new A.dL(new Uint16Array(a*b*c),a,b,c)},
dL:function dL(a,b,c,d){var _=this
_.d=a
_.a=b
_.b=c
_.c=d},
tN(a,b,c){return new A.dM(new Float32Array(a*b*c),a,b,c)},
dM:function dM(a,b,c,d){var _=this
_.d=a
_.a=b
_.b=c
_.c=d},
eT:function eT(a,b,c,d){var _=this
_.d=a
_.a=b
_.b=c
_.c=d},
eU:function eU(a,b,c,d){var _=this
_.d=a
_.a=b
_.b=c
_.c=d},
eV:function eV(a,b,c,d){var _=this
_.d=a
_.a=b
_.b=c
_.c=d},
eW:function eW(a,b,c,d){var _=this
_.d=a
_.a=b
_.b=c
_.c=d},
dN:function dN(a,b,c,d,e,f){var _=this
_.d=a
_.e=b
_.f=c
_.r=null
_.a=d
_.b=e
_.c=f},
cO:function cO(a,b,c,d,e){var _=this
_.d=a
_.e=b
_.a=c
_.b=d
_.c=e},
dO:function dO(a,b,c,d,e,f){var _=this
_.d=a
_.e=b
_.f=c
_.r=null
_.a=d
_.b=e
_.c=f},
tO(a,b,c){return new A.dP(new Uint32Array(a*b*c),a,b,c)},
dP:function dP(a,b,c,d){var _=this
_.d=a
_.a=b
_.b=c
_.c=d},
dQ:function dQ(a,b,c,d,e,f){var _=this
_.d=a
_.e=b
_.f=c
_.r=null
_.a=d
_.b=e
_.c=f},
px(a,b,c){return new A.cn(new Uint8Array(a*b*c),null,a,b,c)},
cn:function cn(a,b,c,d,e){var _=this
_.d=a
_.e=b
_.a=c
_.b=d
_.c=e},
dR:function dR(a,b){this.a=a
this.b=b},
b4:function b4(){},
fq:function fq(a,b,c){this.c=a
this.a=b
this.b=c},
fr:function fr(a,b,c){this.c=a
this.a=b
this.b=c},
fs:function fs(a,b,c){this.c=a
this.a=b
this.b=c},
ft:function ft(a,b,c){this.c=a
this.a=b
this.b=c},
fu:function fu(a,b,c){this.c=a
this.a=b
this.b=c},
fv:function fv(a,b,c){this.c=a
this.a=b
this.b=c},
fw:function fw(a,b,c){this.c=a
this.a=b
this.b=c},
e0:function e0(a,b,c){this.c=a
this.a=b
this.b=c},
pQ(a){return new A.aU(new Uint8Array(A.o(a.c)),a.a,a.b)},
aU:function aU(a,b,c){this.c=a
this.a=b
this.b=c},
pR(a){return new A.cU(-1,0,-a.c,a)},
cU:function cU(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
pS(a){return new A.cV(-1,0,-a.c,a)},
cV:function cV(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
pT(a){return new A.cW(-1,0,-a.c,a)},
cW:function cW(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
pU(a){return new A.cX(-1,0,-a.c,a)},
cX:function cX(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
pV(a){return new A.cY(-1,0,-a.c,a)},
cY:function cY(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
pW(a){return new A.cZ(-1,0,-a.c,a)},
cZ:function cZ(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
io(a){return new A.d_(-1,0,0,-1,0,a)},
d_:function d_(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
pX(a){return new A.d0(-1,0,-a.c,a)},
d0:function d0(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
ip(a){return new A.d1(-1,0,0,-2,0,a)},
d1:function d1(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
pY(a){return new A.d2(-1,0,-a.c,a)},
d2:function d2(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
iq(a){return new A.d3(-1,0,0,-(a.c<<2>>>0),a)},
d3:function d3(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
o6(a){return new A.d4(-1,0,-a.c,a)},
d4:function d4(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
J:function J(){},
r1(a,b){var s
if(b===B.aC)s=A.aO(a)>0
else s=a.gM()===B.e&&!a.gaH()
return s},
rf(a,b){return b>=5&&b<=8?a.gI():a.gJ()},
re(a,b){return b>=5&&b<=8?a.gJ():a.gI()},
y5(a,b,c,d,e,f,g,h,i,j,k,l){var s,r,q,p,o
if(!A.r1(a,c))return!1
s=a.a0()
r=A.aO(a)
q=new A.ms(s,r,A.rf(a,l),A.re(a,l))
q.jo(a,l)
p=b.a0()
o=b.a.gaB()
if(c===B.aC){if(A.aO(b)!==r)return!1
A.wS(q,p,o,d,e,f,g,j,k)
return!0}if(b.gM()!==B.e||b.a.c!==a.a.c)return!1
switch(c.a){case 1:A.wR(q,p,o,d,e,f,g,h,i)
return!0
case 3:A.wP(q,p,o,d,e,f,g,h,i)
return!0
case 2:A.wQ(q,p,o,d,e,f,g,h,i)
return!0
case 0:return!1}},
wS(a,b,a0,a1,a2,a3,a4,a5,a6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=a.b,d=a.a,c=new Int32Array(a3)
for(s=a5.length,r=a.f,q=0;q<a3;++q){if(!(q<s))return A.a(a5,q)
p=a5[q]
r===$&&A.c()
if(!(q<a3))return A.a(c,q)
c[q]=p*r}for(s=d.length,r=b.$flags|0,p=a6.length,o=a.e,n=a.r,m=a1*e,l=0;l<a4;++l){if(!(l<p))return A.a(a6,l)
k=a6[l]
o===$&&A.c()
n===$&&A.c()
j=o+k*n
i=(a2+l)*a0+m
for(q=0;q<a3;++q){h=j+c[q]
for(g=0;g<e;++g,i=f){f=i+1
k=h+g
if(!(k>=0&&k<s))return A.a(d,k)
k=d[k]
r&2&&A.b(b)
if(!(i>=0&&i<b.length))return A.a(b,i)
b[i]=k}}}},
wR(a,b,a0,a1,a2,a3,a4,a5,a6){var s,r,q,p,o,n,m,l,k,j,i,h=a.b,g=a.c-1,f=a.d-1,e=new Int32Array(a3),d=new Int32Array(a3),c=new Float64Array(a3)
for(s=0;s<a3;++s){r=s*a5
q=B.b.h(r)
if(!(s<a3))return A.a(c,s)
c[s]=r-q
p=a.f
p===$&&A.c()
if(!(s<a3))return A.a(e,s)
e[s]=q*p
o=B.a.L(q+1,0,g)
if(!(s<a3))return A.a(d,s)
d[s]=o*p}for(p=a.a,o=a1*h,n=0;n<a4;++n){m=n*a6
l=B.b.h(m)
k=B.a.L(l+1,0,f)
j=a.e
j===$&&A.c()
i=a.r
i===$&&A.c()
A.wJ(p,j+l*i,j+k*i,b,(a2+n)*a0+o,h,a3,e,d,c,m-l)}},
wJ(a,b,a0,a1,a2,a3,a4,a5,a6,a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c
for(s=a.length,r=a5.length,q=a6.length,p=a7.length,o=0;o<a4;++o){if(!(o<r))return A.a(a5,o)
n=a5[o]
m=b+n
if(!(o<q))return A.a(a6,o)
l=a6[o]
k=b+l
j=a0+n
i=a0+l
if(!(o<p))return A.a(a7,o)
h=a7[o]
for(g=0;g<a3;++g,a2=c){n=m+g
if(!(n>=0&&n<s))return A.a(a,n)
f=a[n]
e=B.d.l(a,k+g)
n=j+g
if(!(n>=0&&n<s))return A.a(a,n)
d=a[n]
c=a2+1
n=B.b.h(f+h*(e-f+a8*(f+B.d.l(a,i+g)-d-e))+a8*(d-f))
a1.$flags&2&&A.b(a1)
if(!(a2>=0&&a2<a1.length))return A.a(a1,a2)
a1[a2]=n}}},
wP(a5,a6,a7,a8,a9,b0,b1,b2,b3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2=a5.b,a3=new Int32Array(b0),a4=new Int32Array(b0)
for(s=0;s<b0;s=q){r=B.b.h(s*b2)
q=s+1
p=B.b.h(q*b2)
if(p===r)++p
if(!(s<b0))return A.a(a3,s)
a3[s]=r
if(!(s<b0))return A.a(a4,s)
a4[s]=p}o=new Int32Array(a2)
for(n=a5.a,m=a8*a2,l=0;l<b1;l=j){k=B.b.h(l*b3)
j=l+1
i=B.b.h(j*b3)
if(i===k)++i
h=(a9+l)*a7+m
for(g=i-k,s=0;s<b0;++s){r=a3[s]
p=a4[s]
for(f=0;f<a2;++f){if(!(f<a2))return A.a(o,f)
o[f]=0}for(e=p-r,d=k;d<i;++d){c=a5.e
c===$&&A.c()
b=a5.r
b===$&&A.c()
a=a5.f
a===$&&A.c()
A.x6(n,c+d*b+r*a,e,a,a2,o)}a0=1/(g*e)
for(e=a6.$flags|0,f=0;f<a2;++f,h=a1){a1=h+1
c=B.b.h(o[f]*a0)
e&2&&A.b(a6)
if(!(h>=0&&h<a6.length))return A.a(a6,h)
a6[h]=c}}}},
x6(a,b,c,d,e,f){var s,r,q,p,o,n,m
for(s=f.length,r=a.length,q=f.$flags|0,p=0;p<c;++p,b+=d)for(o=0;o<e;++o){if(!(o<s))return A.a(f,o)
n=f[o]
m=b+o
if(!(m>=0&&m<r))return A.a(a,m)
m=a[m]
q&2&&A.b(f)
f[o]=n+m}},
wQ(c0,c1,c2,c3,c4,c5,c6,c7,c8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4=c0.b,b5=c0.a,b6=c5*4,b7=new Int32Array(b6),b8=new Uint8Array(b6),b9=new Float64Array(c5)
for(s=c0.f,r=c0.c,q=0;q<c5;++q){p=q*c7
o=B.b.h(p)
if(!(q<c5))return A.a(b9,q)
b9[q]=p-o
for(n=q*4,m=0;m<4;++m){l=o+m-1
k=n+m
s===$&&A.c()
if(!(k<b6))return A.a(b7,k)
b7[k]=l*s
j=l<0||l>=r?0:1
if(!(k<b6))return A.a(b8,k)
b8[k]=j}}i=new Int32Array(4)
h=new Uint8Array(4)
g=new Int32Array(16)
f=new Float64Array(4)
for(s=c1.$flags|0,r=b5.length,n=c3*b4,k=c0.e,j=c0.r,e=c0.d,d=0;d<c6;++d){c=d*c8
b=B.b.h(c)
a=c-b
for(m=0;m<4;++m){a0=b+m-1
k===$&&A.c()
j===$&&A.c()
if(!(m<4))return A.a(i,m)
i[m]=k+a0*j
a1=a0<0||a0>=e?0:1
if(!(m<4))return A.a(h,m)
h[m]=a1}a2=(c4+d)*c2+n
for(q=0;q<c5;++q){a1=i[1]
a3=q*4
a4=a3+1
if(!(a4<b6))return A.a(b7,a4)
a5=a1+b7[a4]
for(a6=0;a6<4;++a6)for(a1=a6*4,m=0;m<4;++m){a4=a1+m
if(h[a6]!==0){a7=a3+m
if(!(a7<b6))return A.a(b8,a7)
a7=b8[a7]===0}else a7=!0
if(a7)a7=a5
else{a7=i[a6]
a8=a3+m
if(!(a8<b6))return A.a(b7,a8)
a8=a7+b7[a8]
a7=a8}if(!(a4<16))return A.a(g,a4)
g[a4]=a7}a9=b9[q]
for(b0=0;b0<b4;++b0,a2=b3){for(a6=0;a6<4;++a6){b1=a6*4
if(!(b1<16))return A.a(g,b1)
a1=g[b1]+b0
if(!(a1>=0&&a1<r))return A.a(b5,a1)
a1=b5[a1]
a3=b1+1
if(!(a3<16))return A.a(g,a3)
a3=g[a3]+b0
if(!(a3>=0&&a3<r))return A.a(b5,a3)
a3=b5[a3]
a4=b1+2
if(!(a4<16))return A.a(g,a4)
a4=g[a4]+b0
if(!(a4>=0&&a4<r))return A.a(b5,a4)
a4=b5[a4]
a7=b1+3
if(!(a7<16))return A.a(g,a7)
a7=g[a7]+b0
if(!(a7>=0&&a7<r))return A.a(b5,a7)
a7=A.qG(a9,a1,a3,a4,b5[a7])
if(!(a6<4))return A.a(f,a6)
f[a6]=a7}b2=A.qG(a,f[0],f[1],f[2],f[3])
b3=a2+1
if(b2<0)a1=0
else a1=b2>255?255:B.b.h(b2)
s&2&&A.b(c1)
if(!(a2>=0&&a2<c1.length))return A.a(c1,a2)
c1[a2]=a1}}}},
qG(a,b,c,d,e){var s=-b,r=a*a
return c+0.5*(a*(s+d)+r*(2*b-5*c+4*d-e)+r*a*(s+3*c-3*d+e))},
ms:function ms(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.r=_.f=_.e=$},
oJ(f0,f1,f2,f3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7=null,e8="ifd0",e9={}
e9.a=f2
s=f3==null
if(s&&f1==null)throw A.e(A.k("Invalid size"))
if(f0.gaH())e9.a=B.aC
r=1
if(f0.gbe().l(0,e8).a.af(274)&&f0.gbe().l(0,e8).gc1()!==1){q=f0.gbe().l(0,e8).gc1()
q.toString
if(q>=2&&q<=8&&B.c.nk(f0.gav(),new A.nl(e9)))r=q
else f0=A.oH(f0)}p=A.rf(f0,r)
o=A.re(f0,r)
if(f1==null||f1<=0){f3.toString
f1=B.b.az(f3*(o/p))}if(s||f3<=0)f3=B.b.az(f1*(p/o))
if(f3===p&&f1===o)return r===1?A.b2(f0,!1,!1):A.oH(f0)
n=new Int32Array(f3)
for(m=0;m<f3;++m){s=B.a.Z(m*p,f3)
if(!(m<f3))return A.a(n,m)
n[m]=s}l=new Int32Array(f1)
for(k=0;k<f1;++k){s=B.a.Z(k*o,f1)
if(!(k<f1))return A.a(l,k)
l[k]=s}j=f0.gav().length
for(s=r>=5,q=t.g,i=r<=8,h=e7,g=0;g<j;++g){f=f0.x
if(f===$)f=f0.x=A.j([],q)
if(!(g<f.length))return A.a(f,g)
e=f[g]
d=A.eS(e,f1,!0,f3)
c=h==null
if(!c)h.bW(d)
if(c)h=d
c=s&&i
b=e.a
if(c){c=b==null?e7:b.a
if(c==null)c=0}else{c=b==null?e7:b.b
if(c==null)c=0}a=c/f1
if(s&&i){c=b==null?e7:b.b
if(c==null)c=0}else{c=b==null?e7:b.a
if(c==null)c=0}a0=c/f3
if(A.y5(e,d,e9.a,0,0,f3,f1,a0,a,n,l,r))continue
c=e9.a
if(c===B.bA){a1=e.an(0,0)
for(k=0;k<f1;k=a3){a2=B.b.h(k*a)
a3=k+1
a4=B.b.h(a3*a)
if(a4===a2)++a4
for(m=0;m<f3;m=a6){a5=B.b.h(m*a0)
a6=m+1
a7=B.b.h(a6*a0)
if(a7===a5)++a7
for(a8=a2,a9=0,b0=0,b1=0,b2=0,b3=0;a8<a4;++a8)for(b4=a5;b4<a7;++b4,++b3){c=e.a
if(c!=null)c.S(b4,a8,a1)
a9+=a1.gq()
b0+=a1.gB()
b1+=a1.gA()
b2+=a1.gv()}b5=1/b3
c=d.a
if(c!=null)c.aw(m,k,a9*b5,b0*b5,b1*b5,b2*b5)}}}else if(c===B.aC){c=e.a
if((c==null?e7:c.gW())!=null)for(k=0;k<f1;++k){if(!(k<f1))return A.a(l,k)
b6=l[k]
for(m=0;m<f3;++m){if(!(m<f3))return A.a(n,m)
c=n[m]
b=e.a
c=b==null?e7:B.b.h(b.b0(c,b6).gX())
if(c==null)c=0
b=d.a
if(b!=null)b.aS(m,k,c)}}else{a1=e.an(0,0)
for(k=0;k<f1;++k){if(!(k<f1))return A.a(l,k)
a8=l[k]
for(m=0;m<f3;++m){if(!(m<f3))return A.a(n,m)
c=n[m]
b=e.a
if(b!=null)b.S(c,a8,a1)
c=a1.gq()
b=a1.gB()
b7=a1.gA()
b8=a1.gv()
b9=d.a
if(b9!=null)b9.aw(m,k,c,b,b7,b8)}}}}else if(c===B.f1){c0=e.an(0,0)
c1=e.an(0,0)
c2=e.an(0,0)
c3=e.an(0,0)
c=e.a
b=c==null
b7=b?e7:c.a
c4=(b7==null?0:b7)-1
c=b?e7:c.b
c5=(c==null?0:c)-1
for(k=0;k<f1;++k){c6=k*a
c7=B.b.h(c6)
c8=c6-c7
c9=B.a.L(c7+1,0,c5)
for(m=0;m<f3;++m){d0=m*a0
d1=B.b.h(d0)
d2=d0-d1
d3=B.a.L(d1+1,0,c4)
c=e.a
if(c!=null)c.S(d1,c7,c0)
c=e.a
if(c!=null)c.S(d1,c9,c1)
c=e.a
if(c!=null)c.S(d3,c7,c2)
c=e.a
if(c!=null)c.S(d3,c9,c3)
c=c0.gq()
b=c2.gq()
b7=c1.gq()
b8=c3.gq()
b9=c0.gB()
d4=c2.gB()
d5=c1.gB()
d6=c3.gB()
d7=c0.gA()
d8=c2.gA()
d9=c1.gA()
e0=c3.gA()
e1=c0.gv()
e2=c2.gv()
e3=c1.gv()
e4=c3.gv()
e5=d.a
if(e5!=null)e5.aw(m,k,c+d2*(b-c+c8*(c+b8-b7-b))+c8*(b7-c),b9+d2*(d4-b9+c8*(b9+d6-d5-d4))+c8*(d5-b9),d7+d2*(d8-d7+c8*(d7+e0-d9-d8))+c8*(d9-d7),e1+d2*(e2-e1+c8*(e1+e4-e3-e2))+c8*(e3-e1))}}}else for(k=0;k<f1;++k){e6=k*a
for(m=0;m<f3;++m)d.cg(m,k,e.f0(m*a0,e6,e9.a))}}if(r!==1)h.gbe().l(0,e8).sc1(e7)
h.toString
return h},
nl:function nl(a){this.a=a},
r7(a,b){switch(b.a){case 0:A.nr(a)
break
case 1:A.r8(a)
break
case 2:A.xD(a)
break}return a},
r8(a3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1=null,a2=a3.gav().length
for(s=t.g,r=0;r<a2;++r){q=a3.x
if(q===$)q=a3.x=A.j([],s)
if(!(r<q.length))return A.a(q,r)
p=q[r]
o=p.a
n=o==null
m=n?a1:o.a
if(m==null)m=0
l=n?a1:o.b
if(l==null)l=0
k=B.a.P(l,2)
if(!n){j=J.I(o.gt(o))
if(j==null){o=p.a
o=o==null?a1:o.gt(o)
if(o==null)o=B.d.gt(new Uint8Array(0))
j=J.I(o)}i=p.a.gaB()
h=new Uint8Array(i)
for(g=l-1,f=0;f<k;++f,--g){e=f*i
d=g*i
B.d.a3(h,0,i,j,e)
B.d.a3(j,e,e+i,j,d)
B.d.aa(j,d,d+i,h)}continue}o=a3.a
if((o==null?a1:o.gW())!=null)for(g=l-1,f=0;f<k;++f,--g)for(c=0;c<m;++c){o=p.a
b=o==null?a1:o.S(c,f,a1)
if(b==null)b=new A.J()
o=p.a
a=o==null?a1:o.S(c,g,a1)
if(a==null)a=new A.J()
a0=b.gX()
b.sX(a.gX())
a.sX(a0)}else for(g=l-1,f=0;f<k;++f,--g)for(c=0;c<m;++c){o=p.a
b=o==null?a1:o.S(c,f,a1)
if(b==null)b=new A.J()
o=p.a
a=o==null?a1:o.S(c,g,a1)
if(a==null)a=new A.J()
a0=b.gq()
b.sq(a.gq())
a.sq(a0)
a0=b.gB()
b.sB(a.gB())
a.sB(a0)
a0=b.gA()
b.sA(a.gA())
a.sA(a0)
a0=b.gv()
b.sv(a.gv())
a.sv(a0)}}return a3},
nr(a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=null,a1=a2.gav().length
for(s=t.g,r=0;r<a1;++r){q=a2.x
if(q===$)q=a2.x=A.j([],s)
if(!(r<q.length))return A.a(q,r)
p=q[r]
o=p.a
n=o==null
m=n?a0:o.a
if(m==null)m=0
l=n?a0:o.b
if(l==null)l=0
k=B.a.P(m,2)
j=A.aO(p)
if(j>0){o=p.a
i=o==null?a0:J.I(o.gt(o))
if(i==null){o=p.a
o=o==null?a0:o.gt(o)
if(o==null)o=B.d.gt(new Uint8Array(0))
i=J.I(o)}h=p.a.gaB()
for(g=0;g<l;++g)A.rm(i,g*h,m,j)
continue}o=a2.a
if((o==null?a0:o.gW())!=null)for(f=m-1,g=0;g<l;++g)for(e=f,d=0;d<k;++d,--e){o=p.a
c=o==null?a0:o.S(d,g,a0)
if(c==null)c=new A.J()
o=p.a
b=o==null?a0:o.S(e,g,a0)
if(b==null)b=new A.J()
a=c.gX()
c.sX(b.gX())
b.sX(a)}else for(f=m-1,g=0;g<l;++g)for(e=f,d=0;d<k;++d,--e){o=p.a
c=o==null?a0:o.S(d,g,a0)
if(c==null)c=new A.J()
o=p.a
b=o==null?a0:o.S(e,g,a0)
if(b==null)b=new A.J()
a=c.gq()
c.sq(b.gq())
b.sq(a)
a=c.gB()
c.sB(b.gB())
b.sB(a)
a=c.gA()
c.sA(b.gA())
b.sA(a)
a=c.gv()
c.sv(b.gv())
b.sv(a)}}return a2},
xD(a1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=null,a0=a1.gav().length
for(s=t.g,r=0;r<a0;++r){q=a1.x
if(q===$)q=a1.x=A.j([],s)
if(!(r<q.length))return A.a(q,r)
p=q[r]
o=p.a
n=o==null
m=n?a:o.a
if(m==null)m=0
l=n?a:o.b
if(l==null)l=0
k=A.aO(p)
if(k>0){o=p.a
o=o==null?a:J.I(o.gt(o))
if(o==null){o=p.a
o=o==null?a:o.gt(o)
if(o==null)o=B.d.gt(new Uint8Array(0))
o=J.I(o)}A.rm(o,0,m*l,k)
continue}o=p.a
if((o==null?a:o.gW())!=null)for(j=l-1,i=m-1,h=0;h<=j;++h,--j){g=h===j?B.a.P(m,2):m
for(f=i,e=0;e<g;++e,--f){o=p.a
d=o==null?a:o.S(e,h,a)
if(d==null)d=new A.J()
o=p.a
c=o==null?a:o.S(f,j,a)
if(c==null)c=new A.J()
b=d.gX()
d.sX(c.gX())
c.sX(b)}}else for(j=l-1,i=m-1,h=0;h<=j;++h,--j){g=h===j?B.a.P(m,2):m
for(f=i,e=0;e<g;++e,--f){o=p.a
d=o==null?a:o.S(e,h,a)
if(d==null)d=new A.J()
o=p.a
c=o==null?a:o.S(f,j,a)
if(c==null)c=new A.J()
b=d.gq()
d.sq(c.gq())
c.sq(b)
b=d.gB()
d.sB(c.gB())
c.sB(b)
b=d.gA()
d.sA(c.gA())
c.sA(b)
b=d.gv()
d.sv(c.gv())
c.sv(b)}}}return a1},
hK:function hK(a,b){this.a=a
this.b=b},
k(a){return new A.hT(a)},
hT:function hT(a){this.a=a},
v(a,b,c,d){var s=J.ab(a),r=s.gp(a)
s=c==null?s.gp(a):d+c
return new A.ar(a,d,Math.min(r,s),d,b)},
w(a,b,c){var s=a.a,r=a.d,q=J.bz(s),p=b==null?a.c:a.d+c+b
return new A.ar(s,a.b,Math.min(q,p),r+c,a.e)},
ar:function ar(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
o4(a,b,c){var s=new Int32Array(256),r=new Int32Array(0),q=new Int32Array(65536)
s=new A.ii(c,s,r,q,new Uint16Array(65536))
s.le(b)
s.mW(a)
return s},
ii:function ii(a,b,c,d,e){var _=this
_.a=$
_.b=a
_.c=16
_.d=3
_.f=_.e=$
_.r=null
_.Q=_.z=_.y=_.x=_.w=$
_.as=b
_.at=c
_.ax=d
_.ay=e
_.CW=_.ch=$},
ai(a,b){return new A.ik(a,new Uint8Array(b))},
ik:function ik(a,b){this.a=0
this.b=a
this.c=b},
l9:function l9(a,b){this.a=a
this.b=b},
iH:function iH(){},
b7:function b7(a,b){this.a=a
this.b=b},
eF(a){return new A.cg(a)},
jK:function jK(){},
cg:function cg(a){this.a=a},
xb(a){var s,r,q,p
for(s=$.t5(),r=s.length,q=0;q<r;++q){p=s[q]
if(p.a===a)return p}return null},
W(a,b,c,d,e){return new A.e6(a,b,d,"converted",e,1,null)},
bc(a,b,c,d,e,f,g){return new A.e6(a,b,d,e,g,1,f)},
a_(a,b,c,d,e,f,g){return new A.e6(a,b,d,e,g,f,null)},
bL:function bL(a,b){this.a=a
this.b=b},
e6:function e6(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.e=c
_.f=d
_.r=e
_.w=f
_.x=g},
eL(a){var s=t.cm
return A.o1(new A.c5(B.ok,t.eL.a(new A.k2(a)),s),s.n("f.E"))},
bl:function bl(a,b){this.a=a
this.b=b},
C:function C(a,b,c,d,e){var _=this
_.c=a
_.d=b
_.e=c
_.a=d
_.b=e},
k2:function k2(a){this.a=a},
y3(a){var s,r,q,p,o,n,m=a.length,l=!0
if(m>=4){if(0>=m)return A.a(a,0)
if(a[0]===255){if(1>=m)return A.a(a,1)
l=a[1]!==216}}if(l)return null
for(s=2;l=s+9,l<m;){if(!(s>=0&&s<m))return A.a(a,s)
if(a[s]!==255)return null
r=s+1
if(!(r<m))return A.a(a,r)
q=a[r]
if(q===255){s=r
continue}if(q>=192&&q<=207&&q!==196&&q!==200&&q!==204){r=s+5
if(!(r<m))return A.a(a,r)
r=a[r]
p=s+6
if(!(p<m))return A.a(a,p)
p=a[p]
o=s+7
if(!(o<m))return A.a(a,o)
o=a[o]
n=s+8
if(!(n<m))return A.a(a,n)
n=a[n]
if(!(l>=0))return A.a(a,l)
return new A.h9(a[l],(r<<8|p)>>>0,(o<<8|n)>>>0)}l=s+2
if(!(l<m))return A.a(a,l)
l=a[l]
r=s+3
if(!(r<m))return A.a(a,r)
s+=2+((l<<8|a[r])>>>0)}return null},
xj(a1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0
if(a1.length===0)throw A.e(A.aJ("A PDF needs at least one image",null))
s=A.j([],t.p5)
for(r=a1.length,q=0;q<a1.length;a1.length===r||(0,A.K)(a1),++q){p=A.y3(a1[q])
if(p==null)throw A.e(A.aJ("Not a JPEG image",null))
B.c.E(s,p)}o=new A.m7(A.j([],t.h))
n=A.j([],t.t)
m=new A.nj(o)
l=new A.nh(n,o,m)
k=new A.ni()
m.$1("%PDF-1.4\n")
l.$2(1,new A.nc(m))
r=A.j([],t.s)
for(j=0;j<s.length;++j)r.push(A.A(k.$1(j))+" 0 R")
l.$2(2,new A.nd(m,B.c.ie(r," "),s))
for(j=0;j<s.length;++j){i=s[j]
h=k.$1(j)
g=i.c
f=i.b
e=g>f?g:f
d=e>14400?14400/e:1
c=B.b.ix(g*d,2)
b=B.b.ix(f*d,2)
l.$2(h,new A.ne(m,c,b,h))
l.$2(h+1,new A.nf(m,"q "+c+" 0 0 "+b+" 0 0 cm /Im0 Do Q"))
l.$2(h+2,new A.ng(i,m,a1,j,o))}a=o.gp(0)
m.$1("xref\n0 "+(n.length+1)+"\n0000000000 65535 f \n")
for(r=n.length,q=0;a0=n.length,q<a0;n.length===r||(0,A.K)(n),++q)m.$1(B.h.dT(B.a.D(n[q]),10,"0")+" 00000 n \n")
m.$1("trailer\n<< /Size "+(a0+1)+" /Root 1 0 R >>\nstartxref\n"+a+"\n%%EOF\n")
return o.nZ()},
nj:function nj(a){this.a=a},
nh:function nh(a,b,c){this.a=a
this.b=b
this.c=c},
ni:function ni(){},
nc:function nc(a){this.a=a},
nd:function nd(a,b,c){this.a=a
this.b=b
this.c=c},
ne:function ne(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
nf:function nf(a,b){this.a=a
this.b=b},
ng:function ng(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
xk(a,b){if(!a.e.aG(0,b))return!1
if(b.c===B.ax)return!0
return B.p7.aG(0,b)&&B.p5.aG(0,a.ik(b))},
jD(a,b,c){var s=0,r=A.ek(t.g5),q,p,o,n,m,l,k,j,i,h,g,f,e
var $async$jD=A.en(function(d,a0){if(d===1)return A.eg(a0,r)
for(;;)A:switch(s){case 0:e=a.w
if(b.length<e)throw A.e(A.eF('"'+a.b+'" needs at least '+e+" files."))
e=A.j([],t.eC)
for(p=b.length,o=0;o<b.length;b.length===p||(0,A.K)(b),++o){n=b[o]
m=n.b
m=m.length<=65536?m:A.oj(m,0,65536)
e.push(A.xv(m,n.a))}for(l=0;l<b.length;++l){if(!(l<e.length)){q=A.a(e,l)
s=1
break A}if(!A.xk(a,e[l])){if(!(l<b.length)){q=A.a(b,l)
s=1
break A}throw A.e(A.eF('"'+a.b+"\" can't use "+b[l].a+"."))}}p=a.a
s=B.p0.aG(0,p)?3:4
break
case 3:s=5
return A.c8(A.jm(b,c),$async$jD)
case 5:k=a0
q=A.j([new A.d5(A.qO(a,B.c.gd5(b).a,B.P),k)],t.Q)
s=1
break
case 4:j=A.j([],t.Q)
m=t.L,l=0
case 6:if(!(l<b.length)){s=8
break}i=b[l]
if(!(l<e.length)){q=A.a(e,l)
s=1
break}h=e[l]
g=i.a.toLowerCase()
f=a.ik(B.h.eO(g,".heic")||B.h.eO(g,".heif")?B.az:h)
s=h.c===B.ax?9:11
break
case 9:i=m.a(i.b)
k=B.ei.bY(A.xq(p,new A.hh(!0).eb(i,0,null,!0),h,null))
s=10
break
case 11:s=12
return A.c8(A.jl(a,i,f,B.e8,new A.nD(c,l,b)),$async$jD)
case 12:k=a0
case 10:if(!(l<b.length)){q=A.a(b,l)
s=1
break}B.c.E(j,new A.d5(A.qO(a,b[l].a,f),k))
case 7:++l
s=6
break
case 8:c.$1(1)
q=j
s=1
break
case 1:return A.eh(q,r)}})
return A.ei($async$jD,r)},
qO(a,b,c){return A.xE(new A.n_(),c.d,b,a.f)},
xq(a,b,c,d){var s,r=A.xY(b)
if(r.length===0)throw A.e(B.eC)
A:{if("subtitle-to-srt"===a){s=A.rp(r)
break A}if("subtitle-to-vtt"===a){s=A.rq(r)
break A}if("subtitle-to-text"===a){s=A.yh(r)
break A}A.a9(B.eB)
if(c===B.aP){s=A.rq(A.ro(r,d))
break A}s=A.rp(A.ro(r,d))
break A}return s},
qH(a,b){var s,r,q,p,o,n=a.a,m=new A.cg(n+" could not be read as a picture."),l=a.b,k=A.r6(l)
if(k==null)throw A.e(m)
s=null
try{s=k.aC(l)}catch(q){throw A.e(m)}if(s==null)throw A.e(m)
if(s.gJ()*s.gI()>21e7)throw A.e(A.eF(n+" is too large to open here."))
if(b&&s.gb7()>1)throw A.e(A.eF("Animated pictures can't be changed here yet: "+n+"."))
r=null
try{k=A.r6(l)
r=k==null?null:k.bd(l,0)}catch(q){if(s.gJ()*s.gI()>5e7)throw A.e(A.eF(n+" is too large to open on this device."))
throw A.e(m)}if(r==null)throw A.e(m)
p=A.oH(r)
if(p.gM()===B.e&&!p.gaH())o=p
else o=p.n5(B.e,!0,p.gak()===2||p.gak()===4?4:3)
o.e=new A.bM(A.P(t.N,t.P))
o.siv(null)
return o},
wL(a){var s,r,q=null
if(!(a.gak()===2||a.gak()===4))return a
s=a.gJ()
r=A.Z(q,q,B.e,0,B.l,a.gI(),q,0,3,q,B.e,s,!1)
r.c=a.c
A.xC(r,A.tr(255,255,255))
return A.xm(r,a,B.dX,q,q,q,q,q,q,q,q)},
cb(a,b,c,d){var s,r,q,p,o,n,m,l,k
A:{if(B.G===b){s=A.wL(a)
r=c==null?85:c
q=new Uint8Array(64)
p=new Uint8Array(64)
o=new Float32Array(64)
n=new Float32Array(64)
m=new Int32Array(64)
l=new Int32Array(64)
q=new A.kz(q,p,o,n,m,l,new Int32Array(2048))
q.e=q.dv(B.dC,B.aX)
q.f=q.dv(B.da,B.aX)
q.r=q.dv(B.cG,B.cW)
q.w=q.dv(B.d2,B.di)
q.ld()
q.iR(r)
s=q.ng(s,B.cx)
break A}if(B.Q===b){s=new A.m0(!0,!1,c==null?80:c,4,100).bM(a,!0)
break A}if(B.X===b){s=new A.kc(10,B.c8,B.c9).bM(a,!0)
break A}if(B.ae===b){s=new A.ll().bM(a,!0)
break A}if(B.a8===b){s=new A.kj().bM(A.jo(a,256),!0)
break A}if(d){k=A.o4(a,256,10)
s=A.oK(a,B.bi,k,B.c9,1)}else s=a
s=new A.is(B.dH,6,null).bM(s,!0)
break A}return s},
jo(a,b){if((a.gJ()>a.gI()?a.gJ():a.gI())<=b)return a
return a.gJ()>=a.gI()?A.oJ(a,null,B.bA,b):A.oJ(a,b,B.bA,null)},
jl(a,b,c,d,e){var s=0,r=A.ek(t.D),q,p,o,n,m,l
var $async$jl=A.en(function(f,g){if(f===1)return A.eg(g,r)
for(;;)A:switch(s){case 0:if(c===B.P){q=A.jm(A.j([b],t.Q),e)
s=1
break}e.$1(0.05)
p=t.q
s=3
return A.c8(A.k6(B.ad,p),$async$jl)
case 3:o=A.qH(b,c===B.X||c===B.Q)
e.$1(0.4)
s=4
return A.c8(A.k6(B.ad,p),$async$jl)
case 4:if(a.x!=null){q=A.n5(a,o,c,e)
s=1
break}switch(a.a){case"fit-whatsapp-photo":q=A.cb(A.jo(o,1600),c,80,!1)
s=1
break A
case"fit-web":q=A.cb(A.jo(o,1920),c,80,!1)
s=1
break A
case"fit-instagram":n=o.gJ()
m=o.gI()
if(o.gJ()/o.gI()>0.8)n=B.b.az(o.gI()*0.8)
else m=B.b.az(o.gJ()/0.8)
q=A.cb(A.oJ(A.xt(o,m,n,B.a.P(o.gJ()-n,2),B.a.P(o.gI()-m,2)),1350,B.f2,1080),c,85,!1)
s=1
break A
case"image-resize":l=B.b.bc((o.gJ()>o.gI()?o.gJ():o.gI())/2)
q=A.cb(A.jo(o,l),c,null,!1)
s=1
break A
case"image-compress":q=A.cb(o,c,70,!0)
s=1
break A
case"image-rotate":q=A.cb(A.ju(o,90),c,null,!1)
s=1
break A
case"image-flip":q=A.cb(A.r7(A.b2(o,!1,!1),B.eT),c,null,!1)
s=1
break A
case"image-crop":throw A.e(B.eA)}q=A.cb(o,c,null,!1)
s=1
break
case 1:return A.eh(q,r)}})
return A.ei($async$jl,r)},
n5(a,b,c,d){return A.x7(a,b,c,d)},
x7(a,b,c,d){var s=0,r=A.ek(t.D),q,p,o,n,m,l,k,j,i
var $async$n5=A.en(function(e,f){if(e===1)return A.eg(f,r)
for(;;)switch(s){case 0:j={}
i=a.x
i.toString
p=c===B.G||c===B.Q
o=b.gJ()>b.gI()?b.gJ():b.gI()
j.a=null
j.b=0
n=p?40:85
m=p?95:85
s=3
return A.c8(A.jE(new A.n6(j,d,o,b,c,i),i,m,n),$async$n5)
case 3:l=f
k=j.a
if(l==null||k==null)throw A.e(A.eF('This picture could not be made small enough for "'+a.b+'".'))
q=k
s=1
break
case 1:return A.eh(q,r)}})
return A.ei($async$n5,r)},
jm(a,b){var s=0,r=A.ek(t.D),q,p,o,n
var $async$jm=A.en(function(c,d){if(c===1)return A.eg(d,r)
for(;;)switch(s){case 0:n=A.j([],t.h)
p=t.q,o=0
case 3:if(!(o<a.length)){s=4
break}s=5
return A.c8(A.k6(B.ad,p),$async$jm)
case 5:if(!(o<a.length)){q=A.a(a,o)
s=1
break}B.c.E(n,A.cb(A.qH(a[o],!1),B.G,90,!1));++o
b.$1(o/a.length)
s=3
break
case 4:q=A.xj(n)
s=1
break
case 1:return A.eh(q,r)}})
return A.ei($async$jm,r)},
d5:function d5(a,b){this.a=a
this.b=b},
nD:function nD(a,b,c){this.a=a
this.b=b
this.c=c},
n_:function n_(){},
n6:function n6(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
xY(a){var s,r,q,p,o,n,m,l,k,j,i,h
A.un(0,0,a.length,"startIndex")
s=A.yd(a,"\ufeff","",0)
s=A.nE(s,"\r\n","\n")
r=A.nE(s,"\r","\n")
q=A.j([],t.nh)
for(s=B.h.iZ(r,A.iI("\\n[ \\t]*\\n")),p=s.length,o=t.s,n=0;n<s.length;s.length===p||(0,A.K)(s),++n){m=A.j(s[n].split("\n"),o)
for(l=0;l<m.length;++l){k=$.t3().no(m[l])
if(k==null)continue
j=B.h.o2(B.c.ie(B.c.dn(m,l+1),"\n"))
i=k.b
if(1>=i.length)return A.a(i,1)
h=i[1]
h.toString
h=A.qP(h)
if(2>=i.length)return A.a(i,2)
i=i[2]
i.toString
B.c.E(q,new A.cx(h,A.qP(i),j))
break}}return q},
qP(a){var s,r,q,p,o,n=A.nE(a,",",".").split(":"),m=B.c.gcH(n).split(".")
if(1>=m.length)return A.a(m,1)
s=A.jA(B.h.nI(m[1],3,"0"))
r=n.length
q=r-2
if(!(q>=0))return A.a(n,q)
p=A.jA(n[q])
r=n.length
if(r===3){if(0>=r)return A.a(n,0)
o=A.jA(n[0])}else o=0
return new A.bA(1000*s+1e6*A.jA(m[0])+6e7*p+36e8*o)},
mP(a,b){var s=new A.mQ(),r=a.a,q=B.h.dT(B.a.D(B.a.a1(B.a.P(r,1000),1000)),3,"0")
return A.A(s.$1(B.a.P(r,36e8)))+":"+A.A(s.$1(B.a.a1(B.a.P(r,6e7),60)))+":"+A.A(s.$1(B.a.a1(B.a.P(r,1e6),60)))+b+q},
rp(a){var s,r,q
for(s=0,r="";s<a.length;){q=a[s];++s
r=r+(""+s+"\n")+(A.mP(q.a,",")+" --> "+A.mP(q.b,",")+"\n")+(q.c+"\n")+"\n"}return r.charCodeAt(0)==0?r:r},
rq(a){var s,r,q,p
for(s=a.length,r=0,q="WEBVTT\n\n";r<a.length;a.length===s||(0,A.K)(a),++r){p=a[r]
q=q+(A.mP(p.a,".")+" --> "+A.mP(p.b,".")+"\n")+(p.c+"\n")+"\n"}return q.charCodeAt(0)==0?q:q},
yh(a){var s=A.al(a)
return new A.fe(a,s.n("M(1)").a(new A.nF(A.iI("<[^>]+>"))),s.n("fe<1,M>")).nC(0)},
ro(a,b){var s,r,q,p,o,n,m=A.j([],t.nh)
for(s=a.length,r=b.a,q=0;q<a.length;a.length===s||(0,A.K)(a),++q){p=a[q]
o=p.b.a
if(B.a.am(o,r)>0){n=p.a.a
n=B.a.am(n,r)<0?B.ad:new A.bA(B.a.am(n,r))
m.push(new A.cx(n,new A.bA(B.a.am(o,r)),p.c))}}return m},
cx:function cx(a,b,c){this.a=a
this.b=b
this.c=c},
mQ:function mQ(){},
nF:function nF(a){this.a=a},
xU(){var s,r=A.jh(v.G.self),q=new A.nz()
if(typeof q=="function")A.a9(A.aJ("Attempting to rewrap a JS function.",null))
s=function(a,b){return function(c){return a(b,c,arguments.length)}}(A.w4,q)
s[$.oU()]=q
r.onmessage=s},
mS(a){return A.wo(a)},
wo(a){var s=0,r=A.ek(t.q),q=1,p=[],o,n,m,l,k,j,i,h,g,f,e,d,c
var $async$mS=A.en(function(b,a0){if(b===1){p.push(a0)
s=q}for(;;)switch(s){case 0:d=new A.mU()
q=3
o=A.j([],t.Q)
h=t.dM
g=h.a(a.files)
g=J.cd(t.lh.b(g)?g:new A.ez(g,A.al(g).n("ez<1,a0>")))
f=t.hD
while(g.C()){n=g.gN()
J.p4(o,new A.d5(A.bs(n.name),f.a(n.bytes)))}m=o
o=A.xb(A.bs(a.actionId))
o.toString
s=6
return A.c8(A.jD(o,m,new A.mT(d)),$async$mS)
case 6:l=a0
k=A.j([],t.kG)
for(o=J.cd(l);o.C();){j=o.gN()
J.p4(k,{name:j.a,bytes:j.b})}d.$1({files:h.a(k)})
q=1
s=5
break
case 3:q=2
c=p.pop()
o=A.bx(c)
if(o instanceof A.cg){i=o
d.$1({failure:i.a})}else d.$1({failure:"Something went wrong. This file could not be converted."})
s=5
break
case 2:s=1
break
case 5:return A.eh(null,r)
case 1:return A.eg(p.at(-1),r)}})
return A.ei($async$mS,r)},
nz:function nz(){},
mU:function mU(){},
mT:function mT(a){this.a=a},
rr(a){return v.mangledGlobalNames[a]},
w4(a,b,c){t.Z.a(a)
if(A.r(c)>=1)return a.$1(b)
return a.$0()},
xG(a){var s=A.xF(a.ac(a.gp(0)).a0(),1)
return s},
xF(a,b){var s=A.vR(a,b)
return s},
vR(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=b&65535,e=b>>>16,d=a.length
for(s=d,r=0;s>0;){q=s<3800?s:3800
s-=q
p=r+q
o=p-8
for(;r<=o;f=g){if(!(r>=0&&r<d))return A.a(a,r)
f+=a[r]
n=r+1
if(!(n<d))return A.a(a,n)
m=f+a[n]
n=r+2
if(!(n<d))return A.a(a,n)
l=m+a[n]
n=r+3
if(!(n<d))return A.a(a,n)
k=l+a[n]
n=r+4
if(!(n<d))return A.a(a,n)
j=k+a[n]
n=r+5
if(!(n<d))return A.a(a,n)
i=j+a[n]
n=r+6
if(!(n<d))return A.a(a,n)
h=i+a[n]
n=r+7
if(!(n<d))return A.a(a,n)
g=h+a[n]
e=e+f+m+l+k+j+i+h+g
r+=8}for(;r<p;++r){if(!(r>=0&&r<d))return A.a(a,r)
f+=a[r]
e+=f}f=B.a.a1(f,65521)
e=B.a.a1(e,65521)}return(e<<16|f)>>>0},
bK(a,b){var s,r,q,p
if(t.D.b(a)&&a.length>=32)return A.w7(a,b)
s=J.ab(a)
r=s.gp(a)
b^=4294967295
for(q=0;r>=8;){p=q+1
b=B.M[(b^s.l(a,q))&255]^b>>>8
q=p+1
b=B.M[(b^s.l(a,p))&255]^b>>>8
p=q+1
b=B.M[(b^s.l(a,q))&255]^b>>>8
q=p+1
b=B.M[(b^s.l(a,p))&255]^b>>>8
p=q+1
b=B.M[(b^s.l(a,q))&255]^b>>>8
q=p+1
b=B.M[(b^s.l(a,p))&255]^b>>>8
p=q+1
b=B.M[(b^s.l(a,q))&255]^b>>>8
q=p+1
b=B.M[(b^s.l(a,p))&255]^b>>>8
r-=8}if(r>0)do{p=q+1
b=B.M[(b^s.l(a,q))&255]^b>>>8
if(--r,r>0){q=p
continue}else break}while(!0)
return(b^4294967295)>>>0},
w3(a){var s,r,q,p,o,n,m,l=new Uint32Array(8192)
for(s=0;s<256;++s){r=a[s]
if(!(s<8192))return A.a(l,s)
l[s]=r}for(q=1;q<32;++q)for(r=(q-1)*256,p=q*256,s=0;s<256;++s){o=r+s
if(!(o>=0&&o<8192))return A.a(l,o)
n=l[o]
o=p+s
m=l[n&255]
if(!(o<8192))return A.a(l,o)
l[o]=(n>>>8^m)>>>0}return l},
w7(c8,c9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7=$.qX
if(c7==null)c7=$.qX=A.w3(B.M)
s=c8.length
r=J.p6(B.d.gt(c8),c8.byteOffset,s)
q=c9^4294967295
p=s-32
for(o=0;o<=p;){n=q^r.getUint32(o,!0)
m=r.getUint32(o+4,!0)
l=r.getUint32(o+8,!0)
k=r.getUint32(o+12,!0)
j=r.getUint32(o+16,!0)
i=r.getUint32(o+20,!0)
h=r.getUint32(o+24,!0)
g=r.getUint32(o+28,!0)
f=c7[7936+(n&255)]
e=c7[7680+(n>>>8&255)]
d=c7[7424+(n>>>16&255)]
c=7168+(n>>>24)
if(!(c<8192))return A.a(c7,c)
c=c7[c]
b=c7[6912+(m&255)]
a=c7[6656+(m>>>8&255)]
a0=c7[6400+(m>>>16&255)]
a1=6144+(m>>>24)
if(!(a1<8192))return A.a(c7,a1)
a1=c7[a1]
a2=c7[5888+(l&255)]
a3=c7[5632+(l>>>8&255)]
a4=c7[5376+(l>>>16&255)]
a5=5120+(l>>>24)
if(!(a5<8192))return A.a(c7,a5)
a5=c7[a5]
a6=c7[4864+(k&255)]
a7=c7[4608+(k>>>8&255)]
a8=c7[4352+(k>>>16&255)]
a9=4096+(k>>>24)
if(!(a9<8192))return A.a(c7,a9)
a9=c7[a9]
b0=c7[3840+(j&255)]
b1=c7[3584+(j>>>8&255)]
b2=c7[3328+(j>>>16&255)]
b3=3072+(j>>>24)
if(!(b3<8192))return A.a(c7,b3)
b3=c7[b3]
b4=c7[2816+(i&255)]
b5=c7[2560+(i>>>8&255)]
b6=c7[2304+(i>>>16&255)]
b7=2048+(i>>>24)
if(!(b7<8192))return A.a(c7,b7)
b7=c7[b7]
b8=c7[1792+(h&255)]
b9=c7[1536+(h>>>8&255)]
c0=c7[1280+(h>>>16&255)]
c1=1024+(h>>>24)
if(!(c1<8192))return A.a(c7,c1)
c1=c7[c1]
c2=c7[768+(g&255)]
c3=c7[512+(g>>>8&255)]
c4=c7[256+(g>>>16&255)]
c5=g>>>24
if(!(c5<8192))return A.a(c7,c5)
q=f^e^d^c^b^a^a0^a1^a2^a3^a4^a5^a6^a7^a8^a9^b0^b1^b2^b3^b4^b5^b6^b7^b8^b9^c0^c1^c2^c3^c4^c7[c5]
o+=32}for(;o<s;o=c6){c6=o+1
q=c7[(q^c8[o])&255]^q>>>8}return(q^4294967295)>>>0},
xm(a,b,c,d,e,f,g,h,i,j,k){var s,r,q,p,o,n,m,l
if(f==null)f=0
if(g==null)g=0
if(j==null)j=0
if(k==null)k=0
if(i==null)i=b.gJ()
if(h==null)h=b.gI()
if(e==null)e=a.gJ()<b.gJ()?a.gJ():b.gJ()
if(d==null)d=a.gI()<b.gI()?a.gI():b.gI()
s=c===B.bY
if(!s&&a.gaH())a=a.i_(a.gak())
r=h/d
q=i/e
p=t.p
o=J.aa(d,p)
for(n=0;n<d;++n)o[n]=k+B.b.h(n*r)
m=J.aa(e,p)
for(l=0;l<e;++l)m[l]=j+B.b.h(l*q)
if(s)A.we(b,a,f,g,e,d,m,o,null,B.c7)
else A.w5(b,a,f,g,e,d,m,o,c,!1,null,B.c7)
return a},
we(a5,a6,a7,a8,a9,b0,b1,b2,b3,b4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2=a6.gJ(),a3=a6.gI(),a4=A.aO(a5)
if(a4>0&&A.aO(a6)===a4&&a5.gM()===a6.gM()&&a5.gaH()===a6.gaH()&&a7>=0&&a8>=0){s=a5.a0()
r=a6.a0()
q=a5.a.gaB()
p=a6.a.gaB()
o=Math.min(a9,a2-a7)
n=s.length
m=r.$flags|0
l=b1.length
k=b2.length
j=a7*a4
i=0
for(;;){if(!(i<b0&&a8+i<a3))break
if(!(i<k))return A.a(b2,i)
h=b2[i]*q
g=(a8+i)*p+j
for(f=0;f<o;++f){if(!(f<l))return A.a(b1,f)
e=h+b1[f]*a4
for(d=0;d<a4;++d,g=c){c=g+1
b=e+d
if(!(b>=0&&b<n))return A.a(s,b)
b=s[b]
m&2&&A.b(r)
if(!(g>=0&&g<r.length))return A.a(r,g)
r[g]=b}}++i}return}for(n=b1.length,m=b2.length,a=null,i=0;i<b0;++i)for(a0=a8+i,l=a0>=a3,f=0;f<a9;++f){a1=a7+f
if(a1>=a2||l)continue
if(!(f<n))return A.a(b1,f)
k=b1[f]
if(!(i<m))return A.a(b2,i)
j=b2[i]
b=a5.a
a=b==null?null:b.S(k,j,a)
if(a==null)a=new A.J()
a6.cg(a1,a0,a)}},
w5(a,b,c,d,e,f,g,h,i,j,a0,a1){var s,r,q,p,o,n,m,l,k
for(s=g.length,r=h.length,q=null,p=0;p<f;++p)for(o=d+p,n=0;n<e;++n){if(!(n<s))return A.a(g,n)
m=g[n]
if(!(p<r))return A.a(h,p)
l=h[p]
k=a.a
q=k==null?null:k.S(m,l,q)
if(q==null)q=new A.J()
A.xy(b,c+n,o,q,i,!1,a0,a1)}},
xy(a8,a9,b0,b1,b2,b3,b4,b5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7
if(!a8.ia(a9,b0))return a8
if(b2===B.bY||a8.gaH())if(a8.ia(a9,b0)){a8.b0(a9,b0).b5(b1)
return a8}s=b1.gal()
r=b1.gah()
q=b1.gaj()
p=b1.gp(b1)<4?1:b1.ga5()
if(p===0)return a8
o=a8.b0(a9,b0)
n=o.gal()
m=o.gah()
l=o.gaj()
k=o.ga5()
switch(b2.a){case 0:return a8
case 1:break
case 2:s=Math.max(n,s)
r=Math.max(m,r)
q=Math.max(l,q)
break
case 3:s=1-(1-s)*(1-n)
r=1-(1-r)*(1-m)
q=1-(1-q)*(1-l)
break
case 4:j=p*k
i=1-k
h=1-p
g=s*i+n*h
f=r*i+m*h
e=q*i+l*h
h=B.b.L(p,0.01,1)
i=p<0
d=i?0:1
c=B.b.L(s/h*d,0,0.99)
d=B.b.L(p,0.01,1)
h=i?0:1
b=B.b.L(r/d*h,0,0.99)
h=B.b.L(p,0.01,1)
i=i?0:1
a=B.b.L(q/h*i,0,0.99)
i=n*p
h=m*p
d=l*p
a0=j<s*k+i?0:1
a1=j<r*k+h?0:1
a2=j<q*k+d?0:1
s=(j+g)*(1-a0)+(i/(1-c)+g)*a0
r=(j+f)*(1-a1)+(h/(1-b)+f)*a1
q=(j+e)*(1-a2)+(d/(1-a)+e)*a2
break
case 5:s=n+s
r=m+r
q=l+q
break
case 6:s=Math.min(n,s)
r=Math.min(m,r)
q=Math.min(l,q)
break
case 7:s=n*s
r=m*r
q=l*q
break
case 8:s=s!==0?1-(1-n)/s:0
r=r!==0?1-(1-m)/r:0
q=q!==0?1-(1-l)/q:0
break
case 9:i=1-k
h=1-p
d=s*i
a3=n*h
s=2*n<k?2*s*n+d+a3:p*k-2*(k-n)*(p-s)+d+a3
d=r*i
a3=m*h
r=2*m<k?2*r*m+d+a3:p*k-2*(k-m)*(p-r)+d+a3
i=q*i
h=l*h
q=2*l<k?2*q*l+i+h:p*k-2*(k-l)*(p-q)+i+h
break
case 10:i=k===0
if(i)s=0
else{h=n/k
s=n*(p*h+2*s*(1-h))+s*(1-k)+n*(1-p)}if(i)r=0
else{h=m/k
r=m*(p*h+2*r*(1-h))+r*(1-k)+m*(1-p)}if(i)q=0
else{i=l/k
q=l*(p*i+2*q*(1-i))+q*(1-k)+l*(1-p)}break
case 11:i=2*s
h=1-k
d=1-p
a3=s*h
a4=n*d
s=i<p?i*n+a3+a4:p*k-2*(k-n)*(p-s)+a3+a4
i=2*r
a3=r*h
a4=m*d
r=i<p?i*m+a3+a4:p*k-2*(k-m)*(p-r)+a3+a4
i=2*q
h=q*h
d=l*d
q=i<p?i*l+h+d:p*k-2*(k-l)*(p-q)+h+d
break
case 12:s=Math.abs(s-n)
r=Math.abs(r-m)
q=Math.abs(q-l)
break
case 13:s=n-s
r=m-r
q=l-q
break
case 14:s=s!==0?n/s:0
r=r!==0?m/r:0
q=q!==0?l/q:0
break}a5=1-p
a6=p+k*a5
a7=a6>0?1/a6:0
o.sal((s*p+n*k*a5)*a7)
o.sah((r*p+m*k*a5)*a7)
o.saj((q*p+l*k*a5)*a7)
o.sa5(a6)
return a8},
xC(a,b){a.b2(0,b)
return a},
hn(a){if(a.gJ()<1||a.gI()<1||a.a==null)throw A.e(A.k("Cannot encode an empty image"))},
Q(a,b){var s,r,q
try{r=a.$0()
return r}catch(q){s=A.bx(q)
if(s instanceof A.hT)throw q
throw A.e(A.k("Invalid image data: "+A.A(s)))}},
tD(a6,a7,a8,a9,b0,b1,b2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4=b2<16384,a5=a8>b0?b0:a8
for(s=1;s<=a5;)s=s<<1>>>0
s=s>>>1
r=s>>>1
q=A.j([0,0],t.t)
for(p=a6.length,o=s,s=r;s>=1;o=s,s=r){n=a7+b1*(b0-o)
m=b1*s
l=b1*o
k=a9*s
j=a9*o
for(i=(a8&s)>>>0!==0,h=a9*(a8-o),g=a7;g<=n;g+=l){f=g+h
for(e=g;e<=f;e+=j){d=e+k
c=e+m
b=c+k
if(a4){if(!(e>=0&&e<p))return A.a(a6,e)
a=a6[e]
if(!(c>=0&&c<p))return A.a(a6,c)
A.eJ(a,a6[c],q)
a0=q[0]
a1=q[1]
if(!(d>=0&&d<p))return A.a(a6,d)
a=a6[d]
if(!(b>=0&&b<p))return A.a(a6,b)
A.eJ(a,a6[b],q)
a2=q[0]
a3=q[1]
A.eJ(a0,a2,q)
a=q[0]
a6.$flags&2&&A.b(a6)
a6[e]=a
a6[d]=q[1]
A.eJ(a1,a3,q)
a=q[0]
a6.$flags&2&&A.b(a6)
a6[c]=a
a6[b]=q[1]}else{if(!(e>=0&&e<p))return A.a(a6,e)
a=a6[e]
if(!(c>=0&&c<p))return A.a(a6,c)
A.eK(a,a6[c],q)
a0=q[0]
a1=q[1]
if(!(d>=0&&d<p))return A.a(a6,d)
a=a6[d]
if(!(b>=0&&b<p))return A.a(a6,b)
A.eK(a,a6[b],q)
a2=q[0]
a3=q[1]
A.eK(a0,a2,q)
a=q[0]
a6.$flags&2&&A.b(a6)
a6[e]=a
a6[d]=q[1]
A.eK(a1,a3,q)
a=q[0]
a6.$flags&2&&A.b(a6)
a6[c]=a
a6[b]=q[1]}}if(i){c=e+m
if(a4){if(!(e>=0&&e<p))return A.a(a6,e)
a=a6[e]
if(!(c>=0&&c<p))return A.a(a6,c)
A.eJ(a,a6[c],q)
a0=q[0]
a=q[1]
a6.$flags&2&&A.b(a6)
a6[c]=a}else{if(!(e>=0&&e<p))return A.a(a6,e)
a=a6[e]
if(!(c>=0&&c<p))return A.a(a6,c)
A.eK(a,a6[c],q)
a0=q[0]
a=q[1]
a6.$flags&2&&A.b(a6)
a6[c]=a}a6.$flags&2&&A.b(a6)
if(!(e>=0&&e<p))return A.a(a6,e)
a6[e]=a0}}if((b0&s)>>>0!==0){f=g+h
for(e=g;e<=f;e+=j){d=e+k
if(a4){if(!(e>=0&&e<p))return A.a(a6,e)
i=a6[e]
if(!(d>=0&&d<p))return A.a(a6,d)
A.eJ(i,a6[d],q)
a0=q[0]
i=q[1]
a6.$flags&2&&A.b(a6)
a6[d]=i}else{if(!(e>=0&&e<p))return A.a(a6,e)
i=a6[e]
if(!(d>=0&&d<p))return A.a(a6,d)
A.eK(i,a6[d],q)
a0=q[0]
i=q[1]
a6.$flags&2&&A.b(a6)
a6[d]=i}a6.$flags&2&&A.b(a6)
if(!(e>=0&&e<p))return A.a(a6,e)
a6[e]=a0}}r=s>>>1}},
eJ(a,b,c){var s,r,q,p,o=$.ax()
o.$flags&2&&A.b(o)
o[0]=a
s=$.aH()
if(0>=s.length)return A.a(s,0)
r=s[0]
o[0]=b
q=s[0]
p=r+(q&1)+B.a.j(q,1)
B.c.i(c,0,p)
B.c.i(c,1,p-q)},
eK(a,b,c){var s=a-B.a.j(b,1)&65535
B.c.i(c,1,s)
B.c.i(c,0,b+s-32768&65535)},
r6(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=null,f=268435456,e=A.pH()
if(e.aW(a))return e
s=A.pZ(g)
if(s.aW(a))return s
r=new A.k8(f)
if(r.aW(a))return r
q=new A.lX(f)
if(q.aW(a))return q
p=new A.lh(f)
if(p.hb(A.v(a,!1,g,0),!0)!=null)return p
o=new A.kZ(f)
if(o.aW(a))return o
if(A.tC(a))return new A.jY(f)
n=A.tf(!1,g)
if(n.aW(a))return n
m=A.N(A.tY(g),g,!1,t.jv)
l=new A.kT(new A.fd(m,t.p8),f)
if(l.aW(a))return l
k=new A.lc(f)
j=A.v(a,!1,g,0)
m=k.a=new A.fJ(B.bb)
m.cd(j)
if(m.ic())return k
i=new A.kf(f)
if(i.aW(a))return i
h=new A.l5(f)
if(h.aW(a))return h
return g},
y1(b3,b4,b5,b6,b7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2
if($.ox==null){s=new Uint8Array(768)
for(r=0;r<256;++r){q=256+r
if(!(q<768))return A.a(s,q)
s[q]=r}for(r=256;r<512;++r){q=256+r
if(!(q<768))return A.a(s,q)
s[q]=255}$.ox=s}for(q=b4.length,p=b7.$flags|0,r=0;r<64;++r){o=b5+r
if(!(o<q))return A.a(b4,o)
o=b4[o]
n=b3[r]
p&2&&A.b(b7)
if(!(r<64))return A.a(b7,r)
b7[r]=o*n}for(m=0,r=0;r<8;++r,m+=8){q=1+m
if(!(q<64))return A.a(b7,q)
o=b7[q]
n=!1
if(o===0){l=2+m
if(!(l<64))return A.a(b7,l)
if(b7[l]===0){l=3+m
if(!(l<64))return A.a(b7,l)
if(b7[l]===0){l=4+m
if(!(l<64))return A.a(b7,l)
if(b7[l]===0){l=5+m
if(!(l<64))return A.a(b7,l)
if(b7[l]===0){l=6+m
if(!(l<64))return A.a(b7,l)
if(b7[l]===0){n=7+m
if(!(n<64))return A.a(b7,n)
n=b7[n]===0}}}}}}if(n){if(!(m<64))return A.a(b7,m)
q=B.a.j(5793*b7[m]+512,10)
k=(q&2147483647)-((q&2147483648)>>>0)
p&2&&A.b(b7)
if(!(m<64))return A.a(b7,m)
b7[m]=k
q=m+1
if(!(q<64))return A.a(b7,q)
b7[q]=k
q=m+2
if(!(q<64))return A.a(b7,q)
b7[q]=k
q=m+3
if(!(q<64))return A.a(b7,q)
b7[q]=k
q=m+4
if(!(q<64))return A.a(b7,q)
b7[q]=k
q=m+5
if(!(q<64))return A.a(b7,q)
b7[q]=k
q=m+6
if(!(q<64))return A.a(b7,q)
b7[q]=k
q=m+7
if(!(q<64))return A.a(b7,q)
b7[q]=k
continue}if(!(m<64))return A.a(b7,m)
n=B.a.j(5793*b7[m]+128,8)
j=(n&2147483647)-((n&2147483648)>>>0)
n=4+m
if(!(n<64))return A.a(b7,n)
l=B.a.j(5793*b7[n]+128,8)
i=(l&2147483647)-((l&2147483648)>>>0)
l=2+m
if(!(l<64))return A.a(b7,l)
h=b7[l]
g=6+m
if(!(g<64))return A.a(b7,g)
f=b7[g]
e=7+m
if(!(e<64))return A.a(b7,e)
d=b7[e]
c=B.a.j(2896*(o-d)+128,8)
b=(c&2147483647)-((c&2147483648)>>>0)
d=B.a.j(2896*(o+d)+128,8)
a=(d&2147483647)-((d&2147483648)>>>0)
d=3+m
if(!(d<64))return A.a(b7,d)
o=b7[d]<<4
a0=(o&2147483647)-((o&2147483648)>>>0)
o=5+m
if(!(o<64))return A.a(b7,o)
c=b7[o]<<4
a1=(c&2147483647)-((c&2147483648)>>>0)
c=B.a.j(j-i+1,1)
k=(c&2147483647)-((c&2147483648)>>>0)
c=B.a.j(j+i+1,1)
j=(c&2147483647)-((c&2147483648)>>>0)
c=B.a.j(h*3784+f*1567+128,8)
c=(c&2147483647)-((c&2147483648)>>>0)
a2=B.a.j(h*1567-f*3784+128,8)
h=(a2&2147483647)-((a2&2147483648)>>>0)
a2=B.a.j(b-a1+1,1)
a2=(a2&2147483647)-((a2&2147483648)>>>0)
a3=B.a.j(b+a1+1,1)
b=(a3&2147483647)-((a3&2147483648)>>>0)
a3=B.a.j(a+a0+1,1)
a3=(a3&2147483647)-((a3&2147483648)>>>0)
a4=B.a.j(a-a0+1,1)
a0=(a4&2147483647)-((a4&2147483648)>>>0)
a4=B.a.j(j-c+1,1)
a4=(a4&2147483647)-((a4&2147483648)>>>0)
c=B.a.j(j+c+1,1)
j=(c&2147483647)-((c&2147483648)>>>0)
c=B.a.j(k-h+1,1)
c=(c&2147483647)-((c&2147483648)>>>0)
a5=B.a.j(k+h+1,1)
i=(a5&2147483647)-((a5&2147483648)>>>0)
a5=B.a.j(b*2276+a3*3406+2048,12)
k=(a5&2147483647)-((a5&2147483648)>>>0)
a3=B.a.j(b*3406-a3*2276+2048,12)
b=(a3&2147483647)-((a3&2147483648)>>>0)
a3=B.a.j(a0*799+a2*4017+2048,12)
a3=(a3&2147483647)-((a3&2147483648)>>>0)
a2=B.a.j(a0*4017-a2*799+2048,12)
a0=(a2&2147483647)-((a2&2147483648)>>>0)
p&2&&A.b(b7)
if(!(m<64))return A.a(b7,m)
b7[m]=j+k
if(!(e<64))return A.a(b7,e)
b7[e]=j-k
if(!(q<64))return A.a(b7,q)
b7[q]=i+a3
if(!(g<64))return A.a(b7,g)
b7[g]=i-a3
if(!(l<64))return A.a(b7,l)
b7[l]=c+a0
if(!(o<64))return A.a(b7,o)
b7[o]=c-a0
if(!(d<64))return A.a(b7,d)
b7[d]=a4+b
if(!(n<64))return A.a(b7,n)
b7[n]=a4-b}for(r=0;r<8;++r){a6=8+r
a7=16+r
a8=24+r
a9=32+r
b0=40+r
b1=48+r
b2=56+r
q=b7[a6]
if(q===0&&b7[a7]===0&&b7[a8]===0&&b7[a9]===0&&b7[b0]===0&&b7[b1]===0&&b7[b2]===0){q=B.a.j(5793*b7[r]+8192,14)
k=(q&2147483647)-((q&2147483648)>>>0)
p&2&&A.b(b7)
if(!(r<64))return A.a(b7,r)
b7[r]=k
if(!(a6<64))return A.a(b7,a6)
b7[a6]=k
if(!(a7<64))return A.a(b7,a7)
b7[a7]=k
if(!(a8<64))return A.a(b7,a8)
b7[a8]=k
if(!(a9<64))return A.a(b7,a9)
b7[a9]=k
if(!(b0<64))return A.a(b7,b0)
b7[b0]=k
if(!(b1<64))return A.a(b7,b1)
b7[b1]=k
if(!(b2<64))return A.a(b7,b2)
b7[b2]=k
continue}o=B.a.j(5793*b7[r]+2048,12)
j=(o&2147483647)-((o&2147483648)>>>0)
o=B.a.j(5793*b7[a9]+2048,12)
i=(o&2147483647)-((o&2147483648)>>>0)
h=b7[a7]
f=b7[b1]
o=b7[b2]
n=B.a.j(2896*(q-o)+2048,12)
b=(n&2147483647)-((n&2147483648)>>>0)
o=B.a.j(2896*(q+o)+2048,12)
a=(o&2147483647)-((o&2147483648)>>>0)
a0=b7[a8]
a1=b7[b0]
o=B.a.j(j-i+1,1)
k=(o&2147483647)-((o&2147483648)>>>0)
o=B.a.j(j+i+1,1)
j=(o&2147483647)-((o&2147483648)>>>0)
o=B.a.j(h*3784+f*1567+2048,12)
q=(o&2147483647)-((o&2147483648)>>>0)
o=B.a.j(h*1567-f*3784+2048,12)
h=(o&2147483647)-((o&2147483648)>>>0)
o=B.a.j(b-a1+1,1)
o=(o&2147483647)-((o&2147483648)>>>0)
n=B.a.j(b+a1+1,1)
b=(n&2147483647)-((n&2147483648)>>>0)
n=B.a.j(a+a0+1,1)
n=(n&2147483647)-((n&2147483648)>>>0)
l=B.a.j(a-a0+1,1)
a0=(l&2147483647)-((l&2147483648)>>>0)
l=B.a.j(j-q+1,1)
l=(l&2147483647)-((l&2147483648)>>>0)
q=B.a.j(j+q+1,1)
j=(q&2147483647)-((q&2147483648)>>>0)
q=B.a.j(k-h+1,1)
q=(q&2147483647)-((q&2147483648)>>>0)
g=B.a.j(k+h+1,1)
i=(g&2147483647)-((g&2147483648)>>>0)
g=B.a.j(b*2276+n*3406+2048,12)
k=(g&2147483647)-((g&2147483648)>>>0)
n=B.a.j(b*3406-n*2276+2048,12)
b=(n&2147483647)-((n&2147483648)>>>0)
n=B.a.j(a0*799+o*4017+2048,12)
n=(n&2147483647)-((n&2147483648)>>>0)
o=B.a.j(a0*4017-o*799+2048,12)
a0=(o&2147483647)-((o&2147483648)>>>0)
p&2&&A.b(b7)
if(!(r<64))return A.a(b7,r)
b7[r]=j+k
if(!(b2<64))return A.a(b7,b2)
b7[b2]=j-k
b7[a6]=i+n
b7[b1]=i-n
b7[a7]=q+a0
b7[b0]=q-a0
b7[a8]=l+b
b7[a9]=l-b}for(q=$.ox,p=b6.$flags|0,r=0;r<64;++r){q.toString
o=B.a.j(b7[r]+8,4)
o=384+((o&2147483647)-((o&2147483648)>>>0))
if(!(o>=0&&o<768))return A.a(q,o)
o=q[o]
p&2&&A.b(b6)
if(!(r<64))return A.a(b6,r)
b6[r]=o}},
xz(a,b,c,d,a0,a1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=a1<100
if(e)a=A.y2(a,a1<=70?2+(a1/5|0):16+(a1-70)*8)
s=A.wj(a,b,c,a0)
if(s.length===1&&B.c.gd5(s)===0)r=null
else r=new Uint8Array(b*c)
for(q=s.length,p=b*c,o=null,n=0;n<s.length;s.length===q||(0,A.K)(s),++n){m=s[n]
l=A.vS(a,b,c,m,r)
k=1
j=new Uint8Array(p)
i=new A.lN(!0).nj(j,l,j,j,b,c,!0)
if(i.length>l.length){i=l
k=0}h=1+i.length
g=new Uint8Array(h)
f=e?16:0
g[0]=(k|m<<2|f)>>>0
B.d.aa(g,1,h,i)
if(o==null||h<o.length)o=g}o.toString
return o},
y2(a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6
if(a8<2||a8>256||a7.length===0)return a7
s=new Int32Array(256)
for(r=a7.length,q=255,p=0,o=0,n=0;n<r;++n){m=a7[n]
if(!(m<256))return A.a(s,m)
l=s[m]
if(l===0)++o
if(!(m<256))return A.a(s,m)
s[m]=l+1
if(m<q)q=m
if(m>p)p=m}if(o<=a8)return a7
k=new Float64Array(256)
for(l=p-q,j=a8-1,i=0;i<a8;++i){if(!(i<256))return A.a(k,i)
k[i]=q+l*i/j}h=new Int32Array(256)
g=0.0001*r
for(l=a8>2,f=1e38,e=0;e<6;++e,f=a3){d=new Float64Array(256)
c=new Float64Array(256)
for(b=q,a=0;b<=p;++b){a0=2*b
for(;;){if(a<j){if(!(a>=0&&a<256))return A.a(k,a)
a1=k[a]
a2=a+1
if(!(a2<256))return A.a(k,a2)
a2=a0>a1+k[a2]
a1=a2}else a1=!1
if(!a1)break;++a}if(!(b>=0&&b<256))return A.a(s,b)
a0=s[b]
if(a0>0){if(!(a>=0&&a<256))return A.a(d,a)
a1=d[a]
if(!(a<256))return A.a(d,a)
d[a]=a1+b*a0
a0=c[a]
a1=s[b]
if(!(a<256))return A.a(c,a)
c[a]=a0+a1}if(!(b<256))return A.a(h,b)
h[b]=a}if(l)for(i=1;i<j;++i){if(!(i<256))return A.a(c,i)
a0=c[i]
if(a0>0){a1=d[i]
if(!(i<256))return A.a(k,i)
k[i]=a1/a0}}for(b=q,a3=0;b<=p;++b){if(!(b>=0&&b<256))return A.a(h,b)
a0=h[b]
if(!(a0>=0&&a0<256))return A.a(k,a0)
a4=b-k[a0]
a3+=s[b]*a4*a4}if(f-a3<g)break}a5=new Uint8Array(256)
for(b=q;b<=p;++b){if(!(b>=0&&b<256))return A.a(h,b)
l=h[b]
if(!(l>=0&&l<256))return A.a(k,l)
l=B.b.h(k[l]+0.5)
if(!(b<256))return A.a(a5,b)
a5[b]=l}a6=new Uint8Array(r)
for(i=0;i<r;++i){l=a7[i]
if(!(l<256))return A.a(a5,l)
l=a5[l]
if(!(i<r))return A.a(a6,i)
a6[i]=l}return a6},
wj(a,b,c,d){var s
if(d===0)return B.f7
if(d===2)return B.fd
s=A.w6(a)<=16?0:A.wf(a,b,c)
if(s===0)return A.j([0],t.t)
return A.j([0,s],t.t)},
vS(a,b,c,d,e){var s
if(!(d>=0&&d<4))return A.a(B.dr,d)
s=B.dr[d]
if(s==null)return a
e.toString
s.$5(a,b,c,b,e)
return e},
w6(a){var s,r,q,p,o=new Uint8Array(256)
for(s=a.length,r=0;r<s;++r){q=a[r]
if(!(q<256))return A.a(o,q)
o[q]=1}for(p=0,r=0;r<256;++r)p+=o[r]
return p},
wf(a1,a2,a3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=J.aa(4,t.D)
for(s=0;s<4;++s)a0[s]=new Uint8Array(16)
for(r=a3-1,q=a2-1,p=a1.length,o=2;o<r;o+=2){n=o*a2
if(!(n>=0&&n<p))return A.a(a1,n)
m=a1[n]
for(l=2;l<q;l+=2){k=n+l
if(!(k<p))return A.a(a1,k)
j=a1[k]
i=k-1
h=a1[i]
k-=a2
if(!(k>=0&&k<p))return A.a(a1,k)
g=a1[k]
f=k-1
if(!(f>=0))return A.a(a1,f)
e=h+g-a1[f]
if(!((e&4294967040)>>>0===0))e=e<0?0:255
h=a0[0]
g=j-m
g=B.a.j(g<0?-g:g,4)
h.$flags&2&&A.b(h)
if(!(g<16))return A.a(h,g)
h[g]=1
g=a0[1]
i=j-a1[i]
i=B.a.j(i<0?-i:i,4)
g.$flags&2&&A.b(g)
if(!(i<16))return A.a(g,i)
g[i]=1
i=a0[2]
k=j-a1[k]
k=B.a.j(k<0?-k:k,4)
i.$flags&2&&A.b(i)
if(!(k<16))return A.a(i,k)
i[k]=1
k=a0[3]
i=j-e
i=B.a.j(i<0?-i:i,4)
k.$flags&2&&A.b(k)
if(!(i<16))return A.a(k,i)
k[i]=1
m=3*m+j+2>>>2}}for(d=0,c=2147483647,b=0;b<4;++b){for(a=0,l=0;l<16;++l)if(a0[b][l]>0)a+=l
if(a<c){c=a
d=b}}return d},
cC(a,b){return(a&65535)*b+((a>>>16)*b&65535)*65536>>>0},
xX(d1,d2,d3,d4,d5,d6,d7,d8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5=d8.a,c6=d8.b,c7=d8.c,c8=d1.b,c9=c8.length,d0=c9<=5
for(s=0;s<c9;++s){r=c8[s]
d0=d0&&r>=1&&r<c5}q=d3.length
if(q<c5||d4.length<c5||d5.length<c5||d6.length<c5||d1.a.length!==c5||d2.gii().length<=4095||!d0)throw A.e(A.aJ("optimalCover needs "+c5+" of every array",null))
p=c5+1
o=new Float64Array(p)
B.x.V(o,1,p,1/0)
n=new Uint16Array(p)
m=new Uint8Array(p)
l=d2.gii()
k=d1.a
j=new Float64Array(c9)
for(s=0;s<c9;++s){i=d2.i4(c8[s],d7)
if(!(s<c9))return A.a(j,s)
j[s]=i}h=new Int32Array(c9)
g=1+c9
for(i=l.length,f=d4.length,e=d5.length,d=d6.length,c=k.length,b=d2.a,a=b.length,a0=d2.b,a1=a0.length,a2=d2.c,a3=a2.length,a4=d2.d,a5=a4.length,a6=0;a6<c5;a6=b3){a7=o[a6]
if(!(a6<f))return A.a(d4,a6)
a8=d4[a6]
if(!(a8<a))return A.a(b,a8)
a8=b[a8]
if(!(a6<q))return A.a(d3,a6)
a9=d3[a6]
if(!(a9<a1))return A.a(a0,a9)
a9=a0[a9]
if(!(a6<e))return A.a(d5,a6)
b0=d5[a6]
if(!(b0<a3))return A.a(a2,b0)
b0=a2[b0]
if(!(a6<d))return A.a(d6,a6)
b1=d6[a6]
if(!(b1<a5))return A.a(a4,b1)
b2=a7+(a8+a9+b0+a4[b1])
b3=a6+1
if(b2<o[b3]){if(!(b3<p))return A.a(o,b3)
o[b3]=b2
if(!(b3<p))return A.a(n,b3)
n[b3]=1}for(b4=0;b4<g;++b4){if(b4===0){if(!(a6<c))return A.a(k,a6)
b5=k[a6]
b6=b5&4095
if(b6<3)continue
b7=a7+d2.i4(b5>>>12,d7)}else{s=b4-1
if(!(s>=0))return A.a(c8,s)
r=c8[s]
if(a6<r)continue
if(h[s]<=a6){a8=d4[a6]
a9=a6-r
if(!(a9>=0&&a9<f))return A.a(d4,a9)
b0=!0
if(a8===d4[a9]){a8=d3[a6]
if(!(a9<q))return A.a(d3,a9)
if(a8===d3[a9]){a8=d5[a6]
if(!(a9<e))return A.a(d5,a9)
if(a8===d5[a9]){a8=d6[a6]
if(!(a9<d))return A.a(d6,a9)
a9=a8!==d6[a9]
a8=a9}else a8=b0}else a8=b0}else a8=b0
if(a8)continue
b8=b3
for(;;){a8=!1
if(b8<c5){if(!(b8<f))return A.a(d4,b8)
a9=d4[b8]
b0=b8-r
if(!(b0>=0&&b0<f))return A.a(d4,b0)
if(a9===d4[b0]){if(!(b8<q))return A.a(d3,b8)
a9=d3[b8]
if(!(b0<q))return A.a(d3,b0)
if(a9===d3[b0]){if(!(b8<e))return A.a(d5,b8)
a9=d5[b8]
if(!(b0<e))return A.a(d5,b0)
if(a9===d5[b0]){if(!(b8<d))return A.a(d6,b8)
a8=d6[b8]
if(!(b0<d))return A.a(d6,b0)
b0=a8===d6[b0]
a8=b0}}}}if(!a8)break;++b8}if(!(s<c9))return A.a(h,s)
h[s]=b8}b9=h[s]-a6
b6=b9>4095?4095:b9
if(b6<3)continue
b7=a7+j[s]}c0=b6<16?b6:16
for(c1=3;c1<=c0;++c1){if(!(c1<i))return A.a(l,c1)
s=b7+l[c1]
a8=a6+c1
if(!(a8<p))return A.a(o,a8)
if(s<o[a8]){if(!(a8<p))return A.a(o,a8)
o[a8]=s
if(!(a8<p))return A.a(n,a8)
n[a8]=c1
if(!(a8<p))return A.a(m,a8)
m[a8]=b4}}if(b6>c0){if(!(b6<i))return A.a(l,b6)
s=b7+l[b6]
a8=a6+b6
if(!(a8<p))return A.a(o,a8)
if(s<o[a8]){if(!(a8<p))return A.a(o,a8)
o[a8]=s
if(!(a8<p))return A.a(n,a8)
n[a8]=b6
if(!(a8<p))return A.a(m,a8)
m[a8]=b4}}}}for(q=c7.$flags|0,i=c6.$flags|0,c2=c5;c2>0;c2=c3){if(!(c2<p))return A.a(n,c2)
c1=n[c2]
c3=c2-c1
i&2&&A.b(c6)
if(!(c3>=0&&c3<c6.length))return A.a(c6,c3)
c6[c3]=c1
c4=m[c2]
if(c4===0){if(!(c3<c))return A.a(k,c3)
f=k[c3]>>>12}else{f=c4-1
if(!(f>=0&&f<c9))return A.a(c8,f)
f=c8[f]}q&2&&A.b(c7)
if(!(c3<c7.length))return A.a(c7,c3)
c7[c3]=f}},
c9(a,b){return((a^b)>>>1&2139062143)+((a&b)>>>0)},
qA(a,b,c){var s,r,q,p,o=(a>>>24)+(b>>>24)-(c>>>24)
if(o<0)s=0
else s=o>255?255:o
o=(a>>>16&255)+(b>>>16&255)-(c>>>16&255)
if(o<0)r=0
else r=o>255?255:o
o=(a>>>8&255)+(b>>>8&255)-(c>>>8&255)
if(o<0)q=0
else q=o>255?255:o
o=(a&255)+(b&255)-(c&255)
if(o<0)p=0
else p=o>255?255:o
return(s<<24|r<<16|q<<8|p)>>>0},
qB(a,b,c){var s,r,q,p,o=A.c9(a,b),n=o>>>24
n+=B.a.P(n-(c>>>24),2)
if(n<0)s=0
else s=n>255?255:n
n=o>>>16&255
n+=B.a.P(n-(c>>>16&255),2)
if(n<0)r=0
else r=n>255?255:n
n=o>>>8&255
n+=B.a.P(n-(c>>>8&255),2)
if(n<0)q=0
else q=n>255?255:n
n=o&255
n+=B.a.P(n-(c&255),2)
if(n<0)p=0
else p=n>255?255:n
return(s<<24|r<<16|q<<8|p)>>>0},
n1(a,b,c){return Math.abs(b-c)-Math.abs(a-c)},
qV(a,b,c){return A.n1(a>>>24,b>>>24,c>>>24)+A.n1(a>>>16&255,b>>>16&255,c>>>16&255)+A.n1(a>>>8&255,b>>>8&255,c>>>8&255)+A.n1(a&255,b&255,c&255)<=0?a:b},
y0(a,b,c,d,e){switch(a){case 0:return 4278190080
case 1:return b
case 2:return c
case 3:return e
case 4:return d
case 5:return A.c9(A.c9(b,e),c)
case 6:return A.c9(b,d)
case 7:return A.c9(b,c)
case 8:return A.c9(d,c)
case 9:return A.c9(c,e)
case 10:return A.c9(A.c9(b,d),A.c9(c,e))
case 11:return A.qV(c,b,d)
case 12:return A.qA(b,c,d)
default:return A.qB(b,c,d)}},
y8(b5,b6,b7,b8,b9,c0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2=A.N(b8*b9,11,!1,t.p),b3=new Int32Array(14),b4=new Uint32Array(14)
for(s=b5.length,r=0;r<b9;++r)for(q=r*b8,p=r*c0,o=p+c0,n=0;n<b8;++n){m=n*c0
l=B.a.L(m+c0,0,b6)
k=B.a.L(o,0,b7)
B.t.V(b3,0,14,0)
j=p===0?1:p
i=m===0?1:m
for(h=j;h<k;++h){g=h*b6
for(f=i;f<l;++f){e=g+f
if(!(e>=0&&e<s))return A.a(b5,e)
d=b5[e]
c=e-1
if(!(c>=0))return A.a(b5,c)
c=b5[c]
b=e-b6
if(!(b>=0&&b<s))return A.a(b5,b)
a=b5[b]
a0=b-1
if(!(a0>=0))return A.a(b5,a0)
a0=b5[a0];++b
if(!(b<s))return A.a(b5,b)
b=b5[b]
a1=((c^a0)>>>1&2139062143)+((c&a0)>>>0)
a2=((a^b)>>>1&2139062143)+((a&b)>>>0)
b4[0]=4278190080
b4[1]=c
b4[2]=a
b4[3]=b
b4[4]=a0
b=((c^b)>>>1&2139062143)+((c&b)>>>0)
b4[5]=((b^a)>>>1&2139062143)+((b&a)>>>0)
b4[6]=a1
b4[7]=((c^a)>>>1&2139062143)+((c&a)>>>0)
b4[8]=((a0^a)>>>1&2139062143)+((a0&a)>>>0)
b4[9]=a2
b4[10]=((a1^a2)>>>1&2139062143)+((a1&a2)>>>0)
b4[11]=A.qV(a,c,a0)
b4[12]=A.qA(c,a,a0)
b4[13]=A.qB(c,a,a0)
for(c=d>>>8,b=d>>>16,a=d>>>24,a3=0;a3<14;++a3){a0=b3[a3]
a4=b4[a3]
a5=a-(a4>>>24)&255
a6=a5<128?a5:256-a5
a5=b-(a4>>>16)&255
a7=a5<128?a5:256-a5
a5=c-(a4>>>8)&255
a8=a5<128?a5:256-a5
a5=d-a4&255
a4=a5<128?a5:256-a5
if(!(a3<14))return A.a(b3,a3)
b3[a3]=a0+(a6+a7+a8+a4)}}}a9=b3[0]
for(b0=0,a3=1;a3<14;++a3){b1=b3[a3]
if(b1<a9){a9=b1
b0=a3}}B.c.i(b2,q+n,b0)}return b2},
xf(a1,a2,a3,a4,a5,a6,a7,a8,a9,b0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=B.a.geM(a9)-1
for(s=a1.length,r=b0.length,q=a5.$flags|0,p=a2.$flags|0,o=a3.$flags|0,n=a4.$flags|0,m=0;m<a7;++m){l=m*a6
k=B.a.a4(m,a0)*a8
for(j=m===0,i=0;i<a6;++i){h=l+i
if(j)if(i===0)g=4278190080
else{f=h-1
if(!(f>=0&&f<s))return A.a(a1,f)
g=a1[f]}else{f=h-a6
if(i===0){if(!(f>=0&&f<s))return A.a(a1,f)
g=a1[f]}else{e=k+B.a.a4(i,a0)
if(!(e>=0&&e<r))return A.a(b0,e)
e=b0[e]
d=h-1
if(!(d>=0&&d<s))return A.a(a1,d)
d=a1[d]
if(!(f>=0&&f<s))return A.a(a1,f)
c=a1[f]
b=f-1
if(!(b>=0))return A.a(a1,b)
b=a1[b];++f
if(!(f<s))return A.a(a1,f)
g=A.y0(e,d,c,b,a1[f])}}if(!(h>=0&&h<s))return A.a(a1,h)
a=a1[h]
q&2&&A.b(a5)
if(!(h<a5.length))return A.a(a5,h)
a5[h]=(a>>>24)-(g>>>24)&255
p&2&&A.b(a2)
if(!(h<a2.length))return A.a(a2,h)
a2[h]=(a>>>16)-(g>>>16)&255
o&2&&A.b(a3)
if(!(h<a3.length))return A.a(a3,h)
a3[h]=(a>>>8)-(g>>>8)&255
n&2&&A.b(a4)
if(!(h<a4.length))return A.a(a4,h)
a4[h]=a-g&255}}},
z1(a,b,c,d){var s,r,q,p,o,n,m,l,k,j=b*c,i=A.N(280,0,!1,t.p)
for(s=d.length,r=0;r<s;++r){q=d[r]
if(!(q<280))return A.a(i,q)
B.c.i(i,q,i[q]+1)}p=A.ep(i,280,15)
o=A.eq(new Int32Array(A.o(p)),280)
a.T(0,1)
A.hp(a,280,p)
a.T(1,1)
a.T(0,1)
a.T(0,1)
a.T(0,1)
a.T(1,1)
a.T(0,1)
a.T(0,1)
a.T(0,1)
a.T(1,1)
a.T(0,1)
a.T(1,1)
a.T(255,8)
a.T(1,1)
a.T(0,1)
a.T(0,1)
a.T(0,1)
for(n=o.length,m=p.length,l=0;l<j;++l){if(!(l<s))return A.a(d,l)
q=d[l]
if(!(q<n))return A.a(o,q)
k=o[q]
if(!(q<m))return A.a(p,q)
a.T(k,p[q])}},
vl(a,b,c,d,e){A.qh(a,b,c,d,0,c,!1,e)},
vm(a,b,c,d,e,f){A.qh(f,a,b,c,d,e,!0,f)},
vn(a,b,c,d,e){A.qi(a,b,c,d,0,c,!1,e)},
vo(a,b,c,d,e,f){A.qi(f,a,b,c,d,e,!0,f)},
vj(a,b,c,d,e){A.qg(a,b,c,d,0,c,!1,e)},
vk(a,b,c,d,e,f){A.qg(f,a,b,c,d,e,!0,f)},
e9(a,b,c,d,e){var s,r,q
if(e)for(s=0;s<d;++s){r=J.d(a.a,a.d+s)
q=J.d(b.a,b.d+s)
J.a2(c.a,c.d+s,r+q)}else for(s=0;s<d;++s){r=J.d(a.a,a.d+s)
q=J.d(b.a,b.d+s)
J.a2(c.a,c.d+s,r-q)}},
qh(a,b,c,d,e,f,g,h){var s,r,q=null,p=e*d,o=e+f,n=A.v(a,!1,q,p),m=A.v(h,!1,q,p),l=A.w(g?m:n,q,0)
if(e===0){m.i(0,0,J.d(n.a,n.d))
A.e9(A.w(n,q,1),l,A.w(m,q,1),b-1,g)
l.d+=d
n.d+=d
m.d+=d
e=1}for(s=-d,r=b-1;e<o;){A.e9(n,A.w(l,q,s),m,1,g)
A.e9(A.w(n,q,1),l,A.w(m,q,1),r,g);++e
l.d+=d
n.d+=d
m.d+=d}},
qi(a,b,c,d,e,f,g,h){var s=null,r=e*d,q=e+f,p=A.v(a,!1,s,r),o=A.v(h,!1,s,r),n=A.w(g?o:p,s,0)
if(e===0){o.i(0,0,J.d(p.a,p.d))
A.e9(A.w(p,s,1),n,A.w(o,s,1),b-1,g)
p.d+=d
o.d+=d
e=1}else n.d-=d
while(e<q){A.e9(p,n,o,b,g);++e
n.d+=d
p.d+=d
o.d+=d}},
qg(a,b,c,d,e,f,g,a0){var s,r,q,p,o,n,m=null,l=e*d,k=e+f,j=A.v(a,!1,m,l),i=A.v(a0,!1,m,l),h=A.w(g?i:j,m,0)
if(e===0){i.i(0,0,J.d(j.a,j.d))
A.e9(A.w(j,m,1),h,A.w(i,m,1),b-1,g)
h.d+=d
j.d+=d
i.d+=d
e=1}for(s=-d;e<k;){A.e9(j,A.w(h,m,s),i,1,g)
for(r=1;r<b;++r){q=r-d
p=J.d(h.a,h.d+(r-1))+J.d(h.a,h.d+q)-J.d(h.a,h.d+(q-1))
if((p&4294967040)>>>0===0)o=p
else o=p<0?0:255
q=J.d(j.a,j.d+r)
n=g?o:-o
J.a2(i.a,i.d+r,q+n)}++e
h.d+=d
j.d+=d
i.d+=d}},
aO(a){var s,r,q=a.a
if(q==null)return 0
s=a.gaU()*q.c
if((s&7)!==0)return 0
r=B.a.j(s,3)
return q.gaB()===a.gJ()*r?r:0},
yf(a,b,c,d){var s,r,q,p,o,n,m
for(s=a.length,r=a.$flags|0,q=0;q<d;++q){p=b+q
if(!(p>=0&&p<s))return A.a(a,p)
o=a[p]
n=c+q
if(!(n>=0&&n<s))return A.a(a,n)
m=a[n]
r&2&&A.b(a)
a[p]=m
a[n]=o}},
rm(a,b,c,d){var s,r
for(s=b+(c-1)*d,r=b;r<s;r+=d,s-=d)A.yf(a,r,s,d)},
oH(a){var s,r="ifd0"
if(!a.gbe().l(0,r).a.af(274)||a.gbe().l(0,r).gc1()===1)return A.b2(a,!1,!1)
switch(a.gbe().l(0,r).gc1()){case 2:s=A.nr(A.b2(a,!1,!1))
break
case 3:s=A.r7(A.b2(a,!1,!1),B.eU)
break
case 4:s=A.r8(A.b2(a,!1,!1))
break
case 5:s=A.nr(A.ju(a,90))
break
case 6:s=A.ju(a,90)
break
case 7:s=A.nr(A.ju(a,-90))
break
case 8:s=A.ju(a,-90)
break
default:s=A.b2(a,!1,!1)
break}s.e=A.eH(a.gbe())
s.gbe().l(0,r).sc1(null)
return s},
xt(a1,a2,a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=null
a4=B.a.h(B.a.L(a4,0,a1.gJ()-1))
a5=B.a.h(B.a.L(a5,0,a1.gI()-1))
if(a4+a3>a1.gJ())a3=a1.gJ()-a4
if(a5+a2>a1.gI())a2=a1.gI()-a5
s=a1.gav().length
for(r=t.g,q=a0,p=0;p<s;++p){o=a1.x
if(o===$)o=a1.x=A.j([],r)
if(!(p<o.length))return A.a(o,p)
n=o[p]
m=q==null
l=m?a0:q.d_()
if(l==null)l=A.eS(n,a2,!0,a3)
if(m)q=l
k=A.aO(n)
m=!1
if(k>0)if(A.aO(l)===k){m=l.a
m=m==null?a0:m.gM()
if(m==null)m=B.e
j=n.a
j=j==null?a0:j.gM()
m=m===(j==null?B.e:j)}if(m){m=n.a
i=m==null?a0:J.I(m.gt(m))
if(i==null){m=n.a
m=m==null?a0:m.gt(m)
if(m==null)m=B.d.gt(new Uint8Array(0))
i=J.I(m)}m=l.a
h=m==null?a0:J.I(m.gt(m))
if(h==null){m=l.a
m=m==null?a0:m.gt(m)
if(m==null)m=B.d.gt(new Uint8Array(0))
h=J.I(m)}g=n.a.gaB()
f=a3*k
for(m=a4*k,e=0;e<a2;e=d){d=e+1
B.d.a3(h,e*f,d*f,i,(a5+e)*g+m)}}else for(m=l.a,m=m.gF(m);m.C();){c=m.gN()
j=c.gbf()
b=c.gbg()
a=n.a
j=a==null?a0:a.S(a4+j,a5+b,a0)
c.b5(j==null?new A.J():j)}}q.toString
return q},
ju(b1,b2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9=null,b0=B.a.a1(b2,360)
b1.gaH()
if(B.a.a1(b0,90)===0)switch(B.a.P(b0,90)){case 1:return A.wZ(b1)
case 2:return A.wX(b1)
case 3:return A.wY(b1)
default:return A.b2(b1,!1,!1)}s=b0*3.141592653589793/180
r=Math.cos(s)
q=Math.sin(s)
p=b1.gJ()
o=b1.gJ()
n=b1.gI()
m=b1.gI()
l=0.5*b1.gJ()
k=0.5*b1.gI()
n=Math.abs(p*r)+Math.abs(n*q)
j=0.5*n
m=Math.abs(o*q)+Math.abs(m*r)
i=0.5*m
h=b1.gav().length
for(p=t.g,g=b1.f,f=a9,e=0;e<h;++e){d=b1.x
if(d===$)d=b1.x=A.j([],p)
if(!(e<d.length))return A.a(d,e)
c=d[e]
o=f==null
b=o?a9:f.d_()
if(b==null){a=B.b.h(n)
b=A.eS(b1,B.b.h(m),!0,a)}if(o)f=b
a0=c.f
if(a0==null)a0=g
if(a0!=null){o=b.a
if(o!=null)o.b2(0,a0)}for(o=b.a,o=o.gF(o);o.C();){a1=o.gN()
a2=a1.gbf()
a3=a1.gbg()
a=a2-j
a4=a3-i
a5=l+a*r+a4*q
a6=k-a*q+a4*r
a=!1
if(a5>=0)if(a6>=0){a4=c.a
a7=a4==null
a8=a7?a9:a4.a
if(a5<(a8==null?0:a8)){a=a7?a9:a4.b
a=a6<(a==null?0:a)}}if(a)b.cg(a2,a3,c.f0(a5,a6,B.aC))}}f.toString
return f},
wZ(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=null
for(s=a.gav(),r=s.length,q=b,p=0;p<s.length;s.length===r||(0,A.K)(s),++p){o=s[p]
n=q==null
m=n?b:q.d_()
if(m==null){l=o.a
k=l==null
j=k?b:l.b
if(j==null)j=0
l=k?b:l.a
m=A.eS(o,l==null?0:l,!0,j)}if(n)q=m
n=o.a
n=n==null?b:n.b
i=(n==null?0:n)-1
h=A.aO(o)
if(h>0&&A.aO(m)===h){n=o.a
l=n==null
k=l?b:n.a
g=-(k==null?0:k)*h
f=l?b:J.I(n.gt(n))
if(f==null){n=o.a
n=n==null?b:n.gt(n)
if(n==null)n=B.d.gt(new Uint8Array(0))
f=J.I(n)}n=m.a
e=n==null?b:J.I(n.gt(n))
if(e==null){n=m.a
n=n==null?b:n.gt(n)
if(n==null)n=B.d.gt(new Uint8Array(0))
e=J.I(n)}d=0
for(;;){n=m.a
l=n==null
k=l?b:n.b
if(!(d<(k==null?0:k)))break
k=o.a
k=k==null?b:k.a
if(k==null)k=0
j=l?b:n.a
if(j==null)j=0
n=l?b:n.a
if(n==null)n=0
A.ow(f,(i*k+d)*h,g,e,d*j*h,n,h);++d}continue}d=0
for(;;){n=m.a
n=n==null?b:n.b
if(!(d<(n==null?0:n)))break
c=0
for(;;){n=m.a
n=n==null?b:n.a
if(!(c<(n==null?0:n)))break
n=o.a
n=n==null?b:n.S(d,i-c,b)
m.cg(c,d,n==null?new A.J():n);++c}++d}}q.toString
return q},
wX(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=null
for(s=a.gav(),r=s.length,q=c,p=0;p<s.length;s.length===r||(0,A.K)(s),++p){o=s[p]
n=o.a
m=n==null
l=m?c:n.a
k=(l==null?0:l)-1
n=m?c:n.b
j=(n==null?0:n)-1
n=q==null
i=n?c:q.d_()
if(i==null)i=A.b2(o,!0,!0)
if(n)q=i
h=A.aO(o)
if(h>0&&A.aO(i)===h){n=o.a
m=n==null
l=m?c:n.a
if(l==null)l=0
g=m?c:n.b
f=l*(g==null?0:g)
n=m?c:J.I(n.gt(n))
if(n==null){n=o.a
n=n==null?c:n.gt(n)
if(n==null)n=B.d.gt(new Uint8Array(0))
n=J.I(n)}m=i.a
m=m==null?c:J.I(m.gt(m))
if(m==null){m=i.a
m=m==null?c:m.gt(m)
if(m==null)m=B.d.gt(new Uint8Array(0))
m=J.I(m)}A.ow(n,(f-1)*h,-h,m,0,f,h)
continue}e=0
for(;;){n=i.a
n=n==null?c:n.b
if(!(e<(n==null?0:n)))break
n=j-e
d=0
for(;;){m=i.a
m=m==null?c:m.a
if(!(d<(m==null?0:m)))break
m=o.a
m=m==null?c:m.S(k-d,n,c)
i.cg(d,e,m==null?new A.J():m);++d}++e}}q.toString
return q},
wY(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=null
for(s=a.gav(),r=s.length,q=b,p=0;p<s.length;s.length===r||(0,A.K)(s),++p){o=s[p]
n=a.a
n=n==null?b:n.a
m=(n==null?0:n)-1
n=q==null
l=n?b:q.d_()
if(l==null){k=o.a
j=k==null
i=j?b:k.b
if(i==null)i=0
k=j?b:k.a
l=A.eS(o,k==null?0:k,!0,i)}if(n)q=l
h=A.aO(o)
n=!1
if(h>0)if(A.aO(l)===h){n=o.a
n=n==null?b:n.a
if(n==null)n=0
k=a.a
k=k==null?b:k.a
n=n===(k==null?0:k)}if(n){n=o.a
k=n==null
j=k?b:n.a
g=(j==null?0:j)*h
f=k?b:J.I(n.gt(n))
if(f==null){n=o.a
n=n==null?b:n.gt(n)
if(n==null)n=B.d.gt(new Uint8Array(0))
f=J.I(n)}n=l.a
e=n==null?b:J.I(n.gt(n))
if(e==null){n=l.a
n=n==null?b:n.gt(n)
if(n==null)n=B.d.gt(new Uint8Array(0))
e=J.I(n)}d=0
for(;;){n=l.a
k=n==null
j=k?b:n.b
if(!(d<(j==null?0:j)))break
j=k?b:n.a
if(j==null)j=0
n=k?b:n.a
if(n==null)n=0
A.ow(f,(m-d)*h,g,e,d*j*h,n,h);++d}continue}d=0
for(;;){n=l.a
n=n==null?b:n.b
if(!(d<(n==null?0:n)))break
n=m-d
c=0
for(;;){k=l.a
k=k==null?b:k.a
if(!(c<(k==null?0:k)))break
k=o.a
k=k==null?b:k.S(n,c,b)
l.cg(c,d,k==null?new A.J():k);++c}++d}}q.toString
return q},
ow(a,b,c,d,e,f,g){var s,r,q,p,o,n
for(s=a.length,r=d.$flags|0,q=0;q<f;++q,b+=c)for(p=0;p<g;++p,e=o){o=e+1
n=b+p
if(!(n>=0&&n<s))return A.a(a,n)
n=a[n]
r&2&&A.b(d)
if(!(e>=0&&e<d.length))return A.a(d,e)
d[e]=n}},
jz(a,b){var s=A.hW(a,B.ac,null,null),r=A.py(new A.eX(s,B.aj,!1,B.bX))
try{s=r.ac(b).a0()
return s}finally{r.hY()}},
nm(a){var s
a=(a&-a)>>>0
s=a!==0?31:32
if((a&65535)!==0)s-=16
if((a&16711935)!==0)s-=8
if((a&252645135)!==0)s-=4
if((a&858993459)!==0)s-=2
return(a&1431655765)!==0?s-1:s},
yk(a){var s
$.p0().i(0,0,a)
s=$.rR()
if(0>=s.length)return A.a(s,0)
return s[0]},
rn(a,b,c,d){return(B.a.L(a,0,255)|B.a.L(b,0,255)<<8|B.a.L(c,0,255)<<16|B.a.L(d,0,255)<<24)>>>0},
bt(a,b,c){var s,r,q,p,o,n=b.gp(b),m=b.gM(),l=a.gW(),k=l==null?null:l.gM()
if(k==null)k=a.gM()
s=a.gp(a)
if(n===1)b.i(0,0,A.er(B.b.bu(a.gp(a)>2?a.gap():a.l(0,0)),k,m))
else if(n===2){r=s>2?a.gap():a.l(0,0)
b.i(0,0,A.er(!B.p1.aG(0,k)?B.b.bu(r):r,k,m))
b.i(0,1,A.er(s===2?a.l(0,1):a.gv(),k,m))}else if(n<=s)for(q=0;q<n;++q)b.i(0,q,A.er(a.l(0,q),k,m))
else if(s===2){p=A.er(a.l(0,0),k,m)
if(n===3){b.i(0,0,p)
b.i(0,1,p)
b.i(0,2,p)}else{c=A.er(a.l(0,1),k,m)
b.i(0,0,p)
b.i(0,1,p)
b.i(0,2,p)
b.i(0,3,c)}}else{for(q=0;q<s;++q)b.i(0,q,A.er(a.l(0,q),k,m))
o=s===1?b.l(0,0):0
for(q=s;q<n;++q)b.i(0,q,q===3?c:o)}return b},
aP(a,b,c,d,e){var s,r,q=a.gW(),p=q==null?null:q.gM()
if(p==null)p=a.gM()
q=e==null
s=q?null:e.gM()
c=s==null?c:s
if(c==null)c=a.gM()
s=q?null:e.gp(e)
d=s==null?d:s
if(d==null)d=a.gp(a)
if(b==null)b=0
if(c===p&&d===a.gp(a)){if(q)return a.R()
e.b5(a)
return e}switch(c.a){case 3:if(q)r=new A.bi(new Uint8Array(d))
else r=e
return A.bt(a,r,b)
case 0:return A.bt(a,q?new A.dA(d,0):e,b)
case 1:return A.bt(a,q?new A.dC(d,0):e,b)
case 2:if(q){q=d<3?1:2
r=new A.dE(d,new Uint8Array(q))}else r=e
return A.bt(a,r,b)
case 4:if(q)r=new A.dB(new Uint16Array(d))
else r=e
return A.bt(a,r,b)
case 5:if(q)r=new A.dD(new Uint32Array(d))
else r=e
return A.bt(a,r,b)
case 6:if(q)r=new A.dy(new Int8Array(d))
else r=e
return A.bt(a,r,b)
case 7:if(q)r=new A.dw(new Int16Array(d))
else r=e
return A.bt(a,r,b)
case 8:if(q)r=new A.dx(new Int32Array(d))
else r=e
return A.bt(a,r,b)
case 9:if(q)r=new A.dt(new Uint16Array(d))
else r=e
return A.bt(a,r,b)
case 10:if(q)r=new A.du(new Float32Array(d))
else r=e
return A.bt(a,r,b)
case 11:if(q)r=new A.dv(new Float64Array(d))
else r=e
return A.bt(a,r,b)}},
a4(a){return 0.299*a.gq()+0.587*a.gB()+0.114*a.gA()},
r3(a,b,c,d,e){var s=1-d/255
B.c.i(e,0,B.b.az(255*(1-a/255)*s))
B.c.i(e,1,B.b.az(255*(1-b/255)*s))
B.c.i(e,2,B.b.az(255*(1-c/255)*s))},
R(a){var s,r,q,p=$.p_()
p.$flags&2&&A.b(p)
p[0]=a
p=$.rQ()
if(0>=p.length)return A.a(p,0)
s=p[0]
if(a===0)return s>>>16
if($.O==null)A.T()
r=s>>>23&511
p=$.pl.cV()
if(!(r<p.length))return A.a(p,r)
r=p[r]
if(r!==0){q=s&8388607
return r+(q+4095+(q>>>13&1)>>>13)}return A.tE(s)},
tE(a){var s,r,q=a>>>16&32768,p=(a>>>23&255)-112,o=a&8388607
if(p<=0){if(p<-10)return q
o|=8388608
s=14-p
return(q|B.a.aM(o+(B.a.U(1,s-1)-1)+(B.a.a4(o,s)&1),s))>>>0}else if(p===143)if(o===0)return q|31744
else{o=o>>>13
r=o===0?1:0
return q|o|r|31744}else{o=o+4095+(o>>>13&1)
if((o&8388608)!==0){++p
o=0}if(p>30)return q|31744
return(q|p<<10|o>>>13)>>>0}},
T(){var s,r,q,p,o,n=$.O
if(n!=null)return n
s=new Uint32Array(65536)
$.O=J.p7(B.q.gt(s),0,null)
n=new Uint16Array(512)
$.pl.b=n
for(r=0;r<256;++r){q=(r&255)-112
if(q<=0||q>=30){n[r]=0
p=(r|256)>>>0
if(!(p<512))return A.a(n,p)
n[p]=0}else{p=q<<10>>>0
n[r]=p
o=(r|256)>>>0
if(!(o<512))return A.a(n,o)
n[o]=(p|32768)>>>0}}for(r=0;r<65536;++r)s[r]=A.tF(r)
n=$.O
n.toString
return n},
tF(a){var s,r=a>>>15&1,q=a>>>10&31,p=a&1023
if(q===0)if(p===0)return r<<31>>>0
else{while((p&1024)===0){p=p<<1;--q}++q
p&=4294966271}else if(q===31){s=r<<31
if(p===0)return(s|2139095040)>>>0
else return(s|p<<13|2139095040)>>>0}return(r<<31|q+112<<23|p<<13)>>>0},
xv(a,b){var s,r
if(a.length===0)return B.bk
s=A.wh(b)
r=A.w9(a,s)
return r==null?A.wb(a,s):r},
w9(a,b){var s
if(A.aF(a,B.bK))return B.a7
if(A.aF(a,B.fE))return B.G
if(A.aM(a,0,6)==="GIF87a"||A.aM(a,0,6)==="GIF89a")return B.X
if(A.aM(a,0,4)==="RIFF")switch(A.aM(a,8,12)){case"WEBP":return B.Q
case"WAVE":return B.bq
case"AVI ":return B.ce}s=a.length
if(s>=12&&A.aM(a,4,8)==="ftyp")return A.wa(a,b)
if(A.wv(a))return B.aM
if(A.aF(a,B.hF)||A.aF(a,B.hG))return B.ae
if(A.wx(a))return B.a8
if(A.aM(a,0,5)==="%PDF-")return B.P
if(A.aF(a,B.fF))return A.ej(a,"webm")>=0?B.br:B.ck
if(A.aM(a,0,4)==="OggS")return A.ej(a,"OpusHead")>=0?B.bu:B.cg
if(A.aM(a,0,4)==="fLaC")return B.bj
if(A.aM(a,0,3)==="ID3")return B.ay
if(A.aF(a,B.cE)||A.aF(a,B.cD))return null
if(s>=4&&a[0]===255&&(a[1]&246)===240)return B.cm
if(A.wB(a))return B.ay
if(A.aF(a,B.hO)||A.aF(a,B.hP))return A.wc(a,b)
if(A.aF(a,B.mV))return B.bo
if(A.aF(a,B.iK))return B.ci
if(A.aF(a,B.fN))return B.cl
if(A.aM(a,257,262)==="ustar")return B.cn
return null},
wa(a,b){var s,r,q,p,o,n,m=A.aM(a,8,12),l=a.length
if(0>=l)return A.a(a,0)
s=a[0]
if(1>=l)return A.a(a,1)
r=a[1]
if(2>=l)return A.a(a,2)
q=a[2]
if(3>=l)return A.a(a,3)
p=(s<<24|r<<16|q<<8|a[3])>>>0
if(p<l)l=p
s=A.j([],t.s)
for(o=16;n=o+4,n<=l;o=n)s.push(A.aM(a,o,n))
if(B.p6.aG(0,m))return B.az
if(m==="avif"||m==="avis")return B.aO
if(m==="mif1"||m==="msf1")return B.c.aG(s,"avif")?B.aO:B.az
if(m==="qt  ")return B.bs
if(B.p2.aG(0,m))return B.a6
if(B.h.ci(m,"3gp")||B.h.ci(m,"3g2"))return B.ch
if(B.c.aG(s,"M4A "))return B.a6
return b==="m4a"?B.a6:B.aN},
wc(a,b){var s
if(A.aM(a,30,38)==="mimetype")if(A.aM(a,38,77)==="application/vnd.oasis.opendocument.text")return B.cj
if(!(A.ej(a,"[Content_Types].xml")>=0||A.ej(a,"_rels/.rels")>=0))return B.aB
if(A.ej(a,"word/")>=0)return B.aA
if(A.ej(a,"ppt/")>=0)return B.bp
if(A.ej(a,"xl/")>=0)return B.bv
A:{if("docx"===b){s=B.aA
break A}if("pptx"===b){s=B.bp
break A}if("xlsx"===b){s=B.bv
break A}s=B.aB
break A}return s},
wb(a,b){var s,r,q,p=A.w8(a)
if(p==null)return B.bk
s=B.h.o1(p)
r=s.toLowerCase()
if(B.h.ci(r,"<")&&B.h.aG(r,"<svg"))return B.bn
if(B.h.ci(r,"<!doctype html")||B.h.ci(r,"<html"))return B.aQ
q=A.iI("^WEBVTT(\\s|$)")
if(q.b.test(s))return B.aP
q=A.iI("^\\d+[ \\t]*\\r?\\n\\d{1,2}:\\d{2}:\\d{2},\\d{1,3}[ \\t]*-->")
if(q.b.test(s))return B.bt
if(b==="md"||b==="markdown")return B.aR
return B.bl},
w8(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=null
if(A.aF(a,B.cE)||A.aF(a,B.cD)){s=a.length
if(0>=s)return A.a(a,0)
r=a[0]===255
q=A.j([],t.t)
for(p=2;o=p+1,o<s;p+=2){if(r){if(!(p<s))return A.a(a,p)
o=(a[p]|a[o]<<8)>>>0}else{if(!(p<s))return A.a(a,p)
o=(a[p]<<8|a[o])>>>0}q.push(o)}return A.d8(q,0,g)}n=A.aF(a,B.fD)?3:0
s=a.length
m=B.d.bJ(a,n,s<8192?s:8192)
for(s=m.length,l=0,k=0;k<s;++k){j=m[k]
if(j===0)return g
i=j>=9&&j<=13
if(j<32&&!i&&j!==27)++l}if(l*100>s)return g
h=B.bh.eN(m,!0)
if(B.h.eK("\ufffd",h).gp(0)*3>h.length)return g
return B.bh.eN(B.d.dn(a,n),!0)},
wv(a){var s,r,q,p=a.length
if(p<18||A.aM(a,0,2)!=="BM")return!1
if(14>=p)return A.a(a,14)
s=a[14]
if(15>=p)return A.a(a,15)
r=a[15]
if(16>=p)return A.a(a,16)
q=a[16]
if(17>=p)return A.a(a,17)
return B.p4.aG(0,(s|r<<8|q<<16|a[17]<<24)>>>0)},
wx(a){var s,r=a.length
if(r<22||!A.aF(a,B.fc))return!1
if(4>=r)return A.a(a,4)
s=a[4]
if(5>=r)return A.a(a,5)
if((s|a[5]<<8)>>>0>0){if(9>=r)return A.a(a,9)
r=a[9]===0}else r=!1
return r},
wB(a){var s=a.length,r=!0
if(s>=4){if(0>=s)return A.a(a,0)
if(a[0]===255){if(1>=s)return A.a(a,1)
r=(a[1]&224)!==224}}if(r)return!1
if(1>=s)return A.a(a,1)
r=a[1]
if(2>=s)return A.a(a,2)
s=a[2]
return(r>>>3&3)!==1&&(r>>>1&3)!==0&&s>>>4!==15&&(s>>>2&3)!==3},
wh(a){var s=B.h.ih(a,".")
return s<0?"":B.h.dr(a,s+1).toLowerCase()},
aF(a,b){var s,r=b.length
if(a.length<r)return!1
for(s=0;s<r;++s)if(a[s]!==b[s])return!1
return!0},
aM(a,b,c){if(a.length<c)return""
return A.d8(B.d.bJ(a,b,c),0,null)},
ej(a,b){var s,r,q,p,o,n
for(s=b.length,r=a.length,q=0;q+s<=r;++q){o=0
for(;;){if(!(o<s)){p=!0
break}n=q+o
if(!(n<r))return A.a(a,n)
if(a[n]!==b.charCodeAt(o)){p=!1
break}++o}if(p)return q}return-1},
y9(a){var s,r
if(B.h.eO(a.toLowerCase(),".tar.gz")&&a.length>7)return new A.dl("tar.gz",B.h.cr(a,0,a.length-7))
s=B.h.ih(a,".")
if(s<=0||s===a.length-1)return new A.dl("",a)
r=B.h.cr(a,0,s)
return new A.dl(B.h.dr(a,s+1),r)},
xE(a,b,c,d){var s,r,q=A.y9(c),p=b.length===0?"":"."+b
q=q.b+" ("+d
s=q+")"+p
for(q+=" ",r=2;a.$1(s);++r)s=q+r+")"+p
return s},
jE(a,b,c,d){var s=0,r=A.ek(t.bO),q,p,o,n,m,l,k,j
var $async$jE=A.en(function(e,f){if(e===1)return A.eg(f,r)
for(;;)switch(s){case 0:p=1
case 3:if(!(p>=0.1)){s=5
break}s=6
return A.c8(a.$2(d,p),$async$jE)
case 6:o=f
if(o>b){s=4
break}n=new A.ed(o,d,p)
m=d+1
l=c
case 7:if(!(m<=l)){s=8
break}k=B.a.P(m+l,2)
s=9
return A.c8(a.$2(k,p),$async$jE)
case 9:j=f
if(j<=b){n=new A.ed(j,k,p)
m=k+1}else l=k-1
s=7
break
case 8:q=n
s=1
break
case 4:p*=0.9
s=3
break
case 5:q=null
s=1
break
case 1:return A.eh(q,r)}})
return A.ei($async$jE,r)}},B={}
var w=[A,J,B]
var $={}
A.nY.prototype={}
J.hX.prototype={
a_(a,b){return a===b},
gK(a){return A.fz(a)},
D(a){return"Instance of '"+A.iv(a)+"'"},
gaX(a){return A.dn(A.oz(this))}}
J.f6.prototype={
D(a){return String(a)},
iM(a,b){return b||a},
gK(a){return a?519018:218159},
gaX(a){return A.dn(t.y)},
$iU:1,
$iah:1}
J.f8.prototype={
a_(a,b){return null==b},
D(a){return"null"},
gK(a){return 0},
$iU:1}
J.f9.prototype={$ia0:1}
J.cq.prototype={
gK(a){return 0},
D(a){return String(a)}}
J.ir.prototype={}
J.dc.prototype={}
J.bS.prototype={
D(a){var s=a[$.rt()]
if(s==null)s=a[$.oU()]
if(s==null)return this.j_(a)
return"JavaScript function for "+J.ev(s)},
$icK:1}
J.dU.prototype={
gK(a){return 0},
D(a){return String(a)}}
J.dV.prototype={
gK(a){return 0},
D(a){return String(a)}}
J.p.prototype={
E(a,b){A.al(a).c.a(b)
a.$flags&1&&A.b(a,29)
a.push(b)},
is(a,b){var s
a.$flags&1&&A.b(a,"removeAt",1)
s=a.length
if(b>=s)throw A.e(A.of(b,null))
return a.splice(b,1)[0]},
nv(a,b,c){var s
A.al(a).c.a(c)
a.$flags&1&&A.b(a,"insert",2)
s=a.length
if(b>s)throw A.e(A.of(b,null))
a.splice(b,0,c)},
cE(a,b){var s
A.al(a).n("f<1>").a(b)
a.$flags&1&&A.b(a,"addAll",2)
if(Array.isArray(b)){this.jr(a,b)
return}for(s=J.cd(b);s.C();)a.push(s.gN())},
jr(a,b){var s,r
t.dG.a(b)
s=b.length
if(s===0)return
if(a===b)throw A.e(A.b_(a))
for(r=0;r<s;++r)a.push(b[r])},
ca(a){a.$flags&1&&A.b(a,"clear","clear")
a.length=0},
ie(a,b){var s,r=A.N(a.length,"",!1,t.N)
for(s=0;s<a.length;++s)this.i(r,s,A.A(a[s]))
return r.join(b)},
iu(a,b){return A.d9(a,0,A.js(b,"count",t.p),A.al(a).c)},
br(a,b){return A.d9(a,b,null,A.al(a).c)},
bm(a,b){if(!(b>=0&&b<a.length))return A.a(a,b)
return a[b]},
bJ(a,b,c){if(b<0||b>a.length)throw A.e(A.a7(b,0,a.length,"start",null))
if(c==null)c=a.length
else if(c<b||c>a.length)throw A.e(A.a7(c,b,a.length,"end",null))
if(b===c)return A.j([],A.al(a))
return A.j(a.slice(b,c),A.al(a))},
dn(a,b){return this.bJ(a,b,null)},
dj(a,b,c){A.b6(b,c,a.length)
return A.d9(a,b,c,A.al(a).c)},
gd5(a){if(a.length>0)return a[0]
throw A.e(A.f5())},
gcH(a){var s=a.length
if(s>0)return a[s-1]
throw A.e(A.f5())},
a3(a,b,c,d,e){var s,r,q,p,o
A.al(a).n("f<1>").a(d)
a.$flags&2&&A.b(a,5)
A.b6(b,c,a.length)
s=c-b
if(s===0)return
A.aV(e,"skipCount")
if(t.j.b(d)){r=d
q=e}else{r=J.jJ(d,e).dV(0,!1)
q=0}p=J.ab(r)
if(q+s>p.gp(r))throw A.e(A.pB())
if(q<b)for(o=s-1;o>=0;--o)a[b+o]=p.l(r,q+o)
else for(o=0;o<s;++o)a[b+o]=p.l(r,q+o)},
V(a,b,c,d){var s
A.al(a).n("1?").a(d)
a.$flags&2&&A.b(a,"fillRange")
A.b6(b,c,a.length)
for(s=b;s<c;++s)a[s]=d},
nk(a,b){var s,r
A.al(a).n("ah(1)").a(b)
s=a.length
for(r=0;r<s;++r){if(!b.$1(a[r]))return!1
if(a.length!==s)throw A.e(A.b_(a))}return!0},
f7(a,b){var s,r,q,p,o,n=A.al(a)
n.n("h(1,1)?").a(b)
a.$flags&2&&A.b(a,"sort")
s=a.length
if(s<2)return
if(b==null)b=J.wt()
if(s===2){r=a[0]
q=a[1]
n=b.$2(r,q)
if(typeof n!=="number")return n.iL()
if(n>0){a[0]=q
a[1]=r}return}p=0
if(n.c.b(null))for(o=0;o<a.length;++o)if(a[o]===void 0){a[o]=null;++p}a.sort(A.jt(b,2))
if(p>0)this.mj(a,p)},
f6(a){return this.f7(a,null)},
mj(a,b){var s,r=a.length
for(;s=r-1,r>0;r=s)if(a[s]===null){a[s]=void 0;--b
if(b===0)break}},
aG(a,b){var s
for(s=0;s<a.length;++s)if(J.bf(a[s],b))return!0
return!1},
D(a){return A.kr(a,"[","]")},
gF(a){return new J.ew(a,a.length,A.al(a).n("ew<1>"))},
gK(a){return A.fz(a)},
gp(a){return a.length},
sp(a,b){a.$flags&1&&A.b(a,"set length","change the length of")
if(b<0)throw A.e(A.a7(b,0,null,"newLength",null))
if(b>a.length)A.al(a).c.a(null)
a.length=b},
l(a,b){if(!(b>=0&&b<a.length))throw A.e(A.nn(a,b))
return a[b]},
i(a,b,c){A.al(a).c.a(c)
a.$flags&2&&A.b(a)
if(!(b>=0&&b<a.length))throw A.e(A.nn(a,b))
a[b]=c},
$ias:1,
$ix:1,
$if:1,
$iq:1}
J.i7.prototype={
o3(a){var s,r,q
if(!Array.isArray(a))return null
s=a.$flags|0
if((s&4)!==0)r="const, "
else if((s&2)!==0)r="unmodifiable, "
else r=(s&1)!==0?"fixed, ":""
q="Instance of '"+A.iv(a)+"'"
if(r==="")return q
return q+" ("+r+"length: "+a.length+")"}}
J.ks.prototype={}
J.ew.prototype={
gN(){var s=this.d
return s==null?this.$ti.c.a(s):s},
C(){var s,r=this,q=r.a,p=q.length
if(r.b!==p){q=A.K(q)
throw A.e(q)}s=r.c
if(s>=p){r.d=null
return!1}r.d=q[s]
r.c=s+1
return!0},
$iz:1}
J.dS.prototype={
cb(a,b){var s
A.ov(b)
if(a<b)return-1
else if(a>b)return 1
else if(a===b){if(a===0){s=this.gdR(b)
if(this.gdR(a)===s)return 0
if(this.gdR(a))return-1
return 1}return 0}else if(isNaN(a)){if(isNaN(b))return 0
return 1}else return-1},
gdR(a){return a===0?1/a<0:a<0},
h(a){var s
if(a>=-2147483648&&a<=2147483647)return a|0
if(isFinite(a)){s=a<0?Math.ceil(a):Math.floor(a)
return s+0}throw A.e(A.br(""+a+".toInt()"))},
bc(a){var s,r
if(a>=0){if(a<=2147483647){s=a|0
return a===s?s:s+1}}else if(a>=-2147483648)return a|0
r=Math.ceil(a)
if(isFinite(r))return r
throw A.e(A.br(""+a+".ceil()"))},
bu(a){var s,r
if(a>=0){if(a<=2147483647)return a|0}else if(a>=-2147483648){s=a|0
return a===s?s:s-1}r=Math.floor(a)
if(isFinite(r))return r
throw A.e(A.br(""+a+".floor()"))},
az(a){if(a>0){if(a!==1/0)return Math.round(a)}else if(a>-1/0)return 0-Math.round(0-a)
throw A.e(A.br(""+a+".round()"))},
L(a,b,c){if(this.cb(b,c)>0)throw A.e(A.cc(b))
if(this.cb(a,b)<0)return b
if(this.cb(a,c)>0)return c
return a},
ix(a,b){var s
if(b>20)throw A.e(A.a7(b,0,20,"fractionDigits",null))
s=a.toFixed(b)
if(a===0&&this.gdR(a))return"-"+s
return s},
dW(a,b){var s,r,q,p,o
if(b<2||b>36)throw A.e(A.a7(b,2,36,"radix",null))
s=a.toString(b)
r=s.length
q=r-1
if(!(q>=0))return A.a(s,q)
if(s.charCodeAt(q)!==41)return s
p=/^([\da-z]+)(?:\.([\da-z]+))?\(e\+(\d+)\)$/.exec(s)
if(p==null)A.a9(A.br("Unexpected toString result: "+s))
r=p.length
if(1>=r)return A.a(p,1)
s=p[1]
if(3>=r)return A.a(p,3)
o=+p[3]
r=p[2]
if(r!=null){s+=r
o-=r.length}return s+B.h.cL("0",o)},
D(a){if(a===0&&1/a<0)return"-0.0"
else return""+a},
gK(a){var s,r,q,p,o=a|0
if(a===o)return o&536870911
s=Math.abs(a)
r=Math.log(s)/0.6931471805599453|0
q=Math.pow(2,r)
p=s<1?s/q:q/s
return((p*9007199254740992|0)+(p*3542243181176521|0))*599197+r*1259&536870911},
am(a,b){return a+b},
a1(a,b){var s=a%b
if(s===0)return 0
if(s>0)return s
if(b<0)return s-b
else return s+b},
Z(a,b){A.ov(b)
if((a|0)===a)if(b>=1||b<-1)return a/b|0
return this.hp(a,b)},
P(a,b){return(a|0)===a?a/b|0:this.hp(a,b)},
hp(a,b){var s=a/b
if(s>=-2147483648&&s<=2147483647)return s|0
if(s>0){if(s!==1/0)return Math.floor(s)}else if(s>-1/0)return Math.ceil(s)
throw A.e(A.br("Result of truncating division is "+A.A(s)+": "+A.A(a)+" ~/ "+b))},
U(a,b){if(b<0)throw A.e(A.cc(b))
return b>31?0:a<<b>>>0},
O(a,b){return b>31?0:a<<b>>>0},
aM(a,b){var s
if(b<0)throw A.e(A.cc(b))
if(a>0)s=this.a6(a,b)
else{s=b>31?31:b
s=a>>s>>>0}return s},
j(a,b){var s
if(a>0)s=this.a6(a,b)
else{s=b>31?31:b
s=a>>s>>>0}return s},
a4(a,b){if(0>b)throw A.e(A.cc(b))
return this.a6(a,b)},
a6(a,b){return b>31?0:a>>>b},
iW(a,b){if(b<0)throw A.e(A.cc(b))
return this.ms(a,b)},
ms(a,b){if(b>31)return 0
return a>>>b},
gaX(a){return A.dn(t.X)},
$ibj:1,
$iD:1,
$il:1}
J.f7.prototype={
Y(a,b){var s=this.U(1,b-1)
return((a&s-1)>>>0)-((a&s)>>>0)},
geM(a){var s,r=a<0?-a-1:a,q=r
for(s=32;q>=4294967296;){q=this.P(q,4294967296)
s+=32}return s-Math.clz32(q)},
gaX(a){return A.dn(t.p)},
$iU:1,
$ih:1}
J.i8.prototype={
gaX(a){return A.dn(t.V)},
$iU:1}
J.co.prototype={
eL(a,b,c){var s=b.length
if(c>s)throw A.e(A.a7(c,0,s,null,null))
return new A.jc(b,a,c)},
eK(a,b){return this.eL(a,b,0)},
eO(a,b){var s=b.length,r=a.length
if(s>r)return!1
return b===this.dr(a,r-s)},
iZ(a,b){var s
if(typeof b=="string")return A.j(a.split(b),t.s)
else{if(b instanceof A.dT){s=b.e
s=!(s==null?b.e=b.jS():s)}else s=!1
if(s)return A.j(a.split(b.b),t.s)
else return this.kw(a,b)}},
kw(a,b){var s,r,q,p,o,n,m=A.j([],t.s)
for(s=J.p5(b,a),s=s.gF(s),r=0,q=1;s.C();){p=s.gN()
o=p.ge1()
n=p.gdP()
q=n-o
if(q===0&&r===o)continue
B.c.E(m,this.cr(a,r,o))
r=n}if(r<a.length||q>0)B.c.E(m,this.dr(a,r))
return m},
ci(a,b){var s=b.length
if(s>a.length)return!1
return b===a.substring(0,s)},
cr(a,b,c){return a.substring(b,A.b6(b,c,a.length))},
dr(a,b){return this.cr(a,b,null)},
iA(a){var s,r,q,p=a.trim(),o=p.length
if(o===0)return p
if(0>=o)return A.a(p,0)
if(p.charCodeAt(0)===133){s=J.pE(p,1)
if(s===o)return""}else s=0
r=o-1
if(!(r>=0))return A.a(p,r)
q=p.charCodeAt(r)===133?J.pF(p,r):o
if(s===0&&q===o)return p
return p.substring(s,q)},
o1(a){var s=a.trimStart(),r=s.length
if(r===0)return s
if(0>=r)return A.a(s,0)
if(s.charCodeAt(0)!==133)return s
return s.substring(J.pE(s,1))},
o2(a){var s,r=a.trimEnd(),q=r.length
if(q===0)return r
s=q-1
if(!(s>=0))return A.a(r,s)
if(r.charCodeAt(s)!==133)return r
return r.substring(0,J.pF(r,s))},
cL(a,b){var s,r
if(0>=b)return""
if(b===1||a.length===0)return a
if(b!==b>>>0)throw A.e(B.eh)
for(s=a,r="";;){if((b&1)===1)r=s+r
b=b>>>1
if(b===0)break
s+=s}return r},
dT(a,b,c){var s=b-a.length
if(s<=0)return a
return this.cL(c,s)+a},
nI(a,b,c){var s=b-a.length
if(s<=0)return a
return a+this.cL(c,s)},
ih(a,b){var s=a.length,r=b.length
if(s+r>s)s-=r
return a.lastIndexOf(b,s)},
aG(a,b){return A.ya(a,b,0)},
cb(a,b){var s
A.bs(b)
if(a===b)s=0
else s=a<b?-1:1
return s},
D(a){return a},
gK(a){var s,r,q
for(s=a.length,r=0,q=0;q<s;++q){r=r+a.charCodeAt(q)&536870911
r=r+((r&524287)<<10)&536870911
r^=r>>6}r=r+((r&67108863)<<3)&536870911
r^=r>>11
return r+((r&16383)<<15)&536870911},
gaX(a){return A.dn(t.N)},
gp(a){return a.length},
$ias:1,
$iU:1,
$ibj:1,
$ikL:1,
$iM:1}
A.m7.prototype={
E(a,b){t.L.a(b)
B.c.E(this.b,b)
this.a=this.a+b.length},
nZ(){var s,r,q,p,o,n,m,l=this,k=l.a
if(k===0)return $.rJ()
s=l.b
r=s.length
if(r===1){if(0>=r)return A.a(s,0)
q=s[0]
l.a=0
B.c.ca(s)
return q}q=new Uint8Array(k)
for(p=0,o=0;o<s.length;s.length===r||(0,A.K)(s),++o,p=m){n=s[o]
m=p+n.length
B.d.aa(q,p,m,n)}l.a=0
B.c.ca(s)
return q},
gp(a){return this.a}}
A.cA.prototype={
gF(a){return new A.ey(J.cd(this.gcD()),A.m(this).n("ey<1,2>"))},
gp(a){return J.bz(this.gcD())},
br(a,b){var s=A.m(this)
return A.nO(J.jJ(this.gcD(),b),s.c,s.y[1])},
bm(a,b){return A.m(this).y[1].a(J.nL(this.gcD(),b))},
D(a){return J.ev(this.gcD())}}
A.ey.prototype={
C(){return this.a.C()},
gN(){return this.$ti.y[1].a(this.a.gN())},
$iz:1}
A.cF.prototype={
gcD(){return this.a}}
A.h_.prototype={$ix:1}
A.fZ.prototype={
l(a,b){return this.$ti.y[1].a(J.d(this.a,b))},
i(a,b,c){var s=this.$ti
J.a2(this.a,b,s.c.a(s.y[1].a(c)))},
dj(a,b,c){var s=this.$ti
return A.nO(J.tc(this.a,b,c),s.c,s.y[1])},
a3(a,b,c,d,e){var s=this.$ti
J.td(this.a,b,c,A.nO(s.n("f<2>").a(d),s.y[1],s.c),e)},
aa(a,b,c,d){return this.a3(0,b,c,d,0)},
$ix:1,
$iq:1}
A.ez.prototype={
gcD(){return this.a}}
A.dW.prototype={
D(a){return"LateInitializationError: "+this.a}}
A.an.prototype={
gp(a){return this.a.length},
l(a,b){var s=this.a
if(!(b>=0&&b<s.length))return A.a(s,b)
return s.charCodeAt(b)}}
A.la.prototype={}
A.x.prototype={}
A.b3.prototype={
gF(a){var s=this
return new A.cR(s,s.gp(s),A.m(s).n("cR<b3.E>"))},
nC(a){var s,r,q=this,p=q.gp(q)
for(s=0,r="";s<p;++s){r+=A.A(q.bm(0,s))
if(p!==q.gp(q))throw A.e(A.b_(q))}return r.charCodeAt(0)==0?r:r},
br(a,b){return A.d9(this,b,null,A.m(this).n("b3.E"))}}
A.fI.prototype={
gkI(){var s=J.bz(this.a),r=this.c
if(r==null||r>s)return s
return r},
gmy(){var s=J.bz(this.a),r=this.b
if(r>s)return s
return r},
gp(a){var s,r=J.bz(this.a),q=this.b
if(q>=r)return 0
s=this.c
if(s==null||s>=r)return r-q
return s-q},
bm(a,b){var s=this,r=s.gmy()+b
if(b<0||r>=s.gkI())throw A.e(A.hV(b,s.gp(0),s,null,"index"))
return J.nL(s.a,r)},
br(a,b){var s,r,q=this
A.aV(b,"count")
s=q.b+b
r=q.c
if(r!=null&&s>=r)return new A.eD(q.$ti.n("eD<1>"))
return A.d9(q.a,s,r,q.$ti.c)},
dV(a,b){var s,r,q,p=this,o=p.b,n=p.a,m=J.ab(n),l=m.gp(n),k=p.c
if(k!=null&&k<l)l=k
s=l-o
if(s<=0){n=J.nW(0,p.$ti.c)
return n}r=A.N(s,m.bm(n,o),!1,p.$ti.c)
for(q=1;q<s;++q){B.c.i(r,q,m.bm(n,o+q))
if(m.gp(n)<l)throw A.e(A.b_(p))}return r}}
A.cR.prototype={
gN(){var s=this.d
return s==null?this.$ti.c.a(s):s},
C(){var s,r=this,q=r.a,p=J.ab(q),o=p.gp(q)
if(r.b!==o)throw A.e(A.b_(q))
s=r.c
if(s>=o){r.d=null
return!1}r.d=p.bm(q,s);++r.c
return!0},
$iz:1}
A.fe.prototype={
gp(a){return J.bz(this.a)},
bm(a,b){return this.b.$1(J.nL(this.a,b))}}
A.c5.prototype={
gF(a){return new A.fY(J.cd(this.a),this.b,this.$ti.n("fY<1>"))}}
A.fY.prototype={
C(){var s,r
for(s=this.a,r=this.b;s.C();)if(r.$1(s.gN()))return!0
return!1},
gN(){return this.a.gN()},
$iz:1}
A.bX.prototype={
br(a,b){A.jM(b,"count",t.p)
A.aV(b,"count")
return new A.bX(this.a,this.b+b,A.m(this).n("bX<1>"))},
gF(a){var s=this.a
return new A.fF(s.gF(s),this.b,A.m(this).n("fF<1>"))}}
A.dI.prototype={
gp(a){var s=this.a,r=s.gp(s)-this.b
if(r>=0)return r
return 0},
br(a,b){A.jM(b,"count",t.p)
A.aV(b,"count")
return new A.dI(this.a,this.b+b,this.$ti)},
$ix:1}
A.fF.prototype={
C(){var s,r
for(s=this.a,r=0;r<this.b;++r)s.C()
this.b=0
return s.C()},
gN(){return this.a.gN()},
$iz:1}
A.eD.prototype={
gF(a){return B.e9},
gp(a){return 0},
bm(a,b){throw A.e(A.a7(b,0,0,"index",null))},
br(a,b){A.aV(b,"count")
return this},
dV(a,b){var s=J.nW(0,this.$ti.c)
return s}}
A.eE.prototype={
C(){return!1},
gN(){throw A.e(A.f5())},
$iz:1}
A.aA.prototype={}
A.c0.prototype={
i(a,b,c){A.m(this).n("c0.E").a(c)
throw A.e(A.br("Cannot modify an unmodifiable list"))},
a3(a,b,c,d,e){A.m(this).n("f<c0.E>").a(d)
throw A.e(A.br("Cannot modify an unmodifiable list"))},
aa(a,b,c,d){return this.a3(0,b,c,d,0)},
V(a,b,c,d){A.m(this).n("c0.E?").a(d)
throw A.e(A.br("Cannot modify an unmodifiable list"))}}
A.e8.prototype={}
A.hj.prototype={}
A.bI.prototype={$r:"+(1,2)",$s:1}
A.dl.prototype={$r:"+extension,stem(1,2)",$s:2}
A.ed.prototype={$r:"+bytes,quality,scale(1,2,3)",$s:3}
A.h9.prototype={$r:"+components,height,width(1,2,3)",$s:4}
A.dF.prototype={
D(a){return A.o2(this)},
$ibT:1}
A.eC.prototype={
gp(a){return this.b.length},
gfZ(){var s=this.$keys
if(s==null){s=Object.keys(this.a)
this.$keys=s}return s},
af(a){if(typeof a!="string")return!1
if("__proto__"===a)return!1
return this.a.hasOwnProperty(a)},
l(a,b){if(!this.af(b))return null
return this.b[this.a[b]]},
cc(a,b){var s,r,q,p
this.$ti.n("~(1,2)").a(b)
s=this.gfZ()
r=this.b
for(q=s.length,p=0;p<q;++p)b.$2(s[p],r[p])},
gig(){return new A.h0(this.gfZ(),this.$ti.n("h0<1>"))}}
A.h0.prototype={
gp(a){return this.a.length},
gF(a){var s=this.a
return new A.c7(s,s.length,this.$ti.n("c7<1>"))}}
A.c7.prototype={
gN(){var s=this.d
return s==null?this.$ti.c.a(s):s},
C(){var s=this,r=s.c
if(r>=s.b){s.d=null
return!1}s.d=s.a[r]
s.c=r+1
return!0},
$iz:1}
A.bm.prototype={
ck(){var s=this,r=s.$map
if(r==null){r=new A.cQ(s.$ti.n("cQ<1,2>"))
A.r5(s.a,r)
s.$map=r}return r},
af(a){return this.ck().af(a)},
l(a,b){return this.ck().l(0,b)},
cc(a,b){this.$ti.n("~(1,2)").a(b)
this.ck().cc(0,b)},
gig(){var s=this.ck()
return new A.fc(s,A.m(s).n("fc<1>"))},
gp(a){return this.ck().a}}
A.dG.prototype={
E(a,b){A.m(this).c.a(b)
A.tt()}}
A.cH.prototype={
gp(a){return this.b},
gF(a){var s,r=this,q=r.$keys
if(q==null){q=Object.keys(r.a)
r.$keys=q}s=q
return new A.c7(s,s.length,r.$ti.n("c7<1>"))},
aG(a,b){if(typeof b!="string")return!1
if("__proto__"===b)return!1
return this.a.hasOwnProperty(b)}}
A.aQ.prototype={
gp(a){return this.a.length},
gF(a){var s=this.a
return new A.c7(s,s.length,this.$ti.n("c7<1>"))},
ck(){var s,r,q,p,o=this,n=o.$map
if(n==null){n=new A.cQ(o.$ti.n("cQ<1,1>"))
for(s=o.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.K)(s),++q){p=s[q]
n.i(0,p,p)}o.$map=n}return n},
aG(a,b){return this.ck().af(b)}}
A.fD.prototype={}
A.ln.prototype={
bP(a){var s,r,q=this,p=new RegExp(q.a).exec(a)
if(p==null)return null
s=Object.create(null)
r=q.b
if(r!==-1)s.arguments=p[r+1]
r=q.c
if(r!==-1)s.argumentsExpr=p[r+1]
r=q.d
if(r!==-1)s.expr=p[r+1]
r=q.e
if(r!==-1)s.method=p[r+1]
r=q.f
if(r!==-1)s.receiver=p[r+1]
return s}}
A.fo.prototype={
D(a){return"Null check operator used on a null value"}}
A.id.prototype={
D(a){var s,r=this,q="NoSuchMethodError: method not found: '",p=r.b
if(p==null)return"NoSuchMethodError: "+r.a
s=r.c
if(s==null)return q+p+"' ("+r.a+")"
return q+p+"' on '"+s+"' ("+r.a+")"}}
A.iQ.prototype={
D(a){var s=this.a
return s.length===0?"Error":"Error: "+s}}
A.kK.prototype={
D(a){return"Throw of null ('"+(this.a===null?"null":"undefined")+"' from JavaScript)"}}
A.eG.prototype={}
A.hb.prototype={
D(a){var s,r=this.b
if(r!=null)return r
r=this.a
s=r!==null&&typeof r==="object"?r.stack:null
return this.b=s==null?"":s},
$icw:1}
A.ce.prototype={
D(a){var s=this.constructor,r=s==null?null:s.name
return"Closure '"+A.rs(r==null?"unknown":r)+"'"},
$icK:1,
go9(){return this},
$C:"$1",
$R:1,
$D:null}
A.hw.prototype={$C:"$0",$R:0}
A.hx.prototype={$C:"$2",$R:2}
A.iM.prototype={}
A.iK.prototype={
D(a){var s=this.$static_name
if(s==null)return"Closure of unknown static method"
return"Closure '"+A.rs(s)+"'"}}
A.dr.prototype={
a_(a,b){if(b==null)return!1
if(this===b)return!0
if(!(b instanceof A.dr))return!1
return this.$_target===b.$_target&&this.a===b.a},
gK(a){return(A.oP(this.a)^A.fz(this.$_target))>>>0},
D(a){return"Closure '"+this.$_name+"' of "+("Instance of '"+A.iv(this.a)+"'")}}
A.iJ.prototype={
D(a){return"RuntimeError: "+this.a}}
A.bo.prototype={
gp(a){return this.a},
af(a){var s,r
if(typeof a=="string"){s=this.b
if(s==null)return!1
return s[a]!=null}else if(typeof a=="number"&&(a&0x3fffffff)===a){r=this.c
if(r==null)return!1
return r[a]!=null}else return this.nw(a)},
nw(a){var s=this.d
if(s==null)return!1
return this.d7(this.fK(s,a),a)>=0},
l(a,b){var s,r,q,p,o=null
if(typeof b=="string"){s=this.b
if(s==null)return o
r=s[b]
q=r==null?o:r.b
return q}else if(typeof b=="number"&&(b&0x3fffffff)===b){p=this.c
if(p==null)return o
r=p[b]
q=r==null?o:r.b
return q}else return this.nx(b)},
nx(a){var s,r,q=this.d
if(q==null)return null
s=this.fK(q,a)
r=this.d7(s,a)
if(r<0)return null
return s[r].b},
i(a,b,c){var s,r,q=this,p=A.m(q)
p.c.a(b)
p.y[1].a(c)
if(typeof b=="string"){s=q.b
q.fd(s==null?q.b=q.ew():s,b,c)}else if(typeof b=="number"&&(b&0x3fffffff)===b){r=q.c
q.fd(r==null?q.c=q.ew():r,b,c)}else q.nz(b,c)},
nz(a,b){var s,r,q,p,o=this,n=A.m(o)
n.c.a(a)
n.y[1].a(b)
s=o.d
if(s==null)s=o.d=o.ew()
r=o.dQ(a)
q=s[r]
if(q==null)s[r]=[o.ex(a,b)]
else{p=o.d7(q,a)
if(p>=0)q[p].b=b
else q.push(o.ex(a,b))}},
ce(a,b){var s=this
if(typeof b=="string")return s.he(s.b,b)
else if(typeof b=="number"&&(b&0x3fffffff)===b)return s.he(s.c,b)
else return s.ny(b)},
ny(a){var s,r,q,p,o=this,n=o.d
if(n==null)return null
s=o.dQ(a)
r=n[s]
q=o.d7(r,a)
if(q<0)return null
p=r.splice(q,1)[0]
o.hv(p)
if(r.length===0)delete n[s]
return p.b},
cc(a,b){var s,r,q=this
A.m(q).n("~(1,2)").a(b)
s=q.e
r=q.r
while(s!=null){b.$2(s.a,s.b)
if(r!==q.r)throw A.e(A.b_(q))
s=s.c}},
fd(a,b,c){var s,r=A.m(this)
r.c.a(b)
r.y[1].a(c)
s=a[b]
if(s==null)a[b]=this.ex(b,c)
else s.b=c},
he(a,b){var s
if(a==null)return null
s=a[b]
if(s==null)return null
this.hv(s)
delete a[b]
return s.b},
h0(){this.r=this.r+1&1073741823},
ex(a,b){var s=this,r=A.m(s),q=new A.kF(r.c.a(a),r.y[1].a(b))
if(s.e==null)s.e=s.f=q
else{r=s.f
r.toString
q.d=r
s.f=r.c=q}++s.a
s.h0()
return q},
hv(a){var s=this,r=a.d,q=a.c
if(r==null)s.e=q
else r.c=q
if(q==null)s.f=r
else q.d=r;--s.a
s.h0()},
dQ(a){return J.by(a)&1073741823},
fK(a,b){return a[this.dQ(b)]},
d7(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.bf(a[r].a,b))return r
return-1},
D(a){return A.o2(this)},
ew(){var s=Object.create(null)
s["<non-identifier-key>"]=s
delete s["<non-identifier-key>"]
return s},
$io_:1}
A.kF.prototype={}
A.fc.prototype={
gp(a){return this.a.a},
gF(a){var s=this.a
return new A.a1(s,s.r,s.e,this.$ti.n("a1<1>"))}}
A.a1.prototype={
gN(){return this.d},
C(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.e(A.b_(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=s.a
r.c=s.c
return!0}},
$iz:1}
A.kG.prototype={
gp(a){return this.a.a},
gF(a){var s=this.a
return new A.at(s,s.r,s.e,this.$ti.n("at<1>"))}}
A.at.prototype={
gN(){return this.d},
C(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.e(A.b_(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=s.b
r.c=s.c
return!0}},
$iz:1}
A.fa.prototype={
gp(a){return this.a.a},
gF(a){var s=this.a
return new A.fb(s,s.r,s.e,this.$ti.n("fb<1,2>"))}}
A.fb.prototype={
gN(){var s=this.d
s.toString
return s},
C(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.e(A.b_(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=new A.cr(s.a,s.b,r.$ti.n("cr<1,2>"))
r.c=s.c
return!0}},
$iz:1}
A.cQ.prototype={
dQ(a){return A.xo(a)&1073741823},
d7(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.bf(a[r].a,b))return r
return-1}}
A.nv.prototype={
$1(a){return this.a(a)},
$S:54}
A.nw.prototype={
$2(a,b){return this.a(a,b)},
$S:34}
A.nx.prototype={
$1(a){return this.a(A.bs(a))},
$S:33}
A.ba.prototype={
D(a){return this.hr(!1)},
hr(a){var s,r,q,p,o,n=this.kQ(),m=this.eq(),l=(a?"Record ":"")+"("
for(s=n.length,r="",q=0;q<s;++q,r=", "){l+=r
p=n[q]
if(typeof p=="string")l=l+p+": "
if(!(q<m.length))return A.a(m,q)
o=m[q]
l=a?l+A.q1(o):l+A.A(o)}l+=")"
return l.charCodeAt(0)==0?l:l},
kQ(){var s,r=this.$s
while($.mt.length<=r)B.c.E($.mt,null)
s=$.mt[r]
if(s==null){s=this.jR()
B.c.i($.mt,r,s)}return s},
jR(){var s,r,q,p=this.$r,o=p.indexOf("("),n=p.substring(1,o),m=p.substring(o),l=m==="()"?0:m.replace(/[^,]/g,"").length+1,k=t.K,j=J.bF(l,k)
for(s=0;s<l;++s)j[s]=s
if(n!==""){r=n.split(",")
s=r.length
for(q=l;s>0;){--q;--s
B.c.i(j,q,r[s])}}return A.pL(j,k)}}
A.dj.prototype={
eq(){return[this.a,this.b]},
a_(a,b){if(b==null)return!1
return b instanceof A.dj&&this.$s===b.$s&&J.bf(this.a,b.a)&&J.bf(this.b,b.b)},
gK(a){return A.o5(this.$s,this.a,this.b,B.av)}}
A.dk.prototype={
eq(){return[this.a,this.b,this.c]},
a_(a,b){var s=this
if(b==null)return!1
return b instanceof A.dk&&s.$s===b.$s&&J.bf(s.a,b.a)&&J.bf(s.b,b.b)&&J.bf(s.c,b.c)},
gK(a){var s=this
return A.o5(s.$s,s.a,s.b,s.c)}}
A.dT.prototype={
D(a){return"RegExp/"+this.a+"/"+this.b.flags},
gh1(){var s=this,r=s.c
if(r!=null)return r
r=s.b
return s.c=A.pG(s.a,r.multiline,!r.ignoreCase,r.unicode,r.dotAll,"g")},
jS(){var s,r=this.a
if(!B.h.aG(r,"("))return!1
s=this.b.unicode?"u":""
return new RegExp("(?:)|"+r,s).exec("").length>1},
no(a){var s=this.b.exec(a)
if(s==null)return null
return new A.h3(s)},
eL(a,b,c){var s=b.length
if(c>s)throw A.e(A.a7(c,0,s,null,null))
return new A.j_(this,b,c)},
eK(a,b){return this.eL(0,b,0)},
kJ(a,b){var s,r=this.gh1()
if(r==null)r=A.ef(r)
r.lastIndex=b
s=r.exec(a)
if(s==null)return null
return new A.h3(s)},
$ikL:1,
$iuo:1}
A.h3.prototype={
ge1(){return this.b.index},
gdP(){var s=this.b
return s.index+s[0].length},
$idZ:1,
$ifC:1}
A.j_.prototype={
gF(a){return new A.j0(this.a,this.b,this.c)}}
A.j0.prototype={
gN(){var s=this.d
return s==null?t.lu.a(s):s},
C(){var s,r,q,p,o,n,m=this,l=m.b
if(l==null)return!1
s=m.c
r=l.length
if(s<=r){q=m.a
p=q.kJ(l,s)
if(p!=null){m.d=p
o=p.gdP()
if(p.b.index===o){s=!1
if(q.b.unicode){q=m.c
n=q+1
if(n<r){if(!(q>=0&&q<r))return A.a(l,q)
q=l.charCodeAt(q)
if(q>=55296&&q<=56319){if(!(n>=0))return A.a(l,n)
s=l.charCodeAt(n)
s=s>=56320&&s<=57343}}}o=(s?o+1:o)+1}m.c=o
return!0}}m.b=m.d=null
return!1},
$iz:1}
A.iL.prototype={
gdP(){return this.a+this.c.length},
$idZ:1,
ge1(){return this.a}}
A.jc.prototype={
gF(a){return new A.jd(this.a,this.b,this.c)}}
A.jd.prototype={
C(){var s,r,q=this,p=q.c,o=q.b,n=o.length,m=q.a,l=m.length
if(p+n>l){q.d=null
return!1}s=m.indexOf(o,p)
if(s<0){q.c=l+1
q.d=null
return!1}r=s+n
q.d=new A.iL(s,o)
q.c=r===q.c?r+1:r
return!0},
gN(){var s=this.d
s.toString
return s},
$iz:1}
A.m8.prototype={
cV(){var s=this.b
if(s===this)throw A.e(A.kC(""))
return s}}
A.cS.prototype={
gd8(a){return a.byteLength},
gaX(a){return B.pA},
d1(a,b,c){A.aE(a,b,c)
return c==null?new Uint8Array(a,b):new Uint8Array(a,b,c)},
hT(a){return this.d1(a,0,null)},
hQ(a,b,c){A.aE(a,b,c)
return c==null?new Int8Array(a,b):new Int8Array(a,b,c)},
dN(a,b,c){A.aE(a,b,c)
c=B.a.P(a.byteLength-b,2)
return new Uint16Array(a,b,c)},
hR(a){return this.dN(a,0,null)},
hO(a,b,c){A.aE(a,b,c)
c=B.a.P(a.byteLength-b,2)
return new Int16Array(a,b,c)},
hS(a,b,c){A.aE(a,b,c)
if(c==null)c=B.a.P(a.byteLength-b,4)
return new Uint32Array(a,b,c)},
hP(a,b,c){A.aE(a,b,c)
c=B.a.P(a.byteLength-b,4)
return new Int32Array(a,b,c)},
hN(a,b,c){A.aE(a,b,c)
c=B.a.P(a.byteLength-b,4)
return new Float32Array(a,b,c)},
hM(a,b,c){A.aE(a,b,c)
return c==null?new DataView(a,b):new DataView(a,b,c)},
$iU:1,
$icS:1}
A.fk.prototype={
gt(a){if(((a.$flags|0)&2)!==0)return new A.mB(a.buffer)
else return a.buffer},
lf(a,b,c,d){var s=A.a7(b,0,c,d,null)
throw A.e(s)},
fs(a,b,c,d){if(b>>>0!==b||b>c)this.lf(a,b,c,d)},
$ia5:1}
A.mB.prototype={
gd8(a){return this.a.byteLength},
d1(a,b,c){var s=A.u9(this.a,b,c)
s.$flags=3
return s},
hT(a){return this.d1(0,0,null)},
hQ(a,b,c){var s=A.u4(this.a,b,c)
s.$flags=3
return s},
dN(a,b,c){var s=A.u6(this.a,b,c)
s.$flags=3
return s},
hR(a){return this.dN(0,0,null)},
hO(a,b,c){var s=A.u2(this.a,b,c)
s.$flags=3
return s},
hS(a,b,c){var s=A.u8(this.a,b,c)
s.$flags=3
return s},
hP(a,b,c){var s=A.u3(this.a,b,c)
s.$flags=3
return s},
hN(a,b,c){var s=A.u1(this.a,b,c)
s.$flags=3
return s},
hM(a,b,c){var s=A.u_(this.a,b,c)
s.$flags=3
return s}}
A.ih.prototype={
gaX(a){return B.pB},
$iU:1}
A.ak.prototype={
gp(a){return a.length},
hj(a,b,c,d,e){var s,r,q
t.dO.a(d)
s=a.length
this.fs(a,b,s,"start")
this.fs(a,c,s,"end")
if(b>c)throw A.e(A.a7(b,0,c,null,null))
r=c-b
if(e<0)throw A.e(A.aJ(e,null))
q=d.length
if(q-e<r)throw A.e(A.q7("Not enough elements"))
if(e!==0||q!==r)d=d.subarray(e,e+r)
a.set(d,b)},
$ias:1,
$iaS:1}
A.cs.prototype={
l(a,b){A.ca(b,a,a.length)
return a[b]},
i(a,b,c){A.qD(c)
a.$flags&2&&A.b(a)
A.ca(b,a,a.length)
a[b]=c},
a3(a,b,c,d,e){t.id.a(d)
a.$flags&2&&A.b(a,5)
if(t.dQ.b(d)){this.hj(a,b,c,d,e)
return}this.f9(a,b,c,d,e)},
aa(a,b,c,d){return this.a3(a,b,c,d,0)},
$ix:1,
$if:1,
$iq:1}
A.aT.prototype={
i(a,b,c){A.r(c)
a.$flags&2&&A.b(a)
A.ca(b,a,a.length)
a[b]=c},
a3(a,b,c,d,e){t.fm.a(d)
a.$flags&2&&A.b(a,5)
if(t.aj.b(d)){this.hj(a,b,c,d,e)
return}this.f9(a,b,c,d,e)},
aa(a,b,c,d){return this.a3(a,b,c,d,0)},
$ix:1,
$if:1,
$iq:1}
A.ff.prototype={
gaX(a){return B.pC},
$iU:1,
$ik3:1}
A.fg.prototype={
gaX(a){return B.pD},
$iU:1,
$ihL:1}
A.fh.prototype={
gaX(a){return B.pE},
l(a,b){A.ca(b,a,a.length)
return a[b]},
bJ(a,b,c){return new Int16Array(a.subarray(b,A.ji(b,c,a.length)))},
$iU:1,
$icP:1}
A.fi.prototype={
gaX(a){return B.pF},
l(a,b){A.ca(b,a,a.length)
return a[b]},
$iU:1,
$if1:1}
A.fj.prototype={
gaX(a){return B.pG},
l(a,b){A.ca(b,a,a.length)
return a[b]},
$iU:1,
$inV:1}
A.fl.prototype={
gaX(a){return B.pI},
l(a,b){A.ca(b,a,a.length)
return a[b]},
$iU:1,
$ifK:1}
A.fm.prototype={
gaX(a){return B.pJ},
l(a,b){A.ca(b,a,a.length)
return a[b]},
$iU:1,
$ibH:1}
A.fn.prototype={
gaX(a){return B.pK},
gp(a){return a.length},
l(a,b){A.ca(b,a,a.length)
return a[b]},
$iU:1}
A.cT.prototype={
gaX(a){return B.pL},
gp(a){return a.length},
l(a,b){A.ca(b,a,a.length)
return a[b]},
bJ(a,b,c){return new Uint8Array(a.subarray(b,A.ji(b,c,a.length)))},
dn(a,b){return this.bJ(a,b,null)},
$iU:1,
$icT:1,
$iaf:1}
A.h4.prototype={}
A.h5.prototype={}
A.h6.prototype={}
A.h7.prototype={}
A.bq.prototype={
n(a){return A.hg(v.typeUniverse,this,a)},
b1(a){return A.qv(v.typeUniverse,this,a)}}
A.j6.prototype={}
A.jg.prototype={
D(a){return A.aW(this.a,null)}}
A.j4.prototype={
D(a){return this.a}}
A.hc.prototype={$ibZ:1}
A.m4.prototype={
$1(a){var s=this.a,r=s.a
s.a=null
r.$0()},
$S:11}
A.m3.prototype={
$1(a){var s,r
this.a.a=t.M.a(a)
s=this.b
r=this.c
s.firstChild?s.removeChild(r):s.appendChild(r)},
$S:56}
A.m5.prototype={
$0(){this.a.$0()},
$S:12}
A.m6.prototype={
$0(){this.a.$0()},
$S:12}
A.mw.prototype={
jp(a,b){if(self.setTimeout!=null)self.setTimeout(A.jt(new A.mx(this,b),0),a)
else throw A.e(A.br("`setTimeout()` not found."))}}
A.mx.prototype={
$0(){this.b.$0()},
$S:2}
A.j1.prototype={}
A.mH.prototype={
$1(a){return this.a.$2(0,a)},
$S:37}
A.mI.prototype={
$2(a,b){this.a.$2(1,new A.eG(a,t.l.a(b)))},
$S:46}
A.na.prototype={
$2(a,b){this.a(A.r(a),b)},
$S:57}
A.bh.prototype={
D(a){return A.A(this.a)},
$ia3:1,
gdm(){return this.b}}
A.k7.prototype={
$0(){this.c.a(null)
this.b.jP(null)},
$S:2}
A.df.prototype={
nE(a){if((this.c&15)!==6)return!0
return this.b.b.eW(t.nU.a(this.d),a.a,t.y,t.K)},
nq(a){var s,r=this,q=r.e,p=null,o=t.z,n=t.K,m=a.a,l=r.b.b
if(t.C.b(q))p=l.nX(q,m,a.b,o,n,t.l)
else p=l.eW(t.R.a(q),m,o,n)
try{o=r.$ti.n("2/").a(p)
return o}catch(s){if(t.do.b(A.bx(s))){if((r.c&1)!==0)throw A.e(A.aJ("The error handler of Future.then must return a value of the returned future's type","onError"))
throw A.e(A.aJ("The error handler of Future.catchError must return a value of the future's type","onError"))}else throw s}}}
A.aj.prototype={
iw(a,b,c){var s,r,q=this.$ti
q.b1(c).n("1/(2)").a(a)
s=$.a8
if(s===B.U){if(!t.C.b(b)&&!t.R.b(b))throw A.e(A.jL(b,"onError",u.c))}else{c.n("@<0/>").b1(q.c).n("1(2)").a(a)
b=A.wO(b,s)}r=new A.aj(s,c.n("aj<0>"))
this.e4(new A.df(r,3,a,b,q.n("@<1>").b1(c).n("df<1,2>")))
return r},
hq(a,b,c){var s,r=this.$ti
r.b1(c).n("1/(2)").a(a)
s=new A.aj($.a8,c.n("aj<0>"))
this.e4(new A.df(s,19,a,b,r.n("@<1>").b1(c).n("df<1,2>")))
return s},
mo(a){this.a=this.a&1|16
this.c=a},
du(a){this.a=a.a&30|this.a&1
this.c=a.c},
e4(a){var s,r=this,q=r.a
if(q<=3){a.a=t.F.a(r.c)
r.c=a}else{if((q&4)!==0){s=t.c.a(r.c)
if((s.a&24)===0){s.e4(a)
return}r.du(s)}A.jp(null,null,r.b,t.M.a(new A.mb(r,a)))}},
h5(a){var s,r,q,p,o,n,m=this,l={}
l.a=a
if(a==null)return
s=m.a
if(s<=3){r=t.F.a(m.c)
m.c=a
if(r!=null){q=a.a
for(p=a;q!=null;p=q,q=o)o=q.a
p.a=r}}else{if((s&4)!==0){n=t.c.a(m.c)
if((n.a&24)===0){n.h5(a)
return}m.du(n)}l.a=m.dK(a)
A.jp(null,null,m.b,t.M.a(new A.mg(l,m)))}},
cX(){var s=t.F.a(this.c)
this.c=null
return this.dK(s)},
dK(a){var s,r,q
for(s=a,r=null;s!=null;r=s,s=q){q=s.a
s.a=r}return r},
jP(a){var s,r=this,q=r.$ti
q.n("1/").a(a)
if(q.n("bB<1>").b(a))A.me(a,r,!0)
else{s=r.cX()
q.c.a(a)
r.a=8
r.c=a
A.dg(r,s)}},
fv(a){var s,r=this
r.$ti.c.a(a)
s=r.cX()
r.a=8
r.c=a
A.dg(r,s)},
jQ(a){var s,r,q=this
if((a.a&16)!==0){s=q.b===a.b
s=!(s||s)}else s=!1
if(s)return
r=q.cX()
q.du(a)
A.dg(q,r)},
e9(a){var s=this.cX()
this.mo(a)
A.dg(this,s)},
jv(a){var s=this.$ti
s.n("1/").a(a)
if(s.n("bB<1>").b(a)){this.fq(a)
return}this.jw(a)},
jw(a){var s=this
s.$ti.c.a(a)
s.a^=2
A.jp(null,null,s.b,t.M.a(new A.md(s,a)))},
fq(a){A.me(this.$ti.n("bB<1>").a(a),this,!1)
return},
fk(a){this.a^=2
A.jp(null,null,this.b,t.M.a(new A.mc(this,a)))},
$ibB:1}
A.mb.prototype={
$0(){A.dg(this.a,this.b)},
$S:2}
A.mg.prototype={
$0(){A.dg(this.b,this.a.a)},
$S:2}
A.mf.prototype={
$0(){A.me(this.a.a,this.b,!0)},
$S:2}
A.md.prototype={
$0(){this.a.fv(this.b)},
$S:2}
A.mc.prototype={
$0(){this.a.e9(this.b)},
$S:2}
A.mj.prototype={
$0(){var s,r,q,p,o,n,m,l,k=this,j=null
try{q=k.a.a
j=q.b.b.nW(t.mY.a(q.d),t.z)}catch(p){s=A.bx(p)
r=A.es(p)
if(k.c&&t.u.a(k.b.a.c).a===s){q=k.a
q.c=t.u.a(k.b.a.c)}else{q=s
o=r
if(o==null)o=A.nN(q)
n=k.a
n.c=new A.bh(q,o)
q=n}q.b=!0
return}if(j instanceof A.aj&&(j.a&24)!==0){if((j.a&16)!==0){q=k.a
q.c=t.u.a(j.c)
q.b=!0}return}if(j instanceof A.aj){m=k.b.a
l=new A.aj(m.b,m.$ti)
j.iw(new A.mk(l,m),new A.ml(l),t.q)
q=k.a
q.c=l
q.b=!1}},
$S:2}
A.mk.prototype={
$1(a){this.a.jQ(this.b)},
$S:11}
A.ml.prototype={
$2(a,b){A.ef(a)
t.l.a(b)
this.a.e9(new A.bh(a,b))},
$S:23}
A.mi.prototype={
$0(){var s,r,q,p,o,n,m,l
try{q=this.a
p=q.a
o=p.$ti
n=o.c
m=n.a(this.b)
q.c=p.b.b.eW(o.n("2/(1)").a(p.d),m,o.n("2/"),n)}catch(l){s=A.bx(l)
r=A.es(l)
q=s
p=r
if(p==null)p=A.nN(q)
o=this.a
o.c=new A.bh(q,p)
o.b=!0}},
$S:2}
A.mh.prototype={
$0(){var s,r,q,p,o,n,m,l=this
try{s=t.u.a(l.a.a.c)
p=l.b
if(p.a.nE(s)&&p.a.e!=null){p.c=p.a.nq(s)
p.b=!1}}catch(o){r=A.bx(o)
q=A.es(o)
p=t.u.a(l.a.a.c)
if(p.a===r){n=l.b
n.c=p
p=n}else{p=r
n=q
if(n==null)n=A.nN(p)
m=l.b
m.c=new A.bh(p,n)
p=m}p.b=!0}},
$S:2}
A.j2.prototype={}
A.jb.prototype={}
A.hi.prototype={$iqj:1}
A.ja.prototype={
nY(a){var s,r,q
t.M.a(a)
try{if(B.U===$.a8){a.$0()
return}A.qQ(null,null,this,a,t.q)}catch(q){s=A.bx(q)
r=A.es(q)
A.oD(A.ef(s),t.l.a(r))}},
hV(a){return new A.mu(this,t.M.a(a))},
nW(a,b){b.n("0()").a(a)
if($.a8===B.U)return a.$0()
return A.qQ(null,null,this,a,b)},
eW(a,b,c,d){c.n("@<0>").b1(d).n("1(2)").a(a)
d.a(b)
if($.a8===B.U)return a.$1(b)
return A.wW(null,null,this,a,b,c,d)},
nX(a,b,c,d,e,f){d.n("@<0>").b1(e).b1(f).n("1(2,3)").a(a)
e.a(b)
f.a(c)
if($.a8===B.U)return a.$2(b,c)
return A.wV(null,null,this,a,b,c,d,e,f)},
iq(a,b,c,d){return b.n("@<0>").b1(c).b1(d).n("1(2,3)").a(a)}}
A.mu.prototype={
$0(){return this.a.nY(this.b)},
$S:2}
A.n0.prototype={
$0(){A.tw(this.a,this.b)},
$S:2}
A.dh.prototype={
gF(a){var s=this,r=new A.h1(s,s.r,A.m(s).n("h1<1>"))
r.c=s.e
return r},
gp(a){return this.a},
aG(a,b){var s,r
if(typeof b=="string"&&b!=="__proto__"){s=this.b
if(s==null)return!1
return t.W.a(s[b])!=null}else if(typeof b=="number"&&(b&1073741823)===b){r=this.c
if(r==null)return!1
return t.W.a(r[b])!=null}else return this.jT(b)},
jT(a){var s=this.d
if(s==null)return!1
return this.el(s[this.ea(a)],a)>=0},
E(a,b){var s,r,q=this
A.m(q).c.a(b)
if(typeof b=="string"&&b!=="__proto__"){s=q.b
return q.ft(s==null?q.b=A.or():s,b)}else if(typeof b=="number"&&(b&1073741823)===b){r=q.c
return q.ft(r==null?q.c=A.or():r,b)}else return q.jq(b)},
jq(a){var s,r,q,p=this
A.m(p).c.a(a)
s=p.d
if(s==null)s=p.d=A.or()
r=p.ea(a)
q=s[r]
if(q==null)s[r]=[p.e8(a)]
else{if(p.el(q,a)>=0)return!1
q.push(p.e8(a))}return!0},
ce(a,b){var s=this.mi(b)
return s},
mi(a){var s,r,q,p,o=this,n=o.d
if(n==null)return!1
s=o.ea(a)
r=n[s]
q=o.el(r,a)
if(q<0)return!1
p=r.splice(q,1)[0]
if(0===r.length)delete n[s]
o.jO(p)
return!0},
ft(a,b){A.m(this).c.a(b)
if(t.W.a(a[b])!=null)return!1
a[b]=this.e8(b)
return!0},
fu(){this.r=this.r+1&1073741823},
e8(a){var s,r=this,q=new A.j8(A.m(r).c.a(a))
if(r.e==null)r.e=r.f=q
else{s=r.f
s.toString
q.c=s
r.f=s.b=q}++r.a
r.fu()
return q},
jO(a){var s=this,r=a.c,q=a.b
if(r==null)s.e=q
else r.b=q
if(q==null)s.f=r
else q.c=r;--s.a
s.fu()},
ea(a){return J.by(a)&1073741823},
el(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.bf(a[r].a,b))return r
return-1}}
A.j8.prototype={}
A.h1.prototype={
gN(){var s=this.d
return s==null?this.$ti.c.a(s):s},
C(){var s=this,r=s.c,q=s.a
if(s.b!==q.r)throw A.e(A.b_(q))
else if(r==null){s.d=null
return!1}else{s.d=s.$ti.n("1?").a(r.a)
s.c=r.b
return!0}},
$iz:1}
A.kH.prototype={
$2(a,b){this.a.i(0,this.b.a(a),this.c.a(b))},
$S:27}
A.G.prototype={
gF(a){return new A.cR(a,this.gp(a),A.be(a).n("cR<G.E>"))},
bm(a,b){return this.l(a,b)},
gab(a){return this.gp(a)===0},
gd5(a){if(this.gp(a)===0)throw A.e(A.f5())
return this.l(a,0)},
gcH(a){if(this.gp(a)===0)throw A.e(A.f5())
return this.l(a,this.gp(a)-1)},
aG(a,b){var s,r=this.gp(a)
for(s=0;s<r;++s){if(J.bf(this.l(a,s),b))return!0
if(r!==this.gp(a))throw A.e(A.b_(a))}return!1},
br(a,b){return A.d9(a,b,null,A.be(a).n("G.E"))},
iu(a,b){return A.d9(a,0,A.js(b,"count",t.p),A.be(a).n("G.E"))},
bJ(a,b,c){var s,r=this.gp(a)
A.b6(b,c,r)
s=A.t(this.dj(a,b,c),A.be(a).n("G.E"))
return s},
dj(a,b,c){A.b6(b,c,this.gp(a))
return A.d9(a,b,c,A.be(a).n("G.E"))},
V(a,b,c,d){var s
A.be(a).n("G.E?").a(d)
A.b6(b,c,this.gp(a))
for(s=b;s<c;++s)this.i(a,s,d)},
a3(a,b,c,d,e){var s,r,q,p,o
A.be(a).n("f<G.E>").a(d)
A.b6(b,c,this.gp(a))
s=c-b
if(s===0)return
A.aV(e,"skipCount")
if(t.j.b(d)){r=e
q=d}else{q=J.jJ(d,e).dV(0,!1)
r=0}p=J.ab(q)
if(r+s>p.gp(q))throw A.e(A.pB())
if(r<b)for(o=s-1;o>=0;--o)this.i(a,b+o,p.l(q,r+o))
else for(o=0;o<s;++o)this.i(a,b+o,p.l(q,r+o))},
aa(a,b,c,d){return this.a3(a,b,c,d,0)},
bB(a,b,c){A.be(a).n("f<G.E>").a(c)
this.aa(a,b,b+c.length,c)},
D(a){return A.kr(a,"[","]")},
$ix:1,
$if:1,
$iq:1}
A.dY.prototype={
gp(a){return this.a},
D(a){return A.o2(this)},
$ibT:1}
A.kJ.prototype={
$2(a,b){var s,r=this.a
if(!r.a)this.b.a+=", "
r.a=!1
r=this.b
s=A.A(a)
r.a=(r.a+=s)+": "
s=A.A(b)
r.a+=s},
$S:29}
A.fd.prototype={
gF(a){var s=this
return new A.h2(s,s.c,s.d,s.b,s.$ti.n("h2<1>"))},
gab(a){return this.b===this.c},
gp(a){return(this.c-this.b&this.a.length-1)>>>0},
bm(a,b){var s,r,q=this,p=q.gp(0)
if(0>b||b>=p)A.a9(A.hV(b,p,q,null,"index"))
p=q.a
s=p.length
r=(q.b+b&s-1)>>>0
if(!(r>=0&&r<s))return A.a(p,r)
r=p[r]
return r==null?q.$ti.c.a(r):r},
cE(a,b){var s,r,q,p,o,n,m,l,k=this,j=k.$ti
j.n("f<1>").a(b)
s=b.length
r=k.gp(0)
q=r+s
p=k.a
o=p.length
if(q>=o){n=A.N(A.tZ(q+(q>>>1)),null,!1,j.n("1?"))
k.c=k.mR(n)
k.a=n
k.b=0
B.c.a3(n,r,q,b,0)
k.c+=s}else{j=k.c
m=o-j
if(s<m){B.c.a3(p,j,j+s,b,0)
k.c+=s}else{l=s-m
B.c.a3(p,j,j+m,b,0)
B.c.a3(k.a,0,l,b,m)
k.c=l}}++k.d},
D(a){return A.kr(this,"{","}")},
it(){var s,r,q=this,p=q.b
if(p===q.c)throw A.e(A.f5());++q.d
s=q.a
if(!(p<s.length))return A.a(s,p)
r=s[p]
if(r==null)r=q.$ti.c.a(r)
B.c.i(s,p,null)
q.b=(q.b+1&q.a.length-1)>>>0
return r},
mR(a){var s,r,q,p,o,n=this
n.$ti.n("q<1?>").a(a)
s=n.b
r=n.c
q=n.a
if(s<=r){p=r-s
B.c.a3(a,0,p,q,s)
return p}else{o=q.length-s
B.c.a3(a,0,o,q,s)
B.c.a3(a,o,o+n.c,n.a,0)
return n.c+o}},
$iul:1}
A.h2.prototype={
gN(){var s=this.e
return s==null?this.$ti.c.a(s):s},
C(){var s,r,q=this,p=q.a
if(q.c!==p.d)A.a9(A.b_(p))
s=q.d
if(s===q.b){q.e=null
return!1}p=p.a
r=p.length
if(!(s<r))return A.a(p,s)
q.e=p[s]
q.d=(s+1&r-1)>>>0
return!0},
$iz:1}
A.bW.prototype={
cE(a,b){var s
A.m(this).n("f<1>").a(b)
for(s=b.gF(b);s.C();)this.E(0,s.gN())},
D(a){return A.kr(this,"{","}")},
br(a,b){return A.q6(this,b,A.m(this).c)},
bm(a,b){var s,r
A.aV(b,"index")
s=this.gF(this)
for(r=b;s.C();){if(r===0)return s.gN();--r}throw A.e(A.hV(b,b-r,this,null,"index"))},
$ix:1,
$if:1,
$ifE:1}
A.ha.prototype={}
A.mD.prototype={
$0(){var s,r
try{s=new TextDecoder("utf-8",{fatal:true})
return s}catch(r){}return null},
$S:13}
A.mC.prototype={
$0(){var s,r
try{s=new TextDecoder("utf-8",{fatal:false})
return s}catch(r){}return null},
$S:13}
A.mz.prototype={
bY(a){var s,r,q=a.length,p=A.b6(0,null,q),o=new Uint8Array(p)
for(s=0;s<p;++s){if(!(s<q))return A.a(a,s)
r=a.charCodeAt(s)
if((r&4294967040)!==0)throw A.e(A.jL(a,"string","Contains invalid characters."))
if(!(s<p))return A.a(o,s)
o[s]=r}return o}}
A.my.prototype={
bY(a){var s,r,q,p
t.L.a(a)
s=a.length
r=A.b6(0,null,s)
for(q=0;q<r;++q){if(!(q<s))return A.a(a,q)
p=a[q]
if((p&4294967040)!==0){if(!this.a)throw A.e(A.k4("Invalid value in input: "+p,null,null))
return this.jV(a,0,r)}}return A.d8(a,0,r)},
jV(a,b,c){var s,r,q,p
t.L.a(a)
for(s=a.length,r=b,q="";r<c;++r){if(!(r<s))return A.a(a,r)
p=a[r]
q+=A.e2((p&4294967040)!==0?65533:p)}return q.charCodeAt(0)==0?q:q}}
A.ds.prototype={}
A.hB.prototype={}
A.hC.prototype={}
A.ie.prototype={
cF(a){var s
t.L.a(a)
s=B.f6.bY(a)
return s}}
A.kE.prototype={}
A.kD.prototype={}
A.iR.prototype={
eN(a,b){t.L.a(a)
return(b===!0?B.pN:B.pM).bY(a)}}
A.lp.prototype={
bY(a){var s,r,q,p=a.length,o=A.b6(0,null,p)
if(o===0)return new Uint8Array(0)
s=new Uint8Array(o*3)
r=new A.mE(s)
if(r.kR(a,0,o)!==o){q=o-1
if(!(q>=0&&q<p))return A.a(a,q)
r.eJ()}return B.d.bJ(s,0,r.b)}}
A.mE.prototype={
eJ(){var s,r=this,q=r.c,p=r.b,o=r.b=p+1
q.$flags&2&&A.b(q)
s=q.length
if(!(p<s))return A.a(q,p)
q[p]=239
p=r.b=o+1
if(!(o<s))return A.a(q,o)
q[o]=191
r.b=p+1
if(!(p<s))return A.a(q,p)
q[p]=189},
mQ(a,b){var s,r,q,p,o,n=this
if((b&64512)===56320){s=65536+((a&1023)<<10)|b&1023
r=n.c
q=n.b
p=n.b=q+1
r.$flags&2&&A.b(r)
o=r.length
if(!(q<o))return A.a(r,q)
r[q]=s>>>18|240
q=n.b=p+1
if(!(p<o))return A.a(r,p)
r[p]=s>>>12&63|128
p=n.b=q+1
if(!(q<o))return A.a(r,q)
r[q]=s>>>6&63|128
n.b=p+1
if(!(p<o))return A.a(r,p)
r[p]=s&63|128
return!0}else{n.eJ()
return!1}},
kR(a,b,c){var s,r,q,p,o,n,m,l,k=this
if(b!==c){s=c-1
if(!(s>=0&&s<a.length))return A.a(a,s)
s=(a.charCodeAt(s)&64512)===55296}else s=!1
if(s)--c
for(s=k.c,r=s.$flags|0,q=s.length,p=a.length,o=b;o<c;++o){if(!(o<p))return A.a(a,o)
n=a.charCodeAt(o)
if(n<=127){m=k.b
if(m>=q)break
k.b=m+1
r&2&&A.b(s)
s[m]=n}else{m=n&64512
if(m===55296){if(k.b+4>q)break
m=o+1
if(!(m<p))return A.a(a,m)
if(k.mQ(n,a.charCodeAt(m)))o=m}else if(m===56320){if(k.b+3>q)break
k.eJ()}else if(n<=2047){m=k.b
l=m+1
if(l>=q)break
k.b=l
r&2&&A.b(s)
if(!(m<q))return A.a(s,m)
s[m]=n>>>6|192
k.b=l+1
s[l]=n&63|128}else{m=k.b
if(m+2>=q)break
l=k.b=m+1
r&2&&A.b(s)
if(!(m<q))return A.a(s,m)
s[m]=n>>>12|224
m=k.b=l+1
if(!(l<q))return A.a(s,l)
s[l]=n>>>6&63|128
k.b=m+1
if(!(m<q))return A.a(s,m)
s[m]=n&63|128}}}return o}}
A.iS.prototype={
bY(a){return new A.hh(this.a).eb(t.L.a(a),0,null,!0)}}
A.hh.prototype={
eb(a,b,c,d){var s,r,q,p,o,n,m,l=this
t.L.a(a)
s=A.b6(b,c,a.length)
if(b===s)return""
if(a instanceof Uint8Array){r=a
q=r
p=0}else{q=A.vO(a,b,s)
s-=b
p=b
b=0}if(s-b>=15){o=l.a
n=A.vN(o,q,b,s)
if(n!=null){if(!o)return n
if(n.indexOf("\ufffd")<0)return n}}n=l.ee(q,b,s,!0)
o=l.b
if((o&1)!==0){m=A.vP(o)
l.b=0
throw A.e(A.k4(m,a,p+l.c))}return n},
ee(a,b,c,d){var s,r,q=this
if(c-b>1000){s=B.a.P(b+c,2)
r=q.ee(a,b,s,!1)
if((q.b&1)!==0)return r
return r+q.ee(a,s,c,d)}return q.na(a,b,c,d)},
na(a,b,a0,a1){var s,r,q,p,o,n,m,l,k=this,j="AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFFFFFFFFFFFFFFFFGGGGGGGGGGGGGGGGHHHHHHHHHHHHHHHHHHHHHHHHHHHIHHHJEEBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBKCCCCCCCCCCCCDCLONNNMEEEEEEEEEEE",i=" \x000:XECCCCCN:lDb \x000:XECCCCCNvlDb \x000:XECCCCCN:lDb AAAAA\x00\x00\x00\x00\x00AAAAA00000AAAAA:::::AAAAAGG000AAAAA00KKKAAAAAG::::AAAAA:IIIIAAAAA000\x800AAAAA\x00\x00\x00\x00 AAAAA",h=65533,g=k.b,f=k.c,e=new A.fH(""),d=b+1,c=a.length
if(!(b>=0&&b<c))return A.a(a,b)
s=a[b]
A:for(r=k.a;;){for(;;d=o){if(!(s>=0&&s<256))return A.a(j,s)
q=j.charCodeAt(s)&31
f=g<=32?s&61694>>>q:(s&63|f<<6)>>>0
p=g+q
if(!(p>=0&&p<144))return A.a(i,p)
g=i.charCodeAt(p)
if(g===0){p=A.e2(f)
e.a+=p
if(d===a0)break A
break}else if((g&1)!==0){if(r)switch(g){case 69:case 67:p=A.e2(h)
e.a+=p
break
case 65:p=A.e2(h)
e.a+=p;--d
break
default:p=A.e2(h)
e.a=(e.a+=p)+p
break}else{k.b=g
k.c=d-1
return""}g=0}if(d===a0)break A
o=d+1
if(!(d>=0&&d<c))return A.a(a,d)
s=a[d]}o=d+1
if(!(d>=0&&d<c))return A.a(a,d)
s=a[d]
if(s<128){for(;;){if(!(o<a0)){n=a0
break}m=o+1
if(!(o>=0&&o<c))return A.a(a,o)
s=a[o]
if(s>=128){n=m-1
o=m
break}o=m}if(n-d<20)for(l=d;l<n;++l){if(!(l<c))return A.a(a,l)
p=A.e2(a[l])
e.a+=p}else{p=A.d8(a,d,n)
e.a+=p}if(n===a0)break A
d=o}else d=o}if(a1&&g>32)if(r){c=A.e2(h)
e.a+=c}else{k.b=77
k.c=a0
return""}k.b=g
k.c=f
c=e.a
return c.charCodeAt(0)==0?c:c}}
A.bA.prototype={
a_(a,b){if(b==null)return!1
return b instanceof A.bA&&this.a===b.a},
gK(a){return B.a.gK(this.a)},
cb(a,b){return B.a.cb(this.a,t.jS.a(b).a)},
D(a){var s,r,q,p,o,n=this.a,m=B.a.P(n,36e8),l=n%36e8
if(n<0){m=0-m
n=0-l
s="-"}else{n=l
s=""}r=B.a.P(n,6e7)
n%=6e7
q=r<10?"0":""
p=B.a.P(n,1e6)
o=p<10?"0":""
return s+m+":"+q+r+":"+o+p+"."+B.h.dT(B.a.D(n%1e6),6,"0")},
$ibj:1}
A.m9.prototype={
D(a){return this.a8()}}
A.a3.prototype={
gdm(){return A.ug(this)}}
A.hs.prototype={
D(a){var s=this.a
if(s!=null)return"Assertion failed: "+A.jX(s)
return"Assertion failed"}}
A.bZ.prototype={}
A.bg.prototype={
gei(){return"Invalid argument"+(!this.a?"(s)":"")},
geh(){return""},
D(a){var s=this,r=s.c,q=r==null?"":" ("+r+")",p=s.d,o=p==null?"":": "+A.A(p),n=s.gei()+q+o
if(!s.a)return n
return n+s.geh()+": "+A.jX(s.geR())},
geR(){return this.b}}
A.bV.prototype={
geR(){return A.qE(this.b)},
gei(){return"RangeError"},
geh(){var s,r=this.e,q=this.f
if(r==null)s=q!=null?": Not less than or equal to "+A.A(q):""
else if(q==null)s=": Not greater than or equal to "+A.A(r)
else if(q>r)s=": Not in inclusive range "+A.A(r)+".."+A.A(q)
else s=q<r?": Valid value range is empty":": Only valid value is "+A.A(r)
return s}}
A.hU.prototype={
geR(){return A.r(this.b)},
gei(){return"RangeError"},
geh(){if(A.r(this.b)<0)return": index must not be negative"
var s=this.f
if(s===0)return": no indices are valid"
return": index should be less than "+s},
$ibV:1,
gp(a){return this.f}}
A.fL.prototype={
D(a){return"Unsupported operation: "+this.a}}
A.iP.prototype={
D(a){return"UnimplementedError: "+this.a}}
A.e7.prototype={
D(a){return"Bad state: "+this.a}}
A.hz.prototype={
D(a){var s=this.a
if(s==null)return"Concurrent modification during iteration."
return"Concurrent modification during iteration: "+A.jX(s)+"."}}
A.ij.prototype={
D(a){return"Out of Memory"},
gdm(){return null},
$ia3:1}
A.fG.prototype={
D(a){return"Stack Overflow"},
gdm(){return null},
$ia3:1}
A.ma.prototype={
D(a){return"Exception: "+this.a}}
A.bO.prototype={
D(a){var s,r,q,p,o,n,m,l,k,j,i,h=this.a,g=""!==h?"FormatException: "+h:"FormatException",f=this.c,e=this.b
if(typeof e=="string"){if(f!=null)s=f<0||f>e.length
else s=!1
if(s)f=null
if(f==null){if(e.length>78)e=B.h.cr(e,0,75)+"..."
return g+"\n"+e}for(r=e.length,q=1,p=0,o=!1,n=0;n<f;++n){if(!(n<r))return A.a(e,n)
m=e.charCodeAt(n)
if(m===10){if(p!==n||!o)++q
p=n+1
o=!1}else if(m===13){++q
p=n+1
o=!0}}g=q>1?g+(" (at line "+q+", character "+(f-p+1)+")\n"):g+(" (at character "+(f+1)+")\n")
for(n=f;n<r;++n){if(!(n>=0))return A.a(e,n)
m=e.charCodeAt(n)
if(m===10||m===13){r=n
break}}l=""
if(r-p>78){k="..."
if(f-p<75){j=p+75
i=p}else{if(r-f<75){i=r-75
j=r
k=""}else{i=f-36
j=f+36}l="..."}}else{j=r
i=p
k=""}return g+l+B.h.cr(e,i,j)+k+"\n"+B.h.cL(" ",f-i+l.length)+"^\n"}else return f!=null?g+(" (at offset "+A.A(f)+")"):g}}
A.f.prototype={
dV(a,b){var s=A.m(this).n("f.E")
if(b)s=A.t(this,s)
else{s=A.t(this,s)
s.$flags=1
s=s}return s},
gp(a){var s,r=this.gF(this)
for(s=0;r.C();)++s
return s},
br(a,b){return A.q6(this,b,A.m(this).n("f.E"))},
bm(a,b){var s,r
A.aV(b,"index")
s=this.gF(this)
for(r=b;s.C();){if(r===0)return s.gN();--r}throw A.e(A.hV(b,b-r,this,null,"index"))},
D(a){return A.tQ(this,"(",")")}}
A.cr.prototype={
D(a){return"MapEntry("+A.A(this.a)+": "+A.A(this.b)+")"}}
A.au.prototype={
gK(a){return A.S.prototype.gK.call(this,0)},
D(a){return"null"}}
A.S.prototype={$iS:1,
a_(a,b){return this===b},
gK(a){return A.fz(this)},
D(a){return"Instance of '"+A.iv(this)+"'"},
gaX(a){return A.xJ(this)},
toString(){return this.D(this)}}
A.je.prototype={
D(a){return""},
$icw:1}
A.fH.prototype={
gp(a){return this.a.length},
D(a){var s=this.a
return s.charCodeAt(0)==0?s:s}}
A.hF.prototype={
D(a){return"Expando:null"}}
A.hD.prototype={}
A.ke.prototype={
j6(a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=this,a0=a1.length
for(s=0;s<a0;++s){r=a1[s]
if(r>a.b)a.b=r
if(r<a.c)a.c=r}r=a.b
if(r>15)throw A.e(B.eV)
q=r+1
p=new Uint16Array(q)
for(o=0;o<a0;++o){n=a1[o]
if(n!==0){if(!(n>=0&&n<q))return A.a(p,n)
m=p[n]
if(!(n<q))return A.a(p,n)
p[n]=m+1}}for(l=1,k=1;k<=r;++k){l=(l<<1>>>0)-p[k]
if(l<0)throw A.e(B.eX)}if(l>0)q=r>(a2?0:1)
else q=!1
if(q)throw A.e(B.eW)
j=B.a.U(1,r)
r=a.a=new Uint32Array(j)
for(q=a.b,m=a1.length,i=1,h=0,g=2;i<=q;){for(f=i<<16,s=0;s<a0;++s){if(!(s<m))return A.a(a1,s)
if(a1[s]===i){for(e=h,d=0,c=0;c<i;++c){d=(d<<1|e&1)>>>0
e=e>>>1}for(b=(f|s)>>>0,c=d;c<j;c+=g){if(!(c>=0&&c<j))return A.a(r,c)
r[c]=b}++h}}++i
h=h<<1>>>0
g=g<<1>>>0}}}
A.eY.prototype={
a8(){return"InflateFormat."+this.b}}
A.eX.prototype={
gns(){var s,r=this.x
if(r==null)return 32768
s=r.e+r.f-this.y
return s>32768?s:32768},
n9(a){var s,r,q,p,o,n,m,l,k=this,j="Truncated zlib stream"
switch(k.w.a){case 0:s=k.a
r=s.c
q=s.d
q===$&&A.c()
if(r>=q){if(k.e===0&&k.b!==B.f_)throw A.e(A.aY("Empty input is not a "+k.b.b+" stream"))
k.w=B.dW
return!1}if(k.b===B.bz)if(!k.lZ()){if(k.e!==0)throw A.e(A.aY("Data after the last gzip member"))
s.c=r
k.b=B.aj}if(k.b===B.aj){if(s.gp(0)<2)A.a9(A.aY(j))
p=s.H()
o=s.H()
if((p&15)!==8)A.a9(A.aY("Only deflate compression is supported"))
if(B.a.a1(p*256+o,31)!==0)A.a9(A.aY("Invalid zlib header"))
if((o&32)!==0)A.a9(A.aY("zlib preset dictionaries are not supported"))}k.f=a.e+a.f
k.r=k.b===B.aj?1:0
k.d=new A.kq(s,a)
k.w=B.pT
return!0
case 1:if(!k.d.nu())k.w=B.pU
k.x=null
return!0
case 2:s=k.b
if(s===B.bz){s=k.a
if(s.gp(0)<8)throw A.e(A.aY("Truncated gzip stream"))
s.k()
n=s.k()
if(B.a.a1(a.e+a.f-k.f,4294967296)!==n)throw A.e(A.aY("gzip member length does not match"))}else if(s===B.aj){s=k.a
if(s.gp(0)<4)throw A.e(A.aY(j))
for(m=0,l=0;l<4;++l){r=s.b
r.toString
q=s.c++
if(!(q>=0&&q<r.length))return A.a(r,q)
m=m<<8|r[q]}}++k.e
s=k.b===B.bz
k.w=s?B.bX:B.dW
return s
case 3:return!1}},
lZ(){var s,r,q=this.a
if(q.gp(0)<10)return!1
if(q.m()!==35615)return!1
if(q.H()!==8)return!1
s=q.H()
q.k()
q.H()
q.H()
if((s&4)!==0){if(q.gp(0)<2)return!1
r=q.m()
if(q.gp(0)<r)return!1
q.br(0,r)}if((s&8)!==0&&!this.hm())return!1
if((s&16)!==0&&!this.hm())return!1
if((s&2)!==0){if(q.gp(0)<2)return!1
q.m()}return!0},
hm(){var s,r,q=this.a
for(;;){s=q.c
r=q.d
r===$&&A.c()
if(!(s<r))break
r=q.b
r.toString
q.c=s+1
if(!(s>=0&&s<r.length))return A.a(r,s)
if(r[s]===0)return!0}return!1},
$itl:1}
A.ee.prototype={
a8(){return"_State."+this.b}}
A.m2.prototype={}
A.mG.prototype={
i5(a,b,c){var s
t.L.a(a)
s=A.ua(B.au)
this.ni(A.hW(a,B.ac,null,null),s,b,!1,c)
return J.F(B.d.gt(s.c),s.c.byteOffset,s.b)},
ni(a,b,c,d,e){var s=b.a
b.a=B.au
try{this.mS(a,b,c,e)}finally{b.smZ(s)}},
mS(a,b,c,d){var s,r,q,p,o,n,m,l,k,j
if(d===8)s=9
else s=d
r=(s-8<<4|8)>>>0
b.u(r)
q=r*256
for(p=0;o=(p|0)>>>0,B.a.a1(q+o,31)!==0;)++p
b.u(o)
n=a.c
m=A.xG(a)
a.c=n
o=c==null?6:c
A.tu(a,o,b,d)
o=m&255
l=m>>>24&255
k=m>>>16&255
j=m>>>8&255
if(b.a===B.au){b.u(l)
b.u(k)
b.u(j)
b.u(o)}else{b.u(o)
b.u(j)
b.u(k)
b.u(l)}}}
A.eb.prototype={
a8(){return"_DeflateFlushMode."+this.b}}
A.jU.prototype={
la(a,b){var s,r,q,p,o,n=this
if(b===8)b=9
s=!0
if(b>=9)if(b<=15)s=a>9
if(s)throw A.e(A.aJ("Invalid Deflate parameters",null))
r=n.kY(a)
if(r==null)return!1
$.cf.b=r
s=new Uint16Array(1146)
n.p1=s
q=new Uint16Array(122)
n.p2=q
p=new Uint16Array(78)
n.p3=p
n.as=b
o=n.Q=B.a.O(1,b)
n.at=o-1
n.db=15
n.cy=32768
n.dx=32767
n.dy=5
n.ax=new Uint8Array(o*2)
n.ch=new Uint16Array(o)
n.CW=new Uint16Array(32768)
n.y1=16384
n.f=new Uint8Array(65536)
n.r=65536
n.bN=16384
n.xr=49152
n.k4=a
n.w=n.x=n.ok=0
n.c=113
n.d=0
o=n.p4
o.a=s
o.c=$.rM()
o=n.R8
o.a=q
o.c=$.rL()
o=n.RG
o.a=p
o.c=$.rK()
n.bn=n.aZ=0
n.c_=8
n.fV()
n.ay=2*n.Q
B.v.V(n.CW,0,n.cy,0)
n.k2=n.fr=n.id=0
n.fx=n.k3=2
n.cx=n.go=0
return!0},
kx(a){var s,r,q,p,o=this,n=o.x
n===$&&A.c()
if(n!==0)o.en()
n=o.a
s=n.c
n=n.d
n===$&&A.c()
r=!0
if(s>=n){n=o.k2
n===$&&A.c()
if(n===0)n=a!==B.bd&&o.c!==666
else n=r}else n=r
if(n){switch($.cf.cV().e){case 0:q=o.kA(a)
break
case 1:q=o.ky(a)
break
case 2:q=o.kz(a)
break
default:q=-1
break}n=q===2
if(n||q===3)o.c=666
if(q===0||n)return 0
if(q===1){if(a===B.pR){o.aP(2,3)
o.cB(256,B.b0)
o.hU()
n=o.c_
n===$&&A.c()
s=o.bn
s===$&&A.c()
if(1+n+10-s<9){o.aP(2,3)
o.cB(256,B.b0)
o.hU()}o.c_=7}else{o.hs(0,0,!1)
if(a===B.pS){n=o.cy
n===$&&A.c()
s=o.CW
p=0
for(;p<n;++p){s===$&&A.c()
s.$flags&2&&A.b(s)
if(!(p<s.length))return A.a(s,p)
s[p]=0}}}o.en()}}if(a!==B.aJ)return 0
return 1},
fV(){var s=this,r=s.p1
r===$&&A.c()
B.v.V(r,0,572,0)
r=s.p2
r===$&&A.c()
B.v.V(r,0,60,0)
r=s.p3
r===$&&A.c()
B.v.V(r,0,38,0)
r=s.p1
r.$flags&2&&A.b(r)
r[512]=1
s.y2=s.co=s.aV=s.bO=0},
eB(a,b){var s,r,q,p,o,n,m=this.ry
if(!(b>=0&&b<573))return A.a(m,b)
s=m[b]
r=b<<1>>>0
q=m.$flags|0
p=this.x2
for(;;){o=this.to
o===$&&A.c()
if(!(r<=o))break
if(r<o){o=r+1
if(!(o>=0&&o<573))return A.a(m,o)
o=m[o]
if(!(r>=0&&r<573))return A.a(m,r)
o=A.ph(a,o,m[r],p)}else o=!1
if(o)++r
if(!(r>=0&&r<573))return A.a(m,r)
if(A.ph(a,s,m[r],p))break
o=m[r]
q&2&&A.b(m)
if(!(b>=0&&b<573))return A.a(m,b)
m[b]=o
n=r<<1>>>0
b=r
r=n}q&2&&A.b(m)
if(!(b>=0&&b<573))return A.a(m,b)
m[b]=s},
hg(a,b){var s,r,q,p,o,n,m,l,k,j,i,h=a.length
if(1>=h)return A.a(a,1)
s=a[1]
if(s===0){r=138
q=3}else{r=7
q=4}p=(b+1)*2+1
a.$flags&2&&A.b(a)
if(!(p>=0&&p<h))return A.a(a,p)
a[p]=65535
for(p=this.p3,o=0,n=-1,m=0;o<=b;s=k){++o
l=o*2+1
if(!(l<h))return A.a(a,l)
k=a[l];++m
if(m<r&&s===k)continue
else{j=3
if(m<q){p===$&&A.c()
l=s*2
if(!(l<78))return A.a(p,l)
i=p[l]
p.$flags&2&&A.b(p)
p[l]=i+m}else if(s!==0){if(s!==n){p===$&&A.c()
l=s*2
if(!(l<78))return A.a(p,l)
i=p[l]
p.$flags&2&&A.b(p)
p[l]=i+1}p===$&&A.c()
l=p[32]
p.$flags&2&&A.b(p)
p[32]=l+1}else if(m<=10){p===$&&A.c()
l=p[34]
p.$flags&2&&A.b(p)
p[34]=l+1}else{p===$&&A.c()
l=p[36]
p.$flags&2&&A.b(p)
p[36]=l+1}}if(k===0){q=j
r=138}else if(s===k){q=j
r=6}else{r=7
q=4}n=s
m=0}},
jE(){var s,r,q=this,p=q.p1
p===$&&A.c()
s=q.p4.b
s===$&&A.c()
q.hg(p,s)
s=q.p2
s===$&&A.c()
p=q.R8.b
p===$&&A.c()
q.hg(s,p)
q.RG.e5(q)
for(p=q.p3,r=18;r>=3;--r){p===$&&A.c()
s=B.b8[r]*2+1
if(!(s<78))return A.a(p,s)
if(p[s]!==0)break}p=q.aV
p===$&&A.c()
q.aV=p+(3*(r+1)+5+5+4)
return r},
mn(a,b,c){var s,r,q,p,o=this
o.aP(a-257,5)
s=b-1
o.aP(s,5)
o.aP(c-4,4)
for(r=0;r<c;++r){q=o.p3
q===$&&A.c()
if(!(r<19))return A.a(B.b8,r)
p=B.b8[r]*2+1
if(!(p<78))return A.a(q,p)
o.aP(q[p],3)}q=o.p1
q===$&&A.c()
o.hh(q,a-1)
q=o.p2
q===$&&A.c()
o.hh(q,s)},
hh(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this,e=a.length
if(1>=e)return A.a(a,1)
s=a[1]
if(s===0){r=138
q=3}else{r=7
q=4}for(p=t.L,o=0,n=-1,m=0;o<=b;s=k){++o
l=o*2+1
if(!(l<e))return A.a(a,l)
k=a[l];++m
if(m<r&&s===k)continue
else{j=3
if(m<q){l=s*2
i=l+1
do{h=f.p3
h===$&&A.c()
p.a(h)
if(!(l<78))return A.a(h,l)
g=h[l]
if(!(i<78))return A.a(h,i)
f.aP(g&65535,h[i]&65535)}while(--m,m!==0)}else if(s!==0){if(s!==n){l=f.p3
l===$&&A.c()
p.a(l)
i=s*2
if(!(i<78))return A.a(l,i)
h=l[i];++i
if(!(i<78))return A.a(l,i)
f.aP(h&65535,l[i]&65535);--m}l=f.p3
l===$&&A.c()
p.a(l)
f.aP(l[32]&65535,l[33]&65535)
f.aP(m-3,2)}else{l=f.p3
if(m<=10){l===$&&A.c()
p.a(l)
f.aP(l[34]&65535,l[35]&65535)
f.aP(m-3,3)}else{l===$&&A.c()
p.a(l)
f.aP(l[36]&65535,l[37]&65535)
f.aP(m-11,7)}}}if(k===0){q=j
r=138}else if(s===k){q=j
r=6}else{r=7
q=4}n=s
m=0}},
lP(a,b,c){var s,r,q=this
if(c===0)return
s=q.f
s===$&&A.c()
r=q.x
r===$&&A.c()
B.d.a3(s,r,r+c,a,b)
q.x=q.x+c},
bs(a){var s,r=this.f
r===$&&A.c()
s=this.x
s===$&&A.c()
this.x=s+1
r.$flags&2&&A.b(r)
if(!(s>=0&&s<r.length))return A.a(r,s)
r[s]=a},
cB(a,b){var s,r,q
t.L.a(b)
s=a*2
r=b.length
if(!(s<r))return A.a(b,s)
q=b[s];++s
if(!(s<r))return A.a(b,s)
this.aP(q&65535,b[s]&65535)},
aP(a,b){var s,r=this,q=r.bn
q===$&&A.c()
s=r.aZ
if(q>16-b){s===$&&A.c()
q=r.aZ=(s|B.a.U(a,q)&65535)>>>0
r.bs(q)
r.bs(A.aN(q,8))
r.aZ=A.aN(a,16-r.bn)
r.bn=r.bn+(b-16)}else{s===$&&A.c()
r.aZ=(s|B.a.U(a,q)&65535)>>>0
r.bn=q+b}},
cY(a,b){var s,r,q,p,o,n=this,m=n.f
m===$&&A.c()
s=n.bN
s===$&&A.c()
r=n.y2
r===$&&A.c()
r=s+r*2
s=A.aN(a,8)
m.$flags&2&&A.b(m)
if(!(r<m.length))return A.a(m,r)
m[r]=s
s=n.f
r=n.bN
m=n.y2
r=r+m*2+1
s.$flags&2&&A.b(s)
q=s.length
if(!(r<q))return A.a(s,r)
s[r]=a
r=n.xr
r===$&&A.c()
r+=m
if(!(r<q))return A.a(s,r)
s[r]=b
n.y2=m+1
if(a===0){m=n.p1
m===$&&A.c()
s=b*2
if(!(s>=0&&s<1146))return A.a(m,s)
r=m[s]
m.$flags&2&&A.b(m)
m[s]=r+1}else{m=n.co
m===$&&A.c()
n.co=m+1
m=n.p1
m===$&&A.c()
if(!(b>=0&&b<256))return A.a(B.bF,b)
s=(B.bF[b]+256+1)*2
if(!(s<1146))return A.a(m,s)
r=m[s]
m.$flags&2&&A.b(m)
m[s]=r+1
r=n.p2
r===$&&A.c()
s=A.qm(a-1)*2
if(!(s<122))return A.a(r,s)
m=r[s]
r.$flags&2&&A.b(r)
r[s]=m+1}m=n.y2
if((m&8191)===0){s=n.k4
s===$&&A.c()
s=s>2}else s=!1
if(s){p=m*8
m=n.id
m===$&&A.c()
s=n.fr
s===$&&A.c()
for(r=n.p2,o=0;o<30;++o){r===$&&A.c()
q=o*2
if(!(q<122))return A.a(r,q)
p+=r[q]*(5+B.an[o])}p=A.aN(p,3)
r=n.co
r===$&&A.c()
q=n.y2
if(r<q/2&&p<(m-s)/2)return!0
m=q}s=n.y1
s===$&&A.c()
return m===s-1},
fw(a,b){var s,r,q,p,o,n,m,l,k=this,j=t.L
j.a(a)
j.a(b)
j=k.y2
j===$&&A.c()
if(j!==0){s=0
do{j=k.f
j===$&&A.c()
r=k.bN
r===$&&A.c()
r+=s*2
q=j.length
if(!(r<q))return A.a(j,r)
p=j[r];++r
if(!(r<q))return A.a(j,r)
o=p<<8&65280|j[r]&255
r=k.xr
r===$&&A.c()
r+=s
if(!(r<q))return A.a(j,r)
n=j[r]&255;++s
if(o===0)k.cB(n,a)
else{m=B.bF[n]
k.cB(m+256+1,a)
if(!(m<29))return A.a(B.bC,m)
l=B.bC[m]
if(l!==0)k.aP(n-B.fI[m],l);--o
m=A.qm(o)
k.cB(m,b)
if(!(m<30))return A.a(B.an,m)
l=B.an[m]
if(l!==0)k.aP(o-B.i2[m],l)}}while(s<k.y2)}k.cB(256,a)
if(513>=a.length)return A.a(a,513)
k.c_=a[513]},
iO(){var s,r,q,p,o
for(s=this.p1,r=0,q=0;r<7;){s===$&&A.c()
p=r*2
if(!(p<1146))return A.a(s,p)
q+=s[p];++r}for(o=0;r<128;){s===$&&A.c()
p=r*2
if(!(p<1146))return A.a(s,p)
o+=s[p];++r}while(r<256){s===$&&A.c()
p=r*2
if(!(p<1146))return A.a(s,p)
q+=s[p];++r}this.y=q>A.aN(o,2)?0:1},
hU(){var s=this,r=s.bn
r===$&&A.c()
if(r===16){r=s.aZ
r===$&&A.c()
s.bs(r)
s.bs(A.aN(r,8))
s.bn=s.aZ=0}else if(r>=8){r=s.aZ
r===$&&A.c()
s.bs(r)
s.aZ=A.aN(s.aZ,8)
s.bn=s.bn-8}},
fl(){var s=this,r=s.bn
r===$&&A.c()
if(r>8){r=s.aZ
r===$&&A.c()
s.bs(r)
s.bs(A.aN(r,8))}else if(r>0){r=s.aZ
r===$&&A.c()
s.bs(r)}s.bn=s.aZ=0},
c4(a){var s,r,q,p,o,n=this,m=n.fr
m===$&&A.c()
if(m>=0)s=m
else s=-1
r=n.id
r===$&&A.c()
m=r-m
r=n.k4
r===$&&A.c()
if(r>0){if(n.y===2)n.iO()
n.p4.e5(n)
n.R8.e5(n)
q=n.jE()
r=n.aV
r===$&&A.c()
p=A.aN(r+3+7,3)
r=n.bO
r===$&&A.c()
o=A.aN(r+3+7,3)
if(o<=p)p=o}else{o=m+5
p=o
q=0}if(m+4<=p&&s!==-1)n.hs(s,m,a)
else if(o===p){n.aP(2+(a?1:0),3)
n.fw(B.b0,B.d6)}else{n.aP(4+(a?1:0),3)
m=n.p4.b
m===$&&A.c()
s=n.R8.b
s===$&&A.c()
n.mn(m+1,s+1,q+1)
s=n.p1
s===$&&A.c()
m=n.p2
m===$&&A.c()
n.fw(s,m)}n.fV()
if(a)n.fl()
n.fr=n.id
n.en()},
kA(a){var s,r,q,p,o,n=this,m=n.r
m===$&&A.c()
s=m-5
s=65535>s?s:65535
for(m=a===B.bd;;){r=n.k2
r===$&&A.c()
if(r<=1){n.ek()
r=n.k2
q=r===0
if(q&&m)return 0
if(q)break}q=n.id
q===$&&A.c()
r=n.id=q+r
n.k2=0
q=n.fr
q===$&&A.c()
p=q+s
if(r>=p){n.k2=r-p
n.id=p
n.c4(!1)}r=n.id
q=n.fr
o=n.Q
o===$&&A.c()
if(r-q>=o-262)n.c4(!1)}m=a===B.aJ
n.c4(m)
return m?3:1},
hs(a,b,c){var s,r=this
r.aP(c?1:0,3)
r.fl()
r.c_=8
r.bs(b)
r.bs(A.aN(b,8))
s=(~b>>>0)+65536&65535
r.bs(s)
r.bs(A.aN(s,8))
s=r.ax
s===$&&A.c()
r.lP(s,a,b)},
ek(){var s,r,q,p,o,n,m,l,k,j,i,h=this,g=h.a
do{s=h.ay
s===$&&A.c()
r=h.k2
r===$&&A.c()
q=h.id
q===$&&A.c()
p=s-r-q
if(p===0&&q===0&&r===0){s=h.Q
s===$&&A.c()
p=s}else{s=h.Q
s===$&&A.c()
if(q>=s+s-262){r=h.ax
r===$&&A.c()
B.d.a3(r,0,s,r,s)
s=h.k1
o=h.Q
h.k1=s-o
h.id=h.id-o
s=h.fr
s===$&&A.c()
h.fr=s-o
s=h.cy
s===$&&A.c()
r=h.CW
r===$&&A.c()
q=r.length
n=r.$flags|0
m=s
l=m
do{--m
if(!(m>=0&&m<q))return A.a(r,m)
k=r[m]&65535
s=k>=o?k-o:0
n&2&&A.b(r)
r[m]=s}while(--l,l!==0)
s=h.ch
s===$&&A.c()
r=s.length
q=s.$flags|0
m=o
l=m
do{--m
if(!(m>=0&&m<r))return A.a(s,m)
k=s[m]&65535
n=k>=o?k-o:0
q&2&&A.b(s)
s[m]=n}while(--l,l!==0)
p+=o}}s=g.c
r=g.d
r===$&&A.c()
if(s>=r)return
s=h.ax
s===$&&A.c()
l=h.lU(s,h.id+h.k2,p)
s=h.k2=h.k2+l
if(s>=3){r=h.ax
q=h.id
n=r.length
if(q>>>0!==q||q>=n)return A.a(r,q)
j=r[q]&255
h.cx=j
i=h.dy
i===$&&A.c()
i=B.a.U(j,i);++q
if(!(q<n))return A.a(r,q)
q=r[q]
r=h.dx
r===$&&A.c()
h.cx=((i^q&255)&r)>>>0}}while(s<262&&!(g.c>=g.d))},
ky(a){var s,r,q,p,o,n,m,l,k,j,i=this
for(s=a===B.bd,r=0;;){q=i.k2
q===$&&A.c()
if(q<262){i.ek()
q=i.k2
if(q<262&&s)return 0
if(q===0)break}if(q>=3){q=i.cx
q===$&&A.c()
p=i.dy
p===$&&A.c()
p=B.a.U(q,p)
q=i.ax
q===$&&A.c()
o=i.id
o===$&&A.c()
n=o+2
if(!(n>=0&&n<q.length))return A.a(q,n)
n=q[n]
q=i.dx
q===$&&A.c()
q=((p^n&255)&q)>>>0
i.cx=q
n=i.CW
n===$&&A.c()
if(!(q<n.length))return A.a(n,q)
p=n[q]
r=p&65535
m=i.ch
m===$&&A.c()
l=i.at
l===$&&A.c()
l=(o&l)>>>0
m.$flags&2&&A.b(m)
if(!(l>=0&&l<m.length))return A.a(m,l)
m[l]=p
n.$flags&2&&A.b(n)
n[q]=o}if(r!==0){q=i.id
q===$&&A.c()
p=i.Q
p===$&&A.c()
p=(q-r&65535)<=p-262
q=p}else q=!1
if(q){q=i.ok
q===$&&A.c()
if(q!==2)i.fx=i.h_(r)}q=i.fx
q===$&&A.c()
p=i.id
if(q>=3){p===$&&A.c()
k=i.cY(p-i.k1,q-3)
q=i.k2
p=i.fx
q-=p
i.k2=q
o=$.cf.b
if(o===$.cf)A.a9(A.kC(""))
if(p<=o.b&&q>=3){q=i.fx=p-1
do{p=i.id=i.id+1
o=i.cx
o===$&&A.c()
n=i.dy
n===$&&A.c()
n=B.a.U(o,n)
o=i.ax
o===$&&A.c()
m=p+2
if(!(m>=0&&m<o.length))return A.a(o,m)
m=o[m]
o=i.dx
o===$&&A.c()
o=((n^m&255)&o)>>>0
i.cx=o
m=i.CW
m===$&&A.c()
if(!(o<m.length))return A.a(m,o)
n=m[o]
r=n&65535
l=i.ch
l===$&&A.c()
j=i.at
j===$&&A.c()
j=(p&j)>>>0
l.$flags&2&&A.b(l)
if(!(j>=0&&j<l.length))return A.a(l,j)
l[j]=n
m.$flags&2&&A.b(m)
m[o]=p}while(q=i.fx=q-1,q!==0)
i.id=p+1}else{q=i.id=i.id+p
i.fx=0
p=i.ax
p===$&&A.c()
o=p.length
if(!(q>=0&&q<o))return A.a(p,q)
n=p[q]&255
i.cx=n
m=i.dy
m===$&&A.c()
m=B.a.U(n,m);++q
if(!(q<o))return A.a(p,q)
q=p[q]
p=i.dx
p===$&&A.c()
i.cx=((m^q&255)&p)>>>0}}else{q=i.ax
q===$&&A.c()
p===$&&A.c()
if(!(p>=0&&p<q.length))return A.a(q,p)
k=i.cY(0,q[p]&255)
i.k2=i.k2-1
i.id=i.id+1}if(k)i.c4(!1)}s=a===B.aJ
i.c4(s)
return s?3:1},
kz(a){var s,r,q,p,o,n,m,l,k,j,i,h=this
for(s=a===B.bd,r=0;;){q=h.k2
q===$&&A.c()
if(q<262){h.ek()
q=h.k2
if(q<262&&s)return 0
if(q===0)break}if(q>=3){q=h.cx
q===$&&A.c()
p=h.dy
p===$&&A.c()
p=B.a.U(q,p)
q=h.ax
q===$&&A.c()
o=h.id
o===$&&A.c()
n=o+2
if(!(n>=0&&n<q.length))return A.a(q,n)
n=q[n]
q=h.dx
q===$&&A.c()
q=((p^n&255)&q)>>>0
h.cx=q
n=h.CW
n===$&&A.c()
if(!(q<n.length))return A.a(n,q)
p=n[q]
r=p&65535
m=h.ch
m===$&&A.c()
l=h.at
l===$&&A.c()
l=(o&l)>>>0
m.$flags&2&&A.b(m)
if(!(l>=0&&l<m.length))return A.a(m,l)
m[l]=p
n.$flags&2&&A.b(n)
n[q]=o}q=h.fx
q===$&&A.c()
h.k3=q
h.fy=h.k1
h.fx=2
p=!1
if(r!==0){o=$.cf.b
if(o===$.cf)A.a9(A.kC(""))
if(q<o.b){q=h.id
q===$&&A.c()
p=h.Q
p===$&&A.c()
p=(q-r&65535)<=p-262
q=p}else q=p}else q=p
p=2
if(q){q=h.ok
q===$&&A.c()
if(q!==2){q=h.h_(r)
h.fx=q}else q=p
o=!1
if(q<=5)if(h.ok!==1){if(q===3){o=h.id
o===$&&A.c()
o=o-h.k1>4096}}else o=!0
if(o){h.fx=2
q=p}}else q=p
p=h.k3
if(p>=3&&q<=p){q=h.id
q===$&&A.c()
k=q+h.k2-3
j=h.cY(q-1-h.fy,p-3)
p=h.k2
q=h.k3
h.k2=p-(q-1)
q=h.k3=q-2
do{p=h.id=h.id+1
if(p<=k){o=h.cx
o===$&&A.c()
n=h.dy
n===$&&A.c()
n=B.a.U(o,n)
o=h.ax
o===$&&A.c()
m=p+2
if(!(m>=0&&m<o.length))return A.a(o,m)
m=o[m]
o=h.dx
o===$&&A.c()
o=((n^m&255)&o)>>>0
h.cx=o
m=h.CW
m===$&&A.c()
if(!(o<m.length))return A.a(m,o)
n=m[o]
r=n&65535
l=h.ch
l===$&&A.c()
i=h.at
i===$&&A.c()
i=(p&i)>>>0
l.$flags&2&&A.b(l)
if(!(i>=0&&i<l.length))return A.a(l,i)
l[i]=n
m.$flags&2&&A.b(m)
m[o]=p}}while(q=h.k3=q-1,q!==0)
h.go=0
h.fx=2
h.id=p+1
if(j)h.c4(!1)}else{q=h.go
q===$&&A.c()
if(q!==0){q=h.ax
q===$&&A.c()
p=h.id
p===$&&A.c();--p
if(!(p>=0&&p<q.length))return A.a(q,p)
if(h.cY(0,q[p]&255))h.c4(!1)
h.id=h.id+1
h.k2=h.k2-1}else{h.go=1
q=h.id
q===$&&A.c()
h.id=q+1
h.k2=h.k2-1}}}s=h.go
s===$&&A.c()
if(s!==0){s=h.ax
s===$&&A.c()
q=h.id
q===$&&A.c();--q
if(!(q>=0&&q<s.length))return A.a(s,q)
h.cY(0,s[q]&255)
h.go=0}s=a===B.aJ
h.c4(s)
return s?3:1},
h_(a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=this,b=$.cf.cV().d,a=c.id
a===$&&A.c()
s=c.k3
s===$&&A.c()
r=c.Q
r===$&&A.c()
r-=262
q=a>r?a-r:0
p=$.cf.cV().c
r=c.at
r===$&&A.c()
o=c.id+258
n=c.ax
n===$&&A.c()
m=a+s
l=m-1
k=n.length
if(!(l>=0&&l<k))return A.a(n,l)
j=n[l]
if(!(m>=0&&m<k))return A.a(n,m)
i=n[m]
if(c.k3>=$.cf.cV().a)b=b>>>2
n=c.k2
n===$&&A.c()
if(p>n)p=n
h=o-258
g=s
f=a
do{A:{a=c.ax
s=a0+g
n=a.length
if(!(s>=0&&s<n))return A.a(a,s)
m=!0
if(a[s]===i){--s
if(!(s>=0))return A.a(a,s)
if(a[s]===j){if(!(a0>=0&&a0<n))return A.a(a,a0)
s=a[a0]
if(!(f>=0&&f<n))return A.a(a,f)
if(s===a[f]){e=a0+1
if(!(e<n))return A.a(a,e)
s=a[e]
m=f+1
if(!(m<n))return A.a(a,m)
m=s!==a[m]
s=m}else{s=m
e=a0}}else{s=m
e=a0}}else{s=m
e=a0}if(s)break A
f+=2;++e
do{++f
if(!(f>=0&&f<n))return A.a(a,f)
s=a[f];++e
if(!(e>=0&&e<n))return A.a(a,e)
m=!1
if(s===a[e]){++f
if(!(f<n))return A.a(a,f)
s=a[f];++e
if(!(e<n))return A.a(a,e)
if(s===a[e]){++f
if(!(f<n))return A.a(a,f)
s=a[f];++e
if(!(e<n))return A.a(a,e)
if(s===a[e]){++f
if(!(f<n))return A.a(a,f)
s=a[f];++e
if(!(e<n))return A.a(a,e)
if(s===a[e]){++f
if(!(f<n))return A.a(a,f)
s=a[f];++e
if(!(e<n))return A.a(a,e)
if(s===a[e]){++f
if(!(f<n))return A.a(a,f)
s=a[f];++e
if(!(e<n))return A.a(a,e)
if(s===a[e]){++f
if(!(f<n))return A.a(a,f)
s=a[f];++e
if(!(e<n))return A.a(a,e)
if(s===a[e]){++f
if(!(f<n))return A.a(a,f)
s=a[f];++e
if(!(e<n))return A.a(a,e)
s=s===a[e]&&f<o}else s=m}else s=m}else s=m}else s=m}else s=m}else s=m}else s=m}while(s)
d=258-(o-f)
if(d>g){c.k1=a0
if(d>=p){g=d
break}a=c.ax
s=h+d
n=s-1
m=a.length
if(!(n>=0&&n<m))return A.a(a,n)
j=a[n]
if(!(s<m))return A.a(a,s)
i=a[s]
g=d}f=h}a=c.ch
a===$&&A.c()
s=a0&r
if(!(s>=0&&s<a.length))return A.a(a,s)
a0=a[s]&65535
if(a0>q){--b
a=b!==0}else a=!1}while(a)
a=c.k2
if(g<=a)return g
return a},
lU(a,b,c){var s,r,q,p,o,n,m=this
if(c!==0){s=m.a
r=s.c
s=s.d
s===$&&A.c()
s=r>=s}else s=!0
if(s)return 0
q=m.a.ac(c)
p=q.gp(q)
if(p===0)return 0
o=q.a0()
n=o.length
if(p>n)p=n
B.d.aa(a,b,b+p,o)
m.e+=p
m.d=A.bK(o,m.d)
return p},
en(){var s,r=this,q=r.x
q===$&&A.c()
s=r.f
s===$&&A.c()
r.b.eY(s,q)
s=r.w
s===$&&A.c()
r.w=s+q
q=r.x-q
r.x=q
if(q===0)r.w=0},
kY(a){switch(a){case 0:return new A.b9(0,0,0,0,0)
case 1:return new A.b9(4,4,8,4,1)
case 2:return new A.b9(4,5,16,8,1)
case 3:return new A.b9(4,6,32,32,1)
case 4:return new A.b9(4,4,16,16,2)
case 5:return new A.b9(8,16,32,32,2)
case 6:return new A.b9(8,16,128,128,2)
case 7:return new A.b9(8,32,128,256,2)
case 8:return new A.b9(32,128,258,1024,2)
case 9:return new A.b9(32,258,258,4096,2)}return null}}
A.b9.prototype={}
A.mn.prototype={
kW(a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2=this,a3=a2.a
a3===$&&A.c()
s=a2.c
s===$&&A.c()
r=s.a
q=s.b
p=s.c
o=s.e
for(s=a4.rx,n=s.$flags|0,m=0;m<=15;++m){n&2&&A.b(s)
s[m]=0}l=a4.ry
k=a4.x1
k===$&&A.c()
if(!(k>=0&&k<573))return A.a(l,k)
j=l[k]*2+1
a3.$flags&2&&A.b(a3)
i=a3.length
if(!(j>=0&&j<i))return A.a(a3,j)
a3[j]=0
for(h=k+1,k=r!=null,j=q.length,g=0;h<573;++h){f=l[h]
e=f*2
d=e+1
if(!(d>=0&&d<i))return A.a(a3,d)
c=a3[d]*2+1
if(!(c<i))return A.a(a3,c)
m=a3[c]+1
if(m>o){++g
m=o}a3.$flags&2&&A.b(a3)
a3[d]=m
c=a2.b
c===$&&A.c()
if(f>c)continue
if(!(m<16))return A.a(s,m)
c=s[m]
n&2&&A.b(s)
s[m]=c+1
if(f>=p){c=f-p
if(!(c>=0&&c<j))return A.a(q,c)
b=q[c]}else b=0
if(!(e>=0&&e<i))return A.a(a3,e)
a=a3[e]
e=a4.aV
e===$&&A.c()
a4.aV=e+a*(m+b)
if(k){e=a4.bO
e===$&&A.c()
if(!(d<r.length))return A.a(r,d)
a4.bO=e+a*(r[d]+b)}}if(g===0)return
m=o-1
do{a0=m
for(;;){if(!(a0>=0&&a0<16))return A.a(s,a0)
k=s[a0]
if(!(k===0))break;--a0}n&2&&A.b(s)
s[a0]=k-1
k=a0+1
if(!(k<16))return A.a(s,k)
s[k]=s[k]+2
if(!(o<16))return A.a(s,o)
s[o]=s[o]-1
g-=2}while(g>0)
for(m=o;m!==0;--m){if(!(m>=0))return A.a(s,m)
f=s[m]
while(f!==0){--h
if(!(h>=0&&h<573))return A.a(l,h)
a1=l[h]
n=a2.b
n===$&&A.c()
if(a1>n)continue
n=a1*2
k=n+1
if(!(k>=0&&k<i))return A.a(a3,k)
j=a3[k]
if(j!==m){e=a4.aV
e===$&&A.c()
if(!(n>=0&&n<i))return A.a(a3,n)
a4.aV=e+(m-j)*a3[n]
a3.$flags&2&&A.b(a3)
a3[k]=m}--f}}},
e5(a1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=this,a0=a.a
a0===$&&A.c()
s=a.c
s===$&&A.c()
r=s.a
q=s.d
a1.to=0
a1.x1=573
for(s=a0.length,p=a1.ry,o=p.$flags|0,n=a1.x2,m=n.$flags|0,l=a0.$flags|0,k=0,j=-1;k<q;++k){i=k*2
if(!(i<s))return A.a(a0,i)
if(a0[i]!==0){i=++a1.to
o&2&&A.b(p)
if(!(i>=0&&i<573))return A.a(p,i)
p[i]=k
m&2&&A.b(n)
if(!(k<573))return A.a(n,k)
n[k]=0
j=k}else{++i
l&2&&A.b(a0)
if(!(i<s))return A.a(a0,i)
a0[i]=0}}for(i=r!=null;h=a1.to,h<2;){++h
a1.to=h
if(j<2){++j
g=j}else g=0
o&2&&A.b(p)
if(!(h>=0))return A.a(p,h)
p[h]=g
h=g*2
l&2&&A.b(a0)
if(!(h>=0&&h<s))return A.a(a0,h)
a0[h]=1
m&2&&A.b(n)
if(!(g>=0))return A.a(n,g)
n[g]=0
f=a1.aV
f===$&&A.c()
a1.aV=f-1
if(i){f=a1.bO
f===$&&A.c();++h
if(!(h<r.length))return A.a(r,h)
a1.bO=f-r[h]}}a.b=j
for(k=B.a.P(h,2);k>=1;--k)a1.eB(a0,k)
g=q
do{k=p[1]
i=a1.to--
if(!(i>=0&&i<573))return A.a(p,i)
i=p[i]
o&2&&A.b(p)
p[1]=i
a1.eB(a0,1)
e=p[1]
i=--a1.x1
if(!(i>=0&&i<573))return A.a(p,i)
p[i]=k;--i
a1.x1=i
if(!(i>=0))return A.a(p,i)
p[i]=e
i=g*2
h=k*2
if(!(h>=0&&h<s))return A.a(a0,h)
f=a0[h]
d=e*2
if(!(d>=0&&d<s))return A.a(a0,d)
c=a0[d]
l&2&&A.b(a0)
if(!(i<s))return A.a(a0,i)
a0[i]=f+c
if(!(k>=0&&k<573))return A.a(n,k)
c=n[k]
if(!(e>=0&&e<573))return A.a(n,e)
f=n[e]
i=c>f?c:f
m&2&&A.b(n)
if(!(g<573))return A.a(n,g)
n[g]=i+1;++h;++d
if(!(d<s))return A.a(a0,d)
a0[d]=g
if(!(h<s))return A.a(a0,h)
a0[h]=g
b=g+1
p[1]=g
a1.eB(a0,1)
if(a1.to>=2){g=b
continue}else break}while(!0)
s=--a1.x1
o=p[1]
if(!(s>=0&&s<573))return A.a(p,s)
p[s]=o
a.kW(a1)
A.vt(a0,j,a1.rx)}}
A.mv.prototype={}
A.kq.prototype={
nu(){var s,r="Invalid deflate data",q=null
try{q=this.lo()}catch(s){if(t.b0.b(A.bx(s)))throw A.e(A.aY(r))
else throw s}if(!q&&!this.f)throw A.e(A.aY(r))
return q},
gc6(){var s=this.a
if(s==null)return s
s.d===$&&A.c()
return s},
lo(){var s,r,q,p=this,o=p.gc6()
if(o!=null){s=o.c
r=o.d
r===$&&A.c()
r=s>=r
s=r}else s=!0
if(s)return!1
q=p.bt(3)
s=(q&1)===0
switch(B.a.j(q,1)){case 0:if(p.ly()===-1)return!1
break
case 1:if(p.fC($.rw(),$.rv())===-1)return!1
break
case 2:if(p.lp()===-1)return!1
break
default:return!1}if(!s)p.f=!0
return s},
bt(a){var s,r,q,p,o=this
if(a===0)return 0
while(s=o.w,s<a){s=o.gc6()
r=s.c
s=s.d
s===$&&A.c()
if(r>=s)return-1
s=o.gc6()
r=s.b
r.toString
s=s.c++
if(!(s>=0&&s<r.length))return A.a(r,s)
q=r[s]
s=o.r
r=o.w
o.r=(s|B.a.U(q,r))>>>0
o.w=r+8}r=o.r
p=B.a.O(1,a)
o.r=B.a.a6(r,a)
o.w=s-a
return(r&p-1)>>>0},
eC(a){var s,r,q,p,o,n,m=this,l=a.a
l===$&&A.c()
s=a.b
while(m.w<s){r=m.gc6()
q=r.c
r=r.d
r===$&&A.c()
if(q>=r)break
r=m.gc6()
q=r.b
q.toString
r=r.c++
if(!(r>=0&&r<q.length))return A.a(q,r)
p=q[r]
r=m.r
q=m.w
m.r=(r|B.a.U(p,q))>>>0
m.w=q+8}r=m.r
q=(r&B.a.U(1,s)-1)>>>0
if(!(q<l.length))return A.a(l,q)
o=l[q]
n=o>>>16
if(n===0||n>m.w)return-1
m.r=B.a.a6(r,n)
m.w-=n
return o&65535},
ly(){var s,r=this
r.w=r.r=0
s=r.bt(16)
if(s!==(r.bt(16)^65535)>>>0)return-1
if(s>r.gc6().gp(0))return-1
r.c.iE(r.gc6().ac(s))
return 0},
lp(){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=g.bt(5)
if(f===-1)return-1
f+=257
if(f>286)return-1
s=g.bt(5)
if(s===-1)return-1;++s
if(s>32)return-1
r=g.bt(4)
if(r===-1)return-1
r+=4
if(r>19)return-1
q=new Uint8Array(19)
for(p=0;p<r;++p){o=g.bt(3)
if(o===-1)return-1
n=B.b8[p]
if(!(n<19))return A.a(q,n)
q[n]=o}m=g.ho(q,!0)
if(m==null)return-1
n=f+s
l=new Uint8Array(n)
k=J.F(B.d.gt(l),0,f)
j=J.F(B.d.gt(l),f,s)
if(g.jZ(n,m,l)===-1)return-1
i=g.hn(k)
n=i==null
h=n?null:g.hn(j)
if(n||h==null)return-1
return g.fC(i,h)},
ho(a,b){var s,r
t.L.a(a)
try{s=A.nT(a,b)
return s}catch(r){if(A.bx(r) instanceof A.bO)return null
else throw r}},
hn(a){return this.ho(a,!1)},
fC(a,b){var s,r,q,p,o,n,m,l,k,j=this
for(s=j.c;;){r=j.eC(a)
if(r<0||r>285)return-1
if(r===256)break
if(r<256){s.u(r&255)
continue}q=r-257
if(!(q>=0&&q<31))return A.a(B.dB,q)
p=j.bt(B.dB[q])
if(p<0)return-1
if(!(q<29))return A.a(B.ds,q)
o=B.ds[q]
n=j.eC(b)
if(n<0||n>29)return-1
if(!(n>=0&&n<30))return A.a(B.an,n)
m=j.bt(B.an[n])
if(m<0)return-1
l=B.nn[n]+m
if(l<1||l>s.gp(s))return-1
s.iB(l,o+p)}while(s=j.w,s>=8){j.w=s-8
s=j.gc6()
o=s.c
if(1>=o)s.c=0
else{k=s.d
k===$&&A.c()
if(1<=o-k)s.c=k
else s.c=o-1}}return 0},
jZ(a,b,c){var s,r,q,p,o,n,m,l,k=this
for(s=0,r=0;r<a;){q=k.eC(b)
if(q===-1)return-1
p=0
switch(q){case 16:if(r===0)return-1
o=k.bt(2)
if(o===-1)return-1
o+=3
if(r+o>a)return-1
for(n=c.$flags|0;m=o-1,o>0;o=m,r=l){l=r+1
n&2&&A.b(c)
if(!(r>=0&&r<c.length))return A.a(c,r)
c[r]=s}break
case 17:o=k.bt(3)
if(o===-1)return-1
o+=3
if(r+o>a)return-1
for(n=c.$flags|0;m=o-1,o>0;o=m,r=l){l=r+1
n&2&&A.b(c)
if(!(r>=0&&r<c.length))return A.a(c,r)
c[r]=0}s=p
break
case 18:o=k.bt(7)
if(o===-1)return-1
o+=11
if(r+o>a)return-1
for(n=c.$flags|0;m=o-1,o>0;o=m,r=l){l=r+1
n&2&&A.b(c)
if(!(r>=0&&r<c.length))return A.a(c,r)
c[r]=0}s=p
break
default:if(q<0||q>15)return-1
l=r+1
c.$flags&2&&A.b(c)
if(!(r>=0&&r<c.length))return A.a(c,r)
c[r]=q
r=l
s=q
break}}return 0}}
A.hr.prototype={}
A.ex.prototype={
a8(){return"ByteOrder."+this.b}}
A.eZ.prototype={
geT(){return this.e},
f2(a){return this.e=a},
gp(a){var s=this,r=s.d
if(r!=null)return Math.max(0,r-s.e)
return s.b.ir(s.c+s.e)},
gnB(){var s,r,q=this,p=q.d
if(p!=null&&q.e>=p)return!0
s=q.b
r=q.c+q.e
s.dB(r,1)
return r>=s.e+s.f},
hY(){if(this.c===0&&this.d==null){var s=this.b
s.d=new Uint8Array(0)
s.e=s.e+s.f
s.f=0
s.w=!0}},
f8(a,b){var s=this.d
if(s!=null)a=Math.min(a,Math.max(0,s-b))
return A.pz(this,b,a)},
H(){var s,r=this
if(r.gnB())return 0
s=r.b.mY(r.c+r.e);++r.e
return s},
ac(a){var s,r,q=this,p=q.d
if(p!=null)a=Math.max(0,Math.min(a,p-q.e))
s=q.e
r=A.pz(q,s,a)
q.e=s+a
return r},
a0(){var s,r,q=this,p=q.d
if(p!=null){s=q.e
return q.b.im(q.c+s,Math.max(0,p-s))}s=q.b
r=q.c+q.e
return s.im(r,s.ir(r))}}
A.j3.prototype={
gp(a){return this.e+this.f},
dB(a,b){var s,r=this,q=r.e
if(a<q)throw A.e(A.aY("Position "+a+" of the decoded data has already been read past, only the last "+r.f+" bytes from "+q+" are still held"))
r.r=a
q=r.b
s=a+b
for(;;){if(!(!r.w&&r.e+r.f<s))break
if(!q.n9(r))r.w=!0}},
mY(a){var s,r,q=this
q.dB(a,1)
s=q.e
if(a>=s+q.f)return 0
r=q.d
s=a-s
if(!(s>=0&&s<r.length))return A.a(r,s)
return r[s]},
im(a,b){var s,r,q=this
q.dB(a,b)
s=q.e
r=Math.max(0,Math.min(b,s+q.f-a))
if(r===0)return new Uint8Array(0)
s=a-s
return B.d.bJ(q.d,s,s+r)},
ir(a){this.dB(a,1125899906842624)
return Math.max(0,this.e+this.f-a)},
eu(a){var s,r,q,p,o=this,n=o.f,m=o.d
if(n+a<=m.length)return
s=o.e
r=Math.max(s,Math.min(o.r-o.c,s+n-o.b.gns()))-s
if(r>0){B.d.a3(m,0,n-r,m,r)
n=o.f-=r
o.e+=r}m=n+a
s=o.d
q=s.length
if(m>q){m=Math.max(q*2,m)
p=new Uint8Array(m)
B.d.aa(p,0,n,s)
o.d=p}},
u(a){var s,r,q=this
if(q.f===q.d.length)q.eu(1)
s=q.d
r=q.f++
s.$flags&2&&A.b(s)
if(!(r>=0&&r<s.length))return A.a(s,r)
s[r]=a},
eY(a,b){var s,r,q=this
t.L.a(a)
b=a.length
q.eu(b)
s=q.d
r=q.f
B.d.aa(s,r,r+b,a)
q.f+=b},
au(a){return this.eY(a,null)},
iE(a){return this.au(a.a0())},
iB(a,b){var s,r,q,p,o,n,m,l,k,j,i=this
i.eu(b)
s=i.f
r=s-a
if(r<0)throw A.e(A.aY("Back reference before the start of the data"))
q=s+b
if(a>=b){p=i.d
B.d.a3(p,s,q,p,r)}else for(p=i.d,o=p.length,n=p.$flags|0,m=r;s<q;s=l,m=k){l=s+1
k=m+1
if(!(m<o))return A.a(p,m)
j=p[m]
n&2&&A.b(p)
if(!(s>=0&&s<o))return A.a(p,s)
p[s]=j}i.f+=b}}
A.f_.prototype={
geT(){return this.c},
gp(a){var s=this.b
return s==null?0:s.length-this.c},
f2(a){this.c=a},
br(a,b){var s,r=this,q=r.d
q===$&&A.c()
s=r.c
if(b>=q-s)r.c=q
else if(b<=-s)r.c=0
else r.c=s+b},
f8(a,b){var s=this.b
if(s==null)return A.hW(A.j([],t.t),B.ac,null,null)
return A.hW(s,this.a,a,b)},
H(){var s,r=this.b
r.toString
s=this.c++
if(!(s>=0&&s<r.length))return A.a(r,s)
return r[s]},
a0(){var s,r,q,p,o=this,n=o.b
if(n==null)return new Uint8Array(0)
s=o.gp(0)
r=n.length
q=o.c
p=r-q
if(s<0||s>p)s=p
if(q<0)throw A.e(A.a7(q,0,r,"position",null))
return J.F(B.d.gt(n),o.b.byteOffset+o.c,s)}}
A.f0.prototype={
m(){var s=this.H(),r=this.H()
if(this.a===B.au)return(s<<8|r)>>>0
return(r<<8|s)>>>0},
k(){var s=this,r=s.H(),q=s.H(),p=s.H(),o=s.H()
if(s.a===B.au)return(r<<24|q<<16|p<<8|o)>>>0
return(o<<24|p<<16|q<<8|r)>>>0},
ac(a){var s=this,r=s.f8(a,s.geT())
s.f2(s.geT()+r.gp(r))
return r}}
A.il.prototype={
u(a){var s,r,q=this
if(q.b===q.c.length)q.ln()
s=q.c
r=q.b++
s.$flags&2&&A.b(s)
if(!(r>=0&&r<s.length))return A.a(s,r)
s[r]=a},
eY(a,b){var s,r,q,p,o=this
t.L.a(a)
if(b==null)b=a.length
while(s=o.b,r=s+b,q=o.c,p=q.length,r>p)o.dG(r-p)
B.d.aa(q,s,r,a)
o.b+=b},
iE(a){var s,r,q,p,o=this
while(s=o.b,r=a.gp(a),q=o.c,s+r>q.length)o.dG(o.b+a.gp(a)-o.c.length)
if(a instanceof A.f_){s=a.b
if(s!=null){r=o.b
B.d.a3(q,r,r+a.gp(0),s,a.c)}}else{p=a.a0()
s=o.c
r=o.b
q=p.length
B.d.a3(s,r,r+q,p,0)
o.b+=q
return}o.b=o.b+a.gp(0)},
iB(a,b){var s,r,q,p,o,n,m,l,k,j,i=this
while(s=i.b,r=s+b,q=i.c,p=q.length,r>p)i.dG(r-p)
o=s-a
if(a>=b)B.d.a3(q,s,r,q,o)
else for(n=q.$flags|0,m=o;s<r;s=l,m=k){l=s+1
k=m+1
if(!(m>=0&&m<p))return A.a(q,m)
j=q[m]
n&2&&A.b(q)
if(!(s>=0))return A.a(q,s)
q[s]=j}i.b+=b},
dG(a){var s,r=this.c,q=r.length,p=q+(a==null?1:a),o=q===0?32768:q*2
if(o<p)o=p
s=new Uint8Array(o)
B.d.aa(s,0,q,r)
this.c=s},
ln(){return this.dG(null)},
gp(a){return this.b}}
A.fp.prototype={
smZ(a){this.a=t.aO.a(a)}}
A.jS.prototype={
a8(){return"Channel."+this.b}}
A.Y.prototype={
C(){var s=this.b
return++this.a<s.gp(s)},
gN(){return this.b.l(0,this.a)},
$iz:1}
A.cG.prototype={
a8(){return"ChannelOrder."+this.b}}
A.dt.prototype={
R(){return new A.dt(new Uint16Array(A.o(this.a)))},
gM(){return B.T},
gp(a){return this.a.length},
gW(){return null},
l(a,b){var s=this.a,r=s.length
if(b<r){if(!(b>=0))return A.a(s,b)
s=s[b]
r=$.O
r=r!=null?r:A.T()
if(!(s<r.length))return A.a(r,s)
s=r[s]}else s=0
return s},
i(a,b,c){var s,r=this.a,q=r.length
if(b<q){s=A.R(c)
r.$flags&2&&A.b(r)
if(!(b>=0))return A.a(r,b)
r[b]=s}},
gX(){return this.gq()},
gq(){var s,r=this.a
if(!B.v.gab(r)){if(0>=r.length)return A.a(r,0)
r=r[0]
s=$.O
s=s!=null?s:A.T()
if(!(r<s.length))return A.a(s,r)
r=s[r]}else r=0
return r},
gB(){var s=this.a,r=s.length
if(r===2){if(0>=r)return A.a(s,0)
s=s[0]
r=$.O
r=r!=null?r:A.T()
if(!(s<r.length))return A.a(r,s)
s=r[s]}else if(r>1){s=s[1]
r=$.O
r=r!=null?r:A.T()
if(!(s<r.length))return A.a(r,s)
s=r[s]}else s=0
return s},
gA(){var s=this.a,r=s.length
if(r===2){if(0>=r)return A.a(s,0)
s=s[0]
r=$.O
r=r!=null?r:A.T()
if(!(s<r.length))return A.a(r,s)
s=r[s]}else if(r>2){s=s[2]
r=$.O
r=r!=null?r:A.T()
if(!(s<r.length))return A.a(r,s)
s=r[s]}else s=0
return s},
gv(){var s=this.a,r=s.length
if(r===2){if(1>=r)return A.a(s,1)
s=s[1]
r=$.O
r=r!=null?r:A.T()
if(!(s<r.length))return A.a(r,s)
s=r[s]}else if(r>3){s=s[3]
r=$.O
r=r!=null?r:A.T()
if(!(s<r.length))return A.a(r,s)
s=r[s]}else s=0
return s},
ga5(){return this.gv()/1},
gap(){return this.a.length===2?this.gq():A.a4(this)},
gF(a){return new A.Y(this)},
a_(a,b){var s,r
if(b==null)return!1
s=!1
if(t.G.b(b))if(b.gp(b)===this.a.length){s=b.gK(b)
r=A.t(this,A.m(this).n("f.E"))
s=s===A.n(r)}return s},
gK(a){var s=A.t(this,A.m(this).n("f.E"))
return A.n(s)},
$iy:1}
A.du.prototype={
R(){return new A.du(new Float32Array(A.o(this.a)))},
gM(){return B.Y},
gp(a){return this.a.length},
gW(){return null},
l(a,b){var s=this.a,r=s.length
if(b<r){if(!(b>=0))return A.a(s,b)
s=s[b]}else s=0
return s},
i(a,b,c){var s=this.a,r=s.length
if(b<r){s.$flags&2&&A.b(s)
if(!(b>=0))return A.a(s,b)
s[b]=c}},
gX(){var s=this.a
if(!B.a1.gab(s)){if(0>=s.length)return A.a(s,0)
s=s[0]}else s=0
return s},
gq(){var s=this.a
if(!B.a1.gab(s)){if(0>=s.length)return A.a(s,0)
s=s[0]}else s=0
return s},
gB(){var s=this.a,r=s.length
if(r===2){if(0>=r)return A.a(s,0)
s=s[0]}else s=r>1?s[1]:0
return s},
gA(){var s=this.a,r=s.length
if(r===2){if(0>=r)return A.a(s,0)
s=s[0]}else s=r>2?s[2]:0
return s},
gv(){var s=this.a,r=s.length
if(r===2){if(1>=r)return A.a(s,1)
s=s[1]}else s=r>3?s[3]:1
return s},
ga5(){return this.gv()/1},
gap(){var s=this.a,r=s.length
if(r===2)if(!B.a1.gab(s)){if(0>=r)return A.a(s,0)
s=s[0]}else s=0
else s=A.a4(this)
return s},
gF(a){return new A.Y(this)},
a_(a,b){var s,r
if(b==null)return!1
s=!1
if(t.G.b(b))if(b.gp(b)===this.a.length){s=b.gK(b)
r=A.t(this,A.m(this).n("f.E"))
s=s===A.n(r)}return s},
gK(a){var s=A.t(this,A.m(this).n("f.E"))
return A.n(s)},
$iy:1}
A.dv.prototype={
R(){return new A.dv(new Float64Array(A.o(this.a)))},
gM(){return B.aa},
gp(a){return this.a.length},
gW(){return null},
l(a,b){var s=this.a,r=s.length
if(b<r){if(!(b>=0))return A.a(s,b)
s=s[b]}else s=0
return s},
i(a,b,c){var s=this.a,r=s.length
if(b<r){s.$flags&2&&A.b(s)
if(!(b>=0))return A.a(s,b)
s[b]=c}},
gX(){var s=this.a
if(!B.x.gab(s)){if(0>=s.length)return A.a(s,0)
s=s[0]}else s=0
return s},
gq(){var s=this.a
if(!B.x.gab(s)){if(0>=s.length)return A.a(s,0)
s=s[0]}else s=0
return s},
gB(){var s=this.a,r=s.length
if(r===2){if(0>=r)return A.a(s,0)
s=s[0]}else s=r>1?s[1]:0
return s},
gA(){var s=this.a,r=s.length
if(r===2){if(0>=r)return A.a(s,0)
s=s[0]}else s=r>2?s[2]:0
return s},
gv(){var s=this.a,r=s.length
if(r===2){if(1>=r)return A.a(s,1)
s=s[1]}else s=r>3?s[3]:1
return s},
ga5(){return this.gv()/1},
gap(){var s=this.a,r=s.length
if(r===2)if(!B.x.gab(s)){if(0>=r)return A.a(s,0)
s=s[0]}else s=0
else s=A.a4(this)
return s},
gF(a){return new A.Y(this)},
a_(a,b){var s,r
if(b==null)return!1
s=!1
if(t.G.b(b))if(b.gp(b)===this.a.length){s=b.gK(b)
r=A.t(this,A.m(this).n("f.E"))
s=s===A.n(r)}return s},
gK(a){var s=A.t(this,A.m(this).n("f.E"))
return A.n(s)},
$iy:1}
A.dw.prototype={
R(){return new A.dw(new Int16Array(A.o(this.a)))},
gM(){return B.ag},
gp(a){return this.a.length},
gW(){return null},
l(a,b){var s=this.a,r=s.length
if(b<r){if(!(b>=0))return A.a(s,b)
s=s[b]}else s=0
return s},
i(a,b,c){var s,r=this.a,q=r.length
if(b<q){s=B.b.h(c)
r.$flags&2&&A.b(r)
if(!(b>=0))return A.a(r,b)
r[b]=s}},
gX(){var s=this.a
if(!B.y.gab(s)){if(0>=s.length)return A.a(s,0)
s=s[0]}else s=0
return s},
gq(){var s=this.a
if(!B.y.gab(s)){if(0>=s.length)return A.a(s,0)
s=s[0]}else s=0
return s},
gB(){var s=this.a,r=s.length
if(r===2){if(0>=r)return A.a(s,0)
s=s[0]}else s=r>1?s[1]:0
return s},
gA(){var s=this.a,r=s.length
if(r===2){if(0>=r)return A.a(s,0)
s=s[0]}else s=r>2?s[2]:0
return s},
gv(){var s=this.a,r=s.length
if(r===2){if(1>=r)return A.a(s,1)
s=s[1]}else s=r>3?s[3]:0
return s},
ga5(){return this.gv()/32767},
gap(){var s=this.a,r=s.length
if(r===2)if(!B.y.gab(s)){if(0>=r)return A.a(s,0)
s=s[0]}else s=0
else s=A.a4(this)
return s},
gF(a){return new A.Y(this)},
a_(a,b){var s,r
if(b==null)return!1
s=!1
if(t.G.b(b))if(b.gp(b)===this.a.length){s=b.gK(b)
r=A.t(this,A.m(this).n("f.E"))
s=s===A.n(r)}return s},
gK(a){var s=A.t(this,A.m(this).n("f.E"))
return A.n(s)},
$iy:1}
A.dx.prototype={
R(){return new A.dx(new Int32Array(A.o(this.a)))},
gM(){return B.ah},
gp(a){return this.a.length},
gW(){return null},
l(a,b){var s=this.a,r=s.length
if(b<r){if(!(b>=0))return A.a(s,b)
s=s[b]}else s=0
return s},
i(a,b,c){var s,r=this.a,q=r.length
if(b<q){s=B.b.h(c)
r.$flags&2&&A.b(r)
if(!(b>=0))return A.a(r,b)
r[b]=s}},
gX(){var s=this.a
if(!B.t.gab(s)){if(0>=s.length)return A.a(s,0)
s=s[0]}else s=0
return s},
gq(){var s=this.a
if(!B.t.gab(s)){if(0>=s.length)return A.a(s,0)
s=s[0]}else s=0
return s},
gB(){var s=this.a,r=s.length
if(r===2){if(0>=r)return A.a(s,0)
s=s[0]}else s=r>1?s[1]:0
return s},
gA(){var s=this.a,r=s.length
if(r===2){if(0>=r)return A.a(s,0)
s=s[0]}else s=r>2?s[2]:0
return s},
gv(){var s=this.a,r=s.length
if(r===2){if(1>=r)return A.a(s,1)
s=s[1]}else s=r>3?s[3]:0
return s},
ga5(){return this.gv()/2147483647},
gap(){var s=this.a,r=s.length
if(r===2)if(!B.t.gab(s)){if(0>=r)return A.a(s,0)
s=s[0]}else s=0
else s=A.a4(this)
return s},
gF(a){return new A.Y(this)},
a_(a,b){var s,r
if(b==null)return!1
s=!1
if(t.G.b(b))if(b.gp(b)===this.a.length){s=b.gK(b)
r=A.t(this,A.m(this).n("f.E"))
s=s===A.n(r)}return s},
gK(a){var s=A.t(this,A.m(this).n("f.E"))
return A.n(s)},
$iy:1}
A.dy.prototype={
R(){return new A.dy(new Int8Array(A.o(this.a)))},
gM(){return B.af},
gp(a){return this.a.length},
gW(){return null},
l(a,b){var s=this.a,r=s.length
if(b<r){if(!(b>=0))return A.a(s,b)
s=s[b]}else s=0
return s},
i(a,b,c){var s,r=this.a,q=r.length
if(b<q){s=B.b.h(c)
r.$flags&2&&A.b(r)
if(!(b>=0))return A.a(r,b)
r[b]=s}},
gX(){var s=this.a
if(!B.O.gab(s)){if(0>=s.length)return A.a(s,0)
s=s[0]}else s=0
return s},
gq(){var s=this.a
if(!B.O.gab(s)){if(0>=s.length)return A.a(s,0)
s=s[0]}else s=0
return s},
gB(){var s=this.a,r=s.length
if(r===2){if(0>=r)return A.a(s,0)
s=s[0]}else s=r>1?s[1]:0
return s},
gA(){var s=this.a,r=s.length
if(r===2){if(0>=r)return A.a(s,0)
s=s[0]}else s=r>2?s[2]:0
return s},
gv(){var s=this.a,r=s.length
if(r===2){if(1>=r)return A.a(s,1)
s=s[1]}else s=r>3?s[3]:0
return s},
ga5(){return this.gv()/127},
gap(){var s=this.a,r=s.length
if(r===2)if(!B.O.gab(s)){if(0>=r)return A.a(s,0)
s=s[0]}else s=0
else s=A.a4(this)
return s},
gF(a){return new A.Y(this)},
a_(a,b){var s,r
if(b==null)return!1
s=!1
if(t.G.b(b))if(b.gp(b)===this.a.length){s=b.gK(b)
r=A.t(this,A.m(this).n("f.E"))
s=s===A.n(r)}return s},
gK(a){var s=A.t(this,A.m(this).n("f.E"))
return A.n(s)},
$iy:1}
A.dA.prototype={
R(){var s=this.b
s===$&&A.c()
return new A.dA(this.a,s)},
gM(){return B.L},
gW(){return null},
c2(a){var s
if(a<this.a){s=this.b
s===$&&A.c()
s=B.a.a4(s,7-a)&1}else s=0
return s},
ct(a,b){var s
if(a>=this.a)return
a=7-a
s=this.b
s===$&&A.c()
this.b=b!==0?(s|B.a.U(1,a))>>>0:(s&~(B.a.U(1,a)&255))>>>0},
l(a,b){return this.c2(b)},
i(a,b,c){return this.ct(b,c)},
gX(){return this.c2(0)},
gq(){return this.c2(0)},
gB(){return this.c2(this.a===2?0:1)},
gA(){return this.c2(this.a===2?0:2)},
gv(){return this.c2(this.a===2?1:3)},
ga5(){return this.c2(this.a===2?1:3)/1},
gap(){return this.a===2?this.c2(0):A.a4(this)},
ao(a,b,c,d){var s,r=this
r.ct(0,a)
s=r.a
if(s===2)r.ct(1,d)
else if(s>2){r.ct(1,b)
r.ct(2,c)
r.ct(3,d)}},
gF(a){return new A.Y(this)},
a_(a,b){var s,r
if(b==null)return!1
s=!1
if(t.G.b(b))if(b.gp(b)===this.a){s=b.gK(b)
r=A.t(this,A.m(this).n("f.E"))
s=s===A.n(r)}return s},
gK(a){var s=A.t(this,A.m(this).n("f.E"))
return A.n(s)},
$iy:1,
gp(a){return this.a}}
A.dB.prototype={
R(){return new A.dB(new Uint16Array(A.o(this.a)))},
gM(){return B.u},
gp(a){return this.a.length},
gW(){return null},
l(a,b){var s=this.a,r=s.length
if(b<r){if(!(b>=0))return A.a(s,b)
s=s[b]}else s=0
return s},
i(a,b,c){var s,r=this.a,q=r.length
if(b<q){s=B.b.h(c)
r.$flags&2&&A.b(r)
if(!(b>=0))return A.a(r,b)
r[b]=s}},
gX(){var s=this.a
if(!B.v.gab(s)){if(0>=s.length)return A.a(s,0)
s=s[0]}else s=0
return s},
gq(){var s=this.a
if(!B.v.gab(s)){if(0>=s.length)return A.a(s,0)
s=s[0]}else s=0
return s},
gB(){var s=this.a,r=s.length
if(r===2){if(0>=r)return A.a(s,0)
s=s[0]}else s=r>1?s[1]:0
return s},
gA(){var s=this.a,r=s.length
if(r===2){if(0>=r)return A.a(s,0)
s=s[0]}else s=r>2?s[2]:0
return s},
gv(){var s=this.a,r=s.length
if(r===2){if(1>=r)return A.a(s,1)
s=s[1]}else s=r>3?s[3]:0
return s},
ga5(){return this.gv()/65535},
gap(){var s=this.a,r=s.length
if(r===2)if(!B.v.gab(s)){if(0>=r)return A.a(s,0)
s=s[0]}else s=0
else s=A.a4(this)
return s},
gF(a){return new A.Y(this)},
a_(a,b){var s,r
if(b==null)return!1
s=!1
if(t.G.b(b))if(b.gp(b)===this.a.length){s=b.gK(b)
r=A.t(this,A.m(this).n("f.E"))
s=s===A.n(r)}return s},
gK(a){var s=A.t(this,A.m(this).n("f.E"))
return A.n(s)},
$iy:1}
A.dC.prototype={
R(){var s=this.b
s===$&&A.c()
return new A.dC(this.a,s)},
gM(){return B.R},
gW(){return null},
c3(a){var s
if(a<this.a){s=this.b
s===$&&A.c()
s=B.a.a4(s,6-(a<<1>>>0))&3}else s=0
return s},
cu(a,b){var s,r,q
if(a>=this.a)return
if(!(a>=0&&a<4))return A.a(B.cP,a)
s=B.cP[a]
r=B.b.h(b)
q=this.b
q===$&&A.c()
this.b=(q&s|B.a.U(r&3,6-(a<<1>>>0)))>>>0},
l(a,b){return this.c3(b)},
i(a,b,c){return this.cu(b,c)},
gX(){return this.c3(0)},
gq(){return this.c3(0)},
gB(){return this.c3(this.a===2?0:1)},
gA(){return this.c3(this.a===2?0:2)},
gv(){return this.c3(this.a===2?1:3)},
ga5(){return this.c3(this.a===2?1:3)/3},
gap(){return this.a===2?this.c3(0):A.a4(this)},
ao(a,b,c,d){var s,r=this
r.cu(0,a)
s=r.a
if(s===2)r.cu(1,d)
else if(s>2){r.cu(1,b)
r.cu(2,c)
r.cu(3,d)}},
gF(a){return new A.Y(this)},
a_(a,b){var s,r
if(b==null)return!1
s=!1
if(t.G.b(b))if(b.gp(b)===this.a){s=b.gK(b)
r=A.t(this,A.m(this).n("f.E"))
s=s===A.n(r)}return s},
gK(a){var s=A.t(this,A.m(this).n("f.E"))
return A.n(s)},
$iy:1,
gp(a){return this.a}}
A.dD.prototype={
R(){return new A.dD(new Uint32Array(A.o(this.a)))},
gM(){return B.ab},
gp(a){return this.a.length},
gW(){return null},
l(a,b){var s=this.a,r=s.length
if(b<r){if(!(b>=0))return A.a(s,b)
s=s[b]}else s=0
return s},
i(a,b,c){var s,r=this.a,q=r.length
if(b<q){s=B.b.h(c)
r.$flags&2&&A.b(r)
if(!(b>=0))return A.a(r,b)
r[b]=s}},
gX(){var s=this.a
if(!B.q.gab(s)){if(0>=s.length)return A.a(s,0)
s=s[0]}else s=0
return s},
gq(){var s=this.a
if(!B.q.gab(s)){if(0>=s.length)return A.a(s,0)
s=s[0]}else s=0
return s},
gB(){var s=this.a,r=s.length
if(r===2){if(0>=r)return A.a(s,0)
s=s[0]}else s=r>1?s[1]:0
return s},
gA(){var s=this.a,r=s.length
if(r===2){if(0>=r)return A.a(s,0)
s=s[0]}else s=r>2?s[2]:0
return s},
gv(){var s=this.a,r=s.length
if(r===2){if(1>=r)return A.a(s,1)
s=s[1]}else s=r>3?s[3]:0
return s},
ga5(){return this.gv()/4294967295},
gap(){var s=this.a,r=s.length
if(r===2)if(!B.q.gab(s)){if(0>=r)return A.a(s,0)
s=s[0]}else s=0
else s=A.a4(this)
return s},
gF(a){return new A.Y(this)},
a_(a,b){var s,r
if(b==null)return!1
s=!1
if(t.G.b(b))if(b.gp(b)===this.a.length){s=b.gK(b)
r=A.t(this,A.m(this).n("f.E"))
s=s===A.n(r)}return s},
gK(a){var s=A.t(this,A.m(this).n("f.E"))
return A.n(s)},
$iy:1}
A.dE.prototype={
R(){return new A.dE(this.a,new Uint8Array(A.o(this.b)))},
gM(){return B.S},
gW(){return null},
c5(a){var s,r
if(a<0||a>=this.a)s=0
else{s=this.b
r=s.length
if(a<2){if(0>=r)return A.a(s,0)
s=B.a.a4(s[0],4-(a<<2>>>0))&15}else{if(1>=r)return A.a(s,1)
s=B.a.a4(s[1],4-((a&1)<<2))&15}}return s},
cC(a,b){var s,r,q,p
if(a>=this.a)return
s=B.a.L(B.b.h(b),0,15)
if(a>1){a&=1
r=1}else r=0
if(a===0){q=this.b
if(!(r<q.length))return A.a(q,r)
p=q[r]
q.$flags&2&&A.b(q)
q[r]=(p&15|s<<4)>>>0}else if(a===1){q=this.b
if(!(r<q.length))return A.a(q,r)
p=q[r]
q.$flags&2&&A.b(q)
q[r]=(p&240|s)>>>0}},
l(a,b){return this.c5(b)},
i(a,b,c){return this.cC(b,c)},
gX(){return this.c5(0)},
gq(){return this.c5(0)},
gB(){return this.c5(this.a===2?0:1)},
gA(){return this.c5(this.a===2?0:2)},
gv(){return this.c5(this.a===2?1:3)},
ga5(){return this.c5(this.a===2?1:3)/15},
gap(){return this.a===2?this.c5(0):A.a4(this)},
ao(a,b,c,d){var s,r=this
r.cC(0,a)
s=r.a
if(s===2)r.cC(1,d)
else if(s>2){r.cC(1,b)
r.cC(2,c)
r.cC(3,d)}},
gF(a){return new A.Y(this)},
a_(a,b){var s,r
if(b==null)return!1
s=!1
if(t.G.b(b))if(b.gp(b)===this.a){s=b.gK(b)
r=A.t(this,A.m(this).n("f.E"))
s=s===A.n(r)}return s},
gK(a){var s=A.t(this,A.m(this).n("f.E"))
return A.n(s)},
$iy:1,
gp(a){return this.a}}
A.bi.prototype={
j0(a,b,c){var s,r=this.a
r.$flags&2&&A.b(r)
s=r.length
if(0>=s)return A.a(r,0)
r[0]=a
if(1>=s)return A.a(r,1)
r[1]=b
if(2>=s)return A.a(r,2)
r[2]=c},
j1(a,b,c,d){var s,r=this.a
r.$flags&2&&A.b(r)
s=r.length
if(0>=s)return A.a(r,0)
r[0]=a
if(1>=s)return A.a(r,1)
r[1]=b
if(2>=s)return A.a(r,2)
r[2]=c
if(3>=s)return A.a(r,3)
r[3]=d},
R(){return new A.bi(new Uint8Array(A.o(this.a)))},
gM(){return B.e},
gp(a){return this.a.length},
gW(){return null},
l(a,b){var s=this.a,r=s.length
if(b<r){if(!(b>=0))return A.a(s,b)
s=s[b]}else s=0
return s},
i(a,b,c){var s,r=this.a,q=r.length
if(b<q){s=B.b.h(c)
r.$flags&2&&A.b(r)
if(!(b>=0))return A.a(r,b)
r[b]=s}},
gX(){var s=this.a
if(!B.d.gab(s)){if(0>=s.length)return A.a(s,0)
s=s[0]}else s=0
return s},
gq(){var s=this.a
if(!B.d.gab(s)){if(0>=s.length)return A.a(s,0)
s=s[0]}else s=0
return s},
gB(){var s=this.a,r=s.length
if(r===2){if(0>=r)return A.a(s,0)
s=s[0]}else s=r>1?s[1]:0
return s},
gA(){var s=this.a,r=s.length
if(r===2){if(0>=r)return A.a(s,0)
s=s[0]}else s=r>2?s[2]:0
return s},
gv(){var s=this.a,r=s.length
if(r===2){if(1>=r)return A.a(s,1)
s=s[1]}else s=r>3?s[3]:255
return s},
ga5(){return this.gv()/255},
gap(){var s=this.a,r=s.length
if(r===2)if(!B.d.gab(s)){if(0>=r)return A.a(s,0)
s=s[0]}else s=0
else s=A.a4(this)
return s},
gF(a){return new A.Y(this)},
a_(a,b){var s,r
if(b==null)return!1
s=!1
if(t.G.b(b))if(b.gp(b)===this.a.length){s=b.gK(b)
r=A.t(this,A.m(this).n("f.E"))
s=s===A.n(r)}return s},
gK(a){var s=A.t(this,A.m(this).n("f.E"))
return A.n(s)},
$iy:1}
A.eA.prototype={}
A.dz.prototype={}
A.eB.prototype={
R(){return new A.eB(this.a)},
gM(){return B.e},
gp(a){return 4},
gW(){return null},
l(a,b){var s
if(b>=0&&b<4){s=b<<3>>>0
s=B.a.a6((this.a&B.a.O(255,s))>>>0,s)}else s=0
return s},
i(a,b,c){},
gX(){return this.l(0,0)},
gq(){return this.l(0,0)},
gB(){return this.l(0,1)},
gA(){return this.l(0,2)},
gv(){return this.l(0,3)},
ga5(){return this.gv()/255},
gap(){return A.a4(this)},
gF(a){return new A.Y(this)},
a_(a,b){var s,r,q=this
if(b==null)return!1
s=!1
if(t.G.b(b))if(b.gp(b)===q.gp(q)){s=b.gK(b)
r=A.t(q,A.m(q).n("f.E"))
s=s===A.n(r)}return s},
gK(a){var s=A.t(this,A.m(this).n("f.E"))
return A.n(s)},
$iy:1}
A.hA.prototype={
gv(){return 255},
ga5(){return 1},
gp(a){return 3}}
A.av.prototype={
a8(){return"Format."+this.b}}
A.eM.prototype={
a8(){return"FormatType."+this.b}}
A.hu.prototype={
a8(){return"BlendMode."+this.b}}
A.bM.prototype={
dk(a){var s=$.nJ()
if(!s.af(a))return"<unknown>"
return s.l(0,a).a},
D(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=this
for(s=e.a,r=new A.a1(s,s.r,s.e,A.m(s).n("a1<1>")),q=t.p,p=t.r,o=t.N,n=t.P,m="";r.C();){l=r.d
m+=l+"\n"
k=s.l(0,l)
for(l=k.a,l=new A.a1(l,l.r,l.e,A.m(l).n("a1<1>"));l.C();){j=l.d
i=k.l(0,j)
m=i==null?m+("\t"+e.dk(j)+"\n"):m+("\t"+e.dk(j)+": "+i.D(0)+"\n")}for(l=k.b.a,j=new A.a1(l,l.r,l.e,A.m(l).n("a1<1>"));j.C();){h=j.d
m+=h+"\n"
if(!l.af(h))l.i(0,h,new A.aR(A.P(q,p),new A.b0(A.P(o,n))))
g=l.l(0,h)
for(h=g.a,h=new A.a1(h,h.r,h.e,A.m(h).n("a1<1>"));h.C();){f=h.d
i=g.l(0,f)
m=i==null?m+("\t"+e.dk(f)+"\n"):m+("\t"+e.dk(f)+": "+i.D(0)+"\n")}}}return m.charCodeAt(0)==0?m:m},
aR(a9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5=this,a6="exif",a7="interop",a8=a9.b
a9.b=!0
a9.a9(19789)
a9.a9(42)
a9.ae(8)
s=a5.a
if(s.l(0,"ifd0")==null)s.i(0,"ifd0",new A.aR(A.P(t.p,t.r),new A.b0(A.P(t.N,t.P))))
r=s.l(0,"ifd1")
q=a5.b
p=q!=null&&!B.d.gab(q)&&r!=null
if(p){r.i(0,513,A.kn(0))
r.i(0,514,A.kn(q.length))}else if(r!=null){o=r.a
o.ce(0,513)
o.ce(0,514)}n=A.j(["ifd0"],t.s)
for(o=new A.a1(s,s.r,s.e,A.m(s).n("a1<1>"));o.C();){m=o.d
if(m!=="ifd0")B.c.E(n,m)}o=t.N
m=t.p
l=A.P(o,m)
for(k=n.length,j=t.r,i=t.P,h=8,g=0;g<n.length;n.length===k||(0,A.K)(n),++g){f=n[g]
e=s.l(0,f)
e.toString
l.i(0,f,h)
d=e.b.a
if(d.af(a6)){c=new Uint32Array(1)
c[0]=0
e.i(0,34665,new A.b1(c))}else e.a.ce(0,34665)
if(d.af(a7)){c=new Uint32Array(1)
c[0]=0
e.i(0,40965,new A.b1(c))}else e.a.ce(0,40965)
if(d.af("gps")){c=new Uint32Array(1)
c[0]=0
e.i(0,34853,new A.b1(c))}else e.a.ce(0,34853)
e=e.a
h+=2+12*e.a+4
for(e=new A.at(e,e.r,e.e,A.m(e).n("at<2>"));e.C();){c=e.d
b=c.gaN().a
if(!(b<14))return A.a(B.B,b)
a=B.B[b]*c.gp(c)
if(a>4)h+=a}for(e=new A.a1(d,d.r,d.e,A.m(d).n("a1<1>"));e.C();){c=e.d
if(!d.af(c))d.i(0,c,new A.aR(A.P(m,j),new A.b0(A.P(o,i))))
b=d.l(0,c)
b.toString
l.i(0,c,h)
b=b.a
a0=2+12*b.a
for(c=new A.at(b,b.r,b.e,A.m(b).n("at<2>"));c.C();){b=c.d
a1=b.gaN().a
if(!(a1<14))return A.a(B.B,a1)
a=B.B[a1]*b.gp(b)
if(a>4)a0+=a}h+=a0}}if(p)r.l(0,513).bC(h)
a2=n.length
for(k=a2-1,a3=0;a3<a2;++a3){if(!(a3<n.length))return A.a(n,a3)
f=n[a3]
a4=s.l(0,f)
e=a4.b.a
if(e.af(a6)){d=a4.l(0,34665)
d.toString
c=l.l(0,a6)
c.toString
d.bC(c)}if(e.af(a7)){d=a4.l(0,40965)
d.toString
c=l.l(0,a7)
c.toString
d.bC(c)}if(e.af("gps")){d=a4.l(0,34853)
d.toString
c=l.l(0,"gps")
c.toString
d.bC(c)}d=l.l(0,f)
d.toString
a5.hB(a9,a4,d+2+12*a4.a.a+4)
if(a3===k)a9.ae(0)
else{d=a3+1
if(!(d<n.length))return A.a(n,d)
d=l.l(0,n[d])
d.toString
a9.ae(d)}a5.hC(a9,a4)
for(d=new A.a1(e,e.r,e.e,A.m(e).n("a1<1>"));d.C();){c=d.d
if(!e.af(c))e.i(0,c,new A.aR(A.P(m,j),new A.b0(A.P(o,i))))
b=e.l(0,c)
b.toString
c=l.l(0,c)
c.toString
a5.hB(a9,b,c+2+12*b.a.a)
a5.hC(a9,b)}}if(p)a9.au(q)
a9.b=a8},
hB(a,b,c){var s,r,q,p,o,n,m=b.a
a.a9(m.a)
for(m=new A.a1(m,m.r,m.e,A.m(m).n("a1<1>"));m.C();){s=m.d
r=b.l(0,s)
r.toString
q=s===273
p=q&&r.gaN()===B.Z?B.z:r.gaN()
o=q&&r.gaN()===B.Z?1:r.gp(r)
a.a9(s)
a.a9(p.a)
a.ae(o)
s=r.gaN().a
if(!(s<14))return A.a(B.B,s)
n=B.B[s]*r.gp(r)
if(n<=4){r.aR(a)
while(n<4){a.u(0);++n}}else{a.ae(c)
c+=n}}return c},
hC(a,b){var s,r,q
for(s=b.a,s=new A.at(s,s.r,s.e,A.m(s).n("at<2>"));s.C();){r=s.d
q=r.gaN().a
if(!(q<14))return A.a(B.B,q)
if(B.B[q]*r.gp(r)>4)r.aR(a)}},
cd(c6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3=this,c4="Length must be a non-negative integer: ",c5=c6.e
c6.e=!0
s=c6.d
a1=c6.m()
if(a1===18761){c6.e=!1
if(c6.m()!==42){c6.e=c5
return!1}}else if(a1===19789){c6.e=!0
if(c6.m()!==42){c6.e=c5
return!1}}else return!1
r=c6.k()
c3.c=0
q=0
a2=t.p
a3=A.o0(a2)
a4=c3.a
a5=t.n0
a6=c6.c
a7=t.r
a8=t.N
a9=t.P
for(;;){b0=r
if(typeof b0!=="number")return b0.iL()
if(b0>0){b0=q
if(typeof b0!=="number")return b0.f1()
b0=b0<64&&a3.E(0,r)}else b0=!1
if(!b0)break
try{b0=s
b1=r
if(typeof b0!=="number")return b0.am()
if(typeof b1!=="number")return A.jy(b1)
b1=b0+b1
c6.d=b1
if(a6-b1<2)break
p=new A.aR(A.P(a2,a7),new A.b0(A.P(a8,a9)))
o=c6.m()
b0=o
if(typeof b0!=="number")return b0.cL()
if(b0*12>a6-c6.d)break
n=o
b0=n
if(b0<0)A.a9(A.aJ(c4+A.A(b0),null))
m=A.j(new Array(b0),a5)
l=0
for(;;){b0=l
b1=n
if(typeof b0!=="number")return b0.f1()
if(typeof b1!=="number")return A.jy(b1)
if(!(b0<b1))break
J.a2(m,l,c3.h8(c6,s))
b0=l
if(typeof b0!=="number")return b0.am()
l=b0+1}k=m
for(b0=k,b1=b0.length,b2=0;b2<b0.length;b0.length===b1||(0,A.K)(b0),++b2){j=b0[b2]
if(j.b!=null){b3=j.a
b4=j.b
b4.toString
J.a2(p,b3,b4)}}a4.i(0,"ifd"+A.A(q),p)
b0=q
if(typeof b0!=="number")return b0.am()
q=b0+1
r=c6.k()}catch(b5){break}}for(b0=new A.at(a4,a4.r,a4.e,A.m(a4).n("at<2>"));b0.C();){i=b0.d
for(b1=B.dD.gig(),b1=b1.gF(b1);b1.C();){h=b1.gN()
b3=A.r(h)
if(i.a.af(b3))try{g=J.d(i,h).h(0)
b3=s
b4=g
if(typeof b3!=="number")return b3.am()
if(typeof b4!=="number")return A.jy(b4)
c6.d=b3+b4
f=new A.aR(A.P(a2,a7),new A.b0(A.P(a8,a9)))
e=c6.m()
d=e
b4=d
if(b4<0)A.a9(A.aJ(c4+A.A(b4),null))
c=A.j(new Array(b4),a5)
b=0
for(;;){b3=b
b4=d
if(typeof b3!=="number")return b3.f1()
if(typeof b4!=="number")return A.jy(b4)
if(!(b3<b4))break
J.a2(c,b,c3.h8(c6,s))
b3=b
if(typeof b3!=="number")return b3.am()
b=b3+1}a=c
for(b3=a,b4=b3.length,b2=0;b2<b3.length;b3.length===b4||(0,A.K)(b3),++b2){a0=b3[b2]
if(a0.b!=null){b6=a0.a
b7=a0.b
b7.toString
J.a2(f,b6,b7)}}b3=i.b
b4=B.dD.l(0,h)
b4.toString
b3.a.i(0,b4,a9.a(f))}catch(b5){continue}}}c3.b=null
b8=a4.l(0,"ifd1")
if(b8!=null){a2=b8.a
a2=a2.af(513)&&a2.af(514)}else a2=!1
if(a2){b9=b8.l(0,513).h(0)
c0=b8.l(0,514).h(0)
a2=s
if(typeof a2!=="number")return a2.am()
c1=a2+b9
if(c0>0){a2=s
if(typeof a2!=="number")return A.jy(a2)
a2=c1>=a2&&c1+c0<=a6}else a2=!1
if(a2){c2=c6.d
c6.d=c1
c3.b=c6.ac(c0).a0()
c6.d=c2}}c6.e=c5
return!1},
h8(a,b){var s,r,q,p,o,n,m,l=a.m(),k=a.m(),j=a.k(),i=new A.j5(l,null)
if(k>=14)return i
s=B.dd[k]
r=j*B.B[k]
if(this.c+r>16777216)return i
q=a.d
if((r>4?a.d=a.k()+b:q)+r>a.c)return i
p=a.ac(r)
this.c+=r
switch(s.a){case 0:break
case 6:i.b=new A.bD(new Int8Array(A.o(J.nK(B.d.gt(p.a0()),0,j))))
break
case 1:i.b=new A.bn(new Uint8Array(A.o(p.ac(j).a0())))
break
case 7:i.b=new A.cm(new Uint8Array(A.o(p.ac(j).a0())))
break
case 2:i.b=new A.cM(j===0?"":p.ar(j-1))
break
case 3:i.b=A.pv(p,j)
break
case 4:i.b=A.pq(p,j)
break
case 5:i.b=A.pr(p,j)
break
case 10:i.b=A.pt(p,j)
break
case 8:i.b=A.pu(p,j)
break
case 9:i.b=A.ps(p,j)
break
case 11:i.b=A.pw(p,j)
break
case 12:i.b=A.pp(p,j)
break
case 13:if(j===1){o=new A.cN(0)
n=p.k()
m=$.V()
m.$flags&2&&A.b(m)
m[0]=n
n=$.ad()
if(0>=n.length)return A.a(n,0)
o.a=n[0]
i.b=o}break}a.d=q+4
return i}}
A.j5.prototype={}
A.hE.prototype={}
A.b0.prototype={
j7(a){a.a.cc(0,new A.kk(this))},
gab(a){var s,r=this.a
if(r.a===0)return!0
for(r=new A.at(r,r.r,r.e,A.m(r).n("at<2>"));r.C();){s=r.d
if(!(s.a.a===0&&s.b.gab(0)))return!1}return!0},
l(a,b){var s=this.a
if(!s.af(b))s.i(0,b,new A.aR(A.P(t.p,t.r),new A.b0(A.P(t.N,t.P))))
s=s.l(0,b)
s.toString
return s}}
A.kk.prototype={
$2(a,b){var s
A.bs(a)
s=A.po(t.P.a(b))
this.a.a.i(0,a,s)
return s},
$S:14}
A.aR.prototype={
i0(a){a.a.cc(0,new A.kl(this))
a.b.a.cc(0,new A.km(this))},
l(a,b){var s=this.a.l(0,b)
return s},
i(a,b,c){var s,r,q,p,o,n,m,l,k=this
if(typeof b=="string")b=B.oD.l(0,b)
if(!A.jn(b))return
if(c instanceof A.a6)k.a.i(0,b,c)
else{s=$.nJ().l(0,b)
if(s!=null)switch(s.b.a){case 1:if(t.L.b(c))k.a.i(0,b,new A.bn(new Uint8Array(A.o(new Uint8Array(A.o(c))))))
else if(typeof c=="number"){r=B.a.h(c)
q=new Uint8Array(1)
q[0]=r
k.a.i(0,b,new A.bn(q))}break
case 2:break
case 3:if(t.L.b(c))k.a.i(0,b,new A.bR(new Uint16Array(A.o(new Uint16Array(A.o(c))))))
else if(typeof c=="number")k.a.i(0,b,A.tL(B.a.h(c)))
break
case 4:if(t.L.b(c))k.a.i(0,b,new A.b1(new Uint32Array(A.o(new Uint32Array(A.o(c))))))
else if(typeof c=="number")k.a.i(0,b,A.kn(B.a.h(c)))
break
case 5:if(t.k.b(c))k.a.i(0,b,new A.bC(A.dX(c,!0,t.i)))
else if(t.L.b(c)&&c.length===2){r=c.length
if(0>=r)return A.a(c,0)
q=c[0]
if(1>=r)return A.a(c,1)
k.a.i(0,b,new A.bC(A.j([new A.b7(q,c[1])],t.lf)))}else if(t.f.b(c)){p=c.length
r=t.i
o=J.bF(p,r)
for(n=0;n<p;++n){q=c[n]
m=q.length
if(0>=m)return A.a(q,0)
l=q[0]
if(1>=m)return A.a(q,1)
o[n]=new A.b7(l,q[1])}k.a.i(0,b,new A.bC(A.dX(o,!0,r)))}break
case 6:if(t.L.b(c))k.a.i(0,b,new A.bD(new Int8Array(A.o(new Int8Array(A.o(c))))))
else if(typeof c=="number"){r=B.a.h(c)
q=new Int8Array(1)
q[0]=r
k.a.i(0,b,new A.bD(q))}break
case 7:if(t.L.b(c))k.a.i(0,b,new A.cm(new Uint8Array(A.o(new Uint8Array(A.o(c))))))
break
case 8:if(t.L.b(c))k.a.i(0,b,new A.bQ(new Int16Array(A.o(new Int16Array(A.o(c))))))
else if(typeof c=="number"){r=B.a.h(c)
q=new Int16Array(1)
q[0]=r
k.a.i(0,b,new A.bQ(q))}break
case 9:if(t.L.b(c))k.a.i(0,b,new A.bP(new Int32Array(A.o(new Int32Array(A.o(c))))))
else if(typeof c=="number"){r=B.a.h(c)
q=new Int32Array(1)
q[0]=r
k.a.i(0,b,new A.bP(q))}break
case 10:if(t.k.b(c))k.a.i(0,b,new A.bE(A.dX(c,!0,t.i)))
else if(t.L.b(c)&&c.length===2){r=c.length
if(0>=r)return A.a(c,0)
q=c[0]
if(1>=r)return A.a(c,1)
k.a.i(0,b,new A.bE(A.j([new A.b7(q,c[1])],t.lf)))}else if(t.f.b(c)){p=c.length
r=t.i
o=J.bF(p,r)
for(n=0;n<p;++n){q=c[n]
m=q.length
if(0>=m)return A.a(q,0)
l=q[0]
if(1>=m)return A.a(q,1)
o[n]=new A.b7(l,q[1])}k.a.i(0,b,new A.bE(A.dX(o,!0,r)))}break
case 11:if(t.bd.b(c))k.a.i(0,b,new A.cl(new Float32Array(A.o(new Float32Array(A.o(c))))))
else if(typeof c=="number"){r=new Float32Array(1)
r[0]=c
k.a.i(0,b,new A.cl(r))}break
case 12:if(t.bd.b(c))k.a.i(0,b,new A.ck(new Float64Array(A.o(new Float64Array(A.o(c))))))
else if(typeof c=="number"){r=new Float64Array(1)
r[0]=c
k.a.i(0,b,new A.ck(r))}break
case 13:if(typeof c=="number")k.a.i(0,b,new A.cN(B.a.h(c)))
break
case 0:break}}},
gc1(){var s=this.a.l(0,274)
return s==null?null:s.h(0)},
sc1(a){this.a.ce(0,274)}}
A.kl.prototype={
$2(a,b){var s
A.r(a)
s=t.r.a(b).R()
this.a.a.i(0,a,s)
return s},
$S:36}
A.km.prototype={
$2(a,b){var s
A.bs(a)
s=A.po(t.P.a(b))
this.a.b.a.i(0,a,s)
return s},
$S:14}
A.ao.prototype={
a8(){return"IfdValueType."+this.b}}
A.a6.prototype={
ag(a,b){A.r(b)
return 0},
h(a){return this.ag(0,0)},
by(){return new Uint8Array(0)},
D(a){return""},
a_(a,b){var s=this
if(b==null)return!1
return b instanceof A.a6&&s.gaN()===b.gaN()&&s.gp(s)===b.gp(b)&&s.gK(s)===b.gK(b)},
gK(a){return 0},
bC(a){}}
A.bn.prototype={
R(){return new A.bn(new Uint8Array(A.o(this.a)))},
gaN(){return B.cp},
gp(a){return this.a.length},
a_(a,b){var s,r
if(b==null)return!1
if(b instanceof A.bn){s=this.a
r=b.a
s=s.length===r.length&&A.n(s)===A.n(r)}else s=!1
return s},
gK(a){return A.n(this.a)},
ag(a,b){var s
A.r(b)
s=this.a
if(!(b>=0&&b<s.length))return A.a(s,b)
return s[b]},
h(a){return this.ag(0,0)},
bC(a){var s=this.a
s.$flags&2&&A.b(s)
if(0>=s.length)return A.a(s,0)
s[0]=a},
by(){return this.a},
aR(a){a.au(this.a)},
D(a){var s=this.a,r=s.length
if(r===1){if(0>=r)return A.a(s,0)
s=""+s[0]}else s=A.A(s)
return s}}
A.cM.prototype={
R(){return new A.cM(this.a)},
gaN(){return B.m},
gp(a){return this.a.length+1},
a_(a,b){var s,r
if(b==null)return!1
if(b instanceof A.cM){s=this.a
r=b.a
s=s.length+1===r.length+1&&B.h.gK(s)===B.h.gK(r)}else s=!1
return s},
gK(a){return B.h.gK(this.a)},
by(){return new Uint8Array(A.o(new A.an(this.a)))},
aR(a){a.au(new A.an(this.a))
a.u(0)},
D(a){return this.a}}
A.bR.prototype={
jc(a,b){var s,r,q,p
for(s=this.a,r=s.$flags|0,q=0;q<b;++q){p=a.m()
r&2&&A.b(s)
if(!(q<s.length))return A.a(s,q)
s[q]=p}},
R(){return new A.bR(new Uint16Array(A.o(this.a)))},
gaN(){return B.k},
gp(a){return this.a.length},
a_(a,b){var s,r
if(b==null)return!1
if(b instanceof A.bR){s=this.a
r=b.a
s=s.length===r.length&&A.n(s)===A.n(r)}else s=!1
return s},
gK(a){return A.n(this.a)},
ag(a,b){var s
A.r(b)
s=this.a
if(!(b>=0&&b<s.length))return A.a(s,b)
return s[b]},
h(a){return this.ag(0,0)},
bC(a){var s=this.a
s.$flags&2&&A.b(s)
if(0>=s.length)return A.a(s,0)
s[0]=a},
by(){return J.I(B.v.gt(this.a))},
aR(a){var s,r=this.a,q=r.length
for(s=0;s<q;++s)a.a9(r[s])},
D(a){var s=this.a,r=s.length
if(r===1){if(0>=r)return A.a(s,0)
s=""+s[0]}else s=A.A(s)
return s}}
A.b1.prototype={
j9(a,b){var s,r,q,p
for(s=this.a,r=s.$flags|0,q=0;q<b;++q){p=a.k()
r&2&&A.b(s)
if(!(q<s.length))return A.a(s,q)
s[q]=p}},
R(){return new A.b1(new Uint32Array(A.o(this.a)))},
gaN(){return B.z},
gp(a){return this.a.length},
a_(a,b){var s,r
if(b==null)return!1
if(b instanceof A.b1){s=this.a
r=b.a
s=s.length===r.length&&A.n(s)===A.n(r)}else s=!1
return s},
gK(a){return A.n(this.a)},
ag(a,b){var s
A.r(b)
s=this.a
if(!(b>=0&&b<s.length))return A.a(s,b)
return s[b]},
h(a){return this.ag(0,0)},
bC(a){var s=this.a
s.$flags&2&&A.b(s)
if(0>=s.length)return A.a(s,0)
s[0]=a},
by(){return J.I(B.q.gt(this.a))},
aR(a){var s,r=this.a,q=r.length
for(s=0;s<q;++s)a.ae(r[s])},
D(a){var s=this.a,r=s.length
if(r===1){if(0>=r)return A.a(s,0)
s=""+s[0]}else s=A.A(s)
return s}}
A.bC.prototype={
R(){return new A.bC(A.dX(this.a,!0,t.i))},
gaN(){return B.E},
gp(a){return this.a.length},
ag(a,b){var s
A.r(b)
s=this.a
if(!(b>=0&&b<s.length))return A.a(s,b)
return s[b].h(0)},
h(a){return this.ag(0,0)},
a_(a,b){var s,r,q
if(b==null)return!1
if(b instanceof A.bC){s=this.a
r=s.length
q=b.a
s=r===q.length&&A.n(s)===A.n(q)}else s=!1
return s},
gK(a){return A.n(this.a)},
aR(a){var s,r,q,p
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.K)(s),++q){p=s[q]
a.ae(p.a)
a.ae(p.b)}},
D(a){var s=this.a,r=s.length
if(r===1){if(0>=r)return A.a(s,0)
s=s[0].D(0)}else s=A.A(s)
return s}}
A.bD.prototype={
R(){return new A.bD(new Int8Array(A.o(this.a)))},
gaN(){return B.cu},
gp(a){return this.a.length},
a_(a,b){var s,r
if(b==null)return!1
if(b instanceof A.bD){s=this.a
r=b.a
s=s.length===r.length&&A.n(s)===A.n(r)}else s=!1
return s},
gK(a){return A.n(this.a)},
ag(a,b){var s
A.r(b)
s=this.a
if(!(b>=0&&b<s.length))return A.a(s,b)
return s[b]},
h(a){return this.ag(0,0)},
bC(a){var s=this.a
s.$flags&2&&A.b(s)
if(0>=s.length)return A.a(s,0)
s[0]=a},
by(){return J.I(B.O.gt(this.a))},
aR(a){a.au(J.F(B.O.gt(this.a),0,null))},
D(a){var s=this.a,r=s.length
if(r===1){if(0>=r)return A.a(s,0)
s=""+s[0]}else s=A.A(s)
return s}}
A.bQ.prototype={
jb(a,b){var s,r,q,p,o
for(s=this.a,r=s.$flags|0,q=0;q<b;++q){p=a.m()
o=$.ax()
o.$flags&2&&A.b(o)
o[0]=p
p=$.aH()
if(0>=p.length)return A.a(p,0)
p=p[0]
r&2&&A.b(s)
if(!(q<s.length))return A.a(s,q)
s[q]=p}},
R(){return new A.bQ(new Int16Array(A.o(this.a)))},
gaN(){return B.cv},
gp(a){return this.a.length},
a_(a,b){var s,r
if(b==null)return!1
if(b instanceof A.bQ){s=this.a
r=b.a
s=s.length===r.length&&A.n(s)===A.n(r)}else s=!1
return s},
gK(a){return A.n(this.a)},
ag(a,b){var s
A.r(b)
s=this.a
if(!(b>=0&&b<s.length))return A.a(s,b)
return s[b]},
h(a){return this.ag(0,0)},
bC(a){var s=this.a
s.$flags&2&&A.b(s)
if(0>=s.length)return A.a(s,0)
s[0]=a},
by(){return J.I(B.y.gt(this.a))},
aR(a){var s,r,q,p=new Int16Array(1),o=J.p8(B.y.gt(p),0,null),n=this.a,m=n.length
for(s=o.length,r=0;r<m;++r){q=n[r]
if(0>=1)return A.a(p,0)
p[0]=q
if(0>=s)return A.a(o,0)
a.a9(o[0])}},
D(a){var s=this.a,r=s.length
if(r===1){if(0>=r)return A.a(s,0)
s=""+s[0]}else s=A.A(s)
return s}}
A.bP.prototype={
ja(a,b){var s,r,q,p,o
for(s=this.a,r=s.$flags|0,q=0;q<b;++q){p=a.k()
o=$.V()
o.$flags&2&&A.b(o)
o[0]=p
p=$.ad()
if(0>=p.length)return A.a(p,0)
p=p[0]
r&2&&A.b(s)
if(!(q<s.length))return A.a(s,q)
s[q]=p}},
R(){return new A.bP(new Int32Array(A.o(this.a)))},
gaN(){return B.cw},
gp(a){return this.a.length},
a_(a,b){var s,r
if(b==null)return!1
if(b instanceof A.bP){s=this.a
r=b.a
s=s.length===r.length&&A.n(s)===A.n(r)}else s=!1
return s},
gK(a){return A.n(this.a)},
ag(a,b){var s
A.r(b)
s=this.a
if(!(b>=0&&b<s.length))return A.a(s,b)
return s[b]},
h(a){return this.ag(0,0)},
bC(a){var s=this.a
s.$flags&2&&A.b(s)
if(0>=s.length)return A.a(s,0)
s[0]=a},
by(){return J.I(B.t.gt(this.a))},
aR(a){var s,r,q,p=this.a,o=p.length
for(s=0;s<o;++s){r=p[s]
q=$.jG()
q.$flags&2&&A.b(q)
q[0]=r
r=$.nH()
if(0>=r.length)return A.a(r,0)
a.ae(r[0])}},
D(a){var s=this.a,r=s.length
if(r===1){if(0>=r)return A.a(s,0)
s=""+s[0]}else s=A.A(s)
return s}}
A.bE.prototype={
R(){return new A.bE(A.dX(this.a,!0,t.i))},
gaN(){return B.cq},
gp(a){return this.a.length},
a_(a,b){var s,r,q
if(b==null)return!1
if(b instanceof A.bE){s=this.a
r=s.length
q=b.a
s=r===q.length&&A.n(s)===A.n(q)}else s=!1
return s},
gK(a){return A.n(this.a)},
ag(a,b){var s
A.r(b)
s=this.a
if(!(b>=0&&b<s.length))return A.a(s,b)
return s[b].h(0)},
h(a){return this.ag(0,0)},
aR(a){var s,r,q,p,o,n
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.K)(s),++q){p=s[q]
o=$.jG()
o.$flags&2&&A.b(o)
o[0]=p.a
n=$.nH()
if(0>=n.length)return A.a(n,0)
a.ae(n[0])
o[0]=p.b
a.ae(n[0])}},
D(a){var s=this.a,r=s.length
if(r===1){if(0>=r)return A.a(s,0)
s=s[0].D(0)}else s=A.A(s)
return s}}
A.cl.prototype={
jd(a,b){var s,r,q,p,o
for(s=this.a,r=s.$flags|0,q=0;q<b;++q){p=a.k()
o=$.V()
o.$flags&2&&A.b(o)
o[0]=p
p=$.cE()
if(0>=p.length)return A.a(p,0)
p=p[0]
r&2&&A.b(s)
if(!(q<s.length))return A.a(s,q)
s[q]=p}},
R(){return new A.cl(new Float32Array(A.o(this.a)))},
gaN(){return B.cr},
gp(a){return this.a.length},
a_(a,b){var s,r
if(b==null)return!1
if(b instanceof A.cl){s=this.a
r=b.a
s=s.length===r.length&&A.n(s)===A.n(r)}else s=!1
return s},
gK(a){return A.n(this.a)},
by(){return J.I(B.a1.gt(this.a))},
aR(a){var s,r=this.a,q=r.length
for(s=0;s<q;++s)a.o6(r[s])},
D(a){var s=this.a,r=s.length
if(r===1){if(0>=r)return A.a(s,0)
s=A.A(s[0])}else s=A.A(s)
return s}}
A.ck.prototype={
j8(a,b){var s,r
for(s=this.a,r=0;r<b;++r)B.x.i(s,r,a.dU())},
R(){return new A.ck(new Float64Array(A.o(this.a)))},
gaN(){return B.cs},
gp(a){return this.a.length},
a_(a,b){var s,r
if(b==null)return!1
if(b instanceof A.ck){s=this.a
r=b.a
s=s.length===r.length&&A.n(s)===A.n(r)}else s=!1
return s},
gK(a){return A.n(this.a)},
by(){return J.I(B.x.gt(this.a))},
aR(a){var s,r=this.a,q=r.length
for(s=0;s<q;++s)a.o7(r[s])},
D(a){var s=this.a,r=s.length
if(r===1){if(0>=r)return A.a(s,0)
s=A.A(s[0])}else s=A.A(s)
return s}}
A.cm.prototype={
R(){return new A.cm(new Uint8Array(A.o(this.a)))},
gaN(){return B.Z},
gp(a){return this.a.length},
by(){return this.a},
a_(a,b){var s,r
if(b==null)return!1
if(b instanceof A.cm){s=this.a
r=b.a
s=s.length===r.length&&A.n(s)===A.n(r)}else s=!1
return s},
gK(a){return A.n(this.a)},
aR(a){a.au(this.a)},
D(a){return"<data>"}}
A.cN.prototype={
R(){return A.kn(this.a)},
gaN(){return B.ct},
gp(a){return 1},
a_(a,b){var s
if(b==null)return!1
s=!1
if(b instanceof A.cN)s=this.a===b.a
return s},
gK(a){return this.a},
ag(a,b){if(A.r(b)!==0)throw A.e(A.um("Ifd tags must have exactly one entry (the offset)"))
return this.a},
h(a){return this.ag(0,0)},
bC(a){this.a=a},
by(){var s=this.a
return new Uint8Array(A.o(A.j([B.a.j(s,24),B.a.j(s,16),B.a.j(s,8),s],t.t)))},
aR(a){a.ae(this.a)},
D(a){return"Ifd@"+this.a}}
A.aK.prototype={
a8(){return"DitherKernel."+this.b}}
A.dH.prototype={
a8(){return"DitherScanOrder."+this.b}}
A.np.prototype={
$3(b2,b3,b4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5=this,a6=a5.a,a7=a5.b,a8=b3*a7+b2,a9=a5.c,b0=a8*a9,b1=a6.length
if(!(b0>=0&&b0<b1))return A.a(a6,b0)
s=a6[b0]
r=b0+1
if(!(r<b1))return A.a(a6,r)
q=a6[r]
r=b0+2
if(!(r<b1))return A.a(a6,r)
p=a6[r]
o=a5.d.dY(s,q,p)
r=a5.e
r.$flags&2&&A.b(r)
if(!(a8>=0&&a8<r.length))return A.a(r,a8)
r[a8]=o
a8=a5.f
r=o*3
n=a8.length
if(!(r>=0&&r<n))return A.a(a8,r)
m=s-a8[r]
l=r+1
if(!(l<n))return A.a(a8,l)
k=q-a8[l]
r+=2
if(!(r<n))return A.a(a8,r)
j=p-a8[r]
if(m===0&&k===0&&j===0)return
a8=b4===1
i=a8?0:a5.r-1
h=a8?a5.r:-1
for(a8=a5.w,r=a8.length,n=a5.x,l=n.length,g=a5.y,f=a6.$flags|0,e=a5.z,d=e.length,c=i;c!==h;c+=b4){if(!(c>=0&&c<r))return A.a(a8,c)
b=b2+a8[c]
if(!(c<l))return A.a(n,c)
a=b3+n[c]
if(b>=0&&b<a7&&a>=0&&a<g){if(!(c<d))return A.a(e,c)
a0=e[c]
a1=(a*a7+b)*a9
if(!(a1>=0&&a1<b1))return A.a(a6,a1)
a2=a6[a1]+m*a0
if(a2<0)a3=0
else a3=a2>255?255:B.b.h(a2)
f&2&&A.b(a6)
a6[a1]=a3
a3=a1+1
if(!(a3<b1))return A.a(a6,a3)
a2=a6[a3]+k*a0
if(a2<0)a4=0
else a4=a2>255?255:B.b.h(a2)
a6[a3]=a4
a4=a1+2
if(!(a4<b1))return A.a(a6,a4)
a2=a6[a4]+j*a0
if(a2<0)a3=0
else a3=a2>255?255:B.b.h(a2)
a6[a4]=a3}}},
$S:15}
A.nq.prototype={
$3(a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=this,a=b.a,a0=a.b0(a5,a6),a1=B.b.h(a0.l(0,0)),a2=B.b.h(a0.l(0,1)),a3=B.b.h(a0.l(0,2)),a4=b.b.dY(a1,a2,a3)
b.c.iQ(a5,a6,a4)
s=b.d
r=a1-s.aY(a4,0)
q=a2-s.aY(a4,1)
p=a3-s.aY(a4,2)
if(r===0&&q===0&&p===0)return
s=a7===1
o=s?0:b.e.length-1
n=s?b.e.length:0
for(s=b.e,m=s.length,l=b.f,k=b.r,j=o;j!==n;j+=a7){if(!(j>=0&&j<m))return A.a(s,j)
i=s[j]
h=B.b.h(i[1])
g=B.b.h(i[2])
f=h+a5
e=!1
if(f>=0)if(f<l){f=g+a6
f=f>=0&&f<k}else f=e
else f=e
if(f){d=i[0]
i=a.a
c=i==null?null:i.S(a5+h,a6+g,null)
if(c==null)c=new A.J()
c.sq(c.gq()+r*d)
c.sB(c.gB()+q*d)
c.sA(c.gA()+p*d)}}},
$S:15}
A.im.prototype={
hH(a,b,c){var s,r=this.c+b*c
this.c=r
s=this.a
if(s>0&&r>s)throw A.e(A.k("Animation frames exceed the maximum of "+s+" pixels"))}}
A.am.prototype={
a8(){return"BmpCompression."+this.b}}
A.jR.prototype={}
A.aZ.prototype={
fb(a,b){var s,r,q,p,o,n,m,l=this,k=l.d,j=k<=40
if(j){s=l.r
s=s===B.be||s===B.bf}else s=!0
if(s){s=l.as=a.k()
r=A.nm(s)
l.CW=r
q=B.a.a4(s,r)
s=q>0
l.cx=s?255/q:0
r=l.at=a.k()
p=A.nm(r)
l.cy=p
o=B.a.a4(r,p)
l.db=s?255/o:0
r=l.ax=a.k()
p=A.nm(r)
l.dx=p
n=B.a.a4(r,p)
l.dy=s?255/n:0
if(!j||l.r===B.bf){j=l.ay=a.k()
s=A.nm(j)
l.fr=s
m=B.a.a4(j,s)
l.fx=m>0?255/m:0}else if(l.f===16){l.ay=4278190080
l.fr=24
l.fx=1}else{l.ay=4278190080
l.fr=24
l.fx=1}}else if(l.f===16){l.as=31744
l.CW=10
l.cx=8.225806451612904
l.at=992
l.cy=5
l.db=8.225806451612904
l.ax=31
l.dx=0
l.dy=8.225806451612904
l.fx=l.fr=l.ay=0}else{l.as=16711680
l.CW=16
l.cx=1
l.at=65280
l.cy=8
l.db=1
l.ax=255
l.dx=0
l.dy=1
l.ay=4278190080
l.fr=24
l.fx=1}j=a.d
a.d=j+(k-(j-l.fy))
if(l.f<=8)l.nO(a)},
gd6(){var s=this.d
if(s!==40)if(s===124){s=this.ay
s===$&&A.c()
s=s===0}else s=!1
else s=!0
return s},
gI(){return Math.abs(this.c)},
gb7(){return 1},
nO(a){var s,r,q,p,o,n=this,m=n.z
if(m===0)m=B.a.O(1,n.f)
n.ch=new A.aU(new Uint8Array(m*3),m,3)
for(s=0;s<m;++s){r=J.d(a.a,a.d++)
q=J.d(a.a,a.d++)
p=J.d(a.a,a.d++)
o=J.d(a.a,a.d++)
n.ch.dl(s,p,q,r,o)}},
nd(a,b){var s,r,q,p,o,n,m,l,k,j=this
t.jO.a(b)
if(j.ch!=null){s=j.f
if(s===1){r=a.H()
for(q=7;q>=0;--q)b.$4(B.a.aM(r,q)&1,0,0,0)
return}else if(s===2){r=a.H()
for(q=6;q>=0;q-=2)b.$4(B.a.aM(r,q)&2,0,0,0)}else if(s===4){r=a.H()
b.$4(B.a.j(r,4)&15,0,0,0)
b.$4(r&15,0,0,0)
return}else if(s===8){b.$4(a.H(),0,0,0)
return}}s=j.r
if(s===B.be&&j.f===32){p=a.k()
s=j.as
s===$&&A.c()
o=j.CW
o===$&&A.c()
o=B.a.a4((p&s)>>>0,o)
s=j.cx
s===$&&A.c()
n=B.b.h(o*s)
s=j.at
s===$&&A.c()
o=j.cy
o===$&&A.c()
o=B.a.a4((p&s)>>>0,o)
s=j.db
s===$&&A.c()
m=B.b.h(o*s)
s=j.ax
s===$&&A.c()
o=j.dx
o===$&&A.c()
o=B.a.a4((p&s)>>>0,o)
s=j.dy
s===$&&A.c()
l=B.b.h(o*s)
if(j.gd6())k=255
else{s=j.ay
s===$&&A.c()
o=j.fr
o===$&&A.c()
o=B.a.a4((p&s)>>>0,o)
s=j.fx
s===$&&A.c()
k=B.b.h(o*s)}return b.$4(n,m,l,k)}else{o=j.f
if(o===32&&s===B.bZ){l=a.H()
m=a.H()
n=a.H()
k=a.H()
return b.$4(n,m,l,j.gd6()?255:k)}else if(o===24){l=a.H()
m=a.H()
return b.$4(a.H(),m,l,255)}else if(o===16){p=a.m()
s=j.as
s===$&&A.c()
o=j.CW
o===$&&A.c()
o=B.a.a4((p&s)>>>0,o)
s=j.cx
s===$&&A.c()
n=B.b.h(o*s)
s=j.at
s===$&&A.c()
o=j.cy
o===$&&A.c()
o=B.a.a4((p&s)>>>0,o)
s=j.db
s===$&&A.c()
m=B.b.h(o*s)
s=j.ax
s===$&&A.c()
o=j.dx
o===$&&A.c()
o=B.a.a4((p&s)>>>0,o)
s=j.dy
s===$&&A.c()
l=B.b.h(o*s)
if(j.gd6())k=255
else{s=j.ay
s===$&&A.c()
o=j.fr
o===$&&A.c()
o=B.a.a4((p&s)>>>0,o)
s=j.fx
s===$&&A.c()
k=B.b.h(o*s)}return b.$4(n,m,l,k)}else throw A.e(A.k("Unsupported bitsPerPixel ("+o+") or compression ("+s.D(0)+")."))}},
$iL:1,
gJ(){return this.b}}
A.hv.prototype={
aW(a){var s,r
if(!A.pa(A.v(a,!1,null,0))||a.length<18)return!1
s=A.v(a,!1,null,0)
s.d+=14
r=s.k()
return r>=12&&r<=124},
aC(a){return A.Q(new A.jQ(this,a),t.bL)},
jC(a){var s
if(!this.aW(a))return null
s=A.v(a,!1,null,0)
this.a=s
return this.b=A.tg(s,null)},
aJ(a){return A.Q(new A.jO(this,a),t.mo)},
jB(a1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=this,a=null,a0=b.b
if(a0==null)return new A.ap(a,a,a,a,0,B.l,0,0)
s=b.a
s===$&&A.c()
r=a0.a.b
r===$&&A.c()
s.d=r
r=a0.b
A.aw(r,a0.gI(),b.d,!1)
q=a0.f
p=B.a.P(r*q+31,32)*4
s=a0.gI()
o=b.a
if(p*s>o.c-o.d)throw A.e(A.k("Truncated BMP data"))
s=b.c
if(s)n=4
else if(q===1||q===4||q===8)n=1
else{o=q===32?4:3
n=o}if(s)m=B.e
else if(q===1)m=B.L
else{if(q===2)o=B.R
else if(q===4)o=B.S
else o=B.e
m=o}l=s?a:a0.ch
k=A.Z(a,a,m,0,B.l,a0.gI(),a,0,n,l,B.e,r,!1)
for(j=k.gI()-1,s=a0.c,r=1/s<0,o=s<0,s=s===0;j>=0;--j){i={}
if(!(s?r:o))h=j
else{g=k.a
g=g==null?a:g.b
h=(g==null?0:g)-1-j}g=b.a
f=g.aO(p)
g.d=g.d+(f.c-f.d)
g=k.a
e=g==null
d=e?a:g.a
if(d==null)d=0
i.a=0
c=e?a:g.S(0,h,a)
if(c==null)c=new A.J()
while(i.a<d)a0.nd(f,new A.jN(i,b,d,a0,c))}return k},
bd(a,b){return A.Q(new A.jP(this,a,b),t.H)},
jA(a,b){var s=this.aC(a)
if(s==null||s.b<1||s.gI()<1)return null
return this.aJ(b)}}
A.jQ.prototype={
$0(){return this.a.jC(this.b)},
$S:53}
A.jO.prototype={
$0(){return this.a.jB(this.b)},
$S:21}
A.jN.prototype={
$4(a,b,c,d){var s,r,q=this,p=q.a
if(p.a<q.c){s=q.b.c&&q.d.ch!=null
r=q.e
if(s){s=q.d
r.ao(s.ch.bj(a),s.ch.bi(a),s.ch.bh(a),s.ch.bq(a))}else r.ao(a,b,c,d)
r.C();++p.a}},
$S:55}
A.jP.prototype={
$0(){return this.a.jA(this.b,this.c)},
$S:1}
A.jV.prototype={}
A.L.prototype={}
A.jT.prototype={}
A.jW.prototype={}
A.hG.prototype={}
A.f2.prototype={
d9(){return this.w},
bz(a,b,c,d,e){throw A.e(A.k("B44 compression not yet supported."))},
cJ(a,b,c){return this.bz(a,b,c,null,null)},
D(a){return A.A(this.r)+" "+this.x}}
A.cJ.prototype={
a8(){return"ExrChannelType."+this.b}}
A.cI.prototype={
a8(){return"ExrChannelName."+this.b}}
A.hH.prototype={
j2(a){var s=this,r=a.dd()
s.a=r
if(r.length===0)return
r=a.k()
if(!(r<3))return A.a(B.d3,r)
s.c=B.d3[r]
a.H()
a.d+=3
s.f=a.k()
s.r=a.k()
r=s.a
if(r==="R"){s.w=!0
s.b=B.eD}else if(r==="G"){s.w=!0
s.b=B.eE}else if(r==="B"){s.w=!0
s.b=B.eF}else if(r==="A"){s.w=!0
s.b=B.eG}else{s.w=!1
s.b=B.eH}switch(s.c.a){case 0:s.d=4
break
case 1:s.d=2
break
case 2:s.d=4
break}}}
A.bk.prototype={
a8(){return"ExrCompressorType."+this.b}}
A.bN.prototype={
bz(a,b,c,d,e){throw A.e(A.k("Unsupported compression type"))},
cJ(a,b,c){return this.bz(a,b,c,null,null)}}
A.hY.prototype={}
A.hI.prototype={
snH(a){this.c=t.T.a(a)}}
A.hJ.prototype={
j3(a,b){var s,r,q,p,o,n=this,m=A.v(a,!1,null,0)
if(m.k()!==20000630)throw A.e(A.k("File is not an OpenEXR image file."))
s=n.d=m.H()
if(s!==2)throw A.e(A.k("Cannot read version "+s+" image files."))
s=n.e=m.bx()
if((s&4294967289)>>>0!==0)throw A.e(A.k("The file format version number's flag field contains unrecognized flags."))
r=new A.im(b)
if((s&16)===0){q=n.c
p=A.pA(q.length,(s&2)!==0,m,b)
if(p.w>0)B.c.E(q,p)}else for(s=n.c;;){p=A.pA(s.length,(n.e&2)!==0,m,b)
q=p.w
if(q<=0)break
r.hH(0,q,p.x)
B.c.E(s,p)}s=n.c
q=s.length
if(q===0)throw A.e(A.k("Error reading image header"))
for(o=0;o<s.length;s.length===q||(0,A.K)(s),++o)s[o].nN(m)
n.m4(m)},
gb7(){return 1},
m4(a){var s,r,q,p,o=this
for(s=o.c,r=s.length,q=0;q<s.length;s.length===r||(0,A.K)(s),++q){p=s[q]
o.a=Math.max(o.a,p.w)
o.b=Math.max(o.b,p.x)
if(p.db)o.md(p,a)
else o.mc(p,a)}},
md(b6,b7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4=null,b5=this.e
b5===$&&A.c()
s=(b5&16)!==0
b5=b6.b
b5.toString
r=b6.CW
q=b6.ay
p=A.w(b7,b4,0)
o=b6.c
n=b6.a
m=0
l=0
for(;;){k=b6.k1
k.toString
if(!(m<k))break
j=0
for(;;){k=b6.id
k.toString
if(!(j<k))break
k=l!==0
i=0
h=0
for(;;){g=b6.go
if(!(m<g.length))return A.a(g,m)
if(!(i<g[m]))break
f=0
for(;;){g=b6.fy
if(!(j<g.length))return A.a(g,j)
if(!(f<g[j]))break
if(k)break
if(!(l>=0&&l<q.length))return A.a(q,l)
g=q[l]
if(!(h>=0&&h<g.length))return A.a(g,h)
p.d=g[h]
if(s)if(p.k()!==n)throw A.e(A.k("Invalid Image Data"))
e=p.k()
d=p.k()
p.k()
p.k()
c=p.aO(p.k())
p.d=p.d+(c.c-c.d)
g=b6.dy
g.toString
b=d*g
a=b6.dx
a.toString
g=r.bz(c,e*a,b,a,g)
a=g.length
a=Math.min(a,a)
a0=new A.ar(g,0,a,0,!1)
a1=r.a
a2=r.b
a3=o.length
a4=0
a5=0
for(;;){if(!(a5<a2&&b<this.b))break
for(a6=0;a6<a3;++a6){if(a4>=a)break
if(!(a6<o.length))return A.a(o,a6)
a7=o[a6]
g=b6.dx
g.toString
a8=e*g
for(a9=0;a9<a1;++a9,++a8){g=a7.c
g===$&&A.c()
switch(g.a){case 1:g=a0.m()
b0=$.O
b0=b0!=null?b0:A.T()
if(!(g<b0.length))return A.a(b0,g)
b1=b0[g]
break
case 2:b1=a0.m()
break
case 0:b1=a0.k()
break
default:b1=b4}g=a7.d
g===$&&A.c()
a4+=g
g=a7.w
g===$&&A.c()
if(g){g=b5.a
b2=g==null?b4:g.S(a8,b,b4)
if(b2==null)b2=new A.J()
g=a7.b
g===$&&A.c()
b2.i(0,g.a,b1)}else{g=a7.a
g===$&&A.c()
b0=b5.b
b3=b0!=null?b0.l(0,g):b4
if(b3!=null)b3.aT(a8,b,b1,0,0)}}}++a5;++b}++f;++h}++i}++j;++l}++m}},
mc(a8,a9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6=null,a7=this.e
a7===$&&A.c()
s=(a7&16)!==0
a7=a8.b
a7.toString
r=a8.CW
q=a8.ay
if(0>=q.length)return A.a(q,0)
p=q[0]
o=a8.cx
n=A.w(a9,a6,0)
for(q=p.length,m=a8.c,l=r!=null,k=0,j=0;j<q;++j){n.d=p[j]
if(s)if(n.k()!==3.141592653589793)throw A.e(A.k("Invalid Image Data"))
i=n.k()
h=$.V()
h.$flags&2&&A.b(h)
h[0]=i
i=$.ad()
if(0>=i.length)return A.a(i,0)
h[0]=n.k()
g=n.aO(i[0])
n.d=n.d+(g.c-g.d)
if(l){i=r.cJ(g,0,k)
h=i.length
f=new A.ar(i,0,Math.min(h,h),0,!1)}else f=g
e=f.c-f.d
d=m.length
c=0
for(;;){if(!(c<o&&k<this.b))break
i=a8.cy
if(!(k>=0&&k<i.length))return A.a(i,k)
b=i[k]
if(b>=e)break
for(a=0;a<d;++a){if(b>=e)break
if(!(a<m.length))return A.a(m,a)
a0=m[a]
a1=a8.w
for(a2=0;a2<a1;++a2){i=a0.c
i===$&&A.c()
switch(i.a){case 1:i=f.m()
h=$.O
h=h!=null?h:A.T()
if(!(i<h.length))return A.a(h,i)
a3=h[i]
break
case 2:a3=f.m()
break
case 0:a3=f.k()
break
default:a3=a6}i=a0.d
i===$&&A.c()
b+=i
i=a0.w
i===$&&A.c()
if(i){i=a7.a
a4=i==null?a6:i.S(a2,k,a6)
if(a4==null)a4=new A.J()
i=a0.b
i===$&&A.c()
a4.i(0,i.a,a3)}else{i=a0.a
i===$&&A.c()
h=a7.b
a5=h!=null?h.l(0,i):a6
if(a5!=null)a5.aT(a2,k,a3,0,0)}}}++c;++k}}},
$iL:1,
gJ(){return this.a},
gI(){return this.b}}
A.eI.prototype={
j4(b3,b4,b5,b6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0=this,b1=null,b2=A.P(t.N,t.oD)
for(s=b0.e,r=t.t,q=t.L,p=b0.c,o=B.T;;){n=b5.dd()
if(n.length===0)break
b5.dd()
m=b5.aO(b5.k())
b5.d=b5.d+(m.c-m.d)
s.i(0,n,new A.hG())
switch(n){case"channels":for(;;){l=new A.hH()
l.j2(m)
k=l.a
k===$&&A.c()
if(k.length===0)break
j=l.w
j===$&&A.c()
if(j){++b0.d
k=l.c
k===$&&A.c()
if(k===B.cb)o=B.T
else o=k===B.cc?B.Y:B.ab}else{j=l.c
j===$&&A.c()
b2.i(0,k,j)}B.c.E(p,l)}break
case"chromaticities":k=new Float32Array(8)
b0.at=k
j=m.k()
i=$.V()
i.$flags&2&&A.b(i)
i[0]=j
j=$.cE()
if(0>=j.length)return A.a(j,0)
k[0]=j[0]
k=b0.at
i[0]=m.k()
h=j[0]
k.$flags&2&&A.b(k)
k[1]=h
h=b0.at
i[0]=m.k()
k=j[0]
h.$flags&2&&A.b(h)
h[2]=k
k=b0.at
i[0]=m.k()
h=j[0]
k.$flags&2&&A.b(k)
k[3]=h
h=b0.at
i[0]=m.k()
k=j[0]
h.$flags&2&&A.b(h)
h[4]=k
k=b0.at
i[0]=m.k()
h=j[0]
k.$flags&2&&A.b(k)
k[5]=h
h=b0.at
i[0]=m.k()
k=j[0]
h.$flags&2&&A.b(h)
h[6]=k
k=b0.at
i[0]=m.k()
j=j[0]
k.$flags&2&&A.b(k)
k[7]=j
break
case"compression":k=J.d(m.a,m.d++)
if(!(k>=0&&k<8))return A.a(B.de,k)
b0.ax=B.de[k]
break
case"dataWindow":k=m.k()
j=$.V()
j.$flags&2&&A.b(j)
j[0]=k
k=$.ad()
if(0>=k.length)return A.a(k,0)
i=k[0]
j[0]=m.k()
h=k[0]
j[0]=m.k()
g=k[0]
j[0]=m.k()
k=q.a(A.j([i,h,g,k[0]],r))
b0.r=k
b0.w=k[2]-k[0]+1
b0.x=k[3]-k[1]+1
break
case"displayWindow":k=m.k()
j=$.V()
j.$flags&2&&A.b(j)
j[0]=k
k=$.ad()
if(0>=k.length)return A.a(k,0)
j[0]=m.k()
j[0]=m.k()
j[0]=m.k()
break
case"lineOrder":break
case"pixelAspectRatio":k=m.k()
j=$.V()
j.$flags&2&&A.b(j)
j[0]=k
k=$.cE()
if(0>=k.length)return A.a(k,0)
break
case"screenWindowCenter":k=m.k()
j=$.V()
j.$flags&2&&A.b(j)
j[0]=k
k=$.cE()
if(0>=k.length)return A.a(k,0)
j[0]=m.k()
break
case"screenWindowWidth":k=m.k()
j=$.V()
j.$flags&2&&A.b(j)
j[0]=k
k=$.cE()
if(0>=k.length)return A.a(k,0)
break
case"tiles":b0.dx=m.k()
b0.dy=m.k()
f=J.d(m.a,m.d++)
b0.fr=f&15
b0.fx=B.a.j(f,4)&15
break
case"type":e=m.dd()
if(e!=="deepscanline")if(e!=="deeptile")throw A.e(A.k("EXR Invalid type: "+e))
break
default:break}}s=b0.w
if(s===0&&b0.x===0)return
A.aw(s,b0.x,b6,!1)
s=b0.w
b0.b=A.Z(b1,b1,o,0,B.l,b0.x,b1,0,b0.d,b1,B.e,s,!1)
for(s=new A.fa(b2,b2.$ti.n("fa<1,2>")).gF(0);s.C();){d=s.d
switch(d.b.a){case 1:r=b0.w
q=b0.x
r=new A.dL(new Uint16Array(r*q),r,q,1)
break
case 2:r=b0.w
q=b0.x
r=new A.dM(new Float32Array(r*q),r,q,1)
break
case 0:r=b0.w
q=b0.x
r=new A.dP(new Uint32Array(r*q),r,q,1)
break
default:r=b1}q=b0.b
q.toString
q.iP(d.a,r)}if(b0.db){c={}
b=b0.dx
if(b==null)b=0
a=b0.dy
if(a==null)a=0
if(b<1||a<1)throw A.e(A.k("Invalid EXR tile size"))
A.aw(b,a,b6,!1)
s=b0.r
s===$&&A.c()
b0.id=b0.jJ(s[0],s[2],s[1],s[3])
s=b0.r
b0.k1=b0.jK(s[0],s[2],s[1],s[3])
if(b0.fr!==2)b0.k1=1
s=b0.id
s.toString
r=b0.r
b0.fy=b0.fp(s,r[0],r[2],b0.dx,b0.fx)
r=b0.k1
r.toString
s=b0.r
b0.go=b0.fp(r,s[1],s[3],b0.dy,b0.fx)
s=b0.jI()
b0.k2=s
r=b0.dx
r.toString
r=s*r
b0.k3=r
b0.CW=A.pj(b0.ax,b0,r,b0.dy)
s=b0.k1
s.toString
r=b0.id
q=b0.fy
p=b0.go
a0=0
a1=0
for(;a1<s;++a1){r.toString
a2=0
for(;a2<r;++a2){if(!(a2<q.length))return A.a(q,a2)
k=q[a2]
if(!(a1<p.length))return A.a(p,a1)
a0+=k*p[a1]}}if(a0*8>b5.c-b5.d)throw A.e(A.k("Truncated EXR data"))
c.a=c.b=0
s=b0.id
s.toString
r=b0.k1
r.toString
b0.ay=A.pK(s*r,new A.k1(c,b0),t.mC)}else{s=b0.x
r=b0.ch=new Uint32Array(s+1)
for(q=p.length,k=b0.r,j=b0.w,a3=0;a3<q;++a3){a4=p[a3]
i=a4.d
i===$&&A.c()
h=a4.f
h===$&&A.c()
a5=B.a.Z(i*j,h)
for(i=a4.r,a6=0;a6<s;++a6){k===$&&A.c()
h=k[1]
i===$&&A.c()
if(B.a.a1(a6+h,i)===0)r[a6]=r[a6]+a5}}for(a7=0,a6=0;a6<s;++a6)a7=Math.max(a7,r[a6])
s=A.pj(b0.ax,b0,a7,b1)
b0.CW=s
s=b0.cx=s.d9()
r=b0.ch
q=r.length
p=new Uint32Array(q)
b0.cy=p
for(--q,a8=0,a9=0;a9<=q;++a9){if(B.a.a1(a9,s)===0)a8=0
p[a9]=a8
a8+=r[a9]}s=B.a.Z(b0.x+s,s)
b0.ay=A.j([new Uint32Array(s-1)],t.mD)}},
jJ(a,b,c,d){var s,r,q,p,o=this
switch(o.fr){case 0:s=1
break
case 1:r=Math.max(b-a+1,d-c+1)
q=o.fx
A.r(r)
s=(q===0?o.dD(r):o.dt(r))+1
break
case 2:p=b-a+1
s=(o.fx===0?o.dD(p):o.dt(p))+1
break
default:throw A.e(A.k("Unknown LevelMode format."))}return s},
jK(a,b,c,d){var s,r,q,p,o=this
switch(o.fr){case 0:s=1
break
case 1:r=Math.max(b-a+1,d-c+1)
q=o.fx
A.r(r)
s=(q===0?o.dD(r):o.dt(r))+1
break
case 2:p=d-c+1
s=(o.fx===0?o.dD(p):o.dt(p))+1
break
default:throw A.e(A.k("Unknown LevelMode format."))}return s},
dD(a){var s
for(s=0;a>1;){++s
a=B.a.j(a,1)}return s},
dt(a){var s,r
for(s=0,r=0;a>1;){if((a&1)!==0)r=1;++s
a=B.a.j(a,1)}return s+r},
jI(){var s,r,q,p,o
for(s=this.c,r=s.length,q=0,p=0;p<r;++p){o=s[p].d
o===$&&A.c()
q+=o}return q},
fp(a,b,c,d,e){var s,r,q,p,o,n,m=J.aa(a,t.p)
for(s=e===1,r=c-b+1,q=0;q<a;++q){p=B.a.O(1,q)
o=B.a.Z(r,p)
if(s&&o*p<r)++o
n=Math.max(o,1)
d.toString
m[q]=B.a.Z(n+d-1,d)}return m}}
A.k1.prototype={
$1(a){var s,r,q,p,o=this.b,n=o.fy,m=this.a,l=m.b
if(!(l<n.length))return A.a(n,l)
n=n[l]
s=o.go
r=m.a
if(!(r<s.length))return A.a(s,r)
s=s[r]
q=new Uint32Array(n*s)
p=l+1
m.b=p
if(p===o.id){m.b=0
m.a=r+1}return q},
$S:22}
A.hZ.prototype={
nN(a){var s,r,q,p,o,n=this
if(n.db)for(s=0;s<n.ay.length;++s){r=0
for(;;){q=n.ay
if(!(s<q.length))return A.a(q,s)
q=q[s]
if(!(r<q.length))break
p=a.eU()
q.$flags&2&&A.b(q)
q[r]=p;++r}}else{q=n.ay
if(0>=q.length)return A.a(q,0)
o=q[0].length
for(s=0;s<o;++s){q=n.ay
if(0>=q.length)return A.a(q,0)
q=q[0]
p=a.eU()
q.$flags&2&&A.b(q)
if(!(s<q.length))return A.a(q,s)
q[s]=p}}}}
A.i_.prototype={
jg(a,b,c){var s,r,q,p=this,o=a.c.length,n=J.aa(o,t.nA)
for(s=0;s<o;++s)n[s]=new A.h8()
p.y=t.a3.a(n)
r=p.w
r.toString
q=B.a.P(r*p.x,2)
p.z=new Uint16Array(q)},
d9(){return this.x},
bz(a6,a7,a8,a9,b0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5=this
if(a9==null)a9=a5.c.w
if(b0==null)b0=a5.c.cx
s=a7+a9-1
r=a8+b0-1
q=a5.c
p=q.w
if(s>p)s=p-1
p=q.x
if(r>p)r=p-1
a5.a=s-a7+1
a5.b=r-a8+1
o=q.c
n=o.length
for(m=0,l=0;l<n;++l){k=o[l]
q=a5.y
q===$&&A.c()
if(!(l<q.length))return A.a(q,l)
j=q[l]
j.b=j.a=m
q=k.f
q===$&&A.c()
i=B.a.Z(a7,q)
h=B.a.Z(s,q)
q=i*q<a7?0:1
q=h-i+q
j.c=q
p=k.r
p===$&&A.c()
i=B.a.Z(a8,p)
h=B.a.Z(r,p)
g=i*p<a8?0:1
g=h-i+g
j.d=g
j.e=p
p=k.d
p===$&&A.c()
p=p/2|0
j.f=p
m+=q*g*p}f=a6.m()
e=a6.m()
if(e>=8192)throw A.e(A.k("Error in header for PIZ-compressed data (invalid bitmap size)."))
d=new Uint8Array(8192)
if(f<=e){c=a6.ac(e-f+1)
b=c.c-c.d
for(a=f,l=0;l<b;++l,a=a0){a0=a+1
q=J.d(c.a,c.d+l)
if(!(a<8192))return A.a(d,a)
d[a]=q}}a1=new Uint16Array(65536)
a2=a5.ml(d,a1)
A.tA(a6,a6.k(),a5.z,m)
for(l=0;l<n;++l){q=a5.y
q===$&&A.c()
if(!(l<q.length))return A.a(q,l)
j=q[l]
a=0
for(;;){q=j.f
q===$&&A.c()
if(!(a<q))break
p=a5.z
p.toString
g=j.a
g===$&&A.c()
a3=j.c
a3===$&&A.c()
a4=j.d
a4===$&&A.c()
A.tD(p,g+a,a3,q,a4,a3*q,a2);++a}}q=a5.z
q.toString
a5.jt(a1,q,m)
q=a5.r
if(q==null){q=a5.w
q.toString
q=a5.r=A.ai(!1,q*a5.x+73728)}q.a=0
for(;a8<=r;++a8)for(l=0;l<n;++l){q=a5.y
q===$&&A.c()
if(!(l<q.length))return A.a(q,l)
j=q[l]
q=j.e
q===$&&A.c()
if(B.a.a1(a8,q)!==0)continue
q=j.c
q===$&&A.c()
p=j.f
p===$&&A.c()
a7=q*p
for(;a7>0;--a7){q=a5.r
q.toString
p=a5.z
p.toString
g=j.b
g===$&&A.c()
j.b=g+1
if(!(g>=0&&g<p.length))return A.a(p,g)
q.a9(p[g])}}q=a5.r
return J.F(B.d.gt(q.c),0,q.a)},
cJ(a,b,c){return this.bz(a,b,c,null,null)},
jt(a,b,c){var s,r,q,p=t.L
p.a(a)
p.a(b)
for(p=b.length,s=b.$flags|0,r=0;r<c;++r){if(!(r<p))return A.a(b,r)
q=b[r]
if(!(q>=0&&q<65536))return A.a(a,q)
q=a[q]
s&2&&A.b(b)
b[r]=q}},
ml(a,b){var s,r,q,p,o,n
for(s=b.$flags|0,r=0,q=0;q<65536;++q){if(q!==0){p=q>>>3
if(!(p<8192))return A.a(a,p)
p=(a[p]&1<<(q&7))>>>0!==0}else p=!0
if(p){o=r+1
s&2&&A.b(b)
if(!(r<65536))return A.a(b,r)
b[r]=q
r=o}}for(o=r;o<65536;o=n){n=o+1
s&2&&A.b(b)
if(!(o<65536))return A.a(b,o)
b[o]=0}return r-1}}
A.h8.prototype={}
A.i0.prototype={
d9(){return this.w},
bz(a4,a5,a6,a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1=this,a2=a4.a0(),a3=a1.r
a3.toString
a3=a1.w*a3
s=A.jz(a2,a3)
a2=a1.x;(a2==null?a1.x=A.ai(!1,a3):a2).a=0
r=A.j([0,0,0,0],t.t)
q=new Uint32Array(1)
p=J.F(B.q.gt(q),0,null)
if(a7==null)a7=a1.c.w
if(a8==null)a8=a1.c.cx
o=a5+a7-1
n=a6+a8-1
a2=a1.c
a3=a2.w
if(o>a3)o=a3-1
a3=a2.x
if(n>a3)n=a3-1
a1.a=o-a5+1
a1.b=n-a6+1
a2=a2.c
m=a2.length
for(a3=p.length,l=s.length,k=a6,j=0;k<=n;++k)for(i=0;i<m;++i){if(!(i<a2.length))return A.a(a2,i)
h=a2[i]
g=h.r
g===$&&A.c()
if(B.a.a1(a6,g)!==0)continue
g=h.f
g===$&&A.c()
f=B.a.Z(a5,g)
e=B.a.Z(o,g)
g=f*g<a5?0:1
d=e-f+g
if(0>=1)return A.a(q,0)
q[0]=0
g=h.c
g===$&&A.c()
switch(g.a){case 0:B.c.i(r,0,j)
B.c.i(r,1,r[0]+d)
B.c.i(r,2,r[1]+d)
j=r[2]+d
for(c=0;c<d;++c){g=r[0]
B.c.i(r,0,g+1)
if(!(g>=0&&g<l))return A.a(s,g)
g=s[g]
b=r[1]
B.c.i(r,1,b+1)
if(!(b>=0&&b<l))return A.a(s,b)
b=s[b]
a=r[2]
B.c.i(r,2,a+1)
if(!(a>=0&&a<l))return A.a(s,a)
a=s[a]
q[0]=q[0]+((g<<24|b<<16|a<<8)>>>0)
for(a0=0;a0<4;++a0){g=a1.x
g.toString
if(!(a0<a3))return A.a(p,a0)
g.u(p[a0])}}break
case 1:B.c.i(r,0,j)
B.c.i(r,1,r[0]+d)
j=r[1]+d
for(c=0;c<d;++c){g=r[0]
B.c.i(r,0,g+1)
if(!(g>=0&&g<l))return A.a(s,g)
g=s[g]
b=r[1]
B.c.i(r,1,b+1)
if(!(b>=0&&b<l))return A.a(s,b)
b=s[b]
q[0]=q[0]+((g<<8|b)>>>0)
for(a0=0;a0<2;++a0){g=a1.x
g.toString
if(!(a0<a3))return A.a(p,a0)
g.u(p[a0])}}break
case 2:B.c.i(r,0,j)
B.c.i(r,1,r[0]+d)
B.c.i(r,2,r[1]+d)
j=r[2]+d
for(c=0;c<d;++c){g=r[0]
B.c.i(r,0,g+1)
if(!(g>=0&&g<l))return A.a(s,g)
g=s[g]
b=r[1]
B.c.i(r,1,b+1)
if(!(b>=0&&b<l))return A.a(s,b)
b=s[b]
a=r[2]
B.c.i(r,2,a+1)
if(!(a>=0&&a<l))return A.a(s,a)
a=s[a]
q[0]=q[0]+((g<<24|b<<16|a<<8)>>>0)
for(a0=0;a0<4;++a0){g=a1.x
g.toString
if(!(a0<a3))return A.a(p,a0)
g.u(p[a0])}}break}}a2=a1.x
return J.F(B.d.gt(a2.c),0,a2.a)},
cJ(a,b,c){return this.bz(a,b,c,null,null)}}
A.i1.prototype={
d9(){return 1},
bz(a0,a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=this,b=a0.c,a=A.ai(!1,(b-a0.d)*2)
if(a3==null)a3=c.c.w
if(a4==null)a4=c.c.cx
s=a1+a3-1
r=a2+a4-1
q=c.c
p=q.w
if(s>p)s=p-1
q=q.x
if(r>q)r=q-1
c.a=s-a1+1
c.b=r-a2+1
while(q=a0.d,q<b){p=a0.a
a0.d=q+1
q=J.d(p,q)
p=$.ay()
p.$flags&2&&A.b(p)
p[0]=q
q=$.aI()
if(0>=q.length)return A.a(q,0)
o=q[0]
if(o<0){n=-o
for(;m=n-1,n>0;n=m)a.u(J.d(a0.a,a0.d++))}else for(n=o;m=n-1,n>=0;n=m)a.u(J.d(a0.a,a0.d++))}l=J.F(B.d.gt(a.c),0,a.a)
k=l.length
for(b=l.$flags|0,j=1;j<k;++j){q=l[j-1]
p=l[j]
b&2&&A.b(l)
l[j]=q+p-128}b=c.r
if(b==null||b.length!==k)b=c.r=new Uint8Array(k)
q=B.a.P(k+1,2)
for(i=0,h=0;;q=d,i=f){if(h<k){g=h+1
f=i+1
if(!(i<k))return A.a(l,i)
p=l[i]
b.$flags&2&&A.b(b)
e=b.length
if(!(h<e))return A.a(b,h)
b[h]=p}else break
if(g<k){h=g+1
d=q+1
if(!(q<k))return A.a(l,q)
q=l[q]
if(!(g<e))return A.a(b,g)
b[g]=q}else break}return b},
cJ(a,b,c){return this.bz(a,b,c,null,null)},
D(a){return A.A(this.w)}}
A.f3.prototype={
d9(){return this.x},
bz(a,b,c,d,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=a.a0(),e=g.w
if(e==null)e=0
s=A.jz(f,e*g.x)
if(d==null)d=g.c.w
if(a0==null)a0=g.c.cx
r=b+d-1
q=c+a0-1
f=g.c
e=f.w
if(r>e)r=e-1
f=f.x
if(q>f)q=f-1
g.a=r-b+1
g.b=q-c+1
p=s.length
for(f=s.$flags|0,o=1;o<p;++o){e=s[o-1]
n=s[o]
f&2&&A.b(s)
s[o]=e+n-128}f=g.y
if(f==null||f.length!==p)f=g.y=new Uint8Array(p)
e=B.a.P(p+1,2)
for(m=0,l=0;;e=h,m=j){if(l<p){k=l+1
j=m+1
if(!(m<p))return A.a(s,m)
n=s[m]
f.$flags&2&&A.b(f)
i=f.length
if(!(l<i))return A.a(f,l)
f[l]=n}else break
if(k<p){l=k+1
h=e+1
if(!(e<p))return A.a(s,e)
e=s[e]
if(!(k<i))return A.a(f,k)
f[k]=e}else break}return f},
cJ(a,b,c){return this.bz(a,b,c,null,null)},
D(a){return A.A(this.w)}}
A.jY.prototype={
aC(a){return A.Q(new A.k0(this,a),t._)},
aJ(a){return A.Q(new A.jZ(this,a),t.H)},
kM(a){var s=this.a
if(s==null)return null
s=s.c
if(!(a<s.length))return A.a(s,a)
return s[a].b},
bd(a,b){return A.Q(new A.k_(this,a,b),t.H)},
kL(a,b){if(this.aC(a)==null)return null
return this.aJ(b)}}
A.k0.prototype={
$0(){var s=this.a,r=new A.hJ(A.j([],t.lv))
r.j3(this.b,s.b)
return s.a=r},
$S:5}
A.jZ.prototype={
$0(){return this.a.kM(this.b)},
$S:1}
A.k_.prototype={
$0(){return this.a.kL(this.b,this.c)},
$S:1}
A.eN.prototype={
iI(){var s,r,q,p,o,n,m,l=this
if(l.c==null)return l.d
s=l.d
r=s.a
q=new A.aU(new Uint8Array(r*4),r,4)
for(p=0;p<r;++p){o=s.bj(p)
n=s.bi(p)
m=s.bh(p)
q.dl(p,o,n,m,p===l.c?0:255)}return q}}
A.eO.prototype={
j5(a){var s,r,q,p,o,n,m=this
m.a=a.m()
m.b=a.m()
m.c=a.m()
m.d=a.m()
s=a.H()
m.e=(s&64)!==0
if((s&128)!==0){m.f=A.pm(B.a.O(1,(s&7)+1))
for(r=0;q=m.f,r<q.b;++r){p=J.d(a.a,a.d++)
o=J.d(a.a,a.d++)
n=J.d(a.a,a.d++)
q.d.bk(r,p,o,n)}}m.y=a.d-a.b}}
A.i2.prototype={}
A.ch.prototype={
gb7(){return this.r.length},
$iL:1,
gJ(){return this.a},
gI(){return this.b}}
A.k8.prototype={
aW(a){var s,r
this.r=A.v(a,!1,null,0)
this.a=new A.ch(A.j([],t.lM))
try{s=this.fT()
return s}catch(r){return!1}},
aC(a){return A.Q(new A.kb(this,a),t.bT)},
l6(a){var s,r,q,p,o,n,m,l,k,j,i=this
i.r=A.v(a,!1,null,0)
i.a=new A.ch(A.j([],t.lM))
if(!i.fT())return null
p=i.a
A.aw(p.a,p.b,i.b,!0)
try{while(p=i.r,o=p.d,o<p.c){n=p.a
p.d=o+1
s=J.d(n,o)
switch(s){case 44:r=i.hl()
if(r==null){p=i.a
return p}p=r
p.r=i.f
p.w=i.d
if(i.c!==0){if(r.f==null&&i.a.e!=null){p=i.a.e
o=p.a
n=p.b
m=p.c
p=p.d
r.f=new A.eN(o,n,m,new A.aU(new Uint8Array(A.o(p.c)),p.a,p.b))}if(r.f!=null)r.f.c=i.e}B.c.E(i.a.r,r)
break
case 33:p=i.r
q=J.d(p.a,p.d++)
if(J.bf(q,255)){p=i.r
if(p.ar(J.d(p.a,p.d++))==="NETSCAPE2.0"){l=J.d(p.a,p.d++)
k=J.d(p.a,p.d++)
if(l===3&&k===1)i.w=p.m()}else i.dL()}else if(J.bf(q,249)){p=i.r
p.toString
i.m_(p)}else i.dL()
break
case 59:p=i.a
return p
default:break}}}catch(j){}return i.a},
m_(a){var s,r,q,p=this
a.H()
s=a.H()
p.f=a.m()
p.e=a.H()
a.H()
p.d=B.a.j(s,2)&7
p.c=s&1
r=a.dq(1,0)
if(J.d(r.a,r.d)===44){++a.d
q=p.hl()
if(q==null)return
q.r=p.f
q.w=p.d
r=p.c!==0
q.x=r?p.e:-1
if(r){r=q.f
if(r==null&&p.a.e!=null){r=p.a.e
r.toString
r=q.f=A.tI(r)}if(r!=null)r.c=p.e}B.c.E(p.a.r,q)}},
aJ(a){return A.Q(new A.k9(this,a),t.H)},
l5(a){var s,r,q,p=this,o=p.r
if(o==null||p.a==null)return null
s=p.a.r
r=s.length
if(a>=r)return null
q=s[a]
s=q.y
s===$&&A.c()
o.d=s
return p.kk(q)},
bd(a,b){return A.Q(new A.ka(this,a,b),t.H)},
l4(a,b){if(this.aC(a)==null)return null
this.a.toString
return this.aJ(b)},
hl(){var s,r=this.r
if(r.d>=r.c)return null
s=new A.i2()
s.j5(r);++this.r.d
this.dL()
return s},
kk(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this,e=null
if(f.x==null){f.x=new Uint8Array(256)
f.y=new Uint8Array(4095)
f.z=new Uint8Array(4096)
f.Q=new Uint32Array(4096)}s=f.as=f.r.H()
r=B.a.U(1,s)
f.fr=r;++r
f.dy=r
f.dx=r+1;++s
f.db=s
f.cy=B.a.U(1,s)
f.ch=0
f.cx=4098
f.ax=f.ay=0
s=f.x
s.toString
s.$flags&2&&A.b(s)
s[0]=0
s=f.Q
s.toString
B.q.V(s,0,4096,4098)
s=a.c
s===$&&A.c()
r=a.d
r===$&&A.c()
q=a.a
q===$&&A.c()
p=f.a
if(q+s<=p.a){q=a.b
q===$&&A.c()
q=q+r>p.b}else q=!0
if(q)return e
o=a.f
if(!(o!=null)){q=p.e
q.toString
o=q}f.at=s*r
n=A.Z(e,e,B.e,0,B.l,r,e,0,1,o.iI(),B.e,s,!1)
m=new Uint8Array(s)
q=a.e
q===$&&A.c()
if(q){q=a.b
q===$&&A.c()
for(r=q+r,l=0,k=0;l<4;++l)for(j=q+B.fe[l];j<r;j+=B.hX[l],++k){if(!f.fP(m))return n
p=n.a
i=p==null
h=i?e:p.a
g=j*(h==null?0:h)
p=i?e:J.I(p.gt(p))
if(p==null){p=n.a
p=p==null?e:p.gt(p)
if(p==null)p=B.d.gt(new Uint8Array(0))
p=J.I(p)}B.d.aa(p,g,g+s,m)}}else for(j=0;j<r;++j){if(!f.fP(m))return n
q=n.a
p=q==null
i=p?e:q.a
g=j*(i==null?0:i)
q=p?e:J.I(q.gt(q))
if(q==null){q=n.a
q=q==null?e:q.gt(q)
if(q==null)q=B.d.gt(new Uint8Array(0))
q=J.I(q)}B.d.aa(q,g,g+s,m)}return n},
fT(){var s,r,q,p,o,n=this,m=n.r.ar(6)
if(m!=="GIF87a"&&m!=="GIF89a")return!1
s=n.a
s.toString
s.a=n.r.m()
s=n.a
s.toString
s.b=n.r.m()
r=n.r.H()
s=n.a
s.toString
s.c=new A.bi(new Uint8Array(A.o(A.j([n.r.H()],t.t))));++n.r.d
if((r&128)!==0){s=n.a
s.toString
s.e=A.pm(B.a.O(1,(r&7)+1))
for(q=0;q<n.a.e.b;++q){s=n.r
p=J.d(s.a,s.d++)
s=n.r
o=J.d(s.a,s.d++)
s=n.r
r=J.d(s.a,s.d++)
n.a.e.d.bk(q,p,o,r)}}n.a.toString
return!0},
fP(a){var s=this,r=s.at
r.toString
s.at=r-a.length
if(!s.kv(a))return!1
if(s.at===0)s.dL()
return!0},
dL(){var s,r,q,p=this.r
if(p.d>=p.c)return!0
s=p.H()
for(;;){if(s!==0){p=this.r
p=p.d<p.c}else p=!1
if(!p)break
p=this.r
r=p.d+=s
if(r>=p.c)return!0
q=p.a
p.d=r+1
s=J.d(q,r)}return!0},
kv(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=g.ch
if(f>4095)return!1
s=a.length
r=0
if(f!==0){q=a.$flags|0
for(;;){if(!(f!==0&&r<s))break
p=r+1
o=g.y
o===$&&A.c()
f=g.ch=f-1
if(!(f>=0))return A.a(o,f)
o=o[f]
q&2&&A.b(a)
if(!(r<s))return A.a(a,r)
a[r]=o
r=p}}for(f=a.$flags|0;r<s;){n=g.CW=g.ku()
if(n==null)return!1
q=g.dy
if(n===q)return!1
o=g.fr
if(n===o){for(o=g.Q,m=0;m<=4095;++m){o.toString
o.$flags&2&&A.b(o)
o[m]=4098}g.dx=q+1
q=g.as+1
g.db=q
g.cy=B.a.U(1,q)
g.cx=4098}else{if(n<o){p=r+1
f&2&&A.b(a)
if(!(r>=0))return A.a(a,r)
a[r]=n
r=p}else{q=g.Q
q.toString
if(n>>>0!==n||n>=4096)return A.a(q,n)
if(q[n]===4098){l=g.dx-2
if(n===l){n=g.cx
k=g.z
k===$&&A.c()
j=g.y
j===$&&A.c()
i=g.ch++
o=g.es(q,n,o)
j.$flags&2&&A.b(j)
if(!(i>=0&&i<4095))return A.a(j,i)
j[i]=o
k.$flags&2&&A.b(k)
if(!(l>=0&&l<4096))return A.a(k,l)
k[l]=o}else return!1}m=0
for(;;){h=m+1
if(!(m<=4095&&n>g.fr&&n<=4095))break
q=g.y
q===$&&A.c()
o=g.ch++
l=g.z
l===$&&A.c()
if(!(n>=0&&n<4096))return A.a(l,n)
l=l[n]
q.$flags&2&&A.b(q)
if(!(o>=0&&o<4095))return A.a(q,o)
q[o]=l
n=g.Q[n]
m=h}if(h>=4095||n>4095)return!1
q=g.y
q===$&&A.c()
o=g.ch
l=g.ch=o+1
q.$flags&2&&A.b(q)
if(!(o>=0&&o<4095))return A.a(q,o)
q[o]=n
o=l
for(;;){if(!(o!==0&&r<s))break
p=r+1
o=g.ch=o-1
if(!(o>=0&&o<4095))return A.a(q,o)
l=q[o]
f&2&&A.b(a)
if(!(r>=0&&r<s))return A.a(a,r)
a[r]=l
r=p}}q=g.cx
if(q!==4098){o=g.Q
o.toString
l=g.dx-2
if(!(l>=0&&l<4096))return A.a(o,l)
l=o[l]===4098
o=l}else o=!1
if(o){o=g.Q
o.toString
l=g.dx-2
o.$flags&2&&A.b(o)
if(!(l>=0&&l<4096))return A.a(o,l)
o[l]=q
k=g.CW
j=g.z
i=g.fr
if(k===l){j===$&&A.c()
q=g.es(o,q,i)
j.$flags&2&&A.b(j)
j[l]=q}else{j===$&&A.c()
k.toString
q=g.es(o,k,i)
j.$flags&2&&A.b(j)
j[l]=q}}q=g.CW
q.toString
g.cx=q}}return!0},
ku(){var s,r,q,p,o=this
if(o.db>12)return null
while(s=o.ay,r=o.db,s<r){s=o.jD()
s.toString
r=o.ax
q=o.ay
o.ax=(r|B.a.U(s,q))>>>0
o.ay=q+8}q=o.ax
if(!(r>=0&&r<13))return A.a(B.cV,r)
p=B.cV[r]
o.ax=B.a.a6(q,r)
o.ay=s-r
s=o.dx
if(s<4097){++s
o.dx=s
s=s>o.cy&&r<12}else s=!1
if(s){o.cy=o.cy<<1>>>0
o.db=r+1}return q&p},
es(a,b,c){var s,r,q=0
for(;;){if(b>c){s=q+1
r=q<=4095
q=s}else r=!1
if(!r)break
if(b>4095)return 4098
a.toString
if(!(b>=0))return A.a(a,b)
b=a[b]}return b},
jD(){var s,r,q=this,p=q.x,o=p[0],n=p.$flags|0
if(o===0){o=q.r.H()
n&2&&A.b(p)
p[0]=o
p=q.x
o=p[0]
if(o===0)return null
B.d.aa(p,1,1+o,q.r.ac(o).a0())
p=q.x
s=p[1]
p.$flags&2&&A.b(p)
p[1]=2
p[0]=p[0]-1}else{r=p[1]
n&2&&A.b(p)
p[1]=r+1
if(!(r<256))return A.a(p,r)
s=p[r]
p[0]=o-1}return s}}
A.kb.prototype={
$0(){return this.a.l6(this.b)},
$S:24}
A.k9.prototype={
$0(){return this.a.l5(this.b)},
$S:1}
A.ka.prototype={
$0(){return this.a.l4(this.b,this.c)},
$S:1}
A.kc.prototype={
ghf(){return this.w},
mU(a,b){var s,r,q,p=this
if(p.id==null){p.id=A.ai(!1,8192)
if(!a.gaH()){s=A.o4(a,256,p.e)
p.as=s
p.z=A.oK(a,p.f,s,p.ghf(),1)}else p.z=a
p.Q=b
p.at=a.gJ()
p.ax=a.gI()
return}if(p.ay===0){s=p.at
s===$&&A.c()
r=p.ax
r===$&&A.c()
p.hE(s,r)
p.hz()}s=p.z
s.toString
p.hD(s)
s=p.z
s.toString
r=p.at
r===$&&A.c()
q=p.ax
q===$&&A.c()
p.fe(s,r,q);++p.ay
if(!a.gaH()){s=A.o4(a,256,p.e)
p.as=s
p.z=A.oK(a,p.f,s,p.ghf(),1)}else p.z=a
p.Q=b},
bW(a){return this.mU(a,null)},
cG(){var s,r,q,p,o=this
if(o.id==null)return null
if(o.ay===0){s=o.at
s===$&&A.c()
r=o.ax
r===$&&A.c()
o.hE(s,r)
o.hz()}s=o.z
s.toString
o.hD(s)
s=o.z
s.toString
r=o.at
r===$&&A.c()
q=o.ax
q===$&&A.c()
o.fe(s,r,q)
o.id.u(59)
o.as=o.z=null
o.ay=0
q=o.id
p=J.F(B.d.gt(q.c),0,q.a)
o.id=null
return p},
bM(a,b){var s
A.hn(a)
a.gav()
this.bW(a)
s=this.cG()
s.toString
return s},
fe(a,b,c){var s,r,q,p,o,n,m,l,k,j
if(!a.gaH())throw A.e(A.k("GIF can only encode palette images."))
s=a.a
r=s==null?null:s.gW()
q=r.a
p=this.id
p.u(44)
p.a9(0)
p.a9(0)
p.a9(b)
p.a9(c)
o=J.F(r.gt(r),0,null)
p.u(135)
n=r.b
if(n===3)p.au(o)
else if(n===4)for(s=o.length,m=0,l=0;m<q;++m,l+=4){if(!(l<s))return A.a(o,l)
p.u(o[l])
k=l+1
if(!(k<s))return A.a(o,k)
p.u(o[k])
k=l+2
if(!(k<s))return A.a(o,k)
p.u(o[k])}else if(n===1||n===2)for(s=o.length,m=0,l=0;m<q;++m,l+=n){if(!(l>=0&&l<s))return A.a(o,l)
j=o[l]
p.u(j)
p.u(j)
p.u(j)}for(m=q;m<256;++m){p.u(0)
p.u(0)
p.u(0)}this.kH(a,b,c)},
kH(a,b,c){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=this,d={}
e.go=e.CW=e.ch=0
e.fy=new Uint8Array(256)
e.id.u(8)
s=new Int32Array(5003)
r=new Int32Array(5003)
q=a.a
p=q.gF(q)
p.C()
e.cx=e.cy=9
e.dx=511
e.dy=256
e.db=257
e.fx=!1
e.fr=258
d.a=!1
o=new A.kd(d,p)
n=o.$0()
for(m=0,l=5003;l<65536;l*=2)++m
m=8-m
for(k=0;k<5003;++k)s[k]=-1
e.cT(e.dy)
for(j=!0;j;){i=o.$0()
for(j=!1;i!==-1;){h=(i<<12>>>0)+n
k=(B.a.U(i,m)^n)>>>0
if(!(k<5003))return A.a(s,k)
q=s[k]
if(q===h){n=r[k]
i=o.$0()
continue}else if(q>=0){g=5003-k
if(k===0)g=1
do{k-=g
if(k<0)k+=5003
if(!(k>=0&&k<5003))return A.a(s,k)
q=s[k]
if(q===h){n=r[k]
j=!0
break}}while(q>=0)
if(j)break}e.cT(n)
q=e.fr
if(q<4096){e.fr=q+1
r[k]=q
s[k]=h}else{for(k=0;k<5003;++k)s[k]=-1
q=e.dy
e.fr=q+2
e.fx=!0
e.cT(q)}f=o.$0()
n=i
i=f}}e.cT(n)
e.cT(e.db)
e.id.u(0)},
cT(a){var s,r=this,q=r.ch,p=r.CW
if(!(p>=0&&p<17))return A.a(B.dl,p)
q&=B.dl[p]
r.ch=q
if(p>0){q=(q|B.a.O(a,p))>>>0
r.ch=q}else{r.ch=a
q=a}p+=r.cx
r.CW=p
while(p>=8){r.fg(q&255)
q=B.a.j(r.ch,8)
r.ch=q
p=r.CW-=8}if(r.fr>r.dx||r.fx)if(r.fx){s=r.cy
r.cx=s
r.dx=B.a.O(1,s)-1
r.fx=!1}else{s=++r.cx
if(s===12)r.dx=4096
else r.dx=B.a.O(1,s)-1}if(a===r.db){while(p>0){r.fg(q&255)
q=B.a.j(r.ch,8)
r.ch=q
p=r.CW-=8}r.hA()}},
hA(){var s,r=this,q=r.go
if(q>0){r.id.u(q)
q=r.id
q.toString
s=r.fy
s===$&&A.c()
q.iC(s,r.go)
r.go=0}},
fg(a){var s,r,q=this,p=q.fy
p===$&&A.c()
s=q.go
r=s+1
q.go=r
p.$flags&2&&A.b(p)
if(!(s<256))return A.a(p,s)
p[s]=a
if(r>=254)q.hA()},
hz(){var s,r=this
r.id.u(33)
r.id.u(255)
r.id.u(11)
r.id.au(new A.an("NETSCAPE2.0"))
s=r.id
s.toString
s.au(A.j([3,1],t.t))
r.id.a9(r.b)
r.id.u(0)},
hD(a){var s,r,q,p,o,n,m,l,k,j,i,h=this
h.id.u(33)
h.id.u(249)
h.id.u(4)
s=a.a
r=s==null?null:s.gW()
q=r.b
p=q-1
o=0
n=0
if(q===4||q===2){m=J.F(r.gt(r),0,null)
l=r.a
for(s=m.length,k=p,j=o;j<l;++j,k+=q){if(!(k>=0&&k<s))return A.a(m,k)
if(m[k]===0){o=j
n=1
break}}}h.id.u(n|8)
s=h.id
s.toString
i=h.Q
s.a9(i==null?80:i)
h.id.u(o)
h.id.u(0)},
hE(a,b){var s=this
s.id.au(new A.an("GIF89a"))
s.id.a9(a)
s.id.a9(b)
s.id.u(0)
s.id.u(0)
s.id.u(0)}}
A.kd.prototype={
$0(){var s,r,q=this.a
if(q.a)return-1
s=this.b
r=A.r(s.gN().gX())
if(!s.C())q.a=!0
return r},
$S:25}
A.dK.prototype={
a8(){return"IcoType."+this.b}}
A.hR.prototype={$iL:1,
gJ(){return 0},
gI(){return 0},
gb7(){return this.d}}
A.hS.prototype={}
A.hQ.prototype={
gI(){return B.a.P(A.aZ.prototype.gI.call(this),2)},
gd6(){return!(this.d===40&&this.f===32)&&A.aZ.prototype.gd6.call(this)}}
A.kf.prototype={
aW(a){var s,r=this,q=A.v(a,!1,null,0)
r.a=q
try{r.b=A.pn(q)}catch(s){r.b=null}return r.b!=null},
aC(a){return A.Q(new A.ki(this,a),t._)},
bd(a,b){return A.Q(new A.kh(this,a,b),t.H)},
l8(a,b){if(this.aC(a)==null)return null
this.b.toString
return this.aJ(b)},
aJ(a){return A.Q(new A.kg(this,a),t.H)},
l9(b2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9=this,b0=null,b1=a9.a
if(b1!=null){s=a9.b
s=s==null||b2>=s.d}else s=!0
if(s)return b0
s=a9.b.e
if(!(b2<s.length))return A.a(s,b2)
r=s[b2]
s=b1.a
b1=b1.b+r.e
q=r.d
p=J.nM(s,b1,b1+q)
b1=a9.c
o=A.pZ(b1)
t.D.a(p)
if(o.aW(p))return o.bd(p,0)
n=A.ai(!1,14)
n.a9(19778)
n.ae(q)
n.ae(0)
n.ae(0)
s=A.v(p,!1,b0,0)
q=A.p9(A.v(J.F(B.d.gt(n.c),0,n.a),!1,b0,0))
m=s.d
l=s.k()
k=s.k()
j=$.V()
j.$flags&2&&A.b(j)
j[0]=k
k=$.ad()
if(0>=k.length)return A.a(k,0)
i=k[0]
j[0]=s.k()
k=k[0]
h=s.m()
g=s.m()
f=s.k()
if(f>=14)A.a9(A.k("Unsupported BMP compression type: "+f))
if(!(f<14))return A.a(B.b9,f)
f=B.b9[f]
s.k()
j[0]=s.k()
j[0]=s.k()
j=s.k()
s.k()
e=new A.hQ(q,i,k,l,h,g,f,j,m)
e.fb(s,q)
if(l!==40&&h!==1)return b0
d=j===0&&g<=8?40+4*B.a.O(1,g):40+4*j
q.b=d
n.a-=4
n.ae(d)
c=A.v(p,!1,b0,0)
b=new A.jV(!0,b1)
b.a=c
b.b=e
a=b.aJ(0)
if(g>=32)return a
a0=32-B.a.a1(i,32)
a1=B.a.P(a0===32?i:i+a0,8)
for(b1=k<0,s=k===0,k=1/k<0,a2=0;a2<B.a.P(A.aZ.prototype.gI.call(e),2);++a2){if(!(s?k:b1))a3=a2
else{q=a.a
q=q==null?b0:q.b
a3=(q==null?0:q)-1-a2}a4=c.aO(a1)
c.d=c.d+(a4.c-a4.d)
q=a.a
a5=q==null?b0:q.S(0,a3,b0)
if(a5==null)a5=new A.J()
for(a6=0;a6<i;){a7=J.d(a4.a,a4.d++)
a8=7
for(;;){if(!(a8>-1&&a6<i))break
if((a7&B.a.U(1,a8))>>>0!==0)a5.sv(0)
a5.C();++a6;--a8}}}return a}}
A.ki.prototype={
$0(){var s=this.a,r=A.v(this.b,!1,null,0)
s.a=r
return s.b=A.pn(r)},
$S:5}
A.kh.prototype={
$0(){return this.a.l8(this.b,this.c)},
$S:1}
A.kg.prototype={
$0(){return this.a.l9(this.b)},
$S:1}
A.m1.prototype={
bM(a,b){var s
A.hn(a)
a.gav()
s=this.nh(A.j([a],t.g))
return s},
nh(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=null
t.aL.a(a)
s=a.length
r=A.ai(!1,8192)
r.a9(0)
r.a9(1)
r.a9(s)
q=6+s*16
p=A.j([A.j([],t.t)],t.S)
for(o=a.length,n=0,m=0;m<a.length;a.length===o||(0,A.K)(a),++m){l=a[m]
k=l.a
j=k==null
i=j?g:k.a
if((i==null?0:i)<=256){i=j?g:k.b
i=(i==null?0:i)>256}else i=!0
if(i)throw A.e(A.pi("ICO and CUR support only sizes until 256"))
k=j?g:k.a
r.u(k==null?0:k)
k=l.a
k=k==null?g:k.b
r.u(k==null?0:k)
r.u(0)
r.u(0)
r.a9(0)
r.a9(32)
h=new A.is(B.dH,g,g).bM(l,!0)
k=h.length
r.ae(k)
r.ae(q)
q+=k;++n
B.c.E(p,h)}for(o=p.length,m=0;m<p.length;p.length===o||(0,A.K)(p),++m)r.au(p[m])
return J.F(B.d.gt(r.c),0,r.a)}}
A.kj.prototype={}
A.hy.prototype={}
A.ci.prototype={}
A.cL.prototype={}
A.dJ.prototype={}
A.kA.prototype={
jh(a){var s,r,q,p,o,n,m,l=this,k=null,j="ifd0",i=l.a,h=i.y
if(h.l(0,j).a.af(274)){s=h.l(0,j).gc1()
s.toString
r=s}else r=0
q=r>=5&&r<=8
p=q?l.c:l.b
s=A.Z(k,k,B.e,0,B.l,q?l.b:l.c,k,0,3,k,B.e,p,!1)
s.e=A.eH(h)
s.gbe().l(0,j).sc1(k)
s.c=i.x
l.d!==$&&A.B()
l.d=s
i=s.a
i=J.I(i.gt(i))
l.e!==$&&A.B()
l.e=i
o=s.a.gaB()
n=l.b-1
m=l.c-1
i=l.f
switch(r){case 2:i!==$&&A.B()
l.f=n*3
l.r!==$&&A.B()
l.r=-3
l.w!==$&&A.B()
l.w=o
break
case 3:i!==$&&A.B()
l.f=m*o+n*3
l.r!==$&&A.B()
l.r=-3
l.w!==$&&A.B()
l.w=-o
break
case 4:i!==$&&A.B()
l.f=m*o
l.r!==$&&A.B()
l.r=3
l.w!==$&&A.B()
l.w=-o
break
case 5:i!==$&&A.B()
l.f=0
l.r!==$&&A.B()
l.r=o
l.w!==$&&A.B()
l.w=3
break
case 6:i!==$&&A.B()
l.f=m*3
l.r!==$&&A.B()
l.r=o
l.w!==$&&A.B()
l.w=-3
break
case 7:i!==$&&A.B()
l.f=n*o+m*3
l.r!==$&&A.B()
l.r=-o
l.w!==$&&A.B()
l.w=-3
break
case 8:i!==$&&A.B()
l.f=n*o
l.r!==$&&A.B()
l.r=-o
l.w!==$&&A.B()
l.w=3
break
default:i!==$&&A.B()
l.f=0
l.r!==$&&A.B()
l.r=3
l.w!==$&&A.B()
l.w=o
break}},
iD(d3,d4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9=this,d0=c9.a,d1=d0.ax,d2=d1.length
switch(d2){case 1:if(0>=d2)return A.a(d1,0)
s=d1[0]
r=s.f
q=s.r
d0=c9.f
d0===$&&A.c()
d2=c9.w
d2===$&&A.c()
p=d0+d3*d2
for(d0=c9.b,o=c9.r,n=c9.e,m=s.e,l=m.length,k=d3;k<d4;++k,p+=d2){j=B.a.j(k,q)
if(!(j<l))return A.a(m,j)
i=m[j]
j=i.length
h=p
g=0
while(g<d0){f=B.a.a6(g,r)
if(!(f<j))return A.a(i,f)
e=i[f]
n===$&&A.c()
n.$flags&2&&A.b(n)
f=n.length
if(!(h>=0&&h<f))return A.a(n,h)
n[h]=e
d=h+1
if(!(d<f))return A.a(n,d)
n[d]=e
d=h+2
if(!(d<f))return A.a(n,d)
n[d]=e;++g
o===$&&A.c()
h+=o}}break
case 3:d0=d0.e
c=d0==null||d0.d===1
if(0>=d2)return A.a(d1,0)
s=d1[0]
if(1>=d2)return A.a(d1,1)
b=d1[1]
if(2>=d2)return A.a(d1,2)
a=d1[2]
r=s.f
q=s.r
a0=b.f
a1=b.r
a2=a.f
a3=a.r
a4=$.p1()
d0=c9.f
d0===$&&A.c()
d2=c9.w
d2===$&&A.c()
p=d0+d3*d2
for(d0=c9.b,o=c9.r,n=c9.e,m=s.e,l=m.length,j=b.e,f=j.length,d=a.e,a5=d.length,k=d3;k<d4;++k,p+=d2){a6=B.a.j(k,q)
if(!(a6<l))return A.a(m,a6)
a6=m[a6]
a6.toString
a7=B.a.j(k,a1)
if(!(a7<f))return A.a(j,a7)
a7=j[a7]
a7.toString
a8=B.a.j(k,a3)
if(!(a8<a5))return A.a(d,a8)
a8=d[a8]
a8.toString
if(c){a9=a6.length
b0=a7.length
b1=a8.length
h=p
g=0
while(g<d0){b2=B.a.a6(g,r)
if(!(b2<a9))return A.a(a6,b2)
e=(a6[b2]<<8>>>0)+65536
b2=B.a.a6(g,a0)
if(!(b2<b0))return A.a(a7,b2)
b3=a7[b2]-128
b2=B.a.a6(g,a2)
if(!(b2<b1))return A.a(a8,b2)
b4=a8[b2]-128
n===$&&A.c()
b2=B.a.j(e+359*b4,8)
if(!(b2<768))return A.a(a4,b2)
b2=a4[b2]
n.$flags&2&&A.b(n)
b5=n.length
if(!(h>=0&&h<b5))return A.a(n,h)
n[h]=b2
b2=h+1
b6=B.a.j(e-88*b3-183*b4,8)
if(!(b6<768))return A.a(a4,b6)
b6=a4[b6]
if(!(b2<b5))return A.a(n,b2)
n[b2]=b6
b6=h+2
b2=B.a.j(e+454*b3,8)
if(!(b2<768))return A.a(a4,b2)
b2=a4[b2]
if(!(b6<b5))return A.a(n,b6)
n[b6]=b2;++g
o===$&&A.c()
h+=o}}else{a9=a6.length
b0=a7.length
b1=a8.length
h=p
g=0
while(g<d0){n===$&&A.c()
b2=B.a.a6(g,r)
if(!(b2<a9))return A.a(a6,b2)
b2=a6[b2]
n.$flags&2&&A.b(n)
b5=n.length
if(!(h>=0&&h<b5))return A.a(n,h)
n[h]=b2
b2=h+1
b6=B.a.a6(g,a0)
if(!(b6<b0))return A.a(a7,b6)
b6=a7[b6]
if(!(b2<b5))return A.a(n,b2)
n[b2]=b6
b6=h+2
b2=B.a.a6(g,a2)
if(!(b2<b1))return A.a(a8,b2)
b2=a8[b2]
if(!(b6<b5))return A.a(n,b6)
n[b6]=b2;++g
o===$&&A.c()
h+=o}}}break
case 4:d0=d0.e
if(d0==null)throw A.e(A.k("Unsupported color mode (4 components)"))
d0=d0.d===0
if(0>=d2)return A.a(d1,0)
s=d1[0]
if(1>=d2)return A.a(d1,1)
b=d1[1]
if(2>=d2)return A.a(d1,2)
a=d1[2]
if(3>=d2)return A.a(d1,3)
b7=d1[3]
r=s.f
q=s.r
a0=b.f
a1=b.r
a2=a.f
a3=a.r
b8=b7.f
b9=b7.r
a4=$.p1()
d2=c9.f
d2===$&&A.c()
o=c9.w
o===$&&A.c()
p=d2+d3*o
for(d2=c9.b,n=c9.r,m=c9.e,l=s.e,j=l.length,f=b.e,d=f.length,a5=a.e,a6=a5.length,a7=b7.e,a8=a7.length,k=d3;k<d4;++k,p+=o){a9=B.a.j(k,q)
if(!(a9<j))return A.a(l,a9)
a9=l[a9]
a9.toString
b0=B.a.j(k,a1)
if(!(b0<d))return A.a(f,b0)
b0=f[b0]
b0.toString
b1=B.a.j(k,a3)
if(!(b1<a6))return A.a(a5,b1)
b1=a5[b1]
b1.toString
b2=B.a.j(k,b9)
if(!(b2<a8))return A.a(a7,b2)
c0=a7[b2]
b2=a9.length
b5=b0.length
b6=b1.length
c1=c0.length
h=p
g=0
while(g<d2){c2=B.a.a6(g,b8)
if(!(c2<c1))return A.a(c0,c2)
c3=c0[c2]
if(d0){c2=B.a.a6(g,r)
if(!(c2<b2))return A.a(a9,c2)
c4=a9[c2]
c2=B.a.a6(g,a0)
if(!(c2<b5))return A.a(b0,c2)
c5=b0[c2]
c2=B.a.a6(g,a2)
if(!(c2<b6))return A.a(b1,c2)
e=b1[c2]}else{c2=B.a.a6(g,r)
if(!(c2<b2))return A.a(a9,c2)
c6=(a9[c2]<<8>>>0)+65536
c2=B.a.a6(g,a0)
if(!(c2<b5))return A.a(b0,c2)
b3=b0[c2]-128
c2=B.a.a6(g,a2)
if(!(c2<b6))return A.a(b1,c2)
b4=b1[c2]-128
c2=B.a.j(c6+359*b4,8)
if(!(c2<768))return A.a(a4,c2)
c4=255-a4[c2]
c2=B.a.j(c6-88*b3-183*b4,8)
if(!(c2<768))return A.a(a4,c2)
c5=255-a4[c2]
c2=B.a.j(c6+454*b3,8)
if(!(c2<768))return A.a(a4,c2)
e=255-a4[c2]}m===$&&A.c()
c2=B.a.j(c4*c3,8)
m.$flags&2&&A.b(m)
c7=m.length
if(!(h>=0&&h<c7))return A.a(m,h)
m[h]=c2
c2=h+1
c8=B.a.j(c5*c3,8)
if(!(c2<c7))return A.a(m,c2)
m[c2]=c8
c8=h+2
c2=B.a.j(e*c3,8)
if(!(c8<c7))return A.a(m,c8)
m[c8]=c2;++g
n===$&&A.c()
h+=n}}break
default:throw A.e(A.k("Unsupported color mode"))}}}
A.kt.prototype={}
A.cp.prototype={}
A.i9.prototype={
o5(a){var s,r,q,p,o,n=this,m=A.v(t.L.a(a),!0,null,0)
n.c=m
s=m.dq(2,0)
if(J.d(s.a,s.d)!==255||J.d(s.a,s.d+1)!==216)return!1
if(n.bK()!==216)return!1
r=n.bK()
q=!1
p=!1
for(;;){if(r!==217){m=n.c
m=m.d<m.c}else m=!1
if(!m)break
o=n.c.m()
if(o<2)break
m=n.c
m.d=m.d+(o-2)
switch(r){case 192:case 193:case 194:q=!0
break
case 218:if(q)return!0
p=!0
break}r=n.bK()}return q&&p},
nM(a){var s,r,q,p,o,n,m=this
m.c=A.v(t.L.a(a),!0,null,0)
if(m.bK()!==216)return null
s=new A.ib()
r=m.bK()
q=!1
p=!1
for(;;){if(r!==217){o=m.c
o=o.d<o.c}else o=!1
if(!o)break
switch(r){case 192:case 193:case 194:m.h9(r,m.h6(),!1)
q=!0
break
case 218:m.hk()
p=!0
break
default:m.hk()
break}r=m.bK()}o=m.f
if(o!=null){n=o.e
n.toString
s.a=n
o=o.d
o.toString
s.b=o}o=m.f=null
B.c.ca(m.Q)
return q&&p?s:o},
cd(a){var s,r,q,p,o,n,m=this
m.c=A.v(t.L.a(a),!0,null,0)
m.lS()
if(m.Q.length!==1)throw A.e(A.k("Only single frame JPEGs supported"))
s=m.f
s.toString
if(m.cy!=null)return
if(!m.ay){m.ay=!0
s.nK(m.b===8)}for(r=s.z,q=s.y,p=m.ax,o=0;o<r.length;++o){n=q.l(0,r[o])
B.c.E(p,A.pg(n.a,s.f,n.b,s.r,m.jF(s,n)))}},
gdZ(){var s,r=this.f.d
r.toString
s=this.b
return B.a.Z(r+s-1,s)},
lS(){var s,r,q,p,o=this
o.ch=0
if(o.bK()!==216)throw A.e(A.k("Start Of Image marker not found."))
s=o.bK()
for(;;){if(s!==217){r=o.c
r===$&&A.c()
r=r.d<r.c}else r=!1
if(!r)break
A:{if(s>=208&&s<=215||s===1){s=o.bK()
break A}q=o.h6()
switch(s){case 224:case 225:case 226:case 227:case 228:case 229:case 230:case 231:case 232:case 233:case 234:case 235:case 236:case 237:case 238:case 239:case 254:o.lT(s,q)
break
case 219:o.lW(q)
break
case 192:case 193:case 194:o.lY(s,q)
break
case 195:case 197:case 198:case 199:case 200:case 201:case 202:case 203:case 205:case 206:case 207:throw A.e(A.k("Unhandled frame type "+B.a.dW(s,16)))
case 196:o.lV(q)
break
case 221:o.r=q.m()
break
case 218:o.mb(q)
break
case 255:r=o.c
r===$&&A.c()
if(J.d(r.a,r.d)!==255)--o.c.d
break
default:r=o.c
r===$&&A.c()
p=!1
if(J.d(r.a,r.d+-3)===255){r=o.c
if(J.d(r.a,r.d+-2)>=192){r=o.c
r=J.d(r.a,r.d+-2)<=254}else r=p}else r=p
if(r){o.c.d-=3
break}if(s!==0)throw A.e(A.k("Unknown JPEG marker "+B.a.dW(s,16)))
break}s=o.bK()}}},
hk(){var s,r=this.c
r===$&&A.c()
s=r.m()
if(s<2)throw A.e(A.k("Invalid Block"))
r=this.c
r.d=r.d+(s-2)},
h6(){var s,r=this.c
r===$&&A.c()
s=r.m()
if(s<2)throw A.e(A.k("Invalid Block"))
return this.c.ac(s-2)},
bK(){var s,r=this,q=r.c
q===$&&A.c()
if(q.d>=q.c)return 0
do{do{s=r.c.H()
if(s!==255){q=r.c
q=q.d<q.c}else q=!1}while(q)
q=r.c
if(q.d>=q.c)return s
do{s=r.c.H()
if(s===255){q=r.c
q=q.d<q.c}else q=!1}while(q)
if(s===0){q=r.c
q=q.d<q.c}else q=!1}while(q)
return s},
m3(a){var s
for(s=0;s<12;++s)if(J.d(a.a,a.d++)!==B.nP[s])return
this.x=new A.cj("ICC_PROFILE",B.ai,a.a0())},
lX(a){if(a.k()!==1165519206)return
if(a.m()!==0)return
this.y.cd(a)},
lT(a,b){var s,r,q,p,o,n=this,m=b
if(n.cy!=null)s=a===225||a===238
else s=!1
if(s)n.cx=!0
if(a===224){s=m
r=!1
if(J.d(s.a,s.d)===74){s=m
if(J.d(s.a,s.d+1)===70){s=m
if(J.d(s.a,s.d+2)===73){s=m
if(J.d(s.a,s.d+3)===70){s=m
s=J.d(s.a,s.d+4)===0}else s=r}else s=r}else s=r}else s=r
if(s){s=new A.kB()
r=m
J.d(r.a,r.d+5)
r=m
J.d(r.a,r.d+6)
r=m
J.d(r.a,r.d+7)
r=m
J.d(r.a,r.d+8)
r=m
J.d(r.a,r.d+9)
r=m
J.d(r.a,r.d+10)
r=m
J.d(r.a,r.d+11)
r=m
r=J.d(r.a,r.d+12)
s.f=r
q=m
q=J.d(q.a,q.d+13)
s.r=q
n.d=s
m.dq(14+3*r*q,14)}}else if(a===225)n.lX(m)
else if(a===226)n.m3(m)
else if(a===238){s=m
r=!1
if(J.d(s.a,s.d)===65){s=m
if(J.d(s.a,s.d+1)===100){s=m
if(J.d(s.a,s.d+2)===111){s=m
if(J.d(s.a,s.d+3)===98){s=m
if(J.d(s.a,s.d+4)===101){s=m
s=J.d(s.a,s.d+5)===0}else s=r}else s=r}else s=r}else s=r}else s=r
if(s){p=new A.kt()
s=m
J.d(s.a,s.d+6)
s=m
J.d(s.a,s.d+7)
s=m
J.d(s.a,s.d+8)
s=m
J.d(s.a,s.d+9)
s=m
J.d(s.a,s.d+10)
s=m
p.d=J.d(s.a,s.d+11)
n.e=p}}else if(a===254)try{m.nR()}catch(o){}},
lW(a){var s,r,q,p,o,n,m,l,k
for(s=a.c,r=this.z;q=a.d,p=q<s,p;){p=a.a
a.d=q+1
o=J.d(p,q)
n=B.a.j(o,4)
o&=15
if(o>=4)throw A.e(A.k("Invalid number of quantization tables"))
if(r[o]==null)B.c.i(r,o,new Int16Array(64))
m=r[o]
for(q=n!==0,l=0;l<64;++l){k=q?a.m():J.d(a.a,a.d++)
m.toString
p=$.jF()
if(!(l<p.length))return A.a(p,l)
p=p[l]
m.$flags&2&&A.b(m)
if(!(p<64))return A.a(m,p)
m[p]=k}}if(p)throw A.e(A.k("Bad length for DQT block"))},
h9(a,b,c){var s,r,q,p,o,n,m,l,k,j,i=this
if(i.f!=null)throw A.e(A.k("Duplicate JPG frame data found."))
s=A.P(t.p,t.fg)
r=A.j([],t.t)
q=new A.ia(s,r)
q.b=a===194
q.c=b.H()
q.d=b.m()
q.e=b.m()
p=b.H()
for(o=i.z,n=0;n<p;++n){m=J.d(b.a,b.d++)
l=J.d(b.a,b.d++)
k=B.a.j(l,4)
j=J.d(b.a,b.d++)
B.c.E(r,m)
s.i(0,m,new A.cp(k&15,l&15,o,j))}if(c)i.mG(q)
i.f=q
B.c.E(i.Q,q)},
lY(a,b){return this.h9(a,b,!0)},
mG(a){var s,r,q,p=a.e
p.toString
s=a.d
s.toString
if(p===0||s===0)throw A.e(A.k("Invalid JPEG dimensions "+p+"x"+s))
r=this.a
if(r>0&&p*s>r)throw A.e(A.k("JPEG dimensions "+p+"x"+s+" exceed the maximum of "+r+" pixels"))
p=a.y
s=p.a
if(s===0||s>4)throw A.e(A.k("Unsupported number of JPEG components: "+s))
for(p=new A.at(p,p.r,p.e,A.m(p).n("at<2>"));p.C();){s=p.d
r=s.a
q=!0
if(r>=1)if(r<=4){s=s.b
s=s<1||s>4}else s=q
else s=q
if(s)throw A.e(A.k("Invalid JPEG sampling factor"))}},
lV(a){var s,r,q,p,o,n,m,l,k,j,i,h
for(s=a.c,r=this.at,q=this.as;p=a.d,p<s;){o=a.a
a.d=p+1
n=J.d(o,p)
m=new Uint8Array(16)
for(l=0,k=0;k<16;++k){p=J.d(a.a,a.d++)
if(!(k<16))return A.a(m,k)
m[k]=p
l+=m[k]}j=a.aO(l)
a.d=a.d+(j.c-j.d)
i=j.a0()
if((n&16)!==0){n-=16
h=q}else h=r
if(h.length<=n)B.c.sp(h,n+1)
B.c.i(h,n,this.lj(m,i))}},
mb(a1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=this
if(++a0.ch>1000)throw A.e(A.k("Too many JPEG scans"))
s=a1.H()
if(s<1||s>4)throw A.e(A.k("Invalid SOS block"))
r=a0.f
r.toString
q=A.j([],t.ns)
for(p=a0.as,o=a0.at,n=r.y,m=t.hQ,l=0;l<s;++l){k=J.d(a1.a,a1.d++)
j=J.d(a1.a,a1.d++)
if(!n.af(k))throw A.e(A.k("Invalid Component in SOS block"))
i=n.l(0,k)
i.toString
h=B.a.j(j,4)&15
g=j&15
f=o.length
if(h<f){if(!(h<f))return A.a(o,h)
f=o[h]
f.toString
i.Q=m.a(f)
i.at=A.rb(f)}f=p.length
if(g<f){if(!(g<f))return A.a(p,g)
f=p[g]
f.toString
i.as=m.a(f)
i.ax=A.rb(f)}B.c.E(q,i)}e=a1.H()
d=a1.H()
c=a1.H()
p=B.a.j(c,4)
o=r.b
o.toString
if(o&&a0.b===8&&e>0)return
if(a0.cy!=null)throw A.e(B.ej)
b=!1
if(!a0.ay){a0.ay=!0
o=r.z
if(0>=o.length)return A.a(o,0)
o=n.l(0,o[0])
o.toString
if(a0.CW){m=r.b
m.toString
if(!m){m=q.length
if(m===n.a)if(m<=1)o=o.a===1&&o.b===1
else o=!0
else o=b
b=o}}r.il(b,a0.b===8)
if(b)a0.mw(r)}o=a0.c
o===$&&A.c()
n=a0.r
a=new A.ic(o,r,q,n,e,d,p&15,c&15,new Int16Array(64))
p=r.w
p===$&&A.c()
a.f=p
a.r=r.b
if(b)a.snG(a0.gk9())
a.bZ()},
lj(a,b){var s,r,q,p,o,n,m,l,k=A.j([],t.kv),j=16
for(;;){if(!(j>0&&a[j-1]===0))break;--j}s=t.er
B.c.E(k,new A.ec(A.N(2,null,!1,s)))
if(0>=k.length)return A.a(k,0)
r=k[0]
for(q=b.length,p=0,o=0;o<j;){for(n=0;n<a[o];++n){if(0>=k.length)return A.a(k,-1)
r=k.pop()
m=r.b
if(!(p>=0&&p<q))return A.a(b,p)
B.c.i(r.a,m,new A.dJ(b[p]))
while(m=r.b,m>0){if(0>=k.length)return A.a(k,-1)
r=k.pop()}r.b=m+1
B.c.E(k,r)
for(;k.length<=o;r=l){m=A.N(2,null,!1,s)
l=new A.ec(m)
B.c.E(k,l)
B.c.i(r.a,r.b,new A.cL(m))}++p}++o
if(o<j){m=A.N(2,null,!1,s)
l=new A.ec(m)
B.c.E(k,l)
B.c.i(r.a,r.b,new A.cL(m))
r=l}}if(0>=k.length)return A.a(k,0)
return k[0].a},
jF(a,b){var s,r,q,p,o,n,m,l,k=b.e
k===$&&A.c()
s=b.f
s===$&&A.c()
r=B.a.Z(8,this.b)
q=k*r
p=new Int32Array(64)
o=new Uint8Array(64)
n=A.N(s*r,null,!1,t.eP)
for(m=0;m<s;++m){for(k=m*r,l=0;l<r;++l)B.c.i(n,k+l,new Uint8Array(q))
this.fn(b,m,n,k,o,p)}b.x=new Int16Array(0)
return n},
fn(a,b,a0,a1,a2,a3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c
t.bi.a(a0)
s=B.a.Z(8,this.b)
r=a.x
r===$&&A.c()
q=a.r
q===$&&A.c()
p=a.c
o=a.d
if(!(o>=0&&o<4))return A.a(p,o)
o=p[o]
o.toString
p=s===8
n=s===1
q=b*q
m=a0.length
l=r.length
k=0
for(;;){j=a.e
j===$&&A.c()
if(!(k<j))break
A:{i=q+k
h=i<<6>>>0
if(n){j=a.y?i:h
if(!(j>=0&&j<l))return A.a(r,j)
g=r[j]
if(!(a1<m))return A.a(a0,a1)
j=a0[a1]
j.toString
f=128+B.b.bu((B.b.bu((5793*B.b.bu((5793*(g*o[0])+512)/1024)+8192)/16384)+8)/16)
if(f<0)e=0
else e=f>255?255:f
j.$flags&2&&A.b(j)
if(!(k<j.length))return A.a(j,k)
j[k]=e
break A}A.y1(o,r,h,a2,a3)
d=k*s
if(p)for(j=d+8,c=0;c<8;++c){e=a1+c
if(!(e<m))return A.a(a0,e)
e=a0[e]
if(e!=null)B.d.a3(e,d,j,a2,c<<3>>>0)}else A.tS(a2,s,a0,a1,d)}++k}},
nc(a){var s,r,q,p=this
t.L.a(a)
p.CW=!0
try{p.cd(a)}catch(s){if(A.bx(s) instanceof A.j9)return p.fB(a)
else throw s}r=p.cy
if(r==null)return A.r9(p)
if(p.cx)return p.fB(a)
q=r.d
q===$&&A.c()
q.c=p.x
return q},
fB(a){var s
t.L.a(a)
s=A.kv()
s.a=this.a
s.b=this.b
s.cd(a)
return A.r9(s)},
mw(a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=this,b=B.a.Z(8,c.b),a=c.db
B.c.ca(a)
for(s=a0.z,r=s.length,q=t.h,p=a0.y,o=c.ax,n=t.eP,m=0;m<s.length;s.length===r||(0,A.K)(s),++m){l=p.l(0,s[m])
k=l.a
j=a0.f
i=l.b
h=a0.r
g=l.f
g===$&&A.c()
B.c.E(o,A.pg(k,j,i,h,A.N(g*b,null,!1,n)))
f=i*b
e=A.j(new Array(f),q)
for(k=l.e,d=0;d<f;++d){k===$&&A.c()
e[d]=new Uint8Array(k*b)}B.c.E(a,e)}c.cy=A.pI(c)},
ka(a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5=this,a6=a5.f
a6.toString
s=B.a.Z(8,a5.b)
for(r=a6.z,q=a5.dx,p=a5.dy,o=a6.y,n=a5.ax,m=a5.db,l=0;l<r.length;++l){k=o.l(0,r[l])
k.toString
if(!(l<n.length))return A.a(n,l)
j=n[l].e
if(!(l<m.length))return A.a(m,l)
i=m[l]
for(h=k.b,g=a7*h,f=0;f<h;++f){e=g+f
d=k.f
d===$&&A.c()
if(e>=d)break
for(d=e*s,c=f*s,b=0;b<s;++b){a=c+b
if(!(a<i.length))return A.a(i,a)
B.c.i(j,d+b,i[a])}a5.fn(k,f,j,d,q,p)}k=k.x
k===$&&A.c()
h=a5.fr
g=k.length
if(h.length<g)h=a5.fr=new Int16Array(g)
B.y.aa(k,0,g,h)}a0=a6.r*s
a1=a7*a0
a2=Math.min(a1+a0,a5.gdZ())
if(a1<a2)a5.cy.iD(a1,a2)
for(l=0;l<r.length;++l){a6=o.l(0,r[l])
a6.toString
if(!(l<n.length))return A.a(n,l)
j=n[l].e
a6=a6.b
a3=a7*a6*s
a6=a3+a6*s
q=j.length
a4=a3
for(;;){if(!(a4<a6&&a4<q))break
B.c.i(j,a4,null);++a4}}}}
A.ec.prototype={}
A.j9.prototype={}
A.ia.prototype={
il(a,b){var s,r,q,p,o,n,m,l,k,j,i=this
for(s=i.y,r=A.m(s).n("a1<1>"),q=new A.a1(s,s.r,s.e,r);q.C();){p=s.l(0,q.d)
i.f=Math.max(i.f,p.a)
i.r=Math.max(i.r,p.b)}q=i.e
q.toString
i.w=B.b.bc(q/8/i.f)
q=i.d
q.toString
i.x=B.b.bc(q/8/i.r)
for(r=new A.a1(s,s.r,s.e,r);r.C();){q=s.l(0,r.d)
q.toString
o=i.e
o.toString
n=q.a
m=B.b.bc(B.b.bc(o/8)*n/i.f)
o=i.d
o.toString
l=q.b
k=B.b.bc(B.b.bc(o/8)*l/i.r)
j=i.w*n
n=i.x
q.e=m
q.f=k
q.r=j
n=q.w=n*l
q.y=b
q.z=a?l:0
o=a?l:n
n=b?1:64
q.x=new Int16Array(j*o*n)}},
nK(a){return this.il(!1,a)}}
A.ib.prototype={
gb7(){return 1},
$iL:1,
gJ(){return this.a},
gI(){return this.b}}
A.kB.prototype={}
A.ic.prototype={
bZ(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=this,a0=a.y,a1=a0.length,a2=a.r
a2.toString
if(a2)if(a.Q===0)s=a.at===0?a.gke():a.gkg()
else s=a.at===0?a.gk_():a.gk5()
else s=a.gkb()
a2=a1===1
if(a2){if(0>=a1)return A.a(a0,0)
r=a0[0]
q=r.e
q===$&&A.c()
r=r.f
r===$&&A.c()
p=q*r}else{r=a.f
r===$&&A.c()
q=a.b.x
q===$&&A.c()
p=r*q}r=a.z
if(r==null||r===0)a.z=p
for(r=a.a,q=t.E,o=0;o<p;){for(n=0;n<a1;++n){if(!(n<a0.length))return A.a(a0,n)
a0[n].ay=0}a.db=0
if(a2){if(0>=a0.length)return A.a(a0,0)
m=a0[0]
l=0
for(;;){k=a.z
k.toString
if(!(l<k))break
q.a(s)
k=m.e
k===$&&A.c()
j=B.a.Z(o,k)
i=B.a.a1(o,k)
k=m.z
k=k>0?B.a.a1(j,k):j
h=m.r
h===$&&A.c()
a.fD(m,s,k*h+i);++o
if(a.ay!=null&&B.a.a1(o,m.e)===0)a.eI(B.a.Z(o,m.e));++l}}else{l=0
for(;;){k=a.z
k.toString
if(!(l<k))break
for(n=0;n<a1;++n){if(!(n<a0.length))return A.a(a0,n)
m=a0[n]
g=m.a
f=m.b
for(e=0;e<f;++e)for(d=0;d<g;++d)a.kl(m,s,o,e,d)}++o
if(a.ay!=null){k=a.f
k===$&&A.c()
k=B.a.a1(o,k)===0}else k=!1
if(k){k=a.f
k===$&&A.c()
a.eI(B.a.Z(o,k))}++l}}a.cx=a.CW=0
k=a.cy=!1
if(o>=p)break
c=J.d(r.a,r.d)
b=J.d(r.a,r.d+1)
if(c===255)if(b>=208?b<=215:k)r.d+=2
else break}if(a.ay!=null){if(a2){if(0>=a0.length)return A.a(a0,0)
a0=a0[0].f
a0===$&&A.c()}else{a0=a.b.x
a0===$&&A.c()}a.eI(a0)}},
eI(a){var s,r
while(s=this.ch,s<a){r=this.ay
r.toString
this.ch=s+1
r.$1(s)}},
ej(){var s,r,q=this,p=q.a,o=p.c
for(;;){if(!(q.cx<=24&&!q.cy))break
s=p.d
if(s>=o){q.cy=!0
break}r=J.d(p.a,s)
if(r===255){s=p.d
if(o-s<2||J.d(p.a,s+1)!==0){q.cy=!0
break}p.d+=2}else ++p.d
q.CW=(q.CW<<8|r)>>>0
q.cx+=8}},
cz(){var s=this,r=s.cx
if(r===0){s.ej()
r=s.cx
if(r===0)return null}--r
s.cx=r
return B.a.a4(s.CW,r)&1},
cS(a,b){var s,r,q,p,o,n,m=this
t.hQ.a(a)
if(m.cx<9)m.ej()
s=m.cx
if(s>=9){r=B.a.a4(m.CW,s-9)&511
if(!(r<b.length))return A.a(b,r)
q=b[r]
if(q!==0){m.cx=s-(q>>>8)
return q&255}}for(p=a;;){o=m.cz()
if(o==null)return null
if(o>>>0!==o||o>=2)return A.a(p,o)
n=p[o]
if(n instanceof A.dJ)return n.a
if(!(n instanceof A.cL))return null
p=n.a}},
eD(a){var s=this,r=s.cx
if(r<a){s.ej()
r=s.cx
if(r<a){s.cx=0
return null}}r-=a
s.cx=r
return(B.a.a4(s.CW,r)&B.a.O(1,a)-1)>>>0},
cW(a){var s
if(a==null)return 0
if(a===1)return this.cz()===1?1:-1
s=this.eD(a)
if(s==null)return 0
if(s>=B.a.U(1,a-1))return s
return s+B.a.O(-1,a)+1},
kc(a,b,c){var s,r,q,p,o,n,m,l,k=this,j=a.Q
j===$&&A.c()
s=a.at
s===$&&A.c()
r=k.cS(j,s)
q=r===0?0:k.cW(r)
j=a.ay
j===$&&A.c()
j+=q
a.ay=j
b.$flags&2&&A.b(b)
s=b.length
if(!(c<s))return A.a(b,c)
b[c]=j
for(p=1;p<64;){j=a.as
j===$&&A.c()
o=a.ax
o===$&&A.c()
n=k.cS(j,o)
if(n==null)break
m=n&15
l=n>>>4
if(m===0){if(l<15)break
p+=16
continue}p+=l
m=k.cW(m)
j=$.jF()
if(!(p>=0&&p<j.length))return A.a(j,p)
j=c+j[p]
b.$flags&2&&A.b(b)
if(!(j<s))return A.a(b,j)
b[j]=m;++p}},
kf(a,b,c){var s,r,q,p=a.Q
p===$&&A.c()
s=a.at
s===$&&A.c()
r=this.cS(p,s)
q=r===0?0:B.a.O(this.cW(r),this.ax)
p=a.ay
p===$&&A.c()
p+=q
a.ay=p
b.$flags&2&&A.b(b)
if(!(c<b.length))return A.a(b,c)
b[c]=p},
kh(a,b,c){var s,r
if(!(c<b.length))return A.a(b,c)
s=b[c]
r=this.cz()
r.toString
r=B.a.O(r,this.ax)
b.$flags&2&&A.b(b)
b[c]=(s|r)>>>0},
k0(a,b,c){var s,r,q,p,o,n,m,l=this,k=l.db
if(k>0){l.db=k-1
return}s=l.Q
r=l.as
for(k=l.ax;s<=r;){q=a.as
q===$&&A.c()
p=a.ax
p===$&&A.c()
p=l.cS(q,p)
p.toString
o=p&15
n=p>>>4
if(o===0){if(n<15){k=l.eD(n)
k.toString
l.db=k+B.a.O(1,n)-1
break}s+=16
continue}s+=n
q=$.jF()
if(!(s>=0&&s<q.length))return A.a(q,s)
q=c+q[s]
p=l.cW(o)
m=B.a.O(1,k)
b.$flags&2&&A.b(b)
if(!(q<b.length))return A.a(b,q)
b[q]=p*m;++s}},
k6(a,b,c){var s,r,q,p,o,n,m,l,k=this,j=k.Q,i=k.as
A:for(s=b.length,r=k.ax,q=0;j<=i;){p=$.jF()
if(!(j>=0&&j<p.length))return A.a(p,j)
o=c+p[j]
p=k.dx
switch(p){case 0:p=a.as
p===$&&A.c()
n=a.ax
n===$&&A.c()
m=k.cS(p,n)
if(m==null)throw A.e(A.k("Invalid progressive encoding"))
l=m&15
q=m>>>4
if(l===0)if(q<15){p=k.eD(q)
p.toString
k.db=p+B.a.O(1,q)
k.dx=4}else{k.dx=1
q=16}else{if(l!==1)throw A.e(A.k("invalid ACn encoding"))
k.dy=k.cW(l)
k.dx=q!==0?2:3}continue A
case 1:case 2:if(!(o<s))return A.a(b,o)
n=b[o]
if(n!==0){p=k.cz()
p.toString
p=B.a.O(p,r)
b.$flags&2&&A.b(b)
b[o]=n+p}else{--q
if(q===0)k.dx=p===2?3:0}break
case 3:if(!(o<s))return A.a(b,o)
p=b[o]
if(p!==0){n=k.cz()
n.toString
n=B.a.O(n,r)
b.$flags&2&&A.b(b)
b[o]=p+n}else{p=k.dy
p===$&&A.c()
p=B.a.O(p,r)
b.$flags&2&&A.b(b)
b[o]=p
k.dx=0}break
case 4:if(!(o<s))return A.a(b,o)
p=b[o]
if(p!==0){n=k.cz()
n.toString
n=B.a.O(n,r)
b.$flags&2&&A.b(b)
b[o]=p+n}break}++j}if(k.dx===4)if(--k.db===0)k.dx=0},
kl(a,b,c,d,e){var s,r,q,p
t.E.a(b)
s=this.f
s===$&&A.c()
r=B.a.Z(c,s)*a.b+d
q=B.a.a1(c,s)*a.a+e
s=a.w
s===$&&A.c()
if(r<s){s=a.r
s===$&&A.c()
s=q>=s}else s=!0
if(s)return
s=a.z
s=s>0?B.a.a1(r,s):r
p=a.r
p===$&&A.c()
this.fD(a,b,s*p+q)},
fD(a,b,c){var s,r,q
t.E.a(b)
s=a.x
s===$&&A.c()
if(!a.y){b.$3(a,s,c<<6>>>0)
return}r=this.fr
if(!(c>=0&&c<s.length))return A.a(s,c)
q=s[c]
r.$flags&2&&A.b(r)
r[0]=q
b.$3(a,r,0)
q=r[0]
s.$flags&2&&A.b(s)
s[c]=q},
snG(a){this.ay=t.bZ.a(a)}}
A.kw.prototype={
aW(a){var s,r=a.length,q=!0
if(r>=2){if(0>=r)return A.a(a,0)
if(a[0]===255){if(1>=r)return A.a(a,1)
r=a[1]!==216}else r=q}else r=q
if(r)return!1
try{r=A.kv().o5(a)
return r}catch(s){return!1}},
aC(a){return A.Q(new A.ky(this,a),t._)},
bd(a,b){return A.Q(new A.kx(this,a,b),t.H)},
cF(a){return this.bd(a,null)}}
A.ky.prototype={
$0(){var s=this.b
A.v(s,!0,null,0)
return A.kv().nM(s)},
$S:5}
A.kx.prototype={
$0(){var s=A.kv()
s.a=this.a.a
s.b=1
return s.nc(this.b)},
$S:1}
A.ku.prototype={
a8(){return"JpegChroma."+this.b}}
A.kz.prototype={
iR(a){a=B.a.h(B.a.L(a,1,100))
if(this.Q===a)return
this.lc(a<50?B.b.bu(5000/a):B.a.bu(200-a*2))
this.Q=a},
ng(b6,b7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5=this
A.hn(b6)
s=A.ai(!0,8192)
b5.bV(s,216)
b5.bV(s,224)
s.a9(16)
s.u(74)
s.u(70)
s.u(73)
s.u(70)
s.u(0)
s.u(1)
s.u(1)
s.u(0)
s.a9(1)
s.a9(1)
s.u(0)
s.u(0)
b5.mO(s,b6.gbe())
r=b6.c
if(r!=null){b5.bV(s,226)
q=r.i3()
p=A.j([73,67,67,95,80,82,79,70,73,76,69,0],t.t)
s.a9(14+q.length)
s.au(p)
s.au(q)}b5.mM(s)
r=b6.gJ()
o=b6.gI()
b5.bV(s,192)
s.a9(17)
s.u(8)
s.a9(o)
s.a9(r)
s.u(3)
s.u(1)
r=b7===B.cx
s.u(r?17:34)
s.u(0)
s.u(2)
s.u(17)
s.u(1)
s.u(3)
s.u(17)
s.u(1)
b5.mL(s)
b5.bV(s,218)
s.a9(12)
s.u(3)
s.u(1)
s.u(0)
s.u(2)
s.u(17)
s.u(3)
s.u(17)
s.u(0)
s.u(63)
s.u(0)
b5.at=b5.as=0
n=b6.gJ()
m=b6.gI()
l=b6.f
if(l==null)l=B.eo
if(r){k=new Float32Array(64)
j=new Float32Array(64)
i=new Float32Array(64)
for(r=b5.c,o=b5.d,h=0,g=0,f=0,e=0;e<m;e+=8)for(d=0;d<n;d+=8){b5.cO(b6,d,e,n,m,k,j,i,l)
c=b5.e
c===$&&A.c()
b=b5.r
b===$&&A.c()
h=b5.bT(s,k,r,h,c,b)
b=b5.f
b===$&&A.c()
c=b5.w
c===$&&A.c()
g=b5.bT(s,j,o,g,b,c)
f=b5.bT(s,i,o,f,b5.f,b5.w)}}else{r=t.pk
k=J.bF(4,r)
for(a=0;a<4;++a)k[a]=new Float32Array(64)
j=J.bF(4,r)
for(a=0;a<4;++a)j[a]=new Float32Array(64)
i=J.bF(4,r)
for(a=0;a<4;++a)i[a]=new Float32Array(64)
a0=new Float32Array(64)
a1=new Float32Array(64)
for(r=b5.c,o=b5.d,h=0,g=0,f=0,e=0;e<m;e+=16)for(c=e+8,d=0;d<n;d+=16){b=k[0]
a2=j[0]
a3=i[0]
b5.cO(b6,d,e,n,m,b,a2,a3,l)
a4=d+8
a5=k[1]
a6=j[1]
a7=i[1]
b5.cO(b6,a4,e,n,m,a5,a6,a7,l)
a8=k[2]
a9=j[2]
b0=i[2]
b5.cO(b6,d,c,n,m,a8,a9,b0,l)
b1=k[3]
b2=j[3]
b3=i[3]
b5.cO(b6,a4,c,n,m,b1,b2,b3,l)
b5.fI(a0,a2,a6,a9,b2)
b5.fI(a1,a3,a7,b0,b3)
b3=b5.e
b3===$&&A.c()
b0=b5.r
b0===$&&A.c()
h=b5.bT(s,b1,r,b5.bT(s,a8,r,b5.bT(s,a5,r,b5.bT(s,b,r,h,b3,b0),b5.e,b5.r),b5.e,b5.r),b5.e,b5.r)
b0=b5.f
b0===$&&A.c()
b3=b5.w
b3===$&&A.c()
g=b5.bT(s,a0,o,g,b0,b3)
f=b5.bT(s,a1,o,f,b5.f,b5.w)}}b4=8-b5.at
b5.bU(s,B.a.U(1,b4)-1,b4)
b5.bV(s,217)
return J.F(B.d.gt(s.c),0,s.a)},
cO(a,b,c,a0,a1,a2,a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d
if(a.gM()===B.e&&!a.gaH()&&a.gak()>=3){s=a.a
this.jL(J.I(s.gt(s)),a.a.gaB(),a.gak(),b,c,a0,a1,a2,a3,a4,a5)
return}for(s=this.z,r=c+1,q=null,p=0;p<64;++p){o=p>>>3
n=c+o
m=b+(p&7)
if(n>=a1)n-=r+o-a1
if(m>=a0)m-=m-a0+1
l=a.a
q=l==null?null:l.S(m,n,q)
if(q==null)q=new A.J()
k=q.gM()!==B.e?q.b3(B.e):q
j=B.b.h(k.gq())
i=B.b.h(k.gB())
h=B.b.h(k.gA())
if(k.gp(k)>3){g=k.ga5()
f=1-g
j=B.a.L(B.b.az(j*g+a5.gq()*f),0,255)
i=B.a.L(B.b.az(i*g+a5.gB()*f),0,255)
h=B.a.L(B.b.az(h*g+a5.gA()*f),0,255)}if(!(j>=0&&j<2048))return A.a(s,j)
l=s[j]
e=i+256
if(!(e>=0&&e<2048))return A.a(s,e)
e=s[e]
d=h+512
if(!(d>=0&&d<2048))return A.a(s,d)
d=B.a.j(l+e+s[d],16)
a2.$flags&2&&A.b(a2)
if(!(p<64))return A.a(a2,p)
a2[p]=d-128
d=j+768
if(!(d<2048))return A.a(s,d)
d=s[d]
e=i+1024
if(!(e>=0&&e<2048))return A.a(s,e)
e=s[e]
l=h+1280
if(!(l>=0&&l<2048))return A.a(s,l)
l=B.a.j(d+e+s[l],16)
a3.$flags&2&&A.b(a3)
if(!(p<64))return A.a(a3,p)
a3[p]=l-128
l=j+1280
if(!(l<2048))return A.a(s,l)
l=s[l]
e=i+1536
if(!(e>=0&&e<2048))return A.a(s,e)
e=s[e]
d=h+1792
if(!(d>=0&&d<2048))return A.a(s,d)
d=B.a.j(l+e+s[d],16)
a4.$flags&2&&A.b(a4)
if(!(p<64))return A.a(a4,p)
a4[p]=d-128}},
jL(a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=this.z,a1=b4.gq(),a2=b4.gB(),a3=b4.gA()
for(s=a6>3,r=a4.length,q=a9-1,p=b0-1,o=0,n=0;o<8;++o){m=a8+o
l=(m<b0?m:p)*a5
for(k=0;k<8;++k,++n){j=a7+k
i=l+(j<a9?j:q)*a6
if(!(i>=0&&i<r))return A.a(a4,i)
h=a4[i]
g=i+1
if(!(g<r))return A.a(a4,g)
f=a4[g]
g=i+2
if(!(g<r))return A.a(a4,g)
e=a4[g]
if(s){g=i+3
if(!(g<r))return A.a(a4,g)
d=a4[g]/255
c=1-d
h=B.a.L(B.b.az(h*d+a1*c),0,255)
f=B.a.L(B.b.az(f*d+a2*c),0,255)
e=B.a.L(B.b.az(e*d+a3*c),0,255)}if(!(h>=0&&h<2048))return A.a(a0,h)
g=a0[h]
b=f+256
if(!(b>=0&&b<2048))return A.a(a0,b)
b=a0[b]
a=e+512
if(!(a>=0&&a<2048))return A.a(a0,a)
a=B.a.j(g+b+a0[a],16)
b1.$flags&2&&A.b(b1)
if(!(n>=0&&n<64))return A.a(b1,n)
b1[n]=a-128
a=h+768
if(!(a<2048))return A.a(a0,a)
a=a0[a]
b=f+1024
if(!(b>=0&&b<2048))return A.a(a0,b)
b=a0[b]
g=e+1280
if(!(g>=0&&g<2048))return A.a(a0,g)
g=B.a.j(a+b+a0[g],16)
b2.$flags&2&&A.b(b2)
if(!(n<64))return A.a(b2,n)
b2[n]=g-128
g=h+1280
if(!(g<2048))return A.a(a0,g)
g=a0[g]
b=f+1536
if(!(b>=0&&b<2048))return A.a(a0,b)
b=a0[b]
a=e+1792
if(!(a>=0&&a<2048))return A.a(a0,a)
a=B.a.j(g+b+a0[a],16)
b3.$flags&2&&A.b(b3)
if(!(n<64))return A.a(b3,n)
b3[n]=a-128}}},
fI(a,b,c,d,e){var s,r,q,p,o,n,m,l
for(s=a.$flags|0,r=0;r<64;++r){if(r<32)q=B.a.a1(r,8)<4?b:c
else q=B.a.a1(r,8)<4?d:e
p=(B.a.P(B.a.a1(r,32),8)<<4>>>0)+(B.a.a1(r,4)<<1>>>0)
if(!(p<64))return A.a(q,p)
o=q[p]
n=p+1
if(!(n<64))return A.a(q,n)
n=q[n]
m=p+8
if(!(m<64))return A.a(q,m)
m=q[m]
l=p+9
if(!(l<64))return A.a(q,l)
l=q[l]
s&2&&A.b(a)
if(!(r<64))return A.a(a,r)
a[r]=(o+n+m+l)/4}},
bV(a,b){a.u(255)
a.u(b&255)},
lc(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=this
for(s=b.a,r=s.$flags|0,q=0;q<64;++q){p=B.b.bu((B.lJ[q]*a+50)/100)
if(p<1)p=1
else if(p>255)p=255
o=B.aD[q]
r&2&&A.b(s)
if(!(o<64))return A.a(s,o)
s[o]=p}for(r=b.b,o=r.$flags|0,n=0;n<64;++n){m=B.b.bu((B.hD[n]*a+50)/100)
if(m<1)m=1
else if(m>255)m=255
l=B.aD[n]
o&2&&A.b(r)
if(!(l<64))return A.a(r,l)
r[l]=m}for(o=b.c,l=o.$flags|0,k=b.d,j=k.$flags|0,i=0,h=0;h<8;++h)for(g=0;g<8;++g){if(!(i>=0&&i<64))return A.a(B.aD,i)
f=B.aD[i]
if(!(f<64))return A.a(s,f)
e=s[f]
d=B.cU[h]
c=B.cU[g]
l&2&&A.b(o)
o[i]=1/(e*d*c*8)
f=r[f]
j&2&&A.b(k)
k[i]=1/(f*d*c*8);++i}},
dv(a,b){var s,r,q,p,o,n,m,l=t.L
l.a(a)
l.a(b)
l=new Int32Array(256)
s=new Uint8Array(256)
for(r=b.length,q=0,p=0,o=1;o<=16;++o){for(n=1;n<=a[o];++n){if(!(p>=0&&p<r))return A.a(b,p)
m=b[p]
if(!(m<256))return A.a(l,m)
l[m]=q
s[m]=o;++p;++q}q*=2}return new A.mm(l,s)},
ld(){var s,r,q
for(s=this.z,r=s.$flags|0,q=0;q<256;++q){r&2&&A.b(s)
s[q]=19595*q
s[q+256]=38470*q
s[q+512]=7471*q+32768
s[q+768]=-11059*q
s[q+1024]=-21709*q
s[q+1280]=32768*q+8421375
s[q+1536]=-27439*q
s[q+1792]=-5329*q}},
kO(d6,d7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5
for(s=d6.$flags|0,r=0,q=0;q<8;++q){if(!(r<64))return A.a(d6,r)
p=d6[r]
o=r+1
if(!(o<64))return A.a(d6,o)
n=d6[o]
m=r+2
if(!(m<64))return A.a(d6,m)
l=d6[m]
k=r+3
if(!(k<64))return A.a(d6,k)
j=d6[k]
i=r+4
if(!(i<64))return A.a(d6,i)
h=d6[i]
g=r+5
if(!(g<64))return A.a(d6,g)
f=d6[g]
e=r+6
if(!(e<64))return A.a(d6,e)
d=d6[e]
c=r+7
if(!(c<64))return A.a(d6,c)
b=d6[c]
a=p+b
a0=p-b
a1=n+d
a2=n-d
a3=l+f
a4=l-f
a5=j+h
a6=a+a5
a7=a-a5
a8=a1+a3
s&2&&A.b(d6)
if(!(r<64))return A.a(d6,r)
d6[r]=a6+a8
if(!(i<64))return A.a(d6,i)
d6[i]=a6-a8
a9=(a1-a3+a7)*0.707106781
if(!(m<64))return A.a(d6,m)
d6[m]=a7+a9
if(!(e<64))return A.a(d6,e)
d6[e]=a7-a9
a6=j-h+a4
b0=a2+a0
b1=(a6-b0)*0.382683433
b2=0.5411961*a6+b1
b3=1.306562965*b0+b1
b4=(a4+a2)*0.707106781
b5=a0+b4
b6=a0-b4
if(!(g<64))return A.a(d6,g)
d6[g]=b6+b2
if(!(k<64))return A.a(d6,k)
d6[k]=b6-b2
if(!(o<64))return A.a(d6,o)
d6[o]=b5+b3
if(!(c<64))return A.a(d6,c)
d6[c]=b5-b3
r+=8}for(r=0,q=0;q<8;++q){if(!(r<64))return A.a(d6,r)
p=d6[r]
o=r+8
if(!(o<64))return A.a(d6,o)
n=d6[o]
m=r+16
if(!(m<64))return A.a(d6,m)
l=d6[m]
k=r+24
if(!(k<64))return A.a(d6,k)
j=d6[k]
i=r+32
if(!(i<64))return A.a(d6,i)
h=d6[i]
g=r+40
if(!(g<64))return A.a(d6,g)
f=d6[g]
e=r+48
if(!(e<64))return A.a(d6,e)
d=d6[e]
c=r+56
if(!(c<64))return A.a(d6,c)
b=d6[c]
b7=p+b
b8=p-b
b9=n+d
c0=n-d
c1=l+f
c2=l-f
c3=j+h
c4=b7+c3
c5=b7-c3
c6=b9+c1
s&2&&A.b(d6)
if(!(r<64))return A.a(d6,r)
d6[r]=c4+c6
if(!(i<64))return A.a(d6,i)
d6[i]=c4-c6
c7=(b9-c1+c5)*0.707106781
if(!(m<64))return A.a(d6,m)
d6[m]=c5+c7
if(!(e<64))return A.a(d6,e)
d6[e]=c5-c7
c4=j-h+c2
c8=c0+b8
c9=(c4-c8)*0.382683433
d0=0.5411961*c4+c9
d1=1.306562965*c8+c9
d2=(c2+c0)*0.707106781
d3=b8+d2
d4=b8-d2
if(!(g<64))return A.a(d6,g)
d6[g]=d4+d0
if(!(k<64))return A.a(d6,k)
d6[k]=d4-d0
if(!(o<64))return A.a(d6,o)
d6[o]=d3+d1
if(!(c<64))return A.a(d6,c)
d6[c]=d3-d1;++r}for(s=this.x,q=0;q<64;++q){d5=d6[q]*d7[q]
o=d5>0?B.b.h(d5+0.5):B.b.h(d5-0.5)
s.$flags&2&&A.b(s)
s[q]=o}return s},
mO(a,b){var s,r
if(b.gab(0))return
s=A.ai(!1,8192)
b.aR(s)
r=J.F(B.d.gt(s.c),0,s.a)
this.bV(a,225)
a.a9(r.length+8)
a.ae(1165519206)
a.a9(0)
a.au(r)},
mM(a){var s,r,q
this.bV(a,219)
a.a9(132)
a.u(0)
for(s=this.a,r=0;r<64;++r)a.u(s[r])
a.u(1)
for(s=this.b,q=0;q<64;++q)a.u(s[q])},
mL(a){var s,r,q,p,o,n,m,l
this.bV(a,196)
a.a9(418)
a.u(0)
for(s=0;s<16;){++s
a.u(B.dC[s])}for(r=0;r<=11;++r)a.u(B.aX[r])
a.u(16)
for(q=0;q<16;){++q
a.u(B.cG[q])}for(p=0;p<=161;++p)a.u(B.cW[p])
a.u(1)
for(o=0;o<16;){++o
a.u(B.da[o])}for(n=0;n<=11;++n)a.u(B.aX[n])
a.u(17)
for(m=0;m<16;){++m
a.u(B.d2[m])}for(l=0;l<=161;++l)a.u(B.di[l])},
bT(a,b,a0,a1,a2,a3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=this,d=e.kO(b,a0),c=e.y
for(s=c.$flags|0,r=0;r<64;++r){q=B.aD[r]
p=d[r]
s&2&&A.b(c)
if(!(q<64))return A.a(c,q)
c[q]=p}s=c[0]
o=s-a1
if(o===0)e.bU(a,a2.a[0],a2.b[0])
else{n=B.a.geM(o<0?-o:o)
q=a2.a
if(!(n>=0&&n<256))return A.a(q,n)
e.bU(a,q[n],a2.b[n])
e.bU(a,A.tT(o,n),n)}m=63
for(;;){if(!(m>0&&c[m]===0))break;--m}if(m===0){e.bU(a,a3.a[0],a3.b[0])
return s}for(q=a3.a,p=a3.b,l=1;l<=m;){k=l
for(;;){if(!(k>=0&&k<64))return A.a(c,k)
if(!(c[k]===0&&k<=m))break;++k}j=k-l
if(j>=16){i=B.a.j(j,4)
for(h=1;h<=i;++h)e.bU(a,q[240],p[240])
j&=15}g=c[k]
n=B.a.geM(g<0?-g:g)
f=(j<<4>>>0)+n
if(!(f>=0&&f<256))return A.a(q,f)
e.bU(a,q[f],p[f])
e.bU(a,g>0?g:g+B.a.U(1,n)-1,n)
l=k+1}if(m!==63)e.bU(a,q[0],p[0])
return s},
bU(a,b,c){var s,r,q=this
q.as=(B.a.U(q.as,c)|b)>>>0
q.at+=c
while(s=q.at,s>=8){s-=8
q.at=s
r=B.a.a4(q.as,s)&255
a.u(r)
if(r===255)a.u(0)}q.as=(q.as&B.a.U(1,s)-1)>>>0}}
A.mm.prototype={
gp(a){return this.b}}
A.kQ.prototype={}
A.e1.prototype={
a8(){return"PngDisposeMode."+this.b}}
A.fx.prototype={
a8(){return"PngBlendMode."+this.b}}
A.fy.prototype={}
A.i3.prototype={}
A.ct.prototype={
a8(){return"PngFilterType."+this.b}}
A.iu.prototype={
sJ(a){this.a=A.r(a)},
sI(a){this.b=A.r(a)},
sW(a){this.w=t.gy.a(a)},
so0(a){this.x=t.T.a(a)},
$iL:1,
gJ(){return this.a},
gI(){return this.b},
gb7(){return this.CW}}
A.i4.prototype={}
A.kM.prototype={
aW(a){var s
if(a.length<8)return!1
for(s=0;s<8;++s)if(a[s]!==B.bK[s])return!1
return!0},
aC(a){return A.Q(new A.kP(this,a),t._)},
lE(b8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5=this,b6=null,b7=A.v(b8,!0,b6,0)
b5.e=b7
s=b7.ac(8)
for(r=0;r<8;++r)if(J.d(s.a,s.d+r)!==B.bK[r])return b6
for(b7=b5.a,q=b7.cy,p=t.t,o=b7.db,n=t.L,m=b5.b,l=b7.ax;;){k=b5.e
j=k.d-k.b
i=k.k()
h=b5.e.ar(4)
switch(h){case"tEXt":k=b5.e
g=k.aO(i)
k.d=k.d+(g.c-g.d)
f=g.a0()
e=f.length
for(r=0;r<e;++r)if(f[r]===0){k=r+1
l.i(0,B.c2.cF(new Uint8Array(f.subarray(0,A.ji(0,r,e)))),B.c2.cF(new Uint8Array(f.subarray(k,A.ji(k,b6,e)))))
break}b5.e.d+=4
break
case"pHYs":k=b5.e
g=k.aO(i)
k.d=k.d+(g.c-g.d)
d=A.w(g,b6,0)
d.k()
d.k()
J.d(d.a,d.d++)
b5.e.d+=4
break
case"IHDR":k=b5.e
g=k.aO(i)
k.d=k.d+(g.c-g.d)
c=A.w(g,b6,0)
b=c.a0()
b7.a=c.k()
k=c.k()
b7.b=k
A.aw(b7.a,k,m,!1)
b7.c=J.d(c.a,c.d++)
b7.d=J.d(c.a,c.d++)
J.d(c.a,c.d++)
b7.f=J.d(c.a,c.d++)
b7.r=J.d(c.a,c.d++)
k=b7.d
if(!(k===0||k===2||k===3||k===4||k===6))return b6
if(b7.f!==0)return b6
switch(k){case 0:if(!B.c.aG(A.j([1,2,4,8,16],p),b7.c))return b6
break
case 2:if(!B.c.aG(A.j([8,16],p),b7.c))return b6
break
case 3:if(!B.c.aG(A.j([1,2,4,8],p),b7.c))return b6
break
case 4:if(!B.c.aG(A.j([8,16],p),b7.c))return b6
break
case 6:if(!B.c.aG(A.j([8,16],p),b7.c))return b6
break}if(b5.e.k()!==A.bK(n.a(b),A.bK(new A.an(h),0)))throw A.e(A.k("Invalid "+h+" checksum"))
break
case"PLTE":k=b5.e
g=k.aO(i)
k.d=k.d+(g.c-g.d)
b7.sW(g.a0())
if(b5.e.k()!==A.bK(n.a(n.a(b7.w)),A.bK(new A.an(h),0)))throw A.e(A.k("Invalid "+h+" checksum"))
break
case"tRNS":k=b5.e
g=k.aO(i)
k.d=k.d+(g.c-g.d)
b7.so0(g.a0())
a=b5.e.k()
k=b7.x
k.toString
if(a!==A.bK(n.a(k),A.bK(new A.an(h),0)))throw A.e(A.k("Invalid "+h+" checksum"))
break
case"IEND":b5.e.d+=4
break
case"gAMA":if(i!==4)throw A.e(A.k("Invalid gAMA chunk"))
b5.e.k()
b5.e.d+=4
break
case"IDAT":B.c.E(o,j)
k=b5.e
k.d=(k.d+=i)+4
break
case"acTL":b7.CW=b5.e.k()
b5.e.k()
b5.e.d+=4
break
case"fcTL":b5.e.k()
a0=b5.e.k()
a1=b5.e.k()
a2=b5.e.k()
a3=b5.e.k()
a4=b5.e.m()
a5=b5.e.m()
k=b5.e
a6=J.d(k.a,k.d++)
k=b5.e
a7=J.d(k.a,k.d++)
if(!(a6>=0&&a6<3))return A.a(B.cF,a6)
k=B.cF[a6]
if(!(a7>=0&&a7<2))return A.a(B.db,a7)
a8=B.db[a7]
B.c.E(q,new A.i3(A.j([],p),a0,a1,a2,a3,a4,a5,k,a8))
b5.e.d+=4
break
case"fdAT":b5.e.k()
B.c.E(B.c.gcH(q).y,j)
k=b5.e
k.d=(k.d+=i-4)+4
break
case"bKGD":k=b7.d
if(k===3){k=b5.e
a9=J.d(k.a,k.d++);--i
b0=a9*3
k=b7.w
a8=k.length
if(!(b0>=0&&b0<a8))return A.a(k,b0)
b1=k[b0]
b2=b0+1
if(!(b2<a8))return A.a(k,b2)
b3=k[b2]
b2=b0+2
if(!(b2<a8))return A.a(k,b2)
b4=k[b2]
k=b7.x
if(k!=null){k=B.d.aG(k,a9)?0:255
a8=new Uint8Array(4)
a8[0]=b1
a8[1]=b3
a8[2]=b4
a8[3]=k
b7.z=new A.dz(a8)}else{k=new Uint8Array(3)
k[0]=b1
k[1]=b3
k[2]=b4
b7.z=new A.eA(k)}}else if(k===0||k===4){b5.e.m()
i-=2}else if(k===2||k===6){k=b5.e
k.m()
k.m()
k.m()
i-=24}if(i>0)b5.e.d+=i
b5.e.d+=4
break
case"iCCP":b7.Q=b5.e.dd()
k=b5.e
J.d(k.a,k.d++)
k=b7.Q
a8=b5.e
g=a8.aO(i-(k.length+2))
a8.d=a8.d+(g.c-g.d)
b7.at=g.a0()
b5.e.d+=4
break
case"cICP":k=b5.e
a8=k.d
if(i===4){b2=k.a
k.d=a8+1
J.d(b2,a8)
a8=b5.e
J.d(a8.a,a8.d++)
a8=b5.e
J.d(a8.a,a8.d++)
a8=b5.e
J.d(a8.a,a8.d++)}else k.d=a8+i
b5.e.d+=4
break
default:k=b5.e
k.d=(k.d+=i)+4
break}if(h==="IEND")break
k=b5.e
if(k.d>=k.c)return b6}return b7},
aJ(a){return A.Q(new A.kN(this,a),t.H)},
lD(c4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7=this,b8=null,b9=b7.a,c0=b9.a,c1=b9.b,c2=b9.cy,c3=c2.length
if(c3===0||c4===0){m=A.j([],t.h)
c2=b9.db
l=c2.length
for(c3=t.L,k=0,j=0;j<l;++j){i=b7.e
i===$&&A.c()
if(!(j<c2.length))return A.a(c2,j)
i.d=c2[j]
h=i.k()
g=b7.e.ar(4)
i=b7.e
f=i.aO(h)
i.d=i.d+(f.c-f.d)
e=f.a0()
k+=e.length
B.c.E(m,e)
if(b7.e.k()!==A.bK(c3.a(e),A.bK(new A.an(g),0)))throw A.e(A.k("Invalid "+g+" checksum"))}d=new Uint8Array(k)
for(c2=m.length,c=0,b=0;b<m.length;m.length===c2||(0,A.K)(m),++b){e=m[b]
B.d.bB(d,c,e)
c+=e.length}}else{if(c4>=c3)throw A.e(A.k("Invalid Frame Number: "+c4))
if(!(c4<c3))return A.a(c2,c4)
a=c2[c4]
c0=a.b
c1=a.c
A.aw(c0,c1,b7.b,!1)
m=A.j([],t.h)
for(c2=a.y,k=0,j=0;j<c2.length;++j){c3=b7.e
c3===$&&A.c()
c3.d=c2[j]
h=c3.k()
c3=b7.e
c3.ar(4)
c3.d+=4
c3=b7.e
f=c3.aO(h-4)
c3.d=c3.d+(f.c-f.d)
e=f.a0()
k+=e.length
B.c.E(m,e)}d=new Uint8Array(k)
for(c2=m.length,c=0,b=0;b<m.length;m.length===c2||(0,A.K)(m),++b){e=m[b]
B.d.bB(d,c,e)
c+=e.length}}c2=b9.d
a0=1
if(!(c2===3))if(!(c2===0)){if(c2===4)c2=2
else c2=c2===6?4:3
a0=c2}c2=A.hW(d,B.ac,b8,b8)
s=A.py(new A.eX(c2,B.aj,!1,B.bX))
b7.d=b7.c=0
a1=b8
if(b9.d===3){c2=b9.w
if(c2!=null){c3=c2.length
a2=c3/3|0
a3=b9.x
i=a3!=null
a4=i?a3.length:0
a5=i?4:3
a1=new A.aU(new Uint8Array(a2*a5),a2,a5)
for(i=a5===4,j=0,a6=0;j<a2;++j,a6+=3){if(i&&j<a4){if(!(j<a3.length))return A.a(a3,j)
a7=a3[j]}else a7=255
if(!(a6<c3))return A.a(c2,a6)
a8=c2[a6]
a9=a6+1
if(!(a9<c3))return A.a(c2,a9)
a9=c2[a9]
b0=a6+2
if(!(b0<c3))return A.a(c2,b0)
a1.dl(j,a8,a9,c2[b0],a7)}}}if(b9.d===0&&b9.x!=null&&a1==null&&b9.c<=8){a3=b9.x
b1=a3.length
c2=b9.c
a2=B.a.U(1,c2)
c3=a2*4
i=new Uint8Array(c3)
a1=new A.aU(i,a2,4)
if(c2===1)b2=255
else if(c2===2)b2=85
else{c2=c2===4?17:1
b2=c2}for(j=0;j<a2;++j){b3=j*b2
a1.dl(j,b3,b3,b3,255)}for(j=0;j<b1;j+=2){c2=a3[j]
a8=j+1
if(!(a8<b1))return A.a(a3,a8)
b4=(c2&255)<<8|a3[a8]&255
if(b4<a2){c2=b4*4+3
if(!(c2<c3))return A.a(i,c2)
i[c2]=0}}}c2=b9.c
if(c2===1)b5=B.L
else if(c2===2)b5=B.R
else{if(c2===4)c3=B.S
else c3=c2===16?B.u:B.e
b5=c3}c3=b9.d
if(c3===0&&b9.x!=null&&c2>8)a0=4
r=A.Z(b8,b8,b5,0,B.l,c1,b8,0,c3===2&&b9.x!=null?4:a0,a1,B.e,c0,!1)
q=b9.a
p=b9.b
b9.a=c0
b9.b=c1
o=c0
n=c1
b7.f=0
try{if(b9.r!==0){c2=o
if(typeof c2!=="number")return c2.am()
c2=B.b.j(c2+7,3)
c3=n
if(typeof c3!=="number")return c3.am()
b7.cl(s,r,0,0,8,8,c2,B.b.j(c3+7,3))
c3=o
if(typeof c3!=="number")return c3.am()
c3=B.b.j(c3+3,3)
c2=n
if(typeof c2!=="number")return c2.am()
b7.cl(s,r,4,0,8,8,c3,B.b.j(c2+7,3))
c2=o
if(typeof c2!=="number")return c2.am()
c2=B.b.j(c2+3,2)
c3=n
if(typeof c3!=="number")return c3.am()
b7.cl(s,r,0,4,4,8,c2,B.b.j(c3+3,3))
c3=o
if(typeof c3!=="number")return c3.am()
c3=B.b.j(c3+1,2)
c2=n
if(typeof c2!=="number")return c2.am()
b7.cl(s,r,2,0,4,4,c3,B.b.j(c2+3,2))
c2=o
if(typeof c2!=="number")return c2.am()
c2=B.b.j(c2+1,1)
c3=n
if(typeof c3!=="number")return c3.am()
b7.cl(s,r,0,2,2,4,c2,B.b.j(c3+1,2))
c3=o
if(typeof c3!=="number")return c3.aM()
c3=B.b.j(c3,1)
c2=n
if(typeof c2!=="number")return c2.am()
b7.cl(s,r,1,0,2,2,c3,B.b.j(c2+1,1))
c2=n
if(typeof c2!=="number")return c2.aM()
b7.cl(s,r,0,1,1,2,o,B.b.j(c2,1))}else b7.lJ(s,r)}catch(b6){c2=A.bx(b6)
if(c2 instanceof A.hr)return b8
else if(c2 instanceof A.bO)return b8
else if(c2 instanceof A.jf)return b8
else throw b6}finally{s.hY()
b9.sJ(q)
b9.sI(p)}c2=b9.at
if(c2!=null)r.c=new A.cj(b9.Q,B.by,c2)
b9=b9.ax
if(b9.a!==0)r.mX(b9)
return r},
bd(a,b){return A.Q(new A.kO(this,t.D.a(a),b),t.H)},
lC(a,b){if(this.aC(a)==null)return null
return this.aJ(b)},
geA(){var s=this.a.d
if(s===4)s=2
else if(s===2)s=3
else s=s===6?4:1
return s},
cl(a,b,a0,a1,a2,a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=this
if(a4===0||a5===0)return
s=c.geA()
r=c.a.c
q=s*r
p=B.a.j(q+7,3)
o=B.a.P(q*a4+7,8)
n=r===8||r===16
m=A.j([0,0,0,0],t.t)
for(l=a1,k=null,j=null,i=0;i<a5;++i,l+=a3,++c.f,j=g){s=a.H()
if(!(s<5))return A.a(B.b7,s)
h=B.b7[s]
g=a.ac(o).a0()
s=g.length
if(s!==o)throw A.e(B.c3)
c.hu(h,p,g,j)
if(n){c.hG(g,b,l,a0,a2,a4)
continue}c.d=c.c=0
f=new A.ar(g,0,Math.min(s,s),0,!0)
for(e=a0,d=0;d<a4;++d,e+=a2){c.hd(f,m)
s=b.a
k=s==null?null:s.S(e,l,k)
if(k==null)k=new A.J()
c.hi(k,m)}}},
lJ(a,a0){var s,r,q,p,o,n,m,l=this,k=l.geA(),j=l.a,i=j.c,h=k*i,g=j.a,f=j.b,e=B.a.P(g*h+7,8),d=B.a.j(h+7,3),c=i===8||i===16,b=A.j([0,0,0,0],t.t)
k=a0.a
s=k.gF(k)
s.C()
for(r=null,q=0;q<f;++q,r=o){k=a.H()
if(!(k<5))return A.a(B.b7,k)
p=B.b7[k]
o=a.ac(e).a0()
k=o.length
if(k!==e)throw A.e(B.c3)
l.hu(p,d,o,r)
if(c){l.hG(o,a0,q,0,1,g)
continue}l.d=l.c=0
n=new A.ar(o,0,Math.min(k,k),0,!0)
for(m=0;m<g;++m){l.hd(n,b)
l.hi(s.gN(),b)
s.C()}}},
hG(a2,a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=this.geA(),b=a3.a,a=b.c,a0=this.a,a1=a0.x
if(a0.c===8){s=J.I(b.gt(b))
r=a4*a3.a.gaB()+a5*a
q=a6*a
if(a===c){if(a6===1){B.d.aa(s,r,r+a7*c,a2)
return}for(b=a2.length,a0=s.$flags|0,p=0,o=0;p<a7;++p,r+=q)for(n=0;n<c;++n,o=l){m=r+n
l=o+1
if(!(o>=0&&o<b))return A.a(a2,o)
k=a2[o]
a0&2&&A.b(s)
if(!(m>=0&&m<s.length))return A.a(s,m)
s[m]=k}return}b=a1.length
if(0>=b)return A.a(a1,0)
a0=a1[0]
if(1>=b)return A.a(a1,1)
j=(a0&255)<<8|a1[1]&255
if(2>=b)return A.a(a1,2)
a0=a1[2]
if(3>=b)return A.a(a1,3)
i=(a0&255)<<8|a1[3]&255
if(4>=b)return A.a(a1,4)
a0=a1[4]
if(5>=b)return A.a(a1,5)
h=(a0&255)<<8|a1[5]&255
for(b=a2.length,a0=s.$flags|0,p=0,o=0;p<a7;++p,o+=3,r+=q){if(!(o<b))return A.a(a2,o)
g=a2[o]
m=o+1
if(!(m<b))return A.a(a2,m)
f=a2[m]
m=o+2
if(!(m<b))return A.a(a2,m)
e=a2[m]
a0&2&&A.b(s)
m=s.length
if(!(r>=0&&r<m))return A.a(s,r)
s[r]=g
k=r+1
if(!(k<m))return A.a(s,k)
s[k]=f
k=r+2
if(!(k<m))return A.a(s,k)
s[k]=e
k=r+3
d=g===j&&f===i&&e===h?0:255
if(!(k<m))return A.a(s,k)
s[k]=d}return}s=t.iI.a(b).d
r=(a4*a3.gJ()+a5)*a
q=a6*a
if(a===c)for(b=a2.length,a0=s.$flags|0,p=0,o=0;p<a7;++p,r+=q)for(n=0;n<c;++n,o+=2){m=r+n
if(!(o>=0&&o<b))return A.a(a2,o)
k=a2[o]
d=o+1
if(!(d<b))return A.a(a2,d)
d=a2[d]
a0&2&&A.b(s)
if(!(m>=0&&m<s.length))return A.a(s,m)
s[m]=(k<<8|d)>>>0}else if(c===3){b=a1.length
if(0>=b)return A.a(a1,0)
a0=a1[0]
if(1>=b)return A.a(a1,1)
j=(a0&255)<<8|a1[1]&255
if(2>=b)return A.a(a1,2)
a0=a1[2]
if(3>=b)return A.a(a1,3)
i=(a0&255)<<8|a1[3]&255
if(4>=b)return A.a(a1,4)
a0=a1[4]
if(5>=b)return A.a(a1,5)
h=(a0&255)<<8|a1[5]&255
for(b=a2.length,a0=s.$flags|0,p=0,o=0;p<a7;++p,o+=6,r+=q){if(!(o<b))return A.a(a2,o)
m=a2[o]
k=o+1
if(!(k<b))return A.a(a2,k)
g=(m<<8|a2[k])>>>0
k=o+2
if(!(k<b))return A.a(a2,k)
k=a2[k]
m=o+3
if(!(m<b))return A.a(a2,m)
f=(k<<8|a2[m])>>>0
m=o+4
if(!(m<b))return A.a(a2,m)
m=a2[m]
k=o+5
if(!(k<b))return A.a(a2,k)
e=(m<<8|a2[k])>>>0
a0&2&&A.b(s)
k=s.length
if(!(r>=0&&r<k))return A.a(s,r)
s[r]=g
m=r+1
if(!(m<k))return A.a(s,m)
s[m]=f
m=r+2
if(!(m<k))return A.a(s,m)
s[m]=e
m=r+3
d=g===j&&f===i&&e===h?0:65535
if(!(m<k))return A.a(s,m)
s[m]=d}}else{b=a1.length
if(0>=b)return A.a(a1,0)
a0=a1[0]
if(1>=b)return A.a(a1,1)
i=(a0&255)<<8|a1[1]&255
for(b=a2.length,a0=s.$flags|0,p=0,o=0;p<a7;++p,o+=2,r+=q){if(!(o<b))return A.a(a2,o)
m=a2[o]
k=o+1
if(!(k<b))return A.a(a2,k)
f=(m<<8|a2[k])>>>0
a0&2&&A.b(s)
k=s.length
if(!(r>=0&&r<k))return A.a(s,r)
s[r]=f
m=r+1
if(!(m<k))return A.a(s,m)
s[m]=f
m=r+2
if(!(m<k))return A.a(s,m)
s[m]=f
m=r+3
d=f===i?0:65535
if(!(m<k))return A.a(s,m)
s[m]=d}}},
hu(a,b,c,d){var s,r,q,p,o,n,m,l,k,j,i,h,g=c.length,f=b<g?b:g
switch(a.a){case 0:break
case 1:for(s=c.$flags|0,r=b;r<g;++r){q=c[r]
p=r-b
if(!(p>=0))return A.a(c,p)
p=c[p]
s&2&&A.b(c)
c[r]=q+p}break
case 2:if(d!=null)for(s=d.length,q=c.$flags|0,r=0;r<g;++r){p=c[r]
if(!(r<s))return A.a(d,r)
o=d[r]
q&2&&A.b(c)
c[r]=p+o}break
case 3:if(d==null)for(s=c.$flags|0,r=b;r<g;++r){q=c[r]
p=r-b
if(!(p>=0))return A.a(c,p)
p=c[p]
s&2&&A.b(c)
c[r]=q+(p>>>1)}else{for(s=d.length,q=c.$flags|0,r=0;r<f;++r){if(!(r<g))return A.a(c,r)
p=c[r]
if(!(r<s))return A.a(d,r)
o=d[r]
q&2&&A.b(c)
c[r]=p+(o>>>1)}for(r=b;r<g;++r){p=c[r]
o=r-b
if(!(o>=0))return A.a(c,o)
o=c[o]
if(!(r<s))return A.a(d,r)
n=d[r]
q&2&&A.b(c)
c[r]=p+(o+n>>>1)}}break
case 4:if(d==null)for(s=c.$flags|0,r=b;r<g;++r){q=c[r]
p=r-b
if(!(p>=0))return A.a(c,p)
p=c[p]
s&2&&A.b(c)
c[r]=q+p}else{for(s=d.length,q=c.$flags|0,r=0;r<f;++r){if(!(r<g))return A.a(c,r)
p=c[r]
if(!(r<s))return A.a(d,r)
o=d[r]
q&2&&A.b(c)
c[r]=p+o}for(r=b;r<g;++r){p=r-b
if(!(p>=0))return A.a(c,p)
m=c[p]
if(!(r<s))return A.a(d,r)
l=d[r]
if(!(p<s))return A.a(d,p)
k=d[p]
j=l-k
i=m-k
h=j+i
if(j<0)j=-j
if(i<0)i=-i
if(h<0)h=-h
p=c[r]
if(j<=i&&j<=h)o=m
else o=i<=h?l:k
q&2&&A.b(c)
c[r]=p+o}}break}},
bD(a,b){var s,r,q,p,o,n=this
if(b===0)return 0
if(b===8)return a.H()
if(b===16)return a.m()
for(s=a.c;r=n.d,r<b;){r=a.d
if(r>=s)throw A.e(A.k("Invalid PNG data."))
q=a.a
a.d=r+1
p=J.d(q,r)
r=n.d
n.c=B.a.U(p,r)
n.d=r+8}if(b===1)o=1
else if(b===2)o=3
else{if(b===4)s=15
else s=0
o=s}s=r-b
r=B.a.a4(n.c,s)
n.d=s
return r&o},
hd(a,b){var s,r,q=this
t.L.a(b)
s=q.a
r=s.d
switch(r){case 0:B.c.i(b,0,q.bD(a,s.c))
return
case 2:B.c.i(b,0,q.bD(a,s.c))
B.c.i(b,1,q.bD(a,s.c))
B.c.i(b,2,q.bD(a,s.c))
return
case 3:B.c.i(b,0,q.bD(a,s.c))
return
case 4:B.c.i(b,0,q.bD(a,s.c))
B.c.i(b,1,q.bD(a,s.c))
return
case 6:B.c.i(b,0,q.bD(a,s.c))
B.c.i(b,1,q.bD(a,s.c))
B.c.i(b,2,q.bD(a,s.c))
B.c.i(b,3,q.bD(a,s.c))
return}throw A.e(A.k("Invalid color type: "+r+"."))},
hi(a,b){var s,r,q,p,o,n,m,l,k,j
t.L.a(b)
s=this.a
r=s.d
switch(r){case 0:r=s.x
if(r!=null&&s.c>8){s=r.length
if(0>=s)return A.a(r,0)
q=r[0]
if(1>=s)return A.a(r,1)
r=r[1]
p=b[0]
a.ao(p,p,p,p!==((q&255)<<8|r&255)?a.gG():0)
return}a.aL(b[0],0,0)
return
case 2:o=b[0]
p=b[1]
n=b[2]
s=s.x
if(s!=null){r=s.length
if(0>=r)return A.a(s,0)
q=s[0]
if(1>=r)return A.a(s,1)
m=s[1]
if(2>=r)return A.a(s,2)
l=s[2]
if(3>=r)return A.a(s,3)
k=s[3]
if(4>=r)return A.a(s,4)
j=s[4]
if(5>=r)return A.a(s,5)
s=s[5]
if(o!==((q&255)<<8|m&255)||p!==((l&255)<<8|k&255)||n!==((j&255)<<8|s&255)){a.ao(o,p,n,a.gG())
return}}a.aL(o,p,n)
return
case 3:a.sX(b[0])
return
case 4:a.ao(b[0],0,0,b[1])
return
case 6:a.ao(b[0],b[1],b[2],b[3])
return}throw A.e(A.k("Invalid color type: "+r+"."))}}
A.kP.prototype={
$0(){return this.a.lE(this.b)},
$S:5}
A.kN.prototype={
$0(){return this.a.lD(this.b)},
$S:1}
A.kO.prototype={
$0(){return this.a.lC(this.b,this.c)},
$S:1}
A.jf.prototype={}
A.it.prototype={
a8(){return"PngFilter."+this.b}}
A.is.prototype={
bW(a){var s,r,q,p,o,n,m,l=this,k=8192,j={}
if(!(a.gb6()&&a.gM()!==B.u))s=a.gaU()<8&&!a.gaH()&&a.gak()>1
else s=!0
if(s)a=a.b3(B.e)
if(l.w==null){s=A.ai(!0,k)
l.w=s
s.au(A.j([137,80,78,71,13,10,26,10],t.t))
r=A.ai(!0,k)
r.ae(a.gJ())
r.ae(a.gI())
r.u(a.gaU())
if(a.gaH())s=3
else if(a.gak()===1)s=0
else if(a.gak()===2)s=4
else s=a.gak()===3?2:6
r.u(s)
r.u(0)
r.u(0)
r.u(0)
s=l.w
s.toString
l.bE(s,"IHDR",J.F(B.d.gt(r.c),0,r.a))
s=a.c
if(s!=null){r=A.ai(!0,k)
r.au(new A.an(A.uf(s.a)))
r.u(0)
r.u(0)
r.au(s.n2())
s=l.w
s.toString
l.bE(s,"iCCP",J.F(B.d.gt(r.c),0,r.a))}if(a.gaH()){s=l.a
if(s!=null){s=s.a
s===$&&A.c()
l.hF(s)}else{s=a.a
s=s==null?null:s.gW()
s.toString
l.hF(s)}}if(l.r){r=A.ai(!0,k)
s=l.e
s===$&&A.c()
r.ae(s)
r.ae(l.c)
s=l.w
s.toString
l.bE(s,"acTL",J.F(B.d.gt(r.c),0,r.a))}}s=a.d
if(s!=null)for(s=new A.a1(s,s.r,s.e,A.m(s).n("a1<1>"));s.C();){q=s.d
p=a.d.l(0,q)
p.toString
r=new A.ik(!0,new Uint8Array(8192))
r.au(B.bg.bY(q))
r.u(0)
r.au(B.bg.bY(p))
q=l.w
q.toString
l.bE(q,"tEXt",J.F(B.d.gt(r.c),0,r.a))}if(l.r){r=A.ai(!0,k)
r.ae(l.f)
r.ae(a.gJ())
r.ae(a.gI())
r.ae(0)
r.ae(0)
r.a9(a.y)
r.a9(1000)
r.u(1)
r.u(0)
s=l.w
s.toString
l.bE(s,"fcTL",J.F(B.d.gt(r.c),0,r.a));++l.f}o=l.f<=1
n=o?0:4
r=new Uint8Array(n+65536)
j.a=n
j.b=0
s=new A.kS(j,l,o,r,n)
q=l.d
p=new A.kR(j,r,s)
m=A.ai(!1,(a.a.gaB()+1)*a.gI())
l.kS(0,a,new A.kQ(q,p,m))
p.$1(B.c4.i5(t.L.a(J.F(B.d.gt(m.c),0,m.a)),q,15))
if(j.a>n||j.b===0)s.$0()},
cG(){var s,r=this,q=r.w
if(q==null)return null
r.bE(q,"IEND",A.j([],t.t))
r.f=0
q=r.w
s=J.F(B.d.gt(q.c),0,q.a)
r.w=null
return s},
bM(a,b){var s,r=this
A.hn(a)
a.gav()
r.e=1
r.r=!1
r.bW(a)
s=r.cG()
s.toString
return s},
hF(a){var s,r,q,p=this
if(a.gM()===B.e&&a.b===3&&a.a===256){s=p.w
s.toString
p.bE(s,"PLTE",J.F(a.gt(a),0,null))}else{s=a.a
r=A.ai(!0,s*3)
for(q=0;q<s;++q){r.u(B.b.h(a.bj(q)))
r.u(B.b.h(a.bi(q)))
r.u(B.b.h(a.bh(q)))}s=p.w
s.toString
p.bE(s,"PLTE",J.F(B.d.gt(r.c),0,r.a))}if(a.b===4){s=a.a
r=A.ai(!0,s)
for(q=0;q<s;++q)r.u(B.b.h(a.bq(q)))
s=p.w
s.toString
p.bE(s,"tRNS",J.F(B.d.gt(r.c),0,r.a))}},
bE(a,b,c){t.L.a(c)
a.ae(c.length)
a.au(new A.an(b))
a.au(c)
a.ae(A.bK(c,A.bK(new A.an(b),0)))},
kS(a7,a8,a9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=a8.gaH()?B.oT:this.b,a=a8.gt(0),a0=a8.a.gaB(),a1=a8.gaH()?1:a8.gak(),a2=B.a.j(a1*a8.gaU()+7,3),a3=a8.gaU()+7>>>3,a4=new Uint8Array(a0),a5=[a4,new Uint8Array(a0)],a6=a5[1]
a4=a0+1
s=new Uint8Array(a4)
r=b.a
if(0>=a4)return A.a(s,0)
s[0]=r
q=a9.c
p=a3>1
o=J.bv(a)
n=a3-1
m=0
l=0
for(;;){k=a8.a
k=k==null?null:k.b
if(!(l<(k==null?0:k)))break
j=o.d1(a,m,a0)
i=a5[l&1]
if(p)for(k=j.length,h=i.$flags|0,g=0;g<a0;g+=a3)for(f=n,e=0;e<a3;++e,--f){d=g+e
c=g+f
if(!(c>=0&&c<k))return A.a(j,c)
c=j[c]
h&2&&A.b(i)
if(!(d<i.length))return A.a(i,d)
i[d]=c}else B.d.aa(i,0,a0,j)
switch(r){case 0:B.d.aa(s,1,a4,i)
break
case 1:A.ud(i,a2,s)
break
case 2:A.ue(i,a6,s)
break
case 3:A.ub(i,a6,a2,s)
break
case 4:A.uc(i,a6,a2,s)
break}q.au(s);++l
m+=a0
a6=i}}}
A.kS.prototype={
$0(){var s,r,q=this,p=q.b,o=q.d,n=q.a
if(q.c){s=p.w
s.toString
p.bE(s,"IDAT",J.F(B.d.gt(o),0,n.a))}else{s=p.f
o.$flags&2&&A.b(o)
r=o.length
if(0>=r)return A.a(o,0)
o[0]=s>>>24&255
if(1>=r)return A.a(o,1)
o[1]=s>>>16&255
if(2>=r)return A.a(o,2)
o[2]=s>>>8&255
if(3>=r)return A.a(o,3)
o[3]=s&255
p.f=s+1
s=p.w
s.toString
p.bE(s,"fdAT",J.F(B.d.gt(o),0,n.a))}n.a=q.e;++n.b},
$S:2}
A.kR.prototype={
$1(a){var s,r,q,p,o,n,m,l
for(s=a.length,r=this.a,q=this.b,p=q.length,o=this.c,n=0;n<s;){m=r.a
l=Math.min(s-n,p-m)
B.d.a3(q,m,m+l,a,n)
n+=l
if((r.a+=l)===p)o.$0()}},
$S:28}
A.cu.prototype={
a8(){return"PnmFormat."+this.b}}
A.cv.prototype={
gJ(){return this.a},
gI(){return this.b},
gb7(){return 1}}
A.kT.prototype={
aW(a){var s
this.b=A.v(a,!1,null,0)
s=this.dF()
if(s==="P1"||s==="P2"||s==="P5"||s==="P3"||s==="P6")return!0
return!1},
bd(a,b){return A.Q(new A.kW(this,a,b),t.H)},
lF(a,b){if(this.aC(a)==null)return null
return this.aJ(b)},
aC(a){return A.Q(new A.kX(this,a),t._)},
lH(a){var s,r,q,p=this
p.b=A.v(a,!1,null,0)
s=p.dF()
if(s==="P1"){r=p.a=new A.cv(B.aG)
r.e=B.dI}else if(s==="P2"){r=p.a=new A.cv(B.aG)
r.e=B.dJ}else if(s==="P5"){r=p.a=new A.cv(B.aG)
r.e=B.bN}else if(s==="P3"){r=p.a=new A.cv(B.aG)
r.e=B.dK}else if(s==="P6"){r=p.a=new A.cv(B.aG)
r.e=B.bO}else return p.b=null
r.a=p.cU()
r=p.a
r.toString
r.b=p.cU()
r=p.a
q=r.a
if(q<1||r.b<1)return p.a=p.b=null
A.aw(q,r.b,p.d,!1)
return p.a},
aJ(a){return A.Q(new A.kV(this,a),t.H)},
lG(a){var s,r,q,p,o,n=this,m=null,l=n.a
if(l==null)return m
l=l.e
if(l===B.dI){n.e6(1)
l=n.a
s=l.a
r=A.Z(m,m,B.L,0,B.l,l.b,m,0,1,m,B.e,s,!1)
for(l=r.a,l=l.gF(l);l.C();){q=l.gN()
if(n.dF()==="1")q.aL(1,1,1)
else q.aL(0,0,0)}return r}else if(l===B.dJ||l===B.bN){p=n.cU()
if(p===0)return m
n.e6(1)
l=n.a
s=l.a
l=l.b
r=A.Z(m,m,n.i8(p),0,B.l,l,m,0,1,m,B.e,s,!1)
for(l=r.a,l=l.gF(l);l.C();){q=l.gN()
o=n.dJ(n.a.e,p)
q.aL(o,o,o)}return r}else if(l===B.dK||l===B.bO){p=n.cU()
if(p===0)return m
n.e6(3)
l=n.a
s=l.a
l=l.b
r=A.Z(m,m,n.i8(p),0,B.l,l,m,0,3,m,B.e,s,!1)
for(l=r.a,l=l.gF(l);l.C();)l.gN().aL(n.dJ(n.a.e,p),n.dJ(n.a.e,p),n.dJ(n.a.e,p))
return r}return m},
e6(a){var s,r=this.a,q=r.a
r=r.b
s=this.b
if(s.c-s.d+this.c.gp(0)<q*r*a)throw A.e(A.k("Truncated PNM data"))},
i8(a){if(a>255)return B.u
if(a>15)return B.e
if(a>3)return B.S
if(a>1)return B.R
return B.L},
dJ(a,b){if(a===B.bN||a===B.bO)return this.b.H()
return this.cU()},
cU(){var s,r,q=this.dF()
if(J.bz(q)===0)return 0
try{s=A.jA(q)
return s}catch(r){return 0}},
dF(){var s,r,q,p,o=this.b
if(o==null)return""
s=this.c
if(!s.gab(0))return s.it()
r=B.h.iA(o.nQ())
if(r.length===0)return""
while(B.h.ci(r,"#"))r=B.h.iA(this.b.ip(70))
o=t.nn
q=A.t(new A.c5(A.j(r.split(" "),t.s),t.gS.a(new A.kU()),o),o.n("f.E"))
for(o=q.length,p=0;p<o;++p)if(B.h.ci(q[p],"#")){B.c.sp(q,p)
break}s.cE(0,q)
if(s.b===s.c)return""
return s.it()}}
A.kW.prototype={
$0(){return this.a.lF(this.b,this.c)},
$S:1}
A.kX.prototype={
$0(){return this.a.lH(this.b)},
$S:5}
A.kV.prototype={
$0(){return this.a.lG(this.b)},
$S:1}
A.kU.prototype={
$1(a){return A.bs(a)!==""},
$S:16}
A.iw.prototype={
snr(a){t.T.a(a)},
siV(a){t.T.a(a)},
snS(a){t.T.a(a)},
snT(a){t.T.a(a)}}
A.ix.prototype={
sbX(a){t.T.a(a)},
sc0(a){t.T.a(a)}}
A.bG.prototype={}
A.iA.prototype={
sbX(a){t.T.a(a)},
sc0(a){t.T.a(a)}}
A.iB.prototype={
sbX(a){t.T.a(a)},
sc0(a){t.T.a(a)}}
A.iE.prototype={
sbX(a){t.T.a(a)},
sc0(a){t.T.a(a)}}
A.iF.prototype={
sbX(a){t.T.a(a)},
sc0(a){t.T.a(a)}}
A.fA.prototype={}
A.iD.prototype={}
A.kY.prototype={
ji(a){var s,r,q,p,o=this
a.m()
a.m()
a.m()
a.m()
s=B.a.P(a.c-a.d,8)
if(s>0){o.e=new Uint16Array(s)
o.f=new Uint16Array(s)
o.r=new Uint16Array(s)
o.w=new Uint16Array(s)
for(r=0;r<s;++r){q=o.e
p=a.m()
q.$flags&2&&A.b(q)
if(!(r<q.length))return A.a(q,r)
q[r]=p
p=o.f
q=a.m()
p.$flags&2&&A.b(p)
if(!(r<p.length))return A.a(p,r)
p[r]=q
q=o.r
p=a.m()
q.$flags&2&&A.b(q)
if(!(r<q.length))return A.a(q,r)
q[r]=p
p=o.w
q=a.m()
p.$flags&2&&A.b(p)
if(!(r<p.length))return A.a(p,r)
p[r]=q}}}}
A.d6.prototype={
io(a,b,c,d,e,f,g){if(a.c-a.d<2)return
if(e==null)e=a.m()
switch(e){case 0:d.toString
this.ma(a,b,c,d)
break
case 1:if(f==null)f=this.m7(a,c)
d.toString
this.m9(a,b,c,d,f,g)
break
default:throw A.e(A.k("Unsupported compression: "+e))}},
nP(a,b,c,d){return this.io(a,b,c,d,null,null,0)},
m7(a,b){var s,r,q=new Uint16Array(b)
for(s=0;s<b;++s){r=a.m()
if(!(s<b))return A.a(q,s)
q[s]=r}return q},
ma(a,b,c,d){var s,r=b*c
if(d===16)r*=2
if(r>a.c-a.d){s=new Uint8Array(r)
this.c=s
B.d.V(s,0,r,255)
return}this.c=a.ac(r).a0()},
m9(a,b,c,d,e,f){var s,r,q,p,o,n,m,l=b*c
if(d===16)l*=2
s=new Uint8Array(l)
this.c=s
r=f*c
q=e.length
if(r>=q){B.d.V(s,0,l,255)
return}for(p=0,o=0;o<c;++o,r=n){n=r+1
if(!(r>=0&&r<q))return A.a(e,r)
m=a.aO(e[r])
a.d=a.d+(m.c-m.d)
s=this.c
s.toString
this.kq(m,s,p)
p+=b}},
kq(a,b,c){var s,r,q,p,o,n,m,l
for(s=a.c,r=b.length;q=a.d,q<s;){p=a.a
a.d=q+1
q=J.d(p,q)
p=$.ay()
p.$flags&2&&A.b(p)
p[0]=q
q=$.aI()
if(0>=q.length)return A.a(q,0)
o=q[0]
if(o<0){o=1-o
q=a.d
if(q>=s)break
p=a.a
a.d=q+1
n=J.d(p,q)
if(c+o>r)o=r-c
for(q=b.$flags|0,m=0;m<o;++m,c=l){l=c+1
q&2&&A.b(b)
if(!(c>=0&&c<r))return A.a(b,c)
b[c]=n}}else{++o
if(c+o>r)o=r-c
o=Math.min(o,s-a.d)
for(m=0;m<o;++m,c=l){l=c+1
q=J.d(a.a,a.d++)
b.$flags&2&&A.b(b)
if(!(c>=0&&c<r))return A.a(b,c)
b[c]=q}}}}}
A.bp.prototype={
a8(){return"PsdColorMode."+this.b}}
A.iy.prototype={
gn_(){var s=this.e
s===$&&A.c()
return s},
jj(a,b){var s,r,q=this
q.as=A.v(a,!0,null,0)
q.lN()
if(q.c!==943870035)return
s=q.as.k()
q.as.ac(s)
s=q.as.k()
q.ax=q.as.ac(s)
s=q.as.k()
q.ay=q.as.ac(s)
r=q.as
q.ch=r.ac(r.c-r.d)},
gb7(){return 1},
bZ(){var s,r=this
if(r.c===943870035){s=r.as
s===$&&A.c()
s=s==null}else s=!0
if(s)return!1
A.aw(r.a,r.b,r.CW,!1)
s=r.e
s===$&&A.c()
if(s<1||s>56)throw A.e(A.k("Invalid number of PSD channels: "+r.gn_()))
r.m5()
r.m6()
r.m8()
r.ch=r.ay=r.ax=r.as=null
return!0},
nb(){if(!this.bZ())return null
return this.nU()},
nU(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=this,a1=null,a2=a0.y
if(a2!=null)return a2
a2=a0.a
a2=A.Z(a1,a1,B.e,0,B.l,a0.b,a1,0,4,a1,B.e,a2,!1)
a0.y=a2
a2.ca(0)
for(a2=a0.w,s=0;s<a2.length;++s){r=a2[s]
q=r.y
q===$&&A.c()
if((q&2)!==0)continue
q=r.w
q===$&&A.c()
p=q/255
o=r.r
n=r.cx
q=r.a
q.toString
m=q
l=0
for(;;){q=r.f
q===$&&A.c()
if(!(l<q))break
q=r.a
q.toString
k=q+l
j=r.b
q=m>=0
i=0
for(;;){h=r.e
h===$&&A.c()
if(!(i<h))break
h=n.a
g=h==null?a1:h.S(i,l,a1)
if(g==null)g=new A.J()
f=B.b.h(g.gq())
e=B.b.h(g.gB())
d=B.b.h(g.gA())
c=B.b.h(g.gv())
j.toString
if(j>=0&&j<a0.a&&q&&m<a0.b){h=r.b
h.toString
b=a0.y.a
a=b==null?a1:b.S(h+i,k,a1)
if(a==null)a=new A.J()
a0.jz(B.b.h(a.gq()),B.b.h(a.gB()),B.b.h(a.gA()),B.b.h(a.gv()),f,e,d,c,o,p,a)}++i;++j}++l;++m}}a2=a0.y
a2.toString
return a2},
jz(a,b,c,d,e,f,g,h,i,j,k){var s,r,q,p,o,n=h/255*j
switch(i){case 1885434739:s=d
r=c
q=b
p=a
break
case 1852797549:s=h
r=g
q=f
p=e
break
case 1684632435:s=h
r=g
q=f
p=e
break
case 1684107883:p=Math.min(a,e)
q=Math.min(b,f)
r=Math.min(c,g)
s=h
break
case 1836411936:p=B.a.j(a*e,8)
q=B.a.j(b*f,8)
r=B.a.j(c*g,8)
s=h
break
case 1768188278:p=A.l2(a,e)
q=A.l2(b,f)
r=A.l2(c,g)
s=h
break
case 1818391150:p=A.l4(a,e)
q=A.l4(b,f)
r=A.l4(c,g)
s=h
break
case 1684751212:s=h
r=g
q=f
p=e
break
case 1818850405:p=Math.max(a,e)
q=Math.max(b,f)
r=Math.max(c,g)
s=h
break
case 1935897198:p=A.oc(a,e)
q=A.oc(b,f)
r=A.oc(c,g)
s=h
break
case 1684633120:p=A.l3(a,e)
q=A.l3(b,f)
r=A.l3(c,g)
s=h
break
case 1818518631:p=e+a>255?255:a+e
q=f+b>255?255:b+f
r=g+c>255?255:c+g
s=h
break
case 1818706796:s=h
r=g
q=f
p=e
break
case 1870030194:p=A.oa(a,e,d,h)
q=A.oa(b,f,d,h)
r=A.oa(c,g,d,h)
s=h
break
case 1934387572:p=A.od(a,e)
q=A.od(b,f)
r=A.od(c,g)
s=h
break
case 1749838196:p=A.o8(a,e)
q=A.o8(b,f)
r=A.o8(c,g)
s=h
break
case 1984719220:p=A.oe(a,e)
q=A.oe(b,f)
r=A.oe(c,g)
s=h
break
case 1816947060:p=A.o9(a,e)
q=A.o9(b,f)
r=A.o9(c,g)
s=h
break
case 1884055924:p=A.ob(a,e)
q=A.ob(b,f)
r=A.ob(c,g)
s=h
break
case 1749903736:p=e<255-a?0:255
q=f<255-b?0:255
r=g<255-c?0:255
s=h
break
case 1684629094:p=Math.abs(e-a)
q=Math.abs(f-b)
r=Math.abs(g-c)
s=h
break
case 1936553316:p=A.o7(a,e)
q=A.o7(b,f)
r=A.o7(c,g)
s=h
break
case 1718842722:s=h
r=g
q=f
p=e
break
case 1717856630:s=h
r=g
q=f
p=e
break
case 1752524064:s=h
r=g
q=f
p=e
break
case 1935766560:s=h
r=g
q=f
p=e
break
case 1668246642:s=h
r=g
q=f
p=e
break
case 1819634976:s=h
r=g
q=f
p=e
break
default:s=h
r=g
q=f
p=e}o=1-n
k.sq(B.b.h(a*o+p*n))
k.sB(B.b.h(b*o+q*n))
k.sA(B.b.h(c*o+r*n))
k.sv(B.b.h(d*o+s*n))},
lN(){var s,r,q=this,p=q.as
p===$&&A.c()
q.c=p.k()
p=q.as.m()
q.d=p
if(p!==1){q.c=0
return}s=q.as.ac(6)
for(r=0;r<6;++r)if(J.d(s.a,s.d+r)!==0){q.c=0
return}q.e=q.as.m()
q.b=q.as.k()
q.a=q.as.k()
q.f=q.as.m()
p=q.as.m()
if(!(p<8))return A.a(B.dA,p)
q.r=B.dA[p]},
m5(){var s,r,q,p,o,n=this,m=n.ax
m.d=m.b
for(m=n.z;s=n.ax,s.d<s.c;){r=s.k()
q=n.ax.m()
s=n.ax
p=J.d(s.a,s.d++)
n.ax.ar(p)
if((p&1)===0)++n.ax.d
p=n.ax.k()
s=n.ax
o=s.aO(p)
s.d=s.d+(o.c-o.d)
if((p&1)===1)++n.ax.d
if(r===943868237)m.i(0,q,new A.iz())}},
m6(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this,c=d.ay
c.d=c.b
s=c.k()
if((s&1)!==0)++s
r=d.ay.ac(s)
c=d.w
B.c.ca(c)
if(s>0){q=r.m()
p=$.ax()
p.$flags&2&&A.b(p)
p[0]=q
q=$.aH()
if(0>=q.length)return A.a(q,0)
o=q[0]
if(o<0)o=-o
for(q=t.N,p=t.mi,n=t.k9,m=t.na,l=0;l<o;++l){k=new A.iC(A.P(q,p),A.j([],n),A.j([],m))
k.jk(r)
B.c.E(c,k)}}q=d.CW
j=new A.im(q)
i=d.f===16?2:1
p=d.a
n=d.b
m=d.e
m===$&&A.c()
h=p*n*m*i
for(p=c.length,g=0;g<c.length;c.length===p||(0,A.K)(c),++g){k=c[g]
n=k.e
n===$&&A.c()
m=k.f
m===$&&A.c()
A.aw(n,m,q,!0)
j.hH(0,k.e,k.f)
m=k.e
n=k.f
f=k.as
f===$&&A.c()
h+=m*n*f.length*i}if(h>Math.max(128*d.at,16777216))throw A.e(A.k("PSD data is too small for its size"))
for(l=0;l<c.length;++l)c[l].nL(r,d)
s=d.ay.k()
e=d.ay.ac(s)
if(s>0){e.m()
e.m()
e.m()
e.m()
e.m()
e.m()
e.H()}},
m8(){var s,r,q,p,o,n,m=this,l=m.ch
l.d=l.b
s=l.m()
if(s===1){l=m.b
r=m.e
r===$&&A.c()
q=l*r
p=new Uint16Array(q)
for(o=0;o<q;++o)p[o]=m.ch.m()}else p=null
m.x=t.cf.a(A.j([],t.mS))
o=0
for(;;){l=m.e
l===$&&A.c()
if(!(o<l))break
l=m.x
r=m.ch
r.toString
n=o===3?-1:o
n=new A.d6(n)
n.io(r,m.a,m.b,m.f,s,p,o)
B.c.E(l,n);++o}m.y=A.q4(m.r,m.f,m.a,m.b,m.x)},
$iL:1,
gJ(){return this.a},
gI(){return this.b}}
A.iz.prototype={}
A.iC.prototype={
jk(a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1=this,a2=a4.k(),a3=$.V()
a3.$flags&2&&A.b(a3)
a3[0]=a2
a2=$.ad()
if(0>=a2.length)return A.a(a2,0)
a1.a=a2[0]
a3[0]=a4.k()
a1.b=a2[0]
a3[0]=a4.k()
a1.c=a2[0]
a3[0]=a4.k()
a2=a2[0]
a1.d=a2
a3=a1.b
a3.toString
a1.e=a2-a3
a3=a1.c
a2=a1.a
a2.toString
a1.f=a3-a2
a1.as=t.cf.a(A.j([],t.mS))
s=a4.m()
for(r=0;r<s;++r){a2=a4.m()
a3=$.ax()
a3.$flags&2&&A.b(a3)
a3[0]=a2
a2=$.aH()
if(0>=a2.length)return A.a(a2,0)
q=a2[0]
a4.k()
B.c.E(a1.as,new A.d6(q))}p=a4.k()
if(p!==943868237)throw A.e(A.k("Invalid PSD layer signature: "+B.a.dW(p,16)))
a1.r=a4.k()
a1.w=a4.H()
a4.H()
a1.y=a4.H()
if(a4.H()!==0)throw A.e(A.k("Invalid PSD layer data"))
o=a4.k()
n=a4.ac(o)
if(o>0){o=n.k()
if(o>0){m=n.ac(o)
a2=m.d
m.k()
m.k()
m.k()
m.k()
m.H()
m.H()
if(m.c-a2===20)m.d+=2
else{m.H()
m.H()
m.k()
m.k()
m.k()
m.k()}}o=n.k()
if(o>0)new A.kY().ji(n.ac(o))
o=n.H()
n.ar(o)
l=4-B.a.a1(o,4)-1
if(l>0)n.d+=l
for(a2=n.c,a3=a1.ay,k=a1.cy,j=t.t,i=t.dw;n.d<a2;){p=n.k()
if(p!==943868237)throw A.e(A.k("PSD invalid signature for layer additional data: "+B.a.dW(p,16)))
h=n.ar(4)
o=n.k()
g=n.aO(o)
f=n.d+(g.c-g.d)
n.d=f
if((o&1)===1)n.d=f+1
a3.i(0,h,A.uk(h,g))
if(h==="lrFX"){e=A.w(i.a(a3.l(0,"lrFX")).b,null,0)
e.m()
d=e.m()
for(c=0;c<d;++c){e.ar(4)
b=e.ar(4)
a=e.k()
if(b==="dsdw"){a0=new A.ix()
B.c.E(k,a0)
a0.a=e.k()
e.k()
e.k()
e.k()
e.k()
a0.sbX(A.j([e.m(),e.m(),e.m(),e.m(),e.m()],j))
e.ar(8)
J.d(e.a,e.d++)
J.d(e.a,e.d++)
J.d(e.a,e.d++)
a0.sc0(A.j([e.m(),e.m(),e.m(),e.m(),e.m()],j))}else if(b==="isdw"){a0=new A.iB()
B.c.E(k,a0)
a0.a=e.k()
e.k()
e.k()
e.k()
e.k()
a0.sbX(A.j([e.m(),e.m(),e.m(),e.m(),e.m()],j))
e.ar(8)
J.d(e.a,e.d++)
J.d(e.a,e.d++)
J.d(e.a,e.d++)
a0.sc0(A.j([e.m(),e.m(),e.m(),e.m(),e.m()],j))}else if(b==="oglw"){a0=new A.iE()
B.c.E(k,a0)
a0.a=e.k()
e.k()
e.k()
a0.sbX(A.j([e.m(),e.m(),e.m(),e.m(),e.m()],j))
e.ar(8)
J.d(e.a,e.d++)
J.d(e.a,e.d++)
if(a0.a===2)a0.sc0(A.j([e.m(),e.m(),e.m(),e.m(),e.m()],j))}else if(b==="iglw"){a0=new A.iA()
B.c.E(k,a0)
a0.a=e.k()
e.k()
e.k()
a0.sbX(A.j([e.m(),e.m(),e.m(),e.m(),e.m()],j))
e.ar(8)
J.d(e.a,e.d++)
J.d(e.a,e.d++)
if(a0.a===2){J.d(e.a,e.d++)
a0.sc0(A.j([e.m(),e.m(),e.m(),e.m(),e.m()],j))}}else if(b==="bevl"){a0=new A.iw()
B.c.E(k,a0)
a0.a=e.k()
e.k()
e.k()
e.k()
e.ar(8)
e.ar(8)
a0.snr(A.j([e.m(),e.m(),e.m(),e.m(),e.m()],j))
a0.siV(A.j([e.m(),e.m(),e.m(),e.m(),e.m()],j))
J.d(e.a,e.d++)
J.d(e.a,e.d++)
J.d(e.a,e.d++)
J.d(e.a,e.d++)
J.d(e.a,e.d++)
J.d(e.a,e.d++)
if(a0.a===2){a0.snS(A.j([e.m(),e.m(),e.m(),e.m(),e.m()],j))
a0.snT(A.j([e.m(),e.m(),e.m(),e.m(),e.m()],j))}}else if(b==="sofi"){a0=new A.iF()
B.c.E(k,a0)
a0.a=e.k()
e.ar(4)
a0.sbX(A.j([e.m(),e.m(),e.m(),e.m(),e.m()],j))
J.d(e.a,e.d++)
J.d(e.a,e.d++)
a0.sc0(A.j([e.m(),e.m(),e.m(),e.m(),e.m()],j))}else e.d+=a}}}}},
nL(a,b){var s,r,q,p,o,n=this,m=0
for(;;){s=n.as
s===$&&A.c()
if(!(m<s.length))break
s=s[m]
r=n.e
r===$&&A.c()
q=n.f
q===$&&A.c()
s.nP(a,r,q,b.f);++m}r=b.r
q=b.f
p=n.e
p===$&&A.c()
o=n.f
o===$&&A.c()
n.cx=A.q4(r,q,p,o,s)}}
A.e3.prototype={}
A.kZ.prototype={
aW(a){var s,r
try{s=A.q3(a,null).c
return s===943870035}catch(r){return!1}},
bd(a,b){return A.Q(new A.l0(this,a,b),t.H)},
lM(a,b){if(this.aC(a)==null)return null
return this.aJ(b)},
aC(a){return A.Q(new A.l1(this,a),t._)},
aJ(a){return A.Q(new A.l_(this,a),t.H)}}
A.l0.prototype={
$0(){return this.a.lM(this.b,this.c)},
$S:1}
A.l1.prototype={
$0(){var s=this.a
return s.a=A.q3(this.b,s.b)},
$S:5}
A.l_.prototype={
$0(){var s=this.a.a
return s==null?null:s.nb()},
$S:1}
A.iG.prototype={}
A.e5.prototype={}
A.aB.prototype={
am(a,b){var s=this
return new A.aB(s.a+b.a,s.b+b.b,s.c+b.c,s.d+b.d)}}
A.e4.prototype={
gb7(){return 1},
$iL:1,
gJ(){return this.a},
gI(){return this.b}}
A.d7.prototype={
gb7(){return 1},
$iL:1,
gI(){return this.f},
gJ(){return this.r}}
A.fB.prototype={
gb7(){return 1},
$iL:1,
gJ(){return this.a},
gI(){return this.b}}
A.b5.prototype={
sd2(a){var s=this.a,r=this.b+1
s.$flags&2&&A.b(s)
if(!(r<s.length))return A.a(s,r)
s[r]=a},
df(){var s,r=this.e,q=this.d
if(r){s=q>>>9
if(!(s<32))return A.a(B.C,s)
return new A.e5(B.C[s],B.C[q>>>4&31],B.I[q&15])}else return new A.e5(B.I[q>>>7&15],B.I[q>>>3&15],B.ba[q&7])},
dh(){var s,r=this.e,q=this.d
if(r){s=q>>>9
if(!(s<32))return A.a(B.C,s)
return new A.aB(B.C[s],B.C[q>>>4&31],B.I[q&15],255)}else return new A.aB(B.I[q>>>7&15],B.I[q>>>3&15],B.ba[q&7],B.ba[q>>>11&7])},
dg(){var s,r=this.r,q=this.f
if(r){s=q>>>10
if(!(s<32))return A.a(B.C,s)
return new A.e5(B.C[s],B.C[q>>>5&31],B.C[q&31])}else return new A.e5(B.I[q>>>8&15],B.I[q>>>4&15],B.I[q&15])},
di(){var s,r=this.r,q=this.f
if(r){s=q>>>10
if(!(s<32))return A.a(B.C,s)
return new A.aB(B.C[s],B.C[q>>>5&31],B.C[q&31],255)}else return new A.aB(B.I[q>>>8&15],B.I[q>>>4&15],B.I[q&15],B.ba[q>>>12&7])},
cQ(){var s=this,r=s.c?1:0,q=s.d,p=s.e?1:0,o=s.f,n=s.r?1:0
return(r|(q&16383)<<1|p<<15|(o&32767)<<16|n<<31)>>>0},
bL(){var s,r=this,q=r.a,p=r.b+1
if(!(p<q.length))return A.a(q,p)
s=q[p]
r.c=(s&1)===1
r.sd2(r.cQ())
r.d=s>>>1&16383
r.sd2(r.cQ())
r.e=(s>>>15&1)===1
r.sd2(r.cQ())
r.f=s>>>16&32767
r.sd2(r.cQ())
r.r=(s>>>31&1)===1
r.sd2(r.cQ())}}
A.l5.prototype={
aW(a){var s,r
try{s=this.aC(a)
return s!=null}catch(r){return!1}},
aC(a){return A.Q(new A.l8(this,a),t._)},
mx(a){var s,r=this,q=a.length,p=q-(q>>>1&1431655765)>>>0
p=(p&858993459)+(p>>>2&858993459)
if((p+(p>>>4)>>>0&252645135)*16843009>>>0>>>24===1){s=r.k8(a)
if(s!=null){r.a=a
return r.b=s}}s=r.kp(a)
if(s!=null){r.a=a
return r.b=s}s=r.kn(a)
if(s!=null){r.a=a
return r.b=s}return null},
kp(a){var s,r,q=A.v(a,!1,null,0)
if(q.c-q.d<52)return null
if(q.k()!==55727696)return null
s=A.j([0,0,0,0],t.t)
r=new A.d7(s)
q.k()
r.b=q.k()
B.c.i(s,0,q.H())
B.c.i(s,1,q.H())
B.c.i(s,2,q.H())
B.c.i(s,3,q.H())
q.k()
q.k()
r.f=q.k()
r.r=q.k()
q.k()
q.k()
q.k()
q.k()
r.Q=q.k()
return r},
kn(a){var s,r,q=A.v(a,!1,null,0)
if(q.k()!==52)return null
s=new A.e4()
s.b=q.k()
s.a=q.k()
q.k()
s.d=q.k()
q.k()
s.f=q.k()
q.k()
q.k()
q.k()
s.y=q.k()
r=q.k()
s.z=r
s.Q=q.k()
if(r!==559044176)return null
return s},
k8(a){var s,r,q,p,o,n,m=null,l=a.length,k=A.v(a,!1,m,0)
if(k.k()!==0)return m
s=new A.fB()
s.b=k.k()
s.a=k.k()
k.k()
k.k()
k.k()
k.k()
k.k()
k.k()
k.k()
r=k.k()
s.y=r
if(r===559044176)return m
q=0
p=8
if(!(l===32)){o=0
for(;;){if(!(o<10)){q=1
break}n=o<<1>>>0
if((B.a.O(64,n)&l)>>>0!==0){p=B.a.O(16,o)
q=1
break}if((B.a.O(128,n)&l)>>>0!==0){p=B.a.O(16,o)
break}++o}if(o===10)return m}if((q+1)*2===4)return m
s.b=s.a=p
return s},
aJ(a){return A.Q(new A.l6(this,a),t.H)},
ki(a){var s,r,q=this,p=q.b
if(p==null||q.a==null)return null
A.aw(p.gJ(),q.b.gI(),q.c,!1)
p=q.b
if(p instanceof A.fB){p=p.a
s=q.b.gI()
r=q.a
r.toString
return q.ef(p,s,r)}else if(p instanceof A.e4){p=q.a
p.toString
return q.km(p)}else if(p instanceof A.d7){p=q.a
p.toString
return q.ko(p)}return null},
bd(a,b){return A.Q(new A.l7(this,a,b),t.H)},
lR(a,b){if(this.aC(a)==null)return null
return this.aJ(b)},
km(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=null,e=a.length
if(e<52||g.b==null)return f
s=g.b
s.toString
t.fF.a(s)
r=A.v(a,!1,f,0)
r.d+=52
q=s.Q
if(q<1)q=(s.d&4096)!==0?6:1
if(q!==1)return f
p=s.a
o=s.b
if(p*o*s.f/8>e-52)return f
switch(s.d&255){case 16:n=A.Z(f,f,B.e,0,B.l,o,f,0,4,f,B.e,p,!1)
for(s=n.a,s=s.gF(s);s.C();){m=s.gN()
l=J.d(r.a,r.d++)
k=J.d(r.a,r.d++)
m.sq(k&240)
m.sB((k&15)<<4)
m.sA(l&240)
m.sv((l&15)<<4)}return n
case 17:n=A.Z(f,f,B.e,0,B.l,o,f,0,4,f,B.e,p,!1)
for(s=n.a,s=s.gF(s);s.C();){m=s.gN()
j=r.m()
i=(j&1)!==0?255:0
m.sq(j>>>8&248)
m.sB(j>>>3&248)
m.sA((j&62)<<2)
m.sv(i)}return n
case 18:n=A.Z(f,f,B.e,0,B.l,o,f,0,4,f,B.e,p,!1)
for(s=n.a,s=s.gF(s);s.C();){m=s.gN()
m.sq(J.d(r.a,r.d++))
m.sB(J.d(r.a,r.d++))
m.sA(J.d(r.a,r.d++))
m.sv(J.d(r.a,r.d++))}return n
case 19:n=A.Z(f,f,B.e,0,B.l,o,f,0,3,f,B.e,p,!1)
for(s=n.a,s=s.gF(s);s.C();){m=s.gN()
j=r.m()
m.sq(j>>>8&248)
m.sB(j>>>3&252)
m.sA((j&31)<<3)}return n
case 20:n=A.Z(f,f,B.e,0,B.l,o,f,0,3,f,B.e,p,!1)
for(s=n.a,s=s.gF(s);s.C();){m=s.gN()
j=r.m()
m.sq((j&31)<<3)
m.sB(j>>>2&248)
m.sA(j>>>7&248)}return n
case 21:n=A.Z(f,f,B.e,0,B.l,o,f,0,3,f,B.e,p,!1)
for(s=n.a,s=s.gF(s);s.C();){m=s.gN()
m.sq(J.d(r.a,r.d++))
m.sB(J.d(r.a,r.d++))
m.sA(J.d(r.a,r.d++))}return n
case 22:n=A.Z(f,f,B.e,0,B.l,o,f,0,1,f,B.e,p,!1)
for(s=n.a,s=s.gF(s);s.C();)s.gN().sq(J.d(r.a,r.d++))
return n
case 23:n=A.Z(f,f,B.e,0,B.l,o,f,0,4,f,B.e,p,!1)
for(s=n.a,s=s.gF(s);s.C();){m=s.gN()
i=J.d(r.a,r.d++)
h=J.d(r.a,r.d++)
m.sq(h)
m.sB(h)
m.sA(h)
m.sv(i)}return n
case 24:return f
case 25:return s.y===0?g.fG(p,o,r.a0()):g.ef(p,o,r.a0())}return f},
ko(a){var s,r,q,p=this
if(!(p.b instanceof A.d7))return null
s=A.v(a,!1,null,0)
r=s.d+=52
q=t.gH.a(p.b)
s.d=r+q.Q
if(q.c[0]===0)switch(q.b){case 2:return p.fG(q.r,q.f,s.a0())
case 3:return p.ef(q.r,q.f,s.a0())}return null},
fG(c6,c7,c8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6=null,b7=A.Z(b6,b6,B.e,0,B.l,c7,b6,0,3,b6,B.e,c6,!1),b8=c6/4|0,b9=b8-1,c0=J.az(B.d.gt(c8),0,null),c1=new A.b5(c0),c2=new A.b5(J.az(B.d.gt(c8),0,null)),c3=new A.b5(J.az(B.d.gt(c8),0,null)),c4=new A.b5(J.az(B.d.gt(c8),0,null)),c5=new A.b5(J.az(B.d.gt(c8),0,null))
for(s=c0.length,r=0,q=0;r<b8;++r,q+=4)for(p=0,o=0;p<b8;++p,o+=4){c1.b=A.bU(p,r)<<1>>>0
c1.bL()
n=c1.b
if(!(n<s))return A.a(c0,n)
m=c0[n]
l=c1.c?4:0
for(k=0,j=0;j<4;++j){i=(r+(j<2?-1:0)&b9)>>>0
h=(i+1&b9)>>>0
for(n=j+q,g=0;g<4;++g){f=(p+(g<2?-1:0)&b9)>>>0
e=(f+1&b9)>>>0
c2.b=A.bU(f,i)<<1>>>0
c2.bL()
c3.b=A.bU(e,i)<<1>>>0
c3.bL()
c4.b=A.bU(f,h)<<1>>>0
c4.bL()
c5.b=A.bU(e,h)<<1>>>0
c5.bL()
d=c2.df()
if(!(k>=0&&k<16))return A.a(B.w,k)
c=B.w[k][0]
b=c3.df()
a=B.w[k][1]
a0=c4.df()
a1=B.w[k][2]
a2=c5.df()
a3=B.w[k][3]
a4=c2.dg()
a5=B.w[k][0]
a6=c3.dg()
a7=B.w[k][1]
a8=c4.dg()
a9=B.w[k][2]
b0=c5.dg()
b1=B.w[k][3]
b2=B.dk[l+m&3]
b3=b2[0]
b4=b2[1]
b5=b7.a
if(b5!=null)b5.aT(g+o,n,(d.a*c+b.a*a+a0.a*a1+a2.a*a3)*b3+(a4.a*a5+a6.a*a7+a8.a*a9+b0.a*b1)*b4>>>7,(d.b*c+b.b*a+a0.b*a1+a2.b*a3)*b3+(a4.b*a5+a6.b*a7+a8.b*a9+b0.b*b1)*b4>>>7,(d.c*c+b.c*a+a0.c*a1+a2.c*a3)*b3+(a4.c*a5+a6.c*a7+a8.c*a9+b0.c*b1)*b4>>>7)
m=m>>>2;++k}}}return b7},
ef(b4,b5,b6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4=null,a5=A.Z(a4,a4,B.e,0,B.l,b5,a4,0,4,a4,B.e,b4,!1),a6=b4/4|0,a7=a6-1,a8=J.az(B.d.gt(b6),0,null),a9=new A.b5(a8),b0=new A.b5(J.az(B.d.gt(b6),0,null)),b1=new A.b5(J.az(B.d.gt(b6),0,null)),b2=new A.b5(J.az(B.d.gt(b6),0,null)),b3=new A.b5(J.az(B.d.gt(b6),0,null))
for(s=a8.length,r=0,q=0;r<a6;++r,q+=4)for(p=0,o=0;p<a6;++p,o+=4){a9.b=A.bU(p,r)<<1>>>0
a9.bL()
n=a9.b
if(!(n<s))return A.a(a8,n)
m=a8[n]
l=a9.c?4:0
for(k=0,j=0;j<4;++j){i=(r+(j<2?-1:0)&a7)>>>0
h=(i+1&a7)>>>0
for(n=j+q,g=0;g<4;++g){f=(p+(g<2?-1:0)&a7)>>>0
e=(f+1&a7)>>>0
b0.b=A.bU(f,i)<<1>>>0
b0.bL()
b1.b=A.bU(e,i)<<1>>>0
b1.bL()
b2.b=A.bU(f,h)<<1>>>0
b2.bL()
b3.b=A.bU(e,h)<<1>>>0
b3.bL()
d=b0.dh()
if(!(k>=0&&k<16))return A.a(B.w,k)
c=B.w[k][0]
b=b1.dh()
a=B.w[k][1]
a=new A.aB(d.a*c,d.b*c,d.c*c,d.d*c).am(0,new A.aB(b.a*a,b.b*a,b.c*a,b.d*a))
b=b2.dh()
c=B.w[k][2]
c=a.am(0,new A.aB(b.a*c,b.b*c,b.c*c,b.d*c))
b=b3.dh()
a=B.w[k][3]
a0=c.am(0,new A.aB(b.a*a,b.b*a,b.c*a,b.d*a))
a=b0.di()
b=B.w[k][0]
c=b1.di()
d=B.w[k][1]
d=new A.aB(a.a*b,a.b*b,a.c*b,a.d*b).am(0,new A.aB(c.a*d,c.b*d,c.c*d,c.d*d))
c=b2.di()
b=B.w[k][2]
b=d.am(0,new A.aB(c.a*b,c.b*b,c.c*b,c.d*b))
c=b3.di()
d=B.w[k][3]
a1=b.am(0,new A.aB(c.a*d,c.b*d,c.c*d,c.d*d))
a2=B.dk[l+m&3]
d=a2[0]
c=a2[1]
b=a2[2]
a=a2[3]
a3=a5.a
if(a3!=null)a3.aw(g+o,n,a0.a*d+a1.a*c>>>7,a0.b*d+a1.b*c>>>7,a0.c*d+a1.c*c>>>7,a0.d*b+a1.d*a>>>7)
m=m>>>2;++k}}}return a5}}
A.l8.prototype={
$0(){return this.a.mx(this.b)},
$S:5}
A.l6.prototype={
$0(){return this.a.ki(this.b)},
$S:1}
A.l7.prototype={
$0(){return this.a.lR(this.b,this.c)},
$S:1}
A.fJ.prototype={
gb7(){return 1},
cd(a){var s,r,q=this
if(a.c-a.d<18)return
q.a=a.H()
q.b=a.H()
s=a.H()
if(s<12){if(!(s>=0))return A.a(B.df,s)
r=B.df[s]}else r=B.bb
q.c=r
a.m()
q.e=a.m()
q.f=a.H()
a.m()
a.m()
q.x=a.m()
q.y=a.m()
q.z=a.H()
q.Q=a.H()},
ic(){var s=this,r=s.z
if(r!==8&&r!==16&&r!==24&&r!==32)return!1
r=s.c
if(r===B.a2||r===B.a3){if(s.e>256||s.b!==1)return!1
r=s.f
if(r!==16&&r!==24&&r!==32)return!1}else if(s.b===1)return!1
return!0},
$iL:1,
gJ(){return this.x},
gI(){return this.y}}
A.aC.prototype={
a8(){return"TgaImageType."+this.b}}
A.lc.prototype={
bd(a,b){return A.Q(new A.le(this,a,b),t.H)},
mA(a,b){if(this.aC(a)==null)return null
return this.aJ(b)},
aC(a){return A.Q(new A.lf(this,a),t._)},
mC(a){var s,r,q,p,o=this
o.a=new A.fJ(B.bb)
s=A.v(a,!1,null,0)
o.b=s
r=s.ac(18)
o.a.cd(r)
s=o.a
if(!s.ic()||s.x<1||s.y<1)return null
q=o.b
q.d+=s.a
p=s.c
if(p===B.a2||p===B.a3)s.as=q.ac(s.e*B.a.j(s.f,3)).a0()
s=o.a
s.ax=o.b.d
return s},
aJ(a){return A.Q(new A.ld(this,a),t.H)},
mB(a){var s=this,r=s.a
if(r==null)return null
A.aw(r.x,r.y,s.c,!1)
r=s.a.c
if(r===B.dR)return s.fF()
else if(r===B.dQ||r===B.a3)return s.kr()
else if(r===B.a2)return s.fF()
return null},
fA(a,b){var s,r,q,p,o,n,m,l=this,k=A.v(a,!1,null,0),j=l.a.f
if(j===16){j=l.b
j===$&&A.c()
s=j.m()
r=s>>>7&248
q=s>>>2&248
p=(s&31)<<3
o=(s&32768)!==0?0:255
for(n=0;n<l.a.e;++n){b.bI(n,r)
b.bH(n,q)
b.bG(n,p)
b.bF(n,o)}}else{m=j===32
for(n=0;n<l.a.e;++n){p=J.d(k.a,k.d++)
q=J.d(k.a,k.d++)
r=J.d(k.a,k.d++)
o=m?J.d(k.a,k.d++):255
b.bI(n,r)
b.bH(n,q)
b.bG(n,p)
b.bF(n,o)}}},
kr(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=this,d=null,c=e.a,b=c.z,a=b===16,a0=a||b===32,a1=c.x,a2=c.y,a3=a0?4:3
c=c.c
s=A.Z(d,d,B.e,0,B.l,a2,d,0,a3,d,B.e,a1,c===B.a2||c===B.a3)
c=s.a
if((c==null?d:c.gW())!=null){c=e.a.as
c.toString
a1=s.a
a1=a1==null?d:a1.gW()
a1.toString
e.fA(c,a1)}r=s.gJ()
q=s.gI()-1
c=b===8
p=0
for(;;){a1=e.b
a1===$&&A.c()
a2=a1.d
if(!(a2<a1.c&&q>=0))break
a3=a1.a
a1.d=a2+1
o=J.d(a3,a2)
n=(o&127)+1
m=0
if((o&128)!==0)if(c){a1=e.b
l=J.d(a1.a,a1.d++)
for(k=0;k<n;++k){j=p+1
a1=s.a
if(a1!=null)a1.aS(p,q,l)
if(j>=r){--q
if(q<0){p=m
break}p=0}else p=j}}else{a1=e.b
if(a){i=a1.m()
l=i>>>7&248
h=i>>>2&248
g=(i&31)<<3
f=(i&32768)!==0?0:255
for(k=0;k<n;++k){j=p+1
a1=s.a
if(a1!=null)a1.aw(p,q,l,h,g,f)
if(j>=r){--q
if(q<0){p=m
break}p=0}else p=j}}else{g=J.d(a1.a,a1.d++)
a1=e.b
h=J.d(a1.a,a1.d++)
a1=e.b
l=J.d(a1.a,a1.d++)
if(a0){a1=e.b
f=J.d(a1.a,a1.d++)}else f=255
for(k=0;k<n;++k){j=p+1
a1=s.a
if(a1!=null)a1.aw(p,q,l,h,g,f)
if(j>=r){--q
if(q<0){p=m
break}p=0}else p=j}}}else if(c)for(k=0;k<n;++k){a1=e.b
l=J.d(a1.a,a1.d++)
j=p+1
a1=s.a
if(a1!=null)a1.aS(p,q,l)
if(j>=r){--q
if(q<0){p=m
break}p=0}else p=j}else if(a)for(k=0;k<n;++k){i=e.b.m()
f=(i&32768)!==0?0:255
j=p+1
a1=s.a
if(a1!=null)a1.aw(p,q,i>>>7&248,i>>>2&248,(i&31)<<3,f)
a1=e.b
if(a1.d>=a1.c){p=j
break}if(j>=r){--q
if(q<0){p=m
break}p=0}else p=j}else for(k=0;k<n;++k){a1=e.b
g=J.d(a1.a,a1.d++)
a1=e.b
h=J.d(a1.a,a1.d++)
a1=e.b
l=J.d(a1.a,a1.d++)
if(a0){a1=e.b
f=J.d(a1.a,a1.d++)}else f=255
j=p+1
a1=s.a
if(a1!=null)a1.aw(p,q,l,h,g,f)
if(j>=r){--q
if(q<0){p=m
break}p=0}else p=j}if(p>=r){--q
if(q<0)break
p=0}}return s},
fF(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this,c=null,b=d.b
b===$&&A.c()
s=d.a
b.d=s.ax
r=s.z
b=r===16
q=!0
if(!b)if(r!==32){p=s.c
if(p===B.a2||p===B.a3){p=s.f
p=p===16||p===32}else p=!1
q=p}p=s.x
o=s.y
n=q?4:3
s=s.c
m=A.Z(c,c,B.e,0,B.l,o,c,0,n,c,B.e,p,s===B.a2||s===B.a3)
s=d.a
p=s.c
if(p===B.a2||p===B.a3){s=s.as
s.toString
p=m.a
p=p==null?c:p.gW()
p.toString
d.fA(s,p)}if(r===8)for(l=m.gI()-1;l>=0;--l){k=0
for(;;){b=m.a
b=b==null?c:b.a
if(!(k<(b==null?0:b)))break
b=d.b
j=J.d(b.a,b.d++)
b=m.a
if(b!=null)b.aS(k,l,j);++k}}else if(b)for(l=m.gI()-1;l>=0;--l){k=0
for(;;){b=m.a
b=b==null?c:b.a
if(!(k<(b==null?0:b)))break
i=d.b.m()
h=(i&32768)!==0?0:255
b=m.a
if(b!=null)b.aw(k,l,i>>>7&248,i>>>2&248,(i&31)<<3,h);++k}}else for(l=m.gI()-1;l>=0;--l){k=0
for(;;){b=m.a
b=b==null?c:b.a
if(!(k<(b==null?0:b)))break
b=d.b
g=J.d(b.a,b.d++)
b=d.b
f=J.d(b.a,b.d++)
b=d.b
e=J.d(b.a,b.d++)
if(q){b=d.b
h=J.d(b.a,b.d++)}else h=255
b=m.a
if(b!=null)b.aw(k,l,e,f,g,h);++k}}return m}}
A.le.prototype={
$0(){return this.a.mA(this.b,this.c)},
$S:1}
A.lf.prototype={
$0(){return this.a.mC(this.b)},
$S:5}
A.ld.prototype={
$0(){return this.a.mB(this.b)},
$S:1}
A.lg.prototype={
aq(a){var s,r,q,p,o,n=this
if(a===0)return 0
if(n.c===0){n.c=8
n.b=n.a.H()}for(s=n.a,r=0;q=n.c,a>q;){p=B.a.U(r,q)
o=n.b
if(!(q>=0&&q<9))return A.a(B.N,q)
r=p+(o&B.N[q])
a-=q
n.c=8
n.b=J.d(s.a,s.d++)}if(a>0){if(q===0){n.c=8
n.b=s.H()}s=B.a.U(r,a)
q=n.b
p=n.c-a
q=B.a.aM(q,p)
if(!(a<9))return A.a(B.N,a)
r=s+(q&B.N[a])
n.c=p}return r}}
A.iN.prototype={
D(a){var s=this,r=s.a,q=$.nJ().l(0,r)
if(q!=null)return q.a+": "+s.b.D(0)+" "+s.c
return"<"+r+">: "+s.b.D(0)+" "+s.c},
bw(){var s,r,q,p,o,n,m=this,l=m.e
if(l!=null)return l
l=m.f
s=m.d
l.d=s
r=m.c
q=m.b
p=q!==B.f
if(p){o=q.a
if(!(o<14))return A.a(B.B,o)
o=B.B[o]}else o=0
if(r*o>l.c-s)throw A.e(A.k("Invalid TIFF tag "+m.a+" count: "+r))
if(p){s=q.a
if(!(s<14))return A.a(B.B,s)
s=B.B[s]}else s=0
n=l.ac(r*s)
switch(q.a){case 1:return m.e=new A.bn(new Uint8Array(A.o(n.ac(r).a0())))
case 2:return m.e=new A.cM(r===0?"":n.ar(r-1))
case 7:return m.e=new A.bn(new Uint8Array(A.o(n.ac(r).a0())))
case 3:return m.e=A.pv(n,r)
case 4:return m.e=A.pq(n,r)
case 5:return m.e=A.pr(n,r)
case 11:return m.e=A.pw(n,r)
case 12:return m.e=A.pp(n,r)
case 6:return m.e=new A.bD(new Int8Array(A.o(J.nK(B.d.gt(n.a0()),0,r))))
case 8:return m.e=A.pu(n,r)
case 9:return m.e=A.ps(n,r)
case 10:return m.e=A.pt(n,r)
case 13:case 0:return null}}}
A.lm.prototype={
n7(a,b,c,d){var s,r,q,p=this
p.r=b
p.x=p.w=0
s=B.a.P(p.a+7,8)
for(r=0,q=0;q<d;++q){p.ed(a,r,c)
r+=s}},
ed(a,b,c){var s,r,q,p,o,n,m,l,k=this
k.d=0
for(s=k.a,r=!0;c<s;){while(r){q=k.c7(10)
if(!(q<1024))return A.a(B.b5,q)
p=B.b5[q]
o=B.a.j(p,1)&15
if(o===12){q=(q<<2&12|k.b8(2))>>>0
if(!(q<16))return A.a(B.a0,q)
p=B.a0[q]
n=B.a.j(p,1)
c+=B.a.j(p,4)&4095
k.aQ(4-(n&7))}else if(o===0)throw A.e(A.k("TIFFFaxDecoder0"))
else if(o===15)throw A.e(A.k("TIFFFaxDecoder1"))
else{c+=B.a.j(p,5)&2047
k.aQ(10-o)
if((p&1)===0){B.c.i(k.f,k.d++,c)
r=!1}}}if(c===s){if(k.z===2)if(k.w!==0){s=k.x
s.toString
k.x=s+1
k.w=0}break}while(!r){q=k.b8(4)
if(!(q<16))return A.a(B.aV,q)
p=B.aV[q]
m=p>>>5&2047
l=!0
if(m===100){q=k.c7(9)
if(!(q<512))return A.a(B.b_,q)
p=B.b_[q]
o=B.a.j(p,1)&15
m=B.a.j(p,5)&2047
if(o===12){k.aQ(5)
q=k.b8(4)
if(!(q<16))return A.a(B.a0,q)
p=B.a0[q]
n=B.a.j(p,1)
m=B.a.j(p,4)&4095
k.bl(a,b,c,m)
c+=m
k.aQ(4-(n&7))}else if(o===15)throw A.e(A.k("TIFFFaxDecoder2"))
else{k.bl(a,b,c,m)
c+=m
k.aQ(9-o)
if((p&1)===0){B.c.i(k.f,k.d++,c)
r=l}}}else{if(m===200){q=k.b8(2)
if(!(q<4))return A.a(B.aU,q)
p=B.aU[q]
m=p>>>5&2047
k.bl(a,b,c,m)
c+=m
k.aQ(2-(p>>>1&15))
B.c.i(k.f,k.d++,c)}else{k.bl(a,b,c,m)
c+=m
k.aQ(4-(p>>>1&15))
B.c.i(k.f,k.d++,c)}r=l}}if(c===s){if(k.z===2)if(k.w!==0){s=k.x
s.toString
k.x=s+1
k.w=0}break}}B.c.i(k.f,k.d++,c)},
n8(a1,a2,a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=this
a0.r=a2
a0.z=3
a0.x=a0.w=0
s=a0.a
r=B.a.P(s+7,8)
q=A.N(2,null,!1,t.I)
a0.at=a5&1
a0.as=a5>>>2&1
if(a0.h7()!==1)throw A.e(A.k("TIFFFaxDecoder3"))
a0.ed(a1,0,a3)
for(p=r,o=1;o<a4;++o){if(a0.h7()===0){n=a0.e
a0.e=a0.f
a0.f=n
a0.y=0
m=a3
l=-1
k=!0
j=0
for(;;){m.toString
if(!(m<s))break
a0.fQ(l,k,q)
i=q[0]
h=q[1]
g=a0.b8(7)
if(!(g<128))return A.a(B.b4,g)
g=B.b4[g]&255
f=g>>>3&15
e=g&7
if(f===0){if(!k){h.toString
a0.bl(a1,p,m,h-m)}a0.aQ(7-e)
m=h
l=m}else if(f===1){a0.aQ(7-e)
d=j+1
c=d+1
if(k){m+=a0.dz()
B.c.i(a0.f,j,m)
b=a0.dw()
a0.bl(a1,p,m,b)
m+=b
B.c.i(a0.f,d,m)}else{b=a0.dw()
a0.bl(a1,p,m,b)
m+=b
B.c.i(a0.f,j,m)
m+=a0.dz()
B.c.i(a0.f,d,m)}j=c
l=m}else{if(f<=8){i.toString
a=i+(f-5)
d=j+1
B.c.i(a0.f,j,a)
k=!k
if(k)a0.bl(a1,p,m,a-m)
a0.aQ(7-e)}else throw A.e(A.k("TIFFFaxDecoder4"))
m=a
j=d
l=m}}B.c.i(a0.f,j,m)
a0.d=j+1}else a0.ed(a1,p,a3)
p+=r}},
ne(a5,a6,a7,a8,a9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4=this
a4.r=a6
a4.z=4
a4.x=a4.w=0
s=a4.a
r=B.a.P(s+7,8)
q=A.N(2,null,!1,t.I)
p=a4.f
a4.d=0
a4.d=1
B.c.i(p,0,s)
B.c.i(p,a4.d++,s)
for(o=0,n=0;n<a8;++n){m=a4.e
a4.e=a4.f
a4.f=m
a4.y=0
l=a7
k=-1
j=!0
i=0
for(;;){l.toString
if(!(l<s))break
a4.fQ(k,j,q)
h=q[0]
g=q[1]
f=a4.b8(7)
if(!(f<128))return A.a(B.b4,f)
f=B.b4[f]&255
e=f>>>3&15
d=f&7
if(e===0){if(!j){g.toString
a4.bl(a5,o,l,g-l)}a4.aQ(7-d)
l=g
k=l}else if(e===1){a4.aQ(7-d)
c=i+1
b=c+1
if(j){l+=a4.dz()
B.c.i(m,i,l)
a=a4.dw()
a4.bl(a5,o,l,a)
l+=a
B.c.i(m,c,l)}else{a=a4.dw()
a4.bl(a5,o,l,a)
l+=a
B.c.i(m,i,l)
l+=a4.dz()
B.c.i(m,c,l)}i=b
k=l}else if(e<=8){h.toString
a0=h+(e-5)
c=i+1
B.c.i(m,i,a0)
j=!j
if(j)a4.bl(a5,o,l,a0-l)
a4.aQ(7-d)
l=a0
i=c
k=l}else if(e===11){if(a4.b8(3)!==7)throw A.e(A.k("TIFFFaxDecoder5"))
for(a1=0,a2=!1;!a2;j=a3){while(a4.b8(1)!==1)++a1
if(a1>5){a1-=6
if(!j&&a1>0){c=i+1
B.c.i(m,i,l)
i=c}l+=a1
if(a1>0)j=!0
a3=a4.b8(1)===0
if(a3){if(!j){c=i+1
B.c.i(m,i,l)
i=c}}else if(j){c=i+1
B.c.i(m,i,l)
i=c}j=a3
a2=!0}a3=a1===5
if(a3){if(!j){c=i+1
B.c.i(m,i,l)
i=c}l+=a1}else{l+=a1
c=i+1
B.c.i(m,i,l)
a4.bl(a5,o,l,1);++l
i=c}}}else throw A.e(A.k("TIFFFaxDecoder5 "+e))}B.c.i(m,i,l)
a4.d=i+1
o+=r}},
dz(){var s,r,q,p,o,n,m=this
for(s=0,r=!0;r;){q=m.c7(10)
if(!(q<1024))return A.a(B.b5,q)
p=B.b5[q]
o=B.a.j(p,1)&15
if(o===12){q=(q<<2&12|m.b8(2))>>>0
if(!(q<16))return A.a(B.a0,q)
p=B.a0[q]
n=B.a.j(p,1)
s+=B.a.j(p,4)&4095
m.aQ(4-(n&7))}else if(o===0)throw A.e(A.k("TIFFFaxDecoder0"))
else if(o===15)throw A.e(A.k("TIFFFaxDecoder1"))
else{s+=B.a.j(p,5)&2047
m.aQ(10-o)
if((p&1)===0)r=!1}}return s},
dw(){var s,r,q,p,o,n,m,l=this
for(s=0,r=!1;!r;){q=l.b8(4)
if(!(q<16))return A.a(B.aV,q)
p=B.aV[q]
o=p>>>5&2047
if(o===100){q=l.c7(9)
if(!(q<512))return A.a(B.b_,q)
p=B.b_[q]
n=B.a.j(p,1)&15
m=B.a.j(p,5)
if(n===12){l.aQ(5)
q=l.b8(4)
if(!(q<16))return A.a(B.a0,q)
p=B.a0[q]
m=B.a.j(p,1)
s+=B.a.j(p,4)&4095
l.aQ(4-(m&7))}else if(n===15)throw A.e(A.k("TIFFFaxDecoder2"))
else{s+=m&2047
l.aQ(9-n)
if((p&1)===0)r=!0}}else{if(o===200){q=l.b8(2)
if(!(q<4))return A.a(B.aU,q)
p=B.aU[q]
s+=p>>>5&2047
l.aQ(2-(p>>>1&15))}else{s+=o
l.aQ(4-(p>>>1&15))}r=!0}}return s},
h7(){var s,r,q=this,p="TIFFFaxDecoder8",o=q.as
if(o===0){if(q.c7(12)!==1)throw A.e(A.k("TIFFFaxDecoder6"))}else if(o===1){o=q.w
o.toString
s=8-o
if(q.c7(s)!==0)throw A.e(A.k(p))
if(s<4)if(q.c7(8)!==0)throw A.e(A.k(p))
while(r=q.c7(8),r!==1)if(r!==0)throw A.e(A.k(p))}if(q.at===0)return 1
else return q.b8(1)},
fQ(a,b,c){var s,r,q,p,o,n,m=this
t.dW.a(c)
s=m.e
r=m.d
q=m.y
p=q>0?q-1:0
p=b?(p&4294967294)>>>0:(p|1)>>>0
for(q=s.length,o=p;o<r;o+=2){if(!(o<q))return A.a(s,o)
n=s[o]
n.toString
a.toString
if(n>a){m.y=o
B.c.i(c,0,n)
break}}n=o+1
if(n<r){if(!(n<q))return A.a(s,n)
B.c.i(c,1,s[n])}},
bl(a,b,c,d){var s,r,q,p,o,n=8*b+A.r(c),m=n+d,l=B.a.j(n,3),k=n&7
if(k>0){s=B.a.U(1,7-k)
r=J.d(a.a,a.d+l)
for(;;){if(!(s>0&&n<m))break
r=(r|s)>>>0
s=s>>>1;++n}a.i(0,l,r)}l=B.a.j(n,3)
for(q=m-7;n<q;l=p){p=l+1
J.a2(a.a,a.d+l,255)
n+=8}while(n<m){l=B.a.j(n,3)
q=J.d(a.a,a.d+l)
o=B.a.U(1,7-(n&7))
J.a2(a.a,a.d+l,(q|o)>>>0);++n}},
c7(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this,e=f.r
e===$&&A.c()
s=e.d
r=e.c-s-1
q=f.x
p=f.c
o=0
n=0
if(p===1){q.toString
m=J.d(e.a,s+q)
if(!(q===r)){e=q+1
s=f.r
p=s.a
s=s.d
if(e===r)o=J.d(p,s+e)
else{o=J.d(p,s+e)
e=f.r
n=J.d(e.a,e.d+(q+2))}}}else if(p===2){q.toString
m=B.as[J.d(e.a,s+q)&255]
if(!(q===r)){e=q+1
s=f.r
p=s.a
s=s.d
if(e===r)o=B.as[J.d(p,s+e)&255]
else{o=B.as[J.d(p,s+e)&255]
e=f.r
n=B.as[J.d(e.a,e.d+(q+2))&255]}}}else throw A.e(A.k("TIFFFaxDecoder7"))
e=f.w
e.toString
l=8-e
k=a-l
if(k>8){j=k-8
i=8}else{i=k
j=0}e=f.x
e.toString
e=f.x=e+1
if(!(l>=0&&l<9))return A.a(B.N,l)
h=B.a.U(m&B.N[l],k)
if(!(i>=0))return A.a(B.aq,i)
g=B.a.a4(o&B.aq[i],8-i)
if(j!==0){g=B.a.U(g,j)
if(!(j<9))return A.a(B.aq,j)
g|=B.a.a4(n&B.aq[j],8-j)
f.x=e+1
f.w=j}else if(i===8){f.w=0
f.x=e+1}else f.w=i
return(h|g)>>>0},
b8(a){var s,r,q,p,o,n,m,l,k,j,i=this,h=i.r
h===$&&A.c()
s=h.d
r=h.c-s-1
q=i.x
p=i.c
o=0
if(p===1){q.toString
n=J.d(h.a,s+q)
if(!(q===r)){h=i.r
o=J.d(h.a,h.d+(q+1))}}else if(p===2){q.toString
n=B.as[J.d(h.a,s+q)&255]
if(!(q===r)){h=i.r
o=B.as[J.d(h.a,h.d+(q+1))&255]}}else throw A.e(A.k("TIFFFaxDecoder7"))
h=i.w
h.toString
m=8-h
l=a-m
k=m-a
if(k>=0){if(!(m>=0&&m<9))return A.a(B.N,m)
j=B.a.a4(n&B.N[m],k)
h+=a
i.w=h
if(h===8){i.w=0
h=i.x
h.toString
i.x=h+1}}else{if(!(m>=0&&m<9))return A.a(B.N,m)
j=B.a.U(n&B.N[m],-k)
if(!(l>=0&&l<9))return A.a(B.aq,l)
j=(j|B.a.a4(o&B.aq[l],8-l))>>>0
h=i.x
h.toString
i.x=h+1
i.w=l}return j},
aQ(a){var s,r=this,q=r.w
q.toString
s=q-a
if(s<0){q=r.x
q.toString
r.x=q-1
r.w=8+s}else r.w=s}}
A.iO.prototype={
jl(a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this,c=null,b=A.w(a0,c,0),a=a0.m()
for(s=d.a,r=0;r<a;++r){q=a0.m()
p=a0.m()
o=a0.k()
if(p>13){a0.d+=4
continue}n=B.dd[p]
if(o*B.B[p]>4)m=a0.k()
else{m=a0.d
a0.d=m+4}l=new A.iN(q,n,o,m,b)
s.i(0,q,l)
if(q===256){k=l.bw()
k=k==null?c:k.h(0)
d.b=k==null?0:k}else if(q===257){k=l.bw()
k=k==null?c:k.h(0)
d.c=k==null?0:k}else if(q===262){j=l.bw()
i=j==null?c:j.h(0)
if(i==null)i=17
if(i<17){if(!(i>=0))return A.a(B.d8,i)
d.d=B.d8[i]}else d.d=B.bT}else if(q===259){k=l.bw()
k=k==null?c:k.h(0)
d.e=k==null?0:k}else if(q===258){k=l.bw()
k=k==null?c:k.h(0)
d.f=k==null?0:k}else if(q===277){k=l.bw()
k=k==null?c:k.h(0)
d.r=k==null?0:k}else if(q===317){k=l.bw()
k=k==null?c:k.h(0)
d.Q=k==null?0:k}else if(q===339){k=l.bw()
j=k==null?c:k.h(0)
if(j==null)j=0
if(!(j>=0&&j<4))return A.a(B.dc,j)
d.x=B.dc[j]}else if(q===320){j=l.bw()
if(j!=null){k=J.t8(B.d.gt(j.by()))
d.id=k
d.k1=0
k=k.length/3|0
d.k2=k
d.k3=k*2}}}k=d.id
h=k!=null
if(h&&d.d===B.bU)d.r=1
if(d.b===0||d.c===0)return
if(h&&d.f===8){g=k.length
for(h=k.$flags|0,r=0;r<g;++r){f=k[r]
h&2&&A.b(k)
k[r]=f>>>8}}if(d.d===B.bS)d.z=!0
d.w=d.r
if(s.af(324)){d.ay=d.cA(322)
d.ch=d.cA(323)
d.CW=d.dI(324)
d.cx=d.dI(325)}else{d.ay=d.dH(322,d.b)
if(!s.af(278))k=d.ch=d.dH(323,d.c)
else{e=d.cA(278)
if(e===-1){k=d.c
d.ch=k}else{d.ch=e
k=e}}h=d.c
if(k>h)d.ch=h
d.CW=d.dI(273)
d.cx=d.dI(279)}k=d.b
h=d.ay
d.cy=B.a.Z(k+h-1,h)
h=d.c
k=d.ch
d.db=B.a.Z(h+k-1,k)
d.dy=d.dH(266,1)
d.fr=d.cA(292)
d.fx=d.cA(293)
d.cA(338)
switch(d.d.a){case 0:case 1:s=d.f
if(s===1&&d.r===1)d.y=B.bR
else if(s===4&&d.r===1)d.y=B.pg
else if(B.a.a1(s,8)===0){s=d.r
if(s===1)d.y=B.ph
else if(s===2)d.y=B.pi
else d.y=B.aH}break
case 2:if(B.a.a1(d.f,8)===0){s=d.r
if(s===3)d.y=B.dS
else if(s===4)d.y=B.pk
else d.y=B.aH}break
case 3:s=!1
if(d.r===1)if(d.id!=null){s=d.f
s=s===4||s===8||s===16}if(s)d.y=B.pj
break
case 4:if(d.f===1&&d.r===1)d.y=B.bR
break
case 6:if(d.e===7&&d.f===8&&d.r===3)d.y=B.dS
else{if(s.af(530)){j=s.l(0,530).bw()
d.as=j.h(0)
s=d.at=j.ag(0,1)}else s=d.at=d.as=2
k=d.as
k===$&&A.c()
if(k*s===1)d.y=B.aH
else if(d.f===8&&d.r===3)d.y=B.pl}break
case 5:if(B.a.a1(d.f,8)===0)d.y=B.aH
s=d.r
if(s===4)d.w=3
else if(s===5)d.w=4
break
default:if(B.a.a1(d.f,8)===0)d.y=B.aH
break}},
cF(a3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=this,a=null,a0=b.x,a1=a0===B.at,a2=a0===B.i
a0=b.f
if(a0===1)s=B.L
else if(a0===2)s=B.R
else{if(a0===4)a0=B.S
else if(a1&&a0===16)a0=B.T
else if(a1&&a0===32)a0=B.Y
else if(a1&&a0===64)a0=B.aa
else if(a2&&a0===8)a0=B.af
else if(a2&&a0===16)a0=B.ag
else if(a2&&a0===32)a0=B.ah
else if(a0===16)a0=B.u
else a0=a0===32?B.ab:B.e
s=a0}r=b.id!=null&&b.d===B.bU
q=r?3:b.w
a0=b.b
p=A.Z(a,a,s,0,B.l,b.c,a,0,q,a,s,a0,r)
if(r){a0=p.a
a0=a0==null?a:a0.gW()
a0.toString
o=b.id
n=o.length
m=n/3|0
l=b.k1
l===$&&A.c()
k=b.k2
k===$&&A.c()
j=b.k3
j===$&&A.c()
for(i=j,h=k,g=l,f=0;f<m;++f,++g,++h,++i){if(i>=n)break
if(!(g<n))return A.a(o,g)
l=o[g]
if(!(h<n))return A.a(o,h)
a0.bk(f,l,o[h],o[i])}}e=0
d=0
for(;;){a0=b.db
a0===$&&A.c()
if(!(e<a0))break
c=0
for(;;){a0=b.cy
a0===$&&A.c()
if(!(c<a0))break
b.ks(a3,p,c,e);++c;++d}++e}return p},
ks(b5,b6,b7,b8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3=this,b4=null
if(b3.y===B.bR){b3.kd(b5,b6,b7,b8)
return}p=b3.cy
p===$&&A.c()
o=b8*p+b7
p=b3.CW
if(!(o>=0&&o<p.length))return A.a(p,o)
b5.d=p[o]
p=b3.ay
n=b7*p
m=b3.ch
l=b8*m
k=b3.cx
if(!(o<k.length))return A.a(k,o)
s=k[o]
j=p*m*b3.r
p=b3.f
m=p===16
if(m)j*=2
else if(p===32)j*=4
r=null
if(p===8||m||p===32||p===64){p=b3.e
if(p===1)r=b5
else if(p===5){r=A.v(new Uint8Array(j),!1,b4,0)
q=A.pM()
try{q.i2(A.w(b5,s,0),r.a)}catch(i){}if(b3.Q===2)for(h=0;h<b3.ch;++h){g=b3.r
p=b3.ay
f=g*(h*p+1)
e=p*g
for(;g<e;++g){p=r
m=J.d(p.a,p.d+f)
k=r
d=b3.r
d=J.d(k.a,k.d+(f-d))
J.a2(p.a,p.d+f,m+d);++f}}}else if(p===32773){r=A.v(new Uint8Array(j),!1,b4,0)
b3.fE(b5,j,r.a)}else if(p===32946||p===8){c=b5.eX(0,0,s)
p=b3.f
b=p<8?1:B.a.j(p+7,3)
r=A.v(A.jz(c,b3.ay*b3.ch*b3.r*b),!1,b4,0)}else if(p===6||p===7){c=b5.eX(0,0,s)
a=A.pH().cF(t.D.a(c))
if(a!=null)b3.li(a,b6,n,l,b3.ay,b3.ch)
return}else throw A.e(A.k("Unsupported Compression Type: "+p))
a0=A.j([0,0,0],t.t)
for(a1=l,a2=0;a2<b3.ch;++a2,++a1)for(a3=n,a4=0;a4<b3.ay;++a4,++a3){p=r
if(p.d>=p.c||a3>=b3.b||a1>=b3.c)break
p=b3.r
if(p===1){p=b3.x
if(p===B.at){p=b3.f
if(p===32){p=r.k()
m=$.V()
m.$flags&2&&A.b(m)
m[0]=p
p=$.cE()
if(0>=p.length)return A.a(p,0)
a5=p[0]}else if(p===64)a5=r.dU()
else if(p===16){p=r.m()
m=$.O
m=m!=null?m:A.T()
if(!(p<m.length))return A.a(m,p)
a5=m[p]}else a5=0
if(a3<b3.b&&a1<b3.c){p=b6.a
if(p!=null)p.aS(a3,a1,a5)}}else{m=b3.f
if(m===8)if(p===B.i){p=r
p=J.d(p.a,p.d++)
m=$.ay()
m.$flags&2&&A.b(m)
m[0]=p
p=$.aI()
if(0>=p.length)return A.a(p,0)
a5=p[0]}else{p=r
a5=J.d(p.a,p.d++)}else if(m===16)if(p===B.i){p=r.m()
m=$.ax()
m.$flags&2&&A.b(m)
m[0]=p
p=$.aH()
if(0>=p.length)return A.a(p,0)
a5=p[0]}else a5=r.m()
else if(m===32)if(p===B.i){p=r.k()
m=$.V()
m.$flags&2&&A.b(m)
m[0]=p
p=$.ad()
if(0>=p.length)return A.a(p,0)
a5=p[0]}else a5=r.k()
else a5=0
if(b3.d===B.bS){p=b6.a
a6=p==null?b4:p.gG()
a5=(a6==null?0:a6)-a5}if(a3<b3.b&&a1<b3.c){p=b6.a
if(p!=null)p.aS(a3,a1,a5)}}}else if(p===2){p=b3.f
if(p===8){if(b3.x===B.i){p=r
p=J.d(p.a,p.d++)
m=$.ay()
m.$flags&2&&A.b(m)
m[0]=p
p=$.aI()
if(0>=p.length)return A.a(p,0)
a7=p[0]}else{p=r
a7=J.d(p.a,p.d++)}if(b3.x===B.i){p=r
p=J.d(p.a,p.d++)
m=$.ay()
m.$flags&2&&A.b(m)
m[0]=p
p=$.aI()
if(0>=p.length)return A.a(p,0)
a8=p[0]}else{p=r
a8=J.d(p.a,p.d++)}}else if(p===16){if(b3.x===B.i){p=r.m()
m=$.ax()
m.$flags&2&&A.b(m)
m[0]=p
p=$.aH()
if(0>=p.length)return A.a(p,0)
a7=p[0]}else a7=r.m()
if(b3.x===B.i){p=r.m()
m=$.ax()
m.$flags&2&&A.b(m)
m[0]=p
p=$.aH()
if(0>=p.length)return A.a(p,0)
a8=p[0]}else a8=r.m()}else if(p===32){if(b3.x===B.i){p=r.k()
m=$.V()
m.$flags&2&&A.b(m)
m[0]=p
p=$.ad()
if(0>=p.length)return A.a(p,0)
a7=p[0]}else a7=r.k()
if(b3.x===B.i){p=r.k()
m=$.V()
m.$flags&2&&A.b(m)
m[0]=p
p=$.ad()
if(0>=p.length)return A.a(p,0)
a8=p[0]}else a8=r.k()}else{a7=0
a8=0}if(a3<b3.b&&a1<b3.c){p=b6.a
if(p!=null)p.aw(a3,a1,a7,0,0,a8)}}else if(p===3){p=b3.x
if(p===B.at){p=b3.f
if(p===32){p=r.k()
m=$.V()
m.$flags&2&&A.b(m)
m[0]=p
p=$.cE()
if(0>=p.length)return A.a(p,0)
a9=p[0]
m[0]=r.k()
b0=p[0]
m[0]=r.k()
b1=p[0]}else{b0=0
b1=0
if(p===64)a9=r.dU()
else if(p===16){p=r.m()
m=$.O
m=m!=null?m:A.T()
if(!(p<m.length))return A.a(m,p)
a9=m[p]
p=r.m()
m=$.O
m=m!=null?m:A.T()
if(!(p<m.length))return A.a(m,p)
b0=m[p]
p=r.m()
m=$.O
m=m!=null?m:A.T()
if(!(p<m.length))return A.a(m,p)
b1=m[p]}else a9=0}if(a3<b3.b&&a1<b3.c){p=b6.a
if(p!=null)p.aT(a3,a1,a9,b0,b1)}}else{m=b3.f
if(m===8){if(p===B.i){p=r
p=J.d(p.a,p.d++)
m=$.ay()
m.$flags&2&&A.b(m)
m[0]=p
p=$.aI()
if(0>=p.length)return A.a(p,0)
a9=p[0]}else{p=r
a9=J.d(p.a,p.d++)}if(b3.x===B.i){p=r
p=J.d(p.a,p.d++)
m=$.ay()
m.$flags&2&&A.b(m)
m[0]=p
p=$.aI()
if(0>=p.length)return A.a(p,0)
b0=p[0]}else{p=r
b0=J.d(p.a,p.d++)}if(b3.x===B.i){p=r
p=J.d(p.a,p.d++)
m=$.ay()
m.$flags&2&&A.b(m)
m[0]=p
p=$.aI()
if(0>=p.length)return A.a(p,0)
b1=p[0]}else{p=r
b1=J.d(p.a,p.d++)}}else if(m===16){if(p===B.i){p=r.m()
m=$.ax()
m.$flags&2&&A.b(m)
m[0]=p
p=$.aH()
if(0>=p.length)return A.a(p,0)
a9=p[0]}else a9=r.m()
if(b3.x===B.i){p=r.m()
m=$.ax()
m.$flags&2&&A.b(m)
m[0]=p
p=$.aH()
if(0>=p.length)return A.a(p,0)
b0=p[0]}else b0=r.m()
if(b3.x===B.i){p=r.m()
m=$.ax()
m.$flags&2&&A.b(m)
m[0]=p
p=$.aH()
if(0>=p.length)return A.a(p,0)
b1=p[0]}else b1=r.m()}else if(m===32){if(p===B.i){p=r.k()
m=$.V()
m.$flags&2&&A.b(m)
m[0]=p
p=$.ad()
if(0>=p.length)return A.a(p,0)
a9=p[0]}else a9=r.k()
if(b3.x===B.i){p=r.k()
m=$.V()
m.$flags&2&&A.b(m)
m[0]=p
p=$.ad()
if(0>=p.length)return A.a(p,0)
b0=p[0]}else b0=r.k()
if(b3.x===B.i){p=r.k()
m=$.V()
m.$flags&2&&A.b(m)
m[0]=p
p=$.ad()
if(0>=p.length)return A.a(p,0)
b1=p[0]}else b1=r.k()}else{a9=0
b0=0
b1=0}if(a3<b3.b&&a1<b3.c){p=b6.a
if(p!=null)p.aT(a3,a1,a9,b0,b1)}}}else if(p>=4)if(b3.x===B.at){p=b3.f
if(p===32){p=r.k()
m=$.V()
m.$flags&2&&A.b(m)
m[0]=p
p=$.cE()
if(0>=p.length)return A.a(p,0)
a9=p[0]
m[0]=r.k()
b0=p[0]
m[0]=r.k()
b1=p[0]
m[0]=r.k()
b2=p[0]}else{b0=0
b1=0
b2=0
if(p===64)a9=r.dU()
else if(p===16){p=r.m()
m=$.O
m=m!=null?m:A.T()
if(!(p<m.length))return A.a(m,p)
a9=m[p]
p=r.m()
m=$.O
m=m!=null?m:A.T()
if(!(p<m.length))return A.a(m,p)
b0=m[p]
p=r.m()
m=$.O
m=m!=null?m:A.T()
if(!(p<m.length))return A.a(m,p)
b1=m[p]
p=r.m()
m=$.O
m=m!=null?m:A.T()
if(!(p<m.length))return A.a(m,p)
b2=m[p]}else a9=0}if(a3<b3.b&&a1<b3.c){p=b6.a
if(p!=null)p.aw(a3,a1,a9,b0,b1,b2)}}else{p=b6.a
a8=p==null?b4:p.gG()
if(a8==null)a8=0
p=b3.f
if(p===8){if(b3.x===B.i){p=r
p=J.d(p.a,p.d++)
m=$.ay()
m.$flags&2&&A.b(m)
m[0]=p
p=$.aI()
if(0>=p.length)return A.a(p,0)
a9=p[0]}else{p=r
a9=J.d(p.a,p.d++)}if(b3.x===B.i){p=r
p=J.d(p.a,p.d++)
m=$.ay()
m.$flags&2&&A.b(m)
m[0]=p
p=$.aI()
if(0>=p.length)return A.a(p,0)
b0=p[0]}else{p=r
b0=J.d(p.a,p.d++)}if(b3.x===B.i){p=r
p=J.d(p.a,p.d++)
m=$.ay()
m.$flags&2&&A.b(m)
m[0]=p
p=$.aI()
if(0>=p.length)return A.a(p,0)
b1=p[0]}else{p=r
b1=J.d(p.a,p.d++)}if(b3.x===B.i){p=r
p=J.d(p.a,p.d++)
m=$.ay()
m.$flags&2&&A.b(m)
m[0]=p
p=$.aI()
if(0>=p.length)return A.a(p,0)
b2=p[0]}else{p=r
b2=J.d(p.a,p.d++)}if(b3.r===5)if(b3.x===B.i){p=r
p=J.d(p.a,p.d++)
m=$.ay()
m.$flags&2&&A.b(m)
m[0]=p
p=$.aI()
if(0>=p.length)return A.a(p,0)
a8=p[0]}else{p=r
a8=J.d(p.a,p.d++)}}else if(p===16){if(b3.x===B.i){p=r.m()
m=$.ax()
m.$flags&2&&A.b(m)
m[0]=p
p=$.aH()
if(0>=p.length)return A.a(p,0)
a9=p[0]}else a9=r.m()
if(b3.x===B.i){p=r.m()
m=$.ax()
m.$flags&2&&A.b(m)
m[0]=p
p=$.aH()
if(0>=p.length)return A.a(p,0)
b0=p[0]}else b0=r.m()
if(b3.x===B.i){p=r.m()
m=$.ax()
m.$flags&2&&A.b(m)
m[0]=p
p=$.aH()
if(0>=p.length)return A.a(p,0)
b1=p[0]}else b1=r.m()
if(b3.x===B.i){p=r.m()
m=$.ax()
m.$flags&2&&A.b(m)
m[0]=p
p=$.aH()
if(0>=p.length)return A.a(p,0)
b2=p[0]}else b2=r.m()
if(b3.r===5)if(b3.x===B.i){p=r.m()
m=$.ax()
m.$flags&2&&A.b(m)
m[0]=p
p=$.aH()
if(0>=p.length)return A.a(p,0)
a8=p[0]}else a8=r.m()}else if(p===32){if(b3.x===B.i){p=r.k()
m=$.V()
m.$flags&2&&A.b(m)
m[0]=p
p=$.ad()
if(0>=p.length)return A.a(p,0)
a9=p[0]}else a9=r.k()
if(b3.x===B.i){p=r.k()
m=$.V()
m.$flags&2&&A.b(m)
m[0]=p
p=$.ad()
if(0>=p.length)return A.a(p,0)
b0=p[0]}else b0=r.k()
if(b3.x===B.i){p=r.k()
m=$.V()
m.$flags&2&&A.b(m)
m[0]=p
p=$.ad()
if(0>=p.length)return A.a(p,0)
b1=p[0]}else b1=r.k()
if(b3.x===B.i){p=r.k()
m=$.V()
m.$flags&2&&A.b(m)
m[0]=p
p=$.ad()
if(0>=p.length)return A.a(p,0)
b2=p[0]}else b2=r.k()
if(b3.r===5)if(b3.x===B.i){p=r.k()
m=$.V()
m.$flags&2&&A.b(m)
m[0]=p
p=$.ad()
if(0>=p.length)return A.a(p,0)
a8=p[0]}else a8=r.k()}else{a9=0
b0=0
b1=0
b2=0}if(b3.d===B.dT){A.r3(a9,b0,b1,b2,a0)
a9=a0[0]
b0=a0[1]
b1=a0[2]
b2=a8}if(a3<b3.b&&a1<b3.c){p=b6.a
if(p!=null)p.aw(a3,a1,a9,b0,b1,b2)}}}}else throw A.e(A.k("Unsupported bitsPerSample: "+p))},
li(a,b,c,d,e,f){var s,r,q,p
for(s=0;s<f;++s)for(r=s+d,q=0;q<e;++q){p=a.a
p=p==null?null:p.S(q,s,null)
if(p==null)p=new A.J()
b.cg(q+c,r,p)}},
kd(a5,a6,a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2=this,a3=null,a4=a2.cy
a4===$&&A.c()
r=a8*a4+a7
a4=a2.CW
if(!(r>=0&&r<a4.length))return A.a(a4,r)
a5.d=a4[r]
a4=a2.ay
q=a7*a4
p=a2.ch
o=a8*p
n=a2.cx
if(!(r<n.length))return A.a(n,r)
m=n[r]
s=null
n=a2.e
if(n===32773){l=B.a.a1(a4,8)===0?B.a.P(a4,8)*p:(B.a.P(a4,8)+1)*p
s=A.v(new Uint8Array(a4*p),!1,a3,0)
a2.fE(a5,l,s.a)}else if(n===5){s=A.v(new Uint8Array(a4*p),!1,a3,0)
A.pM().i2(A.w(a5,m,0),s.a)
if(a2.Q===2)for(k=0;k<a2.c;++k){j=a2.r
i=j*(k*a2.b+1)
for(;j<a2.b*a2.r;++j){a4=s
p=J.d(a4.a,a4.d+i)
n=s
h=a2.r
h=J.d(n.a,n.d+(i-h))
J.a2(a4.a,a4.d+i,p+h);++i}}}else if(n===2){s=A.v(new Uint8Array(a4*p),!1,a3,0)
try{A.oh(a2.dy,a2.ay,a2.ch).n7(s,a5,0,a2.ch)}catch(g){}}else if(n===3){s=A.v(new Uint8Array(a4*p),!1,a3,0)
try{A.oh(a2.dy,a2.ay,a2.ch).n8(s,a5,0,a2.ch,a2.fr)}catch(g){}}else if(n===4){s=A.v(new Uint8Array(a4*p),!1,a3,0)
try{A.oh(a2.dy,a2.ay,a2.ch).ne(s,a5,0,a2.ch,a2.fx)}catch(g){}}else if(n===8||n===32946)s=A.v(A.jz(a5.eX(0,0,m),B.a.j(a2.ay+7,3)*a2.ch),!1,a3,0)
else if(n===1)s=a5
else throw A.e(A.k("Unsupported Compression Type: "+n))
f=new A.lg(s)
e=a6.gG()
a4=a2.z
d=a4?e:0
c=a4?0:e
for(b=o,a=0;a<a2.ch;++a,++b){for(a0=q,a1=0;a1<a2.ay;++a1,++a0){a4=a6.a
p=a4==null
n=p?a3:a4.b
if(b<(n==null?0:n)){a4=p?a3:a4.a
a4=a0>=(a4==null?0:a4)}else a4=!0
if(a4)break
a4=f.aq(1)
p=a6.a
if(a4===0){if(p!=null)p.aT(a0,b,d,0,0)}else if(p!=null)p.aT(a0,b,c,0,0)}f.c=0}},
fE(a,b,c){var s,r,q,p,o,n,m,l,k,j
t.L.a(c)
for(s=J.bu(c),r=0,q=0;q<b;){p=r+1
o=J.d(a.a,a.d+r)
n=$.ay()
n.$flags&2&&A.b(n)
n[0]=o
o=$.aI()
if(0>=o.length)return A.a(o,0)
m=o[0]
if(m>=0&&m<=127)for(o=m+1,r=p,l=0;l<o;++l,q=k,r=p){k=q+1
p=r+1
s.i(c,q,J.d(a.a,a.d+r))}else{o=m<=-1&&m>=-127
r=p+1
if(o){j=J.d(a.a,a.d+p)
for(o=-m+1,l=0;l<o;++l,q=k){k=q+1
s.i(c,q,j)}}}}},
dH(a,b){var s=this.a
if(!s.af(a))return b
s=s.l(0,a).bw()
s=s==null?null:s.h(0)
return s==null?0:s},
cA(a){return this.dH(a,0)},
dI(a){var s,r=this.a
if(!r.af(a))return null
s=r.l(0,a)
r=s.bw()
r.toString
return A.pK(s.c,r.gbR(r),t.p)}}
A.da.prototype={
a8(){return"TiffFormat."+this.b}}
A.ae.prototype={
a8(){return"TiffPhotometricType."+this.b}}
A.b8.prototype={
a8(){return"TiffImageType."+this.b}}
A.db.prototype={
gb7(){return this.f.length},
$iL:1,
gJ(){return this.a},
gI(){return this.b}}
A.kI.prototype={
i2(a,b){var s,r,q,p,o,n,m,l,k=this
t.L.a(b)
k.r=b
s=J.bz(b)
k.w=0
r=t.D.a(a.a)
k.e=r
q=k.f=r.length
k.b=a.d
if(0>=q)return A.a(r,0)
if(r[0]===0){if(1>=q)return A.a(r,1)
r=r[1]===1}else r=!1
if(r)throw A.e(A.k("Invalid LZW Data"))
k.fX()
k.d=k.c=0
p=k.er()
r=k.x
o=0
for(;;){if(!(p!==257&&k.w<s))break
if(p===256){k.fX()
p=k.er()
k.as=0
if(p===257)break
J.a2(k.r,k.w++,p)
o=p}else{q=k.Q
q.toString
if(p<q){k.fS(p)
q=k.as
q===$&&A.c()
n=q-1
for(;n>=0;--n){q=k.r
m=k.w++
if(!(n<4096))return A.a(r,n)
J.a2(q,m,r[n])}q=k.as-1
if(!(q>=0&&q<4096))return A.a(r,q)
k.ff(o,r[q])}else{k.fS(o)
q=k.as
q===$&&A.c()
n=q-1
for(;n>=0;--n){q=k.r
m=k.w++
if(!(n<4096))return A.a(r,n)
J.a2(q,m,r[n])}q=k.r
m=k.w++
l=k.as-1
if(!(l>=0&&l<4096))return A.a(r,l)
J.a2(q,m,r[l])
l=k.as-1
if(!(l>=0&&l<4096))return A.a(r,l)
k.ff(o,r[l])}o=p}p=k.er()}},
ff(a,b){var s,r=this,q=r.y
q===$&&A.c()
s=r.Q
s.toString
q.$flags&2&&A.b(q)
if(!(s<4096))return A.a(q,s)
q[s]=b
q=r.z
q===$&&A.c()
q.$flags&2&&A.b(q)
q[s]=a
s=r.Q=s+1
if(s===511)r.a=10
else if(s===1023)r.a=11
else if(s===2047)r.a=12},
fS(a){var s,r,q,p,o,n,m,l=this
l.as=0
s=l.x
l.as=1
r=l.y
r===$&&A.c()
if(!(a<4096))return A.a(r,a)
q=r[a]
s.$flags&2&&A.b(s)
s[0]=q
q=l.z
q===$&&A.c()
p=q[a]
for(o=1;p!==4098;o=n){n=o+1
l.as=n
if(!(p>=0&&p<4096))return A.a(r,p)
m=r[p]
if(!(o<4096))return A.a(s,o)
s[o]=m
p=q[p]}},
er(){var s,r,q,p,o=this,n=o.b,m=o.f
m===$&&A.c()
if(n>=m)return 257
for(;s=o.d,r=o.a,s<r;n=p){if(n>=m)return 257
r=o.c
q=o.e
q===$&&A.c()
p=n+1
o.b=p
if(!(n>=0&&n<q.length))return A.a(q,n)
o.c=(r<<8>>>0)+q[n]>>>0
o.d=s+8}n=s-r
o.d=n
n=B.a.a4(o.c,n)
r-=9
if(!(r>=0&&r<4))return A.a(B.cN,r)
return n&B.cN[r]},
fX(){var s,r,q=this
q.y=new Uint8Array(4096)
s=new Uint32Array(4096)
q.z=s
B.q.V(s,0,4096,4098)
for(s=q.y,r=0;r<256;++r){s.$flags&2&&A.b(s)
s[r]=r}q.a=9
q.Q=258}}
A.lh.prototype={
aC(a){return A.Q(new A.lk(this,a),t.in)},
aJ(a){return A.Q(new A.li(this,a),t.H)},
mE(a){var s,r,q=this,p=q.a
if(p==null)return null
p=p.f
if(!(a<p.length))return A.a(p,a)
s=p[a]
p=q.d
A.aw(s.b,s.c,p,!1)
A.aw(s.ay,s.ch,p,!1)
p=q.c
p===$&&A.c()
r=s.cF(p)
p=q.b
if(p!=null)r.e=p
return r},
bd(a,b){return A.Q(new A.lj(this,a,b),t.H)},
mD(a,b){var s,r=this,q=null,p=A.v(a,!1,q,0)
r.c=p
p=r.a=r.ha(p)
if(p==null)return q
s=p.f.length
if(b>=s)throw A.e(A.a7(b,0,s-1,q,q))
return r.aJ(b)},
hb(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g=null,f=A.j([],t.fZ),e=new A.db(f),d=a.c
if(d-a.d<8)return g
q=a.m()
if(q!==18761&&q!==19789)return g
if(q===19789)a.e=!0
else a.e=!1
p=a.m()
e.d=p
if(p!==42)return g
o=a.k()
n=A.w(a,g,0)
n.d=o
s=n
p=t.p
m=A.o0(p)
l=t.e8
for(;;){if(!(o!==0&&o<d&&f.length<1024&&m.E(0,o)))break
r=null
try{k=new A.iO(A.P(p,l),B.bT,B.bQ,B.pm)
k.jl(s)
r=k
j=r
if(!(j.b!==0&&j.c!==0))break}catch(i){break}B.c.E(f,r)
j=f.length
if(j===1){if(0>=j)return A.a(f,0)
h=f[0]
e.a=h.b
if(0>=j)return A.a(f,0)
e.b=h.c}if(b)break
o=s.k()
if(o!==0)s.d=o}return f.length!==0?e:g},
ha(a){return this.hb(a,!1)}}
A.lk.prototype={
$0(){var s=this.a,r=this.b,q=A.v(r,!1,null,0)
s.c=q
q=s.ha(q)
s.a=q
if(q!=null)s.b=A.nP(A.v(r,!1,null,0))
return s.a},
$S:30}
A.li.prototype={
$0(){return this.a.mE(this.b)},
$S:1}
A.lj.prototype={
$0(){return this.a.mD(this.b,this.c)},
$S:1}
A.ll.prototype={
bM(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e="ifd0"
A.hn(a)
s=new A.bM(A.P(t.N,t.P))
if(a.e!=null)s.l(0,e).i0(a.gbe().l(0,e))
if(a.gb6())a=a.b3(B.e)
if(a.gak()===1)r=1
else r=a.gaH()?3:2
q=a.gak()
p=s.l(0,e)
p.i(0,"ImageWidth",a.gJ())
p.i(0,"ImageHeight",a.gI())
p.i(0,"BitsPerSample",a.gaU())
p.i(0,"SampleFormat",this.l2(a).a)
p.i(0,"SamplesPerPixel",a.gaH()?1:q)
p.i(0,"Compression",1)
p.i(0,"PhotometricInterpretation",r)
p.i(0,"RowsPerStrip",a.gI())
p.i(0,"PlanarConfiguration",1)
p.i(0,"TileWidth",a.gJ())
p.i(0,"TileLength",a.gI())
p.i(0,"StripByteCounts",a.gd8(0))
p.i(0,"StripOffsets",new A.cm(a.a0()))
if(a.gaH()){o=a.a
n=o==null?null:o.gW()
m=n.a
o=m*3
l=new Uint16Array(o)
for(k=0,j=0;k<3;++k)for(i=0;i<m;++i,j=h){h=j+1
g=B.b.h(n.aY(i,k))
if(!(j>=0&&j<o))return A.a(l,j)
l[j]=g<<8>>>0}p.i(0,"ColorMap",l)}f=A.ai(!1,a.gd8(0)+8192)
s.aR(f)
return J.F(B.d.gt(f.c),0,f.a)},
l2(a){var s=a.a
s=s==null?null:s.gbv()
switch((s==null?B.a9:s).a){case 0:return B.bQ
case 1:return B.i
case 2:return B.at}}}
A.lq.prototype={
d4(){var s,r=this.a,q=r.bx()
if((q&1)!==0)return!1
if((q>>>1&7)>3)return!1
if((q>>>4&1)===0)return!1
this.f.d=q>>>5
if(r.bx()!==2752925)return!1
s=this.b
s.a=r.m()
s.b=r.m()
return!0},
bZ(){var s,r,q,p,o=this,n=null
if(!o.l0())return n
s=o.b
r=s.a
o.d=A.Z(n,n,B.e,0,B.l,s.b,n,0,4,n,B.e,r,!1)
o.lb()
if(!o.lr())return n
r=s.w
if(r.length!==0){q=A.v(new A.an(r),!1,n,0)
r=o.d
r.toString
r.e=A.nP(q)}p=s.r
if(p!=null)o.d.c=new A.cj("ICC_PROFILE",B.ai,p)
return o.d},
l0(){var s,r,q,p,o=this
if(!o.d4())return!1
o.fr=A.ve()
for(s=o.dy,r=0;r<4;++r){q=new Int32Array(2)
p=new Int32Array(2)
B.c.i(s,r,new A.iX(q,p,new Int32Array(2)))}o.y=o.Q=0
s=o.b
q=s.a
o.z=q
s=s.b
o.as=s
o.at=q+15>>>4
o.ax=s+15>>>4
o.k1=0
s=o.a
q=o.f
p=q.d
p===$&&A.c()
p=A.qc(s.aO(p))
o.c=p
s.d+=q.d
p.a7(1)
o.c.a7(1)
o.lx(o.x,o.fr)
o.lq()
if(!o.lt(s))return!1
o.lv()
o.c.a7(1)
o.lu()
return!0},
lx(a,b){var s,r,q,p=this,o=p.c
o===$&&A.c()
o=o.a7(1)!==0
a.a=o
if(o){a.b=p.c.a7(1)!==0
if(p.c.a7(1)!==0){a.c=p.c.a7(1)!==0
for(o=a.d,s=0;s<4;++s){if(p.c.a7(1)!==0){r=p.c
q=r.a7(7)
r=r.a7(1)===1?-q:q}else r=0
o.$flags&2&&A.b(o)
o[s]=r}for(o=a.e,s=0;s<4;++s){if(p.c.a7(1)!==0){r=p.c
q=r.a7(6)
r=r.a7(1)===1?-q:q}else r=0
o.$flags&2&&A.b(o)
o[s]=r}}if(a.b)for(s=0;s<3;++s){o=b.a
r=p.c.a7(1)!==0?p.c.a7(8):255
o.$flags&2&&A.b(o)
o[s]=r}}else a.b=!1
return!0},
lq(){var s,r,q,p=this,o=p.w,n=p.c
n===$&&A.c()
o.a=n.a7(1)!==0
o.b=p.c.a7(6)
o.c=p.c.a7(3)
n=p.c.a7(1)!==0
o.d=n
if(n)if(p.c.a7(1)!==0){for(n=o.e,s=0;s<4;++s)if(p.c.a7(1)!==0){r=p.c
q=r.a7(6)
r=r.a7(1)===1?-q:q
n.$flags&2&&A.b(n)
n[s]=r}for(n=o.f,s=0;s<4;++s)if(p.c.a7(1)!==0){r=p.c
q=r.a7(6)
r=r.a7(1)===1?-q:q
n.$flags&2&&A.b(n)
n[s]=r}}if(o.b===0)n=0
else n=o.a?1:2
p.aV=n
return!0},
lt(a){var s,r,q,p,o,n,m,l=a.c-a.d,k=this.c
k===$&&A.c()
k=B.a.O(1,k.a7(2))
this.cy=k
s=k-1
r=s*3
if(l<r)return!1
for(k=this.db,q=0,p=0;p<s;++p,r=n){o=a.dq(3,q)
n=r+((J.d(o.a,o.d)|J.d(o.a,o.d+1)<<8|J.d(o.a,o.d+2)<<16)>>>0)
if(n>l)n=l
m=new A.fN(a.cj(n-r,r))
m.b=254
m.c=0
m.d=-8
B.c.i(k,p,m)
q+=3}B.c.i(k,s,A.qc(a.cj(l-r,a.d-a.b+r)))
return r<l},
lv(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this,e=f.c
e===$&&A.c()
s=e.a7(7)
r=f.c.a7(1)!==0?f.c.cK(4):0
q=f.c.a7(1)!==0?f.c.cK(4):0
p=f.c.a7(1)!==0?f.c.cK(4):0
o=f.c.a7(1)!==0?f.c.cK(4):0
n=f.c.a7(1)!==0?f.c.cK(4):0
m=f.x
for(e=f.dy,l=m.d,k=0;k<4;++k){if(m.a){j=l[k]
if(!m.c)j+=s}else{if(k>0){i=e[0]
if(!(k>=0&&k<4))return A.a(e,k)
e[k]=i
continue}j=s}h=e[k]
i=h.a
g=j+r
if(g<0)g=0
else if(g>127)g=127
g=B.al[g]
i.$flags&2&&A.b(i)
i[0]=g
if(j<0)g=0
else g=j>127?127:j
i[1]=B.am[g]
g=h.b
i=j+q
if(i<0)i=0
else if(i>127)i=127
i=B.al[i]
g.$flags&2&&A.b(g)
g[0]=i*2
i=j+p
if(i<0)i=0
else if(i>127)i=127
g[1]=B.am[i]*101581>>>16
if(g[1]<8)g[1]=8
i=h.c
g=j+o
if(g<0)g=0
else if(g>117)g=117
g=B.al[g]
i.$flags&2&&A.b(i)
i[0]=g
g=j+n
if(g<0)g=0
else if(g>127)g=127
i[1]=B.am[g]}},
lu(){var s,r,q,p,o,n,m=this,l=m.fr
for(s=0;s<4;++s)for(r=0;r<8;++r)for(q=0;q<3;++q)for(p=0;p<11;++p){o=m.c
o===$&&A.c()
n=o.ai(B.dq[s][r][q][p])!==0?m.c.a7(8):B.cM[s][r][q][p]
o=l.b
if(!(s<o.length))return A.a(o,s)
o=o[s]
if(!(r<o.length))return A.a(o,r)
o=o[r].a
if(!(q<o.length))return A.a(o,q)
o=o[q]
o.$flags&2&&A.b(o)
o[p]=n}o=m.c
o===$&&A.c()
o=o.a7(1)!==0
m.fx=o
if(o)m.fy=m.c.a7(8)},
lI(){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=g.aV
f.toString
if(f>0){s=g.w
for(f=s.e,r=s.f,q=g.x,p=q.e,o=0;o<4;++o){if(q.a){n=p[o]
if(!q.c){m=s.b
m.toString
n+=m}}else n=s.b
for(l=0;l<=1;++l){m=g.bO
m===$&&A.c()
if(!(o<m.length))return A.a(m,o)
k=m[o][l]
m=s.d
m===$&&A.c()
if(m){n.toString
j=n+f[0]
if(l!==0)j+=r[0]}else j=n
j.toString
if(j<0)j=0
else if(j>63)j=63
if(j>0){m=s.c
m===$&&A.c()
if(m>0){i=m>4?B.a.j(j,2):B.a.j(j,1)
h=9-m
if(i>h)i=h}else i=j
if(i<1)i=1
k.b=i
k.a=2*j+i
if(j>=40)m=2
else m=j>=15?1:0
k.d=m}else k.a=0
k.c=l!==0}}}},
lb(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this,e=null,d=f.b,c=d.at
if(c!=null)f.c_=c
c=t.jz
s=J.aa(4,c)
for(r=t.by,q=0;q<4;++q)s[q]=A.j([new A.c1(),new A.c1()],r)
f.bO=t.mL.a(s)
r=f.at
r.toString
s=J.aa(r,t.ij)
for(p=0;p<r;++p){o=new Uint8Array(16)
n=new Uint8Array(8)
s[p]=new A.fW(o,n,new Uint8Array(8))}f.k2=t.f4.a(s)
f.ok=new Uint8Array(832)
r=f.at
r.toString
f.go=new Uint8Array(4*r)
o=f.p4=16*r
r=8*r
f.R8=r
n=f.aV
n.toString
if(!(n<3))return A.a(B.ak,n)
m=B.ak[n]
l=m*o
k=(m/2|0)*r
f.p1=A.v(new Uint8Array(16*o+l),!1,e,l)
r=f.R8
r.toString
f.p2=A.v(new Uint8Array(8*r+k),!1,e,k)
r=f.R8
r.toString
f.p3=A.v(new Uint8Array(8*r+k),!1,e,k)
r=d.a
f.RG=A.v(new Uint8Array(r),!1,e,0)
j=d.a+1>>>1
f.rx=A.v(new Uint8Array(j),!1,e,0)
f.ry=A.v(new Uint8Array(j),!1,e,0)
d=f.aV
d.toString
if(!(d<3))return A.a(B.ak,d)
i=B.ak[d]
if(d===2)f.ch=f.ay=0
else{d=B.a.P(f.y-i,16)
f.ay=d
r=B.a.P(f.Q-i,16)
f.ch=r
if(d<0)f.ay=0
if(r<0)f.ch=0}d=B.a.P(f.as+15+i,16)
f.cx=d
r=B.a.P(f.z+15+i,16)
f.CW=r
o=f.at
o.toString
if(r>o)f.CW=o
r=f.ax
r.toString
if(d>r)f.cx=r
h=o+1
s=J.aa(h,t.f_)
for(p=0;p<h;++p)s[p]=new A.fT()
f.k3=t.jt.a(s)
d=f.at
d.toString
s=J.aa(d,t.h2)
for(p=0;p<d;++p){r=new Int16Array(384)
s[p]=new A.fU(r,new Uint8Array(16))}f.bN=t.as.a(s)
d=f.at
d.toString
s=J.aa(d,t.nC)
for(p=0;p<d;++p)s[p]=new A.c1()
f.k4=c.a(s)
f.lI()
d=$.oV()
c=$.oW()
r=$.oX()
o=$.oY()
n=$.nG()
g=new Int32Array(16)
A.uC()
f.e=new A.ly(d,c,r,o,n,g)
return!0},
lr(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=this
e.y2=0
s=e.id
r=e.x
q=e.db
p=0
for(;;){o=e.cx
o.toString
if(!(p<o))break
o=e.cy
o===$&&A.c()
o=(p&o-1)>>>0
if(!(o>=0&&o<8))return A.a(q,o)
n=q[o]
for(;;){p=e.y1
o=e.at
o.toString
if(!(p<o))break
o=e.k3
o===$&&A.c()
m=o.length
if(0>=m)return A.a(o,0)
l=o[0]
k=1+p
if(!(k<m))return A.a(o,k)
j=o[k]
k=e.bN
k===$&&A.c()
if(!(p<k.length))return A.a(k,p)
i=k[p]
if(r.b){p=e.c
p===$&&A.c()
p=p.ai(e.fr.a[0])
o=e.c
m=e.fr
e.k1=p===0?o.ai(m.a[1]):2+o.ai(m.a[2])}p=e.fx
p===$&&A.c()
if(p){p=e.c
p===$&&A.c()
o=e.fy
o===$&&A.c()
h=p.ai(o)!==0}else h=!1
e.ls()
if(!h)h=e.lw(j,n)
else{l.a=j.a=0
p=i.b
p===$&&A.c()
if(!p)l.b=j.b=0
i.f=i.e=0}p=e.aV
p.toString
if(p>0){p=e.bO
p===$&&A.c()
o=e.k1
o===$&&A.c()
if(!(o<p.length))return A.a(p,o)
o=p[o]
p=i.b
p===$&&A.c()
g=o[p?1:0]
o=e.k4
o===$&&A.c()
m=e.y1
if(!(m<o.length))return A.a(o,m)
m=o[m]
m.a=g.a
m.b=g.b
m.d=g.d
m.c=g.c||!h}++e.y1}p=e.k3
p===$&&A.c()
if(0>=p.length)return A.a(p,0)
p=p[0]
p.b=p.a=0
B.d.V(s,0,4,0)
e.y1=0
e.mf()
p=e.aV
p.toString
f=!1
if(p>0){p=e.y2
o=e.ch
o===$&&A.c()
if(p>=o){o=e.cx
o.toString
o=p<=o
f=o}}if(!e.kU(f))return!1
p=++e.y2}return!0},
mf(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9=this,b0=null,b1=a9.y2,b2=a9.ok
b2===$&&A.c()
s=A.v(b2,!1,b0,40)
r=A.v(b2,!1,b0,584)
q=A.v(b2,!1,b0,600)
p=a9.p1
p===$&&A.c()
o=t.D
n=o.a(p.a)
p=a9.p2
p===$&&A.c()
m=o.a(p.a)
p=a9.p3
p===$&&A.c()
l=o.a(p.a)
p=a9.p4
p.toString
o=a9.R8
o.toString
k=b1>0
j=b2.$flags|0
i=0
for(;;){h=a9.at
h.toString
if(!(i<h))break
h=a9.bN
h===$&&A.c()
if(!(i<h.length))return A.a(h,i)
g=h[i]
if(i>0){for(f=-1;f<16;++f){h=40+f*32
A.aD(b2,h-4,b2,h+12,4)}for(f=-1;f<8;++f){h=f*32
e=584+h
A.aD(b2,e-4,b2,e+4,4)
h=600+h
A.aD(b2,h-4,b2,h+4,4)}}else{for(f=0;f<16;++f){h=40+f*32-1
j&2&&A.b(b2)
if(!(h<832))return A.a(b2,h)
b2[h]=129}for(f=0;f<8;++f){h=f*32
e=584+h-1
j&2&&A.b(b2)
if(!(e<832))return A.a(b2,e)
b2[e]=129
h=600+h-1
if(!(h<832))return A.a(b2,h)
b2[h]=129}if(k){j&2&&A.b(b2)
b2[567]=129
b2[551]=129
b2[7]=129}}h=a9.k2
h===$&&A.c()
if(!(i<h.length))return A.a(h,i)
d=h[i]
c=g.a
b=g.e
if(k){A.aD(b2,8,d.a,0,16)
A.aD(b2,552,d.b,0,8)
A.aD(b2,568,d.c,0,8)}else if(i===0){B.d.V(b2,7,28,127)
B.d.V(b2,551,560,127)
B.d.V(b2,567,576,127)}h=g.b
h===$&&A.c()
if(h){if(k){h=a9.at
h.toString
if(i>=h-1)B.d.V(b2,24,28,d.a[15])
else{h=a9.k2
e=i+1
if(!(e<h.length))return A.a(h,e)
A.aD(b2,24,h[e].a,0,4)}}A.aD(b2,152,b2,24,4)
A.aD(b2,280,b2,24,4)
A.aD(b2,408,b2,24,4)
for(h=g.c,a=0;a<16;++a,b=b<<2>>>0){a0=A.w(s,b0,B.p[a])
e=h[a]
if(!(e<10))return A.a(B.dj,e)
B.dj[e].$1(a0)
b.toString
e=a*16
a9.fH(b,new A.ar(c,e,Math.min(384,384),e,!1),a0)}}else{h=A.qf(i,b1,g.c[0])
h.toString
if(!(h<7))return A.a(B.dy,h)
B.dy[h].$1(s)
if(b!==0)for(a=0;a<16;++a,b=b<<2>>>0){a0=A.w(s,b0,B.p[a])
b.toString
h=a*16
a9.fH(b,new A.ar(c,h,Math.min(384,384),h,!1),a0)}}h=g.f
h===$&&A.c()
e=A.qf(i,b1,g.d)
e.toString
if(!(e<7))return A.a(B.bG,e)
B.bG[e].$1(r)
B.bG[e].$1(q)
e=Math.min(384,384)
a1=new A.ar(c,256,e,256,!1)
if((h&255)!==0){a2=a9.e
if((h&170)!==0){a2===$&&A.c()
a2.bS(a1,r)
a2.bS(A.w(a1,b0,16),A.w(r,b0,4))
a3=A.w(a1,b0,32)
a4=A.w(r,b0,128)
a2.bS(a3,a4)
a2.bS(A.w(a3,b0,16),A.w(a4,b0,4))}else{a2===$&&A.c()
a2.iz(a1,r)}}a5=new A.ar(c,320,e,320,!1)
h=h>>>8
if((h&255)!==0){e=a9.e
if((h&170)!==0){e===$&&A.c()
e.bS(a5,q)
e.bS(A.w(a5,b0,16),A.w(q,b0,4))
h=A.w(a5,b0,32)
a2=A.w(q,b0,128)
e.bS(h,a2)
e.bS(A.w(h,b0,16),A.w(a2,b0,4))}else{e===$&&A.c()
e.iz(a5,q)}}h=a9.ax
h.toString
if(b1<h-1){A.aD(d.a,0,b2,520,16)
A.aD(d.b,0,b2,808,8)
A.aD(d.c,0,b2,824,8)}a6=a9.p1.d+i*16
h=i*8
a7=a9.p2.d+h
a8=a9.p3.d+h
for(f=0;f<16;++f)A.aD(n,a6+f*p,b2,40+f*32,16)
for(f=0;f<8;++f){h=f*o
e=f*32
A.aD(m,a7+h,b2,584+e,8)
A.aD(l,a8+h,b2,600+e,8)}++i}},
fH(a,b,c){var s,r,q,p,o,n
switch(a>>>30){case 3:s=this.e
s===$&&A.c()
s.o_(b,c,!1)
break
case 2:this.e===$&&A.c()
r=J.d(b.a,b.d)+4
q=A.lA(J.d(b.a,b.d+4),35468)
p=A.lA(J.d(b.a,b.d+4),85627)
o=A.lA(J.d(b.a,b.d+1),35468)
n=A.lA(J.d(b.a,b.d+1),85627)
A.lC(c,0,r+p,n,o)
A.lC(c,1,r+q,n,o)
A.lC(c,2,r-q,n,o)
A.lC(c,3,r-p,n,o)
break
case 1:s=this.e
s===$&&A.c()
s.de(b,c)
break
default:break}},
kD(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=this,d=e.p4
d.toString
s=e.k4
s===$&&A.c()
if(!(a>=0&&a<s.length))return A.a(s,a)
r=s[a]
s=e.p1
s===$&&A.c()
q=t.D
p=q.a(s.a)
o=s.d+a*16
n=r.a
if(n===0)return
if(e.aV===1){if(a>0){s=e.e
s===$&&A.c()
s.f4(p,o,d,n+4)}if(r.c){s=e.e
s===$&&A.c()
s.iX(p,o,d,n)}if(b>0){s=e.e
s===$&&A.c()
s.f5(p,o,d,n+4)}if(r.c){s=e.e
s===$&&A.c()
s.iY(p,o,d,n)}}else{m=r.b
s=e.R8
s.toString
l=e.p2
l===$&&A.c()
k=q.a(l.a)
j=a*8
i=l.d+j
l=e.p3
l===$&&A.c()
h=q.a(l.a)
g=l.d+j
f=r.d
if(a>0){q=e.e
q===$&&A.c()
l=n+4
q.cw(p,o,1,d,16,l,m,f)
q.cw(k,i,1,s,8,l,m,f)
q.cw(h,g,1,s,8,l,m,f)}if(r.c){q=e.e
q===$&&A.c()
q.np(p,o,d,n,m,f)
q.cv(k,i+4,1,s,8,n,m,f)
q.cv(h,g+4,1,s,8,n,m,f)}if(b>0){q=e.e
q===$&&A.c()
l=n+4
q.cw(p,o,d,1,16,l,m,f)
q.cw(k,i,s,1,8,l,m,f)
q.cw(h,g,s,1,8,l,m,f)}if(r.c){q=e.e
q===$&&A.c()
q.o4(p,o,d,n,m,f)
d=4*s
q.cv(k,i+d,s,1,8,n,m,f)
q.cv(h,g+d,s,1,8,n,m,f)}}},
kT(){var s,r=this,q=r.ay
q===$&&A.c()
s=q
for(;;){q=r.CW
q.toString
if(!(s<q))break
r.kD(s,r.y2);++s}},
kU(a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=this,a0=null,a1=a.aV
a1.toString
if(!(a1<3))return A.a(B.ak,a1)
s=B.ak[a1]
a1=a.p4
a1.toString
r=s*a1
a1=a.R8
a1.toString
q=(s/2|0)*a1
a1=a.p1
a1===$&&A.c()
p=-r
o=A.w(a1,a0,p)
a1=a.p2
a1===$&&A.c()
n=-q
m=A.w(a1,a0,n)
a1=a.p3
a1===$&&A.c()
l=A.w(a1,a0,n)
k=a.y2
a1=a.cx
a1.toString
j=k*16
i=(k+1)*16
if(a2)a.kT()
if(k!==0){j-=s
a.to=A.w(o,a0,0)
a.x1=A.w(m,a0,0)
a.x2=A.w(l,a0,0)}else{a.to=A.w(a.p1,a0,0)
a.x1=A.w(a.p2,a0,0)
a.x2=A.w(a.p3,a0,0)}a1=k<a1-1
if(a1)i-=s
h=a.as
if(i>h)i=h
a.xr=null
if(a.c_!=null&&j<i){g=a.xr=a.kt(j,i-j)
if(g==null)return!1}else g=a0
f=a.Q
if(j<f){e=f-j
d=a.to
d===$&&A.c()
c=d.d
b=a.p4
b.toString
d.d=c+b*e
b=a.x1
b===$&&A.c()
c=b.d
d=a.R8
d.toString
d*=B.a.j(e,1)
b.d=c+d
c=a.x2
c===$&&A.c()
c.d+=d
if(g!=null)g.d=g.d+a.b.a*e
j=f}if(j<i){d=a.to
d===$&&A.c()
c=d.d
b=a.y
d.d=c+b
c=a.x1
c===$&&A.c()
d=b>>>1
c.d=c.d+d
c=a.x2
c===$&&A.c()
c.d+=d
if(g!=null)g.d+=b
a.lO(j-f,a.z-b,i-j)}if(a1){a1=a.p1
g=a.p4
g.toString
a1.cI(p,r,o,16*g)
g=a.p2
p=a.R8
p.toString
g.cI(n,q,m,8*p)
p=a.p3
g=a.R8
g.toString
p.cI(n,q,l,8*g)}return!0},
lO(a,b,c){if(b<=0||c<=0)return!1
this.kF(a,b,c)
this.kE(a,b,c)
return!0},
e7(a){var s
if((a&-4194304)>>>0===0)s=B.a.j(a,14)
else s=a<0?0:255
return s},
c9(a,b,c,d,e){var s,r,q,p
t.D.a(d)
s=19077*a
r=this.e7(s+26149*c+-3644112)
d.$flags&2&&A.b(d)
q=d.length
if(!(e>=0&&e<q))return A.a(d,e)
d[e]=r
r=e+1
p=this.e7(s-6419*b-13320*c+2229552)
if(!(r<q))return A.a(d,r)
d[r]=p
p=e+2
s=this.e7(s+33050*b+-4527440)
if(!(p<q))return A.a(d,p)
d[p]=s
s=e+3
if(!(s<q))return A.a(d,s)
d[s]=255},
dM(c2,c3,c4,c5,c6,c7,c8,c9,d0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4=this,a5=null,a6=t.D,a7=a6.a(c2.a),a8=c2.d,a9=a6.a(c4.a),b0=c4.d,b1=a6.a(c5.a),b2=c5.d,b3=a6.a(c6.a),b4=c6.d,b5=a6.a(c7.a),b6=c7.d,b7=a6.a(c8.a),b8=c8.d,b9=c3==null,c0=b9?a5:a6.a(c3.a),c1=b9?a5:c3.d
if(c1==null)c1=0
b9=c9==null
s=b9?a5:a6.a(c9.a)
r=b9?a5:c9.d
if(r==null)r=0
a6=d0-1
q=B.a.j(a6,1)
b9=a9.length
if(!(b0>=0&&b0<b9))return A.a(a9,b0)
p=a9[b0]
o=b1.length
if(!(b2>=0&&b2<o))return A.a(b1,b2)
n=(p|b1[b2]<<16)>>>0
p=b3.length
if(!(b4>=0&&b4<p))return A.a(b3,b4)
m=b3[b4]
l=b5.length
if(!(b6>=0&&b6<l))return A.a(b5,b6)
k=(m|b5[b6]<<16)>>>0
j=3*n+k+131074>>>2
m=a7.length
if(!(a8>=0&&a8<m))return A.a(a7,a8)
a4.c9(a7[a8],j&255,j>>>16,b7,b8)
i=c0!=null
if(i){j=3*k+n+131074>>>2
if(!(c1>=0&&c1<c0.length))return A.a(c0,c1)
h=c0[c1]
s.toString
a4.c9(h,j&255,j>>>16,s,r)}for(g=1;g<=q;++g,k=d,n=e){h=b0+g
if(!(h<b9))return A.a(a9,h)
h=a9[h]
f=b2+g
if(!(f<o))return A.a(b1,f)
e=(h|b1[f]<<16)>>>0
f=b4+g
if(!(f<p))return A.a(b3,f)
f=b3[f]
h=b6+g
if(!(h<l))return A.a(b5,h)
d=(f|b5[h]<<16)>>>0
c=n+e+k+d+524296
b=c+2*(e+k)>>>3
a=c+2*(n+d)>>>3
j=b+n>>>1
a0=a+e>>>1
h=2*g
f=a8+h
a1=f-1
if(!(a1>=0&&a1<m))return A.a(a7,a1)
a2=(h-1)*4
a4.c9(a7[a1],j&255,j>>>16,b7,b8+a2)
if(!(f<m))return A.a(a7,f)
a1=h*4
a4.c9(a7[f],a0&255,a0>>>16,b7,b8+a1)
if(i){j=a+k>>>1
a0=b+d>>>1
h=c1+h
f=h-1
a3=c0.length
if(!(f>=0&&f<a3))return A.a(c0,f)
f=c0[f]
s.toString
a4.c9(f,j&255,j>>>16,s,r+a2)
if(!(h>=0&&h<a3))return A.a(c0,h)
a4.c9(c0[h],a0&255,a0>>>16,s,r+a1)}}if((d0&1)===0){j=3*n+k+131074>>>2
b9=a8+d0-1
if(!(b9>=0&&b9<m))return A.a(a7,b9)
a6*=4
a4.c9(a7[b9],j&255,j>>>16,b7,b8+a6)
if(i){j=3*k+n+131074>>>2
b9=c1+d0-1
if(!(b9>=0&&b9<c0.length))return A.a(c0,b9)
b9=c0[b9]
s.toString
a4.c9(b9,j&255,j>>>16,s,r+a6)}}},
kE(a,b,c){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=g.xr
if(f==null)return
s=t.D.a(f.a)
r=f.d
if(a===0){q=c-1
p=a}else{p=a-1
r-=g.b.a
q=c}f=g.Q
o=g.as
if(f+a+c===o)q=o-f-p
n=g.d.a0()
m=g.d.gJ()*4
for(f=g.b.a,o=s.length,l=n.$flags|0,k=0;k<q;++k){j=(k+p)*m+3
for(i=0;i<b;++i,j+=4){h=r+i
if(!(h>=0&&h<o))return A.a(s,h)
h=s[h]
l&2&&A.b(n)
if(!(j>=0&&j<n.length))return A.a(n,j)
n[j]=h}r+=f}},
kF(a,b,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=null,e=g.b,d=A.v(J.F(g.d.gt(0),0,null),!1,f,a*e.a*4),c=g.to
c===$&&A.c()
s=A.w(c,f,0)
c=g.x1
c===$&&A.c()
r=A.w(c,f,0)
c=g.x2
c===$&&A.c()
q=A.w(c,f,0)
p=a+a0
o=B.a.j(b+1,1)
n=e.a*4
e=g.rx
e===$&&A.c()
m=A.w(e,f,0)
e=g.ry
e===$&&A.c()
l=A.w(e,f,0)
if(a===0){g.dM(s,f,r,q,r,q,d,f,b)
k=a0}else{e=g.RG
e===$&&A.c()
g.dM(e,s,m,l,r,q,A.w(d,f,-n),d,b)
k=a0+1}m.st(0,r.a)
l.st(0,q.a)
for(e=2*n,c=-n,j=a;j+=2,j<p;){m.d=r.d
l.d=q.d
i=r.d
h=g.R8
h.toString
r.d=i+h
q.d+=h
d.d+=e
h=s.d
i=g.p4
i.toString
s.d=h+2*i
g.dM(A.w(s,f,-i),s,m,l,r,q,A.w(d,f,c),d,b)}e=s.d
c=g.p4
c.toString
s.d=e+c
if(g.Q+p<g.as){e=g.RG
e===$&&A.c()
e.dS(0,b,s)
g.rx.dS(0,o,r)
g.ry.dS(0,o,q);--k}else if((p&1)===0)g.dM(s,f,r,q,r,q,A.w(d,f,n),f,b)
return k},
kt(a,b){var s,r,q,p,o,n,m,l,k,j=this,i=j.b,h=i.a,g=i.b
if(a<0||b<=0||a+b>g)return null
if(a===0){i=h*g
j.aZ=new Uint8Array(i)
s=j.c_
r=new A.lW(s,h,g)
q=s.H()
p=r.d=q&3
r.e=B.a.j(q,2)&3
r.f=B.a.j(q,4)&3
r.r=B.a.j(q,6)&3
if(r.gib())if(p===0){if(s.c-s.d<i)r.r=1}else if(p===1){o=new A.c4(B.aI,A.j([],t.J))
o.a=h
o.b=g
i=A.j([],t.nK)
p=A.j([],t.ip)
n=new Uint32Array(2)
m=new A.iT(s,n)
n=m.e=J.F(B.q.gt(n),0,null)
l=s.H()
n.$flags&2&&A.b(n)
if(0>=n.length)return A.a(n,0)
n[0]=l
l=s.H()
n.$flags&2&&A.b(n)
if(1>=n.length)return A.a(n,1)
n[1]=l
l=s.H()
n.$flags&2&&A.b(n)
if(2>=n.length)return A.a(n,2)
n[2]=l
l=s.H()
n.$flags&2&&A.b(n)
if(3>=n.length)return A.a(n,3)
n[3]=l
l=s.H()
n.$flags&2&&A.b(n)
if(4>=n.length)return A.a(n,4)
n[4]=l
l=s.H()
n.$flags&2&&A.b(n)
if(5>=n.length)return A.a(n,5)
n[5]=l
l=s.H()
n.$flags&2&&A.b(n)
if(6>=n.length)return A.a(n,6)
n[6]=l
s=s.H()
n.$flags&2&&A.b(n)
if(7>=n.length)return A.a(n,7)
n[7]=s
m.b=!1
p=new A.i5(m,o,i,p)
p.dy=h
p.fr=g
r.x=p
p.cP(h,g,!0)
i=r.x
s=i.ch
p=s.length
if(p===1){if(0>=p)return A.a(s,0)
i=s[0].a===B.dV&&i.lh()}else i=!1
if(i){r.y=!0
i=r.x
s=i.c
k=s.a*s.b
i.db=0
s=B.a.a1(k,4)
s=new Uint8Array(k+(4-s))
i.cy=s
i.cx=J.az(B.d.gt(s),0,null)}else{r.y=!1
r.x.fh(h)}}else r.r=1
j.co=r}i=j.co
if(i!=null)if(!i.w){s=j.aZ
s===$&&A.c()
if(!i.n6(a,b,s))return null}i=j.aZ
i===$&&A.c()
return A.v(i,!1,null,a*h)},
lw(a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2=this,a3=a2.fr.b,a4=a2.dy,a5=a2.k1
a5===$&&A.c()
if(!(a5<4))return A.a(a4,a5)
s=a4[a5]
a5=a2.bN
a5===$&&A.c()
a4=a2.y1
if(!(a4<a5.length))return A.a(a5,a4)
r=a5[a4]
q=A.v(r.a,!1,null,0)
a4=a2.k3
a4===$&&A.c()
if(0>=a4.length)return A.a(a4,0)
p=a4[0]
q.nF(0,q.c-q.d,0)
a4=r.b
a4===$&&A.c()
if(!a4){o=A.v(new Int16Array(16),!1,null,0)
a4=a6.b
a5=p.b
if(1>=a3.length)return A.a(a3,1)
n=a2.ep(a7,a3[1],a4+a5,s.b,0,o)
a6.b=p.b=n>0?1:0
if(n>1)a2.mF(o,q)
else{m=B.a.j(J.d(o.a,o.d)+3,3)
for(l=0;l<256;l+=16)J.a2(q.a,q.d+l,m)}k=a3[0]
j=1}else{if(3>=a3.length)return A.a(a3,3)
k=a3[3]
j=0}i=a6.a&15
h=p.a&15
for(g=0,f=0;f<4;++f){e=h&1
for(d=0,c=0;c<4;++c){n=a2.ep(a7,k,e+(i&1),s.a,j,q)
e=n>j?1:0
i=i>>>1|e<<7
a4=J.d(q.a,q.d)!==0?1:0
if(n>3)a4=3
else if(n>1)a4=2
d=d<<2|a4
q.d+=16}i=i>>>4
h=h>>>1|e<<7
g=(g<<8|d)>>>0}b=h>>>4
for(a4=a3.length,a=i,a0=0,a1=0;a1<4;a1+=2){a5=4+a1
i=B.a.a6(a6.a,a5)
h=B.a.a6(p.a,a5)
for(d=0,f=0;f<2;++f){e=h&1
for(c=0;c<2;++c){if(2>=a4)return A.a(a3,2)
n=a2.ep(a7,a3[2],e+(i&1),s.c,0,q)
e=n>0?1:0
i=i>>>1|e<<3
a5=J.d(q.a,q.d)!==0?1:0
if(n>3)a5=3
else if(n>1)a5=2
d=(d<<2|a5)>>>0
q.d+=16}i=i>>>2
h=h>>>1|e<<5}a0=(a0|B.a.O(d,4*a1))>>>0
a=(a|B.a.O(i<<4>>>0,a1))>>>0
b=(b|B.a.O(h&240,a1))>>>0}a6.a=a
p.a=b
r.e=g
r.f=a0
if((a0&43690)===0)s.toString
return(g|a0)>>>0===0},
mF(a,b){var s,r,q,p,o,n,m,l,k,j,i=new Int32Array(16)
for(s=0;s<4;++s){r=12+s
q=J.d(a.a,a.d+s)+J.d(a.a,a.d+r)
p=4+s
o=8+s
n=J.d(a.a,a.d+p)+J.d(a.a,a.d+o)
m=J.d(a.a,a.d+p)-J.d(a.a,a.d+o)
l=J.d(a.a,a.d+s)-J.d(a.a,a.d+r)
if(!(s<16))return A.a(i,s)
i[s]=q+n
if(!(o<16))return A.a(i,o)
i[o]=q-n
i[p]=l+m
if(!(r<16))return A.a(i,r)
i[r]=l-m}for(k=0,s=0;s<4;++s){r=s*4
if(!(r<16))return A.a(i,r)
j=i[r]+3
p=3+r
if(!(p<16))return A.a(i,p)
p=i[p]
q=j+p
o=1+r
if(!(o<16))return A.a(i,o)
o=i[o]
r=2+r
if(!(r<16))return A.a(i,r)
r=i[r]
n=o+r
m=o-r
l=j-p
p=B.a.j(q+n,3)
J.a2(b.a,b.d+k,p)
p=B.a.j(l+m,3)
J.a2(b.a,b.d+(k+16),p)
p=B.a.j(q-n,3)
J.a2(b.a,b.d+(k+32),p)
p=B.a.j(l-m,3)
J.a2(b.a,b.d+(k+48),p)
k+=64}},
l1(a,b){var s,r,q,p,o,n,m
t.L.a(b)
if(a.ai(b[3])===0)s=a.ai(b[4])===0?2:3+a.ai(b[5])
else if(a.ai(b[6])===0)s=a.ai(b[7])===0?5+a.ai(159):7+2*a.ai(165)+a.ai(145)
else{r=a.ai(b[8])
q=9+r
if(!(q<11))return A.a(b,q)
p=2*r+a.ai(b[q])
if(!(p<4))return A.a(B.cS,p)
o=B.cS[p]
n=o.length
for(s=0,m=0;m<n;++m)s+=s+a.ai(o[m])
s+=3+B.a.O(8,p)}return s},
ep(a,b,c,d,e,f){var s,r,q,p,o,n,m,l,k,j
t.ac.a(b)
t.L.a(d)
s=b.length
if(!(e<s))return A.a(b,e)
r=b[e].a
if(!(c<r.length))return A.a(r,c)
q=r[c]
for(;e<16;e=p){if(a.ai(q[0])===0)return e
while(a.ai(q[1])===0){++e
if(!(e>=0&&e<17))return A.a(B.K,e)
r=B.K[e]
if(!(r<s))return A.a(b,r)
r=b[r].a
if(0>=r.length)return A.a(r,0)
q=r[0]
if(e===16)return 16}p=e+1
if(!(p>=0&&p<17))return A.a(B.K,p)
r=B.K[p]
if(!(r<s))return A.a(b,r)
o=b[r].a
r=o.length
if(a.ai(q[2])===0){if(1>=r)return A.a(o,1)
q=o[1]
n=1}else{n=this.l1(a,q)
if(2>=r)return A.a(o,2)
q=o[2]}if(!(e>=0&&e<16))return A.a(B.ao,e)
r=B.ao[e]
m=a.b
m===$&&A.c()
l=a.fm(B.a.j(m,1))
m=a.b
if(m>>>0!==m||m>=128)return A.a(B.aE,m)
k=B.aE[m]
a.b=B.bH[m]
m=a.d
m===$&&A.c()
a.d=m-k
m=l!==0?-n:n
j=d[e>0?1:0]
J.a2(f.a,f.d+r,m*j)}return 16},
ls(){var s,r,q,p,o,n,m,l,k,j,i=this,h=i.y1,g=4*h,f=i.go,e=i.id,d=i.bN
d===$&&A.c()
if(!(h<d.length))return A.a(d,h)
s=d[h]
h=i.c
h===$&&A.c()
h=h.ai(145)===0
s.b=h
if(!h){if(i.c.ai(156)!==0)r=i.c.ai(128)!==0?1:3
else r=i.c.ai(163)!==0?2:0
h=s.c
h.$flags&2&&A.b(h)
h[0]=r
f.toString
B.d.V(f,g,g+4,r)
B.d.V(e,0,4,r)}else{q=s.c
for(p=0,o=0;o<4;++o,p=j){r=e[o]
for(n=0;n<4;++n){h=g+n
if(!(h<f.length))return A.a(f,h)
d=f[h]
if(!(d<10))return A.a(B.b3,d)
d=B.b3[d]
if(!(r>=0&&r<10))return A.a(d,r)
m=d[r]
l=i.c.ai(m[0])
if(!(l<18))return A.a(B.b2,l)
k=B.b2[l]
while(k>0){d=i.c
if(!(k<9))return A.a(m,k)
d=2*k+d.ai(m[k])
if(!(d>=0&&d<18))return A.a(B.b2,d)
k=B.b2[d]}r=-k
f.$flags&2&&A.b(f)
f[h]=r}j=p+4
f.toString
B.d.a3(q,p,j,f,g)
e.$flags&2&&A.b(e)
if(!(o<4))return A.a(e,o)
e[o]=r}}if(i.c.ai(142)===0)h=0
else if(i.c.ai(114)===0)h=2
else h=i.c.ai(183)!==0?1:3
s.d=h}}
A.fN.prototype={
a7(a){var s,r
for(s=0;r=a-1,a>0;a=r)s=(s|B.a.U(this.ai(128),r))>>>0
return s},
cK(a){var s=this.a7(a)
return this.a7(1)===1?-s:s},
ai(a){var s,r=this,q=r.b
q===$&&A.c()
s=r.fm(B.a.j(q*a,8))
if(r.b<=126)r.mr()
return s},
fm(a){var s,r,q,p,o,n=this,m=n.d
m===$&&A.c()
if(m<0){s=n.a
r=s.c
q=s.d
if(r-q>=1){p=s.H()
m=n.c
m===$&&A.c()
n.c=(p|m<<8)>>>0
m=n.d+8
n.d=m
o=m}else{if(q<r){m=s.H()
s=n.c
s===$&&A.c()
n.c=(m|s<<8)>>>0
s=n.d+8
n.d=s
m=s}else if(!n.e){s=n.c
s===$&&A.c()
n.c=s<<8>>>0
m+=8
n.d=m
n.e=!0}o=m}}else o=m
m=n.c
m===$&&A.c()
if(B.a.aM(m,o)>a){s=n.b
s===$&&A.c()
r=a+1
n.b=s-r
n.c=m-B.a.U(r,o)
return 1}else{n.b=a
return 0}},
mr(){var s,r=this,q=r.b
q===$&&A.c()
if(!(q>=0&&q<128))return A.a(B.aE,q)
s=B.aE[q]
r.b=B.bH[q]
q=r.d
q===$&&A.c()
r.d=q-s}}
A.lr.prototype={
gp(a){return this.d},
aK(a,b){var s,r,q=this,p=q.e,o=B.a.j(p*b,8)
if(a!==0){s=o+1
q.f=q.f+s
s=q.e=p-s
p=s}else{q.e=o
p=o}if(p<127){s=q.a
if(!(p>=0&&p<s.length))return A.a(s,p)
r=s[p]
s=q.b
if(!(p<s.length))return A.a(s,p)
q.e=s[p]
q.f=B.a.O(q.f,r)
if((q.w+=r)>0)q.em()}return a},
bp(a){var s,r=this,q=r.e,p=B.a.j(q,1)
if(a!==0){s=p+1
r.f=r.f+s
s=r.e=q-s
q=s}else{r.e=p
q=p}if(q<127){s=r.b
if(!(q>=0&&q<s.length))return A.a(s,q)
r.e=s[q]
r.f=r.f<<1>>>0
if(++r.w>0)r.em()}return a},
bQ(a,b){var s
for(s=B.a.U(1,b-1);s!==0;s=s>>>1)this.bp((a&s)>>>0)},
cp(a,b){var s
if(this.bp(a!==0?1:0)===0)return
s=b+1
if(a<0)this.bQ((-a<<1|1)>>>0,s)
else this.bQ(a<<1>>>0,s)},
em(){var s,r,q,p,o,n,m=this,l=m.w,k=8+l,j=m.f,i=B.a.aM(j,k)
m.f=j-B.a.U(i,k)
m.w=l-8
l=i&255
j=m.r+1
if(l!==255){s=m.d
m.mk(j)
j=(i&256)!==0
if(j)if(s>0){r=m.c
q=s-1
if(!(q<r.length))return A.a(r,q)
p=r[q]
r.$flags&2&&A.b(r)
r[q]=p+1}r=m.r
if(r>0){o=j?0:255
for(j=r;j>0;--j,m.r=j,s=n){r=m.c
n=s+1
r.$flags&2&&A.b(r)
if(!(s<r.length))return A.a(r,s)
r[s]=o}}j=m.c
j.$flags&2&&A.b(j)
if(!(s<j.length))return A.a(j,s)
j[s]=l
m.d=s+1}else m.r=j},
mk(a){var s,r=this.d,q=r+a,p=this.c,o=p.length
if(q<=o)return
s=o*2
if(s<q)s=q
o=new Uint8Array(s)
B.d.aa(o,0,r,p)
this.c=o},
cG(){var s=this
s.bQ(0,9-s.w)
s.w=0
s.em()
return A.oj(s.c,0,s.d)}}
A.ls.prototype={}
A.mK.prototype={
$0(){var s,r,q,p=new Uint8Array(766)
for(s=-255;s<=510;++s){r=255+s
if((s&4294967040)>>>0===0)q=s
else q=s<0?0:255
if(!(r<766))return A.a(p,r)
p[r]=q}return p},
$S:31}
A.lx.prototype={
jN(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8=this,d9=null,e0=d8.a,e1=e0.b
if(e1>=6)s=3
else if(e1>=5)s=2
else{e1=e1>=3?1:0
s=e1}e1=d8.b
r=e1.c*e1.d
q=r>>>3
if(q<96)q=96
for(p=e1.ay,o=p.b,n=d8.d,m=s>0,l=s===2,k=s>=3,j=t.p,i=e0.a;;){if(i<0)h=0
else h=i>100?100:i
g=e1.ch
g===$&&A.c()
f=e1.CW
e=e1.cx
d=e1.x
d===$&&A.c()
g.iS(e0,h,f,e,d)
d8.mp()
p.hX()
c=A.ol(e1)
g=new Int16Array(256)
f=new Int16Array(16)
e=new Int16Array(16)
d=new Int16Array(16)
b=new Int16Array(256)
a=new Int16Array(128)
a0=new Uint8Array(16)
a1=new Int8Array(6)
a2=new Int16Array(16)
a3=new Int16Array(256)
a4=new Int16Array(128)
a5=new Uint8Array(16)
a6=new Int8Array(6)
a7=new Int16Array(16)
a8=new Int16Array(256)
a9=new Int16Array(128)
b0=new Uint8Array(16)
b1=new Int8Array(6)
b2=new Int16Array(16)
b3=new Int16Array(256)
b4=new Int16Array(128)
b5=new Uint8Array(16)
b6=new Int8Array(6)
b7=new Int16Array(16)
b8=new Int16Array(256)
b9=new Int16Array(128)
c0=new Uint8Array(16)
c1=new Int8Array(6)
c2=new Int16Array(16)
c3=new Int16Array(256)
c4=new Int16Array(128)
c5=new Uint8Array(16)
c6=new Int8Array(6)
c7=new Int32Array(16)
c8=new Int8Array(32)
c9=new Int8Array(32)
d0=new Int16Array(32)
d1=A.N(4,0,!1,j)
d2=new Int32Array(4)
d3=new A.lt(e1,c,g,f,e,new A.c3(d,b,a,a0,a1),new A.c3(a2,a3,a4,a5,a6),new A.c3(a7,a8,a9,b0,b1),new A.c3(b2,b3,b4,b5,b6),new A.c3(b7,b8,b9,c0,c1),new A.c3(c2,c3,c4,c5,c6),new A.iY(),c7,c8,c9,d0,d1,d2,new Int16Array(16))
g=new Int16Array(16)
f=new Int16Array(256)
e=new Int16Array(128)
d=new Uint8Array(16)
d4=new A.c3(g,f,e,d,new Int8Array(6))
d5=e1.db
B.q.V(o,0,1056,0)
n.b=0
g=c.a
f=e1.a.b
e=f>=2
f=f>=1
d=c.r
b=c.ay
a=c.ch
d6=q
do{c.nt();--d6
if(d6<0){p.i6()
p.hX()
d6=q}d4.as=d4.c=d4.d=d4.b=d4.a=0
d4.e=1125899906842624
a0=c.geZ()
a1=c.b!==0?b:d9
if(c.c!==0){a2=c.at
a2===$&&A.c()}else a2=d9
a3=c.Q
A.mL(a0,0,a1,1,a2,a3,16,16,5)
A.jr(a0,512,a2,a3,16)
A.jk(a0,528,a1,1,16)
A.n4(d,a0,16,a1,1,a2,a3,16)
a1=c.b!==0?a:d9
if(c.c!==0){a2=c.ax
a2===$&&A.c()}else a2=d9
A.rh(d,a0,a1,1,a2,c.as)
a2=d3.at=!1
if(m){c.fr=k
d3.lz(d4)
if(e)d3.lA(d4)
d3.lB(d4)
if(l){c.fr=!0
d3.mt(d4)}}else d3.mh(d4,f,e)
a0=d4.as
a1=g.w
a1===$&&A.c()
a3=c.x
a0=a0===0?1:0
a1.$flags&2&&A.b(a1)
if(!(a3<a1.length))return A.a(a1,a3)
a1[a3]=a0
d5+=d4.c
d8.mg(c,d4)
c.iN()}while(c.eS())
g=e1.dx
if(g>0?d5>1069547520:a2){e1.dx=g>>>1
continue}break}p.i6()
e0=e1.ch
e0===$&&A.c()
e0=B.a.j(e0.c,4)
if(!(e0<8))return A.a(B.d0,e0)
d7=A.qd(r*B.d0[e0])
n.nf(d7,p.a)
return d7.cG()},
mp(){var s,r,q,p,o,n=new Int32Array(4),m=this.b,l=m.c*m.d
for(s=m.x,r=0;r<l;++r){s===$&&A.c()
if(!(r<s.length))return A.a(s,r)
q=s[r]
if(!(q<4))return A.a(n,q)
p=n[q]
if(!(q<4))return A.a(n,q)
n[q]=p+1}s=m.ch
s===$&&A.c()
if(s.a>1){o=m.ay.f
s=A.on(n[0]+n[1],n[2]+n[3])
o.$flags&2&&A.b(o)
o[0]=s
o[1]=A.on(n[0],n[1])
o[2]=A.on(n[2],n[3])
s=o[0]!==255||o[1]!==255||o[2]!==255
m.cy=s
if(!s){s=m.x
s===$&&A.c()
B.d.V(s,0,l,0)}m.db=n[0]*(A.bd(0,o[0])+A.bd(0,o[1]))+n[1]*(A.bd(0,o[0])+A.bd(1,o[1]))+n[2]*(A.bd(1,o[0])+A.bd(0,o[2]))+n[3]*(A.bd(1,o[0])+A.bd(1,o[2]))}else{m.cy=!1
m.db=0}},
mg(a2,a3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=this,a1=a0.b.ay
a2.da()
s=a2.a
r=s.f
r===$&&A.c()
q=a2.x
if(!(q<r.length))return A.a(r,q)
p=a0.e
if(r[q]===1){r=a2.dx
q=r[8]
o=a2.dy
n=o[8]
p.a=0
p.c=1
p.cf(a3.f,0)
n=A.oQ(a1,p,q+n,a0.d)
o.$flags&2&&A.b(o)
o[8]=n
r.$flags&2&&A.b(r)
r[8]=n
p.a=1
p.c=0}else{p.a=0
p.c=3}for(r=a2.dx,q=a2.dy,o=a3.r,n=a0.d,m=q.$flags|0,l=r.$flags|0,k=0;k<4;++k)for(j=k*4,i=0;i<4;++i){h=r[i]
g=q[k]
p.cf(o,(i+j)*16)
g=A.oQ(a1,p,h+g,n)
m&2&&A.b(q)
q[k]=g
l&2&&A.b(r)
r[i]=g}p.a=0
p.c=2
for(o=a3.w,f=0;f<=2;f+=2)for(j=4+f,h=f*2,k=0;k<2;++k)for(g=j+k,e=k*2,i=0;i<2;++i){d=j+i
c=r[d]
b=q[g]
p.cf(o,(h+i+e)*16)
b=A.oQ(a1,p,c+b,n)
m&2&&A.b(q)
q[g]=b
l&2&&A.b(r)
r[d]=b}p=r[0]
o=r[1]
n=r[2]
m=r[3]
l=r[4]
j=r[5]
h=r[6]
g=r[7]
r=r[8]
e=q[0]
d=q[1]
c=q[2]
b=q[4]
q=q[6]
s=s.Q
s===$&&A.c()
a=a2.z
s.$flags&2&&A.b(s)
if(!(a<s.length))return A.a(s,a)
s[a]=(p<<12|o<<13|n<<14|m<<15|l<<18|j<<19|h<<22|g<<23|r<<24|e<<3|d<<7|c<<11|b<<17|q<<21|0)>>>0},
lQ(a){var s,r,q=this.b,p=q.ch
p===$&&A.c()
if(a.bp(p.a>1?1:0)===0)return
a.bp(q.cy?1:0)
a.bp(1)
a.bp(1)
for(p=p.b,s=0;s<4;++s)a.cp(p[s].f,7)
for(s=0;s<4;++s)a.cp(p[s].r,6)
if(q.cy)for(q=q.ay.f,s=0;s<3;++s){r=q[s]
if(a.bp(r!==255?1:0)!==0)a.bQ(r,8)}},
jM(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=this.b,d=A.ol(e),c=e.z
c===$&&A.c()
s=e.e
r=d.a
q=c.length
p=e.ay.f
do{if(e.cy){o=e.x
o===$&&A.c()
n=d.x
if(!(n<o.length))return A.a(o,n)
n=o[n]
o=n>=2?1:0
n&=1
if(a.aK(o,p[0])!==0)a.aK(n,p[2])
else a.aK(n,p[1])}o=r.f
o===$&&A.c()
n=d.x
if(!(n<o.length))return A.a(o,n)
m=a.aK(o[n]!==0?1:0,145)
l=d.y
if(m!==0){if(!(l<q))return A.a(c,l)
o=c[l]
n=o===1
if(a.aK(n||o===3?1:0,156)!==0)a.aK(n?1:0,128)
else a.aK(o===2?1:0,163)}else{k=l-s
for(j=0;j<4;++j,k=l,l=f){o=l-1
if(!(o>=0&&o<q))return A.a(c,o)
i=c[o]
for(h=0;h<4;++h,i=g){o=l+h
if(!(o<q))return A.a(c,o)
g=c[o]
o=k+h
if(!(o>=0&&o<q))return A.a(c,o)
o=c[o]
if(!(o<10))return A.a(B.b3,o)
o=B.b3[o]
if(!(i>=0&&i<10))return A.a(o,i)
o=o[i]
n=g!==0?1:0
if(a.aK(n,o[0])!==0){n=g!==1?1:0
if(a.aK(n,o[1])!==0){n=g!==2?1:0
if(a.aK(n,o[2])!==0){n=g>=6?1:0
if(a.aK(n,o[3])===0){n=g!==3?1:0
if(a.aK(n,o[4])!==0){n=g!==4?1:0
a.aK(n,o[5])}}else{n=g!==6?1:0
if(a.aK(n,o[6])!==0){n=g!==7?1:0
if(a.aK(n,o[7])!==0){n=g!==8?1:0
a.aK(n,o[8])}}}}}}}f=l+s}}o=r.r
o===$&&A.c()
n=d.x
if(!(n<o.length))return A.a(o,n)
n=o[n]
if(a.aK(n!==0?1:0,142)!==0)if(a.aK(n!==2?1:0,114)!==0)a.aK(n!==3?1:0,183)}while(d.eS())}}
A.ly.prototype={
f5(a,b,c,d){var s,r
t.D.a(a)
for(s=0;s<16;++s){r=b+s
if(this.h2(a,r,c,d))this.dA(a,r,c)}},
f4(a,b,c,d){var s,r
t.D.a(a)
for(s=0;s<16;++s){r=b+s*c
if(this.h2(a,r,1,d))this.dA(a,r,1)}},
iY(a,b,c,d){var s
t.D.a(a)
for(s=1;s<=3;++s)this.f5(a,b+4*s*c,c,d)},
iX(a,b,c,d){var s
t.D.a(a)
for(s=1;s<=3;++s)this.f4(a,b+4*s,c,d)},
o4(a,b,c,d,e,f){var s
t.D.a(a)
for(s=1;s<=3;++s)this.cv(a,b+4*s*c,c,1,16,d,e,f)},
np(a,b,c,d,e,f){var s
t.D.a(a)
for(s=1;s<=3;++s)this.cv(a,b+4*s,1,c,16,d,e,f)},
cw(a5,a6,a7,a8,a9,b0,b1,b2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4=this
t.D.a(a5)
for(s=3*a7,r=a5.length,q=2*a7,p=a4.c,o=a4.e,n=a5.$flags|0,m=0;m<a9;++m,a6+=a8)if(a4.h3(a5,a6,a7,b0,b1))if(a4.fU(a5,a6,a7,b2))a4.dA(a5,a6,a7)
else{l=a6-s
if(!(l>=0&&l<r))return A.a(a5,l)
k=a5[l]
j=a6-q
if(!(j>=0&&j<r))return A.a(a5,j)
i=a5[j]
h=a6-a7
if(!(h>=0&&h<r))return A.a(a5,h)
g=a5[h]
if(!(a6>=0&&a6<r))return A.a(a5,a6)
f=a5[a6]
e=a6+a7
if(!(e<r))return A.a(a5,e)
d=a5[e]
c=a6+q
if(!(c<r))return A.a(a5,c)
b=a5[c]
a=1020+i-d
if(!(a>=0&&a<2041))return A.a(p,a)
a=1020+3*(f-g)+p[a]
if(!(a>=0&&a<2041))return A.a(p,a)
a0=p[a]
a1=B.a.j(27*a0+63+3456,7)-27
a2=B.a.j(18*a0+63+2304,7)-18
a3=B.a.j(9*a0+63+1152,7)-9
a=255+k+a3
if(!(a<766))return A.a(o,a)
a=o[a]
n&2&&A.b(a5)
a5[l]=a
a=255+i+a2
if(!(a<766))return A.a(o,a)
a5[j]=o[a]
a=255+g+a1
if(!(a<766))return A.a(o,a)
a5[h]=o[a]
a=255+f-a1
if(!(a>=0&&a<766))return A.a(o,a)
a5[a6]=o[a]
a=255+d-a2
if(!(a>=0&&a<766))return A.a(o,a)
a5[e]=o[a]
a=255+b-a3
if(!(a>=0&&a<766))return A.a(o,a)
a5[c]=o[a]}},
cv(a0,a1,a2,a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=this
t.D.a(a0)
for(s=2*a2,r=a0.length,q=a.d,p=a.e,o=a0.$flags|0,n=0;n<a4;++n,a1+=a3)if(a.h3(a0,a1,a2,a5,a6))if(a.fU(a0,a1,a2,a7))a.dA(a0,a1,a2)
else{m=a1-s
if(!(m>=0&&m<r))return A.a(a0,m)
l=a0[m]
k=a1-a2
if(!(k>=0&&k<r))return A.a(a0,k)
j=a0[k]
if(!(a1>=0&&a1<r))return A.a(a0,a1)
i=a0[a1]
h=a1+a2
if(!(h<r))return A.a(a0,h)
g=a0[h]
f=3*(i-j)
e=B.a.j(f+4+1024,3)-128+112
if(!(e>=0&&e<225))return A.a(q,e)
d=q[e]
e=B.a.j(f+3+1024,3)-128+112
if(!(e>=0&&e<225))return A.a(q,e)
c=q[e]
b=B.a.j(d+1+16,1)-8
e=255+l+b
if(!(e<766))return A.a(p,e)
e=p[e]
o&2&&A.b(a0)
a0[m]=e
e=255+j+c
if(!(e>=0&&e<766))return A.a(p,e)
a0[k]=p[e]
e=255+i-d
if(!(e>=0&&e<766))return A.a(p,e)
a0[a1]=p[e]
e=255+g-b
if(!(e>=0&&e<766))return A.a(p,e)
a0[h]=p[e]}},
dA(a,b,c){var s,r,q,p,o,n,m,l,k
t.D.a(a)
s=b-2*c
r=a.length
if(!(s>=0&&s<r))return A.a(a,s)
q=a[s]
s=b-c
if(!(s>=0&&s<r))return A.a(a,s)
p=a[s]
if(!(b>=0&&b<r))return A.a(a,b)
o=a[b]
n=b+c
if(!(n<r))return A.a(a,n)
r=this.c
n=1020+q-a[n]
if(!(n>=0&&n<2041))return A.a(r,n)
m=3*(o-p)+r[n]
n=this.d
r=B.a.j(m+4+1024,3)-128+112
if(!(r>=0&&r<225))return A.a(n,r)
l=n[r]
r=B.a.j(m+3+1024,3)-128+112
if(!(r>=0&&r<225))return A.a(n,r)
k=this.e
r=255+p+n[r]
if(!(r>=0&&r<766))return A.a(k,r)
r=k[r]
a.$flags&2&&A.b(a)
a[s]=r
r=255+o-l
if(!(r>=0&&r<766))return A.a(k,r)
a[b]=k[r]},
fU(a,b,c,d){var s,r,q,p,o,n
t.D.a(a)
s=b-2*c
r=a.length
if(!(s>=0&&s<r))return A.a(a,s)
q=a[s]
s=b-c
if(!(s>=0&&s<r))return A.a(a,s)
p=a[s]
if(!(b>=0&&b<r))return A.a(a,b)
o=a[b]
s=b+c
if(!(s<r))return A.a(a,s)
n=a[s]
s=this.a
r=255+q-p
if(!(r>=0&&r<511))return A.a(s,r)
if(s[r]<=d){r=255+n-o
if(!(r>=0&&r<511))return A.a(s,r)
r=s[r]>d
s=r}else s=!0
return s},
h2(a,b,c,d){var s,r,q,p,o,n,m
t.D.a(a)
s=b-2*c
r=a.length
if(!(s>=0&&s<r))return A.a(a,s)
q=a[s]
s=b-c
if(!(s>=0&&s<r))return A.a(a,s)
p=a[s]
if(!(b>=0&&b<r))return A.a(a,b)
o=a[b]
s=b+c
if(!(s<r))return A.a(a,s)
n=a[s]
s=this.a
r=255+p-o
if(!(r>=0&&r<511))return A.a(s,r)
r=s[r]
s=this.b
m=255+q-n
if(!(m>=0&&m<511))return A.a(s,m)
return 2*r+s[m]<=d},
h3(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i,h,g
t.D.a(a)
s=b-4*c
r=a.length
if(!(s>=0&&s<r))return A.a(a,s)
q=a[s]
s=3*c
p=b-s
if(!(p>=0&&p<r))return A.a(a,p)
o=a[p]
p=2*c
n=b-p
if(!(n>=0&&n<r))return A.a(a,n)
m=a[n]
n=b-c
if(!(n>=0&&n<r))return A.a(a,n)
l=a[n]
if(!(b>=0&&b<r))return A.a(a,b)
k=a[b]
n=b+c
if(!(n<r))return A.a(a,n)
j=a[n]
p=b+p
if(!(p<r))return A.a(a,p)
i=a[p]
s=b+s
if(!(s<r))return A.a(a,s)
h=a[s]
s=this.a
r=255+l-k
if(!(r>=0&&r<511))return A.a(s,r)
r=s[r]
p=this.b
n=255+m
g=n-j
if(!(g>=0&&g<511))return A.a(p,g)
if(2*r+p[g]>d)return!1
r=255+q-o
if(!(r>=0&&r<511))return A.a(s,r)
p=!1
if(s[r]<=e){r=255+o-m
if(!(r>=0&&r<511))return A.a(s,r)
if(s[r]<=e){r=n-l
if(!(r>=0&&r<511))return A.a(s,r)
if(s[r]<=e){r=255+h-i
if(!(r>=0&&r<511))return A.a(s,r)
if(s[r]<=e){r=255+i-j
if(!(r>=0&&r<511))return A.a(s,r)
if(s[r]<=e){r=255+j-k
if(!(r>=0&&r<511))return A.a(s,r)
r=s[r]<=e
s=r}else s=p}else s=p}else s=p}else s=p}else s=p
return s},
bS(a,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=t.m6.a(a.a),d=t.D.a(a0.a),c=this.f,b=a.d
for(s=e.length,r=c.$flags|0,q=0,p=0;p<4;++p){if(!(b>=0&&b<s))return A.a(e,b)
o=e[b]
n=b+8
if(!(n<s))return A.a(e,n)
n=e[n]
m=o+n
l=o-n
n=b+4
if(!(n<s))return A.a(e,n)
n=e[n]
o=B.a.j(n*35468+1073741824,16)
k=b+12
if(!(k<s))return A.a(e,k)
k=e[k]
j=o-16384-(B.a.j(k*85627+1073741824,16)-16384)
i=B.a.j(n*85627+1073741824,16)-16384+(B.a.j(k*35468+1073741824,16)-16384)
h=q+1
r&2&&A.b(c)
if(!(q<16))return A.a(c,q)
c[q]=m+i
q=h+1
if(!(h<16))return A.a(c,h)
c[h]=l+j
h=q+1
if(!(q<16))return A.a(c,q)
c[q]=l-j
q=h+1
if(!(h<16))return A.a(c,h)
c[h]=m-i;++b}g=a0.d
for(s=d.$flags|0,r=d.length,q=0,p=0;p<4;++p){if(!(q<16))return A.a(c,q)
f=c[q]+4
o=q+8
if(!(o<16))return A.a(c,o)
o=c[o]
m=f+o
l=f-o
o=q+4
if(!(o<16))return A.a(c,o)
o=c[o]
n=B.a.j(o*35468+1073741824,16)
k=q+12
if(!(k<16))return A.a(c,k)
k=c[k]
j=n-16384-(B.a.j(k*85627+1073741824,16)-16384)
i=B.a.j(o*85627+1073741824,16)-16384+(B.a.j(k*35468+1073741824,16)-16384)
if(!(g>=0&&g<r))return A.a(d,g)
k=d[g]+(B.a.j(m+i+65536,3)-8192)
if((k&-256)>>>0===0)o=k
else o=k<0?0:255
s&2&&A.b(d)
d[g]=o
o=g+1
if(!(o<r))return A.a(d,o)
n=d[o]+(B.a.j(l+j+65536,3)-8192)
if(!((n&-256)>>>0===0))n=n<0?0:255
d[o]=n
n=g+2
if(!(n<r))return A.a(d,n)
o=d[n]+(B.a.j(l-j+65536,3)-8192)
if(!((o&-256)>>>0===0))o=o<0?0:255
d[n]=o
o=g+3
if(!(o<r))return A.a(d,o)
n=d[o]+(B.a.j(m-i+65536,3)-8192)
if(!((n&-256)>>>0===0))n=n<0?0:255
d[o]=n;++q
g+=32}},
o_(a,b,c){this.bS(a,b)
if(c)this.bS(A.w(a,null,16),A.w(b,null,4))},
de(a,b){var s,r,q,p,o,n
for(s=J.d(a.a,a.d)+4+65536,r=0;r<4;++r)for(q=r*32,p=0;p<4;++p){o=p+q
n=J.d(b.a,b.d+o)+(B.a.j(s,3)-8192)
if(!((n&-256)>>>0===0))n=n<0?0:255
J.a2(b.a,b.d+o,n)}},
iz(a,b){var s=this,r=null
if(J.d(a.a,a.d)!==0)s.de(a,b)
if(J.d(a.a,a.d+16)!==0)s.de(A.w(a,r,16),A.w(b,r,4))
if(J.d(a.a,a.d+32)!==0)s.de(A.w(a,r,32),A.w(b,r,128))
if(J.d(a.a,a.d+48)!==0)s.de(A.w(a,r,48),A.w(b,r,132))}}
A.lu.prototype={
geZ(){var s,r=this,q=r.w
if(q===$){s=J.az(B.d.gt(r.r),0,448)
r.w!==$&&A.oR()
r.w=s
q=s}return q},
f3(a){var s,r,q=this
q.b=0
q.c=a
s=q.a
r=s.e
q.y=1+r+a*4*r
q.z=1
q.x=a*s.c
r=s.as
r===$&&A.c()
q.at=r
s=s.at
s===$&&A.c()
q.ax=s
q.as=q.Q=0
q.fW()},
fW(){var s=this,r=s.ay,q=s.ch,p=s.c>0?129:127
q.$flags&2&&A.b(q)
q[16]=p
q[0]=p
r.$flags&2&&A.b(r)
r[0]=p
B.d.V(r,1,17,129)
B.d.V(q,1,9,129)
B.d.V(q,17,25,129)
q=s.dy
q.$flags&2&&A.b(q)
q[8]=0
r=s.a.ax
r===$&&A.c()
if(r!=null)B.O.V(s.fy,0,4,0)},
i9(a){var s,r,q,p,o,n,m,l,k,j=this,i=j.a.b,h=i.a,g=B.a.j(h+1,1),f=j.c,e=j.b,d=(f*h+e)*16,c=(f*g+e)*8,b=h-e*16
b=b<16?b:16
s=i.b-f*16
s=s<16?s:16
r=B.a.j(b+1,1)
q=B.a.j(s+1,1)
f=i.c
e=j.d
A.om(f,d,h,e,0,b,s,16)
p=i.d
A.om(p,c,g,e,16,r,q,8)
o=i.e
A.om(o,c,g,e,24,r,q,8)
if(!a)return
if(j.b===0)j.fW()
else{e=j.ay
n=j.ch
m=n.$flags|0
l=e.$flags|0
if(j.c===0){m&2&&A.b(n)
n[16]=127
n[0]=127
l&2&&A.b(e)
e[0]=127}else{k=d-1-h
if(!(k>=0&&k<f.length))return A.a(f,k)
k=f[k]
l&2&&A.b(e)
e[0]=k
k=c-1-g
if(!(k>=0&&k<p.length))return A.a(p,k)
l=p[k]
m&2&&A.b(n)
n[0]=l
if(!(k<o.length))return A.a(o,k)
n[16]=o[k]}A.fO(f,d-1,h,e,1,s,16)
e=c-1
A.fO(p,e,g,n,1,q,8)
A.fO(o,e,g,n,17,q,8)}e=j.ax=j.at=j.CW
j.Q=0
j.as=16
if(j.c===0)B.d.V(e,0,32,127)
else{A.fO(f,d-h,1,e,0,b,16)
f=c-g
A.fO(p,f,1,e,16,r,8)
A.fO(o,f,1,e,24,r,8)}},
nt(){return this.i9(!1)},
iN(){var s,r,q,p,o,n,m,l,k=this,j=k.a
if(k.b<j.c-1){for(s=k.ay,r=k.e,q=s.$flags|0,p=0;p<16;++p){o=15+p*32
if(!(o<512))return A.a(r,o)
o=r[o]
q&2&&A.b(s)
s[1+p]=o}for(o=k.ch,n=o.$flags|0,p=0;p<8;++p){m=p*32
l=23+m
if(!(l<512))return A.a(r,l)
l=r[l]
n&2&&A.b(o)
o[1+p]=l
m=31+m
if(!(m<512))return A.a(r,m)
o[17+p]=r[m]}r=k.at
r===$&&A.c()
m=k.Q+15
if(!(m<r.length))return A.a(r,m)
m=r[m]
q&2&&A.b(s)
s[0]=m
m=k.ax
m===$&&A.c()
s=k.as
q=s+7
r=m.length
if(!(q<r))return A.a(m,q)
q=m[q]
n&2&&A.b(o)
o[0]=q
s=s+8+7
if(!(s<r))return A.a(m,s)
o[16]=m[s]}if(k.c<j.d-1){j=k.at
j===$&&A.c()
s=k.Q
B.d.a3(j,s,s+16,k.e,480)
s=k.ax
s===$&&A.c()
j=k.as
B.d.a3(s,j,j+16,k.e,240)}},
eS(){var s=this
if(++s.b===s.a.c)s.f3(++s.c)
else{s.y+=4;++s.x;++s.z
s.Q+=16
s.as+=16}return--s.fx>0},
da(){var s,r,q,p,o=this,n=o.a.Q
n===$&&A.c()
s=o.z
r=n.length
if(!(s<r))return A.a(n,s)
q=n[s];--s
if(!(s>=0&&s<r))return A.a(n,s)
p=n[s]
s=o.dx
n=B.a.j(q,12)
s.$flags&2&&A.b(s)
s[0]=n&1
s[1]=B.a.j(q,13)&1
s[2]=B.a.j(q,14)&1
s[3]=B.a.j(q,15)&1
s[4]=B.a.j(q,18)&1
s[5]=B.a.j(q,19)&1
s[6]=B.a.j(q,22)&1
s[7]=B.a.j(q,23)&1
s[8]=B.a.j(q,24)&1
s=o.dy
n=B.a.j(p,3)
s.$flags&2&&A.b(s)
s[0]=n&1
s[1]=B.a.j(p,7)&1
s[2]=B.a.j(p,11)&1
s[3]=B.a.j(p,15)&1
s[4]=B.a.j(p,17)&1
s[5]=B.a.j(p,19)&1
s[6]=B.a.j(p,21)&1
s[7]=B.a.j(p,23)&1},
cM(a){var s,r,q,p,o=this.y
for(s=this.a,r=s.e,q=0;q<4;++q){p=s.z
p===$&&A.c()
B.d.V(p,o,o+4,a)
o+=r}s=s.f
s===$&&A.c()
r=this.x
s.$flags&2&&A.b(s)
if(!(r<s.length))return A.a(s,r)
s[r]=1},
e_(a){var s,r,q,p,o=this.y
for(s=this.a,r=s.e,q=0;q<4;++q){p=s.z
p===$&&A.c()
B.d.a3(p,o,o+4,a,4*q)
o+=r}s=s.f
s===$&&A.c()
r=this.x
s.$flags&2&&A.b(s)
if(!(r<s.length))return A.a(s,r)
s[r]=0},
e0(a){var s,r=this.a.r
r===$&&A.c()
s=this.x
r.$flags&2&&A.b(r)
if(!(s<r.length))return A.a(r,s)
r[s]=a
return a},
iT(a){var s,r,q=this.a.w
q===$&&A.c()
s=this.x
r=a?1:0
q.$flags&2&&A.b(q)
if(!(s<q.length))return A.a(q,s)
q[s]=r
return r},
fa(){var s=this,r=s.e
s.e=s.f
s.f=r},
e2(){var s,r,q,p,o,n,m=this
m.db=0
m.cy=17
for(s=m.cx,r=m.ay,q=s.$flags|0,p=0;p<17;++p){o=r[16-p]
q&2&&A.b(s)
s[p]=o}for(r=m.at,o=m.Q,p=0;p<16;++p){r===$&&A.c()
n=o+p
if(!(n<r.length))return A.a(r,n)
n=r[n]
q&2&&A.b(s)
s[17+p]=n}if(m.b<m.a.c-1)for(p=16;p<20;++p){r===$&&A.c()
n=o+p
if(!(n<r.length))return A.a(r,n)
n=r[n]
q&2&&A.b(s)
s[17+p]=n}else for(p=16;p<20;++p){r=s[32]
q&2&&A.b(s)
s[17+p]=r}m.da()},
eV(a,b){var s,r,q,p,o,n,m,l,k=this,j=k.db
if(!(j<16))return A.a(B.p,j)
s=b+B.p[j]
r=k.cy
for(q=k.cx,p=r-4,o=q.$flags|0,n=0;n<=3;++n){m=p+n
l=s+n+96
if(!(l<512))return A.a(a,l)
l=a[l]
o&2&&A.b(q)
if(!(m>=0&&m<40))return A.a(q,m)
q[m]=l}if((j&3)!==3)for(p=s+3,n=0;n<=2;++n){m=r+n
l=p+(2-n)*32
if(!(l>=0&&l<512))return A.a(a,l)
l=a[l]
o&2&&A.b(q)
if(!(m<40))return A.a(q,m)
q[m]=l}else for(n=0;n<=3;++n){p=r+n
m=p+4
if(!(m<40))return A.a(q,m)
m=q[m]
o&2&&A.b(q)
if(!(p<40))return A.a(q,p)
q[p]=m}j=k.db=j+1
if(j===16)return!1
if(!(j<16))return A.a(B.cR,j)
k.cy=B.cR[j]
return!0}}
A.lv.prototype={
nD(a,b){var s,r,q=this.e
if(!(b>=0&&b<q.length))return A.a(q,b)
q=q[b]
s=this.c
r=a+(b>67?67:b)
if(!(r>=0&&r<6528))return A.a(s,r)
return q+s[r]},
hX(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=this
if(!a0.y)return
for(s=a0.d,r=s.$flags|0,q=a0.c,p=q.$flags|0,o=a0.a,n=0;n<4;++n){for(m=n*8,l=0;l<8;++l)for(k=(m+l)*3,j=0;j<3;++j){i=k+j
h=i*11
g=i*68
if(j>0){if(!(h<1056))return A.a(o,h)
i=255-o[h]
if(!(i>=0))return A.a(B.n,i)
f=B.n[i]}else f=0
i=h+1
if(!(i<1056))return A.a(o,i)
i=o[i]
e=255-i
if(!(e>=0))return A.a(B.n,e)
e=B.n[e]
d=e+f
if(!(i<256))return A.a(B.n,i)
i=B.n[i]
p&2&&A.b(q)
if(!(g<6528))return A.a(q,g)
q[g]=i+f
for(c=1;c<=67;++c){i=g+c
e=a0.mH(c,h)
if(!(i<6528))return A.a(q,i)
q[i]=d+e}}for(k=n*16,b=0;b<16;++b)for(i=(k+b)*3,j=0;j<3;++j){e=i+j
a=B.K[b]
r&2&&A.b(s)
if(!(e<192))return A.a(s,e)
s[e]=((m+a)*3+j)*68}}a0.y=!1},
mH(a,b){var s,r,q,p,o,n=a-1
if(!(n>=0&&n<67))return A.a(B.dx,n)
n=B.dx[n]
s=n[0]
r=n[1]
for(n=this.a,q=0,p=2;s!==0;++p){if((s&1)!==0){o=b+p
if(!(o<1056))return A.a(n,o)
o=n[o]
if((r&1)===0){if(!(o<256))return A.a(B.n,o)
o=B.n[o]}else{o=255-o
if(!(o>=0))return A.a(B.n,o)
o=B.n[o]}q+=o}r=r>>>1
s=s>>>1}return q},
b_(a,b){var s,r=this.b
if(!(b>=0&&b<1056))return A.a(r,b)
s=r[b]
if(s>=4294836224)s=s+1>>>1&2147450879
r.$flags&2&&A.b(r)
r[b]=s+65536+a
return a},
i6(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0
for(s=this.a,r=s.$flags|0,q=this.b,p=!1,o=0,n=0;n<1056;++n){m=q[n]
l=m&65535
k=m>>>16&65535
j=$.p3()[n]
i=$.nI()[n]
h=l!==0?255-B.a.Z(l*255,k):255
g=255-i
if(!(g>=0))return A.a(B.n,g)
g=B.n[g]
f=k-l
if(!(i<256))return A.a(B.n,i)
e=B.n[i]
if(!(j<256))return A.a(B.n,j)
d=B.n[j]
c=255-h
if(!(c<256))return A.a(B.n,c)
c=B.n[c]
if(!(h>=0))return A.a(B.n,h)
b=B.n[h]
a=B.n[255-j]
a0=l*g+f*e+d>l*c+f*b+a+2048
o+=(a0?1:0)===0?d:a
if(a0){r&2&&A.b(s)
s[n]=h
p=B.f3.iM(p,h!==i)
o+=2048}else{r&2&&A.b(s)
s[n]=i}}this.y=p
return o},
aR(a){var s,r,q,p
for(s=this.a,r=0;r<1056;++r){q=s[r]
p=q!==$.nI()[r]?1:0
if(a.aK(p,$.p3()[r])!==0)a.bQ(q,8)}if(a.bp(0)!==0)a.bQ(0,8)}}
A.fV.prototype={
eP(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g=this
for(s=g.b,r=g.a,q=s.$flags|0,p=g.c,o=p.$flags|0,n=g.d,m=n.$flags|0,l=0;l<2;++l){if(!(b<3))return A.a(B.cY,b)
k=B.cY[b]
j=k[l>0?1:0]
k=B.a.Z(131072,r[l])
q&2&&A.b(s)
s[l]=k
o&2&&A.b(p)
p[l]=j<<9>>>0
k=B.a.Z(131071-p[l],s[l])
m&2&&A.b(n)
n[l]=k}for(k=r.$flags|0,l=2;l<16;++l){i=r[1]
k&2&&A.b(r)
r[l]=i
i=s[1]
q&2&&A.b(s)
s[l]=i
i=p[1]
o&2&&A.b(p)
p[l]=i
i=n[1]
m&2&&A.b(n)
n[l]=i}for(s=b===0,q=g.e,h=0,l=0;l<16;++l){p=s?B.a.j(B.lE[l]*r[l],11):0
q.$flags&2&&A.b(q)
q[l]=p
h+=r[l]}return B.a.j(h+8,4)}}
A.iZ.prototype={
i1(a){var s=this
s.d=a.d
s.e=a.e
s.f=a.f
s.r=a.r
s.w=a.w
s.x=a.x}}
A.lS.prototype={
iS(a,b,c,d,e){var s,r,q,p,o,n,m,l=this,k=b/100,j=k<0.75?k*0.6666666666666666:2*k-1,i=Math.pow(j,0.3333333333333333)
for(s=l.b,r=0;q=l.a,r<q;++r){if(!(r<4))return A.a(s,r)
p=Math.pow(i,1-0.003515625*s[r].d)
o=s[r]
n=B.b.h(127*(1-p))
if(n<0)n=0
else if(n>127)n=127
o.f=n}o=s[0].f
l.c=o
for(r=q;r<4;++r)s[r].f=o
m=B.a.P(B.a.P((d-64)*10,70)*50,100)
if(m<-4)s=-4
else s=m>6?6:m
l.w=s
l.r=-2
l.f=l.e=l.d=0
l.mq(a)
if(l.a>1)l.mu(e)
l.iU(a)},
mq(a){var s,r,q,p,o,n,m=this
for(s=m.b,r=0;r<4;++r){q=s[r]
p=q.f
if(p<0)p=0
else if(p>127)p=127
o=B.am[p]>>>2
n=B.a.Z(B.kL[o<64?o:63]*300,256+q.e)
if(n<2)p=0
else p=n>63?63:n
q.r=p}m.x=s[0].r
m.z=!1
m.y=0},
mu(a){var s,r,q,p,o,n,m,l,k,j=this,i=new Int32Array(4)
for(s=j.b,r=1,q=1;p=j.a,q<p;++q){n=0
for(;;){if(!(n<r)){o=!1
break}if(!(q<4))return A.a(s,q)
p=s[q]
if(!(n<4))return A.a(s,n)
m=s[n]
if(p.f===m.f&&p.r===m.r){o=!0
break}++n}if(!(q<4))return A.a(i,q)
i[q]=n
if(!o){if(r!==q){if(!(r<4))return A.a(s,r)
p=s[r]
if(!(q<4))return A.a(s,q)
p.i1(s[q])}++r}}if(r<p){for(p=a.length,m=a.$flags|0,l=0;l<p;++l){k=a[l]
if(!(k<4))return A.a(i,k)
k=i[k]
m&2&&A.b(a)
a[l]=k}for(p=r-1,l=r;l<j.a;++l){if(!(l<4))return A.a(s,l)
m=s[l]
if(!(p<4))return A.a(s,p)
m.i1(s[p])}j.a=r}},
iU(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this,e=a.b>=4?50:0
for(s=f.b,r=0;r<f.a;++r){if(!(r<4))return A.a(s,r)
q=s[r]
p=q.f
o=q.a
n=o.a
m=p+f.d
if(m<0)m=0
else if(m>127)m=127
m=B.al[m]
n.$flags&2&&A.b(n)
n[0]=m
if(p<0)m=0
else m=p>127?127:p
n[1]=B.am[m]
m=q.b
l=m.a
k=p+f.e
if(k<0)k=0
else if(k>127)k=127
k=B.al[k]
l.$flags&2&&A.b(l)
l[0]=k*2
k=p+f.f
if(k<0)k=0
else if(k>127)k=127
l[1]=B.os[k]
k=q.c
l=k.a
j=p+f.r
if(j<0)j=0
else if(j>117)j=117
j=B.al[j]
l.$flags&2&&A.b(l)
l[0]=j
j=p+f.w
if(j<0)j=0
else if(j>127)j=127
l[1]=B.am[j]
i=o.eP(0,0)
h=m.eP(0,1)
g=k.eP(0,2)
k=3*i*i>>>7
q.z=k<1?1:k
o=3*h*h
q.y=o<1?1:o
o=3*g*g>>>6
q.Q=o<1?1:o
o=i*i>>>7
q.as=o<1?1:o
o=7*i*i>>>3
q.ch=o<1?1:o
o=h*h>>>2
q.ay=o<1?1:o
o=e*i>>>5
q.ax=o<1?1:o
q.x=20*n[0]
q.w=0
q.cx=1000*i*i}}}
A.c3.prototype={
eQ(){var s=this
s.as=s.c=s.d=s.b=s.a=0
s.e=1125899906842624},
dO(a){var s=this
s.a=a.a
s.b=a.b
s.d=a.d
s.c=a.c
s.as=a.as
s.e=a.e},
hL(a){var s=this
s.a=s.a+a.a
s.b=s.b+a.b
s.d=s.d+a.d
s.c=s.c+a.c
s.as=(s.as|a.as)>>>0
s.e=s.e+a.e}}
A.lt.prototype={
ll(){var s,r,q,p,o,n=this
if(n.at)return
for(s=n.as,r=n.b.d,q=s.$flags|0,p=0;p<16;++p){o=A.n2(r,B.p[p])
q&2&&A.b(s)
s[p]=o}n.at=!0},
ev(){var s=this.b
A.y_(s.r,s.cx,s.cy)},
eE(a0,a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=this
if(!(a2<4))return A.a(B.aS,a2)
s=B.aS[a2]
r=a.a.ch
r===$&&A.c()
r=r.b
q=a.b
p=q.a.x
p===$&&A.c()
o=q.x
if(!(o<p.length))return A.a(p,o)
o=p[o]
if(!(o<4))return A.a(r,o)
n=r[o]
for(r=q.d,p=q.r,o=a.c,m=0;m<16;m+=2){l=B.p[m]
k=s+l
j=m*16
A.ho(r,l,p,k,o,j)
A.ho(r,l+4,p,k+4,o,j+16)}r=a.d
A.xB(o,0,r,0)
i=((A.nB(r,0,a0.f,0,n.b)>=0?1:0)<<24|0)>>>0
if(q.fr){q.da()
for(l=q.dx,q=q.dy,k=a0.r,j=n.a,h=q.$flags|0,g=l.$flags|0,f=k.$flags|0,m=0,e=0;e<4;++e)for(d=0;d<4;++d,++m){c=m*16
b=a.ht(o,c,k,c,l[d]+q[e],0,j,n.ay)
h&2&&A.b(q)
q[e]=b
g&2&&A.b(l)
l[d]=b
f&2&&A.b(k)
if(!(c<256))return A.a(k,c)
k[c]=0
i=(i|B.a.O(b,m))>>>0}}else for(q=o.$flags|0,l=a0.r,k=n.a,m=0;m<16;m+=2){j=m*16
q&2&&A.b(o)
if(!(j<256))return A.a(o,j)
o[j]=0
h=(m+1)*16
if(!(h<256))return A.a(o,h)
o[h]=0
i=(i|B.a.O(A.rk(o,j,l,j,k),m))>>>0}A.yj(r,0,o,0)
for(m=0;m<16;m+=2){r=B.p[m]
q=s+r
l=m*16
A.jx(p,q,o,l,a1,r)
A.jx(p,q+4,o,l+16,a1,r+4)}return i},
eF(a,b,c,d,e,f){var s,r,q,p,o,n,m,l,k=this
if(!(f>=0&&f<10))return A.a(B.bL,f)
s=B.bL[f]
r=k.a.ch
r===$&&A.c()
r=r.b
q=k.b
p=q.a.x
p===$&&A.c()
o=q.x
if(!(o<p.length))return A.a(p,o)
o=p[o]
if(!(o<4))return A.a(r,o)
n=r[o]
o=q.r
r=k.e
A.ho(q.d,c,o,s,r,0)
if(q.fr){p=q.db
m=p>>>2
p=q.dx[p&3]
q=q.dy
if(!(m<9))return A.a(q,m)
l=k.ht(r,0,a,b,p+q[m],3,n.a,n.ch)}else l=A.nB(r,0,a,b,n.a)>=0?1:0
A.jx(o,s,r,0,d,e)
return l},
eG(a,b,c){var s,r,q,p,o,n,m,l,k,j,i,h=this
if(!(c<4))return A.a(B.aT,c)
s=B.aT[c]
r=h.a
q=r.ch
q===$&&A.c()
q=q.b
p=h.b
o=p.a.x
o===$&&A.c()
n=p.x
if(!(n<o.length))return A.a(o,n)
n=o[n]
if(!(n<4))return A.a(q,n)
m=q[n]
for(q=p.d,p=p.r,o=h.c,l=0;l<8;l+=2){n=B.bI[l]
k=16+n
n=s+n
j=l*16
A.ho(q,k,p,n,o,j)
A.ho(q,k+4,p,n+4,o,j+16)}r=r.ax
r===$&&A.c()
if(r!=null)h.jX(a,m.c)
for(r=a.w,q=m.c,i=0,l=0;l<8;l+=2){n=l*16
i|=B.a.O(A.rk(o,n,r,n,q),l)}for(l=0;l<8;l+=2){r=B.bI[l]
q=s+r
n=l*16
r=16+r
A.jx(p,q,o,n,b,r)
A.jx(p,q+4,o,n+16,b,r+4)}return i<<16>>>0},
jX(a0,a1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=this.a.ax
a===$&&A.c()
s=this.b
r=s.fy
for(q=this.c,p=a.length,o=q.$flags|0,n=a0.Q,m=n.$flags|0,l=0;l<=1;++l){k=l*2
j=s.b*4+k
i=l*4*16
if(!(i<256))return A.a(q,i)
h=q[i]
if(!(j<p))return A.a(a,j)
g=a[j]
if(!(k<4))return A.a(r,k)
g=B.a.j(7*g+8*r[k],3)
o&2&&A.b(q)
q[i]=h+((g&2147483647)-((g&2147483648)>>>0))
f=A.nC(q,i,a1)
g=i+16
if(!(g<256))return A.a(q,g)
h=q[g]
e=j+1
if(!(e<p))return A.a(a,e)
e=B.a.j(7*a[e]+8*f,3)
q[g]=h+((e&2147483647)-((e&2147483648)>>>0))
d=A.nC(q,g,a1)
g=i+32
if(!(g<256))return A.a(q,g)
e=q[g];++k
if(!(k<4))return A.a(r,k)
k=B.a.j(7*f+8*r[k],3)
q[g]=e+((k&2147483647)-((k&2147483648)>>>0))
c=A.nC(q,g,a1)
g=i+48
if(!(g<256))return A.a(q,g)
k=q[g]
e=B.a.j(7*d+8*c,3)
q[g]=k+((e&2147483647)-((e&2147483648)>>>0))
b=A.nC(q,g,a1)
g=l*3
m&2&&A.b(n)
if(!(g<6))return A.a(n,g)
n[g]=d
e=g+1
if(!(e<6))return A.a(n,e)
n[e]=c
g+=2
if(!(g<6))return A.a(n,g)
n[g]=b}},
mz(a){var s,r,q,p,o,n,m,l,k,j,i,h=this.a.ax
h===$&&A.c()
h.toString
s=this.b
r=s.fy
for(s=s.b*4,q=a.Q,p=r.$flags|0,o=h.$flags|0,n=0;n<=1;++n){m=n*2
l=s+m
k=n*3
if(!(k<6))return A.a(q,k)
j=q[k]
p&2&&A.b(r)
if(!(m<4))return A.a(r,m)
r[m]=j;++m
j=k+2
if(!(j<6))return A.a(q,j)
i=B.a.j(3*q[j],2)
if(!(m<4))return A.a(r,m)
r[m]=(i&2147483647)-((i&2147483648)>>>0);++k
if(!(k<6))return A.a(q,k)
k=q[k]
o&2&&A.b(h)
i=h.length
if(!(l<i))return A.a(h,l)
h[l]=k
k=l+1
j=q[j]
if(!(m<4))return A.a(r,m)
m=r[m]
if(!(k<i))return A.a(h,k)
h[k]=j-m}},
ht(f0,f1,f2,f3,f4,f5,f6,f7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0=this,e1=e0.a.ay,e2=e1.a,e3=e1.d,e4=f5===0,e5=e4?1:0,e6=e5-1,e7=f6.a,e8=e7[1],e9=B.a.P(e8*e8,4)
e8=A.uw(f5,B.K[e5],f4)
if(!(e8>=0&&e8<1056))return A.a(e2,e8)
s=e2[e8]
for(e8=f0.length,r=15;r>=e5;--r){q=f1+B.ao[r]
if(!(q<e8))return A.a(f0,q)
q=f0[q]
if(q*q>e9){e6=r
break}}if(e6<15)++e6
p=A.bd(0,s)*f7
o=f4===0?A.bd(1,s):0
for(q=e0.CW,n=o*f7,m=e0.cx,l=f5*16,k=(l+e5)*3+f4,j=m.$flags|0,i=0;i<=1;++i){B.c.i(q,i,n)
if(!(k>=0&&k<192))return A.a(e3,k)
h=e3[k]
j&2&&A.b(m)
m[i]=h}for(n=e0.ay,k=n.$flags|0,h=e0.ch,g=h.$flags|0,f=e0.ax,e=f.$flags|0,d=e1.e,c=d.length,b=e1.c,a=0*f7,a0=f5*8,a1=f6.e,a2=f6.b,r=e5,a3=-1,a4=-1,a5=-1,a6=0,a7=2;r<=e6;r=b9,a8=a7,a7=a6,a6=a8){a9=B.ao[r]
if(!(a9<16))return A.a(e7,a9)
b0=e7[a9]
b1=a2[a9]
b2=f1+a9
if(!(b2<e8))return A.a(f0,b2)
b3=f0[b2]
b2=b3<0
b4=b2?1:0
b2=b2?-b3:b3
b5=b2+a1[a9]
b2=b5*b1
b6=B.a.j(b2,17)
b7=B.a.j(b2+65536,17)
if(b7>2047)b7=2047
if(b6>2047)b6=2047
for(b2=b5*b5,b8=r<15,b9=r+1,c0=r*2,c1=(l+r+1)*3,i=0;i<=1;++i){c2=c0+i
c3=b6+i
c4=c3>2?2:c3
c5=B.K[b9]
c6=a7+i
if(b8){c7=c1+c4
if(!(c7<192))return A.a(e3,c7)
c7=e3[c7]}else c7=0
j&2&&A.b(m)
if(!(c6>=0&&c6<4))return A.a(m,c6)
m[c6]=c7
if(c3>b7){B.c.i(q,c6,1125899906842624)
continue}c8=b5-c3*b0
c7=B.lU[a9]
if(!(a6>=0&&a6<4))return A.a(m,a6)
c9=m[a6]
if(!(c3<c))return A.a(d,c3)
d0=d[c3]
d1=c3>67
c9+=d1?67:c3
if(!(c9>=0&&c9<6528))return A.a(b,c9)
c9=b[c9]
d2=q[a6]+(d0+c9)*f7
for(d3=0,d4=1;d4<=1;++d4){c9=a6+d4
if(!(c9<4))return A.a(m,c9)
d5=m[c9]
d5+=d1?67:c3
if(!(d5>=0&&d5<6528))return A.a(b,d5)
d5=b[d5]
d6=q[c9]+(d0+d5)*f7
if(d6<d2){d3=d4
d2=d6}}d2+=a+256*(c7*(c8*c8-b2))
k&2&&A.b(n)
if(!(c2<32))return A.a(n,c2)
n[c2]=b4
g&2&&A.b(h)
h[c2]=c3
e&2&&A.b(f)
f[c2]=d3
B.c.i(q,c6,d2)
if(c3!==0&&d2<p){if(b8){c6=((a0+c5)*3+c4)*11
if(!(c6<1056))return A.a(e2,c6)
c6=e2[c6]
if(!(c6<256))return A.a(B.n,c6)
d7=B.n[c6]}else d7=0
d6=d2+d7*f7
if(d6<p){p=d6
a5=d3
a4=i
a3=r}}}}q=f1+16
m=f3+16
if(e4){B.y.V(f0,f1+1,q,0)
B.y.V(f2,f3+1,m,0)}else{B.y.V(f0,f1,q,0)
B.y.V(f2,f3,m,0)}if(a3===-1)return 0
e4=a3*2+a4
e&2&&A.b(f)
if(!(e4>=0&&e4<32))return A.a(f,e4)
f[e4]=a5
for(e4=f2.$flags|0,q=f0.$flags|0,r=a3,c2=a4,d8=0;r>=e5;--r){d9=r*2+c2
if(!(d9>=0&&d9<32))return A.a(h,d9)
c3=h[d9]
if(!(r<16))return A.a(B.ao,r)
a9=B.ao[r]
m=f3+r
l=n[d9]!==0?-c3:c3
e4&2&&A.b(f2)
if(!(m<f2.length))return A.a(f2,m)
f2[m]=l
d8=(d8|c3)>>>0
l=f1+a9
m=f2[m]
if(!(a9<16))return A.a(e7,a9)
k=e7[a9]
q&2&&A.b(f0)
if(!(l<e8))return A.a(f0,l)
f0[l]=m*k
c2=f[d9]}return d8!==0?1:0},
kZ(a){var s,r,q,p,o,n,m,l,k,j=this.a.ay,i=this.b
i.da()
s=this.Q
s.a=0
s.c=1
s.cf(a.f,0)
r=i.dx
i=i.dy
q=A.nu(j,s,r[8]+i[8])
s.a=1
s.c=0
for(p=a.r,o=0;o<4;++o)for(n=o*4,m=0;m<4;++m){l=r[m]
k=i[o]
s.cf(p,(m+n)*16)
q+=A.nu(j,s,l+k)
l=s.b>=0?1:0
i.$flags&2&&A.b(i)
i[o]=l
r.$flags&2&&A.b(r)
r[m]=l}return q},
l_(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=this.a.ay,d=this.b
d.da()
s=this.Q
s.a=0
s.c=2
for(r=d.dx,d=d.dy,q=a.w,p=0,o=0;o<=2;o+=2)for(n=4+o,m=o*2,l=0;l<2;++l)for(k=n+l,j=l*2,i=0;i<2;++i){h=n+i
g=r[h]
f=d[k]
s.cf(q,(m+i+j)*16)
p+=A.nu(e,s,g+f)
g=s.b>=0?1:0
d.$flags&2&&A.b(d)
d[k]=g
r.$flags&2&&A.b(r)
r[h]=g}return p},
lz(a3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1=this,a2=a1.a.ch
a2===$&&A.c()
a2=a2.b
s=a1.b
r=s.a.x
r===$&&A.c()
q=s.x
if(!(q<r.length))return A.a(r,q)
q=r[q]
if(!(q<4))return A.a(a2,q)
p=a2[q]
o=p.y
n=p.ax
m=a1.f
q=s.d
l=A.rc(q,0)
a2=n!==0
if(a2)a1.ll()
a3.x=-1
for(k=a3,j=0;j<4;++j){i=s.f
m.x=j
m.as=a1.eE(m,i,j)
m.a=A.jw(q,0,i,0,16,16)
m.b=a2?n*a1.kC(i)+128>>>8:0
m.c=B.cQ[j]
m.d=a1.kZ(m)
if(l){l=A.oM(m.r,0,16,0)
if(l){m.a*=2
m.b*=2}}r=(m.d+m.c)*o+256*(m.a+m.b)
m.e=r
if(j===0||r<k.e){h=s.e
s.e=s.f
s.f=h
g=k
k=m
m=g}}if(k!==a3){a3.dO(k)
B.y.bB(a3.f,0,k.f)
B.y.bB(a3.r,0,k.r)
B.y.bB(a3.w,0,k.w)
a3.x=k.x
B.d.bB(a3.y,0,k.y)
a3.z=k.z}A.oF(p.as,a3)
s.cM(a3.x)
if((a3.as&16842751)===16777216&&a3.a>p.x){a2=a3.f
f=a2[1]
e=a2[2]
d=a2[4]
c=f<0?-f:f
b=e<0?-e:e
a=d<0?-d:d
a0=b>c?b:c
if(a>a0)a0=a
if(a0>p.w)p.w=a0}},
kC(a){var s,r,q,p,o
for(s=this.as,r=0,q=0;q<16;++q){p=s[q]
o=A.n2(a,B.p[q])-p
r+=B.a.j(o<0?-o:o,5)}return r},
fL(a){var s,r,q,p,o=this.a,n=o.e,m=this.b,l=m.db,k=l&3,j=l>>>2
if(k===0){s=o.z
s===$&&A.c()
r=m.y+j*n-1
if(!(r>=0&&r<s.length))return A.a(s,r)
q=s[r]}else{s=l-1
if(!(s>=0&&s<16))return A.a(a,s)
q=a[s]}if(j===0){o=o.z
o===$&&A.c()
m=m.y-n+k
if(!(m>=0&&m<o.length))return A.a(o,m)
p=o[m]}else{o=l-4
if(!(o>=0&&o<16))return A.a(a,o)
p=a[o]}if(!(p<10))return A.a(B.dm,p)
o=B.dm[p]
if(!(q<10))return A.a(o,q)
return o[q]},
lA(b9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6=this,b7=b6.a,b8=b7.ch
b8===$&&A.c()
b8=b8.b
s=b6.b
r=s.a.x
r===$&&A.c()
q=s.x
if(!(q<r.length))return A.a(r,q)
q=r[q]
if(!(q<4))return A.a(b8,q)
p=b8[q]
o=p.z
n=p.ax
m=b6.w
if(b7.dx===0)return!1
m.eQ()
m.c=211
A.oF(p.as,m)
s.e2()
b8=b9.y
l=s.r
r=b6.r
q=b8.$flags|0
k=s.dx
j=s.dy
i=b6.z
h=b6.cy
g=b6.Q
f=b7.ay
e=n!==0
d=s.d
c=m.r
b=j.$flags|0
a=k.$flags|0
a0=0
do{a1=s.db
if(!(a1<16))return A.a(B.p,a1)
a2=B.p[a1]
a3=b6.fL(b8)
a4=s.f
a1=s.db
if(!(a1<16))return A.a(B.p,a1)
a5=B.p[a1]
r.eQ()
b6.ev()
a6=e?A.n2(d,a2):0
for(a7=l,a8=-1,a9=1672,b0=0;b0<10;++b0){i.as=B.a.O(b6.eF(h,0,a2,a7,a9,b0),s.db)
i.a=A.xK(d,a2,a7,a9)
if(e){b1=A.n2(a7,a9)-a6
a1=n*B.a.j(b1<0?-b1:b1,5)+128>>>8}else a1=0
i.b=a1
i.c=a3[b0]
a1=b0>0&&A.oM(h,0,1,3)?140:0
i.d=a1
b2=(a1+i.c)*o+256*(i.a+i.b)
i.e=b2
if(a8>=0&&b2>=r.e)continue
b2=s.db
b3=b2>>>2
g.a=0
g.c=3
g.cf(h,0)
b2=k[b2&3]
if(!(b3<9))return A.a(j,b3)
b2=a1+A.nu(f,g,b2+j[b3])
i.d=b2
b2=(b2+i.c)*o+256*(i.a+i.b)
i.e=b2
if(a8<0||b2<r.e){r.dO(i)
a1=s.db*16
B.y.aa(c,a1,a1+16,h)
a8=b0
b4=a9
a9=a5
a5=b4
b4=a7
a7=a4
a4=b4}}A.oF(p.as,r)
m.hL(r)
if(m.e>=b9.e)return!1
a0+=r.c
if(a0>b7.dx)return!1
a1=s.f
if(a4===a1){b2=s.db
if(!(b2<16))return A.a(B.p,b2)
b2=a5!==B.p[b2]}else b2=!0
if(b2){b2=s.db
if(!(b2<16))return A.a(B.p,b2)
A.xs(a4,a5,a1,B.p[b2])}a1=s.db
q&2&&A.b(b8)
if(!(a1<16))return A.a(b8,a1)
b8[a1]=a8
b2=a1>>>2
b5=r.as!==0?1:0
b&2&&A.b(j)
if(!(b2<9))return A.a(j,b2)
j[b2]=b5
a&2&&A.b(k)
k[a1&3]=b5}while(s.eV(s.f,0))
b9.dO(m)
s.e_(b8)
s.fa()
B.y.bB(b9.r,0,c)
return!0},
lB(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this,e=f.a,d=e.ch
d===$&&A.c()
d=d.b
s=f.b
r=s.a.x
r===$&&A.c()
q=s.x
if(!(q<r.length))return A.a(r,q)
q=r[q]
if(!(q<4))return A.a(d,q)
p=d[q].Q
o=f.y
n=s.e
m=s.f
a.z=-1
o.eQ()
for(d=f.x,r=s.d,q=d.w,l=a.w,k=a.Q,j=d.Q,i=0;i<4;++i){d.as=f.eG(d,m,i)
d.a=A.jw(r,16,m,16,16,8)
d.b=0
d.c=B.cK[i]
d.d=f.l_(d)
if(i>0&&A.oM(q,0,8,2))d.d+=1120
h=(d.d+d.c)*p+256*(d.a+d.b)
d.e=h
if(i===0||h<o.e){o.dO(d)
a.z=i
B.y.bB(l,0,q)
h=e.ax
h===$&&A.c()
if(h!=null)B.O.bB(k,0,j)
g=m
m=n
n=g}}s.e0(a.z)
a.hL(o)
d=s.e
if(n!==d)A.xr(n,16,d,16)
e=e.ax
e===$&&A.c()
if(e!=null)f.mz(a)},
mt(a){var s,r,q,p,o,n,m,l,k=this,j=k.b,i=j.a,h=i.f
h===$&&A.c()
s=j.x
if(!(s<h.length))return A.a(h,s)
r=k.a
if(h[s]===1){h=j.e
r=r.z
r===$&&A.c()
s=j.y
if(!(s<r.length))return A.a(r,s)
q=k.eE(a,h,r[s])}else{j.e2()
h=r.e
s=a.r
q=0
do{p=r.z
p===$&&A.c()
o=j.y
n=j.db
o=o+(n&3)+(n>>>2)*h
if(!(o<p.length))return A.a(p,o)
m=p[o]
if(!(n<16))return A.a(B.p,n)
l=B.p[n]
k.ev()
q|=B.a.O(k.eF(s,j.db*16,l,j.e,l,m),j.db)}while(j.eV(j.e,0))}h=j.e
i=i.r
i===$&&A.c()
j=j.x
if(!(j<i.length))return A.a(i,j)
a.as=(q|k.eG(a,h,i[j]))>>>0},
mh(a8,a9,b0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6=this,a7=1125899906842624
if(!b0){s=a6.b
r=s.a.f
r===$&&A.c()
s=s.x
if(!(s<r.length))return A.a(r,s)
q=r[s]===1}else q=!0
s=a6.a
r=s.ch
r===$&&A.c()
r=r.b
p=a6.b
o=p.a
n=o.x
n===$&&A.c()
m=p.x
if(!(m<n.length))return A.a(n,m)
m=n[m]
if(!(m<4))return A.a(r,m)
l=r[m].cx
k=b0?s.dy:a7
j=a7
if(q){for(r=p.d,n=p.r,i=-1,h=0;h<4;++h){m=A.jw(r,0,n,B.aS[h],16,16)
g=B.cQ[h]
f=m*256+g*106
if(h>0&&g>k)continue
if(f<j){i=h
j=f}}if(p.b===0||p.c===0)if(A.rc(r,0)){i=p.b===0?0:2
e=!1}else e=b0
else e=b0
p.cM(i)}else e=b0
d=0
if(e||!q){p.e2()
r=a8.y
n=a8.r
m=r.$flags|0
g=p.d
c=p.r
b=0
do{a=p.db
if(!(a<16))return A.a(B.p,a)
a0=B.p[a]
a1=a6.fL(r)
a6.ev()
for(a2=a7,a3=-1,h=0;h<10;++h){f=A.jw(g,a0,c,B.bL[h],4,4)*256+a1[h]*11
if(f<a2){a2=f
a3=h}}if(!(a3>=0&&a3<10))return A.a(a1,a3)
b+=a1[a3]
a=p.db
m&2&&A.b(r)
if(!(a<16))return A.a(r,a)
r[a]=a3
l+=a2
q=l>=j||b>k
if(q)break
a4=B.p[a]
d|=B.a.O(a6.eF(n,a*16,a0,p.f,a4,a3),p.db)}while(p.eV(p.f,0))}if(!q){p.e_(a8.y)
p.fa()
j=l}else{r=p.e
s=s.z
s===$&&A.c()
n=p.y
if(!(n<s.length))return A.a(s,n)
d=a6.eE(a8,r,s[n])}if(a9){for(s=p.d,r=p.r,a5=a7,i=-1,h=0;h<4;++h){f=A.jw(s,16,r,B.aT[h],16,8)*256+B.cK[h]*120
if(f<a5){a5=f
i=h}}p.e0(i)}s=p.e
o=o.r
o===$&&A.c()
p=p.x
if(!(p<o.length))return A.a(o,p)
a8.as=(d|a6.eG(a8,s,o[p]))>>>0
a8.e=j}}
A.iY.prototype={
cf(a,b){var s,r,q,p=this
p.d=a
p.e=b
p.b=-1
for(s=a.length,r=15;r>=0;--r){q=b+r
if(!(q<s))return A.a(a,q)
if(a[q]!==0){p.b=r
break}}}}
A.mq.prototype={
fi(a,b,c){var s,r,q,p,o,n,m,l,k,j,i,h,g,f
for(s=this.d,r=s.$flags|0,q=0;q<=31;++q){r&2&&A.b(s)
s[q]=0}for(p=this.c,o=this.b,n=o.d,o=o.r,m=b;m<c;++m){l=$.rV()
if(!(m<24))return A.a(l,m)
k=l[m]
A.ho(n,(m<16?0:16)+k,o,a+k,p,0)
for(q=0;q<16;++q){l=p[q]
j=B.a.j(l<0?-l:l,3)
l=j>31?31:j
i=s[l]
r&2&&A.b(s)
s[l]=i+1}}for(h=0,g=1,q=0;q<=31;++q){f=s[q]
if(f>0){if(f>h)h=f
g=q}}return h>1?B.a.Z(510*g,h):0},
jx(){var s,r,q,p,o,n=this.b,m=n.geZ(),l=n.b!==0?n.ay:null
if(n.c!==0){s=n.at
s===$&&A.c()}else s=null
A.xZ(n.r,m,l,1,s,n.Q)
for(r=-1,q=0,p=0;p<2;++p){o=this.fi(B.aS[p],0,16)
if(o>r){q=p
r=o}}n.cM(q)
return r},
jy(){var s,r,q,p,o,n,m=this.b,l=m.geZ(),k=m.b!==0?m.ch:null
if(m.c!==0){s=m.ax
s===$&&A.c()}else s=null
A.rh(m.r,l,k,1,s,m.as)
for(r=-1,q=0,p=0,o=0;o<2;++o){n=this.fi(B.aT[o],16,24)
if(n>r)r=n
if(o===0||n<q){p=o
q=n}}m.e0(p)
return r},
kP(){var s,r,q,p,o,n=B.a.P(9*B.b.h(this.a.a.a),100),m=new Uint32Array(16)
for(s=this.b,r=s.d,q=0;q<16;q+=4)A.xW(r,q*32,m,q)
for(p=0,o=0,q=0;q<16;++q){r=m[q]
p+=r
o+=r*r}if((8+n)*o<p*p)s.cM(0)
else s.e_(new Uint8Array(16))
return 0}}
A.lw.prototype={
nV(){var s,r,q,p,o=this,n=o.e,m=1+n,l=m-n
for(s=4*o.c,r=o.z,q=-1;q<s;++q){r===$&&A.c()
p=l+q
r.$flags&2&&A.b(r)
if(!(p>=0&&p<r.length))return A.a(r,p)
r[p]=0}for(s=4*o.d,--m,q=0;q<s;++q){r===$&&A.c()
p=m+q*n
r.$flags&2&&A.b(r)
if(!(p<r.length))return A.a(r,p)
r[p]=0}n=o.Q
n===$&&A.c()
n.$flags&2&&A.b(n)
if(0>=n.length)return A.a(n,0)
n[0]=0}}
A.lU.prototype={
gp(a){return this.b},
aI(a){var s=this,r=s.b,q=s.a,p=q.length
if(r===p){p=new Uint16Array(p*2)
B.v.aa(p,0,r,q)
s.a=p
r=p}else r=q
q=s.b++
r.$flags&2&&A.b(r)
if(!(q<r.length))return A.a(r,q)
r[q]=a},
mT(a,b,c,d){this.aI((c<<15|d)>>>0)
return b.b_(c,d)},
nf(a,b){var s,r,q,p
for(s=0;s<this.b;++s){r=this.a
if(!(s<r.length))return A.a(r,s)
q=r[s]
p=q>>>15&1
if((q&16384)!==0)a.aK(p,q&255)
else{r=q&16383
if(!(r<1056))return A.a(b,r)
a.aK(p,b[r])}}}}
A.lF.prototype={}
A.lQ.prototype={}
A.lT.prototype={}
A.fM.prototype={}
A.lR.prototype={}
A.lz.prototype={}
A.c1.prototype={}
A.fT.prototype={}
A.iX.prototype={}
A.fU.prototype={}
A.fW.prototype={}
A.lV.prototype={}
A.mR.prototype={
$0(){var s,r,q=new Uint16Array(256)
for(s=0;s<=255;++s){r=B.b.h(Math.pow(s/255,0.8)*4095+0.5)
if(!(s<256))return A.a(q,s)
q[s]=r}return q},
$S:32}
A.mX.prototype={
$0(){var s,r,q=new Int32Array(33)
for(s=0;s<=32;++s){r=B.b.h(255*Math.pow(0.03125763125763126*s,1.25)+0.5)
if(!(s<33))return A.a(q,s)
q[s]=r}return q},
$S:17}
A.mW.prototype={
$0(){var s,r,q=new Int32Array(1021)
for(s=1;s<1021;++s){r=B.a.Z(524288,s)
if(!(s<1021))return A.a(q,s)
q[s]=r}return q},
$S:17}
A.fP.prototype={
d4(){var s,r,q,p,o=this,n=o.b
if(n.aq(8)!==47)return!1
s=n.aq(14)+1
r=n.aq(14)+1
q=n.aq(1)
o.dy=s
o.fr=r
p=o.c
p.f=B.bc
p.a=s
p.b=r
p.d=q!==0
if(n.aq(3)!==0)return!1
return!0},
bZ(){var s,r,q,p,o,n,m=this,l=null
m.f=0
if(!m.d4())return l
m.cP(m.dy,m.fr,!0)
m.fh(m.dy)
s=m.dy
m.d=A.Z(l,l,B.e,0,B.l,m.fr,l,0,4,l,B.e,s,!1)
s=m.cx
s.toString
r=m.c
q=r.a
p=r.b
if(!m.ec(s,q,p,p,m.glK()))return l
s=r.w
if(s.length!==0){o=A.v(new A.an(s),!1,l,0)
s=m.d
s.toString
s.e=A.nP(o)}n=r.r
if(n!=null)m.d.c=new A.cj("ICC_PROFILE",B.ai,n)
return m.d},
fh(a){var s,r=this,q=r.c
q=q.a*q.b+a
s=new Uint32Array(q+a*16)
r.cx=s
r.cy=J.F(B.q.gt(s),0,null)
r.db=q
return!0},
me(a){var s,r,q,p,o,n,m,l=this
t.L.a(a)
s=l.b
r=s.aq(2)
q=l.CW
p=B.a.O(1,r)
if((q&p)>>>0!==0)return!1
l.CW=(q|p)>>>0
o=new A.iW(B.dU)
B.c.E(l.ch,o)
if(!(r<4))return A.a(B.du,r)
q=B.du[r]
o.a=q
o.b=a[0]
o.c=a[1]
switch(q.a){case 0:case 1:s=s.aq(3)+2
o.e=s
o.d=l.cP(A.cy(o.b,s),A.cy(o.c,o.e),!1)
break
case 3:n=s.aq(8)+1
if(n>16)m=0
else if(n>4)m=1
else{s=n>2?2:3
m=s}B.c.i(a,0,A.cy(o.b,m))
o.e=m
o.d=l.cP(n,1,!1)
l.kK(n,o)
break
case 2:break}return!0},
cP(a,b,c){var s,r,q,p,o,n,m,l,k=this
if(c)for(s=k.b,r=t.t,q=b,p=a;s.aq(1)!==0;){o=A.j([p,q],r)
if(!k.me(o))throw A.e(A.k("Invalid Transform"))
p=o[0]
q=o[1]}else{q=b
p=a}s=k.b
if(s.aq(1)!==0){n=s.aq(4)
if(!(n>=1&&n<=11))throw A.e(A.k("Invalid Color Cache"))}else n=0
if(!k.m1(p,q,n,c))throw A.e(A.k("Invalid Huffman Codes"))
if(n>0){s=B.a.O(1,n)
k.w=s
k.x=new A.lJ(new Uint32Array(s),32-n)}else k.w=0
s=k.c
s.a=p
s.b=q
m=k.z
k.Q=A.cy(p,m)
k.y=m===0?4294967295:B.a.O(1,m)-1
if(c){k.f=0
return null}l=new Uint32Array(p*q)
if(!k.ec(l,p,q,q,null))throw A.e(A.k("Failed to decode image data."))
k.f=0
return l},
ec(b6,b7,b8,b9,c0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4=this,b5=506832829
t.ec.a(c0)
s=b4.f
r=B.a.Z(s,b7)
q=B.a.a1(s,b7)
p=b7*b8
o=b7*b9
if(s>=o){if(c0!=null)c0.$2(b9,!1)
return!0}n=b4.fN(q,r)
m=b4.w
l=280+m
k=m>0?b4.x:null
j=b4.y
for(m=b6.length,i=b4.b,h=c0!=null,g=b6.$flags|0,f=s;f<o;){if((q&j)>>>0===0){e=b4.cR(b4.as,b4.Q,b4.z,q,r)
d=b4.ax
if(!(e<d.length))return A.a(d,e)
n=d[e]}c=0
if(n.d){d=n.c
g&2&&A.b(b6)
if(!(f>=0&&f<m))return A.a(b6,f)
b6[f]=d;++f;++q
if(q>=b7){++r
if(h&&r<=b9)c0.$2(r,!0)
if(k!=null)for(d=k.a,b=k.b,a=d.$flags|0;s<f;){if(!(s>=0&&s<m))return A.a(b6,s)
a0=b6[s]
a1=B.a.a4(A.cC(a0,b5),b)
a&2&&A.b(d)
if(!(a1<d.length))return A.a(d,a1)
d[a1]=a0;++s}q=c}continue}if(i.a>=32)i.cm()
if(n.e){a2=i.dc()&63
d=n.f
if(!(a2<d.length))return A.a(d,a2)
a3=d[a2]
d=a3.a
b=i.a
if(d<256){i.a=b+d
d=a3.b
g&2&&A.b(b6)
if(!(f>=0&&f<m))return A.a(b6,f)
b6[f]=d
a4=0}else{i.a=b+(d-256)
a4=a3.b}if(i.b)break
if(a4===0){++f;++q
if(q>=b7){++r
if(h&&r<=b9)c0.$2(r,!0)
if(k!=null)for(d=k.a,b=k.b,a=d.$flags|0;s<f;){if(!(s>=0&&s<m))return A.a(b6,s)
a0=b6[s]
a1=B.a.a4(A.cC(a0,b5),b)
a&2&&A.b(d)
if(!(a1<d.length))return A.a(d,a1)
d[a1]=a0;++s}q=c}continue}}else a4=n.cq(0,i)
if(a4<256){if(n.b){d=n.c
g&2&&A.b(b6)
if(!(f>=0&&f<m))return A.a(b6,f)
b6[f]=(d|a4<<8)>>>0}else{a5=n.cq(1,i)
if(i.a>=32)i.cm()
a6=A.rn(n.cq(2,i),a4,a5,n.cq(3,i))
g&2&&A.b(b6)
if(!(f>=0&&f<m))return A.a(b6,f)
b6[f]=a6}++f;++q
if(q>=b7){++r
if(h&&r<=b9)c0.$2(r,!0)
if(k!=null)for(d=k.a,b=k.b,a=d.$flags|0;s<f;){if(!(s>=0&&s<m))return A.a(b6,s)
a0=b6[s]
a1=B.a.a4(A.cC(a0,b5),b)
a&2&&A.b(d)
if(!(a1<d.length))return A.a(d,a1)
d[a1]=a0;++s}q=c}}else if(a4<280){a7=b4.dE(a4-256)
a8=n.cq(4,i)
if(i.a>=32)i.cm()
a9=b4.h4(b7,b4.dE(a8))
if(f<a9||p-f<a7)return!1
else{b0=f-a9
for(b1=0;b1<a7;++b1){d=f+b1
b=b0+b1
if(!(b>=0&&b<m))return A.a(b6,b)
b=b6[b]
g&2&&A.b(b6)
if(!(d>=0&&d<m))return A.a(b6,d)
b6[d]=b}}f+=a7
q+=a7
while(q>=b7){q-=b7;++r
if(h&&r<=b9)c0.$2(r,!0)}if((q&j)>>>0!==0){e=b4.cR(b4.as,b4.Q,b4.z,q,r)
d=b4.ax
if(!(e<d.length))return A.a(d,e)
n=d[e]}if(k!=null)for(d=k.a,b=k.b,a=d.$flags|0;s<f;){if(!(s>=0&&s<m))return A.a(b6,s)
a0=b6[s]
a1=B.a.a4(A.cC(a0,b5),b)
a&2&&A.b(d)
if(!(a1<d.length))return A.a(d,a1)
d[a1]=a0;++s}}else if(a4<l){b2=a4-280
while(s<f){k.toString
if(!(s>=0&&s<m))return A.a(b6,s)
d=b6[s]
b=k.a
a=B.a.a4(A.cC(d,b5),k.b)
b.$flags&2&&A.b(b)
if(!(a<b.length))return A.a(b,a)
b[a]=d;++s}d=k.a
b=d.length
if(!(b2<b))return A.a(d,b2)
a=d[b2]
g&2&&A.b(b6)
if(!(f>=0&&f<m))return A.a(b6,f)
b6[f]=a;++f;++q
if(q>=b7){++r
if(h&&r<=b9)c0.$2(r,!0)
for(a=k.b,a0=d.$flags|0;s<f;){if(!(s>=0&&s<m))return A.a(b6,s)
a1=b6[s]
b3=B.a.a4(A.cC(a1,b5),a)
a0&2&&A.b(d)
if(!(b3<b))return A.a(d,b3)
d[b3]=a1;++s}q=c}}else return!1}if(h)c0.$2(r>b9?b9:r,!1)
b4.f=f
return!0},
lh(){var s,r,q,p,o,n,m,l
if(this.w>0)return!1
for(s=this.at,r=this.ax,q=r.length,p=0;p<s;++p){if(!(p<q))return A.a(r,p)
o=r[p].a
n=o.length
if(1>=n)return A.a(o,1)
m=o[1]
l=m.a
m=m.b
if(!(m<l.length))return A.a(l,m)
if(l[m].a>0)return!1
if(2>=n)return A.a(o,2)
m=o[2]
l=m.a
m=m.b
if(!(m<l.length))return A.a(l,m)
if(l[m].a>0)return!1
if(3>=n)return A.a(o,3)
n=o[3]
m=n.a
n=n.b
if(!(n<m.length))return A.a(m,n)
if(m[n].a>0)return!1}return!0},
kN(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g=this
if(b&&B.a.a1(a,16)!==0)return
s=g.r
r=a-s
q=g.dy
p=q*s
while(r>0){o=r>16?16:r
n=q*o
m=q*s
l=g.db
g.fj(s,o,p)
for(q=g.dx,k=g.cx,j=0;j<n;++j){q.toString
i=m+j
h=l+j
if(!(h<k.length))return A.a(k,h)
h=k[h]
q.$flags&2&&A.b(q)
if(!(i>=0&&i<q.length))return A.a(q,i)
q[i]=h>>>8&255}r-=o
q=g.dy
p+=o*q
s+=o}g.r=a},
k7(a0,a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this,e=f.f,d=B.a.Z(e,a0),c=B.a.a1(e,a0),b=a0*a1,a=a0*a2
if(e>=a){f.dC(d)
return!0}s=f.fN(c,d)
r=f.y
q=f.b
for(;;){if(!(!q.b&&e<a))break
if((c&r)>>>0===0){p=f.cR(f.as,f.Q,f.z,c,d)
o=f.ax
if(!(p<o.length))return A.a(o,p)
s=o[p]}if(q.a>=32)q.cm()
n=s.cq(0,q)
if(n<256){o=f.cy
o===$&&A.c()
o.$flags&2&&A.b(o)
if(!(e>=0&&e<o.length))return A.a(o,e)
o[e]=n;++e;++c
if(c>=a0){++d
if(B.a.a1(d,16)===0)f.dC(d)
c=0}}else if(n<280){m=f.dE(n-256)
l=s.cq(4,q)
if(q.a>=32)q.cm()
k=f.h4(a0,f.dE(l))
if(e>=k&&b-e>=m)for(o=f.cy,j=0;j<m;++j){o===$&&A.c()
i=e+j
h=i-k
g=o.length
if(!(h>=0&&h<g))return A.a(o,h)
h=o[h]
o.$flags&2&&A.b(o)
if(!(i>=0&&i<g))return A.a(o,i)
o[i]=h}else{f.f=e
return!0}e+=m
c+=m
while(c>=a0){c-=a0;++d
if(B.a.a1(d,16)===0)f.dC(d)}if(e<a&&(c&r)>>>0!==0){p=f.cR(f.as,f.Q,f.z,c,d)
o=f.ax
if(!(p<o.length))return A.a(o,p)
s=o[p]}}else return!1}f.dC(d)
f.f=e
return!0},
dC(a){var s,r,q,p=this,o=p.r,n=a-o,m=p.cy
m===$&&A.c()
s=A.v(m,!1,null,p.c.a*o)
if(n>0){r=p.r
o=p.dx
o.toString
q=A.v(o,!1,null,p.dy*r)
o=p.ch
if(0>=o.length)return A.a(o,0)
o[0].n0(r,r+n,s,q)}p.r=a},
lL(a,b){var s,r,q,p,o,n,m,l,k,j,i,h=this,g=h.c.a,f=h.r
if(b)if(B.a.a1(a,16)!==0)return
s=a-f
if(s<=0){h.r=a
return}h.fj(f,s,g*f)
g=h.cx
g.toString
r=h.d.a0()
f=h.r
q=h.dy
p=f*q*4
for(o=h.db,f=g.length,n=r.$flags|0,m=0;m<s;++m)for(l=0;l<q;++l,++o){if(!(o>=0&&o<f))return A.a(g,o)
k=g[o]
j=p+1
n&2&&A.b(r)
i=r.length
if(!(p>=0&&p<i))return A.a(r,p)
r[p]=k>>>16&255
p=j+1
if(!(j>=0&&j<i))return A.a(r,j)
r[j]=k>>>8&255
j=p+1
if(!(p>=0&&p<i))return A.a(r,p)
r[p]=k&255
p=j+1
if(!(j>=0&&j<i))return A.a(r,j)
r[j]=k>>>24&255}h.r=a},
fj(a,b,c){var s,r=this,q=r.ch,p=q.length,o=r.c.a,n=a+b,m=r.db,l=r.cx
l.toString
B.q.a3(l,m,m+o*b,l,c)
for(;s=p-1,p>0;p=s){if(!(s>=0&&s<q.length))return A.a(q,s)
o=q[s]
l=r.cx
l.toString
o.nA(a,n,l,m,l,m)}},
m1(a,b,a0,a1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=this,d=1,c=null
if(a1&&e.b.aq(1)!==0){s=2+e.b.aq(3)
r=A.cy(a,s)
q=A.cy(b,s)
p=r*q
o=e.cP(r,q,!1)
if(o==null)return!1
e.z=s
for(n=o.length,m=o.$flags|0,l=d,k=0;k<p;++k){if(!(k<n))return A.a(o,k)
j=o[k]>>>8&65535
m&2&&A.b(o)
o[k]=j
if(j>=l)l=j+1}if(l>1000||l>a*b){c=new Int32Array(1)
B.t.V(c,0,1,255)
for(d=0,k=0;k<p;++k){if(!(k<n))return A.a(o,k)
i=o[k]
if(!(i<1))return A.a(c,i)
if(c[i]===-1){h=d+1
c[i]=d
d=h}g=c[i]
m&2&&A.b(o)
o[k]=g}}else d=l}else{o=null
l=1}if(e.b.b)return!1
f=e.m2(a0,d,l,c)
if(f==null)return!1
e.as=o
e.at=d
e.ax=f
return!0},
eH(a,b,c,d,e,f){var s,r=a.a,q=a.b,p=d
do{p-=c
s=q+(b+p)
if(!(s>=0&&s<r.length))return A.a(r,s)
s=r[s]
s.a=e
s.b=f}while(p>0)},
lm(a,b,c){var s=B.a.U(1,b-c)
while(b<15){s-=a[b]
if(s<=0)break;++b
s=s<<1>>>0}return b-c},
fR(a,b){var s=B.a.U(1,b-1)
while((a&s)>>>0!==0)s=s>>>1
return s!==0?((a&s-1)>>>0)+s:a},
fo(a5,a6,a7,a8,a9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1=this,a2=B.a.O(1,a6),a3=new Int32Array(16),a4=new Int32Array(16)
for(s=a7.length,r=0;r<a8;++r){if(!(r<s))return A.a(a7,r)
q=a7[r]
if(q>15)return 0
if(!(q>=0))return A.a(a3,q)
a3[q]=a3[q]+1}if(a3[0]===a8)return 0
a4[1]=0
for(p=1;p<15;p=o){q=a3[p]
if(q>B.a.O(1,p))return 0
o=p+1
a4[o]=a4[p]+q}for(q=a9!=null,r=0;r<a8;++r){if(!(r<s))return A.a(a7,r)
n=a7[r]
if(n>0)if(q){if(!(n<16))return A.a(a4,n)
m=a4[n]
if(m>=a8)return 0
a4[n]=m+1
a9.$flags&2&&A.b(a9)
if(!(m>=0&&m<a9.length))return A.a(a9,m)
a9[m]=r}else{if(!(n<16))return A.a(a4,n)
a4[n]=a4[n]+1}}if(a4[15]===1){if(q){a5.toString
if(0>=a9.length)return A.a(a9,0)
a1.eH(a5,0,1,a2,0,a9[0])}return a2}l=a2-1
for(s=a5==null,k=0,j=1,i=1,r=0,p=1,h=2;p<=a6;++p,h=h<<1>>>0){i=i<<1>>>0
j+=i
if(!(p<16))return A.a(a3,p)
i-=a3[p]
if(i<0)return 0
if(s)continue
for(g=p&255;a3[p]>0;a3[p]=a3[p]-1,r=f){f=r+1
if(!(r>=0&&r<a9.length))return A.a(a9,r)
a1.eH(a5,k,h,a2,g,a9[r])
k=a1.fR(k,p)}}for(p=a6+1,s=!s,e=a2,d=0,c=4294967295,h=2;p<=15;++p,h=h<<1>>>0){i=i<<1>>>0
j+=i
i-=a3[p]
if(i<0)return 0
for(g=p-a6&255;a3[p]>0;a3[p]=a3[p]-1){b=(k&l)>>>0
if(b!==c){if(s)d+=e
a=a1.lm(a3,p,a6)
e=B.a.U(1,a)
a2+=e
if(s){q=a5.a
m=a5.b+b
if(!(m>=0&&m<q.length))return A.a(q,m)
m=q[m]
m.a=a+a6&255
m.b=d-b}c=b}if(s){f=r+1
if(!(r>=0&&r<a9.length))return A.a(a9,r)
a0=a9[r]
a1.eH(a5,d+B.a.a6(k,a6),h,e,g,a0)
r=f}k=a1.fR(k,p)}}if(j!==2*a4[15]-1)return 0
return a2},
hx(a,b,c,d){var s,r,q,p,o,n,m=this.fo(null,b,c,d,null)
if(m===0||a==null)return m
s=a.b
r=s.d
q=s.e
if(r+m>=q){p=new A.eR()
if(m>q)q=m
o=A.nS(q)
p.e=q
p.b=p.a=o
a.b=p
s=p}n=new Uint16Array(d)
this.fo(s.b,b,c,d,n)
return m},
m0(a,b,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=new A.hO(new A.eR())
c.fc(128)
if(this.hx(c,7,a,19)===0)return!1
s=this.b
if(s.aq(1)!==0){r=2+s.aq(2+2*s.aq(3))
if(r>b)return!1}else r=b
for(q=8,p=0;p<b;r=o){o=r-1
if(r===0)break
if(s.a>=32)s.cm()
n=c.b.a
n.toString
m=n.a
n=n.b+(s.dc()&127)
if(!(n<m.length))return A.a(m,n)
l=m[n]
s.a=s.a+l.a
k=l.b
if(k<16){j=p+1
a0.$flags&2&&A.b(a0)
if(!(p>=0&&p<a0.length))return A.a(a0,p)
a0[p]=k
if(k!==0)q=k
p=j}else{i=k-16
if(!(i<3))return A.a(B.cI,i)
h=B.cI[i]
g=B.fV[i]
f=s.aq(h)+g
if(p+f>b)return!1
e=k===16?q:0
for(n=a0.$flags|0;d=f-1,f>0;f=d,p=j){j=p+1
n&2&&A.b(a0)
if(!(p>=0&&p<a0.length))return A.a(a0,p)
a0[p]=e}}}return!0},
hc(a,b,c){var s,r,q,p,o,n,m,l=this.b,k=l.aq(1)
B.t.V(b,0,a,0)
if(k!==0){s=l.aq(1)
r=l.aq(l.aq(1)===0?1:8)
b.$flags&2&&A.b(b)
q=b.length
if(!(r<q))return A.a(b,r)
b[r]=1
if(s+1===2){r=l.aq(8)
if(!(r<q))return A.a(b,r)
b[r]=1}p=!0}else{o=new Int32Array(19)
n=l.aq(4)+4
for(m=0;m<n;++m){if(!(m<19))return A.a(B.b1,m)
s=B.b1[m]
q=l.aq(3)
if(!(s<19))return A.a(o,s)
o[s]=q}p=this.m0(o,a,b)}return p&&!l.b?this.hx(c,8,b,a):0},
ds(a,b,c){var s=c.a,r=a.a
c.a=s+r
c.b=(c.b|B.a.O(a.b,b))>>>0
return r},
jG(a){var s,r,q,p,o,n,m,l,k,j,i=this
for(s=a.a,r=s.length,q=a.f,p=q.length,o=0;o<64;++o){if(!(o<p))return A.a(q,o)
n=q[o]
if(0>=r)return A.a(s,0)
m=s[0]
l=m.a
m=m.b+o
if(!(m<l.length))return A.a(l,m)
k=l[m]
m=k.b
if(m>=256){n.a=k.a+256
n.b=m}else{n.b=n.a=0
j=B.a.a6(o,i.ds(k,8,n))
if(1>=r)return A.a(s,1)
m=s[1]
l=m.a
m=m.b+j
if(!(m<l.length))return A.a(l,m)
j=B.a.a6(j,i.ds(l[m],16,n))
if(2>=r)return A.a(s,2)
m=s[2]
l=m.a
m=m.b+j
if(!(m<l.length))return A.a(l,m)
j=B.a.a6(j,i.ds(l[m],0,n))
if(3>=r)return A.a(s,3)
m=s[3]
l=m.a
m=m.b+j
if(!(m<l.length))return A.a(l,m)
B.a.a6(j,i.ds(l[m],24,n))}}},
m2(a9,b0,b1,b2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5=this,a6=null,a7=a9>0,a8=280+(a7?B.a.O(1,a9):0)
if(!(a9<12))return A.a(B.cX,a9)
s=B.cX[a9]
r=b2==null
if(r&&b0!==b1)return a6
q=new Int32Array(a8)
p=J.aa(b0,t.co)
for(o=0;o<b0;++o)p[o]=A.tK()
n=new A.hO(new A.eR())
n.fc(b0*s)
a5.ay=n
for(n=!r,m=0;m<b1;++m){if(n){if(!(m<b2.length))return A.a(b2,m)
l=b2[m]===-1}else l=!1
if(l)for(k=0;k<5;++k){j=B.d_[k]
if(a5.hc(k===0&&a7?j+B.a.O(1,a9):j,q,a6)===0)return a6}else{if(r)l=m
else{if(!(m<b2.length))return A.a(b2,m)
l=b2[m]}if(!(l>=0&&l<b0))return A.a(p,l)
i=p[l]
h=i.a
for(l=h.length,g=0,f=!0,e=0,k=0;k<5;++k){j=B.d_[k]
if(k===0&&a7)j+=B.a.O(1,a9)
d=a5.hc(j,q,a5.ay)
c=a5.ay.b.b
c.toString
B.c.i(h,k,c)
if(d===0)return a6
if(f&&B.le[k]===1){if(!(k<l))return A.a(h,k)
c=h[k]
b=c.a
c=c.b
if(!(c<b.length))return A.a(b,c)
f=b[c].a===0}if(!(k<l))return A.a(h,k)
c=h[k]
b=c.a
c=c.b
if(!(c<b.length))return A.a(b,c)
e+=b[c].a
c=a5.ay.b
c.d+=d
b=c.b
c.b=new A.eQ(b.a,b.b+d)
if(k<=3){a=q[0]
for(a0=1;a0<j;++a0){if(!(a0<a8))return A.a(q,a0)
a1=q[a0]
if(a1>a)a=a1}g+=a}}i.b=f
i.d=!1
c=!1
if(f){if(1>=l)return A.a(h,1)
b=h[1]
a2=b.a
b=b.b
if(!(b<a2.length))return A.a(a2,b)
a3=a2[b].b
if(2>=l)return A.a(h,2)
b=h[2]
a2=b.a
b=b.b
if(!(b<a2.length))return A.a(a2,b)
a4=a2[b].b
if(3>=l)return A.a(h,3)
l=h[3]
b=l.a
l=l.b
if(!(l<b.length))return A.a(b,l)
l=(b[l].b<<24|a3<<16|a4)>>>0
i.c=l
if(e===0){c=h[0]
b=c.a
c=c.b
if(!(c<b.length))return A.a(b,c)
c=b[c].b<256}if(c){i.d=!0
b=h[0]
a2=b.a
b=b.b
if(!(b<a2.length))return A.a(a2,b)
i.c=(l|a2[b].b<<8)>>>0}l=c}else l=c
l=!l&&g<6
i.e=l
if(l)a5.jG(i)}}return p},
dE(a){var s
if(a<4)return a+1
s=B.a.j(a-2,1)
return B.a.O(2+(a&1),s)+this.b.aq(s)+1},
h4(a,b){var s,r,q
if(b>120)return b-120
else{s=b-1
if(!(s>=0))return A.a(B.d1,s)
r=B.d1[s]
q=(r>>>4)*a+(8-(r&15))
return q>=1?q:1}},
kK(a,b){var s,r,q,p,o,n,m,l,k=B.a.O(1,B.a.a6(8,b.e)),j=new Uint32Array(k),i=b.d
i.toString
s=J.F(B.q.gt(i),0,null)
r=J.F(B.q.gt(j),0,null)
i=b.d
if(0>=i.length)return A.a(i,0)
i=i[0]
if(0>=k)return A.a(j,0)
j[0]=i
q=4*a
for(i=s.length,p=r.length,o=r.$flags|0,n=4;n<q;++n){if(!(n<i))return A.a(s,n)
m=s[n]
l=n-4
if(!(l<p))return A.a(r,l)
l=r[l]
o&2&&A.b(r)
if(!(n<p))return A.a(r,n)
r[n]=m+l&255}for(q=4*k;n<q;++n){o&2&&A.b(r)
if(!(n<p))return A.a(r,n)
r[n]=0}b.d=j
return!0},
cR(a,b,c,d,e){var s
if(c===0||a==null)return 0
s=b*B.a.j(e,c)+B.a.j(d,c)
if(!(s<a.length))return A.a(a,s)
return a[s]},
fN(a,b){var s=this,r=s.cR(s.as,s.Q,s.z,a,b),q=s.ax
if(!(r<q.length))return A.a(q,r)
return q[r]}}
A.i5.prototype={
nm(a,b){return this.kN(a,b)}}
A.lG.prototype={}
A.lH.prototype={
gp(a){return this.c}}
A.lM.prototype={}
A.lO.prototype={}
A.nk.prototype={
$1(a){A.r(a)
return a>=1&&a<this.a},
$S:35}
A.mp.prototype={
jn(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i,h=this,g=h.a,f=1
for(;;){s=B.a.O(1,f)
if(!(s<g&&f<18))break;++f}h.e!==$&&A.B()
h.e=32-f
r=new Int32Array(s)
B.t.V(r,0,s,-1)
h.d!==$&&A.B()
h.d=r
q=h.b
for(s=b.length,r=a.length,p=c.length,o=d.length,n=q.$flags|0,m=0;m<g;++m){if(!(m<s))return A.a(b,m)
l=b[m]
if(!(m<r))return A.a(a,m)
k=a[m]
if(!(m<p))return A.a(c,m)
j=c[m]
if(!(m<o))return A.a(d,m)
i=d[m]
n&2&&A.b(q)
if(!(m<q.length))return A.a(q,m)
q[m]=(l<<24|k<<16|j<<8|i)>>>0}},
nn(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=this,d=e.a
if(d<=2)return
s=e.b
r=e.c
q=e.d
q===$&&A.c()
for(p=d-1,o=s.length,n=e.e,m=q.length,l=r.$flags|0,k=q.$flags|0,j=0;j<p;j=h){if(!(j<o))return A.a(s,j)
i=s[j]
h=j+1
if(!(h<o))return A.a(s,h)
g=A.cC(s[h],3332679571)
i=A.cC(i,1540483478)
n===$&&A.c()
f=B.a.iW(g+i>>>0,n)
if(!(f<m))return A.a(q,f)
i=q[f]
l&2&&A.b(r)
if(!(j<r.length))return A.a(r,j)
r[j]=i
k&2&&A.b(q)
q[f]=j}l&2&&A.b(r)
if(!(p<r.length))return A.a(r,p)
r[p]=-1}}
A.lK.prototype={
gii(){var s,r=this,q=r.f
if(q===$){s=new A.lL(r).$0()
r.f!==$&&A.oR()
r.f=s
q=s}return q},
i4(a,b){var s=A.jv(b,a),r=A.ri(s),q=this.e,p=A.jC(s)
if(!(p>=0&&p<q.length))return A.a(q,p)
return q[p]+r.a}}
A.lL.prototype={
$0(){var s,r,q,p,o,n=new Float64Array(4096)
for(s=this.a.a,r=s.length,q=1;q<=4095;++q){p=A.rd(q)
o=A.jB(q)
if(!(o>=0&&o<r))return A.a(s,o)
o=s[o]
if(!(q<4096))return A.a(n,q)
n[q]=o+p.a}return n},
$S:19}
A.iT.prototype={
dc(){var s,r,q,p=this.a
if(p<32){s=this.d
r=B.a.a4(s[0],p)
s=s[1]
if(!(p>=0))return A.a(B.aF,p)
q=r+((s&B.aF[p])>>>0)*(B.aF[32-p]+1)}else{s=this.d
q=p===32?s[1]:B.a.a4(s[1],p-32)}return q},
aq(a){var s,r,q=this
if(!q.b&&a<25){s=q.dc()
if(!(a<33))return A.a(B.aF,a)
r=B.aF[a]
q.a+=a
q.cm()
return(s&r)>>>0}else{q.b=!0
throw A.e(A.k("Not enough data in input."))}},
cm(){var s,r,q,p=this,o=p.c,n=p.d,m=n.$flags|0,l=o.c
for(;;){if(!(p.a>=8&&o.d<l))break
s=J.d(o.a,o.d++)
r=n[0]
q=n[1]
m&2&&A.b(n)
n[0]=(r>>>8)+(q&255)*16777216
n[1]=q>>>8
n[1]=(n[1]|s*16777216)>>>0
p.a-=8}}}
A.iU.prototype={
l7(){var s=this.a,r=new Uint8Array(s.length*2)
B.d.aa(r,0,this.b,s)
this.a=r},
T(a,b){var s,r,q,p,o,n=this
while(b>0){s=n.d
r=8-s
q=b<r?b:r
p=B.a.U(1,q)
n.c=(n.c|B.a.U((a&p-1)>>>0,s))>>>0
a=B.a.aM(a,q)
b-=q
s+=q
n.d=s
if(s===8){s=n.b
p=n.a
o=p.length
if(s===o){o=new Uint8Array(o*2)
B.d.aa(o,0,s,p)
n.a=o
s=o}else s=p
p=n.b++
o=n.c
s.$flags&2&&A.b(s)
if(!(p<s.length))return A.a(s,p)
s[p]=o
n.d=n.c=0}}},
i7(){var s,r,q,p=this
if(p.d>0){if(p.b===p.a.length)p.l7()
s=p.a
r=p.b++
q=p.c
s.$flags&2&&A.b(s)
if(!(r<s.length))return A.a(s,r)
s[r]=q
p.d=p.c=0}},
f_(){var s=this.b,r=this.a
return s===r.length?r:new Uint8Array(A.o(A.oj(r,0,s)))}}
A.lJ.prototype={}
A.n7.prototype={
$1(a){var s,r,q,p=this,o=p.a
if(!(a>=0&&a<o.length))return A.a(o,a)
o=o[a]
s=p.b
if(!(a<s.length))return A.a(s,a)
s=s[a]
r=p.c
if(!(a<r.length))return A.a(r,a)
r=r[a]
q=p.d
if(!(a<q.length))return A.a(q,a)
return(o<<24|s<<16|r<<8|q[a])>>>0},
$S:8}
A.n8.prototype={
$1(a){return B.a.a4(A.cC(a,506832829),this.a)},
$S:8}
A.fQ.prototype={}
A.lN.prototype={
nj(a4,a5,a6,a7,a8,a9,b0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=this,b=a8+16-1,a=B.a.P(b,16),a0=a9+16-1,a1=B.a.P(a0,16),a2=a8*a9,a3=new Uint32Array(a2)
for(s=a7.length,r=a4.length,q=a5.length,p=a6.length,o=0;o<a2;++o){if(!(o<s))return A.a(a7,o)
n=a7[o]
if(!(o<r))return A.a(a4,o)
m=a4[o]
if(!(o<q))return A.a(a5,o)
l=a5[o]
if(!(o<p))return A.a(a6,o)
a3[o]=(n<<24|m<<16|l<<8|a6[o])>>>0}k=c.jH(a4,a5,a6,a7,a2)
if(k!=null){j=new A.iU(new Uint8Array(4096))
c.mP(j,k,a4,a5,a6,a7,a8,a9)
j.i7()
return j.f_()}i=A.xc(a3,a8,a9,4)
n=i.a
if(n){c.ju(a4,a5,a6,a2)
for(o=0;o<a2;++o){if(!(o<s))return A.a(a7,o)
m=a7[o]
if(!(o<r))return A.a(a4,o)
l=a4[o]
if(!(o<q))return A.a(a5,o)
h=a5[o]
if(!(o<p))return A.a(a6,o)
a3[o]=(m<<24|l<<16|h<<8|a6[o])>>>0}}if(i.b){g=A.y8(a3,a8,a9,a,a1,16)
A.xf(a3,a4,a5,a6,a7,a8,a9,a,16,g)}else g=null
if(i.c){f=A.y7(a4,a5,a6,a8,a9,4)
if(f!=null)A.xe(a4,a5,a6,a8,a9,4,f)}else f=null
j=new A.iU(new Uint8Array(4096))
if(n){j.T(1,1)
j.T(2,2)}if(g!=null){j.T(1,1)
j.T(0,2)
j.T(2,3)
A.z1(j,a,a1,g)}if(f!=null){e=B.a.j(b,4)
d=B.a.j(a0,4)
j.T(1,1)
j.T(1,2)
j.T(2,3)
c.mK(j,e,d,f)}j.T(0,1)
c.cZ(j,a4,a5,a6,a7,a8,a2,!0)
j.i7()
return j.f_()},
cZ(d7,d8,d9,e0,e1,e2,e3,e4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4=A.xn(d8,d9,e0,e1,e3,e2),d5=new Int32Array(e3),d6=new A.lM(e3,d5,new Int32Array(e3))
A.uY(d4,d6)
A.xX(d4,A.uX(d6,d8,d9,e0,e1,e2),d8,d9,e0,e1,e2,d6)
s=A.y4(d6)
r=s.a
q=s.b
p=s.c
o=s.d
n=s.e
m=p.length
l=new Int32Array(m)
k=new Int32Array(m)
for(d5=o.length,j=0;j<m;++j){l[j]=A.jB(p[j])
if(!(j<d5))return A.a(o,j)
k[j]=A.jC(A.jv(e2,o[j]))}i=q.length
h=new Int32Array(i)
g=A.y6(d8,d9,e0,e1,r,q,p,o,e2,h)
f=g>0
e=280+(f?B.a.U(1,g):0)
if(f){d7.T(1,1)
d7.T(g,4)}else d7.T(0,1)
d=e4?this.mm(d8,d9,e0,e1,r,q,l,k,n,h,e2,e3,e):null
if(e4)if(d==null)d7.T(0,1)
else{d7.T(1,1)
d7.T(d.a-2,3)
this.mN(d7,d)}f=d==null
c=f?null:d.d.b
if(c==null)c=1
b=r.length
a=new Int32Array(b)
if(!f){a0=d.d.a
a1=d.a
a2=d.b
for(f=a0.length,a3=n.length,a4=0,a5=0,a6=0;a6<b;++a6){if(!(a6<a3))return A.a(n,a6)
a7=n[a6]
while(a8=a7-a4,a8>=e2){a4+=e2;++a5}a8=B.a.a4(a5,a1)*a2+B.a.aM(a8,a1)
if(!(a8<f))return A.a(a0,a8)
a[a6]=a0[a8]}}a9=J.aa(c,t.d)
for(b0=0;b0<c;++b0)a9[b0]=A.fS(e)
for(f=d8.length,a3=d9.length,a8=e0.length,b1=e1.length,b2=0,b3=0,a6=0;a6<b;++a6){b4=a[a6]
if(!(b4>=0&&b4<c))return A.a(a9,b4)
b5=a9[b4]
if(r[a6]!==0){if(!(b2<i))return A.a(h,b2)
b6=h[b2]
b7=b2+1
b8=q[b2]
if(b6>=0)b5.hI(b6)
else{if(!(b8>=0&&b8<f))return A.a(d8,b8)
b4=d8[b8]
if(!(b8<a3))return A.a(d9,b8)
b9=d9[b8]
if(!(b8<a8))return A.a(e0,b8)
c0=e0[b8]
if(!(b8<b1))return A.a(e1,b8)
b5.hK(b4,b9,c0,e1[b8])}b2=b7}else{if(!(b3<m))return A.a(l,b3)
b5.hJ(l[b3],k[b3]);++b3}}c1=A.j([],t.bm)
for(b4=t.L,b0=0;b0<c;++b0){b5=a9[b0]
b9=A.ep(b5.b,e,15)
c0=A.ep(b5.c,256,15)
c2=A.ep(b5.d,256,15)
c3=A.ep(b5.e,256,15)
c4=A.ep(b5.f,40,15)
c5=new A.j7(e,b9,c0,c2,c3,c4)
A.hp(d7,e,b9)
A.hp(d7,256,c0)
A.hp(d7,256,c2)
A.hp(d7,256,c3)
A.hp(d7,40,c4)
c5.r=b4.a(A.eq(new Int32Array(A.o(b9)),e))
c5.w=b4.a(A.eq(new Int32Array(A.o(c0)),256))
c5.x=b4.a(A.eq(new Int32Array(A.o(c2)),256))
c5.y=b4.a(A.eq(new Int32Array(A.o(c3)),256))
c5.z=b4.a(A.eq(new Int32Array(A.o(c4)),40))
B.c.E(c1,c5)}for(b2=0,b3=0,a6=0;a6<b;++a6){b9=a[a6]
if(!(b9>=0&&b9<c1.length))return A.a(c1,b9)
c6=c1[b9]
if(r[a6]!==0){if(!(b2<i))return A.a(h,b2)
b6=h[b2]
b7=b2+1
b8=q[b2]
b9=c6.r
c0=c6.b
if(b6>=0){b9===$&&A.c()
c2=280+b6
b4.a(b9)
b4.a(c0)
if(!(c2<b9.length))return A.a(b9,c2)
b9=b9[c2]
if(!(c2<c0.length))return A.a(c0,c2)
d7.T(b9,c0[c2])}else{b9===$&&A.c()
if(!(b8>=0&&b8<a3))return A.a(d9,b8)
c2=d9[b8]
b4.a(b9)
b4.a(c0)
b9=B.c.l(b9,c2)
if(c2>>>0!==c2||c2>=c0.length)return A.a(c0,c2)
d7.T(b9,c0[c2])
c2=c6.w
c2===$&&A.c()
if(!(b8<f))return A.a(d8,b8)
c0=d8[b8]
b4.a(c2)
b9=b4.a(c6.c)
c2=B.c.l(c2,c0)
if(c0>>>0!==c0||c0>=b9.length)return A.a(b9,c0)
d7.T(c2,b9[c0])
c0=c6.x
c0===$&&A.c()
if(!(b8<a8))return A.a(e0,b8)
b9=e0[b8]
b4.a(c0)
c2=b4.a(c6.d)
c0=B.c.l(c0,b9)
if(b9>>>0!==b9||b9>=c2.length)return A.a(c2,b9)
d7.T(c0,c2[b9])
b9=c6.y
b9===$&&A.c()
if(!(b8<b1))return A.a(e1,b8)
c2=e1[b8]
b4.a(b9)
c0=b4.a(c6.e)
b9=B.c.l(b9,c2)
if(c2>>>0!==c2||c2>=c0.length)return A.a(c0,c2)
d7.T(b9,c0[c2])}b2=b7}else{if(!(b3<m))return A.a(p,b3)
c7=p[b3]
if(!(b3<d5))return A.a(o,b3)
c8=o[b3];++b3
b9=c6.r
b9===$&&A.c()
c0=A.jB(c7)
b4.a(b9)
c2=b4.a(c6.b)
if(!(c0>=0&&c0<b9.length))return A.a(b9,c0)
b9=b9[c0]
if(!(c0<c2.length))return A.a(c2,c0)
d7.T(b9,c2[c0])
c9=A.rd(c7)
d0=c9.a
if(d0>0)d7.T(c9.b,d0)
d1=A.jv(e2,c8)
b9=c6.z
b9===$&&A.c()
c0=A.jC(d1)
b4.a(b9)
c2=b4.a(c6.f)
if(!(c0>=0&&c0<b9.length))return A.a(b9,c0)
b9=b9[c0]
if(!(c0<c2.length))return A.a(c2,c0)
d7.T(b9,c2[c0])
d2=A.ri(d1)
d3=d2.a
if(d3>0)d7.T(d2.b,d3)}}},
mm(b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4=B.a.Z(c6,c5)
for(s=b9.length,r=c1.length,q=c2.length,p=c3.length,o=b5.length,n=b6.length,m=b7.length,l=b8.length,k=c4.length,j=c0.length,i=t.d,h=null,g=0;g<3;++g){f=B.h9[g]
e=B.a.O(1,f)
d=B.a.j(c5+e-1,f)
c=B.a.j(b4+e-1,f)
e=d*c
if(e<2||e>2600)continue
b=J.aa(e,i)
for(a=0;a<e;++a)b[a]=A.fS(c7)
for(a0=0,a1=0,a2=0,a3=0,a4=0;a4<s;++a4){if(!(a4<p))return A.a(c3,a4)
a5=c3[a4]
while(a6=a5-a2,a6>=c5){a2+=c5;++a3}a6=B.a.a6(a3,f)*d+B.a.j(a6,f)
if(!(a6<e))return A.a(b,a6)
a7=b[a6]
if(b9[a4]!==0){if(!(a0<k))return A.a(c4,a0)
a8=c4[a0]
a9=a0+1
if(!(a0<j))return A.a(c0,a0)
b0=c0[a0]
if(a8>=0)a7.hI(a8)
else{if(!(b0>=0&&b0<o))return A.a(b5,b0)
a6=b5[b0]
if(!(b0<n))return A.a(b6,b0)
b1=b6[b0]
if(!(b0<m))return A.a(b7,b0)
b2=b7[b0]
if(!(b0<l))return A.a(b8,b0)
a7.hK(a6,b1,b2,b8[b0])}a0=a9}else{if(!(a1<r))return A.a(c1,a1)
a6=c1[a1]
if(!(a1<q))return A.a(c2,a1)
a7.hJ(a6,c2[a1]);++a1}}b3=A.xl(b)
if(b3!=null)e=h==null||b3.c<h.d.c
else e=!1
if(e)h=new A.mr(f,d,c,b3)}return h},
mN(a,b){var s,r,q,p,o,n=b.b,m=n*b.c,l=new Uint8Array(m),k=new Uint8Array(m),j=new Uint8Array(m),i=new Uint8Array(m)
B.d.V(i,0,m,255)
for(s=b.d.a,r=s.length,q=0;q<m;++q){if(!(q<r))return A.a(s,q)
p=s[q]
o=B.a.j(p,8)
if(!(q<m))return A.a(l,q)
l[q]=o&255
if(!(q<m))return A.a(k,q)
k[q]=p&255}this.cZ(a,l,k,j,i,n,m,!1)},
jH(a,b,c,d,e){var s,r,q,p,o,n,m,l,k=A.o0(t.p)
for(s=d.length,r=a.length,q=b.length,p=c.length,o=0;o<e;++o){if(!(o<s))return A.a(d,o)
n=d[o]
if(!(o<r))return A.a(a,o)
m=a[o]
if(!(o<q))return A.a(b,o)
l=b[o]
if(!(o<p))return A.a(c,o)
if(k.E(0,(n<<24|m<<16|l<<8|c[o])>>>0)&&k.a>256)return null}s=A.t(k,k.$ti.c)
B.c.f6(s)
return new Uint32Array(A.o(s))},
mP(b5,b6,b7,b8,b9,c0,c1,c2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4=b6.length
b5.T(1,1)
b5.T(3,2)
b5.T(b4-1,8)
s=new Uint8Array(b4)
r=new Uint8Array(b4)
q=new Uint8Array(b4)
p=new Uint8Array(b4)
for(o=0,n=0,m=0,l=0,k=0;k<b4;++k,l=i,m=f,n=g,o=h){j=b6[k]
i=j>>>24&255
h=j>>>16&255
g=j>>>8&255
f=j&255
if(!(k<b4))return A.a(s,k)
s[k]=h-o&255
if(!(k<b4))return A.a(r,k)
r[k]=g-n&255
if(!(k<b4))return A.a(q,k)
q[k]=f-m&255
if(!(k<b4))return A.a(p,k)
p[k]=i-l&255}this.cZ(b5,s,r,q,p,b4,b4,!1)
b5.T(0,1)
e=t.p
d=A.P(e,e)
for(k=0;k<b4;++k)d.i(0,b6[k],k)
if(b4>16)c=0
else if(b4>4)c=1
else{e=b4>2?2:3
c=e}b=A.uZ(c1,c)
a=b*c2
a0=new Uint8Array(a)
a1=new Uint8Array(a)
if(c===0)for(e=c1*c2,a2=c0.length,a3=b7.length,a4=b8.length,a5=b9.length,k=0;k<e;++k){if(!(k<a2))return A.a(c0,k)
a6=c0[k]
if(!(k<a3))return A.a(b7,k)
a7=b7[k]
if(!(k<a4))return A.a(b8,k)
a8=b8[k]
if(!(k<a5))return A.a(b9,k)
a8=d.l(0,(a6<<24|a7<<16|a8<<8|b9[k])>>>0)
a8.toString
if(!(k<a))return A.a(a0,k)
a0[k]=a8}else{a9=B.a.a6(8,c)
for(e=c0.length,a2=b7.length,a3=b8.length,a4=b9.length,a5=B.a.O(1,c)-1,b0=0;b0<c2;++b0)for(a6=b0*c1,a7=b0*b,b1=0;b1<c1;++b1){k=a6+b1
if(!(k>=0&&k<e))return A.a(c0,k)
a8=c0[k]
if(!(k<a2))return A.a(b7,k)
b2=b7[k]
if(!(k<a3))return A.a(b8,k)
b3=b8[k]
if(!(k<a4))return A.a(b9,k)
b3=d.l(0,(a8<<24|b2<<16|b3<<8|b9[k])>>>0)
b3.toString
b2=a7+B.a.a6(b1,c)
if(!(b2<a))return A.a(a0,b2)
a8=a0[b2]
b3=B.a.O(b3,((b1&a5)>>>0)*a9)
if(!(b2<a))return A.a(a0,b2)
a0[b2]=(a8|b3)>>>0}}this.cZ(b5,a1,a0,a1,a1,b,a,!0)},
ju(a,b,c,d){var s,r,q,p,o,n,m,l
for(s=a.length,r=b.length,q=a.$flags|0,p=c.length,o=c.$flags|0,n=0;n<d;++n){if(!(n<s))return A.a(a,n)
m=a[n]
if(!(n<r))return A.a(b,n)
l=b[n]
q&2&&A.b(a)
a[n]=m-l&255
if(!(n<p))return A.a(c,n)
l=c[n]
m=b[n]
o&2&&A.b(c)
c[n]=l-m&255}},
mK(a,b,c,d){var s,r,q,p,o,n,m,l
t.o6.a(d)
s=b*c
r=new Uint8Array(s)
q=new Uint8Array(s)
p=new Uint8Array(s)
o=new Uint8Array(s)
B.d.V(o,0,s,255)
for(n=d.length,m=0;m<s;++m){if(!(m<n))return A.a(d,m)
l=d[m]
r[m]=l.c&255
q[m]=l.b&255
p[m]=l.a&255}this.cZ(a,r,q,p,o,b,s,!1)}}
A.mr.prototype={}
A.j7.prototype={}
A.mZ.prototype={
$0(){var s,r,q=new Float64Array(4096)
for(s=1;s<4096;++s){r=Math.log(s)
if(!(s<4096))return A.a(q,s)
q[s]=r}return q},
$S:19}
A.fR.prototype={
hK(a,b,c,d){var s,r=this,q=r.b
if(!(b>=0&&b<q.length))return A.a(q,b)
s=q[b]
q.$flags&2&&A.b(q)
q[b]=s+1
if(s===0)r.c8(0,b)
q=r.c
if(!(a>=0&&a<256))return A.a(q,a)
s=q[a]
q.$flags&2&&A.b(q)
q[a]=s+1
if(s===0)r.c8(1,a)
q=r.d
if(!(c>=0&&c<256))return A.a(q,c)
s=q[c]
q.$flags&2&&A.b(q)
q[c]=s+1
if(s===0)r.c8(2,c)
q=r.e
if(!(d>=0&&d<256))return A.a(q,d)
s=q[d]
q.$flags&2&&A.b(q)
q[d]=s+1
if(s===0)r.c8(3,d)},
hI(a){var s,r=this.b,q=280+a
if(!(q>=0&&q<r.length))return A.a(r,q)
s=r[q]
r.$flags&2&&A.b(r)
r[q]=s+1
if(s===0)this.c8(0,q)},
hJ(a,b){var s,r=this,q=r.b
if(!(a>=0&&a<q.length))return A.a(q,a)
s=q[a]
q.$flags&2&&A.b(q)
q[a]=s+1
if(s===0)r.c8(0,a)
q=r.f
if(!(b>=0&&b<40))return A.a(q,b)
s=q[b]
q.$flags&2&&A.b(q)
q[b]=s+1
if(s===0)r.c8(4,b)},
d0(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f
for(s=this.Q,r=this.as,q=0;q<5;++q){p=this.gcN()[q]
o=a.gcN()[q]
n=s[q]
m=r[q]
for(l=o.length,k=p.length,j=n.length,i=0;i<m;++i){if(!(i<j))return A.a(n,i)
h=n[i]
if(!(h>=0&&h<l))return A.a(o,h)
if(o[h]===0)a.c8(q,h)
g=o[h]
if(!(h<k))return A.a(p,h)
f=p[h]
o.$flags&2&&A.b(o)
o[h]=g+f}}a.z=!1},
gcn(){var s,r,q,p,o,n,m,l,k=this
k.eg()
for(s=k.y,r=k.w,q=k.x,p=0,o=0;o<5;++o){n=r[o]
m=q[o]
if(m===0)n=0
else{if(m<4096){l=$.hq()
if(!(m>=0&&m<l.length))return A.a(l,m)
l=l[m]}else l=Math.log(m)
l=(n+m*l)/0.6931471805599453
n=l}p+=n+s[o]*4}return p},
ij(a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4=this
a4.eg()
a5.eg()
for(s=a4.x,r=a5.x,q=a4.w,p=a4.y,o=a5.Q,n=a5.as,m=0,l=0;l<5;++l){k=a4.gcN()[l]
j=a5.gcN()[l]
i=q[l]
h=p[l]
g=o[l]
f=n[l]
for(e=g.length,d=k.length,c=j.length,b=0;b<f;++b){if(!(b<e))return A.a(g,b)
a=g[b]
if(!(a>=0&&a<d))return A.a(k,a)
a0=k[a]
if(!(a<c))return A.a(j,a)
a1=j[a]
if(a0>0){if(a0<4096){a2=$.hq()
if(!(a0<a2.length))return A.a(a2,a0)
a2=a2[a0]}else a2=Math.log(a0)
i+=a0*a2}else ++h
a3=a0+a1
if(a3<4096){a2=$.hq()
if(!(a3<a2.length))return A.a(a2,a3)
a2=a2[a3]}else a2=Math.log(a3)
i-=a3*a2}e=s[l]+r[l]
if(e===0)e=0
else{if(e<4096){d=$.hq()
if(!(e>=0&&e<d.length))return A.a(d,e)
d=d[e]}else d=Math.log(e)
d=(i+e*d)/0.6931471805599453
e=d}m+=e+h*4}return m},
gcN(){var s,r=this,q=r.r
if(q===$){s=A.j([r.b,r.c,r.d,r.e,r.f],t.gF)
r.r!==$&&A.oR()
r.r=s
q=s}return q},
c8(a,b){var s,r,q,p,o,n=this.Q
if(!(a<5))return A.a(n,a)
s=n[a]
r=this.as
q=r[a]
if(q===s.length){p=q===0?8:q*2
o=new Int32Array(p)
B.t.aa(o,0,q,s)
B.c.i(n,a,o)
s=o}s.$flags&2&&A.b(s)
if(!(q>=0&&q<s.length))return A.a(s,q)
s[q]=b
r.$flags&2&&A.b(r)
r[a]=q+1},
eg(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=this
if(a0.z)return
for(s=a0.w,r=s.$flags|0,q=a0.x,p=q.$flags|0,o=a0.y,n=o.$flags|0,m=a0.Q,l=a0.as,k=0;k<5;++k){j=a0.gcN()[k]
i=m[k]
h=l[k]
for(g=i.length,f=j.length,e=0,d=0,c=0;c<h;++c){if(!(c<g))return A.a(i,c)
b=i[c]
if(!(b>=0&&b<f))return A.a(j,b)
a=j[b]
if(a<4096){b=$.hq()
if(!(a<b.length))return A.a(b,a)
b=b[a]}else b=Math.log(a)
e-=a*b
d+=a}r&2&&A.b(s)
s[k]=e
p&2&&A.b(q)
q[k]=d
n&2&&A.b(o)
o[k]=h}a0.z=!0}}
A.lI.prototype={}
A.nb.prototype={
$2(a,b){var s,r,q
A.r(a)
A.r(b)
s=this.a
r=s.length
if(!(a>=0&&a<r))return A.a(s,a)
q=s[a]
if(!(b>=0&&b<r))return A.a(s,b)
return B.a.cb(q,s[b])},
$S:38}
A.c6.prototype={}
A.dd.prototype={
a8(){return"VP8LImageTransformType."+this.b}}
A.iW.prototype={
nA(a,b,c,d,e,f){var s,r,q,p,o=this,n=o.b
switch(o.a.a){case 2:o.mV(e,f,(b-a)*n)
break
case 0:o.nJ(a,b,c,d,e,f)
if(b!==o.c){s=f-n
B.q.a3(e,s,s+n,c,f+(b-a-1)*n)}break
case 1:o.n1(a,b,c,d,e,f)
break
case 3:if(d===f&&o.e>0){r=b-a
q=r*A.cy(n,o.e)
p=f+r*n-q
B.q.a3(e,p,p+q,c,f)
o.hZ(a,b,c,p,e,f)}else o.hZ(a,b,c,d,e,f)
break}},
n0(a,b,c,d){var s,r,q,p,o,n,m=this.e,l=B.a.a6(8,m),k=this.b,j=this.d
if(l<8){s=B.a.O(1,m)-1
r=B.a.O(1,l)-1
for(q=a;q<b;++q)for(p=0,o=0;o<k;++o){if((o&s)>>>0===0){p=J.d(c.a,c.d);++c.d}m=(p&r)>>>0
if(!(m>=0&&m<j.length))return A.a(j,m)
m=j[m]
J.a2(d.a,d.d,m>>>8&255);++d.d
p=B.a.j(p,l)}}else for(q=a;q<b;++q)for(o=0;o<k;++o){n=J.d(c.a,c.d);++c.d
if(!(n>=0&&n<j.length))return A.a(j,n)
m=j[n]
J.a2(d.a,d.d,m>>>8&255);++d.d}},
hZ(a,b,c,d,e,f){var s,r,q,p,o,n,m,l,k,j=this.e,i=B.a.a6(8,j),h=this.b,g=this.d
if(i<8){s=B.a.O(1,j)-1
r=B.a.O(1,i)-1
for(j=e.$flags|0,q=c.length,p=a;p<b;++p)for(o=0,n=0;n<h;++n,f=l){if((n&s)>>>0===0){m=d+1
if(!(d>=0&&d<q))return A.a(c,d)
o=c[d]>>>8&255
d=m}l=f+1
k=o&r
if(!(k>=0&&k<g.length))return A.a(g,k)
k=g[k]
j&2&&A.b(e)
if(!(f>=0&&f<e.length))return A.a(e,f)
e[f]=k
o=B.a.a6(o,i)}}else for(j=c.length,q=e.$flags|0,p=a;p<b;++p)for(n=0;n<h;++n,f=l,d=m){l=f+1
g.toString
m=d+1
if(!(d>=0&&d<j))return A.a(c,d)
k=c[d]>>>8&255
if(!(k<g.length))return A.a(g,k)
k=g[k]
q&2&&A.b(e)
if(!(f>=0&&f<e.length))return A.a(e,f)
e[f]=k}},
n1(a5,a6,a7,a8,a9,b0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=this,a0=a.b,a1=a.e,a2=B.a.O(1,a1)-1,a3=A.cy(a0,a1),a4=B.a.j(a5,a.e)*a3
for(a1=a7.length,s=a9.$flags|0,r=a5;r<a6;){q=new Uint8Array(3)
for(p=a4,o=0;o<a0;++o){if((o&a2)>>>0===0){n=a.d
m=p+1
if(!(p<n.length))return A.a(n,p)
n=n[p]
q[0]=n&255
q[1]=n>>>8&255
q[2]=n>>>16&255
p=m}n=b0+o
l=a8+o
if(!(l<a1))return A.a(a7,l)
l=a7[l]
k=l>>>8&255
j=q[0]
i=$.ay()
i.$flags&2&&A.b(i)
i[0]=j
j=$.aI()
if(0>=j.length)return A.a(j,0)
h=j[0]
i[0]=k
g=j[0]
f=$.jG()
f.$flags&2&&A.b(f)
f[0]=h*g
e=$.nH()
if(0>=e.length)return A.a(e,0)
d=(l>>>16&255)+(e[0]>>>5)>>>0&255
i[0]=q[1]
h=j[0]
i[0]=k
f[0]=h*j[0]
c=e[0]
i[0]=q[2]
h=j[0]
i[0]=d
f[0]=h*j[0]
b=e[0]
s&2&&A.b(a9)
if(!(n<a9.length))return A.a(a9,n)
a9[n]=(l&4278255360|d<<16|((l&255)+(c>>>5)>>>0)+(b>>>5)>>>0&255)>>>0}b0+=a0
a8+=a0;++r
if((r&a2)>>>0===0)a4+=a3}},
cs(a,b){return(((a&4278255360)>>>0)+((b&4278255360)>>>0)&4278255360|(a&16711935)+(b&16711935)&16711935)>>>0},
nJ(b1,b2,b3,b4,b5,b6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8=this,a9=4278190080,b0=a8.b
if(b1===0){s=b3.length
if(!(b4<s))return A.a(b3,b4)
r=a8.cs(b3[b4],a9)
b5.$flags&2&&A.b(b5)
q=b5.length
if(!(b6<q))return A.a(b5,b6)
b5[b6]=r
p=b4+1
o=b6+1
n=b0-1
m=b5[b6]
for(r=b5.$flags|0,l=0;l<n;++l){k=p+l
if(!(k<s))return A.a(b3,k)
m=a8.cs(b3[k],m)
k=o+l
r&2&&A.b(b5)
if(!(k<q))return A.a(b5,k)
b5[k]=m}b4+=b0
b6+=b0;++b1}s=a8.e
j=B.a.O(1,s)
i=j-1
h=A.cy(b0,s)
g=B.a.j(b1,a8.e)*h
for(s=b3.length,r=~i,q=b5.length,f=b1;f<b2;){k=b6-b0
if(!(k>=0&&k<q))return A.a(b5,k)
e=b5[k]
if(!(b4<s))return A.a(b3,b4)
k=a8.cs(b3[b4],e)
b5.$flags&2&&A.b(b5)
if(!(b6<q))return A.a(b5,b6)
b5[b6]=k
for(d=g,c=1;c<b0;c=a1,d=b){k=a8.d
b=d+1
if(!(d<k.length))return A.a(k,d)
a=k[d]>>>8&15
a0=$.vd[a]
a1=((c&r)>>>0)+j
if(a1>b0)a1=b0
a2=b4+c
k=b6+c
a3=k-b0
a4=a1-c
if(a===0)for(a5=b5.$flags|0,l=0;l<a4;++l){a6=k+l
a7=a2+l
if(!(a7>=0&&a7<s))return A.a(b3,a7)
a7=a8.cs(b3[a7],a9)
a5&2&&A.b(b5)
if(!(a6>=0&&a6<q))return A.a(b5,a6)
b5[a6]=a7}else if(a===1){a5=k-1
if(!(a5>=0&&a5<q))return A.a(b5,a5)
m=b5[a5]
for(a5=b5.$flags|0,l=0;l<a4;++l){a6=a2+l
if(!(a6>=0&&a6<s))return A.a(b3,a6)
m=a8.cs(b3[a6],m)
a6=k+l
a5&2&&A.b(b5)
if(!(a6>=0&&a6<q))return A.a(b5,a6)
b5[a6]=m}}else for(l=0;l<a4;++l){a5=k+l
a6=a5-1
if(!(a6>=0&&a6<q))return A.a(b5,a6)
e=a0.$3(b5[a6],b5,a3+l)
a6=a2+l
if(!(a6>=0&&a6<s))return A.a(b3,a6)
a6=a8.cs(b3[a6],e)
b5.$flags&2&&A.b(b5)
if(!(a5>=0&&a5<q))return A.a(b5,a5)
b5[a5]=a6}}b4+=b0
b6+=b0;++f
if((f&i)>>>0===0)g+=h}},
mV(a,b,c){var s,r,q,p,o,n
for(s=a.length,r=a.$flags|0,q=0;q<c;++q){p=b+q
if(!(p<s))return A.a(a,p)
o=a[p]
n=o>>>8&255
r&2&&A.b(a)
a[p]=(o&4278255360|(o&16711935)+(n<<16|n)&16711935)>>>0}}}
A.lW.prototype={
gib(){var s=this,r=s.d
if(r>1||s.e>=4||s.f>1||s.r!==0)return!1
return!0},
n6(a,b,c){var s,r,q,p,o,n,m=this
if(!m.gib())return!1
s=m.e
if(!(s<4))return A.a(B.dz,s)
r=B.dz[s]
if(m.d===0){s=m.b
q=a*s
p=m.a
B.d.a3(c,q,q+b*s,p.a,p.d-p.b+q)}else{s=a+b
p=m.x
p===$&&A.c()
p.dx=c
o=p.c
if(m.y)s=p.k7(o.a,o.b,s)
else{n=p.cx
n.toString
p=p.ec(n,o.a,o.b,s,t.kX.a(p.gnl()))
s=p}if(!s)return!1}if(r!=null){s=m.b
r.$6(s,m.c,s,a,b,c)}if(m.f===1)if(!m.kB(c,m.b,m.c,a,b))return!1
if(a+b>=m.c)m.w=!0
return!0},
kB(a,b,c,d,e){if(b<=0||c<=0||d<0||e<0||d+e>c)return!1
return!0}}
A.cz.prototype={
o8(a){var s,r
a.au(A.oT(this.a))
s=this.b
r=s.length
a.ae(r)
a.au(s)
if((r&1)===1)a.u(0)}}
A.fX.prototype={
jm(a,b){var s=this,r=a.H()
s.w=0
s.f=(r&1)!==0
s.r=(r&2)===0
s.x=a.d-a.b
s.y=b-16}}
A.i6.prototype={}
A.hM.prototype={}
A.hN.prototype={}
A.eQ.prototype={
gp(a){return this.a.length-this.b}}
A.eP.prototype={
cq(a,b){var s,r,q,p,o,n=b.dc()&255,m=this.a
if(!(a<m.length))return A.a(m,a)
s=m[a]
r=s.a
q=s.b+n
if(!(q<r.length))return A.a(r,q)
p=r[q].a-8
if(p>0){b.a+=8
o=b.dc()
m=m[a]
s=m.a
r=m.b+n
if(!(r<s.length))return A.a(s,r)
n=n+s[r].b+((o&B.a.U(1,p)-1)>>>0)}else m=s
s=b.a
r=m.a
m=m.b+n
if(!(m>=0&&m<r.length))return A.a(r,m)
m=r[m]
b.a=s+m.a
return m.b}}
A.eR.prototype={}
A.hO.prototype={
fc(a){var s=this.b=this.a,r=A.nS(a)
s.e=a
s.b=s.a=r}}
A.ea.prototype={
a8(){return"WebPFormat."+this.b}}
A.c4.prototype={
gb7(){return this.z.length},
$iL:1,
gJ(){return this.a},
gI(){return this.b}}
A.f4.prototype={
gb7(){return this.as}}
A.lX.prototype={
aW(a){var s,r=A.v(t.L.a(a),!1,null,0)
this.c=r
try{r=this.fM(r)
return r}catch(s){return!1}},
aC(a){return A.Q(new A.m_(this,t.L.a(a)),t.f7)},
mJ(a){var s,r,q,p,o=this,n=null,m=A.v(t.L.a(a),!1,n,0)
o.c=m
if(!o.fM(m))return n
m=new A.f4(B.aI,A.j([],t.J))
o.a=m
s=o.c
s.toString
if(!o.fO(s,m))return n
m=o.a
switch(m.f.a){case 3:s=o.b
A.aw(m.a,m.b,s,!1)
for(m=o.a.z,r=m.length,q=0;q<m.length;m.length===r||(0,A.K)(m),++q){p=m[q]
A.aw(p.c,p.d,s,!1)}m=o.a
m.as=m.z.length
return m
case 2:s=o.c
s.toString
s.d=m.ay
if(!A.op(s,m).d4())return n
m=o.a
A.aw(m.a,m.b,o.b,!1)
m=o.a
m.as=m.z.length
return m
case 1:s=o.c
s.toString
s.d=m.ay
if(!A.ok(s,m).d4())return n
m=o.a
A.aw(m.a,m.b,o.b,!1)
m=o.a
m.as=m.z.length
return m
case 0:throw A.e(A.k("Unknown format for WebP"))}},
aJ(a){return A.Q(new A.lY(this,a),t.H)},
kj(a){var s,r,q,p,o=this,n=o.c
if(n==null||o.a==null)return null
s=o.a
if(s.e){s=s.z
r=s.length
if(a>=r)return null
if(!(a<r))return A.a(s,a)
q=s[a]
s=q.y
s===$&&A.c()
r=q.x
r===$&&A.c()
return o.hy(n.cj(s,r),a)}r=s.f
if(r===B.bc){p=n.cj(s.ch,s.ay)
n=o.a
n.toString
return A.op(p,n).bZ()}else if(r===B.bW){p=n.cj(s.ch,s.ay)
n=o.a
n.toString
return A.ok(p,n).bZ()}return null},
bd(a,b){return A.Q(new A.lZ(this,t.L.a(a),b),t.H)},
mI(a,b){if(this.aC(t.L.a(a))==null)return null
this.a.toString
return this.aJ(b)},
hy(a,b){var s,r,q,p=null,o=A.j([],t.J),n=new A.f4(B.aI,o)
if(!this.fO(a,n))return p
if(n.f===B.aI)return p
n.as=this.a.as
if(n.e){s=o.length
if(b>=s)return p
if(!(b<s))return A.a(o,b)
r=o[b]
o=r.y
o===$&&A.c()
s=r.x
s===$&&A.c()
return this.hy(a.cj(o,s),b)}else{q=a.cj(n.ch,n.ay)
o=n.f
if(o===B.bc)return A.op(q,n).bZ()
else if(o===B.bW)return A.ok(q,n).bZ()}return p},
fM(a){if(a.ar(4)!=="RIFF")return!1
a.k()
if(a.ar(4)!=="WEBP")return!1
return!0},
fO(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g
for(s=a.c,r=a.b;a.d<s;){q=a.ar(4)
p=a.k()
o=p+1>>>1<<1>>>0
n=a.d
m=n-r
switch(q){case"VP8X":if(!this.l3(a,b))return!1
break
case"VP8 ":b.ay=m
b.ch=p
b.f=B.bW
break
case"VP8L":b.ay=m
b.ch=p
b.f=B.bc
break
case"ALPH":b.toString
n=a.a
l=a.e
k=J.ab(n)
j=k.gp(n)
k=k.gp(n)
n=new A.ar(n,0,Math.min(j,k),0,l)
b.at=n
n.d=a.d
a.d+=o
break
case"ANIM":b.f=B.pQ
i=a.k()
n=new Uint8Array(4)
n[0]=i>>>16&255
n[1]=i>>>8&255
n[2]=i&255
n[3]=i>>>24&255
b.c=new A.dz(n)
b.y=a.m()
break
case"ANMF":if(!this.kX(a,b,p))return!1
break
case"ICCP":b.toString
h=a.aO(p)
a.d=a.d+(h.c-h.d)
b.r=h.a0()
break
case"EXIF":b.toString
b.w=a.ar(p)
break
case"XMP ":b.toString
a.ar(p)
break
default:a.d=n+o
break}n=a.d
g=o-(n-r-m)
if(g>0)a.d=n+g}if(!b.d)b.d=b.at!=null
return b.f!==B.aI},
l3(a,b){var s,r,q,p,o=a.H()
if((o&192)!==0)return!1
s=B.a.j(o,4)
r=B.a.j(o,1)
if((o&1)!==0)return!1
if(a.bx()!==0)return!1
q=a.bx()
p=a.bx()
b.a=q+1
b.b=p+1
b.e=(r&1)!==0
b.d=(s&1)!==0
return!0},
kX(a,b,c){var s=new A.i6(a.bx()*2,a.bx()*2,a.bx()+1,a.bx()+1,a.bx())
s.jm(a,c)
if(s.w!==0)return!1
B.c.E(b.z,s)
return!0}}
A.m_.prototype={
$0(){return this.a.mJ(this.b)},
$S:39}
A.lY.prototype={
$0(){return this.a.kj(this.b)},
$S:1}
A.lZ.prototype={
$0(){return this.a.mI(this.b,this.c)},
$S:1}
A.m0.prototype={
bM(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g
A.hn(a)
s=A.vg(a)
r=A.vi(a)
q=this.kG(a)
p=q.length>1
if(s==null&&r==null&&!p)return A.r0(q)
o=r!=null
n=p||A.vh(a)
m=s!=null
l=o?32:0
n=n?16:0
k=m?8:0
j=a.gJ()
i=a.gI()
h=A.ai(!1,8192)
h.u(l|n|k|0)
h.u(0)
h.u(0)
h.u(0)
A.qY(h,j-1)
A.qY(h,i-1)
g=A.j([new A.cz("VP8X",J.F(B.d.gt(h.c),0,h.a))],t.iu)
if(o)B.c.E(g,new A.cz("ICCP",r))
B.c.cE(g,q)
if(m)B.c.E(g,new A.cz("EXIF",s))
return A.r0(g)},
kG(a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=this.c,b=this.e,a=new A.ls(c,this.d,b,!0)
if(a0.gJ()<=0||a0.gI()<=0||a0.gJ()>16383||a0.gI()>16383)A.a9(A.k("WebP images must be between 1x1 and 16383x16383, got "+a0.gJ()+"x"+a0.gI()))
s=A.xM(a0)
r=s.f
q=r==null?null:A.xz(r,s.a,s.b,!0,1,b)
b=new Uint16Array(8192)
p=new Uint8Array(1056)
o=new Uint32Array(1056)
n=new Uint16Array(6528)
m=new Uint16Array(192)
l=new Uint16Array(A.o(B.mk))
k=new Uint8Array(3)
B.d.V(k,0,3,255)
k=new A.lv(p,o,n,m,l,k)
B.d.bB(p,0,$.nI())
p=s.a
l=B.a.j(p+15,4)
m=s.b
n=B.a.j(m+15,4)
o=4*l+1
j=new A.lw(a,s,l,n,o,k)
i=l*n
j.f=new Uint8Array(i)
j.r=new Uint8Array(i)
j.w=new Uint8Array(i)
j.x=new Uint8Array(i)
j.y=new Uint8Array(i)
j.z=new Uint8Array(o*(4*n+1))
j.Q=new Int32Array(l+1)
o=l*16
j.as=new Uint8Array(o)
j.at=new Uint8Array(o)
if(c<=98)c=new Int8Array(l*4)
else c=null
j.ax=c
c=j.ch=A.vf(4)
j.dy=B.a.Z(1069547520,i)
j.dx=65536
j.nV()
b=new A.lx(a,j,new A.lU(b),new A.iY())
A.xd(j)
h=b.jN()
g=A.qd(B.a.P(i*7,8))
g.bp(0)
g.bp(0)
b.lQ(g)
g.bp(c.z?1:0)
g.bQ(c.x,6)
g.bQ(c.y,3)
g.bp(0)
g.bQ(0,2)
g.bQ(c.c,7)
g.cp(c.d,4)
g.cp(c.e,4)
g.cp(c.f,4)
g.cp(c.r,4)
g.cp(c.w,4)
g.bp(0)
k.aR(g)
b.jM(g)
f=g.cG()
c=f.length
if(c>=524288)A.a9(A.k("WebP lossy partition #0 needs "+c+" bytes, more than the format can address; encode losslessly"))
b=10+c
a=b+h.length
e=new Uint8Array(a)
d=c<<5|16
e[0]=d&255
e[1]=d>>>8&255
e[2]=d>>>16&255
e[3]=157
e[4]=1
e[5]=42
e[6]=p&255
e[7]=B.a.j(p,8)&63
e[8]=m&255
e[9]=B.a.j(m,8)&63
B.d.aa(e,10,b,f)
B.d.aa(e,b,a,h)
c=A.j([],t.iu)
if(q!=null)c.push(new A.cz("ALPH",q))
c.push(new A.cz("VP8 ",e))
return c}}
A.hP.prototype={
a8(){return"IccProfileCompression."+this.b}}
A.cj.prototype={
n2(){var s,r=this
if(r.b===B.by)return r.c
s=B.c4.i5(t.L.a(r.c),null,15)
r.c=s
r.b=B.by
return s},
i3(){var s,r=this
if(r.b===B.ai)return r.c
s=A.jz(r.c,16777216)
r.c=s
r.b=B.ai
return s}}
A.k5.prototype={
a8(){return"FrameType."+this.b}}
A.ap.prototype={
gav(){var s=this.x
return s===$?this.x=A.j([],t.g):s},
jf(a,b,c,d){var s,r,q,p=this,o=a.gM(),n=a.gak(),m=a.a
p.fz(d,b,o,n,m==null?null:m.gW())
o=a.b
if(o!=null)p.b=A.ig(o,t.N,t.w)
o=a.d
if(o!=null){n=t.N
p.d=A.ig(o,n,n)}B.c.E(p.gav(),p)
if(!c){s=a.gav().length
for(o=t.g,r=1;r<s;++r){q=a.x
if(q===$)q=a.x=A.j([],o)
if(!(r<q.length))return A.a(q,r)
p.bW(A.eS(q[r],b,!1,d))}}},
je(a,b,c){var s,r,q,p,o=this,n=a.b
if(n!=null)o.b=A.ig(n,t.N,t.w)
n=a.d
if(n!=null){s=t.N
o.d=A.ig(n,s,s)}B.c.E(o.gav(),o)
if(!b&&a.gav().length>1){r=a.gav().length
for(n=t.g,q=1;q<r;++q){p=a.x
if(p===$)p=a.x=A.j([],n)
if(!(q<p.length))return A.a(p,q)
o.bW(A.b2(p[q],!1,!1))}}},
bW(a){var s=this
if(a==null)a=A.b2(s,!0,!0)
a.z=s.gav().length
if(s.gav().length===0||B.c.gcH(s.gav())!==a)B.c.E(s.gav(),a)
return a},
d_(){return this.bW(null)},
fz(a,b,c,d,e){var s,r,q=this,p=null
switch(c.a){case 0:if(e==null){s=B.b.bc(a*d/8)
r=new A.dN($,s,p,a,b,d)
s=Math.max(s*b,1)
r.d=new Uint8Array(s)
q.a=r}else{s=B.b.bc(a/8)
r=new A.dN($,s,e,a,b,1)
s=Math.max(s*b,1)
r.d=new Uint8Array(s)
q.a=r}break
case 1:if(e==null){s=B.b.bc(a*(d<<1>>>0)/8)
r=new A.dO($,s,p,a,b,d)
s=Math.max(s*b,1)
r.d=new Uint8Array(s)
q.a=r}else{s=B.b.bc(a/4)
r=new A.dO($,s,e,a,b,1)
s=Math.max(s*b,1)
r.d=new Uint8Array(s)
q.a=r}break
case 2:if(e==null){if(d===2)s=a
else if(d===4)s=a*2
else s=d===3?B.b.bc(a*1.5):B.b.bc(a/2)
r=new A.dQ($,s,p,a,b,d)
s=Math.max(s*b,1)
r.d=new Uint8Array(s)
q.a=r}else{s=B.b.bc(a/2)
r=new A.dQ($,s,e,a,b,1)
s=Math.max(s*b,1)
r.d=new Uint8Array(s)
q.a=r}break
case 3:if(e==null)q.a=A.px(a,b,d)
else q.a=new A.cn(new Uint8Array(a*b),e,a,b,1)
break
case 4:s=a*b
if(e==null)q.a=new A.cO(new Uint16Array(s*d),p,a,b,d)
else q.a=new A.cO(new Uint16Array(s),e,a,b,1)
break
case 5:q.a=A.tO(a,b,d)
break
case 6:q.a=new A.eW(new Int8Array(a*b*d),a,b,d)
break
case 7:q.a=new A.eU(new Int16Array(a*b*d),a,b,d)
break
case 8:q.a=new A.eV(new Int32Array(a*b*d),a,b,d)
break
case 9:q.a=A.tM(a,b,d)
break
case 10:q.a=A.tN(a,b,d)
break
case 11:q.a=new A.eT(new Float64Array(a*b*4*d),a,b,d)
break}},
D(a){var s=this
return"Image("+s.gJ()+", "+s.gI()+", "+s.gM().b+", "+s.gak()+")"},
gJ(){var s=this.a
s=s==null?null:s.a
return s==null?0:s},
gI(){var s=this.a
s=s==null?null:s.b
return s==null?0:s},
gM(){var s=this.a
s=s==null?null:s.gM()
return s==null?B.e:s},
gbe(){var s=this.e
return s==null?this.e=new A.bM(A.P(t.N,t.P)):s},
iP(a,b){var s=this,r=s.b;(r==null?s.b=A.P(t.N,t.w):r).i(0,a,b)
if(s.b.a===0)s.b=null},
gF(a){var s=this.a
return s.gF(s)},
gt(a){var s=this.a
s=s==null?null:s.gt(s)
if(s==null)s=B.d.gt(new Uint8Array(0))
return s},
a0(){var s=this.a
s=s==null?null:J.I(s.gt(s))
return s==null?J.I(this.gt(0)):s},
gd8(a){var s=this.a
s=s==null?null:J.ta(s.gt(s))
return s==null?0:s},
gak(){var s=this.a
s=s==null?null:s.gW()
s=s==null?null:s.b
if(s==null){s=this.a
s=s==null?null:s.c}return s==null?0:s},
gb6(){var s=this.a
s=s==null?null:s.gb6()
return s===!0},
gaH(){var s=this.a
return(s==null?null:s.gW())!=null},
gaU(){var s=this.a
s=s==null?null:s.gaU()
return s==null?0:s},
ia(a,b){return a>=0&&b>=0&&a<this.gJ()&&b<this.gI()},
b4(a,b,c,d){var s=this.a
s=s==null?null:s.b4(a,b,c,d)
if(s==null)s=new A.bi(new Uint8Array(0))
return s},
S(a,b,c){var s=this.a
s=s==null?null:s.S(a,b,c)
return s==null?new A.J():s},
b0(a,b){return this.S(a,b,null)},
an(a,b){if(a<0||a>=this.gJ()||b<0||b>=this.gI())return new A.J()
return this.S(a,b,null)},
f0(a,b,c){switch(c.a){case 0:return this.an(B.b.h(a),B.b.h(b))
case 1:case 3:return this.iK(a,b)
case 2:return this.iJ(a,b)}},
iK(a,b){var s,r,q,p,o,n,m=this,l=B.b.h(a),k=l-(a>=0?0:1),j=k+1
l=B.b.h(b)
s=l-(b>=0?0:1)
r=s+1
l=new A.kp(a-k,b-s)
q=m.an(k,s)
p=r>=m.gI()?q:m.an(k,r)
o=j>=m.gJ()?q:m.an(j,s)
n=j>=m.gJ()||r>=m.gI()?q:m.an(j,r)
return m.b4(l.$4(q.gq(),o.gq(),p.gq(),n.gq()),l.$4(q.gB(),o.gB(),p.gB(),n.gB()),l.$4(q.gA(),o.gA(),p.gA(),n.gA()),l.$4(q.gv(),o.gv(),p.gv(),n.gv()))},
iJ(c8,c9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2=this,c3=B.b.h(c8),c4=c3-(c8>=0?0:1),c5=c4-1,c6=c4+1,c7=c4+2
c3=B.b.h(c9)
s=c3-(c9>=0?0:1)
r=s-1
q=s+1
p=s+2
o=c8-c4
n=c9-s
c3=new A.ko()
m=c2.an(c4,s)
l=c5<0
k=!l
j=!k||r<0?m:c2.an(c5,r)
i=r<0
h=i?m:c2.an(c4,r)
g=i||c6>=c2.gJ()?m:c2.an(c6,r)
f=c7>=c2.gJ()||i?m:c2.an(c7,r)
e=c3.$5(o,j.gq(),h.gq(),g.gq(),f.gq())
d=c3.$5(o,j.gB(),h.gB(),g.gB(),f.gB())
c=c3.$5(o,j.gA(),h.gA(),g.gA(),f.gA())
b=c3.$5(o,j.gv(),h.gv(),g.gv(),f.gv())
a=l?m:c2.an(c5,s)
a0=c6>=c2.gJ()?m:c2.an(c6,s)
a1=c7>=c2.gJ()?m:c2.an(c7,s)
a2=c3.$5(o,a.gq(),m.gq(),a0.gq(),a1.gq())
a3=c3.$5(o,a.gB(),m.gB(),a0.gB(),a1.gB())
a4=c3.$5(o,a.gA(),m.gA(),a0.gA(),a1.gA())
a5=c3.$5(o,a.gv(),m.gv(),a0.gv(),a1.gv())
a6=!k||q>=c2.gI()?m:c2.an(c5,q)
a7=q>=c2.gI()?m:c2.an(c4,q)
a8=c6>=c2.gJ()||q>=c2.gI()?m:c2.an(c6,q)
a9=c7>=c2.gJ()||q>=c2.gI()?m:c2.an(c7,q)
b0=c3.$5(o,a6.gq(),a7.gq(),a8.gq(),a9.gq())
b1=c3.$5(o,a6.gB(),a7.gB(),a8.gB(),a9.gB())
b2=c3.$5(o,a6.gA(),a7.gA(),a8.gA(),a9.gA())
b3=c3.$5(o,a6.gv(),a7.gv(),a8.gv(),a9.gv())
b4=!k||p>=c2.gI()?m:c2.an(c5,p)
b5=p>=c2.gI()?m:c2.an(c4,p)
b6=c6>=c2.gJ()||p>=c2.gI()?m:c2.an(c6,p)
b7=c7>=c2.gJ()||p>=c2.gI()?m:c2.an(c7,p)
b8=c3.$5(o,b4.gq(),b5.gq(),b6.gq(),b7.gq())
b9=c3.$5(o,b4.gB(),b5.gB(),b6.gB(),b7.gB())
c0=c3.$5(o,b4.gA(),b5.gA(),b6.gA(),b7.gA())
c1=c3.$5(o,b4.gv(),b5.gv(),b6.gv(),b7.gv())
return c2.b4(c3.$5(n,e,a2,b0,b8),c3.$5(n,d,a3,b1,b9),c3.$5(n,c,a4,b2,c0),c3.$5(n,b,a5,b3,c1))},
cg(a,b,c){var s
if(t.mK.b(c))if(c.gbo().gW()!=null)if(this.gaH()){s=this.a
if(s!=null)s.aT(a,b,c.gX(),0,0)
return}s=this.a
if(s!=null)s.aw(a,b,c.gq(),c.gB(),c.gA(),c.gv())},
iQ(a,b,c){var s=this.a
return s==null?null:s.aS(a,b,c)},
gG(){var s=this.a
s=s==null?null:s.gG()
return s==null?0:s},
b2(a,b){var s=this.a
return s==null?null:s.b2(0,b)},
ca(a){return this.b2(0,null)},
d3(a7,a8,a9,b0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5=this,a6=null
if(a8==null)a8=a5.gM()
if(b0==null)b0=a5.gak()
s=a7==null
if(s)a7=B.dF.l(0,a8)
r=!1
if(a8===a5.gM())if(b0===a5.gak()){q=a5.a
r=(q==null?a6:q.gW())==null}if(r){p=A.b2(a5,!1,!1)
if(!s)s=p.gak()===2||p.gak()===4
else s=!1
if(s)for(s=p.gav(),r=s.length,o=0;o<s.length;s.length===r||(0,A.K)(s),++o)for(q=s[o].a,q=q.gF(q);q.C();){n=q.gN()
a7.toString
n.sv(a7)}return p}for(s=a5.gav(),r=s.length,q=t.N,m=t.p,l=a6,o=0;o<s.length;s.length===r||(0,A.K)(s),++o){k=s[o]
j=k.a
i=j==null
h=i?a6:j.a
if(h==null)h=0
j=i?a6:j.b
if(j==null)j=0
i=k.e
i=i==null?a6:A.eH(i)
g=k.c
if(g==null)g=a6
else{f=g.a
e=g.b
g=g.c
g=new A.cj(f,e,new Uint8Array(g.subarray(0,A.ji(0,a6,g.length))))}f=k.f
f=f==null?a6:new A.bi(new Uint8Array(A.o(f.a)))
e=k.w
d=k.r
p=A.Z(f,i,a8,k.y,e,j,g,d,b0,a6,B.e,h,!1)
j=k.d
p.siv(j!=null?A.ig(j,q,q):a6)
if(l!=null)l.bW(p)
else l=p
j=p.a
c=j==null?a6:j.gW()
j=p.a
j=j==null?a6:j.gW()
b=j==null?a6:j.gM()
if(b==null)b=a8
j=k.a
if(c!=null){a=A.P(m,m)
a0=j==null?a6:j.S(0,0,a6)
if(a0==null)a0=new A.J()
for(j=p.a,j=j.gF(j),a1=0;j.C();){a2=j.gN()
a3=A.rn(B.b.bu(a0.gal()*255),B.b.bu(a0.gah()*255),B.b.bu(a0.gaj()*255),0)
if(a.af(a3)){i=a.l(0,a3)
i.toString
a2.sX(i)}else{a.i(0,a3,a1)
a2.sX(a1)
a4=A.aP(a0,a7,b,b0,a6)
c.bk(a1,a4.gq(),a4.gB(),a4.gA());++a1}a0.C()}}else{a0=j==null?a6:j.S(0,0,a6)
if(a0==null)a0=new A.J()
for(j=p.a,j=j.gF(j);j.C();){A.aP(a0,a7,a6,a6,j.gN())
a0.C()}}if(a9)break}l.toString
return l},
b3(a){return this.d3(null,a,!1,null)},
i_(a){return this.d3(null,null,!1,a)},
n4(a,b,c){return this.d3(a,b,!1,c)},
n3(a,b){return this.d3(a,null,!1,b)},
n5(a,b,c){return this.d3(null,a,b,c)},
mX(a){var s,r,q,p
t.je.a(a)
if(this.d==null){s=t.N
this.d=A.P(s,s)}for(s=new A.a1(a,a.r,a.e,A.m(a).n("a1<1>"));s.C();){r=s.d
q=this.d
q.toString
p=a.l(0,r)
p.toString
q.i(0,r,p)}},
jY(a,b,c){var s,r=65536
switch(b.a){case 0:return null
case 1:return null
case 2:return null
case 3:s=a===B.u?r:256
return new A.aU(new Uint8Array(s*c),s,c)
case 4:s=a===B.u?r:256
return new A.fw(new Uint16Array(s*c),s,c)
case 5:s=a===B.u?r:256
return new A.e0(new Uint32Array(s*c),s,c)
case 6:s=a===B.u?r:256
return new A.fv(new Int8Array(s*c),s,c)
case 7:s=a===B.u?r:256
return new A.ft(new Int16Array(s*c),s,c)
case 8:s=a===B.u?r:256
return new A.fu(new Int32Array(s*c),s,c)
case 9:s=a===B.u?r:256
return new A.fq(new Uint16Array(s*c),s,c)
case 10:s=a===B.u?r:256
return new A.fr(new Float32Array(s*c),s,c)
case 11:s=a===B.u?r:256
return new A.fs(new Float64Array(s*c),s,c)}},
siv(a){this.d=t.lG.a(a)}}
A.kp.prototype={
$4(a,b,c,d){var s=this.b
return a+this.a*(b-a+s*(a+d-c-b))+s*(c-a)},
$S:40}
A.ko.prototype={
$5(a,b,c,d,e){var s=-b,r=a*a
return c+0.5*(a*(s+d)+r*(2*b-5*c+4*d-e)+r*a*(s+3*c-3*d+e))},
$S:41}
A.aq.prototype={
gW(){return null},
iF(a,b){var s,r,q,p,o,n,m,l=this
if(b==null)return J.I(l.gt(l))
s=l.c
if(s===4){s=b===B.em
if(s||b===B.c6||b===B.c5){r=a?l:l.R()
if(s)for(s=r.gF(r);s.C();){q=s.gN()
p=q.gq()
o=q.gB()
n=q.gA()
q.sq(q.gv())
q.sB(n)
q.sA(o)
q.sv(p)}else if(b===B.c6)for(s=r.gF(r);s.C();){q=s.gN()
p=q.gq()
o=q.gB()
n=q.gA()
q.sq(q.gv())
q.sB(p)
q.sA(o)
q.sv(n)}else if(b===B.c5)for(s=r.gF(r);s.C();){q=s.gN()
p=q.gq()
o=q.gB()
n=q.gA()
m=q.gv()
q.sq(n)
q.sB(o)
q.sA(p)
q.sv(m)}return J.I(r.gt(r))}}else if(s===3)if(b===B.en){r=a?l:l.R()
for(s=r.gF(r);s.C();){q=s.gN()
p=q.gq()
q.sq(q.gA())
q.sA(p)}return J.I(r.gt(r))}return J.I(l.gt(l))}}
A.dL.prototype={
aA(a){var s=this,r=s.d
if(a)r=new Uint16Array(r.length)
else r=new Uint16Array(A.o(r))
return new A.dL(r,s.a,s.b,s.c)},
R(){return this.aA(!1)},
gM(){return B.T},
gbv(){return B.bx},
gt(a){return B.v.gt(this.d)},
gaU(){return 16},
gaB(){return this.a*this.c*2},
gF(a){return A.pR(this)},
gp(a){return this.d.byteLength},
gG(){return 1},
gb6(){return!0},
b4(a,b,c,d){var s=new Uint16Array(4),r=new A.dt(s)
s[0]=A.R(a)
s[1]=A.R(b)
s[2]=A.R(c)
s[3]=A.R(d)
s=r
return s},
S(a,b,c){if(c==null||!(c instanceof A.cU)||c.d!==this)c=A.pR(this)
c.ad(a,b)
return c},
b0(a,b){return this.S(a,b,null)},
aS(a,b,c){var s,r=this.c,q=b*this.a*r+a*r
r=this.d
s=A.R(c)
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s},
aT(a,b,c,d,e){var s,r=this.c,q=b*this.a*r+a*r,p=this.d,o=A.R(c)
p.$flags&2&&A.b(p)
s=p.length
if(!(q>=0&&q<s))return A.a(p,q)
p[q]=o
if(r>2){r=q+1
o=A.R(d)
if(!(r<s))return A.a(p,r)
p[r]=o
o=q+2
r=A.R(e)
if(!(o<s))return A.a(p,o)
p[o]=r}},
aw(a,b,c,d,e,f){var s,r,q=this.c,p=b*this.a*q+a*q,o=this.d,n=A.R(c)
o.$flags&2&&A.b(o)
s=o.length
if(!(p>=0&&p<s))return A.a(o,p)
o[p]=n
if(q===2){q=p+1
n=A.R(f)
if(!(q<s))return A.a(o,q)
o[q]=n}else if(q>2){n=p+1
r=A.R(d)
if(!(n<s))return A.a(o,n)
o[n]=r
r=p+2
n=A.R(e)
if(!(r<s))return A.a(o,r)
o[r]=n
if(q>3){q=p+3
n=A.R(f)
if(!(q<s))return A.a(o,q)
o[q]=n}}},
D(a){return"ImageDataFloat16("+this.a+", "+this.b+", "+this.c+")"},
b2(a,b){}}
A.dM.prototype={
aA(a){var s=this,r=s.d
if(a)r=new Float32Array(r.length)
else r=new Float32Array(A.o(r))
return new A.dM(r,s.a,s.b,s.c)},
R(){return this.aA(!1)},
gM(){return B.Y},
gbv(){return B.bx},
gt(a){return B.a1.gt(this.d)},
gaU(){return 32},
gF(a){return A.pS(this)},
gp(a){return this.d.byteLength},
gG(){return 1},
gaB(){return this.a*this.c*4},
gb6(){return!0},
b4(a,b,c,d){var s=new Float32Array(4),r=new A.du(s)
s[0]=a
s[1]=b
s[2]=c
s[3]=d
s=r
return s},
S(a,b,c){if(c==null||!(c instanceof A.cV)||c.d!==this)c=A.pS(this)
c.ad(a,b)
return c},
b0(a,b){return this.S(a,b,null)},
aS(a,b,c){var s=this.c,r=b*this.a*s+a*s
s=this.d
s.$flags&2&&A.b(s)
if(!(r>=0&&r<s.length))return A.a(s,r)
s[r]=c},
aT(a,b,c,d,e){var s,r=this.c,q=b*this.a*r+a*r,p=this.d
p.$flags&2&&A.b(p)
s=p.length
if(!(q>=0&&q<s))return A.a(p,q)
p[q]=c
if(r>2){r=q+1
if(!(r<s))return A.a(p,r)
p[r]=d
r=q+2
if(!(r<s))return A.a(p,r)
p[r]=e}},
aw(a,b,c,d,e,f){var s,r,q=this.c,p=b*this.a*q+a*q,o=this.d
o.$flags&2&&A.b(o)
s=o.length
if(!(p>=0&&p<s))return A.a(o,p)
o[p]=c
if(q===2){q=p+1
if(!(q<s))return A.a(o,q)
o[q]=f}else if(q>2){r=p+1
if(!(r<s))return A.a(o,r)
o[r]=d
r=p+2
if(!(r<s))return A.a(o,r)
o[r]=e
if(q>3){q=p+3
if(!(q<s))return A.a(o,q)
o[q]=f}}},
D(a){return"ImageDataFloat32("+this.a+", "+this.b+", "+this.c+")"},
b2(a,b){}}
A.eT.prototype={
aA(a){var s=this,r=s.d
if(a)r=new Float64Array(r.length)
else r=new Float64Array(A.o(r))
return new A.eT(r,s.a,s.b,s.c)},
R(){return this.aA(!1)},
gM(){return B.aa},
gbv(){return B.bx},
gt(a){return B.x.gt(this.d)},
gp(a){return this.d.byteLength},
gaU(){return 64},
gF(a){return A.pT(this)},
gG(){return 1},
gaB(){return this.a*this.c*8},
gb6(){return!0},
b4(a,b,c,d){var s=new Float64Array(4),r=new A.dv(s)
s[0]=a
s[1]=b
s[2]=c
s[3]=d
s=r
return s},
S(a,b,c){if(c==null||!(c instanceof A.cW)||c.d!==this)c=A.pT(this)
c.ad(a,b)
return c},
b0(a,b){return this.S(a,b,null)},
aS(a,b,c){var s=this.c,r=b*this.a*s+a*s
s=this.d
s.$flags&2&&A.b(s)
if(!(r>=0&&r<s.length))return A.a(s,r)
s[r]=c},
aT(a,b,c,d,e){var s,r=this.c,q=b*this.a*r+a*r,p=this.d
p.$flags&2&&A.b(p)
s=p.length
if(!(q>=0&&q<s))return A.a(p,q)
p[q]=c
if(r>2){r=q+1
if(!(r<s))return A.a(p,r)
p[r]=d
r=q+2
if(!(r<s))return A.a(p,r)
p[r]=e}},
aw(a,b,c,d,e,f){var s,r,q=this.c,p=b*this.a*q+a*q,o=this.d
o.$flags&2&&A.b(o)
s=o.length
if(!(p>=0&&p<s))return A.a(o,p)
o[p]=c
if(q===2){q=p+1
if(!(q<s))return A.a(o,q)
o[q]=f}else if(q>2){r=p+1
if(!(r<s))return A.a(o,r)
o[r]=d
r=p+2
if(!(r<s))return A.a(o,r)
o[r]=e
if(q>3){q=p+3
if(!(q<s))return A.a(o,q)
o[q]=f}}},
D(a){return"ImageDataFloat64("+this.a+", "+this.b+", "+this.c+")"},
b2(a,b){}}
A.eU.prototype={
aA(a){var s=this,r=s.d
if(a)r=new Int16Array(r.length)
else r=new Int16Array(A.o(r))
return new A.eU(r,s.a,s.b,s.c)},
R(){return this.aA(!1)},
gM(){return B.ag},
gbv(){return B.bw},
gt(a){return B.y.gt(this.d)},
gF(a){return A.pU(this)},
gp(a){return this.d.byteLength},
gG(){return 32767},
gb6(){return!0},
gaU(){return 16},
gaB(){return this.a*this.c*2},
b4(a,b,c,d){var s=B.b.h(a),r=B.b.h(b),q=B.b.h(c),p=B.b.h(d),o=new Int16Array(4),n=new A.dw(o)
o[0]=s
o[1]=r
o[2]=q
o[3]=p
s=n
return s},
S(a,b,c){if(c==null||!(c instanceof A.cX)||c.d!==this)c=A.pU(this)
c.ad(a,b)
return c},
b0(a,b){return this.S(a,b,null)},
aS(a,b,c){var s,r=this.c,q=b*this.a*r+a*r
r=this.d
s=B.b.h(c)
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s},
aT(a,b,c,d,e){var s,r=this.c,q=b*this.a*r+a*r,p=this.d,o=B.b.h(c)
p.$flags&2&&A.b(p)
s=p.length
if(!(q>=0&&q<s))return A.a(p,q)
p[q]=o
if(r>2){r=q+1
o=B.b.h(d)
if(!(r<s))return A.a(p,r)
p[r]=o
o=q+2
r=B.b.h(e)
if(!(o<s))return A.a(p,o)
p[o]=r}},
aw(a,b,c,d,e,f){var s,r,q=this.c,p=b*this.a*q+a*q,o=this.d,n=B.b.h(c)
o.$flags&2&&A.b(o)
s=o.length
if(!(p>=0&&p<s))return A.a(o,p)
o[p]=n
if(q===2){q=p+1
n=B.b.h(f)
if(!(q<s))return A.a(o,q)
o[q]=n}else if(q>2){n=p+1
r=B.b.h(d)
if(!(n<s))return A.a(o,n)
o[n]=r
r=p+2
n=B.b.h(e)
if(!(r<s))return A.a(o,r)
o[r]=n
if(q>3){q=p+3
n=B.b.h(f)
if(!(q<s))return A.a(o,q)
o[q]=n}}},
D(a){return"ImageDataInt16("+this.a+", "+this.b+", "+this.c+")"},
b2(a,b){}}
A.eV.prototype={
aA(a){var s=this,r=s.d
if(a)r=new Int32Array(r.length)
else r=new Int32Array(A.o(r))
return new A.eV(r,s.a,s.b,s.c)},
R(){return this.aA(!1)},
gM(){return B.ah},
gbv(){return B.bw},
gt(a){return B.t.gt(this.d)},
gaU(){return 32},
gaB(){return this.a*this.c*4},
gF(a){return A.pV(this)},
gp(a){return this.d.byteLength},
gG(){return 2147483647},
gb6(){return!0},
b4(a,b,c,d){var s=B.b.h(a),r=B.b.h(b),q=B.b.h(c),p=B.b.h(d),o=new Int32Array(4),n=new A.dx(o)
o[0]=s
o[1]=r
o[2]=q
o[3]=p
s=n
return s},
S(a,b,c){if(c==null||!(c instanceof A.cY)||c.d!==this)c=A.pV(this)
c.ad(a,b)
return c},
b0(a,b){return this.S(a,b,null)},
aS(a,b,c){var s,r=this.c,q=b*this.a*r+a*r
r=this.d
s=B.b.h(c)
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s},
aT(a,b,c,d,e){var s,r=this.c,q=b*this.a*r+a*r,p=this.d,o=B.b.h(c)
p.$flags&2&&A.b(p)
s=p.length
if(!(q>=0&&q<s))return A.a(p,q)
p[q]=o
if(r>2){r=q+1
o=B.b.h(d)
if(!(r<s))return A.a(p,r)
p[r]=o
o=q+2
r=B.b.h(e)
if(!(o<s))return A.a(p,o)
p[o]=r}},
aw(a,b,c,d,e,f){var s,r,q=this.c,p=b*this.a*q+a*q,o=this.d,n=B.b.h(c)
o.$flags&2&&A.b(o)
s=o.length
if(!(p>=0&&p<s))return A.a(o,p)
o[p]=n
if(q===2){q=p+1
n=B.b.h(f)
if(!(q<s))return A.a(o,q)
o[q]=n}else if(q>2){n=p+1
r=B.b.h(d)
if(!(n<s))return A.a(o,n)
o[n]=r
r=p+2
n=B.b.h(e)
if(!(r<s))return A.a(o,r)
o[r]=n
if(q>3){q=p+3
n=B.b.h(f)
if(!(q<s))return A.a(o,q)
o[q]=n}}},
D(a){return"ImageDataInt32("+this.a+", "+this.b+", "+this.c+")"},
b2(a,b){}}
A.eW.prototype={
aA(a){var s=this,r=s.d
if(a)r=new Int8Array(r.length)
else r=new Int8Array(A.o(r))
return new A.eW(r,s.a,s.b,s.c)},
R(){return this.aA(!1)},
gM(){return B.af},
gbv(){return B.bw},
gt(a){return B.O.gt(this.d)},
gaB(){return this.a*this.c},
gF(a){return A.pW(this)},
gp(a){return this.d.byteLength},
gG(){return 127},
gb6(){return!0},
gaU(){return 8},
b4(a,b,c,d){var s=B.b.h(a),r=B.b.h(b),q=B.b.h(c),p=B.b.h(d),o=new Int8Array(4),n=new A.dy(o)
o[0]=s
o[1]=r
o[2]=q
o[3]=p
s=n
return s},
S(a,b,c){if(c==null||!(c instanceof A.cZ)||c.d!==this)c=A.pW(this)
c.ad(a,b)
return c},
b0(a,b){return this.S(a,b,null)},
aS(a,b,c){var s,r=this.c,q=b*(this.a*r)+a*r
r=this.d
s=B.b.h(c)
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s},
aT(a,b,c,d,e){var s,r=this.c,q=b*(this.a*r)+a*r,p=this.d,o=B.b.h(c)
p.$flags&2&&A.b(p)
s=p.length
if(!(q>=0&&q<s))return A.a(p,q)
p[q]=o
if(r>2){r=q+1
o=B.b.h(d)
if(!(r<s))return A.a(p,r)
p[r]=o
o=q+2
r=B.b.h(e)
if(!(o<s))return A.a(p,o)
p[o]=r}},
aw(a,b,c,d,e,f){var s,r,q=this.c,p=b*(this.a*q)+a*q,o=this.d,n=B.b.h(c)
o.$flags&2&&A.b(o)
s=o.length
if(!(p>=0&&p<s))return A.a(o,p)
o[p]=n
if(q===2){q=p+1
n=B.b.h(f)
if(!(q<s))return A.a(o,q)
o[q]=n}else if(q>2){n=p+1
r=B.b.h(d)
if(!(n<s))return A.a(o,n)
o[n]=r
r=p+2
n=B.b.h(e)
if(!(r<s))return A.a(o,r)
o[r]=n
if(q>3){q=p+3
n=B.b.h(f)
if(!(q<s))return A.a(o,q)
o[q]=n}}},
D(a){return"ImageDataInt8("+this.a+", "+this.b+", "+this.c+")"},
b2(a,b){}}
A.dN.prototype={
oa(a,b,c){var s=Math.max(this.e*b,1)
s=new Uint8Array(s)
this.d!==$&&A.B()
this.d=s},
aA(a){var s,r=this,q=r.d
if(a){q===$&&A.c()
q=new Uint8Array(q.length)}else{q===$&&A.c()
q=new Uint8Array(A.o(q))}s=r.f
s=s==null?null:s.R()
return new A.dN(q,r.e,s,r.a,r.b,r.c)},
R(){return this.aA(!1)},
gM(){return B.L},
gbv(){return B.a9},
gp(a){var s=this.d
s===$&&A.c()
return s.byteLength},
gG(){var s=this.f
s=s==null?null:s.gG()
return s==null?1:s},
gb6(){return!1},
gt(a){var s=this.d
s===$&&A.c()
return B.d.gt(s)},
gaU(){return 1},
gF(a){return A.io(this)},
b4(a,b,c,d){var s=new A.dA(4,0)
s.ao(B.b.h(a),B.b.h(b),B.b.h(c),B.b.h(d))
return s},
S(a,b,c){if(c==null||!(c instanceof A.d_)||c.f!==this)c=A.io(this)
c.ad(a,b)
return c},
b0(a,b){return this.S(a,b,null)},
aS(a,b,c){var s,r=this
if(r.c<1)return
s=r.r;(s==null?r.r=A.io(r):s).ad(a,b)
r.r.aD(0,c)},
aT(a,b,c,d,e){var s,r=this
if(r.c<1)return
s=r.r;(s==null?r.r=A.io(r):s).ad(a,b)
r.r.aL(c,d,e)},
aw(a,b,c,d,e,f){var s,r=this
if(r.c<1)return
s=r.r;(s==null?r.r=A.io(r):s).ad(a,b)
r.r.ao(c,d,e,f)},
D(a){return"ImageDataUint1("+this.a+", "+this.b+", "+this.c+")"},
b2(a,b){},
gaB(){return this.e},
gW(){return this.f}}
A.cO.prototype={
aA(a){var s,r=this,q=r.d
if(a)q=new Uint16Array(q.length)
else q=new Uint16Array(A.o(q))
s=r.e
s=s==null?null:s.R()
return new A.cO(q,s,r.a,r.b,r.c)},
R(){return this.aA(!1)},
gM(){return B.u},
gbv(){return B.a9},
gt(a){return B.v.gt(this.d)},
gaU(){return 16},
gG(){var s=this.e
s=s==null?null:s.gG()
return s==null?65535:s},
gaB(){return this.a*this.c*2},
gF(a){return A.pX(this)},
gp(a){return this.d.byteLength},
gb6(){return!0},
b4(a,b,c,d){var s=B.b.h(a),r=B.b.h(b),q=B.b.h(c),p=B.b.h(d),o=new Uint16Array(4),n=new A.dB(o)
o[0]=s
o[1]=r
o[2]=q
o[3]=p
s=n
return s},
S(a,b,c){if(c==null||!(c instanceof A.d0)||c.d!==this)c=A.pX(this)
c.ad(a,b)
return c},
b0(a,b){return this.S(a,b,null)},
aS(a,b,c){var s,r=this.c,q=b*this.a*r+a*r
r=this.d
s=B.b.h(c)
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s},
aT(a,b,c,d,e){var s,r=this.c,q=b*this.a*r+a*r,p=this.d,o=B.b.h(c)
p.$flags&2&&A.b(p)
s=p.length
if(!(q>=0&&q<s))return A.a(p,q)
p[q]=o
if(r>2){r=q+1
o=B.b.h(d)
if(!(r<s))return A.a(p,r)
p[r]=o
o=q+2
r=B.b.h(e)
if(!(o<s))return A.a(p,o)
p[o]=r}},
aw(a,b,c,d,e,f){var s,r,q=this.c,p=b*this.a*q+a*q,o=this.d,n=B.b.h(c)
o.$flags&2&&A.b(o)
s=o.length
if(!(p>=0&&p<s))return A.a(o,p)
o[p]=n
if(q===2){q=p+1
n=B.b.h(f)
if(!(q<s))return A.a(o,q)
o[q]=n}else if(q>2){n=p+1
r=B.b.h(d)
if(!(n<s))return A.a(o,n)
o[n]=r
r=p+2
n=B.b.h(e)
if(!(r<s))return A.a(o,r)
o[r]=n
if(q>3){q=p+3
n=B.b.h(f)
if(!(q<s))return A.a(o,q)
o[q]=n}}},
D(a){return"ImageDataUint16("+this.a+", "+this.b+", "+this.c+")"},
b2(a,b){},
gW(){return this.e}}
A.dO.prototype={
ob(a,b,c){var s=Math.max(this.e*b,1)
s=new Uint8Array(s)
this.d!==$&&A.B()
this.d=s},
aA(a){var s,r=this,q=r.d
if(a){q===$&&A.c()
q=new Uint8Array(q.length)}else{q===$&&A.c()
q=new Uint8Array(A.o(q))}s=r.f
s=s==null?null:s.R()
return new A.dO(q,r.e,s,r.a,r.b,r.c)},
R(){return this.aA(!1)},
gM(){return B.R},
gbv(){return B.a9},
gaU(){return 2},
gt(a){var s=this.d
s===$&&A.c()
return B.d.gt(s)},
gF(a){return A.ip(this)},
gp(a){var s=this.d
s===$&&A.c()
return s.byteLength},
gG(){var s=this.f
s=s==null?null:s.gG()
return s==null?3:s},
gb6(){return!1},
b4(a,b,c,d){var s=new A.dC(4,0)
s.ao(B.b.h(a),B.b.h(b),B.b.h(c),B.b.h(d))
return s},
S(a,b,c){if(c==null||!(c instanceof A.d1)||c.f!==this)c=A.ip(this)
c.ad(a,b)
return c},
b0(a,b){return this.S(a,b,null)},
aS(a,b,c){var s,r=this
if(r.c<1)return
s=r.r;(s==null?r.r=A.ip(r):s).ad(a,b)
r.r.aE(0,c)},
aT(a,b,c,d,e){var s,r=this
if(r.c<1)return
s=r.r;(s==null?r.r=A.ip(r):s).ad(a,b)
r.r.aL(c,d,e)},
aw(a,b,c,d,e,f){var s,r=this
if(r.c<1)return
s=r.r;(s==null?r.r=A.ip(r):s).ad(a,b)
r.r.ao(c,d,e,f)},
D(a){return"ImageDataUint2("+this.a+", "+this.b+", "+this.c+")"},
b2(a,b){},
gaB(){return this.e},
gW(){return this.f}}
A.dP.prototype={
aA(a){var s=this,r=s.d
if(a)r=new Uint32Array(r.length)
else r=new Uint32Array(A.o(r))
return new A.dP(r,s.a,s.b,s.c)},
R(){return this.aA(!1)},
gM(){return B.ab},
gbv(){return B.a9},
gt(a){return B.q.gt(this.d)},
gaB(){return this.a*this.c*4},
gaU(){return 32},
gG(){return 4294967295},
gF(a){return A.pY(this)},
gp(a){return this.d.byteLength},
gb6(){return!0},
b4(a,b,c,d){var s=B.b.h(a),r=B.b.h(b),q=B.b.h(c),p=B.b.h(d),o=new Uint32Array(4),n=new A.dD(o)
o[0]=s
o[1]=r
o[2]=q
o[3]=p
s=n
return s},
S(a,b,c){if(c==null||!(c instanceof A.d2)||c.d!==this)c=A.pY(this)
c.ad(a,b)
return c},
b0(a,b){return this.S(a,b,null)},
aS(a,b,c){var s,r=this.c,q=b*this.a*r+a*r
r=this.d
s=B.b.h(c)
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s},
aT(a,b,c,d,e){var s,r=this.c,q=b*this.a*r+a*r,p=this.d,o=B.b.h(c)
p.$flags&2&&A.b(p)
s=p.length
if(!(q>=0&&q<s))return A.a(p,q)
p[q]=o
if(r>2){r=q+1
o=B.b.h(d)
if(!(r<s))return A.a(p,r)
p[r]=o
o=q+2
r=B.b.h(e)
if(!(o<s))return A.a(p,o)
p[o]=r}},
aw(a,b,c,d,e,f){var s,r,q=this.c,p=b*this.a*q+a*q,o=this.d,n=B.b.h(c)
o.$flags&2&&A.b(o)
s=o.length
if(!(p>=0&&p<s))return A.a(o,p)
o[p]=n
if(q===2){q=p+1
n=B.b.h(f)
if(!(q<s))return A.a(o,q)
o[q]=n}else if(q>2){n=p+1
r=B.b.h(d)
if(!(n<s))return A.a(o,n)
o[n]=r
r=p+2
n=B.b.h(e)
if(!(r<s))return A.a(o,r)
o[r]=n
if(q>3){q=p+3
n=B.b.h(f)
if(!(q<s))return A.a(o,q)
o[q]=n}}},
D(a){return"ImageDataUint32("+this.a+", "+this.b+", "+this.c+")"},
b2(a,b){}}
A.dQ.prototype={
oc(a,b,c){var s=Math.max(this.e*b,1)
s=new Uint8Array(s)
this.d!==$&&A.B()
this.d=s},
aA(a){var s,r=this,q=r.d
if(a){q===$&&A.c()
q=new Uint8Array(q.length)}else{q===$&&A.c()
q=new Uint8Array(A.o(q))}s=r.f
s=s==null?null:s.R()
return new A.dQ(q,r.e,s,r.a,r.b,r.c)},
R(){return this.aA(!1)},
gM(){return B.S},
gbv(){return B.a9},
gt(a){var s=this.d
s===$&&A.c()
return B.d.gt(s)},
gF(a){return A.iq(this)},
gp(a){var s=this.d
s===$&&A.c()
return s.byteLength},
gG(){var s=this.f
s=s==null?null:s.gG()
return s==null?15:s},
gb6(){return!1},
gaU(){return 4},
b4(a,b,c,d){var s=B.b.h(a),r=B.b.h(b),q=B.b.h(c),p=B.b.h(d),o=new A.dE(4,new Uint8Array(2))
o.ao(s,r,q,p)
s=o
return s},
S(a,b,c){if(c==null||!(c instanceof A.d3)||c.e!==this)c=A.iq(this)
c.ad(a,b)
return c},
b0(a,b){return this.S(a,b,null)},
aS(a,b,c){var s,r=this
if(r.c<1)return
s=r.r;(s==null?r.r=A.iq(r):s).ad(a,b)
r.r.aF(0,c)},
aT(a,b,c,d,e){var s,r=this
if(r.c<1)return
s=r.r;(s==null?r.r=A.iq(r):s).ad(a,b)
r.r.aL(c,d,e)},
aw(a,b,c,d,e,f){var s,r=this
if(r.c<1)return
s=r.r;(s==null?r.r=A.iq(r):s).ad(a,b)
r.r.ao(c,d,e,f)},
D(a){return"ImageDataUint4("+this.a+", "+this.b+", "+this.c+")"},
b2(a,b){},
gaB(){return this.e},
gW(){return this.f}}
A.cn.prototype={
aA(a){var s,r=this,q=r.d
if(a)q=new Uint8Array(q.length)
else q=new Uint8Array(A.o(q))
s=r.e
s=s==null?null:s.R()
return new A.cn(q,s,r.a,r.b,r.c)},
R(){return this.aA(!1)},
gM(){return B.e},
gbv(){return B.a9},
gt(a){return B.d.gt(this.d)},
gaB(){return this.a*this.c},
gaU(){return 8},
gF(a){return A.o6(this)},
gp(a){return this.d.byteLength},
gG(){var s=this.e
s=s==null?null:s.gG()
return s==null?255:s},
gb6(){return!1},
b4(a,b,c,d){var s=A.ts(B.b.h(B.b.L(a,0,255)),B.b.h(B.b.L(b,0,255)),B.b.h(B.b.L(c,0,255)),B.b.h(B.b.L(d,0,255)))
return s},
S(a,b,c){if(c==null||!(c instanceof A.d4)||c.d!==this)c=A.o6(this)
c.ad(a,b)
return c},
b0(a,b){return this.S(a,b,null)},
aS(a,b,c){var s,r=this.c,q=b*(this.a*r)+a*r
r=this.d
s=B.b.h(c)
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s},
aT(a,b,c,d,e){var s,r=this.c,q=b*(this.a*r)+a*r,p=this.d,o=B.b.h(c)
p.$flags&2&&A.b(p)
s=p.length
if(!(q>=0&&q<s))return A.a(p,q)
p[q]=o
if(r>2){r=q+1
o=B.b.h(d)
if(!(r<s))return A.a(p,r)
p[r]=o
o=q+2
r=B.b.h(e)
if(!(o<s))return A.a(p,o)
p[o]=r}},
aw(a,b,c,d,e,f){var s,r,q=this.c,p=b*(this.a*q)+a*q,o=this.d,n=B.b.h(c)
o.$flags&2&&A.b(o)
s=o.length
if(!(p>=0&&p<s))return A.a(o,p)
o[p]=n
if(q===2){q=p+1
n=B.b.h(f)
if(!(q<s))return A.a(o,q)
o[q]=n}else if(q>2){n=p+1
r=B.b.h(d)
if(!(n<s))return A.a(o,n)
o[n]=r
r=p+2
n=B.b.h(e)
if(!(r<s))return A.a(o,r)
o[r]=n
if(q>3){q=p+3
n=B.b.h(f)
if(!(q<s))return A.a(o,q)
o[q]=n}}},
D(a){return"ImageDataUint8("+this.a+", "+this.b+", "+this.c+")"},
b2(a,b){var s,r,q,p,o,n,m,l,k,j,i,h=this,g=null,f=b==null?g:A.aP(b,g,B.e,g,g),e=h.c
if(e===1){s=f==null?0:B.a.L(A.r(f.gq()),0,255)
e=h.d
B.d.V(e,0,e.length,s)}else if(e===2){e=f==null
s=e?0:B.a.L(A.r(f.gq()),0,255)
r=e?0:B.a.L(A.r(f.gv()),0,255)
q=J.p8(B.d.gt(h.d),0,null)
B.v.V(q,0,q.length,(r<<8|s)>>>0)}else if(e===4){e=f==null
s=e?0:B.a.L(A.r(f.gq()),0,255)
p=e?0:B.a.L(A.r(f.gB()),0,255)
o=e?0:B.a.L(A.r(f.gA()),0,255)
r=e?0:B.a.L(A.r(f.gv()),0,255)
n=J.az(B.d.gt(h.d),0,null)
B.q.V(n,0,n.length,(r<<24|o<<16|p<<8|s)>>>0)}else{e=f==null
s=e?0:B.a.L(A.r(f.gq()),0,255)
p=e?0:B.a.L(A.r(f.gB()),0,255)
o=e?0:B.a.L(A.r(f.gA()),0,255)
for(m=A.o6(h),e=m.d,l=e.c>0,e=e.d,k=e.$flags|0;m.C();){if(l){j=m.c
i=B.b.h(B.a.L(s,0,255))
k&2&&A.b(e)
if(!(j>=0&&j<e.length))return A.a(e,j)
e[j]=i}m.sB(p)
m.sA(o)}}},
gW(){return this.e}}
A.dR.prototype={
a8(){return"Interpolation."+this.b}}
A.b4.prototype={}
A.fq.prototype={
R(){return new A.fq(new Uint16Array(A.o(this.c)),this.a,this.b)},
gt(a){return B.v.gt(this.c)},
gM(){return B.T},
gG(){return 1},
a2(a,b,c){var s,r,q=this.b
if(b<q){s=this.c
q=a*q+b
r=A.R(c)
s.$flags&2&&A.b(s)
if(!(q>=0&&q<s.length))return A.a(s,q)
s[q]=r}},
bk(a,b,c,d){var s,r,q,p,o=this.b
a*=o
s=this.c
r=A.R(b)
s.$flags&2&&A.b(s)
q=s.length
if(!(a>=0&&a<q))return A.a(s,a)
s[a]=r
if(o>1){r=a+1
p=A.R(c)
if(!(r<q))return A.a(s,r)
s[r]=p
if(o>2){o=a+2
r=A.R(d)
if(!(o<q))return A.a(s,o)
s[o]=r}}},
aY(a,b){var s,r=this.b
if(b<r){s=this.c
r=a*r+b
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]
s=$.O
s=s!=null?s:A.T()
if(!(r<s.length))return A.a(s,r)
r=s[r]}else r=0
return r},
bj(a){var s,r
a*=this.b
s=this.c
if(!(a>=0&&a<s.length))return A.a(s,a)
s=s[a]
r=$.O
r=r!=null?r:A.T()
if(!(s<r.length))return A.a(r,s)
return r[s]},
bi(a){var s,r=this.b
if(r<2)return 0
s=this.c
r=a*r+1
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]
s=$.O
s=s!=null?s:A.T()
if(!(r<s.length))return A.a(s,r)
return s[r]},
bh(a){var s,r=this.b
if(r<3)return 0
s=this.c
r=a*r+2
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]
s=$.O
s=s!=null?s:A.T()
if(!(r<s.length))return A.a(s,r)
return s[r]},
bq(a){var s,r=this.b
if(r<4)return 0
s=this.c
r=a*r+3
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]
s=$.O
s=s!=null?s:A.T()
if(!(r<s.length))return A.a(s,r)
return s[r]},
bI(a,b){return this.a2(a,0,b)},
bH(a,b){return this.a2(a,1,b)},
bG(a,b){return this.a2(a,2,b)},
bF(a,b){return this.a2(a,3,b)}}
A.fr.prototype={
R(){return new A.fr(new Float32Array(A.o(this.c)),this.a,this.b)},
gt(a){return B.a1.gt(this.c)},
gM(){return B.Y},
gG(){return 1},
a2(a,b,c){var s,r=this.b
if(b<r){s=this.c
r=a*r+b
s.$flags&2&&A.b(s)
if(!(r>=0&&r<s.length))return A.a(s,r)
s[r]=c}},
bk(a,b,c,d){var s,r,q,p=this.b
a*=p
s=this.c
s.$flags&2&&A.b(s)
r=s.length
if(!(a>=0&&a<r))return A.a(s,a)
s[a]=b
if(p>1){q=a+1
if(!(q<r))return A.a(s,q)
s[q]=c
if(p>2){p=a+2
if(!(p<r))return A.a(s,p)
s[p]=d}}},
aY(a,b){var s,r=this.b
if(b<r){s=this.c
r=a*r+b
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]}else r=0
return r},
bj(a){var s
a*=this.b
s=this.c
if(!(a>=0&&a<s.length))return A.a(s,a)
return s[a]},
bi(a){var s,r=this.b
if(r<2)return 0
s=this.c
r=a*r+1
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]},
bh(a){var s,r=this.b
if(r<3)return 0
s=this.c
r=a*r+2
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]},
bq(a){var s,r=this.b
if(r<4)return 0
s=this.c
r=a*r+3
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]},
bI(a,b){return this.a2(a,0,b)},
bH(a,b){return this.a2(a,1,b)},
bG(a,b){return this.a2(a,2,b)},
bF(a,b){return this.a2(a,3,b)}}
A.fs.prototype={
R(){return new A.fs(new Float64Array(A.o(this.c)),this.a,this.b)},
gt(a){return B.x.gt(this.c)},
gM(){return B.aa},
gG(){return 1},
a2(a,b,c){var s,r=this.b
if(b<r){s=this.c
r=a*r+b
s.$flags&2&&A.b(s)
if(!(r>=0&&r<s.length))return A.a(s,r)
s[r]=c}},
bk(a,b,c,d){var s,r,q,p=this.b
a*=p
s=this.c
s.$flags&2&&A.b(s)
r=s.length
if(!(a>=0&&a<r))return A.a(s,a)
s[a]=b
if(p>1){q=a+1
if(!(q<r))return A.a(s,q)
s[q]=c
if(p>2){p=a+2
if(!(p<r))return A.a(s,p)
s[p]=d}}},
aY(a,b){var s,r=this.b
if(b<r){s=this.c
r=a*r+b
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]}else r=0
return r},
bj(a){var s
a*=this.b
s=this.c
if(!(a>=0&&a<s.length))return A.a(s,a)
return s[a]},
bi(a){var s,r=this.b
if(r<2)return 0
s=this.c
r=a*r+1
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]},
bh(a){var s,r=this.b
if(r<3)return 0
s=this.c
r=a*r+2
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]},
bq(a){var s,r=this.b
if(r<4)return 0
s=this.c
r=a*r+3
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]},
bI(a,b){return this.a2(a,0,b)},
bH(a,b){return this.a2(a,1,b)},
bG(a,b){return this.a2(a,2,b)},
bF(a,b){return this.a2(a,3,b)}}
A.ft.prototype={
R(){return new A.ft(new Int16Array(A.o(this.c)),this.a,this.b)},
gt(a){return B.y.gt(this.c)},
gM(){return B.ag},
gG(){return 32767},
a2(a,b,c){var s,r,q=this.b
if(b<q){s=this.c
q=a*q+b
r=B.a.h(c)
s.$flags&2&&A.b(s)
if(!(q>=0&&q<s.length))return A.a(s,q)
s[q]=r}},
bk(a,b,c,d){var s,r,q,p,o=this.b
a*=o
s=this.c
r=B.b.h(b)
s.$flags&2&&A.b(s)
q=s.length
if(!(a>=0&&a<q))return A.a(s,a)
s[a]=r
if(o>1){r=a+1
p=B.b.h(c)
if(!(r<q))return A.a(s,r)
s[r]=p
if(o>2){o=a+2
r=B.b.h(d)
if(!(o<q))return A.a(s,o)
s[o]=r}}},
aY(a,b){var s,r=this.b
if(b<r){s=this.c
r=a*r+b
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]}else r=0
return r},
bj(a){var s
a*=this.b
s=this.c
if(!(a>=0&&a<s.length))return A.a(s,a)
return s[a]},
bi(a){var s,r=this.b
if(r<2)return 0
s=this.c
r=a*r+1
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]},
bh(a){var s,r=this.b
if(r<3)return 0
s=this.c
r=a*r+2
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]},
bq(a){var s,r=this.b
if(r<4)return 0
s=this.c
r=a*r+3
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]},
bI(a,b){return this.a2(a,0,b)},
bH(a,b){return this.a2(a,1,b)},
bG(a,b){return this.a2(a,2,b)},
bF(a,b){return this.a2(a,3,b)}}
A.fu.prototype={
R(){return new A.fu(new Int32Array(A.o(this.c)),this.a,this.b)},
gt(a){return B.t.gt(this.c)},
gM(){return B.ah},
gG(){return 2147483647},
a2(a,b,c){var s,r,q=this.b
if(b<q){s=this.c
q=a*q+b
r=B.a.h(c)
s.$flags&2&&A.b(s)
if(!(q>=0&&q<s.length))return A.a(s,q)
s[q]=r}},
bk(a,b,c,d){var s,r,q,p,o=this.b
a*=o
s=this.c
r=B.b.h(b)
s.$flags&2&&A.b(s)
q=s.length
if(!(a>=0&&a<q))return A.a(s,a)
s[a]=r
if(o>1){r=a+1
p=B.b.h(c)
if(!(r<q))return A.a(s,r)
s[r]=p
if(o>2){o=a+2
r=B.b.h(d)
if(!(o<q))return A.a(s,o)
s[o]=r}}},
aY(a,b){var s,r=this.b
if(b<r){s=this.c
r=a*r+b
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]}else r=0
return r},
bj(a){var s
a*=this.b
s=this.c
if(!(a>=0&&a<s.length))return A.a(s,a)
return s[a]},
bi(a){var s,r=this.b
if(r<2)return 0
s=this.c
r=a*r+1
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]},
bh(a){var s,r=this.b
if(r<3)return 0
s=this.c
r=a*r+2
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]},
bq(a){var s,r=this.b
if(r<4)return 0
s=this.c
r=a*r+3
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]},
bI(a,b){return this.a2(a,0,b)},
bH(a,b){return this.a2(a,1,b)},
bG(a,b){return this.a2(a,2,b)},
bF(a,b){return this.a2(a,3,b)}}
A.fv.prototype={
R(){return new A.fv(new Int8Array(A.o(this.c)),this.a,this.b)},
gt(a){return B.O.gt(this.c)},
gM(){return B.af},
gG(){return 127},
a2(a,b,c){var s,r,q=this.b
if(b<q){s=this.c
q=a*q+b
r=B.a.h(c)
s.$flags&2&&A.b(s)
if(!(q>=0&&q<s.length))return A.a(s,q)
s[q]=r}},
bk(a,b,c,d){var s,r,q,p,o=this.b
a*=o
s=this.c
r=B.b.h(b)
s.$flags&2&&A.b(s)
q=s.length
if(!(a>=0&&a<q))return A.a(s,a)
s[a]=r
if(o>1){r=a+1
p=B.b.h(c)
if(!(r<q))return A.a(s,r)
s[r]=p
if(o>2){o=a+2
r=B.b.h(d)
if(!(o<q))return A.a(s,o)
s[o]=r}}},
aY(a,b){var s,r=this.b
if(b<r){s=this.c
r=a*r+b
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]}else r=0
return r},
bj(a){var s
a*=this.b
s=this.c
if(!(a>=0&&a<s.length))return A.a(s,a)
return s[a]},
bi(a){var s,r=this.b
if(r<2)return 0
s=this.c
r=a*r+1
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]},
bh(a){var s,r=this.b
if(r<3)return 0
s=this.c
r=a*r+2
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]},
bq(a){var s,r=this.b
if(r<4)return 0
s=this.c
r=a*r+3
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]},
bI(a,b){return this.a2(a,0,b)},
bH(a,b){return this.a2(a,1,b)},
bG(a,b){return this.a2(a,2,b)},
bF(a,b){return this.a2(a,3,b)}}
A.fw.prototype={
R(){return new A.fw(new Uint16Array(A.o(this.c)),this.a,this.b)},
gt(a){return B.v.gt(this.c)},
gM(){return B.u},
gG(){return 65535},
a2(a,b,c){var s,r,q=this.b
if(b<q){s=this.c
q=a*q+b
r=B.a.h(c)
s.$flags&2&&A.b(s)
if(!(q>=0&&q<s.length))return A.a(s,q)
s[q]=r}},
bk(a,b,c,d){var s,r,q,p,o=this.b
a*=o
s=this.c
r=B.b.h(b)
s.$flags&2&&A.b(s)
q=s.length
if(!(a>=0&&a<q))return A.a(s,a)
s[a]=r
if(o>1){r=a+1
p=B.b.h(c)
if(!(r<q))return A.a(s,r)
s[r]=p
if(o>2){o=a+2
r=B.b.h(d)
if(!(o<q))return A.a(s,o)
s[o]=r}}},
aY(a,b){var s,r=this.b
if(b<r){s=this.c
r=a*r+b
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]}else r=0
return r},
bj(a){var s
a*=this.b
s=this.c
if(!(a>=0&&a<s.length))return A.a(s,a)
return s[a]},
bi(a){var s,r=this.b
if(r<2)return 0
s=this.c
r=a*r+1
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]},
bh(a){var s,r=this.b
if(r<3)return 0
s=this.c
r=a*r+2
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]},
bq(a){var s,r=this.b
if(r<4)return 0
s=this.c
r=a*r+3
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]},
bI(a,b){return this.a2(a,0,b)},
bH(a,b){return this.a2(a,1,b)},
bG(a,b){return this.a2(a,2,b)},
bF(a,b){return this.a2(a,3,b)}}
A.e0.prototype={
R(){return new A.e0(new Uint32Array(A.o(this.c)),this.a,this.b)},
gt(a){return B.q.gt(this.c)},
gM(){return B.ab},
gG(){return 4294967295},
a2(a,b,c){var s,r,q=this.b
if(b<q){s=this.c
q=a*q+b
r=B.a.h(c)
s.$flags&2&&A.b(s)
if(!(q>=0&&q<s.length))return A.a(s,q)
s[q]=r}},
bk(a,b,c,d){var s,r,q,p,o=this.b
a*=o
s=this.c
r=B.b.h(b)
s.$flags&2&&A.b(s)
q=s.length
if(!(a>=0&&a<q))return A.a(s,a)
s[a]=r
if(o>1){r=a+1
p=B.b.h(c)
if(!(r<q))return A.a(s,r)
s[r]=p
if(o>2){o=a+2
r=B.b.h(d)
if(!(o<q))return A.a(s,o)
s[o]=r}}},
aY(a,b){var s,r=this.b
if(b<r){s=this.c
r=a*r+b
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]}else r=0
return r},
bj(a){var s
a*=this.b
s=this.c
if(!(a>=0&&a<s.length))return A.a(s,a)
return s[a]},
bi(a){var s,r=this.b
if(r<2)return 0
s=this.c
r=a*r+1
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]},
bh(a){var s,r=this.b
if(r<3)return 0
s=this.c
r=a*r+2
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]},
bq(a){var s,r=this.b
if(r<4)return 0
s=this.c
r=a*r+3
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]},
bI(a,b){return this.a2(a,0,b)},
bH(a,b){return this.a2(a,1,b)},
bG(a,b){return this.a2(a,2,b)},
bF(a,b){return this.a2(a,3,b)}}
A.aU.prototype={
R(){return A.pQ(this)},
gt(a){return B.d.gt(this.c)},
gM(){return B.e},
gG(){return 255},
a2(a,b,c){var s,r,q=this.b
if(b<q){s=this.c
q=a*q+b
r=B.a.h(c)
s.$flags&2&&A.b(s)
if(!(q>=0&&q<s.length))return A.a(s,q)
s[q]=r}},
bk(a,b,c,d){var s,r,q,p,o=this.b
a*=o
s=this.c
r=B.b.h(b)
s.$flags&2&&A.b(s)
q=s.length
if(!(a>=0&&a<q))return A.a(s,a)
s[a]=r
if(o>1){r=a+1
p=B.b.h(c)
if(!(r<q))return A.a(s,r)
s[r]=p
if(o>2){o=a+2
r=B.b.h(d)
if(!(o<q))return A.a(s,o)
s[o]=r}}},
dl(a,b,c,d,e){var s,r,q,p,o=this.b
a*=o
s=this.c
r=B.a.h(b)
s.$flags&2&&A.b(s)
q=s.length
if(!(a>=0&&a<q))return A.a(s,a)
s[a]=r
if(o>1){r=a+1
p=B.a.h(c)
if(!(r<q))return A.a(s,r)
s[r]=p
if(o>2){r=a+2
p=B.a.h(d)
if(!(r<q))return A.a(s,r)
s[r]=p
if(o>3){o=a+3
r=B.a.h(e)
if(!(o<q))return A.a(s,o)
s[o]=r}}}},
aY(a,b){var s,r=this.b
if(b<r){s=this.c
r=a*r+b
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]}else r=0
return r},
bj(a){var s,r
a*=this.b
s=this.c
r=s.length
if(a>=r)return 0
if(!(a>=0))return A.a(s,a)
return s[a]},
bi(a){var s,r,q=this.b
if(q<2)return 0
a*=q
q=this.c
s=q.length
if(a>=s)return 0
r=a+1
if(!(r>=0&&r<s))return A.a(q,r)
return q[r]},
bh(a){var s,r,q=this.b
if(q<3)return 0
a*=q
q=this.c
s=q.length
if(a>=s)return 0
r=a+2
if(!(r>=0&&r<s))return A.a(q,r)
return q[r]},
bq(a){var s,r,q=this.b
if(q<4)return 255
a*=q
q=this.c
s=q.length
if(a>=s)return 0
r=a+3
if(!(r>=0&&r<s))return A.a(q,r)
return q[r]},
bI(a,b){return this.a2(a,0,b)},
bH(a,b){return this.a2(a,1,b)},
bG(a,b){return this.a2(a,2,b)},
bF(a,b){return this.a2(a,3,b)}}
A.cU.prototype={
R(){var s=this
return new A.cU(s.a,s.b,s.c,s.d)},
gM(){return B.T},
gp(a){return this.d.c},
gW(){return null},
gG(){return 1},
gbf(){return this.a},
gbg(){return this.b},
ad(a,b){var s,r,q=this
q.a=a
q.b=b
s=q.d
r=s.c
q.c=b*s.a*r+a*r},
gN(){return this},
C(){var s,r=this,q=r.d
if(++r.a===q.a){r.a=0
if(++r.b===q.b)return!1}s=r.c+q.c
r.c=s
return s<q.d.length},
l(a,b){var s,r=this.d
if(b<r.c){r=r.d
s=this.c+b
if(!(s>=0&&s<r.length))return A.a(r,s)
s=r[s]
r=$.O
r=r!=null?r:A.T()
if(!(s<r.length))return A.a(r,s)
s=r[s]
r=s}else r=0
return r},
i(a,b,c){var s,r,q=this.d
if(b<q.c){q=q.d
s=this.c+b
r=A.R(c)
q.$flags&2&&A.b(q)
if(!(s>=0&&s<q.length))return A.a(q,s)
q[s]=r}},
gX(){return this.gq()},
sX(a){this.sq(a)},
gq(){var s,r=this.d
if(r.c>0){r=r.d
s=this.c
if(!(s>=0&&s<r.length))return A.a(r,s)
s=r[s]
r=$.O
r=r!=null?r:A.T()
if(!(s<r.length))return A.a(r,s)
s=r[s]
r=s}else r=0
return r},
sq(a){var s,r,q=this.d
if(q.c>0){q=q.d
s=this.c
r=A.R(a)
q.$flags&2&&A.b(q)
if(!(s>=0&&s<q.length))return A.a(q,s)
q[s]=r}},
gB(){var s=this.d,r=s.c
if(r===2){s=s.d
r=this.c
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]
s=$.O
s=s!=null?s:A.T()
if(!(r<s.length))return A.a(s,r)
r=s[r]
s=r}else if(r>1){s=s.d
r=this.c+1
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]
s=$.O
s=s!=null?s:A.T()
if(!(r<s.length))return A.a(s,r)
r=s[r]
s=r}else s=0
return s},
sB(a){var s,r=this.d,q=r.c
if(q===2){r=r.d
q=this.c
s=A.R(a)
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s}else if(q>1){r=r.d
q=this.c+1
s=A.R(a)
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s}},
gA(){var s=this.d,r=s.c
if(r===2){s=s.d
r=this.c
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]
s=$.O
s=s!=null?s:A.T()
if(!(r<s.length))return A.a(s,r)
r=s[r]
s=r}else if(r>2){s=s.d
r=this.c+2
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]
s=$.O
s=s!=null?s:A.T()
if(!(r<s.length))return A.a(s,r)
r=s[r]
s=r}else s=0
return s},
sA(a){var s,r=this.d,q=r.c
if(q===2){r=r.d
q=this.c
s=A.R(a)
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s}else if(q>2){r=r.d
q=this.c+2
s=A.R(a)
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s}},
gv(){var s=this.d,r=s.c
if(r===2){s=s.d
r=this.c+1
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]
s=$.O
s=s!=null?s:A.T()
if(!(r<s.length))return A.a(s,r)
r=s[r]
s=r}else if(r>3){s=s.d
r=this.c+3
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]
s=$.O
s=s!=null?s:A.T()
if(!(r<s.length))return A.a(s,r)
r=s[r]
s=r}else s=1
return s},
sv(a){var s,r=this.d,q=r.c
if(q===2){r=r.d
q=this.c+1
s=A.R(a)
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s}else if(q>3){r=r.d
q=this.c+3
s=A.R(a)
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s}},
gal(){return this.gq()/1},
sal(a){this.sq(a)},
gah(){return this.gB()/1},
sah(a){this.sB(a)},
gaj(){return this.gA()/1},
saj(a){this.sA(a)},
ga5(){return this.gv()/1},
sa5(a){this.sv(a)},
gap(){return this.d.c===2?this.gq():A.a4(this)},
b5(a){var s=this
if(s.d.c>0){s.sq(a.gq())
s.sB(a.gB())
s.sA(a.gA())
s.sv(a.gv())}},
aL(a,b,c){var s,r,q,p=this,o=p.d,n=o.c
if(n>0){o=o.d
s=p.c
r=A.R(a)
o.$flags&2&&A.b(o)
q=o.length
if(!(s>=0&&s<q))return A.a(o,s)
o[s]=r
if(n>2){n=p.c+1
s=A.R(b)
if(!(n>=0&&n<q))return A.a(o,n)
o[n]=s
s=p.c+2
n=A.R(c)
if(!(s>=0&&s<q))return A.a(o,s)
o[s]=n}}},
ao(a,b,c,d){var s,r,q,p=this,o=p.d,n=o.c
if(n>0){o=o.d
s=p.c
r=A.R(a)
o.$flags&2&&A.b(o)
q=o.length
if(!(s>=0&&s<q))return A.a(o,s)
o[s]=r
if(n===2){n=p.c+1
s=A.R(d)
if(!(n>=0&&n<q))return A.a(o,n)
o[n]=s}else if(n>2){s=p.c+1
r=A.R(b)
if(!(s>=0&&s<q))return A.a(o,s)
o[s]=r
r=p.c+2
s=A.R(c)
if(!(r>=0&&r<q))return A.a(o,r)
o[r]=s
if(n>3){n=p.c+3
s=A.R(d)
if(!(n>=0&&n<q))return A.a(o,n)
o[n]=s}}}},
gF(a){return new A.Y(this)},
a_(a,b){var s,r,q,p,o,n=this
if(b==null)return!1
if(b instanceof A.cU){s=A.t(n,A.m(n).n("f.E"))
s=A.n(s)
r=A.t(b,A.m(b).n("f.E"))
return s===A.n(r)}if(t.L.b(b)){s=J.ab(b)
r=n.d
q=r.c
if(s.gp(b)!==q)return!1
r=r.d
p=n.c
o=r.length
if(!(p>=0&&p<o))return A.a(r,p)
if(r[p]!==s.l(b,0))return!1
if(q>1){p=n.c+1
if(!(p>=0&&p<o))return A.a(r,p)
if(r[p]!==s.l(b,1))return!1
if(q>2){p=n.c+2
if(!(p>=0&&p<o))return A.a(r,p)
if(r[p]!==s.l(b,2))return!1
if(q>3){q=n.c+3
if(!(q>=0&&q<o))return A.a(r,q)
if(r[q]!==s.l(b,3))return!1}}}return!0}return!1},
gK(a){var s=A.t(this,A.m(this).n("f.E"))
return A.n(s)},
b3(a){return A.aP(this,null,a,null,null)},
$iz:1,
$iy:1,
$iu:1,
gbo(){return this.d}}
A.cV.prototype={
R(){var s=this
return new A.cV(s.a,s.b,s.c,s.d)},
gp(a){return this.d.c},
gW(){return null},
gG(){return 1},
gM(){return B.Y},
gbf(){return this.a},
gbg(){return this.b},
ad(a,b){var s,r,q=this
q.a=a
q.b=b
s=q.d
r=s.c
q.c=b*s.a*r+a*r},
gN(){return this},
C(){var s,r=this,q=r.d
if(++r.a===q.a){r.a=0
if(++r.b===q.b)return!1}s=r.c+q.c
r.c=s
return s<q.d.length},
l(a,b){var s,r=this.d
if(b<r.c){r=r.d
s=this.c+b
if(!(s>=0&&s<r.length))return A.a(r,s)
s=r[s]
r=s}else r=0
return r},
i(a,b,c){var s,r=this.d
if(b<r.c){r=r.d
s=this.c+b
r.$flags&2&&A.b(r)
if(!(s>=0&&s<r.length))return A.a(r,s)
r[s]=c}},
gX(){return this.gq()},
sX(a){this.sq(a)},
gq(){var s,r=this.d
if(r.c>0){r=r.d
s=this.c
if(!(s>=0&&s<r.length))return A.a(r,s)
s=r[s]
r=s}else r=0
return r},
sq(a){var s,r=this.d
if(r.c>0){r=r.d
s=this.c
r.$flags&2&&A.b(r)
if(!(s>=0&&s<r.length))return A.a(r,s)
r[s]=a}},
gB(){var s=this.d,r=s.c
if(r===2){s=s.d
r=this.c
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]
s=r}else if(r>1){s=s.d
r=this.c+1
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]
s=r}else s=0
return s},
sB(a){var s=this.d,r=s.c
if(r===2){s=s.d
r=this.c
s.$flags&2&&A.b(s)
if(!(r>=0&&r<s.length))return A.a(s,r)
s[r]=a}else if(r>1){s=s.d
r=this.c+1
s.$flags&2&&A.b(s)
if(!(r>=0&&r<s.length))return A.a(s,r)
s[r]=a}},
gA(){var s=this.d,r=s.c
if(r===2){s=s.d
r=this.c
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]
s=r}else if(r>2){s=s.d
r=this.c+2
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]
s=r}else s=0
return s},
sA(a){var s=this.d,r=s.c
if(r===2){s=s.d
r=this.c
s.$flags&2&&A.b(s)
if(!(r>=0&&r<s.length))return A.a(s,r)
s[r]=a}else if(r>2){s=s.d
r=this.c+2
s.$flags&2&&A.b(s)
if(!(r>=0&&r<s.length))return A.a(s,r)
s[r]=a}},
gv(){var s=this.d,r=s.c
if(r===2){s=s.d
r=this.c+1
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]
s=r}else if(r>3){s=s.d
r=this.c+3
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]
s=r}else s=1
return s},
sv(a){var s=this.d,r=s.c
if(r===2){s=s.d
r=this.c+1
s.$flags&2&&A.b(s)
if(!(r>=0&&r<s.length))return A.a(s,r)
s[r]=a}else if(r>3){s=s.d
r=this.c+3
s.$flags&2&&A.b(s)
if(!(r>=0&&r<s.length))return A.a(s,r)
s[r]=a}},
gal(){return this.gq()/1},
sal(a){this.sq(a)},
gah(){return this.gB()/1},
sah(a){this.sB(a)},
gaj(){return this.gA()/1},
saj(a){this.sA(a)},
ga5(){return this.gv()/1},
sa5(a){this.sv(a)},
gap(){return this.d.c===2?this.gq():A.a4(this)},
b5(a){var s=this
s.sq(a.gq())
s.sB(a.gB())
s.sA(a.gA())
s.sv(a.gv())},
aL(a,b,c){var s,r=this.d,q=r.d,p=this.c
q.$flags&2&&A.b(q)
s=q.length
if(!(p>=0&&p<s))return A.a(q,p)
q[p]=a
if(r.c>2){r=p+1
if(!(r<s))return A.a(q,r)
q[r]=b
p+=2
if(!(p<s))return A.a(q,p)
q[p]=c}},
ao(a,b,c,d){var s,r,q=this.d,p=q.d,o=this.c
p.$flags&2&&A.b(p)
s=p.length
if(!(o>=0&&o<s))return A.a(p,o)
p[o]=a
q=q.c
if(q===2){q=o+1
if(!(q<s))return A.a(p,q)
p[q]=d}else if(q>2){r=o+1
if(!(r<s))return A.a(p,r)
p[r]=b
r=o+2
if(!(r<s))return A.a(p,r)
p[r]=c
if(q>3){q=o+3
if(!(q<s))return A.a(p,q)
p[q]=d}}},
gF(a){return new A.Y(this)},
a_(a,b){var s,r,q,p,o,n=this
if(b==null)return!1
if(b instanceof A.cV){s=A.t(n,A.m(n).n("f.E"))
s=A.n(s)
r=A.t(b,A.m(b).n("f.E"))
return s===A.n(r)}if(t.L.b(b)){s=J.ab(b)
r=n.d
q=r.c
if(s.gp(b)!==q)return!1
r=r.d
p=n.c
o=r.length
if(!(p>=0&&p<o))return A.a(r,p)
if(r[p]!==s.l(b,0))return!1
if(q>1){p=n.c+1
if(!(p>=0&&p<o))return A.a(r,p)
if(r[p]!==s.l(b,1))return!1
if(q>2){p=n.c+2
if(!(p>=0&&p<o))return A.a(r,p)
if(r[p]!==s.l(b,2))return!1
if(q>3){q=n.c+3
if(!(q>=0&&q<o))return A.a(r,q)
if(r[q]!==s.l(b,3))return!1}}}return!0}return!1},
gK(a){var s=A.t(this,A.m(this).n("f.E"))
return A.n(s)},
b3(a){return A.aP(this,null,a,null,null)},
$iz:1,
$iy:1,
$iu:1,
gbo(){return this.d}}
A.cW.prototype={
R(){var s=this
return new A.cW(s.a,s.b,s.c,s.d)},
gp(a){return this.d.c},
gW(){return null},
gG(){return 1},
gM(){return B.aa},
gbf(){return this.a},
gbg(){return this.b},
ad(a,b){var s,r,q=this
q.a=a
q.b=b
s=q.d
r=s.c
q.c=b*s.a*r+a*r},
gN(){return this},
C(){var s,r=this,q=r.d
if(++r.a===q.a){r.a=0
if(++r.b===q.b)return!1}s=r.c+q.c
r.c=s
return s<q.d.length},
l(a,b){var s,r=this.d
if(b<r.c){r=r.d
s=this.c+b
if(!(s>=0&&s<r.length))return A.a(r,s)
s=r[s]
r=s}else r=0
return r},
i(a,b,c){var s,r=this.d
if(b<r.c){r=r.d
s=this.c+b
r.$flags&2&&A.b(r)
if(!(s>=0&&s<r.length))return A.a(r,s)
r[s]=c}},
gX(){return this.gq()},
sX(a){this.sq(a)},
gq(){var s,r=this.d
if(r.c>0){r=r.d
s=this.c
if(!(s>=0&&s<r.length))return A.a(r,s)
s=r[s]
r=s}else r=0
return r},
sq(a){var s,r=this.d
if(r.c>0){r=r.d
s=this.c
r.$flags&2&&A.b(r)
if(!(s>=0&&s<r.length))return A.a(r,s)
r[s]=a}},
gB(){var s=this.d,r=s.c
if(r===2){s=s.d
r=this.c
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]
s=r}else if(r>1){s=s.d
r=this.c+1
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]
s=r}else s=0
return s},
sB(a){var s=this.d,r=s.c
if(r===2){s=s.d
r=this.c
s.$flags&2&&A.b(s)
if(!(r>=0&&r<s.length))return A.a(s,r)
s[r]=a}else if(r>1){s=s.d
r=this.c+1
s.$flags&2&&A.b(s)
if(!(r>=0&&r<s.length))return A.a(s,r)
s[r]=a}},
gA(){var s=this.d,r=s.c
if(r===2){s=s.d
r=this.c
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]
s=r}else if(r>2){s=s.d
r=this.c+2
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]
s=r}else s=0
return s},
sA(a){var s=this.d,r=s.c
if(r===2){s=s.d
r=this.c
s.$flags&2&&A.b(s)
if(!(r>=0&&r<s.length))return A.a(s,r)
s[r]=a}else if(r>2){s=s.d
r=this.c+2
s.$flags&2&&A.b(s)
if(!(r>=0&&r<s.length))return A.a(s,r)
s[r]=a}},
gv(){var s=this.d,r=s.c
if(r===2){s=s.d
r=this.c+1
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]
s=r}else if(r>3){s=s.d
r=this.c+3
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]
s=r}else s=1
return s},
sv(a){var s=this.d,r=s.c
if(r===2){s=s.d
r=this.c+1
s.$flags&2&&A.b(s)
if(!(r>=0&&r<s.length))return A.a(s,r)
s[r]=a}else if(r>3){s=s.d
r=this.c+3
s.$flags&2&&A.b(s)
if(!(r>=0&&r<s.length))return A.a(s,r)
s[r]=a}},
gal(){return this.gq()/1},
sal(a){this.sq(a)},
gah(){return this.gB()/1},
sah(a){this.sB(a)},
gaj(){return this.gA()/1},
saj(a){this.sA(a)},
ga5(){return this.gv()/1},
sa5(a){this.sv(a)},
gap(){return this.d.c===2?this.gq():A.a4(this)},
b5(a){var s=this
s.sq(a.gq())
s.sB(a.gB())
s.sA(a.gA())
s.sv(a.gv())},
aL(a,b,c){var s,r=this.d,q=r.d,p=this.c
q.$flags&2&&A.b(q)
s=q.length
if(!(p>=0&&p<s))return A.a(q,p)
q[p]=a
if(r.c>2){r=p+1
if(!(r<s))return A.a(q,r)
q[r]=b
p+=2
if(!(p<s))return A.a(q,p)
q[p]=c}},
ao(a,b,c,d){var s,r,q=this.d,p=q.d,o=this.c
p.$flags&2&&A.b(p)
s=p.length
if(!(o>=0&&o<s))return A.a(p,o)
p[o]=a
q=q.c
if(q===2){q=o+1
if(!(q<s))return A.a(p,q)
p[q]=d}else if(q>2){r=o+1
if(!(r<s))return A.a(p,r)
p[r]=b
r=o+2
if(!(r<s))return A.a(p,r)
p[r]=c
if(q>3){q=o+3
if(!(q<s))return A.a(p,q)
p[q]=d}}},
gF(a){return new A.Y(this)},
a_(a,b){var s,r,q,p,o,n=this
if(b==null)return!1
if(b instanceof A.cW){s=A.t(n,A.m(n).n("f.E"))
s=A.n(s)
r=A.t(b,A.m(b).n("f.E"))
return s===A.n(r)}if(t.L.b(b)){s=J.ab(b)
r=n.d
q=r.c
if(s.gp(b)!==q)return!1
r=r.d
p=n.c
o=r.length
if(!(p>=0&&p<o))return A.a(r,p)
if(r[p]!==s.l(b,0))return!1
if(q>1){p=n.c+1
if(!(p>=0&&p<o))return A.a(r,p)
if(r[p]!==s.l(b,1))return!1
if(q>2){p=n.c+2
if(!(p>=0&&p<o))return A.a(r,p)
if(r[p]!==s.l(b,2))return!1
if(q>3){q=n.c+3
if(!(q>=0&&q<o))return A.a(r,q)
if(r[q]!==s.l(b,3))return!1}}}return!0}return!1},
gK(a){var s=A.t(this,A.m(this).n("f.E"))
return A.n(s)},
b3(a){return A.aP(this,null,a,null,null)},
$iz:1,
$iy:1,
$iu:1,
gbo(){return this.d}}
A.cX.prototype={
R(){var s=this
return new A.cX(s.a,s.b,s.c,s.d)},
gp(a){return this.d.c},
gW(){return null},
gG(){return 32767},
gM(){return B.ag},
gbf(){return this.a},
gbg(){return this.b},
ad(a,b){var s,r,q=this
q.a=a
q.b=b
s=q.d
r=s.c
q.c=b*s.a*r+a*r},
gN(){return this},
C(){var s,r=this,q=r.d
if(++r.a===q.a){r.a=0
if(++r.b===q.b)return!1}s=r.c+q.c
r.c=s
return s<q.d.length},
l(a,b){var s,r=this.d
if(b<r.c){r=r.d
s=this.c+b
if(!(s>=0&&s<r.length))return A.a(r,s)
s=r[s]
r=s}else r=0
return r},
i(a,b,c){var s,r,q=this.d
if(b<q.c){q=q.d
s=this.c+b
r=B.b.h(c)
q.$flags&2&&A.b(q)
if(!(s>=0&&s<q.length))return A.a(q,s)
q[s]=r}},
gX(){return this.gq()},
sX(a){this.sq(a)},
gq(){var s,r=this.d
if(r.c>0){r=r.d
s=this.c
if(!(s>=0&&s<r.length))return A.a(r,s)
s=r[s]
r=s}else r=0
return r},
sq(a){var s,r,q=this.d
if(q.c>0){q=q.d
s=this.c
r=B.b.h(a)
q.$flags&2&&A.b(q)
if(!(s>=0&&s<q.length))return A.a(q,s)
q[s]=r}},
gB(){var s=this.d,r=s.c
if(r===2){s=s.d
r=this.c
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]
s=r}else if(r>1){s=s.d
r=this.c+1
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]
s=r}else s=0
return s},
sB(a){var s,r=this.d,q=r.c
if(q===2){r=r.d
q=this.c
s=B.b.h(a)
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s}else if(q>1){r=r.d
q=this.c+1
s=B.b.h(a)
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s}},
gA(){var s=this.d,r=s.c
if(r===2){s=s.d
r=this.c
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]
s=r}else if(r>2){s=s.d
r=this.c+2
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]
s=r}else s=0
return s},
sA(a){var s,r=this.d,q=r.c
if(q===2){r=r.d
q=this.c
s=B.b.h(a)
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s}else if(q>2){r=r.d
q=this.c+2
s=B.b.h(a)
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s}},
gv(){var s=this.d,r=s.c
if(r===2){s=s.d
r=this.c+1
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]
s=r}else if(r>3){s=s.d
r=this.c+3
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]
s=r}else s=32767
return s},
sv(a){var s,r=this.d,q=r.c
if(q===2){r=r.d
q=this.c+1
s=B.b.h(a)
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s}else if(q>3){r=r.d
q=this.c+3
s=B.b.h(a)
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s}},
gal(){return this.gq()/32767},
sal(a){this.sq(a*32767)},
gah(){return this.gB()/32767},
sah(a){this.sB(a*32767)},
gaj(){return this.gA()/32767},
saj(a){this.sA(a*32767)},
ga5(){return this.gv()/32767},
sa5(a){this.sv(a*32767)},
gap(){return this.d.c===2?this.gq():A.a4(this)},
b5(a){var s=this
s.sq(a.gq())
s.sB(a.gB())
s.sA(a.gA())
s.sv(a.gv())},
aL(a,b,c){var s,r,q,p=this.d,o=p.c
if(o>0){p=p.d
s=this.c
r=B.a.h(a)
p.$flags&2&&A.b(p)
q=p.length
if(!(s>=0&&s<q))return A.a(p,s)
p[s]=r
if(o>2){o=s+1
r=B.a.h(b)
if(!(o<q))return A.a(p,o)
p[o]=r
s+=2
r=B.a.h(c)
if(!(s<q))return A.a(p,s)
p[s]=r}}},
ao(a,b,c,d){var s,r,q,p,o=this.d,n=o.c
if(n>0){o=o.d
s=this.c
r=B.b.h(a)
o.$flags&2&&A.b(o)
q=o.length
if(!(s>=0&&s<q))return A.a(o,s)
o[s]=r
if(n===2){n=s+1
s=B.b.h(d)
if(!(n<q))return A.a(o,n)
o[n]=s}else if(n>2){r=s+1
p=B.b.h(b)
if(!(r<q))return A.a(o,r)
o[r]=p
p=s+2
r=B.b.h(c)
if(!(p<q))return A.a(o,p)
o[p]=r
if(n>3){n=s+3
s=B.b.h(d)
if(!(n<q))return A.a(o,n)
o[n]=s}}}},
gF(a){return new A.Y(this)},
a_(a,b){var s,r,q,p,o,n=this
if(b==null)return!1
if(b instanceof A.cX){s=A.t(n,A.m(n).n("f.E"))
s=A.n(s)
r=A.t(b,A.m(b).n("f.E"))
return s===A.n(r)}if(t.L.b(b)){s=J.ab(b)
r=n.d
q=r.c
if(s.gp(b)!==q)return!1
r=r.d
p=n.c
o=r.length
if(!(p>=0&&p<o))return A.a(r,p)
if(r[p]!==s.l(b,0))return!1
if(q>1){p=n.c+1
if(!(p>=0&&p<o))return A.a(r,p)
if(r[p]!==s.l(b,1))return!1
if(q>2){p=n.c+2
if(!(p>=0&&p<o))return A.a(r,p)
if(r[p]!==s.l(b,2))return!1
if(q>3){q=n.c+3
if(!(q>=0&&q<o))return A.a(r,q)
if(r[q]!==s.l(b,3))return!1}}}return!0}return!1},
gK(a){var s=A.t(this,A.m(this).n("f.E"))
return A.n(s)},
b3(a){return A.aP(this,null,a,null,null)},
$iz:1,
$iy:1,
$iu:1,
gbo(){return this.d}}
A.cY.prototype={
R(){var s=this
return new A.cY(s.a,s.b,s.c,s.d)},
gp(a){return this.d.c},
gW(){return null},
gG(){return 2147483647},
gM(){return B.ah},
gbf(){return this.a},
gbg(){return this.b},
ad(a,b){var s,r,q=this
q.a=a
q.b=b
s=q.d
r=s.c
q.c=b*s.a*r+a*r},
gN(){return this},
C(){var s,r=this,q=r.d
if(++r.a===q.a){r.a=0
if(++r.b===q.b)return!1}s=r.c+q.c
r.c=s
return s<q.d.length},
l(a,b){var s,r=this.d
if(b<r.c){r=r.d
s=this.c+b
if(!(s>=0&&s<r.length))return A.a(r,s)
s=r[s]
r=s}else r=0
return r},
i(a,b,c){var s,r,q=this.d
if(b<q.c){q=q.d
s=this.c+b
r=B.b.h(c)
q.$flags&2&&A.b(q)
if(!(s>=0&&s<q.length))return A.a(q,s)
q[s]=r}},
gX(){return this.gq()},
sX(a){this.sq(a)},
gq(){var s,r=this.d
if(r.c>0){r=r.d
s=this.c
if(!(s>=0&&s<r.length))return A.a(r,s)
s=r[s]
r=s}else r=0
return r},
sq(a){var s,r,q=this.d
if(q.c>0){q=q.d
s=this.c
r=B.b.h(a)
q.$flags&2&&A.b(q)
if(!(s>=0&&s<q.length))return A.a(q,s)
q[s]=r}},
gB(){var s=this.d,r=s.c
if(r===2){s=s.d
r=this.c
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]
s=r}else if(r>1){s=s.d
r=this.c+1
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]
s=r}else s=0
return s},
sB(a){var s,r=this.d,q=r.c
if(q===2){r=r.d
q=this.c
s=B.b.h(a)
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s}else if(q>1){r=r.d
q=this.c+1
s=B.b.h(a)
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s}},
gA(){var s=this.d,r=s.c
if(r===2){s=s.d
r=this.c
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]
s=r}else if(r>2){s=s.d
r=this.c+2
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]
s=r}else s=0
return s},
sA(a){var s,r=this.d,q=r.c
if(q===2){r=r.d
q=this.c
s=B.b.h(a)
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s}else if(q>2){r=r.d
q=this.c+2
s=B.b.h(a)
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s}},
gv(){var s=this.d,r=s.c
if(r===2){s=s.d
r=this.c+1
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]
s=r}else if(r>3){s=s.d
r=this.c+3
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]
s=r}else s=2147483647
return s},
sv(a){var s,r=this.d,q=r.c
if(q===2){r=r.d
q=this.c+1
s=B.b.h(a)
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s}else if(q>3){r=r.d
q=this.c+3
s=B.b.h(a)
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s}},
gal(){return this.gq()/2147483647},
sal(a){this.sq(a*2147483647)},
gah(){return this.gB()/2147483647},
sah(a){this.sB(a*2147483647)},
gaj(){return this.gA()/2147483647},
saj(a){this.sA(a*2147483647)},
ga5(){return this.gv()/2147483647},
sa5(a){this.sv(a*2147483647)},
gap(){return this.d.c===2?this.gq():A.a4(this)},
b5(a){var s=this
s.sq(a.gq())
s.sB(a.gB())
s.sA(a.gA())
s.sv(a.gv())},
aL(a,b,c){var s,r,q,p=this.d,o=p.c
if(o>0){p=p.d
s=this.c
r=B.a.h(a)
p.$flags&2&&A.b(p)
q=p.length
if(!(s>=0&&s<q))return A.a(p,s)
p[s]=r
if(o>2){o=s+1
r=B.a.h(b)
if(!(o<q))return A.a(p,o)
p[o]=r
s+=2
r=B.a.h(c)
if(!(s<q))return A.a(p,s)
p[s]=r}}},
ao(a,b,c,d){var s,r,q,p,o=this.d,n=o.c
if(n>0){o=o.d
s=this.c
r=B.b.h(a)
o.$flags&2&&A.b(o)
q=o.length
if(!(s>=0&&s<q))return A.a(o,s)
o[s]=r
if(n===2){n=s+1
s=B.b.h(d)
if(!(n<q))return A.a(o,n)
o[n]=s}else if(n>2){r=s+1
p=B.b.h(b)
if(!(r<q))return A.a(o,r)
o[r]=p
p=s+2
r=B.b.h(c)
if(!(p<q))return A.a(o,p)
o[p]=r
if(n>3){n=s+3
s=B.b.h(d)
if(!(n<q))return A.a(o,n)
o[n]=s}}}},
gF(a){return new A.Y(this)},
a_(a,b){var s,r,q,p,o,n=this
if(b==null)return!1
if(b instanceof A.cY){s=A.t(n,A.m(n).n("f.E"))
s=A.n(s)
r=A.t(b,A.m(b).n("f.E"))
return s===A.n(r)}if(t.L.b(b)){s=J.ab(b)
r=n.d
q=r.c
if(s.gp(b)!==q)return!1
r=r.d
p=n.c
o=r.length
if(!(p>=0&&p<o))return A.a(r,p)
if(r[p]!==s.l(b,0))return!1
if(q>1){p=n.c+1
if(!(p>=0&&p<o))return A.a(r,p)
if(r[p]!==s.l(b,1))return!1
if(q>2){p=n.c+2
if(!(p>=0&&p<o))return A.a(r,p)
if(r[p]!==s.l(b,2))return!1
if(q>3){q=n.c+3
if(!(q>=0&&q<o))return A.a(r,q)
if(r[q]!==s.l(b,3))return!1}}}return!0}return!1},
gK(a){var s=A.t(this,A.m(this).n("f.E"))
return A.n(s)},
b3(a){return A.aP(this,null,a,null,null)},
$iz:1,
$iy:1,
$iu:1,
gbo(){return this.d}}
A.cZ.prototype={
R(){var s=this
return new A.cZ(s.a,s.b,s.c,s.d)},
gp(a){return this.d.c},
gW(){return null},
gG(){return 127},
gM(){return B.af},
gbf(){return this.a},
gbg(){return this.b},
ad(a,b){var s,r,q=this
q.a=a
q.b=b
s=q.d
r=s.c
q.c=b*s.a*r+a*r},
gN(){return this},
C(){var s,r=this,q=r.d
if(++r.a===q.a){r.a=0
if(++r.b===q.b)return!1}s=r.c+q.c
r.c=s
return s<q.d.length},
l(a,b){var s,r=this.d
if(b<r.c){r=r.d
s=this.c+b
if(!(s>=0&&s<r.length))return A.a(r,s)
s=r[s]
r=s}else r=0
return r},
i(a,b,c){var s,r,q=this.d
if(b<q.c){q=q.d
s=this.c+b
r=B.b.h(c)
q.$flags&2&&A.b(q)
if(!(s>=0&&s<q.length))return A.a(q,s)
q[s]=r}},
gX(){return this.gq()},
sX(a){this.sq(a)},
gq(){var s,r=this.d
if(r.c>0){r=r.d
s=this.c
if(!(s>=0&&s<r.length))return A.a(r,s)
s=r[s]
r=s}else r=0
return r},
sq(a){var s,r,q=this.d
if(q.c>0){q=q.d
s=this.c
r=B.b.h(a)
q.$flags&2&&A.b(q)
if(!(s>=0&&s<q.length))return A.a(q,s)
q[s]=r}},
gB(){var s=this.d,r=s.c
if(r===2){s=s.d
r=this.c
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]
s=r}else if(r>1){s=s.d
r=this.c+1
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]
s=r}else s=0
return s},
sB(a){var s,r=this.d,q=r.c
if(q===2){r=r.d
q=this.c
s=B.b.h(a)
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s}else if(q>1){r=r.d
q=this.c+1
s=B.b.h(a)
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s}},
gA(){var s=this.d,r=s.c
if(r===2){s=s.d
r=this.c
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]
s=r}else if(r>2){s=s.d
r=this.c+2
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]
s=r}else s=0
return s},
sA(a){var s,r=this.d,q=r.c
if(q===2){r=r.d
q=this.c
s=B.b.h(a)
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s}else if(q>2){r=r.d
q=this.c+2
s=B.b.h(a)
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s}},
gv(){var s=this.d,r=s.c
if(r===2){s=s.d
r=this.c+1
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]
s=r}else if(r>3){s=s.d
r=this.c+3
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]
s=r}else s=127
return s},
sv(a){var s,r=this.d,q=r.c
if(q===2){r=r.d
q=this.c+1
s=B.b.h(a)
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s}else if(q>3){r=r.d
q=this.c+3
s=B.b.h(a)
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s}},
gal(){return this.gq()/127},
sal(a){this.sq(a*127)},
gah(){return this.gB()/127},
sah(a){this.sB(a*127)},
gaj(){return this.gA()/127},
saj(a){this.sA(a*127)},
ga5(){return this.gv()/127},
sa5(a){this.sv(a*127)},
gap(){return this.d.c===2?this.gq():A.a4(this)},
b5(a){var s=this
s.sq(a.gq())
s.sB(a.gB())
s.sA(a.gA())
s.sv(a.gv())},
aL(a,b,c){var s,r,q,p=this.d,o=p.c
if(o>0){p=p.d
s=this.c
r=B.a.h(a)
p.$flags&2&&A.b(p)
q=p.length
if(!(s>=0&&s<q))return A.a(p,s)
p[s]=r
if(o>2){o=s+1
r=B.a.h(b)
if(!(o<q))return A.a(p,o)
p[o]=r
s+=2
r=B.a.h(c)
if(!(s<q))return A.a(p,s)
p[s]=r}}},
ao(a,b,c,d){var s,r,q,p,o=this.d,n=o.c
if(n>0){o=o.d
s=this.c
r=B.b.h(a)
o.$flags&2&&A.b(o)
q=o.length
if(!(s>=0&&s<q))return A.a(o,s)
o[s]=r
if(n===2){n=s+1
s=B.b.h(d)
if(!(n<q))return A.a(o,n)
o[n]=s}else if(n>2){r=s+1
p=B.b.h(b)
if(!(r<q))return A.a(o,r)
o[r]=p
p=s+2
r=B.b.h(c)
if(!(p<q))return A.a(o,p)
o[p]=r
if(n>3){n=s+3
s=B.b.h(d)
if(!(n<q))return A.a(o,n)
o[n]=s}}}},
gF(a){return new A.Y(this)},
a_(a,b){var s,r,q,p,o,n=this
if(b==null)return!1
if(b instanceof A.cZ){s=A.t(n,A.m(n).n("f.E"))
s=A.n(s)
r=A.t(b,A.m(b).n("f.E"))
return s===A.n(r)}if(t.L.b(b)){s=J.ab(b)
r=n.d
q=r.c
if(s.gp(b)!==q)return!1
r=r.d
p=n.c
o=r.length
if(!(p>=0&&p<o))return A.a(r,p)
if(r[p]!==s.l(b,0))return!1
if(q>1){p=n.c+1
if(!(p>=0&&p<o))return A.a(r,p)
if(r[p]!==s.l(b,1))return!1
if(q>2){p=n.c+2
if(!(p>=0&&p<o))return A.a(r,p)
if(r[p]!==s.l(b,2))return!1
if(q>3){q=n.c+3
if(!(q>=0&&q<o))return A.a(r,q)
if(r[q]!==s.l(b,3))return!1}}}return!0}return!1},
gK(a){var s=A.t(this,A.m(this).n("f.E"))
return A.n(s)},
b3(a){return A.aP(this,null,a,null,null)},
$iz:1,
$iy:1,
$iu:1,
gbo(){return this.d}}
A.d_.prototype={
R(){var s=this
return new A.d_(s.a,s.b,s.c,s.d,s.e,s.f)},
gp(a){var s=this.f,r=s.f
r=r==null?null:r.b
return r==null?s.c:r},
gW(){return this.f.f},
gG(){return this.f.gG()},
gM(){return B.L},
gbf(){return this.a},
gbg(){return this.b},
ad(a,b){var s,r,q=this
q.a=a
q.b=b
s=q.f
r=b*s.e
q.e=r
s=a*s.c
q.c=r+B.a.j(s,3)
q.d=s&7},
gN(){return this},
C(){var s,r=this,q=++r.a,p=r.f
if(q===p.a){r.a=0
q=++r.b
r.d=0;++r.c
r.e=r.e+p.e
return q<p.b}s=p.c
if(p.f!=null||s===1){if(++r.d>7){r.d=0;++r.c}}else{q*=s
r.d=q&7
r.c=r.e+B.a.j(q,3)}q=r.c
p=p.d
p===$&&A.c()
return q<p.byteLength},
ey(a){var s,r,q=this.c,p=7-(this.d+a)
if(p<0){p+=8;++q}s=this.f.d
s===$&&A.c()
r=s.length
if(q>=r)return 0
if(!(q>=0))return A.a(s,q)
return B.a.a4(s[q],p)&1},
b9(a){var s=this.f,r=s.f
if(r==null)s=s.c>a?this.ey(a):0
else s=r.aY(this.ey(0),a)
return s},
aD(a,b){var s,r,q,p,o,n,m=this.f
if(a>=m.c)return
s=this.c
r=7-(this.d+a)
if(r<0){++s
r+=8}q=m.d
q===$&&A.c()
if(!(s>=0&&s<q.length))return A.a(q,s)
p=q[s]
o=B.a.L(B.b.h(b),0,1)
if(!(r>=0&&r<8))return A.a(B.d5,r)
n=B.d5[r]
q=B.a.U(o,r)
m=m.d
m.$flags&2&&A.b(m)
if(!(s<m.length))return A.a(m,s)
m[s]=(p&n|q)>>>0},
l(a,b){return this.b9(b)},
i(a,b,c){return this.aD(b,c)},
gX(){return this.ey(0)},
sX(a){this.aD(0,a)},
gq(){return this.b9(0)},
sq(a){this.aD(0,a)},
gB(){return this.f.c===2?this.b9(0):this.b9(1)},
sB(a){this.aD(this.f.c===2?0:1,a)},
gA(){return this.f.c===2?this.b9(0):this.b9(2)},
sA(a){this.aD(this.f.c===2?0:2,a)},
gv(){var s=this.f,r=s.f==null
if(r&&s.c===2)s=this.b9(1)
else s=r&&s.c<4?s.gG():this.b9(3)
return s},
sv(a){this.aD(this.f.c===2?1:3,a)},
gal(){return this.b9(0)/this.f.gG()},
sal(a){this.aD(0,a*this.f.gG())},
gah(){return this.gB()/this.f.gG()},
sah(a){var s=this.f,r=s.gG()
s=s.c===2?0:1
this.aD(s,a*r)},
gaj(){return this.gA()/this.f.gG()},
saj(a){var s=this.f,r=s.gG()
s=s.c===2?0:2
this.aD(s,a*r)},
ga5(){return this.gv()/this.f.gG()},
sa5(a){var s=this.f,r=s.gG()
s=s.c===2?1:3
this.aD(s,a*r)},
gap(){return this.f.c===2?this.b9(0):A.a4(this)},
b5(a){var s,r,q=this
q.aD(0,a.gq())
s=a.gB()
r=q.f.c===2
q.aD(r?0:1,s)
s=a.gA()
q.aD(r?0:2,s)
s=a.gv()
q.aD(r?1:3,s)},
aL(a,b,c){var s=this,r=s.f.c
if(r>0){s.aD(0,a)
if(r>2){s.aD(1,b)
s.aD(2,c)}}},
ao(a,b,c,d){var s=this,r=s.f.c
if(r>0){s.aD(0,a)
if(r===2)s.aD(1,d)
else if(r>2){s.aD(1,b)
s.aD(2,c)
if(r>3)s.aD(3,d)}}},
gF(a){return new A.Y(this)},
a_(a,b){var s,r,q,p=this
if(b==null)return!1
if(b instanceof A.d_){s=A.t(p,A.m(p).n("f.E"))
s=A.n(s)
r=A.t(b,A.m(b).n("f.E"))
return s===A.n(r)}if(t.L.b(b)){s=p.f
r=s.f
q=r!=null?r.b:s.c
s=J.ab(b)
if(s.gp(b)!==q)return!1
if(p.b9(0)!==s.l(b,0))return!1
if(q>1){if(p.b9(1)!==s.l(b,1))return!1
if(q>2){if(p.b9(2)!==s.l(b,2))return!1
if(q>3)if(p.b9(3)!==s.l(b,3))return!1}}return!0}return!1},
gK(a){var s=A.t(this,A.m(this).n("f.E"))
return A.n(s)},
b3(a){return A.aP(this,null,a,null,null)},
$iz:1,
$iy:1,
$iu:1,
gbo(){return this.f}}
A.d0.prototype={
R(){var s=this
return new A.d0(s.a,s.b,s.c,s.d)},
gp(a){var s=this.d,r=s.e
r=r==null?null:r.b
return r==null?s.c:r},
gW(){return this.d.e},
gG(){return this.d.gG()},
gM(){return B.u},
gbf(){return this.a},
gbg(){return this.b},
ad(a,b){var s,r,q=this
q.a=a
q.b=b
s=q.d
r=s.c
q.c=b*s.a*r+a*r},
gN(){return this},
C(){var s,r=this,q=r.d
if(++r.a===q.a){r.a=0
if(++r.b===q.b)return!1}s=r.c
s+=q.e==null?q.c:1
r.c=s
return s<q.d.length},
bA(a){var s,r=this.d,q=r.e
if(q!=null){r=r.d
s=this.c
if(!(s>=0&&s<r.length))return A.a(r,s)
s=q.aY(r[s],a)
r=s}else if(a<r.c){r=r.d
q=this.c+a
if(!(q>=0&&q<r.length))return A.a(r,q)
q=r[q]
r=q}else r=0
return r},
l(a,b){return this.bA(b)},
i(a,b,c){var s,r,q=this.d
if(b<q.c){q=q.d
s=this.c+b
r=B.b.h(c)
q.$flags&2&&A.b(q)
if(!(s>=0&&s<q.length))return A.a(q,s)
q[s]=r}},
gX(){return this.gq()},
sX(a){this.sq(a)},
gq(){var s,r=this.d,q=r.e
if(q==null)if(r.c>0){r=r.d
q=this.c
if(!(q>=0&&q<r.length))return A.a(r,q)
q=r[q]
r=q}else r=0
else{r=r.d
s=this.c
if(!(s>=0&&s<r.length))return A.a(r,s)
s=q.bj(r[s])
r=s}return r},
sq(a){var s,r,q=this.d
if(q.c>0){q=q.d
s=this.c
r=B.b.h(a)
q.$flags&2&&A.b(q)
if(!(s>=0&&s<q.length))return A.a(q,s)
q[s]=r}},
gB(){var s,r=this,q=r.d,p=q.e
if(p==null){p=q.c
if(p===2){q=q.d
p=r.c
if(!(p>=0&&p<q.length))return A.a(q,p)
p=q[p]
q=p}else if(p>1){q=q.d
p=r.c+1
if(!(p>=0&&p<q.length))return A.a(q,p)
p=q[p]
q=p}else q=0}else{q=q.d
s=r.c
if(!(s>=0&&s<q.length))return A.a(q,s)
s=p.bi(q[s])
q=s}return q},
sB(a){var s,r=this.d,q=r.c
if(q===2){r=r.d
q=this.c
s=B.b.h(a)
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s}else if(q>1){r=r.d
q=this.c+1
s=B.b.h(a)
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s}},
gA(){var s,r=this,q=r.d,p=q.e
if(p==null){p=q.c
if(p===2){q=q.d
p=r.c
if(!(p>=0&&p<q.length))return A.a(q,p)
p=q[p]
q=p}else if(p>2){q=q.d
p=r.c+2
if(!(p>=0&&p<q.length))return A.a(q,p)
p=q[p]
q=p}else q=0}else{q=q.d
s=r.c
if(!(s>=0&&s<q.length))return A.a(q,s)
s=p.bh(q[s])
q=s}return q},
sA(a){var s,r=this.d,q=r.c
if(q===2){r=r.d
q=this.c
s=B.b.h(a)
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s}else if(q>2){r=r.d
q=this.c+2
s=B.b.h(a)
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s}},
gv(){var s,r=this,q=r.d,p=q.e
if(p==null){p=q.c
if(p===2){q=q.d
p=r.c+1
if(!(p>=0&&p<q.length))return A.a(q,p)
p=q[p]
q=p}else if(p>3){q=q.d
p=r.c+3
if(!(p>=0&&p<q.length))return A.a(q,p)
p=q[p]
q=p}else q=q.gG()}else{q=q.d
s=r.c
if(!(s>=0&&s<q.length))return A.a(q,s)
s=p.bq(q[s])
q=s}return q},
sv(a){var s,r=this.d,q=r.c
if(q===2){r=r.d
q=this.c+1
s=B.b.h(a)
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s}else if(q>3){r=r.d
q=this.c+3
s=B.b.h(a)
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s}},
gal(){return this.gq()/this.d.gG()},
sal(a){this.sq(a*this.d.gG())},
gah(){return this.gB()/this.d.gG()},
sah(a){this.sB(a*this.d.gG())},
gaj(){return this.gA()/this.d.gG()},
saj(a){this.sA(a*this.d.gG())},
ga5(){return this.gv()/this.d.gG()},
sa5(a){this.sv(a*this.d.gG())},
gap(){return this.d.c===2?this.gq():A.a4(this)},
b5(a){var s=this
s.sq(a.gq())
s.sB(a.gB())
s.sA(a.gA())
s.sv(a.gv())},
aL(a,b,c){var s,r,q,p=this.d,o=p.c
if(o>0){p=p.d
s=this.c
r=B.a.h(a)
p.$flags&2&&A.b(p)
q=p.length
if(!(s>=0&&s<q))return A.a(p,s)
p[s]=r
if(o>2){o=s+1
r=B.a.h(b)
if(!(o<q))return A.a(p,o)
p[o]=r
s+=2
r=B.a.h(c)
if(!(s<q))return A.a(p,s)
p[s]=r}}},
ao(a,b,c,d){var s,r,q,p,o=this.d,n=o.c
if(n>0){o=o.d
s=this.c
r=B.b.h(a)
o.$flags&2&&A.b(o)
q=o.length
if(!(s>=0&&s<q))return A.a(o,s)
o[s]=r
if(n===2){n=s+1
s=B.b.h(d)
if(!(n<q))return A.a(o,n)
o[n]=s}else if(n>2){r=s+1
p=B.b.h(b)
if(!(r<q))return A.a(o,r)
o[r]=p
p=s+2
r=B.b.h(c)
if(!(p<q))return A.a(o,p)
o[p]=r
if(n>3){n=s+3
s=B.b.h(d)
if(!(n<q))return A.a(o,n)
o[n]=s}}}},
gF(a){return new A.Y(this)},
a_(a,b){var s,r,q,p=this
if(b==null)return!1
if(b instanceof A.d0){s=A.t(p,A.m(p).n("f.E"))
s=A.n(s)
r=A.t(b,A.m(b).n("f.E"))
return s===A.n(r)}if(t.L.b(b)){s=p.d
r=s.e
q=r!=null?r.b:s.c
s=J.ab(b)
if(s.gp(b)!==q)return!1
if(p.bA(0)!==s.l(b,0))return!1
if(q>1){if(p.bA(1)!==s.l(b,1))return!1
if(q>2){if(p.bA(2)!==s.l(b,2))return!1
if(q>3)if(p.bA(3)!==s.l(b,3))return!1}}return!0}return!1},
gK(a){var s=A.t(this,A.m(this).n("f.E"))
return A.n(s)},
b3(a){return A.aP(this,null,a,null,null)},
$iz:1,
$iy:1,
$iu:1,
gbo(){return this.d}}
A.d1.prototype={
R(){var s=this
return new A.d1(s.a,s.b,s.c,s.d,s.e,s.f)},
gp(a){var s=this.f,r=s.f
r=r==null?null:r.b
return r==null?s.c:r},
gW(){return this.f.f},
gG(){return this.f.gG()},
gM(){return B.R},
ghW(){var s=this.f
return s.f!=null?2:s.c<<1>>>0},
gbf(){return this.a},
gbg(){return this.b},
ad(a,b){var s,r,q,p=this
p.a=a
p.b=b
s=p.ghW()
r=b*p.f.e
p.e=r
q=a*s
p.c=r+B.a.j(q,3)
p.d=q&7},
gN(){return this},
C(){var s=this,r=++s.a,q=s.f
if(r===q.a){s.a=0
r=++s.b
s.d=0;++s.c
s.e=s.e+q.e
return r<q.b}if(q.f!=null||q.c===1){if((s.d+=2)>7){s.d=0;++s.c}}else{r*=s.ghW()
s.d=r&7
s.c=s.e+B.a.j(r,3)}r=s.c
q=q.d
q===$&&A.c()
return r<q.length},
ez(a){var s,r=this.c,q=6-(this.d+(a<<1>>>0))
if(q<0){q+=8;++r}s=this.f.d
s===$&&A.c()
if(!(r>=0&&r<s.length))return A.a(s,r)
return B.a.a4(s[r],q)&3},
ba(a){var s=this.f,r=s.f
if(r==null)s=s.c>a?this.ez(a):0
else s=r.aY(this.ez(0),a)
return s},
aE(a,b){var s,r,q,p,o,n,m=this.f
if(a>=m.c)return
s=this.c
r=6-(this.d+(a<<1>>>0))
if(r<0){++s
r+=8}q=m.d
q===$&&A.c()
if(!(s>=0&&s<q.length))return A.a(q,s)
p=q[s]
o=B.a.L(B.b.h(b),0,3)
q=B.a.j(r,1)
if(!(q<4))return A.a(B.cC,q)
n=B.cC[q]
q=B.a.U(o,r)
m=m.d
m.$flags&2&&A.b(m)
if(!(s<m.length))return A.a(m,s)
m[s]=(p&n|q)>>>0},
l(a,b){return this.ba(b)},
i(a,b,c){return this.aE(b,c)},
gX(){return this.ez(0)},
sX(a){this.aE(0,a)},
gq(){return this.ba(0)},
sq(a){this.aE(0,a)},
gB(){return this.f.c===2?this.ba(0):this.ba(1)},
sB(a){this.aE(this.f.c===2?0:1,a)},
gA(){return this.f.c===2?this.ba(0):this.ba(2)},
sA(a){this.aE(this.f.c===2?0:2,a)},
gv(){var s=this.f,r=s.f==null
if(r&&s.c===2)s=this.ba(1)
else s=r&&s.c<4?s.gG():this.ba(3)
return s},
sv(a){this.aE(this.f.c===2?1:3,a)},
gal(){return this.ba(0)/this.f.gG()},
sal(a){this.aE(0,a*this.f.gG())},
gah(){return this.gB()/this.f.gG()},
sah(a){var s=this.f,r=s.gG()
s=s.c===2?0:1
this.aE(s,a*r)},
gaj(){return this.gA()/this.f.gG()},
saj(a){var s=this.f,r=s.gG()
s=s.c===2?0:2
this.aE(s,a*r)},
ga5(){return this.gv()/this.f.gG()},
sa5(a){var s=this.f,r=s.gG()
s=s.c===2?1:3
this.aE(s,a*r)},
gap(){return this.f.c===2?this.ba(0):A.a4(this)},
b5(a){var s,r,q=this
q.aE(0,a.gq())
s=a.gB()
r=q.f.c===2
q.aE(r?0:1,s)
s=a.gA()
q.aE(r?0:2,s)
s=a.gv()
q.aE(r?1:3,s)},
aL(a,b,c){var s=this,r=s.f.c
if(r>0){s.aE(0,a)
if(r>2){s.aE(1,b)
s.aE(2,c)}}},
ao(a,b,c,d){var s=this,r=s.f.c
if(r>0){s.aE(0,a)
if(r===2)s.aE(1,d)
else if(r>2){s.aE(1,b)
s.aE(2,c)
if(r>3)s.aE(3,d)}}},
gF(a){return new A.Y(this)},
a_(a,b){var s,r,q,p=this
if(b==null)return!1
if(b instanceof A.d1){s=A.t(p,A.m(p).n("f.E"))
s=A.n(s)
r=A.t(b,A.m(b).n("f.E"))
return s===A.n(r)}if(t.L.b(b)){s=p.f
r=s.f
q=r!=null?r.b:s.c
s=J.ab(b)
if(s.gp(b)!==q)return!1
if(p.ba(0)!==s.l(b,0))return!1
if(q>1){if(p.ba(1)!==s.l(b,1))return!1
if(q>2){if(p.ba(2)!==s.l(b,2))return!1
if(q>3)if(p.ba(3)!==s.l(b,3))return!1}}return!0}return!1},
gK(a){var s=A.t(this,A.m(this).n("f.E"))
return A.n(s)},
b3(a){return A.aP(this,null,a,null,null)},
$iz:1,
$iy:1,
$iu:1,
gbo(){return this.f}}
A.d2.prototype={
R(){var s=this
return new A.d2(s.a,s.b,s.c,s.d)},
gp(a){return this.d.c},
gW(){return null},
gG(){return 4294967295},
gM(){return B.ab},
gbf(){return this.a},
gbg(){return this.b},
ad(a,b){var s,r,q=this
q.a=a
q.b=b
s=q.d
r=s.c
q.c=b*s.a*r+a*r},
gN(){return this},
C(){var s,r=this,q=r.d
if(++r.a===q.a){r.a=0
if(++r.b===q.b)return!1}s=r.c+q.c
r.c=s
return s<q.d.length},
l(a,b){var s,r=this.d
if(b<r.c){r=r.d
s=this.c+b
if(!(s>=0&&s<r.length))return A.a(r,s)
s=r[s]
r=s}else r=0
return r},
i(a,b,c){var s,r,q=this.d
if(b<q.c){q=q.d
s=this.c+b
r=B.b.h(c)
q.$flags&2&&A.b(q)
if(!(s>=0&&s<q.length))return A.a(q,s)
q[s]=r}},
gX(){return this.gq()},
sX(a){this.sq(a)},
gq(){var s,r=this.d
if(r.c>0){r=r.d
s=this.c
if(!(s>=0&&s<r.length))return A.a(r,s)
s=r[s]
r=s}else r=0
return r},
sq(a){var s,r,q=this.d
if(q.c>0){q=q.d
s=this.c
r=B.b.h(a)
q.$flags&2&&A.b(q)
if(!(s>=0&&s<q.length))return A.a(q,s)
q[s]=r}},
gB(){var s=this.d,r=s.c
if(r===2){s=s.d
r=this.c
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]
s=r}else if(r>1){s=s.d
r=this.c+1
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]
s=r}else s=0
return s},
sB(a){var s,r=this.d,q=r.c
if(q===2){r=r.d
q=this.c
s=B.b.h(a)
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s}else if(q>1){r=r.d
q=this.c+1
s=B.b.h(a)
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s}},
gA(){var s=this.d,r=s.c
if(r===2){s=s.d
r=this.c
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]
s=r}else if(r>2){s=s.d
r=this.c+2
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]
s=r}else s=0
return s},
sA(a){var s,r=this.d,q=r.c
if(q===2){r=r.d
q=this.c
s=B.b.h(a)
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s}else if(q>2){r=r.d
q=this.c+2
s=B.b.h(a)
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s}},
gv(){var s=this.d,r=s.c
if(r===2){s=s.d
r=this.c+1
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]
s=r}else if(r>3){s=s.d
r=this.c+3
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]
s=r}else s=4294967295
return s},
sv(a){var s,r=this.d,q=r.c
if(q===2){r=r.d
q=this.c+1
s=B.b.h(a)
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s}else if(q>3){r=r.d
q=this.c+3
s=B.b.h(a)
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s}},
gal(){return this.gq()/4294967295},
sal(a){this.sq(a*4294967295)},
gah(){return this.gB()/4294967295},
sah(a){this.sB(a*4294967295)},
gaj(){return this.gA()/4294967295},
saj(a){this.sA(a*4294967295)},
ga5(){return this.gv()/4294967295},
sa5(a){this.sv(a*4294967295)},
gap(){return this.d.c===2?this.gq():A.a4(this)},
b5(a){var s=this
s.sq(a.gq())
s.sB(a.gB())
s.sA(a.gA())
s.sv(a.gv())},
aL(a,b,c){var s,r,q,p=this.d,o=p.c
if(o>0){p=p.d
s=this.c
r=B.a.h(a)
p.$flags&2&&A.b(p)
q=p.length
if(!(s>=0&&s<q))return A.a(p,s)
p[s]=r
if(o>2){o=s+1
r=B.a.h(b)
if(!(o<q))return A.a(p,o)
p[o]=r
s+=2
r=B.a.h(c)
if(!(s<q))return A.a(p,s)
p[s]=r}}},
ao(a,b,c,d){var s,r,q,p,o=this.d,n=o.c
if(n>0){o=o.d
s=this.c
r=B.b.h(a)
o.$flags&2&&A.b(o)
q=o.length
if(!(s>=0&&s<q))return A.a(o,s)
o[s]=r
if(n===2){n=s+1
s=B.b.h(d)
if(!(n<q))return A.a(o,n)
o[n]=s}else if(n>2){r=s+1
p=B.b.h(b)
if(!(r<q))return A.a(o,r)
o[r]=p
p=s+2
r=B.b.h(c)
if(!(p<q))return A.a(o,p)
o[p]=r
if(n>3){n=s+3
s=B.b.h(d)
if(!(n<q))return A.a(o,n)
o[n]=s}}}},
gF(a){return new A.Y(this)},
a_(a,b){var s,r,q,p,o,n=this
if(b==null)return!1
if(b instanceof A.d2){s=A.t(n,A.m(n).n("f.E"))
s=A.n(s)
r=A.t(b,A.m(b).n("f.E"))
return s===A.n(r)}if(t.L.b(b)){s=J.ab(b)
r=n.d
q=r.c
if(s.gp(b)!==q)return!1
r=r.d
p=n.c
o=r.length
if(!(p>=0&&p<o))return A.a(r,p)
if(r[p]!==s.l(b,0))return!1
if(q>1){p=n.c+1
if(!(p>=0&&p<o))return A.a(r,p)
if(r[p]!==s.l(b,1))return!1
if(q>2){p=n.c+2
if(!(p>=0&&p<o))return A.a(r,p)
if(r[p]!==s.l(b,2))return!1
if(q>3){q=n.c+3
if(!(q>=0&&q<o))return A.a(r,q)
if(r[q]!==s.l(b,3))return!1}}}return!0}return!1},
gK(a){var s=A.t(this,A.m(this).n("f.E"))
return A.n(s)},
b3(a){return A.aP(this,null,a,null,null)},
$iz:1,
$iy:1,
$iu:1,
gbo(){return this.d}}
A.d3.prototype={
R(){var s=this
return new A.d3(s.a,s.b,s.c,s.d,s.e)},
gp(a){var s=this.e,r=s.f
r=r==null?null:r.b
return r==null?s.c:r},
gW(){return this.e.f},
gG(){return this.e.gG()},
gM(){return B.S},
gbf(){return this.a},
gbg(){return this.b},
ad(a,b){var s,r,q,p=this
p.a=a
p.b=b
s=p.e
r=s.c*4
q=s.e
if(r===4)s=b*q+B.a.j(a,1)
else if(r===8)s=b*s.a+a
else{s=b*q
s=r===16?s+(a<<1>>>0):s+B.a.j(a*r,3)}p.c=s
s=a*r
p.d=r>7?s&4:s&7},
gN(){return this},
C(){var s,r,q,p=this,o=p.e
if(++p.a===o.a){p.a=0
s=++p.b
p.d=0
p.c=s*o.e
return s<o.b}r=o.c
s=o.f!=null||r===1
q=p.d
if(s){s=q+4
p.d=s
if(s>7){p.d=0;++p.c}}else{s=p.d=q+(r<<2>>>0)
while(s>7){s-=8
p.d=s;++p.c}}s=p.c
o=o.d
o===$&&A.c()
return s<o.length},
eo(a){var s,r=this.c,q=4-(this.d+(a<<2>>>0))
if(q<0){q+=8;++r}s=this.e.d
s===$&&A.c()
if(!(r>=0&&r<s.length))return A.a(s,r)
return B.a.a4(s[r],q)&15},
bb(a){var s=this.e,r=s.f
if(r==null)s=s.c>a?this.eo(a):0
else s=r.aY(this.eo(0),a)
return s},
aF(a,b){var s,r,q,p,o,n,m=this.e
if(a>=m.c)return
s=this.c
r=4-(this.d+(a<<2>>>0))
if(r<0){r+=8;++s}q=m.d
q===$&&A.c()
if(!(s>=0&&s<q.length))return A.a(q,s)
p=q[s]
o=B.a.L(B.b.h(b),0,15)
n=r===4?15:240
q=B.a.U(o,r)
m=m.d
m.$flags&2&&A.b(m)
if(!(s<m.length))return A.a(m,s)
m[s]=(p&n|q)>>>0},
l(a,b){return this.bb(b)},
i(a,b,c){return this.aF(b,c)},
gX(){return this.eo(0)},
sX(a){this.aF(0,a)},
gq(){return this.bb(0)},
sq(a){this.aF(0,a)},
gB(){return this.e.c===2?this.bb(0):this.bb(1)},
sB(a){this.aF(this.e.c===2?0:1,a)},
gA(){return this.e.c===2?this.bb(0):this.bb(2)},
sA(a){this.aF(this.e.c===2?0:2,a)},
gv(){var s=this.e,r=s.f==null
if(r&&s.c===2)s=this.bb(1)
else s=r&&s.c<4?s.gG():this.bb(3)
return s},
sv(a){this.aF(this.e.c===2?1:3,a)},
gal(){return this.bb(0)/this.e.gG()},
sal(a){this.aF(0,a*this.e.gG())},
gah(){return this.gB()/this.e.gG()},
sah(a){var s=this.e,r=s.gG()
s=s.c===2?0:1
this.aF(s,a*r)},
gaj(){return this.gA()/this.e.gG()},
saj(a){var s=this.e,r=s.gG()
s=s.c===2?0:2
this.aF(s,a*r)},
ga5(){return this.gv()/this.e.gG()},
sa5(a){var s=this.e,r=s.gG()
s=s.c===2?1:3
this.aF(s,a*r)},
gap(){return this.e.c===2?this.bb(0):A.a4(this)},
b5(a){var s,r,q=this
q.aF(0,a.gq())
s=a.gB()
r=q.e.c===2
q.aF(r?0:1,s)
s=a.gA()
q.aF(r?0:2,s)
s=a.gv()
q.aF(r?1:3,s)},
aL(a,b,c){var s=this,r=s.e.c
if(r>0){s.aF(0,a)
if(r>2){s.aF(1,b)
s.aF(2,c)}}},
ao(a,b,c,d){var s=this,r=s.e.c
if(r>0){s.aF(0,a)
if(r===2)s.aF(1,d)
else if(r>2){s.aF(1,b)
s.aF(2,c)
if(r>3)s.aF(3,d)}}},
gF(a){return new A.Y(this)},
a_(a,b){var s,r,q,p=this
if(b==null)return!1
if(b instanceof A.d3){s=A.t(p,A.m(p).n("f.E"))
s=A.n(s)
r=A.t(b,A.m(b).n("f.E"))
return s===A.n(r)}if(t.L.b(b)){q=p.e.c
s=J.ab(b)
if(s.gp(b)!==q)return!1
if(p.bb(0)!==s.l(b,0))return!1
if(q>1){if(p.bb(1)!==s.l(b,1))return!1
if(q>2){if(p.bb(2)!==s.l(b,2))return!1
if(q>3)if(p.bb(3)!==s.l(b,3))return!1}}return!0}return!1},
gK(a){var s=A.t(this,A.m(this).n("f.E"))
return A.n(s)},
b3(a){return A.aP(this,null,a,null,null)},
$iz:1,
$iy:1,
$iu:1,
gbo(){return this.e}}
A.d4.prototype={
R(){var s=this
return new A.d4(s.a,s.b,s.c,s.d)},
gp(a){var s=this.d,r=s.e
r=r==null?null:r.b
return r==null?s.c:r},
gW(){return this.d.e},
gG(){return this.d.gG()},
gM(){return B.e},
gbf(){return this.a},
gbg(){return this.b},
ad(a,b){var s,r,q=this
q.a=a
q.b=b
s=q.d
r=s.c
q.c=b*s.a*r+a*r},
gN(){return this},
C(){var s,r=this,q=r.d
if(++r.a===q.a){r.a=0
if(++r.b===q.b)return!1}s=r.c
s+=q.e==null?q.c:1
r.c=s
return s<q.d.length},
bA(a){var s,r=this.d,q=r.e
if(q!=null){r=r.d
s=this.c
if(!(s>=0&&s<r.length))return A.a(r,s)
s=q.aY(r[s],a)
r=s}else if(a<r.c){r=r.d
q=this.c+a
if(!(q>=0&&q<r.length))return A.a(r,q)
q=r[q]
r=q}else r=0
return r},
l(a,b){return this.bA(b)},
i(a,b,c){var s,r,q=this.d
if(b<q.c){q=q.d
s=this.c+b
r=B.b.h(B.b.L(c,0,255))
q.$flags&2&&A.b(q)
if(!(s>=0&&s<q.length))return A.a(q,s)
q[s]=r}},
gX(){var s=this.d.d,r=this.c
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]},
sX(a){var s=this.d.d,r=this.c,q=B.b.h(B.b.L(a,0,255))
s.$flags&2&&A.b(s)
if(!(r>=0&&r<s.length))return A.a(s,r)
s[r]=q},
gq(){var s,r=this.d,q=r.e
if(q==null)if(r.c>0){r=r.d
q=this.c
if(!(q>=0&&q<r.length))return A.a(r,q)
q=r[q]
r=q}else r=0
else{r=r.d
s=this.c
if(!(s>=0&&s<r.length))return A.a(r,s)
s=q.bj(r[s])
r=s}return r},
sq(a){var s,r,q=this.d
if(q.c>0){q=q.d
s=this.c
r=B.b.h(B.b.L(a,0,255))
q.$flags&2&&A.b(q)
if(!(s>=0&&s<q.length))return A.a(q,s)
q[s]=r}},
gB(){var s,r=this,q=r.d,p=q.e
if(p==null){p=q.c
if(p===2){q=q.d
p=r.c
if(!(p>=0&&p<q.length))return A.a(q,p)
p=q[p]
q=p}else if(p>1){q=q.d
p=r.c+1
if(!(p>=0&&p<q.length))return A.a(q,p)
p=q[p]
q=p}else q=0}else{q=q.d
s=r.c
if(!(s>=0&&s<q.length))return A.a(q,s)
s=p.bi(q[s])
q=s}return q},
sB(a){var s,r=this.d,q=r.c
if(q===2){r=r.d
q=this.c
s=B.b.h(B.b.L(a,0,255))
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s}else if(q>1){r=r.d
q=this.c+1
s=B.b.h(B.b.L(a,0,255))
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s}},
gA(){var s,r=this,q=r.d,p=q.e
if(p==null){p=q.c
if(p===2){q=q.d
p=r.c
if(!(p>=0&&p<q.length))return A.a(q,p)
p=q[p]
q=p}else if(p>2){q=q.d
p=r.c+2
if(!(p>=0&&p<q.length))return A.a(q,p)
p=q[p]
q=p}else q=0}else{q=q.d
s=r.c
if(!(s>=0&&s<q.length))return A.a(q,s)
s=p.bh(q[s])
q=s}return q},
sA(a){var s,r=this.d,q=r.c
if(q===2){r=r.d
q=this.c
s=B.b.h(B.b.L(a,0,255))
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s}else if(q>2){r=r.d
q=this.c+2
s=B.b.h(B.b.L(a,0,255))
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s}},
gv(){var s,r=this,q=r.d,p=q.e
if(p==null){p=q.c
if(p===2){q=q.d
p=r.c+1
if(!(p>=0&&p<q.length))return A.a(q,p)
p=q[p]
q=p}else if(p>3){q=q.d
p=r.c+3
if(!(p>=0&&p<q.length))return A.a(q,p)
p=q[p]
q=p}else q=255}else{q=q.d
s=r.c
if(!(s>=0&&s<q.length))return A.a(q,s)
s=p.bq(q[s])
q=s}return q},
sv(a){var s,r=this.d,q=r.c
if(q===2){r=r.d
q=this.c+1
s=B.b.h(B.b.L(a,0,255))
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s}else if(q>3){r=r.d
q=this.c+3
s=B.b.h(B.b.L(a,0,255))
r.$flags&2&&A.b(r)
if(!(q>=0&&q<r.length))return A.a(r,q)
r[q]=s}},
gal(){return this.gq()/this.d.gG()},
sal(a){this.sq(a*this.d.gG())},
gah(){return this.gB()/this.d.gG()},
sah(a){this.sB(a*this.d.gG())},
gaj(){return this.gA()/this.d.gG()},
saj(a){this.sA(a*this.d.gG())},
ga5(){return this.gv()/this.d.gG()},
sa5(a){this.sv(a*this.d.gG())},
gap(){return this.d.c===2?this.gq():A.a4(this)},
b5(a){var s=this
if(s.d.e!=null)s.sX(a.gX())
else{s.sq(a.gq())
s.sB(a.gB())
s.sA(a.gA())
s.sv(a.gv())}},
aL(a,b,c){var s,r,q,p=this.d,o=p.c
if(o>0){p=p.d
s=this.c
r=B.a.h(a)
p.$flags&2&&A.b(p)
q=p.length
if(!(s>=0&&s<q))return A.a(p,s)
p[s]=r
if(o>2){o=s+1
r=B.a.h(b)
if(!(o<q))return A.a(p,o)
p[o]=r
s+=2
r=B.a.h(c)
if(!(s<q))return A.a(p,s)
p[s]=r}}},
ao(a,b,c,d){var s,r,q,p,o=this.d,n=o.c
if(n>0){o=o.d
s=this.c
r=B.b.h(a)
o.$flags&2&&A.b(o)
q=o.length
if(!(s>=0&&s<q))return A.a(o,s)
o[s]=r
if(n===2){n=s+1
s=B.b.h(d)
if(!(n<q))return A.a(o,n)
o[n]=s}else if(n>2){r=s+1
p=B.b.h(b)
if(!(r<q))return A.a(o,r)
o[r]=p
p=s+2
r=B.b.h(c)
if(!(p<q))return A.a(o,p)
o[p]=r
if(n>3){n=s+3
s=B.b.h(d)
if(!(n<q))return A.a(o,n)
o[n]=s}}}},
gF(a){return new A.Y(this)},
a_(a,b){var s,r,q,p=this
if(b==null)return!1
if(b instanceof A.d4){s=A.t(p,A.m(p).n("f.E"))
s=A.n(s)
r=A.t(b,A.m(b).n("f.E"))
return s===A.n(r)}if(t.L.b(b)){s=p.d
r=s.e
q=r!=null?r.b:s.c
s=J.ab(b)
if(s.gp(b)!==q)return!1
if(p.bA(0)!==s.l(b,0))return!1
if(q>1){if(p.bA(1)!==s.l(b,1))return!1
if(q>2){if(p.bA(2)!==s.l(b,2))return!1
if(q>3)if(p.bA(3)!==s.l(b,3))return!1}}return!0}return!1},
gK(a){var s=A.t(this,A.m(this).n("f.E"))
return A.n(s)},
b3(a){return A.aP(this,null,a,null,null)},
$iz:1,
$iy:1,
$iu:1,
gbo(){return this.d}}
A.J.prototype={
R(){return new A.J()},
gbo(){return $.rx()},
gbf(){return 0},
gbg(){return 0},
gp(a){return 0},
gG(){return 0},
gM(){return B.e},
gW(){return null},
l(a,b){return 0},
i(a,b,c){},
gX(){return 0},
sX(a){},
gq(){return 0},
sq(a){},
gB(){return 0},
sB(a){},
gA(){return 0},
sA(a){},
gv(){return 0},
sv(a){},
gal(){return 0},
sal(a){},
gah(){return 0},
sah(a){},
gaj(){return 0},
saj(a){},
ga5(){return 0},
sa5(a){},
gap(){return 0},
b5(a){},
aL(a,b,c){},
ao(a,b,c,d){},
gN(){return this},
C(){return!1},
a_(a,b){if(b==null)return!1
return b instanceof A.J},
gK(a){return 0},
gF(a){return new A.Y(this)},
b3(a){return this},
$iz:1,
$iy:1,
$iu:1}
A.ms.prototype={
jo(a,b){var s=this,r=a.a.gaB(),q=s.b,p=(a.gJ()-1)*q,o=(a.gI()-1)*r,n=s.e
switch(b){case 2:n!==$&&A.B()
s.e=p
s.f!==$&&A.B()
s.f=-q
s.r!==$&&A.B()
s.r=r
break
case 3:n!==$&&A.B()
s.e=o+p
s.f!==$&&A.B()
s.f=-q
s.r!==$&&A.B()
s.r=-r
break
case 4:n!==$&&A.B()
s.e=o
s.f!==$&&A.B()
s.f=q
s.r!==$&&A.B()
s.r=-r
break
case 5:n!==$&&A.B()
s.e=0
s.f!==$&&A.B()
s.f=r
s.r!==$&&A.B()
s.r=q
break
case 6:n!==$&&A.B()
s.e=o
s.f!==$&&A.B()
s.f=-r
s.r!==$&&A.B()
s.r=q
break
case 7:n!==$&&A.B()
s.e=o+p
s.f!==$&&A.B()
s.f=-r
s.r!==$&&A.B()
s.r=-q
break
case 8:n!==$&&A.B()
s.e=p
s.f!==$&&A.B()
s.f=r
s.r!==$&&A.B()
s.r=-q
break
default:n!==$&&A.B()
s.e=0
s.f!==$&&A.B()
s.f=q
s.r!==$&&A.B()
s.r=r
break}}}
A.nl.prototype={
$1(a){return A.r1(t.mo.a(a),this.a.a)},
$S:42}
A.hK.prototype={
a8(){return"FlipDirection."+this.b}}
A.hT.prototype={
D(a){return"ImageException: "+this.a}}
A.ar.prototype={
gp(a){return this.c-this.d},
i(a,b,c){J.a2(this.a,this.d+b,c)
return c},
cI(a,b,c,d){var s=this.a,r=J.bu(s),q=this.d+a
if(c instanceof A.ar)r.a3(s,q,q+b,c.a,c.d+d)
else r.a3(s,q,q+b,t.L.a(c),d)},
dS(a,b,c){return this.cI(a,b,c,0)},
nF(a,b,c){var s=this.a,r=this.d+a
J.eu(s,r,r+b,c)},
e3(a,b,c){var s=this,r=c!=null?s.b+c:s.d
return A.v(s.a,s.e,a,r+b)},
aO(a){return this.e3(a,0,null)},
cj(a,b){return this.e3(a,0,b)},
dq(a,b){return this.e3(a,b,null)},
H(){return J.d(this.a,this.d++)},
ac(a){var s=this.aO(a)
this.d=this.d+(s.c-s.d)
return s},
ar(a){var s,r,q,p,o,n=this
if(a==null){s=A.j([],t.t)
for(r=n.c;q=n.d,q<r;){p=n.a
n.d=q+1
o=J.d(p,q)
if(o===0)return A.d8(s,0,null)
B.c.E(s,o)}throw A.e(A.k("EOF reached without finding string terminator (length: "+A.A(a)+")"))}return A.d8(n.ac(a).a0(),0,null)},
dd(){return this.ar(null)},
ip(a){var s,r,q,p,o=this,n=A.j([],t.t)
for(s=o.c;r=o.d,r<s;){q=o.a
o.d=r+1
p=J.d(q,r)
B.c.E(n,p)
if(p===10||n.length>=a)return A.d8(n,0,null)}return A.d8(n,0,null)},
nQ(){return this.ip(256)},
nR(){var s,r,q,p,o=this,n=A.j([],t.t)
for(s=o.c;r=o.d,r<s;){q=o.a
o.d=r+1
p=J.d(q,r)
if(p===0){t.L.a(n)
return new A.hh(!0).eb(n,0,null,!0)}B.c.E(n,p)}return B.bh.eN(n,!0)},
m(){var s=this,r=J.d(s.a,s.d++)&255,q=J.d(s.a,s.d++)&255
if(s.e)return r<<8|q
return q<<8|r},
bx(){var s=this,r=J.d(s.a,s.d++)&255,q=J.d(s.a,s.d++)&255,p=J.d(s.a,s.d++)&255
if(s.e)return p|q<<8|r<<16
return r|q<<8|p<<16},
k(){var s=this,r=J.d(s.a,s.d++)&255,q=J.d(s.a,s.d++)&255,p=J.d(s.a,s.d++)&255,o=J.d(s.a,s.d++)&255
if(s.e)return(r<<24|q<<16|p<<8|o)>>>0
return(o<<24|p<<16|q<<8|r)>>>0},
dU(){return A.yk(this.eU())},
eU(){var s=this,r=J.d(s.a,s.d++)&255,q=J.d(s.a,s.d++)&255,p=J.d(s.a,s.d++)&255,o=J.d(s.a,s.d++)&255,n=J.d(s.a,s.d++)&255,m=J.d(s.a,s.d++)&255,l=J.d(s.a,s.d++)&255,k=J.d(s.a,s.d++)&255
if(s.e)return(B.a.O(r,56)|B.a.O(q,48)|B.a.O(p,40)|B.a.O(o,32)|n<<24|m<<16|l<<8|k)>>>0
return(B.a.O(k,56)|B.a.O(l,48)|B.a.O(m,40)|B.a.O(n,32)|o<<24|p<<16|q<<8|r)>>>0},
eX(a,b,c){var s,r=this,q=r.a
if(t.D.b(q))return r.iy(b,c)
s=r.b+r.d+b
return J.nM(q,s,c<=0?r.c:s+c)},
iy(a,b){var s,r=this,q=b==null?r.c-r.d-a:b,p=r.a
if(t.D.b(p))return J.F(B.d.gt(p),p.byteOffset+r.d+a,q)
s=r.d+a
s=new Uint8Array(A.o(J.nM(p,s,s+q)))
return s},
a0(){return this.iy(0,null)},
dX(){var s=this.a
if(t.D.b(s))return J.az(B.d.gt(s),s.byteOffset+this.d,null)
return J.az(B.d.gt(this.a0()),0,null)},
st(a,b){this.a=t.L.a(b)}}
A.ii.prototype={
gW(){var s=this.a
s===$&&A.c()
return s},
mW(a){var s,r,q,p,o,n,m,l,k,j,i=this
i.lk(a)
i.kV()
i.lg()
i.jW()
B.t.V(i.ax,0,65536,0)
s=i.c
r=s*4
q=i.at=new Int32Array(r)
for(p=i.Q,o=0;o<s;++o)for(n=o*4,m=0;m<4;++m){l=n+m
p===$&&A.c()
k=p.b
if(m<k){j=p.c
k=o*k+m
if(!(k>=0&&k<j.length))return A.a(j,k)
k=j[k]}else k=0
k=B.a.h(k)
if(!(l<r))return A.a(q,l)
q[l]=k}},
iG(a){var s=B.b.h(a.gq()),r=B.b.h(a.gB())
return this.fY(B.b.h(a.gA()),r,s)},
dY(a,b,c){var s,r=this,q=(a<<16|b<<8|c)>>>0,p=(q^q>>>11)&65535,o=r.ax,n=q+1
if(o[p]===n)return r.ay[p]
s=r.fY(c,b,a)
o.$flags&2&&A.b(o)
o[p]=n
o=r.ay
o.$flags&2&&A.b(o)
o[p]=s
return s},
le(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=g.c=Math.max(a,4)
g.f=f-g.d
g.r=f-1
s=B.b.P(f,8)
g.w=s
g.x=s*256
g.Q=new A.e0(new Uint32Array(1024),256,4)
g.a=new A.aU(new Uint8Array(768),256,3)
g.d=3
g.e=2
s=B.b.j(f,3)
g.y=new Int32Array(s)
s=g.z=new Float64Array(f*3)
r=g.ch=new Float64Array(f)
q=g.CW=new Float64Array(f)
p=s.length
if(0>=p)return A.a(s,0)
s[0]=0
if(1>=p)return A.a(s,1)
s[1]=0
if(2>=p)return A.a(s,2)
s[2]=0
if(3>=p)return A.a(s,3)
s[3]=255
if(4>=p)return A.a(s,4)
s[4]=255
if(5>=p)return A.a(s,5)
s[5]=255
o=1/f
for(n=q.length,m=r.length,l=0;l<3;++l){if(!(l<n))return A.a(q,l)
q[l]=o
if(!(l<m))return A.a(r,l)
r[l]=0}for(k=3*3,j=g.f,l=3;l<f;++l,k=i){i=k+1
h=255*(l-3)/j
if(!(k<p))return A.a(s,k)
s[k]=h
k=i+1
if(!(i<p))return A.a(s,i)
s[i]=h
i=k+1
if(!(k<p))return A.a(s,k)
s[k]=h
if(!(l<n))return A.a(q,l)
q[l]=o
if(!(l<m))return A.a(r,l)
r[l]=0}},
jW(){var s,r,q,p,o,n,m
for(s=0;s<this.c;++s){r=this.a
r===$&&A.c()
q=this.Q
q===$&&A.c()
p=q.b
if(2<p){o=q.c
n=s*p+2
if(!(n>=0&&n<o.length))return A.a(o,n)
n=o[n]
o=n}else o=0
if(1<p){n=q.c
m=s*p+1
if(!(m>=0&&m<n.length))return A.a(n,m)
m=n[m]
n=m}else n=0
if(0<p){q=q.c
p=s*p
if(!(p>=0&&p<q.length))return A.a(q,p)
p=q[p]
q=p}else q=0
r.bk(s,Math.abs(o),Math.abs(n),Math.abs(q))}},
fY(a,b,c){var s,r,q,p,o,n,m,l,k,j=this.at,i=this.as
if(!(b>=0&&b<256))return A.a(i,b)
s=i[b]
r=s-1
q=this.c
i=j.length
p=1000
o=-1
for(;;){n=s<q
if(!(n||r>=0))break
if(n){n=s*4
m=n+1
if(!(m>=0&&m<i))return A.a(j,m)
l=j[m]-b
if(l>=p)s=q
else{if(l<0)l=-l
if(!(n>=0&&n<i))return A.a(j,n)
k=j[n]-a
l+=k<0?-k:k
if(l<p){n+=2
if(!(n<i))return A.a(j,n)
k=j[n]-c
l+=k<0?-k:k
if(l<p){o=s
p=l}}++s}}if(r>=0){n=r*4
m=n+1
if(!(m>=0&&m<i))return A.a(j,m)
l=b-j[m]
if(l>=p)r=-1
else{if(l<0)l=-l
if(!(n>=0&&n<i))return A.a(j,n)
k=j[n]-a
l+=k<0?-k:k
if(l<p){n+=2
if(!(n<i))return A.a(j,n)
k=j[n]-c
l+=k<0?-k:k
if(l<p){o=r
p=l}}--r}}}return o},
kV(){var s,r,q,p,o,n,m,l=this
for(s=0,r=0;s<l.c;++s){for(q=0;q<3;++q,++r){p=l.z
p===$&&A.c()
if(!(r>=0&&r<p.length))return A.a(p,r)
o=B.a.L(B.b.h(0.5+p[r]),0,255)
p=l.Q
p===$&&A.c()
n=p.b
if(q<n){p=p.c
n=s*n+q
m=B.a.h(o)
p.$flags&2&&A.b(p)
if(!(n>=0&&n<p.length))return A.a(p,n)
p[n]=m}}p=l.Q
p===$&&A.c()
n=p.b
if(3<n){p=p.c
n=s*n+3
m=B.a.h(s)
p.$flags&2&&A.b(p)
if(!(n>=0&&n<p.length))return A.a(p,n)
p[n]=m}}},
lg(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=this
for(s=b.c,r=b.Q,q=b.as,p=q.$flags|0,o=0,n=0,m=0;m<s;m=g){r===$&&A.c()
l=r.b
k=1<l
if(k){j=r.c
i=m*l+1
if(!(i>=0&&i<j.length))return A.a(j,i)
h=j[i]}else h=0
for(g=m+1,f=g,e=m;f<s;++f){if(k){j=r.c
i=f*l+1
if(!(i>=0&&i<j.length))return A.a(j,i)
i=j[i]
j=i}else j=0
if(j<h){if(k){j=r.c
i=f*l+1
if(!(i>=0&&i<j.length))return A.a(j,i)
h=j[i]}else h=0
e=f}}if(m!==e){j=0<l
if(j){i=r.c
d=e*l
if(!(d>=0&&d<i.length))return A.a(i,d)
f=i[d]}else f=0
if(j){i=r.c
d=m*l
if(!(d>=0&&d<i.length))return A.a(i,d)
d=i[d]
i=d}else i=0
if(j){c=e*l
d=r.c
i=B.a.h(i)
d.$flags&2&&A.b(d)
if(!(c>=0&&c<d.length))return A.a(d,c)
d[c]=i}if(j){c=m*l
j=r.c
i=B.a.h(f)
j.$flags&2&&A.b(j)
if(!(c>=0&&c<j.length))return A.a(j,c)
j[c]=i}if(k){j=r.c
i=e*l+1
if(!(i>=0&&i<j.length))return A.a(j,i)
f=j[i]}else f=0
if(k){j=r.c
i=m*l+1
if(!(i>=0&&i<j.length))return A.a(j,i)
i=j[i]
j=i}else j=0
if(k){i=r.c
d=e*l+1
j=B.a.h(j)
i.$flags&2&&A.b(i)
if(!(d>=0&&d<i.length))return A.a(i,d)
i[d]=j}if(k){k=r.c
j=m*l+1
i=B.a.h(f)
k.$flags&2&&A.b(k)
if(!(j>=0&&j<k.length))return A.a(k,j)
k[j]=i}k=2<l
if(k){j=r.c
i=e*l+2
if(!(i>=0&&i<j.length))return A.a(j,i)
f=j[i]}else f=0
if(k){j=r.c
i=m*l+2
if(!(i>=0&&i<j.length))return A.a(j,i)
i=j[i]
j=i}else j=0
if(k){i=r.c
d=e*l+2
j=B.a.h(j)
i.$flags&2&&A.b(i)
if(!(d>=0&&d<i.length))return A.a(i,d)
i[d]=j}if(k){k=r.c
j=m*l+2
i=B.a.h(f)
k.$flags&2&&A.b(k)
if(!(j>=0&&j<k.length))return A.a(k,j)
k[j]=i}k=3<l
if(k){j=r.c
i=e*l+3
if(!(i>=0&&i<j.length))return A.a(j,i)
f=j[i]}else f=0
if(k){j=r.c
i=m*l+3
if(!(i>=0&&i<j.length))return A.a(j,i)
i=j[i]
j=i}else j=0
if(k){i=r.c
d=e*l+3
j=B.a.h(j)
i.$flags&2&&A.b(i)
if(!(d>=0&&d<i.length))return A.a(i,d)
i[d]=j}if(k){k=r.c
l=m*l+3
j=B.a.h(f)
k.$flags&2&&A.b(k)
if(!(l>=0&&l<k.length))return A.a(k,l)
k[l]=j}}if(h!==o){p&2&&A.b(q)
if(!(o>=0&&o<256))return A.a(q,o)
q[o]=n+m>>>1
for(f=o+1;f<h;++f){if(!(f<256))return A.a(q,f)
q[f]=m}n=m
o=h}}s=b.r
s.toString
r=B.a.j(n+s,1)
p&2&&A.b(q)
if(!(o>=0&&o<256))return A.a(q,o)
q[o]=r
for(g=o+1;g<256;++g)q[g]=s},
hw(a,b){var s,r,q,p
for(s=this.y,r=a*a,q=0;q<a;++q){s===$&&A.c()
p=B.b.h(b*((r-q*q)*256/r))
s.$flags&2&&A.b(s)
if(!(q<s.length))return A.a(s,q)
s[q]=p}},
lk(a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5=this,a6=a5.x
a6===$&&A.c()
s=a5.b
r=30+B.a.P(s-1,3)
q=a7.gJ()*a7.gI()
p=B.a.Z(q,s)
o=Math.max(B.a.P(p,100),1)
if(o===0)o=1
n=B.a.j(a6,8)
if(n<=1)n=0
a5.hw(n,1024)
if(q<1509)m=a5.b=1
else if(B.a.a1(q,499)!==0)m=499
else if(B.a.a1(q,491)!==0)m=491
else m=B.a.a1(q,487)!==0?487:503
l=a7.gJ()
k=a7.gI()
for(j=a6,i=1024,h=0,g=0,f=0,e=0,d=null;e<p;){a6=a7.a
d=a6==null?null:a6.S(g,f,d)
if(d==null)d=new A.J()
c=d.gq()
b=d.gB()
a=d.gA()
if(e===0){a6=a5.z
a6===$&&A.c()
s=a5.e
s===$&&A.c()
s*=3
a6.$flags&2&&A.b(a6)
a0=a6.length
if(!(s>=0&&s<a0))return A.a(a6,s)
a6[s]=a
a1=s+1
if(!(a1<a0))return A.a(a6,a1)
a6[a1]=b
s+=2
if(!(s<a0))return A.a(a6,s)
a6[s]=c}a2=a5.mv(a,b,c)
if(a2<0)a2=a5.jU(a,b,c)
if(a2>=a5.d){a3=i/1024
a4=a2*3
a6=a5.z
a6===$&&A.c()
s=a6.length
if(!(a4>=0&&a4<s))return A.a(a6,a4)
a0=a6[a4]
a6.$flags&2&&A.b(a6)
a6[a4]=a0-a3*(a0-a)
a0=a4+1
if(!(a0<s))return A.a(a6,a0)
a1=a6[a0]
a6[a0]=a1-a3*(a1-b)
a1=a4+2
if(!(a1<s))return A.a(a6,a1)
s=a6[a1]
a6[a1]=s-a3*(s-c)
if(n>0)a5.js(a3,n,a2,a,b,c)}h+=m
g+=m
while(g>l){g-=l;++f}while(h>=q){h-=q
f-=k}++e
if(B.a.a1(e,o)===0){i-=B.a.Z(i,r)
j-=B.a.P(j,30)
n=B.a.j(j,8)
if(n<=1)n=0
a5.hw(n,i)}}},
js(a,b,c,a0,a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this,e=c-b,d=f.d-1
if(e<d)e=d
s=c+b
r=f.c
if(s>r)s=r
q=c+1
p=c-1
o=f.y
n=f.z
m=1
for(;;){l=q<s
if(!(l||p>e))break
o===$&&A.c()
k=m+1
if(!(m<o.length))return A.a(o,m)
j=o[m]
if(l){i=q*3
n===$&&A.c()
l=n.length
if(!(i>=0&&i<l))return A.a(n,i)
h=n[i]
n.$flags&2&&A.b(n)
n[i]=h-j*(h-a0)/262144
h=i+1
if(!(h<l))return A.a(n,h)
g=n[h]
n[h]=g-j*(g-a1)/262144
g=i+2
if(!(g<l))return A.a(n,g)
l=n[g]
n[g]=l-j*(l-a2)/262144;++q}if(p>e){i=p*3
n===$&&A.c()
l=n.length
if(!(i>=0&&i<l))return A.a(n,i)
h=n[i]
n.$flags&2&&A.b(n)
n[i]=h-j*(h-a0)/262144
h=i+1
if(!(h<l))return A.a(n,h)
g=n[h]
n[h]=g-j*(g-a1)/262144
g=i+2
if(!(g<l))return A.a(n,g)
l=n[g]
n[g]=l-j*(l-a2)/262144;--p}m=k}},
jU(a0,a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=this,a=1e30
for(s=b.d,r=s*3,q=b.c,p=b.CW,o=b.ch,n=b.z,m=a,l=m,k=-1,j=-1;s<q;++s,r=i){n===$&&A.c()
i=r+1
h=n.length
if(!(r<h))return A.a(n,r)
g=n[r]-a0
if(g<0)g=-g
r=i+1
if(!(i<h))return A.a(n,i)
f=n[i]-a1
if(f<0)f=-f
i=r+1
if(!(r<h))return A.a(n,r)
e=n[r]-a2
if(e<0)e=-e
g=g+f+e
if(g<l){k=s
l=g}o===$&&A.c()
if(!(s<o.length))return A.a(o,s)
d=g-o[s]
if(d<m){j=s
m=d}p===$&&A.c()
if(!(s<p.length))return A.a(p,s)
h=p[s]
p.$flags&2&&A.b(p)
p[s]=h-0.0009765625*h
h=o[s]
c=p[s]
o.$flags&2&&A.b(o)
o[s]=h+c}p===$&&A.c()
if(!(k>=0&&k<p.length))return A.a(p,k)
q=p[k]
p.$flags&2&&A.b(p)
p[k]=q+0.0009765625
o===$&&A.c()
if(!(k<o.length))return A.a(o,k)
q=o[k]
o.$flags&2&&A.b(o)
o[k]=q-1
return j},
mv(a,b,c){var s,r,q,p,o,n,m
for(s=this.d,r=this.z,q=0,p=0;q<s;++q){r===$&&A.c()
o=p+1
n=r.length
if(!(p<n))return A.a(r,p)
m=!1
if(r[p]===a){p=o+1
if(!(o<n))return A.a(r,o)
if(r[o]===b){o=p+1
if(!(p<n))return A.a(r,p)
n=r[p]===c
p=o}else n=m}else{n=m
p=o}if(n)return q}return-1}}
A.ik.prototype={
u(a){var s,r=this,q=r.a
if(q===r.c.length)r.fJ(q+1)
q=r.c
s=r.a++
q.$flags&2&&A.b(q)
if(!(s>=0&&s<q.length))return A.a(q,s)
q[s]=a&255},
iC(a,b){var s,r,q=this
t.L.a(a)
if(b==null)b=J.bz(a)
s=q.a+b
if(s>q.c.length)q.fJ(s)
s=q.c
r=q.a
B.d.aa(s,r,r+b,a)
q.a+=b},
au(a){return this.iC(a,null)},
a9(a){var s=this
A.r(a)
if(s.b){s.u(B.a.j(a,8)&255)
s.u(a&255)
return}s.u(a&255)
s.u(B.a.j(a,8)&255)},
ae(a){var s=this
if(s.b){s.u(B.a.j(a,24)&255)
s.u(B.a.j(a,16)&255)
s.u(B.a.j(a,8)&255)
s.u(a&255)
return}s.u(a&255)
s.u(B.a.j(a,8)&255)
s.u(B.a.j(a,16)&255)
s.u(B.a.j(a,24)&255)},
o6(a){var s,r,q=this,p=new Float32Array(1)
p[0]=a
s=J.F(B.a1.gt(p),0,null)
if(q.b){if(3>=s.length)return A.a(s,3)
q.u(s[3])
q.u(s[2])
q.u(s[1])
q.u(s[0])
return}r=s.length
if(0>=r)return A.a(s,0)
q.u(s[0])
if(1>=r)return A.a(s,1)
q.u(s[1])
if(2>=r)return A.a(s,2)
q.u(s[2])
if(3>=r)return A.a(s,3)
q.u(s[3])},
o7(a){var s,r,q=this,p=new Float64Array(1)
p[0]=a
s=J.F(B.x.gt(p),0,null)
if(q.b){if(7>=s.length)return A.a(s,7)
q.u(s[7])
q.u(s[6])
q.u(s[5])
q.u(s[4])
q.u(s[3])
q.u(s[2])
q.u(s[1])
q.u(s[0])
return}r=s.length
if(0>=r)return A.a(s,0)
q.u(s[0])
if(1>=r)return A.a(s,1)
q.u(s[1])
if(2>=r)return A.a(s,2)
q.u(s[2])
if(3>=r)return A.a(s,3)
q.u(s[3])
if(4>=r)return A.a(s,4)
q.u(s[4])
if(5>=r)return A.a(s,5)
q.u(s[5])
if(6>=r)return A.a(s,6)
q.u(s[6])
if(7>=r)return A.a(s,7)
q.u(s[7])},
fJ(a){var s=this.c,r=Math.max(s.length*3,a+8192),q=new Uint8Array(r)
B.d.aa(q,0,this.a,s)
this.c=q},
gp(a){return this.a}}
A.l9.prototype={
a8(){return"QuantizerType."+this.b}}
A.iH.prototype={
iH(a){var s,r,q=a.gJ(),p=A.Z(null,null,B.e,0,B.l,a.gI(),null,0,1,this.gW(),B.e,q,!1)
q=p.a
s=q.gF(q)
s.C()
p.z=a.z
p.w=a.w
p.y=a.y
for(q=a.a,q=q.gF(q);q.C();){r=q.gN()
s.gN().i(0,0,this.iG(r))
s.C()}return p}}
A.b7.prototype={
h(a){var s=this.b
return s===0?0:B.a.Z(this.a,s)},
a_(a,b){if(b==null)return!1
return b instanceof A.b7&&this.a===b.a&&this.b===b.b},
gK(a){return A.o5(this.a,this.b,B.av,B.av)},
D(a){return""+this.a+"/"+this.b}}
A.jK.prototype={}
A.cg.prototype={
D(a){return this.a}}
A.bL.prototype={
a8(){return"Engine."+this.b}}
A.e6.prototype={
ik(a){var s=this.r
if(s!=null)return s
A:{if(B.az===a){s=B.G
break A}if(B.bn===a||B.aM===a||B.a8===a){s=B.a7
break A}s=a
break A}return s}}
A.bl.prototype={
a8(){return"FileFamily."+this.b}}
A.C.prototype={
a8(){return"FileKind."+this.b}}
A.k2.prototype={
$1(a){return t.h7.a(a).c===this.a},
$S:43}
A.nj.prototype={
$1(a){return this.a.E(0,B.bg.bY(a))},
$S:44}
A.nh.prototype={
$2(a,b){var s
t.M.a(b)
s=this.b
B.c.E(this.a,s.gp(s))
s=this.c
s.$1(""+a+" 0 obj\n")
b.$0()
s.$1("\nendobj\n")},
$S:45}
A.ni.prototype={
$1(a){return 3+a*3},
$S:8}
A.nc.prototype={
$0(){return this.a.$1("<< /Type /Catalog /Pages 2 0 R >>")},
$S:2}
A.nd.prototype={
$0(){return this.a.$1("<< /Type /Pages /Kids ["+this.b+"] /Count "+this.c.length+" >>")},
$S:2}
A.ne.prototype={
$0(){var s=this,r=s.d
return s.a.$1("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 "+s.b+" "+s.c+"] /Resources << /XObject << /Im0 "+(r+2)+" 0 R >> >> /Contents "+(r+1)+" 0 R >>")},
$S:2}
A.nf.prototype={
$0(){var s=this.b
this.a.$1("<< /Length "+s.length+" >>\nstream\n"+s+"\nendstream")},
$S:2}
A.ng.prototype={
$0(){var s,r,q,p,o=this,n=o.a,m=n.a
A:{if(1===m){s=B.oY
break A}if(4===m){s=B.p_
break A}s=B.oZ
break A}r=o.b
q=o.c
p=o.d
if(!(p<q.length))return A.a(q,p)
r.$1("<< /Type /XObject /Subtype /Image /Width "+n.c+" /Height "+n.b+" /ColorSpace "+s.a+" /BitsPerComponent 8 /Filter /DCTDecode"+s.b+" /Length "+q[p].length+" >>\nstream\n")
if(!(p<q.length))return A.a(q,p)
o.e.E(0,q[p])
r.$1("\nendstream")},
$S:2}
A.d5.prototype={}
A.nD.prototype={
$1(a){var s=this.a.$1((this.b+a)/this.c.length)
return s},
$S:20}
A.n_.prototype={
$1(a){return!1},
$S:16}
A.n6.prototype={
$2(a,b){var s=0,r=A.ek(t.p),q,p=this,o,n,m
var $async$$2=A.en(function(c,d){if(c===1)return A.eg(d,r)
for(;;)switch(s){case 0:s=3
return A.c8(A.k6(B.ad,t.q),$async$$2)
case 3:o=p.a
p.b.$1(0.4+0.55*(1-1/(++o.b+1)))
n=p.c
m=A.cb(A.jo(p.d,B.a.L(B.a.az(n*b),1,n)),p.e,a,!1)
n=m.length
if(n<=p.f)o.a=m
q=n
s=1
break
case 1:return A.eh(q,r)}})
return A.ei($async$$2,r)},
$S:47}
A.cx.prototype={}
A.mQ.prototype={
$1(a){return B.h.dT(B.a.D(a),2,"0")},
$S:48}
A.nF.prototype={
$1(a){t.it.a(a)
return A.nE(a.c,this.a,"")+"\n"},
$S:49}
A.nz.prototype={
$1(a){A.mS(A.jh(A.jh(a).data))},
$S:50}
A.mU.prototype={
$1(a){return A.jh(v.G.self).postMessage(a)},
$S:51}
A.mT.prototype={
$1(a){return this.a.$1({progress:a})},
$S:20};(function aliases(){var s=J.cq.prototype
s.j_=s.D
s=A.G.prototype
s.f9=s.a3})();(function installTearOffs(){var s=hunkHelpers._static_2,r=hunkHelpers._static_1,q=hunkHelpers._static_0,p=hunkHelpers.installInstanceTearOff,o=hunkHelpers._instance_1u,n=hunkHelpers._instance_2u,m=hunkHelpers.installStaticTearOff
s(J,"wt","tR",52)
r(A,"xg","vq",10)
r(A,"xh","vr",10)
r(A,"xi","vs",10)
q(A,"r_","x3",2)
p(A.a6.prototype,"gbR",1,0,null,["$1","$0"],["ag","h"],4,0,0)
p(A.bn.prototype,"gbR",1,0,null,["$1","$0"],["ag","h"],4,0,0)
p(A.bR.prototype,"gbR",1,0,null,["$1","$0"],["ag","h"],4,0,0)
p(A.b1.prototype,"gbR",1,0,null,["$1","$0"],["ag","h"],4,0,0)
p(A.bC.prototype,"gbR",1,0,null,["$1","$0"],["ag","h"],4,0,0)
p(A.bD.prototype,"gbR",1,0,null,["$1","$0"],["ag","h"],4,0,0)
p(A.bQ.prototype,"gbR",1,0,null,["$1","$0"],["ag","h"],4,0,0)
p(A.bP.prototype,"gbR",1,0,null,["$1","$0"],["ag","h"],4,0,0)
p(A.bE.prototype,"gbR",1,0,null,["$1","$0"],["ag","h"],4,0,0)
p(A.cN.prototype,"gbR",1,0,null,["$1","$0"],["ag","h"],4,0,0)
o(A.i9.prototype,"gk9","ka",26)
var l
p(l=A.ic.prototype,"gkb",0,3,null,["$3"],["kc"],6,0,0)
p(l,"gke",0,3,null,["$3"],["kf"],6,0,0)
p(l,"gkg",0,3,null,["$3"],["kh"],6,0,0)
p(l,"gk_",0,3,null,["$3"],["k0"],6,0,0)
p(l,"gk5",0,3,null,["$3"],["k6"],6,0,0)
r(A,"yu","uI",0)
r(A,"yn","uA",0)
r(A,"yl","uy",0)
r(A,"ys","uG",0)
r(A,"yt","uH",0)
r(A,"yr","uF",0)
r(A,"yq","uE",0)
r(A,"yp","uD",0)
r(A,"yw","uK",0)
r(A,"yv","uJ",0)
r(A,"yo","uB",0)
r(A,"ym","uz",0)
r(A,"yH","uV",0)
r(A,"yF","uT",0)
r(A,"yx","uL",0)
r(A,"yz","uN",0)
r(A,"yy","uM",0)
r(A,"yA","uO",0)
r(A,"yI","uW",0)
r(A,"yG","uU",0)
r(A,"yB","uP",0)
r(A,"yC","uQ",0)
r(A,"yD","uR",0)
r(A,"yE","uS",0)
n(A.fP.prototype,"glK","lL",18)
n(A.i5.prototype,"gnl","nm",18)
m(A,"oS",3,null,["$3"],["v_"],3,0)
m(A,"yJ",3,null,["$3"],["v0"],3,0)
m(A,"yO",3,null,["$3"],["v5"],3,0)
m(A,"yP",3,null,["$3"],["v6"],3,0)
m(A,"yQ",3,null,["$3"],["v7"],3,0)
m(A,"yR",3,null,["$3"],["v8"],3,0)
m(A,"yS",3,null,["$3"],["v9"],3,0)
m(A,"yT",3,null,["$3"],["va"],3,0)
m(A,"yU",3,null,["$3"],["vb"],3,0)
m(A,"yV",3,null,["$3"],["vc"],3,0)
m(A,"yK",3,null,["$3"],["v1"],3,0)
m(A,"yL",3,null,["$3"],["v2"],3,0)
m(A,"yM",3,null,["$3"],["v3"],3,0)
m(A,"yN",3,null,["$3"],["v4"],3,0)
m(A,"yY",5,null,["$5"],["vl"],7,0)
m(A,"yZ",6,null,["$6"],["vm"],9,0)
m(A,"z_",5,null,["$5"],["vn"],7,0)
m(A,"z0",6,null,["$6"],["vo"],9,0)
m(A,"yW",5,null,["$5"],["vj"],7,0)
m(A,"yX",6,null,["$6"],["vk"],9,0)})();(function inheritance(){var s=hunkHelpers.mixin,r=hunkHelpers.inherit,q=hunkHelpers.inheritMany
r(A.S,null)
q(A.S,[A.nY,J.hX,A.fD,J.ew,A.m7,A.f,A.ey,A.a3,A.G,A.la,A.cR,A.fY,A.fF,A.eE,A.aA,A.c0,A.ba,A.dF,A.c7,A.bW,A.ln,A.kK,A.eG,A.hb,A.ce,A.dY,A.kF,A.a1,A.at,A.fb,A.dT,A.h3,A.j0,A.iL,A.jd,A.m8,A.mB,A.bq,A.j6,A.jg,A.mw,A.j1,A.bh,A.df,A.aj,A.j2,A.jb,A.hi,A.j8,A.h1,A.h2,A.hB,A.ds,A.mE,A.hh,A.bA,A.m9,A.ij,A.fG,A.ma,A.bO,A.cr,A.au,A.je,A.fH,A.hF,A.hD,A.ke,A.eX,A.m2,A.jU,A.b9,A.mn,A.mv,A.kq,A.f0,A.fp,A.Y,A.b0,A.j5,A.hE,A.aR,A.a6,A.im,A.jR,A.aZ,A.jT,A.L,A.jW,A.hG,A.bN,A.hH,A.hI,A.hJ,A.eI,A.h8,A.eN,A.eO,A.ch,A.hR,A.hS,A.hy,A.ci,A.kA,A.kt,A.cp,A.i9,A.ec,A.j9,A.ia,A.ib,A.kB,A.ic,A.mm,A.kQ,A.fy,A.iu,A.jf,A.bG,A.e3,A.kY,A.d6,A.iy,A.iz,A.iC,A.iG,A.e4,A.d7,A.fB,A.b5,A.fJ,A.lg,A.iN,A.lm,A.iO,A.db,A.kI,A.lq,A.fN,A.lr,A.ls,A.lx,A.ly,A.lu,A.lv,A.fV,A.iZ,A.lS,A.c3,A.lt,A.iY,A.mq,A.lw,A.lU,A.lF,A.lQ,A.lT,A.fM,A.lR,A.lz,A.c1,A.fT,A.iX,A.fU,A.fW,A.lV,A.fP,A.lG,A.lH,A.lM,A.lO,A.mp,A.lK,A.iT,A.iU,A.lJ,A.fQ,A.lN,A.mr,A.j7,A.fR,A.lI,A.c6,A.iW,A.lW,A.cz,A.fX,A.hM,A.hN,A.eQ,A.eP,A.eR,A.hO,A.c4,A.cj,A.b4,A.ms,A.hT,A.ar,A.iH,A.ik,A.b7,A.jK,A.cg,A.e6,A.d5,A.cx])
q(J.hX,[J.f6,J.f8,J.f9,J.dU,J.dV,J.dS,J.co])
q(J.f9,[J.cq,J.p,A.cS,A.fk])
q(J.cq,[J.ir,J.dc,J.bS])
r(J.i7,A.fD)
r(J.ks,J.p)
q(J.dS,[J.f7,J.i8])
q(A.f,[A.cA,A.x,A.c5,A.bX,A.h0,A.j_,A.jc,A.dt,A.du,A.dv,A.dw,A.dx,A.dy,A.dA,A.dB,A.dC,A.dD,A.dE,A.bi,A.eB,A.ap,A.aq,A.cU,A.cV,A.cW,A.cX,A.cY,A.cZ,A.d_,A.d0,A.d1,A.d2,A.d3,A.d4,A.J])
q(A.cA,[A.cF,A.hj])
r(A.h_,A.cF)
r(A.fZ,A.hj)
r(A.ez,A.fZ)
q(A.a3,[A.dW,A.bZ,A.id,A.iQ,A.iJ,A.j4,A.hs,A.bg,A.fL,A.iP,A.e7,A.hz])
r(A.e8,A.G)
r(A.an,A.e8)
q(A.x,[A.b3,A.eD,A.fc,A.kG,A.fa])
q(A.b3,[A.fI,A.fe,A.fd])
r(A.dI,A.bX)
q(A.ba,[A.dj,A.dk])
q(A.dj,[A.bI,A.dl])
q(A.dk,[A.ed,A.h9])
q(A.dF,[A.eC,A.bm])
q(A.bW,[A.dG,A.ha])
q(A.dG,[A.cH,A.aQ])
r(A.fo,A.bZ)
q(A.ce,[A.hw,A.hx,A.iM,A.nv,A.nx,A.m4,A.m3,A.mH,A.mk,A.np,A.nq,A.jN,A.k1,A.kR,A.kU,A.nk,A.n7,A.n8,A.kp,A.ko,A.nl,A.k2,A.nj,A.ni,A.nD,A.n_,A.mQ,A.nF,A.nz,A.mU,A.mT])
q(A.iM,[A.iK,A.dr])
r(A.bo,A.dY)
r(A.cQ,A.bo)
q(A.hx,[A.nw,A.mI,A.na,A.ml,A.kH,A.kJ,A.kk,A.kl,A.km,A.nb,A.nh,A.n6])
q(A.fk,[A.ih,A.ak])
q(A.ak,[A.h4,A.h6])
r(A.h5,A.h4)
r(A.cs,A.h5)
r(A.h7,A.h6)
r(A.aT,A.h7)
q(A.cs,[A.ff,A.fg])
q(A.aT,[A.fh,A.fi,A.fj,A.fl,A.fm,A.fn,A.cT])
r(A.hc,A.j4)
q(A.hw,[A.m5,A.m6,A.mx,A.k7,A.mb,A.mg,A.mf,A.md,A.mc,A.mj,A.mi,A.mh,A.mu,A.n0,A.mD,A.mC,A.jQ,A.jO,A.jP,A.k0,A.jZ,A.k_,A.kb,A.k9,A.ka,A.kd,A.ki,A.kh,A.kg,A.ky,A.kx,A.kP,A.kN,A.kO,A.kS,A.kW,A.kX,A.kV,A.l0,A.l1,A.l_,A.l8,A.l6,A.l7,A.le,A.lf,A.ld,A.lk,A.li,A.lj,A.mK,A.mR,A.mX,A.mW,A.lL,A.mZ,A.m_,A.lY,A.lZ,A.nc,A.nd,A.ne,A.nf,A.ng])
r(A.ja,A.hi)
r(A.dh,A.ha)
q(A.hB,[A.mz,A.my,A.lp,A.iS])
r(A.hC,A.ds)
q(A.hC,[A.ie,A.iR])
r(A.kE,A.mz)
r(A.kD,A.my)
q(A.bg,[A.bV,A.hU])
q(A.m9,[A.eY,A.ee,A.eb,A.ex,A.jS,A.cG,A.av,A.eM,A.hu,A.ao,A.aK,A.dH,A.am,A.cJ,A.cI,A.bk,A.dK,A.ku,A.e1,A.fx,A.ct,A.it,A.cu,A.bp,A.aC,A.da,A.ae,A.b8,A.dd,A.ea,A.hP,A.k5,A.dR,A.hK,A.l9,A.bL,A.bl,A.C])
r(A.mG,A.m2)
r(A.hr,A.bO)
q(A.f0,[A.eZ,A.f_])
q(A.fp,[A.j3,A.il])
q(A.bi,[A.eA,A.dz])
r(A.hA,A.eB)
r(A.bM,A.b0)
q(A.a6,[A.bn,A.cM,A.bR,A.b1,A.bC,A.bD,A.bQ,A.bP,A.bE,A.cl,A.ck,A.cm,A.cN])
q(A.jT,[A.hv,A.jY,A.k8,A.kf,A.kw,A.kM,A.kT,A.kZ,A.l5,A.lc,A.lh,A.lX])
r(A.jV,A.hv)
r(A.hY,A.bN)
q(A.hY,[A.f2,A.i_,A.i0,A.i1,A.f3])
r(A.hZ,A.eI)
r(A.i2,A.eO)
q(A.jW,[A.kc,A.m1,A.kz,A.is,A.ll,A.m0])
r(A.hQ,A.aZ)
r(A.kj,A.m1)
q(A.ci,[A.cL,A.dJ])
r(A.i3,A.fy)
r(A.i4,A.iu)
r(A.cv,A.L)
q(A.bG,[A.iw,A.ix,A.iA,A.iB,A.iE,A.iF])
q(A.e3,[A.fA,A.iD])
q(A.iG,[A.e5,A.aB])
r(A.i5,A.fP)
r(A.i6,A.fX)
r(A.f4,A.c4)
q(A.aq,[A.dL,A.dM,A.eT,A.eU,A.eV,A.eW,A.dN,A.cO,A.dO,A.dP,A.dQ,A.cn])
q(A.b4,[A.fq,A.fr,A.fs,A.ft,A.fu,A.fv,A.fw,A.e0,A.aU])
r(A.ii,A.iH)
s(A.e8,A.c0)
s(A.hj,A.G)
s(A.h4,A.G)
s(A.h5,A.aA)
s(A.h6,A.G)
s(A.h7,A.aA)})()
var v={G:typeof self!="undefined"?self:globalThis,typeUniverse:{eC:new Map(),tR:{},eT:{},tPV:{},sEA:[]},mangledGlobalNames:{h:"int",D:"double",l:"num",M:"String",ah:"bool",au:"Null",q:"List",S:"Object",bT:"Map",a0:"JSObject"},mangledNames:{},types:["~(ar)","ap?()","~()","h(h,bH,h)","h([h])","L?()","~(cp,cP,h)","~(af,h,h,h,af)","h(h)","~(h,h,h,h,h,af)","~(~())","au(@)","au()","@()","~(M,aR)","~(h,h,h)","ah(M)","f1()","~(h,ah)","hL()","~(D)","ap()","bH(h)","au(S,cw)","ch?()","h()","~(h)","~(@,@)","~(af)","~(S?,S?)","db?()","af()","fK()","@(M)","@(@,M)","ah(h)","~(h,a6)","~(@)","h(h,h)","c4?()","l(l,l,l,l)","l(l,l,l,l,l)","ah(ap)","ah(C)","~(M)","~(h,~())","au(@,cw)","bB<h>(h,D)","M(h)","M(cx)","au(a0)","~(a0)","h(@,@)","aZ?()","@(@)","~(l,l,l,l)","au(~())","~(h,@)"],interceptorsByTag:null,leafTags:null,arrayRti:Symbol("$ti"),rttc:{"2;":(a,b)=>c=>c instanceof A.bI&&a.b(c.a)&&b.b(c.b),"2;extension,stem":(a,b)=>c=>c instanceof A.dl&&a.b(c.a)&&b.b(c.b),"3;bytes,quality,scale":(a,b,c)=>d=>d instanceof A.ed&&a.b(d.a)&&b.b(d.b)&&c.b(d.c),"3;components,height,width":(a,b,c)=>d=>d instanceof A.h9&&a.b(d.a)&&b.b(d.b)&&c.b(d.c)}}
A.vK(v.typeUniverse,JSON.parse('{"bS":"cq","ir":"cq","dc":"cq","z9":"cS","p":{"q":["1"],"x":["1"],"a0":[],"f":["1"],"as":["1"]},"f6":{"ah":[],"U":[]},"f8":{"U":[]},"f9":{"a0":[]},"cq":{"a0":[]},"i7":{"fD":[]},"ks":{"p":["1"],"q":["1"],"x":["1"],"a0":[],"f":["1"],"as":["1"]},"ew":{"z":["1"]},"dS":{"D":[],"l":[],"bj":["l"]},"f7":{"D":[],"h":[],"l":[],"bj":["l"],"U":[]},"i8":{"D":[],"l":[],"bj":["l"],"U":[]},"co":{"M":[],"bj":["M"],"kL":[],"as":["@"],"U":[]},"cA":{"f":["2"]},"ey":{"z":["2"]},"cF":{"cA":["1","2"],"f":["2"],"f.E":"2"},"h_":{"cF":["1","2"],"cA":["1","2"],"x":["2"],"f":["2"],"f.E":"2"},"fZ":{"G":["2"],"q":["2"],"cA":["1","2"],"x":["2"],"f":["2"]},"ez":{"fZ":["1","2"],"G":["2"],"q":["2"],"cA":["1","2"],"x":["2"],"f":["2"],"G.E":"2","f.E":"2"},"dW":{"a3":[]},"an":{"G":["h"],"c0":["h"],"q":["h"],"x":["h"],"f":["h"],"G.E":"h","c0.E":"h"},"x":{"f":["1"]},"b3":{"x":["1"],"f":["1"]},"fI":{"b3":["1"],"x":["1"],"f":["1"],"f.E":"1","b3.E":"1"},"cR":{"z":["1"]},"fe":{"b3":["2"],"x":["2"],"f":["2"],"f.E":"2","b3.E":"2"},"c5":{"f":["1"],"f.E":"1"},"fY":{"z":["1"]},"bX":{"f":["1"],"f.E":"1"},"dI":{"bX":["1"],"x":["1"],"f":["1"],"f.E":"1"},"fF":{"z":["1"]},"eD":{"x":["1"],"f":["1"],"f.E":"1"},"eE":{"z":["1"]},"e8":{"G":["1"],"c0":["1"],"q":["1"],"x":["1"],"f":["1"]},"bI":{"dj":[],"ba":[]},"dl":{"dj":[],"ba":[]},"ed":{"dk":[],"ba":[]},"h9":{"dk":[],"ba":[]},"dF":{"bT":["1","2"]},"eC":{"dF":["1","2"],"bT":["1","2"]},"h0":{"f":["1"],"f.E":"1"},"c7":{"z":["1"]},"bm":{"dF":["1","2"],"bT":["1","2"]},"dG":{"bW":["1"],"fE":["1"],"x":["1"],"f":["1"]},"cH":{"dG":["1"],"bW":["1"],"fE":["1"],"x":["1"],"f":["1"]},"aQ":{"dG":["1"],"bW":["1"],"fE":["1"],"x":["1"],"f":["1"]},"fo":{"bZ":[],"a3":[]},"id":{"a3":[]},"iQ":{"a3":[]},"hb":{"cw":[]},"ce":{"cK":[]},"hw":{"cK":[]},"hx":{"cK":[]},"iM":{"cK":[]},"iK":{"cK":[]},"dr":{"cK":[]},"iJ":{"a3":[]},"bo":{"dY":["1","2"],"o_":["1","2"],"bT":["1","2"]},"fc":{"x":["1"],"f":["1"],"f.E":"1"},"a1":{"z":["1"]},"kG":{"x":["1"],"f":["1"],"f.E":"1"},"at":{"z":["1"]},"fa":{"x":["cr<1,2>"],"f":["cr<1,2>"],"f.E":"cr<1,2>"},"fb":{"z":["cr<1,2>"]},"cQ":{"bo":["1","2"],"dY":["1","2"],"o_":["1","2"],"bT":["1","2"]},"dj":{"ba":[]},"dk":{"ba":[]},"dT":{"uo":[],"kL":[]},"h3":{"fC":[],"dZ":[]},"j_":{"f":["fC"],"f.E":"fC"},"j0":{"z":["fC"]},"iL":{"dZ":[]},"jc":{"f":["dZ"],"f.E":"dZ"},"jd":{"z":["dZ"]},"cT":{"aT":[],"af":[],"G":["h"],"ak":["h"],"q":["h"],"aS":["h"],"x":["h"],"a0":[],"a5":[],"as":["h"],"f":["h"],"aA":["h"],"U":[],"G.E":"h"},"cS":{"a0":[],"U":[]},"fk":{"a0":[],"a5":[]},"ih":{"a0":[],"a5":[],"U":[]},"ak":{"aS":["1"],"a0":[],"a5":[],"as":["1"]},"cs":{"G":["D"],"ak":["D"],"q":["D"],"aS":["D"],"x":["D"],"a0":[],"a5":[],"as":["D"],"f":["D"],"aA":["D"]},"aT":{"G":["h"],"ak":["h"],"q":["h"],"aS":["h"],"x":["h"],"a0":[],"a5":[],"as":["h"],"f":["h"],"aA":["h"]},"ff":{"cs":[],"k3":[],"G":["D"],"ak":["D"],"q":["D"],"aS":["D"],"x":["D"],"a0":[],"a5":[],"as":["D"],"f":["D"],"aA":["D"],"U":[],"G.E":"D"},"fg":{"cs":[],"hL":[],"G":["D"],"ak":["D"],"q":["D"],"aS":["D"],"x":["D"],"a0":[],"a5":[],"as":["D"],"f":["D"],"aA":["D"],"U":[],"G.E":"D"},"fh":{"aT":[],"cP":[],"G":["h"],"ak":["h"],"q":["h"],"aS":["h"],"x":["h"],"a0":[],"a5":[],"as":["h"],"f":["h"],"aA":["h"],"U":[],"G.E":"h"},"fi":{"aT":[],"f1":[],"G":["h"],"ak":["h"],"q":["h"],"aS":["h"],"x":["h"],"a0":[],"a5":[],"as":["h"],"f":["h"],"aA":["h"],"U":[],"G.E":"h"},"fj":{"aT":[],"nV":[],"G":["h"],"ak":["h"],"q":["h"],"aS":["h"],"x":["h"],"a0":[],"a5":[],"as":["h"],"f":["h"],"aA":["h"],"U":[],"G.E":"h"},"fl":{"aT":[],"fK":[],"G":["h"],"ak":["h"],"q":["h"],"aS":["h"],"x":["h"],"a0":[],"a5":[],"as":["h"],"f":["h"],"aA":["h"],"U":[],"G.E":"h"},"fm":{"aT":[],"bH":[],"G":["h"],"ak":["h"],"q":["h"],"aS":["h"],"x":["h"],"a0":[],"a5":[],"as":["h"],"f":["h"],"aA":["h"],"U":[],"G.E":"h"},"fn":{"aT":[],"G":["h"],"ak":["h"],"q":["h"],"aS":["h"],"x":["h"],"a0":[],"a5":[],"as":["h"],"f":["h"],"aA":["h"],"U":[],"G.E":"h"},"j4":{"a3":[]},"hc":{"bZ":[],"a3":[]},"bh":{"a3":[]},"aj":{"bB":["1"]},"hi":{"qj":[]},"ja":{"hi":[],"qj":[]},"dh":{"bW":["1"],"fE":["1"],"x":["1"],"f":["1"]},"h1":{"z":["1"]},"G":{"q":["1"],"x":["1"],"f":["1"]},"dY":{"bT":["1","2"]},"fd":{"ul":["1"],"b3":["1"],"x":["1"],"f":["1"],"f.E":"1","b3.E":"1"},"h2":{"z":["1"]},"bW":{"fE":["1"],"x":["1"],"f":["1"]},"ha":{"bW":["1"],"fE":["1"],"x":["1"],"f":["1"]},"hC":{"ds":["M","q<h>"]},"ie":{"ds":["M","q<h>"]},"iR":{"ds":["M","q<h>"]},"D":{"l":[],"bj":["l"]},"bA":{"bj":["bA"]},"h":{"l":[],"bj":["l"]},"q":{"x":["1"],"f":["1"]},"l":{"bj":["l"]},"fC":{"dZ":[]},"M":{"bj":["M"],"kL":[]},"hs":{"a3":[]},"bZ":{"a3":[]},"bg":{"a3":[]},"bV":{"a3":[]},"hU":{"bV":[],"a3":[]},"fL":{"a3":[]},"iP":{"a3":[]},"e7":{"a3":[]},"hz":{"a3":[]},"ij":{"a3":[]},"fG":{"a3":[]},"je":{"cw":[]},"tj":{"a5":[]},"nV":{"q":["h"],"x":["h"],"a5":[],"f":["h"]},"af":{"q":["h"],"x":["h"],"a5":[],"f":["h"]},"uu":{"q":["h"],"x":["h"],"a5":[],"f":["h"]},"cP":{"q":["h"],"x":["h"],"a5":[],"f":["h"]},"fK":{"q":["h"],"x":["h"],"a5":[],"f":["h"]},"f1":{"q":["h"],"x":["h"],"a5":[],"f":["h"]},"bH":{"q":["h"],"x":["h"],"a5":[],"f":["h"]},"k3":{"q":["D"],"x":["D"],"a5":[],"f":["D"]},"hL":{"q":["D"],"x":["D"],"a5":[],"f":["D"]},"eX":{"tl":[]},"eZ":{"f0":[]},"j3":{"fp":[]},"f_":{"f0":[]},"il":{"fp":[]},"Y":{"z":["l"]},"dt":{"y":[],"f":["l"],"f.E":"l"},"du":{"y":[],"f":["l"],"f.E":"l"},"dv":{"y":[],"f":["l"],"f.E":"l"},"dw":{"y":[],"f":["l"],"f.E":"l"},"dx":{"y":[],"f":["l"],"f.E":"l"},"dy":{"y":[],"f":["l"],"f.E":"l"},"dA":{"y":[],"f":["l"],"f.E":"l"},"dB":{"y":[],"f":["l"],"f.E":"l"},"dC":{"y":[],"f":["l"],"f.E":"l"},"dD":{"y":[],"f":["l"],"f.E":"l"},"dE":{"y":[],"f":["l"],"f.E":"l"},"bi":{"y":[],"f":["l"],"f.E":"l"},"eA":{"y":[],"f":["l"],"f.E":"l"},"dz":{"y":[],"f":["l"],"f.E":"l"},"eB":{"y":[],"f":["l"],"f.E":"l"},"hA":{"y":[],"f":["l"],"f.E":"l"},"bM":{"b0":[]},"bn":{"a6":[]},"cM":{"a6":[]},"bR":{"a6":[]},"b1":{"a6":[]},"bC":{"a6":[]},"bD":{"a6":[]},"bQ":{"a6":[]},"bP":{"a6":[]},"bE":{"a6":[]},"cl":{"a6":[]},"ck":{"a6":[]},"cm":{"a6":[]},"cN":{"a6":[]},"aZ":{"L":[]},"f2":{"bN":[]},"hY":{"bN":[]},"hJ":{"L":[]},"hZ":{"eI":[]},"i_":{"bN":[]},"i0":{"bN":[]},"i1":{"bN":[]},"f3":{"bN":[]},"i2":{"eO":[]},"ch":{"L":[]},"hR":{"L":[]},"hQ":{"aZ":[],"L":[]},"cL":{"ci":[]},"dJ":{"ci":[]},"ib":{"L":[]},"i3":{"fy":[]},"iu":{"L":[]},"i4":{"L":[]},"cv":{"L":[]},"iw":{"bG":[]},"ix":{"bG":[]},"iA":{"bG":[]},"iB":{"bG":[]},"iE":{"bG":[]},"iF":{"bG":[]},"fA":{"e3":[]},"iD":{"e3":[]},"iy":{"L":[]},"e4":{"L":[]},"d7":{"L":[]},"fB":{"L":[]},"fJ":{"L":[]},"db":{"L":[]},"i6":{"fX":[]},"c4":{"L":[]},"f4":{"c4":[],"L":[]},"ap":{"f":["u"],"f.E":"u"},"aq":{"f":["u"]},"dL":{"aq":[],"f":["u"],"f.E":"u"},"dM":{"aq":[],"f":["u"],"f.E":"u"},"eT":{"aq":[],"f":["u"],"f.E":"u"},"eU":{"aq":[],"f":["u"],"f.E":"u"},"eV":{"aq":[],"f":["u"],"f.E":"u"},"eW":{"aq":[],"f":["u"],"f.E":"u"},"dN":{"aq":[],"f":["u"],"f.E":"u"},"cO":{"aq":[],"f":["u"],"f.E":"u"},"dO":{"aq":[],"f":["u"],"f.E":"u"},"dP":{"aq":[],"f":["u"],"f.E":"u"},"dQ":{"aq":[],"f":["u"],"f.E":"u"},"cn":{"aq":[],"f":["u"],"f.E":"u"},"fq":{"b4":[]},"fr":{"b4":[]},"fs":{"b4":[]},"ft":{"b4":[]},"fu":{"b4":[]},"fv":{"b4":[]},"fw":{"b4":[]},"e0":{"b4":[]},"aU":{"b4":[]},"cU":{"u":[],"y":[],"f":["l"],"z":["u"],"f.E":"l"},"cV":{"u":[],"y":[],"f":["l"],"z":["u"],"f.E":"l"},"cW":{"u":[],"y":[],"f":["l"],"z":["u"],"f.E":"l"},"cX":{"u":[],"y":[],"f":["l"],"z":["u"],"f.E":"l"},"cY":{"u":[],"y":[],"f":["l"],"z":["u"],"f.E":"l"},"cZ":{"u":[],"y":[],"f":["l"],"z":["u"],"f.E":"l"},"d_":{"u":[],"y":[],"f":["l"],"z":["u"],"f.E":"l"},"d0":{"u":[],"y":[],"f":["l"],"z":["u"],"f.E":"l"},"d1":{"u":[],"y":[],"f":["l"],"z":["u"],"f.E":"l"},"d2":{"u":[],"y":[],"f":["l"],"z":["u"],"f.E":"l"},"d3":{"u":[],"y":[],"f":["l"],"z":["u"],"f.E":"l"},"d4":{"u":[],"y":[],"f":["l"],"z":["u"],"f.E":"l"},"J":{"u":[],"y":[],"f":["l"],"z":["u"],"f.E":"l"},"ii":{"iH":[]},"u":{"y":[],"z":["u"],"f":["l"]}}'))
A.vJ(v.typeUniverse,JSON.parse('{"e8":1,"hj":2,"ak":1,"ha":1,"hB":2,"iG":1}'))
var u={c:"Error handler must accept one Object or one Object and a StackTrace as arguments, and return a value of the returned future's type"}
var t=(function rtii(){var s=A.X
return{u:s("bh"),aO:s("ex"),G:s("y"),bP:s("bj<@>"),O:s("cH<M>"),jS:s("bA"),Y:s("x<@>"),e:s("a3"),iW:s("hG"),oD:s("cJ"),ho:s("hI"),h7:s("C"),pk:s("k3"),Z:s("cK"),A:s("aQ<C>"),co:s("eP"),a6:s("hM"),lq:s("hN"),lJ:s("eQ"),aw:s("hS"),P:s("aR"),r:s("a6"),mo:s("ap"),w:s("aq"),iI:s("cO"),m6:s("cP"),bW:s("f1"),id:s("f<D>"),e7:s("f<@>"),fm:s("f<h>"),an:s("p<hy>"),a_:s("p<hH>"),lv:s("p<eI>"),eC:s("p<C>"),lM:s("p<eO>"),nK:s("p<eP>"),g:s("p<ap>"),kG:s("p<a0>"),ns:s("p<cp>"),hc:s("p<q<q<q<h>>>>"),o:s("p<q<q<h>>>"),hg:s("p<q<af>>"),x:s("p<q<D>>"),S:s("p<q<h>>"),U:s("p<q<l>>"),fi:s("p<fy>"),Q:s("p<d5>"),mS:s("p<d6>"),na:s("p<bG>"),k9:s("p<iC>"),lf:s("p<b7>"),p5:s("p<+components,height,width(h,h,h)>"),s:s("p<M>"),nh:s("p<cx>"),fZ:s("p<iO>"),gF:s("p<bH>"),h:s("p<af>"),by:s("p<c1>"),l3:s("p<fQ>"),cy:s("p<fR>"),ip:s("p<iW>"),iu:s("p<cz>"),J:s("p<fX>"),cF:s("p<c6>"),n0:s("p<j5>"),bm:s("p<j7>"),kv:s("p<ec>"),n:s("p<D>"),dG:s("p<@>"),t:s("p<h>"),gU:s("p<ia?>"),dM:s("p<S?>"),mD:s("p<bH?>"),a:s("p<l>"),B:s("p<~(ar)>"),iy:s("as<@>"),v:s("f8"),m:s("a0"),dY:s("bS"),dX:s("aS<@>"),fg:s("cp"),p8:s("fd<M>"),aL:s("q<ap>"),lh:s("q<a0>"),mL:s("q<q<c1>>"),f:s("q<q<h>>"),g5:s("q<d5>"),cf:s("q<d6>"),k:s("q<b7>"),ac:s("q<fM>"),jz:s("q<c1>"),o6:s("q<fQ>"),jt:s("q<fT>"),as:s("q<fU>"),f4:s("q<fW>"),bd:s("q<D>"),j:s("q<@>"),L:s("q<h>"),hQ:s("q<ci?>"),bi:s("q<af?>"),a3:s("q<h8?>"),dW:s("q<h?>"),je:s("bT<M,M>"),dQ:s("cs"),aj:s("aT"),dO:s("ak<@>"),hD:s("cT"),b:s("au"),K:s("S"),mK:s("u"),dS:s("d6"),ok:s("iz"),dw:s("fA"),mi:s("e3"),fF:s("e4"),gH:s("d7"),b0:s("bV"),i:s("b7"),lZ:s("zb"),aK:s("+()"),lu:s("fC"),l:s("cw"),N:s("M"),it:s("cx"),e8:s("iN"),aJ:s("U"),do:s("bZ"),mC:s("bH"),D:s("af"),cx:s("dc"),e5:s("fM"),nC:s("c1"),d:s("fR"),f_:s("fT"),h2:s("fU"),gL:s("iZ"),ij:s("fW"),cm:s("c5<C>"),nn:s("c5<M>"),fT:s("c5<h>"),c:s("aj<@>"),nA:s("h8"),y:s("ah"),eL:s("ah(C)"),nU:s("ah(S)"),gS:s("ah(M)"),gw:s("ah(h)"),V:s("D"),z:s("@"),mY:s("@()"),R:s("@(S)"),C:s("@(S,cw)"),p:s("h"),bL:s("aZ?"),_:s("L?"),gK:s("bB<au>?"),bT:s("ch?"),er:s("ci?"),H:s("ap?"),jH:s("cP?"),mU:s("a0?"),T:s("q<h>?"),iM:s("q<ci?>?"),gy:s("q<h?>?"),lG:s("bT<M,M>?"),iD:s("S?"),bO:s("+bytes,quality,scale(h,h,D)?"),jv:s("M?"),in:s("db?"),eP:s("af?"),nX:s("fN?"),nk:s("iX?"),f7:s("c4?"),F:s("df<@,@>?"),W:s("j8?"),fU:s("ah?"),jX:s("D?"),I:s("h?"),jh:s("l?"),bZ:s("~(h)?"),ec:s("~(h,ah)?"),X:s("l"),q:s("~"),M:s("~()"),E:s("~(cp,cP,h)"),kX:s("~(h,ah)"),jO:s("~(l,l,l,l)")}})();(function constants(){var s=hunkHelpers.makeConstList
B.f0=J.hX.prototype
B.c=J.p.prototype
B.f3=J.f6.prototype
B.a=J.f7.prototype
B.b=J.dS.prototype
B.h=J.co.prototype
B.f4=J.bS.prototype
B.f5=J.f9.prototype
B.a1=A.ff.prototype
B.x=A.fg.prototype
B.y=A.fh.prototype
B.t=A.fi.prototype
B.O=A.fj.prototype
B.v=A.fl.prototype
B.q=A.fm.prototype
B.d=A.cT.prototype
B.dG=J.ir.prototype
B.bV=J.dc.prototype
B.bY=new A.hu(0,"direct")
B.dX=new A.hu(1,"alpha")
B.bZ=new A.am(0,"none")
B.be=new A.am(3,"bitfields")
B.bf=new A.am(6,"alphaBitfields")
B.ac=new A.ex(0,"littleEndian")
B.au=new A.ex(1,"bigEndian")
B.e8=new A.jK()
B.e9=new A.eE(A.X("eE<0&>"))
B.ea=new A.hD()
B.c_=new A.hD()
B.c0=function getTagFallback(o) {
  var s = Object.prototype.toString.call(o);
  return s.substring(8, s.length - 1);
}
B.eb=function() {
  var toStringFunction = Object.prototype.toString;
  function getTag(o) {
    var s = toStringFunction.call(o);
    return s.substring(8, s.length - 1);
  }
  function getUnknownTag(object, tag) {
    if (/^HTML[A-Z].*Element$/.test(tag)) {
      var name = toStringFunction.call(object);
      if (name == "[object Object]") return null;
      return "HTMLElement";
    }
  }
  function getUnknownTagGenericBrowser(object, tag) {
    if (object instanceof HTMLElement) return "HTMLElement";
    return getUnknownTag(object, tag);
  }
  function prototypeForTag(tag) {
    if (typeof window == "undefined") return null;
    if (typeof window[tag] == "undefined") return null;
    var constructor = window[tag];
    if (typeof constructor != "function") return null;
    return constructor.prototype;
  }
  function discriminator(tag) { return null; }
  var isBrowser = typeof HTMLElement == "function";
  return {
    getTag: getTag,
    getUnknownTag: isBrowser ? getUnknownTagGenericBrowser : getUnknownTag,
    prototypeForTag: prototypeForTag,
    discriminator: discriminator };
}
B.eg=function(getTagFallback) {
  return function(hooks) {
    if (typeof navigator != "object") return hooks;
    var userAgent = navigator.userAgent;
    if (typeof userAgent != "string") return hooks;
    if (userAgent.indexOf("DumpRenderTree") >= 0) return hooks;
    if (userAgent.indexOf("Chrome") >= 0) {
      function confirm(p) {
        return typeof window == "object" && window[p] && window[p].name == p;
      }
      if (confirm("Window") && confirm("HTMLElement")) return hooks;
    }
    hooks.getTag = getTagFallback;
  };
}
B.ec=function(hooks) {
  if (typeof dartExperimentalFixupGetTag != "function") return hooks;
  hooks.getTag = dartExperimentalFixupGetTag(hooks.getTag);
}
B.ef=function(hooks) {
  if (typeof navigator != "object") return hooks;
  var userAgent = navigator.userAgent;
  if (typeof userAgent != "string") return hooks;
  if (userAgent.indexOf("Firefox") == -1) return hooks;
  var getTag = hooks.getTag;
  var quickMap = {
    "BeforeUnloadEvent": "Event",
    "DataTransfer": "Clipboard",
    "GeoGeolocation": "Geolocation",
    "Location": "!Location",
    "WorkerMessageEvent": "MessageEvent",
    "XMLDocument": "!Document"};
  function getTagFirefox(o) {
    var tag = getTag(o);
    return quickMap[tag] || tag;
  }
  hooks.getTag = getTagFirefox;
}
B.ee=function(hooks) {
  if (typeof navigator != "object") return hooks;
  var userAgent = navigator.userAgent;
  if (typeof userAgent != "string") return hooks;
  if (userAgent.indexOf("Trident/") == -1) return hooks;
  var getTag = hooks.getTag;
  var quickMap = {
    "BeforeUnloadEvent": "Event",
    "DataTransfer": "Clipboard",
    "HTMLDDElement": "HTMLElement",
    "HTMLDTElement": "HTMLElement",
    "HTMLPhraseElement": "HTMLElement",
    "Position": "Geoposition"
  };
  function getTagIE(o) {
    var tag = getTag(o);
    var newTag = quickMap[tag];
    if (newTag) return newTag;
    if (tag == "Object") {
      if (window.DataView && (o instanceof window.DataView)) return "DataView";
    }
    return tag;
  }
  function prototypeForTagIE(tag) {
    var constructor = window[tag];
    if (constructor == null) return null;
    return constructor.prototype;
  }
  hooks.getTag = getTagIE;
  hooks.prototypeForTag = prototypeForTagIE;
}
B.ed=function(hooks) {
  var getTag = hooks.getTag;
  var prototypeForTag = hooks.prototypeForTag;
  function getTagFixed(o) {
    var tag = getTag(o);
    if (tag == "Document") {
      if (!!o.xmlVersion) return "!Document";
      return "!HTMLDocument";
    }
    return tag;
  }
  function prototypeForTagFixed(tag) {
    if (tag == "Document") return null;
    return prototypeForTag(tag);
  }
  hooks.getTag = getTagFixed;
  hooks.prototypeForTag = prototypeForTagFixed;
}
B.c1=function(hooks) { return hooks; }

B.c2=new A.ie()
B.bg=new A.kE()
B.eh=new A.ij()
B.av=new A.la()
B.bh=new A.iR()
B.ei=new A.lp()
B.ej=new A.j9()
B.U=new A.ja()
B.ek=new A.je()
B.c3=new A.jf()
B.c4=new A.mG()
B.el=new A.cG(0,"rgba")
B.c5=new A.cG(1,"bgra")
B.em=new A.cG(2,"abgr")
B.c6=new A.cG(3,"argb")
B.en=new A.cG(5,"bgr")
B.c7=new A.jS(4,"luminance")
B.eo=new A.hA(4294967295)
B.bi=new A.aK(0,"none")
B.c8=new A.aK(1,"floydSteinberg")
B.ev=new A.aK(8,"bayer4x4")
B.c9=new A.dH(0,"raster")
B.ex=new A.dH(1,"serpentine")
B.ey=new A.dH(2,"zigzag")
B.ez=new A.dH(3,"hilbert")
B.ad=new A.bA(0)
B.eA=new A.cg('"Crop" needs a crop area.')
B.eB=new A.cg('"Shift timing" needs how far to shift.')
B.eC=new A.cg("This file has no subtitles in it.")
B.r=new A.bL(0,"vips")
B.o=new A.bL(1,"ffmpeg")
B.F=new A.bL(2,"qpdf")
B.ca=new A.bL(3,"pdfium")
B.aw=new A.bL(4,"libarchive")
B.aK=new A.bL(5,"document")
B.aL=new A.bL(6,"builtIn")
B.eD=new A.cI(0,"red")
B.eE=new A.cI(1,"green")
B.eF=new A.cI(2,"blue")
B.eG=new A.cI(3,"alpha")
B.eH=new A.cI(4,"other")
B.cb=new A.cJ(1,"half")
B.cc=new A.cJ(2,"float")
B.cd=new A.bk(0,"none")
B.J=new A.bl(0,"image")
B.a4=new A.bl(1,"video")
B.V=new A.bl(2,"audio")
B.W=new A.bl(4,"document")
B.ax=new A.bl(5,"subtitle")
B.a5=new A.bl(6,"archive")
B.ae=new A.C(B.J,"tiff","image/tiff",7,"tiff")
B.a6=new A.C(B.V,"m4a","audio/mp4",17,"m4a")
B.bj=new A.C(B.V,"flac","audio/flac",20,"flac")
B.eQ=new A.bl(3,"pdf")
B.P=new A.C(B.eQ,"pdf","application/pdf",23,"pdf")
B.eS=new A.bl(8,"unknown")
B.bk=new A.C(B.eS,"","application/octet-stream",40,"unknown")
B.bl=new A.C(B.W,"txt","text/plain",24,"txt")
B.G=new A.C(B.J,"jpg","image/jpeg",0,"jpg")
B.aM=new A.C(B.J,"bmp","image/bmp",6,"bmp")
B.ce=new A.C(B.a4,"avi","video/x-msvideo",14,"avi")
B.aN=new A.C(B.a4,"mp4","video/mp4",10,"mp4")
B.bm=new A.C(B.a5,"tar.gz","application/gzip",36,"tarGz")
B.bn=new A.C(B.J,"svg","image/svg+xml",8,"svg")
B.cg=new A.C(B.V,"ogg","audio/ogg",21,"ogg")
B.bo=new A.C(B.a5,"7z","application/x-7z-compressed",37,"sevenZip")
B.ch=new A.C(B.a4,"3gp","video/3gpp",15,"threeGp")
B.a7=new A.C(B.J,"png","image/png",1,"png")
B.aO=new A.C(B.J,"avif","image/avif",4,"avif")
B.ci=new A.C(B.a5,"rar","application/vnd.rar",38,"rar")
B.bp=new A.C(B.W,"pptx","application/vnd.openxmlformats-officedocument.presentationml.presentation",29,"pptx")
B.X=new A.C(B.J,"gif","image/gif",5,"gif")
B.aP=new A.C(B.ax,"vtt","text/vtt",32,"vtt")
B.cj=new A.C(B.W,"odt","application/vnd.oasis.opendocument.text",28,"odt")
B.bq=new A.C(B.V,"wav","audio/wav",19,"wav")
B.br=new A.C(B.a4,"webm","video/webm",13,"webm")
B.ay=new A.C(B.V,"mp3","audio/mpeg",16,"mp3")
B.ck=new A.C(B.a4,"mkv","video/x-matroska",12,"mkv")
B.bs=new A.C(B.a4,"mov","video/quicktime",11,"mov")
B.cl=new A.C(B.a5,"gz","application/gzip",35,"gz")
B.bt=new A.C(B.ax,"srt","application/x-subrip",31,"srt")
B.bu=new A.C(B.V,"opus","audio/opus",22,"opus")
B.a8=new A.C(B.J,"ico","image/x-icon",9,"ico")
B.aQ=new A.C(B.W,"html","text/html",26,"html")
B.Q=new A.C(B.J,"webp","image/webp",2,"webp")
B.az=new A.C(B.J,"heic","image/heic",3,"heic")
B.bv=new A.C(B.W,"xlsx","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",30,"xlsx")
B.cm=new A.C(B.V,"aac","audio/aac",18,"aac")
B.aA=new A.C(B.W,"docx","application/vnd.openxmlformats-officedocument.wordprocessingml.document",27,"docx")
B.aR=new A.C(B.W,"md","text/markdown",25,"markdown")
B.aB=new A.C(B.a5,"zip","application/zip",33,"zip")
B.cn=new A.C(B.a5,"tar","application/x-tar",34,"tar")
B.eT=new A.hK(0,"horizontal")
B.eU=new A.hK(2,"both")
B.eV=new A.bO("Invalid Huffman code length",null,null)
B.eW=new A.bO("Incomplete Huffman table",null,null)
B.eX=new A.bO("Oversubscribed Huffman table",null,null)
B.a9=new A.eM(0,"uint")
B.bw=new A.eM(1,"int")
B.bx=new A.eM(2,"float")
B.L=new A.av(0,"uint1")
B.R=new A.av(1,"uint2")
B.Y=new A.av(10,"float32")
B.aa=new A.av(11,"float64")
B.S=new A.av(2,"uint4")
B.e=new A.av(3,"uint8")
B.u=new A.av(4,"uint16")
B.ab=new A.av(5,"uint32")
B.af=new A.av(6,"int8")
B.ag=new A.av(7,"int16")
B.ah=new A.av(8,"int32")
B.T=new A.av(9,"float16")
B.l=new A.k5(2,"sequence")
B.ai=new A.hP(0,"none")
B.by=new A.hP(1,"deflate")
B.co=new A.dK(2,"cur")
B.f=new A.ao(0,"none")
B.cp=new A.ao(1,"byte")
B.cq=new A.ao(10,"sRational")
B.cr=new A.ao(11,"single")
B.cs=new A.ao(12,"double")
B.ct=new A.ao(13,"ifd")
B.m=new A.ao(2,"ascii")
B.k=new A.ao(3,"short")
B.z=new A.ao(4,"long")
B.E=new A.ao(5,"rational")
B.cu=new A.ao(6,"sByte")
B.Z=new A.ao(7,"undefined")
B.cv=new A.ao(8,"sShort")
B.cw=new A.ao(9,"sLong")
B.bz=new A.eY(0,"gzip")
B.aj=new A.eY(1,"zlib")
B.f_=new A.eY(2,"raw")
B.aC=new A.dR(0,"nearest")
B.f1=new A.dR(1,"linear")
B.f2=new A.dR(2,"cubic")
B.bA=new A.dR(3,"average")
B.cx=new A.ku(0,"yuv444")
B.f6=new A.kD(!1)
B.f7=s([0],t.t)
B.fc=s([0,0,1,0],t.t)
B.aS=s([0,16,512,528],t.t)
B.fd=s([0,1,2,3],t.t)
B.ak=s([0,2,8],t.t)
B.fe=s([0,4,2,1],t.t)
B.ff=s([0,8,10],t.t)
B.eY=new A.dK(0,"invalid")
B.eZ=new A.dK(1,"ico")
B.fh=s([B.eY,B.eZ,B.co],A.X("p<dK>"))
B.aT=s([1024,1040,1280,1296],t.t)
B.cz=s([180,157,141,134,130],t.t)
B.cA=s([173,148,140],t.t)
B.cB=s([176,155,140,135],t.t)
B.bC=s([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],t.t)
B.fD=s([239,187,191],t.t)
B.cC=s([252,243,207,63],t.t)
B.cD=s([254,255],t.t)
B.fE=s([255,216,255],t.t)
B.cE=s([255,254],t.t)
B.fF=s([26,69,223,163],t.t)
B.oL=new A.e1(0,"none")
B.oM=new A.e1(1,"background")
B.oN=new A.e1(2,"previous")
B.cF=s([B.oL,B.oM,B.oN],A.X("p<e1>"))
B.aU=s([292,260,226,226],t.t)
B.cG=s([0,0,2,1,3,3,2,4,3,5,5,4,4,0,0,1,125],t.t)
B.fI=s([0,1,2,3,4,5,6,7,8,10,12,14,16,20,24,28,32,40,48,56,64,80,96,112,128,160,192,224,0],t.t)
B.cI=s([2,3,7],t.t)
B.aV=s([3226,6412,200,168,38,38,134,134,100,100,100,100,68,68,68,68],t.t)
B.fL=s([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],t.t)
B.cJ=s([254,254,243,230,196,177,153,140,133,130,129],t.t)
B.cK=s([302,984,439,642],t.t)
B.fN=s([31,139],t.t)
B.fV=s([3,3,11],t.t)
B.h9=s([4,5,6],t.t)
B.bJ=s([128,128,128,128,128,128,128,128,128,128,128],t.t)
B.cT=s([B.bJ,B.bJ,B.bJ],t.S)
B.hU=s([253,136,254,255,228,219,128,128,128,128,128],t.t)
B.jp=s([189,129,242,255,227,213,255,219,128,128,128],t.t)
B.jw=s([106,126,227,252,214,209,255,255,128,128,128],t.t)
B.lz=s([B.hU,B.jp,B.jw],t.S)
B.lL=s([1,98,248,255,236,226,255,255,128,128,128],t.t)
B.h1=s([181,133,238,254,221,234,255,154,128,128,128],t.t)
B.h_=s([78,134,202,247,198,180,255,219,128,128,128],t.t)
B.mn=s([B.lL,B.h1,B.h_],t.S)
B.hN=s([1,185,249,255,243,255,128,128,128,128,128],t.t)
B.lF=s([184,150,247,255,236,224,128,128,128,128,128],t.t)
B.nx=s([77,110,216,255,236,230,128,128,128,128,128],t.t)
B.kX=s([B.hN,B.lF,B.nx],t.S)
B.l7=s([1,101,251,255,241,255,128,128,128,128,128],t.t)
B.hS=s([170,139,241,252,236,209,255,255,128,128,128],t.t)
B.lf=s([37,116,196,243,228,255,255,255,128,128,128],t.t)
B.hw=s([B.l7,B.hS,B.lf],t.S)
B.jQ=s([1,204,254,255,245,255,128,128,128,128,128],t.t)
B.nW=s([207,160,250,255,238,128,128,128,128,128,128],t.t)
B.nV=s([102,103,231,255,211,171,128,128,128,128,128],t.t)
B.iw=s([B.jQ,B.nW,B.nV],t.S)
B.hj=s([1,152,252,255,240,255,128,128,128,128,128],t.t)
B.o6=s([177,135,243,255,234,225,128,128,128,128,128],t.t)
B.kS=s([80,129,211,255,194,224,128,128,128,128,128],t.t)
B.lx=s([B.hj,B.o6,B.kS],t.S)
B.cZ=s([1,1,255,128,128,128,128,128,128,128,128],t.t)
B.m7=s([246,1,255,128,128,128,128,128,128,128,128],t.t)
B.kt=s([255,128,128,128,128,128,128,128,128,128,128],t.t)
B.op=s([B.cZ,B.m7,B.kt],t.S)
B.ij=s([B.cT,B.lz,B.mn,B.kX,B.hw,B.iw,B.lx,B.op],t.o)
B.nz=s([198,35,237,223,193,187,162,160,145,155,62],t.t)
B.hT=s([131,45,198,221,172,176,220,157,252,221,1],t.t)
B.ny=s([68,47,146,208,149,167,221,162,255,223,128],t.t)
B.k4=s([B.nz,B.hT,B.ny],t.S)
B.mr=s([1,149,241,255,221,224,255,255,128,128,128],t.t)
B.mS=s([184,141,234,253,222,220,255,199,128,128,128],t.t)
B.ko=s([81,99,181,242,176,190,249,202,255,255,128],t.t)
B.ni=s([B.mr,B.mS,B.ko],t.S)
B.n7=s([1,129,232,253,214,197,242,196,255,255,128],t.t)
B.nS=s([99,121,210,250,201,198,255,202,128,128,128],t.t)
B.lA=s([23,91,163,242,170,187,247,210,255,255,128],t.t)
B.kz=s([B.n7,B.nS,B.lA],t.S)
B.iW=s([1,200,246,255,234,255,128,128,128,128,128],t.t)
B.n3=s([109,178,241,255,231,245,255,255,128,128,128],t.t)
B.fH=s([44,130,201,253,205,192,255,255,128,128,128],t.t)
B.nm=s([B.iW,B.n3,B.fH],t.S)
B.hd=s([1,132,239,251,219,209,255,165,128,128,128],t.t)
B.fi=s([94,136,225,251,218,190,255,255,128,128,128],t.t)
B.n8=s([22,100,174,245,186,161,255,199,128,128,128],t.t)
B.l5=s([B.hd,B.fi,B.n8],t.S)
B.mR=s([1,182,249,255,232,235,128,128,128,128,128],t.t)
B.lq=s([124,143,241,255,227,234,128,128,128,128,128],t.t)
B.jl=s([35,77,181,251,193,211,255,205,128,128,128],t.t)
B.jy=s([B.mR,B.lq,B.jl],t.S)
B.oq=s([1,157,247,255,236,231,255,255,128,128,128],t.t)
B.ig=s([121,141,235,255,225,227,255,255,128,128,128],t.t)
B.n4=s([45,99,188,251,195,217,255,224,128,128,128],t.t)
B.hu=s([B.oq,B.ig,B.n4],t.S)
B.fj=s([1,1,251,255,213,255,128,128,128,128,128],t.t)
B.fM=s([203,1,248,255,255,128,128,128,128,128,128],t.t)
B.mT=s([137,1,177,255,224,255,128,128,128,128,128],t.t)
B.hn=s([B.fj,B.fM,B.mT],t.S)
B.mE=s([B.k4,B.ni,B.kz,B.nm,B.l5,B.jy,B.hu,B.hn],t.o)
B.iC=s([253,9,248,251,207,208,255,192,128,128,128],t.t)
B.m9=s([175,13,224,243,193,185,249,198,255,255,128],t.t)
B.on=s([73,17,171,221,161,179,236,167,255,234,128],t.t)
B.lW=s([B.iC,B.m9,B.on],t.S)
B.my=s([1,95,247,253,212,183,255,255,128,128,128],t.t)
B.kJ=s([239,90,244,250,211,209,255,255,128,128,128],t.t)
B.nw=s([155,77,195,248,188,195,255,255,128,128,128],t.t)
B.mQ=s([B.my,B.kJ,B.nw],t.S)
B.jS=s([1,24,239,251,218,219,255,205,128,128,128],t.t)
B.me=s([201,51,219,255,196,186,128,128,128,128,128],t.t)
B.kH=s([69,46,190,239,201,218,255,228,128,128,128],t.t)
B.mv=s([B.jS,B.me,B.kH],t.S)
B.js=s([1,191,251,255,255,128,128,128,128,128,128],t.t)
B.ld=s([223,165,249,255,213,255,128,128,128,128,128],t.t)
B.lK=s([141,124,248,255,255,128,128,128,128,128,128],t.t)
B.n5=s([B.js,B.ld,B.lK],t.S)
B.kc=s([1,16,248,255,255,128,128,128,128,128,128],t.t)
B.id=s([190,36,230,255,236,255,128,128,128,128,128],t.t)
B.hV=s([149,1,255,128,128,128,128,128,128,128,128],t.t)
B.he=s([B.kc,B.id,B.hV],t.S)
B.lC=s([1,226,255,128,128,128,128,128,128,128,128],t.t)
B.lZ=s([247,192,255,128,128,128,128,128,128,128,128],t.t)
B.nv=s([240,128,255,128,128,128,128,128,128,128,128],t.t)
B.fQ=s([B.lC,B.lZ,B.nv],t.S)
B.nl=s([1,134,252,255,255,128,128,128,128,128,128],t.t)
B.lp=s([213,62,250,255,255,128,128,128,128,128,128],t.t)
B.o1=s([55,93,255,128,128,128,128,128,128,128,128],t.t)
B.lB=s([B.nl,B.lp,B.o1],t.S)
B.hI=s([B.lW,B.mQ,B.mv,B.n5,B.he,B.fQ,B.lB,B.cT],t.o)
B.lr=s([202,24,213,235,186,191,220,160,240,175,255],t.t)
B.hR=s([126,38,182,232,169,184,228,174,255,187,128],t.t)
B.hg=s([61,46,138,219,151,178,240,170,255,216,128],t.t)
B.mJ=s([B.lr,B.hR,B.hg],t.S)
B.kR=s([1,112,230,250,199,191,247,159,255,255,128],t.t)
B.ht=s([166,109,228,252,211,215,255,174,128,128,128],t.t)
B.l9=s([39,77,162,232,172,180,245,178,255,255,128],t.t)
B.mG=s([B.kR,B.ht,B.l9],t.S)
B.kT=s([1,52,220,246,198,199,249,220,255,255,128],t.t)
B.is=s([124,74,191,243,183,193,250,221,255,255,128],t.t)
B.jk=s([24,71,130,219,154,170,243,182,255,255,128],t.t)
B.mF=s([B.kT,B.is,B.jk],t.S)
B.ji=s([1,182,225,249,219,240,255,224,128,128,128],t.t)
B.o_=s([149,150,226,252,216,205,255,171,128,128,128],t.t)
B.oy=s([28,108,170,242,183,194,254,223,255,255,128],t.t)
B.nL=s([B.ji,B.o_,B.oy],t.S)
B.oA=s([1,81,230,252,204,203,255,192,128,128,128],t.t)
B.n0=s([123,102,209,247,188,196,255,233,128,128,128],t.t)
B.ns=s([20,95,153,243,164,173,255,203,128,128,128],t.t)
B.n1=s([B.oA,B.n0,B.ns],t.S)
B.kl=s([1,222,248,255,216,213,128,128,128,128,128],t.t)
B.lo=s([168,175,246,252,235,205,255,255,128,128,128],t.t)
B.jn=s([47,116,215,255,211,212,255,255,128,128,128],t.t)
B.i8=s([B.kl,B.lo,B.jn],t.S)
B.kg=s([1,121,236,253,212,214,255,255,128,128,128],t.t)
B.kU=s([141,84,213,252,201,202,255,219,128,128,128],t.t)
B.lT=s([42,80,160,240,162,185,255,205,128,128,128],t.t)
B.jA=s([B.kg,B.kU,B.lT],t.S)
B.oe=s([244,1,255,128,128,128,128,128,128,128,128],t.t)
B.fg=s([238,1,255,128,128,128,128,128,128,128,128],t.t)
B.m1=s([B.cZ,B.oe,B.fg],t.S)
B.fB=s([B.mJ,B.mG,B.mF,B.nL,B.n1,B.i8,B.jA,B.m1],t.o)
B.cM=s([B.ij,B.mE,B.hI,B.fB],t.hc)
B.cN=s([511,1023,2047,4095],t.t)
B.cP=s([63,207,243,252],t.t)
B.cQ=s([663,919,872,919],t.t)
B.hD=s([17,18,24,47,99,99,99,99,18,21,26,66,99,99,99,99,24,26,56,99,99,99,99,99,47,66,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99],t.t)
B.cR=s([17,21,25,29,13,17,21,25,9,13,17,21,5,9,13,17],t.t)
B.hF=s([73,73,42,0],t.t)
B.aX=s([0,1,2,3,4,5,6,7,8,9,10,11],t.t)
B.hG=s([77,77,0,42],t.t)
B.hO=s([80,75,3,4],t.t)
B.hP=s([80,75,5,6],t.t)
B.hX=s([8,8,4,2],t.t)
B.cS=s([B.cA,B.cB,B.cz,B.cJ],t.S)
B.i2=s([0,1,2,3,4,6,8,12,16,24,32,48,64,96,128,192,256,384,512,768,1024,1536,2048,3072,4096,6144,8192,12288,16384,24576],t.t)
B.cU=s([1,1.387039845,1.306562965,1.175875602,1,0.785694958,0.5411961,0.275899379],t.n)
B.cV=s([0,1,3,7,15,31,63,127,255,511,1023,2047,4095],t.t)
B.aY=s([0,1,2,3,4,4,5,5,6,6,6,6,7,7,7,7,8,8,8,8,8,8,8,8,9,9,9,9,9,9,9,9,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,0,0,16,17,18,18,19,19,20,20,20,20,21,21,21,21,22,22,22,22,22,22,22,22,23,23,23,23,23,23,23,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29],t.t)
B.cW=s([1,2,3,0,4,17,5,18,33,49,65,6,19,81,97,7,34,113,20,50,129,145,161,8,35,66,177,193,21,82,209,240,36,51,98,114,130,9,10,22,23,24,25,26,37,38,39,40,41,42,52,53,54,55,56,57,58,67,68,69,70,71,72,73,74,83,84,85,86,87,88,89,90,99,100,101,102,103,104,105,106,115,116,117,118,119,120,121,122,131,132,133,134,135,136,137,138,146,147,148,149,150,151,152,153,154,162,163,164,165,166,167,168,169,170,178,179,180,181,182,183,184,185,186,194,195,196,197,198,199,200,201,202,210,211,212,213,214,215,216,217,218,225,226,227,228,229,230,231,232,233,234,241,242,243,244,245,246,247,248,249,250],t.t)
B.aZ=s([96,73,55,39,23,13,5,1,255,255,255,255,255,255,255,255,101,78,58,42,26,16,8,2,0,3,9,17,27,43,59,79,102,86,62,46,32,20,10,6,4,7,11,21,33,47,63,87,105,90,70,52,37,28,18,14,12,15,19,29,38,53,71,91,110,99,82,66,48,35,30,24,22,25,31,36,49,67,83,100,115,108,94,76,64,50,44,40,34,41,45,51,65,77,95,109,118,113,103,92,80,68,60,56,54,57,61,69,81,93,104,114,119,116,111,106,97,88,84,74,72,75,85,89,98,107,112,117],t.t)
B.B=s([0,1,1,2,4,8,1,1,2,4,8,4,8,4],t.t)
B.cX=s([2954,2956,2958,2962,2970,2986,3018,3082,3212,3468,3980,5004],t.t)
B.i1=s([96,110],t.t)
B.i0=s([96,108],t.t)
B.fm=s([110,115],t.t)
B.cY=s([B.i1,B.i0,B.fm],t.S)
B.iK=s([82,97,114,33,26,7],t.t)
B.d_=s([280,256,256,256,40],t.t)
B.aD=s([0,1,5,6,14,15,27,28,2,4,7,13,16,26,29,42,3,8,12,17,25,30,41,43,9,11,18,24,31,40,44,53,10,19,23,32,39,45,52,54,20,22,33,38,46,51,55,60,21,34,37,47,50,56,59,61,35,36,48,49,57,58,62,63],t.t)
B.d0=s([50,24,16,9,7,5,3,2],t.t)
B.b_=s([62,62,30,30,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3225,3225,3225,3225,3225,3225,3225,3225,3225,3225,3225,3225,3225,3225,3225,3225,3225,3225,3225,3225,3225,3225,3225,3225,3225,3225,3225,3225,3225,3225,3225,3225,588,588,588,588,588,588,588,588,1680,1680,20499,22547,24595,26643,1776,1776,1808,1808,-24557,-22509,-20461,-18413,1904,1904,1936,1936,-16365,-14317,782,782,782,782,814,814,814,814,-12269,-10221,10257,10257,12305,12305,14353,14353,16403,18451,1712,1712,1744,1744,28691,30739,-32749,-30701,-28653,-26605,2061,2061,2061,2061,2061,2061,2061,2061,424,424,424,424,424,424,424,424,424,424,424,424,424,424,424,424,424,424,424,424,424,424,424,424,424,424,424,424,424,424,424,424,750,750,750,750,1616,1616,1648,1648,1424,1424,1456,1456,1488,1488,1520,1520,1840,1840,1872,1872,1968,1968,8209,8209,524,524,524,524,524,524,524,524,556,556,556,556,556,556,556,556,1552,1552,1584,1584,2000,2000,2032,2032,976,976,1008,1008,1040,1040,1072,1072,1296,1296,1328,1328,718,718,718,718,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,456,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,326,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,358,490,490,490,490,490,490,490,490,490,490,490,490,490,490,490,490,4113,4113,6161,6161,848,848,880,880,912,912,944,944,622,622,622,622,654,654,654,654,1104,1104,1136,1136,1168,1168,1200,1200,1232,1232,1264,1264,686,686,686,686,1360,1360,1392,1392,12,12,12,12,12,12,12,12,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390,390],t.t)
B.al=s([4,5,6,7,8,9,10,10,11,12,13,14,15,16,17,17,18,19,20,20,21,21,22,22,23,23,24,25,25,26,27,28,29,30,31,32,33,34,35,36,37,37,38,39,40,41,42,43,44,45,46,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,76,77,78,79,80,81,82,83,84,85,86,87,88,89,91,93,95,96,98,100,101,102,104,106,108,110,112,114,116,118,122,124,126,128,130,132,134,136,138,140,143,145,148,151,154,157],t.t)
B.d1=s([24,7,23,25,40,6,39,41,22,26,38,42,56,5,55,57,21,27,54,58,37,43,72,4,71,73,20,28,53,59,70,74,36,44,88,69,75,52,60,3,87,89,19,29,86,90,35,45,68,76,85,91,51,61,104,2,103,105,18,30,102,106,34,46,84,92,67,77,101,107,50,62,120,1,119,121,83,93,17,31,100,108,66,78,118,122,33,47,117,123,49,63,99,109,82,94,0,116,124,65,79,16,32,98,110,48,115,125,81,95,64,114,126,97,111,80,113,127,96,112],t.t)
B.am=s([4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,60,62,64,66,68,70,72,74,76,78,80,82,84,86,88,90,92,94,96,98,100,102,104,106,108,110,112,114,116,119,122,125,128,131,134,137,140,143,146,149,152,155,158,161,164,167,170,173,177,181,185,189,193,197,201,205,209,213,217,221,225,229,234,239,245,249,254,259,264,269,274,279,284],t.t)
B.d2=s([0,0,2,1,2,4,4,3,4,7,5,4,4,0,1,2,119],t.t)
B.bF=s([0,1,2,3,4,5,6,7,8,8,9,9,10,10,11,11,12,12,12,12,13,13,13,13,14,14,14,14,15,15,15,15,16,16,16,16,16,16,16,16,17,17,17,17,17,17,17,17,18,18,18,18,18,18,18,18,19,19,19,19,19,19,19,19,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,28],t.t)
B.eI=new A.cJ(0,"uint")
B.d3=s([B.eI,B.cb,B.cc],A.X("p<cJ>"))
B.an=s([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],t.t)
B.d5=s([254,253,251,247,239,223,191,127],t.t)
B.b0=s([12,8,140,8,76,8,204,8,44,8,172,8,108,8,236,8,28,8,156,8,92,8,220,8,60,8,188,8,124,8,252,8,2,8,130,8,66,8,194,8,34,8,162,8,98,8,226,8,18,8,146,8,82,8,210,8,50,8,178,8,114,8,242,8,10,8,138,8,74,8,202,8,42,8,170,8,106,8,234,8,26,8,154,8,90,8,218,8,58,8,186,8,122,8,250,8,6,8,134,8,70,8,198,8,38,8,166,8,102,8,230,8,22,8,150,8,86,8,214,8,54,8,182,8,118,8,246,8,14,8,142,8,78,8,206,8,46,8,174,8,110,8,238,8,30,8,158,8,94,8,222,8,62,8,190,8,126,8,254,8,1,8,129,8,65,8,193,8,33,8,161,8,97,8,225,8,17,8,145,8,81,8,209,8,49,8,177,8,113,8,241,8,9,8,137,8,73,8,201,8,41,8,169,8,105,8,233,8,25,8,153,8,89,8,217,8,57,8,185,8,121,8,249,8,5,8,133,8,69,8,197,8,37,8,165,8,101,8,229,8,21,8,149,8,85,8,213,8,53,8,181,8,117,8,245,8,13,8,141,8,77,8,205,8,45,8,173,8,109,8,237,8,29,8,157,8,93,8,221,8,61,8,189,8,125,8,253,8,19,9,275,9,147,9,403,9,83,9,339,9,211,9,467,9,51,9,307,9,179,9,435,9,115,9,371,9,243,9,499,9,11,9,267,9,139,9,395,9,75,9,331,9,203,9,459,9,43,9,299,9,171,9,427,9,107,9,363,9,235,9,491,9,27,9,283,9,155,9,411,9,91,9,347,9,219,9,475,9,59,9,315,9,187,9,443,9,123,9,379,9,251,9,507,9,7,9,263,9,135,9,391,9,71,9,327,9,199,9,455,9,39,9,295,9,167,9,423,9,103,9,359,9,231,9,487,9,23,9,279,9,151,9,407,9,87,9,343,9,215,9,471,9,55,9,311,9,183,9,439,9,119,9,375,9,247,9,503,9,15,9,271,9,143,9,399,9,79,9,335,9,207,9,463,9,47,9,303,9,175,9,431,9,111,9,367,9,239,9,495,9,31,9,287,9,159,9,415,9,95,9,351,9,223,9,479,9,63,9,319,9,191,9,447,9,127,9,383,9,255,9,511,9,0,7,64,7,32,7,96,7,16,7,80,7,48,7,112,7,8,7,72,7,40,7,104,7,24,7,88,7,56,7,120,7,4,7,68,7,36,7,100,7,20,7,84,7,52,7,116,7,3,8,131,8,67,8,195,8,35,8,163,8,99,8,227,8],t.t)
B.bG=s([A.yB(),A.yt(),A.yI(),A.yG(),A.yD(),A.yC(),A.yE()],t.B)
B.d6=s([0,5,16,5,8,5,24,5,4,5,20,5,12,5,28,5,2,5,18,5,10,5,26,5,6,5,22,5,14,5,30,5,1,5,17,5,9,5,25,5,5,5,21,5,13,5,29,5,3,5,19,5,11,5,27,5,7,5,23,5],t.t)
B.n=s([1792,1792,1792,1536,1536,1408,1366,1280,1280,1216,1178,1152,1110,1076,1061,1024,1024,992,968,951,939,911,896,878,871,854,838,820,811,794,786,768,768,752,740,732,720,709,704,690,683,672,666,655,647,640,631,622,615,607,598,592,586,576,572,564,559,555,547,541,534,528,522,512,512,504,500,494,488,483,477,473,467,461,458,452,448,443,438,434,427,424,419,415,410,406,403,399,394,390,384,384,377,374,370,366,362,359,355,351,347,342,342,336,333,330,326,323,320,316,312,308,305,302,299,296,293,288,287,283,280,277,274,272,268,266,262,256,256,256,251,248,245,242,240,237,234,232,228,226,223,221,218,216,214,211,208,205,203,201,198,196,192,191,188,187,183,181,179,176,175,171,171,168,165,163,160,159,156,154,152,150,148,146,144,142,139,138,135,133,131,128,128,125,123,121,119,117,115,113,111,110,107,105,103,102,100,98,96,94,92,91,89,86,86,83,82,80,77,76,74,73,71,69,67,66,64,63,61,59,57,55,54,52,51,49,47,46,44,43,41,40,38,36,35,33,32,30,29,27,25,24,22,21,19,18,16,15,13,12,10,9,7,6,4,3],t.t)
B.bS=new A.ae(0,"whiteIsZero")
B.pn=new A.ae(1,"blackIsZero")
B.pu=new A.ae(2,"rgb")
B.bU=new A.ae(3,"palette")
B.pv=new A.ae(4,"transparencyMask")
B.dT=new A.ae(5,"cmyk")
B.pw=new A.ae(6,"yCbCr")
B.px=new A.ae(7,"reserved7")
B.py=new A.ae(8,"cieLab")
B.pz=new A.ae(9,"iccLab")
B.po=new A.ae(10,"ituLab")
B.pp=new A.ae(11,"logL")
B.pq=new A.ae(12,"logLuv")
B.pr=new A.ae(13,"colorFilterArray")
B.ps=new A.ae(14,"linearRaw")
B.pt=new A.ae(15,"depth")
B.bT=new A.ae(16,"unknown")
B.d8=s([B.bS,B.pn,B.pu,B.bU,B.pv,B.dT,B.pw,B.px,B.py,B.pz,B.po,B.pp,B.pq,B.pr,B.ps,B.pt,B.bT],A.X("p<ae>"))
B.da=s([0,0,3,1,1,1,1,1,1,1,1,1,0,0,0,0,0],t.t)
B.oJ=new A.fx(0,"source")
B.oK=new A.fx(1,"over")
B.db=s([B.oJ,B.oK],A.X("p<fx>"))
B.pf=new A.da(0,"invalid")
B.bQ=new A.da(1,"uint")
B.i=new A.da(2,"int")
B.at=new A.da(3,"float")
B.dc=s([B.pf,B.bQ,B.i,B.at],A.X("p<da>"))
B.b1=s([17,18,0,1,2,3,4,5,16,6,7,8,9,10,11,12,13,14,15],t.t)
B.b2=s([-0.0,1,-1,2,-2,3,4,6,-3,5,-4,-5,-6,7,-7,8,-8,-9],t.t)
B.dd=s([B.f,B.cp,B.m,B.k,B.z,B.E,B.cu,B.Z,B.cv,B.cw,B.cq,B.cr,B.cs,B.ct],A.X("p<ao>"))
B.ao=s([0,1,4,8,5,2,3,6,9,12,13,10,7,11,14,15],t.t)
B.eJ=new A.bk(1,"rle")
B.eK=new A.bk(2,"zips")
B.eL=new A.bk(3,"zip")
B.eM=new A.bk(4,"piz")
B.eN=new A.bk(5,"pxr24")
B.eO=new A.bk(6,"b44")
B.eP=new A.bk(7,"b44a")
B.de=s([B.cd,B.eJ,B.eK,B.eL,B.eM,B.eN,B.eO,B.eP],A.X("p<bk>"))
B.kL=s([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63],t.t)
B.lO=s([231,120,48,89,115,113,120,152,112],t.t)
B.fC=s([152,179,64,126,170,118,46,70,95],t.t)
B.kG=s([175,69,143,80,85,82,72,155,103],t.t)
B.h4=s([56,58,10,171,218,189,17,13,152],t.t)
B.l8=s([114,26,17,163,44,195,21,10,173],t.t)
B.ln=s([121,24,80,195,26,62,44,64,85],t.t)
B.l4=s([144,71,10,38,171,213,144,34,26],t.t)
B.na=s([170,46,55,19,136,160,33,206,71],t.t)
B.iX=s([63,20,8,114,114,208,12,9,226],t.t)
B.jR=s([81,40,11,96,182,84,29,16,36],t.t)
B.fk=s([B.lO,B.fC,B.kG,B.h4,B.l8,B.ln,B.l4,B.na,B.iX,B.jR],t.S)
B.ic=s([134,183,89,137,98,101,106,165,148],t.t)
B.mW=s([72,187,100,130,157,111,32,75,80],t.t)
B.lu=s([66,102,167,99,74,62,40,234,128],t.t)
B.fP=s([41,53,9,178,241,141,26,8,107],t.t)
B.jI=s([74,43,26,146,73,166,49,23,157],t.t)
B.j7=s([65,38,105,160,51,52,31,115,128],t.t)
B.jc=s([104,79,12,27,217,255,87,17,7],t.t)
B.kE=s([87,68,71,44,114,51,15,186,23],t.t)
B.mH=s([47,41,14,110,182,183,21,17,194],t.t)
B.m6=s([66,45,25,102,197,189,23,18,22],t.t)
B.nt=s([B.ic,B.mW,B.lu,B.fP,B.jI,B.j7,B.jc,B.kE,B.mH,B.m6],t.S)
B.lN=s([88,88,147,150,42,46,45,196,205],t.t)
B.la=s([43,97,183,117,85,38,35,179,61],t.t)
B.jm=s([39,53,200,87,26,21,43,232,171],t.t)
B.ks=s([56,34,51,104,114,102,29,93,77],t.t)
B.kZ=s([39,28,85,171,58,165,90,98,64],t.t)
B.j2=s([34,22,116,206,23,34,43,166,73],t.t)
B.fl=s([107,54,32,26,51,1,81,43,31],t.t)
B.nd=s([68,25,106,22,64,171,36,225,114],t.t)
B.ib=s([34,19,21,102,132,188,16,76,124],t.t)
B.nE=s([62,18,78,95,85,57,50,48,51],t.t)
B.iy=s([B.lN,B.la,B.jm,B.ks,B.kZ,B.j2,B.fl,B.nd,B.ib,B.nE],t.S)
B.kV=s([193,101,35,159,215,111,89,46,111],t.t)
B.hH=s([60,148,31,172,219,228,21,18,111],t.t)
B.hb=s([112,113,77,85,179,255,38,120,114],t.t)
B.nA=s([40,42,1,196,245,209,10,25,109],t.t)
B.ke=s([88,43,29,140,166,213,37,43,154],t.t)
B.j4=s([61,63,30,155,67,45,68,1,209],t.t)
B.jv=s([100,80,8,43,154,1,51,26,71],t.t)
B.fT=s([142,78,78,16,255,128,34,197,171],t.t)
B.kQ=s([41,40,5,102,211,183,4,1,221],t.t)
B.iJ=s([51,50,17,168,209,192,23,25,82],t.t)
B.ix=s([B.kV,B.hH,B.hb,B.nA,B.ke,B.j4,B.jv,B.fT,B.kQ,B.iJ],t.S)
B.jj=s([138,31,36,171,27,166,38,44,229],t.t)
B.iv=s([67,87,58,169,82,115,26,59,179],t.t)
B.mm=s([63,59,90,180,59,166,93,73,154],t.t)
B.np=s([40,40,21,116,143,209,34,39,175],t.t)
B.fY=s([47,15,16,183,34,223,49,45,183],t.t)
B.hQ=s([46,17,33,183,6,98,15,32,183],t.t)
B.oC=s([57,46,22,24,128,1,54,17,37],t.t)
B.jx=s([65,32,73,115,28,128,23,128,205],t.t)
B.lt=s([40,3,9,115,51,192,18,6,223],t.t)
B.jF=s([87,37,9,115,59,77,64,21,47],t.t)
B.kP=s([B.jj,B.iv,B.mm,B.np,B.fY,B.hQ,B.oC,B.jx,B.lt,B.jF],t.S)
B.oc=s([104,55,44,218,9,54,53,130,226],t.t)
B.hs=s([64,90,70,205,40,41,23,26,57],t.t)
B.ml=s([54,57,112,184,5,41,38,166,213],t.t)
B.j3=s([30,34,26,133,152,116,10,32,134],t.t)
B.lX=s([39,19,53,221,26,114,32,73,255],t.t)
B.iH=s([31,9,65,234,2,15,1,118,73],t.t)
B.kO=s([75,32,12,51,192,255,160,43,51],t.t)
B.j5=s([88,31,35,67,102,85,55,186,85],t.t)
B.jX=s([56,21,23,111,59,205,45,37,192],t.t)
B.jY=s([55,38,70,124,73,102,1,34,98],t.t)
B.oj=s([B.oc,B.hs,B.ml,B.j3,B.lX,B.iH,B.kO,B.j5,B.jX,B.jY],t.S)
B.jW=s([125,98,42,88,104,85,117,175,82],t.t)
B.ja=s([95,84,53,89,128,100,113,101,45],t.t)
B.lg=s([75,79,123,47,51,128,81,171,1],t.t)
B.hp=s([57,17,5,71,102,57,53,41,49],t.t)
B.md=s([38,33,13,121,57,73,26,1,85],t.t)
B.nY=s([41,10,67,138,77,110,90,47,114],t.t)
B.kM=s([115,21,2,10,102,255,166,23,6],t.t)
B.ie=s([101,29,16,10,85,128,101,196,26],t.t)
B.jr=s([57,18,10,102,102,213,34,20,43],t.t)
B.kd=s([117,20,15,36,163,128,68,1,26],t.t)
B.kD=s([B.jW,B.ja,B.lg,B.hp,B.md,B.nY,B.kM,B.ie,B.jr,B.kd],t.S)
B.jC=s([102,61,71,37,34,53,31,243,192],t.t)
B.nU=s([69,60,71,38,73,119,28,222,37],t.t)
B.jG=s([68,45,128,34,1,47,11,245,171],t.t)
B.fr=s([62,17,19,70,146,85,55,62,70],t.t)
B.ov=s([37,43,37,154,100,163,85,160,1],t.t)
B.nM=s([63,9,92,136,28,64,32,201,85],t.t)
B.mZ=s([75,15,9,9,64,255,184,119,16],t.t)
B.ip=s([86,6,28,5,64,255,25,248,1],t.t)
B.m2=s([56,8,17,132,137,255,55,116,128],t.t)
B.hh=s([58,15,20,82,135,57,26,121,40],t.t)
B.l1=s([B.jC,B.nU,B.jG,B.fr,B.ov,B.nM,B.mZ,B.ip,B.m2,B.hh],t.S)
B.ll=s([164,50,31,137,154,133,25,35,218],t.t)
B.io=s([51,103,44,131,131,123,31,6,158],t.t)
B.nI=s([86,40,64,135,148,224,45,183,128],t.t)
B.kF=s([22,26,17,131,240,154,14,1,209],t.t)
B.hL=s([45,16,21,91,64,222,7,1,197],t.t)
B.nq=s([56,21,39,155,60,138,23,102,213],t.t)
B.og=s([83,12,13,54,192,255,68,47,28],t.t)
B.lv=s([85,26,85,85,128,128,32,146,171],t.t)
B.ku=s([18,11,7,63,144,171,4,4,246],t.t)
B.iz=s([35,27,10,146,174,171,12,26,128],t.t)
B.km=s([B.ll,B.io,B.nI,B.kF,B.hL,B.nq,B.og,B.lv,B.ku,B.iz],t.S)
B.mD=s([190,80,35,99,180,80,126,54,45],t.t)
B.n9=s([85,126,47,87,176,51,41,20,32],t.t)
B.mf=s([101,75,128,139,118,146,116,128,85],t.t)
B.mU=s([56,41,15,176,236,85,37,9,62],t.t)
B.hi=s([71,30,17,119,118,255,17,18,138],t.t)
B.l0=s([101,38,60,138,55,70,43,26,142],t.t)
B.kp=s([146,36,19,30,171,255,97,27,20],t.t)
B.lM=s([138,45,61,62,219,1,81,188,64],t.t)
B.nB=s([32,41,20,117,151,142,20,21,163],t.t)
B.nb=s([112,19,12,61,195,128,48,4,24],t.t)
B.mu=s([B.mD,B.n9,B.mf,B.mU,B.hi,B.l0,B.kp,B.lM,B.nB,B.nb],t.S)
B.b3=s([B.fk,B.nt,B.iy,B.ix,B.kP,B.oj,B.kD,B.l1,B.km,B.mu],t.o)
B.bb=new A.aC(0,"none")
B.a2=new A.aC(1,"palette")
B.dR=new A.aC(2,"rgb")
B.p9=new A.aC(3,"gray")
B.pa=new A.aC(4,"reserved4")
B.pb=new A.aC(5,"reserved5")
B.pc=new A.aC(6,"reserved6")
B.pd=new A.aC(7,"reserved7")
B.pe=new A.aC(8,"reserved8")
B.a3=new A.aC(9,"paletteRle")
B.dQ=new A.aC(10,"rgbRle")
B.p8=new A.aC(11,"grayRle")
B.df=s([B.bb,B.a2,B.dR,B.p9,B.pa,B.pb,B.pc,B.pd,B.pe,B.a3,B.dQ,B.p8],A.X("p<aC>"))
B.di=s([0,1,2,3,17,4,5,33,49,6,18,65,81,7,97,113,19,34,50,129,8,20,66,145,161,177,193,9,35,51,82,240,21,98,114,209,10,22,36,52,225,37,241,23,24,25,26,38,39,40,41,42,53,54,55,56,57,58,67,68,69,70,71,72,73,74,83,84,85,86,87,88,89,90,99,100,101,102,103,104,105,106,115,116,117,118,119,120,121,122,130,131,132,133,134,135,136,137,138,146,147,148,149,150,151,152,153,154,162,163,164,165,166,167,168,169,170,178,179,180,181,182,183,184,185,186,194,195,196,197,198,199,200,201,202,210,211,212,213,214,215,216,217,218,226,227,228,229,230,231,232,233,234,242,243,244,245,246,247,248,249,250],t.t)
B.le=s([0,1,1,1,0],t.t)
B.dj=s([A.yl(),A.ys(),A.yu(),A.yn(),A.yq(),A.yw(),A.yp(),A.yv(),A.ym(),A.yo()],t.B)
B.bE=s([8,0,8,0],t.t)
B.hq=s([5,3,5,3],t.t)
B.fW=s([3,5,3,5],t.t)
B.cy=s([0,8,0,8],t.t)
B.cL=s([4,4,4,4],t.t)
B.h8=s([4,4,0,0],t.t)
B.dk=s([B.bE,B.hq,B.fW,B.cy,B.bE,B.cL,B.h8,B.cy],t.S)
B.dl=s([0,1,3,7,15,31,63,127,255,511,1023,2047,4095,8191,16383,32767,65535],t.t)
B.lE=s([0,30,60,90,30,60,90,90,60,90,90,90,90,90,90,90],t.t)
B.b4=s([80,88,23,71,30,30,62,62,4,4,4,4,4,4,4,4,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,51,51,51,51,51,51,51,51,51,51,51,51,51,51,51,51,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41,41],t.t)
B.lJ=s([16,11,10,16,24,40,51,61,12,12,14,19,26,58,60,55,14,13,16,24,40,57,69,56,14,17,22,29,51,87,80,62,18,22,37,56,68,109,103,77,24,35,55,64,81,104,113,92,49,64,78,87,103,121,120,101,72,92,95,98,112,100,103,99],t.t)
B.ap=s([0,1,4,5,16,17,20,21,64,65,68,69,80,81,84,85,256,257,260,261,272,273,276,277,320,321,324,325,336,337,340,341,1024,1025,1028,1029,1040,1041,1044,1045,1088,1089,1092,1093,1104,1105,1108,1109,1280,1281,1284,1285,1296,1297,1300,1301,1344,1345,1348,1349,1360,1361,1364,1365,4096,4097,4100,4101,4112,4113,4116,4117,4160,4161,4164,4165,4176,4177,4180,4181,4352,4353,4356,4357,4368,4369,4372,4373,4416,4417,4420,4421,4432,4433,4436,4437,5120,5121,5124,5125,5136,5137,5140,5141,5184,5185,5188,5189,5200,5201,5204,5205,5376,5377,5380,5381,5392,5393,5396,5397,5440,5441,5444,5445,5456,5457,5460,5461,16384,16385,16388,16389,16400,16401,16404,16405,16448,16449,16452,16453,16464,16465,16468,16469,16640,16641,16644,16645,16656,16657,16660,16661,16704,16705,16708,16709,16720,16721,16724,16725,17408,17409,17412,17413,17424,17425,17428,17429,17472,17473,17476,17477,17488,17489,17492,17493,17664,17665,17668,17669,17680,17681,17684,17685,17728,17729,17732,17733,17744,17745,17748,17749,20480,20481,20484,20485,20496,20497,20500,20501,20544,20545,20548,20549,20560,20561,20564,20565,20736,20737,20740,20741,20752,20753,20756,20757,20800,20801,20804,20805,20816,20817,20820,20821,21504,21505,21508,21509,21520,21521,21524,21525,21568,21569,21572,21573,21584,21585,21588,21589,21760,21761,21764,21765,21776,21777,21780,21781,21824,21825,21828,21829,21840,21841,21844,21845],t.t)
B.bH=s([127,127,191,127,159,191,223,127,143,159,175,191,207,223,239,127,135,143,151,159,167,175,183,191,199,207,215,223,231,239,247,127,131,135,139,143,147,151,155,159,163,167,171,175,179,183,187,191,195,199,203,207,211,215,219,223,227,231,235,239,243,247,251,127,129,131,133,135,137,139,141,143,145,147,149,151,153,155,157,159,161,163,165,167,169,171,173,175,177,179,181,183,185,187,189,191,193,195,197,199,201,203,205,207,209,211,213,215,217,219,221,223,225,227,229,231,233,235,237,239,241,243,245,247,249,251,253,127],t.t)
B.aE=s([7,6,6,5,5,5,5,4,4,4,4,4,4,4,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],t.t)
B.a0=s([28679,28679,31752,-32759,-31735,-30711,-29687,-28663,29703,29703,30727,30727,-27639,-26615,-25591,-24567],t.t)
B.lU=s([30,27,19,11,27,24,17,10,19,17,12,8,11,10,8,6],t.t)
B.bI=s([0,4,128,132,8,12,136,140],t.t)
B.b5=s([6430,6400,6400,6400,3225,3225,3225,3225,944,944,944,944,976,976,976,976,1456,1456,1456,1456,1488,1488,1488,1488,718,718,718,718,718,718,718,718,750,750,750,750,750,750,750,750,1520,1520,1520,1520,1552,1552,1552,1552,428,428,428,428,428,428,428,428,428,428,428,428,428,428,428,428,654,654,654,654,654,654,654,654,1072,1072,1072,1072,1104,1104,1104,1104,1136,1136,1136,1136,1168,1168,1168,1168,1200,1200,1200,1200,1232,1232,1232,1232,622,622,622,622,622,622,622,622,1008,1008,1008,1008,1040,1040,1040,1040,44,44,44,44,44,44,44,44,44,44,44,44,44,44,44,44,396,396,396,396,396,396,396,396,396,396,396,396,396,396,396,396,1712,1712,1712,1712,1744,1744,1744,1744,846,846,846,846,846,846,846,846,1264,1264,1264,1264,1296,1296,1296,1296,1328,1328,1328,1328,1360,1360,1360,1360,1392,1392,1392,1392,1424,1424,1424,1424,686,686,686,686,686,686,686,686,910,910,910,910,910,910,910,910,1968,1968,1968,1968,2000,2000,2000,2000,2032,2032,2032,2032,16,16,16,16,10257,10257,10257,10257,12305,12305,12305,12305,330,330,330,330,330,330,330,330,330,330,330,330,330,330,330,330,330,330,330,330,330,330,330,330,330,330,330,330,330,330,330,330,362,362,362,362,362,362,362,362,362,362,362,362,362,362,362,362,362,362,362,362,362,362,362,362,362,362,362,362,362,362,362,362,878,878,878,878,878,878,878,878,1904,1904,1904,1904,1936,1936,1936,1936,-18413,-18413,-16365,-16365,-14317,-14317,-10221,-10221,590,590,590,590,590,590,590,590,782,782,782,782,782,782,782,782,1584,1584,1584,1584,1616,1616,1616,1616,1648,1648,1648,1648,1680,1680,1680,1680,814,814,814,814,814,814,814,814,1776,1776,1776,1776,1808,1808,1808,1808,1840,1840,1840,1840,1872,1872,1872,1872,6157,6157,6157,6157,6157,6157,6157,6157,6157,6157,6157,6157,6157,6157,6157,6157,-12275,-12275,-12275,-12275,-12275,-12275,-12275,-12275,-12275,-12275,-12275,-12275,-12275,-12275,-12275,-12275,14353,14353,14353,14353,16401,16401,16401,16401,22547,22547,24595,24595,20497,20497,20497,20497,18449,18449,18449,18449,26643,26643,28691,28691,30739,30739,-32749,-32749,-30701,-30701,-28653,-28653,-26605,-26605,-24557,-24557,-22509,-22509,-20461,-20461,8207,8207,8207,8207,8207,8207,8207,8207,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,104,4107,4107,4107,4107,4107,4107,4107,4107,4107,4107,4107,4107,4107,4107,4107,4107,4107,4107,4107,4107,4107,4107,4107,4107,4107,4107,4107,4107,4107,4107,4107,4107,266,266,266,266,266,266,266,266,266,266,266,266,266,266,266,266,266,266,266,266,266,266,266,266,266,266,266,266,266,266,266,266,298,298,298,298,298,298,298,298,298,298,298,298,298,298,298,298,298,298,298,298,298,298,298,298,298,298,298,298,298,298,298,298,524,524,524,524,524,524,524,524,524,524,524,524,524,524,524,524,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,556,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,136,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,168,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,460,492,492,492,492,492,492,492,492,492,492,492,492,492,492,492,492,2059,2059,2059,2059,2059,2059,2059,2059,2059,2059,2059,2059,2059,2059,2059,2059,2059,2059,2059,2059,2059,2059,2059,2059,2059,2059,2059,2059,2059,2059,2059,2059,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232,232],t.t)
B.mg=s([40,1151,1723,1874,2103,2019,1628,1777,2226,2137],t.t)
B.lI=s([192,469,1296,1308,1849,1794,1781,1703,1713,1522],t.t)
B.iD=s([142,910,762,1684,1849,1576,1460,1305,1801,1657],t.t)
B.jU=s([559,641,1370,421,1182,1569,1612,1725,863,1007],t.t)
B.mq=s([299,1059,1256,1108,636,1068,1581,1883,869,1142],t.t)
B.k2=s([277,1111,707,1362,1089,672,1603,1541,1545,1291],t.t)
B.kI=s([214,781,1609,1303,1632,2229,726,1560,1713,918],t.t)
B.iq=s([152,1037,1046,1759,1983,2174,1358,742,1740,1390],t.t)
B.mB=s([512,1046,1420,753,752,1297,1486,1613,460,1207],t.t)
B.nR=s([424,827,1362,719,1462,1202,1199,1476,1199,538],t.t)
B.kx=s([B.mg,B.lI,B.iD,B.jU,B.mq,B.k2,B.kI,B.iq,B.mB,B.nR],t.S)
B.mc=s([240,402,1134,1491,1659,1505,1517,1555,1979,2099],t.t)
B.mI=s([467,242,960,1232,1714,1620,1834,1570,1676,1391],t.t)
B.k9=s([500,455,463,1507,1699,1282,1564,982,2114,2114],t.t)
B.jt=s([672,643,1372,331,1589,1667,1453,1938,996,876],t.t)
B.fZ=s([458,783,1037,911,738,968,1165,1518,859,1033],t.t)
B.iV=s([504,815,504,1139,1219,719,1506,1085,1268,1268],t.t)
B.lj=s([333,630,1445,1239,1883,3672,799,1548,1865,598],t.t)
B.lG=s([399,644,746,1342,1856,1350,1493,613,1855,1015],t.t)
B.ju=s([622,749,1205,608,1066,1408,1290,1406,546,971],t.t)
B.oa=s([500,753,1041,668,1230,1617,1297,1425,1383,523],t.t)
B.mK=s([B.mc,B.mI,B.k9,B.jt,B.fZ,B.iV,B.lj,B.lG,B.ju,B.oa],t.S)
B.fS=s([394,553,523,1502,1536,981,1608,1142,1666,2181],t.t)
B.mb=s([655,430,375,1411,1861,1220,1677,1135,1978,1553],t.t)
B.o9=s([690,640,245,1954,2070,1194,1528,982,1972,2232],t.t)
B.k_=s([559,834,741,867,1131,980,1225,852,1092,784],t.t)
B.kq=s([690,875,516,959,673,894,1056,1190,1528,1126],t.t)
B.kh=s([740,951,384,1277,1177,492,1579,1155,1846,1513],t.t)
B.ox=s([323,775,1062,1776,3062,1274,813,1188,1372,655],t.t)
B.ky=s([488,971,484,1767,1515,1775,1115,503,1539,1461],t.t)
B.kB=s([740,1006,998,709,851,1230,1337,788,741,721],t.t)
B.m0=s([522,1073,573,1045,1346,887,1046,1146,1203,697],t.t)
B.ms=s([B.fS,B.mb,B.o9,B.k_,B.kq,B.kh,B.ox,B.ky,B.kB,B.m0],t.S)
B.f9=s([105,864,1442,1009,1934,1840,1519,1920,1673,1579],t.t)
B.nF=s([534,305,1193,683,1388,2164,1802,1894,1264,1170],t.t)
B.kK=s([305,518,877,1108,1426,3215,1425,1064,1320,1242],t.t)
B.iF=s([683,732,1927,257,1493,2048,1858,1552,1055,947],t.t)
B.k0=s([394,814,1024,660,959,1556,1282,1289,893,1047],t.t)
B.kY=s([528,615,996,940,1201,635,1094,2515,803,1358],t.t)
B.jZ=s([347,614,1609,1187,3133,1345,1007,1339,1017,667],t.t)
B.od=s([218,740,878,1605,3650,3650,1345,758,1357,1617],t.t)
B.fG=s([672,750,1541,558,1257,1599,1870,2135,402,1087],t.t)
B.ki=s([592,684,1161,430,1092,1497,1475,1489,1095,822],t.t)
B.n6=s([B.f9,B.nF,B.kK,B.iF,B.k0,B.kY,B.jZ,B.od,B.fG,B.ki],t.S)
B.je=s([228,1056,1059,1368,752,982,1512,1518,987,1782],t.t)
B.fx=s([494,514,818,942,965,892,1610,1356,1048,1363],t.t)
B.kj=s([512,648,591,1042,761,991,1196,1454,1309,1463],t.t)
B.l3=s([683,749,1043,676,841,1396,1133,1138,654,939],t.t)
B.hm=s([622,1101,1126,994,361,1077,1203,1318,877,1219],t.t)
B.jB=s([631,1068,857,1650,651,477,1650,1419,828,1170],t.t)
B.jb=s([555,727,1068,1335,3127,1339,820,1331,1077,429],t.t)
B.hl=s([504,879,624,1398,889,889,1392,808,891,1406],t.t)
B.oh=s([683,1602,1289,977,578,983,1280,1708,406,1122],t.t)
B.ih=s([399,865,1433,1070,1072,764,968,1477,1223,678],t.t)
B.j8=s([B.je,B.fx,B.kj,B.l3,B.hm,B.jB,B.jb,B.hl,B.oh,B.ih],t.S)
B.mO=s([333,760,935,1638,1010,529,1646,1410,1472,2219],t.t)
B.no=s([512,494,750,1160,1215,610,1870,1868,1628,1169],t.t)
B.jJ=s([572,646,492,1934,1208,603,1580,1099,1398,1995],t.t)
B.jh=s([786,789,942,581,1018,951,1599,1207,731,768],t.t)
B.fq=s([690,1015,672,1078,582,504,1693,1438,1108,2897],t.t)
B.o5=s([768,1267,571,2005,1243,244,2881,1380,1786,1453],t.t)
B.jD=s([452,899,1293,903,1311,3100,465,1311,1319,813],t.t)
B.im=s([394,927,942,1103,1358,1104,946,593,1363,1109],t.t)
B.il=s([559,1005,1007,1016,658,1173,1021,1164,623,1028],t.t)
B.nO=s([564,796,632,1005,1014,863,2316,1268,938,764],t.t)
B.ou=s([B.mO,B.no,B.jJ,B.jh,B.fq,B.o5,B.jD,B.im,B.il,B.nO],t.S)
B.iS=s([266,606,1098,1228,1497,1243,948,1030,1734,1461],t.t)
B.i4=s([366,585,901,1060,1407,1247,876,1134,1620,1054],t.t)
B.mt=s([452,565,542,1729,1479,1479,1016,886,2938,1150],t.t)
B.nZ=s([555,1088,1533,950,1354,895,834,1019,1021,496],t.t)
B.jf=s([704,815,1193,971,973,640,1217,2214,832,578],t.t)
B.ma=s([672,1245,579,871,875,774,872,1273,1027,949],t.t)
B.iu=s([296,1134,2050,1784,1636,3425,442,1550,2076,722],t.t)
B.fb=s([342,982,1259,1846,1848,1848,622,568,1847,1052],t.t)
B.ha=s([555,1064,1304,828,746,1343,1075,1329,1078,494],t.t)
B.m8=s([288,1167,1285,1174,1639,1639,833,2254,1304,509],t.t)
B.lR=s([B.iS,B.i4,B.mt,B.nZ,B.jf,B.ma,B.iu,B.fb,B.ha,B.m8],t.S)
B.mz=s([342,719,767,1866,1757,1270,1246,550,1746,2151],t.t)
B.mP=s([483,653,694,1509,1459,1410,1218,507,1914,1266],t.t)
B.iB=s([488,757,447,2979,1813,1268,1654,539,1849,2109],t.t)
B.mN=s([522,1097,1085,851,1365,1111,851,901,961,605],t.t)
B.k6=s([709,716,841,728,736,945,941,862,2845,1057],t.t)
B.lH=s([512,1323,500,1336,1083,681,1342,717,1604,1350],t.t)
B.om=s([452,1155,1372,1900,1501,3290,311,944,1919,922],t.t)
B.iN=s([403,1520,977,2132,1733,3522,1076,276,3335,1547],t.t)
B.ob=s([559,1374,1101,615,673,2462,974,795,984,984],t.t)
B.jM=s([547,1122,1062,812,1410,951,1140,622,1268,651],t.t)
B.o3=s([B.mz,B.mP,B.iB,B.mN,B.k6,B.lH,B.om,B.iN,B.ob,B.jM],t.S)
B.mM=s([165,982,1235,938,1334,1366,1659,1578,964,1612],t.t)
B.oi=s([592,422,925,847,1139,1112,1387,2036,861,1041],t.t)
B.nu=s([403,837,732,770,941,1658,1250,809,1407,1407],t.t)
B.iM=s([896,874,1071,381,1568,1722,1437,2192,480,1035],t.t)
B.it=s([640,1098,1012,1032,684,1382,1581,2106,416,865],t.t)
B.fz=s([559,1005,819,914,710,770,1418,920,838,1435],t.t)
B.j0=s([415,1258,1245,870,1278,3067,770,1021,1287,522],t.t)
B.jL=s([406,990,601,1009,1265,1265,1267,759,1017,1277],t.t)
B.lw=s([968,1182,1329,788,1032,1292,1705,1714,203,1403],t.t)
B.hk=s([732,877,1279,471,901,1161,1545,1294,755,755],t.t)
B.kk=s([B.mM,B.oi,B.nu,B.iM,B.it,B.fz,B.j0,B.jL,B.lw,B.hk],t.S)
B.nK=s([111,931,1378,1185,1933,1648,1148,1714,1873,1307],t.t)
B.hv=s([406,414,1030,1023,1910,1404,1313,1647,1509,793],t.t)
B.m4=s([342,640,575,1088,1241,1349,1161,1350,1756,1502],t.t)
B.ii=s([559,766,1185,357,1682,1428,1329,1897,1219,802],t.t)
B.jK=s([473,909,1164,771,719,2508,1427,1432,722,782],t.t)
B.mA=s([342,892,785,1145,1150,794,1296,1550,973,1057],t.t)
B.ly=s([208,1036,1326,1343,1606,3395,815,1455,1618,712],t.t)
B.oz=s([228,928,890,1046,3499,1711,994,829,1720,1318],t.t)
B.fa=s([768,724,1058,636,991,1075,1319,1324,616,825],t.t)
B.ka=s([305,1167,1358,899,1587,1587,987,1988,1332,501],t.t)
B.nT=s([B.nK,B.hv,B.m4,B.ii,B.jK,B.mA,B.ly,B.oz,B.fa,B.ka],t.S)
B.dm=s([B.kx,B.mK,B.ms,B.n6,B.j8,B.ou,B.lR,B.o3,B.kk,B.nT],t.o)
B.mh=s([5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],t.t)
B.mk=s([0,256,256,256,256,432,618,630,731,640,640,828,901,948,1021,1101,1174,1221,1294,1042,1085,1115,1158,1202,1245,1275,1318,1337,1380,1410,1453,1497,1540,1570,1613,1280,1295,1317,1332,1358,1373,1395,1410,1454,1469,1491,1506,1532,1547,1569,1584,1601,1616,1638,1653,1679,1694,1716,1731,1775,1790,1812,1827,1853,1868,1890,1905,1727,1733,1742,1748,1759,1765,1774,1780,1800,1806,1815,1821,1832,1838,1847,1853,1878,1884,1893,1899,1910,1916,1925,1931,1951,1957,1966,1972,1983,1989,1998,2004,2027,2033,2042,2048,2059,2065,2074,2080,2100,2106,2115,2121,2132,2138,2147,2153,2178,2184,2193,2199,2210,2216,2225,2231,2251,2257,2266,2272,2283,2289,2298,2304,2168,2174,2183,2189,2200,2206,2215,2221,2241,2247,2256,2262,2273,2279,2288,2294,2319,2325,2334,2340,2351,2357,2366,2372,2392,2398,2407,2413,2424,2430,2439,2445,2468,2474,2483,2489,2500,2506,2515,2521,2541,2547,2556,2562,2573,2579,2588,2594,2619,2625,2634,2640,2651,2657,2666,2672,2692,2698,2707,2713,2724,2730,2739,2745,2540,2546,2555,2561,2572,2578,2587,2593,2613,2619,2628,2634,2645,2651,2660,2666,2691,2697,2706,2712,2723,2729,2738,2744,2764,2770,2779,2785,2796,2802,2811,2817,2840,2846,2855,2861,2872,2878,2887,2893,2913,2919,2928,2934,2945,2951,2960,2966,2991,2997,3006,3012,3023,3029,3038,3044,3064,3070,3079,3085,3096,3102,3111,3117,2981,2987,2996,3002,3013,3019,3028,3034,3054,3060,3069,3075,3086,3092,3101,3107,3132,3138,3147,3153,3164,3170,3179,3185,3205,3211,3220,3226,3237,3243,3252,3258,3281,3287,3296,3302,3313,3319,3328,3334,3354,3360,3369,3375,3386,3392,3401,3407,3432,3438,3447,3453,3464,3470,3479,3485,3505,3511,3520,3526,3537,3543,3552,3558,2816,2822,2831,2837,2848,2854,2863,2869,2889,2895,2904,2910,2921,2927,2936,2942,2967,2973,2982,2988,2999,3005,3014,3020,3040,3046,3055,3061,3072,3078,3087,3093,3116,3122,3131,3137,3148,3154,3163,3169,3189,3195,3204,3210,3221,3227,3236,3242,3267,3273,3282,3288,3299,3305,3314,3320,3340,3346,3355,3361,3372,3378,3387,3393,3257,3263,3272,3278,3289,3295,3304,3310,3330,3336,3345,3351,3362,3368,3377,3383,3408,3414,3423,3429,3440,3446,3455,3461,3481,3487,3496,3502,3513,3519,3528,3534,3557,3563,3572,3578,3589,3595,3604,3610,3630,3636,3645,3651,3662,3668,3677,3683,3708,3714,3723,3729,3740,3746,3755,3761,3781,3787,3796,3802,3813,3819,3828,3834,3629,3635,3644,3650,3661,3667,3676,3682,3702,3708,3717,3723,3734,3740,3749,3755,3780,3786,3795,3801,3812,3818,3827,3833,3853,3859,3868,3874,3885,3891,3900,3906,3929,3935,3944,3950,3961,3967,3976,3982,4002,4008,4017,4023,4034,4040,4049,4055,4080,4086,4095,4101,4112,4118,4127,4133,4153,4159,4168,4174,4185,4191,4200,4206,4070,4076,4085,4091,4102,4108,4117,4123,4143,4149,4158,4164,4175,4181,4190,4196,4221,4227,4236,4242,4253,4259,4268,4274,4294,4300,4309,4315,4326,4332,4341,4347,4370,4376,4385,4391,4402,4408,4417,4423,4443,4449,4458,4464,4475,4481,4490,4496,4521,4527,4536,4542,4553,4559,4568,4574,4594,4600,4609,4615,4626,4632,4641,4647,3515,3521,3530,3536,3547,3553,3562,3568,3588,3594,3603,3609,3620,3626,3635,3641,3666,3672,3681,3687,3698,3704,3713,3719,3739,3745,3754,3760,3771,3777,3786,3792,3815,3821,3830,3836,3847,3853,3862,3868,3888,3894,3903,3909,3920,3926,3935,3941,3966,3972,3981,3987,3998,4004,4013,4019,4039,4045,4054,4060,4071,4077,4086,4092,3956,3962,3971,3977,3988,3994,4003,4009,4029,4035,4044,4050,4061,4067,4076,4082,4107,4113,4122,4128,4139,4145,4154,4160,4180,4186,4195,4201,4212,4218,4227,4233,4256,4262,4271,4277,4288,4294,4303,4309,4329,4335,4344,4350,4361,4367,4376,4382,4407,4413,4422,4428,4439,4445,4454,4460,4480,4486,4495,4501,4512,4518,4527,4533,4328,4334,4343,4349,4360,4366,4375,4381,4401,4407,4416,4422,4433,4439,4448,4454,4479,4485,4494,4500,4511,4517,4526,4532,4552,4558,4567,4573,4584,4590,4599,4605,4628,4634,4643,4649,4660,4666,4675,4681,4701,4707,4716,4722,4733,4739,4748,4754,4779,4785,4794,4800,4811,4817,4826,4832,4852,4858,4867,4873,4884,4890,4899,4905,4769,4775,4784,4790,4801,4807,4816,4822,4842,4848,4857,4863,4874,4880,4889,4895,4920,4926,4935,4941,4952,4958,4967,4973,4993,4999,5008,5014,5025,5031,5040,5046,5069,5075,5084,5090,5101,5107,5116,5122,5142,5148,5157,5163,5174,5180,5189,5195,5220,5226,5235,5241,5252,5258,5267,5273,5293,5299,5308,5314,5325,5331,5340,5346,4604,4610,4619,4625,4636,4642,4651,4657,4677,4683,4692,4698,4709,4715,4724,4730,4755,4761,4770,4776,4787,4793,4802,4808,4828,4834,4843,4849,4860,4866,4875,4881,4904,4910,4919,4925,4936,4942,4951,4957,4977,4983,4992,4998,5009,5015,5024,5030,5055,5061,5070,5076,5087,5093,5102,5108,5128,5134,5143,5149,5160,5166,5175,5181,5045,5051,5060,5066,5077,5083,5092,5098,5118,5124,5133,5139,5150,5156,5165,5171,5196,5202,5211,5217,5228,5234,5243,5249,5269,5275,5284,5290,5301,5307,5316,5322,5345,5351,5360,5366,5377,5383,5392,5398,5418,5424,5433,5439,5450,5456,5465,5471,5496,5502,5511,5517,5528,5534,5543,5549,5569,5575,5584,5590,5601,5607,5616,5622,5417,5423,5432,5438,5449,5455,5464,5470,5490,5496,5505,5511,5522,5528,5537,5543,5568,5574,5583,5589,5600,5606,5615,5621,5641,5647,5656,5662,5673,5679,5688,5694,5717,5723,5732,5738,5749,5755,5764,5770,5790,5796,5805,5811,5822,5828,5837,5843,5868,5874,5883,5889,5900,5906,5915,5921,5941,5947,5956,5962,5973,5979,5988,5994,5858,5864,5873,5879,5890,5896,5905,5911,5931,5937,5946,5952,5963,5969,5978,5984,6009,6015,6024,6030,6041,6047,6056,6062,6082,6088,6097,6103,6114,6120,6129,6135,6158,6164,6173,6179,6190,6196,6205,6211,6231,6237,6246,6252,6263,6269,6278,6284,6309,6315,6324,6330,6341,6347,6356,6362,6382,6388,6397,6403,6414,6420,6429,6435,3515,3521,3530,3536,3547,3553,3562,3568,3588,3594,3603,3609,3620,3626,3635,3641,3666,3672,3681,3687,3698,3704,3713,3719,3739,3745,3754,3760,3771,3777,3786,3792,3815,3821,3830,3836,3847,3853,3862,3868,3888,3894,3903,3909,3920,3926,3935,3941,3966,3972,3981,3987,3998,4004,4013,4019,4039,4045,4054,4060,4071,4077,4086,4092,3956,3962,3971,3977,3988,3994,4003,4009,4029,4035,4044,4050,4061,4067,4076,4082,4107,4113,4122,4128,4139,4145,4154,4160,4180,4186,4195,4201,4212,4218,4227,4233,4256,4262,4271,4277,4288,4294,4303,4309,4329,4335,4344,4350,4361,4367,4376,4382,4407,4413,4422,4428,4439,4445,4454,4460,4480,4486,4495,4501,4512,4518,4527,4533,4328,4334,4343,4349,4360,4366,4375,4381,4401,4407,4416,4422,4433,4439,4448,4454,4479,4485,4494,4500,4511,4517,4526,4532,4552,4558,4567,4573,4584,4590,4599,4605,4628,4634,4643,4649,4660,4666,4675,4681,4701,4707,4716,4722,4733,4739,4748,4754,4779,4785,4794,4800,4811,4817,4826,4832,4852,4858,4867,4873,4884,4890,4899,4905,4769,4775,4784,4790,4801,4807,4816,4822,4842,4848,4857,4863,4874,4880,4889,4895,4920,4926,4935,4941,4952,4958,4967,4973,4993,4999,5008,5014,5025,5031,5040,5046,5069,5075,5084,5090,5101,5107,5116,5122,5142,5148,5157,5163,5174,5180,5189,5195,5220,5226,5235,5241,5252,5258,5267,5273,5293,5299,5308,5314,5325,5331,5340,5346,4604,4610,4619,4625,4636,4642,4651,4657,4677,4683,4692,4698,4709,4715,4724,4730,4755,4761,4770,4776,4787,4793,4802,4808,4828,4834,4843,4849,4860,4866,4875,4881,4904,4910,4919,4925,4936,4942,4951,4957,4977,4983,4992,4998,5009,5015,5024,5030,5055,5061,5070,5076,5087,5093,5102,5108,5128,5134,5143,5149,5160,5166,5175,5181,5045,5051,5060,5066,5077,5083,5092,5098,5118,5124,5133,5139,5150,5156,5165,5171,5196,5202,5211,5217,5228,5234,5243,5249,5269,5275,5284,5290,5301,5307,5316,5322,5345,5351,5360,5366,5377,5383,5392,5398,5418,5424,5433,5439,5450,5456,5465,5471,5496,5502,5511,5517,5528,5534,5543,5549,5569,5575,5584,5590,5601,5607,5616,5622,5417,5423,5432,5438,5449,5455,5464,5470,5490,5496,5505,5511,5522,5528,5537,5543,5568,5574,5583,5589,5600,5606,5615,5621,5641,5647,5656,5662,5673,5679,5688,5694,5717,5723,5732,5738,5749,5755,5764,5770,5790,5796,5805,5811,5822,5828,5837,5843,5868,5874,5883,5889,5900,5906,5915,5921,5941,5947,5956,5962,5973,5979,5988,5994,5858,5864,5873,5879,5890,5896,5905,5911,5931,5937,5946,5952,5963,5969,5978,5984,6009,6015,6024,6030,6041,6047,6056,6062,6082,6088,6097,6103,6114,6120,6129,6135,6158,6164,6173,6179,6190,6196,6205,6211,6231,6237,6246,6252,6263,6269,6278,6284,6309,6315,6324,6330,6341,6347,6356,6362,6382,6388,6397,6403,6414,6420,6429,6435,5303,5309,5318,5324,5335,5341,5350,5356,5376,5382,5391,5397,5408,5414,5423,5429,5454,5460,5469,5475,5486,5492,5501,5507,5527,5533,5542,5548,5559,5565,5574,5580,5603,5609,5618,5624,5635,5641,5650,5656,5676,5682,5691,5697,5708,5714,5723,5729,5754,5760,5769,5775,5786,5792,5801,5807,5827,5833,5842,5848,5859,5865,5874,5880,5744,5750,5759,5765,5776,5782,5791,5797,5817,5823,5832,5838,5849,5855,5864,5870,5895,5901,5910,5916,5927,5933,5942,5948,5968,5974,5983,5989,6000,6006,6015,6021,6044,6050,6059,6065,6076,6082,6091,6097,6117,6123,6132,6138,6149,6155,6164,6170,6195,6201,6210,6216,6227,6233,6242,6248,6268,6274,6283,6289,6300,6306,6315,6321,6116,6122,6131,6137,6148,6154,6163,6169,6189,6195,6204,6210,6221,6227,6236,6242,6267,6273,6282,6288,6299,6305,6314,6320,6340,6346,6355,6361,6372,6378,6387,6393,6416,6422,6431,6437,6448,6454,6463,6469,6489,6495,6504,6510,6521,6527,6536,6542,6567,6573,6582,6588,6599,6605,6614,6620,6640,6646,6655,6661,6672,6678,6687,6693,6557,6563,6572,6578,6589,6595,6604,6610,6630,6636,6645,6651,6662,6668,6677,6683,6708,6714,6723,6729,6740,6746,6755,6761,6781,6787,6796,6802,6813,6819,6828,6834,6857,6863,6872,6878,6889,6895,6904,6910,6930,6936,6945,6951,6962,6968,6977,6983,7008,7014,7023,7029,7040,7046,7055,7061,7081,7087,7096,7102,7113,7119,7128,7134,6392,6398,6407,6413,6424,6430,6439,6445,6465,6471,6480,6486,6497,6503,6512,6518,6543,6549,6558,6564,6575,6581,6590,6596,6616,6622,6631,6637,6648,6654,6663,6669,6692,6698,6707,6713,6724,6730,6739,6745,6765,6771,6780,6786,6797,6803,6812,6818,6843,6849,6858,6864,6875,6881,6890,6896,6916,6922,6931,6937,6948,6954,6963,6969,6833,6839,6848,6854,6865,6871,6880,6886,6906,6912,6921,6927,6938,6944,6953,6959,6984,6990,6999,7005,7016,7022,7031,7037,7057,7063,7072,7078,7089,7095,7104,7110,7133,7139,7148,7154,7165,7171,7180,7186,7206,7212,7221,7227,7238,7244,7253,7259,7284,7290,7299,7305,7316,7322,7331,7337,7357,7363,7372,7378,7389,7395,7404,7410,7205,7211,7220,7226,7237,7243,7252,7258,7278,7284,7293,7299,7310,7316,7325,7331,7356,7362,7371,7377,7388,7394,7403,7409,7429,7435,7444,7450,7461,7467,7476,7482,7505,7511,7520,7526,7537,7543,7552,7558,7578,7584,7593,7599,7610,7616,7625,7631,7656,7662,7671,7677,7688,7694,7703,7709,7729,7735,7744,7750,7761],t.t)
B.K=s([0,1,2,3,6,4,5,6,6,6,6,6,6,6,6,7,0],t.t)
B.oO=new A.ct(0,"none")
B.oP=new A.ct(1,"sub")
B.oQ=new A.ct(2,"up")
B.oR=new A.ct(3,"average")
B.oS=new A.ct(4,"paeth")
B.b7=s([B.oO,B.oP,B.oQ,B.oR,B.oS],A.X("p<ct>"))
B.M=s([0,1996959894,3993919788,2567524794,124634137,1886057615,3915621685,2657392035,249268274,2044508324,3772115230,2547177864,162941995,2125561021,3887607047,2428444049,498536548,1789927666,4089016648,2227061214,450548861,1843258603,4107580753,2211677639,325883990,1684777152,4251122042,2321926636,335633487,1661365465,4195302755,2366115317,997073096,1281953886,3579855332,2724688242,1006888145,1258607687,3524101629,2768942443,901097722,1119000684,3686517206,2898065728,853044451,1172266101,3705015759,2882616665,651767980,1373503546,3369554304,3218104598,565507253,1454621731,3485111705,3099436303,671266974,1594198024,3322730930,2970347812,795835527,1483230225,3244367275,3060149565,1994146192,31158534,2563907772,4023717930,1907459465,112637215,2680153253,3904427059,2013776290,251722036,2517215374,3775830040,2137656763,141376813,2439277719,3865271297,1802195444,476864866,2238001368,4066508878,1812370925,453092731,2181625025,4111451223,1706088902,314042704,2344532202,4240017532,1658658271,366619977,2362670323,4224994405,1303535960,984961486,2747007092,3569037538,1256170817,1037604311,2765210733,3554079995,1131014506,879679996,2909243462,3663771856,1141124467,855842277,2852801631,3708648649,1342533948,654459306,3188396048,3373015174,1466479909,544179635,3110523913,3462522015,1591671054,702138776,2966460450,3352799412,1504918807,783551873,3082640443,3233442989,3988292384,2596254646,62317068,1957810842,3939845945,2647816111,81470997,1943803523,3814918930,2489596804,225274430,2053790376,3826175755,2466906013,167816743,2097651377,4027552580,2265490386,503444072,1762050814,4150417245,2154129355,426522225,1852507879,4275313526,2312317920,282753626,1742555852,4189708143,2394877945,397917763,1622183637,3604390888,2714866558,953729732,1340076626,3518719985,2797360999,1068828381,1219638859,3624741850,2936675148,906185462,1090812512,3747672003,2825379669,829329135,1181335161,3412177804,3160834842,628085408,1382605366,3423369109,3138078467,570562233,1426400815,3317316542,2998733608,733239954,1555261956,3268935591,3050360625,752459403,1541320221,2607071920,3965973030,1969922972,40735498,2617837225,3943577151,1913087877,83908371,2512341634,3803740692,2075208622,213261112,2463272603,3855990285,2094854071,198958881,2262029012,4057260610,1759359992,534414190,2176718541,4139329115,1873836001,414664567,2282248934,4279200368,1711684554,285281116,2405801727,4167216745,1634467795,376229701,2685067896,3608007406,1308918612,956543938,2808555105,3495958263,1231636301,1047427035,2932959818,3654703836,1088359270,936918e3,2847714899,3736837829,1202900863,817233897,3183342108,3401237130,1404277552,615818150,3134207493,3453421203,1423857449,601450431,3009837614,3294710456,1567103746,711928724,3020668471,3272380065,1510334235,755167117],t.t)
B.mV=s([55,122,188,175,39,28],t.t)
B.N=s([0,1,3,7,15,31,63,127,255],t.t)
B.b8=s([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],t.t)
B.H=s([255,255,255,255,255,255,255,255,255,255,255],t.t)
B.ar=s([B.H,B.H,B.H],t.S)
B.kr=s([176,246,255,255,255,255,255,255,255,255,255],t.t)
B.o4=s([223,241,252,255,255,255,255,255,255,255,255],t.t)
B.i6=s([249,253,253,255,255,255,255,255,255,255,255],t.t)
B.kN=s([B.kr,B.o4,B.i6],t.S)
B.jT=s([255,244,252,255,255,255,255,255,255,255,255],t.t)
B.jz=s([234,254,254,255,255,255,255,255,255,255,255],t.t)
B.dt=s([253,255,255,255,255,255,255,255,255,255,255],t.t)
B.ik=s([B.jT,B.jz,B.dt],t.S)
B.nH=s([255,246,254,255,255,255,255,255,255,255,255],t.t)
B.lY=s([239,253,254,255,255,255,255,255,255,255,255],t.t)
B.dp=s([254,255,254,255,255,255,255,255,255,255,255],t.t)
B.mX=s([B.nH,B.lY,B.dp],t.S)
B.d7=s([255,248,254,255,255,255,255,255,255,255,255],t.t)
B.iQ=s([251,255,254,255,255,255,255,255,255,255,255],t.t)
B.lm=s([B.d7,B.iQ,B.H],t.S)
B.bD=s([255,253,254,255,255,255,255,255,255,255,255],t.t)
B.li=s([251,254,254,255,255,255,255,255,255,255,255],t.t)
B.j_=s([B.bD,B.li,B.dp],t.S)
B.h2=s([255,254,253,255,254,255,255,255,255,255,255],t.t)
B.jP=s([250,255,254,255,254,255,255,255,255,255,255],t.t)
B.b6=s([254,255,255,255,255,255,255,255,255,255,255],t.t)
B.kf=s([B.h2,B.jP,B.b6],t.S)
B.jq=s([B.ar,B.kN,B.ik,B.mX,B.lm,B.j_,B.kf,B.ar],t.o)
B.fA=s([217,255,255,255,255,255,255,255,255,255,255],t.t)
B.kn=s([225,252,241,253,255,255,254,255,255,255,255],t.t)
B.mj=s([234,250,241,250,253,255,253,254,255,255,255],t.t)
B.nc=s([B.fA,B.kn,B.mj],t.S)
B.bM=s([255,254,255,255,255,255,255,255,255,255,255],t.t)
B.i9=s([223,254,254,255,255,255,255,255,255,255,255],t.t)
B.hM=s([238,253,254,254,255,255,255,255,255,255,255],t.t)
B.lV=s([B.bM,B.i9,B.hM],t.S)
B.jE=s([249,254,255,255,255,255,255,255,255,255,255],t.t)
B.nD=s([B.d7,B.jE,B.H],t.S)
B.nf=s([255,253,255,255,255,255,255,255,255,255,255],t.t)
B.lh=s([247,254,255,255,255,255,255,255,255,255,255],t.t)
B.l6=s([B.nf,B.lh,B.H],t.S)
B.hE=s([252,255,255,255,255,255,255,255,255,255,255],t.t)
B.fR=s([B.bD,B.hE,B.H],t.S)
B.dv=s([255,254,254,255,255,255,255,255,255,255,255],t.t)
B.hK=s([B.dv,B.dt,B.H],t.S)
B.lS=s([255,254,253,255,255,255,255,255,255,255,255],t.t)
B.d9=s([250,255,255,255,255,255,255,255,255,255,255],t.t)
B.hC=s([B.lS,B.d9,B.b6],t.S)
B.h5=s([B.nc,B.lV,B.nD,B.l6,B.fR,B.hK,B.hC,B.ar],t.o)
B.mw=s([186,251,250,255,255,255,255,255,255,255,255],t.t)
B.iL=s([234,251,244,254,255,255,255,255,255,255,255],t.t)
B.mY=s([251,251,243,253,254,255,254,255,255,255,255],t.t)
B.iY=s([B.mw,B.iL,B.mY],t.S)
B.iT=s([236,253,254,255,255,255,255,255,255,255,255],t.t)
B.lP=s([251,253,253,254,254,255,255,255,255,255,255],t.t)
B.k1=s([B.bD,B.iT,B.lP],t.S)
B.mC=s([254,254,254,255,255,255,255,255,255,255,255],t.t)
B.iO=s([B.dv,B.mC,B.H],t.S)
B.n2=s([254,254,255,255,255,255,255,255,255,255,255],t.t)
B.iR=s([B.bM,B.n2,B.b6],t.S)
B.dw=s([B.H,B.b6,B.H],t.S)
B.h3=s([B.iY,B.k1,B.iO,B.iR,B.dw,B.ar,B.ar,B.ar],t.o)
B.jN=s([248,255,255,255,255,255,255,255,255,255,255],t.t)
B.j9=s([250,254,252,254,255,255,255,255,255,255,255],t.t)
B.iI=s([248,254,249,253,255,255,255,255,255,255,255],t.t)
B.k5=s([B.jN,B.j9,B.iI],t.S)
B.h0=s([255,253,253,255,255,255,255,255,255,255,255],t.t)
B.nk=s([246,253,253,255,255,255,255,255,255,255,255],t.t)
B.iZ=s([252,254,251,254,254,255,255,255,255,255,255],t.t)
B.nj=s([B.h0,B.nk,B.iZ],t.S)
B.or=s([255,254,252,255,255,255,255,255,255,255,255],t.t)
B.iG=s([248,254,253,255,255,255,255,255,255,255,255],t.t)
B.hB=s([253,255,254,254,255,255,255,255,255,255,255],t.t)
B.ls=s([B.or,B.iG,B.hB],t.S)
B.of=s([255,251,254,255,255,255,255,255,255,255,255],t.t)
B.kW=s([245,251,254,255,255,255,255,255,255,255,255],t.t)
B.l_=s([253,253,254,255,255,255,255,255,255,255,255],t.t)
B.i_=s([B.of,B.kW,B.l_],t.S)
B.i3=s([255,251,253,255,255,255,255,255,255,255,255],t.t)
B.jV=s([252,253,254,255,255,255,255,255,255,255,255],t.t)
B.mL=s([B.i3,B.jV,B.bM],t.S)
B.hx=s([255,252,255,255,255,255,255,255,255,255,255],t.t)
B.o8=s([249,255,254,255,255,255,255,255,255,255,255],t.t)
B.jd=s([255,255,254,255,255,255,255,255,255,255,255],t.t)
B.fp=s([B.hx,B.o8,B.jd],t.S)
B.ow=s([255,255,253,255,255,255,255,255,255,255,255],t.t)
B.iP=s([B.ow,B.d9,B.H],t.S)
B.hA=s([B.k5,B.nj,B.ls,B.i_,B.mL,B.fp,B.iP,B.dw],t.o)
B.dq=s([B.jq,B.h5,B.h3,B.hA],t.hc)
B.dY=new A.am(1,"rle8")
B.e2=new A.am(2,"rle4")
B.e3=new A.am(4,"jpeg")
B.e4=new A.am(5,"png")
B.e5=new A.am(7,"reserved7")
B.e6=new A.am(8,"reserved8")
B.e7=new A.am(9,"reserved9")
B.dZ=new A.am(10,"reserved10")
B.e_=new A.am(11,"cmyk")
B.e0=new A.am(12,"cmykRle8")
B.e1=new A.am(13,"cmykRle4")
B.b9=s([B.bZ,B.dY,B.e2,B.be,B.e3,B.e4,B.bf,B.e5,B.e6,B.e7,B.dZ,B.e_,B.e0,B.e1],A.X("p<am>"))
B.dr=s([null,A.yY(),A.z_(),A.yW()],A.X("p<~(af,h,h,h,af)?>"))
B.aq=s([0,128,192,224,240,248,252,254,255],t.t)
B.bK=s([137,80,78,71,13,10,26,10],t.t)
B.bL=s([1536,1540,1544,1548,1552,1556,1560,1564,1664,1668],t.t)
B.aF=s([0,1,3,7,15,31,63,127,255,511,1023,2047,4095,8191,16383,32767,65535,131071,262143,524287,1048575,2097151,4194303,8388607,16777215,33554431,67108863,134217727,268435455,536870911,1073741823,2147483647,4294967295],t.t)
B.ds=s([3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258],t.t)
B.nn=s([1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],t.t)
B.dU=new A.dd(0,"predictor")
B.pO=new A.dd(1,"crossColor")
B.pP=new A.dd(2,"subtractGreen")
B.dV=new A.dd(3,"colorIndexing")
B.du=s([B.dU,B.pO,B.pP,B.dV],A.X("p<dd>"))
B.I=s([0,17,34,51,68,85,102,119,136,153,170,187,204,221,238,255],t.t)
B.fv=s([1,0],t.t)
B.hJ=s([7,1],t.t)
B.ft=s([15,5],t.t)
B.fs=s([15,13],t.t)
B.cO=s([51,3],t.t)
B.aW=s([51,35],t.t)
B.a_=s([211,19],t.t)
B.A=s([211,147],t.t)
B.j=s([339,83],t.t)
B.fO=s([339,339],t.t)
B.dx=s([B.fv,B.hJ,B.ft,B.fs,B.cO,B.cO,B.aW,B.aW,B.aW,B.aW,B.a_,B.a_,B.a_,B.a_,B.a_,B.a_,B.a_,B.a_,B.A,B.A,B.A,B.A,B.A,B.A,B.A,B.A,B.A,B.A,B.A,B.A,B.A,B.A,B.A,B.A,B.j,B.j,B.j,B.j,B.j,B.j,B.j,B.j,B.j,B.j,B.j,B.j,B.j,B.j,B.j,B.j,B.j,B.j,B.j,B.j,B.j,B.j,B.j,B.j,B.j,B.j,B.j,B.j,B.j,B.j,B.j,B.j,B.fO],t.S)
B.nP=s([73,67,67,95,80,82,79,70,73,76,69,0],t.t)
B.dy=s([A.yx(),A.yr(),A.yH(),A.yF(),A.yz(),A.yy(),A.yA()],t.B)
B.p=s([0,4,8,12,128,132,136,140,256,260,264,268,384,388,392,396],t.t)
B.dz=s([null,A.yZ(),A.z0(),A.yX()],A.X("p<~(h,h,h,h,h,af)?>"))
B.ba=s([0,36,72,109,145,182,218,255],t.t)
B.C=s([0,8,16,24,32,41,49,57,65,74,82,90,98,106,115,123,131,139,148,156,164,172,180,189,197,205,213,222,230,238,246,255],t.t)
B.o7=s([8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,8,8,8,8,8,8,8,8],t.t)
B.oU=new A.bp(0,"bitmap")
B.dL=new A.bp(1,"grayscale")
B.oV=new A.bp(2,"indexed")
B.dM=new A.bp(3,"rgb")
B.dN=new A.bp(4,"cmyk")
B.oW=new A.bp(5,"multiChannel")
B.oX=new A.bp(6,"duoTone")
B.dO=new A.bp(7,"lab")
B.dA=s([B.oU,B.dL,B.oV,B.dM,B.dN,B.oW,B.oX,B.dO],A.X("p<bp>"))
B.eR=new A.bl(7,"folder")
B.cf=new A.C(B.eR,"","inode/directory",39,"folder")
B.ok=s([B.G,B.a7,B.Q,B.az,B.aO,B.X,B.aM,B.ae,B.bn,B.a8,B.aN,B.bs,B.ck,B.br,B.ce,B.ch,B.ay,B.a6,B.cm,B.bq,B.bj,B.cg,B.bu,B.P,B.bl,B.aR,B.aQ,B.aA,B.cj,B.bp,B.bv,B.bt,B.aP,B.aB,B.cn,B.cl,B.bm,B.bo,B.ci,B.cf,B.bk],t.eC)
B.dB=s([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0],t.t)
B.os=s([8,8,9,10,12,13,15,17,18,20,21,23,24,26,27,29,31,32,34,35,37,38,40,41,43,44,46,48,49,51,52,54,55,57,58,60,62,63,65,66,68,69,71,72,74,75,77,79,80,82,83,85,86,88,89,93,96,99,102,105,108,111,114,117,120,124,127,130,133,136,139,142,145,148,151,155,158,161,164,167,170,173,176,179,184,189,193,198,203,207,212,217,221,226,230,235,240,244,249,254,258,263,268,274,280,286,292,299,305,311,317,323,330,336,342,348,354,362,370,379,385,393,401,409,416,424,432,440],t.t)
B.dC=s([0,0,1,5,1,1,1,1,1,1,0,0,0,0,0,0,0],t.t)
B.fK=s([2,6,2,6],t.t)
B.hy=s([6,2,6,2],t.t)
B.fJ=s([2,2,6,6],t.t)
B.fw=s([1,3,3,9],t.t)
B.h6=s([4,0,12,0],t.t)
B.fU=s([3,1,9,3],t.t)
B.hW=s([8,8,0,0],t.t)
B.h7=s([4,12,0,0],t.t)
B.fu=s([16,0,0,0],t.t)
B.fo=s([12,4,0,0],t.t)
B.hz=s([6,6,2,2],t.t)
B.fX=s([3,9,1,3],t.t)
B.fn=s([12,0,4,0],t.t)
B.i5=s([9,3,3,1],t.t)
B.w=s([B.cL,B.fK,B.bE,B.hy,B.fJ,B.fw,B.h6,B.fU,B.hW,B.h7,B.fu,B.fo,B.hz,B.fX,B.fn,B.i5],t.S)
B.as=s([0,-128,64,-64,32,-96,96,-32,16,-112,80,-48,48,-80,112,-16,8,-120,72,-56,40,-88,104,-24,24,-104,88,-40,56,-72,120,-8,4,-124,68,-60,36,-92,100,-28,20,-108,84,-44,52,-76,116,-12,12,-116,76,-52,44,-84,108,-20,28,-100,92,-36,60,-68,124,-4,2,-126,66,-62,34,-94,98,-30,18,-110,82,-46,50,-78,114,-14,10,-118,74,-54,42,-86,106,-22,26,-102,90,-38,58,-70,122,-6,6,-122,70,-58,38,-90,102,-26,22,-106,86,-42,54,-74,118,-10,14,-114,78,-50,46,-82,110,-18,30,-98,94,-34,62,-66,126,-2,1,-127,65,-63,33,-95,97,-31,17,-111,81,-47,49,-79,113,-15,9,-119,73,-55,41,-87,105,-23,25,-103,89,-39,57,-71,121,-7,5,-123,69,-59,37,-91,101,-27,21,-107,85,-43,53,-75,117,-11,13,-115,77,-51,45,-83,109,-19,29,-99,93,-35,61,-67,125,-3,3,-125,67,-61,35,-93,99,-29,19,-109,83,-45,51,-77,115,-13,11,-117,75,-53,43,-85,107,-21,27,-101,91,-37,59,-69,123,-5,7,-121,71,-57,39,-89,103,-25,23,-105,87,-41,55,-73,119,-9,15,-113,79,-49,47,-81,111,-17,31,-97,95,-33,63,-65,127,-1],t.t)
B.oH={ProcessingSoftware:0,SubfileType:1,OldSubfileType:2,ImageWidth:3,ImageLength:4,ImageHeight:5,BitsPerSample:6,Compression:7,PhotometricInterpretation:8,Thresholding:9,CellWidth:10,CellLength:11,FillOrder:12,DocumentName:13,ImageDescription:14,Make:15,Model:16,StripOffsets:17,Orientation:18,SamplesPerPixel:19,RowsPerStrip:20,StripByteCounts:21,MinSampleValue:22,MaxSampleValue:23,XResolution:24,YResolution:25,PlanarConfiguration:26,PageName:27,XPosition:28,YPosition:29,GrayResponseUnit:30,GrayResponseCurve:31,T4Options:32,T6Options:33,ResolutionUnit:34,PageNumber:35,ColorResponseUnit:36,TransferFunction:37,Software:38,DateTime:39,Artist:40,HostComputer:41,Predictor:42,WhitePoint:43,PrimaryChromaticities:44,ColorMap:45,HalftoneHints:46,TileWidth:47,TileLength:48,TileOffsets:49,TileByteCounts:50,BadFaxLines:51,CleanFaxData:52,ConsecutiveBadFaxLines:53,InkSet:54,InkNames:55,NumberofInks:56,DotRange:57,TargetPrinter:58,ExtraSamples:59,SampleFormat:60,SMinSampleValue:61,SMaxSampleValue:62,TransferRange:63,ClipPath:64,JPEGProc:65,JPEGInterchangeFormat:66,JPEGInterchangeFormatLength:67,YCbCrCoefficients:68,YCbCrSubSampling:69,YCbCrPositioning:70,ReferenceBlackWhite:71,ApplicationNotes:72,Rating:73,CFARepeatPatternDim:74,CFAPattern:75,BatteryLevel:76,Copyright:77,ExposureTime:78,FNumber:79,"IPTC-NAA":80,ExifOffset:81,InterColorProfile:82,ExposureProgram:83,SpectralSensitivity:84,GPSOffset:85,ISOSpeed:86,OECF:87,SensitivityType:88,RecommendedExposureIndex:89,ExifVersion:90,DateTimeOriginal:91,DateTimeDigitized:92,OffsetTime:93,OffsetTimeOriginal:94,OffsetTimeDigitized:95,ComponentsConfiguration:96,CompressedBitsPerPixel:97,ShutterSpeedValue:98,ApertureValue:99,BrightnessValue:100,ExposureBiasValue:101,MaxApertureValue:102,SubjectDistance:103,MeteringMode:104,LightSource:105,Flash:106,FocalLength:107,SubjectArea:108,MakerNote:109,UserComment:110,SubSecTime:111,SubSecTimeOriginal:112,SubSecTimeDigitized:113,XPTitle:114,XPComment:115,XPAuthor:116,XPKeywords:117,XPSubject:118,FlashPixVersion:119,ColorSpace:120,ExifImageWidth:121,ExifImageLength:122,RelatedSoundFile:123,InteroperabilityOffset:124,FlashEnergy:125,SpatialFrequencyResponse:126,FocalPlaneXResolution:127,FocalPlaneYResolution:128,FocalPlaneResolutionUnit:129,SubjectLocation:130,ExposureIndex:131,SensingMethod:132,FileSource:133,SceneType:134,CVAPattern:135,CustomRendered:136,ExposureMode:137,WhiteBalance:138,DigitalZoomRatio:139,FocalLengthIn35mmFilm:140,SceneCaptureType:141,GainControl:142,Contrast:143,Saturation:144,Sharpness:145,DeviceSettingDescription:146,SubjectDistanceRange:147,ImageUniqueID:148,CameraOwnerName:149,BodySerialNumber:150,LensSpecification:151,LensMake:152,LensModel:153,LensSerialNumber:154,Gamma:155,PrintIM:156,Padding:157,OffsetSchema:158,OwnerName:159,SerialNumber:160,InteropIndex:161,InteropVersion:162,RelatedImageFileFormat:163,RelatedImageWidth:164,RelatedImageLength:165,GPSVersionID:166,GPSLatitudeRef:167,GPSLatitude:168,GPSLongitudeRef:169,GPSLongitude:170,GPSAltitudeRef:171,GPSAltitude:172,GPSTimeStamp:173,GPSSatellites:174,GPSStatus:175,GPSMeasureMode:176,GPSDOP:177,GPSSpeedRef:178,GPSSpeed:179,GPSTrackRef:180,GPSTrack:181,GPSImgDirectionRef:182,GPSImgDirection:183,GPSMapDatum:184,GPSDestLatitudeRef:185,GPSDestLatitude:186,GPSDestLongitudeRef:187,GPSDestLongitude:188,GPSDestBearingRef:189,GPSDestBearing:190,GPSDestDistanceRef:191,GPSDestDistance:192,GPSProcessingMethod:193,GPSAreaInformation:194,GPSDate:195,GPSDifferential:196}
B.oD=new A.eC(B.oH,[11,254,255,256,257,257,258,259,262,263,264,265,266,269,270,271,272,273,274,277,278,279,280,281,282,283,284,285,286,287,290,291,292,293,296,297,300,301,305,306,315,316,317,318,319,320,321,322,323,324,325,326,327,328,332,333,334,336,337,338,339,340,341,342,343,512,513,514,529,530,531,532,700,18246,33421,33422,33423,33432,33434,33437,33723,34665,34675,34850,34852,34853,34855,34856,34864,34866,36864,36867,36868,36880,36881,36882,37121,37122,37377,37378,37379,37380,37381,37382,37383,37384,37385,37386,37396,37500,37510,37520,37521,37522,40091,40092,40093,40094,40095,40960,40961,40962,40963,40964,40965,41483,41484,41486,41487,41488,41492,41493,41495,41728,41729,41730,41985,41986,41987,41988,41989,41990,41991,41992,41993,41994,41995,41996,42016,42032,42033,42034,42035,42036,42037,42240,50341,59932,59933,65e3,65001,1,2,4096,4097,4098,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],A.X("eC<M,h>"))
B.dD=new A.bm([34665,"exif",40965,"interop",34853,"gps"],A.X("bm<h,M>"))
B.ep=new A.aK(2,"falseFloydSteinberg")
B.eq=new A.aK(3,"jarvisJudiceNinke")
B.er=new A.aK(4,"stucki")
B.es=new A.aK(5,"burkes")
B.et=new A.aK(6,"atkinson")
B.bB=s([0,0,0],t.a)
B.l2=s([B.bB,B.bB,B.bB],t.U)
B.lc=s([0.4375,1,0],t.a)
B.lb=s([0.1875,-1,1],t.a)
B.hc=s([0.3125,0,1],t.a)
B.mp=s([0.0625,1,1],t.a)
B.lQ=s([B.lc,B.lb,B.hc,B.mp],t.U)
B.jo=s([0.375,1,0],t.a)
B.ot=s([0.375,0,1],t.a)
B.nN=s([0.25,1,1],t.a)
B.hZ=s([B.jo,B.ot,B.nN],t.U)
B.f8=s([0.14583333333333334,1,0],t.a)
B.lD=s([0.10416666666666667,2,0],t.a)
B.dg=s([0.0625,-2,1],t.a)
B.mo=s([0.10416666666666667,-1,1],t.a)
B.nG=s([0.14583333333333334,0,1],t.a)
B.kw=s([0.10416666666666667,1,1],t.a)
B.dn=s([0.0625,2,1],t.a)
B.kA=s([0.020833333333333332,-2,2],t.a)
B.jg=s([0.0625,-1,2],t.a)
B.nh=s([0.10416666666666667,0,2],t.a)
B.nr=s([0.0625,1,2],t.a)
B.kb=s([0.020833333333333332,2,2],t.a)
B.lk=s([B.f8,B.lD,B.dg,B.mo,B.nG,B.kw,B.dn,B.kA,B.jg,B.nh,B.nr,B.kb],t.U)
B.n_=s([0.19047619047619047,1,0],t.a)
B.oo=s([0.09523809523809523,2,0],t.a)
B.hf=s([0.047619047619047616,-2,1],t.a)
B.j6=s([0.09523809523809523,-1,1],t.a)
B.nJ=s([0.19047619047619047,0,1],t.a)
B.k7=s([0.09523809523809523,1,1],t.a)
B.ir=s([0.047619047619047616,2,1],t.a)
B.o0=s([0.023809523809523808,-2,2],t.a)
B.nC=s([0.047619047619047616,-1,2],t.a)
B.oB=s([0.09523809523809523,0,2],t.a)
B.j1=s([0.047619047619047616,1,2],t.a)
B.ne=s([0.023809523809523808,2,2],t.a)
B.iU=s([B.n_,B.oo,B.hf,B.j6,B.nJ,B.k7,B.ir,B.o0,B.nC,B.oB,B.j1,B.ne],t.U)
B.o2=s([0.25,1,0],t.a)
B.d4=s([0.125,2,0],t.a)
B.cH=s([0.125,-1,1],t.a)
B.mi=s([0.25,0,1],t.a)
B.dh=s([0.125,1,1],t.a)
B.nX=s([B.o2,B.d4,B.dg,B.cH,B.mi,B.dh,B.dn],t.U)
B.kv=s([0.125,1,0],t.a)
B.jH=s([0.125,0,1],t.a)
B.m_=s([0.125,0,2],t.a)
B.hY=s([B.kv,B.d4,B.cH,B.jH,B.dh,B.m_],t.U)
B.oE=new A.bm([B.bi,B.l2,B.c8,B.lQ,B.ep,B.hZ,B.eq,B.lk,B.er,B.iU,B.es,B.nX,B.et,B.hY],A.X("bm<aK,q<q<l>>>"))
B.eu=new A.aK(7,"bayer2x2")
B.ew=new A.aK(9,"bayer8x8")
B.m3=s([0,0.5],t.n)
B.mx=s([0.75,0.25],t.n)
B.iA=s([B.m3,B.mx],t.x)
B.k3=s([0,0.5,0.125,0.625],t.n)
B.ol=s([0.75,0.25,0.875,0.375],t.n)
B.m5=s([0.1875,0.6875,0.0625,0.5625],t.n)
B.k8=s([0.9375,0.4375,0.8125,0.3125],t.n)
B.ho=s([B.k3,B.ol,B.m5,B.k8],t.x)
B.jO=s([0,0.5,0.125,0.625,0.03125,0.53125,0.15625,0.65625],t.n)
B.ia=s([0.75,0.25,0.875,0.375,0.78125,0.28125,0.90625,0.40625],t.n)
B.fy=s([0.1875,0.6875,0.0625,0.5625,0.21875,0.71875,0.09375,0.59375],t.n)
B.i7=s([0.9375,0.4375,0.8125,0.3125,0.96875,0.46875,0.84375,0.34375],t.n)
B.kC=s([0.046875,0.546875,0.171875,0.671875,0.015625,0.515625,0.140625,0.640625],t.n)
B.hr=s([0.796875,0.296875,0.921875,0.421875,0.765625,0.265625,0.890625,0.390625],t.n)
B.ng=s([0.234375,0.734375,0.109375,0.609375,0.203125,0.703125,0.078125,0.578125],t.n)
B.nQ=s([0.984375,0.484375,0.859375,0.359375,0.953125,0.453125,0.828125,0.328125],t.n)
B.iE=s([B.jO,B.ia,B.fy,B.i7,B.kC,B.hr,B.ng,B.nQ],t.x)
B.dE=new A.bm([B.eu,B.iA,B.ev,B.ho,B.ew,B.iE],A.X("bm<aK,q<q<D>>>"))
B.dF=new A.bm([B.L,1,B.R,3,B.S,15,B.e,255,B.u,65535,B.ab,4294967295,B.af,127,B.ag,32767,B.ah,2147483647,B.T,1,B.Y,1,B.aa,1],A.X("bm<av,h>"))
B.oT=new A.it(0,"none")
B.dH=new A.it(4,"paeth")
B.aG=new A.cu(0,"invalid")
B.dI=new A.cu(1,"pbm")
B.dJ=new A.cu(2,"pgm2")
B.bN=new A.cu(3,"pgm5")
B.dK=new A.cu(4,"ppm3")
B.bO=new A.cu(5,"ppm6")
B.pV=new A.l9(1,"neural")
B.dP=new A.bI(0,0)
B.oY=new A.bI("/DeviceGray","")
B.oZ=new A.bI("/DeviceRGB","")
B.p_=new A.bI("/DeviceCMYK"," /Decode [1 0 1 0 1 0 1 0]")
B.oG={"images-to-pdf":0}
B.p0=new A.cH(B.oG,1,t.O)
B.p1=new A.aQ([B.T,B.Y,B.aa],A.X("aQ<av>"))
B.oF={"M4A ":0,"M4B ":1,"M4P ":2}
B.p2=new A.cH(B.oF,3,t.O)
B.bP=new A.aQ([B.aR,B.aQ,B.aA],t.A)
B.p3=new A.aQ([B.cf],t.A)
B.p4=new A.aQ([12,40,52,56,64,108,124],A.X("aQ<h>"))
B.p5=new A.aQ([B.G,B.a7,B.Q,B.X,B.ae,B.a8,B.P],t.A)
B.oI={heic:0,heix:1,hevc:2,hevx:3,heim:4,heis:5,hevm:6,hevs:7}
B.p6=new A.cH(B.oI,8,t.O)
B.p7=new A.aQ([B.G,B.a7,B.Q,B.X,B.aM,B.ae,B.a8],t.A)
B.D=new A.aQ([B.P],t.A)
B.bR=new A.b8(0,"bilevel")
B.pg=new A.b8(1,"gray4bit")
B.ph=new A.b8(2,"gray")
B.pi=new A.b8(3,"grayAlpha")
B.pj=new A.b8(4,"palette")
B.dS=new A.b8(5,"rgb")
B.pk=new A.b8(6,"rgba")
B.pl=new A.b8(7,"yCbCrSub")
B.aH=new A.b8(8,"generic")
B.pm=new A.b8(9,"invalid")
B.pA=A.bw("z2")
B.pB=A.bw("tj")
B.pC=A.bw("k3")
B.pD=A.bw("hL")
B.pE=A.bw("cP")
B.pF=A.bw("f1")
B.pG=A.bw("nV")
B.pH=A.bw("S")
B.pI=A.bw("fK")
B.pJ=A.bw("bH")
B.pK=A.bw("uu")
B.pL=A.bw("af")
B.pM=new A.iS(!1)
B.pN=new A.iS(!0)
B.aI=new A.ea(0,"undefined")
B.bW=new A.ea(1,"lossy")
B.bc=new A.ea(2,"lossless")
B.pQ=new A.ea(3,"animated")
B.bd=new A.eb(0,"none")
B.pR=new A.eb(1,"partial")
B.pS=new A.eb(2,"full")
B.aJ=new A.eb(3,"finish")
B.bX=new A.ee(0,"header")
B.pT=new A.ee(1,"blocks")
B.pU=new A.ee(2,"trailer")
B.dW=new A.ee(3,"done")})();(function staticFields(){$.mo=null
$.aX=A.j([],A.X("p<S>"))
$.q0=null
$.pd=null
$.pc=null
$.ra=null
$.qZ=null
$.rj=null
$.no=null
$.ny=null
$.oL=null
$.mt=A.j([],A.X("p<q<S>?>"))
$.el=null
$.hk=null
$.hl=null
$.oB=!1
$.a8=B.U
$.cf=A.qk()
$.qX=null
$.ox=null
$.qe=!1
$.vd=A.j([A.oS(),A.yJ(),A.yO(),A.yP(),A.yQ(),A.yR(),A.yS(),A.yT(),A.yU(),A.yV(),A.yK(),A.yL(),A.yM(),A.yN(),A.oS(),A.oS()],A.X("p<h(h,bH,h)>"))
$.O=null
$.pl=A.qk()})();(function lazyInitializers(){var s=hunkHelpers.lazyFinal,r=hunkHelpers.lazy
s($,"z4","rt",()=>A.ns("_$dart_dartClosure"))
s($,"z3","oU",()=>A.ns("_$dart_dartClosure_dartJSInterop"))
s($,"zu","rJ",()=>A.e_(0))
s($,"A3","t1",()=>A.j([new J.i7()],A.X("p<fD>")))
s($,"zd","ry",()=>A.c_(A.lo({
toString:function(){return"$receiver$"}})))
s($,"ze","rz",()=>A.c_(A.lo({$method$:null,
toString:function(){return"$receiver$"}})))
s($,"zf","rA",()=>A.c_(A.lo(null)))
s($,"zg","rB",()=>A.c_(function(){var $argumentsExpr$="$arguments$"
try{null.$method$($argumentsExpr$)}catch(q){return q.message}}()))
s($,"zj","rE",()=>A.c_(A.lo(void 0)))
s($,"zk","rF",()=>A.c_(function(){var $argumentsExpr$="$arguments$"
try{(void 0).$method$($argumentsExpr$)}catch(q){return q.message}}()))
s($,"zi","rD",()=>A.c_(A.q9(null)))
s($,"zh","rC",()=>A.c_(function(){try{null.$method$}catch(q){return q.message}}()))
s($,"zm","rH",()=>A.c_(A.q9(void 0)))
s($,"zl","rG",()=>A.c_(function(){try{(void 0).$method$}catch(q){return q.message}}()))
s($,"zt","oZ",()=>A.vp())
s($,"zA","rP",()=>A.e_(4096))
s($,"zy","rN",()=>new A.mD().$0())
s($,"zz","rO",()=>new A.mC().$0())
s($,"zW","jI",()=>A.oP(B.pH))
s($,"z5","ru",()=>A.tk(B.v.gt(A.u5(A.j([1],t.t))),0,null).getInt8(0)===1?B.c_:B.ea)
s($,"zx","rM",()=>A.os(B.b0,B.bC,257,286,15))
s($,"zw","rL",()=>A.os(B.d6,B.an,0,30,15))
s($,"zv","rK",()=>A.os(null,B.fL,0,19,7))
s($,"z7","rw",()=>A.nT(B.o7,!1))
s($,"z6","rv",()=>A.nT(B.mh,!1))
s($,"Aa","nJ",()=>{var q=null,p="ISOSpeed"
return A.tW([11,A.i("ProcessingSoftware",B.m,q),254,A.i("SubfileType",B.z,1),255,A.i("OldSubfileType",B.z,1),256,A.i("ImageWidth",B.z,1),257,A.i("ImageLength",B.z,1),258,A.i("BitsPerSample",B.k,1),259,A.i("Compression",B.k,1),262,A.i("PhotometricInterpretation",B.k,1),263,A.i("Thresholding",B.k,1),264,A.i("CellWidth",B.k,1),265,A.i("CellLength",B.k,1),266,A.i("FillOrder",B.k,1),269,A.i("DocumentName",B.m,q),270,A.i("ImageDescription",B.m,q),271,A.i("Make",B.m,q),272,A.i("Model",B.m,q),273,A.i("StripOffsets",B.z,q),274,A.i("Orientation",B.k,1),277,A.i("SamplesPerPixel",B.k,1),278,A.i("RowsPerStrip",B.z,1),279,A.i("StripByteCounts",B.z,1),280,A.i("MinSampleValue",B.k,1),281,A.i("MaxSampleValue",B.k,1),282,A.i("XResolution",B.E,1),283,A.i("YResolution",B.E,1),284,A.i("PlanarConfiguration",B.k,1),285,A.i("PageName",B.m,q),286,A.i("XPosition",B.E,1),287,A.i("YPosition",B.E,1),290,A.i("GrayResponseUnit",B.k,1),291,A.i("GrayResponseCurve",B.f,q),292,A.i("T4Options",B.f,q),293,A.i("T6Options",B.f,q),296,A.i("ResolutionUnit",B.k,1),297,A.i("PageNumber",B.k,2),300,A.i("ColorResponseUnit",B.f,q),301,A.i("TransferFunction",B.k,768),305,A.i("Software",B.m,q),306,A.i("DateTime",B.m,q),315,A.i("Artist",B.m,q),316,A.i("HostComputer",B.m,q),317,A.i("Predictor",B.k,1),318,A.i("WhitePoint",B.E,2),319,A.i("PrimaryChromaticities",B.E,6),320,A.i("ColorMap",B.k,q),321,A.i("HalftoneHints",B.k,2),322,A.i("TileWidth",B.z,1),323,A.i("TileLength",B.z,1),324,A.i("TileOffsets",B.z,q),325,A.i("TileByteCounts",B.f,q),326,A.i("BadFaxLines",B.f,q),327,A.i("CleanFaxData",B.f,q),328,A.i("ConsecutiveBadFaxLines",B.f,q),332,A.i("InkSet",B.f,q),333,A.i("InkNames",B.f,q),334,A.i("NumberofInks",B.f,q),336,A.i("DotRange",B.f,q),337,A.i("TargetPrinter",B.m,q),338,A.i("ExtraSamples",B.f,q),339,A.i("SampleFormat",B.k,1),340,A.i("SMinSampleValue",B.f,q),341,A.i("SMaxSampleValue",B.f,q),342,A.i("TransferRange",B.f,q),343,A.i("ClipPath",B.f,q),512,A.i("JPEGProc",B.f,q),513,A.i("JPEGInterchangeFormat",B.f,q),514,A.i("JPEGInterchangeFormatLength",B.f,q),529,A.i("YCbCrCoefficients",B.E,3),530,A.i("YCbCrSubSampling",B.k,1),531,A.i("YCbCrPositioning",B.k,1),532,A.i("ReferenceBlackWhite",B.E,6),700,A.i("ApplicationNotes",B.k,1),18246,A.i("Rating",B.k,1),33421,A.i("CFARepeatPatternDim",B.f,q),33422,A.i("CFAPattern",B.f,q),33423,A.i("BatteryLevel",B.f,q),33432,A.i("Copyright",B.m,q),33434,A.i("ExposureTime",B.E,1),33437,A.i("FNumber",B.E,q),33723,A.i("IPTC-NAA",B.z,1),34665,A.i("ExifOffset",B.f,q),34675,A.i("InterColorProfile",B.f,q),34850,A.i("ExposureProgram",B.k,1),34852,A.i("SpectralSensitivity",B.m,q),34853,A.i("GPSOffset",B.f,q),34855,A.i(p,B.z,1),34856,A.i("OECF",B.f,q),34864,A.i("SensitivityType",B.k,1),34866,A.i("RecommendedExposureIndex",B.z,1),34867,A.i(p,B.z,1),36864,A.i("ExifVersion",B.Z,q),36867,A.i("DateTimeOriginal",B.m,q),36868,A.i("DateTimeDigitized",B.m,q),36880,A.i("OffsetTime",B.m,q),36881,A.i("OffsetTimeOriginal",B.m,q),36882,A.i("OffsetTimeDigitized",B.m,q),37121,A.i("ComponentsConfiguration",B.Z,q),37122,A.i("CompressedBitsPerPixel",B.f,q),37377,A.i("ShutterSpeedValue",B.f,q),37378,A.i("ApertureValue",B.f,q),37379,A.i("BrightnessValue",B.f,q),37380,A.i("ExposureBiasValue",B.f,q),37381,A.i("MaxApertureValue",B.f,q),37382,A.i("SubjectDistance",B.f,q),37383,A.i("MeteringMode",B.f,q),37384,A.i("LightSource",B.f,q),37385,A.i("Flash",B.f,q),37386,A.i("FocalLength",B.f,q),37396,A.i("SubjectArea",B.f,q),37500,A.i("MakerNote",B.Z,q),37510,A.i("UserComment",B.Z,q),37520,A.i("SubSecTime",B.f,q),37521,A.i("SubSecTimeOriginal",B.f,q),37522,A.i("SubSecTimeDigitized",B.f,q),40091,A.i("XPTitle",B.f,q),40092,A.i("XPComment",B.f,q),40093,A.i("XPAuthor",B.f,q),40094,A.i("XPKeywords",B.f,q),40095,A.i("XPSubject",B.f,q),40960,A.i("FlashPixVersion",B.f,q),40961,A.i("ColorSpace",B.k,1),40962,A.i("ExifImageWidth",B.k,1),40963,A.i("ExifImageLength",B.k,1),40964,A.i("RelatedSoundFile",B.f,q),40965,A.i("InteroperabilityOffset",B.f,q),41483,A.i("FlashEnergy",B.f,q),41484,A.i("SpatialFrequencyResponse",B.f,q),41486,A.i("FocalPlaneXResolution",B.f,q),41487,A.i("FocalPlaneYResolution",B.f,q),41488,A.i("FocalPlaneResolutionUnit",B.f,q),41492,A.i("SubjectLocation",B.f,q),41493,A.i("ExposureIndex",B.f,q),41495,A.i("SensingMethod",B.f,q),41728,A.i("FileSource",B.f,q),41729,A.i("SceneType",B.f,q),41730,A.i("CVAPattern",B.f,q),41985,A.i("CustomRendered",B.f,q),41986,A.i("ExposureMode",B.f,q),41987,A.i("WhiteBalance",B.f,q),41988,A.i("DigitalZoomRatio",B.f,q),41989,A.i("FocalLengthIn35mmFilm",B.f,q),41990,A.i("SceneCaptureType",B.f,q),41991,A.i("GainControl",B.f,q),41992,A.i("Contrast",B.f,q),41993,A.i("Saturation",B.f,q),41994,A.i("Sharpness",B.f,q),41995,A.i("DeviceSettingDescription",B.f,q),41996,A.i("SubjectDistanceRange",B.f,q),42016,A.i("ImageUniqueID",B.f,q),42032,A.i("CameraOwnerName",B.m,q),42033,A.i("BodySerialNumber",B.m,q),42034,A.i("LensSpecification",B.f,q),42035,A.i("LensMake",B.m,q),42036,A.i("LensModel",B.m,q),42037,A.i("LensSerialNumber",B.m,q),42240,A.i("Gamma",B.E,1),50341,A.i("PrintIM",B.f,q),59932,A.i("Padding",B.f,q),59933,A.i("OffsetSchema",B.f,q),65e3,A.i("OwnerName",B.m,q),65001,A.i("SerialNumber",B.m,q)],t.p,A.X("hE"))})
s($,"A0","rZ",()=>new A.hF(new WeakMap(),A.X("hF<fK>")))
s($,"zQ","p1",()=>{var q,p=A.e_(768),o=J.bF(256,t.p)
for(q=0;q<256;++q)o[q]=q
B.d.aa(p,256,512,o)
B.d.V(p,512,768,255)
return p})
s($,"z8","jF",()=>A.o3(A.j([0,1,8,16,9,2,3,10,17,24,32,25,18,11,4,5,12,19,26,33,40,48,41,34,27,20,13,6,7,14,21,28,35,42,49,56,57,50,43,36,29,22,15,23,30,37,44,51,58,59,52,45,38,31,39,46,53,60,61,54,47,55,62,63,63,63,63,63,63,63,63,63,63,63,63,63,63,63,63,63],t.t)))
s($,"A2","t0",()=>A.o3(B.aE))
s($,"A1","t_",()=>A.o3(B.bH))
s($,"zR","p2",()=>new A.mK().$0())
r($,"zn","oV",()=>A.e_(511))
r($,"zo","oW",()=>A.e_(511))
r($,"zq","oX",()=>A.pO(2041))
r($,"zr","oY",()=>A.pO(225))
r($,"zp","nG",()=>A.e_(766))
s($,"zS","nI",()=>A.qJ(B.cM))
s($,"A6","p3",()=>A.qJ(B.dq))
s($,"zU","rV",()=>{var q=A.pP(24)
B.v.aa(q,0,16,B.p)
B.v.aa(q,16,24,B.bI)
return q})
s($,"zV","jH",()=>new A.mR().$0())
s($,"zZ","rY",()=>new A.mX().$0())
s($,"zY","rX",()=>new A.mW().$0())
s($,"A_","hq",()=>new A.mZ().$0())
s($,"zs","rI",()=>A.pN(0))
s($,"za","rx",()=>A.px(0,0,0))
s($,"zM","ay",()=>A.e_(1))
s($,"zN","aI",()=>A.tP(B.d.gt($.ay()),0,null))
s($,"zF","ax",()=>A.pP(1))
s($,"zG","aH",()=>J.t6(B.v.gt($.ax()),0,null))
s($,"zH","V",()=>A.u7(1))
s($,"zJ","ad",()=>J.t7(B.q.gt($.V()),0,null))
s($,"zI","cE",()=>A.tG(B.q.gt($.V())))
s($,"zD","jG",()=>A.pN(1))
s($,"zE","nH",()=>A.qa(B.t.gt($.jG()),0,null))
s($,"zB","p_",()=>A.u0(1))
s($,"zC","rQ",()=>A.qa(B.a1.gt($.p_()),0,null))
s($,"zK","p0",()=>A.ut(1))
s($,"zL","rR",()=>{var q=$.p0()
return A.tH(q.gt(q))})
s($,"zX","rW",()=>A.eL(B.J))
s($,"A7","t4",()=>A.eL(B.a4))
s($,"zP","rT",()=>A.eL(B.V))
s($,"zT","rU",()=>A.eL(B.W))
s($,"A4","t2",()=>A.eL(B.ax))
s($,"zO","rS",()=>{var q=A.o1(A.eL(B.a5),t.h7)
q.ce(0,B.bm)
return q})
s($,"A8","t5",()=>{var q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4="WhatsApp",c5="whatsapp",c6=null,c7="Email",c8="email",c9=20971520,d0="Under 100 KB",d1="under 100 KB",d2="Under 500 KB",d3="under 500 KB",d4="Under 1 MB",d5="under 1 MB",d6="Rotate",d7="rotated",d8="Compress",d9="compressed",e0="Strip metadata",e1="no metadata",e2="Merge",e3="merged",e4=$.rW(),e5=A.W("image-to-jpg","JPG",B.r,e4,B.G),e6=A.W("image-to-png","PNG",B.r,e4,B.a7),e7=A.W("image-to-webp","WebP",B.r,e4,B.Q),e8=A.W("image-to-avif","AVIF",B.r,e4,B.aO),e9=A.W("image-to-gif","GIF",B.r,e4,B.X),f0=A.W("image-to-tiff","TIFF",B.r,e4,B.ae),f1=A.W("image-to-ico","ICO",B.o,e4,B.a8),f2=A.W("image-to-pdf","PDF",B.r,e4,B.P),f3=A.bc("fit-whatsapp-photo",c4,B.r,e4,c5,c6,B.G),f4=$.t4(),f5=A.bc("fit-whatsapp-video",c4,B.o,f4,c5,c6,B.aN),f6=A.bc("fit-email-image",c7,B.r,e4,c8,c9,c6),f7=A.bc("fit-email-pdf",c7,B.F,B.D,c8,c9,c6),f8=A.bc("fit-email-video",c7,B.o,f4,c8,c9,c6),f9=A.bc("fit-instagram","Instagram",B.r,e4,"instagram",c6,B.G),g0=A.bc("fit-web","Web-ready",B.r,e4,"web",c6,B.Q),g1=A.bc("fit-image-100kb",d0,B.r,e4,d1,102400,c6),g2=A.bc("fit-image-500kb",d2,B.r,e4,d3,512e3,c6),g3=A.bc("fit-image-1mb",d4,B.r,e4,d5,1048576,c6),g4=A.bc("fit-pdf-100kb",d0,B.F,B.D,d1,102400,c6),g5=A.bc("fit-pdf-500kb",d2,B.F,B.D,d3,512e3,c6),g6=A.bc("fit-pdf-1mb",d4,B.F,B.D,d5,1048576,c6),g7=A.a_("image-resize","Resize",B.r,e4,"resized",1,c6),g8=A.a_("image-crop","Crop",B.r,e4,"cropped",1,c6),g9=A.a_("image-rotate",d6,B.r,e4,d7,1,c6),h0=A.a_("image-flip","Flip",B.r,e4,"flipped",1,c6),h1=A.a_("image-compress",d8,B.r,e4,d9,1,c6),h2=A.a_("image-strip-metadata",e0,B.r,e4,e1,1,c6)
e4=A.a_("images-to-pdf","One PDF",B.r,e4,"combined",1,B.P)
q=A.W("video-to-mp4","MP4",B.o,f4,B.aN)
p=A.W("video-to-mov","MOV",B.o,f4,B.bs)
o=A.W("video-to-webm","WebM",B.o,f4,B.br)
n=A.W("video-to-gif","GIF",B.o,f4,B.X)
m=A.W("video-to-mp3","MP3",B.o,f4,B.ay)
l=A.W("video-to-m4a","M4A",B.o,f4,B.a6)
k=A.a_("video-trim","Trim",B.o,f4,"trimmed",1,c6)
j=A.a_("video-compress",d8,B.o,f4,d9,1,c6)
i=A.a_("video-resize","Resize",B.o,f4,"resized",1,c6)
h=A.a_("video-crop","Crop",B.o,f4,"cropped",1,c6)
g=A.a_("video-rotate",d6,B.o,f4,d7,1,c6)
f=A.a_("video-mute","Mute",B.o,f4,"muted",1,c6)
e=A.a_("video-merge",e2,B.o,f4,e3,2,c6)
f4=A.a_("video-extract-audio","Extract audio",B.o,f4,"audio",1,B.a6)
d=$.rT()
c=A.W("audio-to-mp3","MP3",B.o,d,B.ay)
b=A.W("audio-to-m4a","M4A",B.o,d,B.a6)
a=A.W("audio-to-wav","WAV",B.o,d,B.bq)
a0=A.W("audio-to-flac","FLAC",B.o,d,B.bj)
a1=A.W("audio-to-opus","Opus",B.o,d,B.bu)
a2=A.a_("audio-trim","Trim",B.o,d,"trimmed",1,c6)
a3=A.a_("audio-merge",e2,B.o,d,e3,2,c6)
a4=A.a_("audio-normalise","Normalise volume",B.o,d,"normalised",1,c6)
d=A.a_("audio-bitrate","Change bitrate",B.o,d,"bitrate",1,c6)
a5=A.W("pdf-to-jpg","JPG",B.ca,B.D,B.G)
a6=A.W("pdf-to-png","PNG",B.ca,B.D,B.a7)
a7=A.a_("pdf-merge",e2,B.F,B.D,e3,2,c6)
a8=A.a_("pdf-split","Split",B.F,B.D,"split",1,c6)
a9=A.a_("pdf-extract-pages","Extract pages",B.F,B.D,"pages",1,c6)
b0=A.a_("pdf-rotate",d6,B.F,B.D,d7,1,c6)
b1=A.a_("pdf-compress",d8,B.F,B.D,d9,1,c6)
b2=A.a_("pdf-add-password","Add password",B.F,B.D,"protected",1,c6)
b3=A.a_("pdf-remove-password","Remove password",B.F,B.D,"unlocked",1,c6)
b4=A.a_("pdf-strip-metadata",e0,B.F,B.D,e1,1,c6)
b5=A.W("document-to-pdf","PDF",B.aK,$.rU(),B.P)
b6=A.W("document-to-markdown","Markdown",B.aK,B.bP,B.aR)
b7=A.W("document-to-html","HTML",B.aK,B.bP,B.aQ)
b8=A.W("document-to-docx","DOCX",B.aK,B.bP,B.aA)
b9=$.t2()
c0=A.W("subtitle-to-srt","SRT",B.aL,b9,B.bt)
c1=A.W("subtitle-to-vtt","VTT",B.aL,b9,B.aP)
c2=A.W("subtitle-to-text","Plain text",B.aL,b9,B.bl)
b9=A.a_("subtitle-shift","Shift timing",B.aL,b9,"shifted",1,c6)
c3=$.rS()
return A.pL([e5,e6,e7,e8,e9,f0,f1,f2,f3,f5,f6,f7,f8,f9,g0,g1,g2,g3,g4,g5,g6,g7,g8,g9,h0,h1,h2,e4,q,p,o,n,m,l,k,j,i,h,g,f,e,f4,c,b,a,a0,a1,a2,a3,a4,d,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,c0,c1,c2,b9,A.W("archive-to-zip","ZIP",B.aw,c3,B.aB),A.W("archive-to-targz","TAR.GZ",B.aw,c3,B.bm),A.W("archive-to-7z","7z",B.aw,c3,B.bo),A.a_("archive-extract","Extract",B.aw,c3,"extracted",1,c6),A.a_("folder-compress","Compress folder",B.aw,B.p3,d9,1,B.aB)],A.X("e6"))})
s($,"A5","t3",()=>A.iI("^\\s*((?:\\d+:)?\\d{1,2}:\\d{2}[,.]\\d{1,3})\\s*-->\\s*((?:\\d+:)?\\d{1,2}:\\d{2}[,.]\\d{1,3})"))})();(function nativeSupport(){!function(){var s=function(a){var m={}
m[a]=1
return Object.keys(hunkHelpers.convertToFastObject(m))[0]}
v.getIsolateTag=function(a){return s("___dart_"+a+v.isolateTag)}
var r="___dart_isolate_tags_"
var q=Object[r]||(Object[r]=Object.create(null))
var p="_ZxYxX"
for(var o=0;;o++){var n=s(p+"_"+o+"_")
if(!(n in q)){q[n]=1
v.isolateTag=n
break}}v.dispatchPropertyName=v.getIsolateTag("dispatch_record")}()
hunkHelpers.setOrUpdateInterceptorsByTag({ArrayBuffer:A.cS,SharedArrayBuffer:A.cS,ArrayBufferView:A.fk,DataView:A.ih,Float32Array:A.ff,Float64Array:A.fg,Int16Array:A.fh,Int32Array:A.fi,Int8Array:A.fj,Uint16Array:A.fl,Uint32Array:A.fm,Uint8ClampedArray:A.fn,CanvasPixelArray:A.fn,Uint8Array:A.cT})
hunkHelpers.setOrUpdateLeafTags({ArrayBuffer:true,SharedArrayBuffer:true,ArrayBufferView:false,DataView:true,Float32Array:true,Float64Array:true,Int16Array:true,Int32Array:true,Int8Array:true,Uint16Array:true,Uint32Array:true,Uint8ClampedArray:true,CanvasPixelArray:true,Uint8Array:false})
A.ak.$nativeSuperclassTag="ArrayBufferView"
A.h4.$nativeSuperclassTag="ArrayBufferView"
A.h5.$nativeSuperclassTag="ArrayBufferView"
A.cs.$nativeSuperclassTag="ArrayBufferView"
A.h6.$nativeSuperclassTag="ArrayBufferView"
A.h7.$nativeSuperclassTag="ArrayBufferView"
A.aT.$nativeSuperclassTag="ArrayBufferView"})()
Function.prototype.$1=function(a){return this(a)}
Function.prototype.$2=function(a,b){return this(a,b)}
Function.prototype.$0=function(){return this()}
Function.prototype.$3=function(a,b,c){return this(a,b,c)}
Function.prototype.$4=function(a,b,c,d){return this(a,b,c,d)}
Function.prototype.$5=function(a,b,c,d,e){return this(a,b,c,d,e)}
Function.prototype.$6=function(a,b,c,d,e,f){return this(a,b,c,d,e,f)}
convertAllToFastObject(w)
convertToFastObject($);(function(a){if(typeof document==="undefined"){a(null)
return}if(typeof document.currentScript!="undefined"){a(document.currentScript)
return}var s=document.scripts
function onLoad(b){for(var q=0;q<s.length;++q){s[q].removeEventListener("load",onLoad,false)}a(b.target)}for(var r=0;r<s.length;++r){s[r].addEventListener("load",onLoad,false)}})(function(a){v.currentScript=a
var s=A.xU
if(typeof dartMainRunner==="function"){dartMainRunner(s,[])}else{s([])}})})()