// Figma Plugin API build script. Run through use_figma; ICONS is supplied from lucide-react.
const page = await figma.getNodeByIdAsync('0:1');
await figma.setCurrentPageAsync(page);
if (page.children.some(n => n.name === 'MD Foods / Register / 01 Contact / Desktop / VI')) {
  throw Error('Auth V2 already exists; update by recorded IDs instead of rebuilding.');
}
await Promise.all(['Regular', 'Medium', 'Semi Bold', 'Bold'].map(style => figma.loadFontAsync({ family: 'Inter', style })));
const created = [], mutated = [], removed = [], variableIds = [], styleIds = [];
const track = n => { created.push(n.id); return n; };
const rgb = h => ({r:parseInt(h.slice(1,3),16)/255,g:parseInt(h.slice(3,5),16)/255,b:parseInt(h.slice(5,7),16)/255});
const vars = {};
for (const [name,id] of Object.entries({brand:'15:143',dark:'15:145',accent:'15:147',text:'15:149',muted:'15:151',border:'15:153',surface:'15:155',white:'15:157',approval:'15:159'})) {
  vars[name] = await figma.variables.getVariableByIdAsync('VariableID:'+id);
}
const foundations = await figma.variables.getVariableCollectionByIdAsync('VariableCollectionId:15:140');
const existing = await Promise.all(foundations.variableIds.map(id => figma.variables.getVariableByIdAsync(id)));
function numeric(name,value,scopes) {
  let v=existing.find(v=>v.name===name);
  if(!v){v=figma.variables.createVariable(name,foundations,'FLOAT');v.scopes=scopes;v.setValueForMode(foundations.defaultModeId,value);variableIds.push(v.id);}
  return v;
}
const spaces = {};
for(const value of [4,8,12,16,20,24,32,40,48,64,80,96]) spaces[value]=numeric('space/'+value,value,['GAP']);
const radii = {};
for(const value of [8,12,16,24]) radii[value]=numeric('radius/'+value,value,['CORNER_RADIUS']);
const palette={brand:'#21613d',dark:'#153d2b',accent:'#c4e6a4',text:'#263b30',muted:'#6b7a70',border:'#dce3dc',surface:'#fbfcfa',white:'#ffffff',approval:'#f0f4eb'};
const paint = (name,opacity=1) => figma.variables.setBoundVariableForPaint({type:'SOLID',color:rgb(palette[name]),opacity},'color',vars[name]);
const localStyles = await figma.getLocalTextStylesAsync();
const styles = {};
function style(size,weight,line=1.5) {
  const key=size+'/'+weight+'/'+line;
  if(styles[key])return styles[key];
  let s=localStyles.find(s=>s.fontName.family==='Inter' && s.fontName.style===weight && s.fontSize===size && s.lineHeight.unit==='PERCENT' && s.lineHeight.value===line*100);
  if(!s){s=figma.createTextStyle();s.name='MD Foods / Auth V2 / '+key;s.fontName={family:'Inter',style:weight};s.fontSize=size;s.lineHeight={unit:'PERCENT',value:line*100};styleIds.push(s.id);}
  styles[key]=s.id;return s.id;
}
function frame(name,parent,w,axis='VERTICAL',gap=0) {
  const n=track(figma.createAutoLayout());n.name=name;n.layoutMode=axis;n.fills=[];n.resize(w,1);n.primaryAxisSizingMode=axis==='VERTICAL'?'AUTO':'FIXED';n.counterAxisSizingMode=axis==='VERTICAL'?'FIXED':'AUTO';n.itemSpacing=gap;
  if(spaces[gap])n.setBoundVariable('itemSpacing',spaces[gap]);
  if(parent)parent.appendChild(n);n.layoutSizingHorizontal='FIXED';n.layoutSizingVertical='HUG';return n;
}
function fixed(n,w,h){n.resize(w,h);n.primaryAxisSizingMode='FIXED';n.counterAxisSizingMode='FIXED';return n;}
function pad(n,t,r=t,b=t,l=r){for(const [key,value]of Object.entries({paddingTop:t,paddingRight:r,paddingBottom:b,paddingLeft:l})){n[key]=value;if(spaces[value])n.setBoundVariable(key,spaces[value]);}}
function round(n,value){n.cornerRadius=value;if(radii[value])n.setBoundVariable('cornerRadius',radii[value]);}
function text(name,value,parent,w,size=14,weight='Regular',color='text',line=1.5){const n=track(figma.createText());n.name=name;n.fontName={family:'Inter',style:weight};n.textStyleId=style(size,weight,line);n.characters=value;n.textAutoResize='HEIGHT';n.resize(w,n.height);n.fills=[paint(color)];parent.appendChild(n);return n;}
function icon(name,parent,size=20,color='#21613d') {
  const svg=ICONS[name].replaceAll('currentColor',color);const n=track(figma.createNodeFromSvg(svg));n.name='Icon / '+name;n.resize(size,size);parent.appendChild(n);return n;
}
const inputMain=await figma.getNodeByIdAsync('15:301');
const buttonMain=await figma.getNodeByIdAsync('15:215');
const [selectSet, checkboxSet]=await Promise.all([
  figma.importComponentSetByKeyAsync('b4d568282b67de741c52524b83888113e79a662c'),
  figma.importComponentSetByKeyAsync('e396597bb4eade21b593d15dc3b3a3f79a0048bf')
]);
const selectMain=selectSet.children.find(c=>c.name==='State=Default, Value Type=Placeholder');
const checkedMain=checkboxSet.children.find(c=>c.name==='State=Default, Value Type=Checked');
const uncheckedMain=checkboxSet.children.find(c=>c.name==='State=Default, Value Type=Unchecked');
const brandMain=await figma.getNodeByIdAsync('17:62');
const languageMain=await figma.getNodeByIdAsync('15:349');
function recolorText(n,color,size=14,weight='Regular') {
  for(const t of n.findAllWithCriteria({types:['TEXT']})){if(!t.visible)continue;t.fontName={family:'Inter',style:weight};t.textStyleId=style(size,weight,1.5);t.fills=[paint(color)];mutated.push(t.id);}
}
function instance(main,name,parent){const n=track(main.createInstance());n.name=name;parent.appendChild(n);return n;}
function input(parent,label,placeholder,w,select=false,password=false) {
  const container=password?frame('Password field',parent,w):parent;
  const n=instance(select?selectMain:inputMain,(select?'Select / ':'Input / ')+label,container);
  n.setProperties(select?{'Has Label#57:0':true,'Label#280:85':label,'Has Description#611:4':false,'Has Error#72:6':false,'Value#630:7':placeholder}:{'Has Label#57:0':true,'Label#280:41':label,'Has Description#611:20':false,'Has Error#72:6':false,'Value#630:14':placeholder});
  n.resize(w,82);n.primaryAxisSizingMode='AUTO';n.counterAxisSizingMode='FIXED';n.itemSpacing=8;n.setBoundVariable('itemSpacing',spaces[8]);
  recolorText(n,'muted',14);
  const labelNode=n.findAllWithCriteria({types:['TEXT']}).find(t=>t.name==='Label');labelNode.textStyleId=style(13,'Medium',1.5);labelNode.fills=[paint('text')];labelNode.resize(w,labelNode.height);
  const box=n.findAllWithCriteria({types:['FRAME']}).find(f=>f.name===(select?'Select':'Input'));
  box.resize(w,52);box.layoutSizingHorizontal='FILL';box.primaryAxisSizingMode='FIXED';box.counterAxisSizingMode='FIXED';box.counterAxisAlignItems='CENTER';box.fills=[paint('white')];box.strokes=[paint('border')];box.strokeWeight=1;round(box,8);pad(box,16);
  n.resize(w,80);if(password){const eye=icon('Eye',container,20,'#6b7a70');eye.layoutPositioning='ABSOLUTE';eye.x=w-36;eye.y=43;}return n;
}
function button(parent,label,w,primary=true,arrow=true) {
  const wrapper=fixed(frame('Action / '+label,parent,w),w,52);
  const n=instance(buttonMain,'Button / '+label,wrapper);n.setProperties({'Label#2:0':label,'Has Icon Start#4:128':false,'Has Icon End#4:64':false});n.resize(w,52);n.primaryAxisSizingMode='FIXED';n.counterAxisSizingMode='FIXED';n.primaryAxisAlignItems='CENTER';n.counterAxisAlignItems='CENTER';n.fills=[paint(primary?'brand':'white')];n.strokes=primary?[]:[paint('border')];round(n,8);pad(n,16,24);
  recolorText(n,primary?'white':'text',14,'Semi Bold');
  n.reactions=[];
  if(arrow){const a=icon('ArrowRight',wrapper,18,primary?'#ffffff':'#263b30');a.layoutPositioning='ABSOLUTE';a.x=w-36;a.y=17;}return wrapper;
}
function checkbox(parent,label,w,checked=true) {
  const n=instance(checked?checkedMain:uncheckedMain,'Checkbox / '+label,parent);n.setProperties({'Label#373:9':label,'Has Description#31:31':false});n.resize(w,24);n.primaryAxisSizingMode='AUTO';n.counterAxisSizingMode='FIXED';recolorText(n,'text',13);
  const labelNode=n.findAllWithCriteria({types:['TEXT']}).find(t=>t.name==='Label');if(labelNode){labelNode.textAutoResize='HEIGHT';labelNode.resize(w-36,labelNode.height);mutated.push(labelNode.id);}return n;
}
function brand(parent){const n=instance(brandMain,'MD Foods / Brand',parent);const label=n.findAllWithCriteria({types:['TEXT']}).find(t=>t.name==='Brand name');label.fills=[paint('dark')];mutated.push(label.id);return n;}
function header(parent,w,mobile=false,register=false) {
  const h=fixed(frame('Header',parent,w,'HORIZONTAL',24),w,44);h.primaryAxisAlignItems='SPACE_BETWEEN';h.counterAxisAlignItems='CENTER';brand(h);
  const actions=frame('Header actions',h,mobile?86:register?330:280,'HORIZONTAL',24);actions.counterAxisAlignItems='CENTER';
  if(!mobile)text('Return / Account link',register?'Đã có tài khoản?  Đăng nhập':'←  Xem sản phẩm',actions,register?220:170,12,'Medium','brand');
  instance(languageMain,'Language / VI–EN',actions);return h;
}
function footer(parent,w,mobile=false) {
  const f=frame('Footer',parent,w,mobile?'VERTICAL':'HORIZONTAL',8);f.primaryAxisAlignItems='SPACE_BETWEEN';text('Copyright','© 2026 MD Foods. Thực phẩm cho mỗi ngày.',f,mobile?w:390,11,'Regular','muted');
  text('Policy links','Điều khoản sử dụng   ·   Chính sách bảo mật',f,mobile?w:300,11,'Regular','muted');return f;
}
function note(parent,w,title,body,iconName='MailCheck') {
  const row=frame(title,parent,w,'HORIZONTAL',12);pad(row,16);round(row,12);row.fills=[paint('approval')];icon(iconName,row,20);const copy=frame('Note text',row,w-64,'VERTICAL',4);text('Note title',title,copy,w-64,13,'Semi Bold');text('Note body',body,copy,w-64,12,'Regular','muted');return row;
}
function root(name,w,h,x,y,oldId=null) {
  let n=oldId?null:track(figma.createAutoLayout());
  return {name,w,h,x,y,node:n,oldId};
}
async function start(spec) {
  let n=spec.node;
  if(spec.oldId){n=await figma.getNodeByIdAsync(spec.oldId);for(const child of [...n.children]){removed.push(child.id);child.remove();}mutated.push(n.id);}
  n.name=spec.name;n.layoutMode='VERTICAL';n.resize(spec.w,spec.h);n.primaryAxisSizingMode='FIXED';n.counterAxisSizingMode='FIXED';n.counterAxisAlignItems='CENTER';n.fills=[paint('surface')];n.clipsContent=true;n.x=spec.x;n.y=spec.y;n.itemSpacing=24;n.setBoundVariable('itemSpacing',spaces[24]);pad(n,spec.w<500?24:32,spec.w<500?24:48,24);n.primaryAxisAlignItems='SPACE_BETWEEN';if(!n.parent||n.parent.type!=='PAGE')page.appendChild(n);return n;
}
function photo(parent,w,h,hash,name) {const n=fixed(frame(name,parent,w),w,h);n.fills=[{type:'IMAGE',imageHash:hash,scaleMode:'FILL'}];round(n,24);n.clipsContent=true;return n;}
const saladHash='4c75efa04cb622006f0ce53e296c7f38e3b3cbcd';
const produceHash='2d6a950028a88bfa38d421118d1d58c3e463f880';

