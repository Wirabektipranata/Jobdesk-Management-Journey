export const statuses = ['Pending','In Progress','In Review','Completed','Cancelled'] as const;
export const priorities = ['Urgent','High','Medium','Low'] as const;
export type Status = typeof statuses[number];
export type Priority = typeof priorities[number];
export type Role = 'super_admin' | 'management' | 'pic';
export type Profile = {id:string;full_name:string;role:Role;is_active:boolean};
export type Member = {id:string;user_id:string|null;name:string;initials:string;division:string;organization_role:string|null;jobdesk:string[];education_responsibility:string;is_active:boolean};
export type Project = {id:string;name:string;pic_id:string;description:string;is_active:boolean};
export type TaskDraft = {title:string;project_id:string;pic_id:string;deadline:string;priority:Priority;status:Status;progress:number};
export type Task = TaskDraft & {id:string;created_at:string;updated_at:string;completed_at:string|null};
export type AgendaDraft = {title:string;date:string;time:string;location:string;pic_id:string|null};
export type Agenda = AgendaDraft & {id:string;updated_at:string};
export type Notification = {id:string;title:string;message:string;read_at:string|null;created_at:string};
export type Audit = {id:string;actor_id:string|null;table_name:string;record_id:string;action:string;created_at:string};
export type TaskUpdate = {id:string;old_status:string|null;new_status:string;old_progress:number|null;new_progress:number;created_at:string};
export type Comment = {id:string;author_id:string;body:string;created_at:string};
export type Workspace = {members:Member[];projects:Project[];tasks:Task[];agendas:Agenda[];notifications:Notification[];audit:Audit[]};
export const emptyWorkspace = ():Workspace => ({members:[],projects:[],tasks:[],agendas:[],notifications:[],audit:[]});
export const isManager = (role:Role) => role === 'super_admin' || role === 'management';
export const validRole = (role:unknown):role is Role => role==='super_admin'||role==='management'||role==='pic';
export function todayWib(date = new Date()):string { const parts = new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Jakarta',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date); const val=(k:string)=>parts.find(p=>p.type===k)?.value; return `${val('year')}-${val('month')}-${val('day')}`; }
export function dateTime(value:string) { return new Intl.DateTimeFormat('id-ID',{dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Jakarta'}).format(new Date(value)); }
export function validDate(s:string):boolean { if(!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;const d=new Date(s+'T00:00:00Z');return !Number.isNaN(d.valueOf())&&d.toISOString().slice(0,10)===s; }
export const closed = (t:Pick<Task,'status'>) => t.status==='Completed'||t.status==='Cancelled';
export const overdue = (t:Pick<Task,'status'|'deadline'>,day=todayWib()) => !closed(t)&&t.deadline<day;
export function metrics(tasks:Task[],day=todayWib()){const completed=tasks.filter(t=>t.status==='Completed').length;const late=tasks.filter(t=>overdue(t,day)).length;const cancelled=tasks.filter(t=>t.status==='Cancelled').length;const active=tasks.length-completed-late-cancelled;const denominator=tasks.length-cancelled;return {total:tasks.length,completed,late,active,cancelled,review:tasks.filter(t=>t.status==='In Review').length,rate:denominator?Math.round(completed/denominator*100):0};}
export function averageProgress(tasks:Task[]){const eligible=tasks.filter(t=>t.status!=='Cancelled');return eligible.length?Math.round(eligible.reduce((a,t)=>a+t.progress,0)/eligible.length):0;}
export function normalizeProgress(status:Status,progress:number){if(status==='Completed')return 100;if(status==='Pending')return 0;return Math.max(0,Math.min(status==='Cancelled'?100:99,Math.round(progress||0)));}
export function validateProgress(status:Status,progress:number){if(!statuses.includes(status)||!Number.isInteger(progress)||progress<0||progress>100)throw new Error('Status atau progres tidak valid.');if(normalizeProgress(status,progress)!==progress)throw new Error('Progres tidak sesuai status.');}
export function validateTask(d:TaskDraft){if(!d.title.trim()||d.title.trim().length>200||!d.project_id||!d.pic_id||!validDate(d.deadline)||!priorities.includes(d.priority))throw new Error('Lengkapi judul, PIC, proyek, prioritas dan deadline yang valid.');validateProgress(d.status,d.progress);return {...d,title:d.title.trim()};}
export function picPatch(original:Task, role:Role,status:Status,progress:number){if(role!=='pic'||closed(original)||!['In Progress','In Review'].includes(status))throw new Error('PIC hanya dapat memperbarui progres tugas terbuka atau mengirim review.');validateProgress(status,progress);return {status,progress};}
export type Filters={search:string;pic:string;project:string;status:string;from:string;to:string};
export const initialFilters:Filters={search:'',pic:'',project:'',status:'',from:'',to:''};
export function filterTasks(tasks:Task[],f:Filters,day=todayWib()){return tasks.filter(t=>(!f.search||`${t.title} ${t.id}`.toLowerCase().includes(f.search.toLowerCase().trim()))&&(!f.pic||t.pic_id===f.pic)&&(!f.project||t.project_id===f.project)&&(!f.status||(f.status==='Overdue'?overdue(t,day):t.status===f.status))&&(!f.from||t.deadline>=f.from)&&(!f.to||t.deadline<=f.to));}
export function monthGrid(month:string){const [y,m]=month.split('-').map(Number);const first=new Date(Date.UTC(y,m-1,1));const offset=(first.getUTCDay()+6)%7;return Array.from({length:42},(_,i)=>new Date(Date.UTC(y,m-1,1-offset+i)).toISOString().slice(0,10));}
export function shiftMonth(month:string,delta:number){const [y,m]=month.split('-').map(Number);return new Date(Date.UTC(y,m-1+delta,1)).toISOString().slice(0,7);}
export function validateAgenda(d:AgendaDraft){if(!d.title.trim()||d.title.trim().length>200||!validDate(d.date)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(d.time))throw new Error('Judul, tanggal atau jam agenda tidak valid.');return {...d,title:d.title.trim(),location:d.location.trim()};}
export function errorMessage(e:unknown){return e instanceof Error?e.message:typeof e==='object'&&e&&'message' in e?String(e.message):'Operasi gagal. Silakan coba kembali.';}
