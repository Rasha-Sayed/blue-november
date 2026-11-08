
document.getElementById("year").textContent = new Date().getFullYear();
const backToTop=document.getElementById("backToTop");
window.addEventListener("scroll",()=>backToTop.classList.toggle("show",window.scrollY>450));
backToTop.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
document.querySelectorAll(".navbar-nav .nav-link").forEach(link=>link.addEventListener("click",()=>{
 const menu=document.getElementById("mainMenu"); if(menu.classList.contains("show")) bootstrap.Collapse.getOrCreateInstance(menu).hide();
}));

// عداد متجدد إلى 14 نوفمبر القادم.
function updateCountdown(){
 const now=new Date();let target=new Date(now.getFullYear(),10,14,0,0,0);
 if(now>=target)target=new Date(now.getFullYear()+1,10,14,0,0,0);
 const diff=Math.max(0,target-now);
 const values={days:Math.floor(diff/86400000),hours:Math.floor(diff%86400000/3600000),minutes:Math.floor(diff%3600000/60000),seconds:Math.floor(diff%60000/1000)};
 Object.entries(values).forEach(([id,value])=>{const el=document.getElementById(id);if(el)el.textContent=String(value).padStart(2,"0")});
}
updateCountdown();setInterval(updateCountdown,1000);

// إظهار الأقسام والعناصر تدريجياً عند التمرير.
if("IntersectionObserver" in window){
 const observer=new IntersectionObserver((entries,obs)=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");obs.unobserve(entry.target)}}),{threshold:.12});
 document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));
}else{document.querySelectorAll(".reveal").forEach(el=>el.classList.add("is-visible"))}