// Reusable Customer type choices and registration steps.
function choiceMain(name,label,description,iconName,active,x) {
  const n=track(figma.createComponent());n.name=name;n.layoutMode='HORIZONTAL';n.resize(348,100);n.primaryAxisSizingMode='FIXED';n.counterAxisSizingMode='FIXED';n.itemSpacing=12;pad(n,16);round(n,12);n.fills=[paint(active?'approval':'white')];n.strokes=[paint(active?'brand':'border')];n.strokeWeight=active?1.5:1;icon(iconName,n,24);
  const body=frame('Choice content',n,260,'VERTICAL',4);text('Choice title',label,body,260,13,'Semi Bold');text('Choice description',description,body,260,12,'Regular','muted');n.x=x;n.y=4900;n.description='Customer type choice; controls personalization context, not pricing or permissions.';page.appendChild(n);return n;
}
const personalChoice=choiceMain('MD Foods / Customer Type / Personal','Cá nhân / Hộ gia đình','Mua cho gia đình hoặc nhu cầu cá nhân','House',false,240);
const businessChoice=choiceMain('MD Foods / Customer Type / Business','Doanh nghiệp / Hợp tác xã','Mua cho văn phòng, nhà hàng, cơ sở kinh doanh','Building2',true,640);
const stepMain=track(figma.createComponent());stepMain.name='MD Foods / Registration Step';stepMain.layoutMode='HORIZONTAL';stepMain.resize(224,36);stepMain.primaryAxisSizingMode='FIXED';stepMain.counterAxisSizingMode='FIXED';stepMain.counterAxisAlignItems='CENTER';stepMain.itemSpacing=8;stepMain.setBoundVariable('itemSpacing',spaces[8]);stepMain.fills=[];
const numberBox=fixed(frame('Step number',stepMain,32,'HORIZONTAL'),32,32);round(numberBox,16);numberBox.fills=[paint('brand')];numberBox.primaryAxisAlignItems='CENTER';numberBox.counterAxisAlignItems='CENTER';const num=text('Number','1',numberBox,16,12,'Semi Bold','white');num.textAlignHorizontal='CENTER';const stepLabel=text('Step label','Liên hệ',stepMain,160,12,'Semi Bold','brand');
const numProp=stepMain.addComponentProperty('Number','TEXT','1');num.componentPropertyReferences={characters:numProp};const labelProp=stepMain.addComponentProperty('Label','TEXT','Liên hệ');stepLabel.componentPropertyReferences={characters:labelProp};stepMain.description='Registration progress indicator; completed steps may be revisited before submission.';page.appendChild(stepMain);stepMain.x=1040;stepMain.y=4900;
function stepper(parent,w,stage,mobile=false){const row=frame('Registration progress',parent,w,'HORIZONTAL',mobile?4:16);for(let i=1;i<=3;i++){const n=instance(stepMain,'Step '+i,row);n.setProperties({[numProp]:i<stage?'✓':String(i),[labelProp]:['Liên hệ','Giao hàng','Hóa đơn'][i-1]});n.resize((w-(mobile?8:32))/3,36);const box=n.findAllWithCriteria({types:['FRAME']}).find(n=>n.name==='Step number');box.fills=[paint(i<=stage?'brand':'approval')];const texts=n.findAllWithCriteria({types:['TEXT']});for(const t of texts){t.fills=[paint(t.name==='Number'?(i<=stage?'white':'muted'):(i===stage?'brand':'muted'))];if(mobile&&t.name==='Step label'){t.textStyleId=style(11,'Medium',1.5);t.resize(58,t.height);}mutated.push(t.id);}mutated.push(box.id);}return row;}

