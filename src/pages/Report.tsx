// JOURNEYFX WORKSPACE | Management Report V1.0
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, FileText, Printer, RotateCcw, ClipboardList, CheckCircle2, Clock3, AlertCircle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import toast from 'react-hot-toast';
import { DEMO_TASKS, DEMO_PROJECTS, TEAM_MEMBERS, getMember, getJakartaDate, formatDate, isOverdue, getDisplayStatus, getStatusClass, getProjectProgress } from './Dashboard';
import type { Task } from './Dashboard';
import { useWorkspaceTasks } from '../services/taskStore';

const STATUSES = ['Pending', 'In Progress', 'In Review', 'Completed', 'Overdue', 'Cancelled'];
const HEADERS = ['Task ID', 'Task Name', 'Project', 'PIC', 'Deadline (WIB)', 'Priority', 'Status', 'Progress (%)'];
const PIC_HEADERS = ['PIC', 'Division', 'Total', 'Completed', 'Active', 'Overdue', 'Completion (%)'];
const PROJECT_HEADERS = ['Project', 'Total', 'Completed', 'Active', 'Overdue', 'Progress (%)'];

function summarize(tasks: Task[]) {
  const valid = tasks.filter(t => t.status !== 'Cancelled');
  const total = valid.length;
  const completed = valid.filter(t => t.status === 'Completed').length;
  const overdue = valid.filter(isOverdue).length;
  const active = total - completed - overdue;
  return { total, completed, overdue, active, cancelled: tasks.length - total, rate: total ? Math.round(completed / total * 100) : 0 };
}