// بنك الأسئلة: عشرة أسئلة مع تصحيح فوري وشرح.
const questions=[
{q:"ما السبب الأساسي لحدوث مرض السكري؟",a:["ارتفاع ضغط الدم","عدم إنتاج كمية كافية من الإنسولين أو عدم استخدامه بفاعلية","تناول وجبة واحدة يومياً"],c:1,e:"السكري يحدث عندما لا ينتج الجسم كمية كافية من الإنسولين أو لا يستخدمه بفاعلية."},
{q:"أي عضو في الجسم ينتج هرمون الإنسولين؟",a:["الكبد","القلب","البنكرياس"],c:2,e:"ينتج البنكرياس الإنسولين، وهو الهرمون الذي يساعد على تنظيم مستوى السكر في الدم."},
{q:"أي نوع يرتبط بمهاجمة الجهاز المناعي للخلايا المنتجة للإنسولين؟",a:["النوع الأول","النوع الثاني","سكري الحمل"],c:0,e:"في النوع الأول يهاجم الجهاز المناعي خلايا البنكرياس المنتجة للإنسولين."},
{q:"أي مما يلي قد يكون من أعراض السكري؟",a:["العطش الشديد وكثرة التبول","تحسن النظر بشكل مفاجئ","زيادة كثافة الشعر"],c:0,e:"العطش الشديد وكثرة التبول من الأعراض الشائعة التي قد ترافق السكري."},
{q:"ما الفحص الذي يعكس متوسط مستوى السكر خلال نحو ثلاثة أشهر؟",a:["قياس ضغط الدم","فحص HbA1c","فحص النظر"],c:1,e:"فحص السكر التراكمي HbA1c يعطي مؤشراً عن متوسط مستوى السكر خلال نحو ثلاثة أشهر."},
{q:"هل يمكن تشخيص السكري بالاعتماد على الأعراض فقط؟",a:["نعم دائماً","لا، يحتاج التشخيص إلى فحوصات طبية","نعم إذا وُجد العطش"],c:1,e:"الأعراض وحدها لا تكفي؛ يعتمد التشخيص على فحوصات الدم وتقييم المختص."},
{q:"أي عادة تساعد على تقليل خطر الإصابة بالسكري من النوع الثاني؟",a:["قلة الحركة","الإكثار من المشروبات المحلاة","النشاط البدني المنتظم"],c:2,e:"النشاط البدني المنتظم مع الغذاء المتوازن يساعد على تقليل خطر الإصابة بالنوع الثاني."},
{q:"متى يُحتفى باليوم العالمي للسكري؟",a:["14 نوفمبر","1 يناير","31 ديسمبر"],c:0,e:"يوافق اليوم العالمي للسكري 14 نوفمبر من كل عام."},
{q:"ما المقصود بسكري الحمل؟",a:["سكري يصيب الأطفال فقط","ارتفاع مستوى السكر الذي يظهر أثناء الحمل","انخفاض ضغط الدم أثناء الحمل"],c:1,e:"سكري الحمل هو ارتفاع في مستوى السكر يظهر أثناء الحمل ويحتاج إلى متابعة طبية."},
{q:"ما التصرف الأنسب عند الشك بوجود أعراض للسكري؟",a:["تجاهلها إذا كانت خفيفة","تناول دواء من دون استشارة","مراجعة مقدم الرعاية الصحية لإجراء الفحوصات"],c:2,e:"الأفضل مراجعة مختص صحي لإجراء الفحوصات اللازمة وتفسير النتائج."}
];
let index=0,score=0,answered=false;
const qText=document.getElementById("questionText"),options=document.getElementById("answerOptions"),feedback=document.getElementById("answerFeedback"),next=document.getElementById("nextQuestion"),result=document.getElementById("quizResult");
function showQuestion(){
 const item=questions[index];answered=false;
 document.getElementById("questionCounter").textContent=`السؤال ${index+1} من 10`;
 document.getElementById("scoreCounter").textContent=`الإجابات الصحيحة: ${score}`;
 document.getElementById("quizProgress").style.width=`${(index+1)*10}%`;
 qText.textContent=item.q;options.innerHTML="";feedback.hidden=true;feedback.className="answer-feedback";next.disabled=true;next.textContent=index===9?"عرض النتيجة":"السؤال التالي";
 item.a.forEach((answer,i)=>{const b=document.createElement("button");b.type="button";b.className="quiz-option";b.textContent=answer;b.addEventListener("click",()=>choose(i));options.appendChild(b)});
}
function choose(selected){
 if(answered)return;answered=true;const item=questions[index];const buttons=[...options.querySelectorAll("button")];
 buttons.forEach((b,i)=>{b.disabled=true;if(i===item.c)b.classList.add("correct");if(i===selected&&selected!==item.c)b.classList.add("wrong")});
 const ok=selected===item.c;if(ok)score++;
 feedback.hidden=false;feedback.classList.add(ok?"is-correct":"is-wrong");feedback.textContent=(ok?"إجابة صحيحة! ":"إجابة غير صحيحة. ")+item.e;
 document.getElementById("scoreCounter").textContent=`الإجابات الصحيحة: ${score}`;next.disabled=false;
}
function finish(){
 document.querySelector("#quizApp .quiz-topline").hidden=true;document.querySelector("#quizApp .quiz-progress").hidden=true;
 qText.hidden=true;options.hidden=true;feedback.hidden=true;document.querySelector("#quizApp .quiz-actions").hidden=true;result.hidden=false;
 document.getElementById("finalScore").textContent=`${score} / 10`;
 document.getElementById("resultMessage").textContent=score>=8?"أحسنت! لديك معرفة جيدة بالمعلومات الأساسية عن السكري.":score>=5?"نتيجة جيدة! راجع المعلومات وحاول مرة أخرى لتعزيز معرفتك.":"لا بأس، اقرأ أقسام الصفحة ثم أعد الاختبار لتعزيز معرفتك.";
}
function restart(){
 index=0;score=0;document.querySelector("#quizApp .quiz-topline").hidden=false;document.querySelector("#quizApp .quiz-progress").hidden=false;
 qText.hidden=false;options.hidden=false;document.querySelector("#quizApp .quiz-actions").hidden=false;result.hidden=true;showQuestion();
}
next.addEventListener("click",()=>{if(!answered)return;if(index<9){index++;showQuestion()}else finish()});
document.getElementById("restartQuiz").addEventListener("click",restart);document.getElementById("tryAgain").addEventListener("click",restart);
showQuestion();