// Login: photo-led desktop, focused form on mobile.
const desktop=await start(root('MD Foods / Login / Desktop / VI',1440,1000,240,120,'15:360'));header(desktop,1344);
const loginBody=fixed(frame('Login content',desktop,1344,'HORIZONTAL',64),1344,744);loginBody.counterAxisAlignItems='CENTER';
const hero=photo(loginBody,640,744,saladHash,'Photography / fresh food');
hero.fills=[...hero.fills,{type:'GRADIENT_LINEAR',gradientTransform:[[0,1,0],[-1,0,1]],gradientStops:[{position:0,color:{...rgb('#102b1d'),a:0.05}},{position:.43,color:{...rgb('#102b1d'),a:.05}},{position:1,color:{...rgb('#102b1d'),a:.93}}]}];
pad(hero,40);hero.primaryAxisAlignItems='SPACE_BETWEEN';const badge=frame('Brand promise',hero,204,'HORIZONTAL',8);pad(badge,8,12);round(badge,8);badge.fills=[paint('white',.94)];icon('Leaf',badge,18);text('Badge text','Tươi ngon cho mỗi ngày',badge,150,11,'Semi Bold','brand');
const story=frame('Brand story',hero,560,'VERTICAL',20);const title=text('Hero title','Nguồn thực phẩm tốt.\nCho mỗi ngày.',story,560,48,'Semi Bold','white',1.12);title.letterSpacing={unit:'PIXELS',value:-1.7};text('Hero description','Từ bữa ăn gia đình đến gian bếp doanh nghiệp —\ncùng MD Foods chọn những nguyên liệu phù hợp.',story,510,14,'Regular','white',1.7);
const benefits=frame('Service benefits',story,560,'HORIZONTAL',24);for(const [name,ico]of [['Đa dạng lựa chọn','PackageCheck'],['Giao đến nơi bạn cần','Truck']]){const r=frame(name,benefits,248,'HORIZONTAL',8);icon(ico,r,18,'#ffffff');text('Benefit',name,r,220,12,'Medium','white');}
const loginPanel=frame('Login form panel',loginBody,640,'VERTICAL',24);pad(loginPanel,0,96);
text('Eyebrow','CHÀO MỪNG TRỞ LẠI',loginPanel,448,11,'Semi Bold','brand',1.5).letterSpacing={unit:'PIXELS',value:1.5};
const lead=frame('Login heading',loginPanel,448,'VERTICAL',8);text('Heading','Đăng nhập',lead,448,36,'Semi Bold','dark',1.2).letterSpacing={unit:'PIXELS',value:-1};text('Description','Tiếp tục mua sắm và quản lý đơn hàng của bạn.',lead,448,14,'Regular','muted');
const fields=frame('Credentials',loginPanel,448,'VERTICAL',20);input(fields,'Địa chỉ Gmail','ban@gmail.com',448);input(fields,'Mật khẩu','Nhập mật khẩu của bạn',448,false,true);
const forgot=text('Forgot password','Quên mật khẩu?',loginPanel,448,13,'Medium','brand');forgot.textAlignHorizontal='RIGHT';const loginButton=button(loginPanel,'Đăng nhập',448);
const signUp=text('Register link','Chưa có tài khoản?  Đăng ký ngay →',loginPanel,448,13,'Medium','brand');signUp.textAlignHorizontal='CENTER';
note(loginPanel,448,'Bạn đang chờ kích hoạt?','Sau khi hồ sơ được duyệt, hãy kiểm tra Gmail để xác minh OTP và tạo mật khẩu.');footer(desktop,1344);