function projectName(id: string) {
  return DEMO_PROJECTS.find(p => p.id === id)?.name ?? id;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Progress({ value }: { value: number }) {
  return <div className="min-w-[90px]">
    <div className="mb-1 text-xs numeric-value">{value}%</div>
    <div className="progress-track" role="progressbar" aria-label="Progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}>
      <div className={`progress-fill ${value === 100 ? 'completed' : ''}`} style={{ width: `${value}%` }} />
    </div>
  </div>;
}

export default function Report() {
  const tasks = useWorkspaceTasks(DEMO_TASKS);
  const [pic, setPic] = useState('all');
  const [project, setProject] = useState('all');
  const [status, setStatus] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [busy, setBusy] = useState<'excel' | 'pdf' | null>(null);
  const invalidRange = Boolean(from && to && from > to);
  const filtered = invalidRange ? [] : tasks.filter(t =>
    (pic === 'all' || t.picId === pic) &&
    (project === 'all' || t.projectId === project) &&
    (status === 'all' || getDisplayStatus(t) === status) &&
    (!from || t.deadline >= from) && (!to || t.deadline <= to)
  );
  const kpi = summarize(filtered);
  const picRows = TEAM_MEMBERS.filter(m => pic === 'all' || m.id === pic).map(m => ({
    name: m.name, division: m.division, ...summarize(filtered.filter(t => t.picId === m.id)),
  }));
  const projectRows = DEMO_PROJECTS.filter(p => project === 'all' || p.id === project).map(p => ({
    name: p.name, ...summarize(filtered.filter(t => t.projectId === p.id)), progress: getProjectProgress(p.id, filtered),
  }));
  const overdue = filtered.filter(isOverdue).sort((a, b) => a.deadline.localeCompare(b.deadline));
  const distribution = STATUSES.map(name => ({ name, count: filtered.filter(t => getDisplayStatus(t) === name).length }));
  const filterLabel = `PIC: ${pic === 'all' ? 'All' : getMember(pic)?.name ?? pic} | Project: ${project === 'all' ? 'All' : projectName(project)} | Status: ${status} | Deadline: ${from || 'All'} - ${to || 'All'}`;
  const summaryRows: (string | number)[][] = [
    ['Report', 'JourneyFX Workspace - Management Report'], ['Mode', 'Local demonstration data'], ['Generated (WIB)', getJakartaDate()], ['Filter', filterLabel],
    ['Total (excluding cancelled)', kpi.total], ['Completed', kpi.completed], ['Active (not overdue)', kpi.active], ['Overdue', kpi.overdue], ['Cancelled', kpi.cancelled], ['Completion (%)', kpi.total ? kpi.rate : 'N/A'],
  ];
  const taskRows = filtered.map(t => [t.id, t.title, projectName(t.projectId), getMember(t.picId)?.name ?? t.picId, t.deadline, t.priority, getDisplayStatus(t), t.progress]);
  const picExportRows = picRows.map(p => [p.name, p.division, p.total, p.completed, p.active, p.overdue, p.total ? p.rate : 'N/A']);
  const projectExportRows = projectRows.map(p => [p.name, p.total, p.completed, p.active, p.overdue, p.total ? p.progress : 'N/A']);

  function resetFilters() { setPic('all'); setProject('all'); setStatus('all'); setFrom(''); setTo(''); }

  async function exportExcel() {
    if (busy || invalidRange || !filtered.length) return;
    setBusy('excel');
    try {
      const { default: ExcelJS } = await import('exceljs');
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'JourneyFX Workspace';
      function addSheet(name: string, headers: string[], rows: (string | number)[][], widths: number[]) {
        const sheet = workbook.addWorksheet(name, { views: [{ state: 'frozen', ySplit: 1 }] });
        sheet.addRow(headers);
        rows.forEach(row => sheet.addRow(row));
        widths.forEach((width, i) => { sheet.getColumn(i + 1).width = width; });
        const header = sheet.getRow(1);
        header.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        header.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF20252C' } };
        sheet.eachRow(row => { row.alignment = { vertical: 'middle', wrapText: true }; });
        sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: Math.max(1, rows.length + 1), column: headers.length } };
      }
      addSheet('Summary', ['Metric', 'Value'], summaryRows, [32, 85]);
      addSheet('Tasks', HEADERS, taskRows, [42, 48, 35, 20, 20, 15, 18, 18]);
      addSheet('PIC Performance', PIC_HEADERS, picExportRows, [22, 35, 12, 15, 12, 12, 20]);
      addSheet('Project Performance', PROJECT_HEADERS, projectExportRows, [40, 12, 15, 12, 12, 20]);
      addSheet('Task Distribution', ['Status', 'Count'], distribution.map(d => [d.name, d.count]), [25, 15]);
      const buffer = await workbook.xlsx.writeBuffer();
      downloadBlob(new Blob([new Uint8Array(buffer)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `JourneyFX-Report-${getJakartaDate()}.xlsx`);
      toast.success('File Excel berhasil dibuat.');
    } catch { toast.error('Gagal membuat laporan Excel.'); }
    finally { setBusy(null); }
  }

  async function exportPdf() {
    if (busy || invalidRange || !filtered.length) return;
    setBusy('pdf');
    try {
      const { jsPDF } = await import('jspdf');
      const { autoTable } = await import('jspdf-autotable');
      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      doc.setFontSize(19); doc.text('JourneyFX Workspace | Management Report', 14, 18);
      doc.setFontSize(10); doc.text('Local demonstration data | ' + getJakartaDate() + ' WIB', 14, 26);
      const lines: string[] = doc.splitTextToSize(filterLabel, 265);
      doc.text(lines, 14, 33);
      const common = { theme: 'grid' as const, margin: { top: 14, right: 14, bottom: 16, left: 14 }, styles: { fontSize: 8, overflow: 'linebreak' as const }, headStyles: { fillColor: '#20252C' } };
      autoTable(doc, { ...common, startY: 38 + lines.length * 4, head: [['Metric', 'Value']], body: summaryRows.slice(4) });
      doc.addPage(); doc.setFontSize(15); doc.text('PIC Performance', 14, 12);
      autoTable(doc, { ...common, startY: 18, head: [PIC_HEADERS], body: picExportRows });
      doc.addPage(); doc.text('Project Performance', 14, 12);
      autoTable(doc, { ...common, startY: 18, head: [PROJECT_HEADERS], body: projectExportRows });
      doc.addPage(); doc.text('Task Details', 14, 12);
      autoTable(doc, { ...common, startY: 18, head: [HEADERS], body: taskRows, columnStyles: { 0: { cellWidth: 35 }, 1: { cellWidth: 62 } } });
      const pages = doc.getNumberOfPages();
      for (let i = 1; i <= pages; i++) { doc.setPage(i); doc.setFontSize(9); doc.text(`JourneyFX Workspace | Demo | ${i}/${pages}`, 14, 201); }
      doc.save(`JourneyFX-Report-${getJakartaDate()}.pdf`);
      toast.success('File PDF berhasil dibuat.');
    } catch { toast.error('Gagal membuat laporan PDF.'); }
    finally { setBusy(null); }
  }

  return <div className="workspace-container section-stack">
    <div className="page-header">
      <div><p className="eyebrow mb-2">Performance & Evaluation</p><h2 className="page-title">Management Report</h2><p className="page-description">Evaluasi operasional, penyelesaian tugas, dan progres proyek JourneyFX.</p></div>
      <div className="page-actions no-print">
        <button type="button" className="btn-secondary" disabled={!!busy || invalidRange || !filtered.length} onClick={exportExcel}><Download size={16}/>{busy === 'excel' ? 'Exporting...' : 'Excel'}</button>
        <button type="button" className="btn-primary" disabled={!!busy || invalidRange || !filtered.length} onClick={exportPdf}><FileText size={16}/>{busy === 'pdf' ? 'Exporting...' : 'PDF'}</button>
        <button type="button" className="btn-secondary" disabled={invalidRange || !filtered.length} onClick={() => window.print()}><Printer size={16}/> Print</button>
      </div>
    </div>
    <section className="workspace-card no-print">
      <div className="panel-header"><div><h3 className="section-title">Report Filters</h3><p className="section-description">Periode berdasarkan deadline tugas (WIB).</p></div><button type="button" className="btn-ghost" onClick={resetFilters}><RotateCcw size={14}/> Reset</button></div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <label className="form-group"><span className="form-label">PIC</span><select className="workspace-select" value={pic} onChange={e => setPic(e.target.value)}><option value="all">All PIC</option>{TEAM_MEMBERS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select></label>
        <label className="form-group"><span className="form-label">Project</span><select className="workspace-select" value={project} onChange={e => setProject(e.target.value)}><option value="all">All Projects</option>{DEMO_PROJECTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
        <label className="form-group"><span className="form-label">Status</span><select className="workspace-select" value={status} onChange={e => setStatus(e.target.value)}><option value="all">All Status</option>{STATUSES.map(s => <option key={s}>{s}</option>)}</select></label>
        <label className="form-group"><span className="form-label">Deadline From</span><input className="workspace-input" type="date" value={from} onChange={e => setFrom(e.target.value)}/></label>
        <label className="form-group"><span className="form-label">Deadline To</span><input className="workspace-input" type="date" value={to} onChange={e => setTo(e.target.value)}/></label>
      </div>
      {invalidRange && <p role="alert" className="form-error mt-3">Tanggal akhir harus sama dengan atau setelah tanggal awal.</p>}
    </section>
    <p className="text-xs text-workspace-muted">Local demonstration data · {filtered.length} dari {tasks.length} tugas · {filterLabel}</p>
    {!invalidRange && <>
      <section className="dashboard-grid">
        {[{label:'Total Tasks',value:kpi.total,icon:ClipboardList,color:'#D1D5DB'},{label:'Completed',value:kpi.completed,icon:CheckCircle2,color:'#34D399'},{label:'Active Tasks',value:kpi.active,icon:Clock3,color:'#60A5FA'},{label:'Overdue',value:kpi.overdue,icon:AlertCircle,color:'#F87171'}].map(item => <div className="stat-card" key={item.label}><div className="flex items-center justify-between gap-2"><span className="stat-label">{item.label}</span><item.icon size={20} color={item.color}/></div><div className="stat-value" style={{color:item.color}}>{item.value}</div></div>)}
      </section>
      <section className="content-grid">
        <div className="workspace-card"><h3 className="section-title">Task Completion</h3><p className="stat-value">{kpi.total ? `${kpi.rate}%` : 'N/A'}</p><p className="section-description mb-4">{kpi.completed} dari {kpi.total} tugas selesai. {kpi.cancelled} dibatalkan (di luar KPI).</p><Progress value={kpi.rate}/></div>
        <div className="workspace-card"><h3 className="section-title">Task Distribution</h3><div className="space-y-3 mt-4">{distribution.map(d => <div key={d.name} className="flex items-center justify-between gap-3"><span className={`status-badge ${getStatusClass(d.name)}`}>{d.name}</span><span className="numeric-value">{d.count}</span></div>)}</div></div>
      </section>
      {!filtered.length ? <section className="workspace-card empty-state"><h3 className="empty-state-title">No report data</h3><p className="empty-state-description">Ubah filter untuk menampilkan pekerjaan.</p></section> : <>
        <section className="workspace-card"><h3 className="section-title">PIC Performance Chart</h3><p className="section-description">Distribusi tugas per PIC (bukan profit trading).</p><div className="chart-container h-[300px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={picRows}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="name"/><YAxis allowDecimals={false}/><Tooltip/><Legend/><Bar dataKey="completed" name="Completed" fill="#34D399" isAnimationActive={false}/><Bar dataKey="active" name="Active" fill="#60A5FA" isAnimationActive={false}/><Bar dataKey="overdue" name="Overdue" fill="#F87171" isAnimationActive={false}/></BarChart></ResponsiveContainer></div></section>
        <section className="workspace-card"><div className="panel-header"><h3 className="section-title">PIC Performance</h3></div><div className="table-container"><table className="management-table"><thead><tr>{PIC_HEADERS.map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{picRows.map(p => <tr key={p.name}><td>{p.name}</td><td>{p.division}</td><td>{p.total}</td><td>{p.completed}</td><td>{p.active}</td><td>{p.overdue}</td><td>{p.total ? <Progress value={p.rate}/> : 'N/A'}</td></tr>)}</tbody></table></div></section>
        <section className="workspace-card"><div className="panel-header"><h3 className="section-title">Project Performance</h3></div><div className="table-container"><table className="management-table"><thead><tr>{PROJECT_HEADERS.map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{projectRows.map(p => <tr key={p.name}><td>{p.name}</td><td>{p.total}</td><td>{p.completed}</td><td>{p.active}</td><td>{p.overdue}</td><td>{p.total ? <Progress value={p.progress}/> : 'N/A'}</td></tr>)}</tbody></table></div></section>
        <section className="workspace-card"><div className="panel-header"><h3 className="section-title">Overdue Analysis ({overdue.length})</h3><Link to="/jobs-project" className="btn-ghost no-print">Manage Tasks</Link></div>{!overdue.length ? <p className="text-workspace-muted">Tidak ada tugas terlambat pada filter ini.</p> : <div className="space-y-3">{overdue.map(t => <div className="project-card" key={t.id}><div className="flex flex-wrap justify-between gap-2"><div><p className="font-semibold break-words">{t.title}</p><p className="text-xs text-workspace-muted">{getMember(t.picId)?.name ?? t.picId} · {formatDate(t.deadline)}</p></div><span className="status-badge status-overdue">Overdue</span></div><div className="mt-3"><Progress value={t.progress}/></div></div>)}</div>}</section>
        <section className="workspace-card"><div className="panel-header"><h3 className="section-title">Task Details</h3></div><div className="table-container"><table className="management-table"><thead><tr>{HEADERS.map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{filtered.map(t => <tr key={t.id}><td className="break-all">{t.id}</td><td>{t.title}</td><td>{projectName(t.projectId)}</td><td>{getMember(t.picId)?.name ?? t.picId}</td><td>{formatDate(t.deadline)}</td><td><span className={`priority-badge priority-${t.priority.toLowerCase()}`}>{t.priority}</span></td><td><span className={`status-badge ${getStatusClass(getDisplayStatus(t))}`}>{getDisplayStatus(t)}</span></td><td><Progress value={t.progress}/></td></tr>)}</tbody></table></div></section>
      </>}
    </>}
    <p className="text-xs text-workspace-muted">JourneyFX Workspace V1.0 · Completion = completed / total non-cancelled. Project progress = rata-rata progres tugas non-cancelled dalam filter. Data bersifat simulasi.</p>
  </div>;
}
