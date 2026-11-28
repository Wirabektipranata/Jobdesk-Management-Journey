import { requireSupabase } from './supabase';
import { isManager,validateTask,validateAgenda,picPatch } from './domain';
import type {Profile,Member,Project,Task,Agenda,Notification,Audit,Workspace,TaskDraft,AgendaDraft,TaskUpdate,Comment} from './domain';
// Deterministic paging below the default PostgREST row limit. No Local Storage data cache.
async function all<T>(table:string,columns:string,match?:{key:string;value:string}):Promise<T[]>{
  const out:T[]=[];const size=200;const client=requireSupabase();
  for(let start=0;;start+=size){let q=client.from(table).select(columns).order('id',{ascending:true});if(match)q=q.eq(match.key,match.value);const {data,error}=await q.range(start,start+size-1);if(error)throw error;const batch=(data??[]) as unknown as T[];out.push(...batch);if(batch.length<size)return out;}
}
export async function getProfile(id:string):Promise<Profile|null>{const {data,error}=await requireSupabase().from('profiles').select('id,full_name,role,is_active').eq('id',id).maybeSingle();if(error)throw error;return data as Profile|null;}
export const memberColumns='id,user_id,name,initials,division,organization_role,jobdesk,education_responsibility,is_active';
export const taskColumns='id,title,project_id,pic_id,deadline,priority,status,progress,created_at,updated_at,completed_at';
export async function getWorkspace(profile:Profile):Promise<Workspace>{
  const [members,projects,tasks,agendas,notifications,audit]=await Promise.all([
    all<Member>('team_members',memberColumns),all<Project>('projects','id,name,pic_id,description,is_active'),all<Task>('tasks',taskColumns),all<Agenda>('agendas','id,title,date,time,location,pic_id,updated_at'),
    import.meta.env.VITE_ENABLE_NOTIFICATIONS==='false'?Promise.resolve([]):all<Notification>('notifications','id,title,message,read_at,created_at'),
    isManager(profile.role)?all<Audit>('activity_logs','id,actor_id,table_name,record_id,action,created_at'):Promise.resolve([])]);
  return {members,projects,tasks,agendas,notifications:notifications.sort((a,b)=>b.created_at.localeCompare(a.created_at)),audit:audit.sort((a,b)=>b.created_at.localeCompare(a.created_at))};
}
export async function saveTask(profile:Profile,d:TaskDraft,old?:Task){
  const client=requireSupabase();
  if(!isManager(profile.role)){if(!old)throw new Error('Tidak berwenang membuat tugas.');const {data,error}=await client.from('tasks').update(picPatch(old,profile.role,d.status,d.progress)).eq('id',old.id).eq('updated_at',old.updated_at).select('id').maybeSingle();if(error)throw error;if(!data)throw new Error('Tugas berubah atau akses ditolak. Muat ulang data.');return;}
  const payload=validateTask(d);const result=old?await client.from('tasks').update(payload).eq('id',old.id).eq('updated_at',old.updated_at).select('id').maybeSingle():await client.from('tasks').insert(payload).select('id').single();if(result.error)throw result.error;if(!result.data)throw new Error('Tugas berubah atau akses ditolak. Muat ulang data.');
}
export async function removeTask(profile:Profile,t:Task){if(!isManager(profile.role))throw new Error('Akses ditolak.');const {data,error}=await requireSupabase().from('tasks').delete().eq('id',t.id).eq('updated_at',t.updated_at).select('id').maybeSingle();if(error)throw error;if(!data)throw new Error('Tugas berubah atau akses ditolak.');}
export async function saveAgenda(profile:Profile,d:AgendaDraft,old?:Agenda){if(!isManager(profile.role))throw new Error('Akses ditolak.');const c=requireSupabase();const payload=validateAgenda(d);const r=old?await c.from('agendas').update(payload).eq('id',old.id).eq('updated_at',old.updated_at).select('id').maybeSingle():await c.from('agendas').insert(payload).select('id').single();if(r.error)throw r.error;if(!r.data)throw new Error('Agenda berubah atau akses ditolak.');}
export async function removeAgenda(profile:Profile,a:Agenda){if(!isManager(profile.role))throw new Error('Akses ditolak.');const {data,error}=await requireSupabase().from('agendas').delete().eq('id',a.id).eq('updated_at',a.updated_at).select('id').maybeSingle();if(error)throw error;if(!data)throw new Error('Agenda berubah atau akses ditolak.');}
export async function markRead(id:string){const {data,error}=await requireSupabase().from('notifications').update({read_at:new Date().toISOString()}).eq('id',id).select('id').maybeSingle();if(error)throw error;if(!data)throw new Error('Notifikasi tidak tersedia.');}
export async function getTaskDetail(id:string){const [updates,comments]=await Promise.all([all<TaskUpdate>('task_updates','id,old_status,new_status,old_progress,new_progress,created_at',{key:'task_id',value:id}),all<Comment>('task_comments','id,author_id,body,created_at',{key:'task_id',value:id})]);return {updates:updates.sort((a,b)=>b.created_at.localeCompare(a.created_at)),comments:comments.sort((a,b)=>a.created_at.localeCompare(b.created_at))};}
export async function addComment(id:string,body:string){if(!body.trim()||body.trim().length>3000)throw new Error('Komentar harus 1–3000 karakter.');const {error}=await requireSupabase().from('task_comments').insert({task_id:id,body:body.trim()});if(error)throw error;}