const mobile=await start(root('MD Foods / Login / Mobile / VI',390,844,1840,120,'15:524'));header(mobile,342,true);
const ml=frame('Login form',mobile,342,'VERTICAL',24);text('Eyebrow','CHÀO MỪNG TRỞ LẠI',ml,342,10,'Semi Bold','brand').letterSpacing={unit:'PIXELS',value:1.2};
const mlead=frame('Heading',ml,342,'VERTICAL',8);text('Heading','Đăng nhập',mlead,342,32,'Semi Bold','dark',1.2);text('Description','Nguồn thực phẩm tốt cho mỗi ngày.',mlead,342,14,'Regular','muted');
const mf=frame('Credentials',ml,342,'VERTICAL',20);input(mf,'Địa chỉ Gmail','ban@gmail.com',342);input(mf,'Mật khẩu','Nhập mật khẩu',342,false,true);text('Forgot password','Quên mật khẩu?',ml,342,13,'Medium','brand').textAlignHorizontal='RIGHT';button(ml,'Đăng nhập',342);const ms=text('Register link','Chưa có tài khoản?  Đăng ký ngay →',ml,342,13,'Medium','brand');ms.textAlignHorizontal='CENTER';note(ml,342,'Bạn đang chờ kích hoạt?','Kiểm tra Gmail sau khi hồ sơ được duyệt để xác minh OTP và tạo mật khẩu.');footer(mobile,342,true);

function sidebar(parent){const s=frame('Registration story',parent,320,'VERTICAL',24);text('Eyebrow','BẮT ĐẦU CÙNG MD FOODS',s,320,11,'Semi Bold','brand').letterSpacing={unit:'PIXELS',value:1.1};text('Title','Một tài khoản.\nNhiều lựa chọn tốt.',s,320,34,'Semi Bold','dark',1.2).letterSpacing={unit:'PIXELS',value:-1};text('Description','Mua thực phẩm cho gia đình hay doanh nghiệp — tất cả trong cùng một nơi.',s,320,14,'Regular','muted',1.7);photo(s,320,264,produceHash,'Photography / produce selection');const flow=frame('Activation process',s,320,'VERTICAL',16);for(const [i,label,body]of [[1,'Gửi thông tin đăng ký','Hồ sơ được gửi tới MD Foods.'],[2,'Chờ duyệt & nhận OTP','Mã xác minh gửi về Gmail đăng ký.'],[3,'Tạo mật khẩu & mua sắm','Kích hoạt sau khi xác minh OTP.']]){const row=frame('Activation '+i,flow,320,'HORIZONTAL',12);icon(i===1?'FileText':i===2?'MailCheck':'ShieldCheck',row,20);const c=frame('Copy',row,288,'VERTICAL',4);text('Label',label,c,288,13,'Semi Bold');text('Body',body,c,288,12,'Regular','muted');}return s;}
const registerViews=[], nextButtons=[], backButtons=[], submitButtons=[], registerLinks=[];
function registerContent(parent,w,stage,mobile=false){const gap=mobile?20:24;const f=frame('Registration form',parent,w,'VERTICAL',gap);if(!mobile){pad(f,32);round(f,16);f.fills=[paint('white')];f.strokes=[paint('border')];}const iw=mobile?w:w-64;stepper(f,iw,stage,mobile);
  const heading=frame('Form heading',f,iw,'VERTICAL',8);text('Heading',['Thông tin liên hệ','Thông tin giao hàng','Thông tin hóa đơn'][stage-1],heading,iw,mobile?28:30,'Semi Bold','dark',1.2);text('Description',['Cho MD Foods biết bạn là ai và cách liên hệ với bạn.','Địa chỉ mặc định giúp bạn đặt hàng nhanh hơn.','Kiểm tra thông tin trước khi gửi yêu cầu đăng ký.'][stage-1],heading,iw,13,'Regular','muted');
  const fieldGroup=frame('Fields',f,iw,'VERTICAL',20);
  function pair(a,b){const row=frame('Field row',fieldGroup,iw,mobile?'VERTICAL':'HORIZONTAL',16);const pw=mobile?iw:(iw-16)/2;input(row,a[0],a[1],pw,a[2]);input(row,b[0],b[1],pw,b[2]);}
  if(stage===1){pair(['Họ *','Nguyễn'],['Tên *','Minh Anh']);input(fieldGroup,'Địa chỉ Gmail *','ban@gmail.com',iw);text('Gmail help','OTP sẽ được gửi đến Gmail này sau khi hồ sơ được duyệt.',fieldGroup,iw,12,'Regular','muted');input(fieldGroup,'Số điện thoại *','Nhập số điện thoại Việt Nam',iw);text('Customer type label','Bạn mua hàng cho *',fieldGroup,iw,13,'Medium');const choices=frame('Customer type choices',fieldGroup,iw,mobile?'VERTICAL':'HORIZONTAL',12);for(const c of [personalChoice,businessChoice]){const n=instance(c,c.name,choices);n.resize(mobile?iw:(iw-12)/2,104);const bc=n.findAllWithCriteria({types:['FRAME']}).find(f=>f.name==='Choice content');bc.resize(n.width-68,72);bc.layoutSizingHorizontal='FILL';for(const t of bc.findAllWithCriteria({types:['TEXT']})){t.resize(n.width-68,t.height);mutated.push(t.id);}}
  }else if(stage===2){input(fieldGroup,'Tên doanh nghiệp / người đại diện *','Nhập tên doanh nghiệp hoặc người đại diện',iw);input(fieldGroup,'Tỉnh / Thành phố *','Chọn tỉnh / thành phố',iw,true);pair(['Quận / Huyện *','Chọn quận / huyện',true],['Phường / Xã *','Chọn phường / xã',true]);input(fieldGroup,'Địa chỉ nhận hàng *','Số nhà, tên đường, tòa nhà...',iw);note(fieldGroup,iw,'Bạn vẫn có thể giao đến nhiều địa chỉ','Địa chỉ này là mặc định. Khi đặt hàng, bạn có thể tạo các package nhận hàng khác nhau.','MapPin');
  }else{checkbox(fieldGroup,'Địa chỉ hóa đơn trùng địa chỉ nhận hàng',iw,true);input(fieldGroup,'Người mua hàng','Nhập họ tên người mua hàng',iw);pair(['Mã số thuế','Nhập mã số thuế 10 chữ số'],['Gmail nhận hóa đơn','hoadon@gmail.com']);input(fieldGroup,'Địa chỉ xuất hóa đơn','Dùng địa chỉ nhận hàng ở bước 2',iw);text('Invoice help','Thông tin hóa đơn không bắt buộc. Nếu nhập mã số thuế, mã phải có đúng 10 chữ số.',fieldGroup,iw,12,'Regular','muted');text('Submission note','Bằng việc gửi yêu cầu, bạn đồng ý với Điều khoản sử dụng và Chính sách bảo mật của MD Foods.',fieldGroup,iw,12,'Regular','muted');note(fieldGroup,iw,'Chưa tạo mật khẩu ở bước này','MD Foods sẽ duyệt hồ sơ. Sau đó, bạn xác minh OTP qua Gmail và tự tạo mật khẩu.');}
  const actions=frame('Form actions',f,iw,'HORIZONTAL',12);if(stage>1){const b=button(actions,'Quay lại',mobile?100:132,false,false);backButtons.push({node:b,stage,mobile});}const next=button(actions,stage===3?'Gửi yêu cầu đăng ký':'Tiếp tục',stage>1?iw-(mobile?112:144):iw);if(stage===3)submitButtons.push({node:next,mobile});else nextButtons.push({node:next,stage,mobile});
  text('Required fields','* Thông tin bắt buộc',f,iw,11,'Regular','muted');return f;
}
for(let stage=1;stage<=3;stage++){
  const d=await start(root('MD Foods / Register / 0'+stage+' '+['Contact','Delivery','Invoice'][stage-1]+' / Desktop / VI',1440,1080,240+(stage-1)*1600,1450));header(d,1344,false,true);const body=frame('Registration content',d,1184,'HORIZONTAL',64);body.counterAxisAlignItems='MIN';sidebar(body);registerContent(body,800,stage);footer(d,1344);registerViews.push({stage,mobile:false,node:d});
  const m=await start(root('MD Foods / Register / 0'+stage+' '+['Contact','Delivery','Invoice'][stage-1]+' / Mobile / VI',390,stage===1?1130:stage===2?1120:1200,240+(stage-1)*510,2770));header(m,342,true,true);registerContent(m,342,stage,true);footer(m,342,true);m.overflowDirection='VERTICAL';registerViews.push({stage,mobile:true,node:m});
}
const pendingViews=[];
for(const isMobile of [false,true]){const w=isMobile?390:1440;const p=await start(root('MD Foods / Register / Pending approval / '+(isMobile?'Mobile':'Desktop')+' / VI',w,isMobile?844:1000,isMobile?1840:240,4120));header(p,w-(isMobile?48:96),isMobile,true);const box=frame('Request received',p,isMobile?342:560,'VERTICAL',24);box.counterAxisAlignItems='CENTER';const seal=fixed(frame('Email status',box,80,'HORIZONTAL'),80,80);round(seal,24);seal.fills=[paint('approval')];seal.primaryAxisAlignItems='CENTER';seal.counterAxisAlignItems='CENTER';icon('MailCheck',seal,36);text('Heading','Yêu cầu đã được gửi',box,isMobile?342:560,isMobile?28:36,'Semi Bold','dark',1.2).textAlignHorizontal='CENTER';text('Description','MD Foods sẽ xem xét hồ sơ của bạn. Khi được duyệt, mã OTP sẽ được gửi đến Gmail đã đăng ký.',box,isMobile?342:480,14,'Regular','muted',1.7).textAlignHorizontal='CENTER';note(box,isMobile?342:480,'Bước tiếp theo','Xác minh OTP → Tạo mật khẩu → Đăng nhập. Bạn vẫn có thể khám phá sản phẩm trong lúc chờ.');button(box,'Tiếp tục khám phá sản phẩm',isMobile?342:480);footer(p,w-(isMobile?48:96),isMobile);pendingViews.push({mobile:isMobile,node:p});}

// Navigable prototype for the registration flow and links from Login.
function connect(n,target){n.reactions=[{trigger:{type:'ON_CLICK'},actions:[{type:'NODE',destinationId:target.id,navigation:'NAVIGATE',transition:null,preserveScrollPosition:false}]}];mutated.push(n.id);for(const child of n.findAllWithCriteria({types:['INSTANCE']}).filter(c=>c.name.startsWith('Button /'))){child.reactions=n.reactions;mutated.push(child.id);}}
for(const b of nextButtons)connect(b.node,registerViews.find(v=>v.stage===b.stage+1&&v.mobile===b.mobile).node);
for(const b of backButtons)connect(b.node,registerViews.find(v=>v.stage===b.stage-1&&v.mobile===b.mobile).node);
for(const b of submitButtons)connect(b.node,pendingViews.find(v=>v.mobile===b.mobile).node);
connect(signUp,registerViews.find(v=>v.stage===1&&!v.mobile).node);connect(ms,registerViews.find(v=>v.stage===1&&v.mobile).node);
for(const v of registerViews.filter(v=>!v.mobile)){const link=v.node.findAllWithCriteria({types:['TEXT']}).find(t=>t.name==='Return / Account link');connect(link,desktop);}
for(const id of ['28:287','28:288']){const n=await figma.getNodeByIdAsync(id);if(n){n.remove();removed.push(id);}}
const allViews=[desktop,mobile,...registerViews.map(v=>v.node),...pendingViews.map(v=>v.node)];
for(const v of allViews){const needed=v.paddingTop+v.paddingBottom+v.children.reduce((total,c)=>total+c.height,0)+v.itemSpacing*(v.children.length-1);if(needed>v.height){v.resize(v.width,Math.ceil(needed+24));mutated.push(v.id);}if(v.width<500)v.overflowDirection='VERTICAL';}
for(const c of [personalChoice,businessChoice,stepMain])c.y=5500;
const inspect=n=>{const nodes=n.findAll(()=>true),types={};for(const c of nodes)types[c.type]=(types[c.type]||0)+1;const fonts=[...new Set(nodes.filter(c=>c.type==='TEXT').map(c=>c.fontName.family))];if(fonts.some(f=>f!=='Inter'))throw Error('Unexpected font family: '+fonts.join(','));return{id:n.id,name:n.name,width:n.width,height:n.height,count:nodes.length,types,fonts,images:nodes.filter(c=>Array.isArray(c.fills)&&c.fills.some(f=>f.type==='IMAGE')).map(c=>({id:c.id,name:c.name,type:c.type,width:c.width,height:c.height}))};};
return {createdNodeIds:created,mutatedNodeIds:[...new Set(mutated)],removedNodeIds:removed,variableIds,styleIds,views:allViews.map(inspect),components:{personalChoice:personalChoice.id,businessChoice:businessChoice.id,step:stepMain.id},prototypeLinks:nextButtons.length+backButtons.length+submitButtons.length+5};
